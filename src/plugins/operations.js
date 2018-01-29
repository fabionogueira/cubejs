// operações

import CubeJS from '../CubeJS';

function doCalcOperation(op, obj, parent, index){
    let i, o;

    if (obj.id == op.reference) {

        o = {
            calculated: true, 
            type: op.type, 
            id: op.id, 
            label: op.label, 
            position: op.position, 
            value:op.value
        };

        if (op.position == 'after'){ // after
            parent.splice(++index, 0, o);
        } else { // before
            parent.splice(index++, 0, o);
        }
    }

    if (obj.children){
        for (i = 0; i < obj.children.length; i++){
            i = doCalcOperation(op, obj.children[i], obj.children, i);
        }
    }

    return index;
}
function doTotalCol(y, x){
    let i, r, c;
    let s = 0;
    let m = arguments[3]._data.data;
    
    r = m[y];
    
    for (i = 0; i < r.length; i++){
        c = r[i];
        if (c && x !== i) s += c.value;
    }
    
    return s;
}
function doTotalRow(y, x){
    let i, c;
    let s = 0;
    let m = arguments[3]._data.data;
    
    for (i = 0; i < m.length; i++){
        c = m[i][x];
        if (c && y != i) s += c.value;
    }
    
    return s;
}

CubeJS
    .createOperation('calculatedRow', {
        init(instance, op){
            let i;
            let data = instance.getData();

            for (i = 0; i < data.rows.children.length; i++){
                i = doCalcOperation(op, data.rows.children[i], data.rows.children, i);
            }
        }
    })
    .createOperation('calculatedCol', {
        init(cubeJs, op){
            let i;
            let data = cubeJs.getData();

            for (i = 0; i < data.cols.children.length; i++){
                i = doCalcOperation(op, data.cols.children[i], data.cols.children, i);
            }
        }
    })
    .createOperation('totalCol', {
        priority: 20, // quanto maior a prioridade será executado mais para o final
        init: function(cubeJs, op){
            let o;
            let data = cubeJs.getData();
            
            o = {
                calculated: true, 
                type: 'calculatedCol', 
                id: op.id, 
                label: op.label, 
                position: op.position, 
                value: doTotalCol, 
                summary: true
            };

            data.cols.children.push(o);
        }
    })
    .createOperation('totalRow', {
        priority: 20,
        init(cubeJs, op){
            let o;
            let data = cubeJs.getData();
            
            o = {
                calculated: true, 
                type: 'calculatedRow', 
                id: op.id, 
                label: op.label, 
                position: op.position, 
                value: doTotalRow, 
                summary: true
            };

            data.rows.children.push(o);
        }
    });
