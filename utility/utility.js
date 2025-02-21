
console.log("-----------------------");

try {
  process.parentPort.once('message', (e) => {
    // const [port] = e.ports
    console.log('utility.js e =',e.data)
    e.ports[0].onmessage = (msgEvt) => {
      console.log(msgEvt.data)
    }
  })

  var addon = require('bindings')('hello-node-api');
  console.log(addon.hello2());
} catch (error) {
  console.log("Utility.js require binding addon failed! ", error)
}
