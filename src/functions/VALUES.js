import {Functions} from './Functions'

Functions.create('COL_VALUES', function(keyCol, args) {
    let item, i
    let cubejs = this.instance
    let range

    range = []
    
    for (i = 0; i < args.length; i++){
        item = cubejs.findRow(args[i])

        if (item){
            cubejs.eachLeaf(item, leaf => {
                let k = keyCol + leaf.key
                let m = cubejs._maps.keys[k]
                
                range.push(m ? m.value : 0)
            })
        }
    }

    return range
})

Functions.create('ROW_VALUES', function(keyRow, args) {
    let item, i
    let cubejs = this.instance
    let range

    range = []
    
    for (i = 0; i < args.length; i++){
        item = cubejs.findCol(args[i])

        if (item){
            cubejs.eachLeaf(item, leaf => {
                let k = leaf.key + keyRow
                let m = cubejs._maps.keys[k]
                
                range.push(m ? m.value : 0)
            })
        }
    }

    return range
})

Functions.create('VALUES', function() {
    let context = this.context
    return (context.type == 'row') ? this.COL_VALUES(context.col.key, arguments) : this.ROW_VALUES(context.row.key, arguments)
})
