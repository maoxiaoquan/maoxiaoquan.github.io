# 在 axum 中获取请求数据

在日常开发中，我们需要与用户进行交互，从各种渠道获取用户输入，包括但不限于：表单、URL 参数、URL Path 以及 JSON 等。axum 为我们提供了这些获取用户输入的支持。

## 获取 `Path` 参数

`Path` 参数，又称为“路径参数”，它既可以实现参数的传递，又对 SEO 友好。

### 什么是 `Path` 参数

假设有以下 URL：

```bash
https://github.com/axumrs/axum-rs
```

将其各部分进行分解，得到：

- `https`：传输协议

- `github.com`：主机名

- `axumrs/axum-rs`：路径。这部分就是 `Path`，我们可以将这部分变成参数化。

#### 参数化

我们可以把 `axumrs/axum-rs` 参数化为 `用户名/仓库名`，这样就可以动态的显示不同用户的不同仓库了，基于此，我们把上面的 URL 变成：

```ruby
https://github.com/:user/:repository
```

当然，对于相对固定的部分，我们可以不进行参数化，而是直接显式地进行声明，比如：

```ruby
https://axum.rs/topic/roaming-axum/request
```

这个 URL 中，虽然 `topic/roaming-axum/request` 都是 Path 部分，但我们只需要对后面两个进行参数化，最终得到：

```ruby
https://axum.rs/topic/:subject/:article
```

其中`:subject`用于识别专题，而`:article`用于识别文章。

### 如何在 axum 获取 `Path` 参数

`axum::extract` 包中提供了众多 `Extract`，其中的 `Path` 可以方便的获取 `Path` 参数。

```rust
// 定义handler
async fn user_info(Path(id): Path<i32>) -> String {
    format!("User info for {}", id)
}
// 定义路由
route("/user/:id", get(user_info));
```

请注意此例中，handler 函数的参数：`(Path(id): Path<i32>)`，其含义是：接收一个`i32`类型的参数（`Path<i32>`），并将其解构为`id`变量（`Path(id)`）。如果你没有解构，需要在代码中使用`id.0`的形式获取到参数的值：

```rust
async fn user_info(id: Path<i32>) -> String {
    format!("User info for {}", id.0)
}
```

### 如何获取多个 `Path` 参数

上文提到，如果没有对 `Path` 参数解构，可以通过 `变量名.0` 的方式获取到参数的值。从中我们可以将 `Path` 参数看作一个元组。

#### 以元组方式获取多个 `Path` 参数

```rust
async fn repo_info(Path((user_name, repo_name)): Path<(String, String)>) -> String {
    format!(
        "Repository: user name: {} and repository name: {}",
        user_name, repo_name
    )
}
```

对应的路由定义：

```rust
route("/repo/:user/:repo", get(repo_info));
```

使用 curl 访问结果如下：

```bash
$ curl  http://127.0.0.1:9527/repo/axumrs/axum-rs
Repository: user name: axumrs and repository name: axum-rs
```

#### 将多个`Path`参数填充为结构体

对于少量的参数，我们可以使用元组形式进行获取，但出于以下原因，我们更推荐将参数填充到结构体中：

- 结构体字段易于扩展

- 结构体更具明确性

要填充为结构体，我们需要进行以下几步：

##### 定义结构体

```rust
pub struct RepoInfo {
    pub user_name: String,
    pub repo_name: String,
}
```

##### 实现 trait

```rust
#[derive(Deserialize)]
pub struct RepoInfo {
```

##### 将参数填充到结构体

```rust
async fn repo_info_struct(Path(info): Path<RepoInfo>) -> String {
    format!(
        "Repository: user name: {} and repository name: {}",
        info.user_name, info.repo_name
    )
}
```

##### 路由定义

```rust
route("/repo_struct/:user_name/:repo_name", get(repo_info_struct));
```

访问结果示例：

```bash
$ curl  http://127.0.0.1:9527/repo_struct/axumrs/axum-rs
Repository: user name: axumrs and repository name: axum-rs
```

> 注意：
>
> 1.  路由定义中的参数名必须和结构体的字段名保持一致
> 2.  结构体及其字段必须是可访问的

## 获取 Url 参数

除了 `Path` 参数，我们还可以获取 Url 参数。Url 参数是指附加在网址后面，以`?`开头的部分。它是一个键值对，多个参数间以`&`分割。

```bash
https://axum.rs/subject?page=1&keyword=axum.rs
```

此例包含两个 Url 参数：

- 值为 `1` 的 `page` 参数

- 值为 `axum.rs` 的 `keyword` 参数

### 如何在 axum 获取 Url 参数

使用 `Query` 这个 `Extract` 可以获取到 Url 参数。

#### 定义结构体并实现 trait

```rust
#[derive(Deserialize)]
pub struct SubjectArgs {
    pub page: i32,
    pub keyword: String,
}
```

#### 将参数填充到结构体

```rust
async fn subject(Query(args): Query<SubjectArgs>) -> String {
    format!("Page {}, keyword: {} of subjects", args.page, args.keyword)
}
```

访问结果示例：

