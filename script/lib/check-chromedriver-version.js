'use strict';

const buildMetadata = require('../package.json');
const semver = require('semver');
const chromedriverMetadataPath = require('electron-chromedriver/package.json');
const mksnapshotMetadataPath = require('electron-mksnapshot/package.json');

// The enviroment variable is usually set in install-script-dependencies.js
const majorElectronVersion = semver.major(
  process.env.ELECTRON_CUSTOM_VERSION ||
    require('../config').appMetadata.electronVersion
);

require('colors');

module.exports = function() {
  // Chromedriver should be at least v12.0.0
  // Mksnapshot should be at least v12.0.0
  const chromedriverVer = buildMetadata.dependencies['electron-chromedriver'];
  const mksnapshotVer = buildMetadata.dependencies['electron-mksnapshot'];
  const chromedriverActualVer = chromedriverMetadataPath.version;
  const mksnapshotActualVer = mksnapshotMetadataPath.version;

  // Always use caret on electron-chromedriver so that it can pick up the best minor/patch versions
  if (!chromedriverVer.startsWith('g')) {
    console.warn(
      `\n` + `Warning: `.red + `electron-chromedriver is not being downloaded from Alex313031's compiler optimized repo\n`.yellow + `Ensure electron-chromedriver version in script/package.json is >=12.0.0\n`.yellow
    );
  }

  if (!mksnapshotVer.startsWith('g')) {
    console.warn(
      `\n` + `Warning: `.red + `electron-mksnapshot is not being downloaded from Alex313031's compiler optimized repo\n`.yellow + `Ensure electron-mksnapshot version in script/package.json is >=12.0.0\n`.yellow
    );
  }

  if (!semver.satisfies(chromedriverActualVer, `>=${majorElectronVersion}`)) {
    throw new Error(
      `electron-chromedriver version should be at least v${majorElectronVersion}.0.0 to support the ELECTRON_CUSTOM_VERSION environment variable.`.red
    );
  }

  if (!semver.satisfies(mksnapshotActualVer, `>=${majorElectronVersion}`)) {
    throw new Error(
      `electron-mksnapshot version should be at least v${majorElectronVersion}.0.0 to support the ELECTRON_CUSTOM_VERSION environment variable.`.red
    );
  }
};
