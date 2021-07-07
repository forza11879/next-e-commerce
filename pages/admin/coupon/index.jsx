import nookies from 'nookies';
import admin from '@/firebase/index';
import { QueryClient } from 'react-query';
import { currentUser } from '@/Models/User/index';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
// import {
//   getCoupons,
//   removeCoupon,
//   createCoupon,
// } from '../../../functions/coupon';
import 'react-datepicker/dist/react-datepicker.css';
import { DeleteOutlined } from '@ant-design/icons';
import {
  couponQueryKeys,
  useQueryCoupons,
  useMutationCreateCoupon,
  useMutationRemoveCoupon,
} from '@/hooks/query/coupon';
import AdminNav from '@/components/nav/AdminNav';
import { listCoupon } from '@/Models/Coupon/index';

const CreateCouponPage = ({ token }) => {
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState('');

  const couponsUseQuery = useQueryCoupons();
  console.log('couponsUseQuery.data: ', couponsUseQuery.data);

  const createCouponUseMutation = useMutationCreateCoupon();
  const removeCouponUseMutation = useMutationRemoveCoupon();

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      url: '/coupon',
      token: token,
      method: 'post',
      data: { coupon: { name, expiry, discount } },
      props: { setName, setExpiry, setDiscount },
    };

    createCouponUseMutation.mutate(options);
  };

  const handleRemove = (couponId) => {
    const options = {
      url: `${process.env.api}/coupon/${couponId}`,
      token: token,
      data: { couponId },
    };
    if (window.confirm('Delete?')) {
      removeCouponUseMutation.mutate(options);
      //   setLoading(true);
      //   removeCoupon(couponId, user.token)
      //     .then((res) => {
      //       loadAllCoupons(); // load all coupons
      //       setLoading(false);
      //       toast.error(`Coupon "${res.data.name}" deleted`);
      //     })
      //     .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {couponsUseQuery.data?.loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={expiry}
                value={expiry}
                onChange={(date) => setExpiry(date)}
                required
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>
          <br />

          <h4>{couponsUseQuery.data?.length} Coupons</h4>

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {couponsUseQuery.data?.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{new Date(item.expiry).toLocaleDateString()}</td>
                  <td>{item.discount}%</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(item._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const { appToken } = nookies.get(context);
  let isAdmin = false;
  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const user = await currentUser(email);

    if (user.role === 'admin') isAdmin = true;

    // Using Hydration
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(...couponQueryKeys.coupons, listCoupon);

    // console.log('isAdmin getServerSideProps: ', isAdmin);
    return {
      props: {
        token: appToken,
        isAdmin: isAdmin, // will be passed to the page component as props. always return an object with the props key
      },
    };
  } catch (error) {
    // console.log('error FIREBASsE: ', error.errorInfo.message);
    console.log('error FIREBASsE: ', error);

    if (error) {
      return {
        // notFound: true,
        redirect: {
          destination: '/login',
          permanent: false,
          // statusCode - In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.
        },
      };
    }
  }
}

export default CreateCouponPage;
