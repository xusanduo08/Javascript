自从版本7之后，Babel下发布的所有模块包都以`@babel`为开头，这种模块设计使得自定义工具变得很方便。下面看一下`@babel/core`和`@babel/cli`两个包。

#### `@babel/core`

Babel的主要功能都来自于`@babel/core`，可以通过一下方式安装：

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

编译器以插件的形式存在，它们本质是js代码，能够指导Babel去转译我们的代码。