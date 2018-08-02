import Functions from './Functions'

/**
 * case 01: SUM([1,2,3])
 * case 02: SUM('keyStart', 'keyEnd') ou SUM('keyStart') // assume keyEnd=última linha/coluna
 * case 03: SUM() // assume keyStart=primeira linha/coluna e keyEnd=última linha/coluna
 */

Functions.create('SUM', function(start, end) {
    let context = this.context
    let cubejs = this.instance
    let sum = 0
    let range
    
    if (Array.isArray(start)){
        // case 01
        range = start
    } else {
        // case 02 e case 03
        start = start || (context.activeRow ? cubejs.findFirstCol().key : cubejs.findFirstRow().key)
        end = end || (context.activeRow ? cubejs.findLastCol().key : cubejs.findLastRow().key)

        range = context.activeRow ? 
                    cubejs.getColRangeValues(context.activeRow.key, start, end) : 
                    cubejs.getRowRangeValues(context.activeCol.key, start, end)
    }
    
    range.forEach(v => { sum += v })

    return sum
})
