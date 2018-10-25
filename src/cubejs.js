// @ts-check

import DataFormat from './data-format'

let operations = {}
let instanceId = 0
let dataId = 0;
let adapters = {}
let DEFAULT_OPERATION_OPTIONS = {
    position: 'last',
    priority: 0,
    prefix: '', 
    suffix: '', 
    format: '',
    precision: 2,
    thousand: ',',
    decimal: '.'
}

export default class CubeJS {

    static registerAdapter(name, definition){
        adapters[name] = definition
    }

    /*
     * 
     * @ param {*} name 
     * @ param {{priority?:number, init:function}} definition 
     */
    static createOperation(options, callback){
        operations[options.name] = {options, callback}
    }

    static getOperation(name){
        return operations[name]
    }

    static defaults(def){
        Object.assign(DEFAULT_OPERATION_OPTIONS, def)
    }

    /**
     * @param {{rows:Array<any>, cols:Array<any>, filters?:Array<any>}} definition 
     */
    constructor(definition){
        this._instanceId = instanceId++
        this._definition = definition
        this._dataset = []
        this._maps = {
            keys: {},
            rows: [],
            cols: []
        }
        this._aggregations = {}
        this._dimensions = {}
        this._measures = {}
        this._operations = []
        this._operationsKeys = {}
        this._categoryAlias = {}
        this._CACHE = {
            findRow:{},
            findCol:{},
            formatMeasure: {}
        }

        definition.rows.forEach((item, index) => {
            definition.rows[index] = Object.assign({}, DEFAULT_OPERATION_OPTIONS, item)
            
            item.$categoriesOf = 'row'

            if (item.dimension) this._dimensions[item.dimension] = item
            if (item.measure) this._measures[item.measure] = item
        })
        definition.cols.forEach((item, index) => {
            definition.cols[index] = Object.assign({}, DEFAULT_OPERATION_OPTIONS, item)

            item.$categoriesOf = 'col'

            if (item.dimension) this._dimensions[item.dimension] = item
            if (item.measure) this._measures[item.measure] = item
        })
    }

    clone(){
        let clone = new CubeJS(this._definition)

        clone._operations = this._operations
        clone._operationsKeys = this._operationsKeys
        clone._categoryAlias = this._categoryAlias
        clone._aux = this._aux
        
        clone._calculatedFields = this._calculatedFields
        clone.setDataset(this._dataset)

        clone._headers = this._headers
        clone._maps = JSON.parse(JSON.stringify(this._maps))

        return clone
    }

    getDefinition(){
        return this._definition
    }

    setDataset(dataset){
        this._categoryAlias = {}
        this._dataId = dataId++
        this._dataset = dataset // adapter ? adapter.response(this, dataset) : dataset
        this._peddings = true

        // limpa todo o cache
        this.clearCache()

        // processa métricas calculadas
        if (this._calculatedFields){
            this._dataset.forEach(row => {
                for (let k in this._calculatedFields){
                    row[k] = this._calculatedFields[k].expression(row)
                }
            })
        }

        return this
    }

    applyOperations(force = false){
        if (this._peddings || force){

            this._headers = {}
            this._maps = {
                keys: {},
                rows: [],
                cols: []
            }

            console.log('applyOperations running')
            
            this._createAux()
            this._createKeysMap()
            this._createHead(this._definition.rows, this._maps.rows)
            this._createHead(this._definition.cols, this._maps.cols)
    
            // ordena as operações por prioridade
            this._operations.sort((o1, o2) => {
                return o1.priority - o2.priority
            })
    
            // executa as operações
            this._operations.forEach(def => { this._doOperation(def) })
        }
    }

    getQuery(){
        // let adapter = adapters[this._adapter]
        // return adapter ? adapter.request(this) : this._definition
    }

