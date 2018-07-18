// @ts-check

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
    static createOperation(name, fn){
        operations[name] = fn
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
    constructor(definition, adapter = null){
        this._instanceId = instanceId++
        this._definition = definition
        this._data = []
        this._maps = {
            keys: {},
            rows: [],
            cols: []
        }
        this._operations = []
        this._operationsKeys = {}

        definition.rows.forEach((item, index) => {
            definition.rows[index] = Object.assign({}, DEFAULT_OPERATION_OPTIONS, item)
        })
        definition.cols.forEach((item, index) => {
            definition.cols[index] = Object.assign({}, DEFAULT_OPERATION_OPTIONS, item)
        })

        this._adapter = adapter
    }

    getDefinition(){
        return this._definition
    }

    setData(data, applyOperations = true){
        let adapter = adapters[this._adapter]

        this._dataId = dataId++
        this._data = adapter ? adapter.response(this, data) : data

        if (applyOperations){
            this.applyOperations(true)
        }
    }

    applyOperations(force = false){
        if (this._peddings || force){

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
        let adapter = adapters[this._adapter]
        return adapter ? adapter.request(this) : this._definition
    }

    getMaps(){
        return this._maps
    }

    categotyAlias(aliasDefinition){
        this._categotyAlias = aliasDefinition
    }

    /**
     * @param {{key:string, operation:string, target:string, position?:string, reference?:string, expression?:string, precision?, options?, display?, prefix?, suffix?}} definition 
     */
    addOperation(definition){
        let def

        if (definition.key && this._operationsKeys[definition.key]) return
        
        def = Object.assign({}, DEFAULT_OPERATION_OPTIONS, definition)

        if (definition.key){
            this._operationsKeys[def.key] = true
        }

        this._peddings = true
        this._operations.push(def)
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

    removeRow(row){
        let arr

        arr = row.parent ? row.parent : this._maps.rows
        arr.splice(row._index, 1)

        // atualiza _index
        arr.forEach((item, index) => {
            item._index = index
        })
    }

    removeCol(col){
        let arr
        
        arr = col.parent ? col.parent : this._maps.cols
        arr.splice(col._index, 1)

        // atualiza _index
        arr.forEach((item, index) => {
            item._index = index
        })
    
    }

    findRow(key){
        return this._findCategoryHead(key, 'rows')
    }

    findCol(key){
        return this._findCategoryHead(key, 'cols')
    }
    
    findLastRow(){
        return this._findLeafHead('rows')
    }

    findFirstRow(){
        return this._maps.rows[0]
    }

    findFirstCol(){
        return this._maps.cols[0]
    }

    findLastCol(){
        return this._findLeafHead('cols')
    }

    eachLeaf(item, callback){
        doEach(item)
        
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
        
        doForEach(arr, level)
    
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
            op.call(this, operationDef)
        }

    }

    /**
     * @param {{position, key, measureOpt?, keyRef?}} calculatedOptions 
     * @param {Function} callback 
     */
    _createCalculatedRow(calculatedOptions, operationDef, callback){
        let v, arr, o
        let row = calculatedOptions.position == 'last' ? this.findLastRow() : this.findRow(calculatedOptions.keyRef)
        
        if (row){
            arr = row.parent ? row.parent.children : this._maps.rows
            o = {
                key: calculatedOptions.key,
                measure: calculatedOptions.key,
                caculated: true
            }
            
            this._aux.measures[calculatedOptions.key] = Object.assign({key:calculatedOptions.key}, DEFAULT_OPERATION_OPTIONS, operationDef)
    
            // calcula os valores das colunas
            this.forEach(this._maps.cols, col => {
                v = callback(col, row)
                this._maps.keys[col.key + calculatedOptions.key] = {
                    value: v,
                    display: this._formatMeasure(calculatedOptions.key, v)
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
        let v, arr, o
        let col = calculatedOptions.position == 'last' ? this.findLastCol() : this.findCol(calculatedOptions.keyRef)
        
        if (col){
            arr = col.parent ? col.parent.children : this._maps.cols
            o = {
                key: calculatedOptions.key,
                measure: calculatedOptions.key,
                caculated: true
            }
        
            this._aux.measures[calculatedOptions.key] = Object.assign({key:calculatedOptions.key}, DEFAULT_OPERATION_OPTIONS, operationDef)
    
            // calcula os valores das linhas
            this.forEach(this._maps.rows, row => {
                v = callback(row, col)
                this._maps.keys[calculatedOptions.key + row.key] = { // key + r.key = chave da coluna + chave da linha, sempre nessa ordem
                    value: v,
                    display: this._formatMeasure(calculatedOptions.key, v)
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

    // cria this._maps.keys
    _createKeysMap(){
        let i, s, k, item
        let aux = this._aux
        
        this._data.forEach(r => {
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
                    k = s.replace('{measure}', i).replace('{measure}', '')
                    this._maps.keys[k] = {
                        value: r[i],
                        display: this._formatMeasure(i, r[i])
                    }
                }
            }
        })
    }

    _formatMeasure(measure, value){
        let def = this._aux.measures[measure]
        let num = parseInt(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${def.thousand}`)
        let rest = value.toFixed(def.precision).split('.')[1] || ''
        
        return def.prefix + num + (rest ? def.decimal : '') + rest + def.suffix
    }

    _createHead(def, root){
        let exists = {}
    
        this._data.forEach(row => {
            processDataRow(row, 0, '', root, null)
        })
    
        function processDataRow(dataRow, defIndex, parentKey, parentArr, parentObj){
            let k, o, a, item
    
            item = def[defIndex]
    
            if (item && (item.dimension || item.measure)){
                
                if (item.dimension){
                    a = []
                    k = parentKey + dataRow[item.dimension]
                    o = {
                        key: k,
                        dimension: item.dimension,
                        categoty: dataRow[item.dimension],
                        parent: null,
                        children: null,
                        _index: null
                    }
    
                    if (!exists[k]){
                        exists[k] = a
                        o._index = parentArr.length
                        parentArr.push(o)
                        o.parent = parentObj
                        processDataRow(dataRow, defIndex + 1, k, a, o)
                        
                        if (a.length > 0){
                            o.children = a
                        }
                    } else {
                        processDataRow(dataRow, defIndex + 1, k, exists[k], parentObj)
                    }
    
                } else {
                    k = parentKey + item.measure
                    o = {
                        key: k,
                        measure: item.measure,
                        parent: null,
                        _index: null
                    }
    
                    if (!exists[k]){
                        exists[k] = parentArr
                        o._index = parentArr.length
                        parentArr.push(o)
                        o.parent = parentObj
                        processDataRow(dataRow, defIndex + 1, parentKey, parentArr, parentObj)
                    } else {
                        processDataRow(dataRow, defIndex + 1, parentKey, exists[k], parentObj)
                    }
                } 
            }
        }
    }
}
