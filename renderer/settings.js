
const log = __electronLog

window.onload = ()=> {
    var msg = localStorage.getItem("msg");
    // alert(msg) // 此处立即弹出警告窗，将导致窗口内输入框无法获取焦点，打开再关闭调试窗口可恢复正常
}

const editMsgContent = document.getElementById('editMsgContent')
const btnSendMsg = document.getElementById('btnSendMsg')
btnSendMsg.addEventListener('click', () => {
    const msgContent = editMsgContent.value
    log.info('settings.js msgContent=' + msgContent)
    window.electronAPI.SendMessage(msgContent)
})
