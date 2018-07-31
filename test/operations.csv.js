export default [
    // {
    //     operation: 'REMOVE_ROW',
    //     reference: 'France'
    // }

    {
        key: 'opSortRows',
        operation: 'SORT_ROWS',
        dimension: 'Country'
    },

    {
        key: 'opSortCols',
        operation: 'SORT_COLS',
        dimension: 'Year'
    },

    {
        key: 'Gover_Total',
        operation: 'ADD_COL',
        position: 'after',
        reference: 'Government2014',
        expression: 'SUM(VALUES("Government2013", "Government2014"))',
        display: 'Gover Total',
        summary: true
    },

    {
        key: 'Gover_Diff',
        operation: 'ADD_COL',
        position: 'after',
        reference: 'Gover_Total',
        expression: 'IF(VALUE("Government2013") - $("Government2014") > 0, 1, 0)',
        display: 'Gover Diff',
        summary: true
    },

    {
        key: 'Gover_Accum_2014',
        operation: 'ADD_COL',
        position: 'after',
        reference: 'Gover_Diff',
        expression: '$("Government2014") + VALUEX("Gover_Accum_2014", $INDEX - 1)',
        display: 'Accum 2014',
        summary: true
    },

    {
        key: 'Accum_France',
        operation: 'ADD_ROW',
        position: 'after',
        reference: 'France',
        expression: '$("FranceSale Price") + VALUEX("Accum_France", $INDEX - 1)',
        display: 'Accum France',
        summary: true
    },

    {
        key: 'opShowTotalRow',
        operation: 'ADD_ROW',
        expression: 'SUM()',
        display: 'total',
        priority: 1000
    },

    {
        key: 'opShowTotalCol',
        operation: 'ADD_COL',
        expression: 'SUM()',
        display: 'total',
        priority: 1000
    },

    // {
    //     key: 'op_principais',
    //     operation: 'ADD_ROW',
    //     position: 'after',
    //     reference: 'Germany',
    //     expression: 'SUM(VALUES())',
    //     display: 'Channel Partners Total'
    // }

    {
        key: 'traduzir',
        operation: 'ALIAS',
        values: {
            'Government': 'Governamental',
            'Midmarket': 'Mercado',
            'Channel Partners': 'Parceiros do Canal',
            'Sale Price': 'Preço',
            'Manufacturing Price': 'Custo',
            'Profit': 'Lucro',
            'United States of America': 'USA'
        }
    },

    // {
    //     key: 'merge-01',
    //     operation: 'MERGE_COLS',
    //     references: ['Midmarket', 'Government'],
    //     display: "MERGE",
    //     position: 'before',
    //     reference: 'Channel Partners'
    // }

    {
        key: 'merge-america',
        operation: 'MERGE_ROWS',
        references: ['Canada', 'Mexico', 'United States of America'],
        display: 'America'
    },

    {
        key: 'merge-europe',
        operation: 'MERGE_ROWS',
        references: ['Germany', 'France'],
        display: 'Europe'
    }
]
