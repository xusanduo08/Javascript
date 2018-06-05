/*
Redux:  createStore：创建并返回一个store
        Provider：创建容器，该容器在上下文context中加入了store变量，使得内部的子组件都能通过上下文获取store
        applymiddleware：返回一个函数，该函数先执行每个中间件到第一个return返回（即返回以next为入参的那一层），
                        然后将返回的函数一层层嵌套执行并返回最终结果，获得带有中间件功能的dispatch

*/