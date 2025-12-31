import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "order" | "product" | "query";

interface StatusBadgeProps {
  status: string;
  type: StatusType;
  className?: string;
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().trim();

  const getStatusConfig = () => {
    if (type === "order") {
      if (normalizedStatus === "cancel" || normalizedStatus === "cancelled" || normalizedStatus === "canceled") {
        return { bg: "bg-red-100", text: "text-red-800", label: "Cancel" };
      }
      if (normalizedStatus === "pending") {
        return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" };
      }
      if (normalizedStatus === "complete" || normalizedStatus === "completed") {
        return { bg: "bg-green-100", text: "text-green-800", label: "Completed" };
      }
      if (normalizedStatus === "returned") {
        return { bg: "bg-orange-100", text: "text-orange-800", label: "Returned" };
      }
    }

    if (type === "product") {
      if (normalizedStatus === "active") {
        return { bg: "bg-green-100", text: "text-green-800", label: "Active" };
      }
      if (normalizedStatus === "inactive") {
        return { bg: "bg-gray-100", text: "text-gray-800", label: "Inactive" };
      }
    }

    if (type === "query") {
      if (normalizedStatus === "read") {
        return { bg: "bg-blue-100", text: "text-blue-800", label: "Read" };
      }
      if (normalizedStatus === "pending") {
        return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" };
      }
      if (normalizedStatus === "replied") {
        return { bg: "bg-green-100", text: "text-green-800", label: "Replied" };
      }
    }

    // Default fallback
    return { bg: "bg-gray-100", text: "text-gray-800", label: status };
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}

