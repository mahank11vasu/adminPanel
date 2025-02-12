import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", productSchema);
export default Product;