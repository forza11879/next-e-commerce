import ModalImage from 'react-modal-image';
import { useDispatch } from 'react-redux';
import { getAddProduct } from '@/store/cart';

const laptop = '/images/laptop.png';

const ProductCardInCheckout = ({ item }) => {
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue'];
  let dispatch = useDispatch();

  const handleColorChange = (e) => {
    console.log('color changed', e.target.value);

    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }

      cart.map((product, index) => {
        if (product._id === item._id) {
          cart[index].color = e.target.value;
        }
      });

      //  console.log('cart udpate color', cart)
      localStorage.setItem('cart', JSON.stringify(cart));
      dispatch(getAddProduct(cart));
    }
  };
  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: '100px', height: 'auto' }}>
            {item.images.length ? (
              <ModalImage
                small={item.images[0].url}
                large={item.images[0].url}
              />
            ) : (
              <ModalImage small={laptop} large={laptop} />
            )}
          </div>
        </td>
        <td>{item.title}</td>
        <td>${item.price}</td>
        <td>{item.brand}</td>
        <td>
          <select
            onChange={handleColorChange}
            name="color"
            className="form-control"
          >
            {item.color ? (
              <option value={item.color}>{item.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((color) => color !== item.color)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </td>
        <td>{item.count}</td>
        <td>Shipping Icon</td>
        <td>Delete Icon</td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
