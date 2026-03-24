const CategoryRepository = require('./category.repository')

class CategoryService {
  constructor() {
    this.repo = new CategoryRepository()
  }

  async getAllCategories() {
    return this.repo.findAll()
  }

  async getCategoryById(id) {
    return this.repo.findById(id)
  }

  async createCategory(data) {
    return this.repo.create(data)
  }

  async updateCategory(id, data) {
    return this.repo.update(id, data)
  }

  async deleteCategory(id) {
    return this.repo.delete(id)
  }
}

module.exports = CategoryService