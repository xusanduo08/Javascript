#####Java中hashCode的理解

hashCode源于这样的场景：在一个存储结构中，记录的存储位置是随机的，和记录的关键字之间不存在确定的关系，因此，在结构中查找记录时需要进行一系列和关键字的比较。当然，比较是要消耗时间的，所以理想情况是没有比较，一次存取便能得到所查到的记录。为了能达到没有比较直接获取记录存取位置的效果，需要在记录的存储位置和记录的关键字之间建立一个确定的对应关系f，使得每个关键字和结构中一个唯一的存储位置相对应。有了这个对应关系f 之后，只要根据这个对应关系f 就能找到给定值K 的像 f(K)。若结构中存在关键字和K相等的记录，则必定在f(k)的位置上，因此，不需要进行比较便可以直接取得所查记录。关于这个对应关系f，就叫做__哈希(hash)函数__。而哈希函数计算出来的值就是hashCode。

HashCode在Java官方文档中的定义：

> Java中哈希值的计算由hashCode()方法完成。支持该方法是为哈希表提供一些优点，例如HashMap。
>
> hashCode 的常规协定是：
>
> 1. 在 Java 应用程序执行期间，在同一对象上多次调用 hashCode 方法时，必须一致地返回相同的整数，前提是对象上 equals 比较中所用的信息没有被修改。从某一应用程序的一次执行到同一应用程序的另一次执行，该整数无需保持一致。   
> 2. 如果根据 equals(Object) 方法，两个对象是相等的，那么在两个对象中的每个对象上调用 hashCode 方法都必须生成相同的整数结果。   
> 3. 以下情况不 是必需的：如果根据 equals(java.lang.Object) 方法，两个对象不相等，那么在两个对象中的任一对象上调用 hashCode 方法必定会生成不同的整数结果。但是，程序员应该知道，为不相等的对象生成不同整数结果可以提高哈希表的性能。   
> 4. 实际上，由 Object 类定义的 hashCode 方法确实会针对不同的对象返回不同的整数。（这一般是通过将该对象的内部地址转换成一个整数来实现的，但是 JavaTM 编程语言不需要这种实现技巧。）   
> 5. 当equals方法被重写时，通常有必要重写 hashCode 方法，以维护 hashCode 方法的常规协定，该协定声明相等对象必须具有相等的哈希码。 

关于hashCode的理解，我想到一个好的比喻：

>我有一堆鸡蛋，现在把这些鸡蛋放到不同的篮子里，篮子编号0~n，假设每个鸡蛋都是独一无二的。现在我开始分配鸡蛋。取每个鸡蛋的Id对n取余，然后把这个鸡蛋放到余数对应的篮子里。好了，鸡蛋都根据前面说的规则放好了，现在我准备取某一个鸡蛋，我知道这个鸡蛋的Id，因为有了前面的对应规则，所以我根据Id%n得到这个鸡蛋所放置的篮子的编号，然后到对应篮子里找我要找的那个鸡蛋。

放到Java中，hashCode的作用就是能快速定位到我要找的那个对象对应的存储区域。

##### 如果对象具有相同hashCode怎么办（同一个篮子中放置了好多鸡蛋，如何取到我要的那个？）

在同一个存储区域，可以存储多个对象（一个篮子中可以有多个鸡蛋），为了取得我们要的那个对象，我们就要定义equals方法了。在存储区域内去遍历，如果equals方法返回值相等，则就是我们要找的那个对象（鸡蛋）。

也就是说，我们先通过hashCode来找到目标对象所处的存储区域（篮子），这个存储区域里有很多对象（鸡蛋），这个时候再通过equals方法在这个区域内（篮子里）查找我们要的那个对象（鸡蛋）。

通过以上的比喻，我们可以总结出一个结论：__hashCode相同（在同一个篮子里），equals不一定相同（不一定是同一个鸡蛋）；而equals相同（是同一个鸡蛋），则hashCode一定相同（都是同一个鸡蛋了，当然在同一个篮子里了）。__

##### hashCode()和equals()方法的重写

一般定义了一个新类后都要重写这个类的equals和hashCode方法。重写equals方法后，一定要重写hashCode方法，确保相同对象返回的哈希值相同。两个方法的重写都有一定的规则，在官网可以查到。