    // agrega valores de uma célula, somando todos os seus filhos
    aggregateByCategory(category){
        let maps = this._maps
        let f = this._dimensions[category.dimension]
        
        if (!f || !category.children){
            return
        }

        if (!category.aggr){
            category.aggr = {
                children: category.children,
                include: {},
                exclude: {}
            }
        }

        if (f.$categoriesOf == 'row'){
            maps.cols.forEach(c => {
                this.eachLeaf(c, leafCol => {
                    let s = 0
                    let k = leafCol.key + category.key
    
                    this.eachLeaf(category, leafRow => {
                        let k = leafCol.key + leafRow.key
                        let cell = maps.keys[k]
                        
                        if (cell){
                            s += cell.value
                            category.aggr.exclude[k] = maps.keys[k]
                            delete(maps.keys[k])
                        }
                    })
                    
                    category.aggr.include[k] = maps.keys[k] = {
                        value: s,
                        display: s
                    }
                })
            })
            
        } else if (f.$categoriesOf == 'col'){
            maps.rows.forEach(r => {
                this.eachLeaf(r, leafRow => {
                    let s = 0
                    let k = category.key + leafRow.key
    
                    this.eachLeaf(category, leafCol => {
                        let k = leafCol.key + leafRow.key
                        let cell = maps.keys[k]
                        
                        if (cell){
                            s += cell.value
                            category.aggr.exclude[k] = maps.keys[k]
                            delete(maps.keys[k])
                        }
                    })

                    category.aggr.include[k] = maps.keys[k] = {
                        value: s,
                        display: s
                    }
                })
            })
            
        }
        
        delete(category.children)
    }

    // desagrega valores de uma célula
    unAggregateByCategory(category){
        let k, o
        let keys = this._maps.keys
        let aggr = category.aggr
        
        if (aggr){
            category.children = aggr.children
            
            for (k in aggr.include){
                delete(keys[k])
            }

            for (k in aggr.exclude){
                o = aggr.exclude[k]
                keys[k] = o
            }

            delete(category.aggr)
        }
    }

    aggregateRowByLevel(level){
        this.forEach(this._maps.rows, (r) => {
            this.aggregateByCategory(r)
        }, level)        
    }

    aggregateColByLevel(level){
        this.forEach(this._maps.cols, (c) => {
            this.aggregateByCategory(c)
        }, level)
    }

    getMaps(){
        return this._maps
    }

    getColRangeValues(rowKey, start, end){
        return getColRangeValues(this, rowKey, start, end)
    }

    getRowRangeValues(colKey, start, end){
        return getRowRangeValues(this, colKey, start, end)
    }

    setAlias(aliasDefinition){
        Object.assign(this._categoryAlias, aliasDefinition)
    }

    /**
     * @param {{key:string, operation:string, target:string, position?:string, reference?:string, expression?:string, precision?, options?, display?, prefix?, suffix?}} definition 
     */
    addOperation(definition){
        let def, op

        if (definition.key && this._operationsKeys[definition.key])
            return
        
        op = operations[definition.operation]
        if (op){
            def = Object.assign({}, DEFAULT_OPERATION_OPTIONS, definition)
    
            if (definition.key){
                this._operationsKeys[def.key] = true
            }
    
            this._peddings = true
            this._operations.push(def)

            if (op.options.add){
                op.options.add.call(this, def)
            }

        }
    }

    removeOperation(key){
        let i

        if (this._operationsKeys[key]){
            delete (this._operationsKeys[key])
            
            i = this._operations.findIndex(def => { return def.key == key })
            if (i >= 0){
                this._peddings = true
                this._operations.splice(i, 1)
            }
        }
    }

    clearOperations(){
        this.clearCache()

        this._categoryAlias = {}
        this._operationsKeys = {}
        this._operations = []
        this._peddings = true
    }

    clearCache(){
        this._CACHE = {
            findRow:{},
            findCol:{},
            formatMeasure: {}
        }
    }

    removeRow(row){
        let arr
        let parent = this._getHeader(row.parentKey)

        arr = parent ? parent : this._maps.rows
        arr.splice(row._index, 1)

        // limpa o cache
        this._CACHE.findRow = {}

        // atualiza _index
        arr.forEach((item, index) => {
            item._index = index
        })
    }

