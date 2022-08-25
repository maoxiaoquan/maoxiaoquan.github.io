---
sidebar: auto
---

# Rust 入门

原文 ：https://course.rs/basic/compound-type/enum.html
本文学习笔记

## 入门

### 基本类型

#### 数值类型

##### 整数类型

```rust
let x = 8
let y:u16 = 8 // u16
let z:i16 = 8 // i16
```

整数是没有小数部分的数字。之前使用过的 i32 类型，表示有符号的 32 位整数（ i 是英文单词 integer 的首字母，与之相反的是 u，代表无符号 unsigned 类型）。下表显示了 Rust 中的内置的整数类型：

| 长度       | 有符号类型 | 无符号类型 |
| ---------- | ---------- | ---------- |
| 8 位       | i8         | u8         |
| 16 位      | i16        | u16        |
| 32 位      | i32        | u32        |
| 64 位      | i64        | u64        |
| 128 位     | i128       | u128       |
| 视架构而定 | isize      | usize      |

类型定义的形式统一为：有无符号 + 类型大小(位数)。`无符号数表示数字只能取正数，而有符号则表示数字既可以取正数又可以取负数`。就像在纸上写数字一样：当要强调符号时，数字前面可以带上正号或负号；然而，当很明显确定数字为正数时，就不需要加上正号了。有符号数字以补码形式存储。

此外，isize 和 usize 类型取决于程序运行的计算机 CPU 类型： 若 CPU 是 32 位的，则这两个类型是 32 位的，同理，若 CPU 是 64 位，那么它们则是 64 位。

---

##### 浮点数型（Floating-Point）

rust 与其它语言一样支持 32 位浮点数（f32）和 64 位浮点数（f64）。默认情况下，64.0 将表示 64 位浮点数，因为现代计算机处理器对两种浮点数计算的速度几乎相同，但 64 位浮点数精度更高。

```rust
fn main() {
  let x = 2.0; // f64
  let y: f32 = 3.0; // f32
}
```

---

##### 字符类型(char)

字符，你可以把它理解为英文中的字母，中文中的汉字。

```rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let g:char = '国';
    let heart_eyed_cat = '😻';
}
```

---

##### 布尔(bool)

Rust 中的布尔类型有两个可能的值：true 和 false，布尔值占用内存的大小为 1 个字节：

```rust
fn main() {
    let t = true;
    let f: bool = false; // 使用类型标注,显式指定f的类型
    if f {
        println!("这是段毫无意义的代码");
    }
}
```

---

##### NaN

对于数学上未定义的结果，例如对负数取平方根 -42.1.sqrt() ，会产生一个特殊的结果：Rust 的浮点数类型使用 NaN (not a number)来处理这些情况。

所有跟 NaN 交互的操作，都会返回一个 NaN，而且 NaN 不能用来比较，下面的代码会崩溃：

```rust
fn main() {
  let x = (-42.0_f32).sqrt();
  assert_eq!(x, x);
}
```

---

##### 单元类型

单元类型就是 () ，对，你没看错，就是 () ，唯一的值也是 () ，一些读者读到这里可能就不愿意了，你也太敷衍了吧，管这叫类型？

只能说，再不起眼的东西，都有其用途，在目前为止的学习过程中，大家已经看到过很多次 fn main() 函数的使用吧？那么这个函数返回什么呢？

没错， main 函数就返回这个单元类型 ()，你不能说 main 函数无返回值，因为没有返回值的函数在 Rust 中是有单独的定义的：发散函数( diverge function )，顾名思义，无法收敛的函数。

例如常见的 println!() 的返回值也是单元类型 ()。

再比如，你可以用 () 作为 map 的值，表示我们不关注具体的值，只关注 key。 这种用法和 Go 语言的 struct{} 类似，可以作为一个值用来占位，但是完全不占用任何内存。

---

##### 序列(Range)

Rust 提供了一个非常简洁的方式，用来生成连续的数值，例如 1..5，生成从 1 到 4 的连续数字，不包含 5 ；1..=5，生成从 1 到 5 的连续数字，包含 5，它的用途很简单，常常用于循环中：

```rust
for i in 1..=5 {
  println!("{}",i);
}
最终程序输出:

1
2
3
4
5
```

序列只允许用于数字或字符类型，原因是：它们可以连续，同时编译器在编译期可以检查该序列是否为空，字符和数字值是 Rust 中仅有的可以用于判断是否为空的类型。如下是一个使用字符类型序列的例子：

```rust
for i in 'a'..='z' {
 println!("{}",i);
}
```

---

##### 语句和表达式

Rust 的函数体是由一系列语句组成，最后由一个表达式来返回值，例如：

```rust
fn add_with_extra(x: i32, y: i32) -> i32 {
    let x = x + 1; // 语句
    let y = y + 5; // 语句
    x + y // 表达式
}
```

语句会执行一些操作但是不会返回一个值，而表达式会在求值后返回一个值，因此在上述函数体的三行代码中，前两行是语句，最后一行是表达式。

