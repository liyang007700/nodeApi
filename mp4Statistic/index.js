const fs = require('fs')
const path = require('path')
const moment = require('moment')
const util = require('util')

const open = util.promisify(fs.open)
const read = util.promisify(fs.read)

;(async function () {
  const dir = path.resolve(__dirname + '/video')
  const files = fs.readdirSync(dir).map(file => path.resolve(dir, file))
  const videos = await Promise.all(
    files.map(async file => {
      const fd = await open(file, 'r')
      const buff = Buffer.alloc(100)
      const { buffer } = await read(fd, buff, 0, 100, 0)
      const time = getTime(buffer)
      return { file, time }
    })
  )
  const res = {
    '视频总数': videos.length,
    '视频总时长': getLocaleTime(
      videos.reduce((prev, e) => {
        return prev + e.time
      }, 0)
    )
  }
  console.log(res)
})()

function getTime (buffer) {
  const start = buffer.indexOf(Buffer.from('mvhd')) + 17
  const timeScale = buffer.readUInt32BE(start, 4)
  const duration = buffer.readUInt32BE(start + 4, 4)
  const movieLength = Math.floor(duration / timeScale)
  return movieLength
}

function getLocaleTime (seconds) {
  return moment
    .duration(seconds, 'seconds')
    .toJSON()
    .replace(/[PTHMS]/g, str => {
      switch (str) {
        case 'H': return '小时'
        case 'M': return '分钟'
        case 'S': return '秒'
        default: return ''
      }
    })
}

