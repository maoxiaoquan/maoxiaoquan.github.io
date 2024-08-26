### SeaORM 操作一对多和多对一关系

正如其名，关系型数据库中的“关系”是很重要的部分。SeaORM 支持常见的数据关系，本章将讨论其中的一对多和多对一关系。

相同的两个数据表之间的一对多和多对一，在 SQL 语句的表现上是一样的，只是从不同角度来描述而已。比如本专题的分类和文章：

从分类的角度看，是一对多，即一个分类可以对应多个文章
从文章的角度看，是多对一，即多个文章可以对应同一个分类
插入文章的示例数据
为了方便演示，先通过 SQL 插入一些文章的示例数据：

-- 插入文章的示例数据

```rust
INSERT INTO articles (category_id, title,content) VALUES
(1, '标题-GLKUSroPOR', '内容-GLKUSroPOR'),
(1, '标题-hFQRulHJAk', '内容-hFQRulHJAk'),
(2, '标题-pM0TURxhwC', '内容-pM0TURxhwC'),
(1, '标题-svNJmWaqRo', '内容-svNJmWaqRo'),
(3, '标题-8XWiTUSfhB', '内容-8XWiTUSfhB'),
(2, '标题-yvwE32TLkg', '内容-yvwE32TLkg');
```

定义文章实体和关系 - 多对一
// src/entity/article.rs

```rust
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "articles")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub category_id: i32,
    pub title: String,
    pub content: String,
    pub dateline: chrono::DateTime<chrono::Local>,
    pub is_del: bool,
}

#[derive(Debug, Clone, Copy, EnumIter)]
pub enum Relation {
    Category,
}

impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        match self {
            Self::Category => Entity::belongs_to(super::category::Entity)
                .from(Column::CategoryId)
                .to(super::category::Column::Id)
                .into(),
        }
    }
}
impl Related<super::category::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Category.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

定义 Relation
我们给文章实体定义了包含 Category 的关系：

```rust
pub enum Relation {
    Category,
}
```

为 Relation 实现 RelationTrait
定义了 Relation 并没实际意义，毕竟它只是一个枚举值而已。我们需要为这个关系实现业务逻辑：

```rust
impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        match self {
            Self::Category => Entity::belongs_to(super::category::Entity)
                .from(Column::CategoryId)
                .to(super::category::Column::Id)
                .into(),
        }
    }
}
```

belongs_to
belongs_to 定义的是多对一的“属于”，就是说，Article 的 Relation::Category，是“属于”:category::Entity。

from：定义的是关系中的源字段，我们这里指定的是 Article 的 CategoryId

to：定义的是关系中的目标字段，我们这里指定的是 Category 的 Id

这段定义，可以想象成这段 SQL：

```rust
SELECT * FROM
	articles AS a
INNER JOIN
	categoies AS c
ON
	a.category_id = c.id
```

为 Entity 实现 Related
定义好了关系，我们还需要实现 Relate：告诉 SeaORM ，我们定义的 Relation::Category 关系需要如何去建立

```rust
impl Related<super::category::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Category.def()
    }
}
```

定义分类和文章的关系：一对多
同样，我们需要对分类的实体进行修改，给它定义和文章的关系：

```rust
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
pub enum Relation {
    Articles,
}

impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        match self {
            Self::Articles => Entity::has_many(super::article::Entity).into(),
        }
    }
}
impl Related<super::article::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Articles.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

定义 Relation

```rust
#[derive(Debug, Clone, Copy, EnumIter)]
pub enum Relation {
    Articles,
}
```

我们给分类定义了这么一个关系：Articles。因为一个分类可以对应多个文章，所以这里使用的是复数。

为 Relation 实现 RelationTrait

```rust
impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        match self {
            Self::Articles => Entity::has_many(super::article::Entity).into(),
        }
    }
}
```

同样，我们需要为 Relation 实现对应的 trait。

has_many
has_may 的含义是，拥有多个。也就是说，我们的每一个分类可能会拥有多个文章

为 Entity 实现 Related
最后，别忘了实现 Related：

```rust
impl Related<super::article::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Articles.def()
    }
}
```

关系查询
在 SeaORM 中，通过关系查询数据有两种方式：

“懒”加载
虽然官方管它叫“懒”加载(Lazy Loading)，但它实际是要发送多次 SQL 的，并不是我们平常所说的“懒加载”。

它的实现方式是：

通过 find_by_id 等方法获取到一个 Model
然后通过这个 Model 的 find_relate()获取关系的另一方
// 查找 id=1 的 分类