对于 Rust 语言而言，这种基于语句和表达式的方式是非常重要的，你需要能明确的区分这两个概念, 但是对于很多其它语言而言，这两个往往无需区分。基于表达式是函数式语言的重要特征，表达式总要返回值。

其实，在此之前，我们已经多次使用过语句和表达式。

---

##### 函数 rust

Rust 的函数我们在之前已经见过不少，跟其他语言几乎没有什么区别。因此本章的学习之路将轻松和愉快，骚年们，请珍惜这种愉快，下一章你将体验到不一样的 Rust。

在函数界，有一个函数只闻其名不闻其声，可以止小孩啼！在程序界只有 hello,world! 可以与之媲美，它就是 add 函数：

```rust
fn add(i: i32, j: i32) -> i32 {
   i + j
}
```

---

### 复合类型

#### 字符串

顾名思义，字符串是由字符组成的连续集合，但是在上一节中我们提到过，Rust 中的字符是 Unicode 类型，因此每个字符占据 4 个字节内存空间，但是在字符串中不一样，字符串是 UTF-8 编码，也就是字符串中的字符所占的字节数是变化的(1 - 4)，这样有助于大幅降低字符串所占用的内存空间。

Rust 在语言级别，只有一种字符串类型： str，它通常是以引用类型出现 &str，也就是上文提到的字符串切片。虽然语言级别只有上述的 str 类型，但是在标准库里，还有多种不同用途的字符串类型，其中使用最广的即是 String 类型。

str 类型是硬编码进可执行文件，也无法被修改，但是 String 则是一个可增长、可改变且具有所有权的 UTF-8 编码字符串，当 Rust 用户提到字符串时，往往指的就是 String 类型和 &str 字符串切片类型，这两个类型都是 UTF-8 编码。

除了 String 类型的字符串，Rust 的标准库还提供了其他类型的字符串，例如 OsString， OsStr， CsString 和 CsStr 等，注意到这些名字都以 String 或者 Str 结尾了吗？它们分别对应的是具有所有权和被借用的变量。

##### 字符串字面量是切片

```rust
let s = "Hello, world!";
实际上，s 的类型是 &str，因此你也可以这样声明：

let s: &str = "Hello, world!";
该切片指向了程序可执行文件中的某个点，这也是为什么字符串字面量是不可变的，因为 &str 是一个不可变引用。

```

##### String 与 &str 的转换

在之前的代码中，已经见到好几种从 &str 类型生成 String 类型的操作：

```rust
String::from("hello,world")
"hello,world".to_string()
```

那么如何将 String 类型转为 &str 类型呢？答案很简单，取引用即可：

```rust
fn main() {
  let s = String::from("hello,world!");
  say_hello(&s);
  say_hello(&s[..]);
  say_hello(s.as_str());
}

fn say_hello(s: &str) {
  println!("{}",s);
}
```

方法和操作是在 `String` 类型 下进行的

##### 操作

###### 追加 (Push)

在字符串尾部可以使用 push() 方法追加字符 char，也可以使用 push_str() 方法追加字符串字面量。这两个方法都是在原有的字符串上追加，并不会返回新的字符串。由于字符串追加操作要修改原来的字符串，则该字符串必须是可变的，即字符串变量必须由 mut 关键字修饰。

```rust
fn main() {
    let mut s = String::from("Hello ");
    s.push('r');
    println!("追加字符 char push() -> {}", s);

    s.push_str("ust!");
    println!("追加字符串 push_str() -> {}", s);
}
```

###### 插入 (Insert)

可以使用 insert() 方法插入单个字符 char，也可以使用 insert_str() 方法插入字符串字面量，与 push() 方法不同，这俩方法需要传入两个参数，第一个参数是字符（串）插入位置的索引，第二个参数是要插入的字符（串），索引从 0 开始计数，如果越界则会发生错误。由于字符串插入操作要修改原来的字符串，则该字符串必须是可变的，即字符串变量必须由 mut 关键字修饰。

示例代码如下：

```rust
fn main() {
    let mut s = String::from("Hello rust!");
    s.insert(5, ',');
    println!("插入字符 insert() -> {}", s);
    s.insert_str(6, " I like");
    println!("插入字符串 insert_str() -> {}", s);
}
```

###### 替换 (Replace)

如果想要把字符串中的某个字符串替换成其它的字符串，那可以使用 replace() 方法。与替换有关的方法有三个。

1、replace

该方法可适用于 String 和 &str 类型。replace() 方法接收两个参数，第一个参数是要被替换的字符串，第二个参数是新的字符串。该方法会替换所有匹配到的字符串。该方法是返回一个新的字符串，而不是操作原来的字符串。

示例代码如下：

```rust
fn main() {
    let string_replace = String::from("I like rust. Learning rust is my favorite!");
    let new_string_replace = string_replace.replace("rust", "RUST");
    dbg!(new_string_replace);
}
```

2、replacen

