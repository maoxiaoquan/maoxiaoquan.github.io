### 查询数据

为了更好地演示分页效果，我们通过 SQL 语句添加一些示例数据：

```rust
ALTER SEQUENCE categoies_id_seq RESTART WITH 4;
INSERT INTO categoies (name) VALUES
('U3A0CsWdiy'),
('SWACTQFa0Y'),
('GYqfhaKJ6J'),
('0sjsXVArdZ'),
('MiN8lR1g9B'),
('oBorPeyIvH'),
('cqS4jGnmxG'),
('dc0qqvbDNP'),
('jq8K6LgUFy'),
('K1tKtlvzgf'),
('Z5kEYZYEdp'),
('y3K6ryqRMF'),
('hwPu60bq1u'),
('2Idzt9CmAV'),
('vbLGfMJNHz'),
('6tTPkRtpWB'),
('sWBfrpOAIB'),
('zgmXGcYsGt'),
('WH2EBpojIS'),
('m1rsNTknqS');
```

接收参数
为了让我们的分类列表能接收到各种参数，我们需要进行如下操作：

### 定义参数结构体

```rust
// src/param.rs

#[derive(Debug, Clone, Deserialize)]
pub struct CategoryParams {
    pub keyword: Option<String>, // 用于搜索的关键字
    pub is_del: Option<i32>, // 是否删除
    pub sort: Option<String>, // 排序
    pub page_size: Option<usize>, // 每页记录条数
    pub page: Option<usize>, // 当前页码
}
// ...
```

### 在 handler 中接收参数

```rust
// src/handler/category.rs
pub async fn index(
    Extension(state): Extension<Arc<AppState>>,
    Query(params): Query<param::CategoryParams>,
) -> Result<HtmlRespon> {
  // ...
}
```

### 模板

```rust
<!-- templates/category.html -->
<form class="row" method="get" action="/category">
    <div class="col-auto">
    <label class="visually-hidden" for="keyword">关键字</label>
    <div class="input-group">
      <div class="input-group-text">关键字</div>
      <input type="text" class="form-control" id="keyword" name="keyword" placeholder="输入关键字" value="{{ params.keyword() }}">
    </div>
  </div>
  <div class="col-auto">
    <label class="visually-hidden" for="is_del">是否删除</label>
    <select class="form-select" id="is_del" name="is_del">
        <option value="-1"{% if params.is_del() == -1%} selected{%endif%}>全部</option>
      <option value="0"{% if params.is_del() == 0%} selected{%endif%}>未删除</option>
      <option value="1"{% if params.is_del() == 1%} selected{%endif%}>已删除</option>
    </select>
  </div>
  <div class="col-auto">
    <label class="visually-hidden" for="sort">排序</label>
    <select class="form-select" id="sort" name="sort">
        <option value=""{% if params.sort().is_empty() %} selected{%endif%}>默认排序</option>
      <option value="asc"{% if params.sort() == "asc" %} selected{%endif%}>升序</option>
      <option value="desc"{% if params.sort() == "desc" %} selected{%endif%}>降序</option>
    </select>
  </div>
  <div class="col-auto">
    <label class="visually-hidden" for="page_size">每页条数</label>
    <select class="form-select" id="page_size" name="page_size">
        <option value="0"{% if params.page_size() == 0 %} selected{%endif%}>默认条数</option>
        <option value="3"{%if params.page_size() == 3 %} selected{%endif%}>每页3条</option>
      <option value="5"{%if params.page_size() == 5 %} selected{%endif%}>每页5条</option>
      <option value="10"{%if params.page_size() == 10 %} selected{%endif%}>每页10条</option>
    </select>
  </div>
  <div class="col-auto">
    <button type="submit" class="btn btn-primary"><i class="bi bi-search"></i> 搜索</button>
  </div>
</form>

```

### 根据条件过滤数据 - filter()

SeaORM 提供多过滤数据的方式，对于多条记录而言，filter()是最常用的方法。

官方文档

简单查询
比如，要查询所有未删除的分类：

```rust
category::Entity::find()
 .filter(category::Column::IsDel.eq(false))
// SELECT * FROM categories WHERE is_del=false
```

### 模糊查询

比如，要查询名字中带有 a 的分类：

```rust
category::Entity::find()
 .filter(category::Column::Name.contains("a"))
// SELECT * FROM categories WHERE name LIKE '%a%'
```

### 组合过滤

我们可以使用 Condition 来组合复杂的查询条件， 然后将其放到 filter()里。比如，要查询所有未删除的、并且名字中带有 a 的分类：

```rust
category::Entity::find()
 .filter(
  Condition.all()
     .add(category::Column::IsDel.eq(false))
     .add(category::Column::Name.contains("a"))
)
// SELECT * FROM categories WHERE is_del=false AND name LIKE '%a%'
```

### 可选过滤

很多时候我们需要的是可选过滤：即只有用户指定了某些条件才过滤，否则显示所有记录。在 axum 中，我们可以通过 Option 来获取可选参数。而 SeaORM 也对这些 Option 类型的参数提供了过滤方式——add_option()。

