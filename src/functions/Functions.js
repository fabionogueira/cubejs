// @ts-check

class Functions{
    constructor(instance, context){
        this.instance = instance
        this.context = context
    }
    
    static create(name, fn){
        this.prototype[name] = fn
    }

    static compile(exp){
        let i, r, c
        
        if (!Functions['expressions'][exp]){
            for (i in this.prototype) {
                r = new RegExp(`\\${i}\\s*\\(`, 'g')
                c = `this.${i}(`
    
                exp = exp.replace(r, c)
            }
            
            // ignora aregra no-new-func do eslint
            /* eslint-disable */
            Functions['expressions'][exp] = Function('$INDEX', 'return ' + exp)
            /* eslint-enable */
        }
        return Functions['expressions'][exp]
    }
}
Functions['expressions'] = {}

class FunctionsCache{
    static get(instance, f, key){
        let o = instance[f]
        
        if (o && o[key] != undefined){
            console.log('using cache ' + f)
            return o[key]
        }        
    }

    static set(instance, f, key, value){
        let o = instance[f]
        
        if (!o){
            o = instance[f] = {}
        }

        o[key] = value
    }
}

export default Functions
export {
    Functions,
    FunctionsCache
}
