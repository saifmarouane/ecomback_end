const CategoryService = require('./category.service')

const service = new CategoryService()

exports.getAll = async (req, res) => {
  try {
    const categories = await service.getAllCategories()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getById = async (req, res) => {
  try {
    const category = await service.getCategoryById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ message: 'Image obligatoire' })
    }
    const category = await service.createCategory(req.body)
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const category = await service.updateCategory(req.params.id, req.body)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.delete = async (req, res) => {
  try {
    await service.deleteCategory(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
