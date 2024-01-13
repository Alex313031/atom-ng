'use strict';

// This module exports a function that copies all the static assets into the
// appropriate location in the build output directory.

const path = require('path');
const fs = require('fs-extra');
const CONFIG = require('../config');
const glob = require('glob');
const includePathInPackagedApp = require('./include-path-in-packaged-app');

const fingerPath = path.join(
  CONFIG.repositoryRootPath,
  'node_modules',
  '.dependencies-fingerprint'
);
const fingerTxt = path.join(CONFIG.buildOutputPath, 'fingerprint.txt');

module.exports = function() {

  console.log(`Copying .dependencies-fingerprint to ${fingerTxt}...`);
  fs.copySync(fingerPath, fingerTxt);

  console.log(`Copying assets to ${CONFIG.intermediateAppPath}...`);
  let srcPaths = [
    path.join(CONFIG.repositoryRootPath, 'benchmarks', 'benchmark-runner.js'),
    path.join(CONFIG.repositoryRootPath, 'dot-atom'),
    path.join(CONFIG.repositoryRootPath, 'exports'),
    path.join(CONFIG.repositoryRootPath, 'package.json'),
    path.join(CONFIG.repositoryRootPath, 'static'),
    path.join(CONFIG.repositoryRootPath, 'src'),
    path.join(CONFIG.repositoryRootPath, 'vendor')
  ];
  srcPaths = srcPaths.concat(
    glob.sync(path.join(CONFIG.repositoryRootPath, 'spec', '*.*'), {
      ignore: path.join('**', '*-spec.*')
    })
  );
  for (let srcPath of srcPaths) {
    fs.copySync(srcPath, computeDestinationPath(srcPath), {
      filter: includePathInPackagedApp
    });
  }

  // Run a copy pass to dereference symlinked directories under node_modules.
  // We do this to ensure that symlinked repo-local bundled packages get
  // copied to the output folder correctly.  We dereference only the top-level
  // symlinks and not nested symlinks to avoid issues where symlinked binaries
  // are duplicated in Atom's installation packages (see atom/atom#18490).
  const nodeModulesPath = path.join(CONFIG.repositoryRootPath, 'node_modules');
  glob
    .sync(path.join(nodeModulesPath, '*'))
    .map(p =>
      fs.lstatSync(p).isSymbolicLink()
        ? path.resolve(nodeModulesPath, fs.readlinkSync(p))
        : p
    )
    .forEach(modulePath => {
      const destPath = path.join(
        CONFIG.intermediateAppPath,
        'node_modules',
        path.basename(modulePath)
      );
      fs.copySync(modulePath, destPath, { filter: includePathInPackagedApp });
    });

  fs.copySync(
    path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'app-icons',
      CONFIG.channel,
      'png',
      '64.png'
    ),
    path.join(CONFIG.intermediateAppPath, 'resources', 'atom-ng.png')
  );
  fs.copySync(
    path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'app-icons',
      CONFIG.channel,
      'png',
      '256.png'
    ),
    path.join(CONFIG.intermediateAppPath, 'resources', 'atom-ng-pixmap.png')
  );
};

function computeDestinationPath(srcPath) {
  const relativePath = path.relative(CONFIG.repositoryRootPath, srcPath);
  return path.join(CONFIG.intermediateAppPath, relativePath);
}
