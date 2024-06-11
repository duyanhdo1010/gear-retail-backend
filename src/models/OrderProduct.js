const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number },
        product: {
          //join bang product vao order
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true, //populate mongodb
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      // city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    // join bang user vao order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

orderSchema.methods.checkProductInOrder = function (productId) {
  return this.orderItems.some(
    (item) => item.product.toString() === productId.toString()
  );
};

orderSchema.methods.checkUserInOrder = function (userId) {
  return this.user.toString() === userId.toString();
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
