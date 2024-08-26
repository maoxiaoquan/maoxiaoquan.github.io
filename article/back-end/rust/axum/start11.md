# axum 上传文件

文件上传是 Web 开发中常见的功能，本章将演示如何在 axum 实现文件上传。

## 启用 feature

要让 axum 支持文件上传，需要在 `Cargo.toml` 中显式的启用名为`multipart`的 feature：

axum = \{version = "0.3", features = \["multipart"\] \}

## 文件上传表单

首先，我们定义文件上传表单：

```rust
/// 上传表单
async fn upload_file() -> Html<&'static str> {
    Html(
        r#"
        <!doctype html>
        <html>
            <head>
            <meta charset="utf-8">
                <title>上传文件</title>
            </head>
            <body>
                <form action="/upload" method="post" enctype="multipart/form-data">
                    <label>
                        上传文件：
                        <input type="file" name="axum_rs_file">
                    </label>
                    <button type="submit">上传文件</button>
                </form>
            </body>
        </html>
        "#,
    )
}
```

> 注意，要使用文件上传，必须将`<form>`的`enctype`设置为`multipart/form-data`

## 处理上传

```rust
/// 上传操作
async fn upload_file_action(
    ContentLengthLimit(mut multipart): ContentLengthLimit<Multipart, { MAX_UPLOAD_SIZE }>,
) -> Result<(HeaderMap, String), String> {
    if let Some(file) = multipart.next_field().await.unwrap() {
        let filename = file.file_name().unwrap().to_string(); // 上传的文件名
        let data = file.bytes().await.unwrap(); // 上传的文件的内容

        // 保存上传的文件
        //std::fs::write(&filename, &data).map_err(|err| err.to_string())?;
        tokio::fs::write(&filename, &data)
            .await
            .map_err(|err| err.to_string())?;

        return cn(format!(
            "【上传的文件】文件名：{:?}, 文件大小：{}",
            filename,
            data.len()
        ))
        .await;
    }
    cn(String::from("没有上传文件")).await
}
```

注意这个函数的参数：`ContentLengthLimit(mut multipart): ContentLengthLimit<Multipart, { MAX_UPLOAD_SIZE }>`：

- `ContentLengthLimit` 和 `Multipart` 都是 axum 提供的`extract`。前者用于限制 HTTP 内容的长度，后者用于处理`multipart/form-data`。

- 获取到的变量是`mut`的

首先，我们通过`multipart.next_field()`获取到提交过来的\(下一个\)`type="file"`的表单域。由它的方法名可知，它支持多文件上传。

然后，我们通过相关方法获取到上传文件的信息：

- `file_name()`：获取上传的文件的文件名

- `bytes()`：获取上传的文件的内容

- `name()`：获取`<input type="file" name="axum_rs_file">`标签的`name`属于，此例中为`axum_rs_file`

最后，将上传的文件保存到服务器上：

```rust
tokio::fs::write(&filename, &data)
            .await
            .map_err(|err| err.to_string())?;
```

我们使用了`tokio`提供的异步 API，将上传的内容保存到服务器。

本章讨论了在 axum 实现文件上传功能，完整代码可以在我们的[代码库](https://github.com/axumrs/roaming-axum/blob/main/upload-file)中找到。
