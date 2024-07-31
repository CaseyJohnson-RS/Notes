<mark>Poetry</mark>

```bash
pip install poetry # У меня сработало, но если не сработает

# Unix
curl -sSL https://install.python-poetry.org | python3 -

# Win
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

Зачем-то надо создать папку

```bash
# Unix
$HOME/.local/bin

# Win
%APPDATA%\Python\Scripts
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

Шаблон `pyproject.py`

```bash
[tool.poetry]
name = "poetry-demo"
version = "0.1.0"
description = ""
authors = ["Sébastien Eustace <sebastien@eustace.io>"]
readme = "README.md"
# или readme = ["docs/README1.md", "docs/README2.md"]
packages = [{include = "poetry_demo"}]
maintainers = [
    "John Smith <johnsmith@example.org>",
    "Jane Smith <janesmith@example.org>",
]
homepage = "https://python-poetry.org/"
repository = "https://github.com/python-poetry/poetry"
documentation = "https://python-poetry.org/docs/"
keywords = ["packaging", "poetry"]

[tool.poetry.dependencies]
python = "^3.7"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

---

В целом я пока не понимаю, зачем мне нужен Poerty, если есть инструмент легче `venv`
