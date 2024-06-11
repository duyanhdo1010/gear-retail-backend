const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const ProductService = require('../services/ProductService');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
      discount,
    } = req.body;
    if (
      !name ||
      !image ||
      !type ||
      !countInStock ||
      !price ||
      !rating ||
      !discount
    ) {
      return res.status(200).json({
        status: 'ERR',
        message: 'All fields are required',
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'productId is required',
      });
    }
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'productId is required',
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'productId is required',
      });
    }
    const orders = await Order.find({});
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].checkProductInOrder(productId)) {
        return res.status(400).json({
          status: 'ERR',
          message: 'Sản phẩm này đã tồn tại trong 1 order',
        });
      }
    }

    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: 'ERR',
        message: 'productIds is required',
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit),
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: `Controller: ${e}`,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,
};
