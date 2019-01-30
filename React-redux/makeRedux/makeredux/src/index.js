import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {store} from './store';
import Provider from './Provider';

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

store.dispatch({type:'UPDATE_TITLE_TEXT', text:'what is redux'}); // 发起修改
// store.dispatch({type:'UPDATE_TITLE_COLOR', color: 'blue'}); // 发起修改
window.store = store;
store.dispatch({type:'UPDATE_TITLE_TEXT', text:'what is reaadux'}); // 发起修改
//store.dispatch({type:'UPDATE_CONTENT_TEXT', text:'redux is tool for state managering'})
//store.dispatch({type:'UPDATE_CONTENT_TEXT', text:'redux is tool for state managerment'})
serviceWorker.unregister();
