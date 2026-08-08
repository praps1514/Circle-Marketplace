import api from "./api";

export const getProducts = () => api.get("/products");

export const getProductsByCategory = (categoryId) => api.get(`/products/category/${categoryId}`);

export const createProduct = (data) => api.post("/products", data);