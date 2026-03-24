const bcrypt = require('bcryptjs')
const UserModel = require('../domains/auth/auth.model')

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const email = process.env.ADMIN_EMAIL || null

  const existingAdmin = await UserModel.findOne({ username, role: 'admin' })

  if (existingAdmin) return existingAdmin

  const hashedPassword = await bcrypt.hash(password, 10)

  return UserModel.create({
    username,
    password: hashedPassword,
    role: 'admin',
    email
  })
}

module.exports = seedAdmin
