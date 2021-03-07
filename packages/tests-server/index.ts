import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import cors from 'cors'
import * as bodyParser from 'body-parser'

const SRC_DIR = path.resolve(__dirname, 'src')
const STATIC_DIR = path.resolve('../tests-manual/build')

const textParser = bodyParser.text()
const port = 2020

const app = express()
app.use(cors())
app.use(express.static(STATIC_DIR))

app.get('/', (req, res) => {
  const body = fs.readFileSync(path.join(STATIC_DIR, 'index.html'))
  res.send(body)
})

app.listen(port, () => {
  console.log(`> the server is running, try http://localhost:${port}`)
})
