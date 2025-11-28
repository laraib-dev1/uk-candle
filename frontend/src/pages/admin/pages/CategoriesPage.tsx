// frontend/src/pages/admin/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import DataTable from "../components/table/DataTable";
import { ProductActions } from "../../../components/admin/product/ProductActions";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryModal from "@/components/admin/product/CategoryModal";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/api/category.api";
import DeleteModal from "@/components/admin/product/DeleteModal";
import { Category } from "../../../types/Category";
interface CategoryFromAPI {
  _id: string;
  name: string;
  icon: string;
  products: number;
}
export default function CategoriesPage() {
  const [search, setSearch] = useState("");
const [modalOpen, setModalOpen] = React.useState(false);
const [modalMode, setModalMode] = React.useState<"add" | "edit" | "view">("add");
const [selected, setSelected] = React.useState<Category | null>(null);
 const [categories, setCategories] = useState<Category[]>([]);
 const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

 useEffect(() => {
    fetchCategories();
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
    alert("Category ID is missing!");
    return;
  }

  try {
    await deleteCategory(deleteTarget.id);
    setDeleteOpen(false);
    setDeleteTarget(null);
    fetchCategories();
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to delete category");
  }
};

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-visible">

      {/* -------- Header Row -------- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#8B5E3C]">Categories</h2>

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
          onClick={openAdd}
          >
            + Add New
          </Button>
        </div>
      </div>

      {/* -------- Table -------- */}
      <div className="bg-white shadow rounded-lg p-3 overflow-visible">
  <DataTable
          columns={[
{
  name: "ID",
  cell: (row, index) => index + 1, // 👈 Auto row number
  width: "60px",
  sortable: false,
},
            {
              name: "Icon",
              cell: (row) => <img src={row.icon || "/default-category.png"} alt="" className="w-8 h-8 rounded-full object-cover" />,
              width: "100px",
            },
            { name: "Category", selector: (row) => row.name, sortable: true },
            { name: "Products", selector: (row) => row.products, sortable: true },
          ]}
          data={filtered}
          pagination
          actions={(row: Category) => (
            <ProductActions
              row={row}
              onView={openView}
              onEdit={openEdit}
              onDelete={() => handleDeleteClick(row)}

            />
          )}
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
