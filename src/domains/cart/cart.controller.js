const CartModel = require('./cart.model')
const ProductModel = require('../product/product.model')

async function getOrCreateActiveCart(userId) {
  const existing = await CartModel.findOne({ userId, status: 'active' })
  if (existing) return existing
  return CartModel.create({ userId, status: 'active', items: [] })
}

exports.getMyCart = async (req, res) => {
  try {
    const cart = await getOrCreateActiveCart(req.user.id)
    const full = await CartModel.findById(cart.id).populate({
      path: 'items.product',
      populate: { path: 'category' }
    })
    res.json(full)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addItem = async (req, res) => {
  try {
    const productId = String(req.body.productId || '').trim()
    const qty = Number(req.body.quantity || 1)
    if (!productId) return res.status(400).json({ message: 'productId invalide' })
    if (!qty || qty < 1) return res.status(400).json({ message: 'quantity invalide' })

    const product = await ProductModel.findById(productId)
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })

    const cart = await getOrCreateActiveCart(req.user.id)
    const existingItem = cart.items.find((i) => i.productId.toString() === productId)

    if (existingItem) {
      existingItem.quantity += qty
      await cart.save()
      return res.status(200).json(existingItem.toJSON())
    }

    cart.items.push({ productId, quantity: qty })
    await cart.save()
    const created = cart.items[cart.items.length - 1]
    res.status(201).json(created.toJSON())
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateItem = async (req, res) => {
  try {
    const itemId = String(req.params.id || '').trim()
    const qty = Number(req.body.quantity)
    if (!itemId) return res.status(400).json({ message: 'id invalide' })
    if (Number.isNaN(qty) || qty < 0) return res.status(400).json({ message: 'quantity invalide' })

    const cart = await getOrCreateActiveCart(req.user.id)
    const item = cart.items.id(itemId)
    if (!item) return res.status(404).json({ message: 'Item introuvable' })

    if (qty === 0) {
      item.deleteOne()
      await cart.save()
      return res.status(204).send()
    }

    item.quantity = qty
    await cart.save()
    res.json(item.toJSON())
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.removeItem = async (req, res) => {
  try {
    const itemId = String(req.params.id || '').trim()
    if (!itemId) return res.status(400).json({ message: 'id invalide' })

    const cart = await getOrCreateActiveCart(req.user.id)
    const item = cart.items.id(itemId)
    if (!item) return res.status(404).json({ message: 'Item introuvable' })

    item.deleteOne()
    await cart.save()
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.clear = async (req, res) => {
  try {
    const cart = await getOrCreateActiveCart(req.user.id)
    cart.items = []
    await cart.save()
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
