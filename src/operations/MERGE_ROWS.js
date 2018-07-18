// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation('MERGE_ROWS', function(operationDef) {
    let row
    let v = ''
    let s = ''
    let op = CubeJS.getOperation('ADD_ROW')

    // prepara código de chamada da função VALUES
    operationDef.references.forEach(item => {
        s += `${v}"${item}"`
        v = ','
    })
    
    // cria a linha nova
    op.call(this, {
        key: operationDef.key,
        position: operationDef.position || 'last',
        reference: operationDef.reference,
        expression: `SUM(VALUES(${s}))`,
        display: operationDef.display
    })

    // remove as linhas envolvidas na concatenação
    operationDef.references.forEach(item => {
        row = this.findRow(item)

        if (row){
            this.removeRow(row)
        }
    })
    
})
