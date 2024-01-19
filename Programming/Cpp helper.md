# Шпаргалки по C++

### Сортировка числового массива

```cpp
#include <algorithm>
//...

int main()
{
    double* arr = new double[N];
 
    std::sort(arr, arr + N);
}
```

### Максимальный элемент в массиве и векторе

```cpp
#include <algorithm>
//...

int main()
{
    std::vector<int> vec { 1, 2, 3, 4, 5 };
    int * arr = new int[5];

    auto maxv = std::max_element(vec.begin(), vec.end());
    auto maxa = std::max_element(arr, arr+5);

    std::cout << *maxv << " " << maxa << std::endl;
}
```

### Удалить элемент из vector\<T\>

```cpp

```



### NB (Useful notes)

- Тип `double` почему-то проигрывает в точности типу `float` если требуется точность до целых. У `double` есть ошибка <10<sup>-10</sup>, поэтому если их использовать как счетчик, то можно обсчитаться. Однако `double` лучше использовать, если нужны корни и квадраты чисел с точностью то 10<sup>-6</sup>

- Можно писать тесты для кода на `Python`