    removeCol(col){
        let arr
        let parent = this._getHeader(col.parentKey)
        
        arr = parent ? parent : this._maps.cols
        arr.splice(col._index, 1)

        // limpa o cache
        this._CACHE.findCol = {}

        // atualiza _index
        arr.forEach((item, index) => {
            item._index = index
        })
    
    }

    createField(definition){
        this._calculatedFields = this._calculatedFields || {}
        this._calculatedFields[definition.key] = definition
    }

    mergeCols(definition){
        let cubejs = this
        let remove = []
        let obj, parent

        // obtém as colunas que serão removidas(colunas raiz) e a chave da coluna que será mesclada(no caso de mesclar filhos)
        definition.references.forEach(item => {
            let col = cubejs.findCol(item)
            
            if (col){
                parent = this._getHeader(col.parentKey)
                if (!parent) remove.push(col) // não remove agora pq generateHeaders precisa das colunas para montar o no header
            }
        })
        if (parent) definition.key = parent['key']
        obj = generateHeaders(cubejs, definition, 'col')
        remove.forEach(col => { cubejs.removeCol(col) })

        if (!obj){
            return
        }

        if (parent){
            parent['children'] = obj.root.children
        } else {
            cubejs._maps.cols.push(obj.root)
        }

        // calcula os valores
        cubejs.forEach(cubejs._maps.rows, row => {
            let k1, k2, v
            
            obj.leafs.forEach(item => {
                k1 = item.newHeadKey + row.key
                k2 = item.headKey + row.key

                if (cubejs._maps.keys[k1]){
                    v = cubejs._maps.keys[k1].value
                } else {
                    v = 0
                }

                v += cubejs._maps.keys[k2].value

                cubejs._maps.keys[k1] = {
                    value: v,
                    display: cubejs._formatMeasure(row.measure ? row.key : item.headKey, v)
                }
            })
        })
    }

    mergeRows(definition){
        let cubejs = this
        let obj, parent
        let remove = []

        definition.references.forEach(item => {
            let row = cubejs.findRow(item)
            
            if (row){
                parent = this._getHeader(row.parentKey)
                if (!parent) remove.push(row)
            }
        })
        if (parent) definition.key = parent['key']
        obj = generateHeaders(cubejs, definition, 'row')
        
        if (!obj){
            return
        }
        
        if (parent){
            parent['children'] = obj.root.children
        } else {
            remove.forEach(row => { cubejs.removeRow(row) })
            cubejs._maps.rows.push(obj.root)
        }

        // calcula os valores
        cubejs.forEach(cubejs._maps.cols, col => {
            let k1, k2, v
            
            obj.leafs.forEach(item => {
                k1 = col.key + item.newHeadKey
                k2 = col.key + item.headKey

                if (cubejs._maps.keys[k1]){
                    v = cubejs._maps.keys[k1].value
                } else {
                    v = 0
                }

                v += cubejs._maps.keys[k2].value

                cubejs._maps.keys[k1] = {
                    value: v,
                    display: cubejs._formatMeasure(col.measure ? col.key : item.headKey, v),
                }
            })
        })
    }

    findRow(key){
        let r = this._CACHE.findRow[key]

        if (!r){
            r = this._findCategoryHead(key, 'rows')
            this._CACHE.findRow[key] = r
        }

        return r
    }

    findCol(key){
        let c = this._CACHE.findCol[key]

        if (!c){
            c = this._findCategoryHead(key, 'cols')
            this._CACHE.findCol[key] = c
        }

        return c
    }
    
    findLastRow(){
        let r = this._CACHE.findRow['_findLastRow_']

        if (!r){
            r = this._findLeafHead('rows')
            this._CACHE.findRow['_findLastRow_'] = r
        }

        return r
    }

    findLastCol(){
        let c = this._CACHE.findCol['_findLastCol_']

        if (!c){
            c = this._findLeafHead('cols')
            this._CACHE.findCol['_findLastCol_'] = c
        }

        return c
    }

