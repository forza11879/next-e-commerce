import mongoose from 'mongoose';
import Category from '@/Models/Category';
import SubCategory from '@/Models/SubCategory';
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
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subcategories: [
      {
        type: ObjectId,
        ref: 'SubCategory',
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ['Yes', 'No'],
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    },
    brand: {
      type: String,
      enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ParentSchema.statics.avgRating = async function (id) {
//   try {
//     const stats = await this.model('Product').aggregate([
//       { $match: { _id: id } },
//       {
//         $addFields: {
//           avgRating: { $avg: '$ratings.star' },
//           nRatings: { $size: '$ratings' },
//         },
//       },
//     ]);
//     console.log('stats: ', stats);
//   } catch (err) {
//     console.log(`avgRating error from Pre SAVE hook${err}`);
//   }
// };

// Call avgRating before save
// ParentSchema.post('save', async function () {
//   await this.constructor.avgRating(this._id);
// });

export default mongoose.models.Product ||
  mongoose.model('Product', ParentSchema);
