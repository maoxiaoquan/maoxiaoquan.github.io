### SeaORM 实现删除。

物理删除
所谓物理删除，是指定执行 SQL 的 DELETE 语句，将记录从数据库中删除。在 SeaORM 中，使用 delete_by_id()可以实现通过主键来删除：

```rust
category::Entity::delete_by_id(id)
      .exec(conn)
      .await
      .unwarp();
```

逻辑删除
所谓逻辑删除，是指通过修改 is_del 的值为 TRUE 来实现，其实就是一个 UPDATE 操作。下面是使用 save()的示例。

再次提醒，只有自增主键才能使用 save()

```rust
category::ActiveModel {
            id: Unchanged(id),
            is_del: Set(true),
            ..Default::default()
        }
    .save(conn)
    .await
    .unwrap();
```

代码
src/handler/category.rs

```rust
pub async fn del(
    Extension(state): Extension<Arc<AppState>>,
    Path(params): Path<param::DelParams>,
) -> Result<RedirectRespon> {
    let handler_name = "category/del";
    let conn = get_conn(&state);
    let real = params.real.unwrap_or(false);
    let id = params.id;
    if real {
        category::Entity::delete_by_id(id)
            .exec(conn)
            .await
            .map_err(AppError::from)
            .map_err(log_error(handler_name))?;
    } else {
        category::ActiveModel {
            id: Unchanged(id),
            is_del: Set(true),
            ..Default::default()
        }
        .save(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    }
    redirect("/category?msg=分类删除成功")
}
```

本章代码位于 05/删除数据分支。
