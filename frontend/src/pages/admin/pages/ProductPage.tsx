import React, { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ProductModal from "../../../components/admin/product/ProductModal";
import { Product } from "@/types/Product";
import { ProductActions } from "../../../components/admin/product/ProductActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import axios from "axios";

/**
 * NOTE: using the uploaded file path as sample image (dev environment).
 * If your server doesn't serve /mnt/data, update it to a public URL or static folder.
 */
const SAMPLE_IMAGE = "/mnt/data/8030fe7d-4145-4924-b18c-634a71efd451.png";

const LOCAL_KEY = "products_v1";

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Lorem ipsum dolor sit",
    description: "Description details here...",
    price: 340,
    stock: 10,
    category: "Category",
    image: SAMPLE_IMAGE,
    status: "active",
  },
  {
    id: 2,
    name: "Lorem ipsum dolor sit",
    description: "Description details here...",
    price: 570,
    stock: 5,
    category: "Category",
    image: SAMPLE_IMAGE,
    status: "active",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selected, setSelected] = useState<Product | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(15);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // ignore — fallback to local storage / defaults
        console.error("API products not available, falling back:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProducts(Array.isArray(parsed) ? parsed : defaultProducts);
      } catch {
        setProducts(defaultProducts);
      }
    } else {
      setProducts((prev) => (prev.length ? prev : defaultProducts));
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(products));
  }, [products]);

  const openAdd = () => {
    setModalMode("add");
    setSelected(null);
    setOpenModal(true);
  };

  const openEdit = (row: Product) => {
    setModalMode("edit");
    setSelected(row);
    setOpenModal(true);
  };

  const openView = (row: Product) => {
    setModalMode("view");
    setSelected(row);
    setOpenModal(true);
  };

  const handleDelete = async (row: Product) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/products/${row.id}`);
      setProducts((p) => p.filter((x) => x.id !== row.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product — fallback removed locally.");
      setProducts((p) => p.filter((x) => x.id !== row.id));
    }
  };

  const handleSubmit = (data: Product | Partial<Product>) => {
    const product: Product = {
      id: (data as any).id ?? selected?.id ?? Date.now(),
      name: data.name ?? "",
      description: data.description ?? "",
      price: data.price ?? 0,
      stock: data.stock ?? 0,
      category: data.category ?? "",
      image: data.image ?? SAMPLE_IMAGE,
      status: data.status ?? "active",
    };

    if (modalMode === "add") {
      setProducts((prev) => [product, ...prev]);
    } else if (modalMode === "edit" && selected) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    }

    setOpenModal(false);
  };

  // Data table column definitions with tight/compact styling
  const columns: TableColumn<Product>[] = useMemo(
    () => [
      {
        name: "ID",
        selector: (row) => String(row.id),
        width: "70px",
        cell: (row) => <div className="text-sm text-gray-600">{row.id}</div>,
      },
      {
        name: "Image",
        cell: (row) => (
          <div className="h-10 w-10 rounded overflow-hidden bg-white border">
            <img
              src={row.image || SAMPLE_IMAGE}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          </div>
        ),
        width: "80px",
      },
      {
        name: "Item Title",
        selector: (row) => row.name || "",
        grow: 2,
        cell: (row) => <div className="font-medium">{row.name}</div>,
      },
      {
        name: "Description",
        selector: (row) => row.description || "",
        grow: 3,
        cell: (row) => <div className="text-sm text-gray-500">{row.description}</div>,
      },
      {
        name: "Category",
        selector: (row) => row.category || "",
        width: "140px",
        cell: (row) => <div className="text-sm">{row.category}</div>,
      },
      {
        name: "Price",
        selector: (row) => `$${row.price}`,
        width: "100px",
        right: true,
        cell: (row) => <div className="text-sm font-medium">${row.price}</div>,
      },
      {
        name: "Status",
        cell: (row) =>
          row.status === "active" ? (
            <Badge className="bg-green-100 text-green-800">active</Badge>
          ) : (
            <Badge className="bg-gray-200 text-gray-700">disable</Badge>
          ),
        width: "120px",
      },
      {
        name: "Actions",
        cell: (row) => (
          <ProductActions<Product>
            row={row}
            onView={openView}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ),
        width: "160px",
        right: true,
      },
    ],
    // handlers are stable within component
    []
  );

  // Filter logic
  const filtered = Array.isArray(products)
    ? products.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // react-data-table-component custom styles for the look
  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
        background: "#f6f2ef", // subtle header tint (not the table header row)
      },
    },
    headRow: {
      style: {
        background: "#a87f6f", // brown header like screenshot
        color: "#fff",
        borderRadius: "8px",
        paddingLeft: "12px",
        paddingRight: "12px",
        minHeight: "40px",
      },
    },
    headCells: {
      style: {
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
      },
    },
    rows: {
      style: {
        minHeight: "56px",
        fontSize: "13px",
      },
    },
    pagination: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#eee",
        paddingTop: "8px",
      },
    },
  } as const;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#a87f6f]">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded p-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                className="text-sm outline-none bg-transparent"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-xs"
            />

            <Button onClick={openAdd} className="bg-[#a87f6f] text-white">
              + Add New
            </Button>
          </div>
        </div>

        {/* DataTable */}
        <div className="shadow-sm rounded-xl overflow-hidden border">
          <DataTable
            columns={columns}
            data={filtered}
            customStyles={customStyles}
            pagination
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[15, 25, 50]}
            paginationComponentOptions={{ rowsPerPageText: "Show", rangeSeparatorText: "of" }}
            highlightOnHover
            pointerOnHover
            dense
            noDataComponent={<div className="p-8 text-center text-gray-600">There are no records to display</div>}
          />
        </div>

        {/* Modal */}
        <ProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onOpenChange={(val: boolean) => setOpenModal(val)}
          mode={modalMode}
          initialData={selected || undefined}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
