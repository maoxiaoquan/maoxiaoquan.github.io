import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
const { searchPlugin } = require("@vuepress/plugin-search");
const { description } = require("../../package");
import path from "path";

export default defineUserConfig({
  lang: "zh-CN",
  title: "文字沟通世界",
  description: description,
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],
  dest: path.resolve(__dirname, "../../docs"),
  theme: defaultTheme({
    // 默认主题配置
    repo: "",
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
    navbar: [
      {
        text: "主页",
        link: "/",
      },
      {
        text: "前端",
        children: [
          {
            text: "Vue",
            children: [
              {
                text: "源码解析",
                link: "/article/frontend/vue/source-code-analysis",
              },
            ],
          },
          {
            text: "面试",
            children: [
              {
                text: "高级前端进阶",
                link: "/article/frontend/interview/advanced-front-end",
              },
            ],
          },
          {
            text: "Javascript",
            children: [
              {
                text: "JavaScript 标准内置对象",
                link: "/article/frontend/javascript/api",
              },
              {
                text: "学习笔记",
                link: "/article/frontend/javascript/study-notes",
              },
            ],
          },
        ],
      },
      {
        text: "工具&插件",
        children: [
          {
            text: "开发工具配置",
            children: [
              { text: "Vs code 配置", link: "/article/dev-tools/tools/doc" },
            ],
          },
        ],
      },
      {
        text: "Github",
        link: "https://github.com/maoxiaoquan",
      },
    ],
    sidebar: ["/"],
  }),
  plugins: [
    searchPlugin({
      // 配置项
    }),
  ],
});
