import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "文字沟通世界",
  description: "专注于提升技术的博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "主页",
        link: "/",
      },
      {
        text: "前端",
        items: [
          {
            text: "基础",
            items: [
              {
                text: "html 基础",
                link: "/article/front-end/basis/html-basis",
              },
              {
                text: "css 基础",
                link: "/article/front-end/basis/css-basis",
              },
            ],
          },
          {
            text: "面试",
            items: [
              {
                text: "常见面试题",
                link: "/article/front-end/interview/question",
              },
              {
                text: "高级前端进阶",
                link: "/article/front-end/interview/advanced-front-end",
              },
            ],
          },
          {
            text: "Vue",
            items: [
              {
                text: "源码解析",
                link: "/article/front-end/vue/source-code-analysis",
              },
            ],
          },
          {
            text: "Javascript",
            items: [
              {
                text: "JavaScript 基础",
                link: "/article/front-end/javascript/basis",
              },
              {
                text: "JavaScript 标准内置对象",
                link: "/article/front-end/javascript/api",
              },
              {
                text: "学习笔记",
                link: "/article/front-end/javascript/study-notes",
              },
              {
                text: "Event-Loop",
                link: "/article/front-end/javascript/event-loop",
              },
            ],
          },
          {
            text: "工程化",
            items: [
              {
                text: "webpack",
                link: "/article/front-end/engineering/webpack",
              },
            ],
          },
          {
            text: "工具",
            items: [
              {
                text: "Vs code 配置",
                link: "/article/front-end/tool/vscode",
              },
            ],
          },
        ],
      },
      {
        text: "后端",
        items: [
          {
            text: "Rust",
            items: [
              {
                text: "入门学习",
                link: "/article/back-end/rust/basic/getting-started",
              },
              // {
              //   text: "Axum",
              //   link: "/article/back-end/rust/axum/start1",
              // },
              // {
              //   text: "Sea-orm",
              //   link: "/article/back-end/rust/sea-orm/sea-orm1",
              // },
            ],
          },
        ],
      },
      {
        text: "游戏",
        items: [
          {
            text: "UE",
            items: [
              {
                text: "入门学习",
                link: "/article/game/ue/index",
              },
            ],
          },
        ],
      },
      {
        text: "建模",
        items: [
          {
            text: "Blender",
            items: [
              {
                text: "常用快捷键",
                link: "/article/modeling/blender/index",
              },
            ],
          },
        ],
      },
      {
        text: "Github",
        link: "https://github.com/maoxiaoquan",
      },
    ],
    sidebar: {
      //   "/article/back-end/rust/axum": [
      //     {
      //       text: "axum 中的各种响应",
      //       link: "start1",
      //     },
      //     {
      //       text: "axum 中获取请求数据",
      //       link: "start2",
      //     },
      //     {
      //       text: "路由",
      //       link: "start4",
      //     },
      //     {
      //       text: "中间件",
      //       link: "start5",
      //     },
      //     {
      //       text: "axum 处理静态文件",
      //       link: "start6",
      //     },
      //     {
      //       text: "axum 处理 cookie",
      //       link: "start7",
      //     },
      //     {
      //       text: "axum 操作 redis",
      //       link: "start8",
      //     },
      //     {
      //       text: "axum 实现 Session",
      //       link: "start9",
      //     },
      //     {
      //       text: "axum 集成 JWT",
      //       link: "start10",
      //     },
      //     {
      //       text: "axum 上传文件",
      //       link: "start11",
      //     },
      //     {
      //       text: "配置文件：让 axum app 可配置",
      //       link: "start12",
      //     },
      //     {
      //       text: "axum 错误处理",
      //       link: "start13",
      //     },
      //   ],
      //   "/article/back-end/rust/sea-orm": [
      //     {
      //       text: "SeaORM 和 axum 开发。",
      //       link: "sea-orm1",
      //     },
      //     {
      //       text: "查询数据",
      //       link: "sea-orm2",
      //     },
      //     {
      //       text: "插入数据",
      //       link: "sea-orm3",
      //     },
      //     {
      //       text: "修改数据",
      //       link: "sea-orm4",
      //     },
      //     {
      //       text: "删除数据",
      //       link: "sea-orm5",
      //     },
      //     {
      //       text: "操作一对多和多对一关系",
      //       link: "sea-orm6",
      //     },
      //     {
      //       text: "SeaORM 的命令行工具和自动迁移",
      //       link: "sea-orm7",
      //     },
      //     {
      //       text: "SeaORM 操作多对多关系",
      //       link: "sea-orm8",
      //     },
      //   ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/maoxiaoquan" }],
  },
});
