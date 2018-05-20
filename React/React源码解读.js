//本质上讲，JSX只是为React.createElement(component, props, ...children)方法提供的语法糖。
/*

    <MyButton color="blue" shadowSize={2}>
        Click me
    </MyButton>
    编译为：
    React.createElement(
        MyButton,
        {color: "blue", shadowSize: 2},
        "Click me"
    )

*/