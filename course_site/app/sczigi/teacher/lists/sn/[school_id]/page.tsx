'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
  };
}

interface TeacherRow {
  id: string;
  num: number;
  userId: string;
  name: string;
  phone?: string;
  note?: string;
  homeroom?: string;
  position: string;
  lastLogin?: string;
  tempPassword: 'Y' | 'N';
  identityVerified: 'Y' | 'N' | '-';
  twoFactorAuth: 'Y' | 'N' | '-';
  termsAgreed: string;
  status: '사용' | '대기' | '중지';
}

const INITIAL_TEACHERS: TeacherRow[] = [
  {
    id: '134763',
    num: 3,
    userId: '김혜련',
    name: '김혜련',
    phone: '',
    homeroom: '',
    position: '늘봄실무사',
    lastLogin: '',
    tempPassword: 'Y',
    identityVerified: '-',
    twoFactorAuth: '-',
    termsAgreed: '-',
    status: '사용',
  },
  {
    id: '133321',
    num: 2,
    userId: '박진수',
    name: '박진수',
    phone: '',
    homeroom: '',
    position: '늘봄지원실장',
    lastLogin: '2025-09-11 14:29:19',
    tempPassword: 'N',
    identityVerified: 'Y',
    twoFactorAuth: 'Y',
    termsAgreed: '2025-05-09',
    status: '사용',
  },
  {
    id: '129840',
    num: 1,
    userId: '풍향초',
    name: '풍향초',
    phone: '062-609-1182',
    homeroom: '1학년 1반',
    position: '교직원',
    lastLogin: '2026-04-24 11:40:16',
    tempPassword: 'N',
    identityVerified: 'N',
    twoFactorAuth: 'N',
    termsAgreed: '2025-05-09',
    status: '사용',
  },
];

