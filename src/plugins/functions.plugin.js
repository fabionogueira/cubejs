//funções
(function(){
    CubeJS
        .createFunction('CELL', function(r,c){
            var ro, co, mc=this._mapCols, mr=this._mapRows;
            
            if (typeof(r)==='string'){
                r = mr[r] - this._cube.cols.levels;
            }
            if (typeof(c)==='string'){
                c = mc[c] - this._cube.rows.levels;
            }

            ro = this._cube.data[r];
            co = ro ? ro[c] : null;

            return co ? co.value : null;
        })
        .createFunction('SUMMARY_ROW', function(r,c){
            if (this.$CACHE_ROWSUM[r]===undefined){
                this.$CACHE_ROWSUM[r]={};
                this.$CACHE_ROW_MEASURE[r]={};
                this.$CACHE_ROW_PERCENT[r]={};
            }
            if (this.$CACHE_ROWSUM[r][c]===undefined){
                var s=0, q=0, ce;
                for (var i=this._cube.cols.levels; i<r; i++){
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
        })
        .createFunction('MEASURE_ROW', function(r,c){
            this.SUMMARY_ROW(r,c);
            return this.$CACHE_ROW_MEASURE[r][c];
        })
        .createFunction('PERCENT_ROW', function(r,c){
            this.SUMMARY_ROW(r,c);
            return this.$CACHE_ROW_PERCENT[r][c];
        });
}());
