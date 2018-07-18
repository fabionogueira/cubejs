// @ts-check
import View from '../src/view'

// @ts-ignore
import css from '../src/cubejs.css'

let style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css.toString();
document.getElementsByTagName('head')[0].appendChild(style);

export default function(cube){
    View(cube, 'table')
}