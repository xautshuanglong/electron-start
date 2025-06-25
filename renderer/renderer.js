/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const log = __electronLog

var gClickCout = 0;
const inputTitle = document.getElementById('inputTitle')
const btnChangeTitle = document.getElementById('btnChangeTitle')

const btnClickCount = document.getElementById('btnClickCount')

const editPlainText = document.getElementById('editPlainText')
const btnCryptoSh256 = document.getElementById('btnCryptoSh256')

const editMsgContent = document.getElementById('editMsgContent')
const btnSendMsg = document.getElementById('btnSendMsg')
const btnOpenSettings = document.getElementById('btnOpenSettings')

if (btnChangeTitle == null){
    log.info('null element')
}
btnChangeTitle.addEventListener('click', () => {
    const title = inputTitle.value
    window.electronAPI.SetTitle(title)
})

btnClickCount.addEventListener('click', () => {
    ++gClickCout
    const spanClickCount = document.getElementById('spanClickCount')
    if (spanClickCount) {
        spanClickCount.innerText = gClickCout
    }
    window.electronAPI.SetProgressBar(gClickCout)
})

btnCryptoSh256.addEventListener('click', () => {
    const plainText = editPlainText.value
    const sha256Text = window.electronAPI.CaculateSh256(plainText)
    log.info('renderer.js sha256(' + plainText + ')=' + sha256Text)
})

btnSendMsg.addEventListener('click', () => {
    const msgContent = editMsgContent.value
    log.info('settings.js msgContent=' + msgContent)
    localStorage.setItem("msg", "Msg from index.html")
    window.electronAPI.SendMessage(msgContent)
})

btnOpenSettings.addEventListener('click', () => {
    log.info('settings.js will open settings window')

    // 在同进程中打开子窗口，此方法已被弃用
    // const childWindow = window.open('', 'modal')
    // childWindow.document.write('<h1>Hello</h1>')
    window.electronAPI.OpenSettingsWindow()
})

setInterval(() => {
    // log.info('This is a log message from the renderer process.');
}, 1000);

log.info('renderer logger testing');
