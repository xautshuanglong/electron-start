# Electron Start

## 参考网址
- Node Addons 开发
  - [Node.js API Document](https://nodejs.org/docs/latest/api/)  
  - [Node.js Addon Examples](https://github.com/nodejs/node-addon-examples)
- 其他


## 模块安装
``` bash
npm install electron-log --registry https://registry.npmmirror.com
```


## 问题记录

### 编译报错
- 其他

### 运行报错
- 原生`module.node`与`eletron`所依赖的`NodeJS`版本不匹配<br/>
  **[问题描述]**
  ``` bash
  App threw an error during load
  Error: The module '\\?\E:\VS2022\electron-start\build\Release\addon-test.node'
  was compiled against a different Node.js version using
  NODE_MODULE_VERSION 127. This version of Node.js requires
  NODE_MODULE_VERSION 125. Please try re-compiling or re-installing
  the module (for instance, using `npm rebuild` or `npm install`).
      at process.func [as dlopen] (node:electron/js2c/node_init:2:2559)
      at Module._extensions..node (node:internal/modules/cjs/loader:1470:18)
      at Object.func [as .node] (node:electron/js2c/node_init:2:2559)
      at Module.load (node:internal/modules/cjs/loader:1215:32)
      at Module._load (node:internal/modules/cjs/loader:1031:12)
      at c._load (node:electron/js2c/node_init:2:17025)
      at Module.require (node:internal/modules/cjs/loader:1240:19)
      at require (node:internal/modules/helpers:179:18)
  ```
  **[原因分析]**<br>
  Node Addons 依赖 node-gyp 进行编译，使用的时当前开发环境中的 NodeJS，Electron 内部也集成了 NodeJS，不同版本的 Electron 使用 NodeJS 版本存在差异，NodeJS 版本不同，其内部使用的 N-API 也会存在差异，存在兼容性问题。

  **[解决方案]**<br>
  1. 使用`@electron/rebuild`[参考 Native Node Modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules)
      ``` bash
      npm install --save-dev @electron/rebuild
      # Every time you run "npm install", run this:
      ./node_modules/.bin/electron-rebuild
      ```

- 其他
