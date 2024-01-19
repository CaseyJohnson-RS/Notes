# Алгоритмы

## Числа и последовательности

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

## Геометрия

###### Три точки на прямой

Обычная проверка уравнения прямой

```python
def PointsOnOneLine(Ax,Ay,Bx,By,Cx,Cy)

    return (Cx - Ax)*(By-Ay) == (Cy - Ay)*(Bx-Ax)
```

## Матрицы

###### Тёплицевы матрицы

Равные значения на диагоналях, параллельных главной

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

## Графы

###### # Разделение точек графа удалением минимального количества вершин

```python
# Жадный алгоритм. Общая сложность O(4|V| + 2|E|)
# Возвращает список вершин к удалению
def GetDivideVertexes(M,startVertex,endVertex): # Принимает М - матрица смежности, startVertex и endVertex - номера вершин к разделению

  svID = startVertex - 1
  evID = endVertex - 1
  n = len(M)

  # Если вершины соеденены ребром, то разделить их удалением вершин нельзя

  if M[svID][evID] == 1:
    return []

  # Создание массива слоев псевдодерева от начальной до конечной вершины ->

  treeA = [set([svID])]

  unusedVertexes = set([i for i in range(n)])  # Массив неиспользованных вершин
  unusedVertexes.remove(svID)

  while evID in unusedVertexes:                # Сложность цикла: О(|V|+|E|)

    treeA.append(set())                        # Добавляем слой

    for i in treeA[-2]:                        # Обходом в ширину добавлям в слой вершины
      for j in unusedVertexes:
        if M[i][j] == 1:
          treeA[-1].add(j)

    if len(treeA[-1]) == 0:                    # Слои больше не растут, что значит невозможность достичь вершины
      return []
    else:
      unusedVertexes = unusedVertexes - treeA[-1]

  # Создание массива слоев псевдодерева от конечной до начальной вершины <-

  treeB = [set([evID])]

  unusedVertexes = set([i for i in range(n)])  # Массив неиспользованных вершин
  unusedVertexes.remove(evID)

  while svID in unusedVertexes:                # Сложность цикла: О(|V|+|E|)

    treeB.append(set())                        # Добавляем слой

    for i in treeB[-2]:                        # Обходом в ширину добавлям в слой вершины
      for j in unusedVertexes:
        if M[i][j]:
          treeB[-1].add(j)

    unusedVertexes = unusedVertexes - treeB[-1]

  divideSets = treeA[1:] + treeB[1:]           # Объединяем список слоев и ищем минимальный срез вершин
  minSet = divideSets[0]
  for i in divideSets:                         # Максимальная сложность O(2|V|)
    minSet = len(minSet) > len(i) and i or minSet

  return [i + 1 for i in minSet]
```

###### Поиск гамильтонова цикла в обычном и орграфе

```python
def HamiltonianCycle(M):    # O(n^2) - Для неориентированного графа

  n = len(M)

  # Проверка условий Оре или Дирака

  for i in M:
    if sum(i) < n/2:
      return ["Idk",i]

  # Нахождение цикла

  queue = [i for i in range(n)]

  for _ in range(n*(n-1)):

    if M[queue[0]][queue[1]] == 0:

      i = 2

      while M[queue[0]][queue[i]] == 0 or M[queue[1]][queue[i+1]] == 0:
        i += 1

      # Переворачиваем подпоследовательность
      for m in range(1,i//2+1):
        queue[m], queue[i+1-m] = queue[i+1-m], queue[m]

    queue.append(queue.pop(0))

  return [i + 1 for i in queue]
```
