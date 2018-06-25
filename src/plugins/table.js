// @ts-check
function toHTML(cubeJs, options){
    let r, c, row, html;
    let cube = cubeJs.getData();
    let matrix = cubeJs.getMatrix();
    
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
        
        v = (obj ? obj.label || obj.value || obj.dimension || obj.measure || null : null);
        
        return '<td class="' + cls + '">' + (v === null || v === undefined ? '' : v) + '</td>';
    }
    
    html = `<table class="table ${options.className}" border="1" cellpadding="3" cellspacing="0">`;
    console.log(matrix)
    if (matrix){
        for (r = 0; r < matrix.rowsLength; r++){
            row = matrix[r];
            html += '<tr>';
            for (c = 0; c < matrix.colsLength; c++){
                html += createHTMLCell(r, c, row[c]);
            }
            html += '</tr>';
        }
    } else {
        html += '<tr><td style="padding:20px">no data</td></tr>'
    }
    html += '</table>';
    
    return ('<pre>' + html + '</pre>');
}

export default function table(cubeJS, element, options = {}){
    element.innerHTML = toHTML(cubeJS, options)
    return element
}
