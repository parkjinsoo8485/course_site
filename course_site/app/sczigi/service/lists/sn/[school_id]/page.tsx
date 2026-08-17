'use client';

import React from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function ServiceListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';

  const serviceUrl = 'https://www.dbdbschool.kr/go/ai/0hc5dFL';
  const servicePeriod = '2025-05-09 ~ 2027-02-28';

  const handleDownloadQr = () => {
    alert('QR코드 위에서 오른쪽 마우스 클릭 후 "이미지를 다른 이름으로 저장" 또는 "다른 이름으로 사진 저장"을 클릭하세요.');
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="서비스목록">
      {/* Panel Main */}
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        {/* Panel Heading */}
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          목록
        </div>

        {/* Panel Body: Help Box */}
        <div className="p-3 border-b border-[#eee]">
          <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] leading-relaxed">
            <ul className="list-disc pl-5 m-0 space-y-1">
              <li>
                QR코드 다운로드 : QR코드 위에서 오른쪽 마우스 클릭 후{' '}
                <span className="text-[#a94442] font-bold">"이미지를 다른 이름으로 저장"</span> 또는{' '}
                <span className="text-[#a94442] font-bold">"다른 이름으로 사진 저장"</span> 클릭)
              </li>
            </ul>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-3 px-4 border-r border-[#e5e5e5] w-[180px]">서비스명</th>
                <th className="py-3 px-4 border-r border-[#e5e5e5] text-left">서비스 URL</th>
                <th className="py-3 px-4 w-[240px]">이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e5e5e5] hover:bg-[#f9fbfd] transition-colors">
                {/* 서비스명 */}
                <td className="py-4 px-4 font-bold text-[#337ab7] border-r border-[#e5e5e5]">
                  늘봄학교
                </td>

                {/* 서비스 URL & QR 코드 */}
                <td className="py-4 px-6 text-left border-r border-[#e5e5e5]">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* QR Code */}
                    <div
                      id="qr_container_3267"
                      title={serviceUrl}
                      onClick={handleDownloadQr}
                      className="cursor-pointer border border-[#ddd] p-2 bg-white rounded shadow-sm hover:border-[#337ab7] transition-colors shrink-0"
                    >
                      <svg width="170" height="170" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg" className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px]">
                        <rect width="170" height="170" fill="white" />
                        {/* Finder Pattern Top-Left */}
                        <rect x="10" y="10" width="45" height="45" fill="black" />
                        <rect x="16" y="16" width="33" height="33" fill="white" />
                        <rect x="22" y="22" width="21" height="21" fill="black" />
                        {/* Finder Pattern Top-Right */}
                        <rect x="115" y="10" width="45" height="45" fill="black" />
                        <rect x="121" y="16" width="33" height="33" fill="white" />
                        <rect x="127" y="22" width="21" height="21" fill="black" />
                        {/* Finder Pattern Bottom-Left */}
                        <rect x="10" y="115" width="45" height="45" fill="black" />
                        <rect x="16" y="121" width="33" height="33" fill="white" />
                        <rect x="22" y="127" width="21" height="21" fill="black" />
                        {/* Timing Patterns & Data Modules */}
                        <rect x="65" y="10" width="8" height="8" fill="black" /><rect x="80" y="10" width="8" height="8" fill="black" /><rect x="95" y="10" width="8" height="8" fill="black" />
                        <rect x="65" y="25" width="8" height="8" fill="black" /><rect x="95" y="25" width="8" height="8" fill="black" />
                        <rect x="65" y="40" width="8" height="8" fill="black" /><rect x="80" y="40" width="8" height="8" fill="black" /><rect x="95" y="40" width="8" height="8" fill="black" />
                        <rect x="10" y="65" width="8" height="8" fill="black" /><rect x="25" y="65" width="8" height="8" fill="black" /><rect x="40" y="65" width="8" height="8" fill="black" />
                        <rect x="65" y="65" width="8" height="8" fill="black" /><rect x="80" y="65" width="8" height="8" fill="black" /><rect x="95" y="65" width="8" height="8" fill="black" /><rect x="110" y="65" width="8" height="8" fill="black" /><rect x="125" y="65" width="8" height="8" fill="black" /><rect x="140" y="65" width="8" height="8" fill="black" /><rect x="155" y="65" width="8" height="8" fill="black" />
                        <rect x="10" y="80" width="8" height="8" fill="black" /><rect x="40" y="80" width="8" height="8" fill="black" /><rect x="65" y="80" width="8" height="8" fill="black" /><rect x="95" y="80" width="8" height="8" fill="black" /><rect x="125" y="80" width="8" height="8" fill="black" />
                        <rect x="10" y="95" width="8" height="8" fill="black" /><rect x="25" y="95" width="8" height="8" fill="black" /><rect x="40" y="95" width="8" height="8" fill="black" /><rect x="65" y="95" width="8" height="8" fill="black" /><rect x="80" y="95" width="8" height="8" fill="black" /><rect x="110" y="95" width="8" height="8" fill="black" /><rect x="140" y="95" width="8" height="8" fill="black" />
                        <rect x="65" y="115" width="8" height="8" fill="black" /><rect x="80" y="115" width="8" height="8" fill="black" /><rect x="110" y="115" width="8" height="8" fill="black" /><rect x="140" y="115" width="8" height="8" fill="black" /><rect x="155" y="115" width="8" height="8" fill="black" />
                        <rect x="65" y="130" width="8" height="8" fill="black" /><rect x="95" y="130" width="8" height="8" fill="black" /><rect x="125" y="130" width="8" height="8" fill="black" /><rect x="140" y="130" width="8" height="8" fill="black" />
                        <rect x="65" y="145" width="8" height="8" fill="black" /><rect x="80" y="145" width="8" height="8" fill="black" /><rect x="95" y="145" width="8" height="8" fill="black" /><rect x="110" y="145" width="8" height="8" fill="black" /><rect x="140" y="145" width="8" height="8" fill="black" /><rect x="155" y="145" width="8" height="8" fill="black" />
                      </svg>
                      <div className="text-[10px] text-gray-500 text-center mt-1">우클릭 → 사진 저장</div>
                    </div>

                    {/* URL Link and Actions */}
                    <div className="flex-1 space-y-2 pt-1">
                      <div>
                        <a
                          href={serviceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#337ab7] hover:underline font-mono text-[13px] break-all font-semibold"
                        >
                          {serviceUrl}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(serviceUrl);
                            alert('URL이 클립보드에 복사되었습니다.');
                          }}
                          className="px-2.5 py-1 bg-white border border-[#ccc] hover:bg-gray-50 text-[#555] rounded text-[12px] font-semibold transition-colors"
                        >
                          📋 URL 복사
                        </button>
                        <Link
                          href={`/sczigi/service/edit/sn/${schoolId}`}
                          className="px-2.5 py-1 bg-[#337ab7] hover:bg-[#286090] text-white rounded text-[12px] font-semibold transition-colors"
                        >
                          ⚙ 서비스 설정
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 이용기간 */}
                <td className="py-4 px-4 font-semibold text-gray-700">
                  {servicePeriod}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Help Box */}
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3.5 rounded text-[13px] leading-relaxed">
        <ul className="list-disc pl-5 m-0 space-y-1">
          <li>현재 이용 중인 서비스 목록입니다.</li>
          <li>서비스 관리자는 해당 서비스 이동 후 "환경설정" 메뉴에서 지정할 수 있습니다.</li>
        </ul>
      </div>
    </SczigiLayout>
  );
}
