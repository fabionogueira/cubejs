const TextFormat = {
    format(definition, value){
        let i, k

        for (i in TextFormat.transformers){
            k = definition[i]
            if (k){
               return TextFormat.transformers[i](k, value)
            }
        }

        return value
    },

    transformers: {
        'text.transform'(value, data){
            data = data || ''
    
            switch (value){
            case 'uppercase':
                data = data.toLocaleUpperCase()
                break
    
            case 'lowercase':
                data = data.toLocaleLowerCase()
                break
            }
    
            return data
        }
    }
}

const NumberFormat = function (def, data){
    let num = parseInt(data).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${def.thousand}`)
    let rest = data.toFixed(def.precision).split('.')[1] || ''
    
    return num + (rest ? def.decimal : '') + rest
}

export default {
    Text: TextFormat,
    Number: NumberFormat
}
