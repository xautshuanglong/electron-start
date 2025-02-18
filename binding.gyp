{
  "targets": [{
    "target_name": "hello-node-addon",
    "sources": [
      "addons/hello-node-addon/node-addon-api-test.cc"
    ],
    "include_dirs": [
      "<!(node -e \"require('nan')\")",
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
    'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
  }, {
    "target_name": "hello-node-api",
    "sources": [
      "addons/hello-node-api/napi-test.cc",
    ],
  }]
}