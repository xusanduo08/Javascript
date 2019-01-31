import createStore from './createStore';

const appState = {
    title:{
        text:'什么是redux',
        color:'red'
    },
    content:{
        text:'redux是一种状态管理工具',
        color:'blue'
    }
}

function stateChanger(state,action){
    switch (action.type){
        case 'UPDATE_TITLE_TEXT':
          return {...state, title:{...state.title, text: action.text}};
        case 'UPDATE_TITLE_COLOR':
          return {...state, title:{...state.title, color: action.color}};
        case 'UPDATE_CONTENT_TEXT':
          return {...state, content:{...state.content, text: action.text}};
        default:
          return state;
    }
}



const store = createStore(appState, stateChanger)


export {store}