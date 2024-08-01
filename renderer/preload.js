/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

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
