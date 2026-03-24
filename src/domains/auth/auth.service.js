const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AdminRepository = require('./admin.repository')

class AuthService {
  constructor() {
    this.adminRepo = new AdminRepository()
  }

  buildSafeUser(user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }
  }

  createToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET
    )
  }

  async registerClient(username, password, email) {
    const existingUser = await this.adminRepo.findByUsername(username)
    if (existingUser) throw new Error('Username déjà utilisé')

    if (email) {
      const existingEmail = await this.adminRepo.findByEmail(email)
      if (existingEmail) throw new Error('Email déjà utilisé')
    }

    const client = await this.adminRepo.createUser({
      username,
      password,
      role: 'client',
      email: email || null
    })

    return {
      user: this.buildSafeUser(client),
      token: this.createToken(client)
    }
  }

  async login(username, password) {
    const user = await this.adminRepo.findByUsername(username)
    if (!user) throw new Error('Utilisateur non trouvé')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Mot de passe incorrect')

    return {
      user: this.buildSafeUser(user),
      token: this.createToken(user)
    }
  }

  async getMe(userId) {
    const user = await this.adminRepo.findById(userId)
    if (!user) throw new Error('Utilisateur introuvable')
    return this.buildSafeUser(user)
  }

  async updateClientProfile(userId, { username, password, email }) {
    const user = await this.adminRepo.findById(userId)
    if (!user || user.role !== 'client') throw new Error('Client introuvable')

    if (username && username !== user.username) {
      const existingUser = await this.adminRepo.findByUsername(username)
      if (existingUser) throw new Error('Username déjà utilisé')
    }

    if (email && email !== user.email) {
      const existingEmail = await this.adminRepo.findByEmail(email)
      if (existingEmail) throw new Error('Email déjà utilisé')
    }

    const payload = {}
    if (username) payload.username = username
    if (email !== undefined) payload.email = email
    if (password) payload.password = password

    const updatedUser = await this.adminRepo.updateProfile(userId, payload)
    return this.buildSafeUser(updatedUser)
  }

  async deleteClient(userId) {
    const user = await this.adminRepo.findById(userId)
    if (!user || user.role !== 'client') throw new Error('Client introuvable')
    await this.adminRepo.deleteById(userId)
  }

  async getAllUsers() {
    return this.adminRepo.findAll()
  }

  async createUser(data) {
    const { username, password, role = 'client', email } = data
    const existingUser = await this.adminRepo.findByUsername(username)
    if (existingUser) throw new Error('Username déjà utilisé')

    if (email) {
      const existingEmail = await this.adminRepo.findByEmail(email)
      if (existingEmail) throw new Error('Email déjà utilisé')
    }

    const user = await this.adminRepo.createUser({ username, password, role, email })
    return this.buildSafeUser(user)
  }

  async updateUser(id, data) {
    const user = await this.adminRepo.findById(id)
    if (!user) throw new Error('Utilisateur introuvable')

    if (data.username && data.username !== user.username) {
      const existingUser = await this.adminRepo.findByUsername(data.username)
      if (existingUser) throw new Error('Username déjà utilisé')
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await this.adminRepo.findByEmail(data.email)
      if (existingEmail) throw new Error('Email déjà utilisé')
    }

    const updatedUser = await this.adminRepo.updateProfile(id, data)
    return this.buildSafeUser(updatedUser)
  }

  async deleteUser(id) {
    const user = await this.adminRepo.findById(id)
    if (!user) throw new Error('Utilisateur introuvable')
    await this.adminRepo.deleteById(id)
  }
}

module.exports = AuthService