该方法可适用于 String 和 &str 类型。replacen() 方法接收三个参数，前两个参数与 replace() 方法一样，第三个参数则表示替换的个数。该方法是返回一个新的字符串，而不是操作原来的字符串。

示例代码如下：

```rust
fn main() {
    let string_replace = "I like rust. Learning rust is my favorite!";
    let new_string_replacen = string_replace.replacen("rust", "RUST", 1);
    dbg!(new_string_replacen);
}
```

3、replace_range

该方法仅适用于 String 类型。replace_range 接收两个参数，第一个参数是要替换字符串的范围（Range），第二个参数是新的字符串。该方法是直接操作原来的字符串，不会返回新的字符串。该方法需要使用 mut 关键字修饰。

示例代码如下：

```rust
fn main() {
    let mut string_replace_range = String::from("I like rust!");
    string_replace_range.replace_range(7..8, "R");
    dbg!(string_replace_range);
}
```

```
string_replace_range = "I like Rust!"
```

###### 删除 (Delete)

与字符串删除相关的方法有 4 个，他们分别是 pop()，remove()，truncate()，clear()。这四个方法仅适用于 String 类型。

1、 pop —— 删除并返回字符串的最后一个字符

该方法是直接操作原来的字符串。但是存在返回值，其返回值是一个 Option 类型，如果字符串为空，则返回 None。 示例代码如下：

```rust
fn main() {
    let mut string_pop = String::from("rust pop 中文!");
    let p1 = string_pop.pop();
    let p2 = string_pop.pop();
    dbg!(p1);
    dbg!(p2);
    dbg!(string_pop);
}
```

代码运行结果：

```
p1 = Some(
   '!',
)
p2 = Some(
   '文',
)
string_pop = "rust pop 中"
```

2、 remove —— 删除并返回字符串中指定位置的字符

该方法是直接操作原来的字符串。但是存在返回值，其返回值是删除位置的字符串，只接收一个参数，表示该字符起始索引位置。remove() 方法是按照字节来处理字符串的，如果参数所给的位置不是合法的字符边界，则会发生错误。

示例代码如下：

```rust
fn main() {
    let mut string_remove = String::from("测试remove方法");
    println!(
        "string_remove 占 {} 个字节",
        std::mem::size_of_val(string_remove.as_str())
    );
    // 删除第一个汉字
    string_remove.remove(0);
    // 下面代码会发生错误
    // string_remove.remove(1);
    // 直接删除第二个汉字
    // string_remove.remove(3);
    dbg!(string_remove);
}
```

代码运行结果：

```
string_remove 占 18 个字节
string_remove = "试remove方法"
```

3、truncate —— 删除字符串中从指定位置开始到结尾的全部字符

该方法是直接操作原来的字符串。无返回值。该方法 truncate() 方法是按照字节来处理字符串的，如果参数所给的位置不是合法的字符边界，则会发生错误。

示例代码如下：

```rust
fn main() {
    let mut string_truncate = String::from("测试truncate");
    string_truncate.truncate(3);
    dbg!(string_truncate);
}
```

代码运行结果：

```
string_truncate = "测"
```

4、clear —— 清空字符串

该方法是直接操作原来的字符串。调用后，删除字符串中的所有字符，相当于 truncate() 方法参数为 0 的时候。

示例代码如下：

```rust
fn main() {
    let mut string_clear = String::from("string clear");
    string_clear.clear();
    dbg!(string_clear);
}
```

代码运行结果：

```
string_clear = ""
```

###### 连接 (Catenate)

1、使用 + 或者 += 连接字符串

使用 + 或者 += 连接字符串，要求右边的参数必须为字符串的切片引用（Slice)类型。其实当调用 + 的操作符时，相当于调用了 std::string 标准库中的 add() 方法，这里 add() 方法的第二个参数是一个引用的类型。因此我们在使用 +， 必须传递切片引用类型。不能直接传递 String 类型。+ 和 += 都是返回一个新的字符串。所以变量声明可以不需要 mut 关键字修饰。

示例代码如下：

```rust
fn main() {
    let string_append = String::from("hello ");
    let string_rust = String::from("rust");
    // &string_rust会自动解引用为&str
    let result = string_append + &string_rust;
    let mut result = result + "!";
    result += "!!!";

    println!("连接字符串 + -> {}", result);
}
```

代码运行结果：

```
连接字符串 + -> hello rust!!!!
add() 方法的定义：
```

fn add(self, s: &str) -> String
因为该方法涉及到更复杂的特征功能，因此我们这里简单说明下：

```rust
fn main() {
    let s1 = String::from("hello,");
    let s2 = String::from("world!");
    // 在下句中，s1的所有权被转移走了，因此后面不能再使用s1
    let s3 = s1 + &s2;
    assert_eq!(s3,"hello,world!");
    // 下面的语句如果去掉注释，就会报错
    // println!("{}",s1);
}
```

