import ModalImage from 'react-modal-image';
import { useDispatch } from 'react-redux';
import { getAddProduct } from '@/store/cart';
import { toast } from 'react-toastify';

const laptop = '/images/laptop.png';

const ProductCardInCheckout = ({ product }) => {
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue'];
  let dispatch = useDispatch();

  const handleColorChange = (e) => {
    const color = e.target.value;
    dispatch(getAddProduct(product, color, undefined));
  };

  const handleQuantityChange = (e) => {
    const count = e.target.value < 1 ? 1 : e.target.value;

    if (count > product.quantity) {
      toast.error(`Max available quantity: ${product.quantity}`);
      return;
    }

    dispatch(getAddProduct(product, undefined, count));
  };
  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: '100px', height: 'auto' }}>
            {product.images.length ? (
              <ModalImage
                small={product.images[0].url}
                large={product.images[0].url}
              />
            ) : (
              <ModalImage small={laptop} large={laptop} />
            )}
          </div>
        </td>
        <td>{product.title}</td>
        <td>${product.price}</td>
        <td>{product.brand}</td>
        <td>
          <select
            onChange={handleColorChange}
            name="color"
            className="form-control"
          >
            {product.color ? (
              <option value={product.color}>{product.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((color) => color !== product.color)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </td>
        <td className="text-center">
          <input
            type="number"
            className="form-control"
            value={product.count}
            onChange={handleQuantityChange}
          />
        </td>
        <td>Shipping Icon</td>
        <td>Delete Icon</td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
