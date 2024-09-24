import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
  onSort: (key: string) => void;  // Pass sorting handler from parent component
  sortConfig: { key: string; direction: string } | null;  // Current sorting configuration
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data, onSort, sortConfig }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header.key} onClick={() => onSort(header.key)}>
            {header.label}
            {sortConfig?.key === header.key && (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          {headers.map((header) => (
            <td key={header.key}>{row[header.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default SortableTable;
