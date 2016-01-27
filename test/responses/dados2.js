var dados_result = result = {
    "aggregations": {
        "dm_upm": {                                     //coluna
            "buckets": [{
                    "key": "1º BPM",                    //x=0,y=0
                    "doc_count": 2,
                    "dm_natureza_inicial": {            //coluna
                        "buckets": [{
                                "key": "furto",         //x=0,y=0
                                "doc_count": 1,
                                "qtd_armas": {          //métrica de linha
                                    "value": 0          //x=0,y=0
                                }
                            },
                            {
                                "key": "homicídio",     //x=1,y=0
                                "doc_count": 1,
                                "qtd_armas": {          //linha
                                    "value": 2          //x=1,y=0
                                }
                            }
                        ]
                    }
                },
                {
                    "key": "2º BPM",                    //x=2,y=0
                    "doc_count": 1,
                    "dm_natureza_inicial": {            //coluna
                        "buckets": [{
                                "key": "furto",         //x=2,y=0
                                "doc_count": 1,
                                "qtd_armas": {          //métrica de linha
                                    "value": 1          //x=2,y=0
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
},
definition = {
    vars:{
        "dm_upm"             : {type:"dimension", level:0, position:"col", name:"dm_upm"},
        "dm_natureza_inicial": {type:"dimension", level:1, position:"col", name:"dm_natureza_inicial"},        
        "qtd_armas"          : {type:"measure",   level:0, position:"row", name:"qtd_armas"}        
    },
    calculatedRows:[
        {reference:"$qtd_armas", key:"$CR1", position:1, label:"metade", value:"{{qtd_armas}}/2"},
        {reference:"$qtd_armas", key:"$CR2", position:2, label:"soma", value:"{{qtd_armas}}+{{CR1}}"}
    ],
    query:{
        
    }
},
dados_def = {
    rows: {
        "qtd_armas": {type:"measure"}
    },
    cols: {
        "dm_upm"             : {type:"dimension"},
        "dm_natureza_inicial": {type:"dimension"}
    }
    
};
