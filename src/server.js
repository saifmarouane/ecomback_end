require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })
const app = require('./app')
const { connect } = require('./shared/database')
const seedAdmin = require('./seeders/admin.seeder')

const API_URL = process.env.API_URL || "https://ecombackend-staging.up.railway.app"
const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await connect()
    await seedAdmin()
    console.log('MongoDB connecté ✅')

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur ${API_URL} (port ${PORT}) 🚀`)
    })
  } catch (error) {
    console.error('Erreur connexion DB ❌', error)
  }
}

startServer()
