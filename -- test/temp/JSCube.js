JSCube = (function(){
    var 
        _plugins = {},
        _jscube = function(config){
            var 
                _service, _cols, _rows, _dimensions, _measures, cache_categories,
                measuresRow=0, measuresCol=0, firstDataCol, firstDataRow,
                _plugin,
                _response,
                _vars = {};

        //public methods:
            this.vars = function(){
                return _vars;
            };
            this.response = function(){
                return _response;
            };
            this.rows = function(rows){
                if (rows===undefined){
                    return _rows;
                }
                
                _rows = rows;
                setRowsOrCols('row', rows);
                
                return this;
            };
            this.cols = function(cols){
                if (cols===undefined){
                    return _cols;
                }
                
                _cols = cols;
                setRowsOrCols('col', cols);
                return this;
            };
            this.dimensions = function(dm){
                if (dm===undefined){
                    return _dimensions;
                }
                
                _dimensions = dm;
                
                return this;
            };
            this.measures = function(ms){
                if (ms===undefined){
                    return _measures;
                }
                
                _measures = ms;
                
                return this;
            };
            this.service = function(url){
                if (url===undefined){
                    return _service;
                }
                
                _service = url;
                return this;
            };
            this.adapter = function(adapter){
                if (adapter===undefined){
                    return _plugin;
                }
                
                _plugin = adapter;
                
                return this;
            };
            this.run = function(options, fnComplete){
                var
                    request, adapter;
                
                applyConfig(this, options);
                
                if (_plugins[_plugin]){
                    adapter = new _plugins[_plugin](_vars);
                    
                    request = adapter.request({
                        cols       : _cols,
                        rows       : _rows,
                        dimensions : _dimensions,
                        measures   : _measures
                    });
                    
                    function success(response) {
                        _response = adapter.response(response);

                       firstDataCol = _rows.length - measuresRow; 
                       firstDataRow = _cols.length - measuresCol;

                       applyOperations();
                       teste2();
                       if (fnComplete) fnComplete(_response);
                   }
                    
                    return success(result);
                    
                    $.ajax({
                        url     : _service + (request.url || ''),
                        type    : request.type,
                        dataType: request.dataType,
                        data    : request.data,
                        success: function(response) {
                             _response = adapter.response(response);
                                    
                            firstDataCol = _rows.length - measuresRow; 
                            firstDataRow = _cols.length - measuresCol;
                    
                            applyOperations();
                            teste2();
                            if (fnComplete) fnComplete(_response);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            if (fnComplete) fnComplete({error:true, responseText:jqXHR.responseText});
                        }
                    });
                }
            };
            this.plugin = function(name, options){
                var
                    o, p = _plugins[name];

                if (p){
                    o = new p();
                    o.init(this, options);
                }
                
                return o;
            };
            this.categories = function(rowOrCol){
                var
                    i, c, r,a;
                    
                if (cache_categories){
                    return cache_categories;
                }    
                
                a = [];
                    
                if (!_response){
                    return null;
                }
                
                if (rowOrCol==='col'){
                    //retorna as categorias das colunas, somente o 1º nível
                    r = _response.matrix[0];
                    for (i=0; i<r.length; i++){
                        c = r[i];
                        if (c && c.colDim){
                            a.push(c.category);
                        }
                    }
                }
                
                cache_categories = a;
                
                return a;
            };
            this.series = function(rowOrCol){
                var
                    i, j, c, r, lin, col, colChange,
                    x = 0,
                    y = 0,
                    soma = 0,
                    a = [];
                    
                if (!_response){
                    return null;
                }
                
                lin = -1;
                col = 1;
                
                if (measuresRow>0){
                    y = measuresRow-1;
                }
                
                if (measuresCol>0){
                    x = measuresCol-1;
                }
                
                if (rowOrCol==='row'){                    
                    //retorna as séries das linhas, somente o 1º nível
                    for (i=_cols.length-x; i<_response.matrix.length; i++){
                        r = _response.matrix[i];
                        if (r[0]){
                            colChange = null;
                            soma = 0;
                            lin++;
                            col=1;
                            a.push([r[0].category || _cols[0]]);
                        }
                        
                        for (j=_rows.length-y; j<r.length; j++){
                            c = r[j];
                            
                            //mudança de coluna
                            if (colChange){
                                if (a[lin][col]===undefined){
                                    a[lin][col] = soma ;
                                }else{
                                    a[lin][col] += soma;
                                }
                                
                                soma = 0;
                                col++;
                            }
                            if (c){
                                soma += c.value;
                            }
                            
                            colChange = _response.matrix[0][j+1];
                        }
                        
                        //mudança de coluna pq chegou na última
                        if (a[lin][col]===undefined){
                            a[lin][col] = soma ;
                        }else{
                            a[lin][col] += soma;
                        }
                        
                        soma = 0;
                        col = 1;
                    }
                }
                
                return a;
            };

        //private methods:
            function teste2(){
                var
                    MT = [], calculated={}, showSummary=true, obj={}, activeX;
                
                function updateMatrix(r,c,v){
                    if (MT[r]){
                        MT[r] = [];
                    }
                    MT[r][c](v);
                }
                function getCell(r,c){
                    var row = _response.matrix[r];
                    if (row) return row[c];
                    return obj;
                }
                function processRows(parentLevel, fn){
                    var
                        i, map, end, col, childrenLevel;

                    childrenLevel = parentLevel + 1;

                    //se tem filhos
                    if (childrenLevel<firstDataCol-1){
                        return processRowsChildren(childrenLevel, fn);
                    }

                    map = _response.matrix[childrenLevel][i];
                    col = map.x;

                    for (i=col; i<_response.cols; i++){
                        end  = _response.matrix[parentLevel][i+1] ? true : false;
                        fn(_response.matrix[row][i].value);

                        if (end){
                            return;
                        }
                    }
                }
                function processCols(level){
                    var
                        children, bottom, cell, calc, top, j, o;
                    
                    /* processa as colunas cabeçalho criando todas as calculadas e sumários */
                    
                    children = 0;
                    
                    while (activeX<_response.cols){
                        cell   = getCell(level, activeX);
                        bottom = getCell(level+1, activeX);
                        calc   = cell ? calculated[cell.key] : null;
                                
                        //se tem coluna calculada antes
                        if (calc && calc.before){
                            for (j=level; j<firstDataRow; j++){
                                _response.matrix[j].splice(activeX,0,'calculated');
                            }
                            _response.cols++;
                            activeX++;
                        }
                        
                        //desloca a posição x caso tenha adicionado uma coluna antes
                        if (cell) cell.x = activeX;
                        
                        //se tem filhos
                        if (bottom && bottom.category){
                            children = processCols(level+1);
                            
                            //se tem coluna de sumário
                            /*if (showSummary && children>1){
                                o = {label:'(summary)', rowspan:firstDataRow-level};
                                for (j=level; j<firstDataRow; j++){
                                    _response.matrix[j].splice(activeX, 0 , o);
                                    o = null;
                                }
                                _response.cols++;
                                activeX++;
                            }*/
                            
                            children = 0;
                        }else{
                            children++;
                        }
                        
                        //se tem coluna calculada depois
                        if (calc && calc.after){
                            _response.matrix[level].splice(1,0,'calculated');
                            _response.cols++;
                            activeX++;
                        }
                        
                        //TODO: rever, isso não funciona!!! 
                        top = getCell(level-1, activeX);
                        
                        //se acabou as colunas filhas
                        if (top && top.category){
                            return children;
                        }
                        
                        activeX++;
                    }
                    
                    return children;
                }
                
                activeX = firstDataCol;
                processCols(0);
            }
            
            function setRowsOrCols(position, list){
                var i, v, d, p, t,
                    m = [],
                    l = 0;

                clearVars(position);

                for (i=0; i<list.length; i++){
                    p = list[i].split('.')[0];
                    v = list[i].replace('.', '_');
                    d = _dimensions[p] || _measures[p];
                    t = _dimensions[p] ? 'dimension' : 'measure';
                    
                    if (t === 'measure'){ //guarda a métrica para o final
                        if (position==='row'){
                            measuresRow++;
                        }else{
                            measuresCol++;
                        }
                        
                        m.push(list[i]);
                    }else{
                        if (d){
                            _vars[v] = {
                                nested   : d.nested,
                                position : position,
                                level    : l,
                                type     : t,
                                name     : v,
                                aggs     : list[i].split('.')[1]
                            };
                            l++;
                        }
                    }
                }
                
                //adicion a(s) métrica(s), ex: preco.sum(soma), preco.max(valor máximo), ...
                for (i=0; i<m.length; i++){
                    p = m[i].split('.');
                    v = m[i].replace('.', '_');
                    d = _measures[p[0]];
                    
                    if (d){
                        _vars[p[0]] = {
                            position : position,
                            level    : l,
                            type     : 'measure',
                            name     : v,
                            aggs     : p[1] || 'sum'
                        };
                    }
                }
                
            }
            function clearVars(position){
                var i, o={};
                
                if (position==='row'){
                    measuresRow=0;
                }else{
                    measuresCol=0;
                }
                
                for (i in _vars){
                    if (_vars[i].position !== position){
                        o[i]=_vars[i];
                    }
                }

                _vars = o;
            }
            function applyConfig(self, options){
                var i;

                if (options){
                    for (i in options){
                        if (self[i]){
                            self[i](options[i]);
                        }
                    }
                }
            }
            function applyOperations(){
                //aplica as operações
                //ordem das operações
                //1.linhas/coluna calculada na ordem que foram definidas (linhas/colunas de total entram aqui);
                //2.ocultar linhas/colunas zeradas
                //
                console.log(_response);
            }
            function calculateSummary(keyRow, keyCol){
                var
                    i, j;
                    
                
            }
            
            function teste(matrix){
                var i,j,x,y,linha,celula,colStart,rowStart,showSummary, calculadas, colunasEmBranco, novaCelula,novaMatriz;
                
                novaMatriz = [];
                showSummary = true;
                calculadas = {};
                x = 2;
                y = 3;
                
                //cria o títulos do sumários
                
                for (i=0; i<matrix.lenght; i++){
                    linha = matrix[i];
                    colunasEmBranco = 0;
                    
                    for (j=firstDataCol; j<linha.lenght; j++){
                        celula = linha[j];
                        if (!i<x && j<x) { //canto
                            novaMatriz[i].push(null);
                            continue;
                        }
                        
                        if (!celula){
                            colunasEmBranco++;
                            novaCelula = null;
                        }else{
                            if (colunasEmBranco>0){
                                
                            }else{
                                novaCelula = {label:celula.label};
                            }
                        }
                        
                        if (showSummary){
                            
                        }
                        
                        novaMatriz[i].push(novaCelula);
                    }
                }
            }
            
        //apply config:
            applyConfig(this, config);
        };
    
    //static methods:
    _jscube.registerPlugin = function(name, plugin){
        _plugins[name] = plugin;
    };
    
    return _jscube;
}());
