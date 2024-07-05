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

Path и Query параметры

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int, item_id: str, q: str | None = None, short: bool = False
):
    # ...
```

FastAPI достаточно умен, чтобы отличить Path параметры от Query параметров, поэтому **порядок** объявления аргументов функции **неважен**.
