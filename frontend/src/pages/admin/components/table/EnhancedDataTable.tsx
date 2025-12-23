import React, { useState } from "react";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";

interface EnhancedDataTableProps<T> {
  columns: Array<{
    name: string;
    cell?: (row: T, index: number) => React.ReactNode;
    selector?: (row: T) => string | number;
    heading?: (row: T) => string;
    subInfo?: (row: T) => string;
    sortable?: boolean;
    minWidth?: string;
    width?: string;
  }>;
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  pagination?: boolean;
}

export default function EnhancedDataTable<T extends { id?: string; _id?: string }>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  pagination = true,
}: EnhancedDataTableProps<T>) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination
    ? data.slice(startIndex, startIndex + itemsPerPage)
    : data;

  const renderCell = (column: typeof columns[0], row: T, index: number) => {
    // Custom cell renderer
    if (column.cell) {
      return column.cell(row, index);
    }

    // Heading + SubInfo cell
    if (column.heading || column.subInfo) {
      const heading = column.heading ? column.heading(row) : "";
      const subInfo = column.subInfo ? column.subInfo(row) : "";
      
      return (
        <div className="flex flex-col">
          {heading && <div className="font-medium text-gray-900">{heading}</div>}
          {subInfo && <div className="text-sm text-gray-500 mt-0.5">{subInfo}</div>}
        </div>
      );
    }

    // Simple text cell
    if (column.selector) {
      return <span className="text-gray-700">{column.selector(row)}</span>;
    }

    return null;
  };

  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 whitespace-nowrap"
                  style={{ minWidth: col.minWidth, width: col.width }}
                >
                  {col.name}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 w-16 sm:w-20">
                  Actions
                </th>
              )}
            </tr>
          </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const actualIndex = startIndex + rowIndex;
              const isHovered = hoveredRow === actualIndex;
              const isActionHovered = hoveredAction === actualIndex;

              return (
                <tr
                  key={row.id || row._id || rowIndex}
                  className={`border-b border-gray-100 transition-colors ${
                    isHovered ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setHoveredRow(actualIndex)}
                  onMouseLeave={() => {
                    setHoveredRow(null);
                    setHoveredAction(null);
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
                      style={{ minWidth: col.minWidth, width: col.width }}
                    >
                      {renderCell(col, row, actualIndex)}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-2 sm:px-4 py-2 sm:py-3 relative">
                      <div className="flex items-center gap-1">
                        {/* 3-dot menu icon - always visible */}
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          onMouseEnter={() => setHoveredAction(actualIndex)}
                        >
                          <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>

                        {/* Action icons - show on row hover or action hover */}
                        {(isHovered || isActionHovered) && (
                          <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
                            {onView && (
                              <button
                                onClick={() => onView(row)}
                                className="p-1 sm:p-1.5 text-gray-600 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                                title="View"
                              >
                                <Eye size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="p-1 sm:p-1.5 text-gray-600 hover:text-green-600 transition-colors rounded hover:bg-green-50"
                                title="Edit"
                              >
                                <Edit size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="p-1 sm:p-1.5 text-gray-600 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-3 border-t border-gray-200 gap-2 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

