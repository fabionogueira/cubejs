// @ts-check

// obs: o resultado esperado para uma consulta elastic é colunas primeiro, depois linhas

let lin = [{dimension:'marca'}, {measure:'count'}, {measure:'min'}] // dimensões sempre primeiro, métricas no fim
let col = [{dimension:'modelo'}, {dimension:'calibre'}] // dimensões sempre primeiro, métricas no fim
let data = [ // }
    {calibre:'38',  modelo:'revolver',   marca:'taurus', count: 5, min:0},
    {calibre:'38',  modelo:'revolver',   marca:'rossi',  count: 2, min:2},
    {calibre:'38',  modelo:'espingarda', marca:'taurus', count: 3, min:1},
    {calibre:'38',  modelo:'espingarda', marca:'cbc',    count: 4, min:3},
    {calibre:'380', modelo:'pistola',    marca:'taurus', count: 4, min:1},
    {calibre:'380', modelo:'pistola',    marca:'glock',  count: 1, min:0},
    {calibre:'.40', modelo:'pistola',    marca:'glock',  count: 6, min:3}, 
    {calibre:'22',  modelo:'revolver',   marca:'cbc',    count: 1, min:1}
]

let maps = {
    cols: [],
    rows: [],
    keys: {}
}

// modelo do maps.keys
maps.keys = {
    'taurus.count.38.revolver': 5, 'taurus.min.38.revolver': 0,
    'rossi.count.38.revolver': 2, 'rossi.min.38.revolver': 2,
    'taurus.count.38.espingarda': 3, 'taurus.min.38.espingarda': 1,
    'cbc.count.38.espingarda': 4, 'cbc.min.38.espingarda': 3,
    'taurus.count.380.pistola': 4, 'taurus.min.38.pistola': 1,
    'glock.count.380.pistola': 1, 'glock.min.38.pistola': 0,
    'glock.count..40.pistola': 6, 'glock.min..40.pistola': 3,
    'cbc.count.22.revolver': 1, 'cbc.min.22.revolver': 1
}

// modelo de maps.cols
maps.cols = [
    {
        key: 'taurus',
        dimension: 'marca',
        categoty: 'taurus',
        children: [
            {
                key: 'taurus.count',
                measure: 'count'
            },
            {
                key: 'taurus.min',
                measure: 'min'
            }
        ]
    },
    {
        dimension: 'marca',
        categoty: 'rossi'
    },
    {
        dimension: 'marca',
        categoty: 'glock'
    },
    {
        dimension: 'marca',
        categoty: 'cbc'
    }
]

function createAux(){
    let aux = {
        measures: {},
        colmap: {},
        rowmap: {},
        // @ts-ignore
        all: col.concat(lin)
    }

    aux.all.forEach(item => {
        if (item.measure){
            aux.measures[item.measure] = true
        }
    })

    col.forEach(item => {aux.colmap[item.measure || item.dimension] = item})
    lin.forEach(item => {aux.rowmap[item.measure || item.dimension] = item})

    return aux
}

// criando o maps.keys, maps.cols, maps.rows
function createKeysMap(maps){
    let i, s, v, item
    
    maps.keys = {}

    data.forEach(r => {
        s = ''

        for (i=0; i<aux.all.length; i++){
            item = aux.all[i]

            if (item.dimension){
                if (r.hasOwnProperty(item.dimension)){
                    s += r[item.dimension]
                }
            }

            if (item.measure){
                // métrica de coluna ou de linha
                if (aux.colmap[item.measure] || aux.rowmap[item.measure]){
                    s += '{measure}'
                }
            }
        }

        for (i in aux.measures){
            if (r[i]!==undefined){
                maps.keys[s.replace('{measure}', i).replace('{measure}', '')] = r[i]
            }
        }
    })
}
function createHead(def, root){
    let exists = {}

    data.forEach(row => {
        processDataRow(row, 0, '', root, null)
    })

    function processDataRow(dataRow, defIndex, parentKey, parentArr, parentObj){
        let k, o, a, p, item

        item = def[defIndex]

        if (item && (item.dimension || item.measure)){
            
            if (item.dimension){
                a = []
                k = parentKey + dataRow[item.dimension]
                o = {
                    key: k,
                    dimension: item.dimension,
                    categoty: dataRow[item.dimension]
                }

                if (!exists[k]){
                    exists[k] = a
                    parentArr.push(o)
                    o['parent'] = parentObj
                    processDataRow(dataRow, defIndex + 1, k, a, o)
                    
                    if (a.length>0){
                        o['children'] = a
                    }
                } else {
                    processDataRow(dataRow, defIndex + 1, k, exists[k], parentObj)
                }

            } else {
                k = parentKey + item.measure
                o = {
                    key: k,
                    measure: item.measure
                }

                if (!exists[k]){
                    exists[k] = parentArr
                    parentArr.push(o)
                    o['parent'] = parentObj
                    processDataRow(dataRow, defIndex + 1, parentKey, parentArr, parentObj)
                } else {
                    processDataRow(dataRow, defIndex + 1, parentKey, exists[k], parentObj)
                }
            } 
        }
    }
}

