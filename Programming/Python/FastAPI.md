<mark>Fast API</mark>

Установка

```python
pip install fastapi[all]

# Обычно запускают на uvicorn
pip install uvicorn[standart]
```

Примерная структура проекта

```bash
myproject/
    app/
        __init__.py
        main.py
    requirements.txt
```

Запуск сервера

```python
uvicorn app.main:app --reload
```

---

# Обработка запросов

Существует пять типов основных параметров, которые приходят на сервер:

- Path
  
  ```python
  from typing import Annotated
  from fastapi import FastAPI, Path
  
  @app.get("/users/{user_id}/items/{item_id}")
  async def read_user_item(
      user_id: Annotated[int, Path()], 
      item_id: Annotated[str, Path()]
  ):
      pass
  ```

- Query
  
  ```python
  from typing import Annotated
  from fastapi import FastAPI, Query
  
  @app.get("/users/items")
  async def read_user_item(
      q: Annotated[str | None, Query()] = None, 
      short: Annotated[bool, Query()] = False
  ):
      pass
  ```

- Body
  
  ```python
  from typing import Annotated
  from fastapi import FastAPI, Body
  from pydantic import BaseModel
  
  class User(BaseModel):
      username: str
      full_name: str | None = None
  
  @app.get("/users/items")
  async def read_user_item(
      number: Annotated[int, Body()],
      user: User
  ):
      pass
  ```
  
  Вид пришедшего JSON (неточно, возможно):
  
  ```json
  {
      "user": {
          "username": "dave",
          "full_name": "Dave Grohl"
      },
      "number": 5
  }
  ```

- Cookie
  
  ```python
  from fastapi import Cookie, FastAPI
  
  @app.get("/items/")
  async def read_items(ads_id: str | None = Cookie(default=None)):
      pass
  ```

- Header
  
  ```python
  @app.get("/items/")
  async def read_items(
      strange_header: Annotated[str | None, Header(convert_underscores=False)] = None,
  ): 
      pass
  ```

Если требуется указать **множество значений** (применительно к Body и Query), то можно использовать следующий синтаксис:

```python
@app.get("/items/")
async def read_items(
    q: Annotated[list[str] | None, Query()] = None,
    weights: Annotated[dict[int, float], Body()]
    # допиши
):
    pass
```

Если требуется указание аргументов как именованных используй вот такой синтаксис со звёздочкой (если используется `Annotated`, то это тебе не надо):

```python
@app.get("/items/{item_id}")
async def read_items(*, item_id: int = Path(), q: str):
    pass
```

## Метаданные и валидация

### Метаданные

Вот [тут](https://fastapi.tiangolo.com/ru/reference/parameters/) указаны все параметры

`max_length` - специфический параметр для строкового типа, ограничивающий длину

`min_length` - аналогично `max_length`

`default` - параметр, определяющий значение по умолчанию. Если `default` присвоить `...`, то параметр становится обязательным. Рекомендуется его не использовать и писать так (допустим для Query): 

```python
  q: Annotated[str, Query()] = "rick"
```

`pattern` - определяет регулярное выражение `Regex`

`title` - параметр, входящий в документацию как название

`description` - параметр, входящий в документацию как описание

`alias` - параметр псевдонима, который будет использоваться при отправке запроса кем-либо на наш сервер

`deprecated` - параметр, принимающий `True` или `False`, нужный для обозначения устаревших методов в документации

`include_in_schema` - параметр, принимающий `True` или `False`, нужный для обозначения включения в документацию

`gt`: больше (`g`reater `t`han)

`ge`: больше или равно (`g`reater than or `e`qual)

`lt`: меньше (`l`ess `t`han)

`le`: меньше или равно (`l`ess than or `e`qual)

`embed` - специфичный для моделей (`Body`) `Pydentic`. По умолчанию, **FastAPI** ожидает получить тело запроса напрямую. Но если ты хочешь, чтобы он ожидал JSON с ключом `item` с содержимым модели внутри, также как это происходит при объявлении дополнительных body-параметров, то нужно установить `embed=True`

`example` или `examples` - позволяет добавлять в документацию пример(ы)

### Валидация

Если присланные данные не будут подходить под условия метаданных, то будет отправлена ошибка с исчерпывающим описанием. Пример указания метаданных:

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(title="The ID of the item to get", ge=0, le=1000)],
    q: str | None = None,
    item: Item | None = None,
): 
    pass
```

Однако метаданные валидации можно накладывать не только на аргументы функции, но и на поля модели с помощью `Field` (импортируется непосредственно из `Pydantic`):

```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = None
```

## Дополнительные типы данных

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

# Возвращаемое значение

Можно объявить тип ответа функции. Это нужно для валидации ответа. Если данные невалидны, это означает, что код *твоего* приложения работает некорректно и функция возвращает не то, что ожидается. **Главное: ответ будет ограничен и отфильтрован. Т.е. в нем останутся только те данные, которые определены в возвращаемом типе.** Пример:

```python
@app.post("/items/")
async def create_item(item: Item) -> Item:
    return item


