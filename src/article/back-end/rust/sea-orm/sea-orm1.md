# sea-orm

## SeaORM 和 axum 开发。

本专题将带你体验 SeaORM 和 axum 开发。

SeaORM 是一个关系型 ORM，用于帮助你像使用动态语言那样，在 Rust 中构建 Web 服务。

SeaORM 特点
异步：基于 SQLx，SeaORM 天生就支持异步。  
动态：基于 SeaQuery，SeaORM 让你无需 与 ORM 作斗争，而轻松构建复杂的查询。  
可测试：使用模拟连接来编写单元测试，以便测试你的逻辑。  
面向服务：快速构建在 API 中加入、过滤、排序和分页数据的服务。

### SeaORM 术语

| SeaORM      | 术语 对应的数据库术语                                                   |
| ----------- | ----------------------------------------------------------------------- |
| Schema      | 数据库(Database)                                                        |
| Entity      | 数据表及关系(Table and Relation)                                        |
| Model       | 数据表(Table)                                                           |
| Relation    | 关系(Relation)                                                          |
| Column      | 字段的定义                                                              |
| PrimaryKey  | 主键(Primary key)                                                       |
| Attribute   | 字段(Column)                                                            |
| ActiveModel | 可写操作                                                                |
| Model       | 实例只能用于只读操作；如果需要进行写操作，需要使用 ActiveModel 的实例。 |

### 数据结构

#### 示例说明

```
分类(category)
字段 说明
id 主键。自增
name 分类名称
```

```
文章(article)
字段 说明
id 主键。自增
category_id 外键。文章所属的分类 ID
title 文章标题
contet 文章内容
```

创建项目
使用 cargo 创建好项目之后，加入以下依赖：

```rust
axum="0.5"
tokio={ version="1", features=["full"] }
sea-orm={ version="0.8", features=["runtime-tokio-native-tls", "sqlx-postgres", "debug-print"] }
```

准备数据
请创建一个 PostgreSQL 数据库，并将以下 SQL 导入其中：

```rust
CREATE TABLE categoies ( -- 分类
	id SERIAL PRIMARY KEY, -- 自增主键
	name VARCHAR(20) NOT NULL UNIQUE, -- 分类名称
	is_del BOOLEAN NOT NULL DEFAULT FALSE -- 是否删除
);

CREATE TABLE articles ( -- 文章
	id SERIAL PRIMARY KEY, -- 自增主键
	category_id INT NOT NULL REFERENCES categoies(id), -- 文章所属分类的ID，外键
	title VARCHAR(255) NOT NULL, -- 文章标题
	content TEXT NOT NULL, -- 文章内容
	dateline TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 添加时间
	is_del BOOLEAN NOT NULL DEFAULT FALSE -- 是否删除
);

-- 插入示例数据
INSERT INTO categoies (id,name) VALUES
(1,'Rust'), (2,'Go'), (3,'Javascript');
```

编写实体并实现所需的 trait
下面，我们为分类(即 categoies 表)编写对应实体：

```rust
// src/entity/category.rs
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "categoies")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub name: String,
    pub is_del: bool,
}

#[derive(Debug, Clone, Copy, EnumIter)]
pub enum Relation {}

impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        panic!("没有定义关系")
    }

}

impl ActiveModelBehavior for ActiveModel {}

```

### SeaORM 的实体和 Rust 的模块

SeaORM 将每一个数据表抽象成一个实体，而在 Rust 中，通常使用模块来表示实体。

```rust
通常，每个实体都会包含 Entity、 Model、Relation 和 ActiveModel。

Entity // 用于操作数据库。

Model // 用于定义数据表中的字段与 Rust 数据结构的映射关系。同时，在 SELECT 操作时，返回的也是 Model 的实例。

Relation // 用于定义数据表之间的关系。目前，我们不作任何定义，而是直接抛出一个 panic

ActiveModel // 也是数据表中字段与 Rust 数据结构的映射，不同于 Model 的是，ActiveModel 用于“写”操作，比如 UPDATE、DELETE 等。

等等，这个 ActiveModel 是怎么来的？参考源码 可以发现，DeriveEntityModel 这个 derive 根据我们定义的 Model，生成了包括 ActiveModel 在内的多个数据结构

DeriveEntityModel // 这是一个【全能】的派生宏，它主要用于从指定的 Model 中，生成以下数据结构：
```

```rust
Entity
ActiveModel
Column
PrimaryKey
```

## 共享数据库连接

### 配置文件

```rust
WEB.ADDR=127.0.0.1:9527
DB.DSN="postgres://<用户名>:<密码>@pg.axum.rs:5432/axum_rs_seaorm"
```

### 共享状态结构体

```rust
// src/state.rs
use sea_orm::DatabaseConnection;

pub struct AppState {
    pub conn: DatabaseConnection,
}
```

### 给路由加上共享状态

```rust
// src/main.rs
dotenv().ok();
let cfg = config::Config::from_env().unwrap();
let conn = Database::connect(&cfg.db.dsn).await.unwrap();
let app = router::init().layer(Extension(Arc::new(state::AppState { conn })));
```

### 实现分类列表功能

从共享状态中获取数据库连接

```rust
// src/handler/mod.rs

fn get_conn<'a>(state: &'a AppState) -> &'a DatabaseConnection {
    &state.conn
}
```

### 从数据库中获取所有分类

```rust
// src/handler/category.rs
use std::sync::Arc;

use axum::Extension;
use sea_orm::{EntityTrait, QueryOrder};

use super::{get_conn, render, HtmlRespon};
use crate::{entity::category, state::AppState, view, AppError, Result};

pub async fn index(Extension(state): Extension<Arc<AppState>>) -> Result<HtmlRespon> {
    let handler_name = "category/index";
    let conn = get_conn(&state);
    let categies: Vec<category::Model> = category::Entity::find()
        .order_by_asc(category::Column::Id)
        .all(conn)
        .await
        .map_err(AppError::from)?;
    let tpl = view::CategoryTemplate { categies };
    render(tpl, handler_name)
}
```

我们重点来看这段代码：

```rust
let categies: Vec<category::Model> = category::Entity::find()
        .order_by_asc(category::Column::Id)
        .all(conn)
        .await
        .map_err(AppError::from)?;
category::Entity::find() -> Select<E>
```

```rust
构造一个用于查询的 Select<E>对象。

Select<E> // 用于执行数据库 SELECT 操作的对象。

order_by_asc() // 指定用于升序排序的字段。

category::Column::Id // 指定字段名

all() // 获取所有数据
```

```rust
// src/view.rs

#[derive(Template)]
#[template(path = "category.html")]
pub struct CategoryTemplate {
    pub categies: Vec<entity::category::Model>,
}
```

模板渲染

```rust
<!-- templates/category.html -->
<table class="table">
    <thead>
        <tr>
            <th>#</th>
            <th>名称</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        {% for category in categies %}
        <tr>
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>
                <a href="/category/edit/{{ category.id }}" class="btn btn-primary btn-sm">修改</a>
                <a href="/category/del/{{ category.id }}" class="btn btn-danger btn-sm" onclick="return confirm('确定删除“{{ category.name }}”？')">删除</a>
            </td>
        </tr>
        {% endfor %}
    </tbody>
</table>
```
