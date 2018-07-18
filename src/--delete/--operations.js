import CubeJS from './cubejs'
import Functions from './functions'

CubeJS.createOperation('summary', {
    priority: 20,
    init(cubejs, operationDef){
        let o, m
        let measureOpt = cubejs.defaultMeasureOptions(null, operationDef)

        if (operationDef.target == 'row'){
            o = cubejs.createCalculatedRow({ key: 'r_summary', position: 'last', measureOpt }, (col) => {   
                let summary = 0;
                
                cubejs.forEach(cubejs._maps.rows, row => {
                    let v
                    
                    if (!row.summary){
                        m = cubejs._maps.keys[col.key + row.key]
                        v = (m ? m.value : 0)
                        summary += v
                    }
                })
            
                return summary
            })

            o.display = operationDef.display || 'summary'
            o.summary = true
        
        } else if (operationDef.target == 'col'){
            o = cubejs.createCalculatedCol({ key: 'c_summary', position: 'last', measureOpt }, (row) => {   
                let summary = 0;
                
                cubejs.forEach(cubejs._maps.cols, col => {
                    let v
                    
                    if (!col.summary){
                        m = cubejs._maps.keys[col.key + row.key]
                        v = (m ? m.value : 0)
                        summary += v
                    }
                })
            
                return summary
            })

            o.summary = true
            o.display = operationDef.display || 'summary'
        }
    }
})

CubeJS.createOperation('custom', {
    priority: 1,
    init(cubejs, operationDef){
        let o
        let context = {}
        let functions = new Functions(cubejs, context)
        let measureOpt = cubejs.defaultMeasureOptions(null, operationDef)
        let options = {
            key: operationDef.key,
            position: operationDef.position || 'last',
            keyRef: operationDef.reference,
            measureOpt
        }

        if (operationDef.target == 'row'){
            // define o contexto das funções
            context.type = 'row'
            o = cubejs.createCalculatedRow(options, (col, row) => {
                // define a coluna atual do contexto das funções
                context.col = col
                return operationDef.value.apply(functions, [cubejs._maps.keys, col, row, cubejs])
            })

        } else if (operationDef.target == 'col'){
            context.type = 'col'
            o = cubejs.createCalculatedCol(options, (row, col) => {   
                context.row = row
                return operationDef.value.apply(functions, [cubejs._maps.keys, col, row, cubejs])
            })
        }

        if (operationDef.display) o.display = operationDef.display

        if (operationDef.options){
            Object.assign(o, operationDef.options)
        }
    }
})
