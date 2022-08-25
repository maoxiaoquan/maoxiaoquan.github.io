# axum 实现 Session

由于 HTTP 是无状态的，所以我们可以通过[cookie](https://axum.rs/topic/roaming-axum/cookie)来维护状态。但 cookie 是直接保存到客户端，所以对于敏感数据，不能直接保存到 cookie。我们可以把敏感数据保存到服务端，然后把对应的 ID 保存到 cookie，这就是 Session。本章我们将使用 Cookie 和 [Redis](https://axum.rs/topic/roaming-axum/redis) 实现一个简单的 Session。

本章将会通过一个简单的用户登录流程来演示 Session 的实现。

- `GET /`：用户信息首页。如果登录成功，从 Session 中读取已登录用户的信息；如果没有登录，提示用户进行登录

- `GET /login`：显示用户登录表单

- `POST /login`：处理用户登录。如果用户名和密码正确，将用户信息保存到 Session，并跳转到用户信息首页。

- `GET /logout`：退出登录。清空 Session

## 保存 Session 的流程

```undefined
将用户信息保存到redis，并将Session ID写入cookie
```

代码如下：

```rust
/// 将 Session ID 保存到 Cookie
fn save_session_id_to_cookie(session_id: &str, headers: &mut HeaderMap) {
    let cookie = format!("{}={}", SESSION_ID_COOKIE_NAME, session_id);
    headers.insert(
        axum::http::header::SET_COOKIE,
        cookie.as_str().parse().unwrap(),
    );
}

```

## 读取 Session 的流程

```undefined
从cookie中读取到Session ID，然后从 Redis 读取该ID对应的用户信息
```

代码如下：

```rust
/// 从 cookie 中获取session id
fn get_session_from_cookie(headers: &HeaderMap) -> Option<String> {
    let cookies = headers
        .get(axum::http::header::COOKIE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("");
    if cookies.is_empty() {
        return None;
    }
    let mut session_id: Option<String> = None;
    let cookies: Vec<&str> = cookies.split(';').collect();
    for cookie in cookies {
        let cookie_pair: Vec<&str> = cookie.split('=').collect();
        let cookie_name = cookie_pair[0].trim();
        let cookie_value = cookie_pair[1].trim();
        if cookie_name == SESSION_ID_COOKIE_NAME && !cookie_value.is_empty() {
            session_id = Some(cookie_value.to_string());
            break;
        }
    }
    session_id
}
```

## 登录

首先，我们来看一下登录操作。获取用户提交的表单，并判断用户名和密码，如果验证通过，将用户信息序列化后保存到 Redis，并生成对应的 Session ID。将这个 Session ID 写入 Cookie，同时跳转到用户信息首页：

```rust
/// 登录操作
async fn logout_action(
    Extension(rdc): Extension<redis::Client>,
    Form(frm): Form<UserLoginForm>,
) -> Result<(StatusCode, HeaderMap, ()), String> {
    let mut headers = HeaderMap::new();
    let url;
    if !(&frm.username == "axum.rs" && &frm.password == "axum.rs") {
        url = "/login?msg=用户名或密码错误"
    } else {
        // 生成 session ID
        let session_id = Uuid::new_v4().to_simple().to_string();
        // 将 session ID 保存到 Cookie
        save_session_id_to_cookie(&session_id, &mut headers);

        let user_session = UserSession {
            username: frm.username,
            level: 1,
        };
        let user_session = serde_json::json!(user_session).to_string();

        // 将 session 保存到 redis
        let redis_key = format!("{}{}", SESSION_KEY_PREFIX, session_id);
        let mut conn = rdc
            .get_async_connection()
            .await
            .map_err(|err| err.to_string())?;
        // session 将在20分钟后自动过期
        conn.set_ex(redis_key, user_session, 1200)
            .await
            .map_err(|err| err.to_string())?;
        url = "/"
    }
    headers.insert(axum::http::header::LOCATION, url.parse().unwrap());
    Ok((StatusCode::FOUND, headers, ()))
}

```

## 用户信息首页

在用户信息首页，首先尝试从 Cookie 中获取 Session ID，获取到之后，通过这个 Session ID 从 Redis 读取出用户信息，并反序列化为结构体。如果 Cookie 中没有 Session ID 或者 Redis 中没有对应的用户信息，则提示需要登录。

```rust
/// 首页
async fn index(
    Extension(rdc): Extension<redis::Client>,
    headers: HeaderMap,
) -> Result<Html<String>, String> {
    let session_id = get_session_from_cookie(&headers);
    let mut session: Option<UserSession> = None;
    if let Some(session_id) = session_id {
        // 从 redis 读取 Session
        let redis_key = format!("{}{}", SESSION_KEY_PREFIX, session_id);
        let mut conn = rdc
            .get_async_connection()
            .await
            .map_err(|err| err.to_string())?;
        let session_str: Option<String> =
            conn.get(redis_key).await.map_err(|err| err.to_string())?;
        if let Some(session_str) = session_str {
            let user_session: UserSession =
                serde_json::from_str(&session_str).map_err(|err| err.to_string())?;
            session = Some(user_session);
        }
    }
    match session {
        Some(session) => {
            let html = format!(
                r#"
        <!DOCTYPE html>
        <html lang="zh-Hans">
          <head>
            <meta charset="utf-8" />
            <meta name="author" content="axum.rs (team@axum.rs)" />
            <title>
              用户首页-AXUM中文网
            </title>
          </head>
          <body>
            <div>欢迎 {} ! 你的等级是 {}。</div>
            <div><a href="/logout">退出登录</a></div>
          </body>
          </html>"#,
                session.username, session.level
            );
            Ok(Html(html))
        }
        None => Err("Please login via /login page".to_string()),
    }
}

```

## 退出登录

首先从 Cookie 中获取到 Session ID，然后将对应的用户信息从 Redis 中删除。

```rust
/// 退出登录
async fn logout(
    Extension(rdc): Extension<redis::Client>,
    headers: HeaderMap,
) -> Result<(StatusCode, HeaderMap, ()), String> {
    let session_id = get_session_from_cookie(&headers);
    let mut headers = HeaderMap::new();
    if let Some(session_id) = session_id {
        // 从 redis 删除 Session
        let redis_key = format!("{}{}", SESSION_KEY_PREFIX, session_id);
        let mut conn = rdc
            .get_async_connection()
            .await
            .map_err(|err| err.to_string())?;
        conn.del(redis_key).await.map_err(|err| err.to_string())?;
        // 清空Cookie
        save_session_id_to_cookie(&session_id, &mut headers);
    }
    headers.insert(axum::http::header::LOCATION, "/login".parse().unwrap());
    Ok((StatusCode::FOUND, headers, ()))
}

```

本章我们讨论了如何利用 Cookie 和 Redis 实现一个简单的 Session。涉及的代码有点多，请通过我们的[代码仓库](https://github.com/axumrs/roaming-axum/tree/main/session)查看完整代码。
