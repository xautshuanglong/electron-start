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

### 调试记录
- VSCode 调试 node 进程  
[nodejs-debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

- 调试设置
1. 启动、附加。需要被调试进程监听网络端口，
1. 根据官方 launch.json 指导，调试器外启动应用命令为 node_modules\.bin\electron.cmd . --inspect --remote-debugging-port=9222
1. 打包后独立运行 <2> 中的命令无效，主进程无法监听调试端口，指定启动后第一行代码break。node_modules\.bin\electron.cmd . --inspect-brk --remote-debugging-port=9222
1. 调试端口前可指定IP，如：127.0.0.1:9229。--inspect-brk\[=\[host:]port]
1. 主进程自带跨机器调试，Chromium 因安全考虑关闭了跨机器调试（自带只支持本地调试），可通过端口映射实现渲染进程跨机器调试。
1. VSCODE launch.json
    ``` javascript
    {
        // Use IntelliSense to learn about possible attributes.
        // Hover to view descriptions of existing attributes.
        // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "compounds": [
            {
                "name": "Main+Renderer",
                "configurations": ["Debug Main", "Renderer"],
                "stopAll": true
            }
        ],
        "configurations": [
            {
                "name": "Debug Main",
                "type": "node",
                "request": "launch",
                "cwd": "${workspaceFolder}",
                "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
                "windows": {
                    "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
                },
                "args": [".", "--remote-debugging-port=9222"],
                "outputCapture": "std",
                "console": "integratedTerminal"
            },
            {
                "name": "Renderer",
                "port": 9222,
                "type": "chrome",
                "request": "attach",
                "webRoot": "${workspaceFolder}"
            },
            {
                "name": "Attach Main",
                "port": 9229,
                "type": "node",
                "request": "attach",
                "cwd": "${workspaceFolder}"
            },
            {
                "name": "Attach Process",
                "type": "node",
                "request": "attach",
                "processId": "${command:PickProcess}"
            }
        ]
    }
    ```


* ### 运行报错


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

- 使用消息端口进行跨进程通信<br/>
  **[问题描述]**
  1. 主进程与渲染进程通信失败
  2. 主进程与效率进程通信失败

  **[原因分析]**<br>
  1. 主进程和效率进程中的 js 环境和 js 接口标准
  2. 渲染进程的 js 环境和 js 接口标准

  **[解决方案]**<br>
  1. 主进程与渲染进程多端口通信
        ``` bash
        for 循环
        ```
  2. 主进程与效率进程多端口通信
        ``` bash
        for 循环
        必须调用 port.start()，否则无法接收到消息内容
        ```

- 其他



流程图测试

``` mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[fa:fa-laptop Laptop]
    C -->|Two| E[fa:fa-mobile iPhone]
    C -->|Three| F[fa:fa-car Car]
```


``` mermaid
graph TD
    A --> B
    A --> C
    B --> D
    C --> D
```


<details><summary>预训练数据集</summary>

- [Wiki Demo (en)](data/wiki_demo.txt)
- [RefinedWeb (en)](https://huggingface.co/datasets/tiiuae/falcon-refinedweb)
- [RedPajama V2 (en)](https://huggingface.co/datasets/togethercomputer/RedPajama-Data-V2)
- [Wikipedia (en)](https://huggingface.co/datasets/olm/olm-wikipedia-20221220)
- [Wikipedia (zh)](https://huggingface.co/datasets/pleisto/wikipedia-cn-20230720-filtered)
- [Pile (en)](https://huggingface.co/datasets/EleutherAI/pile)
- [SkyPile (zh)](https://huggingface.co/datasets/Skywork/SkyPile-150B)
- [FineWeb (en)](https://huggingface.co/datasets/HuggingFaceFW/fineweb)
- [FineWeb-Edu (en)](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu)
1. [The Stack (en)](https://huggingface.co/datasets/bigcode/the-stack)
1. [StarCoder (en)](https://huggingface.co/datasets/bigcode/starcoderdata)
1. <details><summary>二级折叠</summary>

     * abc
     * def

   </details>

</details>
