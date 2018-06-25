// @ts-check

import CubeJS from '../src'
import table from '../src/plugins/table'
import elastic from '../src/adapters/elasticsearch'
import demo2 from './data2'

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
    definition: demo2.definition,
    // dataAdapter: elastic
})

// add operations
cube.addOperation('op1', 'totalRow', {label:'Total'})
cube.addOperation('op2', 'totalCol', {label:'Total'})

cube.setData(demo2.data)

table(cube, document.getElementById('chart'))