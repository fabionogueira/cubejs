
//converte o cubo de es para cubejs
(function(){
    
    CubeJS.plugin('es', function(){
        this.definition = function(definition){
            this._definition = definition;
            return this.cube(this._cube);
        };
        this.cube = function(cube){
            if (arguments.length===0) {
                return this._cube;
            }
            
            if (cube && this._definition && !cube.__es__){
                this._cube = transform(this._definition, cube.aggregations);
                cube.__es__= true;
            }
            
            return this;
        };
        this.query = function(){
            if (this._definition){
                return '';// query(this._definition);
            }
        };
    });
    
    function getLevel(def){
        var i,j=0,q=0;
        for (i in def){
            if (def[i].type!=='measure') q++;
            else j=1;
        }
        return q+j;
    }
    function transform(definition, agg){
        var cube, mapCols={}, mapRows={}, i, x=0,y=0;
        
        cube = {
            cols:{
                levels: getLevel(definition.cols)
            },
            rows:{
                levels: getLevel(definition.rows)
            },
            data:[]
        };
        cube.data.collength = 0;
        
        //define se a raiz é linha ou coluna
        for (i in agg){
            (definition.cols[i] ? processColBucket : processRowBucket)(i, agg[i], '', cube.cols, cube.rows);
            break;
        }
        
        function processColBucket(bucketKey, bucket, parentKey, parentObjCol, parentObjRow){
            var i, j, k, b, e, buckets, child;
            
            parentObjCol.children = parentObjCol.children || [];
            buckets = bucket.buckets;
            
            for (i=0; i<buckets.length; i++){
                e = false;
                b = buckets[i];
                k = parentKey+b.key;
                child = createColItem(parentObjCol.children, {id:k, label:b.key_as_string||b.key, category:b.key, dimension:bucketKey});
                
                for (j in b){
                    if (definition.cols[j]){
                        e = true;
                        if (definition.cols[j].type==='measure' || !b[j].buckets){
                            //métrica de coluna
                            processMeasureBucketCol(j, b[j], child, mapCols[k].x);
                        }else{
                            //dimensão de coluna
                            processColBucket(j, b[j], k+'$', child, parentObjRow);
                        }
                    }else if (definition.rows[j]){
                        e = true;
                        if (definition.rows[j].type==='measure' || !b[j].buckets){
                            //métrica de linha
                            processMeasureBucketRow(j, b[j], parentObjRow, mapCols[k].x);
                        }else{
                            //dimensão de linha
                            processRowBucket(j, b[j], '', child, parentObjRow);
                        }
                    }
                }
                
                if (!e){
                    //métrica no data
                    processDataBucket(b, mapCols[k].x, mapRows[parentObjRow.id].y);
                }
            }
        }
        function processRowBucket(bucketKey, bucket, parentKey, parentObjCol, parentObjRow){
            var i, j, k, b, e, buckets, child;
            
            parentObjRow.children = parentObjRow.children || [];
            buckets = bucket.buckets;
            
            for (i=0; i<buckets.length; i++){
                e = false;
                b = buckets[i];
                k = parentKey+b.key;
                child = createRowItem(parentObjRow.children, {id:k, label:b.key_as_string||b.key, category:b.key, dimension:bucketKey});
                
                for (j in b){
                    if (definition.cols[j]){
                        e = true;
                        if (definition.cols[j].type==='measure' || !b[j].buckets){
                            //métrica de coluna
                            processMeasureBucketCol(j, b[j], parentObjCol, mapRows[k].y);
                        }else{
                            //dimensão de coluna
                            processColBucket(j, b[j], '', parentObjCol, child);
                        }
                    }else if (definition.rows[j]){
                        e = true;
                        if (definition.rows[j].type==='measure' || !b[j].buckets){
                            //métrica de linha
                            processMeasureBucketRow(j, b[j], child, mapCols[parentObjCol.id].x);
                        }else{
                            //dimensão de linha
                            processRowBucket(j, b[j], k+'$', parentObjCol, child);
                        }
                    }
                }
                
                if (!e){
                    //métrica no data
                    processDataBucket(b, mapCols[parentObjCol.id].x, mapRows[k].y);
                }
            }
        }
        function processMeasureBucketCol(bucketKey, bucket, parentObj, y){
            var child, x, k;
            
            parentObj.children = parentObj.children || [];
            k = (parentObj.id?parentObj.id+'$':'')+bucketKey;
            child = createColItem(parentObj.children, {id:k, label:bucketKey, measure:bucketKey});
            
            x = mapCols[k].x;
            
            cube.data[y] = cube.data[y]||[];
            cube.data[y][x] = {value:bucket.value};
            
            if (cube.data.collength<cube.data[y].length) cube.data.collength = cube.data[y].length;
        }
        function processMeasureBucketRow(bucketKey, bucket, parentObj, x){
            var child, y, k;
            
            parentObj.children = parentObj.children || [];
            k = (parentObj.id?parentObj.id+'$':'')+bucketKey;
            child = createRowItem(parentObj.children, {id:k, label:bucketKey, measure:bucketKey});
            
            y = mapRows[k].y;
            
            cube.data[y] = cube.data[y]||[];
            cube.data[y][x] = {value:bucket.value};
            
            if (cube.data.collength<cube.data[y].length) cube.data.collength = cube.data[y].length;
        }
        function processDataBucket(bucket, x, y){
            cube.data[y] = cube.data[y]||[];
            cube.data[y][x] = {value:bucket.doc_count};
            if (cube.data.collength<cube.data[y].length) cube.data.collength = cube.data[y].length;
        }
        function createColItem(children, item){
            if (!mapCols[item.id]) {
                children.push(item);
                if (children.length>1)x++;
                mapCols[item.id] = {
                    item: item,
                    x:x
                };
                cube.data.collength = x;
            }
            
            return mapCols[item.id].item;
        }
        function createRowItem(children, item){
            if (!mapRows[item.id]) {
                children.push(item);
                if (children.length>1)y++;
                mapRows[item.id] = {
                    item: item,
                    y:y
                };                
            }
            
            return mapRows[item.id].item;
        }
        //console.log(mapCols); console.log(mapRows);
        return cube;
    }
    
}());

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
                
                o = {calculated:true, type:'calculatedCol', id:op.id, label:op.label, position:op.position, value:doTotalCol, summary:true};
                data.cols.children.push(o);
            }
        })
        .createOperation('totalRow', {
            priority: 20,
            init: function(instance, op){
                var o, data=instance._cube;
                
                o = {calculated:true, type:'calculatedRow', id:op.id, label:op.label, position:op.position, value:doTotalRow, summary:true};
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
//funções
(function(){
    CubeJS
        .createFunction('CELL', function(r,c){
            var ro, co, mc=this._mapCols, mr=this._mapRows;
            
            if (typeof(r)==='string'){
                r = mr[r] - this._cube.cols.levels;
            }
            if (typeof(c)==='string'){
                c = mc[c] - this._cube.rows.levels;
            }

            ro = this._cube.data[r];
            co = ro ? ro[c] : null;

            return co ? co.value : null;
        })
        .createFunction('SUMMARY_ROW', function(r,c){
            if (this.$CACHE_ROWSUM[r]===undefined){
                this.$CACHE_ROWSUM[r]={};
                this.$CACHE_ROW_MEASURE[r]={};
                this.$CACHE_ROW_PERCENT[r]={};
            }
            if (this.$CACHE_ROWSUM[r][c]===undefined){
                var s=0, q=0, ce;
                for (var i=this._cube.cols.levels; i<r; i++){
                    ce=this.MT[i][c];
                    if (ce){
                        s += ce.value;
                        q++;
                    }
                }
                this.$CACHE_ROWSUM[r][c]=s;
                this.$CACHE_ROW_MEASURE[r][c]=((s/(q)).toFixed(2))*1;
                this.$CACHE_ROW_PERCENT[r][c]='TODO';
            }
            return this.$CACHE_ROWSUM[r][c];
        })
        .createFunction('MEASURE_ROW', function(r,c){
            this.SUMMARY_ROW(r,c);
            return this.$CACHE_ROW_MEASURE[r][c];
        })
        .createFunction('PERCENT_ROW', function(r,c){
            this.SUMMARY_ROW(r,c);
            return this.$CACHE_ROW_PERCENT[r][c];
        });
}());


(function(){
    
    CubeJS.plugin('htmlTable', function(){
        this.htmlTable = function(){
            return toHTML(this);
        };
        this._views.table = tableView;
    });
    
    function tableView(element){
        element.innerHTML = toHTML(this);
    }
    
    function toHTML(instance){
        var
            r, c, row, html,
            cube   = instance._cube,
            matrix = instance._matrix;
        
        //console.log(instance);
        
        function createHTMLCell(r,c,obj){
            var cls, v='';
             
            if (r>cube.cols.levels-1){
                if (c>cube.rows.levels-1){
                    cls = 'cell value';           //dados
                }else{
                    cls = 'cell label label-row'; //título de linhas
                }
            }else{
                if (c>cube.rows.levels-1){
                    cls = 'cell label label-col'; //título de colunas
                }else{
                    cls = 'cell';                 //canto
                }
            }
            
            if (obj){
                cls += obj.calculated ? ' calc-'+obj.calc+' label-calc': '';
                cls += obj.calc ? ' calc-'+obj.calc+' value-calc': '';
            }
            
            v = (obj ? obj.label || obj.value : null);
            
            return '<td class="'+cls+'">'+(v===null||v===undefined?'':v)+'</td>';
        }
        
        html = '<table class="table" border="0" cellpadding="3" cellspacing="0">';
        for (r=0; r<matrix.rowsLength; r++){
            row = matrix[r];
            html += '<tr>';
            for (c=0; c<matrix.colsLength; c++){
                html += createHTMLCell(r,c,row[c]);
            }
            html += '</tr>';
        }
        html += '</table>';
        
        return ('<pre>' + html + '</pre>');
    }
}());