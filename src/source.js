// @ts-check

let sourceTypes = {}

class Source{
    _name
    _options
    _fields = []
    
    constructor(name, options = {}){
        this._name = name
        this._options = options
    }

    request(callback){
        this._options.request(callback)
    }

    getFields(callback){
        callback(this._fields)
    }
}

class CsvSource extends Source{
    _content
    _columnSeparator = ';'
    _rowSeparator = '\n'

    constructor(name, options = {}){
        super(name, options)
        if (options.content){
            this._extractHeaders(options.content)  
        }
    }

    setContent(content){
        this._extractHeaders(content)
    }

    _extractHeaders(content){
        let lines = content.split('\n')
        let arr = lines[0].split(';')

        this._fields = []

        arr.forEach(field => {
            this._fields.push({
                name: field
            })
        })
    }
}

class ElasticSource extends Source{
    getFields(callback){
        let axios = {}

        axios.post(`${this._options.url}/${this._options.index}/schema`)
    }
}

let csv = new CsvSource('csv source', {content: 'csv content'})
let elastic = new ElasticSource('elastic source', {url: 'http://localhost:9200'})

csv.getFields((fields) => {
    console.log(fields)
})



