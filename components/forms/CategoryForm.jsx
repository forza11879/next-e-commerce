const CategoryForm = ({
  formRef,
  nameInputRef,
  mutation,
  name = '',
  handleSubmit,
}) => (
  <form ref={formRef} onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Name</label>
      <input
        type="text"
        className="form-control"
        ref={nameInputRef}
        defaultValue={name}
        autoFocus
        required
      />
      <br />
      <button className="btn btn-outline-primary">
        {mutation.isLoading
          ? 'Saving...'
          : mutation.isError
          ? 'Error'
          : mutation.isSuccess
          ? 'Save'
          : 'Save'}
      </button>
      {/* {mutation.isError ? (
      <pre>{console.log(mutation.error)}</pre>
    ) : null} */}
    </div>
  </form>
);

export default CategoryForm;
