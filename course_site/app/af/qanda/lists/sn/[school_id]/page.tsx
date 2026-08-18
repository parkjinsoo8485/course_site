'use client';

import React, { useState } from 'react';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { useQnaStore, QnaItem, QnaStatus, QnaSearchType } from '@/store/useQnaStore';

export default function QnaListPage() {
  const {
    selectedStatus,
    searchType,
    searchTerm,
    setSelectedStatus,
    setSearchType,
    setSearchTerm,
    resetFilter,
    getFilteredQnas,
    addQna,
    replyQna,
    deleteQna,
  } = useQnaStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedQna, setSelectedQna] = useState<QnaItem | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Write form state matching original dbdbschool defaults
  const [author, setAuthor] = useState<string>('김혜련');
  const [hp1, setHp1] = useState<string>('010');
  const [hp2, setHp2] = useState<string>('2494');
  const [hp3, setHp3] = useState<string>('1479');
  const [tel, setTel] = useState<string>('062-609-1182');
  const [email, setEmail] = useState<string>('khh147979@naver.com');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [updateManagerInfo, setUpdateManagerInfo] = useState<boolean>(false);

  // Detail reply edit state
  const [replyText, setReplyText] = useState<string>('');
  const [replyStatus, setReplyStatus] = useState<QnaItem['status']>('완료');

  const filteredQnas = getFilteredQnas();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredQnas.length / pageSize));
  const paginatedQnas = filteredQnas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      alert('제목과 성명을 입력해 주세요.');
      return;
    }
    const fullPhone = `${hp1}-${hp2}-${hp3}`;
    addQna({
      title: title.trim(),
      author: author.trim(),
      hp1,
      hp2,
      hp3,
      phone: fullPhone,
      tel,
      email,
      content: content.trim(),
      fileName: fileName || undefined,
      updateManagerInfo,
    });

    // Reset fields
    setTitle('');
    setContent('');
    setFileName('');
    setIsWriteModalOpen(false);
    alert('문의사항이 성공적으로 등록되었습니다.');
  };

  const handleDeleteQna = () => {
    if (!selectedQna) return;
    if (confirm('해당 문의글을 삭제하시겠습니까?')) {
      deleteQna(selectedQna.id);
      setSelectedQna(null);
      alert('문의글이 삭제되었습니다.');
    }
  };

  const openDetailModal = (item: QnaItem) => {
    setSelectedQna(item);
  };

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
        <span
          onClick={() => openDetailModal(item)}
          className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer"
        >
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
      label: '진행상태',
      width: '90px',
      align: 'center',
      render: (item) => (
        <span
          className={`font-bold ${
            item.status === '완료'
              ? 'text-[#e67e22] text-orange-500 font-bold'
              : item.status === '처리중'
              ? 'text-amber-600 font-bold'
              : 'text-slate-600'
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#f1f5f9] min-h-screen font-sans text-slate-800">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            고객지원 게시판 (학교 관리자 화면)
          </h1>
          <div className="text-xs text-slate-500 mt-0.5">광주풍향초등학교 늘봄학교</div>
        </div>
        <div>
          <a
            href="/superadmin"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>🏛️</span> 최고 관리자 모니터링 센터 (/superadmin)
          </a>
        </div>
      </div>

      <div className="bg-white border border-[#d2d6de] rounded p-5 shadow-xs">
        <div className="text-xs font-bold text-slate-700 mb-3">목록</div>

        <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] rounded p-3 text-xs leading-relaxed flex items-center gap-2 mb-3.5">
          <span className="text-amber-600 font-bold text-sm select-none">ℹ️</span>
          <div>
            <strong className="text-[#c9302c]">문의사항을 고객지원 게시판에 올려주시면 </strong>
            <strong className="text-[#31708f]">전체 최고 관리자가 확인 후 답변</strong>
            <strong className="text-[#c9302c]">해 드립니다.</strong>
          </div>
        </div>

        <div className="flex justify-end items-center gap-1.5 bg-[#fbfbfb] border border-[#e7e7e7] p-2 rounded mb-3">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as QnaStatus);
              setCurrentPage(1);
            }}
            className="h-7 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
          >
            <option value="전체">== 진행상태 ==</option>
            <option value="접수">접수</option>
            <option value="처리중">처리중</option>
            <option value="완료">완료</option>
          </select>

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as QnaSearchType)}
            className="h-7 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
          >
            <option value="sub_con">제목 + 내용</option>
            <option value="subject">제목</option>
            <option value="contents">내용</option>
            <option value="author">작성자</option>
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="h-7 px-2 text-xs border border-slate-300 rounded w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={() => setCurrentPage(1)}
            className="h-7 px-3 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded"
          >
            검색
          </button>
        </div>

        <div className="flex justify-between items-center mb-3 text-xs">
          <div className="text-slate-600 font-bold">
            검색결과: <span className="text-blue-600">{filteredQnas.length}</span>건
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">
              ※ <a href="/af/ad_faq/main/sn/3267" className="text-[#c9302c] underline font-bold">매뉴얼</a>을 먼저 확인 후 이용 바랍니다.
            </span>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-3.5 py-1 bg-[#337ab7] hover:bg-[#286090] text-white font-bold rounded shadow-xs"
            >
              등록
            </button>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={paginatedQnas}
          onRowClick={(item) => openDetailModal(item)}
          emptyMessage="등록된 문의사항이 없습니다."
        />

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </div>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#337ab7] px-4 py-2.5 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold flex items-center gap-2">
                <span>☑</span> 고객지원 문의글 등록
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-white hover:text-slate-200 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleWriteSubmit} className="p-5 text-xs overflow-y-auto flex-1 space-y-4">
              <table className="w-full border-collapse border border-slate-200">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-32 bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">성명 ☑</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="h-7 px-2.5 border border-slate-300 rounded w-48 focus:outline-none"
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">휴대폰 ☑</td>
                    <td className="p-2.5 space-y-1">
                      <div className="flex items-center gap-1">
                        <select
                          value={hp1}
                          onChange={(e) => setHp1(e.target.value)}
                          className="h-7 px-2 border border-slate-300 rounded bg-white"
                        >
                          <option value="010">010</option>
                          <option value="011">011</option>
                          <option value="016">016</option>
                          <option value="019">019</option>
                        </select>
                        <span>-</span>
                        <input
                          type="text"
                          value={hp2}
                          onChange={(e) => setHp2(e.target.value)}
                          maxLength={4}
                          className="h-7 px-2 border border-slate-300 rounded w-16 text-center focus:outline-none font-mono"
                        />
                        <span>-</span>
                        <input
                          type="text"
                          value={hp3}
                          onChange={(e) => setHp3(e.target.value)}
                          maxLength={4}
                          className="h-7 px-2 border border-slate-300 rounded w-16 text-center focus:outline-none font-mono"
                        />
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        (※ 상담 전화 및 처리 결과를 문자로 발송해 드립니다.)
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">전화</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        className="h-7 px-2.5 border border-slate-300 rounded w-48 focus:outline-none font-mono"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">이메일</td>
                    <td className="p-2.5">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-7 px-2.5 border border-slate-300 rounded w-64 focus:outline-none font-mono"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">제목 ☑</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요."
                        className="h-7 px-2.5 border border-slate-300 rounded w-full focus:outline-none"
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200 vertical-top">내용 ☑</td>
                    <td className="p-2.5">
                      <textarea
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="문의하실 내용을 상세히 기재해 주세요."
                        className="w-full p-2 border border-slate-300 rounded focus:outline-none resize-y"
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">첨부파일</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded cursor-pointer text-slate-700">
                          파일추가
                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) setFileName(e.target.files[0].name);
                            }}
                            className="hidden"
                          />
                        </label>
                        <span className="text-slate-600 font-mono">{fileName || '선택된 파일 없음'}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        (※ 한 번에 최대 3M 이하만 올릴 수 있습니다.)
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">
                      서비스 담당자 정보 수정
                    </td>
                    <td className="p-2.5">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={updateManagerInfo}
                          onChange={(e) => setUpdateManagerInfo(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>
                          위에 입력된 작성자 정보를 '<strong className="text-red-600">환경설정 &gt; 담당자정보</strong>'에 업데이트합니다.
                        </span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white rounded text-xs font-semibold"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedQna && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded border border-slate-300 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#337ab7] px-4 py-2.5 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold flex items-center gap-2">
                <span>📄</span> 보기 - 고객지원 게시판
              </h3>
              <button
                onClick={() => setSelectedQna(null)}
                className="text-white hover:text-slate-200 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-5 text-xs overflow-y-auto flex-1 space-y-4">
              <table className="w-full border-collapse border border-slate-200">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-24 bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">성명</td>
                    <td className="p-2.5">{selectedQna.author}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">제목</td>
                    <td className="p-2.5 font-bold">{selectedQna.title}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">내용</td>
                    <td className="p-3 leading-relaxed whitespace-pre-wrap min-h-[80px]">{selectedQna.content}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">진행상태</td>
                    <td className="p-2.5">
                      <span
                        className={`font-bold ${
                          selectedQna.status === '완료'
                            ? 'text-[#e67e22] text-orange-500'
                            : selectedQna.status === '처리중'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {selectedQna.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedQna.answerContent ? (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded space-y-2">
                  <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                    <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                      <span>✔</span> 최고 관리자 답변 ({selectedQna.answerDate || '06/01'})
                    </h4>
                    <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                      진행상태: {selectedQna.status}
                    </span>
                  </div>
                  <div className="text-slate-800 leading-relaxed whitespace-pre-wrap pt-1 text-xs">
                    {selectedQna.answerContent}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center text-slate-500 italic">
                  <span>⏳ 최고 관리자 답변 대기 중입니다. (진행상태: {selectedQna.status})</span>
                </div>
              )}
            </div>

            <div className="bg-[#f9f9f9] px-4 py-2.5 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleDeleteQna}
                className="px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
              >
                삭제
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQna(null)}
                  className="px-4 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
                >
                  목록
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1 bg-[#e67e22] hover:bg-[#d35400] text-white rounded text-xs font-semibold"
                >
                  화면인쇄
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
