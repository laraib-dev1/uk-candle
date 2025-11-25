import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/Product";

type Mode = "add" | "edit" | "view";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  mode?: Mode;
  initialData?: Partial<Product>;
  onSubmit: (data: Product | Partial<Product>) => void;
}

/**
 * Keep using your dev uploaded sample image — replace if necessary
 */
const SAMPLE_IMAGE = "/mnt/data/8030fe7d-4145-4924-b18c-634a71efd451.png";

const ProductModal: React.FC<Props> = ({
  open,
  onClose,
  onOpenChange,
  mode = "add",
  initialData = {},
  onSubmit,
}) => {
  const [form, setForm] = useState<Product>({
    id: Date.now(),
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: SAMPLE_IMAGE,
    status: "active",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && initialData) {
      setForm((prev) => ({
        ...prev,
        ...(initialData as Product),
      }));
    } else if (mode === "add") {
      setForm({
        id: Date.now(),
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        image: SAMPLE_IMAGE,
        status: "active",
      });
    }
  }, [mode, initialData, open]);

  const handleOpenChange = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    if (!val) onClose();
  };

  const disabled = mode === "view";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "price" || name === "stock" ? Number(value || 0) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === "add") {
        try {
          const res = await axios.post("/api/products", form);
          onSubmit(res.data);
        } catch (err) {
          onSubmit(form);
        }
      } else if (mode === "edit" && initialData?.id) {
        try {
          const res = await axios.put(`/api/products/${initialData.id}`, form);
          onSubmit(res.data);
        } catch (err) {
          onSubmit(form);
        }
      }

      handleOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => handleOpenChange(val)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === "add" ? "Add Product" : mode === "edit" ? "Edit Product" : "View Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image preview + URL */}
          <div className="space-y-2">
            <Label>Thumbnail URL</Label>
            <Input
              name="image"
              value={form.image || ""}
              onChange={handleChange}
              placeholder="Image URL"
              disabled={disabled}
            />
            <div className="h-32 w-full bg-gray-100 rounded flex items-center justify-center border overflow-hidden">
              {form.image ? (
                <img src={form.image} alt={form.name} className="h-full object-contain" />
              ) : (
                <span className="text-sm text-gray-400">No image</span>
              )}
            </div>
          </div>

          {/* Right side fields */}
          <div className="space-y-3">
            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                disabled={disabled}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Price</Label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Quantity"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          {/* Full width description */}
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
              disabled={disabled}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 space-x-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>

          {mode !== "view" && (
            <Button onClick={handleSubmit}>
              {mode === "add" ? "Add Product" : "Update Product"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
