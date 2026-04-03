const CartModel = require('../cart/cart.model')

const ORDER_STATUSES = ['ordered', 'processing', 'shipped', 'delivered', 'canceled']

function normalizeStatus(value) {
  return String(value || '').trim().toLowerCase()
}

function isValidOrderStatus(status) {
  return ORDER_STATUSES.includes(status)
}

exports.listOrders = async (req, res) => {
  try {
    const status = normalizeStatus(req.query.status)
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 80)))
    const q = { status: { $ne: 'active' } }
    if (status) {
      if (!isValidOrderStatus(status)) {
        return res.status(400).json({ message: 'status invalide' })
      }
      q.status = status
    }

    const orders = await CartModel.find(q)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: 'userId', select: 'username email role' })
      .populate({
        path: 'items.product',
        populate: { path: 'category' }
      })

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const id = String(req.params.id || '').trim()
    if (!id) return res.status(400).json({ message: 'id invalide' })

    const order = await CartModel.findById(id)
      .populate({ path: 'userId', select: 'username email role' })
      .populate({
        path: 'items.product',
        populate: { path: 'category' }
      })

    if (!order || order.status === 'active') return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const id = String(req.params.id || '').trim()
    if (!id) return res.status(400).json({ message: 'id invalide' })

    const status = normalizeStatus(req.body?.status)
    if (!isValidOrderStatus(status)) return res.status(400).json({ message: 'status invalide' })

    const order = await CartModel.findById(id)
    if (!order || order.status === 'active') return res.status(404).json({ message: 'Commande introuvable' })

    order.status = status
    await order.save()

    const full = await CartModel.findById(order.id)
      .populate({ path: 'userId', select: 'username email role' })
      .populate({
        path: 'items.product',
        populate: { path: 'category' }
      })

    res.json(full)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateOrderComment = async (req, res) => {
  try {
    const id = String(req.params.id || '').trim()
    if (!id) return res.status(400).json({ message: 'id invalide' })

    const comment = req.body?.comment
    if (comment !== undefined && comment !== null && typeof comment !== 'string') {
      return res.status(400).json({ message: 'comment invalide' })
    }

    const normalized = String(comment || '').trim()
    if (normalized.length > 500) return res.status(400).json({ message: 'comment trop long' })

    const order = await CartModel.findById(id)
    if (!order || order.status === 'active') return res.status(404).json({ message: 'Commande introuvable' })

    order.comment = normalized
    await order.save()

    const full = await CartModel.findById(order.id)
      .populate({ path: 'userId', select: 'username email role' })
      .populate({
        path: 'items.product',
        populate: { path: 'category' }
      })

    res.json(full)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.stats = async (req, res) => {
  try {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const byStatusAgg = await CartModel.aggregate([
      { $match: { status: { $ne: 'active' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const byStatus = {}
    for (const s of ORDER_STATUSES) byStatus[s] = 0
    for (const row of byStatusAgg) {
      if (row?._id) byStatus[String(row._id)] = Number(row.count || 0)
    }

    const dailyAgg = await CartModel.aggregate([
      { $match: { status: { $ne: 'active' }, createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
    ])

    const pad2 = (n) => String(n).padStart(2, '0')
    const dailyMap = new Map()
    for (const row of dailyAgg) {
      const y = row._id?.y
      const m = row._id?.m
      const d = row._id?.d
      if (!y || !m || !d) continue
      dailyMap.set(`${y}-${pad2(m)}-${pad2(d)}`, Number(row.count || 0))
    }

    const last7Days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      const key = `${day.getFullYear()}-${pad2(day.getMonth() + 1)}-${pad2(day.getDate())}`
      last7Days.push({ date: key, count: dailyMap.get(key) || 0 })
    }

    const total = Object.values(byStatus).reduce((sum, v) => sum + Number(v || 0), 0)

    res.json({ total, byStatus, last7Days })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
