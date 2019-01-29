import React from 'react';


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

const storeContext = React.createContext({
    store: store
})

export {store, storeContext}