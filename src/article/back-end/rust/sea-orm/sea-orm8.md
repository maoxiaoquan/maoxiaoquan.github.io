### SeaORM 操作多对多关系

多对多关系，在数据库中需要借助第三张表来维护。

数据表及示例数据
我们需要创建两个表，并插入一些示例数据：

```rust
CREATE TABLE tags ( -- 标签
 id SERIAL PRIMARY KEY, -- 自增主键
 name VARCHAR(20) NOT NULL UNIQUE -- 标签名称
);
INSERT INTO tags (name) VALUES
('标签1'),
('标签2'),
('标签3');

CREATE TABLE article_tags ( -- 文章标签
 id SERIAL PRIMARY KEY, -- 自增主键
 article_id INT NOT NULL REFERENCES articles(id),
 tag_id INT NOT NULL REFERENCES tags(id)
);
INSERT INTO article_tags(article_id,tag_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 1),
(1, 3);
```

表 说明
tags 标签
article_tags 文章和标签的对应关系
实体

### 多对多中间实体的定义

```rust
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "article_tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub article_id: i32,
    pub tag_id: i32,
}

#[derive(Debug, Clone, Copy, EnumIter)]
pub enum Relation {
    Article,
    Tag,
}

impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        match self {
            Self::Article => Entity::belongs_to(super::article::Entity)
                .from(Column::ArticleId)
                .to(super::article::Column::Id)
                .into(),
            Self::Tag => Entity::belongs_to(super::tag::Entity)
                .from(Column::TagId)
                .to(super::tag::Column::Id)
                .into(),
        }
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

我们在中间实体中定义了两个关系：

Relation::Artice：通过 article_id = articles.id 与文章建立关系
Relation:Tag：通过 tag_id = tags.id 与标签建立关系
两个关系都是通过 belongs_to()定义的。

### 标签实体的定义

```rust
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Clone, Copy, EnumIter)]
pub enum Relation {}

impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        panic!()
    }
}

impl Related<super::article::Entity> for Entity {
    fn to()->RelationDef {
        super::article_tag::Relation::Article.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::article_tag::Relation::Tag.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

我们并没有给标签实体定义关系，而是通过 Related<super::article::Entity>告诉 SeaORM 如何去找所需要的文章实体。

Related::to()
Related::to()：某个实体是否与另一个实体相关。

tag::Entity::Related<super::article::Entity>::to() 表示， tag::Entity 里的 article::Entity 是通过 article_tag::Relation::Article.def()获得的。完整的路径是：Tag -> ArticleTag -> Article

Related::via()
Related::via()：某个实体是否通过另一个实体关联。

tag::Entity::Related<super::article::Entity>::via()的结果是，原始的 ArticleTag -> Tag 将变成 Tag -> ArticleTag。

to()和 via() 我也不知道怎么描述，或许你的理解能力比我强，欢迎分享。理解不了也没关系，照抄就好了。——通过 SeaORM 生成的 SQL 语句来验证是否正确、是否合理。

文章实体中定义和标签的关系
给 src/entity/article.rs 添加和标签的关系：

```rust
impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        super::article_tag::Relation::Tag.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::article_tag::Relation::Article.def().rev())
    }
}
```

### 显示带标签的文章列表

多对多关系定义好之后，可以在任意一方来查询。比如本例的通过文章列表来同时显示标签：

```rust
pub async fn list_with_tags(Extension(state): Extension<Arc<AppState>>) -> Result<String> {
    let handler_name = "article/list_with_tags";
    let conn = get_conn(&state);
    let list: Vec<(article::Model, Vec<tag::Model>)> = article::Entity::find()
        .find_with_related(tag::Entity)
        .all(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    let mut ss = vec![];
    for item in list {
        let (article, tags) = item;
        let tags = tags
            .iter()
            .map(|tag| format!("【#{} - {}】", &tag.id, &tag.name))
            .collect::<Vec<String>>()
            .join(", ")
            .to_string();

        let s = format!(
            "文章ID: {}, 文章标题: {}, 标签： {}",
            &article.id, &article.title, tags,
        );
        ss.push(s);
    }
    Ok(ss.join("\n").to_string())
}
```

### 如果要通过标签来查询关联的文章，只需要

```rust
let list: Vec<(tag::Model, Vec<article::Model>)> = tag::Entity::find()
        .find_with_related(article::Entity)
//...
```

本章代码位于 07/多对多分支
