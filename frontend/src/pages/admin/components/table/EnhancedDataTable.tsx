import React, { useState } from "react";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";

interface Column<T> {
  name: string;
  cell?: (row: T, index?: number) => React.ReactNode;
  heading?: (row: T) => string;
  subInfo?: (row: T) => string;
  selector?: (row: T) => string;
  minWidth?: string;
  maxWidth?: string;
}

interface EnhancedDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  pagination?: boolean;
}

export default function EnhancedDataTable<T extends { id?: string | number }>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  pagination = false,
}: EnhancedDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<T | null>(null);
  const itemsPerPage = 10;

  const totalPages = pagination ? Math.ceil(data.length / itemsPerPage) : 1;
  const startIndex = pagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = pagination ? startIndex + itemsPerPage : data.length;
  const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full border-collapse" style={{ tableLayout: "auto" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--theme-light)" }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-white px-4 py-3 text-left text-sm font-semibold"
                style={{
                  backgroundColor: "var(--theme-light)",
                  minWidth: col.minWidth || "100px",
                  maxWidth: col.maxWidth || "none",
                }}
              >
                {col.name}
              </th>
            ))}
            {hasActions && (
              <th
                className="text-white px-4 py-3 text-left text-sm font-semibold"
                style={{
                  backgroundColor: "var(--theme-light)",
                  width: "80px",
                  minWidth: "80px",
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(row)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-gray-700"
                    style={{
                      minWidth: col.minWidth || "100px",
                      maxWidth: col.maxWidth || "none",
                      overflow: col.cell ? "visible" : "hidden",
                      textOverflow: col.cell ? "clip" : "ellipsis",
                      whiteSpace: col.cell ? "normal" : "nowrap",
                    }}
                    title={col.selector ? String(col.selector(row)) : col.heading ? col.heading(row) : ""}
                  >
                    {col.cell ? (
                      <div>{col.cell(row, rowIndex)}</div>
                    ) : col.heading ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-gray-900">{col.heading(row)}</span>
                        {col.subInfo && (
                          <span className="text-xs text-gray-500">
                            {col.subInfo(row)}
                          </span>
                        )}
                      </div>
                    ) : col.selector ? (
                      <span className="truncate block">{col.selector(row)}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
                {hasActions && (
                  <td
                    className="px-2 py-3 align-middle"
                    style={{
                      width: hoveredRow === row ? "auto" : "80px",
                      minWidth: "80px",
                      overflow: "visible",
                      position: "relative",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <MoreVertical className="w-5 h-5 text-gray-400 shrink-0" />
                      {hoveredRow === row && (
                        <div className="flex items-center gap-1 shrink-0">
                          {onView && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(row);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
            {data.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
