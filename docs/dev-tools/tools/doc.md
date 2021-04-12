---
sidebar: auto
---

# 开发工具

## vs code 配置

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
