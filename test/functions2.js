/*
    OBS: utilizar a definição definition.vars.aggrs para montar a consulta

 **/
function ESCube(definition){
    var
        BEFORE= 1,
        AFTER = 2;

    var 
        matrix   = [],
        colsCalc = [],
        rowsCalc = [],
        colsX    = -1,
        rowsY    = -1,
        colsLevel= 0,
        rowsLevel= 0,
        colsMap  = {},
        rowsMap  = {},
        activeCol,
        activeRow;
    
//public methods:
    this.process = function(aggr){
        var 
            k, o, r, c, cells, cell, d, colDef, i, y,
            mt = [];

        for (k in definition.vars){
            o = definition.vars[k];
            if (o.position==='row'){
                if (o.level>colsX) colsX = o.level;
            }else if (o.position==='col'){
                if (o.level>rowsY) rowsY = o.level;
            }
        }

        console.log(rowsY, colsX);

        for (k in aggr){
            o = definition.vars[k];
            if (o.position==='row'){
                processRowsBuckets('', '', o, aggr[k]);
            }else if (o.position==='col'){
                processColsBuckets('', '', o, aggr[k]);
            }
        }
        
        //normalize array
        for (r=0; r<matrix.length; r++){
            mt.push([]);
            cells = matrix[r];
            for (c=0; c<cells.length; c++){
                cell = cells[c];
                if (cells===undefined) cells = null;
                mt[r].push(cell);
            }
        }
        
        //inseri linhas calculadas
        var calRows={}, deslocY=0;
        for (i=0; i<definition.calculatedRows.length; i++){
            d = definition.calculatedRows[i];
            o = rowsMap[d.reference];
            //console.log(d);
            if (o===5){
                r = mt[o.y]; //linha de referência
                y = (d.position===BEFORE) ? o.y : o.y+1;
                y+= deslocY;
                mt.splice(y, 0, []); //nova linha
                deslocY++; console.log(calRows)
                calRows[d.key] = mt[y];
                for (c=0; c<mt[0].length; c++){
                    if (c===o.x){
                        mt[y][c] = {label:d.label};
                        updateRowsMap(y, c, d.key, '$calculated');
                    }else if(r[y][c]===null){
                        mt[y][c] = null;
                    }else{
                        var vs=[];
                        //encontra os valores das variáveis
                        for (k=0; k<d.value_compiled.v.length-1; k++){
                            var keyVar = d.value_compiled.v[k];
                            var o2 = rowsMap[keyVar];
                            if (o2){
                                var vv = o2.dimension==='$calculated' ? calRows[keyVar][c].value : matrix[o2.y][c].value;
                                console.log(vv);
                                vs.push(vv);
                            }else{
                                vs.push(0);
                            }
                        }
                        
                        var vv = d.value_compiled.f.apply(null,vs);
                        mt[y][c] = {label:vv, value:vv};
                    }
                }
            }
        }
        
        matrix = mt;
        
        console.log(matrix);
        console.log(colsMap, rowsMap);
    };
    this.htmlTable = function(){
        var 
            c, i, r,
            html='<table cellpadding="4" border="1">';

        for (i=0; i<matrix.length; i++){
            r = matrix[i];
            html+='<tr>';
            for (j=0; j<r.length; j++){
                c = r[j];
                html += ('<td>' + (c ? c.label : '') + '</td>');
            }
            html+='</tr>';
        }
        html+='</table>';
        
        return html;
    };
    this.definition = function(def){
        definition = def;
    };
    this.rows = function(){};
    this.cols = function(){};
    this.measures = function(){};
    
//private methods:
    function processColsBuckets(parentKeyCol, keyRow, def, objOrString){
        var i,o,b,l,key;

        if (objOrString.buckets){
            b = objOrString.buckets;

            for (i=0,l=b.length; i<l; i++){
                key = parentKeyCol + '$' + b[i].key;

                if (colsLevel === def.level || i>0) colsX++;
                colsLevel = def.level;

                if (updateColsMap(def.level, colsX, key, def.name)) addCategoryCell(def.level, colsX, b[i].key, def);

                nextDefinition(b[i], function(d,k){
                   if (d.type==='measure'){ //métrica na coluna
                        processRowsBuckets(keyRow, key, d, k);
                        o = b[i][k];
                        addMeasureCell(activeRow.y, activeCol.x, o.value, d);
                    }else if (d.position==='row'){
                        processRowsBuckets(keyRow, key, d, b[i][k]);
                    }else if (d.position==='col'){
                        processColsBuckets(key, keyRow, d, b[i][k]);
                    } 
                });
            }
        }else{
            key = parentKeyCol + '$' + objOrString;

            if (colsMap[key]){
                activeCol = colsMap[key];
                return;
            }

            //mesmo nível, incrementa a coluna
            if (colsLevel === def.level){colsX++;}
            colsLevel = def.level;

            if (updateColsMap(def.level, colsX, key, def.name)){
                addCategoryCell(def.level, colsX, objOrString, def);
            }
        }
    }
    function processRowsBuckets(parentKeyRow, keyCol, def, objOrString){
        var i,o,b,l,key;

        if (objOrString.buckets){
            b = objOrString.buckets;

            for (i=0,l=b.length; i<l; i++){
                key = parentKeyRow + '$' + b[i].key;

                //se mesmo nível ou próxima linha, incrementa linha
                if (rowsLevel === def.level || i>0){rowsY++;}
                rowsLevel = def.level;

                //atualiza o rowsMap e matrix
                if (updateRowsMap(rowsY, def.level, key, def.name)) addCategoryCell(rowsY, def.level, b[i].key, def);

                nextDefinition(b[i], function(d,k){
                    if (d.type==='measure'){//métrica na linha
                        processColsBuckets(keyCol, key, d, k);
                        o = b[i][k];
                        addMeasureCell(activeRow.y, activeCol.x, o.value, d);
                    }else if (d.position==='row'){
                        processRowsBuckets(key, keyCol, d, b[i][k]);
                    }else if (d.position==='col'){
                        processColsBuckets(keyCol, key, d, b[i][k]);
                    }
                });
            }
        }else{
            key = parentKeyRow + '$' + objOrString;

            if (rowsMap[key]) {
                return activeRow = rowsMap[key];
            }

            //mesmo nível, incrementa linha
            if (rowsLevel === def.level){rowsY++;}
            rowsLevel = def.level;

            if (updateRowsMap(rowsY, def.level, key, def.name)){
                addCategoryCell(rowsY, def.level, objOrString, def);
            }
        }
    }
    function addCategoryCell(y, x, category, definition){
        initMatrix(y, x);
        
        if (matrix[y][x]===undefined){
            //console.info(y, x, category);

            matrix[y][x] = {
                category : category,
                colDim   : definition.position==='col' ? definition.name : null,
                rowDim   : definition.position==='row' ? definition.name : null,
                label    : category, //formatar categoria
                summary  : definition.summary || false,
                dimension: definition.name
            };
        }
    }
    function addMeasureCell(y, x, value, definition){
        initMatrix(y, x);
        
        if (matrix[y][x]===undefined) {
            //console.info(y, x, value);
            
            /*rowsCalc[y].sum += value;
            rowsCalc[y].count++;
            
            colsCalc[x].sum += value;
            colsCalc[x].count++;*/
            
            matrix[y][x] = {
                //_calc_row_sum  : rowsCalc[y].sum,
                //_calc_row_count: rowsCalc[y].count,
                //_calc_col_sum  : colsCalc[x].sum,
                //_calc_col_count: colsCalc[x].count,
                //colKey: activeCol.key,
                //rowKey: activeRow.key,
                //colDim: activeCol.dimension,
                //rowDim: activeRow.dimension,
                value : value,
                label : value //formatar valor usando definition.format
            };
        }
    }
    function updateColsMap(y, x, key, dimension){
        var
            r = false;

        if (!colsMap[key]) {
            colsMap[key] = {
                y        : y, 
                x        : x,
                key      : key,
                dimension: dimension
            };
            r = true;
        }

        activeCol = colsMap[key];
        return r;
    }
    function updateRowsMap(y, x, key, dimension){
        var
            r = false;

        if (!rowsMap[key]) {
            rowsMap[key] = {
                y        : y,
                x        : x,
                key      : key,
                dimension: dimension
            };
            r = true;
        }

        activeRow = rowsMap[key];
        return r;
    }
    function nextDefinition(bucket,cb){
        var k, d;

        for (k in bucket){
            d = definition.vars[k];
            if (d){
                cb(d,k);        
            }
        }
    }
    function initMatrix(y, x){
        if (!matrix[y]){
            matrix[y] = [];
            rowsCalc[y] = {
                sum: 0,
                count: 0
            };
        }
        
        if (!colsCalc[x]){
            colsCalc[x] = {
                sum: 0,
                count: 0
            };
        }
    }
}

var cube = new ESCube(definition);
    cube.process(result.aggregations),
    html = cube.htmlTable();
    
document.write(html);

