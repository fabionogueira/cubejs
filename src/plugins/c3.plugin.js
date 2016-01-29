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
        var series = getSeries(this),
            categories = getColCategories(this);
        
        series.splice(0,0,categories);
        
        return c3.generate({
            bindto: element,
            data: {
                x:'x',
                columns: series,
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category'
                }
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
    
    function getSeries(instance){
        var i, x, y, d, r, cs, categories, mt = instance._matrix,
            series = [];
        
        categories = getRowCategories(instance);
        
        cs=-1;      
        for (i=0,y=instance._cube.cols.levels; y<mt.length; y++,i++){
            r = [categories[i]];
            for (x=instance._cube.rows.levels; x<mt.colsLength; x++){
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
    function getColCategories(instance){
        var i, k = 1, a = ['x'], cols = instance._cube.cols;
        
        for (i=0; i<cols.children.length; i++){
            process(cols.children[i], '');
        }
        
        return a;
        
        function process(obj, pl){
            var l, children;
            
            l = pl+obj.label;
            children = obj.children;
            
            if (children){
                process(children[0], l+' ');
                for (var j=1; j<children.length; j++){
                    process(children[j], l+' ');
                }
            }else{
                a[k++] = l;
            }
        }
    }
    function getRowCategories(instance){
        var i, k = 0, a = [], rows = instance._cube.rows;
        
        for (i=0; i<rows.children.length; i++){
            process(rows.children[i], '');
        }
        
        return a;
        
        function process(obj, pl){
            var l, children;
            
            l = pl+obj.label;
            children = obj.children;
            
            if (children){
                process(children[0], l+' ');
                for (var j=1; j<children.length; j++){
                    process(children[j], l+' ');
                }
            }else{
                a[k++] = l;
            }
        }
    }
    
}());
