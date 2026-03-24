class CategoryRepository {
  constructor() {
    this.model = require('./category.model')
  }

  async create(data) {
    return this.model.create(data)
  }

  async findAll() {
    return this.model.find()
  }

  async findById(id) {
    return this.model.findById(id)
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id)
  }
}

module.exports = CategoryRepository