    findFirstRow(){
        let r = this._CACHE.findCol['_findFirstRow_']

        if (!r){
            r = this._maps.rows[0]
            this._CACHE.findCol['_findFirstRow_'] = r
        }

        return r
    }

    findFirstCol(){
        let c = this._CACHE.findCol['_findFirstCol_']

        if (!c){
            c = this._maps.cols[0]
            this._CACHE.findCol['_findFirstCol_'] = c
        }

        return c
    }

    eachLeaf(item, callback){
        if (item){
            doEach(item)
        }
        
        function doEach(o){
            if (o.children){
                o.children.forEach(child => {
                    doEach(child)
                })
            } else {
                callback(o)
            }
        }
    }

    // TODO: implements cache
    forEach(arr, callback, level = -1){
        
        doForEach(arr, 0)
    
        function doForEach(arr, activeLevel){
            let i, item
    
            for (i = 0; i < arr.length; i++){
                item = arr[i]
                if (level == -1){
                    if (item.children){
                        doForEach(item.children, activeLevel)
                    } else {
                        callback(item)
                    }
                } else {
                    if (activeLevel == level){
                        callback(item)
                    } else if (item.children){
                        doForEach(item.children, activeLevel + 1)
                    }
                }
            }
        }
    }

    _doOperation(operationDef){
        let op = operations[operationDef.operation]

        if (op) {
            console.log(op.options.description)
            op.callback.call(this, operationDef)
        }

    }

    /**
     * @param {{position, key, summary?, measureOpt?, keyRef?}} calculatedOptions 
     * @param {Function} callback 
     */
    _createCalculatedRow(calculatedOptions, operationDef, callback){
        let v, arr, o, parent
        let row = calculatedOptions.position == 'last' ? this.findLastRow() : this.findRow(calculatedOptions.keyRef)
        
        if (row){
            parent = this._getHeader(row.parentKey)
            arr = parent ? parent.children : this._maps.rows
            o = {
                key: calculatedOptions.key,
                measure: calculatedOptions.key,
                caculated: true,
                summary: calculatedOptions.summary,
                parentKey: parent.key
            }
            
            this._aux.measures[calculatedOptions.key] = Object.assign({key:calculatedOptions.key}, DEFAULT_OPERATION_OPTIONS, operationDef)
    
            // limpa o cache
            this._CACHE.findRow = {}
            this._CACHE.formatMeasure = {}

            // calcula os valores das colunas
            this.forEach(this._maps.cols, col => {
                v = callback(col, row)
                this._maps.keys[col.key + calculatedOptions.key] = {
                    value: v,
                    display: this._formatMeasure(calculatedOptions.key, v),
                    summary: calculatedOptions.summary
                }
            })
            
            // adiciona a linha na posição definida
            if (calculatedOptions.position == 'after'){
                arr.splice(row._index + 1, 0, o)
            } else if (calculatedOptions.position == 'before'){
                arr.splice(row._index, 0, o)
            } else if (calculatedOptions.position == 'last'){
                arr.push(o)
            }

            // atualiza _index
            arr.forEach((item, index) => {
                item._index = index
            })
        }

        return o
    }

