// @ts-check

import CubeJS from '../cubejs'
import Functions from '../functions/Functions'

CubeJS.createOperation({
        name: 'ADD_COL',
        description: 'Added Column' 
    }, 
    
    function(operationDef){
        let o, f
        let $INDEX = 0
        let context = {}
        let functions = new Functions(this, context)
        let calculatedOptions = {
            key: operationDef.key,
            position: operationDef.position,
            keyRef: operationDef.reference,
            summary: operationDef.summary ? 'col' : null
        }

        // calcula os valores da coluna, linha a linha
        o = this._createCalculatedCol(calculatedOptions, operationDef, (row, col) => {  
             
            f = Functions.compile(operationDef.expression)

            // linha atual da nova coluna
            context.activeRow = row
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
