
console.log("-----------------------");

try {
  process.parentPort.once('message', (e) => {
    // const [port] = e.ports
    console.log('e =',e)
    console.log('ports =',e.ports)
  })

  var addon = require('bindings')('hello-node-api');
  console.log(addon.hello2());
} catch (error) {
  console.log("Utility.js require binding addon failed! ", error)
}
