import Functions from './Functions'
import lang from './lang/ptBR'

Functions.create(lang.IF, function(condition, iftrue, iffalse) {
    return (condition) ? iftrue : iffalse
})
