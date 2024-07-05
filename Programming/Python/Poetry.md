<mark>Poetry</mark>

```bash
pip install poetry
```

# Настройка проекта

###### Создание директории

```bash
# Это создание с нуля
poetry new poetry-demo

# А это выполняется в папке с существующим проектом
poetry init
```

После первой команды будет получен каталог следующего вида:

```bash
poetry-demo
├── pyproject.toml
├── README.md
├── poetry_demo
│   └── __init__.py
└── tests
    └── __init__.py
```

Файл `pyproject.py` является очень важным, он описывает зависимости и настройки проекта, которые указаны [здесь](https://python-poetry.org/docs/pyproject/).


