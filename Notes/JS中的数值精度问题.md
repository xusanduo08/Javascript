#### JS中的数值精度问题



首先，**JavaScript中数字类型只有一个`Number`，不区分整数值和浮点数值，所有数字均采用IEEE754规定的64位浮点格式（也就是其他语言中的双精度类型）表示**。

在IEEE754中，数字的存储格式要求如下：

* 第0位：符号位，0表示正数，1表示负数
* 第1到11位：阶码，存储指数部分，这部分的存储采用二进制偏移存储
* 第12位到63位：尾数，存储有效数字

一句话总结下就是：1位数符+11位阶码+52位尾数

其中阶码由真码偏移1023计算得出

JS中任何一个数字都是按照上面的格式存储的。

举例来说，计算机中所有数字都是转换成二进制存储的，十进制数字`1`转换为二进制为`1`，二进制`1`用科学计数法表示为1.0×2<sup>0</sup>。如果用上面的标准表示1.0×2<sup>0</sup>的话，数符为0，那指数为多少？

指数部分的存储是要有偏移的，偏移量为：

K = 2<sup>(n - 1)</sup> - 1    其中`n`表示位数。

所以可以算出，现在这个例子中指数的偏移量是2<sup>10</sup>-1，也就是1023，本来指数就是`0`，相加后的二进制表示就是`01111111111`，所以指数`0`存储的偏移二进制就是`01111111111`。

在二进制情况下，科学计数法的总是以`1.xxx`这样的形式开头的，因为开头总是1，所以干脆省掉对这位数的保存，在计算的时候记得加上这个1就行。所以，对于二进制数`1`来说，因为其小数点右边没有其他数，尾数部分全是0。

数符是0，阶码是`01111111111`，尾数全是0，所以，二进制`1`在IEEE754标准下是这么保存的：

001111111111000...000（最后连续52个0）



**十进制整数转二进制方法是：除2取余；十进制小数转二进制方法是：乘2取整，直到小数部分为0**

根据上面的转换规则可以得出，只有分母是2的偶数次倍的小数才能被二进制有限的表示。

0.1分母为10，0.2分母为5，都不是2的偶数次倍，所以都不能用二进制在有限数位内表示。

0.1的二进制表示：

![0.1的二进制表示](../img/201910112150.png)

按照存储标准，尾数只有52位，最终计算机中在存储0.1和0.2时都会进行四舍五入，以便使它们各自二进制表示时的尾数不超过52位。这样一来精度就发生了丢失。实际在计算时，它们在四舍五入后的二进制表示相加得到结果的尾数也超过了52位，所以只好又进行一次四舍五入。这样在一次计算中进行了三次四舍五入。在计算机在保存0.3时，只做了一次四舍五入（十进制0.3也不能用有限的二进制小数表示）。几次的四舍五入导致了0.1+0.2的结果跟0.3表示的不一样。

0.1和0.2在二进制中不能被有限的表示，所以，0.1+0.2永远不会等于0.3。

总结：

* IEEE754标准，数符1位，阶码11位，尾数有52位
* 0.1和0.2都不能转为有限的二进制表示，为了符合标准，只能四舍五入
* 0.3在存储时也进行了四舍五入
* 四舍五入导致了精度丢失，所以两者不相等

`Number.MAX_SAFE_INTEGER(9007199254740991)`是能**准确表示和比较**的最大的整数，转为科学计数法表示为：

![](../img/201910122017.png)

但这不是js能表示的最大的数。js能表示的最大的数是`Number.MAX_VALUE`。

![](../img/201910122019.png)

9007199254740993二进制表示为 1(52个0)1 ，根据IEEE745的规则，最后一位1会被舍去，所以最终得到的数字又回到了9007199254740992，最终数字在9007199254740992和9007199254740993之间循环



看似有穷的数字, 在计算机的二进制表示里却是无穷的，由于存储位数限制因此存在“舍去”，精度丢失就发生了

解决精度丢失的方法就是把小数放到位整数（乘倍数），再缩小回原来倍数（除倍数）



关于Javascript的Number类型，你需要知道的东西（这篇比较详细）：https://genuifx.github.io/2018/04/17/here-is-what-you-need-to-know-about-javasciprt-number-type/

详谈IEEE浮点数编码机制：https://www.beansmile.com/blog/posts/details-of-ieee-float

0.1 + 0.2不等于0.3？为什么JavaScript有这种“骚”操作？：https://juejin.im/post/5b90e00e6fb9a05cf9080dff#heading-5

深入理解IEEE754的64位双精度：https://www.boatsky.com/blog/26

解决toFixed四舍五入陷阱：https://www.boatsky.com/blog/32















