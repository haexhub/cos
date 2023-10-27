import { useFileSystemAccess } from '@vueuse/core'
import { useChamber, useUser } from '../composables'

/**
 * File handling functions
 * @module File
 * @group Files
 * */

/**
 * A method to download any text as a file
 * @param text - the text to download
 * @param fileType - the file type like "application/json"
 * @param fileName - the full file name like "myKey.json"
 * @param isBlob
 */

export function downloadFile(
  text: string | Blob,
  fileType: string,
  fileName: string,
  isBlob = true
) {
  const a = document.createElement('a')
  a.download = fileName

  if (isBlob) {
    a.href = URL.createObjectURL(new Blob([text], { type: fileType }))
    setTimeout(function () {
      URL.revokeObjectURL(a.href)
    }, 1500)
  } else {
    a.href = `data:${fileType};,${text}`
  }
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * Upload and parse JSON keypair
 * @param {Function} callback - a function to handle the loaded file from the reader
 */

export function uploadText(
  files: FileList,
  callback: Function = (r: any) => console.log(r)
) {
  if (!files.length) return
  const file = files[0]
  const maxBytes = 20000000
  if (file.size > maxBytes) {
    console.error('File is bigger than ' + niceBytes(maxBytes)) + ' limit'
    return
  }
  let reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    callback(reader.result)
  }
}

//// https://github.com/itsabdessalam/encodeit/blob/develop/src/components/FileUploader.vue
// to be upgraded with this code https://github.com/powerbot15/image-compressor/blob/master/image-compressor.js
// https://github.com/dhhb/vue-base64-file-upload
// https://zocada.com/compress-resize-images-javascript-browser/

/**
 * @interface PictureUploadOptions
 * @param  preserveRatio - should we preserve the original picture aspect ratio? Default: `false`
 * @param picSize - width of the rendered picture
 * @param  maxSize - maximum size of an uploaded picture
 */

export interface PictureUploadOptions {
  preserveRatio?: boolean
  picSize?: number
  maxSize?: number
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

/**
 * @interface PictureUploadData
 * @param state - a reactive object with the state of the upload
 * @param handleUpload - handler function to use with `@change="handleUpload"` on an `<input type="file">` element
 */

export interface PictureUploadData {
  state: object
  handleChange: Function
}

export interface UploadState {
  errors: any[]
  status: '' | 'loading' | 'success'
  output: object
}

/**
 * Process an uploaded picture by rendering in into a canvas with given size. Returns a base64 encoded image to be stored and displayed as `img.src`
 * @example
 * const src = ref(null)
 *
 * const {state, handleUpload} = usePictureUpload({
 *  preserveRatio: true,
 * })
 *
 * watch(()=>state.output, file => src.value = file.content)
 */

export function usePictureUpload({
  preserveRatio = false,
  picSize = 100,
  maxSize = 10240000,
}: PictureUploadOptions): PictureUploadData {
  const state: UploadState = reactive({
    errors: [],
    status: '',
    output: {},
  })

  function handleChange(event: HTMLInputEvent) {
    const fileList = event.target.files
    reset()
    if (!fileList?.length) return
    state.status = 'loading'
    Array.from(fileList).map((file) => processFile(file))
  }

  function processFile(file: File) {
    fileToBase64(file).then((res: unknown) => {
      if (typeof res === 'string') {
        state.output = {
          name: sanitizeFileName(file.name),
          content: res,
          size: niceBytes(Math.round((res.length * 3) / 4)),
        }
        state.status = 'success'
      }
    })
    return null
  }

  function fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(),
        readerBase64 = new FileReader(),
        blob = file.slice(0, 4)
      reader.readAsArrayBuffer(blob)
      reader.onloadend = (e) => {
        const result = e.target?.result as ArrayBuffer
        let isValidMimeType = checkMimetype(getMimeTypeSignature(result))

        if (bytesToMegabytes(file.size) > bytesToMegabytes(maxSize)) {
          state.errors.push({
            message: 'File size is too large!',
          })
        }

        if (isValidMimeType === false) {
          state.errors.push({
            message: 'File type is not supported!',
          })
        }

        if (state.errors.length > 0) {
          flashErrors(state.errors)
          reset()
          return
        } else {
          readerBase64.readAsDataURL(file)
        }
      }

      readerBase64.onloadend = () => {
        const img = new Image()
        const result = readerBase64.result
        if (typeof result !== 'string') {
          return
        }
        img.src = result
        img.onload = () => {
          const naturalAspect = preserveRatio
            ? img.naturalWidth / img.naturalHeight
            : 1

          const canvas = document.createElement('canvas')
          canvas.width = picSize
          canvas.height = picSize / naturalAspect

          const context = canvas.getContext('2d')
          context?.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL())
        }
      }

      reader.onerror = (error) => reject(error)
      readerBase64.onerror = (error) => reject(error)
    })
  }

  // Resets upload
  function reset() {
    state.status = ''
    state.errors = []
    state.output = {}
  }

  // Converts from bytes to megabytes
  function bytesToMegabytes(bytes: number) {
    const value = bytes * Math.pow(10, -6)
    return value
  }

  // Checks mime type (more at https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern )
  // More info https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
  function checkMimetype(signature: string) {
    const signatures = [
      '89504E47', // image/png
      '47494638', // image/gif
      'FFD8FFDB', // image/jpeg
      'FFD8FFE0',
      'FFD8FFE1',
      'FFD8FFE2',
      'FFD8FFE3',
      'FFD8FFE8',
      'FFD8FFED',
      '3C3F786D', // svg/xml
      '3C737667',
    ]
    return signatures.includes(signature)
  }

  function getMimeTypeSignature(data: ArrayBufferLike) {
    const uint = new Uint8Array(data)
    let bytes: string[] = []
    uint.forEach((byte) => {
      bytes.push(byte.toString(16))
    })
    return bytes.join('').toUpperCase()
  }

  // Sanitizes file's name
  function sanitizeFileName(name: string) {
    return (
      name
        .replace(/\.[^/.]+$/, '')
        // .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()
    )
  }

  function flashErrors(errors: string | any[]) {
    if (errors.length === 2) {
      console.error('File upload failed due to size and type!')
    } else {
      console.error(errors[0].message + errors[0].type)
    }
  }

  return {
    state,
    handleChange,
  }
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

