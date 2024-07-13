// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // mainWindow.loadURL('https://www.baidu.com/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to : ', reason)
  })

  mainWindow.webContents.debugger.on('message', (event, method, params) => {
    console.log('Debugger message : ', method, params)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('app.whenReady() before createWindow() ...')
  createWindow()

  app.on('activate', function () {
    console.log('app.on active ...')
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('ready', function() {
  console.log('app.on ready ...')
})

app.on('will-finish-launching', function() {
  console.log('app.on will-finish-launching ...')
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  console.log('app.on window-all-closed ...')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('will-quit', function() {
  console.log('app.on will-quit ...')
})

app.on('before-quit', function() {
  console.log('app.on before-quit ...')
})

app.on('quit', function() {
  console.log('app.on quit ...')
})

app.on('web-contents-created', function() {
  console.log('app.on web-contents-created ...')
})

ipcMain.on('Set-Title', (event, title) => {
  const webContent = event.sender
  const window = BrowserWindow.fromWebContents(webContent)
  window.setTitle(title)
})
