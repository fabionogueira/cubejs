var dados_result = result = {
    aggregations: {
        "dm_upm":{                                      //coluna
            "buckets":[
                {
                    "key": "1º bpm",                    //x=0,y=0
                    "doc_count": 2,
                    "dm_natureza":{                     //linha
                        "buckets":[{
                            "key": "furto",             //x=0,y=0
                            "doc_count": 2,
                            "qtd_armas":{               //métrica de coluna
                                value: 0                //x=0,y=0
                            },
                            "qtd_presos":{              //métrica de coluna
                                value: 4                //x=1,y=0
                            }
                        },
                        {
                            "key": "homicídio",         //x=0,y=1
                            "doc_count": 2,
                            "qtd_armas":{               //métrica de coluna
                                value: 2                //x=0,y=1
                            },
                            "qtd_presos":{              //métrica de coluna
                                value: 1                //x=1,y=1
                            }
                        }]
                    }
                },
                {
                    "key": "2º bpm",                    //x=2,y=0
                    "doc_count": 2,
                    "dm_natureza":{                     //linha
                        "buckets":[{
                            "key": "furto",             //x=2,y=0
                            "doc_count": 2,
                            "qtd_armas":{               //métrica de coluna
                                value: 1                //x=2,y=0
                            },
                            "qtd_presos":{              //métrica de coluna
                                value: 2                //x=3,y=0
                            }
                        }]
                    }
                }
            ]
        }
    }
};
var cols = {
    levels : 2,
    children:[
        {id:'1º bpm', label:'1º bpm', category:'1º bpm', dimension:'dm_upm', children:[
            {id:'1º bpm.qtd_armas',  label:null, category:null, measure:'qtd_armas'},
            {id:'1º bpm.qtd_presos', label:null, category:null, measure:'qtd_presos'}
        ]},
        {id:'2º bpm', label:'1º bpm', category:'1º bpm', dimension:'dm_upm', children:[
            {id:'2º bpm.qtd_armas',  label:null, category:null, measure:'qtd_armas'},
            {id:'2º bpm.qtd_presos', label:null, category:null, measure:'qtd_presos'}
        ]}
    ]
}, rows = {
    levels: 1,
    children:[
        {id:'furto', label:'furto', category:'furto', dimension:'dm_natureza'},
        {id:'homicidio', label:'homicidio', category:'homicidio', dimension:'dm_natureza'}
    ]
};
        
definition = {
    vars:{
        "dm_upm":     {type:"dimension", level:0, position:"col", name:"dm_upm"},
        "dm_natureza":{type:"dimension", level:0, position:"row", name:"dm_natureza"},
        "qtd_armas":  {type:"measure",   level:1, position:"col", name:"qtd_armas", aggs:"sum"},
        "qtd_presos": {type:"measure",   level:1, position:"col", name:"qtd_presos", aggs:"sum"}
    },
    query:{
        
    }
};

dados_def = {
    rows: {
        "dm_natureza":{type:"dimension"}
    },
    cols: {
        "dm_upm":     {type:"dimension"},
        "qtd_armas":  {type:"measure"},
        "qtd_presos": {type:"measure"}
    }
    
};

