import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[]; // Table headers
  data: any[]; // Data for the table rows
  onSort: (key: any) => void; // Pass sorting handler from parent component
  sortConfig: { key: any; direction: string } | null; // Current sorting configuration
  onRowClick?: (row: any) => void; // Optional row click handler for details view
}

const SortableTable: React.FC<SortableTableProps> = ({
  headers,
  data,
  onSort,
  sortConfig,
  onRowClick, // Optional prop for row click
}) => (
  <table className="table-auto w-full">
    <thead>
      <tr>
        {headers.map((header) => (
          <th
            key={header.key}
            onClick={() => onSort(header.key)}
            className="cursor-pointer"
          >
            {header.label}
            {sortConfig?.key === header.key &&
              (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr
          key={i}
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onRowClick?.(row)} // Call the handler if provided
        >
          {headers.map((header) => (
            <td key={header.key}>{row[header.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default SortableTable;