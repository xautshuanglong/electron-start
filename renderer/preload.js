/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

if (!process.sandboxed){
  try{
    // renderer process 中使用 nodeaddon 需要在 main.js 加载 preload.js 时关闭沙箱
    var node_api = require('bindings')('hello-node-api');
    __electronLog.info('preload.js', node_api.sayHello());
    __electronLog.info('preload.js add 110 + 119 =', node_api.add(110, 119));
    
    var node_addon = require('bindings')('hello-node-addon');
    __electronLog.info('preload.js', node_addon.sayHello1());
    __electronLog.info('preload.js', node_addon.sayHello2());
    __electronLog.info('preload.js add1 110 + 119 =', node_addon.add1(110, 119));
    __electronLog.info('preload.js add2 110 + 119 =', node_addon.add2(110, 119));
  } catch (error) {
    __electronLog.info("preload.js require binding addon failed! ", error)
  }
}

const {contextBridge, ipcRenderer} = require('electron')
// const log = require('electron-log')

// 日志模块初始化
__electronLog.info("inside preload.js", {a:1})
// log.info("inside preload.js")

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('electronAPI', {
  SetTitle: (title)=>ipcRenderer.send('Set-Title', title),
  SetProgressBar: (progress)=>ipcRenderer.send('Set-Progress-Bar', progress)
})

ipcRenderer.on('port', (e, data) => {
  // e.ports is a list of ports sent along with this message
  console.log('preload.js receive message e =', e)
  console.log('preload.js receive message data =', data)
  console.log('preload.js receive message data.Hello =', data.Hello)
  if (e.ports !== 'undefined'){
    for (var i=0; i<e.ports.length; ++i) {
      e.ports[i].onmessage = (msgEvt) => {
        console.log('preload.js receive message from e.ports ===>', msgEvt.data)
      }
      e.ports[i].start()
    }
  }
})
