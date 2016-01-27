CubeJS = (function(){
    
    var plugins = {};
    var CubeJS = function(cube, usePlugins){
        var i, j, p, instance;
        
        usePlugins = usePlugins || [];
        
        instance = {};
        
        for (i=0; i<usePlugins.length; i++){
            p = plugins[i];
            
            for (j in p){
                if (j==='init') {
                    cube = p.init(cube);
                }else{
                    instance[j]=p[j];
                }
            }
        }
        
        return instance;
    };
    
    //static methods:
    CubeJS.plugin = function(name, plugin){
        plugins[name] = plugin;
    };
    
    return CubeJS;
}());

//converte o cubo de es para cubejs
CubeJS.plugin('es', function(instance){
    
    this._cube = this._cube;
    
});

(function(){
    var charts = {};
    
    //provê gráficos c3
    CubeJS.plugin('c3', function(instance){

        return {
            render: render
        };

    });
    
    charts['bar'] = function(){
        var categories, series;

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
    
    function render(chartName){
        return charts[chartName]();
    }
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
    
}());

chart = CubeJS(cube).es().d3();
chart.render('bar');
