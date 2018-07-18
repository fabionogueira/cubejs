import Functions from './Functions'

Functions.create('SUM', function(start, end) {
    let context = this.context
    let sum = 0
    let range = Array.isArray(start) ? start : (context.type == 'row') ? this.COL_RANGE(context.col.key, start, end) : this.ROW_RANGE(context.row.key, start, end)

    range.forEach(v => { sum += v })

    return sum
})
