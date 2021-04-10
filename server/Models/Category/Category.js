import mongoose from 'mongoose';

const MODEL_NAME = 'Category';

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
  },
  { timestamps: true }
);

// export const Category =
//   mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, ParentSchema);

export default mongoose.models.Category ||
  mongoose.model('Category', ParentSchema);
