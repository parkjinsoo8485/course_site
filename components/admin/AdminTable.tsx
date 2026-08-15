import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  emptyMessage = '조회된 데이터가 없습니다.',
  className = '',
}: AdminTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto border border-slate-300 rounded shadow-sm bg-white ${className}`}>
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={String(col.key) + idx}
                style={{ width: col.width }}
                className={`px-3 py-2.5 border-r last:border-r-0 border-slate-300 font-semibold tracking-tight ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors border-b border-slate-200 ${
                  onRowClick ? 'hover:bg-blue-50/60 cursor-pointer' : 'hover:bg-slate-50'
                }`}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={String(col.key) + cIdx}
                    className={`px-3 py-2.5 border-r last:border-r-0 border-slate-200 text-slate-700 ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.render
                      ? col.render(item, index)
                      : String((item as Record<string, any>)[col.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
