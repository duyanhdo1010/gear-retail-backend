const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleware, OrderController.createOrder);
router.get(
  '/get-all-order/:id',
  authUserMiddleware,
  OrderController.getAllOrderDetails
);
router.get('/get-all-order', authUserMiddleware, OrderController.getAllOrder);
router.get('/get-details-order/:id', OrderController.getDetailsOrder);
router.delete(
  '/cancel-order/:id',
  authUserMiddleware,
  OrderController.cancelOrderDetails
);

router.delete('/delete-order/:id', OrderController.DeleteOrders);
router.put('/update/:id', OrderController.updateOrder);

module.exports = router;
