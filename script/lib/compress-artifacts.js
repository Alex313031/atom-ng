'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawnSync = require('./spawn-sync');
const { path7za } = require('7zip-bin');

const CONFIG = require('../config');

require('colors');

module.exports = function(packagedAppPath) {
  const appArchivePath = path.join(CONFIG.buildOutputPath, getArchiveName());
  console.log(`Copying portable user data dir into "${packagedAppPath}"`);
  fs.copySync(
    path.join(CONFIG.repositoryRootPath, 'portable', 'user_data_dir'),
    path.join(packagedAppPath)
  );
  compress(packagedAppPath, appArchivePath);

  if (process.platform === 'darwin') {
    const symbolsArchivePath = path.join(
      CONFIG.buildOutputPath,
      'Atom-ng_${CONFIG.appMetadata.version}_mac_symbols.zip'
    );
    compress(CONFIG.symbolsPath, symbolsArchivePath);
  }
};

function getArchiveName() {
  switch (process.platform) {
    case 'darwin':
      return 'Atom-ng_${CONFIG.appMetadata.version}_mac.zip';
    case 'win32':
      return `Atom-ng_${CONFIG.appMetadata.version}_win_${process.arch === 'x64' ? 'x64' : ''}.zip`;
    default:
      return `Atom-ng_${CONFIG.appMetadata.version}_${getLinuxArchiveArch()}.tar.gz`;
  }
}

function getLinuxArchiveArch() {
  switch (process.arch) {
    case 'ia32':
      return 'i386';
    case 'x64':
      return 'amd64';
    default:
      return process.arch;
  }
}

function compress(inputDirPath, outputArchivePath) {
  if (fs.existsSync(outputArchivePath)) {
    console.log(`Note: Deleting "${outputArchivePath}"`);
    fs.removeSync(outputArchivePath);
  }

  console.log(`Compressing "${inputDirPath}" to ` + `"${outputArchivePath}"`.green);
  let compressCommand, compressArguments;
  if (process.platform === 'darwin') {
    compressCommand = 'zip';
    compressArguments = ['-r', '--symlinks'];
  } else if (process.platform === 'win32') {
    compressCommand = path7za;
    compressArguments = ['a', '-r'];
  } else {
    compressCommand = 'tar';
    compressArguments = ['caf'];
  }
  compressArguments.push(outputArchivePath, path.basename(inputDirPath));
  spawnSync(compressCommand, compressArguments, {
    cwd: path.dirname(inputDirPath),
    maxBuffer: 2024 * 2024
  });
}
