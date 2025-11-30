import React from "react";
import { z, ZodIssue } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface Category {
  id?: string;
  name: string;
  icon: string;
  products: number;
}

interface CategoryModalProps {
  open: boolean;
  mode: "add" | "edit" | "view";
  data?: Category;
  onClose: () => void;
  onSubmit: (formData: Category) => void;
}

// Zod schema for validation
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  icon: z.string().min(1, "Icon is required"),
  products: z
    .number()
    .int()
    .nonnegative("Products must be 0 or more")
    .optional(),
});

export default function CategoryModal({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [form, setForm] = React.useState<Category>({
    name: data?.name || "",
    icon: data?.icon || "",
    products: data?.products || 0,
  });

  const [error, setError] = React.useState<{ name?: string; icon?: string; products?: string }>({});

  React.useEffect(() => {
    setForm({
      name: data?.name || "",
      icon: data?.icon || "",
      products: data?.products || 0,
    });
    setError({});
  }, [data, open]);

  const isView = mode === "view";

  // Handle image upload with size validation (1MB max)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError({ ...error, icon: "Image must be smaller than 1MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, icon: reader.result as string });
      setError({ ...error, icon: undefined });
    };
    reader.readAsDataURL(file);
  };


const handleSubmit = () => {
  // Add default image if icon is empty
  const updatedForm = {
    ...form,
    icon: form.icon || "/category.png",
  };

  const result = categorySchema.safeParse(updatedForm);

  if (!result.success) {
    const issues: Record<string, string> = {};
    result.error.issues.forEach((err: ZodIssue) => {
      const key = err.path[0] as string;
      if (key) issues[key] = err.message;
    });

    setError(issues);
    return;
  }

  onSubmit(updatedForm);
};


  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className=" bg-white text-black">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" && "Add Category"}
            {mode === "edit" && "Edit Category"}
            {mode === "view" && "View Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={form.name}
              disabled={isView}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={error.name ? "border-red-500" : ""}
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>

          {/* Products */}
          <div>
            <label className="text-sm font-medium">Products</label>
            <Input
              type="number"
              value={form.products}
              disabled={isView}
              onChange={(e) =>
                setForm({ ...form, products: Number(e.target.value) })
              }
              className={error.products ? "border-red-500" : ""}
            />
            {error.products && <p className="text-red-500 text-sm">{error.products}</p>}
          </div>

          {/* Icon */}
          <div>
            <label className="text-sm font-medium">Icon (1:1)</label>
            {isView ? (
              form.icon && (
                <img
                  src={form.icon}
                  alt="icon"
                  className="w-24 h-24 object-cover rounded"
                />
              )
            ) : (
              <>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {form.icon && (
                  <img
                    src={form.icon}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded mt-2"
                  />
                )}
              </>
            )}
            {error.icon && <p className="text-red-500 text-sm">{error.icon}</p>}
          </div>
        </div>

        {!isView && (
          <DialogFooter>
            <Button onClick={handleSubmit}>{mode === "add" ? "Add" : "Update"}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
