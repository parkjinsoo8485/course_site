'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function SmsReportListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { smsDailyReports } = useSczigiStore();

  const [dateRange, setDateRange] = useState<'thisMonth' | 'lastMonth' | 'last30Days'>('thisMonth');

  // Aggregated totals
  const totalSmsSuccess = smsDailyReports.reduce((sum, r) => sum + r.sms.success, 0);
  const totalSmsFail = smsDailyReports.reduce((sum, r) => sum + r.sms.fail, 0);
  const totalSmsSum = smsDailyReports.reduce((sum, r) => sum + r.sms.total, 0);

  const totalLmsSuccess = smsDailyReports.reduce((sum, r) => sum + r.lms.success, 0);
  const totalLmsFail = smsDailyReports.reduce((sum, r) => sum + r.lms.fail, 0);
  const totalLmsSum = smsDailyReports.reduce((sum, r) => sum + r.lms.total, 0);

  const totalDeducted = smsDailyReports.reduce((sum, r) => sum + r.deduction.deducted, 0);
  const totalRecharged = smsDailyReports.reduce((sum, r) => sum + r.deduction.recharged, 0);
  const totalNetDeduction = smsDailyReports.reduce((sum, r) => sum + r.deduction.total, 0);

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="발송통계">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>일자별 SMS(단문) 및 LMS(장문) 발송 성공/실패 통계 및 건수 차감 내역을 확인합니다.</li>
          <li>발송 실패된 건수는 익일 자동 재충전(환불) 처리되어 차감 건수에서 보정됩니다.</li>
        </ul>
      </div>

      {/* Date Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-white border border-[#dcdcdc] rounded p-3 shadow-sm text-[13px]">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setDateRange('lastMonth')}
            className={`px-3 py-1.5 rounded font-semibold text-[12.5px] border ${
              dateRange === 'lastMonth' ? 'bg-[#337ab7] text-white border-[#2e6da4]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
            }`}
          >
            지난달
          </button>
          <button
            type="button"
            onClick={() => setDateRange('thisMonth')}
            className={`px-3 py-1.5 rounded font-semibold text-[12.5px] border ${
              dateRange === 'thisMonth' ? 'bg-[#337ab7] text-white border-[#2e6da4]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
            }`}
          >
            이번달
          </button>
          <button
            type="button"
            onClick={() => setDateRange('last30Days')}
            className={`px-3 py-1.5 rounded font-semibold text-[12.5px] border ${
              dateRange === 'last30Days' ? 'bg-[#337ab7] text-white border-[#2e6da4]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
            }`}
          >
            최근1달
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('발송통계 엑셀 다운로드가 시작되었습니다.')}
            className="bg-[#5bc0de] hover:bg-[#31b0d5] text-white px-3 py-1.5 rounded font-medium text-[12.5px] shadow-sm"
          >
            검색결과엑셀출력
          </button>
          <button
            onClick={() => alert('8월 발송 실패 목록 엑셀 다운로드가 시작되었습니다.')}
            className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-3 py-1.5 rounded font-medium text-[12.5px] shadow-sm"
          >
            실패목록출력(8월)
          </button>
        </div>
      </div>

      {/* Main 2-Level Header Table */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse text-center">
            <thead>
              {/* Level 1 Header */}
              <tr className="bg-[#f5f5f5] border-b border-[#e5e5e5] text-[#333] font-semibold">
                <th rowSpan={2} className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">
                  연번
                </th>
                <th rowSpan={2} className="py-2.5 px-4 border-r border-[#e5e5e5] w-[110px]">
                  발송일자
                </th>
                <th colSpan={3} className="py-2 px-3 border-r border-[#e5e5e5] bg-blue-50/70 text-blue-900 font-bold">
                  SMS (단문)
                </th>
                <th colSpan={3} className="py-2 px-3 border-r border-[#e5e5e5] bg-purple-50/70 text-purple-900 font-bold">
                  LMS (장문)
                </th>
                <th colSpan={3} className="py-2 px-3 bg-green-50/70 text-green-900 font-bold">
                  차감(성공) / 재충전(실패)
                </th>
              </tr>
              {/* Level 2 Header */}
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                {/* SMS */}
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] text-green-700">성공</th>
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] text-red-600">실패</th>
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] font-bold">합계</th>
                {/* LMS */}
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] text-green-700">성공</th>
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] text-red-600">실패</th>
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] font-bold">합계</th>
                {/* Deduction */}
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] text-blue-700">차감</th>
                <th className="py-1.5 px-2 border-r border-[#e5e5e5] text-orange-600">재충전</th>
                <th className="py-1.5 px-2 font-bold text-gray-800">합계</th>
              </tr>
            </thead>
            <tbody>
              {smsDailyReports.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-500">
                    발송 통계 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                smsDailyReports.map((r, idx) => (
                  <tr key={r.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors font-mono">
                    <td className="py-2 px-3 border-r border-[#e5e5e5] text-gray-600 font-sans">{idx + 1}</td>
                    <td className="py-2 px-4 border-r border-[#e5e5e5] text-gray-800 font-sans">{r.sendDate}</td>
                    {/* SMS */}
                    <td className="py-2 px-2 border-r border-[#e5e5e5] text-green-700">{r.sms.success}</td>
                    <td className="py-2 px-2 border-r border-[#e5e5e5] text-red-600">{r.sms.fail}</td>
                    <td className="py-2 px-2 border-r border-[#e5e5e5] font-bold text-gray-800">{r.sms.total}</td>
                    {/* LMS */}
                    <td className="py-2 px-2 border-r border-[#e5e5e5] text-green-700">{r.lms.success}</td>
                    <td className="py-2 px-2 border-r border-[#e5e5e5] text-red-600">{r.lms.fail}</td>
                    <td className="py-2 px-2 border-r border-[#e5e5e5] font-bold text-gray-800">{r.lms.total}</td>
                    {/* Deduction */}
                    <td className="py-2 px-2 border-r border-[#e5e5e5] text-blue-700 font-bold">{r.deduction.deducted}</td>
                    <td className="py-2 px-2 border-r border-[#e5e5e5] text-orange-600 font-bold">+{r.deduction.recharged}</td>
                    <td className="py-2 px-2 font-bold text-gray-900">{r.deduction.total}</td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Total Footer */}
            <tfoot>
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-300 text-gray-900 font-mono">
                <td colSpan={2} className="py-2.5 px-3 border-r border-[#e5e5e5] text-center font-sans">
                  총 합계
                </td>
                {/* SMS Totals */}
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-green-700">{totalSmsSuccess}</td>
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-red-600">{totalSmsFail}</td>
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-gray-900 font-extrabold">{totalSmsSum}</td>
                {/* LMS Totals */}
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-green-700">{totalLmsSuccess}</td>
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-red-600">{totalLmsFail}</td>
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-gray-900 font-extrabold">{totalLmsSum}</td>
                {/* Deduction Totals */}
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-blue-800">{totalDeducted}</td>
                <td className="py-2.5 px-2 border-r border-[#e5e5e5] text-orange-700">+{totalRecharged}</td>
                <td className="py-2.5 px-2 text-gray-900 font-extrabold">{totalNetDeduction}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </SczigiLayout>
  );
}
