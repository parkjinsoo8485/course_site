'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function StudentFieldConfigPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { studentFieldConfig, updateStudentFieldConfig } = useSczigiStore();

  const [formState, setFormState] = useState({ ...studentFieldConfig });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentFieldConfig(formState);
    alert('학생 회원필드 설정이 성공적으로 저장되었습니다.');
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="회원필드설정">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>학생 회원 등록 및 학부모 수강 신청 시 입력받을 항목과 필수 입력 여부를 설정합니다.</li>
        </ul>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          학생 회원 추가 필드 및 필수입력 설정
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-3 px-4 border-r border-[#e5e5e5] w-[200px]">필드명</th>
                <th className="py-3 px-4 border-r border-[#e5e5e5] w-[180px]">출력상태</th>
                <th className="py-3 px-4 text-left">필수입력 여부</th>
              </tr>
            </thead>
            <tbody>
              {/* Student Phone */}
              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  학생 휴대폰
                </td>
                <td className="py-3 px-4 border-r border-[#e5e5e5]">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.studentPhone.display}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          studentPhone: { ...formState.studentPhone, display: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용</span>
                  </label>
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.studentPhone.required}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          studentPhone: { ...formState.studentPhone, required: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-gray-700 font-medium">필수 입력</span>
                  </label>
                </td>
              </tr>

              {/* Guardian Name */}
              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  보호자 성명
                </td>
                <td className="py-3 px-4 border-r border-[#e5e5e5]">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.guardianName.display}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          guardianName: { ...formState.guardianName, display: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용</span>
                  </label>
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.guardianName.required}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          guardianName: { ...formState.guardianName, required: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-gray-700 font-medium">필수 입력</span>
                  </label>
                </td>
              </tr>

              {/* Guardian Phone */}
              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  보호자 연락처
                </td>
                <td className="py-3 px-4 border-r border-[#e5e5e5]">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.guardianPhone.display}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          guardianPhone: { ...formState.guardianPhone, display: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용</span>
                  </label>
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.guardianPhone.required}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          guardianPhone: { ...formState.guardianPhone, required: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-gray-700 font-medium">필수 입력</span>
                  </label>
                </td>
              </tr>

              {/* Gender */}
              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9f9f9]">
                <td className="py-3 px-4 font-semibold text-gray-800 border-r border-[#e5e5e5] bg-gray-50/50">
                  성별
                </td>
                <td className="py-3 px-4 border-r border-[#e5e5e5]">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.gender.display}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          gender: { ...formState.gender, display: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">사용</span>
                  </label>
                </td>
                <td className="py-3 px-4 text-left">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.gender.required}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          gender: { ...formState.gender, required: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-gray-700 font-medium">필수 입력</span>
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
            onClick={() => setFormState({ ...studentFieldConfig })}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded font-medium text-[13.5px]"
          >
            취소
          </button>
        </div>
      </form>
    </SczigiLayout>
  );
}
