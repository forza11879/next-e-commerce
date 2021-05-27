import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const ParentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    quantity: Number,
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model('Product', ParentSchema);

const avgRating = async function () {
  try {
    const stats = await this.aggregate([
      {
        $addFields: {
          avgRating: { $avg: '$ratings.star' },
          nRatings: { $size: '$ratings' },
        },
      },
    ]);
    console.log('stats: ', stats);
  } catch (err) {
    console.log(`avgRating error from Post updateOne hook${err}`);
  }
};

// Call avgRating after updateOne
ParentSchema.post(
  'updateOne',
  { document: true, query: false },
  async function () {
    await avgRating();
  }
);

export default mongoose.models.Product ||
  mongoose.model('Product', ParentSchema);

import Product from './Product.js';

const updateRating = async (existingRatingObject, star) => {
  const query = {
    ratings: { $elemMatch: existingRatingObject },
  };
  const update = { $set: { 'ratings.$.star': star } };
  const option = { new: true };
  try {
    const doc = new Product();
    const ratingUpdated = await doc.updateOne(query, update, option);
    return ratingUpdated;
  } catch (error) {
    console.log('product model updateRating error: ', error);
  }
};
