# 中间件

中间件是一类提供系统软件和应用软件之间连接、便于软件各部件之间的沟通的软件，应用软件可以借助中间件在不同的技术架构之间共享信息与资源。 ——摘自[维基百科](https://zh.wikipedia.org/wiki/%E4%B8%AD%E9%97%B4%E4%BB%B6);

在《[axum 的状态共享](https://axum.rs/topic/roaming-axum/state)》中，我们已经用到了中间件：用于添加共享数据的 `AddExtension` 中间件——它应用于`AddExtensionLayer`和`Extension`。

axum 直接使用了 tower 中间件的生态。

## 使用中间件

除了之前章节介绍的共享状态的中间件，我们再演示一个使用 tower 的 `tower_http::trace::TraceLayer` 中间件的示例。

### 定义处理函数

```rust
async fn foo() -> &'static str {
    "Welcome to axum.rs"
}

async fn bar() -> &'static str {
    "Powered by axum.rs"
}
```

### 定义路由并加上中间件

```rust
let app = Router::new()
        .route("/foo", get(foo))
        .route("/bar", get(bar))
        .layer(TraceLayer::new_for_http());
```

> 提示，为了能让该中间件正确地打印出日志，需要增加 `tracing`和`tracing-subscriber` 依赖，并在代码中对其进行初始化：

```rust
if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "tower_http=debug,middleware=debug");
}
tracing_subscriber::fmt::init();
```

## 自定义中间件

你可以通过实现 `tower::Service` 来自定义中间件，但它非常复杂，有兴趣可以看看[官方示例](https://docs.rs/axum/0.3.3/axum/#writing-your-own-middleware)。

好在 axum 提供了更简单的方法：通过`extractor_middleware()` 方法，将一个 extractor 转成中间件。

作为示例，我们将实现一个只能使用 Firefox 浏览器访问的中间件。如果用户使用 Firefox 浏览器访问，将展示正常信息，如果是用其它浏览器访问，将显示提示信息。

### 定义 extractor

```rust
pub struct UserAgentInfo;

#[async_trait]
impl<B> FromRequest<B> for UserAgentInfo
where
    B: Send,
{
    type Rejection = (StatusCode, String);
    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        let user_agent = req
            .headers()
            .and_then(|headers| headers.get(axum::http::header::USER_AGENT))
            .and_then(|value| value.to_str().ok())
            .unwrap_or("");
        tracing::debug!("该用户UserAgent是：{:?}", user_agent);
        if !user_agent.contains("Firefox") {
            tracing::error!("非Firefox浏览器，禁止访问");
            return Err((
                StatusCode::BAD_REQUEST,
                "You MUST use Firefox to visit this page.".to_string(),
            ));
        }
        Ok(UserAgentInfo {})
    }
}
```

### 作为中间件加到路由上

```rust
.layer(extractor_middleware::<user_agent::UserAgentInfo>());
```

本章讲解了 axum 的中间件的使用，以及如何自定义中间件。源码可以在我们的[代码库](https://github.com/axumrs/roaming-axum/tree/main/middleware)中找到。

> 本章使用了多个第三方库，如果你对这些库暂时无法理解，可以先跳过。重点是理解如何使用及自定义中间件。
