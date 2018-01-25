colsMap["1º bpm"]           = [0,1], //processCol cols.x++ (1)     -> 0=level,  1=cols.x
rowsMap["furto"]            = [2,0], //processRow rows.y++ (2)     -> 2=rows.y, 0=level
colsMap["1º bpm.qtd_armas"] = [1,1], //processCol mudou nível      -> 1=level,  1=cols.x
        0                     [2,1], //processRow                  -> 2=linAtual[0] 1=colAtual[1]
colsMap["1º bpm.qtd_presos"]= [1,2], //processCol cols.x++ (2)     -> 1=level,  2=cols.x
        4                     [2,2], //processRow                  -> 2=linAtual[0] 2=colAtual[1]
rowsMap["homicídio"]        = [3,0], //processRow rows.y++(3)      -> 3=rows.y, 0=level
colsMap["1º bpm.qtd_armas"] = [   ], //processRow ignora
        2                     [3,1], //processRow                  -> 3=linAtual[0] 1=colAtual[1]
colsMap["1º bpm.qtd_presos"]= [   ], //processRow ignora
        1                     [3,2], //processRow                  -> 3=linAtual[0] 2=colAtual[1]
colsMap["2º bpm"]           = [0,3], //processCol cols.x++(3)      -> 0=level,  3=cols.x
rowsMap["furto"]            = [   ], //processRow ignora
colsMap["2º bpm.qtd_armas"] = [1,3], //processCol mudou nível      -> 1=level,  2=cols.x
        1                     [2,3], //processRow                  -> 2=linAtual[0] 3=colAtual[1]
colsMap["2º bpm.qtd_presos"]= [1,4], //processCol cols.x++(4)      -> 1=level,  4=cols.x
        2                     [2,4], //processRow                  -> 2=linAtual[0] 2=colAtual[1]

cols.x = 0,1,2,3,4 //iniciar com qtd níveis de linha-1 = 0
rows.y = 1,2,3 //iniciar com qtd níveis de coluna-1 = 1