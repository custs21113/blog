---
title: 复杂数据类型(指针类型)
date: 2025-11-05T20:10:00+08:00
updated: 2025-11-05T20:10:00+08:00
keywords: ["pointer"]
featured: true
summary: "golang的复杂数据类型(指针类型)"
---

[返回目录](/blog/golang)

#### 指针类型

指针存储的是内存地址，而内存地址指向真实存储的数据内容

```go
var p *int
```
可以利用&操作符来获取某个变量或常量的内存地址，从而产生一个指针

```go
package main

import (
  "fmt"
)

func main() {
	a := 10
	p := &a
	fmt.Printf("a = %d, p = %p, p = %d\n", a, p, *p)
}
// a = 10, p = 0x14000110020, p = 10
```

##### 为什么要区分值类型和指针类型

```go

type Account struct {
	Password string
}

func (a *Account) Modify() {
	a.Password = "password"
}
func tryChange(account Account) {
	account.Modify()
  account.Password = "1234561"
}
func realChange(account *Account) {
	account.Modify()
}
func main() {
	account := Account{
		Password: "123456",
	}
  // tryChange函数的参数是一个值类型数据，所以函数内部发生的修改不会影响到外部的变量。
	tryChange(account)
	fmt.Printf("password = %s\n", account.Password)
  // realChange函数的参数是一个指针类型数据，所以函数内部发生的修改会影响到外部的变量。
  // *Account代表参数account是一个指针类型。该参数同样复制了原始变量，不过，因为指针是一个内存地址，所以被复制出来的参数的值也是相同的内存地址。这样，在函数realChange()中，针对account的任何修改都会反映到原始变量中。
	realChange(&account)
	fmt.Printf("password = %s\n", account.Password)
}
// password = 123456
// password = password
```

#### 切片(slice)类型

数组的大小是固定且不可变更的，而切片可以视作大小可变的数组。

```go
// 切片的底层结构
type slice struct {
	array unsafe.Pointer // 指向底层数组的执政
	len int // 当前底层数组的元素个数
	cap int // 切片的容量，即底层数组最大可以存储的元素个数
}
```
##### 切片的声明和定义
```go
package main

import (
	"fmt"
)

func main() {
	var s []int = []int{1, 2, 3}
	fmt.Println(len(s), cap(s))
	// 尝试访问索引为3的元素，将抛出元素越界异常。
	// fmt.Println(s[3])
	// 尝试截取切片s中索引位置3至最后一个元素的部分，实际最大索引应为2，只要0 <= low <= high <= len(s)并不会抛出异常，只是会返回一个空数组。
	fmt.Println(s[3:3])
	// 利用数组创建切片
	array := [5]int{1, 2, 3, 4, 5}
	slice1 := array[:]
	fmt.Println(slice1)
	// 利用切片创建切片，新建的切片和原有的切片共用一个底层数组
	slice2 := slice1[1:]
	// 在新切片上的修改会影响到原有的切片，因为是使用的同一个底层数组
	slice2[0] = 0
	fmt.Println(slice1)
	fmt.Println(slice2)
	// 使用append函数拓展切片的容量
	s = append(s, 4)
	fmt.Println(len(s), cap(s))
	// 使用make()函数创建一个新切片
	l := make([]int, 0, 5)
	fmt.Println(len(l), cap(l))
	l = append(l, 1, 2, 3, 4, 5)
	fmt.Println(len(l), cap(l))
	// 使用for-range打印切片中所有元素
	for index, ele := range l {
		fmt.Println(index, ele)
	}
	// 单纯值拷贝
	s1 := s
	fmt.Printf("%p, %p", s1, s)
}

// 3 3
// []
// [1 2 3 4 5]
// [1 0 3 4 5]
// [0 3 4 5]
// 4 6
// 0 5
// 5 5
// 0 1
// 1 2
// 2 3
// 3 4
// 4 5

```
#### 映射(Map)类型
map中的key-value是无序的。