const CACHE = {
    _cache: {},
    get(el, key){
        if (el && el.__cache_id__){
            return this._cache[el.__cache_id__]
        }
    },
    set(el, key, value){
        let i
        
        el.__cache_id__ = key
        this._cache[key] = value

        return value
    },
    clear(el){
        if (el && el.__cache_id__){
            delete(this._cache[el.__cache_id__])
        }
    }
}

let forEach_cache = {}
let forEach_id = 1
function forEach(arr, callback, level=-1){
    // let i
    // let cache = forEach_cache[arr.__id__]

    // if (cache){
    //     console.log('use cache')
    //     for (i=0; i<cache.length; i++){
    //         callback(cache[i])
    //     }

    //     return
    // }
    
    // arr.__id__ = forEach_id++
    // cache = forEach_cache[arr.__id__] = []
    
    doForEach(arr, level)

    function doForEach(arr, activeLevel){
        let i, item

        for (i=0; i<arr.length; i++){
            item = arr[i]
            if (level == -1){
                if (item.children){
                    doForEach(item.children, activeLevel)
                } else {
                    // cache.push(item)
                    callback(item)
                }
            } else {
                if (activeLevel==level){
                    // cache.push(item)
                    callback(item)
                } else if (item.children){
                    doForEach(item.children, activeLevel+1)
                }
            }
        }
    }
}

maps.rows = []
maps.cols = []
let aux = createAux()
createKeysMap(maps)
createHead(lin, maps.rows)
createHead(col, maps.cols)

console.log(maps)

// linha calculada, total de 38, após a linha key="38" 
// posiciona
function findRow(key){
    let i
    let row = null
    let children = arguments[1] || maps.rows

    for (i=0; i<children.length; i++){
        if (children[i].key == key){
            return {item:children[i], index:i}
        }

        if (children[i].children){
            row = findRow(key, children[i].children)
            if (row) return row
        }
    }

    return null
}
function findLastRow(){
    let index = maps.rows.length-1
    let item = maps.rows[index]

    // while (last.children){
    //     last = last.children[last.children.length-1]
    // }

    return {item, index}
}

// console.log(findRow('38.revolver'))

//inserir coluna (taurus + rossi) após rossi
// let i,j,k,s,v,a,r
// col.splice(1, 0, 'rossi+taurus') // inseri soma na posição 1 e não exclui nenhum item
// for (i=0; i<data.length; i++){
//     r = data[i]
//     r['soma'] = r['count'] + r['min']
// }

// //inserir linha que calcule o total de '38'
// lin.splice(1, 0, 'total38') // inseri soma na posição 1 e não exclui nenhum item

// console.log(col, data)

function createCalculatedRow(key, position, keyRef, callback){
    let row = position == 'last' ? findLastRow() : findRow(keyRef)
    let arr = row.item.parent ? row.item.parent.children : maps.rows
    let o = {
        key: key,
        measure: key,
        caculated: true
    }

    if (position=='after'){
        arr.splice(row.index + 1, 0, o)
    } else if (position=='before'){
        arr.splice(row.index, 0, o)
    } else if (position=='last'){
        arr.push(o)
    }

    // limpa o cache do forEach por ter alterado a estrurura das linhas
    // delete(maps.rows['__id__'])

    // calcula os valores das colunas
    forEach(maps.cols, c => {
        maps.keys[c.key + key] = callback(c.key)
    })
}

let operations = {}
function createOperation(name, definition){
    operations[name] = definition
}

createOperation('summary', {
    priority: 20,
    init(definition){
        let total = 0

        // operação de linha
        if (definition.operation == 'row'){
            createCalculatedRow('summary', 'last', null, (col) => {    
                forEach(maps.rows, r => {
                    let v = (maps.keys[col + r.key] || 0)
                    total += v
                })
            
                return total
            })
        } 
        
        // operação de coluna
        else {

        }
    }
})

// insertCalculatedRow({
//     key: 'calc1',
//     operation: 'summary'
// })


function $ROW(key){
    return maps.keys[key] || 0
}

// ordena as operações por prioridade e depois executa

