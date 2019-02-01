// @ts-check

//import Axios from 'axios'

//import view from './view'
//import operationsElastic from './operations.elastic'
//import operationsCsv from './operations.csv'

describe("Testes", function(){
    it("csvTest", csvTest)
})

function csvTest(){
    // @ts-ignore
    const csvData = require('./data1.csv')
    const CubeJS = require('../src')
    const csvAdapter = require('../src/adapters/csv')

    let cube, definition, data

    CubeJS.defaults({
        precision: 0,
        thousand: '',
        decimal: ','
    })

    data = csvAdapter.toDataset(csvData)
    definition = {
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
    
    cube = new CubeJS(definition)
    
    cube.createField({
        key: 'Profit',
        expression(row){
            return row['Sale Price'] - row['Manufacturing Price']
        }
    })
    cube.setDataset(data)
    
    //showOperations(operationsCsv, cube)
    //renderCube(cube)
}
