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
                    v = currentline[j].trim().replace(',','.')
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
    },

    header(data){
        let value, type, datatype
        let arr = []
        let lines = data.csvContent.split('\n')
        let headers = lines[0].split(';')
        let line1 = lines[1] ? lines[1].split(';') : []

        headers.forEach((name, index) => {
            name = name.trim()
            value = line1[index]
            
            if (value){
                type = isNaN(Number(value)) ? 'dimension' : 'measure'
                datatype = type == 'measure' ? 'number' : stringIsDate(value) ? 'date' : 'string'
            } else {
                type = null
                datatype = 'string'
            }

            arr.push({
                name,
                type: type || 'dimension',
                datatype: datatype
            })
        })
    },

    toDataset(data, headers = null, limit = undefined){
        let i, j, v, h, o, k, lines
        let all = {}
        let rows = {}
        let measureValues = {}
        let arr = []
        let obj, currentline

        data = data || ''
        lines = data.split('\n', limit)

        headers = headers || this.headers(data)

        headers.forEach(item => {
            all[item.name] = item
        })
        
        for(i = 1; i < lines.length; i++){
            obj = {};
            k = ''
            currentline = lines[i].split(";");
        
            for(j=0; j<headers.length; j++){
                h = headers[j]
                o = all[h.name]

                if (o){
                    v = o.expression ? 0 : currentline[j].trim().replace(',','.')
                    k += o.type == 'dimension' ? v : h.name
                    
                    if (o.type == 'measure'){
                        v = Number(v)
                        measureValues[k] = (measureValues[k] || 0) + v
                        obj[h.name] = measureValues[k]

                    } else {
                        obj[h.name] = v
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

function stringIsDate(value){
    let d

    if (!value){
        return false
    }

    if (!isNaN(Number(value))){
        return false
    }

    if (value.split('/').length == 3 || value.split('-').length == 3){
        d = new Date(value)
        
        // @ts-ignore
        return (d != 'Invalid Date')
    }

    return false
}