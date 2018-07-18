// @ts-check

/* jshint latedef: nofunc */
// converte o cubo de es para cubejs

function getLevel(def){
    let i;
    let j = 0;
    let q = 0;

    for (i in def){
        if (def[i].type != 'measure') q++;
        else j = 1;
    }

    return q + j;
}
function transform(definition, agg){
    let i, cube;
    let mapCols = {};
    let mapRows = {};
    let x = 0;
    let y = 0;
    
    cube = {
        cols:{
            levels: getLevel(definition.cols)
        },
        rows:{
            levels: getLevel(definition.rows)
        },
        data:[]
    };
    // @ts-ignore
    cube.data.collength = 0;
    
    // define se a raiz é linha ou coluna
    for (i in agg){
        (definition.cols[i] ? processColBucket : processRowBucket)(i, agg[i], '', cube.cols, cube.rows);
        break;
    }
    
    function processColBucket(bucketKey, bucket, parentKey, parentObjCol, parentObjRow){
        var i, j, k, b, e, buckets, child;
        
        parentObjCol.children = parentObjCol.children || [];
        buckets = bucket.buckets;
        
        for (i = 0; i < buckets.length; i++){
            e = false;
            b = buckets[i];
            k = parentKey + b.key;
            child = createColItem(parentObjCol.children, {id:k, label:b.key_as_string || b.key, category:b.key, dimension:bucketKey});
            
            for (j in b){
                if (definition.cols[j]){
                    e = true;
                    if (definition.cols[j].type == 'measure' || !b[j].buckets){
                        // métrica de coluna
                        processMeasureBucketCol(j, b[j], child, mapCols[k].x);
                    } else {
                        // dimensão de coluna
                        processColBucket(j, b[j], k + '$', child, parentObjRow);
                    }
                } else if (definition.rows[j]){
                    e = true;
                    if (definition.rows[j].type == 'measure' || !b[j].buckets){
                        // métrica de linha
                        processMeasureBucketRow(j, b[j], parentObjRow, mapCols[k].x);
                    } else {
                        // dimensão de linha
                        processRowBucket(j, b[j], '', child, parentObjRow);
                    }
                }
            }
            
            if (!e){
                // métrica no data
                processDataBucket(b, mapCols[k].x, mapRows[parentObjRow.id] ? mapRows[parentObjRow.id].y : 0);
            }
        }
    }
    function processRowBucket(bucketKey, bucket, parentKey, parentObjCol, parentObjRow){
        var i, j, k, b, e, buckets, child;
        
        parentObjRow.children = parentObjRow.children || [];
        buckets = bucket.buckets;
        
        for (i = 0; i < buckets.length; i++){
            e = false;
            b = buckets[i];
            k = parentKey + b.key;
            child = createRowItem(parentObjRow.children, {id:k, label:b.key_as_string || b.key, category:b.key, dimension:bucketKey});
            
            for (j in b){
                if (definition.cols[j]){
                    e = true;
                    if (definition.cols[j].type == 'measure' || !b[j].buckets){
                        // métrica de coluna
                        processMeasureBucketCol(j, b[j], parentObjCol, mapRows[k].y);
                    } else {
                        // dimensão de coluna
                        processColBucket(j, b[j], '', parentObjCol, child);
                    }
                } else if (definition.rows[j]){
                    e = true;
                    if (definition.rows[j].type == 'measure' || !b[j].buckets){
                        // métrica de linha
                        processMeasureBucketRow(j, b[j], child, mapCols[parentObjCol.id].x);
                    } else {
                        // dimensão de linha
                        processRowBucket(j, b[j], k + '$', parentObjCol, child);
                    }
                }
            }
            
            if (!e){
                // métrica no data
                processDataBucket(b, mapCols[parentObjCol.id] ? mapCols[parentObjCol.id].x : 0, mapRows[k].y);
            }
        }
    }
    function processMeasureBucketCol(bucketKey, bucket, parentObj, y){
        let x, k;
        
        parentObj.children = parentObj.children || [];
        k = (parentObj.id ? parentObj.id + '$' : '') + bucketKey;
        createColItem(parentObj.children, {id:k, label:bucketKey, measure:bucketKey});
        
        x = mapCols[k].x;
        
        cube.data[y] = cube.data[y] || [];
        cube.data[y][x] = {value: (bucket.value === undefined ? bucket : bucket.value)};
        
        // if (cube.data.collength < cube.data[y].length) cube.data.collength = cube.data[y].length;
    }
    function processMeasureBucketRow(bucketKey, bucket, parentObj, x){
        let y, k;
        
        parentObj.children = parentObj.children || [];
        k = (parentObj.id ? parentObj.id + '$' : '') + bucketKey;
        createRowItem(parentObj.children, {id:k, label:bucketKey, measure:bucketKey});
        
        y = mapRows[k].y;
        
        cube.data[y] = cube.data[y] || [];
        cube.data[y][x] = {value:bucket.value || bucket};
        
        // if (cube.data.collength < cube.data[y].length) cube.data.collength = cube.data[y].length;
    }
    function processDataBucket(bucket, x, y){
        cube.data[y] = cube.data[y] || [];
        cube.data[y][x] = {value:bucket.doc_count};
        // if (cube.data.collength < cube.data[y].length) cube.data.collength = cube.data[y].length;
    }
    function createColItem(children, item){
        if (!mapCols[item.id]) {
            children.push(item);
            if (children.length > 1)x++;
            mapCols[item.id] = {
                item: item,
                x:x
            };
            // cube.data.collength = x;
        }
        
        return mapCols[item.id].item;
    }
    function createRowItem(children, item){
        if (!mapRows[item.id]) {
            children.push(item);
            if (children.length > 1)y++;
            mapRows[item.id] = {
                item: item,
                y:y
            };                
        }
        
        return mapRows[item.id].item;
    }
    // console.log(mapCols); console.log(mapRows);
    return cube;
}

