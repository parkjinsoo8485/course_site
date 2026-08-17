'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function PrivacyLogMainPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { privacyLogs } = useSczigiStore();

  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredLogs = privacyLogs.filter((l) => {
    if (serviceFilter !== 'all' && l.service !== serviceFilter) return false;
    if (!searchKeyword.trim()) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      l.userId.toLowerCase().includes(kw) ||
      l.ipAddress.includes(kw) ||
      l.action.toLowerCase().includes(kw) ||
      l.userGroup.toLowerCase().includes(kw)
    );
  });

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="서비스접근로그">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>개인정보보호법에 따라 관리자 및 교직원의 시스템 접속 및 개인정보 처리 로그를 기록·보관합니다.</li>
        </ul>
      </div>

      {/* Search Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-white border border-[#dcdcdc] rounded p-3 shadow-sm text-[13px]">
        <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
          <span className="font-semibold text-gray-700">서비스:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-800 text-[13px] outline-none focus:border-blue-500"
          >
            <option value="all">전체 서비스</option>
            <option value="학교관리">학교관리</option>
            <option value="늘봄학교">늘봄학교</option>
            <option value="문자관리">문자관리</option>
          </select>

          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="아이디, IP, 수행업무 검색..."
            className="border border-gray-300 rounded px-3 py-1.5 w-full max-w-[260px] text-gray-800 text-[13px] outline-none focus:border-blue-500"
          />
          <button
            type="button"
            className="bg-[#337ab7] hover:bg-[#286090] text-white px-3.5 py-1.5 rounded font-semibold text-[13px] shrink-0"
          >
            검색
          </button>
          <button
            type="button"
            onClick={() => {
              setServiceFilter('all');
              setSearchKeyword('');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded font-semibold text-[13px] shrink-0"
          >
            전체
          </button>
        </div>

        <button
          onClick={() => alert('서비스 접근 로그 엑셀 다운로드가 시작되었습니다.')}
          className="bg-[#5bc0de] hover:bg-[#31b0d5] text-white px-3.5 py-1.5 rounded font-medium text-[12.5px] shadow-sm shrink-0"
        >
          검색결과출력
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e5e5e5] text-[#333] font-semibold">
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[50px]">연번</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[100px]">서비스</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[100px]">아이디</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[110px]">회원그룹</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[130px]">접속IP</th>
                <th className="py-2.5 px-3 border-r border-[#e5e5e5] w-[160px]">접속시간</th>
                <th className="py-2.5 px-4 text-left">수행업무 (상세 내역)</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    기록된 서비스 접근 로그가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l, idx) => (
                  <tr key={l.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors">
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-gray-600">{idx + 1}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] font-semibold text-gray-700">{l.service}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] font-bold text-[#337ab7]">{l.userId}</td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5]">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-gray-700 text-[11.5px]">
                        {l.userGroup}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] font-mono text-gray-600 text-[12px]">
                      {l.ipAddress}
                    </td>
                    <td className="py-2.5 px-3 border-r border-[#e5e5e5] text-[11.5px] text-gray-500 font-mono">
                      {l.accessTime}
                    </td>
                    <td className="py-2.5 px-4 text-left text-gray-800">{l.action}</td>
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
