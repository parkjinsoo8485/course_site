'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    school_id: string;
    page?: string;
  };
}

export default function TeacherWritePage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const router = useRouter();

  const [formData, setFormData] = useState({
    mem_id: '',
    mem_name: '',
    mem_passwd: '',
    mem_level: '7', // 늘봄실무사
    mem_grade: '',
    mem_class: '',
    tel: '',
    nice_bunho: '',
    mem_birthday: '',
    status: '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mem_id || !formData.mem_name) {
      alert('아이디와 이름을 입력하세요.');
      return;
    }
    alert('교직원이 등록되었습니다.');
    router.push(`/sczigi/teacher/lists/sn/${schoolId}`);
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="교직원관리 > 교직원등록">
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          교직원 등록
        </div>

        <form onSubmit={handleSubmit} className="p-5 text-[13px] space-y-4">
          <table className="w-full border border-[#ddd] text-[13px]">
            <tbody>
              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left w-[160px] font-semibold border-r border-[#ddd]">
                  아이디 <span className="text-red-500">*</span>
                </th>
                <td className="p-3">
                  <input
                    type="text"
                    required
                    value={formData.mem_id}
                    onChange={(e) => setFormData({ ...formData, mem_id: e.target.value })}
                    placeholder="아이디 입력"
                    className="border border-[#ccc] rounded px-3 py-1.5 w-full max-w-[280px]"
                  />
                </td>
              </tr>

              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  이름 <span className="text-red-500">*</span>
                </th>
                <td className="p-3">
                  <input
                    type="text"
                    required
                    value={formData.mem_name}
                    onChange={(e) => setFormData({ ...formData, mem_name: e.target.value })}
                    placeholder="성명 입력"
                    className="border border-[#ccc] rounded px-3 py-1.5 w-full max-w-[280px]"
                  />
                </td>
              </tr>

              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  비밀번호
                </th>
                <td className="p-3">
                  <input
                    type="password"
                    value={formData.mem_passwd}
                    onChange={(e) => setFormData({ ...formData, mem_passwd: e.target.value })}
                    placeholder="비워둘 경우 생년월일 또는 초기 PW 설정"
                    className="border border-[#ccc] rounded px-3 py-1.5 w-full max-w-[280px]"
                  />
                </td>
              </tr>

              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  직위/직명
                </th>
                <td className="p-3">
                  <select
                    value={formData.mem_level}
                    onChange={(e) => setFormData({ ...formData, mem_level: e.target.value })}
                    className="border border-[#ccc] rounded px-3 py-1.5 w-full max-w-[280px] bg-white"
                  >
                    <option value="">=선택=</option>
                    <option value="1">교장</option>
                    <option value="2">교감</option>
                    <option value="4">수석교사</option>
                    <option value="3">교사</option>
                    <option value="5">교직원</option>
                    <option value="6">늘봄지원실장</option>
                    <option value="7">늘봄실무사</option>
                  </select>
                </td>
              </tr>

              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  담당 학급 (담임)
                </th>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <select
                      value={formData.mem_grade}
                      onChange={(e) => setFormData({ ...formData, mem_grade: e.target.value })}
                      className="border border-[#ccc] rounded px-2.5 py-1.5 bg-white"
                    >
                      <option value="">=학년=</option>
                      {[1, 2, 3, 4, 5, 6].map((g) => (
                        <option key={g} value={String(g)}>{g}학년</option>
                      ))}
                    </select>
                    <select
                      value={formData.mem_class}
                      onChange={(e) => setFormData({ ...formData, mem_class: e.target.value })}
                      className="border border-[#ccc] rounded px-2.5 py-1.5 bg-white"
                    >
                      <option value="">=반=</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                        <option key={c} value={String(c)}>{c}반</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>

              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  휴대폰 번호
                </th>
                <td className="p-3">
                  <input
                    type="text"
                    value={formData.tel}
                    onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                    placeholder="010-0000-0000"
                    className="border border-[#ccc] rounded px-3 py-1.5 w-full max-w-[280px]"
                  />
                </td>
              </tr>

              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  나이스 개인번호
                </th>
                <td className="p-3">
                  <input
                    type="text"
                    value={formData.nice_bunho}
                    onChange={(e) => setFormData({ ...formData, nice_bunho: e.target.value })}
                    placeholder="나이스 고유 식별번호"
                    className="border border-[#ccc] rounded px-3 py-1.5 w-full max-w-[280px]"
                  />
                </td>
              </tr>

              <tr>
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd]">
                  상태
                </th>
                <td className="p-3">
                  <label className="inline-flex items-center space-x-2 mr-4">
                    <input
                      type="radio"
                      name="status"
                      value="1"
                      checked={formData.status === '1'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <span>사용</span>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      value="0"
                      checked={formData.status === '0'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <span>대기</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center justify-center space-x-2 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#337ab7] hover:bg-[#286090] text-white font-bold rounded text-[13px] shadow-sm"
            >
              저장
            </button>
            <Link
              href={`/sczigi/teacher/lists/sn/${schoolId}`}
              className="px-6 py-2 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] font-semibold rounded text-[13px]"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </SczigiLayout>
  );
}
