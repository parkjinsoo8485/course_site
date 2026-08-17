'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function SmsSinListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { smsChargeRequests, addSmsChargeRequest, cancelSmsChargeRequest } = useSczigiStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ amount: number; count: number }>({
    amount: 100000,
    count: 5000,
  });

  const chargePlans = [
    { amount: 50000, count: 2500, label: '50,000원 (2,500건 - SMS 건당 20원)' },
    { amount: 100000, count: 5000, label: '100,000원 (5,000건 - SMS 건당 20원)' },
    { amount: 300000, count: 15500, label: '300,000원 (15,500건 + 보너스 500건)' },
    { amount: 500000, count: 26500, label: '500,000원 (26,500건 + 보너스 1,500건)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSmsChargeRequest(selectedPlan.amount, selectedPlan.count);
    alert(`[${selectedPlan.amount.toLocaleString()}원 / ${selectedPlan.count.toLocaleString()}건] 충전 신청이 완료되었습니다.\n견적서 출력 후 행정실 품의를 진행해 주세요.`);
    setIsModalOpen(false);
  };

  const handlePrintEstimate = (reqId: string, amount: number) => {
    alert(`[견적서 출력]\n광주풍향초등학교 귀하\n품명: 디비디비스쿨 알림문자 충전\n금액: ${amount.toLocaleString()}원 (VAT 포함)\n사업자등록번호: 123-45-67890`);
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="충전신청">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>학교 예산에 맞춰 문자(SMS/LMS) 발송 건수를 사전 충전 신청하는 메뉴입니다.</li>
          <li>신청 후 즉시 <strong>견적서</strong> 출력이 가능하며, 행정실 입금 확인 후 실시간 건수가 충전됩니다.</li>
        </ul>
      </div>

      {/* Top button */}
      <div className="mb-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-4 py-2 rounded font-bold text-[13px] shadow-sm flex items-center space-x-1.5"
        >
          <span>💳</span>
          <span>충전신청</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e5e5e5] text-[#333] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[60px]">연번</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-gray-800">충전금액(원)</th>
                <th className="py-2.5 px-4 border-r border-[#e5e5e5]">충전건수(건)</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[100px]">견적서</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">품의여부</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[90px]">상태</th>
                <th className="py-2.5 px-3 w-[110px]">신청일자</th>
              </tr>
            </thead>
            <tbody>
              {smsChargeRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    신청된 문자 충전 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                smsChargeRequests.map((req, idx) => (
                  <tr key={req.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors">
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{idx + 1}</td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-bold text-gray-800">
                      {req.amount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-4 border-r border-[#e5e5e5] font-semibold text-[#337ab7]">
                      {req.count.toLocaleString()}건
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <button
                        onClick={() => handlePrintEstimate(req.id, req.amount)}
                        className="bg-blue-50 hover:bg-blue-100 text-[#337ab7] border border-blue-200 px-2.5 py-1 rounded text-[11.5px] font-semibold"
                      >
                        견적서 출력
                      </button>
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <span className="text-gray-700 font-medium">{req.approvalStatus}</span>
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          req.status === '충전완료'
                            ? 'bg-green-100 text-green-700'
                            : req.status === '입금대기'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-mono text-[12px]">{req.requestDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: SMS Charge Application */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#2c3e50] text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-[15px]">문자 발송 건수 충전 신청</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white text-[18px]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[13px]">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">충전 금액 및 건수 선택 *</label>
                <div className="space-y-2">
                  {chargePlans.map((plan, pIdx) => (
                    <label
                      key={pIdx}
                      className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                        selectedPlan.amount === plan.amount
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="chargePlan"
                        checked={selectedPlan.amount === plan.amount}
                        onChange={() => setSelectedPlan({ amount: plan.amount, count: plan.count })}
                        className="text-blue-600 mr-3"
                      />
                      <span className="font-medium text-gray-800">{plan.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-3.5 border border-gray-200 rounded text-[12px] text-gray-600 space-y-1">
                <p>• 입금계좌: 신한은행 100-032-123456 (주)디비디비스쿨</p>
                <p>• 입금 시 입금자명을 <strong>풍향초등학교</strong>로 기재해 주세요.</p>
                <p>• 세금계산서 또는 지출증빙용 현금영수증이 전자 발행됩니다.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold text-[13px]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5cb85c] hover:bg-[#449d44] text-white rounded font-bold text-[13px]"
                >
                  신청하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SczigiLayout>
  );
}
