# axum 处理静态文件

和其它 Web 框架一样，axum 也会对所有请求进行处理。对于 CSS、JS 及图片等静态文件，并不需要 axum 的 handler 进行处理，而是只需要简单的把它们的内容进行返回即可。axum 提供了处理静态文件的中间件。

首先，我们创建一个名为 `static` 的目录，并在其中创建一个 `axum-rs.txt` 的文本文件，内容随意，比如：

```text
Welcome to axum.rs!
Email: team@axum.rs
```

## 使用 handler 处理

现在的问题是，我们如何才能在浏览器中访问到这个文件呢？按照它的目录，我们试试 `/static/axum-rs.txt`：

```bash
$ curl -i 127.0.0.1:9527/static/axum-rs.txt
HTTP/1.1 404 Not Found
content-length: 0
date: Wed, 17 Nov 2021 09:16:51 GMT
```

可以发现，HTTP 的状态码是 404，即找不到该资源。为了解决这个问题，我们可以定义一个 handler：

async fn axum_rs_txt\(\) \-> String \{
std::fs::read_to_string\("static/axum-rs.txt"\).unwrap\(\)
\}

然后定义路由：

```rust
let app = Router::new().route("/static/axum-rs.txt", axum::routing::get(axum_rs_txt));
```

访问试试：

```bash
$ curl -i 127.0.0.1:9527/static/axum-rs.txt
HTTP/1.1 200 OK
content-type: text/plain
content-length: 40
date: Wed, 17 Nov 2021 09:17:44 GMT

Welcome to axum.rs!
Email: team@axum.rs
```

很好，搞定了。问题是，如果有成千上万个静态资源要处理呢？这种方式显然不够好。

## 使用中间件处理

首先，加入 `tower-http` 依赖：

```toml
tower-http = { version = "0.1", features = ["fs"] }
```

修改路由定义：

```rust
let app = Router::new().nest(
        "/static",
        service::get(ServeDir::new("static")).handle_error(|err| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("处理静态资源出错：{:?}", err),
            )
        }),
    );
```

解释一下：

- `/static`：指定 URL 访问静态资源时的前缀，比如：`/static/axum.rs`

- `ServeDir::new("static")`：指定静态文件存放在服务器上的路径

有了这个中间件之后，所有静态资源放到`static`目录即可，不需要对代码进行改动了。

> 截止发稿为止，axum 官方[最近的 git 提交](https://github.com/tokio-rs/axum/commit/2bd031046364e3d422a23c66db58a9fc6b195ba3)中的“静态文件服务”的示例代码无法编译。

本章讨论了使用 axum 处理静态资源的方法，完整代码可以在[代码库](https://github.com/axumrs/roaming-axum/tree/main/static-files)中找到。
