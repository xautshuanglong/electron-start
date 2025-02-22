
console.log("-----------------------");

try {
  process.parentPort.on('message', (e) => {
    // const [port] = e.ports
    console.log('utility.js receive message e =', e)
    console.log('utility.js receive message e.data =', e.data)
    e.ports[0].onmessage = (msgEvt) => {
      console.log('utility.js receive message from port[0]', msgEvt.data)
    }
    // e.ports[1].onmessage = (msgEvt) => {
    //   console.log('utility.js receive message from port[1]', msgEvt.data)
    // }
  })

  var addon = require('bindings')('hello-node-api');
  console.log(addon.hello2());
} catch (error) {
  console.log("Utility.js require binding addon failed! ", error)
}
