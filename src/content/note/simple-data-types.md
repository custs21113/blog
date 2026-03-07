---
title: 简单数据类型
date: 2025-11-05T20:10:00+08:00
updated: 2025-11-05T20:10:00+08:00
keywords: ["int", "float", "bool", "char", "string", "array"]
featured: true
summary: "golang的简单数据类型"
---

[返回目录](/blog/golang)

#### 整型

##### 有符号整型
`int8`  8位有符号整数

`int16` 16位有符号整数

`int32` 32位有符号整数

`int64` 64位有符号整数

`int`  32位或64位有符号整数，根据操作系统使用的位数而不同

##### 无符号整型
`uint8`  8位无符号整数

`uint16` 16位无符号整数

`uint32` 32位无符号整数

`uint64` 64位无符号整数

`uint`  32位或64位无符号整数，根据操作系统使用的位数而不同

#### 浮点型
`float32`
`float64`

使用类型推导声明并赋值的浮点型变量，默认类型为float64。

##### 浮点型的大小比较
```go
package main

import (
  "fmt"
  "math/big"
)

func main() {
  a := 3.14
  b := 3.15
  
  result := big.NewFloat(a).Cmp(big.NewFloat(b))
  
  if result < 0 {
    fmt.Println("a 小于 b")
  } else if result > 0 {
    fmt.Println("a 大于 b")
  } else {
    fmt.Println("a 等于 b")
  }
}
```

#### 布尔类型

`true` 和 `false`，默认 `false` 。

#### 字符类型

字符型指的是单个字符。这里的字符不仅仅是ASCII码，也包含了中文及其他语言文字字符。在Go程序运行时，字符型会按照UTF-8编码转换为数字，因此，字符型和整型数字是一一对应的。
go语言中没有专门的关键字来定义字符型，直接利用单引号进行赋值即可。

```go
package main

func main() {
  var c = '中'
  fmt.Println(c)
  // 强制将字符类型转换为字符串类型
  fmt.Println(string(c))
  // 使用打印格式化函数
  fmt.Printf("%c", c)
}
// 20013 字符“中”转换为UTF-8编码后的十进制数字
// 中
// 中
```

#### 字符串类型

字符串在内存中以字节数组([]byte)形式存储，即将字符串安装UTF-8编码转化，生成字节数组。
```go
package main

import "fmt"

func main() {
  s := "字符串"
  len := len(s)
  fmt.Println(len)
}
// 9
```

##### rune类型
每个字符(rune)实际对应了Unicode字符集中的一个编码（码点）​。
```go
package main

import (
  "fmt"
  "unicode/utf8"
)

func main() {
  s := "字符串"
  // 使用utf8.RuneCountInString()来获取字符串中的字符个数。
  len := utf8.RuneCountInString(s)
  fmt.Println(len)
}
// 3
```

##### 原义字符
```go
package main

import (
  "fmt"
)

func main() {
  // 使用``定义原义字符
  s := `c:\Users\Administrator\Desktop\go\src\content\note\simple-data-types.md`
  fmt.Println(s)
}
// c:\Users\Administrator\Desktop\go\src\content\note\simple-data-types.md
```
#### 数组类型

go语言的数组类型是一种值类型，而不是引用类型。

使用数组变量作为函数参数时，会将数组全量复制一份传递给函数，而不是传递数组的引用。这也意味着在函数中对传入的数组进行修改，不会影响到调用方的数组。
```go
package main

import "fmt"

func main() {
  // go语言中的数组大小不可变更
  a := [5]int{1, 2, 3, 4, 5}
  // 自动推导数组长度
  // a := [...]int32{1, 2, 3, 4, 5}
  fmt.Println(a)
  // [1 2 3 4 5]
  // 根据索引直接访问数组元素
  fmt.Println(a[2])
  // 3
  // 修改数组中的元素
  a[2] = 0
  fmt.Println(a)
  // [1 2 0 4 5]
}
```