/**
 * JSCube elasticsearch adapter
 */
(function(){
    //constants
    var
        BEFORE= 1,
        AFTER = 2;
        
    function adapter(vars){
        var 
            _cols = [],
            _rows = [],
            matrix   = [],
            colsCalc = [],
            rowsCalc = [],
            colsX    = 0,
            rowsY    = 0,
            colLength= -1,
            rowLength= -1,
            colsLevel= 0,
            rowsLevel= 0,
            colsMap  = {},
            rowsMap  = {},
            activeCol,
            activeRow;

    //public methods:
        //transforma a resposta na matriz
        this.response = function(response){
            var 
                k, o, r, c, cells, cell,
                aggr = response.aggregations,
                mt = [];

            for (k in vars){
                o = vars[k];
                if (o.position==='row'){
                    if (o.level>colsX) colsX = o.level;
                }else if (o.position==='col'){
                    if (o.level>rowsY) rowsY = o.level;
                }
            }
            
            if (_rows.length===0){
                colsX=-1;
                updateRowsMap(-1, '$measures', '$measures');
                //addCategoryCell(rowsY, def.level, b[i].key_as_string || b[i].key, def);
            }
            
            if (_cols.length===0){
                rowsY=-1;
                updateColsMap(-1, '$measures', '$measures');
            }
            
            for (k in aggr){
                o = vars[k];
                if (o.position==='row'){
                    processRowsBuckets('', '', o, aggr[k]);
                }else if (o.position==='col'){
                    processColsBuckets('', '', o, aggr[k]);
                }
            };
            
            //normalize array
            for (r=0; r<matrix.length; r++){
                mt.push([]);
                cells = matrix[r] || [];
                for (c=0; c<cells.length; c++){
                    cell = cells[c];
                    if (cell===undefined) cell = null;
                    mt[r].push(cell);
                }
            }
            
            console.log({
                matrix : mt,          //matriz[][]
                colsMap: colsMap,     //Object[key] = {dimension:'', key:'', parentKey:'', summary:0, x:0. y:0}
                rowsMap: rowsMap,     //Object[key] = {dimension:'', key:'', parentKey:'', summary:0, x:0. y:0}
                rows   : rowLength+1, //Quantidade de linhas da matriz
                cols   : colLength+1  //Quantidade de comulas da matriz
            });
            
            console.log(mt);
            //formato obrigatório
            return {
                matrix : mt,          //matriz[][]
                colsMap: colsMap,     //Object[key] = {dimension:'', key:'', parentKey:'', summary:0, x:0. y:0}
                rowsMap: rowsMap,     //Object[key] = {dimension:'', key:'', parentKey:'', summary:0, x:0. y:0}
                rows   : rowLength+1, //Quantidade de linhas da matriz
                cols   : colLength+1  //Quantidade de comulas da matriz
            };
        };
        //prepara o json de envio
        this.request = function(options){
            var
                i, k, d, p, v, o, o1, o2, o3, o4,
                a = [],
                b = [],
                c = [],
                json={size:0};
            
            _cols = options.cols;
            _rows = options.rows;
            
            //coloca as variáveis na ordem linhas, colunas, métricas
            for (i=0; i<options.cols.length; i++){
                a.push(options.cols[i]);
            }
            for (i=0; i<options.rows.length; i++){
                a.push(options.rows[i]);
            }
            
            function itemAggs(aggsObj, name){
                var
                    p, v, k, d, o2, o3, o4;
                    
                p = name.split('.');
                v = name.replace('.', '_');
                k = p[0];
                d = options.dimensions[k];
                o2= aggsObj.aggs = {};
                o3= o2[v] = {};
                    
                switch (d.type){
                    case 'date':
                        o4 = o3.date_histogram = {
                            field: k
                        };
                        switch (p[1]){
                            case 'year':
                                o4.interval = 'year';
                                o4.format = 'yyy';
                                break
                        }
                        break;

                    default:
                        o3.terms = {
                            field: a[i]
                        };
                        break;
                }
                
                return o3;
            }
            
            //cria o json ES a ser enviado
            o1 = json;            
            for (i=0; i<a.length; i++){
                k = a[i].split('.')[0];
                d = options.dimensions[k];
                
                if (d){
                    if (d.nested){ //nested fica no final
                        b.push(a[i]);
                    }else{
                        o1 = itemAggs(o1, a[i]);
                    }
                }else{
                    d = options.measures[k];
                    if (d){ //métricas ficam no final
                        c.push(k);
                    }
                }
            }
            
            //adiciona o nested
            for (i=0; i<b.length; i++){
                p = b[i].split('.');
                v = b[i].replace('.', '_');
                k = p[0];
                d = options.dimensions[k];
                o2 = o1.aggs = {};
                o3 = o2[v] = {};
                
                //tipos nested devem ficar no final
                o2[v] = o = {
                    nested: {
                        path: k
                    },
                    aggs:{}
                };
                o3 = o.aggs[v] = {};
                o3.terms = {
                    field: b[i]
                };
            }
            
            //adiciona as métricas
            if (c.length>0){
                o2 = o1.aggs = {};
                for (i=0; i<c.length; i++){
                    d = vars[c[i]];
                    o3 = o2[c[i]] = {};
                    o3[d.aggs] = {
                        field: c[i]
                    };
                }
            }
            
            return {
                url : '/_search',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(json)
            };
        };
        
    //private methods:
        function processColsBuckets(parentKeyCol, keyRow, def, objOrString){
            var i,b,l,key,childsExists;
            
            if (def.nested){
                objOrString = objOrString[def.name];
            }
            
            if (objOrString.buckets){
                b = objOrString.buckets;

                for (i=0,l=b.length; i<l; i++){
                    key = parentKeyCol + '$' + b[i].key;
                    
                    if (updateColsMap(def.level, key, def.name, parentKeyCol)){
                        addCategoryCell(def.level, colsX, b[i].key_as_string || b[i].key, def, key);
                    }
                    
                    childsExists = false;

                    nextDefinition(b[i], function(d,k,bk){
                        childsExists = true;
                        if (d.type==='measure'){//métrica na coluna
                            if (d.position==='row'){
                                processRowsBuckets(keyRow, key, d, k);
                            }else{
                                processColsBuckets(key, keyRow, d, k);
                            }
                            addMeasureCell(activeRow.y, activeCol.x, bk.value);
                        }else if (d.position==='row'){
                            processRowsBuckets(keyRow, key, d, bk);
                            rowsLevel=0;
                        }else if (d.position==='col'){
                            processColsBuckets(key, keyRow, d, bk);
                        } 
                    });

                    if (!childsExists){
                        addMeasureCell(activeRow.y, activeCol.x, b[i].doc_count);
                    }
                }
            }else{
                key = parentKeyCol + '$' + objOrString;
                if (colsMap[key]){
                    activeCol = colsMap[key];
                }else if (updateColsMap(def.level, key, def.name, parentKeyCol)){
                    addCategoryCell(def.level, colsX, objOrString, def, key);
                }
            }
        }
        function processRowsBuckets(parentKeyRow, keyCol, def, objOrString){
            var i,b,l,key,childsExists;
            
            if (def.nested){
                objOrString = objOrString[def.name];
            }
            
            if (objOrString.buckets){
                b = objOrString.buckets;

                for (i=0,l=b.length; i<l; i++){
                    key = parentKeyRow + '$' + b[i].key;

                    //atualiza o rowsMap e matrix
                    if (updateRowsMap(def.level, key, def.name, parentKeyRow)) {
                        addCategoryCell(rowsY, def.level, b[i].key_as_string || b[i].key, def, key);
                    }
                    
                    childsExists=false;

                    nextDefinition(b[i], function(d,k,bk){
                        childsExists=true;
                        if (d.type==='measure'){//métrica na linha
                            if (d.position==='row'){
                                processRowsBuckets(key, keyCol, d, k);
                            }else{
                                processColsBuckets(keyCol, key, d, k);
                            }
                            addMeasureCell(activeRow.y, activeCol.x, bk.value);
                        }else if (d.position==='row'){
                            processRowsBuckets(key, keyCol, d, bk);
                        }else if (d.position==='col'){
                            processColsBuckets(keyCol, key, d, bk);
                            colsLevel=0;
                        }
                    });

                    if (!childsExists){
                        addMeasureCell(activeRow.y, activeCol.x, b[i].doc_count);
                    }
                }
            }else{
                key = parentKeyRow + '$' + objOrString;
                if (rowsMap[key]) {
                    activeRow = rowsMap[key];
                }else if (updateRowsMap(def.level, key, def.name, parentKeyRow)){
                    addCategoryCell(rowsY, def.level, objOrString, def, key);
                }
            }
        }
        function setCalculatedRows(){
            var 
                calRows={},
                deslocY=0,
                i,d,o,c,y,r,o2,keyVar,vv;

            for (i=0; i<definition.calculatedRows.length; i++){
                d = definition.calculatedRows[i];
                o = rowsMap[d.reference];
                
                if (o===5){
                    r = mt[o.y]; //linha de referência
                    y = (d.position===BEFORE) ? o.y : o.y+1;
                    y+= deslocY;
                    mt.splice(y, 0, []); //nova linha
                    deslocY++; 
                    calRows[d.key] = mt[y];
                    for (c=0; c<mt[0].length; c++){
                        if (c===o.x){
                            mt[y][c] = {label:d.label};
                            updateRowsMap(c, d.key, '$calculated');
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
        }
        function addCategoryCell(y, x, category, definition, key){
            initMatrix(y, x);

            if (matrix[y][x]===undefined){
                //console.info(y, x, category);

                matrix[y][x] = {
                    category : category,
                    colDim   : definition.position==='col' ? definition.name : null,
                    rowDim   : definition.position==='row' ? definition.name : null,
                    label    : category, //formatar categoria
                    summary  : definition.summary || false,
                    dimension: definition.name,
                    key      : key
                };
            }
        }
        function addMeasureCell(y, x, value, definition){
            var
                o;
                
            initMatrix(y, x);
            
            if (matrix[y][x]===undefined){
                if (value){
                    matrix[y][x] = {
                        value : value,
                        label : value //formatar valor usando definition.format
                    };

                    //atualiza o sumário da linha e coluna
                    activeRow.summary += value;
                    activeCol.summary += value;
                    
                    //atualiza os sumários do pai, avô, ...
                    o = activeRow;
                    while (o.parentKey){
                        rowsMap[o.parentKey].summary += value;
                        o=rowsMap[o.parentKey];
                    }
                    o = activeCol;
                    while (o.parentKey){
                        colsMap[o.parentKey].summary += value;
                        o=colsMap[o.parentKey];
                    }
                }
            }
        }
        function updateColsMap(level, key, dimension, parentKey){
            var
                r = false;

            if (!colsMap[key]) {
                if (level<=colsLevel) colsX++;
                
                colsMap[key] = colsMap[colsX] = {
                    y        : level, 
                    x        : colsX,
                    key      : key,
                    dimension: dimension,
                    summary  : 0,
                    parentKey: parentKey
                };
                
                if (colsX>colLength){
                    colLength = colsX;
                }
                
                colsLevel = level;
                r = true;
            }

            activeCol = colsMap[key];
            return r;
        }
        function updateRowsMap(level, key, dimension, parentKey){
            var
                r = false;

            if (!rowsMap[key]) {
                if (level<=rowsLevel) rowsY++;
                
                rowsMap[key] = rowsMap[rowsY] = {
                    y        : rowsY,
                    x        : level,
                    key      : key,
                    dimension: dimension,
                    summary  : 0,
                    parentKey: parentKey
                };
                
                if (rowsY>rowLength){
                    rowLength = rowsY;
                }
                
                rowsLevel = level;
                r = true;
            }

            activeRow = rowsMap[key];
            return r;
        }
        function updateSummaryRow(parentKey){
            var
                m = rowsMap[parentKey];
            
            if (m){
                m.summary += activeRow.summary;
            }
        }
        function nextDefinition(bucket,cb){
            var k, j, d, o,
                i=0;

            for (k in bucket){
                d = vars[k];
                if (d){
                    i++;
                    cb(d,k,bucket[k]);        
                }
            }
            
            if (i===0){
                for (k in bucket){
                    o = bucket[k];
                    if (k!=='buckets' && typeof(o)==='object'){
                        for (j in o){
                            d = vars[j];
                            if (d){
                                cb(d,j,o[j]);
                            }
                        }
                        break;
                    }
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
    };
    
    var ad = new adapter(definition.vars);
    var m = ad.response(result);
    console.log(m);
}());