self 是 String 类型的字符串 s1，该函数说明，只能将 &str 类型的字符串切片添加到 String 类型的 s1 上，然后返回一个新的 String 类型，所以 let s3 = s1 + &s2; 就很好解释了，将 String 类型的 s1 与 &str 类型的 s2 进行相加，最终得到 String 类型的 s3。

由此可推，以下代码也是合法的：

```
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

// String = String + &str + &str + &str + &str
let s = s1 + "-" + &s2 + "-" + &s3;
```

String + &str 返回一个 String，然后再继续跟一个 &str 进行 + 操作，返回一个 String 类型，不断循环，最终生成一个 s，也是 String 类型。

s1 这个变量通过调用 add() 方法后，所有权被转移到 add() 方法里面， add() 方法调用后就被释放了，同时 s1 也被释放了。再使用 s1 就会发生错误。这里涉及到所有权转移（Move）的相关知识。

2、使用 format! 连接字符串

format! 这种方式适用于 String 和 &str 。format! 的用法与 print! 的用法类似，详见格式化输出。

示例代码如下：

```rust
fn main() {
    let s1 = "hello";
    let s2 = String::from("rust");
    let s = format!("{} {}!", s1, s2);
    println!("{}", s);
}
```

代码运行结果：

```
hello rust!
```

---

#### 元组

元组是由多种类型组合到一起形成的，因此它是复合类型，元组的长度是固定的，元组中元素的顺序也是固定的。

可以通过以下语法创建一个元组：

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

用模式匹配解构元组

```rust
fn main() {
    let tup = (500, 6.4, 1);
    let (x, y, z) = tup;
    println!("The value of y is: {}", y);
}
```

用 . 来访问元组

```rust
fn main() {
     let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0;
    let six_point_four = x.1;
    let one = x.2;
}
```

和其它语言的数组、字符串一样，元组的索引从 0 开始。

元组的使用示例
元组在函数返回值场景很常用，例如下面的代码，可以使用元组返回多个值：

```rust
fn main() {
    let s1 = String::from("hello");
    let (s2, len) = calculate_length(s1);
    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len() 返回字符串的长度
    (s, length)
}
```

calculate_length 函数接收 s1 字符串的所有权，然后计算字符串的长度，接着把字符串所有权和字符串长度再返回给 s2 和 len 变量。

---

### 结构体

结构体跟之前讲过的元组有些相像：都是由多种类型组合而成。但是与元组不同的是，结构体可以为内部的每个字段起一个富有含义的名称。因此结构体更加灵活更加强大，你无需依赖这些字段的顺序来访问和解析它们。

定义结构体

通过关键字 struct 定义
一个清晰明确的结构体 名称
几个有名字的结构体 字段
例如, 以下结构体定义了某网站的用户：

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

创建结构体实例
为了使用上述结构体，我们需要创建 User 结构体的实例：

```rust
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};
```

有几点值得注意:
初始化实例时，每个字段都需要进行初始化
初始化时的字段顺序不需要和结构体定义时的顺序一致
访问结构体字段
通过 . 操作符即可访问结构体实例内部的字段值，也可以修改它们：

```

let mut user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};

user1.email = String::from("anotheremail@example.com");
```

需要注意的是，必须要将结构体实例声明为可变的，才能修改其中的字段，Rust 不支持将某个结构体某个字段标记为可变。

简化结构体创建
下面的函数类似一个构建函数，返回了 User 结构体的实例：

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}
```

它接收两个字符串参数： email 和 username，然后使用它们来创建一个 User 结构体，并且返回。可以注意到这两行： email: email 和 username: username，非常的扎眼，因为实在有些啰嗦，如果你从 TypeScript 过来，肯定会鄙视 Rust 一番，不过好在，它也不是无可救药：

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

如上所示，当函数参数和结构体字段同名时，可以直接使用缩略的方式进行初始化，跟 TypeScript 中一模一样。

结构体更新语法
在实际场景中，有一种情况很常见：根据已有的结构体实例，创建新的结构体实例，例如根据已有的 user1 实例来构建 user2：

```rust
let user2 = User {
    active: user1.active,
    username: user1.username,
    email: String::from("another@example.com"),
    sign_in_count: user1.sign_in_count,
};
```

老话重提，如果你从 TypeScript 过来，肯定觉得啰嗦爆了：竟然手动把 user1 的三个字段逐个赋值给 user2，好在 Rust 为我们提供了 结构体更新语法：

```rust
let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};
```

因为 user2 仅仅在 email 上与 user1 不同，因此我们只需要对 email 进行赋值，剩下的通过结构体更新语法 ..user1 即可完成。

.. 语法表明凡是我们没有显示声明的字段，全部从 user1 中自动获取。需要注意的是 ..user1 必须在结构体的尾部使用。

---

#### 枚举

枚举(enum 或 enumeration)允许你通过列举可能的成员来定义一个枚举类型，例如扑克牌花色：

```rust
enum PokerSuit {
  Clubs,
  Spades,
  Diamonds,
  Hearts,
}
```

目前来说，枚举值还不能带有值，因此先用结构体来实现：

```rust
enum PokerSuit {
    Clubs,
    Spades,
    Diamonds,
    Hearts,
}

