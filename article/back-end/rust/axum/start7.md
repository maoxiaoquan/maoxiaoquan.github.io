# axum 处理 cookie

Cookie 是通过 HTTP Header 进行传递的。由某个响应头进行设置，然后其它请求头就可以获取到了。本章将通过模拟用户中心来用 axum 操作 HTTP Header 演示 Cookie 的读写操作。

本章示例将实现以下路由：

| 路由          | 说明                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| `GET /`       | 用户中心首页。如果用户未登录，显示提示信息；如果用户已登录，显示欢迎信息 |
| `GET /login`  | 用户登录表单                                                             |
| `POST /login` | 用户登录处理。如果用户名和密码正确，设置 Cookie 并跳转到用户中心首页     |
| `GET /logout` | 退出登录                                                                 |

> 为了突出重点，用户登录表单就不在这里展示了，你可以通过源代码查看。

## 用户登录

获取用户通过表单提交的登录信息，如果用户名和密码都正确，则设置 Cookie 并跳转到用户中心首页。代码如下：

```rust
async fn user_login_action(Form(frm): Form<UserLoginForm>) -> (StatusCode, HeaderMap, ()) {
    let mut headers = HeaderMap::new();
    if !(&frm.username == "axum.rs" && &frm.password == "axum.rs") {
        headers.insert(
            axum::http::header::LOCATION,
            "/login?msg=用户名或密码错误".parse().unwrap(),
        ); // 跳转到登录页面
    } else {
        let cookie = format!("{}={}", COOKIE_NAME, frm.username);
        headers.insert(
            axum::http::header::SET_COOKIE,
            cookie.as_str().parse().unwrap(),
        ); // 设置Cookie
        headers.insert(axum::http::header::LOCATION, "/".parse().unwrap()); // 跳转到用户中心首页
    }
    (StatusCode::FOUND, headers, ())
}
```

该处理函数的参数是一个表单结构体，其中包含了用户提交的用户名和密码。

首先，检查用户名和密码是否是`axum.rs`，如果不是，跳转到用户登录的表单页面，并附带提示信息。

如果用户名和密码正确，先设置 Cookie，注意，设置 Cookie 的 Header 名是 `SET_COOKIE`；然后跳转到用户中心首页。

## 用户中心首页

对于未登录的用户，用户中心首页将提示错误信息。相应的，对于已登录用户，则从 Cookie 取出登录用户的用户名，并显示欢迎信息。

```rust
async fn user_center(headers: HeaderMap) -> Result<Html<String>, &'static str> {
    let cookies = headers
        .get(axum::http::header::COOKIE)
        .and_then(|v| v.to_str().ok())
        .map(|v| v.to_string())
        .unwrap_or("".to_string()); // 从请求头获取所有COOKIE
    if cookies.is_empty() {
        return Err("NO COOKIE SETTED"); // 没有 Cookie
    }
    let mut logined_username: Option<String> = None;
    let cookies: Vec<&str> = cookies.split(';').collect(); // 多个cookie用;分割
    for cookie in cookies {
        let cookie_pair: Vec<&str> = cookie.split('=').collect(); // 每个cookie都是用=分割的键值对
        let cookie_name = cookie_pair[0].trim();
        let cookie_value = cookie_pair[1].trim();
        // 如果 cookie 的名称是我们希望的，并且值不为空
        if cookie_name == COOKIE_NAME && !cookie_value.is_empty() {
            logined_username = Some(String::from(cookie_value)); // 设置已登录用户的用户名
            break;
        }
    }
    if logined_username.is_none() {
        return Err("COOKIE IS EMPTY"); // 没有我们需要的cookie
    }
    let html = format!(
        r#"
        <!DOCTYPE html>
        <html lang="zh-Hans">
          <head>
            <meta charset="utf-8" />
            <meta name="author" content="axum.rs (team@axum.rs)" />
            <title>
              用户中心-AXUM中文网
            </title>
          </head>
          <body>
          <p>你好，<strong>{}</strong>！你已成功登录。[<a href="/logout">退出登录</a>]
          </body>
          </html>
        "#,
        logined_username.unwrap()
    );
    Ok(Html(html))
}
```

因为我们要通过 HTTP Header 获取 Cookie，所以该处理器的参数是一个包含所有 Header 的集合。

首先，获取 Cookie。如果 HTTP Header 中没有 Cookie，直接返回错误信息。和写入不同，读取 Cookie 时，使用的 Header 名是 `COOKIE`。

接着检查已设置的 Cookie。在 HTTP Header 中，Cookie 的形式是这样的：`cookie1=value1;cookie2=value2`。所以先通过`;`将 Header 中的 Cookie 信息拆分成一个个键值对，然后再对键值对进行`=`拆分，这样就能得到 Cookie 的名称和值。

遍历已拆分的 Cookie，如果名称是我们期望的，并且值不为空，说明用户已登录，这时候返回欢迎信息；相反，返回错误信息。

## 退出登录

退出登录也是设置 Cookie，只是把 Cookie 的值设置为空。

```rust
async fn user_logout() -> (StatusCode, HeaderMap, ()) {
    let cookie = format!("{}=", COOKIE_NAME);
    let mut headers = HeaderMap::new();
    headers.insert(
        axum::http::header::SET_COOKIE,
        cookie.as_str().parse().unwrap(),
    ); // 清空Cookie
    headers.insert(axum::http::header::LOCATION, "/login".parse().unwrap()); // 跳转到登录页面
    (StatusCode::FOUND, headers, ())
}
```

本章通过一个模拟的用户中心演示了如何读写 Cookie。完整代码可以在我们的[代码库](https://github.com/axumrs/roaming-axum/tree/main/cookie)中找到。

## Cookie 中间件

还记得吗？我们在讲解中间件时说过，axum 直接使用了 tower 的中间件生态。[tower-cookies](https://github.com/imbolc/tower-cookies)是一个可以用于 axum 的 Cookie 中间件。

## 思考题

1.  在登录的时候，如果用户输入的用户名或密码错误，会跳转到登录表单页面，并附带一个提示信息。我们并没有获取这个提示信息并进行处理。请你动动手，获取并处理这个提示信息。

2.  回想一下在讲解 axum 请求时，我们说到 axum 提供了`TypedHeader`来简化操作，试试看能不能用它来简化 Cookie 的读取。
