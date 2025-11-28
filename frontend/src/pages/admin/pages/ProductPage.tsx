// frontend/src/pages/admin/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import DataTable from "../components/table/DataTable";
import { ProductActions } from "../../../components/admin/product/ProductActions";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductModal from "../../../components/admin/product/ProductModal";
import { getProducts, createProduct, updateProduct, deleteProduct as apiDelete } from "@/api/product.api";
import { getCategories } from "@/api/category.api"; 
import DeleteModal from "@/components/admin/product/DeleteModal";
interface Product {
  id?: string; // ✅ make optional
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  status: "active" | "inactive";
  discount?: number;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
}
export default function ProductPage() {
  const [search, setSearch] = useState("");
   const [products, setProducts] = useState<Product[]>([]); // all products
  const [filtered, setFiltered] = useState<Product[]>([]); // filtered by search
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);

const [categories, setCategories] = useState<Category[]>([]);
useEffect(() => {
const fetchData = async () => {
  try {
    // 1️⃣ Fetch categories
    const cats: Category[] = await getCategories();
    console.log("Fetched categories:", cats);
    setCategories(cats);

    // 2️⃣ Fetch products
    const productsArray = await getProducts(); // already array
    console.log("getProducts response:", productsArray);

    // 3️⃣ Map category IDs to names
    const mapped = productsArray.map((p: any) => ({
      ...p,
      id: p._id?.toString(),
      category:
        typeof p.category === "string"
          ? cats.find((c) => c._id === p.category)?.name || p.category
          : p.category?.name || "Unknown",
    }));

    console.log("Mapped products:", mapped);

    setProducts(mapped);
    setFiltered(mapped);
  } catch (err) {
    console.error("Error loading products or categories:", err);
    setProducts([]);
    setFiltered([]);
  }
};


    fetchData();
  }, []);

  // -------- ADD PRODUCT --------

const addProduct = async (product: Product) => {
    const newProduct = await createProduct(product);
    const mapped = {
      ...newProduct,
      id: newProduct._id,
      category:
        categories.find((c) => c._id === newProduct.category)?.name ||
        newProduct.category,
    };
    setProducts((prev) => [...prev, mapped]);
    setFiltered((prev) => [...prev, mapped]);
  };



const updateProductApi = async (id: string, product: Product) => {
  await updateProduct(id, product);
  fetchProducts();
};

const deleteProduct = async (id: string) => {
  await apiDelete(id);
  fetchProducts();
};
const fetchProducts = async () => {
  if (categories.length === 0) return;

  try {
    const productsArray = await getProducts(); // already array
    console.log("productsArray", productsArray);

    const mapped = productsArray.map((p: any) => ({
      ...p,
      id: p._id,
      category: categories.find((c) => c._id === p.category)?.name ?? "Unknown",
    }));

    console.log("Mapped products:", mapped);

    setProducts(mapped);
    setFiltered(mapped);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};



useEffect(() => {
  if (search) {
    setFiltered(
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  } else {
    setFiltered(products);
  }
}, [search, products]);

    const openAddModal = () => {
    setSelected(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelected(product);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (product: Product) => {
    setSelected(product);
    setModalMode("view");
    setModalOpen(true);
  };
  const confirmDelete = async () => {
  if (!deleteId) return;

  try {
    setDeleteLoading(true);
    await apiDelete(deleteId); // use your delete API
    setDeleteOpen(false);
    await fetchProducts(); // refresh table
  } finally {
    setDeleteLoading(false);
  }
};


  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-visible">

      {/* -------- Header Row -------- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#8B5E3C]">Products</h2>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border-[#C4A484] text-gray-900"
            />
          </div>

          {/* Add Button */}
          <Button className="bg-[#C69C6D] hover:bg-[#b88b5f] text-white"
          onClick={openAddModal}
          >
            + Add New
          </Button>
        </div>
      </div>

      {/* -------- Table -------- */}
      <div className="w-full overflow-x-auto bg-white p-3 rounded-lg shadow">
  <DataTable
  columns={[
{
  name: "ID",
  cell: (row, index) => index + 1, // 👈 Auto row number
  width: "60px",
  sortable: false,
},
{
      name: "Image",
      cell: (row) => (
        <img
          src={row.image || "/product.png"}
          alt={row.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
      width: "100px",
    },

    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "Price", selector: (row) => `${row.price} ${row.currency}`, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },

    // ✅ FIXED ROW ACTIONS
    {
      name: "Actions",
      cell: (row) => (
        <ProductActions
          row={row}
          onView={() => openViewModal(row)}
          onEdit={() => openEditModal(row)}
          onDelete={() => {
  setDeleteId(row.id || null);
  setDeleteOpen(true);
}}

        />
      ),
      // allowOverflow: true,
      // button: true,
      // width: "150px",
    },
  ]}
  data={filtered}
  pagination
/>

</div>
<ProductModal
  open={modalOpen}
  mode={modalMode}
  categories={categories}  // ✅ added
  data={selected ?? undefined}
  onClose={() => setModalOpen(false)}
  onSubmit={async (formData) => {
    if (modalMode === "add") {
  await addProduct(formData); // id can be undefined
} else if (modalMode === "edit" && selected && selected.id) {
  await updateProductApi(selected.id, formData);
}

    setModalOpen(false);
    fetchProducts();
  }}
/>

<DeleteModal
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  onConfirm={confirmDelete}
  loading={deleteLoading}
  title="Delete Product"
  message="Are you sure you want to delete this product? This action cannot be undone."
/>


    </div>
  );
}
