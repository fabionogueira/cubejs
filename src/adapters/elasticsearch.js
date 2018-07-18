// @ts-check

export default {
    request(cubejs) {
        let previous = {}
        let dimensions = []
        let measures = []
        let aggs = {}
        let definition = cubejs.getDefinition()
        let result = {
            size: 0,
            from: 0,
            aggs: aggs
            /* query: query_string ? {
                query_string: {
                    query: query_string
                }
            } : {} */
        }

        definition.cols.forEach(c => { c.dimension ? dimensions.push(c) : measures.push(c) })
        definition.rows.forEach(c => { c.dimension ? dimensions.push(c) : measures.push(c) })

        dimensions.forEach(col => {
            aggs[col.dimension] = {
                terms: {
                    field: col.dimension,
                    size: 50
                },
                aggs: {}
            }
            previous = aggs[col.dimension]
            aggs = previous.aggs
        })

        delete (previous.aggs)

        // filters
        /* {id:1, exclude: false, cluster:'armas', dimension:'calibre', name:'calibre', type:'list', value:['38', '380', '.40']},
        {id:2, exclude: true, cluster:'armas', dimension:'especie', name:'sem espingarda', type:'list', value:['espingarda']},
        {id:3, exclude: false, cluster:'armas', dimension:'situacao', name:'situação regular e outras', type:'value', value:'regu', match:'startwith'} */
        if (definition.filters){
            result.query = {}
            definition.filters.forEach(f => {
                if (f.type == 'list'){
                    result.query.terms = {}
                    result.query.terms[f.dimension] = f.value
                }
            })
        }

        return result
    },

    response(cubejs, result){
        let i, activeRow
        let arr = []
        let activeKeys = {}
        let measures = {}
        let dimensions = {}
        let aggregations = result.aggregations
        let definition = cubejs.getDefinition()
        let cols = definition.cols
        let rows = definition.rows
    
        cols.forEach(c => { c.dimension ? dimensions[c.dimension] = true : measures[c.measure] = true })
        rows.forEach(c => { c.dimension ? dimensions[c.dimension] = true : measures[c.measure] = true })
    
        for (i in aggregations){
            newRow()
            processBuckets(i, aggregations[i].buckets, aggregations[i])
        }
    
        function newRow(){
            if (activeRow){
                arr.push(activeRow)
            }
    
            activeRow = {}
            
            for (let i in activeKeys){
                activeRow[i] = activeKeys[i]
            }
        }

        function processBuckets(dm, buckets, parent){
            buckets.forEach(bucket => {
                let b, i, v, r
    
                activeRow[dm] = bucket.key
                
                b = getBucketDimension(bucket)
                if (b){
                    activeKeys[dm] = bucket.key
                    processBuckets(b.bucketKey, b.bucketObj.buckets, b.bucketObj)
                } else {
                    // adiciona as métricas na linha atual
                    for (i in bucket){
                        if (measures[i]){
                            v = bucket[i]
                            activeRow[i] = v.value == undefined ? v : v.value
                        }
                    }

                    // sum_other_doc_count
                    if (parent.sum_other_doc_count){
                        r = Object.assign({}, activeRow)
                        newRow()
                        activeRow = r
                        activeRow[dm] = 'other_doc_count'
                        activeRow['doc_count'] = parent.sum_other_doc_count
                    }

                    newRow()
                }
            })

            delete (activeKeys[dm])
        }

        function getBucketDimension(bucket){
            let k
    
            for (k in bucket){
                if (dimensions[k]){
                    return {
                        bucketKey: k,
                        bucketObj: bucket[k]
                    }
                }
            }
    
            return null
        }
    
        return arr
    }
}
