### Типы данных

<mark> Заметка </mark> Переполнение беззнакового типа предугадать возможно, но переполнение знакового типа несет непредсказуемый характер

<mark> Заметка </mark> Для явного приведения типа используется оператор `static_cast<T>`:

```cpp
double q = static_cast<double>(a) / b;
```

###### Простые типы

```cpp
char c = '1';    // символ (1 байт)
bool b = true;   // логическая переменная, принимает значения false и true (1 байт)
int i = 42;      // целое число (занимает, как правило, 4 байта)
short int si = 17;           // короткое целое (занимает 2 байта)
long li = 12321321312;       // длинное целое (как правило, 8 байт)
long long lli = 12321321312; // длинное целое (как правило, 8 байт)
float f = 2.71828;           // дробное число с плавающей запятой (4 байта)
double d = 3.141592;         // дробное число двойной точности (8 байт)
long double ld = 1e15;       // длинное дробное (как правило, 16 байт)
```

###### Получение лимитов

```cpp
#include <iostream>
#include <limits>  // необходимо для numeric_limits

int main() {
    // посчитаем для типа int:
    std::cout << "minimum value: " << std::numeric_limits<int>::min() << "\n"
              << "maximum value: " << std::numeric_limits<int>::max() << "\n";
}
```

###### Корректное сравнение чисел с плавающей запятой

```cpp
#include <cmath>

// ...

double delta = 0.0000001;
if (std::abs(val1 - val2) < delta)
    std::cout << "Равно" << std::endl;
else 
    std::cout << "Неравно" << std::endl;
```

### Считывание данных

###### Считывание до конца ввода

```cpp
int x;
while (std::cin >> x) {
    //...
}
```

###### Считывание построчно до конца ввода

```cpp
#include <string>

std::string name;
while (std::getline(std::cin, name)) {
    //...
}
```
