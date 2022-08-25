# 插入数据

ActiveModel
之前的章节讨论过，Model 是只读的，只能用来 SELECT；而 INSERT/UPDATE/DELETE 等属于写操作，需使用 ActiveModel。

代码
src/handler/category.rs

```rust
pub async fn add(
    Extension(state): Extension<Arc<AppState>>,
    Form(frm): Form<form::CategoryForm>,
) -> Result<RedirectRespon> {
    let handler_name = "category/add";
    let conn = get_conn(&state);
    let am = category::ActiveModel {
        name: Set(frm.name),
        ..Default::default()
    };
    let added_category: category::Model = am
        .insert(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    let url = format!("/category?msg=分类添加成功，ID是：{}", added_category.id);
    redirect(url.as_str())
}
```

分析一下这段代码：

```rust
Form(frm): Form<form::CategoryForm>：获取表单输入，该文件位于src/form.rs
let am = category::ActiveModel { ... }; ：使用表单输入的值构造一个 ActiveModel，其中的 Set()见下文
let added_category: category::Model = am.insert(conn)...;：调用 ActiveModel的insert()方法，将数据写入到数据库中
Set
Set() ：官方的描述可能看的头大，我的理解是，它用来设置这个值要在 SQL 中进行 SET 操作。
```

⚠️ 提示：千万别忘了 Set

```rust
insert()
async insert()：执行数据库的INSERT操作。
```

本章代码位于 03/插入数据分支
