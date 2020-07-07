import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const KEY = Buffer.alloc(32, process.env.PAYLOAD_KEY)

const encrypt = text => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return `${iv.toString('base64')}:${encrypted.toString('base64')}`
}

const decrypt = text => {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'base64')
  const encryptedText = Buffer.from(textParts.join(':'), 'base64')

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export { encrypt, decrypt }