```go
// src/runtime
type hmap struct {
	// Note: the format of the hmap is also encoded in cmd/compile/internal/reflectdata/reflect.go.
	// Make sure this stays in sync with the compiler's definition.
	// map中存储的元素个数
	count     int // # live cells == size of map.  Must be first (used by len() builtin)
	flags     uint8
	// 桶个数的对数，
	B         uint8  // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
	// 溢出桶的个数
	noverflow uint16 // approximate number of overflow buckets; see incrnoverflow for details
	// hash种子
	hash0     uint32 // hash seed

	// map的底层是一个桶的数组(bmap)，buckets是该数组的指针，一个map中存储了2^B个桶，这些桶利用数组进行管理，buckets就是只想数组的指针。
	buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
	// 当发生桶迁移时，指向旧桶的一个指针。
	// map会发生桶迁移，而迁移的过程是渐进式的，这意味着实例中可能同时存在着新桶和旧桶，oldbuckets是指向旧桶数组的指针。
	oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
	// 迁移进度
	nevacuate  uintptr        // progress counter for evacuation (buckets less than this have been evacuated)
	clearSeq   uint64

	extra *mapextra // optional fields
}

// mapextra holds fields that are not present on all maps.
type mapextra struct {
	// If both key and elem do not contain pointers and are inline, then we mark bucket
	// type as containing no pointers. This avoids scanning such maps.
	// However, bmap.overflow is a pointer. In order to keep overflow buckets
	// alive, we store pointers to all overflow buckets in hmap.extra.overflow and hmap.extra.oldoverflow.
	// overflow and oldoverflow are only used if key and elem do not contain pointers.
	// overflow contains overflow buckets for hmap.buckets.
	// oldoverflow contains overflow buckets for hmap.oldbuckets.
	// The indirection allows to store a pointer to the slice in hiter.
	overflow    *[]*bmap 
	oldoverflow *[]*bmap

	// nextOverflow holds a pointer to a free overflow bucket.
	nextOverflow *bmap
}

// A bucket for a Go map.
type bmap struct {
	// tophash generally contains the top byte of the hash value
	// for each key in this bucket. If tophash[0] < minTopHash,
	// tophash[0] is a bucket evacuation state instead.
	tophash [abi.OldMapBucketCount]uint8
	// Followed by bucketCnt keys and then bucketCnt elems.
	// NOTE: packing all the keys together and then all the elems together makes the
	// code a bit more complicated than alternating key/elem/key/elem/... but it allows
	// us to eliminate padding which would be needed for, e.g., map[int64]int8.
	// Followed by an overflow pointer.
}

```

<img src="/note/golang/hmap.jpg" width="400"/>

```go
package main
import (
	"fmt"
)
func main() {
	var charCountMap = make(map[string]int)
	charCountMap["a"] = 3
	charCountMap["b"] = 4

	for k, v := range charCountMap {
		fmt.Printf("char:%s, count:%d\n", k, v)
	}
	// 访问映射中不存在的值时，会直接返回相应结合元素类型的空值
	v, e := charCountMap["c"]
	fmt.Println(v, e)
	charCountMap["c"] = 5
	fmt.Println(charCountMap)
	delete(charCountMap, "b")
	fmt.Println(charCountMap)
}

```
##### 哈希算法
$hash(k1) = [0, m-1]$
计算得到的哈希值将会用于决定键值对到哪个桶，并判断键值对是否已经在桶中存在。
常见的哈希算法有
1. 取模法 `hash%m`
2. 与运算法 `hash&(m-1)`, 当桶的个数为2的整次数幂时，那么运算结果会保证在区间[0,m-1]，即不会出现空桶(取模 2^k) = 取低k位

现在来根据以下步骤进行数学验证
1. 任何整数都可以使用二进制表达，故存在$hash=q\cdot2^k+r$，其中$0\leq r < 2^k$，而当$r<2^k$时，代表$r$的二进制长度不超过$k$位
2. 模运算的本质
$$
\begin{aligned}
 hash\;mod\;2^k = (q \times 2^k + r)\; mod\;2^k= 0 + r \;mod\; 2^k\\
