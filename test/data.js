let definition = {
    rows: {
        'dm_natureza':{type:'dimension'}
    },
    cols: {
        'dm_upm':     {type:'dimension', index:0},
        'qtd_armas':  {type:'measure', index:1},
        'qtd_presos': {type:'measure', index:2}
    }
}

let dadosResult = {
    aggregations: {
        'dm_upm':{ // coluna
            'buckets':[
                {
                    'key': '1º bpm', // x=0,y=0
                    'doc_count': 2,
                    'dm_natureza':{ // linha
                        'buckets':[{
                            'key': 'furto', // x=0,y=0
                            'doc_count': 2,
                            'qtd_armas':{ // métrica de coluna
                                value: 0 // x=0,y=0
                            },
                            'qtd_presos':{ // métrica de coluna
                                value: 4 // x=1,y=0
                            }
                        },
                        {
                            'key': 'homicídio', // x=0,y=1
                            'doc_count': 2,
                            'qtd_armas':{ // métrica de coluna
                                value: 2 // x=0,y=1
                            },
                            'qtd_presos':{ // métrica de coluna
                                value: 1 // x=1,y=1
                            }
                        }]
                    }
                },
                {
                    'key': '2º bpm', // x=2,y=0
                    'doc_count': 2,
                    'dm_natureza':{ // linha
                        'buckets':[{
                            'key': 'furto', // x=2,y=0
                            'doc_count': 2,
                            'qtd_armas':{ // métrica de coluna
                                value: 1 // x=2,y=0
                            },
                            'qtd_presos':{ // métrica de coluna
                                value: 2 // x=3,y=0
                            }
                        }]
                    }
                }
            ]
        }
    }
}

export default {
    definition,
    dadosResult
}