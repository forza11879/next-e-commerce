import nookies from 'nookies';
import admin from '@/firebase/index';
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
import { useQueryCoupons, useMutationCreateCoupon } from '@/hooks/query/coupon';
import AdminNav from '@/components/nav/AdminNav';

const CreateCouponPage = ({ token }) => {
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState('');
  // const [loading, setLoading] = useState('');

  // const couponsUseQuery = useQueryCoupons();
  // console.log('couponsUseQuery.data: ', couponsUseQuery.data);

  const createCouponUseMutation = useMutationCreateCoupon();

  // redux
  // const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);
    const options = {
      url: '/coupon',
      token: token,
      method: 'post',
      data: { coupon: { name, expiry, discount } },
      props: { setName, setExpiry, setDiscount },
    };

    createCouponUseMutation.mutate(options);

    console.table(name, expiry, discount);
    // createCoupon({ name, expiry, discount }, user.token)
    //   .then((res) => {
    //     // setLoading(false);
    //     // setName('');
    //     // setDiscount('');
    //     // setExpiry('');
    //     // toast.success(`"${res.data.name}" is created`);
    //   })
    //   .catch((err) => console.log('create coupon err', err));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Coupon</h4>

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
    // console.log('user getServerSideProps: ', user);
    // console.log(typeof user.role);
    // console.log('user.role getServerSideProps: ', user.role);

    if (user.role === 'admin') isAdmin = true;

    // console.log('isAdmin getServerSideProps: ', isAdmin);
    return {
      props: {
        token: appToken,
        isAdmin: isAdmin, // will be passed to the page component as props. always return an object with the props key
      },
    };
  } catch (error) {
    console.log('error FIREBASsE: ', error.errorInfo.message);
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