function htmlTable(){
    let r, i, d
    let rc = ''
    let cc = ''
    let html
    
    // rows categories
    for (i=0; i<maps.rows.length; i++){
        r = maps.rows[i]
        rc += createRowCategory(r)
    }

    // cols categories
    cc = '<div class="hbox">'
    for (i=0; i<maps.cols.length; i++){
        r = maps.cols[i]
        cc += createColCategory(r)
    }
    cc += '</div>'

    // values
    d = '<div class="hbox">' + createDataValue() + '</div>'

    html = 
    '<table border="0" cellspacing="0" cellpadding="0">' +
        '<tr>'+
            '<td class="table-canto"></td>' +
            '<td>'+cc+'</td>' +
        '</tr>' +
        '<tr>' +
            '<td class="table-categories">'+rc+'</td>'+
            '<td class="table-values">'+d+'</td>'+
        '</tr>' +
    '</table>'

    document.getElementById('table').innerHTML = html
    
    function createRowCategory(r){
        let div, i, cls
        let oneChild = r.children && r.children.length==1
        let oneMeasureChild = oneChild && r.children[0].measure
        
        cls = (r.children?oneChild?'':' category-row-parent':' category-flex') + (r.measure?' is-measure':'') + (r.caculated?' calculated-category':'')
        
        div = '<div class="hbox">'
        div += '<div class="cell category-cell category-row' + cls + '">' + (r.categoty || r.measure) + '</div>'
        if (r.children){
            div += '<div class="vbox">'
            if (!oneMeasureChild){
                for (i=0; i<r.children.length; i++){
                    div += createRowCategory(r.children[i])
                }
            }
            div += '</div>'
        }
        div += '</div>'

        return div
    }

    function createColCategory(r){
        let div, i, cls
        let oneChild = r.children && r.children.length==1
        let oneMeasureChild = oneChild && r.children[0].measure
        
        cls = (r.children?oneChild?'':' category-col-parent':' category-flex') + (r.measure?' is-measure':'') + (r.caculated?' calculated-category':'')
        
        div = '<div class="vbox">'
        div += '<div class="cell category-cell category-col'+ cls + '">' + (r.categoty || r.measure) + '</div>'

        if (r.children){
            div += '<div class="hbox">'
            if (!oneMeasureChild){
                for (i=0; i<r.children.length; i++){
                    div += createColCategory(r.children[i])
                }
            }
            div += '</div>'
        }
        div += '</div>'

        return div
    }

    function createDataValue(){
        let s, v
        let ss = ''

        forEach(maps.cols, c => {
            s = '<div class="vbox">'
            forEach(maps.rows, r => {
                v = maps.keys[c.key + r.key]
                s += '<div class="cell data-cell' + (r.caculated?' calculated-data':'') + '">' + (v==undefined?'&nbsp;':v) + '</div>'
            })
            s += '</div>'
            ss += s
        })

        return ss
    }
}

htmlTable()

/*
    |     |            |    taurus   |     rossi   |     glock   |      cbc
    |     |            | count | min | count | min | count | min | count | min  
    |-----+------------+-------+-----+-------+-----+-------+-----+-------+-----
    | 38  | revolver   |   5   |  0  |   2   |  2  |   2   |  0  |   2   |  0  
    |     | espingarda |   3   |  1  |   2   |  0  |   2   |  0  |   2   |  0  
    | 380 | pistola    |   4   |  0  |   2   |  0  |   2   |  0  |   2   |  0  
    | .40 | pistola    |   6   |  3  |   2   |  0  |   2   |  0  |   2   |  0  
    | 22  | revolver   |   1   |  1  |   2   |  0  |   2   |  0  |   2   |  0  
*/

// let i,j,k,s,v,a
// let colMap = {}
// for (i=0; i<data.length; i++){
//     // monta chave
//     k=''
//     v=''
//     a=[]
//     for (j=0; j<col.length; j++){
//         s = data[col[j]]
//         if (s) {
//             k += (v+s)
//             a.push(s)
//             v = '$'
//         }
//     }

//     colMap[k] = colMap[k] || []
//     colMap[k].push()

// }



/*
               | 38 | 380 | .40 | 22 
    -----------+----+-----+-----+----           
    revolver   | 2  |     |     |
    espingarda | 3  |     |     |
    pistola    |    |  4  |  6  |
    revolver   |    |     |     | 1
*/

// extrai colunas
// let mapCol = []
// let mapRow = []

// extrai linhas
// let dimensionIndex = 0
// function processDimension(arr, setMeasure=false){
//     let map = []

//     arr.forEach(c => {
//         let a, k, r
//         let i = 0
        
//         for (k in data){
//             a = k.split('$')
            
//             r = []

//             // categorias
//             a.forEach((d, j) => {
//                 r[j] = d
//             })
            
//             map[dimensionIndex + i] = r 
            
//             i++
//         }
    
//         dimensionIndex++
//     })

//     if (setMeasure){
//         measure.forEach(v => {
//             map.push(v)
//         })
//     }

//     return map
// }

// mapCol = processDimension(col, true)
// mapRow = processDimension(lin)

// console.log(mapCol, mapRow)
