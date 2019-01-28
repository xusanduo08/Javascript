import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


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
          return {...state, title:{...state.title, color: action.color}}
        default:
          return state;
    }
}

function createStore(state, stateChanger){
    const listeners = [];
    const subscribe = listener => listeners.push(listener);
    const getState = () => state;
    const dispatch = (action) => {
        state = stateChanger(state, action)
        listeners.forEach(listener => listener());
        
    };
    return {getState, dispatch, subscribe};
}


const store = createStore(appState, stateChanger)
store.subscribe(() => ReactDOM.render(<App book={store.getState()} />, document.getElementById('root')));
ReactDOM.render(<App book={store.getState()} />, document.getElementById('root'));

store.dispatch({type:'UPDATE_TITLE_TEXT', text:'what is redux'}); // 发起修改
store.dispatch({type:'UPDATE_TITLE_COLOR', color: 'blue'}); // 发起修改
store.dispatch({type:'UPDATE_TITLE_TEXT', text:'what is reaadux'}); // 发起修改

serviceWorker.unregister();
