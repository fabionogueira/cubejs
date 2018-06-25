var
    startLin = 2,
    startCol = 1,
    matrix = [];
    
function process(aggr, lin, col){
    var i;
    
    for (i in aggr){
        if (definition.rows[i]){
            rowProcessLevel(aggr[i].buckets, lin, definition.rows[i].level);
        }else if (definition.cols[i]){
            colProcessLevel(aggr[i].buckets);
        }
    }
}

var rowsY=2, rowsLevel=-1;
function rowProcessLevel(buckets){
    var i,k,l,o,d;
    
    rowsLevel++;
    
    for (i=0, l=buckets.length; i<l; i++){
        o = buckets[i];
        console.warn(rowsY, rowsLevel, o.key);
        
        for (k in o){
            if (definition.rows[k]){
                rowsY++;
                d = o[k];
            }else if (definition.cols[k]){
                d = o[k];
                colProcessLevel(d.buckets || {key:k, value:d.value});
            }
        }
    }
    
    rowsLevel--;
}

var colsX=1, colsLevel=-1;
function colProcessLevel(buckets){
    var i,k,l,o,d;
    
    colsLevel++;
    
    if (buckets.key){
        console.log(colsLevel, colsX, buckets.key);
        console.log(colsLevel+1, colsX, buckets.value);
        colsLevel--;
        colsX++;
        return;
    }
    
    for (i=0, l=buckets.length; i<l; i++){
        o = buckets[i];
        console.info(colsLevel, colsX, o.key);
        for (k in o){
            if (definition.rows[k]){
                d = o[k];
                if (d.buckets){
                    rowProcessLevel(d.buckets);
                }else{//último nível
                    console.info(k);
                    console.info(d.value);
                }
            }else if (definition.cols[k]){
                colsX++;
                d = o[k];
                if (d.buckets){
                    //processCol(d.buckets, definition.cols[k].level, col);
                }else{//último nível
                    console.info(k);
                    console.info(d.value);
                }
            }
        }
    }
    
    colsLevel--;
    colsX++;
}

function processColChildren(buckets, x, y){
    
}

process(result.aggregations, 2, 1);



