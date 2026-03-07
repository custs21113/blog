---
title: 变量与常量
date: 2025-11-05T20:10:00+08:00
updated: 2025-11-05T20:10:00+08:00
keywords: ["variable", "const", "iota"]
featured: true
summary: "golang的变量、常量以及特殊常量iota"
---


#### 变量

##### 变量声明

```go
var length int
// 声明相同类型的多个变量
var length, size int
// 使用变量块一次声明多个变量
var (
  name string
  age, weight, height int
)
```
##### 变量赋值
在 `.go` 文件中声明的变量，如果不是在函数内声明的，即全局变量，那么在当前go文件中内的函数可以直接使用。

```go
// 变量声明的同时赋值
var age int = 39
var name string
name = "owe"
// 多重赋值
var length, size int
length, size = 10, 20
// 声明变量的时候使用类型推断
var title = "PostgreSQL集群部署"
// 在函数内容还可以使用短变量声明
func main() {
  // 首次给变量赋值的时候可以使用短变量声明
  age := 39
  name := "owe"
  length, size := 10, 20
  // 其中一个已经声明过，而另外一个未声明，应该使用“:=”，因为“:=”可以在声明变量的同时赋值，而“=”只能在变量已经声明过的情况下赋值。
  name, weight := "gwen", 60
}
```

#### 常量

##### 常量声明与赋值

```go
// 常量相关内容基本和变量类似，只是常量的值在声明后不能被修改。
const age int = 60
const name = "PostgreSQL"
const (
  pi = 3.14
  e  = 2.71828
)
```

#### 特殊常量iota与枚举

##### 使用iota定义累加常量

为周日至周六依次定义了枚举常量Sunday～Saturday，并依次为其赋值为0～6。
```go

const (
  Sunday = 0
  Monday = 1
  Tuesday = 2
  Wednesday = 3
  Thursday = 4
  Friday = 5
  Saturday = 6
)
// 使用iota定义累加常量
const (
  Sunday = iota
  Monday = iota
  Tuesday = iota
  Wednesday = iota
  Thursday = iota
  Friday = iota
  Saturday = iota
)
// 使用简写
const (
  Sunday = iota
  Monday
  Tuesday
  Wednesday
  Thursday
  Friday
  Saturday
)
// iota如同一个代码行计数器，即使在常量组的中间位置中断了iota的引用，计数器也会随着代码行数而自增下去。
const (
  Sunday = iota
  Monday
  Tuesday
  Wednesday = "x"
  Thursday = iota
  Friday = iota
  Saturday = iota
)
// 0 1 2 x 4 5 6
// 利用加法运算结合iota来为所有常量赋值，从而实现非0开始的连续值。
const (
  Sunday = iota + 1
  Monday
  Tuesday
  Wednesday
  Thursday
  Friday
  Saturday
)
// 1 2 3 4 5 6 7

```

[返回目录](/blog/golang)