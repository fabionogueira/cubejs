var
    ES = {};
    
(function(es){
    //constants
    var
        BEFORE= 1,
        AFTER = 2;
        
    es.Result = function(definition){
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
                cells = matrix[r] || [];
                for (c=0; c<cells.length; c++){
                    cell = cells[c];
                    if (cells===undefined) cells = null;
                    mt[r].push(cell);
                }
            }

            matrix = mt;

            console.log(matrix);
            console.log(colsMap, rowsMap);
        };
        this.htmlTable = function(){
            var 
                c, i, r,
                html='<table cellpadding="4" cellspacing="0" border="1">';

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

    //private methods:
        function processColsBuckets(parentKeyCol, keyRow, def, objOrString){
            var i,b,l,key,childsExists;

            if (objOrString.buckets){
                b = objOrString.buckets;

                for (i=0,l=b.length; i<l; i++){
                    key = parentKeyCol + '$' + b[i].key;

                    if (colsLevel === def.level || i>0) colsX++;
                    colsLevel = def.level;

                    if (updateColsMap(def.level, colsX, key, def.name)) addCategoryCell(def.level, colsX, b[i].key_as_string || b[i].key, def);

                    childsExists = false;

                    nextDefinition(b[i], function(d,k,bk){
                        childsExists = true;
                        if (d.type==='measure'){ //métrica na coluna
                            processRowsBuckets(keyRow, key, d, k);
                            addMeasureCell(activeRow.y, activeCol.x, bk.value, d);
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
            var i,b,l,key,childsExists;

            if (objOrString.buckets){
                b = objOrString.buckets;

                for (i=0,l=b.length; i<l; i++){
                    key = parentKeyRow + '$' + b[i].key;

                    //se mesmo nível ou próxima linha, incrementa linha
                    if (rowsLevel === def.level || i>0){rowsY++;}
                    rowsLevel = def.level;

                    //atualiza o rowsMap e matrix
                    if (updateRowsMap(rowsY, def.level, key, def.name)) addCategoryCell(rowsY, def.level, b[i].key_as_string || b[i].key, def);

                    childsExists=false;

                    nextDefinition(b[i], function(d,k,bk){
                        childsExists=true;
                        if (d.type==='measure'){//métrica na linha
                            processColsBuckets(keyCol, key, d, k);
                            addMeasureCell(activeRow.y, activeCol.x, bk.value, d);
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
        function setCalculatedRows(){
            var 
                calRows={},
                deslocY=0,
                i,d,o,c,y,r,o2,keyVar,vv;

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
            var k, j, d, o,
                i=0;

            for (k in bucket){
                d = definition.vars[k];
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
                            d = definition.vars[j];
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
    
    es.Query = function(){
        var 
            service, dimensions, measures,
            _rows = [],
            _cols = [],
            map  = {},
            vars = {};

    //public methods:
        this.rows = function(rows){
            _rows = rows;
            setRowsOrCols('row', rows);
            return this;
        };
        this.cols = function(cols){
            _cols = cols;
            setRowsOrCols('col', cols);
            return this;
        };
        this.dimensions = function(dm){
            dimensions = dm;
            return this;
        };
        this.measures = function(ms){
            measures = ms;
            return this;
        };
        this.service = function(url){
            service = url;
            return this;
        };
        this.run = function(){
            var
                i, k, d, p, v, o, o1, o2, o3, o4,
                a = [],
                json={size:0};
            
            //coloca as variáveis na ordem linhas, colunas, métricas
            for (i=0; i<_cols.length; i++){
                a.push(_cols[i]);
            }
            for (i=0; i<_rows.length; i++){
                a.push(_rows[i]);
            }
            
            //cria o json ES a ser enviado
            o1 = json;            
            for (i=0; i<a.length; i++){
                p = a[i].split('.');
                v = a[i].replace('.', '_');
                k = p[0];
                d = dimensions[k];
                o2 = o1.aggs = {};
                
                if (d.nested){
                    o2['nested_'+v] = o = {
                        nested: {
                            path: k
                        },
                        aggs:{}
                    };
                    o3 = o.aggs[v] = {};
                }else{
                    o3 = o2[v] = {};
                }
                
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
                        o4 = o3.terms = {
                            field: a[i]
                        };
                        break;
                }
                
                o1 = o3;
            }
            
            console.log(json);
            
            $.ajax({
                url: service + '/_search',
                type: 'POST',
                crossDomain: true,
                dataType: 'json',
                data: JSON.stringify(json),
                success: function(response) {
                    var res = new ES.Result({vars:vars}); 
                    
                    res.process(response.aggregations);
                    document.write(res.htmlTable());
                    console.log(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            });
        };

    //private methods:
        function setRowsOrCols(position, list){
            var i, v;

            clearVars(position);

            for (i=0; i<list.length; i++){
                v = list[i].replace('.', '_');
                vars[v] = {
                    position : position,
                    level    : i,
                    type     : dimensions[ list[i].split('.')[0] ] ? 'dimension' : 'measure',
                    name     : v
                };
            }
            
            console.log(vars);
        }
        function clearVars(position){
            var i, o={};

            for (i in vars){
                if (vars[i].position !== position){
                    o[i]=vars[i];
                }
            }

            vars = o;
        }
        function createAggs(aggs){
            
        }
    };

}(ES));

var query = new ES.Query();

    query.service('http://localhost:9200/sgo/root')
         .dimensions({
            "data_ocorrencia" : {"type": "date"},
            "natureza_inicial": {"type": "string"},
            "natureza_final"  : {"type": "string"},
            "upm"             : {"type": "string"},
            "armas"   : {
                "nested": true,
                "tipo"  : {"type": "string"},
                "marca" : {"type": "string"}
            },
            "vitimas" : {
                "nome": {"type": "string"},
                "dt_nascimento": {"type": "date"}
            },
            "autores" : {
                "nome": {"type": "string"},
                "dt_nascimento": {"type": "date"}
            }
         })
         .rows(["data_ocorrencia.year", "upm"])
         .cols([ "natureza_inicial", "armas.tipo"]);
    
    query.run();
    
    //query.process(result.aggregations),
    //html = query.htmlTable();
    
//document.write(html);

