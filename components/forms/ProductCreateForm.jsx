import SelectOption from '@/components/forms/SelectOption';

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  handleCatagoryChange,
  setValues,
  values,
  refOptions,
  mutation,
  showSub,
}) => {
  const {
    title,
    description,
    price,
    categories,
    category,
    subcategories,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;
  const {
    formRef,
    titleInputRef,
    descriptionInputRef,
    priceInputRef,
    quantityInputRef,
    // shippingInputRef,
    // colorInputRef,
    // brandInputRef,
    // categoryInputRef,
    // subcategoriesInputRef,
    // imagesInputRef,
  } = refOptions;

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          ref={titleInputRef}
          defaultValue={title}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          ref={descriptionInputRef}
          defaultValue={description}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          ref={priceInputRef}
          defaultValue={price}
        />
      </div>

      <div className="form-group">
        <label>Shipping</label>
        <select
          type="text"
          name="shipping"
          className="form-control"
          // ref={shippingInputRef}
          // defaultValue={shipping}
          onChange={handleChange}
        >
          <option>Please select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          ref={quantityInputRef}
          defaultValue={quantity}
        />
      </div>

      <div className="form-group">
        <label>Color</label>
        <select
          type="text"
          name="color"
          className="form-control"
          // ref={colorInputRef}
          // defaultValue={color}
          onChange={handleChange}
        >
          <option>Please select</option>
          {colors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand</label>
        <select
          type="text"
          name="brand"
          className="form-control"
          // ref={brandInputRef}
          // defaultValue={brand}
          onChange={handleChange}
        >
          <option>Please select</option>
          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          onChange={handleCatagoryChange}
        >
          <option>Please select</option>
          {categories.length > 0 &&
            categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
        </select>
      </div>

      {showSub && (
        <SelectOption
          setValues={setValues}
          subcategories={subcategories}
          category={category}
          values={values}
        />
      )}

      <br />
      <button className="btn btn-outline-info">
        {mutation.isLoading
          ? 'Saving...'
          : mutation.isError
          ? 'Error'
          : mutation.isSuccess
          ? 'Save'
          : 'Save'}
      </button>
    </form>
  );
};

export default ProductCreateForm;
