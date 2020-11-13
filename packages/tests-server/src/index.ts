import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'

const app = express()
app.use(cors())
const port = 2020
const textParser = bodyParser.text()

const fs = require('fs')

app.get('/', textParser, (req, res) => {
  const body = fs.readFileSync('./dist/index.html', 'utf8')
  res.send(body)
})

app.listen(port, () => {
  console.log(`server run http://localhost:${port}`)
})
