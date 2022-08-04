---
sidebar: auto
---

# CSS

> 面试 css 方面的一些问题，或者介绍，持续更新

## 1.css 选择器

[菜鸟教程](https://www.runoob.com/cssref/css-selectors.html)

[阮一锋 CSS 选择器笔记](http://www.ruanyifeng.com/blog/2009/03/css_selectors.html)

新增的 css3 选择器可以再看下，过一遍

优先级：!important > 内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器

如果优先级相同后者覆盖前者，直接编写的样式优先级大于继承的样式

## 2.盒模型

1.W3C 盒子模型(标准盒模型 content-box)

`width = content-width`

`height = content-height `

2.IE 盒子模型(怪异盒模型 border-box)

`width = content-width + padding-width + border-width`

`height = content-height + padding-height + border-height`

通常我们会在根元素使用 `box-sizing: border-box;` 改变盒子模型，

`box-sizing`属性介绍是： CSS 中的 box-sizing 属性定义了 user agent 应该如何计算一个元素的总宽度和总高度

值有这些 content-box|border-box|inherit|initial|unset; 主讲前两个，内容来源于 mozilla

- content-box 是默认值。如果你设置一个元素的宽为 100px，那么这个元素的内容区会有 100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
- border-box 告诉浏览器：你想要设置的边框和内边距的值是包含在 width 内的。也就是说，如果你将一个元素的 width 设为 100px，那么这 100px 会包含它的 border 和 padding，内容区的实际宽度是 width 减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高，border-box 全局使用时，注意的坑是引入组件库，要注意组件库是否使用此属性。

## 3.BFC (块级格式化上下文)

> 一个元素形成了 BFC 之后，那么它内部元素产生的布局不会影响到外部元素，外部元素的布局也不会影响到 BFC 中的内部元素，一个 BFC 就像是一个隔离区域，和其他区域互不影响。

1.创建 BFC

- float 不为 none
- position 不为 static
- 弹性元素 display = inline-block | flex | inline-flex | table-cell | table-caption
- 网格元素 display = grid 或 inline-grid 元素的直接子元素等等。
- overflow 的值不为 visible（默认）

  2.使用的场景

- BFC 垂直方向，边距重叠
- 不会与 float 重叠
- 防止浮动导致父元素高度塌陷
- 清除浮动

## 4.清除浮动

可以从上文中的 BFC 中获得一些方法
方案有汗多，当前只列出一种，适合自己的就可以

```css
.clear:after {
  　　content: "";
  　　height: 0;
  　　line-height: 0;
  　　display: block;
  　　visibility: hidden;
  　　clear: both;
}

.clear {
  　　zoom: 1; /*为了兼容IE*/
}
```

## 5.Flex 布局 display:flex

[阮老师 Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## 6.Grid 布局 display: grid

[阮老师 CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

## 7.display:inline-block 间隔

1.同一行或把所有子标签写在同一行

2.使用浮动

3.父元素中设置 font-size: 0

## 8.Box 垂直居中&&水平居中

1.table 表格法

思路：显示设置父元素为：table，子元素为：cell-table，vertical-align: center

优点：父元素（parent）可以动态的改变高度（table 元素的特性），缺点：IE8 以下不支持

2.-50%定位法

思路：子元素绝对定位，距离顶部左边各 50%，然后使用 css3 transform:translate(-50%; -50%)

3.使用 css3 flex 布局法

思路：父元素 display: flex; justify-content: center;align-items: center;

4.使用 css3 flex||grid 布局法

思路：父元素 display: grid; 子元素 align-self: center; justify-self: center;

5.绝对定位法

思路：父元素使用定位（相对/绝对都行），子元素设置 position:absolute; top: 0; left: 0; bottom: 0; right: 0; margin:auto;

方式其实还有很多，我就列几种常用的

## 9.布局方案

往上一点，我们的布局方案，大多是采用，浮动 float+position 来实现，能满足所有的要求
现在我们大多是采用 flex、grid 布局，flex 采用的还是多一点，grid 很强大但是兼容还是存在问题，常见的布局，我就不列了

比如，移动端和小程序可以通过 flex 上下固定，中间自适应滚动布局

```html
<style>
  html,
  body {
    height: 100%;
  }
  .wrap {
    display: flex;
    -webkit-box-orient: vertical;
    flex-direction: column;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .header,
  .footer {
    height: 40px;
    line-height: 40px;
    background-color: #d8d8d8;
    text-align: center;
  }
  .main {
    flex: 1;
    width: 100%;
    overflow: auto;
  }
</style>

<body>
  <div class="wrap">
    <div class="header">header</div>
    <div class="main">弹性滚动区域</div>
    <div class="footer">footer</div>
  </div>
</body>
```

还有很多，后续看补充下

## 10.CSS 创建三角形

思路一般是，宽高设为 0，三边 color 设置为 transparent

```css
.box {
  width: 0px;
  height: 0px;
  border: 50px solid;
  border-color: transparent transparent transparent #ef4848;
}
```

## 11.CSS 1px 有啥方案

[1px 本站大佬的方案](https://juejin.cn/post/6844903935719768072)

1px 的方案有很多种，只能列一个适合自己的，搭配 scss 或者 less 来实现会好很多

## 12.视差滚动效果

视差滚动（Parallax Scrolling）是指让多层背景以不同的速度移动，形成立体的运动效果，带来非常出色的视觉体验。

关于视差是我帮别人做项目，然后强烈要求加入视差，然后就开始各种搜索

[张鑫旭大神的 小 tip: 纯 CSS 实现视差滚动效果](https://www.zhangxinxu.com/wordpress/2015/03/css-only-parallax-effect/)

[lax.js 我推荐的库是这个](https://github.com/alexfoxy/lax.js)

## 13.calc 函数 （css3 新增的一个计算函数）

`介绍：calc函数是css3新增的功能，可以使用calc()计算border、margin、pading、font-size和width等属性设置动态值。`

```css
width: calc(100% + 100px);
width: calc(100% - 100px);
width: calc(100% * 100px);
width: calc(100% / 100px);
```

## 14.rem

`rem 根元素的字体大小。rem是一个相对的CSS单位，1rem等于html元素上font-size的大小`

rem 曾经是移动端布局的首选方案，简单点就是根据屏幕的大小，动态的改变 html 标签的 font-size 的大小，配合 meta 标签中的 dpr，通过计算最后得出转换后的单位，不过该方案现在用的少，新方案采用 vw

现在自适应布局，不太考虑兼容老的浏览器情况下是使用 rem 还是一个挺好的方案，配合媒体查询

[Rem 布局的原理解析](https://zhuanlan.zhihu.com/p/30413803) 知乎上大佬讲的也很好

## 15.vw vh

CSS3 规范，视口单位主要包括以下 4 个：

```
  1.vw：1vw等于视口宽度的1%。

  2.vh：1vh等于视口高度的1%。

  3.vmin：选取vw和vh中最小的那个。

  4.vmax：选取vw和vh中最大的那个。
```

[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 配合这个包来实现，包括上面的 rem 也可以

[真的，移动端尺寸自适应与 dpr 无关 这篇文章写的挺好的](https://juejin.cn/post/6844903629111951373)

## 16. rgba 和 opacity

1.rgba 和 opacity 都能实现透明效果，但最大的不同在于 opacity 作用于元素本身以及元素内的所有内容，而 rgba 只作用于元素本身，子元素不会继承透明效果。

2.rgba 是 CSS3 的属性，用法说明：rgba(R,G,B,A)，参数说明 R（红色值。正整数|百分数），G（绿色值。正整数|百分数），B（蓝色值。正整数|百分比），A（Alpha 透明度。0（透明）~1）。IE6-8 不支持 rgba 模式，可以使用 IE 滤镜处理：

3.opacity 也是 CSS3 的属性，用法说明：opacity:value 其中 value 取值 0（透明）~1

## 17.Filter

[CSS filter 有哪些神奇用途](https://juejin.cn/post/6966036468619804679)

[https://www.cnblogs.com/coco1s/p/7519460.html](https://www.cnblogs.com/coco1s/p/7519460.html)

直接附上大佬们的文章

后续补充中 。。。。
