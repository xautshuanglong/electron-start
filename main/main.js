// Modules to control application life and create native browser window
const { app, ipcMain, crashReporter, nativeImage, BrowserWindow,
  utilityProcess, MessageChannelMain } = require('electron')
const log = require('electron-log/main')
const path = require('node:path')

var mainWindow, winSettings

// 保证只有一个应用实例运行
if (!app.requestSingleInstanceLock()) {
  app.quit()
  return
}

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 日志模块初始化
log.initialize()
log.eventLogger.startLogging()
// log.transports.file.fileName = ""

// Node Addon Testing
try{
  var nodd_api = require('bindings')('hello-node-api');
  log.info('main.js ', nodd_api.sayHello());
  log.info('main.js add 110 + 119 =', nodd_api.add(110, 119));

  var node_addon = require('bindings')('hello-node-addon');
  log.info('main.js ', node_addon.sayHello1());
  log.info('main.js ', node_addon.sayHello2());
  log.info('main.js add1 110 + 119 =', node_addon.add1(110, 119));
  log.info('main.js add2 110 + 119 =', node_addon.add2(110, 119));
} catch (error) {
  log.info("main.js require binding addon failed! ", error)
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // 菜单栏 和 系统按钮均被删除 最下化、最大化/还原、关闭）
    webPreferences: {
      // sandbox: false, // 默认情况下沙箱是开启状态，因安全考虑在 preload.js 中加载 nodeaddon 会失败。
      nodeIntegration: true, // 开起 Node 集成会自动禁用沙盒能力
      preload: path.join(__dirname, '../renderer/preload.js')
    }
  })

  // mainWindow.setMenu(null); // 只移除默认菜单栏，系统按钮还在（最下化、最大化/还原、关闭）

  // and load the index.html of the app.
  mainWindow.loadFile('renderer/index.html')
  // mainWindow.loadFile('vue_dist/index.html') // vue 项目构建时需使用本地资源路径，默认 /xxx.js 会加载盘符根目录 x:/xxx.js, vue.config.js 中添加 publicPath: './'
  // mainWindow.loadURL('http://localhost:8080/') // 配合 VUE 项目联调，有安全警告，https://www.baidu.com 也不例外
  // mainWindow.loadFile('react_dist/index.html') // 绝对路径改为相对路径，package.json 中添加 "homepage": "./"
  // mainWindow.loadURL('http://localhost:3000/') // 配合 React 项目联调

  // 加载本地 WebUI，index.html 模板中需添加以下 meta 数据
  // <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:">

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

  // 与 RendererProcess ChannelPort 通信测试
  const msgChannel1 = new MessageChannelMain()
  const msgChannel2 = new MessageChannelMain()
  mainWindow.webContents.postMessage('port', {'Hello':'World from main.js to webContents with port', 'a':'b'}, [msgChannel1.port2, msgChannel2.port2])
  msgChannel1.port1.postMessage({message:'main.js post messge with msgChannel1.port1 after posting port'})
  msgChannel2.port1.postMessage({message:'main.js post messge with msgChannel2.port1 after posting port'})

  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    log.info('Debugger detached due to : ', reason)
  })

  mainWindow.webContents.debugger.on('message', (event, method, params) => {
    log.info('Debugger message : ', method, params)
  })
}

// Utility Process Testing
function spawmUtilityProcess () {
  try {
    const child = utilityProcess.fork(path.join(__dirname, '../utility/utility.js'))
    // UtilityProcess 通信测试
    const msgCh1 = new MessageChannelMain()
    const msgCh2 = new MessageChannelMain()
    child.postMessage({ 'Hello' : 'World from main.js to utility process with port' }, [msgCh1.port2, msgCh2.port2])
    child.on('message', (data) => {
      log.info('main.js receive message from child process data ==>', data)
    })

    log.info('after posting message to utility process')
    setInterval(() => {
      // log.info('This is a log message from the main.js  will posting message from port1');
      msgCh1.port1.postMessage({message:'main.js post messge to utility.js with msgCh1.port1 inside spawmUtilityProcess'})
      msgCh2.port1.postMessage({message:'main.js post messge to utility.js with msgCh2.port1 inside spawmUtilityProcess'})

      // child 可正常发送消息
      // child.postMessage({testing:"main.js post message to utility.js whit child.postMessage"})
    }, 10000);

    child.on('spawn', () => {
      log.info('spawm child utility process pid =', child.pid)
    })

    child.on('exit', () => {
      log.info('exit child utility process pid =', child.pid)
    })
  } catch (error) {
    log.info("create utility process failed! ", error)
  }
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
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('ready', function() {
  log.info('app.on ready ...')
  spawmUtilityProcess()
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
    return
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('second-instance', (event, commandLine, workingDirectory)=>{
  log.debug("new isntance created: "+ commandLine)
  let allWin = BrowserWindow.getAllWindows()
  allWin.map(win => {
    win.show()
  })
})

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
  if (progress % 100 == 0){
    progress = 100
  } else {
    progress %= 100
  }
  let percent = progress / 100.00
  log.info('current percent : ', percent.toFixed(2))
  const webContent = event.sender
  const window = BrowserWindow.fromWebContents(webContent)
  window.setProgressBar(percent)
})

ipcMain.on('Open-Window-Settings', (event, progress) => {
   winSettings = new BrowserWindow({
    width: 400,
    height: 300,
    frame: true, // 菜单栏 和 系统按钮均被删除 最下化、最大化/还原、关闭）
    parent: mainWindow,
    modal: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, '../renderer/settings_preload.js')
    }
  })
  // winSettings.setMenu(null); // 只移除默认菜单栏，系统按钮还在（最下化、最大化/还原、关闭）
  winSettings.loadFile('renderer/settings.html')
})

ipcMain.on('To-Index', (e, data) => {
   mainWindow.webContents.postMessage('To-Index', data)
})

ipcMain.on('To-Settings', (e, data) => {
   winSettings.webContents.postMessage('To-Settings', data)
})
