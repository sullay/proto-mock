import { generateMockData } from '../index'
import * as path from 'path'
import * as fs from 'fs'

const file = path.resolve(__dirname, './proto/shape.proto')

generateMockData(file, 'Shape').then(jsonData => {
  fs.writeFileSync(path.resolve(__dirname, './json/shape.json'), JSON.stringify(jsonData))
})

