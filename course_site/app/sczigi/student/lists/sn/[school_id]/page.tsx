'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';

interface PageProps {
  params: {
    school_id: string;
  };
}

interface StudentRow {
  id: string;
  num: number;
  grade: number;
  classNum: number;
  studentNum: number;
  name: string;
  gender: '남' | '여';
  phone?: string;
  note?: string;
  previousAcademicRecord?: string;
  lastModified?: string;
  lastLogin?: string;
  tempPassword: 'Y' | 'N';
  termsAgreed: string;
  status: '사용' | '대기' | '중지';
}

const INITIAL_STUDENTS: StudentRow[] = [
  { id: '4841970', num: 317, grade: 1, classNum: 1, studentNum: 1, name: '강민준', gender: '남', phone: '010-3456-1101', previousAcademicRecord: '신입학', lastModified: '2026-03-02', lastLogin: '2026-08-16 14:10:20', tempPassword: 'N', termsAgreed: '2026-03-02', status: '사용' },
  { id: '4841971', num: 316, grade: 1, classNum: 1, studentNum: 2, name: '김도현', gender: '남', phone: '010-3456-1102', previousAcademicRecord: '신입학', lastModified: '2026-03-02', lastLogin: '2026-08-15 11:25:30', tempPassword: 'N', termsAgreed: '2026-03-02', status: '사용' },
  { id: '4841972', num: 315, grade: 1, classNum: 1, studentNum: 3, name: '김서아', gender: '여', phone: '010-3456-1103', previousAcademicRecord: '신입학', lastModified: '2026-03-02', lastLogin: '2026-08-14 09:40:12', tempPassword: 'N', termsAgreed: '2026-03-02', status: '사용' },
  { id: '4841973', num: 314, grade: 1, classNum: 2, studentNum: 1, name: '박시우', gender: '남', phone: '010-3456-1104', previousAcademicRecord: '신입학', lastModified: '2026-03-02', lastLogin: '2026-08-10 18:20:00', tempPassword: 'Y', termsAgreed: '2026-03-02', status: '사용' },
  { id: '4841974', num: 313, grade: 2, classNum: 1, studentNum: 1, name: '이하은', gender: '여', phone: '010-3456-1105', previousAcademicRecord: '1학년 1반', lastModified: '2026-03-02', lastLogin: '2026-08-12 16:50:22', tempPassword: 'N', termsAgreed: '2025-03-02', status: '사용' },
  { id: '4841975', num: 312, grade: 2, classNum: 1, studentNum: 2, name: '정예준', gender: '남', phone: '010-3456-1106', previousAcademicRecord: '1학년 1반', lastModified: '2026-03-02', lastLogin: '2026-08-11 13:10:44', tempPassword: 'N', termsAgreed: '2025-03-02', status: '사용' },
  { id: '4841976', num: 311, grade: 3, classNum: 1, studentNum: 1, name: '최지유', gender: '여', phone: '010-3456-1107', previousAcademicRecord: '2학년 1반', lastModified: '2026-03-02', lastLogin: '2026-08-09 10:05:15', tempPassword: 'N', termsAgreed: '2024-03-02', status: '사용' },
];