\text{已知}\; 0\leq r < 2^k\\
\text{得}\; hash\;mod\;2^k = r\\
\end{aligned}
$$
3. 位运算的本质
$$
\begin{aligned}
\text{设}m=2^k\\
则\;m-1=2^k-1\\
在二进制下\;2^k=1\underbrace{00\ldots 000}_{k个0}\\
2^k-1=\underbrace{111\ldots 111}_{k个1}\\
而乘以2^k在二进制里等价于进行左移位运算k位，即在右边补k个0\\
而当一个整数小于2^k时等价于它最多只能用k位二进制表示\\
r\lt 2^k \Rightarrow r的二进制长度\leq k \Rightarrow r只占低k位\\
故此hash=q\times2^k+r \Rightarrow\;hash=q<<k + r\\
而q<<k的低k位全为零，且r只占低k位\\
即\;hash=[q的比特][r的k位]\\
从同余角度mod 2^k等价于消去所有高于k位的项，只取低k位\\
因为所有高位比特全部是2^k的倍数，在模运算中都会被“抹掉”\\
即任何高于k位的项对2^k取模结果都为0\\
\end{aligned}
$$
4. 验证过程
$$
\begin{aligned}
\text{已知}\; m = 16 = 2^4,\;k=4,\;r=m - 1 = 15 = 0b1111\\
\text{且}\; hash\;mod\;16\;\text{等价于}\; hash \& 15 \\
\text{由上述推导过程已知}\;取模 2^k = 取低 k位\\
验证过程如下\\
\text{假设hash值为}\; hash=0b101101011\\
hash\;mod\;16\ -> \text{取0b101101011的低四位} = 0b1011 = 11\\
hash\&15\ -> 0b101101011\;\&\; 0b00001111 = 0b00001011 = 0b1011 = 11
\end{aligned}
$$
> 故当`m = 2^k`时，可以优化为`hash & (m - 1)`

3. 哈希冲突(由于哈希算法，被计算的数据是无限的，而计算后的结果的范围是有限的，总会存在不同的数据但是计算之后得到的计算结果相同的情况，这就是所谓的哈希冲突)
+ 常见解决hash冲突常用的两种方式
	+ 1. 开发寻址法，第一个计算得到的桶已经被占用时，找它后面被占用的桶来用，使用的时候虽然还是会首先定位到第一个计算得到的桶，经过比较key不相等，就会遍历它(第一个计算得到的桶)后面的桶，直到key相等，或者遇到空桶
	+ 2. 拉链法，在发生哈希冲突的时候，在第一个计算得到的桶后面以单向链表的形式链接一个新桶用于存储这个新的键值对，查找时还是会先查找到第一个桶，比较发现key不相等，会顺着链表往后查找。
4. 哈希冲突的发生会影响哈希表的读写效率，选择散列均匀的哈希函数可以减少哈希冲突的发生，适时对哈希表进行扩容也是保障读写效率的有效手段
+ $$LoadFactor=\frac{count}{m}=\frac{count}{2^B}$$

<img src="/note/golang/bmap.jpg" width="800"/>

##### 溢出桶
溢出桶也是bmap结构，当哈希表要分配的常规桶的数目B>$2^4$时，即认为会使用到溢出桶的几率较大，就会预分配$2^{b-4}$个溢出桶备用，用于存储哈希冲突的键值对。
当B=5时，会有$2^5$个常规桶，$2^{5-4=1}$个备用的溢出桶。
##### 存储规则

先根据哈希算法计算得到的哈希结果，将其映射到一个桶中，再根据桶中的tophash数组，判断该键值对是否存在于该桶中，如果不存在，就会将该键值对存储到该桶中，如果存在，就会比较key是否相等，如果相等，就会更新value，如果不相等，就会发生哈希冲突，这时候就会使用拉链法将新的键值对链接到该桶的链表中。
当Go运行时决定把一个键值对放到当前这个桶时，会使用`线性扫描`的策略判断该把数据存放到`0-7`范围内的哪个位置。

1. 计算指纹(Tophash): 根据之前计算到的完整哈希值的高8位作tophash

2. 遍历bmap中的tophash数组，根据tophash和完整的hash值的对比情况会出现几种情况

