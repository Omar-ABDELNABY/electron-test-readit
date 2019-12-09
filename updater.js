const { autoUpdater } = require('electron-updater');
const { dialog, BrowserWindow, ipcMain } = require('electron'); 

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.autoDownload = false;

exports.check = () => {
    console.log('checking for updates...');
    autoUpdater.checkForUpdates();

    autoUpdater.on('update-available', () => {
        let downloadProgress = 0;

        dialog.showMessageBox({
            type: 'info',
            title: 'update available',
            message: 'A new version is available, Do you want to download it now?',
            buttons: ['Update', 'Not now']
        }, (buttonIndex) => {
            if (buttonIndex !== 0){
                return
            }
            autoUpdater.downloadUpdate();

            let progressWindow = new BrowserWindow({
                width: 350,
                height: 35,
                useContentSize: true,
                autoHideMenuBar: true,
                maximizable: false,
                fullscreen: false,
                fullscreenable: false,
                resizable: false
            });
            progressWindow.loadFile(`${__dirname}/renderer/progress.html`);
            progressWindow.on('close', () => {
                progressWindow = null;
            });

            ipcMain.on('download-progress-request', (e) => {
                e.returnValue = downloadProgress;
            });

            autoUpdater.on('download-progress', (d) => {
                downloadProgress = d.percent;
                autoUpdater.logger.info(downloadProgress);
            });

            autoUpdater.on('update-downloaded', (d) => {
                if (progressWindow){
                    progressWindow.close();
                }

                dialog.showMessageBox({
                    type: 'info',
                    title: 'update ready',
                    message: 'A new version is ready. Quit and install now?',
                    buttons: ['Yes', 'Later']
                }, (buttonIndex) => {
                    if (buttonIndex === 0 ){
                        autoUpdater.quitAndInstall();
                    }
                }); // update ready Message box dialog
            }); // update-downloaded event
        }); // update available Message box dialog
    });    //update available event
};






