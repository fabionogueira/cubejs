import CubeJS from '../CubeJS';

function toHTML(cubeJs){
    let r, c, row, html;
    let cube = cubeJs._cube;
    let matrix = cubeJs._matrix;
    
    function createHTMLCell(r, c, obj){
        let cls;
        let v = '';
            
        if (r > cube.cols.levels - 1){
            if (c > cube.rows.levels - 1){
                cls = 'cell value'; // dados
            } else {
                cls = 'cell label label-row'; // título de linhas
            }
        } else {
            if (c > cube.rows.levels - 1){
                cls = 'cell label label-col'; // título de colunas
            } else {
                cls = 'cell'; // canto
            }
        }
        
        if (obj){
            cls += obj.calculated ? ' calc-' + obj.calc + ' label-calc' : '';
            cls += obj.calc ? ' calc-' + obj.calc + ' value-calc' : '';
        }
        
        v = (obj ? obj.label || obj.value : null);
        
        return '<td class="' + cls + '">' + (v === null || v === undefined ? '' : v) + '</td>';
    }
    
    html = '<table class="table" border="0" cellpadding="3" cellspacing="0">';
    for (r = 0; r < matrix.rowsLength; r++){
        row = matrix[r];
        html += '<tr>';
        for (c = 0; c < matrix.colsLength; c++){
            html += createHTMLCell(r, c, row[c]);
        }
        html += '</tr>';
    }
    html += '</table>';
    
    return ('<pre>' + html + '</pre>');
}

function tableView(element){
    element.innerHTML = toHTML(this);
}

CubeJS.plugin('htmlTable', function(){
    this.htmlTable = function(){
        return toHTML(this);
    };
    this._views.table = tableView;
});
