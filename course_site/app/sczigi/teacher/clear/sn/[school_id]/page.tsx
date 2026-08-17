'use client';

import React from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function TeacherClearPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { clearTeacherData } = useSczigiStore();

  const handleClear = (type: 'fields' | 'members' | 'homeroom' | 'all', label: string) => {
    if (confirm(`⚠️ [경고] 정말로 "${label}"를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      clearTeacherData(type);
      alert(`"${label}"가 초기화되었습니다.`);
    }
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="초기화">
      <div className="bg-[#f2dede] border border-[#ebccd1] text-[#a94442] p-4 rounded text-[13px] mb-5">
        <h4 className="font-bold text-[14px] mb-1 flex items-center space-x-1.5">
          <span>⚠️</span>
          <span>교직원 데이터 초기화 주의사항</span>
        </h4>
        <p className="text-[12.5px] leading-relaxed">
          초기화 시 선택한 항목의 모든 교직원 데이터가 영구 삭제되거나 기본값으로 리셋됩니다. 작업 전 반드시 백업 여부를
          확인하세요.
        </p>
      </div>

      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          초기화 대상 선택
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded">
            <div>
              <div className="font-bold text-gray-800 text-[13.5px]">직위 / 생년월일 / 나이스 개인번호 설정 초기화</div>
              <div className="text-[12px] text-gray-500 mt-0.5">교직원 회원필드 사용 여부 설정을 기본값으로 초기화합니다.</div>
            </div>
            <button
              type="button"
              onClick={() => handleClear('fields', '회원필드 설정')}
              className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-4 py-1.5 rounded font-bold text-[13px] shadow-sm"
            >
              필드 초기화
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded">
            <div>
              <div className="font-bold text-gray-800 text-[13.5px]">담임 배정 데이터 초기화</div>
              <div className="text-[12px] text-gray-500 mt-0.5">등록된 모든 교직원의 담당 학급(담임) 정보를 일괄 비웁니다.</div>
            </div>
            <button
              type="button"
              onClick={() => handleClear('homeroom', '담임 학과 데이터')}
              className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-1.5 rounded font-bold text-[13px] shadow-sm"
            >
              담임 초기화
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-red-50/50 border border-red-200 rounded">
            <div>
              <div className="font-bold text-red-800 text-[13.5px]">교직원 전체 회원 데이터 초기화</div>
              <div className="text-[12px] text-red-600 mt-0.5">등록된 모든 교직원 계정 및 프로필 목록을 일괄 삭제합니다.</div>
            </div>
            <button
              type="button"
              onClick={() => handleClear('members', '교직원 회원 데이터 전체')}
              className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-4 py-1.5 rounded font-bold text-[13px] shadow-sm"
            >
              전체 회원 삭제
            </button>
          </div>
        </div>
      </div>
    </SczigiLayout>
  );
}
