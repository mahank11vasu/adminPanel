import apiClient from "./apiClient";

export const addProduct = async (formData) => {
  const response = await apiClient.post("/products/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllProducts = async () => {
  const response = await apiClient.get("/products/all");
  return response.data;
};

export const updateProduct = async ({ id, formData }) => {
    try {
      const response = await apiClient.put(`/products/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update product!";
    }
  };

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/delete/${id}`);
  return response.data;
};