import { generateMockData } from '../index'
import * as path from 'path'
import * as fs from 'fs'

const file = path.resolve(__dirname, './proto/vector_tile.proto')

const jsonData = generateMockData(file, 'Tile', {maxRepeatedLength: 10})

fs.writeFileSync(path.resolve(__dirname, './json/vector_tile.json'), JSON.stringify(jsonData))
