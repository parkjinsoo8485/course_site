import React from 'react';

interface AdminFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
  onReset?: () => void;
  totalCount?: number;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
  onReset,
  totalCount,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(e);
  };

  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-3 mb-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* 분류 셀렉트 박스 */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              분류 선택:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-8 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 검색어 입력창 */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              검색어:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="제목, 질문, 작성자 검색..."
              className="h-8 px-3 py-1 text-xs bg-white border border-slate-300 rounded w-60 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* 검색 버튼 */}
          <button
            type="submit"
            className="h-8 px-4 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            검색
          </button>

          {/* 초기화 버튼 */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="h-8 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {/* 총 건수 표시 */}
        {typeof totalCount === 'number' && (
          <div className="text-xs font-medium text-slate-600">
            총 <span className="text-blue-600 font-bold">{totalCount}</span>건의 검색 결과
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminFilterBar;
