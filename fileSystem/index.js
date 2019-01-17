const fs = require('fs')
const util = require('util')
const path = require('path')
const readFile = util.promisify(fs.readFile)
readFile(path.resolve(__dirname + '/file/config.json'), 'utf-8')
  .then((data) => {
    console.log(JSON.parse(data))
  })
  .catch((err) => {
    console.log(err)
  })

