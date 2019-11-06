import createElement from './createElement';
import render from './render';
import diff from './diff';

/**@jsx createElement */

let dom = <div id='id'>1234</div>
let newDOM = <div id='id'><span></span></div>
console.log(diff(dom, newDOM));
let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);
render(dom, root);


