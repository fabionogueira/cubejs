import {Functions, FunctionsCache} from './Functions'

Functions.create('COL_RANGE', function(keyCol, keyStartRow, keyEndRow) {
    let start, end, aux, arr
    let cubejs = this.instance
    let cacheK = keyCol + keyStartRow + keyEndRow
    let range = FunctionsCache.get(this, 'COL_RANGE', cacheK)

    if (range){
        return range
    }
    
    range = []
    start = cubejs.findRow(keyStartRow)
    end = cubejs.findRow(keyEndRow)

    if (end._index < start._index){
        aux = start
        start = end
        end = aux
    }

    arr = start.parent ? start.parent.children : cubejs._maps.rows
    arr.forEach((item, index) => {
        if (index <= end._index){
            cubejs.eachLeaf(item, leaf => {
                let k = keyCol + leaf.key
                let m = cubejs._maps.keys[k]
                let v = m ? m.value : 0

                range.push(v)
            })
        }
    })

    FunctionsCache.set(this, 'COL_RANGE', cacheK, range)

    return range
})

Functions.create('ROW_RANGE', function(keyRow, keyStartCol, keyEndCol) {
    let start, end, aux, arr
    let cubejs = this.instance
    let cacheK = keyRow + keyStartCol + keyEndCol
    let range = FunctionsCache.get(this, 'ROW_RANGE', cacheK)
    
    if (this._$ROW_RANGE_CACHE && this._$ROW_RANGE_CACHE[cacheK]){
        console.log('using _$ROW_RANGE_CACHE')
        return this._$COL_RANGE_CACHE[cacheK]
    }
    
    range = []
    start = cubejs.findCol(keyStartCol)
    end = cubejs.findCol(keyEndCol)

    if (end._index < start._index){
        aux = start
        start = end
        end = aux
    }

    arr = start.parent ? start.parent.children : cubejs._maps.cols
    arr.forEach((item, index) => {
        if (index <= end._index){
            cubejs.eachLeaf(item, leaf => {
                let k = leaf.key + keyRow
                let m = cubejs._maps.keys[k]
                let v = m ? m.value : 0

                range.push(v)
            })
        }
    })

    FunctionsCache.set(this, 'ROW_RANGE', cacheK, range)

    return range
})

Functions.create('RANGE', function(keyStartRow, keyEndRow) {
    let context = this.context    
    return (context.type == 'row') ? this.COL_RANGE(context.col.key, keyStartRow, keyEndRow) : this.ROW_RANGE(context.row.key, keyStartRow, keyEndRow)
})
