先创建一个 vite 项目

```
yarn add --dev electron
```

根目录创建 main.js

```js
// main.js
// Modules to control application life and create native browser window
// import { app, BrowserWindow } from 'electron'
// import path from 'path'
const { app, BrowserWindow } = require('electron')
const path = require('path')
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // 加载 index.html
  mainWindow.loadFile(path.join(__dirname, './dist/index.html'))
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null)
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
```

根目录创建 preload.js

```js
// preload.js

// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
```

package.json 添加
"electron:serve": "electron ."

运行 yarn build 后 yarn electron:serve

### 打包

yarn add -D cross-env electron-builder

创建 electron 文件夹 将 main.js 和 preload.js 文件移动进来

```js
// main.js
// Modules to control application life and create native browser window
// import { app, BrowserWindow } from 'electron'
// import path from 'path'
const { app, BrowserWindow } = require('electron')
const path = require('path')
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // 加载 index.html
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null)
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
```

编辑 package.json
"main": "electron/main.js",
"build:electron": "vite build && electron-builder"

```js
 "build": {
    "appId": "com.my-website.my-app",
    "productName": "record-login",
    "mac": {
      "category": "public.app-category.utilities"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "directories": {
      "buildResources": "assets",
      "output": "dist_electron"
    }
  }
```

打包  
yarn electron:build
