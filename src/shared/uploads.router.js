const express = require('express')
const fs = require('fs')
const path = require('path')
const { openDownloadStream, toObjectId } = require('./gridfs')

const router = express.Router()

function safeName(name) {
  const n = String(name || '').trim()
  if (!n) return null
  if (n.includes('..')) return null
  if (n.includes('/') || n.includes('\\')) return null
  return n
}

function getUploadsDir() {
  // back_end/src/shared -> ../../uploads => back_end/uploads
  return path.resolve(__dirname, '../../uploads')
}

function guessContentTypeFromExt(filename) {
  const ext = path.extname(filename || '').toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.svg') return 'image/svg+xml'
  return ''
}

router.get('/:name', async (req, res) => {
  const name = safeName(req.params.name)
  if (!name) return res.status(400).send('Bad request')

  // 1) Try filesystem (local dev / single instance)
  const diskPath = path.join(getUploadsDir(), name)
  try {
    if (fs.existsSync(diskPath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      return res.sendFile(diskPath)
    }
  } catch {
    // ignore
  }

  // 2) Try GridFS by id (e.g. /uploads/<objectId>.webp)
  const base = name.split('.')[0]
  const id = toObjectId(base)
  if (!id) return res.status(404).send('Not found')

  try {
    const contentType = guessContentTypeFromExt(name)
    if (contentType) res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    const stream = openDownloadStream(id)
    stream.on('error', () => {
      if (!res.headersSent) res.status(404)
      res.end()
    })
    stream.pipe(res)
  } catch {
    return res.status(404).send('Not found')
  }
})

module.exports = router

