'use client';

import React from 'react';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectField {
  id: string;
  options: FilterSelectOption[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
}

export interface AdminFilterBarProps {
  selects?: FilterSelectField[];
  searchTypeOptions?: FilterSelectOption[];
  searchTypeValue?: string;
  onSearchTypeChange?: (value: string) => void;
  keywordValue?: string;
  onKeywordChange?: (value: string) => void;
  onSearch?: () => void;
  onReset?: () => void;
  searchPlaceholder?: string;
  extraActions?: React.ReactNode;
}

export function AdminFilterBar({
  selects = [],
  searchTypeOptions,
  searchTypeValue,
  onSearchTypeChange,
  keywordValue = '',
  onKeywordChange,
  onSearch,
  onReset,
  searchPlaceholder = '검색어 입력',
  extraActions,
}: AdminFilterBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '6px',
        background: '#f8fafc',
        padding: '10px 14px',
        borderRadius: '4px',
        border: '1px solid #e2e8f0',
        marginBottom: '12px',
      }}
    >
      {/* Select Filter Group */}
      {selects.map((sel) => (
        <select
          key={sel.id}
          value={sel.value}
          onChange={(e) => sel.onChange(e.target.value)}
          style={{
            height: '32px',
            fontSize: '0.83rem',
            padding: '2px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '3px',
            background: '#ffffff',
            color: '#1e293b',
            width: sel.width,
          }}
        >
          {sel.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {/* Search Type Filter */}
      {searchTypeOptions && onSearchTypeChange && (
        <select
          value={searchTypeValue}
          onChange={(e) => onSearchTypeChange(e.target.value)}
          style={{
            height: '32px',
            fontSize: '0.83rem',
            padding: '2px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '3px',
            background: '#ffffff',
            color: '#1e293b',
          }}
        >
          {searchTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Keyword Input */}
      {onKeywordChange && (
        <input
          type="text"
          value={keywordValue}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
          style={{
            height: '32px',
            fontSize: '0.83rem',
            padding: '2px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: '3px',
            background: '#ffffff',
            color: '#1e293b',
            minWidth: '160px',
          }}
        />
      )}

      {/* Search & Reset Buttons */}
      {onSearch && (
        <button
          onClick={onSearch}
          style={{
            height: '32px',
            padding: '0 14px',
            backgroundColor: '#475569',
            color: '#ffffff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.83rem',
            fontWeight: 600,
          }}
        >
          검색
        </button>
      )}

      {onReset && (
        <button
          onClick={onReset}
          style={{
            height: '32px',
            padding: '0 12px',
            backgroundColor: '#ffffff',
            color: '#475569',
            border: '1px solid #cbd5e1',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.83rem',
            fontWeight: 500,
          }}
        >
          전체
        </button>
      )}

      {/* Extra Action Buttons (e.g., 엑셀 다운로드) */}
      {extraActions && (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {extraActions}
        </div>
      )}
    </div>
  );
}

export default AdminFilterBar;
