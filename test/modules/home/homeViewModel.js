import Vue from 'vue';
import CubeJS from '../../../src/index.js';
import ElasticAdapter from '../../../src/adapters/ElasticAdapter';

export default Vue.component('home', {
    template: require('./homeView.html'),
    mounted(){
        let definition = {
            rows: {
                'dm_natureza':{type:'dimension'}
            },
            cols: {
                'dm_upm':     {type:'dimension', index:0},
                'qtd_armas':  {type:'measure', index:1},
                'qtd_presos': {type:'measure', index:2}
            }
        };
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
        };

        // instance
        let cube = new CubeJS({
            definition: definition,
            dataAdapter: ElasticAdapter 
        });

        // set data
        cube.setData(dadosResult);
        
        // plugin html.table renderer
        // cube.plugin('html.table').renderTo(document.getElementById('chart1'));

        // plugin c3.column
        // cube.plugin('c3.column').renderTo(document.getElementById('chart2'));

        this.plotly2(cube);
    },

    methods: {           
        plotly1(){
            var data = [
                {
                    x: ['giraffes', 'orangutans', 'monkeys'],
                    y: [20, 14, 23],
                    type: 'bar'
                }
            ];
            
            window.Plotly.newPlot(document.getElementById('chart3'), data);
        },

        plotly2(cube){
            // var trace1 = {
            //     x: ['1º bpm qtd_armas', '1º bpm qtd_pessoas', '2º bpm qtd_armas', '2º bpm qtd_pessoas'],
            //     y: [0, 4, 1, 2],
            //     name: 'furto',
            //     type: 'bar'
            // };
            
            // var trace2 = {
            //     x: ['1º bpm qtd_armas', '1º bpm qtd_pessoas', '2º bpm qtd_armas', '2º bpm qtd_pessoas'],
            //     y: [2, 1, 0, 0],
            //     name: 'homicidio',
            //     type: 'bar'
            // };
            
            // var data = [trace1, trace2];
            // var layout = {barmode: 'group'};
            
            // cube.plugin('plotly.column').renderTo(document.getElementById('chart3'));
            cube.plugin('plotly.line').renderTo(document.getElementById('chart1'));

            // window.Plotly.newPlot(document.getElementById('chart3'), data, layout);
        }
    }
});