struct PokerCard {
    suit: PokerSuit,
    value: u8
}

fn main() {
   let c1 = PokerCard {
       suit: PokerSuit::Clubs,
       value: 1,
   };
   let c2 = PokerCard {
       suit: PokerSuit::Diamonds,
       value: 12,
   };
}
```

这段代码很好的完成了它的使命，通过结构体 PokerCard 来代表一张牌，结构体的 suit 字段表示牌的花色，类型是 PokerSuit 枚举类型，value 字段代表扑克牌的数值。

可以吗？可以！好吗？说实话，不咋地，因为还有简洁得多的方式来实现：

```rust
enum PokerCard {
    Clubs(u8),
    Spades(u8),
    Diamonds(u8),
    Hearts(u8),
}

fn main() {
   let c1 = PokerCard::Spades(5);
   let c2 = PokerCard::Diamonds(13);
}
```

直接将数据信息关联到枚举成员上，省去近一半的代码，这种实现是不是更优雅？

不仅如此，同一个枚举类型下的不同成员还能持有不同的数据类型，例如让某些花色打印 1-13 的字样，另外的花色打印上 A-K 的字样：

```rust
enum PokerCard {
    Clubs(u8),
    Spades(u8),
    Diamonds(char),
    Hearts(char),
}

fn main() {
   let c1 = PokerCard::Spades(5);
   let c2 = PokerCard::Diamonds('A');
}
```

回想一下，遇到这种不同类型的情况，再用我们之前的结构体实现方式，可行吗？也许可行，但是会复杂很多。

---

#### 数组

在日常开发中，使用最广的数据结构之一就是数组，在 Rust 中，最常用的数组有两种，第一种是速度很快但是长度固定的 array，第二种是可动态增长的但是有性能损耗的 Vector，在本书中，我们称 array 为数组，Vector 为动态数组。

不知道你们发现没，这两个数组的关系跟 &str 与 String 的关系很像，前者是长度固定的字符串切片，后者是可动态增长的字符串。其实，在 Rust 中无论是 String 还是 Vector，它们都是 Rust 的高级类型：集合类型，在后面章节会有详细介绍。

对于本章节，我们的重点还是放在数组 array 上。数组的具体定义很简单：将多个类型相同的元素依次组合在一起，就是一个数组。结合上面的内容，可以得出数组的三要素：

长度固定
元素必须有相同的类型
依次线性排列
这里再啰嗦一句，我们这里说的数组是 Rust 的基本类型，是固定长度的，这点与其他编程语言不同，其它编程语言的数组往往是可变长度的，与 Rust 中的动态数组 Vector 类似，希望读者大大牢记此点。

创建数组
在 Rust 中，数组是这样定义的：

```rust
fn main() {
   let a = [1, 2, 3, 4, 5];
}
```

数组语法跟 JavaScript 很像，也跟大多数编程语言很像。由于它的元素类型大小固定，且长度也是固定，因此数组 array 是存储在栈上，性能也会非常优秀。与此对应，动态数组 Vector 是存储在堆上，因此长度可以动态改变。当你不确定是使用数组还是动态数组时，那就应该使用后者，具体见动态数组 Vector。

举个例子，在需要知道一年中各个月份名称的程序中，你很可能希望使用的是数组而不是动态数组。因为月份是固定的，它总是只包含 12 个元素：

let months = ["January", "February", "March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];
在一些时候，还需要为数组声明类型，如下所示：

let a: [i32; 5] = [1, 2, 3, 4, 5];
这里，数组类型是通过方括号语法声明，i32 是元素类型，分号后面的数字 5 是数组长度，数组类型也从侧面说明了数组的元素类型要统一，长度要固定。

还可以使用下面的语法初始化一个某个值重复出现 N 次的数组：

let a = [3; 5];
a 数组包含 5 个元素，这些元素的初始化值为 3，聪明的读者已经发现，这种语法跟数组类型的声明语法其实是保持一致的：[3; 5] 和 [类型; 长度]。

在元素重复的场景，这种写法要简单的多，否则你就得疯狂敲击键盘：let a = [3, 3, 3, 3, 3];，不过老板可能很喜欢你的这种疯狂编程的状态。

---

#### 动态数组 Vector

动态数组类型用 `Vec<T>` 表示，事实上，在之前的章节，它的身影多次出现，我们一直没有细讲，只是简单的把它当作数组处理。

动态数组允许你存储多个值，这些值在内存中一个紧挨着另一个排列，因此访问其中某个元素的成本非常低。动态数组只能存储相同类型的元素，如果你想存储不同类型的元素，可以使用之前讲过的枚举类型或者特征对象。

创建动态数组
在 Rust 中，有多种方式可以创建动态数组。

Vec::new
使用 Vec::new 创建动态数组是最 rusty 的方式，它调用了 Vec 中的 new 关联函数：

```
let v: Vec<i32> = Vec::new();
```

这里，v 被显式地声明了类型 `Vec<i32>`，这是因为 Rust 编译器无法从 Vec::new() 中得到任何关于类型的暗示信息，因此也无法推导出 v 的具体类型，但是当你向里面增加一个元素后，一切又不同了：

```
let mut v = Vec::new();
v.push(1);
```

此时，v 就无需手动声明类型，因为编译器通过 v.push(1)，推测出 v 中的元素类型是 i32，因此推导出 v 的类型是 `Vec<i32>`。

如果预先知道要存储的元素个数，可以使用 Vec::with_capacity(capacity) 创建动态数组，这样可以避免因为插入大量新数据导致频繁的内存分配和拷贝，提升性能

vec![]
还可以使用宏 vec! 来创建数组，与 Vec::new 有所不同，前者能在创建同时给予初始化值：

```
let v = vec![1, 2, 3];
```

同样，此处的 v 也无需标注类型，编译器只需检查它内部的元素即可自动推导出 v 的类型是 `Vec<i32>` （Rust 中，整数默认类型是 i32，在数值类型中有详细介绍）。

更新 Vector
向数组尾部添加元素，可以使用 push 方法：

```
let mut v = Vec::new();
v.push(1);
```

与其它类型一样，必须将 v 声明为 mut 后，才能进行修改。

Vector 与其元素共存亡
跟结构体一样，Vector 类型在超出作用域范围后，会被自动删除：

```
{
let v = vec![1, 2, 3];

    // ...

} // <- v 超出作用域并在此处被删除
```

当 Vector 被删除后，它内部存储的所有内容也会随之被删除。目前来看，这种解决方案简单直白，但是当 Vector 中的元素被引用后，事情可能会没那么简单。

从 Vector 中读取元素
读取指定位置的元素有两种方式可选：

通过下标索引访问。
使用 get 方法。

```
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("第三个元素是 {}", third);

