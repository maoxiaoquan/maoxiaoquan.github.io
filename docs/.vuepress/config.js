const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '文字沟通世界',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,
  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: '主页',
        link: '/',
      },
      {
        text: '前端',
        items: [
          // { text: '基础', link: '/frontend/javascript/api' },
          // { text: '进阶', link: '/frontend/javascript/api' },
          {
            text: 'Vue',
            items: [
              { text: '源码解析', link: '/frontend/vue/source-code-analysis' },
              // { text: 'go', link: '/frontend/javascript/api' },
            ],
          },
          // {
          //   text: 'React',
          //   items: [
          //     { text: 'node', link: '/frontend/javascript/api' },
          //     { text: 'go', link: '/frontend/javascript/api' },
          //   ],
          // },
          { text: 'JavaScript 标准内置对象', link: '/frontend/javascript/api' },
        ],
      },
      // {
      //   text: '后端',
      //   items: [
      //     { text: 'node', link: '/language/chinese' },
      //     { text: 'go', link: '/language/english' },
      //   ],
      // },
      // {
      //   text: 'Guide',
      //   link: '/guide/english',
      // },
      // {
      //   text: 'Config',
      //   link: '/config/',
      // },
      // {
      //   text: '关于',
      //   link: '/guide/english',
      // },
      {
        text: 'Github',
        link: 'https://github.com/maoxiaoquan',
      },
    ],
    sidebar: [
      '/',
      // '/page-a',
      // ['/page-b', 'Explicit link text']
    ]
    // sidebar: {
    //   '/guide/': [ 
    //     {
    //       title: 'Guide',
    //       collapsable: false,
    //       children: ['', 'using-vue'],
    //     },
    //   ],
    // },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
}
