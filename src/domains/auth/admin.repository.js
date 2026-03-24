const UserModel = require('./auth.model')
const bcrypt = require('bcryptjs')

class AdminRepository {
  async createUser({ username, password, role = 'client', email = null }) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return UserModel.create({ username, password: hashedPassword, role, email })
  }

  async findByUsername(username) {
    return UserModel.findOne({ username })
  }

  async findByEmail(email) {
    return UserModel.findOne({ email })
  }

  async findById(id) {
    return UserModel.findById(id)
  }

  async updateProfile(id, data) {
    const user = await this.findById(id)
    if (!user) return null

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    user.set(data)
    await user.save()
    return user
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id)
  }

  async findAdmin() {
    return UserModel.findOne({ role: 'admin' })
  }

  async findAll() {
    return UserModel.find().select('-password')
  }
}

module.exports = AdminRepository
