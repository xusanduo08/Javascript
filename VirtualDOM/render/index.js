import createElement from './createElement';
import render from './render';

/**@jsx createElement */

let dom = <div id='id'>1234</div>
let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);
render(dom, root);
console.log(dom);

