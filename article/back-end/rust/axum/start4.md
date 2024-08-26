# 路由

axum 提供了常用的 HTTP 请求方式对应的路由，比如 `get`, `post`, `put`, `delete` 等。除此之外，axum 还提供了“嵌套路由”。路由，通常和 `handler(处理函数)` 结合在一起。

## `handler` 是什么

通常理解，handler 是指接收用户的请求，并将处理结果作为响应返回给用用户的函数。

### 它的返回值是什么

正如《[axum 中的各种响应](https://axum.rs/topic/roaming-axum/response)》所说，在 axum 中，所有实现了 `IntoResponse` 的数据类型都可以作为 handler 的返回值。

## 常用的请求方式

| 请求方式 | 说明                                                             |
| -------- | ---------------------------------------------------------------- |
| `GET`    | 该请求应该只被用于获取数据                                       |
| `POST`   | 用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用 |
| `PUT`    | 用请求有效载荷替换目标资源的所有当前表示                         |
| `DELETE` | 删除指定的资源                                                   |

> 上表节选自《[HTTP 请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)》，更多请求方法，请参照原文。

在 axum 中，`axum::routing` 重新导出了 HTTP 请求方式的对应函数。也就是说，使用`axum::routing::get()` 来定义一个 GET 请求的路由。

## 链式操作

axum 的路由支持链式操作。假设以下场景：在编辑某用户信息时，首先要使用表单显示用户当前的信息\(GET\)，修改完成之后，还要将这个表单数据发送到服务器\(POST\)。在这个过程中，路由的 URL 是一样的。

> 由于还未学习到模板的相关内容，本例我们用直接书写 HTML 来作演示。你也可以看一下《[axum 中使用模板引擎](https://axum.rs/topic/roaming-axum/template)》

定义相关的 struct：

```rust
/// 通过表单提交数据
#[derive(Deserialize)]
pub struct EditUser {
    pub id: i32,
    pub username: String,
    pub email: String,
}

/// 对应数据库的模型
pub struct UserModel {
    pub id: i32,
    pub username: String,
    pub email: String,
}
```

定义 handler：

```rust
/// 显示要修改的用户
async fn edit_user(Path(id): Path<i32>) -> Html<String> {
    let model = UserModel {
        id,
        username: "AXUM.RS".to_string(),
        email: "team@axum.rs".to_string(),
    };
    let html = format!(
        r#"
        <!DOCTYPE html>
        <html lang="zh-Hans">
          <head>
            <meta charset="utf-8" />
            <meta name="author" content="axum.rs (team@axum.rs)" />
            <title>
              修改用户-AXUM中文网
            </title>
          </head>
          <body>
          <form method="post" action="/edit_user/{}">
          <input type="hidden" name="id" value="{}">
          <div>
            <label>用户名</label>
            <input type="text" name="username" value="{}">
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value="{}">
          </div>
          <div>
            <button type="submit">提交</button>
          </div>
          </form>
          </body>
          </html>
        "#,
        model.id, model.id, model.username, model.email
    );
    Html(html)
}

/// 对用户进行修改
async fn edit_user_action(Form(frm): Form<EditUser>) -> Html<String> {
    let html = format!(
        r#"
        <!DOCTYPE html>
        <html lang="zh-Hans">
          <head>
            <meta charset="utf-8" />
            <meta name="author" content="axum.rs (team@axum.rs)" />
            <title>
              修改用户-AXUM中文网
            </title>
          </head>
          <body>
            <h1>修改成功！</h1>
            <p>修改后的用户资料：</p>
            <div>ID: {} </div>
            <div>用户名: {} </div>
            <div>Email: {} </div>
          </body>
          </html>"#,
        frm.id, frm.username, frm.email
    );
    Html(html)
}
```

定义路由：

```rust
route("/edit_user/:id", get(edit_user).post(edit_user_action))
```

## 嵌套路由

为了方便进路由进行分组，axum 提供了嵌套路由功能。比如有以下路由：

通过嵌套路由可以使其更清晰：

定义 handlers：

```rust
async fn news_index() -> &'static str {
    "new index"
}
async fn news_detail(Path(id): Path<i32>) -> String {
    format!("new detail {}", id)
}
async fn news_comments(Path(id): Path<i32>) -> String {
    format!("new comments {}", id)
}
```

定义子路由：

```rust
let news_router = Router::new()
        .route("/", get(news_index))
        .route("/detail/:id", get(news_detail))
        .route("/comments/:id", get(news_comments));
```

将子路由嵌到全局路由：

```rust
.nest("/news", news_router);
```

本章讲解了 axum 路由功能。代码可以在[代码仓库](https://github.com/axumrs/roaming-axum/tree/main/route)中找到。

思考题：

如何在 axum 实现跳转（即重定向）功能？

> 提示：
>
> 1.  使用 `(StatusCode, HeaderMap, ())` 响应
> 2.  对应的状态码可查阅[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
> 3.  对应的 Header 可查阅[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)

参考答案：

```rust
async fn redirect() -> (StatusCode, HeaderMap, ()) {
    let mut headers = HeaderMap::new();
    headers.insert(
        axum::http::header::LOCATION,
        "https://axum.rs".parse().unwrap(),
    );
    (StatusCode::FOUND, headers, ())
}
```
