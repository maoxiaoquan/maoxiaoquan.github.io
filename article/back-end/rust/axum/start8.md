# axum 操作 redis

通过 [redis-rs](https://crates.io/crates/redis) 这个 crate，可以很方便的操作 redis。它提供了同步和异步两种连接，由于我们要集成到 axum 中，所以这里使用异步连接。本章将展示如何获取 redis 异步连接、如何将字符串保存到 redis、如何获取到保存在 redis 里的字符串以及如何通过 redis 保存和读取自定义结构体。

## 获取 redis 异步连接

> redis 默认端口是 `6379`，由于作者使用 docker 运行了多个 redis 实例，所以示例代码中可能不是 redis 默认端口。请根据你自身的环境将连接字符串中的主机和端口等信息进行修改。

通过 `redis::Client::open()`方法可以建立与 redis 服务器的连接，然后使用`get_async_connection()`方法获取到异步连接。

```rust
let client = Client::open("redis://127.0.0.1:16379/").unwrap();
    let  conn = client
        .get_async_connection()
        .await
        .unwrap();
```

其中的连接字符串（`open()`函数的参数）有以下几种写法（中括号内的为可选参数，尖括号内的为必填参数）：

- `redis://[<用户名>][:<密码>@]<主机名>[:端口][/数据库]`

- `unix:///<路径>[?db=<数据库>][&pass=<密码>][&user=<用户名>]`

- `redis+unix:///<路径>[?db=<数据库>][&pass=<密码>][&user=<用户名>]`

## 将字符串保存到 redis

调用异步连接的`set()`方法，可以将字符串保存到 redis：

```rust
conn.set("键名","值").await;
```

示例代码如下：

```rust
async fn set() -> Result<&'static str, String> {
    let client = Client::open(REDIS_DSN).map_err(|err| err.to_string())?;
    let mut conn = client
        .get_async_connection()
        .await
        .map_err(|err| err.to_string())?;
    conn.set("author", "axum.rs")
        .await
        .map_err(|err| err.to_string())?;
    Ok("Successfully set")
}
```

## 读取保存在 redis 中的字符串

异步连接的`get()`方法，用于从 redis 中获取指定键的数据：

```rust
let value = conn.get("键名").await;
```

示例代码如下：

```rust
async fn get() -> Result<String, String> {
    let client = Client::open(REDIS_DSN).map_err(|err| err.to_string())?;
    let mut conn = client
        .get_async_connection()
        .await
        .map_err(|err| err.to_string())?;
    let value = conn.get("author").await.map_err(|err| err.to_string())?;
    Ok(value)
}
```

> 由于 redis 保存的是底层的数据，所以你可以根据需要将读取到的数据进行类型转换，[官方文档](https://docs.rs/redis/0.21.4/redis/#type-conversions)有示例。

## 自定义结构体和 redis

了解完字符串的读写操作，我们继续讨论在 redis 读写自定义结构体。

### 定义数据结构

```rust
#[derive(Serialize, Deserialize)]
pub struct UserInfo {
    pub id: i32,
    pub username: String,
    pub email: String,
}
```

### 将自定义结构体写入 redis 服务器

我们需要将结构体序列化为字符串，然后再写入 redis 服务器：

```rust
async fn set_user() -> Result<&'static str, String> {
    let client = Client::open(REDIS_DSN).map_err(|err| err.to_string())?;
    let mut conn = client
        .get_async_connection()
        .await
        .map_err(|err| err.to_string())?;
    let user = UserInfo {
        id: 1,
        username: "axum.rs".to_string(),
        email: "team@axum.rs".to_string(),
    };
    let user = json!(user);
    conn.set("user", user.to_string())
        .await
        .map_err(|err| err.to_string())?;
    Ok("Successfully set user.")
}
```

### 从 redis 中读取自定义结构体

我们需要将 redis 中读取到的字符串反序列化为自定义结构体：

```rust
async fn get_user() -> Result<Json<UserInfo>, String> {
    let client = Client::open(REDIS_DSN).map_err(|err| err.to_string())?;
    let mut conn = client
        .get_async_connection()
        .await
        .map_err(|err| err.to_string())?;
    let value: String = conn.get("user").await.map_err(|err| err.to_string())?;
    let user: UserInfo = from_str(&value).map_err(|err| err.to_string())?;
    Ok(Json(user))
}
```

## 设置自动过期

redis 支持在写入值的时候设置过期时间，时间一到，该数据自动删除：

```rust
conn.set_ex("键名","值",过期时间的秒数).await;
```

本章讨论了如何在 axum 集成 redis，完整代码可以在[代码库](https://github.com/axumrs/roaming-axum/tree/main/redis)中找到。

## 思考题

- 本章展示的所有 handler 都有重复代码：获取 redis 连接，尝试将这段重复代码提取为独立的函数。

- 更进一步，将写入和读取的操作封装成单独的函数。

- 试试写入一个 30 秒过期的数据。
