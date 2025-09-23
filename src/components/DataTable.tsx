/**
 * Reusable table component for admin panels
 * Props: headers, data, actions, onAdd
 */
import { useState } from 'react';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

interface TableAction {
  label: string;
  onClick: (row: any) => void;
  className?: string;
}

interface DataTableProps {
  headers: TableColumn[];
  data: any[];
  actions?: TableAction[];
  onAdd?: () => void;
  addLabel?: string;
}

export default function DataTable({ headers, data, actions, onAdd, addLabel = "Agregar" }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-2xl bg-[--brand-primary]/30 p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--brand-tertiary]/30">
              {headers.map((header) => (
                <th key={header.key} className={`px-4 py-3 text-left text-sm font-medium text-[--foreground] ${header.width || ''}`}>
                  {header.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-sm font-medium text-[--foreground] w-32">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index} className="border-b border-[--brand-tertiary]/20 hover:bg-[--brand-primary]/20">
                {headers.map((header) => (
                  <td key={header.key} className="px-4 py-3 text-sm text-[--foreground]/80">
                    {row[header.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={`px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer ${
                            action.className || 'bg-[--brand-quaternary] text-[--brand-secondary] border-[--brand-quaternary] hover:bg-[--brand-secondary] hover:text-[--brand-quaternary] hover:border-[--brand-secondary]'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {onAdd && (
              <tr className="border-b-0">
                <td colSpan={headers.length + (actions ? 1 : 0)} className="px-4 py-3">
                  <button
                    onClick={onAdd}
                    className="w-full px-4 py-2 text-sm font-medium bg-[--brand-secondary] text-[--brand-quaternary] border border-[--brand-quaternary]/20 rounded-md hover:bg-[--brand-quaternary] hover:text-[--brand-secondary] transition-colors"
                  >
                    {addLabel}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {data.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-[--foreground]/70">
            Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length} resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-[--brand-tertiary]/30 rounded hover:bg-[--brand-primary]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === page
                    ? 'bg-[--brand-quaternary] text-[--brand-secondary] border-[--brand-quaternary]'
                    : 'border-[--brand-tertiary]/30 hover:bg-[--brand-primary]/20'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-[--brand-tertiary]/30 rounded hover:bg-[--brand-primary]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
