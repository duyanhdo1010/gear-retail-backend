const Product = require('../models/ProductModel');
const bcrypt = require('bcrypt');

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
      discount,
    } = newProduct;

    try {
      const checkProduct = await Product.findOne({ name: name });
      if (checkProduct !== null) {
        resolve({
          status: 'OK',
          message: 'Product already exists',
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        countInStock,
        price,
        rating,
        description,
        discount,
      });
      if (newProduct) {
        resolve({
          status: 'OK',
          message: 'Product created successfully',
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      if (checkProduct === null) {
        resolve({
          status: 'OK',
          message: 'Product not found',
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: 'OK',
        message: 'Product updated successfully',
        data: updatedProduct,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: 'OK',
          message: 'Product not found',
        });
      }
      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: product,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      if (checkProduct === null) {
        resolve({
          status: 'OK',
          message: 'Product not found',
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Product deleted',
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: 'OK',
        message: 'Product deleted',
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.estimatedDocumentCount();
      let allProduct = [];
      if (filter) {
        const allObjectFilter = await Product.find({
          [filter[0]]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: 'OK',
          message: 'Success',
          data: allObjectFilter,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: 'OK',
          message: 'Success',
          data: allProductSort,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (!limit) {
        allProduct = await Product.find();
      } else {
        allProduct = await Product.find()
          .limit(limit)
          .skip(page * limit);
      }
      resolve({
        status: 'OK',
        message: 'Success',
        data: allProduct,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct('type');
      resolve({
        status: 'OK',
        message: 'Success',
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
