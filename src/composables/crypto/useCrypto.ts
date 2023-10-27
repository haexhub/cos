const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const createKeyPairAsync = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: {
        name: 'SHA-256',
      },
    },
    true,
    ['encrypt', 'decrypt']
  )

  console.log(keyPair)
  return keyPair
}

const ab2str = (buf: ArrayBuffer) => {
  //@ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}

export const exportCryptoKey = async (key: CryptoKey) => {
  //const exported = await window.crypto.subtle.exportKey('pkcs8', key)
  const jwk = await window.crypto.subtle.exportKey('jwk', key)
  console.log(jwk)
  /*   const exportedAsString = ab2str(exported)
  const exportedAsBase64 = window.btoa(exportedAsString)
  const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----` */

  return jwk
}

const deriveKeyAsync = (
  passwordKey: CryptoKey,
  salt: Uint8Array,
  keyUsage: ['encrypt' | 'decrypt']
) =>
  window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    keyUsage
  )

export const getPasswordKeyAsync = async (password: string) =>
  await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )

export const encryptAsync = async (data: string, passwordKey: CryptoKey) => {
  if (!passwordKey) throw new Error('No Password Key given')

  const encoder = new TextEncoder()
  const encoded = encoder.encode(data)

  console.log('encoded', encoded, data)
  try {
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      passwordKey,
      encoded
    )

    return encryptedData
  } catch (error) {
    console.log('ERROR encryptAsync', error)
  }
}

export const decryptAsync = async (
  encryptedData: ArrayBuffer,
  passwordKey: CryptoKey
) => {
  try {
    /* const encryptedDataBuff = base64_to_buf(encryptedData)
    const salt = encryptedDataBuff.slice(0, 16)
    const iv = encryptedDataBuff.slice(16, 16 + 12)
    const data = encryptedDataBuff.slice(16 + 12)
    const passwordKey = await getPasswordKeyAsync(password)
    const aesKey = await deriveKeyAsync(passwordKey, salt, ['decrypt']) */
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
        //iv: iv,
      },
      passwordKey,
      encryptedData
    )

    console.log(decryptedContent)
    return decoder.decode(decryptedContent)
  } catch (e) {
    console.log(`Error - ${e}`)
    return ''
  }
}

export const buff_to_base64 = (buff: ArrayBuffer) =>
  btoa(
    new Uint8Array(buff).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  )

export const base64_to_buf = (b64: string) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))

export function isHash(str: string): boolean {
  return typeof str == 'string' && str.length == 44 && str.charAt(43) == '='
}

export async function hashText(text: string): Promise<string | undefined> {
  let hash = await crypto.subtle.digest('SHA-256', encoder.encode(text))
  return buff_to_base64(hash)
}

export async function hashObj(
  obj: object
): Promise<{ hash: string; hashed: string }> {
  let hashed = typeof obj == 'string' ? obj : JSON.stringify(obj)
  let hash = await hashText(hashed)
  if (hash) return { hash, hashed }
  else throw new Error('hashObj failed')
}

// Buffer -> Base64 String -> Url Safe Base64 String
export function safeHash(unsafe: string): string {
  if (!unsafe) return ''
  const encode_regex = /[+=/]/g
  return unsafe.replace(encode_regex, encodeChar)
}

function encodeChar(c: string): string {
  switch (c) {
    case '+':
      return '-'
    case '=':
      return '.'
    case '/':
      return '_'
    default:
      return c
  }
}

// Url Safe Base64 String -> Base64 String -> Buffer
export function unsafeHash(safe: string): string {
  if (!safe) return ''
  const decode_regex = /[._-]/g
  return safe.replace(decode_regex, decodeChar)
}

function decodeChar(c: string): string {
  switch (c) {
    case '-':
      return '+'
    case '.':
      return '='
    case '_':
      return '/'
    default:
      return c
  }
}

export function safeJSONParse(input: string | object, def?: object): object {
  // Convert null to empty object
  if (!input) {
    return def || {}
  } else if (typeof input == 'object') {
    //Object.prototype.toString.call(input) === "[object Object]"
    return input
  }
  try {
    return JSON.parse(input)
  } catch (e) {
    return def || {}
  }
}

const stringToArrayBuffer = (str: string) => {
  var buf = new ArrayBuffer(str.length)
  var bufView = new Uint8Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
