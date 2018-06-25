const definition = {
    rows: {
        'combustivel': {type:'dimension'}
    }
}

const data = {
    rows: {
        level:1,
        children: [
            {
                catergory: 'gasolina',
                dimension: 'combustivel'
            },
            {
                catergory: 'diesel',
                dimension: 'combustivel'
            },
            {
                catergory: 'etanol',
                dimension: 'combustivel'
            }
        ]
    },
    cols: {
        level:1,
        children:[
            {
                id: 'doc_count',
                label: 'count',
                measure: 'doc_count'
            }
        ]
    },
    data: [
        [
            {value:1000,  id:'0', category:0, dimension:'combustivel'},
            {value:15000, id:'0', category:0, dimension:'combustivel'}, 
            {value:600,   id:'0', category:0, dimension:'combustivel'}]
    ]
}

export default {
    definition,
    data
}
