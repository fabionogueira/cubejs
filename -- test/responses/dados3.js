var dados_result = result = {
    "aggregations": {
        "dm_upm": {
            "buckets": [{
                    "key": "1º BPM",
                    "doc_count": 2,
                    "dm_natureza_inicial": {
                        "buckets": [{
                                "key": "furto",
                                "doc_count": 1,
                                "qtd_armas": {
                                    "value": 0
                                }
                            },
                            {
                                "key": "homicídio",
                                "doc_count": 1,
                                "qtd_armas": {
                                    "value": 2
                                }
                            }
                        ]
                    }
                },
                {
                    "key": "2º BPM",
                    "doc_count": 1,
                    "dm_natureza_inicial": {
                        "buckets": [{
                                "key": "furto",
                                "doc_count": 1,
                                "qtd_armas": {
                                    "value": 1
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
        "dm_upm"             : {type:"dimension", level:0, position:"row", name:"dm_upm"},
        "dm_natureza_inicial": {type:"dimension", level:1, position:"row", name:"dm_natureza_inicial"},        
        "qtd_armas"          : {type:"measure",   level:0, position:"col", name:"qtd_armas"}        
    },
    query:{
        
    }
},
dados_def = {
    rows: {
        "dm_upm": {type:"dimension"},
        "dm_natureza_inicial": {type:"dimension"}
    },
    cols: {
        "qtd_armas" : {type:"measure"}
    }
    
};