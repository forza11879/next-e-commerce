import mongoose from 'mongoose';
// import User from '@/Models/User/User';
// import Product from '@/Models/Product/Product';

const { ObjectId } = mongoose.Schema;

const ParentSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model('Cart', ParentSchema);
