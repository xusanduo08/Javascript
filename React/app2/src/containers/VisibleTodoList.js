import {connect} from "react-redux";
import {toggleTodo} from "../actions/actions";
import TodoList from "../components/TodoList";

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
        case 'SHOW_ALL':
        default:
        return todos
    }
}

const mapStateToProps = state => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onTodoClick: id => {
            dispatch(toggleTodo(id))//这个对象通过dispatch函数与action creator以某种方式绑定在一起，而且这个对象还会通过props注入到被包装组件中
        }
    }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList)

export default VisibleTodoList