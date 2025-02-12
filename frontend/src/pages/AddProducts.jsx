import { useState } from "react";
import { useAddProductMutation } from "../store/productStore";
import Sidebar from "../components/Sidebar";
import "../styles/Product.css";

const AddProduct = () => {
  const addProductMutation = useAddProductMutation();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    productImage: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, productImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync(formData);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product-container">
      <Sidebar />
      <div className="product-content">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
          <input type="text" name="type" placeholder="Product Type" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
          <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
          <input type="file" name="productImage" onChange={handleFileChange} required />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;