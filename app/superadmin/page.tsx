'use client';

import React, { useState } from 'react';
import { useQnaStore, QnaItem, QnaStatus } from '@/store/useQnaStore';

export default function SuperAdminDashboardPage() {
  const {
    qnas,
    replyQna,
    deleteQna,
  } = useQnaStore();

  const [selectedSchool, setSelectedSchool] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQna, setSelectedQna] = useState<QnaItem | null>(null);

  // Reply form state in modal
  const [replyText, setReplyText] = useState<string>('');
  const [replyStatus, setReplyStatus] = useState<QnaItem['status']>('완료');

  // Filtered Q&A items for Super Admin table
  const filteredQnas = qnas.filter((q) => {
    const matchesSchool = selectedSchool === '전체' || q.schoolName === selectedSchool || q.schoolId === selectedSchool;
    const matchesStatus = selectedStatus === '전체' || q.status === selectedStatus;
    const matchesSearch = !searchTerm ||
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.schoolName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.content || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSchool && matchesStatus && matchesSearch;
  });

  const pendingCount = qnas.filter((q) => q.status === '접수' || q.status === '처리중').length;

  const handleOpenReplyModal = (item: QnaItem) => {
    setSelectedQna(item);
    setReplyText(item.answerContent || '');
    setReplyStatus(item.status || '완료');
  };

  const handleSaveReply = async () => {
    if (!selectedQna) return;
    if (!replyText.trim()) {
      alert('답변 내용을 작성해 주세요.');
      return;
    }

    replyQna(selectedQna.id, replyText.trim(), replyStatus);

    try {
      await fetch('/api/af/qanda/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedQna.id,
          answerContent: replyText.trim(),
          status: replyStatus,
        }),
      });
    } catch (err) {
      console.error('API reply sync error:', err);
    }

    setSelectedQna({
      ...selectedQna,
      answerContent: replyText.trim(),
      status: replyStatus,
      answerDate: `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}`,
    });

    alert('최고 관리자 답변이 성공적으로 저장되었습니다. 학교 페이지에 반영됩니다.');
  };

  const handleDeleteQna = async () => {
    if (!selectedQna) return;
    if (confirm(`'${selectedQna.title}' 문의글을 삭제하시겠습니까?`)) {
      deleteQna(selectedQna.id);
      try {
        await fetch(`/api/af/qanda/delete/${selectedQna.id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('API delete sync error:', err);
      }
      setSelectedQna(null);
      alert('문의글이 삭제되었습니다.');
    }
  };

  const schoolsSummary = [
    { id: '3267', name: '광주풍향초등학교', courses: 18, students: 450, pending: qnas.filter(q => (q.schoolId === '3267' || q.schoolName === '광주풍향초등학교') && (q.status === '접수' || q.status === '처리중')).length },
    { id: '1001', name: '서울초등학교', courses: 14, students: 320, pending: qnas.filter(q => (q.schoolId === '1001' || q.schoolName === '서울초등학교') && (q.status === '접수' || q.status === '처리중')).length },
    { id: '1002', name: '부산초등학교', courses: 12, students: 280, pending: 0 },
    { id: '1003', name: '대구초등학교', courses: 14, students: 370, pending: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-6 text-slate-800">
      <div className="bg-slate-900 text-white rounded-lg p-6 mb-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Super Admin</span>
            <span>최고 관리자 중앙 관제 센터</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🏛️ 디비디비스쿨 통합 플랫폼 다중 학교 모니터링 대시보드
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            전체 등록 학교의 운영 현황을 실시간 모니터링하고, 학교 관리자의 고객지원 문의사항에 답장을 작성 및 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/af/qanda/lists/sn/3267"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-600"
          >
            <span>🏫</span> 학교 관리자 페이지 테스트
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">모니터링 학교 수</div>
            <div className="text-2xl font-bold text-slate-900">4개 학교</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">🏫</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">총 개설 강좌 수</div>
            <div className="text-2xl font-bold text-slate-900">58개 강좌</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold">📚</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">총 수강 인원</div>
            <div className="text-2xl font-bold text-slate-900">1,420 명</div>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-xl font-bold">👨‍🎓</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">고객지원 답변 대기</div>
            <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
              {pendingCount} 건
              {pendingCount > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">답변 필요</span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl font-bold">💬</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span>📌</span> 학교별 운영 현황 모니터링
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schoolsSummary.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSchool(s.name)}
              className={`bg-white rounded-lg p-4 border transition-all cursor-pointer shadow-xs ${
                selectedSchool === s.name ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm text-slate-800">{s.name}</h3>
                {s.pending > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">신규문의 {s.pending}</span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">정상운영</span>
                )}
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <div>개설 강좌: <strong className="text-slate-700">{s.courses}개</strong></div>
                <div>수강 학생: <strong className="text-slate-700">{s.students}명</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>🎧</span> 최고 관리자 고객지원 문의 관리 & 답변 작성 센터
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              각 학교 관리자가 접수한 문의사항을 모니터링하고 답장을 작성/저장합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">학교 선택:</span>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="h-8 px-2.5 text-xs border border-slate-300 rounded bg-white font-medium"
            >
              <option value="전체">전체 학교 보기</option>
              <option value="광주풍향초등학교">광주풍향초등학교</option>
              <option value="서울초등학교">서울초등학교</option>
              <option value="부산초등학교">부산초등학교</option>
              <option value="대구초등학교">대구초등학교</option>
            </select>

            <span className="text-xs text-slate-600 font-semibold ml-2">진행상태:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 px-2.5 text-xs border border-slate-300 rounded bg-white font-medium"
            >
              <option value="전체">전체 상태</option>
              <option value="접수">접수 (미답변)</option>
              <option value="처리중">처리중</option>
              <option value="완료">완료 (답변완료)</option>
            </select>

            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 px-2.5 text-xs border border-slate-300 rounded w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
              <tr>
                <th className="p-3 w-14 text-center">연번</th>
                <th className="p-3 w-36">학교명</th>
                <th className="p-3">문의 제목</th>
                <th className="p-3 w-28">작성자</th>
                <th className="p-3 w-24 text-center">등록일자</th>
                <th className="p-3 w-24 text-center">진행상태</th>
                <th className="p-3 w-24 text-center">답변일자</th>
                <th className="p-3 w-28 text-center">답변 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredQnas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    조건에 해당하는 문의사항이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredQnas.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center text-slate-500 font-mono">{q.id}</td>
                    <td className="p-3 font-semibold text-slate-700">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {q.schoolName || '광주풍향초등학교'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800 hover:text-blue-600 cursor-pointer" onClick={() => handleOpenReplyModal(q)}>
                      {q.title}
                    </td>
                    <td className="p-3 text-slate-600">{q.author}</td>
                    <td className="p-3 text-center text-slate-500 font-mono">{q.createdAt}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          q.status === '완료'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : q.status === '처리중'
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-500 font-mono">{q.answerDate ? q.answerDate : '-'}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleOpenReplyModal(q)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          q.answerContent
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {q.answerContent ? '답변 수정' : '✍️ 답변 작성'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQna && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#337ab7] px-5 py-3 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>📄 [최고 관리자]</span> 고객지원 문의 답장 작성 및 상태 관리
              </h3>
              <button
                onClick={() => setSelectedQna(null)}
                className="text-white hover:text-slate-200 text-xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5 text-xs overflow-y-auto flex-1 space-y-4">
              <table className="w-full border-collapse border border-slate-200">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-24 bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">학교명</td>
                    <td className="p-2.5 font-bold text-blue-700">{selectedQna.schoolName || '광주풍향초등학교'}</td>
                    <td className="w-24 bg-[#f9f9f9] p-2.5 font-bold border-r border-l border-slate-200">등록일자</td>
                    <td className="p-2.5 font-mono">{selectedQna.createdAt}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">작성자</td>
                    <td className="p-2.5">{selectedQna.author}</td>
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-l border-slate-200">연락처</td>
                    <td className="p-2.5 font-mono">{selectedQna.phone || '010-2494-1479'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">이메일</td>
                    <td colSpan={3} className="p-2.5 font-mono">{selectedQna.email || 'khh147979@naver.com'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">제목</td>
                    <td colSpan={3} className="p-2.5 font-bold text-slate-800">{selectedQna.title}</td>
                  </tr>
                  {selectedQna.fileName && (
                    <tr className="border-b border-slate-200">
                      <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200">첨부파일</td>
                      <td colSpan={3} className="p-2.5">
                        <span className="text-blue-600 font-mono">📎 {selectedQna.fileName}</span>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="bg-[#f9f9f9] p-2.5 font-bold border-r border-slate-200 vertical-top">문의 내용</td>
                    <td colSpan={3} className="p-3 leading-relaxed whitespace-pre-wrap bg-slate-50 min-h-[60px]">
                      {selectedQna.content || selectedQna.title}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-[#fbfbfb] border border-[#e7e7e7] p-4 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#337ab7] text-xs flex items-center gap-1.5">
                    <span>↵</span> 고객지원 답변 & 진행상태 변경
                  </h4>
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700">진행상태:</label>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value as QnaItem['status'])}
                      className="h-7 px-2.5 text-xs border border-slate-300 rounded bg-white font-bold"
                    >
                      <option value="접수">접수</option>
                      <option value="처리중">처리중</option>
                      <option value="완료">완료</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="학교 관리자에게 안내할 답변 내용을 작성해 주세요..."
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y bg-white"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSaveReply}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
                  >
                    답변 저장하기
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleDeleteQna}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
              >
                삭제
              </button>
              <button
                type="button"
                onClick={() => setSelectedQna(null)}
                className="px-4 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
