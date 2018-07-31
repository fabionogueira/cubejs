// @ts-check

import {Functions} from './Functions'

/**
 * Retorna um array com os valores das chaves/intervalo
 *  case 01: VALUES('key1', 'key2', 'key3')
 *  case 02: VALUES() // retorna toda a linha/coluna
 */

Functions.create('COL_VALUE', function(rowKey, key) {
    let m
    let cubejs = this.instance
    
    m = cubejs._maps.keys[key + rowKey]
    return (m ? m.value : 0)
})

Functions.create('ROW_VALUE', function(colKey, key) {
    let m
    let cubejs = this.instance
    
    m = cubejs._maps.keys[colKey + key]
    return (m ? m.value : 0)    
})

Functions.create('VALUE', function(key) {
    let context = this.context
    return context.activeRow ? this.COL_VALUE(context.activeRow.key, key) : this.ROW_VALUE(context.activeCol.key, key)
})

Functions.create('VALUEX', function(key, index) {
    let context = this.context
    let cubejs = this.instance
    let m, k
    
    if (this._VI == undefined){
        this._VI = []
    }
    
    k = this._VI[index] // chave da linha referência de "index"

    if (context.activeRow){
        m = cubejs._maps.keys[key + k]
        this._VI.push(context.activeRow.key)
    } else {
        m = cubejs._maps.keys[k + key]
        this._VI.push(context.activeCol.key)
    }
    
    return m ? m.value : 0
})

Functions.create('$', function(key) {
    return this.VALUE(key)
})
