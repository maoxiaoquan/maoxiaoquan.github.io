#### 性能优化

- 资源：

  - js、css 资源压缩，公共 js、css 提取，删除不必要的代码
  - 使用 css 渲染合成层如 transform、opacity、will-change 等，提高页面相应速度减少卡顿现象。
  - 动画使用 CSS3 过渡，减少动画复杂度，还可以使用硬件加速
  - 资源走 cdn
  - 图片无损压缩，高质量图片首次只加载低倍率图片，或者做高斯层级，图片不在可视区域就不读取，放 data 上
  - 资源或者数据走 协商缓存，强缓存

- 数据

  - 对于非实时性数据，在 BFF 层，数据组合层走缓存，二次请求不用走数据库
  - 首屏可视区域数据单独提取，因为用户第一眼看到的就是首屏，非首屏可视区域数据不在首屏数据接口加入，需要滑动或者操作才能到其他页面，但是在首屏加载到用户操作跳转或者滑动这个时间段内，时间可能很短，但是确能最快把首屏渲染出来

- 逻辑

  - 走防抖和节流
  - 逻辑优化，优化代码逻辑，

- 服务端渲染
- 走 ssr csr isr

#### react 框架篇

#### vue 框架篇

#### qiankun 框架篇

- 导出相应的生命周期钩子
  微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。
- bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
- 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。

```js
export async function bootstrap() {
  console.log("react app bootstraped");
}
```

- 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法

```js
export async function mount(props) {
  ReactDOM.render(
    <App />,
    props.container
      ? props.container.querySelector("#root")
      : document.getElementById("root")
  );
}
```

- 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例

```js
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container
      ? props.container.querySelector("#root")
      : document.getElementById("root")
  );
}
```

- 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效

```js
export async function update(props) {
  console.log("update props", props);
}
```

### 难点项目

之前做的一个需求，后台上传一张 20 多 m 的大图，并且在图上标点，h5 页面加载这张图，并且渲染这些可操作标点，而且可以缩放，移动，但是用户群体不同，手机的性能也不同，一些手机开了比较多的应用，这个时候打开浏览器，android 或者 ios 系统分配给浏览器的可使用内容比较少，这个你再去手机端 canvas 渲染这张大图，并且渲染这些标点的，移动缩放，浏览器需要占用大量内存，到达上限时，导致浏览器卡顿，或者白屏重启，这个就需要做逻辑上的性能优化了，图片要做成瓦片地图，并且分成几个倍率加载，首次加载低倍率图，并且加载可视区域内，非可视区域不加载
