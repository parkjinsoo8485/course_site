'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function StudentBasicConfigPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { studentBasicConfig, updateStudentBasicConfig } = useSczigiStore();

  const [formState, setFormState] = useState({ ...studentBasicConfig });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentBasicConfig(formState);
    alert('학생 기본 설정이 성공적으로 저장되었습니다.');
  };

  const handleReset = () => {
    setFormState({ ...studentBasicConfig });
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="기본설정">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>학생 계정 관리 및 학적(학년/학급/번호) 최댓값 정책을 설정합니다.</li>
          <li>다자녀 로그인 공유 활성화 시 동일 보호자 연락처로 등록된 여러 자녀 간 간편 전환이 지원됩니다.</li>
        </ul>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          학생 기본 정책 설정
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <tbody>
              {/* Multi-child login share */}
              <tr className="border-b border-[#e5e5e5]">
                <th className="py-3.5 px-4 bg-gray-50 border-r border-[#e5e5e5] text-right w-[200px] font-semibold text-gray-800">
                  다자녀 로그인 공유
                </th>
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="multiChild"
                        checked={formState.multiChildLoginShare}
                        onChange={() => setFormState({ ...formState, multiChildLoginShare: true })}
                        className="text-blue-600"
                      />
                      <span className="text-gray-800 font-medium">사용 (권장)</span>
                    </label>
                    <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="multiChild"
                        checked={!formState.multiChildLoginShare}
                        onChange={() => setFormState({ ...formState, multiChildLoginShare: false })}
                        className="text-blue-600"
                      />
                      <span className="text-gray-800 font-medium">미사용</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Max limits */}
              <tr className="border-b border-[#e5e5e5]">
                <th className="py-3.5 px-4 bg-gray-50 border-r border-[#e5e5e5] text-right font-semibold text-gray-800">
                  최댓값 지정
                </th>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">최대 학년:</span>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={formState.maxGrade}
                        onChange={(e) => setFormState({ ...formState, maxGrade: Number(e.target.value) })}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-gray-800"
                      />
                      <span className="text-gray-600 text-[12px]">학년</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">최대 학급(반):</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formState.maxClass}
                        onChange={(e) => setFormState({ ...formState, maxClass: Number(e.target.value) })}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-gray-800"
                      />
                      <span className="text-gray-600 text-[12px]">반</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">최대 번호:</span>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={formState.maxStudentNum}
                        onChange={(e) => setFormState({ ...formState, maxStudentNum: Number(e.target.value) })}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-gray-800"
                      />
                      <span className="text-gray-600 text-[12px]">번</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-[#dcdcdc] flex justify-center space-x-2">
          <button
            type="submit"
            className="bg-[#337ab7] hover:bg-[#286090] text-white px-6 py-2 rounded font-bold text-[13.5px] shadow-sm"
          >
            수정 (설정 저장)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded font-medium text-[13.5px]"
          >
            취소
          </button>
        </div>
      </form>
    </SczigiLayout>
  );
}
