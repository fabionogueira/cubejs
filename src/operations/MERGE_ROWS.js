// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'MERGE_ROWS', 
        description: 'Merged Rows'
    },

    function(operationDef) {
        let cubejs = this
        let obj = generateRows(cubejs, operationDef)

        // adciona a nova linha e remove as linhas concatenadas
        cubejs._maps.rows.push(obj.root)
        operationDef.references.forEach(item => {
            let row = this.findRow(item)

            if (row){
                cubejs.removeRow(row)
            }
        })

        // calcula os valores
        cubejs.forEach(cubejs._maps.cols, col => {
            let k1, k2, v
            
            obj.leafs.forEach(item => {
                k1 = col.key + item.newRow
                k2 = col.key + item.row

                if (cubejs._maps.keys[k1]){
                    v = cubejs._maps.keys[k1].value
                } else {
                    v = 0
                }

                v += cubejs._maps.keys[k2].value

                cubejs._maps.keys[k1] = {
                    value: v,
                    display: v
                }
            })
        })
        
    }
)

function generateRows(cubejs, operationDef){
    let rows = {}
    let leafs = []
    let root = {
        key: operationDef.key,
        display: operationDef.display
    }

    operationDef.references.forEach(k => {
        let row = cubejs.findRow(k)

        if (row){
            process(root, row)
        }
    })

    return {root, leafs}

    function process(newRow, activeRow){
        let key

        if (activeRow.children){
            newRow.children = newRow.children || []
            
            activeRow.children.forEach(child => {
                key = newRow.key + (child.category || child.measure)
                
                if (!rows[key]){
                    rows[key] = {
                        key: key,
                        display: child.display,
                        dimension: child.dimension,
                        measure: child.measure,
                        parent: newRow,
                        _index: newRow.children.length
                    }
                    newRow.children.push(rows[key])
                }

                process(rows[key], child)
            })
        } else {
            leafs.push({
                newRow: newRow.key,
                row: activeRow.key
            })
        }
    }
}
