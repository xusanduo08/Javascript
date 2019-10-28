import render from './render';
import dom from './index';

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);
render(dom, document.getElementById('root'));