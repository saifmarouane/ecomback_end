const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// Configuration du stockage multer en mémoire
const storage = multer.memoryStorage()

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Seules les images sont autorisées'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
})

// Middleware pour traiter les images uploadées
const processImages = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next()
  }

  try {
    const processedImages = {}

    // req.files est un objet avec les propriétés imageLarge et imageSmall
    // Chaque propriété contient un tableau de fichiers
    for (const [fieldName, fileArray] of Object.entries(req.files)) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0] // Prendre le premier fichier du tableau
        const filename = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webp`
        const filepath = path.join(__dirname, '../../uploads', filename)

        // Créer le dossier uploads s'il n'existe pas
        if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
          fs.mkdirSync(path.join(__dirname, '../../uploads'), { recursive: true })
        }

        // Traiter l'image selon le champ
        if (fieldName === 'imageLarge') {
          // Image grande : 800x800 max, qualité 90%
          await sharp(file.buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 90 })
            .toFile(filepath)
          processedImages.imageLarge = `/uploads/${filename}`
        } else if (fieldName === 'imageSmall') {
          // Image petite : 300x300 max, qualité 85%
          await sharp(file.buffer)
            .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(filepath)
          processedImages.imageSmall = `/uploads/${filename}`
        }
      }
    }

    // Gérer la suppression d'images (si la valeur est une chaîne vide)
    if (req.body.imageLarge === '') {
      processedImages.imageLarge = null
    }
    if (req.body.imageSmall === '') {
      processedImages.imageSmall = null
    }

    // Ajouter les chemins des images au body de la requête
    req.body = { ...req.body, ...processedImages }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  upload,
  processImages
}