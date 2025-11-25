// frontend/src/components/ui/DataTable.tsx
import React from "react";
import DataTableComponent, { TableColumn } from "react-data-table-component";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  selectable?: boolean;
  pagination?: boolean;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  actions,
  selectable = false,
  pagination = true,
  className,
}: DataTableProps<T>) {
  const enhancedColumns: TableColumn<T>[] = actions
    ? [
        ...columns,
        {
          name: "Actions",
          cell: (row: T) => actions(row),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "150px",
        },
      ]
    : columns;

  return (
    <DataTableComponent
      columns={enhancedColumns}
      data={data}
      selectableRows={selectable}
      pagination={pagination}
      className={className}
      highlightOnHover
      responsive
    />
  );
}