match v.get(2) {
  Some(third) => println!("第三个元素是 {}", third),
  None => println!("去你的第三个元素，根本没有！"),
}
```

和其它语言一样，集合类型的索引下标都是从 0 开始，&v[2] 表示借用 v 中的第三个元素，最终会获得该元素的引用。而 v.get(2) 也是访问第三个元素，但是有所不同的是，它返回了 Option<&T>，因此还需要额外的 match 来匹配解构出具体的值。

下标索引与 .get 的区别
这两种方式都能成功的读取到指定的数组元素，既然如此为什么会存在两种方法？何况 .get 还会增加使用复杂度，让我们通过示例说明：

```
let v = vec![1, 2, 3, 4, 5];

let does_not_exist = &v[100];
let does_not_exist = v.get(100);
```

运行以上代码，&v[100] 的访问方式会导致程序无情报错退出，因为发生了数组越界访问。 但是 v.get 就不会，它在内部做了处理，有值的时候返回 Some(T)，无值的时候返回 None，因此 v.get 的使用方式非常安全。

既然如此，为何不统一使用 v.get 的形式？因为实在是有些啰嗦，Rust 语言的设计者和使用者在审美这方面还是相当统一的：简洁即正义，何况性能上也会有轻微的损耗。

既然有两个选择，肯定就有如何选择的问题，答案很简单，当你确保索引不会越界的时候，就用索引访问，否则用 .get。例如，访问第几个数组元素并不取决于我们，而是取决于用户的输入时，用 .get 会非常适合，天知道那些可爱的用户会输入一个什么样的数字进来！

同时借用多个数组元素
既然涉及到借用数组元素，那么很可能会遇到同时借用多个数组元素的情况，还记得在所有权和借用章节咱们讲过的借用规则嘛？如果记得，就来看看下面的代码 :)

```rust
let mut v = vec![1, 2, 3, 4, 5];
let first = &v[0];
v.push(6);
println!("The first element is: {}", first);
```

先不运行，来推断下结果，首先 first = &v[0] 进行了不可变借用，v.push 进行了可变借用，如果 first 在 v.push 之后不再使用，那么该段代码可以成功编译（原因见引用的作用域）。

可是上面的代码中，first 这个不可变借用在可变借用 v.push 后被使用了，那么妥妥的，编译器就会报错：

其实，按理来说，这两个引用不应该互相影响的：一个是查询元素，一个是在数组尾部插入元素，完全不相干的操作，为何编译器要这么严格呢？

原因在于：数组的大小是可变的，当旧数组的大小不够用时，Rust 会重新分配一块更大的内存空间，然后把旧数组拷贝过来。这种情况下，之前的引用显然会指向一块无效的内存，这非常 rusty —— 对用户进行严格的教育。

其实想想，在长大之后，我们感激人生路上遇到过的严师益友，正是因为他们，我们才在正确的道路上不断前行，虽然在那个时候，并不能理解他们，而 Rust 就如那个良师益友，它不断的在纠正我们不好的编程习惯，直到某一天，你发现自己能写出一次性通过的漂亮代码时，就能明白它的良苦用心。

若读者想要更深入的了解 `Vec<T>`，可以看看 Rustonomicon，其中从零手撸一个动态数组，非常适合深入学习

迭代遍历 Vector 中的元素
如果想要依次访问数组中的元素，可以使用迭代的方式去遍历数组，这种方式比用下标的方式去遍历数组更安全也更高效（每次下标访问都会触发数组边界检查）：

```rust
let v = vec![1, 2, 3];
for i in &v {
    println!("{}", i);
}
```

也可以在迭代过程中，修改 Vector 中的元素：

```rust
let mut v = vec![1, 2, 3];
for i in &mut v {
    *i += 10
}
```

---

#### KV 存储 HashMap

和动态数组一样，HashMap 也是 Rust 标准库中提供的集合类型，但是又与动态数组不同，HashMap 中存储的是一一映射的 KV 键值对，并提供了平均复杂度为 O(1) 的查询方法，当我们希望通过一个 Key 去查询值时，该类型非常有用，以致于 Go 语言将该类型设置成了语言级别的内置特性。

Rust 中哈希类型（哈希映射）为 HashMap<K,V>，在其它语言中，也有类似的数据结构，例如 hash map，map，object，hash table，字典 等等，引用小品演员孙涛的一句台词：大家都是本地狐狸，别搁那装貂 :)。

创建 HashMap
跟创建动态数组 Vec 的方法类似，可以使用 new 方法来创建 HashMap，然后通过 insert 方法插入键值对。

使用 new 方法创建

```rust
use std::collections::HashMap;

