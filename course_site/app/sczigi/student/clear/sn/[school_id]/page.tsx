'use client';

import React from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function StudentClearPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { clearStudentData } = useSczigiStore();

  const handleClear = (type: 'members' | 'courses' | 'all', label: string) => {
    if (confirm(`⚠️ [경고] 정말로 "${label}"를 초기화하시겠습니까?\n모든 학생의 해당 데이터가 영구 삭제됩니다.`)) {
      clearStudentData(type);
      alert(`"${label}"가 초기화되었습니다.`);
    }
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="초기화">
      <div className="bg-[#f2dede] border border-[#ebccd1] text-[#a94442] p-4 rounded text-[13px] mb-5">
        <h4 className="font-bold text-[14px] mb-1 flex items-center space-x-1.5">
          <span>⚠️</span>
          <span>학생 데이터 초기화 주의사항</span>
        </h4>
        <p className="text-[12.5px] leading-relaxed">
          초기화 시 선택한 항목의 모든 학생 데이터가 일괄 삭제됩니다. 학년도 마감 후 신학년 준비 시에만 신중하게 실행해
          주세요.
        </p>
      </div>

      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          초기화 항목 선택
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded">
            <div>
              <div className="font-bold text-gray-800 text-[13.5px]">학생 학과/과정 데이터 초기화</div>
              <div className="text-[12px] text-gray-500 mt-0.5">등록된 모든 학생의 학과/과정 분류 데이터를 비웁니다.</div>
            </div>
            <button
              type="button"
              onClick={() => handleClear('courses', '학생 학과 데이터')}
              className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-1.5 rounded font-bold text-[13px] shadow-sm"
            >
              학과 데이터 초기화
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-red-50/50 border border-red-200 rounded">
            <div>
              <div className="font-bold text-red-800 text-[13.5px]">학생 전체 회원 데이터 초기화</div>
              <div className="text-[12px] text-red-600 mt-0.5">등록된 모든 학생 명단 및 학적 데이터를 일괄 삭제합니다.</div>
            </div>
            <button
              type="button"
              onClick={() => handleClear('members', '학생 회원 데이터 전체')}
              className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-4 py-1.5 rounded font-bold text-[13px] shadow-sm"
            >
              전체 학생 삭제
            </button>
          </div>
        </div>
      </div>
    </SczigiLayout>
  );
}
