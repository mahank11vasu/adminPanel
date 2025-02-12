import { useState } from "react";
import { useProductsQuery, useUpdateProductMutation, useDeleteProductMutation } from "../store/productStore";
import Sidebar from "../components/Sidebar";
import { Modal } from "@mui/material";
import "../styles/EditProduct.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProduct = () => {
  const { data: products, isLoading } = useProductsQuery();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    productImage: null,
  });

  if (isLoading) return <p>Loading products...</p>;

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      type: product.type,
      description: product.description,
      price: product.price,
      productImage: null,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductMutation.mutateAsync(id);
      alert("Product deleted successfully!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, productImage: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (!selectedProduct?._id) {
      console.error("Product ID is missing!");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    if (formData.productImage) {
      formDataToSend.append("productImage", formData.productImage);
    }
  
    try {
      await updateProductMutation.mutateAsync({ id: selectedProduct._id, formData: formDataToSend });
      setOpen(false);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="product-container">
      <Sidebar />
      <div className="product-content">
        <h2>Edit Products</h2>
        <div className="product-list">
          {products?.map((product) => (
            <div key={product._id} className="product-card">
              <img src={`${API_BASE_URL}/${product.productImage}`} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price} Rs</p>
              <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          ))}
        </div>

        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="modal-content">
            <h2>Edit Product</h2>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="type" value={formData.type} onChange={handleChange} required />
            <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            <input type="file" name="productImage" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EditProduct;