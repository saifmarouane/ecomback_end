const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

async function connect() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI manquant dans le fichier .env')
  }

  await mongoose.connect(uri)
  return mongoose.connection
}

async function disconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

module.exports = {
  mongoose,
  connect,
  disconnect
}
