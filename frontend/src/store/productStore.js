import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "../api/productApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useProductStore = create(
  persist(
    (set) => ({
      products: [],

      fetchProducts: async () => {
        try {
          const data = await getAllProducts();
          set({ products: data });
          return data;
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
    }),
    { name: "product-storage" }
  )
);

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: useProductStore.getState().fetchProducts,
    refetchOnWindowFocus: true,
    retry: false,
  });
};

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};

export default useProductStore;