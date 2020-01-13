编译三大基本步骤：

* 解析 Parsing
  * 词法分析 Lexical Analysis
  * 语法分析 Syntactic Analysis
* 转换 Transformation
* 代码生成 Code Generation

Babel工作过程基本就是上面三步。



### 解析 Parsing

解析阶段一般分成两部分：词法分析和语法分析

在词法分析阶段，编译器接收原始代码，并使用词法分析器（tokenizer）将代码拆分成词法单元（tokens）。Tokens是个数组，包含了构成代码语法的各个部分，这些部分可以是数字，标签，括号，操作符或者其他东西。

在语法分析阶段，编译器接收上面处理得到的tokens，并根据它们各自的语法和相互之间的关系进行转换，转换所得的结果就是抽象语法树（Abstract Syntax Tree）。

对于下面的代码：

```
(add 2 (substract 4 2))
```

生成的tokens大致如下：

```
  [
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'add'      },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'subtract' },
    { type: 'number', value: '4'        },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: ')'        },
    { type: 'paren',  value: ')'        },
  ]

```

相应的抽象语法树大致如下：

```
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2',
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
      type: 'NumberLiteral',
      value: '4',
    }, {
        type: 'NumberLiteral',
        value: '2',
     }]
   }]
  }]
}
```



### 转换 Transformation

接收上一阶段生成的AST，对其进行相关操作。可以在现有的AST上进行操作，并生成同种类型语言；也可以生成其他语言。

AST上每个节点都有相关属性描述当前这个节点，每个节点都有有个type属性。

在进行转换时，可以操作（增加、删除、替换）这些属性，也可以增加、删除节点，或者干脆基于现有的AST生成一个新的AST。

#### 遍历 Traversal

深度优先遍历每个节点（如果不是为了生成新的AST的话，还可以有其他遍历方法）

#### 访问者 Visitor

访问者自带能处理各种类型节点的方法。

```
var visitor = {
  NumberLiteral(node, parent) {},
  CallExpression(node, parent) {}
}
```

在遍历过程中，会不断调用这个访问者身上与当前节点类型匹配的方法。

需要有一个进入节点和离开节点的方法：

```
var visitor = {
  NumberLiteral: {
    enter(node, parent){},
    exit(node, parent){}
  }
}
```



### 代码生成 Code Generation

编译的最后一个步骤。

主要功能是：接收AST，输出代码。也会做一些和转换阶段重叠的事情。

一些编译器在这个阶段会重用前面的takens，也有一些会自己创建。

编译器知道如何去处理AST上不同类型的节点，根据各节点类型输出对应的代码，并且会递归的调用自己直到所有节点都已经被输出到代码中。

总结成几个步骤就是：

1. input     => tokenizer       => tokens

2. tokens  => parser             => ast

3. ast         => transformer  => newAst

4. newAst => generator      => output



以上是对编译器工作的大致描述，摘自[这里](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js)。



### 访问者模式

（在对AST进行遍历的时候用到了访问者模式）

对于一个由多个对象构成的对象结构，这些对象的类都具有一个`accept`方法用来接受访问者。访问者是一个接口，它拥有`visit`方法，**这个方法对访问到的对象结构中不同类型的元素作出不同的反应**。在对象结构的一次访问过程中，遍历整个对象结构，对每一个元素都实施`accept`方法，在每一个元素的`accept`方法中回调访问者的`visit`方法（在`visit`方法内部会针对不同的对象结构做不同的处理），从而使得访问者得以处理对象结构中的每一个元素。

```java
interface Visitor{ // 访问者接口，针对每种对象结构都有对应的处理方法
  void visit(Wheel wheel);
  void visit(Engine engine);
  void visit(Body body);
  void visit(Car car);
}

// 每个具体的对象结构都有一个accept方法用来调用访问者的visit方法
class Wheel{
  private String name;
  Wheel(String name){
    this.name = name;
  }
  String getName(){
    return this.name;
  }
  void accept(Visitor visitor){
    visitor.visit(this);
  }
}

class Engine{
  void accept(Visitor visitor){
    visitor.visit(this);
  }
}

class Body{
  void accept(Visitor visitor){
    visitor.visit(this);
  }
}

class Car{
  private Engine engine = new Engine();
  private Body body = new Body();
  private Wheel[] wheels = {
    new Wheel("front left"),
    new Wheel("front right"),
    new Wheel("back left"),
    new Wheel("back right")
  }
    
  void accept(Visitor visitor){
    visitor.visit(this);
    engine.accept(visitor);
    body.accept(visitor);
    for(int i = 0; i < wheels.length; ++i){
      wheels[i].accept(visitor);
    }
  }
}

// 访问者实例
class PritVisitor implements Visitor{
  public void visit(Wheel wheel){
    System.out.println("Visiting " + wheel.getName() + " wheel")
  }
  public void visit(Engine engine){
    System.out.prinln("Visiting engine");
  }
  public void visit(Body body){
    System.out.println("Visiting body");
  }
  public visit(Car car){
    System.out.println("Visiting car");
  }
}

public class VisitorDemo{
  static public void main(String[] args){
    Car car = new Car();
    Visitor visitor = new PrintVisitor();
    car.accept(visitor);
  }
}
```





