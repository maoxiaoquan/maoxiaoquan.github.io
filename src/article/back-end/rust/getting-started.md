---
sidebar: auto
---

<!-- # Rust 入门

## 入门

### 概念 -->

#### Attribute 属性

> 属性是作用在 Rust 语言元素上的元数据。
> Rust 中的属性数量非常多。而且具有可扩展性（可自定义属性）。Rust 的属性语法遵从 C# 定义并标准化了的属性规范 ECMA-334。

概念
整体来讲，属性还是比较好理解的，但是需要先理解一些基本概念：

##### Inner Attributes（内部属性） 和 Outer Attributes（外部属性）

内部属性（Inner Attribute）是指：一个属性声明在一个元素中，对此元素（比如一般为 crate）整体生效。内部属性用 #![] 声明。

外部属性（Outer Attribute）是指：一个属性声明在一个元素之前，对跟在后面的这个元素生效。外部属性用 #[] 声明。

Rust 中，有些属性可以/只能作内部属性使用，有些属性可以/只能作外部属性使用。

##### Meta Item Attribute Syntax

Meta Item Attribute Syntax 实际上描述了属性语法的基本结构。

下面表格罗列了所有 Meta Item Attribute Syntax。第一列是语法样式名称，第二列是语法看起来的样子。

| Style                | Example                                           |
| -------------------- | ------------------------------------------------- |
| MetaWord             | no_std                                            |
| MetaNameValueStr     | doc = "example"                                   |
| MetaListPaths        | allow(unused, clippy::inline_always)              |
| MetaListIdents       | macro_use(foo, bar)                               |
| MetaListNameValueStr | link(name = "CoreFoundation", kind = "framework") |
| Style                | Example                                           |
| Style                | Example                                           |

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

##### Rust 中的属性，可以分为以下四大类

Macro attributes - 宏属性
Derive macro helper attributes - 派生宏辅助属性
Tool attributes - 工具属性
Built-in attributes - 内建属性
