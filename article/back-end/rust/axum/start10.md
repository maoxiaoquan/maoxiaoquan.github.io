# axum 集成 JWT

Json web token（JWT）是为了网络应用环境间传递声明而执行的一种基于 JSON 的开发标准（RFC 7519），该 token 被设计为紧凑且安全的，特别适用于分布式站点的单点登陆（SSO）场景。JWT 的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该 token 也可直接被用于认证，也可被加密。– 摘自《[JWT 详解](https://www.cnblogs.com/cy0628/p/15039001.html)》

本章将演示如何在 axum 中集成 JWT。本章示例基于[官方示例](https://github.com/tokio-rs/axum/tree/main/examples/jwt)进行简化。

## 定义密钥

密钥用于对认证信息进行加密、解密。

```rust
const JWT_SECRET: &str = "https://AXUM.RS";

pub struct Keys {
    encoding: EncodingKey,
    decoding: DecodingKey<'static>,
}

impl Keys {
    pub fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret).into_static(),
        }
    }
    pub fn global() -> Self {
        Self::new(JWT_SECRET.as_bytes())
    }
}
```

## 定义传递的数据

```rust
#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub company: String,
    pub exp: usize,
}
```

## 定义一些辅助的结构体

### 请求获取令牌的结构体

```rust
#[derive(Deserialize)]
pub struct AuthPayload {
    pub client_id: String,
    pub client_secret: String,
}
```

### 返回给客户端的令牌结构体

```rust
#[derive(Serialize)]
pub struct AuthBody {
    pub access_token: String,
    pub token_type: String,
}

impl AuthBody {
    pub fn new(access_token: String) -> Self {
        Self {
            access_token,
            token_type: String::from("Bearer"),
        }
    }
}
```

## 获取授权令牌

```rust
async fn authorize(Json(payload): Json<AuthPayload>) -> Result<Json<AuthBody>, Json<String>> {
    if payload.client_id.is_empty() || payload.client_secret.is_empty() {
        return Err(Json(String::from("Missing Credentials")));
    }

    if payload.client_id != "axum.rs" || payload.client_secret != "team@axum.rs" {
        return Err(Json(String::from("Wrong Credentials")));
    }

    let claims = Claims {
        sub: "team@axum.rs".to_string(),
        company: "AXUM.RS".to_string(),
        exp: 10000000000,
    };

    let token = encode(&Header::default(), &claims, &Keys::global().encoding)
        .map_err(|err| Json(err.to_string()))?;

    Ok(Json(AuthBody::new(token)))
}
```

## 需要令牌才能访问的资源

```rust
async fn protected(
    TypedHeader(Authorization(bearer)): TypedHeader<Authorization<Bearer>>,
) -> Result<String, String> {
    let token_data = decode::<Claims>(
        bearer.token(),
        &Keys::global().decoding,
        &Validation::default(),
    )
    .map_err(|err| format!("Invalid Token: {}", err.to_string()))?;
    let claims = token_data.claims;
    Ok(format!(
        "Welcome, your email {}, company: {}",
        claims.sub, claims.company
    ))
}
```

## 运行

### 获取令牌

```bash
$ curl -i -X POST -H 'content-type:application/json' -d '{"client_id":"axum.rs","client_secret":"team@axum.rs"}' http://127.0.0.1:9527/authorize
{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZWFtQGF4dW0ucnMiLCJjb21wYW55IjoiQVhVTS5SUyIsImV4cCI6MTAwMDAwMDAwMDB9.2jPYCuK6_nDrFdXS3HLAm43YvbFvrBBLYS6YkZ_z6zM","token_type":"Bearer"}
```

### 使用令牌访问被保护的数据

\$ curl -H 'content-type:application/json' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZWFtQGF4dW0ucnMiLCJjb21wYW55IjoiQVhVTS5SUyIsImV4cCI6MTAwMDAwMDAwMDB9.2jPYCuK6_nDrFdXS3HLAm43YvbFvrBBLYS6YkZ_z6zM' 127.0.0.1:9527/protected
Welcome, your email team\@axum.rs, company: AXUM.RS

### 使用非法的令牌访问被保护的数据

curl -H 'content-type:application/json' -H 'Authorization: Bearer foobar' 127.0.0.1:9527/protected
Invalid Token: InvalidSignature

本文讨论了在 axum 集成 JWT 功能，完整代码可以在我们的[代码仓库](https://github.com/axumrs/roaming-axum/tree/main/jwt)中找到。
