// @ts-check

import './cubejs.css'

let views = {}

export default function(cubejs, element, id){
    let r, i, d, html, el
    let rc = ''
    let cc = ''
    
    if (views){
        views[id] = cubejs
    }

    // rows categories
    for (i = 0; i < cubejs._maps.rows.length; i++){
        r = cubejs._maps.rows[i]
        rc += createRowCategory(r)
    }

    // cols categories
    cc = '<div class="cubejs-hbox">'
    for (i = 0; i < cubejs._maps.cols.length; i++){
        r = cubejs._maps.cols[i]
        cc += createColCategory(r)
    }
    cc += '</div>'

    // values
    d = '<div class="cubejs-hbox">' + createDataValue() + '</div>'

    html = 
    `<table border="0" cellspacing="0" cellpadding="0" style="width:100%; height:100%">
        <tr>
            <td class="cubejs-table-corner"></td>
            <td>${cc}</td>
        </tr>
        <tr>
            <td class="cubejs-table-categories">${rc}</td>
            <td class="cubejs-table-values" style="width:100%; height:100%;">${d}</td>
        </tr>
    </table>`

    el = typeof (element) == 'string' ? document.getElementById(element) : element
    if (el) el.innerHTML = html
    
    function createRowCategory(r){
        let div, i, cls, t, plus
        let oneChild = r.children && r.children.length == 1
        let oneMeasureChild = oneChild && r.children[0].measure
        
        cls = (r.children ? oneChild ? '' : ' cubejs-category-row-parent' : ' cubejs-category-flex') + 
              (r.measure ? ' cubejs-is-measure' : '') + 
              (r.caculated ? ' cubejs-calculated-category' : '')
        
        t = (r.display || r.categoty || r.measure)
        plus = r.measure ? '' : ''
        div = '<div class="cubejs-hbox">'
        div += `<div class="cubejs-cell cubejs-category-cell cubejs-category-row${cls}">${plus}<div title="${t}" class="cell-content">${t}</div></div>`
        if (r.children){
            div += '<div class="cubejs-vbox">'
            if (!oneMeasureChild){
                for (i = 0; i < r.children.length; i++){
                    div += createRowCategory(r.children[i])
                }
            }
            div += '</div>'
        }
        div += '</div>'

        return div
    }

    function createColCategory(r){
        let div, i, cls, t, plus
        let oneChild = r.children && r.children.length == 1
        let oneMeasureChild = oneChild && r.children[0].measure
        let key = r.key
        
        cls = (r.children ? oneChild ? '' : ' cubejs-category-col-parent' : ' cubejs-category-flex') + 
              (r.measure ? ' cubejs-is-measure' : '') + 
              (r.caculated ? ' cubejs-calculated-category' : '')
        
        t = (r.display || r.categoty || r.measure)
        plus = r.measure ? '' : (r.children ? '' : '') // `<div class="plus" onclick="cubejsCollapse('${id}','${key}', 'col')"></div>`
        div = '<div class="vbox">'
        div += `<div class="cubejs-cell cubejs-category-cell cubejs-category-col${cls}" key="${key}">${plus}<div title="${t}" class="cell-content">${t}</div></div>`

        if (r.children){
            div += '<div class="cubejs-hbox">'
            if (!oneMeasureChild){
                for (i = 0; i < r.children.length; i++){
                    div += createColCategory(r.children[i])
                }
            }
            div += '</div>'
        }
        div += '</div>'

        return div
    }

    function createDataValue(){
        let s, v, o
        let ss = ''

        cubejs.forEach(cubejs._maps.cols, c => {
            s = '<div class="cubejs-vbox">'
            cubejs.forEach(cubejs._maps.rows, r => {
                o = cubejs._maps.keys[c.key + r.key]
                v = o ? o.display : undefined
                s += '<div class="cubejs-cell cubejs-data-cell' + (r.caculated || c.caculated ? ' cubejs-calculated-data' : '') + '"><div class="cell-content">' + (v == undefined ? '&nbsp;' : v) + '</div></div>'
            })
            s += '</div>'
            ss += s
        })

        return ss
    }

    return html
}

window['cubejsCollapse'] = function(cubeId, key, head){
    let o
    let a = []
    let cubejs = views[cubeId]

    if (cubejs){
        if (head=='row'){

        } else {
            o = cubejs.findCol(key)
            o.children.forEach(child => {
                a.push(child.key)
            })
            cubejs.mergeCols({
                key: 'xxx',

            })
        }

        console.log(o)
    }
}