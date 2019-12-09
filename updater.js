const { autoUpdater } = require('electron-updater');
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';


exports.check = () => {
    console.log('checking for updates...');
    autoUpdater.checkForUpdates();
};