+ 如果存在相同的tophash，就会比较完整的key是否相等，如果相等说明这个更新操作，那么就会更新bmap中对应的value
+ 如果存在相同的tophash，但完整的哈希值不相等时，即发生了哈希冲突，则接着遍历完bmap中的tophash数组以及所有溢出桶，遍历溢出桶的流程也和这个流程保持一致。在遍历的过程中记录遇到的第一个空位，遍历结束确认键的唯一性之后，则此时确认是插入行为，在记录的第一个空位这里存入键值对数据。假如遍历完当前桶没有空位的时候，则会将新插入的键值对存储到溢出桶中。
+ 若不存在相同的hash，则说明这个键值对是新的，那么就会将这个键值对存储到bmap中第一个为空的位置。
+ 若当前桶已满，且仍有可用的溢出桶，则会将这个键值对以上述相同的规则存储到溢出桶中。
+ 若当前桶已满，且没有可用的溢出桶，则会触发扩容操作，将当前桶中的键值对迁移到新的桶中。

##### 读取规则
读取规则和存储规则保持一致，先根据哈希算法计算得到的哈希结果，将其映射到一个桶中，再根据桶中的tophash数组，判断该键值对是否存在于该桶中，如果不存在，就会返回空值，如果存在，就会比较key是否相等，如果相等，就会返回value，如果不相等，就会发生哈希冲突，这时候就会使用拉链法将新的键值对链接到该桶的链表中。

##### 扩容规则
**LoadFactor默认为6.5**
触发扩容的规则
+ 当LoadFactor > 6.5使用翻倍扩容
+ LoadFactor没超标，noverflow(使用的溢出桶数量)较多时使用等量扩容，多用于已有很多键值对被删除的时候
	+ `B <= 15 noverflow >= 2^B`
	+ `B > 15 noverflow >= 2^15`

扩容时bmap中的数据的分配方式，增量扩容前的最大桶为`2^B`，扩容后的最大桶为`2^(B+1)`，而增量扩容后同一个bmap中的数据会根据哈希值的`低B+1`位来判断分配到哪个桶中，若`第B+1位`为0，则分配到当前桶中，若`第B+1位`为1，则分配到扩容后的桶中。特殊情况下，比如说同一个桶的数据的`第B+1位`都为`0`或`1`时，就会发生桶的数据在迁移后仍处于同一个桶的情况。

###### 扩容过程
1. 扩容时，`buckets`指向新桶，`oldbuckets`指向旧桶，`nevacuate`记录接下来要迁移的桶的编号，`extra.mapextra.nextoverflow`指向下一个空闲溢出桶，`extra.mapextra.oldoverflow`用于在扩容阶段存储旧桶用到的那些溢出桶的地址，`overflow`记录目前已经被使用的溢出桶的地址，`noverflow`记录使用的溢出桶数量
2. 判断使用哪种扩容规则，使用等量扩容会整理那些存储在溢出桶的键值对，使其在内存中存储得更加紧凑


#### channel

##### channel的创建
```go
package main
import "fmt"

func main() {
	// make(chan channelType, bufferSize)
	// bufferSize 为0时为同步channel，大于0时为异步channel
	var ch1 chan int
	ch1 = make(chan int, 1)
	ch2 := make(chan int, 1)
	// 向channel发送数据
	ch1 <- 2
	ch2 <- 1
	// 从channel接收数据
	fmt.Println(<-ch1, <-ch2)
	// 使用同步通道的时候
	ch3 := make(chan int)
}
// 2, 1
// 3
```
##### channel的实现原理
```go
type hchan struct {
	qcount uint					// channel里的元素数量
	dataqsiz uint				// 缓冲区大小
	buf unsafe.Pointer	// 缓冲区指针，指向一个循环队列
	elemsize uint16			// 元素的大小
	closed uint32				// 关闭状态
	elemtype *_type			// 元素的数据类型
	sendx uint					// 缓冲区中，已经被读取的数据的位置
	recvx uint					// 缓冲区中，当前已经写入的数据的位置
	recvq waitq					// 等待从channel中读取数据，正在被阻塞的协程队列
	sendq waitq					// 等待向channel中写入数据，正在被阻塞的协程队列
	lock mutex
}
```
利用buf成员来存储缓冲区，dataqsiz是缓冲区的大小，写入数据却没有足够空间容纳时，会被加入sendq队列中，被阻塞的接收数据的协程会加入recvq队列中。


#### struct
