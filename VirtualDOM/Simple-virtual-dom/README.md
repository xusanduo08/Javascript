研究diff算法

@babel/plugin-transform-react-jsx   将JSX转译成JS对象
https://babeljs.io/docs/en/babel-plugin-transform-react-jsx

mode:'development'  告知webpack当前是开发环境，此时默认代码不会压缩

HtmlWebpackPlugin  打包后自动生成一个HTML5文件

生成Virtual DOM

对同层级的节点进行diff

对同层级的节点按照索引一个个去比较

节点的变更有这么几种：
* 属性变更 ---- 更新属性
* 节点类型变更 ---- 删除节点，创建新的节点
* 文本节点内容变更 ---- 更新节点内容

将比较结果实施