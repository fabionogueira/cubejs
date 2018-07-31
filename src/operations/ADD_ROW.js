// @ts-check

import CubeJS from '../cubejs'
import Functions from '../functions/Functions'

CubeJS.createOperation({
        name: 'ADD_ROW',
        description: 'Added Row',
    },

    function(operationDef) {
        let o, f
        let $INDEX = 0
        let context = {}
        let functions = new Functions(this, context)
        let calculatedOptions = {
            key: operationDef.key,
            position: operationDef.position,
            keyRef: operationDef.reference,
            summary: operationDef.summary ? 'row' : null
        }

        // define o contexto das funções
        o = this._createCalculatedRow(calculatedOptions, operationDef, (col, row) => {
            // define a coluna atual do contexto das funções
            f = Functions.compile(operationDef.expression)
            
            // faz a chamada da função
            context.activeCol = col
            return f.apply(functions, [$INDEX++] /*[this._maps.keys, col, row, this]*/)
        })

        if (o){
            if (operationDef.display) o.display = operationDef.display
        
            if (operationDef.options){
                Object.assign(o, operationDef.options)
            }
        }

    }
)