// 创建一个 HashMap，用于存储宝石种类和对应的数量
let mut my_gems = HashMap::new();

// 将宝石类型和对应的数量写入表中
my_gems.insert("红宝石", 1);
my_gems.insert("蓝宝石", 2);
my_gems.insert("河边捡的误以为是宝石的破石头", 18);

```

很简单对吧？跟其它语言没有区别，聪明的同学甚至能够猜到该 HashMap 的类型：HashMap<&str,i32>。
但是还有一点，你可能没有注意，那就是使用 HashMap 需要手动通过 use ... 从标准库中引入到我们当前的作用域中来，仔细回忆下，之前使用另外两个集合类型 String 和 Vec 时，我们是否有手动引用过？答案是 No，因为 HashMap 并没有包含在 Rust 的 prelude 中（Rust 为了简化用户使用，提前将最常用的类型自动引入到作用域中）。

所有的集合类型都是动态的，意味着它们没有固定的内存大小，因此它们底层的数据都存储在内存堆上，然后通过一个存储在栈中的引用类型来访问。同时，跟其它集合类型一致，HashMap 也是内聚性的，即所有的 K 必须拥有同样的类型，V 也是如此。

跟 Vec 一样，如果预先知道要存储的 KV 对个数，可以使用 HashMap::with_capacity(capacity) 创建指定大小的 HashMap，避免频繁的内存分配和拷贝，提升性能

##### 所有权转移

HashMap 的所有权规则与其它 Rust 类型没有区别：

若类型实现 Copy 特征，该类型会被复制进 HashMap，因此无所谓所有权
若没实现 Copy 特征，所有权将被转移给 HashMap 中
例如我参选帅气男孩时的场景再现：

```rust
fn main() {
    use std::collections::HashMap;

    let name = String::from("Sunface");
    let age = 18;

    let mut handsome_boys = HashMap::new();
    handsome_boys.insert(name, age);

    println!("因为过于无耻，{}已经被从帅气男孩名单中除名", name);
    println!("还有，他的真实年龄远远不止{}岁", age);
}
```

运行代码，报错如下：

```rust
error[E0382]: borrow of moved value: `name`
  --> src/main.rs:10:32
   |
4  |     let name = String::from("Sunface");
   |         ---- move occurs because `name` has type `String`, which does not implement the `Copy` trait
...
8  |     handsome_boys.insert(name, age);
   |                          ---- value moved here
9  |
10 |     println!("因为过于无耻，{}已经被除名", name);
   |                                            ^^^^ value borrowed here after move
```

提示很清晰，name 是 String 类型，因此它受到所有权的限制，在 insert 时，它的所有权被转移给 handsome_boys，所以最后在使用时，会遇到这个无情但是意料之中的报错。

如果你使用引用类型放入 HashMap 中，请确保该引用的生命周期至少跟 HashMap 活得一样久：

```rust
fn main() {
    use std::collections::HashMap;

    let name = String::from("Sunface");
    let age = 18;

    let mut handsome_boys = HashMap::new();
    handsome_boys.insert(&name, age);

    std::mem::drop(name);
    println!("因为过于无耻，{:?}已经被除名", handsome_boys);
    println!("还有，他的真实年龄远远不止{}岁", age);
}
```

上面代码，我们借用 name 获取了它的引用，然后插入到 handsome_boys 中，至此一切都很完美。但是紧接着，就通过 drop 函数手动将 name 字符串从内存中移除，再然后就报错了：

```rust
 handsome_boys.insert(&name, age);
   |                          ----- borrow of `name` occurs here // name借用发生在此处