export default function TeacherListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';

  const [teachers, setTeachers] = useState<TeacherRow[]>(INITIAL_TEACHERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [homeroomFilter, setHomeroomFilter] = useState('');
  const [searchType, setSearchType] = useState('mem_name');
  const [searchWord, setSearchWord] = useState('');
  const [isExtraMenuOpen, setIsExtraMenuOpen] = useState(false);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRow | null>(null);

  // Filtered List
  const filteredList = teachers.filter((item) => {
    if (homeroomFilter === '1' && !item.homeroom) return false;
    if (!searchWord.trim()) return true;
    const kw = searchWord.toLowerCase().trim();
    if (searchType === 'mem_id') return item.userId.toLowerCase().includes(kw);
    if (searchType === 'mem_name') return item.name.toLowerCase().includes(kw);
    return item.name.toLowerCase().includes(kw) || item.userId.toLowerCase().includes(kw);
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredList.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`[${name}] 교직원을 정말 삭제하시겠습니까?`)) {
      setTeachers(teachers.filter((t) => t.id !== id));
      setSelectedIds(selectedIds.filter((x) => x !== id));
      alert('삭제되었습니다.');
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 교직원을 선택해 주세요.');
      return;
    }
    if (confirm(`선택한 ${selectedIds.length}명의 교직원을 삭제하시겠습니까?`)) {
      setTeachers(teachers.filter((t) => !selectedIds.includes(t.id)));
      setSelectedIds([]);
      alert('선택한 교직원이 삭제되었습니다.');
    }
  };

  const handleBatchTempPw = () => {
    if (selectedIds.length === 0) {
      alert('대상 교직원을 선택해 주세요.');
      return;
    }
    setTeachers(
      teachers.map((t) => (selectedIds.includes(t.id) ? { ...t, tempPassword: 'Y' } : t))
    );
    alert(`선택한 ${selectedIds.length}명에게 임시비밀번호(생년월일 6자리 또는 초기값)가 설정되었습니다.`);
  };

  const handleStatusChange = (id: string, newStatus: '사용' | '대기') => {
    setTeachers(
      teachers.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleOpenCreateModal = () => {
    setEditingTeacher({
      id: String(Date.now()),
      num: teachers.length + 1,
      userId: '',
      name: '',
      phone: '',
      homeroom: '',
      position: '교직원',
      tempPassword: 'Y',
      identityVerified: '-',
      twoFactorAuth: '-',
      termsAgreed: '-',
      status: '사용',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (t: TeacherRow) => {
    setEditingTeacher({ ...t });
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    if (!editingTeacher.name || !editingTeacher.userId) {
      alert('아이디와 이름을 입력하세요.');
      return;
    }
    const exists = teachers.find((t) => t.id === editingTeacher.id);
    if (exists) {
      setTeachers(teachers.map((t) => (t.id === editingTeacher.id ? editingTeacher : t)));
    } else {
      setTeachers([editingTeacher, ...teachers]);
    }
    setIsEditModalOpen(false);
    alert('저장되었습니다.');
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="교직원관리">
      {/* Help Manual Box (.new_help_manualbox) */}
      <div className="bg-white border border-[#dcdcdc] rounded p-3 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2 text-[13px] text-[#333]">
          <span className="font-bold text-[#3c8dbc] flex items-center space-x-1">
            <span>📄</span>
            <span>매뉴얼</span>
          </span>
          <span className="text-gray-300">|</span>
          <a
            href="https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/common/학교관리_교직원등록.hwp"
            target="_blank"
            rel="noreferrer"
            className="text-[#337ab7] hover:underline font-semibold"
          >
            교직원 등록 매뉴얼 다운로드 (.hwp)
          </a>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        {/* Panel Heading */}
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          목록
        </div>

        {/* Panel Search Bar */}
        <div className="p-3 border-b border-[#eee] bg-[#fafafa]">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={homeroomFilter}
              onChange={(e) => setHomeroomFilter(e.target.value)}
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px]"
            >
              <option value="">=전체=</option>
              <option value="1">담임</option>
            </select>

            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px]"
            >
              <option value="mem_name">이름</option>
              <option value="mem_id">아이디</option>
            </select>

            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="검색어 입력"
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px] w-[200px]"
            />

            <button
              onClick={() => {}}
              className="px-3 py-1 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] rounded text-[12px] font-semibold h-[30px]"
            >
              검색
            </button>
            <button
              onClick={() => {
                setHomeroomFilter('');
                setSearchWord('');
              }}
              className="px-3 py-1 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] rounded text-[12px] font-semibold h-[30px]"
            >
              전체
            </button>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#eee] bg-white">
          <div className="text-[12px] text-gray-500">
            총 <strong className="text-[#337ab7]">{filteredList.length}</strong>명 등록됨
          </div>
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 bg-[#d9534f] hover:bg-[#c9302c] text-white rounded text-[12px] font-bold shadow-sm"
            >
              교직원 등록
            </button>

            {/* Additional Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExtraMenuOpen(!isExtraMenuOpen)}
                className="px-3 py-1.5 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] rounded text-[12px] font-semibold flex items-center space-x-1"
              >
                <span>추가기능..</span>
                <span className="text-[10px]">▼</span>
              </button>
              {isExtraMenuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-[#ccc] rounded shadow-lg py-1 z-20 text-[12px]">
                  <button
                    onClick={() => {
                      setIsExtraMenuOpen(false);
                      alert('교직원 일괄입력: 엑셀 양식을 다운로드하여 대량 등록합니다.');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#337ab7] hover:text-white text-[#333]"
                  >
                    📥 교직원 일괄입력
                  </button>
                  <button
                    onClick={() => {
                      setIsExtraMenuOpen(false);
                      alert('검색 결과가 엑셀(.xlsx)로 다운로드됩니다.');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#5cb85c] hover:text-white text-[#333]"
                  >
                    📊 검색결과엑셀출력
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[45px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">연번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[55px]">수정</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[100px]">아이디</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[100px]">이름</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[130px]">휴대폰<br />(비고)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[80px]">담임</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[110px]">직명</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[140px]">마지막<br />로그인</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">임시<br />비번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">본인<br />인증</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">2단계<br />인증</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">약관동의</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[85px]">상태</th>
                <th className="py-2.5 px-3 w-[55px]">삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((t) => (
                <tr key={t.id} className="border-b border-[#e5e5e5] hover:bg-[#f9fbfd] transition-colors">
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={(e) => handleSelectOne(t.id, e.target.checked)}
                    />
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{t.num}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="text-[#337ab7] hover:text-[#23527c] text-[13px] font-bold"
                      title="수정"
                    >
                      ⚙️
                    </button>
                  </td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-[#337ab7]">{t.userId}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-semibold text-gray-800">{t.name}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-gray-600">{t.phone || '-'}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-700">{t.homeroom || '-'}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-medium text-gray-800">{t.position}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-[11px] text-gray-500">{t.lastLogin || '-'}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <span className={t.tempPassword === 'Y' ? 'text-[#d9534f] font-bold' : 'text-gray-400'}>
                      {t.tempPassword}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{t.identityVerified}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{t.twoFactorAuth}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-[11px] text-gray-500">{t.termsAgreed}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        t.status === '사용'
                          ? 'bg-[#dff0d8] text-[#3c763d] border-[#d6e9c6]'
                          : 'bg-[#fcf8e3] text-[#8a6d3b] border-[#faebcc]'
                      }`}
                    >
                      <option value="사용">사용</option>
                      <option value="대기">대기</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="text-[#d9534f] hover:text-[#c9302c] text-[13px]"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Batch Actions */}
        <div className="p-3 bg-[#f5f5f5] border-t border-[#e5e5e5] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBatchTempPw}
              className="px-3 py-1.5 bg-[#f0ad4e] hover:bg-[#ec971f] text-white rounded text-[12px] font-bold"
            >
              선택항목 임시비밀번호 설정
            </button>
            <button
              onClick={() => {
                if (selectedIds.length === 0) return alert('선택해 주세요.');
                setTeachers(
                  teachers.map((t) =>
                    selectedIds.includes(t.id) ? { ...t, identityVerified: '-' } : t
                  )
                );
                alert('선택한 교직원의 본인인증이 초기화되었습니다.');
              }}
              className="px-3 py-1.5 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] rounded text-[12px] font-semibold"
            >
              본인인증 초기화
            </button>
            <button
              onClick={handleBatchDelete}
              className="px-3 py-1.5 bg-[#d9534f] hover:bg-[#c9302c] text-white rounded text-[12px] font-bold"
            >
              선택항목 삭제
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isEditModalOpen && editingTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[#ccc]">
            <div className="bg-[#3c8dbc] text-white px-4 py-3 font-bold text-[14px] flex justify-between items-center">
              <span>교직원 정보 등록/수정</span>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleSaveModal} className="p-4 space-y-3 text-[13px]">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">아이디 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={editingTeacher.userId}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, userId: e.target.value })}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">직위/직명</label>
                <select
                  value={editingTeacher.position}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, position: e.target.value })}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                >
                  <option value="늘봄실무사">늘봄실무사</option>
                  <option value="늘봄지원실장">늘봄지원실장</option>
                  <option value="교직원">교직원</option>
                  <option value="방과후강사">방과후강사</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">담당 학급 (담임)</label>
                <input
                  type="text"
                  placeholder="예: 1학년 1반"
                  value={editingTeacher.homeroom || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, homeroom: e.target.value })}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">휴대폰 번호</label>
                <input
                  type="text"
                  placeholder="010-0000-0000"
                  value={editingTeacher.phone || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded font-semibold text-[12px]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3c8dbc] text-white rounded font-semibold text-[12px]"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SczigiLayout>
  );
}
