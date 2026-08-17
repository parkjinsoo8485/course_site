'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function StudentCourseConfigPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { studentCourseCodes, addStudentCourseCode, updateStudentCourseCode, deleteStudentCourseCode } = useSczigiStore();

  const [newCodeName, setNewCodeName] = useState('');

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) {
      alert('추가할 학과/과정명을 입력하세요.');
      return;
    }
    addStudentCourseCode(newCodeName.trim());
    setNewCodeName('');
    alert('새로운 학과/과정명이 등록되었습니다.');
  };

  const handleUpdateName = (id: string, codeName: string) => {
    updateStudentCourseCode(id, { codeName });
  };

  const handleToggleUse = (id: string, current: boolean) => {
    updateStudentCourseCode(id, { use: !current });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`[${name}] 학과/과정명을 삭제하시겠습니까?`)) {
      deleteStudentCourseCode(id);
    }
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="학과 설정">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>학생의 학과 또는 교육과정(일반과정, 특수교육과정, 늘봄연계과정 등)을 설정합니다.</li>
          <li>사용 여부가 활성화된 항목만 학생 정보 입력 시 선택 목록으로 나타납니다.</li>
        </ul>
      </div>

      {/* Add New Course Form */}
      <div className="bg-white border border-[#dcdcdc] rounded p-3 mb-4 shadow-sm">
        <form onSubmit={handleAddCode} className="flex items-center space-x-2 text-[13px]">
          <span className="font-semibold text-gray-700">신규 학과/과정명 등록:</span>
          <input
            type="text"
            value={newCodeName}
            onChange={(e) => setNewCodeName(e.target.value)}
            placeholder="예: 돌봄연계과정, 방과후집중과정..."
            className="border border-gray-300 rounded px-3 py-1.5 w-[260px] text-gray-800 text-[13px] outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-4 py-1.5 rounded font-bold text-[13px] shadow-sm"
          >
            + 추가
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          학과/과정 코드 목록
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">연번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[80px]">사용</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] text-left">코드명 (학과/과정)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[100px]">적용</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">출력순서</th>
                <th className="py-2.5 px-3 w-[70px]">삭제</th>
              </tr>
            </thead>
            <tbody>
              {studentCourseCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-gray-500">
                    등록된 학과/과정이 없습니다.
                  </td>
                </tr>
              ) : (
                studentCourseCodes.map((c, idx) => (
                  <tr key={c.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors">
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{idx + 1}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <input
                        type="checkbox"
                        checked={c.use}
                        onChange={() => handleToggleUse(c.id, c.use)}
                        className="cursor-pointer w-4 h-4 text-blue-600"
                      />
                    </td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-left">
                      <input
                        type="text"
                        value={c.codeName}
                        onChange={(e) => handleUpdateName(c.id, e.target.value)}
                        className="border border-transparent hover:border-gray-300 focus:border-blue-500 rounded px-2 py-1 w-full font-semibold text-gray-800 text-[13px] outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <button
                        onClick={() => alert(`[${c.codeName}] 과정명이 즉시 저장되었습니다.`)}
                        className="bg-[#337ab7] hover:bg-[#286090] text-white px-2.5 py-1 rounded text-[11.5px] font-semibold"
                      >
                        적용
                      </button>
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">
                      <span className="font-mono">{c.displayOrder}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleDelete(c.id, c.codeName)}
                        className="text-red-500 hover:text-red-700 font-bold text-[14px]"
                        title="삭제"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SczigiLayout>
  );
}
