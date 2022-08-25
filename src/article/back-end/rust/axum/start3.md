# axum 的状态共享

**状态共享**是指，在整个应用或不同路由之间，共享一份数据。axum 提供了方便的状态共享机制，但可能也会踩坑。本章将带你学习如何在 axum web 应用中共享状态。

## 如何进行状态共享

axum 使用 `Layer` 来实现状态共享。

定义路由时，使用 `layer()` 加入要共享的数据，在需要获取该共享数据的 handler 里，使用 `Extension` 这个 `extract` 来获取。

## 什么样的数据才能进行共享

出于并发原因，只有实现了 `Clone` trait 的数据类型才能进行共享。

下面模拟一个场景：在所有 handler 里都要获取用户信息。

### 定义数据结构

```rust
#[derive(Clone)]
pub struct UserInfo {
    pub username: String,
}
```

### 在路由中添加共享数据

```rust
let app = Router::new()
        .route("/user", routing::get(show_user_info))
        .layer(AddExtensionLayer::new(UserInfo {
            username: "axum.rs".to_string(),
        }));
```

我们通过在路由列表之后，使用 `layer()` 添加共享数据。注意，共享数据不是直接添加进去的，而是通过 `AddExtensionLayer::new()` 来实现。

### 在 handler 中获取共享数据

async fn show_user_info\(Extension\(info\): Extension\<UserInfo>\) \-> String \{
format\!\("Sigined User: \{\}", info.username\)
\}

> 本部分代码可以在[这里](https://github.com/axumrs/roaming-axum/blob/main/state/state-normal/src/main.rs)找到。

## 如何让那些“顽固分子”也能进行共享

对于我们自己定义的数据结构来说，可以很明确的实现 `Clone`，而在实际开发中，你可能需要共享第三方库里的数据结构，而这个数据结构并没有实现 `Clone`，这时候该怎么办？

答案是使用 `std::sync::Arc` 这个智能指针。你现在脑海里应该明确两点：

- axum 共享的数据必须是 `Clone` 的，也就是说不 `move` 它的所有权

- `Arc` 是“线程安全”的引用计数智能指针，它只会读取值，不会转移所有权

### 定义数据结构

下面，我们将上例中的数据结构中实现 `Clone` 的部分删除：

```rust
pub struct UserInfo {
    pub username: String,
}
```

### 在路由中添加共享数据

```rust
let app = Router::new()
        .route("/user", routing::get(show_user_info))
        .layer(AddExtensionLayer::new(Arc::new(UserInfo {
            username: "axum.rs".to_string(),
        })));
```

### 在 handler 中获取共享数据

```rust
async fn show_user_info(Extension(info): Extension<Arc<UserInfo>>) -> String {
    format!("Sigined User: {}", info.username)
}
```

> 本部分代码可以在[这里](https://github.com/axumrs/roaming-axum/blob/main/state/state-arc/src/main.rs)找到。

## 共享复合数据

日常开发中，要共享状态的往往不只一个结构体。而且，这些要共享的结构体也可能出现有些实现了 `Clone`，有些没有实现。

解决方案是，将这些共享状态封装到一个结构体中。对于那些没有实现 `Clone` 的，可以：

- 在这个封装的结构体中，使用 `Arc` 进行包装，而这个封装的结构体本身要实现 `Clone`

- 使用常规方式封装结构体，并且不实现 `Clone`。通过 `Arc` 共享这个封装的结构体

下面以第一种方式来演示。

### 定义数据结构

# \[derive\(Clone\)\]

pub struct DatabaseClient \{
pub dsn: String,
\}
pub struct RedisClient \{
pub host: String,
\}

# \[derive\(Clone\)\]

pub struct AppState \{
pub db: DatabaseClient,
pub rdb: Arc\<RedisClient>,
\}

### 在路由中添加共享数据

```rust
let db_client = DatabaseClient {
        dsn: "host=pg.axum.rs port=5432 user=axum_rs password=axum.rs sslmode=disable".to_string(),
    };
    let redis_client = Arc::new(RedisClient {
        host: "redis.axum.rs".to_string(),
    });

    let app = Router::new()
        .route("/status", routing::get(status))
        .layer(AddExtensionLayer::new(AppState {
            db: db_client,
            rdb: redis_client,
        }));
```

### 在 handler 中获取共享数据

```rust
async fn status(Extension(state): Extension<AppState>) -> String {
    format!(
        "database dsn: {}, redis host: {}",
        state.db.dsn, state.rdb.host
    )
}
```

> 本部分代码可以在[这里](https://github.com/axumrs/roaming-axum/blob/main/state/state-compound/src/main.rs)找到。

本章对 axum 中共享状态进行了讨论，相关源代码可以在[代码库](https://github.com/axumrs/roaming-axum/blob/main/state)找到。

## 思考题

试着自己实现第二种方式，即：

> 使用常规方式封装结构体，并且不实现 `Clone`。通过 `Arc` 共享这个封装的结构体

参考答案：

### 定义数据结构

```rust
#[derive(Clone)]
pub struct DatabaseClient {
    pub dsn: String,
}
pub struct RedisClient {
    pub host: String,
}

pub struct AppState {
    pub db: DatabaseClient,
    pub rdb: RedisClient,
}
```

### 在路由中添加共享数据

```rust
let db_client = DatabaseClient {
        dsn: "host=pg.axum.rs port=5432 user=axum_rs password=axum.rs sslmode=disable".to_string(),
    };
    let redis_client = RedisClient {
        host: "redis.axum.rs".to_string(),
    };

    let app = Router::new()
        .route("/status", routing::get(status))
        .layer(AddExtensionLayer::new(Arc::new(AppState {
            db: db_client,
            rdb: redis_client,
        })));
```

### 在 handler 中获取共享数据

```rust
async fn status(Extension(state): Extension<Arc<AppState>>) -> String {
    format!(
        "database dsn: {}, redis host: {}",
        state.db.dsn, state.rdb.host
    )
}
```
