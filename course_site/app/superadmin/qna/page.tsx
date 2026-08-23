'use client';

import React, { useState, useEffect } from 'react';
import { useQnaStore, QnaItem } from '@/store/useQnaStore';

export default function SuperAdminQnaPage() {
  const { qnas, replyQna, deleteQna } = useQnaStore();

  const [selectedSchool, setSelectedSchool] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQna, setSelectedQna] = useState<QnaItem | null>(null);

  const [replyText, setReplyText] = useState<string>('');
  const [replyStatus, setReplyStatus] = useState<QnaItem['status']>('완료');

  const filteredQnas = qnas.filter((q) => {
    const matchesSchool = selectedSchool === '전체' || q.schoolName === selectedSchool || q.schoolId === selectedSchool;
    const matchesStatus = selectedStatus === '전체' || q.status === selectedStatus;
    const matchesSearch =
      !searchTerm ||
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.schoolName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.content || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSchool && matchesStatus && matchesSearch;
  });

  const pendingCount = qnas.filter((q) => q.status === '접수').length;
  const processingCount = qnas.filter((q) => q.status === '처리중').length;
  const completedCount = qnas.filter((q) => q.status === '완료').length;

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

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-6 text-slate-800">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-lg p-6 mb-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Super Admin</span>
            <span>전체 학교 고객지원 문의 센터</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🎧 디비디비스쿨 고객지원 문의 게시판
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            각 테넌트 학교에서 접수된 모든 고객지원 문의사항을 모니터링하고 답변을 작성 및 전달합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a href="/superadmin" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium border border-slate-700">
            📊 관제 대시보드
          </a>
          <a href="/superadmin/schools" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium border border-slate-700">
            🏫 전체 학교 관리
          </a>
          <a href="/superadmin/qna" className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold">
            🎧 고객지원 문의
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">답변 대기</div>
            <div className="text-2xl font-bold text-red-600">{pendingCount}건</div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl">💬</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">처리 중</div>
            <div className="text-2xl font-bold text-amber-600">{processingCount}건</div>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 text-xl">⏳</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">답변 완료</div>
            <div className="text-2xl font-bold text-emerald-600">{completedCount}건</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-xl">✅</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">총 문의건수</div>
            <div className="text-2xl font-bold text-slate-900">{qnas.length}건</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl">📥</div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">🎧 통합 고객지원 문의 목록</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
            >
              <option value="전체">전체 학교 보기</option>
              <option value="광주풍향초등학교">광주풍향초등학교</option>
              <option value="서울초등학교">서울초등학교</option>
              <option value="부산초등학교">부산초등학교</option>
              <option value="대구초등학교">대구초등학교</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
            >
              <option value="전체">전체 상태</option>
              <option value="접수">접수 (미답변)</option>
              <option value="처리중">처리중</option>
              <option value="완료">완료 (답변완료)</option>
            </select>

            <input
              type="text"
              placeholder="제목, 작성자, 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 w-52"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3 text-center w-12">연번</th>
                <th className="p-3 w-36">학교명</th>
                <th className="p-3">문의 제목</th>
                <th className="p-3 w-24">작성자</th>
                <th className="p-3 text-center w-24">등록일자</th>
                <th className="p-3 text-center w-24">진행상태</th>
                <th className="p-3 text-center w-24">답변일자</th>
                <th className="p-3 text-center w-28">답변 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredQnas.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-mono text-slate-500">{q.id}</td>
                  <td className="p-3 font-bold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                      {q.schoolName || '광주풍향초등학교'}
                    </span>
                  </td>
                  <td
                    className="p-3 font-bold text-slate-900 cursor-pointer hover:text-blue-600"
                    onClick={() => handleOpenReplyModal(q)}
                  >
                    {q.title}
                  </td>
                  <td className="p-3 text-slate-600">{q.author}</td>
                  <td className="p-3 text-center font-mono text-slate-500">{q.createdAt}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      q.status === '완료' ? 'bg-emerald-100 text-emerald-800' : q.status === '처리중' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-500">{q.answerDate || '-'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleOpenReplyModal(q)}
                      className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                        q.answerContent ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {q.answerContent ? '답변 수정' : '✍️ 답변 작성'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedQna && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="bg-blue-600 text-white p-4 font-bold text-sm flex justify-between items-center">
              <div>🎧 [최고 관리자] 고객지원 문의 답변 작성 및 상태 관리</div>
              <button onClick={() => setSelectedQna(null)} className="text-white text-xl">&times;</button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold text-slate-500">학교명: <strong className="text-blue-600">{selectedQna.schoolName || '광주풍향초등학교'}</strong></span>
                  <span className="font-mono text-slate-500">등록일: {selectedQna.createdAt}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold text-slate-700">작성자: {selectedQna.author}</span>
                  <span className="font-mono text-slate-500">연락처: {selectedQna.phone || '010-2494-1479'}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm mb-1">{selectedQna.title}</div>
                  <div className="bg-white p-3 rounded border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedQna.content || selectedQna.title}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-blue-600 text-xs">✍️ 최고 관리자 답장 작성</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600">진행상태:</span>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value as any)}
                      className="border border-slate-300 rounded px-2 py-1 bg-white font-semibold"
                    >
                      <option value="접수">접수</option>
                      <option value="처리중">처리중</option>
                      <option value="완료">완료</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="학교 관리자에게 전달할 답장 내용을 작성해 주세요..."
                  className="w-full h-24 p-2.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveReply}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs"
                  >
                    답변 저장하기
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 p-3 border-t flex justify-between">
              <button onClick={handleDeleteQna} className="px-3 py-1 bg-red-600 text-white rounded font-bold text-xs">
                삭제
              </button>
              <button onClick={() => setSelectedQna(null)} className="px-3 py-1 bg-slate-600 text-white rounded font-bold text-xs">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
