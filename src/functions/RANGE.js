// @ts-check

import Functions from './Functions'

Functions.create('RANGE', function(start, end) {
    let context = this.context
    let cubejs = this.instance

    return context.activeRow ? 
        cubejs.getColRangeValues(context.activeRow.key, start, end) : 
        cubejs.getRowRangeValues(context.activeCol.key, start, end)
})
