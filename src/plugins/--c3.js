// @ts-check

import CubeJS from '../CubeJS';

// @ts-ignore
const c3 = window.c3;

function getColCategories(data){
    let i;
    let k = 1;
    let a = ['x'];
    let cols = data.cols;
    
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
function getRowCategories(data){
    let i;
    let k = 0;
    let a = [];
    let rows = data.rows;
    
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
    let data = instance._data;
    
    categories = getRowCategories(data);
    
    cs = -1;      

    for (i = 0, y = data.cols.levels; y < mt.length; y++, i++){
        r = [categories[i]];

        for (x = data.rows.levels; x < mt.colsLength; x++){
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

function columnChart(element, cubeJs){
    let series = getSeries(cubeJs);
    let categories = getColCategories(cubeJs._data);
    
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

// CubeJS.createPlugin('c3.column', {
//     renderTo(element){
//         return columnChart(element, this.cubeJS);
//     }
// });
