// @ts-check

import CubeJS from '../src'
import Axios from 'axios'

import view from './view'
import operationsElastic from './operations.elastic'
import operationsCsv from './operations.csv'

// @ts-ignore
import csvData from './data1.csv'

function elasticsearch(){
    const definition = {
        cols: [{dimension:'modelo'}, {measure:'doc_count'}],
        rows: [{dimension:'calibre'}],
        filters: [{
            type: 'list',
            dimension: 'modelo',
            value: ['PT 24/7', 'PT 24/7 PRÓ', 'PT 100', 'MD1', '94', '85 S', '87', '122.2']
        }]
    }
    
    const cube = new CubeJS(definition, 'elasticsearch')
    
    const query = cube.getQuery()
    
    Axios({
        method: 'post',
        url: 'http://localhost:3000/armas/search',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: query
    })
    .then(function (response) {
        cube.setData(response.data)
    
        operationsElastic(cube)
        view(cube)
        console.log('complete')
    })
    .catch(function (error) {
        console.log(error)
    })
}

function csv(){
    const definition = {
        cols: [
            {dimension: 'Segment'}, 
            {dimension: 'Year'},
        ],
        rows: [
            //{dimension: 'Country'}, 
            {measure: 'Sale Price'/*, prefix:'R$ '*/}, 
            {measure: 'Manufacturing Price'/*, prefix:'R$ '*/},
            {measure: 'Profit'}
        ],
        filters: []
    }
    
    CubeJS.defaults({
        precision: 0,
        thousand: '',
        decimal: ','
    })
    const cube = new CubeJS(definition, 'csv')
    
    cube.createField({
        key: 'Profit',
        expression(row){
            return row['Sale Price'] - row['Manufacturing Price']
        }
    })
    cube.setData(csvData)
    
    showOperations(operationsCsv, cube)
    renderCube(cube)

    console.log('csv test complete')
}

function showOperations(operations, cube){
    let html = ''

    operations.forEach((op, index) => {
        let i = (index<9 ? '0' : '') + (index + 1)
        let display = op.description || (op.operation + displayValue(op.dimension) + displayValue(op.position) + displayValue(op.reference) + displayValue(op.expression))
        html += `<label class="input-operation">${i} <input onchange="opCheckbox_onChange(this, ${index})" type="checkbox"> ${display}</label>`
    })

    document.getElementById('operations').innerHTML = html
    
    function displayValue(value){
        return value ? ' [' + value + ']' : ''
    }

    window['opCheckbox_onChange'] = function(checkbox, index){
        let op = operations[index]

        op._checked = checkbox.checked

        cube.clearOperations()

        operations.forEach(o => {
            if (o._checked) {
                cube.addOperation(o)
            }
        })

        renderCube(cube)
    }
}

function renderCube(cube){
    cube.applyOperations()
    view(cube)
}

csv()
