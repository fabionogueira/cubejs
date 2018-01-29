// funções

import CubeJS from '../CubeJS';

CubeJS
    .createFunction('CELL', function(r, c){
        let ro, co;
        let mc = this._mapCols;
        let mr = this._mapRows;
        let cube = this._data;
        
        if (typeof (r) == 'string'){
            r = mr[r] - cube.cols.levels;
        }
        if (typeof (c) == 'string'){
            c = mc[c] - cube.rows.levels;
        }

        ro = cube.data[r];
        co = ro ? ro[c] : null;

        return co ? co.value : null;
    })
    .createFunction('SUMMARY_ROW', function(r, c){
        if (this.$CACHE_ROWSUM[r] == undefined){
            this.$CACHE_ROWSUM[r] = {};
            this.$CACHE_ROW_MEASURE[r] = {};
            this.$CACHE_ROW_PERCENT[r] = {};
        }
        if (this.$CACHE_ROWSUM[r][c] == undefined){
            let i, ce;
            let s = 0;
            let q = 0;

            for (i = this._cube.cols.levels; i < r; i++){
                ce = this.MT[i][c];
                if (ce){
                    s += ce.value;
                    q++;
                }
            }
            this.$CACHE_ROWSUM[r][c] = s;
            this.$CACHE_ROW_MEASURE[r][c] = ((s / (q)).toFixed(2)) * 1;
            this.$CACHE_ROW_PERCENT[r][c] = 'TODO';
        }
        return this.$CACHE_ROWSUM[r][c];
    })
    .createFunction('MEASURE_ROW', function(r, c){
        this.SUMMARY_ROW(r, c);
        return this.$CACHE_ROW_MEASURE[r][c];
    })
    .createFunction('PERCENT_ROW', function(r, c){
        this.SUMMARY_ROW(r, c);
        return this.$CACHE_ROW_PERCENT[r][c];
    });
