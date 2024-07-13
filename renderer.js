/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

var gClickCout = 0;
const inputTitle = document.getElementById('inputTitle')
const btnChangeTitle = document.getElementById('btnChangeTitle')
const btnClickCount = document.getElementById('btnClickCount')

if (btnChangeTitle == null){
    console.log('null element')
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
})

setInterval(() => {
    console.log('This is a log message from the renderer process.');
}, 1000);

console.log('logger testing');