function niceBytes(x: number | string) {
  let l = 0

  let n = parseInt(x + '', 10) || 0

  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]
}

export function base64MimeType(encoded: string): string | null {
  var result = null
  if (typeof encoded !== 'string') {
    return result
  }
  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  if (mime && mime.length) {
    result = mime[1]
  }
  return result
}

export function base64FileType(encoded: string) {
  return encoded.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0]
}

export function base64Extension(encoded: string) {
  return encoded.substring(encoded.indexOf('/') + 1, encoded.indexOf(';base64'))
}

var signatures = {
  'JVBERi0': 'application/pdf',
  'R0lGODdh': 'image/gif',
  'R0lGODlh': 'image/gif',
  'iVBORw0KGgo': 'image/png',
  '/9j/': 'image/jpg',
}

export function detectMimeType(b64: string) {
  let s: keyof typeof signatures
  for (s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s]
    }
  }
}

function saveToFile(data: string[]) {
  let blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })

  let link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'gundb_backup.json'
  link.click()
}

export const saveIndexDb = () => {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open('radata')
    const { user } = useUser()
    const { chamber } = useChamber()

    request.onsuccess = function (event) {
      //@ts-expect-error
      const db = event.target?.result
      let allData: Record<string, string> = {}
      let userData: Record<string, string> = {}

      // Begin a transaction and open an object store
      let transaction = db.transaction(db.objectStoreNames, 'readonly')
      let objectStore = transaction.objectStore(db.objectStoreNames[0]) // Assuming you have one object store

      var loadrequest = objectStore.getAll()

      loadrequest.onerror = (event: Record<string, any>) =>
        reject(event?.target?.error)

      loadrequest.onsuccess = (event: Record<string, any>) => {
        var data = event.target.result
        console.log('loadrequest', data)

        resolve(data)
      }
    }

    request.onerror = (event) => {
      console.error('Could not open IndexedDB:', event.target)
      reject(event)
    }
  })
}

/* const createChamberFileAsync = async () => {
  const dataType = ref('Text') as Ref<'Text' | 'ArrayBuffer' | 'Blob'>
  const { isSupported, data, create, open, save, saveAs, updateData, file } =
    useFileSystemAccess({
      dataType,
      types: [
        {
          description: 'Chamber',
          accept: {
            'application/cos': ['.cos'],
          },
        },
      ],
      excludeAcceptAllOption: true,
    })

  if (!isSupported) throw new Error('FileSystemApi not supported')

  await create({
    suggestedName: 'Chamber.cos',
  })

  const payload = {
    chamber,
    pair: user.pair,
  }
  data.value = JSON.stringify(payload)
  await save()

  console.log('file', file)
} */

/* export const openChamberFileAsync = () => {
  const dataType = ref('Text') as Ref<'Text' | 'ArrayBuffer' | 'Blob'>
  const { isSupported, create, open, save, saveAs, updateData } =
    useFileSystemAccess({

    })

  open({ types: [{ description: 'Chamber', accept: { awd: [''] } }] })
} */

let db: IDBDatabase

function getObjectStore(store_name: string, mode?: IDBTransactionMode) {
  var tx = db.transaction(store_name, mode)
  return tx.objectStore(store_name)
}

export const openIndexDb = (data: {}) => {
  const request = indexedDB.open('radata', 1)
  request.onsuccess = (event) => {
    console.log('onsuccess')

    //db = event.target?.result

    //@ts-expect-error
    console.log(event.target.result)
    //@ts-expect-error
    db = event.target.result
    let store = getObjectStore('radata', 'readwrite')
    for (const [key, value] of Object.entries(data)) {
      console.log('put', key, value)
      store.put(value, key)
    }
  }

  request.onupgradeneeded = (event) => {
    console.log('onupgradeneeded')
    // Save the IDBDatabase interface
    //@ts-expect-error
    const db: IDBDatabase = event.target?.result

    // Create an objectStore for this database
    const objectStore = db.createObjectStore('radata')
  }
}

export const loadChamberToIndexDb = async (data: {}) => {
  console.log('loadChamberToIndexDb', data)

  let store = getObjectStore('radata', 'readwrite')
  for (const [key, value] of Object.entries(data)) {
    console.log(key, value)
    store.add(value, key)
  }
}

/**
 * window.showOpenFilePicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker#parameters
 */
export interface FileSystemAccessShowOpenFileOptions {
  multiple?: boolean
  types?: Array<{
    description?: string
    accept: Record<string, string[]>
  }>
  excludeAcceptAllOption?: boolean
}

/**
 * window.showSaveFilePicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker#parameters
 */
export interface FileSystemAccessShowSaveFileOptions {
  suggestedName?: string
  types?: Array<{
    description?: string
    accept: Record<string, string[]>
  }>
  excludeAcceptAllOption?: boolean
}