/**
 * Transforma dados de resposta do elasticsearch para um formato de matriz
 * @param cubejs CubeJS
 * @param data Object
 */
// export default function ElasticAdapter (cubejs, data) {
//     if (data && !data.__es__) {
//         data = transform(cubejs.getDefinition(), data.aggregations);
//         data.__es__ = true;
//     }
    
//     return data;
// }

export default {
    response(cubejs, data){
        let o = {
            levels: 1,
            children:[
                {
                    id: 'doc_count',
                    label: 'count',
                    measure: 'doc_count'
                }
            ]
        };

        if (data && !data.__es__) {
            data = transform(cubejs.getDefinition(), data.aggregations);

            if (data.cols.levels == 0){
                data.cols = o
            } else if (data.rows.levels == 0){
                data.rows = o
            }

            data.__es__ = true;
        }
        
        return data;
    },

    // prepara o json de envio
    request(cubejs, options){
        let i, k, d, p, v, o, o1, o2, o3;
        let a = [];
        let b = [];
        let c = [];
        let json = {size:0};
        
        // _cols = options.cols;
        // _rows = options.rows;
        
        // coloca as variáveis na ordem linhas, colunas, métricas
        for (i = 0; i < options.cols.length; i++){
            a.push(options.cols[i]);
        }
        for (i = 0; i < options.rows.length; i++){
            a.push(options.rows[i]);
        }
        
        function itemAggs(aggsObj, name){
            let p, v, k, d, o2, o3, o4;
                
            p = name.split('.');
            v = name.replace('.', '_');
            k = p[0];
            d = options.dimensions[k];
            o2 = aggsObj.aggs = {};
            o3 = o2[v] = {};
                
            switch (d.type){
            case 'date':
                o4 = o3['date_histogram'] = {
                    field: k
                };
                switch (p[1]){
                case 'year':
                    o4['interval'] = 'year';
                    o4['format'] = 'yyy';
                    break;
                }
                break;

            default:
                o3['terms'] = {
                    field: a[i]
                };
                break;
            }
            
            return o3;
        }
        
        // cria o json ES a ser enviado
        o1 = json;            
        for (i = 0; i < a.length; i++){
            k = a[i].split('.')[0];
            d = options.dimensions[k];
            
            if (d){
                if (d.nested){ // nested fica no final
                    b.push(a[i]);
                } else {
                    o1 = itemAggs(o1, a[i]);
                }
            } else {
                d = options.measures[k];
                if (d){ // métricas ficam no final
                    c.push(k);
                }
            }
        }
        
        // adiciona o nested
        for (i = 0; i < b.length; i++){
            p = b[i].split('.');
            v = b[i].replace('.', '_');
            k = p[0];
            d = options.dimensions[k];
            o2 = o1['aggs'] = {};
            o3 = o2[v] = {};
            
            // tipos nested devem ficar no final
            o2[v] = o = {
                nested: {
                    path: k
                },
                aggs:{}
            };
            o3 = o.aggs[v] = {};
            o3['terms'] = {
                field: b[i]
            };
        }
        
        // adiciona as métricas
        if (c.length > 0){
            // o2 = o1.aggs = {};
            // for (i = 0; i < c.length; i++){
            //     d = vars[c[i]];
            //     o3 = o2[c[i]] = {};
            //     o3[d.aggs] = {
            //         field: c[i]
            //     };
            // }
        }
        
        return {
            url : '/_search',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(json)
        };        
    }
};
