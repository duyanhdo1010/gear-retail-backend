const Order = require('../models/OrderProduct');
const EmailService = require('../services/EmailService');
const Product = require('../models/ProductModel');

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      // city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: 'OK',
            message: 'SUCCESS',
          };
        } else {
          return {
            status: 'OK',
            message: 'ERR',
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: 'ERR',
          message: `San pham voi id: ${arrId.join(',')} khong du hang`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            // city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
        });
        if (createdOrder) {
          await EmailService.sendEmailCreateOrder(
            email,
            orderItems,
            totalPrice,
            createdOrder._id // Send the order id
          );
          resolve({
            status: 'OK',
            message: 'success',
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: 'ERR',
          message: 'The order is not defined',
        });
      }

      resolve({
        status: 'OK',
        message: 'SUCESSS',
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: 'ERR',
          message: ' Order không xác định',
        });
      }
      resolve({
        status: 'OK',
        message: 'SUCESSS',
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: 'ERR',
              message: 'The order is not defined',
            });
          }
        } else {
          return {
            status: 'OK',
            message: 'ERR',
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results[0].id;

      if (newData) {
        resolve({
          status: 'ERR',
          message: `San pham voi id: ${newData} khong ton tai`,
        });
      }
      resolve({
        status: 'OK',
        message: 'success',
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      // .sort({
      //   createdAt: -1,
      //   updatedAt: -1,
      // });
      resolve({
        status: 'OK',
        message: 'Success',
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const DeleteOrders = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({
        _id: id,
      });
      if (checkOrder === null) {
        resolve({
          status: 'ERR',
          message: 'Sản phẩm không đúng',
        });
      }

      await Order.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Xóa đơn hàng thành công',
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({
        _id: id,
      });
      if (checkOrder === null) {
        resolve({
          status: 'ERR',
          message: 'Đơn hàng không tồn tại',
        });
      }

      const updatedorder = await Order.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: 'OK',
        message: 'Success',
        data: updatedorder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyOrder = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Order.deleteMany({ _id: ids });
      resolve({
        status: 'OK',
        message: 'Xóa đơn hàng thành công',
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
  DeleteOrders,
  updateOrder,
  deleteManyOrder,
};
