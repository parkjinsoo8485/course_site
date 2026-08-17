'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';

interface PageProps {
  params: {
    school_id: string;
  };
}

interface SmsSenderRow {
  id: string;
  num: number;
  phone: string;
  owner: string;
  authMethod: string;
  category: string;
  status: '접수' | '심사중' | '승인완료' | '반려';
  approvedDate: string;
}

const INITIAL_SENDERS: SmsSenderRow[] = [
  {
    id: 'snd_1',
    num: 1,
    phone: '062-609-1182',
    owner: '광주풍향초등학교',
    authMethod: '통신서비스이용증명원',
    category: '대표번호 (학교 행정실)',
    status: '승인완료',
    approvedDate: '2025-05-10',
  },
  {
    id: 'snd_2',
    num: 2,
    phone: '062-609-1180',
    owner: '광주풍향초등학교',
    authMethod: '통신서비스이용증명원',
    category: '늘봄지원실 직통',
    status: '승인완료',
    approvedDate: '2025-06-01',
  },
];

export default function SmsTelListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';

  const [senders, setSenders] = useState<SmsSenderRow[]>(INITIAL_SENDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchWord, setSearchWord] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form State
  const [newPhone, setNewPhone] = useState('');
  const [newOwner, setNewOwner] = useState('광주풍향초등학교');
  const [newCategory, setNewCategory] = useState('일반');
  const [newAuthMethod, setNewAuthMethod] = useState('통신서비스이용증명원');

  const filteredSenders = senders.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (!searchWord.trim()) return true;
    return item.phone.includes(searchWord.trim());
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (senders.length >= 4) {
      alert('발신번호 등록은 최대 4개까지만 가능합니다.');
      return;
    }
    if (!newPhone.trim()) {
      alert('발신번호를 입력하세요.');
      return;
    }
    const newEntry: SmsSenderRow = {
      id: String(Date.now()),
      num: senders.length + 1,
      phone: newPhone.trim(),
      owner: newOwner,
      authMethod: newAuthMethod,
      category: newCategory,
      status: '승인완료',
      approvedDate: new Date().toISOString().split('T')[0],
    };
    setSenders([...senders, newEntry]);
    setIsRegisterModalOpen(false);
    setNewPhone('');
    alert('발신번호가 정상적으로 등록(승인)되었습니다.');
  };

  const handleCancel = (id: string, phone: string) => {
    if (confirm(`[${phone}] 발신번호를 취소(삭제)하시겠습니까?`)) {
      setSenders(senders.filter((s) => s.id !== id));
      alert('취소되었습니다.');
    }
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="문자관리 > 발신번호관리">
      {/* Panel Main */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        {/* Panel Heading */}
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          목록
        </div>

        {/* Panel Actions & Search Bar */}
        <div className="p-3 border-b border-[#eee] bg-[#fafafa] flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-3 py-1.5 bg-[#5cb85c] hover:bg-[#449d44] text-white rounded text-[12px] font-bold shadow-sm"
            >
              발신번호등록
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px]"
            >
              <option value="all">=처리상태=</option>
              <option value="접수">접수</option>
              <option value="심사중">심사중</option>
              <option value="승인완료">승인완료</option>
            </select>

            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="발신번호"
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px] w-[140px]"
            />

            <button
              onClick={() => {}}
              className="px-3 py-1 bg-[#337ab7] hover:bg-[#286090] text-white rounded text-[12px] font-semibold h-[30px]"
            >
              검색
            </button>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchWord('');
              }}
              className="px-3 py-1 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] rounded text-[12px] font-semibold h-[30px]"
            >
              전체
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse text-center" style={{ minWidth: '800px' }}>
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">연번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">수정</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[140px]">발신번호</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[150px]">발신번호명의</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[140px]">인증방식</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5]">발신번호 구분<br />(비고)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">처리상태</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[110px]">승인일자</th>
                <th className="py-2.5 px-3 w-[60px]">취소</th>
              </tr>
            </thead>
            <tbody>
              {filteredSenders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    검색된 발신번호가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredSenders.map((s) => (
                  <tr key={s.id} className="border-b border-[#e5e5e5] hover:bg-[#f9fbfd] transition-colors">
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{s.num}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <button
                        onClick={() => alert(`[${s.phone}] 이미 승인완료된 발신번호는 수정할 수 없습니다. (접수 상태에서만 수정 가능)`)}
                        className="text-[#337ab7] hover:text-[#23527c] text-[13px]"
                        title="수정"
                      >
                        ⚙️
                      </button>
                    </td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-[#337ab7]">{s.phone}</td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-semibold text-gray-800">{s.owner}</td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-gray-600">{s.authMethod}</td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-gray-700 text-left">{s.category}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#dff0d8] text-[#3c763d] border border-[#d6e9c6]">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-[11.5px] text-gray-600">{s.approvedDate}</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleCancel(s.id, s.phone)}
                        className="text-[#d9534f] hover:text-[#c9302c] text-[13px]"
                        title="취소"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Box */}
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3.5 rounded text-[13px] leading-relaxed">
        <ul className="list-disc pl-5 m-0 space-y-1">
          <li>
            <span className="text-[#a94442] font-bold">등록</span>은{' '}
            <span className="text-[#a94442] font-bold">최대 4개</span> 까지만 가능합니다.
          </li>
          <li>
            <span className="text-[#a94442] font-bold">수정</span>은 접수 상태에서만 가능합니다.
          </li>
          <li>
            <span className="text-[#a94442] font-bold">승인</span>된 발신번호만 사용할 수 있습니다.
          </li>
          <li>
            <span className="text-[#a94442] font-bold">반려</span>된 발신번호는{' '}
            <span className="text-[#a94442] font-bold">30일 이후 자동으로 삭제</span>됩니다.
          </li>
        </ul>
      </div>

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[#ccc]">
            <div className="bg-[#3c8dbc] text-white px-4 py-3 font-bold text-[14px] flex justify-between items-center">
              <span>발신번호 등록</span>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-white hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleRegister} className="p-4 space-y-3 text-[13px]">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">발신번호 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="예: 062-000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">발신번호 명의 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">인증 방식</label>
                <select
                  value={newAuthMethod}
                  onChange={(e) => setNewAuthMethod(e.target.value)}
                  className="w-full border border-[#ccc] rounded px-2.5 py-1.5"
                >
                  <option value="통신서비스이용증명원">통신서비스이용증명원</option>
                  <option value="재직증명서/위임장">재직증명서/위임장</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">구분 및 비고</label>
                <input
                  type="text"
                  placeholder="예: 늘봄지원실 직통"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold text-[12px]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5cb85c] text-white rounded font-semibold text-[12px]"
                >
                  등록 신청
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SczigiLayout>
  );
}
