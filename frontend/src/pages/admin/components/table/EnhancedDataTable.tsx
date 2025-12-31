import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Column<T> {
  name: string;
  cell?: (row: T, index?: number) => React.ReactNode;
  heading?: (row: T) => string;
  subInfo?: (row: T) => string;
  selector?: (row: T) => string;
  minWidth?: string;
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
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr style={{ backgroundColor: "var(--theme-light)" }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-white px-4 py-3 text-left text-sm font-semibold"
                style={{
                  backgroundColor: "var(--theme-light)",
                  minWidth: col.minWidth || "100px",
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
                  width: "120px",
                  minWidth: "120px",
                  maxWidth: "200px",
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
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.cell ? (
                      col.cell(row, rowIndex)
                    ) : col.heading ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{col.heading(row)}</span>
                        {col.subInfo && (
                          <span className="text-xs text-gray-500 mt-1">
                            {col.subInfo(row)}
                          </span>
                        )}
                      </div>
                    ) : col.selector ? (
                      col.selector(row)
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
                {hasActions && (
                  <td
                    className="px-4 py-3"
                    style={{
                      minWidth: "120px",
                      width: "120px",
                      maxWidth: "200px",
                      overflow: "visible",
                    }}
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      {hoveredRow === row && (
                        <>
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
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
