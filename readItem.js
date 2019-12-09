const { BrowserWindow } = require('electron');

let offScreanWindow;

module.exports = (url, callback) => {
    offScreanWindow = new BrowserWindow({
        width :500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
            // nodeIntegration: false
        }
    });

    offScreanWindow.loadURL(url);

    //wait for URL to finish loading
    offScreanWindow.webContents.on('did-frame-finish-load', e => {
        let title = offScreanWindow.getTitle();
        
        //get screenshot (thumbnail)
        offScreanWindow.webContents.capturePage().then(image => {
            console.log(image);
            //Get Image as dataURL
            let screenshot = image.toDataURL();

            callback({ title, screenshot, url });

            //cleanup
            offScreanWindow.close();
            offScreanWindow = null;
        });
    });
}













