var cube = {
    dimension : "_cube_",
    categories:[
        {   category : "1º BPM", //coluna
            dimension: "upm",
            categories:[
                {   category : "2013", //linha
                    dimension: "ano",
                    categories:[
                        {   category : "furto", //linha
                            dimension: "natureza",
                            categories:[
                                {   category : "revolver", //coluna
                                    dimension: "arma.tipo",
                                    value    : 6
                                },
                                {   category : "pistola",  //coluna
                                    dimension: "arma.tipo",
                                    value    : 3
                                },
                                {   category : "faca",     //coluna
                                    dimension: "arma.tipo",
                                    value    : 1
                                }
                            ]
                        },
                        {   category : "roubo", //linha
                            dimension: "natureza",
                            categories:[
                                {   category : "revolver", //coluna
                                    dimension: "arma.tipo",
                                    value    : 3
                                },
                                {   category : "pistola", //coluna
                                    dimension: "arma.tipo",
                                    value    : 2
                                },
                                {   category : "faca",    //coluna
                                    dimension: "arma.tipo",
                                    value    : 3
                                }
                            ]
                        }
                    ]
                },
                {   category: "2014",
                    dimension: "ano",
                    categories:[
                        {   category : "furto", //linha
                            dimension: "natureza",
                            categories:[
                                {   category : "revolver", //coluna
                                    dimension: "arma.tipo",
                                    value    : 4
                                },
                                {   category : "pistola",  //coluna
                                    dimension: "arma.tipo",
                                    value    : 5
                                },
                                {   category : "faca",     //coluna
                                    dimension: "arma.tipo",
                                    value    : 3
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {   category : "2º BPM", //coluna
            dimension: "upm",
            value    : 18,
            categories:[
                {   category : "2013", //linha
                    dimension: "ano",
                    categories:[
                        {   category : "furto", //linha
                            dimension: "natureza",
                            categories:[
                                {   category : "revolver", //coluna
                                    dimension: "arma.tipo",
                                    value    : 3
                                },
                                {   category : "pistola",  //coluna
                                    dimension: "arma.tipo",
                                    value    : 1
                                },
                                {   category : "faca",     //coluna
                                    dimension: "arma.tipo",
                                    value    : 4
                                }
                            ]
                        },
                        {   category : "roubo", //linha
                            dimension: "natureza",
                            categories:[
                                {   category : "revolver", //coluna
                                    dimension: "arma.tipo",
                                    value    : 1
                                },
                                {   category : "pistola", //coluna
                                    dimension: "arma.tipo",
                                    value    : 6
                                },
                                {   category : "faca",    //coluna
                                    dimension: "arma.tipo",
                                    value    : 5
                                }
                            ]
                        }
                    ]
                },
                {   category: "2014",
                    dimension: "ano"
                }
            ]
        }
    ]
};

(function(){        
    function adapter(){
        var 
            vars = {
                "upm"     :{level:0, position:"row", type:"dimension", label:"UPM"},      "ano"      :{level:1, position:"row", type:"dimension", label:"ano"},
                "natureza":{level:0, position:"col", type:"dimension", label:"NATUREZA"}, "arma.tipo":{level:1, position:"col", type:"dimension", label:"ARMA"}
            },
            X        = 0, Y = 0,
            matrix   = [],
            colsX    = 0,
            rowsY    = 0,
            colLength= -1,
            rowLength= -1,
            colsLevel= 0,
            rowsLevel= 0,
            colsMap  = {},
            rowsMap  = {},
            dataMap  = {},
            operations = [
                "$furto$before1",
                "$furto$pistola$before1"
            ],
            operations_col_before = {
                "$furto":{
                    id   : "$furto$before1",
                    label: "TESTE",
                    value: function(key, col){
                        return col[key + "&" + "$furto$revolver"].value/2;
                    }
                },
                "$furto$pistola":{
                    id   : "$furto$pistola$before1",
                    label: "TESTE2",
                    value: function(key, col){
                        return 10;
                    }
                }
            },
            activeRowKey, activeColKey, activeCol, activeRow;

    //public methods:
        //transforma a resposta na matriz
        this.response = function(response){
            var 
                k, o, r, c, i, d, x, y, or, oc, categoryObj, xx, yy, colsCount, rowsCount,
                categories = response.categories;
            
            for (k in vars){
                o = vars[k];
                if (o.position==='row'){
                    if (o.level>colsX) colsX = o.level;
                }else if (o.position==='col'){
                    if (o.level>rowsY) rowsY = o.level;
                }
            }
            
            xx = colsX+1;
            yy = rowsY+1;
            
            /*if (_rows.length===0){
                colsX=-1;
                updateRowsMap(-1, '$measures', '$measures');
                //addCategoryCell(rowsY, def.level, b[i].key_as_string || b[i].key, def);
            }
            
            if (_cols.length===0){
                rowsY=-1;
                updateColsMap(-1, '$measures', '$measures');
            }*/
            
            X = colsX; Y=rowsY;
            //inicializa o mapa de referências colsMap e rowsMap, e cria as linhas/colunas de sumarização
            for (i=0; i<categories.length; i++){
                o = vars[categories[i].dimension];
                if (o.position==='row'){
                    processRowsCategories('', '', o, categories[i]);
                }else if (o.position==='col'){
                    processColsCategories('', '', o, categories[i]);
                }
            };
            
            //matriz linhas
            /*matrix = [];
            y = yy;
            x = -1;
            d = null;
            rowsCount = 0;
            for (k in rowsMap){
                categoryObj = rowsMap[k];
                if (d!==categoryObj.dimension){
                    if (x===xx-1){x=0;y++;}else{x++;}
                }else{
                    y++;
                }
                if (!matrix[y]) matrix[y] = [];
                matrix[y][x] = {category:categoryObj.category, key:k, rowspan:categoryObj.categories ? categoryObj.categories.length : null};
                if (y>=rowsCount) rowsCount = y+1;
                
                d = categoryObj.dimension;
            }
            
            //matriz colunas
            y = -1;
            x = xx-1;
            d = null;
            colsCount = 0;
            for (k in colsMap){
                categoryObj = colsMap[k];
                y = categoryObj.level;
                
                if (d>=categoryObj.level) x++;
                if (!matrix[y]) matrix[y] = [];
                if (x>=colsCount) colsCount = x+1;
                
                matrix[y][x] = {category:categoryObj.category, key:k, colspan:categoryObj.categories ? categoryObj.categories.length : null};
                d = categoryObj.level;
            }
            */
            //matriz dados
            function calculateData(op){
                var v;
                for (r=yy; r<rowsCount; r++){
                    for (c=xx; c<colsCount; c++){
                        //referência da linha
                        if (matrix[r][xx-1]){
                            or = matrix[r][xx-1];
                        }else{
                            or = null;
                            x  = xx-2;
                            while (!or && x>-1){or = matrix[r][x--];}
                        }

                        //referência da coluna
                        if (matrix[yy-1][c]){
                            oc = matrix[yy-1][c];
                        }else{
                            oc = null;
                            y  = yy-2;
                            while (!oc && y>-1){oc = matrix[y--][c];}
                        }

                        if (or && oc){
                            k = or.key + '&' + oc.key;
                            categoryObj = dataMap[k];
                            
                            if (categoryObj){
                                //operação
                                if (categoryObj.calculated){
                                    if (op && op===categoryObj.id){
                                        v = callCalculatedCol(or.key, categoryObj);
                                        matrix[r][c] = {value: v};
                                    }
                                }
                                //dado normal
                                else{
                                    matrix[r][c] = {value: categoryObj.value || 0};
                                }
                            }
                        }
                    }
                }
            }
            calculateData(); //dados comuns
            for (i=0; i<operations.length; i++){
                calculateData(operations[i]); //dados calculados
            }
            calculateData('summary'); //dados de sumários
            
            //normalize array
            /*for (r=0; r<matrix.length; r++){
                mt.push([]);
                cells = matrix[r] || [];
                for (c=0; c<cells.length; c++){
                    cell = cells[c];
                    if (cell===undefined) cell = 0;
                    mt[r].push(cell);
                }
            }*/
            
            console.log('cube',    cube);
            console.log('colsMap', colsMap);
            console.log('rowsMap', rowsMap);
            console.log('dataMap', dataMap);
            console.log('matrix' , matrix);
            
            //monta o html
            var rs,cs='',j,html='<pre><table cellpadding="2" cellspacing="0" border="1">';                
            for (i=0; i<matrix.length; i++){
                r = matrix[i];
                html+='<tr>';
                for (j=0; j<r.length; j++){
                    c = r[j];
                    cs = (i>yy-1 && j>xx-1) ? '' : ' style="background:rgb(232, 232, 232);font-weight:bold"';
                    //if (c){if (c.colspan) cs = ' colspan="'+ c.colspan + '"';}                    
                    html += ('<td' + cs  + '>' + (c ? (c.category || c.value) : '') + '</td>');
                }
                html+='</tr>';
            }
            html+='</table></pre>';
            
            document.write(html);
        };
        
    //private methods:
        function processColsCategories(parentKeyCol, keyRow, def, categoryObj){
            var
                i, l, d, s, c, k, categories;
            
            if (categoryObj){
                k          = parentKeyCol + '$' + categoryObj.category;
                categories = categoryObj.categories;
                
                //coluna calculada antes
//                if (operations_col_before[k]){
//                    updateColsMap(def.level, k+'1', {category:operations_col_before[k].label, dimension:'calculated', parent:def.level>0?parentKeyCol:null});
//                    updateDataMap({value:operations_col_before[k].value, calculated:true, id:operations_col_before[k].id});
//                    X++;
//                }
                
                updateColsMap(def.level, k, categoryObj);
                
                if (categories){
                    s = 0;
                    for (i=0,l=categories.length; i<l; i++){
                        d = vars[categories[i].dimension];
                        c = categories[i];
                        
                        if (d.type==='measure'){//métrica na coluna
                            if (d.position==='row'){
                                processRowsCategories(keyRow, k, d, c);
                            }else{
                                processColsCategories(k, keyRow, d, c);
                            }
                        }else if (d.position==='row'){
                            processRowsCategories(keyRow, k, d, c);
                        }else if (d.position==='col'){
                            processColsCategories(k, keyRow, d, c);
                        }
                        
                        //if (c.level>0) c.parent = k;
                        s += c.value;//sumário
                    }
                    
                    //coluna de sumário
//                    updateColsMap(def.level, k+'ÿsummary', {category:'(summary)' + categoryObj.category, dimension:'summary'});
//                    updateDataMap({value:summaryfn, sum:s, calculated:true, keySummary:k, id:'summary'});
                }else{
                    console.log(Y,X,categoryObj.value);
                    updateDataMap({value:categoryObj.value});
                }
            }
        }
        function processRowsCategories(parentKeyRow, keyCol, def, categoryObj){
            var i, l, d, c, k, categories;
            
            if (categoryObj){
                k          = parentKeyRow + '$' + categoryObj.category;
                categories = categoryObj.categories;
                
                updateRowsMap(def.level, k, categoryObj);
                
                if (categories){
                    for (i=0, l=categories.length; i<l; i++){
                        d = vars[categories[i].dimension];
                        c = categories[i];
                        
                        if (d.type==='measure'){//métrica na linha
                            if (d.position==='row'){
                                processRowsCategories(k, keyCol, d, c);
                            }else{
                                processColsCategories(keyCol, k, d, c);
                            }
                        }else if (d.position==='row'){
                            processRowsCategories(k, keyCol, d, c);
                        }else if (d.position==='col'){
                            processColsCategories(keyCol, k, d, c);
                            colsLevel=0;
                        }
                        
                        if (c.level>0) c.parent = k;
                    }
                }
            }
        }
        function updateColsMap(level, key, categoryObj){
            if (!colsMap[key]) {
                if (level<=colsLevel) {colsX++; X++;};
                
                categoryObj.level = level;
                colsMap[key] = categoryObj;
                
                if (colsX>colLength){
                    colLength = colsX;
                }
                updateMatrix(level, colsX, categoryObj);
                colsLevel = level;
            }
            
            activeColKey = key;
            activeCol = colsMap[key];
        }
        function updateRowsMap(level, key, categoryObj){
            if (!rowsMap[key]) {
                if (level<=rowsLevel) {rowsY++; Y++;}
                
                rowsMap[key] = categoryObj;
                
                if (rowsY>rowLength){
                    rowLength = rowsY;
                }
                
                updateMatrix(rowsY, level, categoryObj);
                
                rowsLevel = level;
            }
            
            activeRowKey = key;
            activeRow = rowsMap[key];
        }
        function updateDataMap(categoryObj){
            var
                key = activeRowKey + '&' + activeColKey;
                
            if (!dataMap[key]) {
                categoryObj.colLevel = activeCol.level;
                dataMap[key] = categoryObj;
            }
            
            updateMatrix(rowsY, colsX, categoryObj);
        }
        function updateMatrix(y, x, obj){
            if (!matrix[y]) matrix[y] = [];
            matrix[y][x] = obj;
        }
        
        function callCalculatedCol(keyRow, categoryObj){
            var
                fn = categoryObj.value,
                $COL = {"$furto$revolver" : 101};
            
            return fn(keyRow, dataMap, categoryObj);
        }
        function summaryfn(key, col, o){
            var
                obj = colsMap[o.keySummary];
                console.log(obj)
            return o.sum;
        }
    };
    
    var adp = new adapter();
    adp.response(cube);
}());