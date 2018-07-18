export default function(cube){
    cube.addOperation({
        key: 'opShowTotalRow',
        operation: 'ADD_ROW',
        expression: 'SUMMARY()',
        display: 'total',
        priority: 1000
    })

    cube.addOperation({
        key: 'opShowTotalCol',
        operation: 'ADD_COL',
        expression: 'SUMMARY()',
        display: 'total',
        priority: 1000
    })

    /*cube.addOperation({
        key: 'op_principais',
        operation: 'ADD_COL',
        position: 'after',
        reference: '87',
        expression: 'SUM(VALUES("94", "85 S", "87"))',
        display: 'principais'
    })

    /*cube.addOperation({
        operation: 'REMOVE_ROW',
        reference: 'TAURUS'
    })

    cube.addOperation({
        operation: 'REMOVE_ROW',
        reference: 'ROSSI'
    })

    cube.addOperation({
        operation: 'REMOVE_ROW',
        reference: 'CBC'
    }) */

    /*cube.addOperation({
        key: 'merge-pt',
        operation: 'MERGE_COLS',
        references: ['PT 24/7 PRÓ', 'PT 24/7', 'PT 100'],
        display: "PT's"
    })

    cube.addOperation({
        key: 'merge-38',
        operation: 'MERGE_ROWS',
        references: ['38', '.38', '38 SPL', '0,38', '38 SPECIAL'],
        display: '38'
    })*/

    cube.applyOperations()
}
