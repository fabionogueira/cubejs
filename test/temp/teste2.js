var cube = {
    cols: {
        levels : 2,
        children:[
            {id:'furto', label:'furto', category:'furto', dimension:'natureza', children:[
                {id:'furto.revolver', label:'revolver', category:'revolver', dimension:'arma.tipo'},
                {id:'furto.pistola',  label:'pistola',  category:'pistola',  dimension:'arma.tipo'},
                {id:'furto.faca',     label:'faca',     category:'faca',     dimension:'arma.tipo'}
            ]},
            {id:'roubo', label:'roubo', category:'roubo', dimension:'natureza', children:[
                {id:'roubo.revolver', label:'revolver', category:'revolver', dimension:'arma.tipo'},
                {id:'roubo.pistola',  label:'pistola',  category:'pistola',  dimension:'arma.tipo'},
                {id:'roubo.faca',     label:'faca',     category:'faca',     dimension:'arma.tipo'}
            ]}
        ]
    },
    rows: {
        levels: 3,
        children:[
            {id:'1º BPM', label:'1º BPM', category:'1º BPM', dimension:'upm', children:[
                {id:'1º BPM.2013', label:'2013', category:'2013', dimension:'ano', children:[
                    {id:'1º BPM.2013.jan', label:'jan', category:'jan', dimension:'mes'},
                    {id:'1º BPM.2013.fev', label:'fev', category:'fev', dimension:'mes'},
                    {id:'1º BPM.2013.mar', label:'mar', category:'mar', dimension:'mes'}
                ]},
                {id:'1º BPM.2014', label:'2014', category:'2014', dimension:'ano'}
            ]},
            {id:'2º BPM', label:'2º BPM', category:'2º BPM', dimension:'upm', children:[
                {id:'2º BPM.2013', label:'2013', category:'2013', dimension:'ano', children:[
                    {id:'2º BPM.2013.fev', label:'fev', category:'fev', dimension:'mes'},
                    {id:'2º BPM.2013.mar', label:'mar', category:'mar', dimension:'mes'}
                ]},
                {id:'2º BPM.2014', label:'2014', category:'2014', dimension:'ano'}
            ]}
        ]
    },
    data:[
        [{value:1}, {value:2}, {value:3}, {value:4}, {value:5}, {value:6}],
        [{value:12}, {value:3}, {value:2}, {value:5}, {value:31}, {value:70}],
        [{value:0}, {value:3}, {value:2}, {value:4}, {value:14}, {value:7}],
        [{value:3}, {value:3}, {value:11}, {value:8}, {value:40}, {value:17}],
        [{value:2}, {value:1}, {value:21}, {value:3}, {value:4}, {value:1}],
        [{value:3}, {value:4}, {value:1}, {value:2}, {value:3}, {value:8}],
        [{value:4}, {value:5}, {value:0}, {value:1}, {value:2}, {value:9}]
    ]
};

