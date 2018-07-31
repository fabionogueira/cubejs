// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'MERGE_ROWS', 
        description: 'Merged Rows'
    },

    function(operationDef) {
        let cubejs = this
        let keys = {}
        let newRows = {}
        
        function mergeChildren(activeCol, keyRow, keyNewRow, parent){
            let i, k1, k2, v, activeRow, obj

            activeRow = cubejs.findRow(keyRow)
            
            if (activeRow){
                obj = newRows[keyNewRow] = newRows[keyNewRow] || {
                    key: keyNewRow,
                    parent: parent,
                    dimension: activeRow.dimension,
                    measure: activeRow.measure,
                    childrenEx: {}
                }

                if (parent && parent.children && !parent.childrenEx[keyNewRow]){
                    parent.childrenEx[keyNewRow] = true
                    obj._index = parent.children.length
                    parent.children.push(obj)
                }
                
                if (activeRow.children){
                    obj.children = obj.children || []
                    activeRow.children.forEach(child => {
                        mergeChildren(activeCol, child.key, keyNewRow + (child.dimension || child.measure), obj)
                    })

                } else {
                    k1 = activeCol.key + activeRow.key
                    k2 = activeRow.dimension || activeRow.measure

                    v = cubejs._maps.keys[k1].value + (keys[k2] ? keys[k2] : 0)
                    keys[k2] = v
                }
                
            }
            
            for (i in keys){
                cubejs._maps.keys[activeCol.key + operationDef.key + i] = {
                    value: keys[i],
                    display: keys[i]
                }
            }

            return obj
        }

        cubejs.forEach(cubejs._maps.cols, col => {
            keys = {}
            operationDef.references.forEach(keyRow => {
                let o = mergeChildren(col, keyRow, operationDef.key, null)
                o.display = o.category = operationDef.display
            })
        })

        let root = newRows[operationDef.key]

        for (let i in newRows){
            delete (newRows[i].childrenEx)
        }

        cubejs._maps.rows.push(root)
        console.log(root)
 
        // remove as linhas envolvidas na concatenação
        operationDef.references.forEach(item => {
            let row = this.findRow(item)

            if (row){
                cubejs.removeRow(row)
            }
        })
        
    }
)
