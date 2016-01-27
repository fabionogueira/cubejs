(function(){
    var
        color_pattern = undefined;//['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
    
//private functions
    function categoriesAndSeries(cube, fn){
        var
            i, nc, ns,
            categories = cube.categories('col'),
            series     = cube.series('row');

        if (categories.length===0){
            nc = [];
            ns = [['count']];
            for (i=0; i<series.length; i++){
                nc.push(series[i][0]);
                ns[0].push(series[i][1]);
            }
            categories = nc;
            series = ns;
        }
        
        fn(categories, series);
    }
    
    JSCube.registerPlugin('chart.bar', function(){    
        this.init = function(cube, options){
            var
                categories, series;
            
            //se options.orientation=horizontal as barras ficam na horizontal
            
            categoriesAndSeries(cube, function(cat, ser){
                categories = cat;
                series = ser;
            });   
            
            return c3.generate({
                bindto: options.renderTo,
                data: {
                    columns: series,
                    type: 'bar'
                    //onclick: function (d, element) { console.log("onclick", d, element); },
                    /*onmouseover: function (d) { console.log("onmouseover", d); },
                    onmouseout: function (d) { console.log("onmouseout", d); }*/
                },
                color: {
                    pattern: color_pattern
                },
                axis: {
                    x: {
                        type: 'category', // 'categorized numera as séries,
                        categories: categories
                    },
                    rotated: options.orientation==='horizontal' ? true : false
                }
              });
        };
    });
    JSCube.registerPlugin('chart.line', function(){    
        this.init = function(cube, options){
            var
                categories, series;
            
            categoriesAndSeries(cube, function(cat, ser){
                categories = cat;
                series = ser;
            });
            
            return c3.generate({
                bindto: options.renderTo,
                data: {
                    columns: series,
                    type: 'line'
                },
                color: {
                    pattern: color_pattern
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: categories
                    }
                }
              });
        };
    });
    JSCube.registerPlugin('chart.pie', function(){    
        this.init = function(cube, options){
            var
                i, j, s,
                ns  = [],
                categories, series;
            
            categoriesAndSeries(cube, function(cat, ser){
                categories = cat;
                series = ser;
            });
            
            //soma as séries
            for (i=0; i<categories.length; i++){
                s = 0;
                for (j=0; j<series.length; j++){
                    s += series[j][i+1];
                }
                ns.push([categories[i],s]);
            }
            
            series = ns;
            
            return c3.generate({
                bindto: options.renderTo,
                data: {
                    columns: series,
                    type: 'pie'
                },
                color: {
                    pattern: color_pattern
                },
                pie: {
                    label: {
                        format: function (value, ratio, id) {
                            return value;
                        }
                    }
                }
              });
        };
    });
    JSCube.registerPlugin('chart.stacked', function(){    
        this.init = function(cube, options){
            var
                i, categories, series, group;
            
            categoriesAndSeries(cube, function(cat, ser){
                categories = cat;
                series = ser;
            });
            
            series.unshift(['x'].concat(categories));
            group = [];
            
            for (i=1; i<series.length; i++){
                group.push(series[i][0]);
            }
            
            return c3.generate({
                bindto: options.renderTo,
                data: {
                    x : 'x',
                    columns: series,
                    groups: [group],
                    type: 'bar'
                },
                axis: {
                    x: {
                        type: 'category' // this needed to load string x value
                    }
                },
                color: {
                    pattern: color_pattern
                },
                grid: {
                    y: {
                        lines: [{value:0}]
                    }
                }
              });
        };
    });
    JSCube.registerPlugin('chart.combination', function(){    
        this.init = function(cube, options){
            var
                i, categories, series, types, defTypes;
            
            categoriesAndSeries(cube, function(cat, ser){
                categories = cat;
                series = ser;
            });
            
            types = {};
            defTypes = ['bar', 'line', 'area'];
            
            for (i=0; i<series.length; i++){
                if (defTypes[i]){
                    types[series[i][0]] = defTypes[i]; 
                }
            }
            
            return c3.generate({
                bindto: options.renderTo,
                data: {
                    columns: series,
                    type: 'bar',
                    types: types
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: categories
                    }
                },
                color: {
                    pattern: color_pattern
                },
                grid: {
                    y: {
                        lines: [{value:0}]
                    }
                }
              });
        };
    });
    
    
}());