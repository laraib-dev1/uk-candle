import React from "react";
import { X } from "lucide-react";
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
import ImageCropperModal from "./ImageCropperModal";

interface Category {
  id?: string;
  name: string;
  icon: string;
  iconFile?: File; 
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
const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setForm({
      name: data?.name || "",
      icon: data?.icon || "",
      products: data?.products || 0,
    });
    setError({});
  }, [data, open]);

  const isView = mode === "view";

   // open cropper when file selected
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileForCrop(file);
    setCropModalOpen(true);
  };

  // when crop done
  const handleCropDone = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "category.jpg", {
      type: "image/jpeg",
    });

    setForm(prev => ({
      ...prev,
      iconFile: file,
      icon: URL.createObjectURL(file),
    }));

    setCropModalOpen(false);
  };

  const handleRemoveIcon = () => {
    setForm(prev => ({ ...prev, icon: "", iconFile: undefined }));
    setError(prev => ({ ...prev, icon: undefined }));
  };

const handleSubmit = async () => {
  if (isSubmitting) return;
  
  // Validate form
  const updatedForm = { ...form, icon: form.icon || "/category.png" };
  const result = categorySchema.safeParse(updatedForm);
  if (!result.success) {
    const issues: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      const key = err.path[0] as string;
      if (key) issues[key] = err.message;
    });
    setError(issues);
    return;
  }
  
  setIsSubmitting(true);
  try {
    await Promise.resolve(onSubmit(updatedForm));
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="admin-dialog-content bg-white text-black p-0 gap-0 overflow-hidden">
        <DialogHeader className="admin-modal-header flex items-center justify-between text-left px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-white font-semibold">
            {mode === "add" && "Add Category"}
            {mode === "edit" && "Edit Category"}
            {mode === "view" && "View Category"}
          </DialogTitle>
          <button type="button" onClick={onClose} className="p-1.5 rounded text-white hover:bg-white/20 transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-900">Name</label>
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
            <label className="text-sm font-medium text-gray-900">Products</label>
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
            <label className="text-sm font-medium text-gray-900">Icon (1:1) *</label>
            {isView ? (
              <img
                src={(form.icon && form.icon.trim() !== "") ? form.icon : "/category.png"}
                alt="icon"
                className="w-24 h-24 object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + "/category.png") {
                    target.src = "/category.png";
                  }
                }}
              />
            ) : (
              <div className="mt-1 flex flex-wrap items-start gap-3">
                {(form.icon && form.icon.trim() !== "") ? (
                  <div className="relative inline-block">
                    <img
                      src={form.icon}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + "/category.png") {
                          target.src = "/category.png";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow border-2 border-white"
                      aria-label="Remove icon"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
                <div className="flex flex-col gap-1">
                  <input
                    id="category-icon-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {!(form.icon && form.icon.trim() !== "") && (
                    <span className="text-xs text-gray-500">Select an image (1:1 recommended)</span>
                  )}
                </div>
              </div>
            )}
            {error.icon && <p className="text-red-500 text-sm">{error.icon}</p>}
          </div>
        </div>

        <ImageCropperModal
          open={cropModalOpen}
          file={selectedFileForCrop}
          onClose={() => setCropModalOpen(false)}
          onCropDone={handleCropDone}
          aspect={1}
          usageLabel="category icon"
        />
        <DialogFooter className="admin-modal-footer rounded-b-lg px-6 py-4 gap-2">
          <Button className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0" onClick={onClose}>
            {isView ? "Close" : "Cancel"}
          </Button>
          {!isView && (
            <Button className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0" onClick={handleSubmit} loading={isSubmitting}>
              {mode === "add" ? "Add" : "Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