\$ curl 'http://127.0.0.1:9527/subject\?page=1\&keyword=axum.rs'
Page 1, keyword: axum.rs of subjects

### 如何让 Url 参数成为可选的

上面的例子要求 `page` 和 `keyword` 必须传入，否则会报错。然而，在现实生活中，这两个参数往往是可选的。

试着将 handler 函数的参数进行修改，加上 `Option`：

```rust
async fn subject_opt(args: Option<Query<SubjectArgs>>) -> String {
    if let Some(args) = args {
        let args = args.0;
        return format!("Page {}, keyword: {} of subjects", args.page, args.keyword);
    }
    "Page 0, no keyword of subjects".to_string()
}
```

试着访问，会发现依然有问题：只有两个参数同时提供或两个参数同时不提供的时候，结果才是正确的。不符合我们的预期。我们的预期是，参数可以同时提供、同时不提供、也可以只提供其中某一个。

继续修改。

```rust
#[derive(Deserialize)]
pub struct SubjectArgsOpt {
    pub page: Option<i32>,
    pub keyword: Option<String>,
}
async fn subject_opt_done(Query(args): Query<SubjectArgsOpt>) -> String {
    let page = args.page.unwrap_or(0);
    let keyword = args.keyword.unwrap_or("".to_string());

    format!("Page {}, keyword: {} of subjects", page, keyword)
}
```

我们将结构体的字段定义为 `Option`，现在符合我们的要求。

### 获取所有 Url 参数

默认的，axum 把 Url 参数映射成了`HashMap`，所以我们可以将所有参数获取到一个 HashMap 中。

```rust
async fn all_query(Query(args): Query<HashMap<String, String>>) -> String {
    format!("{:?}", args)
}
```

## 获取表单输入

类似的，axum 也提供了一个名 `Form` 的 `Extract` 用于获取表单输入。

### 定义结构体并实现 trait

```rust
#[derive(Deserialize)]
pub struct CreateUser {
    pub username: String,
    pub email: String,
    pub level: u8,
}
```

### 获取表单输入

```rust
async fn create_user(Form(frm): Form<CreateUser>) -> String {
    format!(
        "Created user: {}, email: {}, level: {}",
        frm.username, frm.email, frm.level
    )
}
```

### 路由定义

```rust
route("/create_user", post(create_user));
```

> 注意，这里我们定义的是 POST 路由

### 访问结果示例：

```bash
$ curl http://127.0.0.1:9527/create_user -X POST -d 'username=axum.rs&email=term@axum.rs&level=1'
Created user: axum.rs, email: term@axum.rs, level: 1
```

## 获取用户提交的 JSON 数据

将上例的 `Form` 改成 `Json` 就可以获取用户以 JSON 格式提交的数据了：

```rust
async fn create_user_ajax(Json(frm): Json<CreateUser>) -> String {
    format!(
        "Created user: {}, email: {}, level: {}",
        frm.username, frm.email, frm.level
    )
}
```

### 访问结果示例：

```bash
$ curl http://127.0.0.1:9527/create_user_ajax -H 'content-type:application/json' -X POST -d '{"username":"axum.rs","email":"term@axum.rs","level":1}'
Created user: axum.rs, email: term@axum.rs, level: 1
```

## 获取所有请求头

axum 将请求头封装成了 `HeaderMap`，通过 handler 参数可以很方便的获取到它。

```rust
async fn get_all_headers(headers: HeaderMap) -> String {
    format!("{:?}", headers)
}
```

## 获取请求头数据

下面以 `USER AGENT` 为例，演示获取某一个请求头数据方法。

```rust
async fn get_user_agent(headers: HeaderMap) -> String {
    headers
        .get(axum::http::header::USER_AGENT)
        .and_then(|v| v.to_str().ok())
        .map(|v| v.to_string())
        .unwrap()
}
```

## 获取已命名请求头数据

axum 提供了一种更加简便的方法来获取某个请求头的数据。称为 **_TypedHeader_** 。

这种方式在编写代码的时候非常简单：

```rust
async fn get_user_agent_typed(TypedHeader(user_agent): TypedHeader<UserAgent>) -> String {
    user_agent.to_string()
}
```

省去了手动获取、转换 header 数据的步骤。但 axum 默认并没有启用该功能，需要在 `Cargo.toml` 中手动启用 `headers` 这个 feature，同时，需要加入名为 `headers` 的 crate：

```toml
axum = { version = "0.3", features = ["headers"]}
headers = "0.3"
```

本章详解了 axum 获取请求数据的几种方式，从中可以看出 axum 的可扩展性和灵活性。本章代码你可以在[代码仓库](https://github.com/axumrs/roaming-axum/tree/main/request)中查看。

思考题：

1.  如何读取 Cookie 数据？

2.  如何写入 Cookie 数据？

> 提示：
>
> 1.  读取和写入 Cookie 都是通过 Headers 完成
> 2.  先在响应中写入，再从后续的请求中读取

思考完成之后，你可以看一下我们准备的《[axum 处理 cookie](https://axum.rs/topic/roaming-axum/cookie)》章节。
