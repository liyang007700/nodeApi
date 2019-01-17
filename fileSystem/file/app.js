const fs = require('fs')
let data
try {
  data = fs.readFileSync('./file/config.json')
  console.log(data)
} catch (err) {
  console.log('读取配置文件出错')
}
