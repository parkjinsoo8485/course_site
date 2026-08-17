'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function TeacherFieldConfigPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { teacherFieldConfig, updateTeacherFieldConfig } = useSczigiStore();

  const [formState, setFormState] = useState({ ...teacherFieldConfig });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherFieldConfig(formState);
    alert('교직원 회원필드 설정이 성공적으로 저장되었습니다.');
  };

  const handleReset = () => {
    setFormState({ ...teacherFieldConfig });
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="회원필드설정">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>교직원 등록 및 정보 입력 시 노출할 회원 입력 필드를 설정합니다.</li>
          <li>출력 상태가 '사용'으로 체크된 필드만 교직원 관리 테이블 및 입력 폼에 표시됩니다.</li>
        </ul>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          교직원 회원 추가 필드 설정
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-3 px-4 border-r border-[#e5e5e5] w-[250px]">필드명</th>
                <th className="py-3 px-4 text-left">출력상태 (사용 여부)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  휴대폰
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용 (화면 노출)</span>
                  </label>
                </td>
              </tr>

              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  직위
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.position}
                      onChange={(e) => setFormState({ ...formState, position: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용 (화면 노출)</span>
                  </label>
                </td>
              </tr>

              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  생년월일
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.birthdate}
                      onChange={(e) => setFormState({ ...formState, birthdate: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용 (화면 노출)</span>
                  </label>
                </td>
              </tr>

              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  나이스 개인번호
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.neisNumber}
                      onChange={(e) => setFormState({ ...formState, neisNumber: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용 (나이스 연계 식별번호)</span>
                  </label>
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
