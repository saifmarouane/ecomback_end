const mongoose = require('mongoose')

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 }
  },
  { _id: true }
)

CartItemSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
})

CartItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  }
})

const CartSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['active', 'ordered', 'processing', 'shipped', 'delivered', 'canceled'],
      default: 'active'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [CartItemSchema], default: [] },
    comment: { type: String, default: '' }
  },
  { timestamps: true }
)

CartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  }
})

module.exports = mongoose.models.Cart || mongoose.model('Cart', CartSchema)
