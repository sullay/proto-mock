import { generateMockData } from '../index'
import * as path from 'path'
import * as fs from 'fs'

const file = path.resolve(__dirname, './proto/shape.proto')

const jsonData = generateMockData(file, 'Shape')

fs.writeFileSync(path.resolve(__dirname, './json/shape.json'), JSON.stringify(jsonData))
