import React, { useEffect, useState } from "react";
import EnhancedDataTable from "../../../pages/admin/components/table/EnhancedDataTable";
import { DataTableSkeleton } from "@/components/ui/TableSkeleton";
import { getAllReviews, deleteReview, toggleReviewShowOnLanding, type Review } from "../../../api/review.api";
import { processReviewsForNotifications } from "@/utils/adminNotifications";
import { useToast } from "@/components/ui/toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Star } from "lucide-react";

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
      processReviewsForNotifications(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = (reviewId: string) => {
    setDeleteConfirm(reviewId);
  };

  const handleToggleShowOnLanding = async (reviewId: string) => {
    setTogglingId(reviewId);
    try {
      await toggleReviewShowOnLanding(reviewId);
      success("Updated. Review visibility on landing page changed.");
      loadReviews();
    } catch (err: any) {
      error(err?.response?.data?.message || err.message || "Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteReview(deleteConfirm);
      success("Review deleted successfully");
      setDeleteConfirm(null);
      loadReviews();
    } catch (err: any) {
      error(err.message || "Failed to delete review");
      setDeleteConfirm(null);
    }
  };

  const getColumns = () => {
    return [
      {
        name: "Product",
        heading: (row: Review) => row.productName || (typeof row.productId === 'object' ? row.productId?.name : "N/A"),
        subInfo: (row: Review) => new Date(row.createdAt).toLocaleDateString(),
        minWidth: "200px",
      },
      {
        name: "Customer",
        heading: (row: Review) => (typeof row.userId === 'object' ? row.userId?.name : "Unknown"),
        subInfo: (row: Review) => (typeof row.userId === 'object' ? row.userId?.email : ""),
        minWidth: "200px",
      },
      {
        name: "Rating",
        cell: (row: Review) => (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= row.rating ? "fill-[var(--theme-primary)] text-[var(--theme-primary)]" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({row.rating}/5)</span>
          </div>
        ),
        minWidth: "150px",
      },
      {
        name: "Comment",
        cell: (row: Review) => (
          <div className="max-w-xs">
            <p className="text-sm text-gray-900 line-clamp-2">{row.comment}</p>
          </div>
        ),
        minWidth: "300px",
      },
      {
        name: "Show on Landing",
        cell: (row: Review) => (
          <button
            onClick={() => handleToggleShowOnLanding(row._id)}
            disabled={togglingId === row._id}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              row.showOnLanding
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {togglingId === row._id ? "..." : row.showOnLanding ? "Yes" : "No"}
          </button>
        ),
        minWidth: "140px",
      },
    ];
  };

  return (
    <div className="w-full">
      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-6 theme-heading">Reviews</h2>
      </div>

      <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <DataTableSkeleton rows={8} />
          </div>
        ) : (
          <EnhancedDataTable<Review & { id?: string }>
            columns={getColumns()}
            data={reviews.map(r => ({ ...r, id: r._id }))}
            onDelete={(row) => handleDelete((row as any)._id || row.id || '')}
            pagination
          />
        )}
      </div>
    </div>
  );
}

