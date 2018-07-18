import CubeJS from './cubejs'
import elasticsearch from './adapters/elasticsearch'
import csv from './adapters/csv'

import './functions'
import './operations'

CubeJS.registerAdapter('elasticsearch', elasticsearch)
CubeJS.registerAdapter('csv', csv)

export default CubeJS
