// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'MERGE_COLS', 
        description: 'Merged Cols'
    },

    function(operationDef) {
        this.mergeCols(operationDef)
    }
)