```rust
let cate: category::Model = category::Entity::find_by_id(1).one(conn).await.unwrap();
// 查找这个分类的所有文章
let articles: Vec<Article::Model> = cate.find_related(Article::Entity).all(conn).await.unwrap();
```

即时加载
一次性加载所有相关的模块。和“懒”加载相比，它减少了发送 SQL 的次数。

它的实现方式是使用 LEFT JOIN 进行关联查询。

```rust
find_with_related
let cate_with_articles: Vec<(category::Model, Vec<article::Model>)> = category::Entity::find_by_id(1).find_with_related(Article::Entity).all(conn).await.unwrap();
find_also_related
let articles_with_category: Vec<(article::Model, Option<category::Model>)> = article::Entity::find().find_also_related()
```

分页
“懒”加载 find_related() 可以直接用于分页
因为 find_related 返回的是一个 Select，所以可以用于分页。

即时加载不能直接用于分页【待确定】
由于即时加载返回的是 SelectTwo/SelectTwoMany，并不能直接用于分页。

文档上显示这两个结构体实现了 PaginatorTrait，理论上应该可以直接用于分页的，但本人在开发本专题代码时并不能使用。由于时间有限，本人没有花时间对此作更多尝试，有兴趣的小伙伴请自行尝试并将结果告知。或者在本人以后花时间深入验证后再更新本段描述。

一对多的查询：某分类下的文章
我们来实现一个功能：点击某分类，然后显示该分类下的所有文章。代码如下：

```rust
pub async fn articles(
    Extension(state): Extension<Arc<AppState>>,
    Path(id): Path<i32>,
    Query(params): Query<param::CategoryParams>,
) -> Result<HtmlRespon> {
    let handler_name = "category/articles";
    let conn = get_conn(&state);
    let cate = category::Entity::find_by_id(id)
        .one(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?
        .ok_or(AppError::notfound())
        .map_err(log_error(handler_name))?;

    let paginator = cate.find_related(article::Entity).paginate(conn, 15);
    let articles: Vec<article::Model> = paginator
        .fetch_page(params.page())
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    let page_total = paginator
        .num_pages()
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    let tpl = view::CategoryArticlesTemplate {
        params,
        page_total,
        category: cate,
        articles,
    };
    render(tpl, handler_name)
}
```

多对一的查询：带分类的文章列表
文章显示的时候，需要把分类名称也同时显示，所以我们可以这样实现：

```rust
pub async fn index(
    Extension(state): Extension<Arc<AppState>>,
    Query(params): Query<param::ArticleParams>,
) -> Result<HtmlRespon> {
    let handler_name = "article/index";
    let conn = get_conn(&state);
    let condition = Condition::all().add(article::Column::IsDel.eq(false));
    let selc = article::Entity::find().filter(condition);
    let record_total = selc
        .clone()
        .count(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    let page_size = 15usize;
    let page = 0usize;
    let page_total = f64::ceil(record_total as f64 / page_size as f64) as usize;
    let offset = page_size * page;
    let list = selc
        .find_also_related(category::Entity)
        .order_by_desc(article::Column::Id)
        .limit(page_size as u64)
        .offset(offset as u64)
        .all(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;

    let tpl = view::ArticlesTemplate {
        list,
        page_total,
        params,
    };
    render(tpl, handler_name)
}
```

带关系的数据维护
你或许有疑问，给分类和文章添加了关系之后，插入、修改、删除这些应该怎么做？

对于更新和删除而言：

可以在定义关系的时候使用 on_delete/on_update 来定义
也可以通过数据库的外键约束来实现
也可以在 Rust 中使用事务进行操作，比如删除某个分类的同时，将所属的所有文章一并删除。
而对于插入而言，什么都不用做，和平时一样操作即可。

实现添加文章功能
最后，我们实现一下文章的添加功能。如上文所述，它和平时操作没有什么不同：

```rust
pub async fn add(
    Extension(state): Extension<Arc<AppState>>,
    Form(frm): Form<form::ArticleForm>,
) -> Result<RedirectRespon> {
    let handler_name = "article/add";
    let conn = get_conn(&state);
    article::ActiveModel {
        id: NotSet,
        title: Set(frm.title),
        category_id: Set(frm.category_id),
        content: Set(frm.content),
        ..Default::default()
    }
    .save(conn)
    .await
    .map_err(AppError::from)
    .map_err(log_error(handler_name))?;
    redirect("/article?msg=文章添加成功")
}
```

本章代码位于 06/一对多和多对一分支
