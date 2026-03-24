const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function processCategoryImage(req, res, next) {
  if (!req.file) return next()

  try {
    const filename = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webp`
    const uploadsDir = path.join(__dirname, '../../uploads')
    const filepath = path.join(uploadsDir, filename)

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    await sharp(req.file.buffer)
      .resize(320, 320, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(filepath)

    req.body.image = `/uploads/${filename}`
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  processCategoryImage
}

