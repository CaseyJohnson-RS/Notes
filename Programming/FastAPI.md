# Fast API

###### Template

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

###### Start

```bash
uvicorn main:app --reload
```

Команда `uvicorn main:app` обращается к:

- `main`: файл `main.py` (модуль Python).
- `app`: объект, созданный внутри файла `main.py` в строке `app = FastAPI()`.
- `--reload`: перезапускает сервер после изменения кода. Используйте только для разработки.

###### Path-params

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

# Порядок имеет значение!

@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}


@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}
```

Fixed values

```python
class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

app = FastAPI()

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        ...
```

File path

```python
@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```

###### Query-params

```python
@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```

Query example `http://127.0.0.1:8000/items/?skip=0&limit=10`

Boolean type (similar queries):

`http://127.0.0.1:8000/items/foo?short=1`

`http://127.0.0.1:8000/items/foo?short=True`

`http://127.0.0.1:8000/items/foo?short=true`

`http://127.0.0.1:8000/items/foo?short=on`

`http://127.0.0.1:8000/items/foo?short=yes`

###### Query + Path params example

```python
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int, item_id: str, q: str | None = None, short: bool = False
):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item
```

###### Тело запроса

```python
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None

app = FastAPI()

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, q: Union[str, None] = None):
    result = {"item_id": item_id, **item.dict()}
    if q:
        result.update({"q": q})
    return result
```

###### Расширенная валидация

```python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
    q: Annotated[
        str | None, Query(min_length=3, max_length=50, pattern="^fixedquery$")
    ] = None,
):
    ...

# Пример с многоточием
@app.get("/itemss/")
async def read_itemss(q: Annotated[str, Query(min_length=3)] = ...):
    ...

# Так лучше
@app.get("/itemsss/")
async def read_itemsss(q: Annotated[str, Query(min_length=3)] = Required):
    ...

# Пример передачи списка
@app.get("/items/")
async def read_items(q: Annotated[list[str], Query()] = ["foo", "bar"]):
    ...
```

Вы можете указать название query-параметра, используя параметр `title`

Добавить описание, используя параметр `description`

Тогда вы можете объявить `псевдоним`

```python
..,Query(alias="item-query")]...
```

###### Path-параметры и валидация числовых данных

```python
@app.get("/items/{item_id}")
async def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get")],
    q: Annotated[str | None, Query(alias="item-query")] = None,
):
    ...
```

А также вы можете добавить валидацию числовых данных:

- `gt`: больше (`g`reater `t`han)
- `ge`: больше или равно (`g`reater than or `e`qual)
- `lt`: меньше (`l`ess `t`han)
- `le`: меньше или равно (`l`ess than or `e`qual)

```python
@app.get("/items/{item_id}")
async def read_items(
    *,
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=1000)],
    q: str,
    size: Annotated[float, Query(gt=0, lt=10.5)],
):
    ...
```

###### Body - Множество параметров

Получение множества тел параметров (как тут):

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


class User(BaseModel):
    username: str
    full_name: str | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, user: User):
    ...
```

подразумевает запрос следующего формата:

```json
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    },
    "user": {
        "username": "dave",
        "full_name": "Dave Grohl"
    }
}
```

Однако можно явно запросить тело (по умолчанию все параметры считаются Query):

```python
async def update_item(
    item_id: int, item: Item, user: User, importance: Annotated[int, Body()]
    ...
```

```json
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    },
    "user": {
        "username": "dave",
        "full_name": "Dave Grohl"
    },
    "importance": 5
}
```

*Предположим*, у вас есть только один body-параметр `item` из Pydantic модели `Item`.

По умолчанию, **FastAPI** ожидает получить тело запроса напрямую.

Но если вы хотите чтобы он ожидал JSON с ключом `item` с содержимым модели внутри, также как это происходит при объявлении дополнительных body-параметров, вы можете использовать специальный параметр `embed` у типа `Body`:

`item: Item = Body(embed=True)`

```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    ...
```

```json
{
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    }
}
```

###### Body - Поля

```python
from fastapi import Body, FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
```

Тела могут быть вложенные. Ex.:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Image(BaseModel):
    url: str
    name: str


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    image: Image | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    results = {"item_id": item_id, "item": item}
    return results
```

Ожидается тело запроса:

```json
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2,
    "tags": ["rock", "metal", "bar"],
    "image": {
        "url": "http://example.com/baz.jpg",
        "name": "The Foo live"
    }
}
```

Тела могут быть залистованы

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: set[str] = set()
    images: list[Image] | None = None
```

Ожидаемое тело:

```json
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2,
    "tags": [
        "rock",
        "metal",
        "bar"
    ],
    "images": [
        {
            "url": "http://example.com/baz.jpg",
            "name": "The Foo live"
        },
        {
            "url": "http://example.com/dave.jpg",
            "name": "The Baz"
        }
    ]
}
```

###### Особые типы

[Pydentic]([Types - Pydantic](https://docs.pydantic.dev/latest/concepts/types/)) - сайт с типами и валидацией

```python
from pydantic import BaseModel, HttpUrl

app = FastAPI()

class Image(BaseModel):
    url: HttpUrl
    ...
```

###### Объявление примера запроса данных

Пример тела

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ]
        }
    }
```

Другой вариант через `Field`

```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(examples=["Foo"])
    description: str | None = Field(default=None, examples=["A very nice Item"])
    price: float = Field(examples=[35.4])
    tax: float | None = Field(default=None, examples=[3.2])
```

