var CubeJS;

(function(){
    
    var plugins={}, functions={}, operations={};
    
    CubeJS=function(definition, cube){
        var i, instance;
        
        definition.format = {
            precision: 2,
            prefix   : '',
            suffix   : '',
            decimal  : '.',
            thousand : ','
        };
        
        instance = {
            _definition: definition,
            _cube      : cube,
            _operations: [],
            _mapRows   : {},
            _mapCols   : {},
            _views     : {},
            render     : function(htmlElement, viewName){
                var view = this._views[viewName];
                if (view){
                    htmlElement = typeof(htmlElement)==='string' ? document.getElementById(htmlElement) : htmlElement;
                    view.apply(this, [htmlElement]);
                }
                return this;
            },
            definition: function(){return this;},
            cube: function(){},
            addOperation: function(id, name, options){
                var op, 
                    o = operations[name];
                
                if (o){
                    op = {
                        id       : id,
                        type     : name,
                        priority : o.priority,
                        position : options.position || 'after', /*after ou before*/
                        reference: options.reference,
                        label    : options.label || id,
                        value    : options.expression ? compilerExpression(options.expression) : noop,
                        summary  : options.summary
                    };
                    this._operations.push(op);
                    o.create(instance, op);
                }else{
                    console.error('Operation "' + name + '" not found.');
                }
                
                return this;
            },
            removeOperation: function(id){
                var i;
                
                for (i=0;i<this._operations.length; i++){
                    if (this._operations[i].id===id){
                        this._operations.splice(i,1);
                        break;
                    }
                }
                
                return this;
            },
            process: function(){
                initOperations(this);
                createMatrix(this);
                return this;
            }
        };
        
        for (i in plugins){
            plugins[i].apply(instance);
        }
        
        if (definition){
            instance.definition(definition);
        }
        
        if (cube){
            instance.cube(cube);
        }
        
        return instance;
    };
    
    //static methods:
    CubeJS.plugin = function(name, plugin){
        plugins[name] = plugin;
        return this;
    };
    CubeJS.createFunction = function(name, fn){
        functions[name] = fn;
        return this;
    };
    CubeJS.createOperation= function(name, def){
        def.priority= def.priority || 100;
        def.create  = def.create   || noop;
        def.init    = def.init     || noop;
        operations[name] = def;
        return this;
    };
    
    return CubeJS;
    
    function noop(){}
    function compilerExpression(exp){
        var i;
        
        for (i in functions){
            exp = exp.replace(/\$CELL\s*\([\w\W]*\)/g,function(txt){
                var a = txt.split('(');                
                return '$f.'+a[0].substring(1)+'.apply($s,['+a[1].substring(0,a[1].length-1)+'])';
            });
        }
        
        return Function('$r', '$c', '$f', '$s', 'return '+exp); // jshint ignore:line
    }
    function createMatrix(instance){
        var i, j, r, c, op, a, mt, row, ops, cube, cell, mapCols, mapRows, dataRowsLength, dataColsLength, calculatedCells;
        
        mt             = instance._matrix = [];
        cube           = instance._cube;
        ops            = instance._operations;
        mapCols        = instance._mapCols;
        mapRows        = instance._mapRows;
        dataColsLength = cube.data.collength;
        dataRowsLength = cube.data.length;
        calculatedCells= {};
        
        //títulos de colunas
        function createColCell(obj, row, col){
            var i;
            
            if (!mt[row]) mt[row] = [];
            mt[row][col] = obj;
            
            if (obj.calculated){
                for (i=0; i<dataRowsLength; i++){
                    cube.data[i].splice(col-cube.rows.levels,0,null);
                }
                dataColsLength++;
                calculatedCells[obj.id] = obj;
            }
            
            if (obj.children){
                for (i=0; i<obj.children.length; i++){
                    col = createColCell(obj.children[i], row+1, col);
                }
                return col;
            }else{
                mapCols[obj.id] = col;
            }
            
            return col+1;
        }
        c = cube.rows.levels;
        for (i=0; i<cube.cols.children.length; i++){
            c = createColCell(cube.cols.children[i], 0, c);
        }
        
        //títulos de linhas
        function createRowCell(obj, row, col){
            var i;
            
            if (!mt[row]) { mt[row] = [];}
            
            mt[row][col] = obj;
            
            if (obj.calculated){
                cube.data.splice(row-cube.cols.levels,0,[]);
                dataRowsLength++;
                calculatedCells[obj.id] = obj;
            }
            
            if (obj.children){
                for (i=0; i<obj.children.length; i++){
                    row = createRowCell(obj.children[i], row, col+1);
                }
                return row;
            }else{
                mapRows[obj.id] = row;
            }
            
            return row+1;
        }
        r = cube.cols.levels;
        for (i=0; i<cube.rows.children.length; i++){
            r = createRowCell(cube.rows.children[i], r, 0);
        }
        
        //dados
        for (r=0; r<cube.data.length; r++){
            row = cube.data[r];
            i   = r+cube.cols.levels;
            
            for (c=0; c<row.length; c++){
                cell = row[c];
                j = c+cube.rows.levels;
                if (mt[i]) mt[i][j] = row[c];
                formatValue(cell, instance._definition.format);
            }
        }
        
        //células calculados
        function caculatedRowValues(obj){
            var i, j, r, c, v, row = mapRows[obj.id];
            r = mt[row];
            for (i=0; i<dataColsLength; i++){
                j = row-cube.cols.levels;
                v = obj.value(j,i,functions,instance);
                c = i+cube.rows.levels;
                
                r[c] = {
                    value  : v,
                    calc   : 'row',
                    summary: obj.summary
                };
                
                //atualiza cube.data
                cube.data[j][i]={value:v, calc:'row'};
                formatValue(r[c], instance._definition.format);
            }
        }
        function caculatedColValues(obj){
            var i, j, r, v, col = mapCols[obj.id];
            
            for (i=0; i<dataRowsLength; i++){
                r = cube.cols.levels + i;
                
                if (mt[r]){
                    j = col-cube.rows.levels;
                    v = obj.value(i,j,functions,instance);
                    
                    mt[r][col] = {
                        value    : v,
                        calc     : 'col',
                        summary: obj.summary
                    };
                
                    //atualiza cube.data
                    cube.data[i][j] = {value:v, calc:'col'};
                    formatValue(mt[r][col], instance._definition.format);
                }
            }
        }
        for (i=0; i<ops.length; i++){
            op = ops[i];
            a = calculatedCells[op.id];
            if (a){
                if (a.type==='calculatedRow'){
                    caculatedRowValues(a);
                }else if (a.type==='calculatedCol'){
                    caculatedColValues(a);
                }
            }
//            else{
//                operations[op.type](cube, op, 1);
//            }
        }
        
        mt.colsLength = dataColsLength + cube.rows.levels;
        mt.rowsLength = dataRowsLength + cube.cols.levels;
        
        return mt;
    }
    function initOperations(instance){
        var i, op;
        
        //ordena as operações por prioridade
        instance._operations.sort(sortByPriority);
        
        for (i=0; i<instance._operations.length; i++){
            op = instance._operations[i];
            operations[op.type].init(instance, op);
        }        
    }
    function sortByPriority(a, b) {
        if (a.priority === b.priority)
            return 0;
        if (a.priority > b.priority)
            return -1;
        else
            return 1;
    }
    function formatValue(cell, def){
        var v, a;
        if (cell){
            v = cell.value.toFixed(def.precision);
            a = v.split('.');
            v = a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+def.thousand) + (a[1] ? def.decimal + a[1] : '');
            cell.label = def.prefix + v + def.suffix;
        }
    }

}());