9  |
10 |     std::mem::drop(name);
   |                    ^^^^ move out of `name` occurs here // name的所有权被转移走
11 |     println!("因为过于无耻，{:?}已经被除名", handsome_boys);
   |                                              ------------- borrow later used here // 所有权转移后，还试图使用name

```

最终，某人因为过于无耻，真正的被除名了 :)

##### 查询 HashMap

通过 get 方法可以获取元素：

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score: Option<&i32> = scores.get(&team_name);
```

上面有几点需要注意：

get 方法返回一个 Option<&i32> 类型：当查询不到时，会返回一个 None，查询到时返回 Some(&i32)
&i32 是对 HashMap 中值的借用，如果不使用借用，可能会发生所有权的转移
还可以通过循环的方式依次遍历 KV 对：

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

最终输出：

Yellow: 50
Blue: 10

##### 更新 HashMap 中的值

更新值的时候，涉及多种情况，咱们在代码中一一进行说明：

```rust
fn main() {
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert("Blue", 10);

    // 覆盖已有的值
    let old = scores.insert("Blue", 20);
    assert_eq!(old, Some(10));

    // 查询新插入的值
    let new = scores.get("Blue");
    assert_eq!(new, Some(&20));

    // 查询Yellow对应的值，若不存在则插入新值
    let v = scores.entry("Yellow").or_insert(5);
    assert_eq!(*v, 5); // 不存在，插入5

    // 查询Yellow对应的值，若不存在则插入新值
    let v = scores.entry("Yellow").or_insert(50);
    assert_eq!(*v, 5); // 已经存在，因此50没有插入
}
```

具体的解释在代码注释中已有，这里不再进行赘述。

在已有值的基础上更新
另一个常用场景如下：查询某个 key 对应的值，若不存在则插入新值，若存在则对已有的值进行更新，例如在文本中统计词语出现的次数：

```rust
use std::collections::HashMap;

let text = "hello world wonderful world";

let mut map = HashMap::new();
// 根据空格来切分字符串(英文单词都是通过空格切分)
for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    *count += 1;
}

println!("{:?}", map);
```

上面代码中，新建一个 map 用于保存词语出现的次数，插入一个词语时会进行判断：若之前没有插入过，则使用该词语作 Key，插入次数 0 作为 Value，若之前插入过则取出之前统计的该词语出现的次数，对其加一。

有两点值得注意：

or_insert 返回了 &mut v 引用，因此可以通过该可变引用直接修改 map 中对应的值
使用 count 引用时，需要先进行解引用 \*count，否则会出现类型不匹配

---

### Attribute 属性

> 属性是作用在 Rust 语言元素上的元数据。
> Rust 中的属性数量非常多。而且具有可扩展性（可自定义属性）。Rust 的属性语法遵从 C# 定义并标准化了的属性规范 ECMA-334。

概念
整体来讲，属性还是比较好理解的，但是需要先理解一些基本概念：

#### Inner Attributes（内部属性） 和 Outer Attributes（外部属性）

内部属性（Inner Attribute）是指：一个属性声明在一个元素中，对此元素（比如一般为 crate）整体生效。内部属性用 #![] 声明。

外部属性（Outer Attribute）是指：一个属性声明在一个元素之前，对跟在后面的这个元素生效。外部属性用 #[] 声明。

Rust 中，有些属性可以/只能作内部属性使用，有些属性可以/只能作外部属性使用。

#### Meta Item Attribute Syntax

Meta Item Attribute Syntax 实际上描述了属性语法的基本结构。

下面表格罗列了所有 Meta Item Attribute Syntax。第一列是语法样式名称，第二列是语法看起来的样子。

| Style                | Example                                           |
| -------------------- | ------------------------------------------------- |
| MetaWord             | no_std                                            |
| MetaNameValueStr     | doc = "example"                                   |
| MetaListPaths        | allow(unused, clippy::inline_always)              |
| MetaListIdents       | macro_use(foo, bar)                               |
| MetaListNameValueStr | link(name = "CoreFoundation", kind = "framework") |

我们在 Rust 代码中看到的所有属性语法都是上述五种中的一种或其组合。

Active 和 insert 属性
一个属性，要么是 active 的，要么是 insert 的。

Active 属性是指，在处理属性（预处理代码）的过程中，active 属性会将它们自己删除，留下所作用的元素。

Insert 属性是指，在处理属性（预处理代码）的过程中，insert 属性会将它们自己保留。

cfg 和 cfg_attr 属性是 active 的。
当编译为 test 模式时，test 属性是 insert 的。编译为非 test 模式时，test 属性是 active 的。
属性宏是 active 的。
所有其它属性是 insert 的。
属性的分类

#### Rust 中的属性，可以分为以下四大类

Macro attributes - 宏属性
Derive macro helper attributes - 派生宏辅助属性
Tool attributes - 工具属性
Built-in attributes - 内建属性

```

```

```

```