**Использование `example` и `examples` в OpenAPI**

При использовании любой из этих функций:

- `Path()`
- `Query()`
- `Header()`
- `Cookie()`
- `Body()`
- `Form()`
- `File()`

вы также можете добавить аргумент, содержащий `example` или группу `examples` с дополнительной информацией, которая будет добавлена в **OpenAPI**.

```python
@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Annotated[
        Item,
        Body(
            examples=[
                {
                    "name": "Foo",
                    "description": "A very nice Item",
                    "price": 35.4,
                    "tax": 3.2,
                }
            ],
        ),
    ],
):
    ...
```

Еще чуть-чуть [документации](https://fastapi.tiangolo.com/ru/tutorial/schema-extra-example/#body-examples)

###### Дополнительные типы данных

- `UUID`:
  - Стандартный "Универсальный уникальный идентификатор", используемый в качестве идентификатора во многих базах данных и системах.
  - В запросах и ответах будет представлен как `str`.
- `datetime.datetime`:
  - Встроенный в Python `datetime.datetime`.
  - В запросах и ответах будет представлен как `str` в формате ISO 8601, например: `2008-09-15T15:53:00+05:00`.
- `datetime.date`:
  - Встроенный в Python `datetime.date`.
  - В запросах и ответах будет представлен как `str` в формате ISO 8601, например: `2008-09-15`.
- `datetime.time`:
  - Встроенный в Python `datetime.time`.
  - В запросах и ответах будет представлен как `str` в формате ISO 8601, например: `14:23:55.003`.
- `datetime.timedelta`:
  - Встроенный в Python `datetime.timedelta`.
  - В запросах и ответах будет представлен в виде общего количества секунд типа `float`.
  - Pydantic также позволяет представить его как "Кодировку разницы во времени ISO 8601", [см. документацию для получения дополнительной информации](https://docs.pydantic.dev/latest/concepts/serialization/#json_encoders).
- `frozenset`:
  - В запросах и ответах обрабатывается так же, как и `set`:
    - В запросах будет прочитан список, исключены дубликаты и преобразован в `set`.
    - В ответах `set` будет преобразован в `list`.
    - В сгенерированной схеме будет указано, что значения `set` уникальны (с помощью JSON-схемы `uniqueItems`).
- `bytes`:
  - Встроенный в Python `bytes`.
  - В запросах и ответах будет рассматриваться как `str`.
  - В сгенерированной схеме будет указано, что это `str` в формате `binary`.
- `Decimal`:
  - Встроенный в Python `Decimal`.
  - В запросах и ответах обрабатывается так же, как и `float`.
- Вы можете проверить все допустимые типы данных pydantic здесь: [Типы данных Pydantic](https://docs.pydantic.dev/latest/concepts/types/).

```python
from datetime import datetime, time, timedelta
from typing import Union
from uuid import UUID

from fastapi import Body, FastAPI

app = FastAPI()


@app.put("/items/{item_id}")
async def read_items(
    item_id: UUID,
    start_datetime: datetime = Body(),
    end_datetime: datetime = Body(),
    process_after: timedelta = Body(),
    repeat_at: Union[time, None] = Body(default=None),
):
    ...
```

###### Cookie

```python
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: str | None = Cookie(default=None)):
    return {"ads_id": ads_id}
```

###### Заголовки

Хз пока как это использовать, но HTTP протокол имеет много заголовков с информацией о том, откуда запрос, IP и браузер. Эти заголовки тоже можно парсить

```python
from typing import Annotated
from fastapi import FastAPI, Header
app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}
```

###### Модель ответа - Возвращаемый тип

Вы можете объявить тип ответа, указав аннотацию **возвращаемого значения** для *функции операции пути*.



<u>Строгая проверка!</u>

```python
@app.post("/items/")
async def create_item(item: Item) -> Item:
    return item


@app.get("/items/")
async def read_items() -> list[Item]:
    ...
```

Преобразование к типу

```python
@app.post("/items/", response_model=Item)
async def create_item(item: Item) -> Any:
    return item


@app.get("/items/", response_model=list[Item])
async def read_items() -> Any:
    return [
        {"name": "Portal Gun", "price": 42.0},
        {"name": "Plumbus", "price": 32.0},
    ]
```

Помимо типов можно вернуть Response. [Доки](https://fastapi.tiangolo.com/ru/tutorial/response-model/)

```python
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse, RedirectResponse

app = FastAPI()

@app.get("/portal")
async def get_portal(teleport: bool = False) -> Response:
    if teleport:
        return RedirectResponse(url="https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    return JSONResponse(content={"message": "Here's your interdimensional portal."})
```

###### HTTP коды статуса ответа

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/items/", status_code=201)
async def create_item(name: str):
    return {"name": name}
```

Это позволит:

- Возвращать указанный код статуса в ответе.
- Документировать его как код статуса ответа в OpenAPI схеме (а значит, и в пользовательском интерфейсе)

###### Чтение данных формы

Требуется  [`python-multipart`](https://github.com/Kludex/python-multipart).

`pip install python-multipart`

```python
from typing import Annotated
from fastapi import FastAPI, Form

app = FastAPI()

@app.post("/login/")
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
```

###### Загрузка файлов

Требуется  [`python-multipart`](https://github.com/Kludex/python-multipart).

`pip install python-multipart`
