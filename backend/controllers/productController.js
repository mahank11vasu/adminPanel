import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";

export const addProduct = async (req, res) => {
  const { name, type, description, price } = req.body;
  const productImage = req.file ? req.file.path : null;

  try {
    const newProduct = new Product({ name, type, description, price, productImage });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, type, description, price } = req.body;
  const newImage = req.file ? req.file.path : null;

  try {
    let product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (newImage && product.productImage) {
      fs.unlinkSync(product.productImage); 
    }

    product.name = name || product.name;
    product.type = type || product.type;
    product.description = description || product.description;
    product.price = price || product.price;
    product.productImage = newImage || product.productImage;

    await product.save();
    res.json({ message: "Product updated successfully!", product });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found!" });

    if (product.productImage) {
      fs.unlinkSync(product.productImage);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};