    _createCalculatedCol(calculatedOptions, operationDef, callback){
        let v, arr, o, parent
        let col = calculatedOptions.position == 'last' ? this.findLastCol() : this.findCol(calculatedOptions.keyRef)
        
        if (col){
            parent = this._getHeader(col.parentKey)
            arr = parent ? parent.children : this._maps.cols
            o = {
                key: calculatedOptions.key,
                measure: calculatedOptions.key,
                caculated: true,
                summary: calculatedOptions.summary,
                parentKey: parent.key
            }
        
            this._aux.measures[calculatedOptions.key] = Object.assign({key:calculatedOptions.key}, DEFAULT_OPERATION_OPTIONS, operationDef)
    
            // limpa o cache
            this._CACHE.findCol = {}
            this._CACHE.formatMeasure = {}

            // calcula os valores das linhas
            this.forEach(this._maps.rows, row => {
                v = callback(row, col)
                this._maps.keys[calculatedOptions.key + row.key] = { // key + r.key = chave da coluna + chave da linha, sempre nessa ordem
                    value: v,
                    display: this._formatMeasure(calculatedOptions.key, v),
                    summary: calculatedOptions.summary
                }
            })
    
            if (calculatedOptions.position == 'after'){
                arr.splice(col._index + 1, 0, o)
            } else if (calculatedOptions.position == 'before'){
                arr.splice(col._index, 0, o)
            } else if (calculatedOptions.position == 'last'){
                arr.push(o)
            }
            
            // atualiza _index
            arr.forEach((item, index) => {
                item._index = index
            })
        }
        
        return o
    }

    _createHead(def, root){
        let self = this
        let exists = {}

        this._dataset.forEach(row => {
            processDataRow(row, 0, '', root)
        })
        
        function processDataRow(dataRow, defIndex, parentKey, children){
            let k, o, a, d, item
    
            item = def[defIndex]
    
            if (item && (item.dimension || item.measure)){
                
                if (item.dimension){
                    d = dataRow[item.dimension]
                    a = []
                    k = parentKey + d
                    o = {
                        key: k,
                        dimension: item.dimension,
                        category: d,
                        display: self._formatCategory(item, self._categoryAlias[d] || d),
                        parentKey: null,
                        children: null,
                        _index: null
                    }
                    
                    if (!exists[k]){
                        self._headers[k] = o
                        exists[k] = {
                            children: a,
                            item: o
                        }
                        o._index = children.length
                        children.push(o)
                        o.parentKey = parentKey
                        processDataRow(dataRow, defIndex + 1, k, a)
                        
                        if (a.length > 0){
                            o.children = a
                        }
                    } else {
                        processDataRow(dataRow, defIndex + 1, k, exists[k].children)
                    }
    
                } else {
                    k = parentKey + item.measure
                    o = {
                        key: k,
                        measure: item.measure,
                        display: self._categoryAlias[item.measure] || item.display || item.measure,
                        parentKey: null,
                        _index: null
                    }
                    
                    if (!exists[k]){
                        self._headers[k] = o
                        exists[k] = {
                            children,
                            item: o
                        }
                        o._index = children.length
                        children.push(o)
                        o.parentKey = parentKey
                        processDataRow(dataRow, defIndex + 1, parentKey, children)
                    } else {
                        processDataRow(dataRow, defIndex + 1, parentKey, exists[k].children)
                    }
                } 
            }
        }
    }

    _getHeader(key){
        return this._headers[key]
    }

    // cria this._maps.keys
    _createKeysMap(){
        let i, s, k, item
        let aux = this._aux
        
        this._dataset.forEach(r => {
            s = ''

            for (i = 0; i < aux.all.length; i++){
                item = aux.all[i]

                if (item.dimension){
                    if (r.hasOwnProperty(item.dimension)){
                        s += r[item.dimension]
                    }
                }

                if (item.measure){
                    // métrica de coluna ou de linha
                    if (aux.colmap[item.measure] || aux.rowmap[item.measure]){
                        s += '{measure}'
                    }
                }
            }

            for (i in aux.measures){
                if (r[i] !== undefined){
                    k = s.replace('{measure}', i).replace('{measure}', '').replace('{measure}', '')
                    this._maps.keys[k] = {
                        value: r[i],
                        display: this._formatMeasure(i, r[i])
                    }
                }
            }
        })
    }

    _findCategoryHead(key, head){
        let i
        let headItem = null
        let children = arguments[2] || this._maps[head]

        for (i = 0; i < children.length; i++){
            if (children[i].key == key){
                return children[i]
            }

            if (children[i].children){
                headItem = this._findCategoryHead(key, head, children[i].children)
                if (headItem) return headItem
            }
        }

        return null
    }

