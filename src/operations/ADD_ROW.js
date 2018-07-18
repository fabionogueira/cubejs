// @ts-check

import CubeJS from '../cubejs'
import Functions from '../functions/Functions'

CubeJS.createOperation('ADD_ROW', function(operationDef) {
    let o, f
    let context = {}
    let functions = new Functions(this, context)
    let calculatedOptions = {
        key: operationDef.key,
        position: operationDef.position,
        keyRef: operationDef.reference
    }

    // define o contexto das funções
    context.type = 'row'
    o = this._createCalculatedRow(calculatedOptions, operationDef, (col, row) => {
        // define a coluna atual do contexto das funções
        context.col = col
        f = Functions.compile(operationDef.expression)

        // faz a chamada da função
        return f.apply(functions, [this._maps.keys, col, row, this])
    })

    if (o){
        if (operationDef.display) o.display = operationDef.display
    
        if (operationDef.options){
            Object.assign(o, operationDef.options)
        }
    }

})
