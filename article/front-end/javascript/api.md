---
sidebar: auto
---

# JavaScript 标准库

## Array

### Array.from()

方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例.

```js
console.log(Array.from('foo'))
// ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x))
// [2, 4, 6]
```

#### 语法

```js
Array.from(arrayLike[, mapFn[, thisArg]])
```

- 参数：
  - arrayLike 想要转换成数组的伪数组对象或可迭代对象.
  - mapFn 可选 如果指定了该参数，新数组中的每个元素会执行该回调函数.
  - thisArg 可选 可选参数，执行回调函数 mapFn 时 this 对象.
- 返回值：
  - 一个新的数组实例.

---

### Array.isArray()

Array.isArray()用于确定传递的值是否是一个 Array。

```js
Array.isArray([1, 2, 3])
// true
Array.isArray({
  foo: 123,
})
// false
Array.isArray('foobar')
// false
Array.isArray(undefined)
// false
```

#### 语法

```js
Array.isArray(obj)
```

- 参数：
  - obj 需要检测的值.
- 返回值：
  - 如果值是 Array，则为 true；否则为 false.

---

### Array.of()

Array.of() 方法创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。

```js
Array.of(7) // [7]
Array.of(1, 2, 3) // [1, 2, 3]

Array(7) // [ , , , , , , ]
Array(1, 2, 3) // [1, 2, 3]
```

#### 语法

```js
Array.of(element0[, element1[, ...[, elementN]]])
```

- 参数：
  - elementN 任意个参数，将按顺序成为返回数组中的元素。
- 返回值：
  - 新的 Array 实例。

---

### Array.prototype.concat()

Array.prototype.concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

```js
const array1 = ['a', 'b', 'c']
const array2 = ['d', 'e', 'f']
const array3 = array1.concat(array2)

console.log(array3)
// expected output: Array ["a", "b", "c", "d", "e", "f"]
```

#### 语法

```js
var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])
```

- 参数：
  - elementN 任意个参数，将按顺序成为返回数组中的元素。
- 返回值：
  - 新的 Array 实例。

---

### Array.prototype.copyWithin()

Array.prototype.copyWithin() 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。

```js
const array1 = ['a', 'b', 'c', 'd', 'e']

// copy to index 0 the element at index 3
console.log(array1.copyWithin(0, 3, 4))
// expected output: Array ["d", "b", "c", "d", "e"]

// copy to index 1 all elements from index 3 to the end
console.log(array1.copyWithin(1, 3))
// expected output: Array ["d", "d", "e", "d", "e"]
```

#### 语法

```js
arr.copyWithin(target[, start[, end]])
```

- 参数：

  - target
    - 0 为基底的索引，复制序列到该位置。如果是负数，target 将从末尾开始计算。
    - 如果 target 大于等于 arr.length，将会不发生拷贝。如果 target 在 start 之后，复制的序列将被修改以符合 arr.length。
  - start
    - 0 为基底的索引，开始复制元素的起始位置。如果是负数，start 将从末尾开始计算。
    - 如果 start 被忽略，copyWithin 将会从 0 开始复制。
  - end

    - 0 为基底的索引，开始复制元素的结束位置。copyWithin 将会拷贝到该位置，但不包括 end 这个位置的元素。如果是负数， end 将从末尾开始计算。
    - 如果 end 被忽略，copyWithin 方法将会一直复制至数组结尾（默认为 arr.length）。

- 返回值：
  - 改变后的数组

---

### Array.prototype.entries()

Array.prototype.entries() 方法返回一个新的 Array Iterator 对象，该对象包含数组中每个索引的键/值对。

```js
const array1 = ['a', 'b', 'c']

const iterator1 = array1.entries()

console.log(iterator1.next().value)
// expected output: Array [0, "a"]

console.log(iterator1.next().value)
// expected output: Array [1, "b"]
```

#### 语法

```js
arr.entries()
```

- 返回值：
  - 一个新的 Array 迭代器对象。Array Iterator 是对象，它的原型（**proto**:Array Iterator）上有一个 next 方法，可用用于遍历迭代器取得原数组的[key,value]。

