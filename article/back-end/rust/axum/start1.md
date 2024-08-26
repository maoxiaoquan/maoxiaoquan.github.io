# axum 中的各种响应

本章主要讨论 axum 的响应。axum 已经实现了多种响应，比如纯文本、HTML、JSON 及 自定义响应头(response header)。除了这些 axum 内置的响应之外，我们还将讨论如何将自己定义的结构体，作为响应返回给客户端。

## axum 的响应

axum 有句话说的是：

Anything that implements IntoResponse can be returned from a handler

大意就是：凡是实现了 IntoResponse trait 的，都可作为 handler 的返回值，也就是我们所说的响应。

官方已经对若干常用数据类型实现了该 trait，亦是说，这些数据类型可以直接作为请求的响应进行返回。

对于我们自己的数据类型，比如自定义的 struct，也只需要实现 IntoResponse，就可以直接作为响应进行返回了。

官方提供了示例，我们将结合这个示例对官方提供的响应进行说明。

由于新版的 axum 文档删除了这部分内容，我们提供早些版本的文档。

官方提供的响应
官方提供了以下响应：

| 类型                 | 数据类型                                 |
| -------------------- | ---------------------------------------- |
| 纯文本               | &str 和 String                           |
| 字节序列             | `Vec<u8>`                                |
| 空响应               | ()                                       |
| 仅有状态码           | StatusCode                               |
| 带响应头的响应       | (HeaderMap, IntoResponse)                |
| 带响应头和状态的响应 | (StatusCode, HeaderMap, IntoResponse)    |
| HTML                 | 响应 `Html<IntoResponse>`                |
| JSON                 | `Json<IntoResponse>`                     |
| Result               | `Result<T:IntoResponse, E:IntoResponse>` |

### 纯文本之 &str

```rust
async fn str_response() -> &'static str {
    "Hello, axum.rs"
}
```

### 纯文本之 String

```rust
async fn string_response() -> String{
    "Hello, axum.rs".to_string()
}
```

### 仅有状态码

```rust
async fn not_found()  -> StatusCode {
    StatusCode::NOT_FOUND
}
```

### 使用 curl 访问

```curl
$ curl -I http://127.0.0.1:9527/404
HTTP/1.1 404 Not Found
content-length: 0
date: Mon, 15 Nov 2021 08:14:16 GMT
```

### 带响应头的响应

```rust
async fn with_headers() -> (HeaderMap, &'static str) {
    let mut headers = HeaderMap::new();
    headers.insert(
        HeaderName::from_static("x-powered");
        HeaderValue::from_static("axum.rs");
    );
    (headers, "axum.rs")
}
```

使用 curl 访问：

```curl
$ curl -I http://127.0.0.1:9527/with_headers
HTTP/1.1 200 OK
content-type: text/plain
x-powered: axum.rs
content-length: 0
date: Mon, 15 Nov 2021 08:18:00 GMT
```

### 带响应头和状态的响应

```rust
async fn with_headers_and_status() -> (StatusCode, HeaderMap, &'static str) {
    let mut headers = HeaderMap::new();
    headers.insert(
        HeaderName::from_static("x-powered");
        HeaderValue::from_static("axum.rs");
    );
    (StatusCode::OK, headers, "axum.rs")
}
```

使用 curl 访问：

```rust
$ curl -i http://127.0.0.1:9527/with_headers_and_status
HTTP/1.1 200 OK
content-type: text/plain
x-powered: axum.rs
content-length: 7
date: Mon, 15 Nov 2021 08:22:56 GMT
```

axum.rs

### HTML 响应

```rust
async fn html() -> Html<&'static str> {
    Html("Hello, <em>axum.rs</em>")
}
```

### JSON 响应

```rust
async fn json() -> Json<serde_json::Value> {
    Json(serde_json::json!({"hello":"axum.rs"}))
}
```

### Result 响应

````rust
// Result<T,E> 要求T和E均实现了IntoResponse
async fn result() -> Result<&'static str, StatusCode> {
    let flag = false;
    if flag {
        Ok("Hello, axum.rs")
    } else {
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
``` rust

当 flag==false 时，使用 curl 访问：

``` rust
$ curl -i http://127.0.0.1:9527/result
HTTP/1.1 500 Internal Server Error
content-length: 0
date: Mon, 15 Nov 2021 08:35:03 GMT
````

### 自定义结构体响应

```rust
#[derive(Serialize)]
struct Info {
    web_site: String,
    email: String,
    level: i32,
}

async fn info_struct() -> Json<Info> {
    let info = Info {
        web_site: "https://axum.rs".to_string(),
        email: "team@axum.rs".to_string(),
        level: 123,
    };
    Json(info)
}
```

### 响应自定义错误

### 自定义一个错误类型

```rust
pub struct AppError {
    pub message: String,
}
```

### 让这个自定义错误类型实现 IntoResponse

```rust
impl IntoResponse for AppError {
    type Body = Full<Bytes>;
    type BodyError = Infallible;

    fn into_response(self) -> axum::http::Response<Self::Body> {
        self.message.into_response()
    }
}
```

### 响应这个错误类型

```rust
async fn app_error() -> Result<&'static str, AppError> {
    let flag = false;
    if flag {
        Ok("Hello, axum.rs")
    } else {
        Err(AppError {
            message: "Opps!".to_string(),
        })
    }
}
```

本章讨论了 axum 内置的各种响应及如何响应自定义结构体和自定义错误，本章源码你可以在代码仓库中找到。

思考题：

如果细心的话，你会发现在上面的例子中（axum 默认情况下），中文大概率会显示成乱码，利用本章所学知识，你能解决这个问题吗？请自行思考再看答案。

### 指定响应的类型和编码

提示：HTTP 中的 content-type header 可以指定响应的类型和编码。

参考答案：

```rust
async fn cn() -> (HeaderMap, &'static str) {
    let mut headers = HeaderMap::new();
    headers.insert(
        HeaderName::from_static("content-type"),
        HeaderValue::from_static("text/plain;charset=utf-8"),
    );
    (headers, "你好，axum.rs")
}
```