export default function StudentListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';

  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [searchType, setSearchType] = useState('mem_name');
  const [searchWord, setSearchWord] = useState('');
  const [isExtraMenuOpen, setIsExtraMenuOpen] = useState(false);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);

  // Filtered List
  const filteredList = students.filter((s) => {
    if (gradeFilter && String(s.grade) !== gradeFilter) return false;
    if (classFilter && String(s.classNum) !== classFilter) return false;
    if (!searchWord.trim()) return true;
    const kw = searchWord.toLowerCase().trim();
    if (searchType === 'mem_name') return s.name.toLowerCase().includes(kw);
    if (searchType === 'tel') return (s.phone || '').includes(kw);
    return s.name.toLowerCase().includes(kw) || (s.phone || '').includes(kw);
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredList.map((s) => s.id));
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
    if (confirm(`[${name}] 학생을 정말 삭제하시겠습니까?`)) {
      setStudents(students.filter((s) => s.id !== id));
      setSelectedIds(selectedIds.filter((x) => x !== id));
      alert('삭제되었습니다.');
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 학생을 선택해 주세요.');
      return;
    }
    if (confirm(`선택한 ${selectedIds.length}명의 학생을 삭제하시겠습니까?`)) {
      setStudents(students.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      alert('선택한 학생이 삭제되었습니다.');
    }
  };

  const handleBatchPromote = () => {
    if (confirm('전체 학생의 학년을 1단계 진급 처리하시겠습니까? (6학년은 졸업/중지 처리됩니다.)')) {
      setStudents(
        students.map((s) => {
          if (s.grade >= 6) {
            return { ...s, previousAcademicRecord: `${s.grade}학년 ${s.classNum}반 (졸업)`, status: '중지' };
          }
          return {
            ...s,
            previousAcademicRecord: `${s.grade}학년 ${s.classNum}반`,
            grade: s.grade + 1,
          };
        })
      );
      alert('학년 진급 처리가 완료되었습니다.');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingStudent({
      id: String(Date.now()),
      num: students.length + 1,
      grade: 1,
      classNum: 1,
      studentNum: 1,
      name: '',
      gender: '남',
      phone: '',
      previousAcademicRecord: '신입학',
      tempPassword: 'N',
      termsAgreed: new Date().toISOString().split('T')[0],
      status: '사용',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (s: StudentRow) => {
    setEditingStudent({ ...s });
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editingStudent.name) {
      alert('학생 이름을 입력하세요.');
      return;
    }
    const exists = students.find((s) => s.id === editingStudent.id);
    if (exists) {
      setStudents(students.map((s) => (s.id === editingStudent.id ? editingStudent : s)));
    } else {
      setStudents([editingStudent, ...students]);
    }
    setIsEditModalOpen(false);
    alert('저장되었습니다.');
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="학생관리">
      {/* Help Manual Box with YouTube links (.new_help_manualbox) */}
      <div className="bg-white border border-[#dcdcdc] rounded p-3 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 text-[13px] text-[#333]">
          <span className="font-bold text-[#3c8dbc] flex items-center space-x-1">
            <span>📄</span>
            <span>매뉴얼</span>
          </span>
          <span className="text-gray-300">|</span>
          <a
            href="https://www.youtube.com/results?search_query=dbdbschool+student+registration"
            target="_blank"
            rel="noreferrer"
            className="text-[#337ab7] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>▶ 학생등록 동영상 가이드</span>
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="https://www.youtube.com/results?search_query=dbdbschool+password+reset"
            target="_blank"
            rel="noreferrer"
            className="text-[#337ab7] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>▶ 비밀번호 초기화 가이드</span>
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
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px]"
            >
              <option value="">=학년=</option>
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={String(g)}>
                  {g}학년
                </option>
              ))}
            </select>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px]"
            >
              <option value="">=반=</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                <option key={c} value={String(c)}>
                  {c}반
                </option>
              ))}
            </select>

            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px]"
            >
              <option value="mem_name">이름</option>
              <option value="tel">연락처</option>
            </select>

            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="검색어"
              className="border border-[#ccc] rounded px-2.5 py-1 text-[13px] bg-white text-[#333] h-[30px] w-[160px]"
            />

            <button
              onClick={() => {}}
              className="px-3 py-1 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] rounded text-[12px] font-semibold h-[30px]"
            >
              검색
            </button>
            <button
              onClick={() => {
                setGradeFilter('');
                setClassFilter('');
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
            총 <strong className="text-[#337ab7]">{filteredList.length}</strong>명 학생
          </div>
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 bg-[#d9534f] hover:bg-[#c9302c] text-white rounded text-[12px] font-bold shadow-sm"
            >
              학생등록
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
                <div className="absolute right-0 mt-1 w-44 bg-white border border-[#ccc] rounded shadow-lg py-1 z-20 text-[12px]">
                  <button
                    onClick={() => {
                      setIsExtraMenuOpen(false);
                      alert('학생 일괄입력: 엑셀 양식을 다운로드하여 전교생을 대량 등록합니다.');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#337ab7] hover:text-white text-[#333]"
                  >
                    📥 학생 일괄입력
                  </button>
                  <button
                    onClick={() => {
                      setIsExtraMenuOpen(false);
                      handleBatchPromote();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#d9534f] hover:text-white text-[#d9534f]"
                  >
                    🎓 진급처리(학적변경)
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
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[55px]">학년 ↑</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">반</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">번호</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[100px]">이름</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">성별</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[130px]">연락처<br />(비고)</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[120px]">이전 학적</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[100px]">마지막<br />수정</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] w-[140px]">마지막<br />로그인</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">임시<br />비번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">약관동의</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[70px]">상태</th>
                <th className="py-2.5 px-3 w-[55px]">삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((s) => (
                <tr key={s.id} className="border-b border-[#e5e5e5] hover:bg-[#f9fbfd] transition-colors">
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.id)}
                      onChange={(e) => handleSelectOne(s.id, e.target.checked)}
                    />
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{s.num}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="text-[#337ab7] hover:text-[#23527c] text-[13px] font-bold"
                      title="수정"
                    >
                      ⚙️
                    </button>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] font-bold text-gray-800">{s.grade}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-700">{s.classNum}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-700">{s.studentNum}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-[#337ab7]">{s.name}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-700">{s.gender}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-gray-600 font-mono text-[11.5px]">{s.phone || '-'}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-[11.5px] text-gray-600">{s.previousAcademicRecord || '-'}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-[11px] text-gray-500">{s.lastModified || '-'}</td>
                  <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-[11px] text-gray-500">{s.lastLogin || '-'}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <span className={s.tempPassword === 'Y' ? 'text-[#d9534f] font-bold' : 'text-gray-400'}>
                      {s.tempPassword}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-[11px] text-gray-500">{s.termsAgreed}</td>
                  <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      s.status === '사용'
                        ? 'bg-[#dff0d8] text-[#3c763d] border-[#d6e9c6]'
                        : 'bg-[#fcf8e3] text-[#8a6d3b] border-[#faebcc]'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
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
              onClick={() => {
                if (selectedIds.length === 0) return alert('선택해 주세요.');
                setStudents(
                  students.map((s) => (selectedIds.includes(s.id) ? { ...s, tempPassword: 'Y' } : s))
                );
                alert(`선택한 ${selectedIds.length}명의 비밀번호가 초기화되었습니다.`);
              }}
              className="px-3 py-1.5 bg-[#f0ad4e] hover:bg-[#ec971f] text-white rounded text-[12px] font-bold"
            >
              선택항목 임시비밀번호 설정
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
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[#ccc]">
            <div className="bg-[#3c8dbc] text-white px-4 py-3 font-bold text-[14px] flex justify-between items-center">
              <span>학생 정보 등록/수정</span>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleSaveModal} className="p-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">학년 <span className="text-red-500">*</span></label>
                  <select
                    value={editingStudent.grade}
                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: Number(e.target.value) })}
                    className="w-full border border-[#ccc] rounded px-2.5 py-1.5"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>{g}학년</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">반 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingStudent.classNum}
                    onChange={(e) => setEditingStudent({ ...editingStudent, classNum: Number(e.target.value) })}
                    className="w-full border border-[#ccc] rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">번호 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingStudent.studentNum}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentNum: Number(e.target.value) })}
                    className="w-full border border-[#ccc] rounded px-2.5 py-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">학생 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full border border-[#ccc] rounded px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">성별</label>
                  <select
                    value={editingStudent.gender}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as any })}
                    className="w-full border border-[#ccc] rounded px-2.5 py-1.5"
                  >
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">학부모 연락처</label>
                <input
                  type="text"
                  placeholder="010-0000-0000"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full border border-[#ccc] rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">이전 학적</label>
                <input
                  type="text"
                  placeholder="예: 1학년 1반 또는 신입학"
                  value={editingStudent.previousAcademicRecord || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, previousAcademicRecord: e.target.value })}
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
