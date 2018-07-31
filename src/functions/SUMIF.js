import Functions from './Functions'

/**
 * case 01: SUM(condition, [1,2,3])
 * case 02: SUM(condition, 'keyStart', 'keyEnd') ou SUM('keyStart') // assume keyEnd=última linha/coluna
 * case 03: SUM(condition) // assume keyStart=primeira linha/coluna e keyEnd=última linha/coluna
 */

Functions.create('SUMIF', function(condition, start, end) {
    let context = this.context
    let instance = this.instance
    let sum = 0
    let range
    
    if (Array.isArray(start)){
        // case 01
        range = start
    } else {
        // case 02 e case 03
        start = start || (context.activeRow ? instance.findFirstCol().key : instance.findFirstRow().key)
        end = end || (context.activeRow ? instance.findLastCol().key : instance.findLastRow().key)
        range = context.activeRow ? this.COL_RANGE(context.activeRow.key, start, end) : this.ROW_RANGE(context.activeCol.key, start, end)
    }
    
    range.forEach(v => { sum += v })

    return sum
})
