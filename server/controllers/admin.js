import { findAllOrders, updateOrder } from '@/Models/Order/index';

export const ordersController = async (req, res) => {
  try {
    const allOrders = await findAllOrders();
    res.status(200).json(allOrders);
  } catch (error) {
    console.log('admin ordersController controller error: ', error);
  }
};

export const orderStatusController = async (req, res) => {
  const { orderId, orderStatus } = req.body;

  try {
    const updated = await updateOrder(orderId, orderStatus);
    res.status(200).json(updated);
  } catch (error) {
    console.log('admin orderStatusController controller error: ', error);
  }
};
