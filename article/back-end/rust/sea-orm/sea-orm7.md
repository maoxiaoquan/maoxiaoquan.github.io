### SeaORM 的命令行工具和自动迁移

SeaORM 提供了一个命令行工具，可以快速生成实体。同时，还提供了自动迁移功能。

sea-orm-cli —— 实用的 SeaORM 命令行工具

```rust
cargo install sea-orm-cli
```

### 生成实体

```rust
sea-orm-cli generate entity \
    -u 'postgres://axum_rs:axum_rs@pg.axum.rs:5432/axum_rs' \
    -o src/entity
```

参数 说明
-u 指定数据库连接字符串。
也可以设置环境变量 DATABASE_URL，从而省略该参数
-o 生成的实体输出到的目录
以下是使用环境变量的方式：

DATABASE_URL='postgres://axum_rs:axum_rs@pg.axum.rs:5432/axum_rs' sea-orm-cli generate entity \
 -o src/entity
关于输出目录
输出目录有很多选择，取决于你的项目结构。

如果你使用了 [workspace]，则应将其输出到单独的子项目：-o entity/src 👉 别忘了在其它使用它的项目的 Cargo.toml 加上它的依赖
如果你只是一个简单的项目，则应将其输出到当前项目的 src 目录下，作为一个模块使用：-o src/entity 👉 别忘了在 src/main.rs 或 src/lib.rs 加上 pub mod entity;
数据迁移
官方文档

### 初始化迁移目录

```rust
sea-orm-cli migrate init
```

> 将在当前目录下创建./migration 子目录

### 运行数据迁移

```rust
sea-orm-cli migrate up
```

### 子命令列表

```rust
sea-orm-cli migrate <子命令>
```

子命令 说明
init 初始化
up 运行所有已准备的迁移
up -n 10 运行 10 条已准备的迁移
down 回滚最后的迁移
down -n 10 回滚最后 10 条迁移
status 当前迁移状态
fresh 删除数据库中所有表，然后运行所有迁移
refresh 回滚所有已运行的迁移，然后重新运行所有迁移
reset 回滚所有已运行的迁移
通过编程方式操作数据迁移
实现 MigratorTrait，然后就可以通过编程方式操作了。
