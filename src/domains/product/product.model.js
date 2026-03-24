const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    publishedAt: { type: Date, default: Date.now },
    imageLarge: { type: String, default: null },
    imageSmall: { type: String, default: null },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
  },
  { timestamps: true }
)

ProductSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
})

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  }
})

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema)
