// frontend/src/pages/admin/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import DataTable from "../components/table/DataTable";
import { ProductActions } from "../../../components/admin/product/ProductActions";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryModal from "@/components/admin/product/CategoryModal";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/api/category.api";

interface Category {
  id: number;
  icon: string;
  name: string;
  products: number;
}

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
const [modalOpen, setModalOpen] = React.useState(false);
const [modalMode, setModalMode] = React.useState<"add" | "edit" | "view">("add");
const [selected, setSelected] = React.useState<Category | null>(null);
 const [categories, setCategories] = useState<Category[]>([]);
  // Dummy table data (you will replace with API)
  // const categories: Category[] = [
  //   { id: 1, icon: "/cat1.png", name: "Category 1", products: 45 },
  //   { id: 2, icon: "/cat2.png", name: "Category 2", products: 10 },
  //   { id: 3, icon: "/cat3.png", name: "Category 3", products: 87 },
  // ];
 useEffect(() => {
    fetchCategories();
  }, []);
const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
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

const handleDelete = async (category: Category) => {
  try {
    await deleteCategory(category.id); // or category._id if your API uses _id
    alert("Category deleted successfully!");
    fetchCategories(); // refresh the list
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to delete category");
  }
};


  // Table Columns
  // const columns: TableColumn<Category>[] = [
  //   {
  //     name: "ID",
  //     selector: (row) => row.id,
  //     sortable: true,
  //     width: "80px",
  //   },
  //   {
  //     name: "Icon",
  //     cell: (row) => (
  //       <img
  //         src={row.icon}
  //         alt=""
  //         className="w-8 h-8 rounded-full object-cover"
  //       />
  //     ),
  //     width: "100px",
  //   },
  //   {
  //     name: "Category",
  //     selector: (row) => row.name,
  //     sortable: true,
  //   },
  //   {
  //     name: "Products",
  //     selector: (row) => row.products,
  //     sortable: true,
  //   },
  // ];

  return (
    <div className="p-6">

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
            { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
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
              onDelete={handleDelete}
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

    </div>
  );
}
