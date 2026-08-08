import api from "./api";

export const getProducts = (params = {}) => api.get("/products", { params });

export const getProductsByCategory = (categoryId) => api.get(`/products/category/${categoryId}`);

export const createProduct = (data) => api.post("/products", data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);