// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'ALIAS',
        description: 'Apply Alias',
        add(def){
            this.setAlias(def.values)
        }
    },
    
    function() {
    }
)
