import {Functions} from './Functions'

/**
 * Retorna um array com os valores das chaves/intervalo
 *  case 01: VALUES('key1', 'key2', 'key3')
 *  case 02: VALUES() // retorna toda a linha/coluna
 */

Functions.create('COL_VALUES', function(rowKey, args) {
    let item, i
    let cubejs = this.instance
    let range = []
    
    for (i = 0; i < args.length; i++){
        item = cubejs.findCol(args[i])

        cubejs.eachLeaf(item, col => {
            let m = cubejs._maps.keys[col.key + rowKey]
            if (m && m.summary != 'col'){
                range.push(m ? m.value : 0)
            }
        })    
    }

    return range
})

Functions.create('ROW_VALUES', function(colKey, args) {
    let item, i
    let cubejs = this.instance
    let range = []
    
    for (i = 0; i < args.length; i++){
        item = cubejs.findRow(args[i])

        cubejs.eachLeaf(item, row => {
            let m = cubejs._maps.keys[colKey + row.key]
            if (m && m.summary != 'row'){
                range.push(m ? m.value : 0)
            }
        })
    }

    return range
})

Functions.create('VALUES', function() {
    let start, end
    let cubejs = this.instance
    let context = this.context
    
    if (arguments.length==0){
        start = context.activeRow ? cubejs.findFirstCol().key : cubejs.findFirstRow().key
        end = context.activeRow ? cubejs.findLastCol().key : cubejs.findLastRow().key

        return context.activeRow ? 
                    cubejs.getColRangeValues(context.activeRow.key, start, end) : 
                    cubejs.getRowRangeValues(context.activeCol.key, start, end)
    }

    return context.activeRow ?
                cubejs.getColRangeValues(context.activeRow.key, arguments[0], arguments[1]) : 
                cubejs.getRowRangeValues(context.activeCol.key, arguments[0], arguments[1])
})
