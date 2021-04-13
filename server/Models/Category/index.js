import Category from './Category';
import slugify from 'slugify';

const create = async (name) => {
  console.log('name: ', name);
  try {
    const newCategory = await Category.create({
      name: name,
      slug: slugify(name),
    });
    return newCategory;
  } catch (error) {
    console.log('create model error: ', error);
  }
};

const list = async () => {
  try {
    const query = {};
    const categoryList = await Category.find(query).sort({ createdAt: -1 });
    console.log('categoryList: ', categoryList);
    return JSON.stringify(categoryList);
  } catch (error) {
    console.log('list model error: ', error);
  }
};

const read = async (slug) => {
  try {
    const query = { slug: slug };
    const category = await Category.findOne(query);
    return category;
  } catch (error) {
    console.log('read model error: ', error);
  }
};

const update = async (slug, name) => {
  const query = { slug };
  const update = { name: name, slug: slugify(name) };
  const options = { new: true };
  try {
    const updated = await Category.findOneAndUpdate(query, update, options);
    return updated;
  } catch (error) {
    console.log('update model error: ', error);
  }
};

const remove = async (slug) => {
  const query = { slug: slug };
  const options = {};
  try {
    const deleted = await Category.findOneAndDelete(query, options);
    return deleted;
  } catch (error) {
    console.log('remove model error: ', error);
  }
};

export { create, list, read, update, remove };
