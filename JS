# JS 

Запрос данных
```javascript

fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json))

```

Сохранение данных локально (временно)
```javascript
localStorage.setItem("myCat", "Tom");
const cat = localStorage.getItem("myCat");
localStorage.removeItem("myCat");
localStorage.clear();
```

Деструктуризация
```javascript
// первый и второй элементы не нужны
let [, , title] = "Юлий Цезарь Император Рима".split(" ");

// ... - оператор "spread"
let [firstName, lastName, ...rest] = "Юлий Цезарь Император Рима".split(" ");

// значения по умолчанию
let [firstName="Гость", lastName="Анонимный"] = [];

// lastName получит значение, соответствующее текущей дате:
let [firstName, lastName=defaultLastName()] = ["Вася"];

// Деструктуризация объекта
let {var1, var2} = {var1: …, var2: …};

// Именование
let {width: w, height: h, title} = options;
alert(title); 
alert(w);
alert(h);

// ... - оператор "spread"
let {title, ...size} = options;
// title = "Меню"
// size = { width: 100, height: 200} (остаток)
```