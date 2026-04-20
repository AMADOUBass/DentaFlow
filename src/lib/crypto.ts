import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const KEY = process.env.ENCRYPTION_KEY

/**
 * Encrypts a string using AES-256-GCM.
 * Format: iv:authTag:encryptedData
 */
export function encrypt(text: string): string {
  if (!text) return text
  if (!KEY || KEY.length !== 64) {
    throw new Error('Encryption key must be a 32-byte hex string (64 characters).')
  }

  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, 'hex'), iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag().toString('hex')

  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypts a string that was encrypted using encrypt()
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText
  if (!KEY || KEY.length !== 64) {
    throw new Error('Encryption key must be a 32-byte hex string (64 characters).')
  }

  try {
    const [ivHex, authTagHex, encryptedDataHex] = encryptedText.split(':')

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY, 'hex'), iv)

    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedDataHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return "[ERREUR DÉCHIFFREMENT]"
  }
}
