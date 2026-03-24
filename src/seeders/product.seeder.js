const ProductModel = require('../domains/product/product.model')
const CategoryModel = require('../domains/category/category.model')

async function seedProducts() {
  try {
    // Check if products already exist
    const count = await ProductModel.count()
    if (count > 0) {
      console.log(`✅ ${count} products already in database`)
      return
    }

    // Get or create categories
    const [catHoney] = await CategoryModel.findOrCreate({
      where: { name: 'Miel' },
      defaults: { description: 'Produits de miel pure' }
    })

    const [catOrganic] = await CategoryModel.findOrCreate({
      where: { name: 'Biologique' },
      defaults: { description: 'Produits biologiques' }
    })

    // Seed sample products
    const products = [
      {
        name: 'Miel Pur Forestier',
        description: 'Miel naturel récolté directement de nos ruches en forêt. Riche en saveur et en nutriments.',
        price: 12.99,
        originalPrice: 15.99,
        stock: 50,
        isActive: true,
        categoryId: catHoney.id,
        imageLarge: '/uploads/product-forest-honey-large.webp',
        imageSmall: '/uploads/product-forest-honey-small.webp'
      },
      {
        name: 'Miel Fleur Sauvage',
        description: 'Miel délicat aux parfums floraux provenant de fleurs sauvages. Couleur claire et goût léger.',
        price: 14.99,
        originalPrice: 17.99,
        stock: 45,
        isActive: true,
        categoryId: catHoney.id,
        imageLarge: '/uploads/product-wildflower-honey-large.webp',
        imageSmall: '/uploads/product-wildflower-honey-small.webp'
      },
      {
        name: 'Miel Bio Certifié Premium',
        description: 'Certification bio complète. Miel premium de la plus haute qualité, sans traitement chimique.',
        price: 19.99,
        originalPrice: 24.99,
        stock: 30,
        isActive: true,
        categoryId: catOrganic.id,
        imageLarge: '/uploads/product-bio-premium-large.webp',
        imageSmall: '/uploads/product-bio-premium-small.webp'
      },
      {
        name: 'Miel Manuka Spécial',
        description: 'Miel Manuka importé. Propriétés antibactériennes naturelles exceptionnelles.',
        price: 28.99,
        originalPrice: 34.99,
        stock: 20,
        isActive: true,
        categoryId: catOrganic.id,
        imageLarge: '/uploads/product-manuka-large.webp',
        imageSmall: '/uploads/product-manuka-small.webp'
      }
    ]

    await ProductModel.bulkCreate(products)
    console.log(`✅ Seeded ${products.length} sample products`)
  } catch (error) {
    console.error('❌ Error seeding products:', error.message)
  }
}

module.exports = seedProducts
