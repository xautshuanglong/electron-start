// Modules to control application life and create native browser window
const { app, ipcMain, nativeImage, BrowserWindow } = require('electron')
const log = require('electron-log/main')
const path = require('node:path')

// 日志模块初始化
log.initialize()
log.eventLogger.startLogging()
// log.transports.file.fileName = ""

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js')
    }
  })

  // mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadFile('renderer/index.html')
  // mainWindow.loadURL('https://www.baidu.com/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  const thumbarBtns = [
    {
      tooltip: 'button1',
      icon: nativeImage.createFromPath(path.join(__dirname, '../res/thumbar_extension/button1.png')),
      click () { log.info('button1 clicked') }
    },
    {
      tooltip: 'button2',
      icon: nativeImage.createFromPath(path.join(__dirname, '../res/thumbar_extension/button2.png')),
      flags: ['dismissonclick'], // 使用 enable 标志将无法展示缩略图按钮
      click () { log.info('button2 clicked.') }
    }
  ]
  var resFlag = mainWindow.setThumbarButtons(thumbarBtns)
  log.info("setThumbarButtons result flags : ", resFlag)

  mainWindow.on("ready-to-show", () => {
  })

  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    log.info('Debugger detached due to : ', reason)
  })

  mainWindow.webContents.debugger.on('message', (event, method, params) => {
    log.info('Debugger message : ', method, params)
  })
}

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: path.join(__dirname, 'AppIcon.png'),
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  log.info('app.whenReady() before createWindow() ...')
  createWindow()

  app.on('activate', function () {
    log.info('app.on active ...')
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('ready', function() {
  log.info('app.on ready ...')
})

app.on('will-finish-launching', function() {
  log.info('app.on will-finish-launching ...')
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  log.info('app.on window-all-closed ...')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('will-quit', function() {
  log.info('app.on will-quit ...')
})

app.on('before-quit', function() {
  log.info('app.on before-quit ...')
})

app.on('quit', function() {
  log.info('app.on quit ...')
})

app.on('web-contents-created', function() {
  log.info('app.on web-contents-created ...')
})

ipcMain.on('Set-Title', (event, title) => {
  const webContent = event.sender
  const window = BrowserWindow.fromWebContents(webContent)
  window.setTitle(title)
})

ipcMain.on('Set-Progress-Bar', (event, progress) => {
  let percent = progress % 100 / 100
  log.info('current percent : ', percent)
  const webContent = event.sender
  const window = BrowserWindow.fromWebContents(webContent)
  window.setProgressBar(percent)
})
