# cubejs
OLAP Cube data manipulation

<a href="http://fabionogueira.github.io/cubejs">Project page</a>

## usage
```
npm install jscube
```

```javascript
import CubeJS from 'jscube';

let definition = {
    rows: {
        'dm_dimension1': {type:'dimension'}
    },
    cols: {
        'dm_dimension2': {type:'dimension'},
        'measure1':  {type:'measure'}
    }
}

// instance
let cube = new CubeJS({
    definition: definition,
    dataAdapter: ElasticAdapter
});

// add operations
cube.addOperation('op1', 'totalRow', {label:'Total'});
cube.addOperation('op2', 'totalCol', {label:'Total'});
// cube.addOperation('op3', 'calculatedCol', {
//     label:'Custom',
//     reference: '1º bpm',
//     position: 'after',
//     expression(x, y, Functions, cubeJS){
//         let v = (Functions.CELL.apply(cubeJS, [x, '1º bpm$qtd_armas']));
//         return v * 2;
//     }

// });

// set data
cube.setData(dadosResult);

// render 
cube.plugin('html.table')
    .renderTo(document.getElementById('table'));

cube.plugin(`plotly.${type}`)
    .renderTo(document.getElementById('chart'));
```

## clone
```
git clone https://github.com/fabionogueira/cubejs jscube
cd jscube
npm start
```
