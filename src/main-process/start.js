const { app } = require('electron');
const nslog = require('nslog');
const path = require('path');
const temp = require('temp');
const parseCommandLine = require('./parse-command-line');
const getReleaseChannel = require('../get-release-channel');
const atomPaths = require('../atom-paths');
const fs = require('fs');
const CSON = require('season');
const Config = require('../config');
const StartupTime = require('../startup-time');

StartupTime.setStartTime();

module.exports = function start(resourcePath, devResourcePath, startTime) {
  global.shellStartTime = startTime;
  StartupTime.addMarker('main-process:start');

  process.on('uncaughtException', function(error = {}) {
    if (error.message != null) {
      console.log(error.message);
    }

    if (error.stack != null) {
      console.log(error.stack);
    }
  });

  process.on('unhandledRejection', function(error = {}) {
    if (error.message != null) {
      console.log(error.message);
    }

    if (error.stack != null) {
      console.log(error.stack);
    }
  });

  // Enable sandbox opportunistically
  // app.enableSandbox()

  // TodoElectronIssue this should be set to true before Electron 12 - https://github.com/electron/electron/issues/18397
  // WontFix: Atom-ng still needs this when using Electron 12.2.3
  app.allowRendererProcessReuse = false;

  if (process.env.NODE_ENV === 'development') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false;
  } else {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
  }

  // Electron 12 devtools doesn't open without disabling the Chromium sandbox
  app.commandLine.appendSwitch('no-sandbox');
  // Electron <13 crashes without disabling the GPU sandbox
  // app.commandLine.appendSwitch('disable-gpu-sandbox');
  // Runs GPU threads in the main process
  // app.commandLine.appendSwitch('in-process-gpu');
  // Enable experimental web features
  app.commandLine.appendSwitch('enable-experimental-web-platform-features');
  // Including new Canvas2D APIs
  app.commandLine.appendSwitch('new-canvas-2d-api');
