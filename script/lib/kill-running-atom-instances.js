const childProcess = require('child_process');

const CONFIG = require('../config.js');

module.exports = function() {
  console.log(`Killing all running Atom-ng instances...`);
  if (process.platform === 'win32') {
    // Use START as a way to ignore error if Atom-ng.exe isnt running
    childProcess.execSync(`START taskkill /F /IM ${CONFIG.executableName}`);
  } else {
    childProcess.execSync(`pkill -9 ${CONFIG.appMetadata.productName} || true`);
  }
};