@app.get("/items/")
async def read_items() -> list[Item]:
    return [
        Item(name="Portal Gun", price=42.0),
        Item(name="Plumbus", price=32.0),
    ]
```

Если интересно больше (там много функций, то почитай [здесь](https://fastapi.tiangolo.com/ru/tutorial/response-model/))

# HTTP коды статуса ответа

Можно напрямую задать HTTP код статуса ответа с помощью параметра `status_code` так, как ты определяешь схему ответа в любой из операций пути ([это](https://docs.python.org/3/library/http.html#http.HTTPStatus) может помочь): 

```python
from fastapi import FastAPI

app = FastAPI()


@app.post("/items/", status_code=201)
async def create_item(name: str):
    return {"name": name}
```

# Получение данных формы

Требует установки:

```bash
pip install python-multipart
```

---

**Технические детали**: данные из форм обычно кодируются с использованием "типа медиа" `application/x-www-form-urlencoded`. Но когда форма содержит файлы, она кодируется как `multipart/form-data`. Вы узнаете о работе с файлами в следующей главе.

**Предупреждение:** вы можете объявлять несколько параметров `Form` в *операции пути*, но вы не можете одновременно с этим объявлять поля `Body`, которые вы ожидаете получить в виде JSON, так как запрос будет иметь тело, закодированное с использованием `application/x-www-form-urlencoded`, а не `application/json`.

```python
from typing import Annotated

from fastapi import FastAPI, Form

app = FastAPI()


@app.post("/login/")
async def login( 
    username: Annotated[str, Form()], 
    password: Annotated[str, Form()]
):
    return {"username": username}
```

# Загрузка файлов

Требует установки:

```bash
pip install python-multipart
```

---

Через `File`

```python
from fastapi import FastAPI, File, UploadFile

@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}
```

Через `UploadFile`

```python
from fastapi import FastAPI, File, UploadFile

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}
```

Атрибуты `UploadFile`:

- `filename` - строка с исходным именем файла.

- `content_type` - тип содержимого (ex.: `image/jpeg`)

- `file:SpooledTemporaryFile` - фактический файл Python. [Ссылка]([tempfile — Generate temporary files and directories &#8212; Python 3.12.4 documentation](https://docs.python.org/3/library/tempfile.html#tempfile.SpooledTemporaryFile)) на документацию

Функции `UploadFile` (все они `async`):

- `write(data)` - записать данные `data` (`str` или `bytes`) в файл

- `read(size)`: Прочитать количество `size` (`int`) байт/символов из файла.

- `seek(offset)`: Перейти к байту на позиции `offset` (`int`) в файле.
  
  - Например, `await myfile.seek(0)` перейдет к началу файла.
  - Это особенно удобно, если вы один раз выполнили команду `await myfile.read()`, а затем вам нужно прочитать содержимое файла еще раз.

- `close()`: Закрыть файл.

**Предупреждение**. В операции *функции операции пути* можно объявить несколько параметров `File` и `Form`, но нельзя также объявлять поля `Body`, которые предполагается получить в виде JSON, поскольку тело запроса будет закодировано с помощью `multipart/form-data`, а не `application/json`.

**Пример файлов и формы в запросе**

```python
from typing import Annotated

from fastapi import FastAPI, File, Form, UploadFile

app = FastAPI()


@app.post("/files/")
async def create_file(
    file: Annotated[bytes, File()],
    fileb: Annotated[UploadFile, File()],
    token: Annotated[str, Form()],
):
    return {
        "file_size": len(file),
        "token": token,
        "fileb_content_type": fileb.content_type,
    }
```

# Обработка ошибок

 Используем `HTTPException` из `fastapi`

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

items = {"foo": "The Foo Wrestlers"}


@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(
            status_code=404, 
            detail="Item not found",
            headers={"X-Error": "There goes my error"},
        )
    return {"item": items[item_id]}
```

