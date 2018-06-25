import Vue from 'vue';
import view from './app.html';
import './app.css';

import CubeJS from '../src/index.js';
import ElasticAdapter from '../src/adapters/ElasticAdapter';
import {CELL} from '../src/functions';
// import DATA from './data.json';

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
                label:'(qtd_armas+qtd_presos)/2',
                reference: '1º bpm',
                position: 'after',
                expression(row, col){
                    let v1 = (CELL.apply(this, [row, '1º bpm$qtd_armas']));
                    let v2 = (CELL.apply(this, [row, '1º bpm$qtd_presos']));
                    
                    return (v1 + v2) / 2;
                }
            });
            cube.addOperation('op4', 'calculatedCol', {
                label:'before+after',
                reference: '1º bpm$qtd_presos',
                position: 'before',
                expression: '$CELL($r,$c-1) + $CELL($r,$c+1)'
                // (row, col){
                //     let v1 = (CELL.apply(this, [row, col - 1]));
                //     let v2 = (CELL.apply(this, [row, col + 1]));
                    
                //     return v1 + v2;
                // }
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
