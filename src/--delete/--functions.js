
class Functions{
    static _expressions = {}

    constructor(instance, context){
        this.instance = instance
        this.context = context
        this._expressions = {}
    }

    static create(name, fn){
        this.prototype[name] = fn
    }

    static compile(exp){
        let i, r, c
        
        if (!this._expressions[exp]){
            for (i in this.prototype) {
                r = new RegExp(`\\${i}\\s*\\(`, 'g')
                c = `this.${i}(`
    
                exp = exp.replace(r, c)
            }
            
            // ignora aregra no-new-func do eslint
            /* eslint-disable */
            this._expressions[exp] = Function('return ' + exp)
            /* eslint-enable */
        }

        return this._expressions[exp]
    }
}

class FunctionsCache{
    static get(instance, f, key){
        let o = instance[f]
        
        if (o && o[key] != undefined){
            console.log('using cache ' + f)
            return o[key]
        }        
    }

    static set(instance, f, key, value){
        let o = instance[f]
        
        if (!o){
            o = instance[f] = {}
        }

        o[key] = value
    }
}

Functions.create('$COL_RANGE', function(keyCol, keyStartRow, keyEndRow) {
    let start, end, aux, arr
    let cubejs = this.instance
    let cacheK = keyCol + keyStartRow + keyEndRow
    let range = FunctionsCache.get(this, '$COL_RANGE', cacheK)

    if (range){
        return range
    }
    
    range = []
    start = cubejs.findRow(keyStartRow)
    end = cubejs.findRow(keyEndRow)

    if (start && end){
        if (end.index < start.index){
            aux = start
            start = end
            end = aux
        }

        arr = start.item.parent ? start.item.parent.children : cubejs._maps.rows
        arr.forEach((item, index) => {
            if (index <= end.index){
                cubejs.eachLeaf(item, leaf => {
                    let k = keyCol + leaf.key
                    let m = cubejs._maps.keys[k]
                    let v = m ? m.value : 0

                    range.push(v)
                })
            }
        })
    }

    FunctionsCache.set(this, '$COL_RANGE', cacheK, range)

    return range
})

Functions.create('$ROW_RANGE', function(keyCol, keyStartCol, keyEndCol) {
    let start, end, aux, arr
    let cubejs = this.instance
    let cacheK = keyCol + keyStartCol + keyEndCol
    let range = FunctionsCache.get(this, '$ROW_RANGE', cacheK)
    
    
    if (this._$ROW_RANGE_CACHE && this._$ROW_RANGE_CACHE[cacheK]){
        console.log('using _$ROW_RANGE_CACHE')
        return this._$COL_RANGE_CACHE[cacheK]
    }
    
    start = cubejs.findCol(keyStartCol)
    end = cubejs.findCol(keyEndCol)

    if (start && end){
        if (end.index < start.index){
            aux = start
            start = end
            end = aux
        }

        arr = start.item.parent ? start.item.parent.children : cubejs._maps.cols
        arr.forEach((item, index) => {
            if (index <= end.index){
                cubejs.eachLeaf(item, leaf => {
                    let k = keyCol + leaf.key
                    let m = cubejs._maps.keys[k]
                    let v = m ? m.value : 0

                    range.push(v)
                })
            }
        })
    }

    FunctionsCache.set(this, '$ROW_RANGE', cacheK, range)

    return range
})

Functions.create('RANGE', function(keyStartRow, keyEndRow) {
    let context = this.context
    
    if (context.type == 'row'){
        return this.$COL_RANGE(context.col.key, keyStartRow, keyEndRow)
    } else {
        return this.$ROW_RANGE(context.row.key, keyStartRow, keyEndRow)
    }
})

Functions.create('SUM', function(start, end) {
    let context = this.context
    let sum = 0
    let range
    
    if (context.type == 'row'){
        range = this.$COL_RANGE(context.col.key, start, end)
    } else {
        range = this.$ROW_RANGE(context.row.key, start, end)
    }

    range.forEach(v => { sum += v })

    return sum
})

Functions.create('SUMMARY', function(start, end) {
    let context = this.context
    let sum = 0
    let range
    
    if (context.type == 'row'){
        start = start || this.instance.findFirstRow().item.key
        end = end || this.instance.findLastRow().item.key

        range = this.$COL_RANGE(context.col.key, start, end)
        range.forEach(v => { sum += v })
    }

    return sum
})

export default Functions
