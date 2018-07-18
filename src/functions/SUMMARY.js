import Functions from './Functions'

function SUMMARYROW(start, end){
    let context = this.context
    let sum = 0
    let range

    start = start || this.instance.findFirstRow().key
    end = end || this.instance.findLastRow().key

    range = this.COL_RANGE(context.col.key, start, end)
    range.forEach(v => { sum += v })

    return sum
}

function SUMMARYCOL(start, end){
    let context = this.context
    let sum = 0
    let range

    start = start || this.instance.findFirstCol().key
    end = end || this.instance.findLastCol().key

    range = this.ROW_RANGE(context.row.key, start, end)
    range.forEach(v => { sum += v })

    return sum
}

Functions.create('SUMMARY', function(start, end) {
    return (this.context.type == 'row') ? SUMMARYROW.apply(this, [start, end]) : SUMMARYCOL.apply(this, [start, end])
})

export default Functions