(function(){        
    
    function compiler(exp, t){
        var a, i, p1, p2;
        
        if (!t){
            return Function('return null');
        }
        
        a = [];
                
        p1 = exp.split('{');
        for (i=0; i<p1.length; i++){
            p2 = p1[i].split('}');
            if (p2.length>0){
                a.push(p2[0]);
            }
        }
        
        for (i=0; i<a.length; i++){
            exp = exp.replace(/\$CELL/g, 'this.CELL');
            
            if (t==='ROW'){
                exp = exp.replace('{'+a[i]+'}', "(this.MT[this.MR['"+a[i]+"']][$c]||{}).value");
                exp = exp.replace('$SUM', 'this.SUMMARY_ROW($r,$c)');
                exp = exp.replace('$MEASURE', 'this.MEASURE_ROW($r,$c)');
                exp = exp.replace('$PERCENT', 'this.PERCENT_ROW($r,$c)');
                exp = exp.replace('$PREVIOUS','this.CELL($r-1,$c)');
                exp = exp.replace('$AFTER',   'this.CELL($r+1,$c)');
            }else{
                exp = exp.replace('{'+a[i]+'}', "(this.MT[$r][this.MC['"+a[i]+"']]||{}).value");
                exp = exp.replace('$SUM', 'this.SUMMARY_COL($r,$c)');
                exp = exp.replace('$MEASURE', 'this.MEASURE_COL($r,$c)');
                exp = exp.replace('$PERCENT', 'this.PERCENT_COL($r,$c)');
                exp = exp.replace('$PREVIOUS','this.CELL($r,$c-1)');
                exp = exp.replace('$AFTER',   'this.CELL($r,$c+1)');
                exp = exp.replace(/\$COL\(/g,    'this.COLREF($r,');
            }
        }
        
        return Function('$r', '$c', 'return ' + exp);
    }
    
    var mapRows={},
        mapCols={},
        mapSummaryRows={},
        mapSummaryCols={},
        operations = [
//            {   id       : 'r1',
//                type     : 'calc_row',
//                label    : 'soma',
//                position : 'after',
//                reference: '1º BPM',
//                value    : compiler('$SUM', 'ROW')// this.CELL("1º BPM.2013", "furto.pistola")')// '[1º BPM.2013] + [1º BPM.2014];'
//            },
//            {   id       : 'r2',
//                type     : 'calc_row',
//                label    : 'média',
//                position : 'after',
//                reference: '1º BPM',
//                value    : compiler('$MEASURE', 'ROW') 
//            },
//            {   id       : 'c1',
//                type     : 'calc_col',
//                label    : 'col1',
//                position : 'before',
//                reference: 'furto.pistola',
//                value    : compiler('$PREVIOUS+$AFTER', 'COL')
//            },
            {   id       : 'c2',
                type     : 'calc_col',
                label    : 'total furto',
                position : 'after',
                reference: 'furto',
                value    : compiler('$CELL($r, "furto.revolver")+$CELL($r, "furto.pistola")+$CELL($r, "furto.faca")', 'COL')
            },
//            {   id       : 'r3',
//                type     : 'calc_row',
//                label    : 'percentual',
//                position : 'after',
//                reference: '1º BPM',
//                value    : compiler('$PERCENT', 'ROW') 
//            },
//            {
//                id: 's1',
//                type:'sort_category_row'
//            }
        ],
        valueContext = {
            MR: mapRows,
            MC: mapCols,
            $CACHE_ROWSUM:{},
            $CACHE_ROW_MEASURE:{},
            $CACHE_ROW_PERCENT:{},
            CELL: function(r,c){
                var ro, co;
                
                if (typeof(r)==='string'){
                    r = this.MR[r];
                }
                if (typeof(c)==='string'){
                    c = this.MC[c];
                }
                
                r -= cube.cols.levels;
                c -= cube.rows.levels;
                        
                ro = cube.data[r];
                co = ro ? ro[c] : null;
                
                return co ? co.value : null;
            },
            SUMMARY_ROW: function(r,c){
                if (this.$CACHE_ROWSUM[r]===undefined){
                    this.$CACHE_ROWSUM[r]={};
                    this.$CACHE_ROW_MEASURE[r]={};
                    this.$CACHE_ROW_PERCENT[r]={};
                }
                if (this.$CACHE_ROWSUM[r][c]===undefined){
                    var s=0, q=0, ce;
                    for (var i=cube.cols.levels; i<r; i++){
                        ce=this.MT[i][c];
                        if (ce){
                            s += ce.value;
                            q++;
                        }
                    }
                    this.$CACHE_ROWSUM[r][c]=s;
                    this.$CACHE_ROW_MEASURE[r][c]=((s/(q)).toFixed(2))*1;
                    this.$CACHE_ROW_PERCENT[r][c]='TODO';
                }
                return this.$CACHE_ROWSUM[r][c];
            },
            MEASURE_ROW: function(r,c){
                this.SUMMARY_ROW(r,c);
                return this.$CACHE_ROW_MEASURE[r][c];
            },
            PERCENT_ROW: function(r,c){
                this.SUMMARY_ROW(r,c);
                return this.$CACHE_ROW_PERCENT[r][c];
            }
        };
    
//private methods:    
    function createMatrix(){
        var
            i, j, r, c, op, a, row, cell, dataRowsLength, dataColsLength,
            calculatedCells ={},
            mt = [];
        
        valueContext.MT= mt;
        dataColsLength = cube.data[0].length;
        dataRowsLength = cube.data.length;
        
        //títulos de colunas
        function createColCell(obj, row, col){
            var i;
            
            if (!mt[row]) mt[row] = [];
            mt[row][col] = obj;
            
            if (obj.calculated){
                for (i=0; i<dataRowsLength; i++){
                    cube.data[i].splice(col-cube.rows.levels,0,null);
                }
                dataColsLength++;
                calculatedCells[obj.id] = obj;
            }
            
            if (obj.children){
                for (i=0; i<obj.children.length; i++){
                    col = createColCell(obj.children[i], row+1, col);
                }
                return col;
            }else{
                mapCols[obj.id] = col;
            }
            
            return col+1;
        }
        c = cube.rows.levels;
        for (i=0; i<cube.cols.children.length; i++){
            c = createColCell(cube.cols.children[i], 0, c);
        }
        
        //títulos de linhas
        function createRowCell(obj, row, col){
            var i;
            
            if (!mt[row]) { mt[row] = [];}
            
            mt[row][col] = obj;
            
            if (obj.calculated){
                cube.data.splice(row-cube.cols.levels,0,[]);
                dataRowsLength++;
                calculatedCells[obj.id] = obj;
            }
            
            if (obj.children){
                for (i=0; i<obj.children.length; i++){
                    row = createRowCell(obj.children[i], row, col+1);
                }
                return row;
            }else{
                mapRows[obj.id] = row;
            }
            
            return row+1;
        }
        r = cube.cols.levels;
        for (i=0; i<cube.rows.children.length; i++){
            r = createRowCell(cube.rows.children[i], r, 0);
        }
        
        //dados
        for (r=0; r<cube.data.length; r++){
            row = cube.data[r];
            i   = r+cube.cols.levels;
            
            for (c=0; c<row.length; c++){
                cell = row[c];
                j = c+cube.rows.levels;
                mt[i] ? mt[i][j] = row[c] : null;
            }
        }
        
        //células calculados
        function caculatedRowValues(obj){
            var i, j, r, c, v, row = mapRows[obj.id];
            r = mt[row];
            for (i=0; i<dataColsLength; i++){
                c = i+cube.rows.levels;
                v = obj.value.apply(valueContext, [row,c]);
                r[c] = {
                    value: v,
                    calc : 'row'
                };
                
                //atualiza cube.data
                j = row-cube.cols.levels;
                cube.data[j][i]={value:v, calc:'row'};
            }
        }
        function caculatedColValues(obj){
            var i, j, r, v, col = mapCols[obj.id];
            
            for (i=0; i<dataRowsLength; i++){
                r = cube.cols.levels + i;
                
                if (mt[r]){
                    v = obj.value.apply(valueContext, [r,col]);
                    mt[r][col] = {
                        value: v,
                        calc : 'col'
                    };
                
                    //atualiza cube.data
                    j = col-cube.rows.levels;
                    cube.data[i][j] = {value:v, calc:'col'};
                }
            }
        }
        for (i=0; i<operations.length; i++){
            op = operations[i];
            a = calculatedCells[op.id];
            if (a){
                if (a.type==='calc_row'){
                    caculatedRowValues(a);
                }else if (a.type==='calc_col'){
                    caculatedColValues(a);
                }
            }else{
                Operation[op.type](op, 1);
            }
        }
        
        mt.colsLength = dataColsLength + cube.rows.levels;
        mt.rowsLength = dataRowsLength + cube.cols.levels;
        
        return mt;
    }
    function toHTML(){
        var
            r, c, row, html,
            matrix = valueContext.MT;
        
        //html
        function createHTMLCell(r,c,obj){
            var s;
            
            if (r>cube.cols.levels-1){
                if (c>cube.rows.levels-1){
                    s='<td class="cell value'; //dados
                }else{
                    s='<td class="cell label label-row'+(!obj?' bottom':obj.children?' top':'')+'">'; //título de linhas
                }
            }else{
                if (c>cube.rows.levels-1){
                    s='<td class="cell label label-col">'; //título de colunas
                }else{
                    s='<td class="cell">'; //canto
                }
            }
            
            if (obj){
                if (obj.label){
                    s += (obj.label + '</td>');
                }else{
                    s += ((obj.calc?(' value-calc calc-'+obj.calc):'') + '">' + obj.value + '</td>');
                }
                
                return s;
            }
            
            return s+'</td>';
        }
        html = '<table class="table" border="0" cellpadding="3" cellspacing="0">';
        for (r=0; r<matrix.rowsLength; r++){
            row = matrix[r];
            html += '<tr>';
            for (c=0; c<matrix.colsLength; c++){
                html += row ? createHTMLCell(r,c,row[c]) : '';
            }
            html += '</tr>';
        }
        html += '</table>';
        
        return ('<pre>' + html + '</pre>');
    }
    var Operation = {
        sort_category_row: function(op, moment){
            if (!moment) return;
            
            var i, j, mt = valueContext.MT;
            
            
        },
        calc_row : function(op){
            var i;
            
            for (i=0; i<cube.rows.children.length; i++){
                i=Operation.imp(op, cube.rows.children[i], cube.rows.children, i);
            }
        },
        calc_col : function(op){
            var i;
            
            for (i=0; i<cube.cols.children.length; i++){
                i=Operation.imp(op, cube.cols.children[i], cube.cols.children, i);
            }
        },
        imp : function(op, obj, parent, index){
            var i, o;
            
            if (obj.id===op.reference) {
                
                o = {calculated:true, type:op.type, id:op.id, label:op.label, position:op.position, value:op.value};

                if (op.position==='after'){  //after
                    parent.splice(++index, 0, o);
                }else{                       //before
                    parent.splice(index++, 0, o);
                }
            }
            
            if (obj.children){
                for (i=0; i<obj.children.length; i++){
                    i = Operation.imp(op, obj.children[i], obj.children, i);
                }
            }
            
            return index;
        }
    };
    
    function runOperations(){
        var
            i, op, txt='<p><pre>Ordem da Operações: <b>(';
            
        for (i=0; i<operations.length; i++){
            op = operations[i];
            Operation[op.type](op);
            txt += (i===0?'':', ') + (op.label || ('<span style="color:#FF00E7">'+op.type+'</span>'));
        }
        
        txt += ')</b></pre></p>';
        
        document.write(txt);
    }
    
    runOperations(cube);
    createMatrix();
    
    document.write(toHTML());
}());