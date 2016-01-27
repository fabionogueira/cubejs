var dados_result = result = {
   "aggregations": {
      "ano": {                                          //linha
         "buckets": [
            {
               "key_as_string": "2013",                 
               "key": 1356998400000,
               "doc_count": 3,
               "armas": {                               //linha
                  "buckets": [
                     {
                        "key": "faca",                  
                        "doc_count": 2,
                        "upm": {                        //coluna
                           "buckets": [
                              {
                                 "key": "2º BPM",       
                                 "doc_count": 2.1         //x=0,y=0
                              }
                           ]
                        }
                     },
                     {
                        "key": "pistola",               
                        "doc_count": 2,
                        "upm": {                        //coluna
                           "buckets": [
                              {
                                 "key": "1º BPM",       
                                 "doc_count": 1.1         //x=1,y=0
                              },
                              {
                                 "key": "2º BPM",       
                                 "doc_count": 2.2         //x=0,y=1
                              }
                           ]
                        }
                     },
                     {
                        "key": "revolver",              
                        "doc_count": 1,
                        "upm": {                        //coluna
                           "buckets": [
                              {
                                 "key": "2º BPM",
                                 "doc_count": 2.3         //x=0,y=2
                              }
                           ]
                        }
                     }
                  ]
               }
            },
            {
               "key_as_string": "2014",
               "key": 1388534400000,
               "doc_count": 2,
               "armas": {
                  "buckets": [
                     {
                        "key": "faca",
                        "doc_count": 2,
                        "upm": {
                           "buckets": [
                              {
                                 "key": "1º BPM",
                                 "doc_count": 1.2
                              },
                              {
                                 "key": "2º BPM",
                                 "doc_count": 2.4
                              }
                           ]
                        }
                     },
                     {
                        "key": "pistola",
                        "doc_count": 1,
                        "upm": {
                           "buckets": [
                              {
                                 "key": "1º BPM",
                                 "doc_count": 1.3
                              }
                           ]
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
        "ano"  : {type:"dimension", level:0, position:"row", name:"ano"},
        "armas": {type:"dimension", level:1, position:"row", name:"armas"},
        "upm"  : {type:"dimension", level:0, position:"col", name:"upm"}
    }
},
dados_def = {
    rows: {
        "ano": {type:"dimension"},
        "armas": {type:"dimension"}
    },
    cols: {
        "upm" : {type:"dimension"}
    }
    
};
