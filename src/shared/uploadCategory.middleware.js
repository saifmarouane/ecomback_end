const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { uploadBuffer } = require('./gridfs')

async function processCategoryImage(req, res, next) {
  if (!req.file) return next()

  try {
    const storage = String(process.env.UPLOAD_STORAGE || 'disk').toLowerCase()
    const filename = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webp`

    const buffer = await sharp(req.file.buffer)
      .resize(320, 320, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer()

    if (storage === 'gridfs') {
      const id = await uploadBuffer({ buffer, filename, contentType: 'image/webp' })
      req.body.image = `/uploads/${id.toString()}.webp`
      return next()
    }

    const uploadsDir = path.join(__dirname, '../../uploads')
    const filepath = path.join(uploadsDir, filename)

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    await sharp(buffer).toFile(filepath)
    req.body.image = `/uploads/${filename}`
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  processCategoryImage
}
