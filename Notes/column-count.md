#### column-count

如果你需要创建一个多列布局，可以使用`column-count`属性

```css
.container{
    column-count: 3;
}
```

`column-count`设置一个具体的数值，然后浏览器就会将内容平均分割中指定列数。`columns`属性是`column-count`和`column-width`的混合属性：

```css
.container{
    columns: 200px 3;
}
```

如果两个属性都做了声明，则会先按照`column-width`设定的宽度进行分割，如果分割出的列数超过了`column-count`设定的值，则最终只会按照`column-count`设定的值来平均分割内容区域。也就是说，最终分割出的列数最多不会超过`column-count`规定的数值。

`column-count`可以设定为`auto`或者一个整数。当设置了`column-width`值时可以将`column-count`设置为`auto`以告诉浏览器，当前内容区域的分割以`column-width`为准。当设定为一个整数时，这个整数必须大于等于0；

和`column-width`不一样的是，浏览器的宽度不会对`column-count`的分割产生影响。比如，对于一个手机屏幕，`column-count`设定了5，那么显示内容就会被分割成5块，视觉上看起来就会有些拥挤。

`column-count`可用的地方最常见的比如瀑布流，以及其他一些需要在水平方向分割内容的地方。

翻译自：https://css-tricks.com/almanac/properties/c/column-count/