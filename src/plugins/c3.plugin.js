(function(){
    var charts = {};
    
    //provê gráficos c3
    CubeJS.plugin('c3', function(){
        this._views['bar']         = barChart;
        this._views['column']      = columnChart;
        //this._views['line']        = lineChart;
        //this._views['area']        = areaChart;
        //this._views['combination'] = areaCombination;
    });
    
    function columnChart(element){
        var data = getSingleSeries(this);
        
        getCategories(this);
        console.log(data, this);
        
        return c3.generate({
            bindto: element,
            data: {
                columns: data,
                type: 'bar'
            }
        });
    };
    function barChart(element){
        var data = getSingleSeries(this);
        
        return c3.generate({
            bindto: element,
            data: {
                columns: data,
                type: 'bar'
            },
            axis: {
                rotated: true
            }
        });
    };
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
    function getSingleSeries(instance){
        var x, y, d, r, cs, mt = instance._matrix,
            series = [];
        
        //séries
        cs=-1;      
        for (y=instance._cube.cols.levels; y<mt.length; y++){
            r = [];
            for (x=instance._cube.rows.levels-1; x<mt.colsLength; x++){
                d = mt[y][x];
                
                if (x===cs) continue;
                    
                if (d){
                    if (d.summary) {
                        cs=x;
                    }else{
                        r.push(d.category || d.calculated || d.measure ? d.label : d.value);
                    }
                }else{
                    r.push(0);
                }
                
            }
            if (r.length>0) series.push(r);
        }
        
        return series;
    }
    function getCategories(instance){
        var i, j, y = 0, x = 0, a = [], r = instance._matrix[0];
        
        
        for (i=instance._cube.rows.levels; i<r.length; i++){
            if (r[i]){
                a[x] = getLabel(r[i]);
            }
        }
        
        console.log(a);
        
        return;
        
        var x, y, d, r, l, i, cs, mt = instance._matrix,
            categories = [];
        
        cs=-1;
        y=0;
        r = [];
        for (x=0; x<mt.colsLength; x++){
            d = mt[y][x];

            if (x===cs) continue;

            if (d){
                if (d.summary) {
                    cs=x;
                }else{
                    l = d.label;
                    while (d.children){
                        for (i=0; i<d.children.length; i++){
                            l
                        }
                    }
                    r.push(l);
                }
            }else{
                r.push(0);
            }

        }
        if (r.length>0) series.push(r);

        
        return series;
    }
    function getLabel(obj){
        var l=obj.label;
        
        if (obj.children && obj.children.length>0){
            l += ' ' + getLabel(obj.children[0]);
        }
        
        return l;
    }
    function processCol(arr, obj, x, label){
        var i;
        
        label = label + (label==='' ? '' : ' ') + obj.label;
        
        if (obj.children && obj.children.length>0){
            label = processCol(arr, obj.children[0], x, label);
            for (i=1; i<obj.children.length; i++){
                processCol(arr, obj.children[i], x+1, label);
            }
        }
        
        arr[x] = label;
        
        return label;
    }
}());
