const log = require('electron-log/main')

console.log("-----------------------");

try {
  process.parentPort.on('message', (e) => {
    console.log('utility.js receive message e.data =', e.data)
    process.parentPort.postMessage({'msg':'from utility.js'})
    if (e.ports !== 'undefined'){
      for (var i=0; i<e.ports.length; ++i) {
        e.ports[i].on('message', (msgEvt) => {
          log.info(`utility.js receive message from e.ports ===> ${msgEvt.data.message}`)
        })
        log.info('utility.js e.ports[i].start() ...')
        e.ports[i].start()
      }
    }

    // 只能接收到数组中第一个 port 的消息内容
    // const [port] = e.ports;
    // port.on('message', (e) => {
    //   console.log('Received message: e.data ===>', e.data);
    // });
    // port.start();
  })

  var addon = require('bindings')('hello-node-api');
  console.log(addon.hello2());
} catch (error) {
  console.log("Utility.js require binding addon failed! ", error)
}
