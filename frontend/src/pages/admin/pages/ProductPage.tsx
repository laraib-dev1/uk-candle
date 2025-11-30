// frontend/src/pages/admin/pages/ProductPage.tsx
import React, { useEffect, useState } from "react";
import DataTable from "../components/table/DataTable"; // make sure path is correct
import { ProductActions } from "../../../components/admin/product/ProductActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductModal from "../../../components/admin/product/ProductModal";
import { getProducts, createProduct, updateProduct, deleteProduct as apiDelete } from "@/api/product.api";
import { getCategories } from "@/api/category.api";
import DeleteModal from "../../../components/admin/product/DeleteModal";

interface Category {
  _id: string;
  name: string;
}

interface ProductAPI {
  _id: string;
  name: string;
  description: string;
  category: string | { _id: string; name: string };
  price: number;
  currency: string;
  status: "active" | "inactive";
  discount?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  categoryName?: string;
  price: number;
  currency: string;
  status: "active" | "inactive";
  discount?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
}

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  const mapProduct = (p: ProductAPI, cats: Category[]): Product => {
    let categoryId = "";
    let categoryName = "Unknown";

    if (typeof p.category === "string") {
      categoryId = p.category;
      const cat = cats.find(c => c._id === p.category);
      if (cat) categoryName = cat.name;
    } else if (typeof p.category === "object" && p.category?._id) {
      categoryId = p.category._id;
      categoryName = p.category.name || "Unknown";
    }

    return {
      ...p,
      id: p._id,
      category: categoryId,
      categoryName,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);

        const productsArray = await getProducts();
const mapped = productsArray.map((p: ProductAPI) => mapProduct(p, cats));
        setProducts(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    if (!categories.length) return;
    const productsArray = await getProducts();
const mapped = productsArray.map((p: ProductAPI) => mapProduct(p, categories));
    setProducts(mapped);
    setFiltered(mapped);
  };

  const addProduct = async (product: Product) => {
    const newProduct = await createProduct(product);
    const mapped = mapProduct(newProduct, categories);
    setProducts(prev => [...prev, mapped]);
    setFiltered(prev => [...prev, mapped]);
  };

  const updateProductApi = async (id: string, product: Product) => {
    await updateProduct(id, product);
    fetchProducts();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await apiDelete(deleteId);
    setDeleteLoading(false);
    setDeleteOpen(false);
    fetchProducts();
  };

  useEffect(() => {
    if (!search) return setFiltered(products);
    setFiltered(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  const openAddModal = () => { setSelected(null); setModalMode("add"); setModalOpen(true); };
  const openEditModal = (product: Product) => { setSelected(product); setModalMode("edit"); setModalOpen(true); };
  const openViewModal = (product: Product) => { setSelected(product); setModalMode("view"); setModalOpen(true); };

const getColumns = () => {
  const allColumns = [
    { name: "ID", cell: (_row: Product, i: number) => i + 1, grow: 0 },
    { name: "Image", cell: (row: Product) => <img src={row.image1 || row.image2 || "/product.png"} alt={row.name} className="w-8 h-8 rounded-full object-cover border" />, minWidth: "60px", grow: 0 },
    { name: "Name", selector: (row: Product) => row.name, sortable: true },
    { 
  name: "Description", 
  selector: (row: Product) => row.description, 
  cell: (row: Product) => <span className="truncate block max-w-[200px]">{row.description}</span> 
},
    { name: "Category", selector: (row: Product) => row.categoryName || row.category, sortable: true },
    { name: "Price", selector: (row: Product) => `${row.price} ${row.currency}`, sortable: true },
    { name: "Status", selector: (row: Product) => row.status, sortable: true },
    { name: "Actions", cell: (row: Product) => <ProductActions row={row} onView={() => openViewModal(row)} onEdit={() => openEditModal(row)} onDelete={() => { setDeleteId(row.id || null); setDeleteOpen(true); }} />, minWidth: "100px", grow: 0 },
  ];

  // Small screens: only 4 columns
  if (windowWidth < 640) {
    return allColumns.filter(c => ["ID", "Image", "Name", "Actions"].includes(c.name));
  }

  // Medium screens: 5 columns
  if (windowWidth < 768) {
    return allColumns.filter(c => ["ID", "Image", "Name",  "Actions"].includes(c.name));
  }
   if (windowWidth < 800) {
    return allColumns.filter(c => ["ID", "Image", "Name",  "Actions"].includes(c.name));
  }

  // Large screens: all columns
  return allColumns;
};



  return (
    <div className="bg-white shadow rounded-lg p-4 md:p-6 overflow-visible">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
        <h2 className="text-2xl font-semibold text-[#8B5E3C]">Products</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-64 border-[#C4A484] text-gray-900" />
          <Button className="bg-[#C69C6D] hover:bg-[#b88b5f] text-white w-full sm:w-auto" onClick={openAddModal}>
            + Add New
          </Button>
        </div>
      </div>

    <div className="w-full overflow-x-auto">
  <DataTable<Product>
    columns={getColumns()}
    data={filtered}
    pagination
    dense
    responsive
  />
</div>


      <ProductModal open={modalOpen} mode={modalMode} categories={categories} data={selected ?? undefined} onClose={() => setModalOpen(false)}
        onSubmit={async payload => {
          const productPayload: Product = { ...payload, category: typeof payload.category === "object" ? payload.category._id : payload.category };
          if (modalMode === "add") await addProduct(productPayload);
          else if (modalMode === "edit" && selected?.id) await updateProductApi(selected.id, productPayload);
          setModalOpen(false);
          fetchProducts();
        }}
      />

      <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} loading={deleteLoading} title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." />
    </div>
  );
}
