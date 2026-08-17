'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function ServiceEditPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';

  // State for form fields
  const [formData, setFormData] = useState({
    schoolName: '광주풍향초등학교',
    serviceName: '늘봄학교',
    serviceCode: '3267',
    serviceDomain: 'https://www.dbdbschool.kr/go/ai/0hc5dFL',
    contractPeriodStart: '2025-05-09',
    contractPeriodEnd: '2027-02-28',
    managerName: '김혜련',
    managerPhone: '010-2494-1479',
    managerEmail: 'khh147979@naver.com',
    adminOfficePhone: '062-609-1182',
    useTwoFactor: 'N',
    usePrivacyConsent: 'Y',
    memo: '광주풍향초등학교 늘봄학교 전용 관리 계약 (2년 연장)',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('학교 및 서비스 설정 정보가 성공적으로 저장되었습니다.');
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="서비스 정보 및 계약 관리">
      {/* Help Alert */}
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3.5 rounded text-[13px] mb-4 leading-relaxed">
        <ul className="list-disc pl-5 space-y-1">
          <li>학교 기본 정보 및 서비스 이용 계약 기간, 담당자 정보를 관리하는 페이지입니다.</li>
          <li>
            서비스 기간 연장이 필요한 경우 <strong>"연장신청"</strong> 메뉴를 통해 견적서 출력 및 계약 품의를 진행해 주시기 바랍니다.
          </li>
        </ul>
      </div>

      {/* Main Panel */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-6">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333] flex justify-between items-center">
          <span>서비스 기본 정보 수정</span>
          <span className="text-[12px] text-gray-500 font-normal">학교식별코드(SN): {schoolId}</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 text-[13px]">
            {/* 학교명 / 서비스명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  학교명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  서비스 구분 <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="늘봄학교">늘봄학교</option>
                  <option value="방과후학교">방과후학교</option>
                  <option value="초등돌봄교실">초등돌봄교실</option>
                  <option value="자유학기제">자유학기제</option>
                </select>
              </div>
            </div>

            {/* 접속 URL */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">서비스 전용 모바일 웹 URL</label>
              <div className="flex">
                <input
                  type="text"
                  name="serviceDomain"
                  value={formData.serviceDomain}
                  onChange={handleChange}
                  className="flex-1 h-9 px-3 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500 font-mono text-[12.5px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formData.serviceDomain);
                    alert('URL이 클립보드에 복사되었습니다.');
                  }}
                  className="px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r text-gray-700 hover:bg-gray-200 font-medium"
                >
                  복사
                </button>
              </div>
            </div>

            {/* 계약 이용 기간 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">계약 시작일</label>
                <input
                  type="date"
                  name="contractPeriodStart"
                  value={formData.contractPeriodStart}
                  onChange={handleChange}
                  className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">계약 만료일</label>
                <input
                  type="date"
                  name="contractPeriodEnd"
                  value={formData.contractPeriodEnd}
                  onChange={handleChange}
                  className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 담당자 정보 */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-bold text-[14px] text-gray-800 mb-3">📌 학교 담당자 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    담당자 성명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    required
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    휴대폰 번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="managerPhone"
                    value={formData.managerPhone}
                    onChange={handleChange}
                    required
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">교무/행정실 직통전화</label>
                  <input
                    type="text"
                    name="adminOfficePhone"
                    value={formData.adminOfficePhone}
                    onChange={handleChange}
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 담당자 이메일 & 보안 설정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="managerEmail"
                  value={formData.managerEmail}
                  onChange={handleChange}
                  required
                  className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">2단계 인증(2FA) 여부</label>
                <select
                  name="useTwoFactor"
                  value={formData.useTwoFactor}
                  onChange={handleChange}
                  className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="N">미사용 (ID/PW 간편 로그인)</option>
                  <option value="Y">사용 (SMS 인증번호 필수)</option>
                </select>
              </div>
            </div>

            {/* 비고/메모 */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">관리 메모</label>
              <textarea
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-[13px]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <Link
              href={`/sczigi/service/lists/sn/${schoolId}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[13px] font-semibold transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>
            <div className="flex space-x-2">
              <button
                type="reset"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[13px] font-semibold transition-colors"
              >
                초기화
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#337ab7] hover:bg-[#286090] text-white rounded text-[13px] font-bold shadow-sm transition-colors"
              >
                설정 저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </SczigiLayout>
  );
}
