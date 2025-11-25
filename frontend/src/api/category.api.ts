import API from "./axios";

export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data.data;
};

export const addCategory = async (category: any) => {
  const res = await API.post("/categories", category);
  return res.data.data;
};

export const updateCategory = async (id: string | number, category: any) => {
  const res = await API.put(`/categories/${id}`, category);
  return res.data.data;
};

export const deleteCategory = async (id: string | number) => {
  const res = await API.delete(`/categories/${id}`);
  return res.data.success;
};
