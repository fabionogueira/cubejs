// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation('MERGE_COLS', function(operationDef) {
    let col
    let v = ''
    let s = ''
    let op = CubeJS.getOperation('ADD_COL')

    // prepara código de chamada da função VALUES
    operationDef.references.forEach(item => {
        s += `${v}"${item}"`
        v = ','
    })
    
    // cria a coluna nova
    op.call(this, {
        key: operationDef.key,
        position: operationDef.position || 'last',
        reference: operationDef.reference,
        expression: `SUM(VALUES(${s}))`,
        display: operationDef.display
    })

    // remove as colunas envolvidas na concatenação
    operationDef.references.forEach(item => {
        col = this.findCol(item)

        if (col){
            this.removeCol(col)
        }
    })
    
})
