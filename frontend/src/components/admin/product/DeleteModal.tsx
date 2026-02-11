import React from "react";
import { X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  /** When provided, the item name is shown in bold in the confirmation message */
  itemName?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({
  open,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  itemName,
  loading = false,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  const bodyMessage = itemName != null && itemName !== ""
    ? <>Are you sure you want to delete <strong className="font-bold text-gray-900">{itemName}</strong>? {message || "This action cannot be undone."}</>
    : message;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="admin-dialog-content p-0 gap-0 overflow-hidden max-w-md rounded-xl shadow-2xl border-0 bg-transparent">
        <DialogHeader
          className="admin-modal-header flex items-center justify-between text-left px-6 rounded-t-xl min-h-[72px] shrink-0"
          style={{ height: "72px", boxSizing: "border-box", borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-white font-semibold text-lg">{title}</DialogTitle>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded text-white hover:bg-white/20 transition-colors shrink-0" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="px-6 py-6 bg-white">
          <p className="text-gray-700 leading-relaxed">
            {bodyMessage}
          </p>
        </div>

        <DialogFooter
          className="admin-modal-footer rounded-b-xl px-6 gap-3 min-h-[72px] items-center shrink-0"
          style={{ height: "72px", boxSizing: "border-box", borderBottomLeftRadius: "0.75rem", borderBottomRightRadius: "0.75rem" }}
        >
          <Button
            className="bg-white text-[var(--theme-primary)] hover:bg-gray-100 font-medium border-0 px-5 h-10 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-medium border-0 px-5 h-10 rounded-lg"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
