(function(){
    var
        htmlTable = function(){
            
            this.init = function(cube, options){
                var 
                    c, i, j, r, cls, fc, fr, html,
                    vars = cube.vars(),
                    cols = cube.cols(),
                    rows = cube.rows(),
                    response = cube.response();
                
                //verifica se existe métrica na linha ou na coluna
                for (i in vars){
                    c = vars[i];
                    if (c.type==='measure'){
                        r = c.position;
                        break;
                    }
                }
                
                fr = cols.length-(r==='col'? 2 : 1);
                fc = rows.length-(r==='row'? 2 : 1);
                
                html='<table class="cube-table" cellpadding="0" cellspacing="0" border="0">';                
                if (response){
                    for (i=0; i<response.rows; i++){
                        r = response.matrix[i];
                        html+='<tr>';
                        for (j=0; j<response.cols; j++){
                            c = r[j];
                            if (i<=fr && j<=fc){
                                cls = 'cube-corner';
                            }else if (i<=fr){
                                cls = 'cube-category-cols';
                            }else{
                                if (j<=fc){
                                    cls = 'cube-category-rows';
                                }else{
                                    cls = 'cube-measure';
                                }
                            }
                            //cls = i>fr && j>fc ? 'cube-measure' : 'cube-category';//  c ? c.dimension ? 'cube-dim' : '' 
                            html += ('<td class="'+cls+'">' + (c ? c.label : '') + '</td>');
                        }
                        html+='</tr>';
                    }
                }
                html+='</table>';
                
                $(options.renderTo).html(html);
            };
        };
        
    JSCube.registerPlugin('table', htmlTable);
}());