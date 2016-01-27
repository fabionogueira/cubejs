(function(){
    var charts = {};
    
    //provê gráficos c3
    CubeJS.plugin('c3', function(){
        this._views['bar']         = barChart;
        //this._views['column']      = columnChart;
        //this._views['line']        = lineChart;
        //this._views['area']        = areaChart;
        //this._views['combination'] = areaCombination;
    });
    
    function barChart(element){
        var categories, series;
        
        //this=instance
        //se options.orientation=horizontal as barras ficam na horizontal

        categoriesAndSeries(cube, function(cat, ser){
            categories = cat;
            series = ser;
        });   

        return c3.generate({
            bindto: element,
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
