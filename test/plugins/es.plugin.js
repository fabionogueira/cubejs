
//converte o cubo de es para cubejs
(function(){
    
    CubeJS.plugin('es', function(){
        this.definition = function(definition){
            this._definition = definition;
            return this.data(this._data);
        };
        this.data = function(data){
            if (arguments.length===0) {
                return this._data;
            }
            
            if (data && this._definition && !data.__es__){
                this._data = transform(this._definition, data.aggregations);
                data.__es__= true;
            }
            
            return this;
        };
        this.query = function(){
            if (this._definition){
                return query(this._definition);
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
    function query(def){
        //retorna a query ES referente a definition
        return 'query elasticsearch';
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
