'use client';

import React from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'radio' | 'checkbox' | 'file' | 'date';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  helperText?: string;
  value?: any;
  disabled?: boolean;
  rows?: number;
}

export interface AdminFormProps {
  title?: string;
  fields: FormField[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function AdminForm({
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = '저장',
  cancelLabel = '취소',
  loading = false,
}: AdminFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      {title && (
        <div style={{ marginBottom: '16px', borderBottom: '2px solid #2563eb', paddingBottom: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h2>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
        <tbody>
          {fields.map((field) => {
            const val = formData[field.name] !== undefined ? formData[field.name] : field.value || '';

            return (
              <tr key={field.name} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td
                  style={{
                    width: '180px',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#334155',
                    borderRight: '1px solid #cbd5e1',
                  }}
                >
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </td>
                <td style={{ padding: '8px 14px', background: '#ffffff' }}>
                  {field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                    <input
                      type={field.type}
                      value={val}
                      disabled={field.disabled}
                      placeholder={field.placeholder}
                      onChange={(e) => onChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      required={field.required}
                      style={{
                        height: '32px',
                        padding: '2px 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '3px',
                        fontSize: '0.85rem',
                        width: '100%',
                        maxWidth: '360px',
                      }}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={val}
                      disabled={field.disabled}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      style={{
                        height: '32px',
                        padding: '2px 8px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '3px',
                        fontSize: '0.85rem',
                        width: '100%',
                        maxWidth: '360px',
                      }}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={val}
                      disabled={field.disabled}
                      rows={field.rows || 4}
                      placeholder={field.placeholder}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '3px',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                      }}
                    />
                  ) : field.type === 'file' ? (
                    <input
                      type="file"
                      disabled={field.disabled}
                      onChange={(e) => onChange(field.name, e.target.files ? e.target.files[0] : null)}
                      required={field.required}
                      style={{ fontSize: '0.85rem' }}
                    />
                  ) : field.type === 'radio' ? (
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      {field.options?.map((opt) => (
                        <label key={opt.value} style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="radio"
                            name={field.name}
                            value={opt.value}
                            checked={val === opt.value}
                            onChange={() => onChange(field.name, opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {field.helperText && (
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      {field.helperText}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Form Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 22px',
              backgroundColor: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 24px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 1px 2px rgba(37,99,235,0.2)',
          }}
        >
          {loading ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default AdminForm;