```rust
let name: Option<String> = Some(String::from("a"));
category::Entity::find()
 .filter(
  Condition.all()
     .add_option(
      name.map(|n| category::Column::Name.contains(&n))
     )
)
// -- 当 name 是 None 时：
// SELECT * FROM categories
// -- 当 name 是 Some("a") 时：
// SELECT * FROM categories WHERE is_del=false AND name LIKE '%a%'
```

### 组合可选过滤

同样的，我们也可以组合多个可选过滤

```rust
let name: Option<String> = Some(String::from("a"));
let is_del:Option<bool> = Some(false);
category::Entity::find()
 .filter(
  Condition.all()
     .add_option(
      name.map(|n| category::Column::Name.contains(&n))
     )
     .add_option(
      is_del.map(|n| category::Column::IsDel.eq(n))
     )
)
```

### 设置排序 - order_by()

可以使用 order_by(字段,排序方式)来对数据进行排序。其中的 字段通常是一个 Column，比如 category::Column::Id，而 排序方式 是 Order 枚举：

```rust
Order::Asc：升序
Order::Desc：降序
```

比如，要让所有记录按 id 的降序排列：

```rust
category::Entity::find()
 .order_by(category::Column::Id, Order::Desc)
// SELECT * FROM categoies ORDER BY id DESC
```

由于 ASC 和 DESC 太常见了，所以 SeaORM 直接提供了两个方法来简化操作：

order_by_asc(字段)：即 order_by(字段, Order::Asc)
order_by_desc(字段)：即 order_by(字段, Order:Desc)
分页 - paginate()
SeaORM 很贴心的提供了 paginate(conn,page_size)->Paginator 方法，方便地进行分页。

它的 conn 参数是实现了 ConnectionTrait 的对象，我们的项目中使用的是 DatabaseConnection（src/state.rs），它实现了这个 ConnectionTrait。而 page_size 是次获取记录的条数。

它的返回值是一个 Paginator 对象，它提供了诸多有用的方法：

async num_pages()：获取分页的总页数
async num_items()：获取总的记录数
async fetch_page(page)：获取第 page 页的记录，page 是从 0 开始算的。

### 简单分页

有了这些知识的铺垫，现在来看一下如何实现一个简单的分页：

```rust
let page:usize = 0;
let page_size = 15usize;
let paginator = category::Entity::find().paginate(conn, page_size);
let page_total = paginator.num_pages().await.unwrap();
let categies: Vec<category::Model> = paginator
        .fetch_page(page)
        .await
    .unwrap();
```

### 复杂分页

配合前面讨论的组合过滤、排序等，可以实现复杂的分页：

```rust

src/handler/category.rs

pub async fn index(
    Extension(state): Extension<Arc<AppState>>,
    Query(params): Query<param::CategoryParams>,
) -> Result<HtmlRespon> {
    let handler_name = "category/index";
    let page = params.page(); // 当前页码
    let page_size = params.page_size(); // 每页条数，默认15
    let conn = get_conn(&state);
    let mut selc = category::Entity::find().filter(
        Condition::all()
            .add_option(
                params
                    .keyword_opt()
                    .map(|n| category::Column::Name.contains(&n)),
            )
            .add_option(params.is_del_opt().map(|n| category::Column::IsDel.eq(n))),
    );
    if let Some(ord) = params.order() {
        selc = selc.order_by(category::Column::Id, ord);
    };
    let paginator = selc.paginate(conn, page_size);
    let page_total = paginator.num_pages().await.map_err(AppError::from)?;
    let categies: Vec<category::Model> = paginator
        .fetch_page(page)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    let tpl = view::CategoryTemplate {
        categies,
        params,
        page_total,
    };
    render(tpl, handler_name)
}
```

### 模板中显示分页链接

```rust
<!-- templates/category.html  -->
<nav>
  <ul class="pagination pagination">
    {% for page in 0..page_total %}
        {% if page == params.page() %}
    <li class="page-item active">
        <span class="page-link">{{ page + 1}}</span>
    </li>
        {% else %}
    <li class="page-item">
        <a class="page-link" href="?page={{page}}&keyword={{params.keyword()}}&is_del={{params.is_del()}}&sort={{params.sort()}}&page_size={{params.page_size()}}">{{ page + 1}}</a>
        </li>
        {% endif %}
    {% endfor %}
  </ul>
</nav>
```

### 查询单条数据

当需要查询单条数据时，我们要做的是将 all()改为 one()，它返回的是一个 Option：

```rust
let cate: Option<category::Model> = category::Entity::find()
 .filter(category::Column::Id.eq(1))
 .one()
 .await
 .unwrap();
```

对于通过主键来查询，我们可以使用更简单的方法 find_by_id()

```rust
src/handler/category.rs

pub async fn find(
    Extension(state): Extension<Arc<AppState>>,
    Path(id): Path<i32>,
) -> Result<String> {
    let handler_name = "category/find";
    let conn = get_conn(&state);
    let cate: Option<category::Model> = category::Entity::find_by_id(id)
        .one(conn)
        .await
        .map_err(AppError::from)
        .map_err(log_error(handler_name))?;
    match cate {
        Some(cate) => Ok(format!("id: {}, 名称: {}", cate.id, cate.name)),
        None => Err(AppError::notfound()),
    }
}
```
