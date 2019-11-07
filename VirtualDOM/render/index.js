import createElement from './createElement';
import render from './render';
import diff from './diff';
import applyPatches from './applyPatches';

/**@jsx createElement */

let dom = <div id='id'><span>span</span><div>div</div></div>
let newDOM = <div id='id'><span>123</span></div>

let patches = diff(dom, newDOM);
console.log(patches);
let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);
dom = render(dom, root);

applyPatches(dom, patches);


