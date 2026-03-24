const AuthService = require('./auth.service')
const authService = new AuthService()

exports.registerClient = async (req, res) => {
  try {
    const { username, password, email } = req.body
    const result = await authService.registerClient(username, password, email)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await authService.login(username, password)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.me = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id)
    res.json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

exports.updateClientProfile = async (req, res) => {
  try {
    const user = await authService.updateClientProfile(req.user.id, req.body)
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.deleteClientProfile = async (req, res) => {
  try {
    await authService.deleteClient(req.user.id)
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await authService.createUser(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await authService.updateUser(req.params.id, req.body)
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await authService.deleteUser(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
