// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'REMOVE_ROW',
        description: 'Removed Row'
    },
    
    function(operationDef) {
        let arr
        let row = this.findRow(operationDef.reference)

        if (row){
            arr = row.parent ? row.parent : this.getMaps().rows
            arr.splice(row._index, 1)

            // atualiza _index
            arr.forEach((item, index) => {
                item._index = index
            })
        }
    }
)
