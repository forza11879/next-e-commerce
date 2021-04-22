import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const ParentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: { type: ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SubCategory ||
  mongoose.model('SubCategory', ParentSchema);