    _findLeafHead(head){
        let index = this._maps[head].length - 1
        return this._maps[head][index]
    }

    _createAux() {
        let rowsdef = this._definition.rows
        let colsdef = this._definition.cols
        let aux = {
            measures: {},
            dimensions: {},
            colmap: {},
            rowmap: {},
            all: colsdef.concat(rowsdef)
        }
    
        aux.all.forEach(item => {
            if (item.measure){
                aux.measures[item.measure] = item
            } else {
                aux.dimensions[item.dimension] = item
            }
        })
    
        colsdef.forEach(item => { aux.colmap[item.measure || item.dimension] = item })
        rowsdef.forEach(item => { aux.rowmap[item.measure || item.dimension] = item })
    
        this._aux = aux
    }

    _formatMeasure(measure, value){
        let formated, def, num, rest

        this._CACHE.formatMeasure[measure] = this._CACHE.formatMeasure[measure] || {}
        formated = this._CACHE.formatMeasure[measure][value]

        if (formated == undefined){
            def = this._aux.measures[measure]
            num = parseInt(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${def.thousand}`)
            rest = value.toFixed(def.precision).split('.')[1] || ''
            
            formated = def.prefix + num + (rest ? def.decimal : '') + rest + def.suffix
            this._CACHE.formatMeasure[measure][value] = formated
        }

        return formated
    }

    _formatCategory(category, value){
        value = DataFormat.Text.format(category, value)
        return value
    }

}

function getColRangeValues(cubejs, rowKey, kstart, kend) {
    let parent
    let aux, arr, start, end
    let range = []

    start = cubejs.findCol(kstart)
    end = cubejs.findCol(kend)

    if (end._index < start._index){
        aux = start
        start = end
        end = aux
    }

    parent = this._getHeader(start.parentKey)

    arr = parent ? parent.children : cubejs._maps.cols
    arr.forEach((item, index) => {
        if (index <= end._index){
            
            cubejs.eachLeaf(item, leaf => {
                let k = leaf.key + rowKey
                let m = cubejs._maps.keys[k]
                
                if (m && m.summary != 'col'){
                    range.push(m ? m.value : 0)
                }

            })
        }
    })

    return range
}

function getRowRangeValues(cubejs, colKey, kstart, kend) {
    let parent
    let aux, arr, start, end
    let range = []
    
    start = cubejs.findRow(kstart)
    end = cubejs.findRow(kend)

    if (end._index < start._index){
        aux = start
        start = end
        end = aux
    }

    parent = this._getHeader(start.parentKey)

    arr = parent ? parent.children : cubejs._maps.rows
    arr.forEach((item, index) => {
        if (index <= end._index){
            cubejs.eachLeaf(item, leaf => {
                let k = colKey + leaf.key
                let m = cubejs._maps.keys[k]

                if (m && m.summary != 'row'){
                    range.push(m ? m.value : 0)
                }
            })
        }
    })

    return range
}

function generateHeaders(cubejs, operationDef, finder){
    let headers = {}
    let leafs = []
    let root = {
        key: operationDef.key,
        display: operationDef.display
    }
    let headCreated = false

    operationDef.references.forEach(k => {
        let o = finder == 'row' ? cubejs.findRow(k) : cubejs.findCol(k)

        if (o){
            headCreated = true
            process(root, o)
        }
    })

    return headCreated ? {root, leafs} : null

    function process(newHead, activeHead){
        let key

        if (activeHead.children){
            newHead.children = newHead.children || []
            
            activeHead.children.forEach(child => {
                key = newHead.key + (child.category || child.measure)
                
                if (!headers[key]){
                    headers[key] = {
                        key: key,
                        display: child.display,
                        dimension: child.dimension,
                        measure: child.measure,
                        parentKey: newHead.key,
                        _index: newHead.children.length
                    }
                    newHead.children.push(headers[key])
                }

                process(headers[key], child)
            })
        } else {
            leafs.push({
                newHeadKey: newHead.key,
                headKey: activeHead.key
            })
        }
    }
}
