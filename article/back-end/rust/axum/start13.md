# axum 错误处理

> axum 的错误处理。

## 自定义 extractor

### extractor 的定义

axum 官方已经提供了很多 extractor，其中包括 `axum::Json`。现在，我们要实现自己的 Json extractor——当然，为了避免混乱，建议取别的名字，比如`MyJson`等。

```rust
// src/extract.rs

// 定义自己的Json extract
pub struct Json<T>(pub T);

// 实现FromRequest

#[async_trait]
impl<B, T> FromRequest<B> for Json<T>
where
    B: axum::body::HttpBody + Send,
    T: DeserializeOwned,
    B::Data: Send,
    B::Error: Into<BoxError>,
{
    type Rejection = (StatusCode, axum::Json<serde_json::Value>);

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        match axum::Json::<T>::from_request(req).await {
            Ok(value) => Ok(Self(value.0)),
            Err(err) => {
                let body: Cow<'_, str> = match err {
                    JsonRejection::InvalidJsonBody(err) => {
                        format!("缺少所需的字段：{}", err).into()
                    }
                    JsonRejection::MissingJsonContentType(err) => {
                        format!("请使用JSON请求：{}", err).into()
                    }
                    err => format!("发生错误：{}", err).into(),
                };
                Err((
                    StatusCode::BAD_REQUEST,
                    axum::Json(json!({ "error": body })),
                ))
            }
        }
    }
}
```

如果你对中间件还有印象，你会发现这段代码何其的熟悉。

### 在 handler 中使用

```rust
// src/handler.rs
use crate::extract::Json;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct User {
    pub username: String,
    pub email: String,
}
// 使用的是我们自定义的Json
pub async fn login(Json(user): Json<User>) {
    dbg!(&user);
}
```

## nginx

我们可以使用 nginx 来反代 axum 应用，并根据不同的 HTTP 响应码来定义不同的 JSON 响应：

```nginx
server {
    listen 443 ssl;
    server_name axum.rs;

    error_page 400 401 403 404 405 500 501 502 503 504 /msg.json;
    location /msg.json {
        internal;
        default_type application/json;
        charset utf-8;
        return 400 '{"error":"请检查你提交的数据"}';
    }
}
```

本章代码可以在[代码库](https://github.com/axumrs/roaming-axum/tree/main/error-handling)找到。
