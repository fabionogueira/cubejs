//operações
(function(){
    CubeJS
        .createOperation('calculatedRow', {
            init: function(instance, op){
                var i, data=instance._cube;

                for (i=0; i<data.rows.children.length; i++){
                    i=doCalcOperation(op, data.rows.children[i], data.rows.children, i);
                }
            }
        })
        .createOperation('calculatedCol', {
            init: function(instance, op){
                var i, data=instance._cube;

                for (i=0; i<data.cols.children.length; i++){
                    i=doCalcOperation(op, data.cols.children[i], data.cols.children, i);
                }
            }
        })
        .createOperation('totalCol', {
            priority: 20, //quanto maior a prioridade será executado mais para o final
            init: function(instance, op){
                var o, data=instance._cube;
                
                o = {calculated:true, type:'calculatedCol', id:op.id, label:op.label, position:op.position, value:doTotalCol};
                data.cols.children.push(o);
            }
        })
        .createOperation('totalRow', {
            priority: 20,
            init: function(instance, op){
                var o, data=instance._cube;
                
                o = {calculated:true, type:'calculatedRow', id:op.id, label:op.label, position:op.position, value:doTotalRow};
                data.rows.children.push(o);
            }
        });
    
    function doCalcOperation(op, obj, parent, index){
        var i, o;

        if (obj.id===op.reference) {

            o = {calculated:true, type:op.type, id:op.id, label:op.label, position:op.position, value:op.value};

            if (op.position==='after'){  //after
                parent.splice(++index, 0, o);
            }else{                       //before
                parent.splice(index++, 0, o);
            }
        }

        if (obj.children){
            for (i=0; i<obj.children.length; i++){
                i = doCalcOperation(op, obj.children[i], obj.children, i);
            }
        }

        return index;
    }
    function doTotalCol(y,x){
        var i, r, c, s = 0, m = arguments[3]._cube.data;
        
        r = m[y];
        
        for (i=0; i<r.length; i++){
            c = r[i];
            if (c && x!==i) s += c.value;
        }
        
        return s;
    }
    function doTotalRow(y,x){
        var i, c, s = 0, m = arguments[3]._cube.data;
        
        for (i=0; i<m.length; i++){
            c = m[i][x];
            if (c && y!==i) s += c.value;
        }
        
        return s;
    }

}());