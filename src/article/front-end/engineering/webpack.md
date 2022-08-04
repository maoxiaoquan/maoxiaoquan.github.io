---
sidebar: auto
---

# Webpack

## 模块联邦

ModuleFederationPlugin 有几个重要的参数：

1、name: 当前应用的名称，需要唯一性

2、exposes: 需要导出的模块，用于提供给外部其他项目进行使用；

3、remotes: 需要依赖的远程模块，用于引入外部其他模块；

4、filename: 入口文件名称，用于对外提供模块时候的入口文件名；

5、shared: 配置共享的组件，一般是对第三方库做共享使用，就是相当于使用本地的包

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

new ModuleFederationPlugin({
  name: "main-app",
  filename: "remoteEntry.js",
  exposes: {
    // 导出页面内的 Demo
    "./exportComp": "./src/view/exportComp.vue",
  },
  remotes: {
    // 远程引用的地址
    // “remoteName”这个需要和上方配置的name一致，这个是唯一的标识
    // “remoteEntry.js” 就是上方配置的 filename
    exportComp: "remoteName@http://localhost:8085/remoteEntry.js",
  },
  shared: {
    vue: {
      eager: true,
      singleton: true,
    },
  },
});
```

下面来写一个例子

主应用:

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "main-app",
      filename: "remoteEntry.js",
      remotes: {
        childApp: "child-app@http://localhost:8085/remoteEntry.js",
      },
      shared: {
        vue: {
          eager: true,
          singleton: true,
        },
      },
    }),
  ],
};

// 主应用页面中使用:
import Button from "childApp/Button";
```

子应用:

```js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "child-app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button.jsx",
        "./Dialog": "./src/Dialog.jsx",
      },
    }),
  ],
};
```

[参考文章](https://zhuanlan.zhihu.com/p/485148715)
