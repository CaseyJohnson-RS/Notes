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

- 

- Header

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
