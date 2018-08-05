// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'MERGE_ROWS', 
        description: 'Merged Rows'
    },

    function(operationDef) {
        this.mergeRows(operationDef)
    }
)