Есть еще про пользовательские обработчики исключений, которые я не понял, они [здесь]([Обработка ошибок - FastAPI](https://fastapi.tiangolo.com/ru/tutorial/handling-errors/#_4))

# Конфигурация операций пути

Тут вещи больше относятся к документации

`status_code` - определяет код ответа

`tags` - список, заполненный `str` 

`summary` - краткое описание

`description` - развёрнутое содержание

`response_description` - описание ответа

`deprecated` - описание операции пути как устаревшей

```python
@app.post(
    "/items/",
    response_model=Item,
    summary="Create an item",
    description="Create an item with all the information, name, description, price, tax and a set of unique tags",
    tags=["items"]
)
async def create_item(item: Item):
    pass
```

Описание из строк документации

Так как описания обычно длинные и содержат много строк, вы можете объявить описание *операции пути* в функции строки документации и **FastAPI** прочитает её отсюда.

```python
@app.post("/items/", response_model=Item, summary="Create an item")
async def create_item(item: Item):
    """
    Create an item with all the information:

    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    - **tax**: if the item doesn't have tax, you can omit this
    - **tags**: a set of unique tag strings for this item
    """
    return item
```

# JSON кодировщик

Описание зачем он нужен [здесь](https://fastapi.tiangolo.com/ru/tutorial/encoder/)

```python
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

fake_db = {}


class Item(BaseModel):
    title: str
    timestamp: datetime
    description: str | None = None


app = FastAPI()


@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    fake_db[id] = json_compatible_item_data
```

# Body обновления

Всем понятно, что смысл операции `PUT` заключается в добавлении либо полной замене информации.  

Но как обновлять информацию? Частичное обновление с помощью `PATCH`!

**Использование параметра** `exclude_unset` в Pydantic. Будет сгенерирован словарь, содержащий только те данные, которые были заданы при создании модели `item`, без учета значений по умолчанию.

```python
update_data = item.dict(exclude_unset=True)
```

**Использование параметра** `update` в Pydantic. Можно создать копию существующей модели, используя `.copy()`, и передать параметр `update` с `dict`, содержащим данные для обновления.

```python
updated_item = stored_item_model.copy(update=update_data)
```

---

**Кратко о частичном обновлении**

В целом, для применения частичных обновлений необходимо:

- (Опционально) использовать `PATCH` вместо `PUT`.
- Извлечь сохранённые данные.
- Поместить эти данные в Pydantic модель.
- Сгенерировать `dict` без значений по умолчанию из входной модели (с использованием `exclude_unset`).
  - Таким образом, можно обновлять только те значения, которые действительно установлены пользователем, вместо того чтобы переопределять значения, уже сохраненные в модели по умолчанию.
- Создать копию хранимой модели, обновив ее атрибуты полученными частичными обновлениями (с помощью параметра `update`).
- Преобразовать скопированную модель в то, что может быть сохранено в вашей БД (например, с помощью `jsonable_encoder`).
  - Это сравнимо с повторным использованием метода модели `.dict()`, но при этом происходит проверка (и преобразование) значений в типы данных, которые могут быть преобразованы в JSON, например, `datetime` в `str`.
- Сохранить данные в своей БД

# Зависимости

## Пример зависимости от функции

```python
from typing import Annotated
from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(
    q: str | None = None, 
    skip: int = 0, 
    limit: int = 100
):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(
    commons: Annotated[dict, Depends(common_parameters)]
):
    return commons
```

## Можно использовать классы как зависимости

```python
class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit


@app.get("/items/")
async def read_items(
    commons: Annotated[CommonQueryParams, Depends(CommonQueryParams)],
    commons: Annotated[CommonQueryParams, Depends()] # То же самое
): 
    pass
```

## Подзависимости

Если одна из ваших зависимостей объявлена ​​несколько раз для одной и той же *операции пути* , например, несколько зависимостей имеют общую подзависимость, **FastAPI** будет знать, что эту подзависимость нужно вызывать только один раз за запрос.

И он сохранит возвращаемое значение в «кеше» и передаст его всем «зависимым», которым оно нужно в этом конкретном запросе, вместо того, чтобы вызывать зависимость несколько раз для одного и того же запроса.

В сложном сценарии, когда вы знаете, что зависимость должна вызываться на каждом шаге (возможно, несколько раз) в одном запросе вместо использования «кэшированного» значения, вы можете задать параметр `use_cache=False`при использовании `Depends`:

```python
async def needy_dependency(
    fresh_value: Annotated[str, Depends(get_value, use_cache=False)]
):
    return {"fresh_value": fresh_value}
```

## Подзависимости в декораторе пути

Это если возвращаемое значение зависимости не используется внутри *функции операции пути*. Или же зависимость не возвращает никакого значения.

```python
async def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: Annotated[str, Header()]):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

## Глобальные зависимости

```python
async def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: Annotated[str, Header()]):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])
```

## yield

Очень удобная штука (наверное)

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

Перед созданием ответа будет выполнен только код до и включая `yield`. Код, следующий за оператором `yield`, выполняется после доставки ответа. 

И естественно, что одна зависимость с `yield` может зависеть от другой.

**Использование контекстных менеджеров**

Сам я их редко использовал, но, всё таки это удобно. Вот пример с файлом

```python
with open("./somefile.txt") as f:
    contents = f.read()
    print(contents)
```

И вот как-то так это можно использовать

```python
class MySuperContextManager:
    def __init__(self):
        self.db = DBSession()

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        self.db.close()


async def get_db():
    with MySuperContextManager() as db:
        yield db
```

# Авторизация

Требует установки:

```bash
pip install python-multipart
```

---
