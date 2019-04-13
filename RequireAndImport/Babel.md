自从版本7之后，Babel下发布的所有模块包都以`@babel`为开头，这种模块设计使得自定义工具变得很方便。下面看一下`@babel/core`和`@babel/cli`两个包。

#### `@babel/core`

Babel的主要功能都来自于`@babel/core`，可以通过以下方式安装：

```
npm install --save-dev @babel/core
```

安装之后，可以通过`require`命令引用：

```javascript
const babel = require('@babel/core');
babel.transform('code', optionObject);
```

#### `@babel/cli`

`@babel/cli`是一个能够让你在命令行使用babel的工具。下面是安装命令和基本使用方法：

```
npm install --save-dev @babel/core @babel/cli
./node_modules/.bin/babel src --out-dir lib
```

上面的命令会去解析`src`目录下的所有js文件，并且会将我们设定的编译器运用于解析过程，解析结果会输出到`lib`目录下。上面的命令并没有传入编译器，所以输出结果和输入一样。我们可以将编译器通过参数传入到babel中。`—-plugins`和`--presets`是目前对于cli来说比较重要的两个选项。

#### Plugins和Presets

编译器以插件的形式存在，它们本质是js代码，能够指导Babel去转译我们的代码。我们可以使用官方发布的包来将ES6+的代码转成ES5，比如`@babel/plugin-transform-arrow-functions`：

```
npm install --save-dev @babel/plugin-transform-arrow-functiojns
./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
```

上面的命令会将我们代码中的箭头函数转成ES5的形式：

```javascript
const fn = () => 1;
// converted to
var fn = function fn(){
  return 1;
}
```

ES6中还有很多其他特性需要转译的，除了一个一个添加插件来实现转译外，我们还可以使用"预设（preset）"来完成同样的事情。预设是一类插件的集合，它预先集成了一类插件供用户使用。

预设是插件的集合，你可以将不同插件组合起来构建你自己的预设。对于上面的例子，有个名为`env`的预设比较适合。

```
npm install --save-dev @babel/preset-env
./node_modules/,.bin/babel src --out-dir lib --presets=@babel/env
```

这个预设包含了可以用来转译ES6/ES7等超前版本javascript的语法的所有插件，而且用起来不用任何设置。但这并不说明不能设置预设。

除了在命令终端直接通过命令来使用Babel外，我们还可以通过配置文件来来使用。

#### 配置

配置文件有多种形式，可以根据你的需要来[选择](<https://babeljs.io/docs/en/configuration>)

我们来创建一个如下的`bable.config.js`文件：

```
const presets=[
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      }
    }
  ]
]

module.exports = { presets };
```

现在，根据这个设置，`env`只会将无法在目标浏览器中使用的特性进行转译。

我们上面只对语法进行了设置，下面来看下polyfill。

#### Polyfill

`@babel/polyfill`模块内置了`core-js`和generator生成器来实现对ES6+环境的支持。

也就是说，你可以使用包括`Promise`和`WeakMap`在内的js内置特性，还有比如静态方法`Array.from`或者`Object.assign`，实例方法`Array.prototype.includes`，以及生成器函数（通过`regenerator`插件提供）。Polyfill会将这些特性放到全局环境或者对象原型上来供我们使用。

如果你知道你用的哪些特性需要polyfill，那你可以直接从`core.js`中引用。

```
npm install --save @babel/polyfill
```

> 这地方使用`—-save`而不是`--save-dev`主要是因为polyfill要在你的源代码之前运行

上面我们用到的`env`预设有个`useBuiltIns`设置项，当设置成`usage`时，babel会将上述提到特性使用最新的polyfill来转译。

```javascript
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage"
    }
  ]
]

module.exports = { presets };

```

现在，babel会监视你的代码中用到的语言特性，如果这些特性在目标浏览器中不存在，那么babel就会用合适的polyfill来转译。比如下面的代码：

```javascript
Promise.resove().finally();
```

会被转译成下面的样子：

```javascript
require("core-js/modules/es.promise.finally");
Promise.resolve().finally();
```

如果我们不使用`env`预设的`useBuildIns`选项，我们就需要把我们需要的polyfill放在代码入口处（引用一次即可）。

#### 总结

通过`@babel/cli`我们可以在命令行使用babel，通过`@babel/polyfill`我们可以使用js的新特性。`env`预设包含了转译功能，polyfills则用来为目标浏览器增加我们需要的语言功能