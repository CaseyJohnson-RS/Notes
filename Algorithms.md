# Алгоритмы

###### Фибоначчи

```python
# Быстрая версия с кэшированием
# Возможны проблемы с глубиной рекурсии
from functools import lru_cache

@lru_cache(maxsize=None)
def Fib(n):

    if n < 2:

        return n

    return Fib(n-1) + Fib(n-2)
```

```python
# Простая версия с циклом
# Работает сколько хочешь, но медленно
def Fib(n):

    if (n < 0):

        return 0

    a,b = 0, 1

    for i in range(n):
        a,b = b, a + b

    return a
```

```python
# Универсальная версия использующая кэш 
# И обходящая рекурсию 
# минус - плохо использует память
def FibGenerator():

    FCache = [0,1]

    def Fib(n):

        if (n < 0): return 0

        for i in range(n-len(FCache)+2):

            FCache.append(FCache[-2]+FCache[-1])

        return FCache[n]

    return Fib

Fib = FibGenerator() # Непосредственно сама функция для генерации чисел
```

```cpp
#include <iostream>
const int DEVIDER = 1e9+7;

// Тяжелый код на плюсах, который расчитывает значения, но, к сожалению,
// пока не запоминает. Зато очень быстрый. При n = 1000000 ответ 
// рассчитывается за 1 секунду

int main() {

    int k, n;
    cin >> k >> n;

    if (n <= k)
    {
        cout << (n == k ? 1 : 0);
        return 0;
    }

    unsigned long int *arr = new unsigned long int[n+1];

    for (int i = 0; i < k-1; ++i)

        arr[i] = 0;

    arr[k-1] = 1;

    unsigned long int sum = 1;

    arr[k] = sum;

    for (int i = k; i < n; ++i)
    {
        sum = (sum + arr[i] - arr[i-k]);
        arr[i+1] = sum%(DEVIDER);
    }

    cout << arr[n];

    return 0;
}
```

###### Три точки на прямой

Обычная проверка уравнения прямой

```python
def PointsOnOneLine(Ax,Ay,Bx,By,Cx,Cy)

    return (Cx - Ax)*(By-Ay) == (Cy - Ay)*(Bx-Ax)
```

###### Тёплицевы матрицы. Равные значения на диагоналях, параллельных главной

```python
def CheckToeplitzMatrix(matrix):

    # Данная функция проверяет только квадратные матрицы
    if (len(matrix) != len(matrix[0])): 
        return False

    for i in range(0, len(matrix)-1):

        x = 0
        y = i

        valueR = matrix[x][y]
        valueL = matrix[y][x]

        x += 1
        y += 1

        while x < n and y < n:

            if matrix[x][y] != valueR or matrix[y][x] != valueL:
                return False

            x += 1
            y += 1

    return True
```

###### Тест числа на простоту

```python
def IsSimple(n):

    if (n <= 1):     # Единица и числа меньше - не простые
        return False

    for i in range(2,int(n**(0.5))+1):

        if n % i == 0:

            return False

    return True
```

###### Наибольший общий делитель

```python
def gcd(m,n):

    t = 1

    if (m == 0): return n
    if (n == 0): return m

    while n != 0:
        t = m % n
        m = n
        n = t

    return m
```

###### Наименьшее общее кратное

```python
def lcm(a,b):

    def gcd(m,n): # m,n > 0

        t = 1

        if (m == 0): return n
        if (n == 0): return m

        while n != 0:
            t = m % n
            m = n
            n = t

        return m

    return a*b//gcd(a,b)
```
