

const {contextBridge, ipcRenderer} = require('electron')
const crypto = require('crypto')
// const log = require('electron-log')

__electronLog.info("inside settings_preload.js")

contextBridge.exposeInMainWorld('electronAPI', {
  SendMessage: (msgContent) => ipcRenderer.send('To-Index', msgContent)
})

ipcRenderer.on('port', (e, data) => {
  // e.ports is a list of ports sent along with this message
  console.log('settings_preload.js receive message e =', e)
  console.log('settings_preload.js receive message data =', data)
  console.log('settings_preload.js receive message data.Hello =', data.Hello)
})

ipcRenderer.on('To-Settings', (e, data) => {
  console.log('settings_preload.js receive msg : ' + data)
})
