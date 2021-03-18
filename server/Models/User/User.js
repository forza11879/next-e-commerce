import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const MODEL_NAME = 'User';

const ParentSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    //   wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const User =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, ParentSchema);
