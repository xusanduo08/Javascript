# Communicate

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.2.

用来展示父子组件之间通过@Input、@Output通信的特性。



```typescript
@Input() placeholder: string= 'Input your name';
```

子组件的中输入框的占位符有默认值，也可以通过在父组件中引用子组件时指定子组件占位符的内容。



```typescript
@Output() verficate = new EventEmitter<string>();
```

子组件通过发布事件来向外界传递数据，父组件响应这个事件来获取子组件传出来的数据。