const { mongoose } = require('./database')
const { GridFSBucket, ObjectId } = require('mongodb')
const { Readable } = require('stream')

function ensureDb() {
  const db = mongoose.connection?.db
  if (!db) throw new Error('MongoDB non connecté')
  return db
}

function getBucket() {
  const db = ensureDb()
  return new GridFSBucket(db, { bucketName: 'uploads' })
}

function toObjectId(value) {
  try {
    return new ObjectId(String(value))
  } catch {
    return null
  }
}

async function uploadBuffer({ buffer, filename, contentType }) {
  const bucket = getBucket()
  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename || 'file', {
      contentType: contentType || 'application/octet-stream'
    })
    stream.on('error', reject)
    stream.on('finish', () => resolve(stream.id))
    Readable.from(buffer).pipe(stream)
  })
}

function openDownloadStream(id) {
  const bucket = getBucket()
  return bucket.openDownloadStream(id)
}

module.exports = {
  toObjectId,
  uploadBuffer,
  openDownloadStream
}

