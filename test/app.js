import Vue from 'vue';
import view from './app.html';
import './app.css';

import CubeJS from '../src/index.js';
import ElasticAdapter from '../src/adapters/ElasticAdapter';

export default Vue.component('app', {
    template: view,
    methods:{
        setChart(type){
            let definition, dadosResult;
            
            // eslint-disable-next-line
            eval('definition=' + this.$refs.definition.value);

            // eslint-disable-next-line
            eval('dadosResult=' + this.$refs.result.value);

            // instance
            let cube = new CubeJS({
                definition: definition,
                dataAdapter: ElasticAdapter 
            });
            
            cube.addOperation('op1', 'totalRow', {label:'Total'});
            cube.addOperation('op2', 'totalCol', {label:'Total'});
            cube.addOperation('op3', 'calculatedCol', {
                label:'Custom',
                reference: '1º bpm',
                position: 'after',
                expression(x, y, Functions, cubeJS){
                    let v = (Functions.CELL.apply(cubeJS, [x, '1º bpm$qtd_armas']));
                    return v * 2;
                }

            });

            // set data
            cube.setData(dadosResult);

            cube.plugin('html.table')
                .renderTo(document.getElementById('table'));

            cube.plugin(`plotly.${type}`)
                .renderTo(document.getElementById('chart'));
            
        }
    }
});
