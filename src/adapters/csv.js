// @ts-check

export default {
    request() {
        return null
    },

    response(cubejs, result){
        let i, j, v, h, o, k
        let all = {}
        let rows = {}
        let measureValues = {}
        let arr = []
        let definition = cubejs.getDefinition()
        let lines = result.split('\n')
        let headers = lines[0].split(';')
        let obj, currentline

        definition.cols.forEach(item => { all[item.dimension || item.measure] = item })
        definition.rows.forEach(item => { all[item.dimension || item.measure] = item })

        for(i=1; i<lines.length; i++){
            obj = {};
            k = ''
            currentline = lines[i].split(";");
      
            for(j=0; j<headers.length; j++){
                h = headers[j]
                o = all[h]

                if (o){
                    v = currentline[j].trim()
                    k += o.dimension ? v : h
                    
                    if (o.measure){
                        v = Number(v)
                        measureValues[k] = (measureValues[k] || 0) + v
                        obj[h] = measureValues[k]

                    } else {
                        obj[h] = v
                    }

                }
            }

            rows[k] = obj
        }

        for (i in rows){
            arr.push(rows[i])
        }
        
        return arr
    }
}
