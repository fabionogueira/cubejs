// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'SORT_COLS',
        description: 'Sorted Cols'
    },
    
    function(operationDef) {
        doSort(operationDef.dimension, this._maps.cols, operationDef.order)
    }
)

CubeJS.createOperation({
    name: 'SORT_ROWS',
        description: 'Sorted Rows'
    },

    function(operationDef) {
        doSort(operationDef.dimension, this._maps.rows, operationDef.order)
    }
)

function doSort(dimension, arr, order){
    let i

    arr._sorted = false

    if (dimension){
        for (i=0; i<arr.length; i++){
            findDimension(arr, arr[i], dimension, order)
            if (arr._sorted) return
        }
    } else {
        applySort(arr, true, order)
    }
}

function findDimension(arr, item, dimension, order){
    let i

    arr._sorted = false

    if (item.dimension == dimension){
        return applySort(arr, null, order)
    }

    if (item.children){
        for (i=0; i<item.children.length; i++){
            findDimension(item.children, item.children[i], dimension, order)
            if (item.children._sorted) return
        }
    }
}

function applySort(arr, includeChildren=false, order){
    if (arr._sorted) return

    if (includeChildren){
        arr.forEach(item => {
            if (item.dimension && item.children){
                applySort(item.children, includeChildren, order)
            }
        })
    }
    
    if (order == 'asc'){
        arr.sort((o1, o2) => {
            return (o1.summary || o2.summary) ? 0 : (o1.display < o2.display ? -1 : o1.display > o2.display ? 1 : 0)
        })
    } else if (order == 'desc') {
        arr.sort((o1, o2) => {
            return (o1.summary || o2.summary) ? 0 : (o1.display > o2.display ? -1 : o1.display < o2.display ? 1 : 0)
        })
    }

    // atualiza _index
    arr.forEach((item, index) => {
        item._index = index
    })

    arr._sorted = true
}