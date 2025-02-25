const log = require('electron-log/main')

log.info("-----------------------");

try{
  var nodd_api = require('bindings')('hello-node-api');
  log.info('utility.js ', nodd_api.sayHello());
  log.info('utility.js add 110 + 119 =', nodd_api.add(110, 119));

  var node_addon = require('bindings')('hello-node-addon');
  log.info('utility.js ', node_addon.sayHello1());
  log.info('utility.js ', node_addon.sayHello2());
  log.info('utility.js add1 110 + 119 =', node_addon.add1(110, 119));
  log.info('utility.js add2 110 + 119 =', node_addon.add2(110, 119));
} catch (error) {
  log.info("Utility.js require binding addon failed! ", error)
}

process.parentPort.on('message', (e) => {
  log.info('utility.js receive message e.data =', e.data)
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
  //   log.info('Received message: e.data ===>', e.data);
  // });
  // port.start();
})
