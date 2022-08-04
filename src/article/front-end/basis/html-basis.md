---
sidebar: auto
---

# HTML

> 面试 HTML 方面的一些问题，或者介绍，持续更新

## 1. 语义化标签

header、main、 footer、 nav、 section、 article、aside

details、 figcaption、 figure、 mark、 summary、 time、

前几个用的比较多，作用就不一一列出来

## 2. HTML、XML、XHTML

1.XHTML 可扩展超文本标记性语言，是由 html 到 xml 语言的一种过渡性语言，是一种在 HTML 4.0 基础上优化和改进的新语言，目的是基于 XML 应用。XHTML 是一种增强了的 HTML,XHTML 是更严谨更纯净的 HTML 版本。它的可扩展性和灵活性将适应未来网络应用更多的需求。

2.xml 可扩展标记语言，是标准通用标记语言的子集，是一种标记电子文件使其具有结构性的标记语言，被设计用来传输和存储数据，是对超文本标记语言的补充。

3.html 超文本标记语言，超文本是指网页中可以包括图片，链接，甚至音乐、程序等非文字元素，标记是用特定的符号来标记要显示的内容的各个部分。

## 3.`<!Doctype html>`

`<!doctype html>` 的作用就是让浏览器进入标准模式，使用最新的 HTML5 标准来解析渲染页面；如果不写，浏览器就会进入混杂模式，我们需要避免此类情况发生。

## 4.一个网页从开始请求道最终显示的完整过程

```
一个网页从请求到最终显示的完整过程一般可以分为如下7个步骤：
（1）在浏览器中输入网址；
（2）发送至DNS服务器并获得域名对应的WEB服务器IP地址；
（3）与WEB服务器建立TCP连接；
（4）浏览器向WEB服务器的IP地址发送相应的HTTP请求；
（5）WEB服务器响应请求并返回指定URL的数据，或错误信息，如果设定重定向，则重定向到新的URL地址；
（6）浏览器下载数据后解析HTML源文件，解析的过程中实现对页面的排版，解析完成后在浏览器中显示基础页面；
（7）分析页面中的超链接并显示在当前页面，重复以上过程直至无超链接需要发送，完成全部数据显示
```

[阿里面试官的”说一下从 url 输入到返回请求的过程“问的难度就是不一样！](https://juejin.cn/post/6928677404332425223) 详细点的就看这位大佬写的

## 5.HTML 中的 Meta 标签

1.name 属性

`name 属性可以用来定义网页的关键字、描述、作者以及版权信息等等。`

| 常用属性值  | 说明                                                              |
| ----------- | ----------------------------------------------------------------- |
| keywords    | 用来定义网页的关键字。关键字可以是多个，之间需要用英文逗号,隔开。 |
| description | 用来定义网页的描述。                                              |
| author      | 用来定义网页的作者。                                              |
| copyright   | 用来定义网页的版权信息。                                          |

```html
<meta name="keywords" content="一般是关键字类似的" />
<meta name="description" content="介绍" />
<meta name="author" content="author" />
<meta name="copyright" content="版权所有" />
```

2.charset 属性

`charset 是 HTML 5 中的新属性，用来定义页面的编码格式。`

| 常用属性值 | 说明                                                 |
| ---------- | ---------------------------------------------------- | --- | ------------------------------------ | --- |
| ISO-8859-1 | 表示网页的默认编码格式。                             |
|            | UTF-8                                                |     | 表示万国码，是目前最常用的编码格式。 |     |
| gb2312     | 表示国际汉字码，不包含繁体。                         |
| gbk        | 表示国家标准扩展版。增加了繁体，包含所有亚洲字符集。 |

```html
<meta charset="UTF-8" />
<meta charset="gb2312" />
<meta charset="ISO-8859-1" />
<meta charset="gbk" />
```

3.http-equiv 属性

`所有主流浏览器都支持 http-equiv 属性。它可以设置网页的过期时间，自动刷新等`

| 常用属性值   | 说明                                                           |
| ------------ | -------------------------------------------------------------- | -------------------------------------- |
| expires      | 设置网页的过期时间。                                           |
|              | refresh                                                        | 设置网页自动刷新的时间间隔，单位是秒。 |
| content-type | 定义文件的类型，用来告诉浏览器该以什么格式和编码来解析此文件。 |

```html
<meta http-equiv="content-type" content="text/html" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="refresh" content="1000" />
```

4.content-type 常用属性值

| 常用属性值           | 说明                                         |
| -------------------- | -------------------------------------------- | ------------------------------ |
| text/html            |                                              | 表示该文档是 HTML 格式的文档。 |
| text/plain           | 表示该文档是纯文本格式的文档。               |
| text/xml             | 表示该文档是 XML 格式的文档。                |
| image/gif、jpeg、png | 表示该文档是 gif、jpeg、png 图片格式的文档。 |

可以设置 No-cache 配置

```html
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
```

## 6.form 如何关闭自动完成功能

form 或下面某个 input 设置为 `autocomplete = off`。

## 7.页面可见性（Page Visibility）

浏览器标签页被隐藏或显示的时候会触发 visibilitychange 事件。
这是 HTML5 新提供的一个 api，作用是记录当前标签页在浏览器中的激活状态。

具体可查看阮老师的文章
[Page Visibility API 教程](https://www.ruanyifeng.com/blog/2018/10/page_visibility_api.html)

## 8.渐进增强和优雅降级之间的区别

渐进增强：先以低版本开始，保证基本的功能情况下，再针对高级浏览器进行效果，交互等方面的改进和追加功能，以达到更好的用户体验。

优雅降级：一开始就针对高版本的浏览器构建页面，先完善所有的功能，然后再针对低版本的浏览器进行兼容。

## 9.为什么利用多个域名来存储网站资源会更有效 （这是在掘友一篇文章中看到的，也记录下）

- CDN 缓存更加方便；
- 突破浏览器并发限制；
- 节约 cookie 宽带；
- 节约主域名的连接数，优化页面下响应速度；
- 防止不必要的安全问题；

[html 篇--这可能是目前较为全面的 html 面试知识点了吧](https://juejin.cn/post/6844904180943945742#heading-62)

## 10.缓存

[缓存的作用](https://github.com/amandakelake/blog/issues/43)

少了 Service Worker 做一下补充

[Service Worker —这应该是一个挺全面的整理](https://juejin.cn/post/6844903613270081543)
