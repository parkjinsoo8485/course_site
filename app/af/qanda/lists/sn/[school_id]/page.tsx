'use client';

import React, { useState } from 'react';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminFilterBar } from '@/components/admin/AdminFilterBar';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { useQnaStore, QnaItem, QnaStatus } from '@/store/useQnaStore';

export default function QnaListPage() {
  const {
    selectedStatus,
    searchTerm,
    setSelectedStatus,
    setSearchTerm,
    resetFilter,
    getFilteredQnas,
    addQna,
  } = useQnaStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedQna, setSelectedQna] = useState<QnaItem | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');

  const filteredQnas = getFilteredQnas();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredQnas.length / pageSize));
  const paginatedQnas = filteredQnas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedStatus(cat as QnaStatus);
    setCurrentPage(1);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilter();
    setCurrentPage(1);
  };

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) {
      alert('제목과 작성자를 입력해 주세요.');
      return;
    }
    addQna({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      content: newContent.trim(),
    });
    setNewTitle('');
    setNewAuthor('');
    setNewContent('');
    setIsWriteModalOpen(false);
    alert('문의사항이 성공적으로 등록되었습니다.');
  };

  // AdminTable columns definition matching exact dbdbschool layout
  const columns: Column<QnaItem>[] = [
    {
      key: 'id',
      label: '연번',
      width: '60px',
      align: 'center',
      render: (item) => <span className="text-slate-600">{item.id}</span>,
    },
    {
      key: 'title',
      label: '제목',
      align: 'left',
      render: (item) => (
        <span className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer">
          {item.title}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '등록일자',
      width: '110px',
      align: 'center',
      render: (item) => <span className="text-slate-600 text-xs font-mono">{item.createdAt}</span>,
    },
    {
      key: 'status',
      label: '진행',
      width: '90px',
      align: 'center',
      render: (item) => (
        <span
          className={`font-bold ${
            item.status === '완료'
              ? 'text-[#e67e22]' // 원본 스크린샷과 동일한 주황색 텍스트 (#e67e22)
              : 'text-slate-500'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'answerDate',
      label: '답변',
      width: '90px',
      align: 'center',
      render: (item) => (
        <span className="text-slate-600 text-xs font-mono">
          {item.answerDate ? item.answerDate : '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 bg-slate-100 min-h-screen font-sans">
      {/* 1. 상단 타이틀 & 서브 타이틀 (스크린샷 동일) */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          고객지원 게시판
        </h1>
        <div className="text-xs text-slate-500 mt-0.5">광주풍향초등학교 늘봄학교</div>
      </div>

      {/* 2. 메인 카드 컨테이너 */}
      <div className="bg-white border border-[#d2d6de] rounded p-5 shadow-xs">
        <div className="text-xs font-bold text-slate-700 mb-3">목록</div>

        {/* 안내 알림 박스 (스크린샷 원본 동일 텍스트 및 컬러 적용) */}
        <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] rounded p-3 text-xs leading-relaxed flex items-center gap-2 mb-3.5">
          <span className="text-[#c9302c] font-bold text-sm select-none">!</span>
          <div>
            <strong className="text-[#c9302c]">문의사항을 고객지원 게시판에 올려주시면 </strong>
            <strong className="text-[#31708f]">담당자가 빠르게 확인하고 신속하게 답변</strong>
            <strong className="text-[#c9302c]">드리겠습니다.</strong>
          </div>
        </div>

        {/* 3. AdminFilterBar [전체, 대기, 완료] 필터링 */}
        <AdminFilterBar
          categories={['전체', '대기', '완료']}
          selectedCategory={selectedStatus}
          onCategoryChange={handleCategoryChange}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearchSubmit={() => setCurrentPage(1)}
          onReset={handleReset}
          totalCount={filteredQnas.length}
        />

        {/* 4. 안내 문구 및 등록 버튼 */}
        <div className="flex items-center justify-end gap-3 mb-3 text-xs">
          <span className="text-slate-600">
            ※ <a href="/af/ad_faq/main/sn/3267" className="text-[#c9302c] underline font-bold">매뉴얼</a>을 먼저 확인 후 고객지원 게시판을 이용하시기 바랍니다.
          </span>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-[#337ab7] hover:bg-[#286090] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors shadow-xs"
          >
            등록
          </button>
        </div>

        {/* 5. AdminTable 테이블 [연번, 제목, 등록일자, 진행, 답변] */}
        <AdminTable
          columns={columns}
          data={paginatedQnas}
          onRowClick={(item) => setSelectedQna(item)}
          emptyMessage="등록된 문의사항이 없습니다."
        />

        {/* 6. 페이지네이션 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* 7. 푸터 카피라이트 (스크린샷 동일) */}
      <div className="text-center mt-8 text-xs text-slate-500">
        Copyright ⓒ <strong className="text-slate-700">xmecca.com</strong> All Rights Reserved. |{' '}
        <a href="mailto:dbdbschool@naver.com" className="hover:underline">
          dbdbschool@naver.com
        </a>
      </div>

      {/* 문의 상세 보기 모달 */}
      {selectedQna && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#337ab7] px-4 py-2.5 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold flex items-center gap-2">
                <span>[문의 상세]</span> {selectedQna.title}
              </h3>
              <button
                onClick={() => setSelectedQna(null)}
                className="text-white hover:text-slate-200 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4 text-xs space-y-3">
              <div className="flex justify-between border-b pb-2 text-slate-500">
                <span>작성자: <strong>{selectedQna.author}</strong></span>
                <span>등록일: {selectedQna.createdAt}</span>
                <span>
                  진행상태:{' '}
                  <strong className={selectedQna.status === '완료' ? 'text-[#e67e22]' : 'text-slate-600'}>
                    {selectedQna.status}
                  </strong>
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-700 mb-1">Q. 문의 내용</h4>
                <p className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedQna.content || selectedQna.title}
                </p>
              </div>
              {selectedQna.status === '완료' ? (
                <div>
                  <h4 className="font-bold text-[#e67e22] mb-1">A. 관리자 답변 ({selectedQna.answerDate})</h4>
                  <p className="bg-orange-50/60 p-2.5 rounded border border-orange-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedQna.answerContent || '안녕하세요. 요청하신 문의사항 처리가 완료되었습니다.'}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-100 p-2.5 rounded border border-slate-200 text-slate-500 italic text-center">
                  ⏳ 담당자가 문의 내용을 확인 중입니다. 답변이 등록되면 안내해 드립니다.
                </div>
              )}
            </div>
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedQna(null)}
                className="px-3.5 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 문의 등록 모달 */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full overflow-hidden">
            <form onSubmit={handleWriteSubmit}>
              <div className="bg-[#337ab7] px-4 py-2.5 text-white flex items-center justify-between">
                <h3 className="text-xs font-bold">고객지원 문의 등록</h3>
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>
              <div className="p-4 text-xs space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">작성자명</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="작성자 이름 (예: 관리자)"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">문의 제목</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="문의사항 제목을 입력하세요"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">문의 내용</label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="상세 문의 내용을 작성해 주세요"
                    className="w-full p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#337ab7] hover:bg-[#286090] text-white rounded text-xs font-semibold shadow-xs"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
