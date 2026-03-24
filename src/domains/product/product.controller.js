const Product = require('./product.model')

function normalizeProductPayload(body) {
  const payload = { ...body }

  if (payload.categoryId === '' || payload.categoryId === 'null') payload.categoryId = null
  if (payload.originalPrice === '' || payload.originalPrice === 'null') payload.originalPrice = null
  if (payload.stock === '' || payload.stock === 'null') payload.stock = null

  const maybeNumber = ['price', 'originalPrice', 'stock']
  for (const key of maybeNumber) {
    if (payload[key] !== undefined && payload[key] !== null && typeof payload[key] === 'string') {
      const v = Number(payload[key])
      if (!Number.isNaN(v)) payload[key] = v
    }
  }

  if (payload.isActive !== undefined && typeof payload.isActive === 'string') {
    if (payload.isActive === 'true') payload.isActive = true
    if (payload.isActive === 'false') payload.isActive = false
  }

  return payload
}

exports.createProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body)
    const product = await Product.create(payload)
    const created = await Product.findById(product.id).populate('category')
    res.status(201).json(created)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category')
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    const payload = normalizeProductPayload(req.body)
    product.set(payload)
    await product.save()
    const updated = await Product.findById(product.id).populate('category')
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    await Product.findByIdAndDelete(product.id)
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