---

### Array.prototype.every()

Array.prototype.every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

> 注意：若收到一个空数组，此方法在一切情况下都会返回 true。

```js
const isBelowThreshold = (currentValue) => currentValue < 40

const array1 = [1, 30, 39, 29, 10, 13]

console.log(array1.every(isBelowThreshold))
// expected output: true
```

#### 语法

```js
arr.every(callback[, thisArg])
```

- 参数：

  - callback
    用来测试每个元素的函数，它可以接收三个参数：
    - element
      用于测试的当前值。
    - index 可选
      用于测试的当前值的索引。
    - array 可选
      调用 every 的当前数组。
  - thisArg
    执行 callback 时使用的 this 值。

- 返回值：
  - 如果回调函数的每一次返回都为 truthy 值，返回 true ，否则返回 false

---

### Array.prototype.fill()

Array.prototype.fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

```js
const array1 = [1, 2, 3, 4]

// fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4))
// expected output: [1, 2, 0, 0]

// fill with 5 from position 1
console.log(array1.fill(5, 1))
// expected output: [1, 5, 5, 5]

console.log(array1.fill(6))
// expected output: [6, 6, 6, 6]
```

#### 语法

```js
arr.fill(value[, start[, end]])
```

- 参数：

  - value
    用来填充数组元素的值。
  - start 可选
    起始索引，默认值为 0。
  - end 可选
    终止索引，默认值为 this.length。

- 返回值：
  - 修改后的数组。

---

### Array.prototype.filter()

Array.prototype.filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

```js
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present']

const result = words.filter((word) => word.length > 6)

console.log(result)
// expected output: Array ["exuberant", "destruction", "present"]
```

#### 语法

```js
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

- 参数：

  - callback
    用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。它接受以下三个参数：
    - element
      数组中当前正在处理的元素。
    - index 可选
      正在处理的元素在数组中的索引。
    - array 可选
      调用了 filter 的数组本身。
  - thisArg 可选
    执行 callback 时，用于 this 的值。

- 返回值：
  - 一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

---

### Array.prototype.find()

Array.prototype.find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

```js
const array1 = [5, 12, 8, 130, 44]

const found = array1.find((element) => element > 10)

console.log(found)
// expected output: 12
```

#### 语法

```js
arr.find(callback[, thisArg])
```

- 参数：

  - callback
    在数组每一项上执行的函数，接收 3 个参数：
    - element
      当前遍历到的元素。
    - index 可选
      当前遍历到的索引。
    - array 可选
      数组本身。
  - thisArg 可选
    执行回调时用作 this 的对象。

- 返回值：
  - 数组中第一个满足所提供测试函数的元素的值，否则返回 undefined。

---

### Array.prototype.findIndex()

Array.prototype.findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。

```js
const array1 = [5, 12, 8, 130, 44]

const isLargeNumber = (element) => element > 13

console.log(array1.findIndex(isLargeNumber))
// expected output: 3
```

#### 语法

```js
arr.findIndex(callback[, thisArg])
```

- 参数：

  - callback
    针对数组中的每个元素, 都会执行该回调函数, 执行时会自动传入下面三个参数:
    - element
      当前元素。
    - index
      当前元素的索引。
    - array
      调用 findIndex 的数组。
  - thisArg
    可选。执行 callback 时作为 this 对象的值.

- 返回值：
  - 数组中通过提供测试函数的第一个元素的索引。否则，返回-1

---

### Array.prototype.flat()

Array.prototype.flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```js
var arr1 = [1, 2, [3, 4]]
arr1.flat()
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]]
arr2.flat()
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]]
arr3.flat(2)
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]]
arr4.flat(Infinity)
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

#### 语法

```js
arr.findIndex(callback[, thisArg])
```

- 参数：

  - depth 可选
    指定要提取嵌套数组的结构深度，默认值为 1。

- 返回值：
  - 一个包含将数组与子数组中所有元素的新数组。

---
