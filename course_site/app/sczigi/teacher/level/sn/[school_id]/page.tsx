'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function TeacherLevelConfigPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { positionCodes, addPositionCode, updatePositionCode, deletePositionCode } = useSczigiStore();

  const [newCodeName, setNewCodeName] = useState('');

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) {
      alert('추가할 직위명을 입력하세요.');
      return;
    }
    addPositionCode(newCodeName.trim());
    setNewCodeName('');
    alert('새로운 직위명이 등록되었습니다.');
  };

  const handleUpdateName = (id: string, codeName: string) => {
    updatePositionCode(id, { codeName });
  };

  const handleToggleUse = (id: string, current: boolean) => {
    updatePositionCode(id, { use: !current });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`[${name}] 직위명을 삭제하시겠습니까?`)) {
      deletePositionCode(id);
    }
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="직위명 설정">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>학교 내에서 사용할 교직원의 직위명 코드를 관리합니다.</li>
          <li>사용 여부가 체크된 항목만 교직원 등록 시 선택 항목으로 표시됩니다.</li>
        </ul>
      </div>

      {/* Add New Position Code Form */}
      <div className="bg-white border border-[#dcdcdc] rounded p-3 mb-4 shadow-sm">
        <form onSubmit={handleAddCode} className="flex items-center space-x-2 text-[13px]">
          <span className="font-semibold text-gray-700">신규 직위명 등록:</span>
          <input
            type="text"
            value={newCodeName}
            onChange={(e) => setNewCodeName(e.target.value)}
            placeholder="예: 기간제교사, 행정실무사..."
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

      {/* Position Code Table */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          직위명 코드 목록
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">연번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[80px]">사용</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] text-left">코드명 (직위명)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[100px]">적용</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">출력순서</th>
                <th className="py-2.5 px-3 w-[70px]">삭제</th>
              </tr>
            </thead>
            <tbody>
              {positionCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-gray-500">
                    등록된 직위명이 없습니다.
                  </td>
                </tr>
              ) : (
                positionCodes.map((p, idx) => (
                  <tr key={p.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors">
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{idx + 1}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <input
                        type="checkbox"
                        checked={p.use}
                        onChange={() => handleToggleUse(p.id, p.use)}
                        className="cursor-pointer w-4 h-4 text-blue-600"
                      />
                    </td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-left">
                      <input
                        type="text"
                        value={p.codeName}
                        onChange={(e) => handleUpdateName(p.id, e.target.value)}
                        className="border border-transparent hover:border-gray-300 focus:border-blue-500 rounded px-2 py-1 w-full font-semibold text-gray-800 text-[13px] outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <button
                        onClick={() => alert(`[${p.codeName}] 직위명이 즉시 적용되었습니다.`)}
                        className="bg-[#337ab7] hover:bg-[#286090] text-white px-2.5 py-1 rounded text-[11.5px] font-semibold"
                      >
                        적용
                      </button>
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">
                      <span className="font-mono">{p.displayOrder}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleDelete(p.id, p.codeName)}
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