// The two following flags allow easier local web development
  // Allow file:// URIs to read other file:// URIs
  app.commandLine.appendSwitch('allow-file-access-from-files');
  // Enable local DOM to access all resources in a tree
  app.commandLine.appendSwitch('enable-local-file-accesses');
  // Enable QUIC for faster handshakes
  app.commandLine.appendSwitch('enable-quic');
  // Enable inspecting ALL layers
  app.commandLine.appendSwitch('enable-ui-devtools');
  // Force enable GPU acceleration
  app.commandLine.appendSwitch('ignore-gpu-blocklist');
  // Force enable GPU rasterization
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  // Enable OOP Rasterization for Canvas layers
  app.commandLine.appendSwitch('enable-features', 'CanvasOopRasterization');
  
  if (process.platform === 'linux') {
    // Use VAAPI on Linux
    app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');
  }

  // See: https://www.electronjs.org/docs/latest/tutorial/testing-widevine-cdm
  if (process.platform === 'linux') {
    // You have to pass the directory that contains the widevine library here, it is
    // * `libwidevinecdm.so` on Linux,
    // * `libwidevinecdm.dylib` on macOS,
    // * `widevinecdm.dll` on Windows.
    app.commandLine.appendSwitch('widevine-cdm-path', 'WidevineCdm/4.10.2557.0/_platform_specific/linux_x64/')
    // The version of plugin can be got from `chrome://components` page in Chromium.
    app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2557.0')
  }
  // See: https://www.electronjs.org/docs/latest/tutorial/testing-widevine-cdm#on-windows
  if (process.platform === 'win32') {
    // You have to pass the directory that contains the widevine library here, it is
    // * `libwidevinecdm.so` on Linux,
    // * `libwidevinecdm.dylib` on macOS,
    // * `widevinecdm.dll` on Windows.
    app.commandLine.appendSwitch('widevine-cdm-path', 'WidevineCdm/4.10.2557.0/_platform_specific/win_x64/')
    // The version of plugin can be got from `chrome://components` page in Chromium.
    app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2557.0')
  }

  // Export command line arguments
  const args = parseCommandLine(process.argv.slice(1));

  if (args.fpsCounter) {
    // Show a heads up display with FPS Counter and GPU Mem usage.
    app.commandLine.appendSwitch('show-fps-counter');
  }

  // This must happen after parseCommandLine() because yargs uses console.log
  // to display the usage message.
  const previousConsoleLog = console.log;
  console.log = nslog;

  args.resourcePath = normalizeDriveLetterName(resourcePath);
  args.devResourcePath = normalizeDriveLetterName(devResourcePath);

  atomPaths.setAtomHome(app.getPath('home'));
  atomPaths.setUserData(app);

  const config = getConfig();
  const colorProfile = config.get('core.colorProfile');
  if (colorProfile && colorProfile !== 'default') {
    app.commandLine.appendSwitch('force-color-profile', colorProfile);
  }

  if (handleStartupEventWithSquirrel()) {
    return;
  } else if (args.test && args.mainProcess) {
    app.setPath(
      'userData',
      temp.mkdirSync('atom-user-data-dir-for-main-process-tests')
    );
    console.log = previousConsoleLog;
    app.on('ready', function() {
      const testRunner = require(path.join(
        args.resourcePath,
        'spec/main-process/mocha-test-runner'
      ));
      testRunner(args.pathsToOpen);
    });
    return;
  }

  const releaseChannel = getReleaseChannel(app.getVersion());
  let appUserModelId = 'com.squirrel.atom.' + process.arch;

  // If the release channel is not stable, we append it to the app user model id.
  // This allows having the different release channels as separate items in the taskbar.
  if (releaseChannel !== 'stable') {
    appUserModelId += `-${releaseChannel}`;
  }

  // NB: This prevents Win10 from showing dupe items in the taskbar.
  app.setAppUserModelId(appUserModelId);

  function addPathToOpen(event, pathToOpen) {
    event.preventDefault();
    args.pathsToOpen.push(pathToOpen);
  }

  function addUrlToOpen(event, urlToOpen) {
    event.preventDefault();
    args.urlsToOpen.push(urlToOpen);
  }

  app.on('open-file', addPathToOpen);
  app.on('open-url', addUrlToOpen);

  if (args.userDataDir != null) {
    app.setPath('userData', args.userDataDir);
  } else if (args.test || args.benchmark || args.benchmarkTest) {
    app.setPath('userData', temp.mkdirSync('atom-test-data'));
  }

  StartupTime.addMarker('main-process:electron-onready:start');
  app.on('ready', function() {
    StartupTime.addMarker('main-process:electron-onready:end');
    app.removeListener('open-file', addPathToOpen);
    app.removeListener('open-url', addUrlToOpen);
    const AtomApplication = require(path.join(
      args.resourcePath,
      'src',
      'main-process',
      'atom-application'
    ));
    AtomApplication.open(args);
  });
};

function handleStartupEventWithSquirrel() {
  if (process.platform !== 'win32') {
    return false;
  }

  const SquirrelUpdate = require('./squirrel-update');
  const squirrelCommand = process.argv[1];
  return SquirrelUpdate.handleStartupEvent(squirrelCommand);
}

function getConfig() {
  const config = new Config();

  let configFilePath;
  if (fs.existsSync(path.join(process.env.ATOM_HOME, 'config.json'))) {
    configFilePath = path.join(process.env.ATOM_HOME, 'config.json');
  } else if (fs.existsSync(path.join(process.env.ATOM_HOME, 'config.cson'))) {
    configFilePath = path.join(process.env.ATOM_HOME, 'config.cson');
  }

  if (configFilePath) {
    const configFileData = CSON.readFileSync(configFilePath);
    config.resetUserSettings(configFileData);
  }

  return config;
}

function normalizeDriveLetterName(filePath) {
  if (process.platform === 'win32' && filePath) {
    return filePath.replace(
      /^([a-z]):/,
      ([driveLetter]) => driveLetter.toUpperCase() + ':'
    );
  } else {
    return filePath;
  }
}
