## 修改数据

代码
src/handler/category.rs

```rust
pub async fn edit(
    Extension(state): Extension<Arc<AppState>>,
    Form(frm): Form<form::CategoryForm>,
    Path(id): Path<i32>,
) -> Result<RedirectRespon> {
    let handler_name = "category/edit";
    let conn = get_conn(&state);
    let am = category::ActiveModel {
        id: Unchanged(id),
        name: Set(frm.name),
        ..Default::default()
    };
    am.update(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    redirect("/category?msg=分类修改成功")
}
```

Unchanged()
Unchanged() 用于指定不参与数据库的 SET。因为我们的 id 只是为了标识某条记录，以便于更新该条记录的其它字段，所以 id 本身是不需要修改的。

update()
update() 执行数据库的 UPDATE 操作。

自动决定是更新还是插入 - save()
上一章我们使用 insert()来插入数据，本章我们使用 update()来更新数据。其实 SeaORM 提供了 save()，它可以自动决定是插入还是更新：

当主键为 NotSet 时，执行 INSERT
当主键为 Set 或 UnChange 时，执行 UPDATE

```rust
// INSERT
category::ActiveModel {
        id: NotSet,
        name: Set(name),
        ..Default::default()
    }.save(conn).await.unwarp();

// UPDATE
category::ActiveModel {
        id: Unchanged(id),
        name: Set(name),
        ..Default::default()
    }.save(conn).await.unwarp();

// UPDATE
category::ActiveModel {
        id: Set(id),
        name: Set(name),
        ..Default::default()
    }.save(conn).await.unwarp();
```

⚠️ save() 仅适用于自增长的主键

ActiveValue 枚举
Set、NotSet 和 Unchanged 都是 ActiveValue 的枚举值。

本章代码位于 04/修改数据分支

```

```
