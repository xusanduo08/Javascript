MVC，一种软件设计模式，将相互关联的代码逻辑分成有相互关系的3部分内容。

MVC有助于代码重用和并行开发。

基于职责分离的思想，都会对应用程序进行分层。

**Model**：关键部分，保存着应用的数据，不依赖view和controller，管理数据以及应用的业务逻辑，从controller中接收用户的输入

**View**：model层的视觉表现，同样的数据可以有多个view展现

**Controller**：接收用户输入，并将其交给（可以加入校验）model或view，会根据数据产生交互。充当modal和view的链接作用

优点：

* 多个view能共享一个modal。Model响应用户请求并返回响应数据，view负责格式化数据并把它们呈现给用户，业务逻辑和表示层分离，同一个model可以被不同的view重用
* controller是自包含物件，与model和view保持相对独立，所以可以方便的改变应用程序的数据层和业务规则
* 同步开发
* 代码重用
* 各部分之间低耦合，每个部分又内聚

以上内容出自[这里]( [https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller](https://en.wikipedia.org/wiki/Model–view–controller) )

MVP，起源于MVC的一种架构模式。

在MVP中，presenter充当一个中间人的角色（联系model和view，负责两者之间的通信），所有渲染逻辑都存在于presenter中。

**model**：定义了要展示的数据和针对用户的操作要采取的行为，会对外暴露接口供presenter调用

**view**：被动渲染数据（presenter将数据传给view，view被动接收数据），并将用户的操作（或者事件）转发到presenter，由presenter处理后转发到model，并对model进行修改

**presenter**：负责操作model和view，它将数据从model中取出，然后处理后交给view展示



