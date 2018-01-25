/* eslint no-new-func:off */
/* jshint evil:true */

let plugins = {};
let functions = {};
let operations = {};
let noop = function(){};

class CubeJSInstance{
    constructor(definition, cube){
        let i;

        this.format = {
            precision: 2,
            prefix   : '',
            suffix   : '',
            decimal  : '.',
            thousand : ','
        };
        
        this._cube = cube;
        this._operations = [];
        this._mapRows = {};
        this._mapCols = {};
        this._views = {};

        for (i in plugins){
            plugins[i].apply(this);
        }
        
        if (definition){
            this.definition(definition);
        }
        
        if (cube){
            this.cube(cube);
        }
    }

    render(htmlElement, viewName) {
        let view = this._views[viewName];

        if (view){
            htmlElement = typeof (htmlElement) == 'string' ? document.getElementById(htmlElement) : htmlElement;
            view.apply(this, [htmlElement]);
        }

        return this;
    }

    definition(){
        return this;
    }

    cube(){

    }

    addOperation(id, name, options) {
        let op;
        let o = operations[name];
        
        if (o){
            op = {
                id       : id,
                type     : name,
                priority : o.priority,
                position : options.position || 'after', /* after ou before */
                reference: options.reference,
                label    : options.label || id,
                value    : options.expression ? this._compilerExpression(options.expression) : function(){},
                summary  : options.summary
            };
            this._operations.push(op);
            o.create(this, op);
        } else {
            console.error('Operation "' + name + '" not found.');
        }
        
        return this;
    }

    removeOperation(id){
        let i;
        
        for (i = 0; i < this._operations.length; i++){
            if (this._operations[i].id === id){
                this._operations.splice(i, 1);
                break;
            }
        }
        
        return this;
    }

    process() {
        this._initOperations();
        this._createMatrix();

        return this;
    }

    _compilerExpression(exp){
        // let i;
        
        // for (i in functions){
        exp = exp.replace(/\$CELL\s*\([\w\W]*\)/g, function(txt){
            let a = txt.split('(');                
            return '$f.' + a[0].substring(1) + '.apply($s,[' + a[1].substring(0, a[1].length - 1) + '])';
        });
        // }
        
        return Function('$r', '$c', '$f', '$s', 'return ' + exp);
    }
    
    _createMatrix(){
        let i, j, r, c, op, a, mt, row, ops, cube, cell, mapCols, mapRows, dataRowsLength, dataColsLength, calculatedCells;
        
        mt = this._matrix = [];
        cube = this._cube;
        ops = this._operations;
        mapCols = this._mapCols;
        mapRows = this._mapRows;
        dataColsLength = cube.data.collength;
        dataRowsLength = cube.data.length;
        calculatedCells = {};
        
        // títulos de colunas
        function createColCell(obj, row, col){
            let i;
            
            if (!mt[row]) mt[row] = [];
            mt[row][col] = obj;
            
            if (obj.calculated){
                for (i = 0; i < dataRowsLength; i++){
                    cube.data[i].splice(col - cube.rows.levels, 0, null);
                }
                dataColsLength++;
                calculatedCells[obj.id] = obj;
            }
            
            if (obj.children){
                for (i = 0; i < obj.children.length; i++){
                    col = createColCell(obj.children[i], row + 1, col);
                }
                return col;
    
            } else {
                mapCols[obj.id] = col;
            }
            
            return col + 1;
        }
        c = cube.rows.levels;
        for (i = 0; i < cube.cols.children.length; i++){
            c = createColCell(cube.cols.children[i], 0, c);
        }
        
        // títulos de linhas
        let createRowCell = (obj, row, col) => {
            var i;
            
            if (!mt[row]) { 
                mt[row] = [];
            }
            
            mt[row][col] = obj;
            
            if (obj.calculated){
                cube.data.splice(row - cube.cols.levels, 0, []);
                dataRowsLength++;
                calculatedCells[obj.id] = obj;
            }
            
            if (obj.children){
                for (i = 0; i < obj.children.length; i++){
                    row = createRowCell(obj.children[i], row, col + 1);
                }
                return row;
    
            } else {
                mapRows[obj.id] = row;
            }
            
            return row + 1;
        };
        
        // células calculados
        let caculatedRowValues = (obj) => {
            let i, j, r, c, v;
            let row = mapRows[obj.id];
    
            r = mt[row];
            for (i = 0; i < dataColsLength; i++){
                j = row - cube.cols.levels;
                v = obj.value(j, i, functions, this);
                c = i + cube.rows.levels;
                
                r[c] = {
                    value  : v,
                    calc   : 'row',
                    summary: obj.summary
                };
                
                // atualiza cube.data
                cube.data[j][i] = {value:v, calc:'row'};
                this._formatValue(r[c]);
            }
        };
    
        let caculatedColValues = (obj) => {
            let i, j, r, v;
            let col = mapCols[obj.id];
            
            for (i = 0; i < dataRowsLength; i++){
                r = cube.cols.levels + i;
                
                if (mt[r]){
                    j = col - cube.rows.levels;
                    v = obj.value(i, j, functions, this);
                    
                    mt[r][col] = {
                        value    : v,
                        calc     : 'col',
                        summary: obj.summary
                    };
                
                    // atualiza cube.data
                    cube.data[i][j] = {value:v, calc:'col'};
                    this._formatValue(mt[r][col]);
                }
            }
        };

        r = cube.cols.levels;
        
        for (i = 0; i < cube.rows.children.length; i++){
            r = createRowCell(cube.rows.children[i], r, 0);
        }
        
        // dados
        for (r = 0; r < cube.data.length; r++){
            row = cube.data[r];
            i = r + cube.cols.levels;
            
            for (c = 0; c < row.length; c++){
                cell = row[c];
                j = c + cube.rows.levels;
                if (mt[i]) mt[i][j] = row[c];
                this._formatValue(cell, this.format);
            }
        }
    
        for (i = 0; i < ops.length; i++){
            op = ops[i];
            a = calculatedCells[op.id];
            if (a){
                if (a.type === 'calculatedRow'){
                    caculatedRowValues(a);
                } else if (a.type === 'calculatedCol'){
                    caculatedColValues(a);
                }
            }
        }
        
        mt.colsLength = dataColsLength + cube.rows.levels;
        mt.rowsLength = dataRowsLength + cube.cols.levels;
        
        return mt;
    }
    
    _initOperations(){
        let i, op;
        
        // ordena as operações por prioridade
        this._operations.sort(this._sortByPriority);
        
        for (i = 0; i < this._operations.length; i++){
            op = this._operations[i];
            operations[op.type].init(this, op);
        }        
    }
    
    _sortByPriority(a, b) {
        if (a.priority === b.priority){
            return 0;
        }
    
        if (a.priority > b.priority){
            return -1;
        }
    
        return 1;
    }

    _formatValue(cell){
        let v, a;
    
        if (cell){
            v = cell.value.toFixed(this.format.precision);
            a = v.split('.');
            v = a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + this.format.thousand) + (a[1] ? this.format.decimal + a[1] : '');
            cell.label = this.format.prefix + v + this.format.suffix;
        }
    }
}
 
class CubeJS {
    static create(definition, cube){
        return new CubeJSInstance(definition, cube);
    }
    static plugin(name, plugin) {
        plugins[name] = plugin;

        return this;
    }
    static createFunction(name, fn) {
        functions[name] = fn;
        
        return this;
    }
    static createOperation(name, def){
        def.priority = def.priority || 100;
        def.create = def.create || noop;
        def.init = def.init || noop;
        operations[name] = def;

        return this;
    }
}

export default CubeJS;
