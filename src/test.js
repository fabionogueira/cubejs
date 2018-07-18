import CubeJS from './libs/cubejs'

CubeJS.defaults({
    // precision: 4
})

let cubejs = new CubeJS({
    // dimensões sempre primeiro, métricas no fim
    rows: [
        {dimension:'marca'}, 
        {measure:'count', precision:0}, 
        {measure:'min', precision:0}
    ],
    // dimensões sempre primeiro, métricas no fim
    cols: [
        {dimension:'modelo'}, 
        {dimension:'calibre'}
    ]
})

cubejs.addOperation({
    key: 'op1',
    operation: 'custom',
    target: 'row',
    position: 'after',
    reference: 'rossi',
    display: 'principais',
    precision: 0,
    options: {
        summary: true
    },
    expression: 'SUM("taurus", "rossi")'
})
cubejs.addOperation({
    key: 'op2',
    operation: 'custom',
    target: 'row',
    position: 'after',
    reference: 'op1',
    display: 'percentual',
    suffix: '%',
    options: {
        summary: true
    },
    expression: 'SUM("taurus", "rossi") / RANGE("taurus", "rossi")'
    /* value(){
        let range = this.$RANGE('taurus', 'rossi')
        let v = this.$SUM('taurus', 'rossi')

        return v / range.length
    } */
})

cubejs.addOperation({
    key: 'op2',
    target: 'row',
    expression: 'SUMMARY()',
    // operation: 'summary',
    display: 'total',
    precision: 0
})

cubejs.addOperation({
    key: 'op2',
    operation: 'summary',
    target: 'col'
})

cubejs.setData([
    {calibre:'38', modelo:'revolver', marca:'taurus', count: 5, min:0},
    {calibre:'38', modelo:'revolver', marca:'rossi', count: 2, min:2},
    {calibre:'38', modelo:'espingarda', marca:'taurus', count: 3, min:1},
    {calibre:'38', modelo:'espingarda', marca:'cbc', count: 4, min:3},
    {calibre:'380', modelo:'pistola', marca:'taurus', count: 4, min:1},
    {calibre:'380', modelo:'pistola', marca:'glock', count: 1, min:0},
    {calibre:'.40', modelo:'pistola', marca:'glock', count: 6, min:3}, 
    {calibre:'22', modelo:'revolver', marca:'cbc', count: 1, min:1}
])

cubejs.renderTo(document.getElementById('container-id'))
