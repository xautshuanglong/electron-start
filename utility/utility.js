const { process } = require('electron')

console.log("-----------------------");

process.parentPort.once('message', (e) => {
  const [port] = e.ports
  // ...
})

try {
  var addon = require('bindings')('hello-nan');
  console.log(addon.hello1());
} catch (error) {
  console.log("require binding addon failed! ", error)
}
