// Modules
const { app, BrowserWindow, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state');
const readItem = require('./readItem');
const updater = require('./updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//listen for new item
ipcMain.on('new-item', (e, itemUrl) => {
  //Get new item and send it back to the sender on 'new-item-success' channel
  readItem(itemUrl, (item) => {
    e.sender.send('new-item-success', item)
  });
});

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  //windowStateKeeper
  let state = windowStateKeeper({
    defaultWidth: 500, defaultHeight:650
  });

  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minWidth: 350, minHeight: 300,
    maxWidth: 650,
    webPreferences: { nodeIntegration: true },
    icon: `${__dirname}/build/icon.png`
  })

  state.manage(mainWindow);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html')

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools()

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', () => {
  createWindow();

  setTimeout(updater.check ,2000);
});


// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
