'use client';

import React from 'react';

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
}

export interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectItem?: (id: string, checked: boolean) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyText?: string;
}

export function AdminTable<T extends { id?: string | number; [key: string]: any }>({
  columns,
  data,
  keyField = 'id',
  selectedIds = [],
  onSelectAll,
  onSelectItem,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  onPageChange,
  loading = false,
  emptyText = '조회된 데이터가 없습니다.',
}: AdminTableProps<T>) {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="w-full">
      <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#ffffff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
              {onSelectAll && (
                <th style={{ width: '36px', textAlign: 'center', padding: '10px 6px', borderRight: '1px solid #e2e8f0' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '10px 8px',
                    textAlign: col.align || 'center',
                    width: col.width,
                    fontWeight: 700,
                    color: '#334155',
                    borderRight: '1px solid #e2e8f0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}
                >
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                const itemId = String(item[keyField] || idx);
                const isSelected = selectedIds.includes(itemId);

                return (
                  <tr
                    key={itemId}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    {onSelectItem && (
                      <td style={{ textAlign: 'center', padding: '8px 6px', borderRight: '1px solid #f1f5f9' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectItem(itemId, e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: '8px 10px',
                          textAlign: col.align || 'left',
                          color: '#1e293b',
                          borderRight: '1px solid #f1f5f9',
                          verticalAlign: 'middle',
                        }}
                      >
                        {col.render ? col.render(item, idx) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          padding: '0 4px',
        }}
      >
        <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
          {totalCount !== undefined ? `총 ${totalCount.toLocaleString()}건` : ''}
        </div>

        {totalPages > 1 && onPageChange && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              style={{
                padding: '4px 8px',
                border: '1px solid #cbd5e1',
                borderRadius: '3px',
                background: currentPage <= 1 ? '#f1f5f9' : '#ffffff',
                color: currentPage <= 1 ? '#94a3b8' : '#334155',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
              }}
            >
              ◀ 이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                style={{
                  padding: '4px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '3px',
                  background: currentPage === pageNum ? '#2563eb' : '#ffffff',
                  color: currentPage === pageNum ? '#ffffff' : '#334155',
                  fontWeight: currentPage === pageNum ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                {pageNum}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              style={{
                padding: '4px 8px',
                border: '1px solid #cbd5e1',
                borderRadius: '3px',
                background: currentPage >= totalPages ? '#f1f5f9' : '#ffffff',
                color: currentPage >= totalPages ? '#94a3b8' : '#334155',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
              }}
            >
              다음 ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTable;
