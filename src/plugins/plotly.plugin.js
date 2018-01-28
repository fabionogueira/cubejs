import CubeJS from '../CubeJS';

const Plotly = window.Plotly;

function getColCategories(data){
    let i;
    let k = 0;
    let a = [];
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
function getSeries(instance, colsCategories, type){
    let i, x, y, d, r, cs, categories;
    let mt = instance._matrix;
    let series = [];
    let data = instance._data;
    
    categories = getRowCategories(data);
    
    cs = -1;      

    for (i = 0, y = data.cols.levels; y < mt.length; y++, i++){
        r = {
            x: colsCategories,
            y: [],
            name: categories[i],
            type: type || 'bar'
        };

        for (x = data.rows.levels; x < mt.colsLength; x++){
            d = mt[y][x];
            
            if (x == cs) continue;
                
            if (d){
                if (d.summary) {
                    cs = x;
                } else {
                    r.y.push(d.category || d.calculated || d.measure ? d.label : d.value);
                }
            } else {
                r.y.push(0);
            }
            
        }

        if (r.y.length > 0) {
            series.push(r);
        }
    }
    
    return series;
}

function columnChart(element, cubeJs, layout, orientation, type){
    let categories = getColCategories(cubeJs._data);
    let series = getSeries(cubeJs, categories, type);
    
    series.forEach(serie => {
        let x = serie.x;

        if (orientation == 'h'){
            serie.orientation = orientation;
            serie.x = serie.y;
            serie.y = x;
        }
    });

    return Plotly.newPlot(element, series, layout);
}

CubeJS.createPlugin('plotly.column', {
    renderTo(element){
        let layout = {barmode: 'group'};
        return columnChart(element, this.cubeJS, layout);
    }
});

CubeJS.createPlugin('plotly.bar', {
    renderTo(element){
        let layout = {barmode: 'group'};
        return columnChart(element, this.cubeJS, layout, 'h');
    }
});

CubeJS.createPlugin('plotly.column.stacked', {
    renderTo(element){
        let layout = {barmode: 'stack'};
        return columnChart(element, this.cubeJS, layout);
    }
});

CubeJS.createPlugin('plotly.bar.stacked', {
    renderTo(element){
        let layout = {barmode: 'stack'};
        return columnChart(element, this.cubeJS, layout, 'h');
    }
});

CubeJS.createPlugin('plotly.line', {
    renderTo(element){
        let layout = {};
        return columnChart(element, this.cubeJS, layout, null, 'scatter');
    }
});
