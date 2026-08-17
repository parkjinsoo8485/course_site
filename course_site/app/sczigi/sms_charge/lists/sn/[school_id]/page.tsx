'use client';

import React from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function SmsChargeHistoryPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { smsChargeHistories } = useSczigiStore();

  const totalChargedCount = smsChargeHistories.reduce((acc, cur) => acc + cur.count, 0);

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="충전내역">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>학교 계정에 승인/처리된 전체 문자 충전 이력 내역입니다.</li>
        </ul>
      </div>

      {/* Summary Stat Card */}
      <div className="bg-white border border-[#dcdcdc] rounded p-4 mb-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-gray-600 text-[13px]">총 누적 충전 건수:</span>
          <strong className="text-[20px] text-blue-600 ml-2 font-mono">{totalChargedCount.toLocaleString()}건</strong>
        </div>
        <div className="text-[12.5px] text-gray-500">
          * 취소/환불 건수는 최종 통계에서 자동 제외됩니다.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          충전 이력 목록
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">연번</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-gray-800">충전건수(건)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[120px]">충전구분</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] text-left">비고 (사유)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[100px]">처리구분</th>
                <th className="py-2.5 px-3 w-[150px]">처리일자</th>
              </tr>
            </thead>
            <tbody>
              {smsChargeHistories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    충전 내역 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                smsChargeHistories.map((h, idx) => (
                  <tr key={h.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors">
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{idx + 1}</td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-[#337ab7] font-mono">
                      +{h.count.toLocaleString()}건
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11.5px] font-semibold border border-blue-200">
                        {h.chargeType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] text-left text-gray-700">{h.note}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <span className="text-green-700 font-bold">{h.processType}</span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-mono text-[12px]">{h.processDate}</td>
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
