'use strict';

const electronInstaller = require('@atom/electron-winstaller');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const CONFIG = require('../config');

require('colors');

module.exports = packagedAppPath => {
  const archSuffix = process.arch === 'ia32' ? '' : '-' + process.arch;
  const updateUrlPrefix =
    process.env.ATOM_UPDATE_URL_PREFIX || 'https://github.com/Alex313031/atom-ng';
  const options = {
    name: CONFIG.channelName,
    title: CONFIG.appName,
    exe: CONFIG.executableName,
    appDirectory: packagedAppPath,
    authors: 'Alex313031 & GitHub Inc.',
    owners: 'Alex313031',
    description: 'Atom-ng Installer',
    iconUrl: `https://raw.githubusercontent.com/Alex313031/atom-ng/master/resources/app-icons/${CONFIG.channel}/atom.ico`,
    loadingGif: path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'win',
      'loading.gif'
    ),
    outputDirectory: CONFIG.buildOutputPath,
    noMsi: true,
    // Don't try to use RELEASES file or enable delta updates
    noDelta: true,
    // Set setup executable name
    setupExe: `Atom-ng_${CONFIG.appMetadata.version}_Setup_${process.arch === 'x64' ? 'x64' : 'x32'}.exe`,
    setupIcon: path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'app-icons',
      CONFIG.channel,
      'atom.ico'
    )
  };

  const cleanUp = () => {
    const releasesPath = `${CONFIG.buildOutputPath}/RELEASES`;
    if (process.arch === 'x64' && fs.existsSync(releasesPath)) {
      fs.renameSync(releasesPath, `${releasesPath}-x64`);
    }

    let appName =
      CONFIG.channel === 'stable' ? 'atom-ng' : `atom-ng-${CONFIG.channel}`;
    for (let nupkgPath of glob.sync(
      `${CONFIG.buildOutputPath}/${appName}-*.nupkg`
    )) {
      if (!nupkgPath.includes(CONFIG.computedAppVersion)) {
        console.log(
          `Note: Deleting downloaded nupkg for previous version at ${nupkgPath} to prevent it from being stored as an artifact`
        );
        fs.unlinkSync(nupkgPath);
      } else {
        if (process.arch === 'x64') {
          // Use the original .nupkg filename to generate the `atom-x64` name by inserting `-x64` after `atom`
          const newNupkgPath = nupkgPath.replace(
            `${appName}-`,
            `${appName}-x64-`
          );
          fs.renameSync(nupkgPath, newNupkgPath);
        }
      }
    }

    return `${CONFIG.buildOutputPath}/${options.setupExe}`;
  };

  console.log(`Creating Windows Installer for ${packagedAppPath}`);
  return electronInstaller
    .createWindowsInstaller(options)
    .then(cleanUp, error => {
      cleanUp();
      return Promise.reject(error);
    });
};
