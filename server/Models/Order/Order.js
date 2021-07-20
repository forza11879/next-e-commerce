import mongoose from 'mongoose';
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
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'processing',
        'Dispatched',
        'Cancelled',
        'Completed',
      ],
    },
    orderedBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', ParentSchema);
