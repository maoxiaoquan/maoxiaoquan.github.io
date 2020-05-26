---
sidebar: auto
---

# JavaScript标准库

## Array

### Array.from()

方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例.

``` js
console.log(Array.from('foo'));
// ["f", "o", "o"]

console.log(Array.from([1, 2, 3], x => x + x));
// [2, 4, 6]
```

### 语法
``` js
Array.from(arrayLike[, mapFn[, thisArg]])
```

* 参数：
   - arrayLike 想要转换成数组的伪数组对象或可迭代对象.
   - mapFn 可选  如果指定了该参数，新数组中的每个元素会执行该回调函数.
   - thisArg 可选 可选参数，执行回调函数mapFn 时 this对象.
* 返回值：
   - 一个新的数组实例.


### Array.isArray()

Array.isArray()用于确定传递的值是否是一个Array。

``` js
Array.isArray([1, 2, 3]);
// true
Array.isArray({foo: 123});
// false
Array.isArray("foobar");
// false
Array.isArray(undefined);
// false
```

### 语法
``` js
Array.isArray(obj)
```

* 参数：
  - obj 需要检测的值.
* 返回值：
  - 如果值是Array，则为true；否则为false.

