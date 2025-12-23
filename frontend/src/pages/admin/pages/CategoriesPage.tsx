// frontend/src/pages/admin/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../components/table/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryModal from "@/components/admin/product/CategoryModal";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/api/category.api";
import DeleteModal from "@/components/admin/product/DeleteModal";
import { Category } from "../../../types/Category";
import { useToast } from "@/components/ui/toast";
interface CategoryFromAPI {
  _id: string;
  name: string;
  icon: string;
  products: number;
}
export default function CategoriesPage() {
  const { success, error } = useToast();
  const [search, setSearch] = useState("");
const [modalOpen, setModalOpen] = React.useState(false);
const [modalMode, setModalMode] = React.useState<"add" | "edit" | "view">("add");
const [selected, setSelected] = React.useState<Category | null>(null);
 const [categories, setCategories] = useState<Category[]>([]);
 const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

 useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
const fetchCategories = async () => {
  try {
    const data = await getCategories();
    setCategories(
      data.map((cat: CategoryFromAPI) => ({
        id: cat._id,
        icon: cat.icon,
        name: cat.name,
        products: cat.products,
      }))
    );
  } catch (err) {
    console.error(err);
  }
};

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
const openAdd = () => {
  setSelected(null);
  setModalMode("add");
  setModalOpen(true);
};

const openEdit = (row: Category) => {
  setSelected(row);
  setModalMode("edit");
  setModalOpen(true);
};

const openView = (row: Category) => {
  setSelected(row);
  setModalMode("view");
  setModalOpen(true);
};

const handleDeleteClick = (category: Category) => {
  setDeleteTarget(category);
  setDeleteOpen(true);
};

const confirmDelete = async () => {
  if (!deleteTarget || !deleteTarget.id) {
    error("Category ID is missing!");
    return;
  }

  try {
    await deleteCategory(deleteTarget.id);
    success("Category deleted successfully!");
    setDeleteOpen(false);
    setDeleteTarget(null);
    fetchCategories();
  } catch (err: any) {
    error(err.response?.data?.message || "Failed to delete category");
  }
};

const getColumns = () => {
  const allColumns = [
    {
      name: "ID",
      cell: (_row, index) => <span className="text-gray-600">{index + 1}</span>,
      minWidth: "60px",
    },
    {
      name: "Category",
      heading: (row) => row.name,
      subInfo: (row) => `${row.products || 0} products`,
      minWidth: "200px",
    },
    {
      name: "Icon",
      cell: (row) => (
        <img 
          src={row.icon || "/default-category.png"} 
          alt={row.name} 
          className="w-10 h-10 rounded-full object-cover border border-gray-200" 
        />
      ),
      minWidth: "80px",
    },
  ];

  // Breakpoints: 600px, 800px, 900px, 1000px, 1200px, 2040px
  if (windowWidth < 600) {
    // Very small screens: ID, Category, Actions (hide Icon)
    return allColumns.filter((_, idx) => [0, 1].includes(idx));
  }

  if (windowWidth < 800) {
    // Small screens: ID, Category, Actions (hide Icon)
    return allColumns.filter((_, idx) => [0, 1].includes(idx));
  }

  if (windowWidth < 900) {
    // Medium-small screens: ID, Category, Icon, Actions
    return allColumns.filter((_, idx) => [0, 1, 2].includes(idx));
  }

  if (windowWidth < 1000) {
    // Medium screens: All columns
    return allColumns;
  }

  if (windowWidth < 1200) {
    // Large-medium screens: All columns
    return allColumns;
  }

  // Extra large screens (1200px+): All columns
  return allColumns;
};

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-visible">

      {/* -------- Header Row -------- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold theme-heading">Categories</h2>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 text-black"
            />
          </div>

          {/* Add Button */}
          <Button className="text-white theme-button"
          onClick={openAdd}
          >
            + Add New
          </Button>
        </div>
      </div>

      {/* -------- Table -------- */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-visible">
        <EnhancedDataTable<Category>
          columns={getColumns()}
          data={filtered}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDeleteClick}
          pagination
        />
      </div>
<CategoryModal
  open={modalOpen}
  mode={modalMode}
  data={selected ?? undefined}
  onClose={() => setModalOpen(false)}
 onSubmit={async (formData) => {   // <-- add async here
    if (modalMode === "add") {
      await addCategory(formData);
    } else if (modalMode === "edit" && selected) {
      await updateCategory(selected.id, formData);
    }
    setModalOpen(false);
    fetchCategories();
  }}
/>
<DeleteModal
  open={deleteOpen}
  title="Delete Category"
  message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
  onClose={() => setDeleteOpen(false)}
  onConfirm={confirmDelete}
/>

    </div>
  );
}
