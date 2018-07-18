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
        cols: [{dimension: 'Segment'}, {dimension: 'Year'}],
        rows: [{dimension: 'Country'}, {measure: 'Sale Price'}, {measure:'Manufacturing Price'}],
        filters: []
    }
    
    const cube = new CubeJS(definition, 'csv')
    
    cube.setData(csvData)
    operationsCsv(cube)
    
    view(cube)

    console.log('csv test complete')
}

csv()
