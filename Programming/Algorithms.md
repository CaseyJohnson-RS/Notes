###### Наибольший общий делитель

```python
# Рекурсия
def gcd(a,b): # a > b
    if a < b:
        a,b = b,a
    if b == 0:
        return a
    else:
        return gcd(b, a % b)

# Итерации
def gcd(a,b): # a > b
    if a < b:
        a,b = b,a
    while b > 0:
        a, b = b, a % b
    return a
```
