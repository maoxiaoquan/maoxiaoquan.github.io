# 配置文件：让 axum app 可配置

将数据库连接信息、redis 连接信息以及 Web 应用监听地址等信息通过配置文件进行单独管理是一个比较好的开发实践。这样就无须在更改配置的时候重新编译整个项目，同时也可以针对不同环境使用不同的配置文件。

本章以 PostgreSQL 和 Redis 进行演示如何使用配置文件。首先看一下新接触的两个 crate：

- `dotenv`：解析`.env`，并将里面的键值对映射为环境变量

- `config`：将环境变量等配置信息转换为我们自定义的结构体

## `.env`文件

首先，在项目根目录\(和`Cargo.toml`同级\)创建一个`.env`文件，并输入以下内容：

```env
WEB.ADDR=127.0.0.1:9527
REDIS.DSN=redis://127.0.0.1:6379/
PG.USER=axum_rs
PG.PASSWORD=axum.rs
PG.DBNAME=axum_rs
PG.PORT=5432
PG.HOST=pg.axum.rs
PG.POOL.MAX_SIZE=30
```

其中：

- `WEB.*`：对应 Web 的配置，比如监听地址

- `REDIS.*`：对应 Redis 的配置，比如连接字符串

- `PG.*`：对应 PostgreSQL 的配置

## 实现自定义配置

### 项目配置信息的结构体

通过分析，我们项目配置的信息应该是：

```rust
/// Web配置
#[derive(Deserialize)]
pub struct WebConfig {
    /// Web服务监听地址
    pub addr: String,
}

/// Redis 配置
#[derive(Deserialize)]
pub struct RedisConfig {
    /// 连接字符串
    pub dsn: String,
}

/// 项目配置
#[derive(Deserialize)]
pub struct Config {
    pub web: WebConfig,
    pub redis: RedisConfig,
}
```

根本上说，这是一个反序列化的过程，所以需要 `Deserialize`。另外每一个子配置都抽取为一个单独的结构体。

等等，为什么没有 PostgreSQL 配置的结构体？`deadpool_postgres`提供了一个`Config`结构体，我们只需要将它添加到我们自己的项目配置里就可以了，不用自己定义了。所以，我们的配置最终是这样的：

```rust
/// 项目配置
#[derive(Deserialize)]
pub struct Config {
    pub web: WebConfig,
    pub redis: RedisConfig,
    pub pg: deadpool_postgres::Config,
}
```

### 实现从环境变量中加载配置

我们的配置信息都是保存在 `.env` 里，它最终会变成环境变量\(通过`dotenv`\)，所以我们的项目配置结构体需要实现一个从环境变量中加载信息的方法。

```rust
impl Config {
    /// 从环境变量中初始化配置
    pub fn from_env() -> Result<Self, config::ConfigError> {
        let mut cfg = config::Config::new();
        // 尝试合并环境变量设置
        cfg.merge(config::Environment::new())?;
        // 转换成我们自己的Config对象
        cfg.try_into()
    }
}
```

## 状态共享结构体

我们的目的是要在多个 handler 之间共享数据库和 redis 连接，回忆一下《[axum 的状态共享](https://axum.rs/topic/roaming-axum/state)》提到的方法。

由于我们要共享多个数据，所以需要把它们“打包”成一个单独的结构体。

```rust
#[derive(Clone)]
pub struct AppState {
    pub pool: deadpool_postgres::Pool,
    pub rdc: redis::Client,
}
```

- `pool`：数据库连接池

- `rdc`：redis 客户端

## 初始化配置及共享对象

在`main()`中，初始化配置及共享对象

### 初始化配置

```rust
dotenv().ok(); // 解析 .env 文件
let cfg = Config::from_env().expect("初始化项目配置失败");
```

### 初始化共享对象

let pool = cfg
.pg
.create_pool\(tokio_postgres::NoTls\)
.expect\("创建 Postgres 连接池失败"\);
let rdc = redis::Client::open\(cfg.redis.dsn\).expect\("创建 redis 连接失败"\);

## 共享状态

现在可以在路由定义中添加状态共享了。

```rust
.layer(AddExtensionLayer::new(AppState { pool, rdc }));
```

## 在 handler 获取

```rust
/// 尝试获取 Postgres Client
async fn try_pg(Extension(state): Extension<AppState>) -> Result<&'static str, String> {
    let _client: deadpool_postgres::Client =
        state.pool.get().await.map_err(|err| err.to_string())?;
    Ok("Successfully got database client from postgresql pool in AppState")
}

/// 尝试获取 Redis 异步连接
async fn try_redis(Extension(state): Extension<AppState>) -> Result<&'static str, String> {
    let _conn = state
        .rdc
        .get_async_connection()
        .await
        .map_err(|err| err.to_string())?;
    Ok("Successfully got async connection via redis client in AppState")
}
```

## 监听地址也是配置文件里的

```rust
axum::Server::bind(&cfg.web.addr.parse().unwrap())
```
