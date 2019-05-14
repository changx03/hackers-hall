const crypto = require('crypto')
const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

/**
 * genRandStr Generates cryptographically string pseudo-random string
 * @param {number} len length of random string
 * @param {string} charSet character set for random string
 */
function genRandStr(len, charSet) {
  const maxByte = 256 - (256 % charSet.length)
  let strLength = len
  let randStr = ''
  // repeat if the length hasn't reached
  while (strLength > 0) {
    // give an extra byte to handle overflow
    const byteBuffer = crypto.randomBytes(Math.ceil((len * 256) / maxByte))
    for (let i = 0; i < byteBuffer.length && strLength > 0; i++) {
      const randInt = byteBuffer.readUInt8(i)
      if (randInt < maxByte) {
        randStr += charSet.charAt(randInt % charSet.length)
        strLength--
      }
    }
  }
  return randStr
}

// receive arguments from terminal
const argv = process.argv.slice(2)
let length = 8
if (argv.length === 1 && !isNaN(parseInt(argv[0]))) {
  length = parseInt(argv[0])
}

console.log(genRandStr(length, charSet))
