---
sidebar: auto
---

# 开发工具

## vs code vue 配置

```javascript

{
  "editor.fontLigatures": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  "[javascript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "files.exclude": {
    "node_modules/": true
  },
  "editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": true
  },
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force-aligned"
    }
  },
  "stylusSupremacy.insertColons": false, // 是否插入冒号
  "stylusSupremacy.insertSemicolons": false, // 是否插入分好
  "stylusSupremacy.insertBraces": false, // 是否插入大括号
  "stylusSupremacy.insertNewLineAroundImports": false, // import之后是否换行
  "stylusSupremacy.insertNewLineAroundBlocks": false,
  "diffEditor.ignoreTrimWhitespace": false, // 两个选择器中是否换行
  "window.zoomLevel": 0, // 两个选择器中是否换行
  /** Easy Sass 插件 **/
  "easysass.formats": [
    {
      "format": "expanded", // 没有缩进的、扩展的css代码
      "extension": ".css"
    }
  ],
  "easysass.targetDir": "./css/",
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }, // 自定义css输出文件路径
  "powermode.enabled": true,
  "powermode.presets": "flames",
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "Dracula"
}

```


## vscode react 

```js
{
  "files.associations": {
    "*.vue": "vue",
    "*.wpy": "vue",
    "*.wxml": "html",
    "*.wxss": "css"
  },
  // "git.enableSmartCommit": true,
  // "git.autofetch": true,
  "emmet.triggerExpansionOnTab": true,
  "emmet.showAbbreviationSuggestions": true,
  "emmet.showExpandedAbbreviation": "always",
  "emmet.includeLanguages": {
    "vue-html": "html",
    "vue": "html",
    "wpy": "html"
  },
  //主题颜色
  //"workbench.colorTheme": "Monokai",
  "git.confirmSync": false,
  "explorer.confirmDelete": false,
  "editor.fontSize": 14,
  "window.zoomLevel": 1,
  "editor.wordWrap": "on",
  "editor.detectIndentation": false,
  // 重新设定tabsize
  "editor.tabSize": 2,
  //失去焦点后自动保存
  "files.autoSave": "onFocusChange",
  // #值设置为true时，每次保存的时候自动格式化；
  "editor.formatOnSave": false,
  //每120行就显示一条线
  "editor.rulers": [],
  // 在使用搜索功能时，将这些文件夹/文件排除在外
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/target": true,
    "**/logs": true
  },
  // 这些文件将不会显示在工作空间中
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    // "**/*.js": {
    //   "when": "$(basename).ts" //ts编译后生成的js文件将不会显示在工作空中
    // },
    "**/node_modules": true
  },
  // #让vue中的js按"prettier"格式进行格式化
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.js": "prettier",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      // #vue组件中html代码格式化样式
      "wrap_attributes": "force-aligned", //也可以设置为“auto”，效果会不一样
      "wrap_line_length": 200,
      "end_with_newline": false,
      "semi": false,
      "singleQuote": true
    },
    "prettier": {
      "semi": false,
      "singleQuote": true
    }
  },
  //  #让prettier使用eslint的代码格式进行校验
  "prettier.eslintIntegration": true,
  //  #去掉代码结尾的分号
  "prettier.semi": false,
  //  #使用带引号替代双引号
  "prettier.singleQuote": true,
  //  #让函数(名)和后面的括号之间加个空格
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "GitHub Light",
  "workbench.productIconTheme": "material-product-icons"
}

```