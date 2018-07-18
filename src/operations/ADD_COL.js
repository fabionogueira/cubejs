// @ts-check

import CubeJS from '../cubejs'
import Functions from '../functions/Functions'

CubeJS.createOperation('ADD_COL', function(operationDef){
    let o, f
    let context = {}
    let functions = new Functions(this, context)
    let calculatedOptions = {
        key: operationDef.key,
        position: operationDef.position,
        keyRef: operationDef.reference
    }

    context.type = 'col'
    o = this._createCalculatedCol(calculatedOptions, operationDef, (row, col) => {   
        f = Functions.compile(operationDef.expression)
        context.row = row
        return f.apply(functions, [this._maps.keys, col, row, this])
    })

    if (o){
        if (operationDef.display) o.display = operationDef.display
    
        if (operationDef.options){
            Object.assign(o, operationDef.options)
        }
    }
})
