// @ts-check

import CubeJS from '../cubejs'

CubeJS.createOperation({
        name: 'SORT_COLS',
        description: 'Sorted Cols'
    },
    
    function(operationDef) {
        doSort(operationDef.dimension, this._maps.cols)
    }
)

CubeJS.createOperation({
    name: 'SORT_ROWS',
        description: 'Sorted Rows'
    },

    function(operationDef) {
        doSort(operationDef.dimension, this._maps.rows)
    }
)

function doSort(dimension, arr){
    let i

    arr._sorted = false

    if (dimension){
        for (i=0; i<arr.length; i++){
            findDimension(arr, arr[i], dimension)
            if (arr._sorted) return
        }
    } else {
        applySort(arr, true)
    }
}

function findDimension(arr, item, dimension){
    let i

    arr._sorted = false

    if (item.dimension == dimension){
        return applySort(arr)
    }

    if (item.children){
        for (i=0; i<item.children.length; i++){
            findDimension(item.children, item.children[i], dimension)
            if (item.children._sorted) return
        }
    }
}

function applySort(arr, includeChildren=false){
    if (arr._sorted) return

    if (includeChildren){
        arr.forEach(item => {
            if (item.dimension && item.children){
                applySort(item.children, includeChildren)
            }
        })
    }
    
    arr.sort((o1, o2) => {
        return (o1.summary || o2.summary) ? 0 : (o1.display < o2.display ? -1 : o1.display > o2.display ? 1 : 0)
    })

    // atualiza _index
    arr.forEach((item, index) => {
        item._index = index
    })

    arr._sorted = true
}