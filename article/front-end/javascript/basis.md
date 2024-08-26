---
sidebar: auto
---

# Javascript

> 面试 Javascript 方面的一些问题，或者介绍，持续更新

## 1.JS 的数据类型

```javascript
String;
Number;
Boolean;
Undefined;
BigInt;
Symbol;
null;
Object;
Function;
```

## 2.作用域

[JavaScript 的静态作用域链与“动态”闭包链](https://juejin.cn/post/6957913856488243237)

ECMAScript 变量可以包含两种不同类型的数据：原始值和引用值。

原始值（primitive value）就是最简单的数据

引用值（reference value）则是由多个值构成的对象。在把一个值赋给变量时，JavaScript 引擎必须确定这个值是原始值还是引用值。引用值是保存在内存中的对象。与其他语言不同，JavaScript 不允许直接访问内存位置，因此也就不能直接操作对象所在的内存空间。在操作对象时，实际上操作的是对该对象的引用（reference）而非
实际的对象本身。为此，保存引用值的变量是按引用（by reference）访问的。

`JavaScript采用的是词法作用域，函数的作用域基于函数创建的位置。`

## 3.原型、原型链

[JavaScript 深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)

关于原型链，我就不重复了，有很多总结的文章

```js
Function.prototype.xxx
创建的function通过原型链，就能获取到原型上的方法

Object.prototype.xxx
创建的object通过原型链，就能获取到原型上的方法

xxx.__proto__ == Xxx.prototype
xxx.prototype.__proto__ == Object.prototype.xxx
```

## 4.变量声明和函数声明

[JavaScript 深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4)

[浅谈 JS 变量提升](https://zhuanlan.zhihu.com/p/100563316)

- 函数提升优先级高于变量提升
- 当函数声明与变量名相同时，在变量赋值前，函数声明依旧是函数声明，不会被覆盖，当变量赋值后，函数声明被同变量覆盖

  1.第一个示例

```js
console.log(typeof a);
a();
var a = 3;
function a() {
  console.log(typeof a);
}
console.log(typeof a);
a = 6;
a();
```

答案

```js
"function";

"function";

"number";

"a is not a function";
```

2.第二个示例

```js
console.log(a);

console.log(typeof f);

var flag = true;

if (!flag) {
  var a = 1;
}

if (flag) {
  function f(a) {
    f = a;
    console.log("1");
  }
}
console.log(typeof f);
```

```js
"undefined";

"undefined";

"function";
```

在非严格模式下，代码块中，只有使用 var 声明的变量和函数声明是可以提升的，但是函数声明只能将函数的名字提升出去

3.第三个示例

```js
function f() {
  console.log(typeof f); //function
  // var f = 3;
  f = 3;
  console.log(typeof f); //number
}

f();

var s = function s() {
  console.log(typeof s); //function
  // var s = 3;
  s = 3;
  console.log(typeof s); //function
};

s();
```

上述代码中，函数 f 是具名函数，函数 s 是函数表达式。具名函数中，可以在函数内部改变函数名，而函数表达式，如果有函数名，则它的函数名只能作用在其自身作用域中，且不可改变改变函数名。

以上的代码是 copy 自[浅谈 JS 变量提升](https://zhuanlan.zhihu.com/p/100563316)

## 5.Promise 实现

[9k 字 | Promise/async/Generator 实现原理解析](https://juejin.cn/post/6844904096525189128#heading-1)

## 6.js - 设计模式

[JavaScript 设计模式 es6（23 种](https://juejin.cn/post/6844904032826294286)

[js - 观察者模式与订阅发布模式](https://www.cnblogs.com/cc-freiheit/p/11356073.html)

## 7.虚拟 DOM

[从了解到深入虚拟 DOM 和实现 diff 算法](https://juejin.cn/post/6990582632270528525?from=main_page)

## 8.手写 call、apply、bind 原理基础版

1.call

```js
Function.prototype.myCall = function (ctx, ...arg) {
  ctx.fn = this;
  const result = ctx.fn(...arg);
  delete ctx.fn;
  return result;
};
var obj = {
  a: 5,
  b: 1,
};
function abc(c, d) {
  console.log(this.a - this.b - c - d);
  return this.a - this.b - c - d;
}
console.log("abc.myCall(obj, 1, 5)", abc.myCall(obj, 1, 5)); // - 2
```

2.apply

apply 和 call 类似的，只不过传参不一样，
apply 这里自己初学 js 时留过一个坑，自己没看清 api 介绍，以为被 apply 后的函数，接受也必须是一个数组，后来意识到自己当时有多粗心

apply 第二个参数可以为 arguments

```js
Function.prototype.myApply = function (ctx, arg) {
  ctx.fn = this;
  const result = ctx.fn(...arg);
  delete ctx.fn;
  return result;
};
var obj = {
  a: 5,
  b: 1,
};
function abc(c, d) {
  console.log(this.a - this.b - c - d);
  return this.a - this.b - c - d;
}
console.log("abc.myApply(obj, 1, 5)", abc.myApply(obj, [1, 5])); // - 2
```

3.bind

bind 和 call 接受参数是一样的，只不过会返回一个函数，通过返回函数执行 call 或者 apply

```js
Function.prototype.myBind = function (ctx, ...arg) {
  const that = this;
  return function () {
    // 结合上面的apply方法
    return that.myApply(ctx, arg);
  };
};
console.log("abc.myBind(obj, 1, 5)", abc.myBind(obj, 1, 5)()); // - 2
```

## 9. 手写简版 new

```js
function myNew() {
  var obj = new Object();
  var Fn = [].shift.call(arguments);
  obj._proto_ = Fn.prototype;
  var res = Fn.call(obj, arguments);
  return typeof res === "object" ? res : obj; //确保构造器总是返回一个对象
}
```

## 10.节流和防抖

1.防抖

```js
function debounce(fb, wait) {
  var timeout;
  return function () {
    var that = this;
    var args = arguments;
    clearTimeout(timeout);
    setTimeout(function () {
      fb.apply(that, args);
    }, wait);
  };
}
```

2.节流

```js
function throttle(fn) {
  var timeout;
  return function () {
    var that = this;
    var args = arguments;
    if (timeout) return;
    setTimeout(function () {
      fn.apply(that, args);
      timeout = null;
    }, wait);
  };
}

function throttle(fn, wait) {
  var previous = 0;
  return function () {
    var that = this;
    var args = arguments;
    var now = +new Date();
    if (now - previous > wait) {
      fn.apply(that, args);
      previous = now;
    }
  };
}
```

## 11.浅拷贝和深拷贝

浅拷贝和深拷贝主要是对引用的考察

1.浅拷贝

- Object.assign()
- Array.prototype.concat()
- ...展开弗

  2.深拷贝

```js
JSON.parse(JSON.stringify());
这个是最简单的，但是弊端
拷贝其他引用类型、拷贝函数、循环引用等一些缺陷
```

```js
function deepClone(obj) {
  if (typeof obj !== "object") return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}
```

[JavaScript 专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)

## 12.实现 JSON.parse

```js
function parse(jsonStr) {
  return eval("(" + jsonStr + ")");
}
```

## 13.数组排序、去重

1.排序

[十大经典排序算法总结](https://juejin.cn/post/6844903444365443080)

2.去重

```js
1. [...new Set(arr)]
2. 类似indexof判断是否有，无就添加
```

## 14.数组扁平化

递归的方法

```js
function flat(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      newArr = newArr.concat(flat(arr[i]));
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
```

toString

```js
toString().split(",");
```

es6

```js
flat(Infinity);
```

## 15.instanceof 的实现

```js
function instance_of(L, R) {
  let O = L.__proto__;
  const P = R.prototype;
  while (O) {
    if (O === P) return true;
    O = O.__proto__;
  }
  return false;
}
```

## 16.JsonP 的原理

[JavaScript 跨域请求 jsonp 原理](https://zhuanlan.zhihu.com/p/344632485)

## 17.事件机制/Event Loop

[从 event loop 规范探究 javaScript 异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5)

[这一次，彻底弄懂 JavaScript 执行机制](https://juejin.cn/post/6844903512845860872#comment)

## 18.静态作用域与动态作用域

- 因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了
- 而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的
