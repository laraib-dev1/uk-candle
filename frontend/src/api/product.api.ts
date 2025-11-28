// frontend/src/api/product.api.ts
import API from "./axios"; // your axios instance

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data.data;
};

export const getProduct = async (id: string) => {
  const res = await API.get(`/products/${id}`);
  return res.data.data;
};

export const createProduct = async (product: any) => {
  const fd = new FormData();
  fd.append("name", product.name);
  fd.append("description", product.description);
  fd.append("category", product.category);
  fd.append("price", String(product.price));
  fd.append("currency", product.currency);
  fd.append("status", product.status);
  fd.append("discount", String(product.discount || 0));

  // meta + videos
  if (product.metaFeatures !== undefined) fd.append("metaFeatures", product.metaFeatures);
  if (product.metaInfo !== undefined) fd.append("metaInfo", product.metaInfo);
  if (product.video1 !== undefined) fd.append("video1", product.video1);
  if (product.video2 !== undefined) fd.append("video2", product.video2);

  // image files: image1..image6 (optional except image1 for add)
  if (product.imageFiles) {
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`;
      const file = product.imageFiles[key];
      if (file) fd.append(key, file);
    }
  }

  const res = await API.post("/products", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateProduct = async (id: string | number, product: any) => {
  const fd = new FormData();
  // append fields if provided
  if (product.name !== undefined) fd.append("name", product.name);
  if (product.description !== undefined) fd.append("description", product.description);
  if (product.category !== undefined) fd.append("category", product.category);
  if (product.price !== undefined) fd.append("price", String(product.price));
  if (product.currency !== undefined) fd.append("currency", product.currency);
  if (product.status !== undefined) fd.append("status", product.status);
  if (product.discount !== undefined) fd.append("discount", String(product.discount));

  if (product.metaFeatures !== undefined) fd.append("metaFeatures", product.metaFeatures);
  if (product.metaInfo !== undefined) fd.append("metaInfo", product.metaInfo);
  if (product.video1 !== undefined) fd.append("video1", product.video1);
  if (product.video2 !== undefined) fd.append("video2", product.video2);

  // image files for replace
  if (product.imageFiles) {
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`;
      const file = product.imageFiles[key];
      if (file) fd.append(key, file);
    }
  }

  const res = await API.put(`/products/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteProduct = async (id: string | number) => {
  const res = await API.delete(`/products/${id}`);
  return res.data.success;
};