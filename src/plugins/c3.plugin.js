// provê gráficos c3

import CubeJS from '../CubeJS';

const c3 = window.c3;

function getColCategories(instance){
    let i;
    let k = 1;
    let a = ['x'];
    let cols = instance._cube.cols;
    
    function process(obj, pl){
        let l, j, children;
        
        l = pl + obj.label;
        children = obj.children;
        
        if (children){
            process(children[0], l + ' ');
            for (j = 1; j < children.length; j++){
                process(children[j], l + ' ');
            }
        } else {
            a[k++] = l;
        }
    }

    for (i = 0; i < cols.children.length; i++){
        process(cols.children[i], '');
    }
    
    return a;
}
function getRowCategories(instance){
    let i;
    let k = 0;
    let a = [];
    let rows = instance._cube.rows;
    
    function process(obj, pl){
        var l, j, children;
        
        l = pl + obj.label;
        children = obj.children;
        
        if (children){
            process(children[0], l + ' ');
            for (j = 1; j < children.length; j++){
                process(children[j], l + ' ');
            }
        } else {
            a[k++] = l;
        }
    }

    for (i = 0; i < rows.children.length; i++){
        process(rows.children[i], '');
    }
    
    return a;
}
function getSeries(instance){
    let i, x, y, d, r, cs, categories;
    let mt = instance._matrix;
    let series = [];
    
    categories = getRowCategories(instance);
    
    cs = -1;      

    for (i = 0, y = instance._cube.cols.levels; y < mt.length; y++, i++){
        r = [categories[i]];

        for (x = instance._cube.rows.levels; x < mt.colsLength; x++){
            d = mt[y][x];
            
            if (x == cs) continue;
                
            if (d){
                if (d.summary) {
                    cs = x;
                } else {
                    r.push(d.category || d.calculated || d.measure ? d.label : d.value);
                }
            } else {
                r.push(0);
            }
            
        }

        if (r.length > 0) {
            series.push(r);
        }
    }
    
    return series;
}

function columnChart(element){
    let series = getSeries(this);
    let categories = getColCategories(this);
    
    series.splice(0, 0, categories);
    
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
}
function barChart(element){
    var data = null; // getSingleSeries(this);
    
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
}

CubeJS.plugin('c3', function(){
    this._views.bar = barChart;
    this._views.column = columnChart;
    // this._views['line']        = lineChart;
    // this._views['area']        = areaChart;
    // this._views['combination'] = areaCombination;
});
