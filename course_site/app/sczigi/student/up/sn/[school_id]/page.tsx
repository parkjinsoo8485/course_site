'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function StudentUpPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const router = useRouter();

  const [excelGubun, setExcelGubun] = useState('1');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('엑셀 파일 : 필수항목입니다.');
      return;
    }
    alert(`[${file.name}] 진급 처리 파일 업로드가 완료되었습니다.\n총 280명의 학생 진급(학적변경)이 정상 반영되었습니다.`);
    router.push(`/sczigi/student/lists/sn/${schoolId}`);
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="학생관리 > 진급처리(학적변경)">
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          진급처리(학적변경)
        </div>

        <div className="p-4 border-b border-[#eee]">
          <p className="text-[12.5px] text-[#555]">
            <span className="text-red-500 font-bold">*</span> 표시가 있는 항목은 반드시 입력해야 합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 text-[13px]">
          <table className="w-full border border-[#ddd] text-[13px] mb-6">
            <tbody>
              {/* 진급처리 사전작업 */}
              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left w-[160px] font-semibold border-r border-[#ddd] align-top">
                  진급처리<br />사전작업
                </th>
                <td className="p-3 text-[12.5px] leading-relaxed text-[#555]">
                  <div className="bg-[#f9f9f9] border border-[#eee] p-3 rounded mb-2">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>기존 학생 데이터를 <span className="text-[#a94442] font-bold">백업(엑셀 출력)</span>하세요.</li>
                      <li>졸업한 학생은 '학생관리'에서 <span className="text-[#a94442] font-bold">미리 삭제</span>하세요.</li>
                      <li>나이스에서 '이전반 기준' 학적 데이터를 다운로드하세요.</li>
                    </ul>
                  </div>
                  <p className="text-[#a94442] text-[12px]">
                    [주의] 기존 데이터를 삭제하거나, 학적이 수정되는 경우 이용 중인 서비스(늘봄학교, 방과후학교 등)에 등록된 자료에 영향을 줄 수 있으므로 충분히 검토 후 처리하시기 바랍니다.
                  </p>
                </td>
              </tr>

              {/* 진급처리 순서 */}
              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd] align-top">
                  진급처리<br />순서
                </th>
                <td className="p-3 text-[12.5px] leading-relaxed text-[#555]">
                  <div className="bg-[#f9f9f9] border border-[#eee] p-3 rounded space-y-1">
                    <p>1) 나이스에서 받은 '이전반 기준' 학적 데이터를 이용하여 <span className="text-[#a94442] font-bold">상위 학년부터 진급 처리</span>하세요.</p>
                    <p>2) 기존 학적(학년, 반, 번호, 이름)과 '이전반 기준' 학적이 같은 학생은 <span className="text-[#a94442] font-bold">'진급학적'</span>으로 업데이트 됩니다.</p>
                    <p>3) 일치하지 않아 업데이트 되지 못한 학생이 있는 경우 결과 로그를 참고하여 수작업으로 처리해 주시기 바랍니다.</p>
                    <p>4) 하위 학년도 똑같은 방법으로 반복하여 처리하세요.</p>
                  </div>
                </td>
              </tr>

              {/* 데이터 형식 */}
              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd] align-top">
                  데이터 형식 <span className="text-red-500 font-bold">*</span>
                </th>
                <td className="p-3 space-y-2 text-[12.5px]">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="excel_gubun"
                      value="1"
                      checked={excelGubun === '1'}
                      onChange={() => setExcelGubun('1')}
                    />
                    <span>기본 (<span className="text-[#a94442] font-bold">이전반기준</span> 학적으로 <span className="text-[#a94442] font-bold">진급학적 적용</span>)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="excel_gubun"
                      value="2"
                      checked={excelGubun === '2'}
                      onChange={() => setExcelGubun('2')}
                    />
                    <span>신입생 (<span className="text-[#a94442] font-bold">생년월일 기준</span>으로 등록된 임시학적을 <span className="text-[#a94442] font-bold">본학적으로 적용</span>)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="excel_gubun"
                      value="3"
                      checked={excelGubun === '3'}
                      onChange={() => setExcelGubun('3')}
                    />
                    <span>전체명렬표 (<span className="text-[#a94442] font-bold">학년,반,이름 기준</span>으로 <span className="text-[#a94442] font-bold">변경된 번호만 적용</span>)</span>
                  </label>
                </td>
              </tr>

              {/* 엑셀 파일 */}
              <tr>
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd] align-top">
                  엑셀 파일 <span className="text-red-500 font-bold">*</span>
                </th>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="border border-[#ccc] rounded px-3 py-1.5 bg-white text-[13px]"
                    />
                    <span className="text-[12px] text-gray-500">
                      (일괄입력 샘플 :{' '}
                      <a
                        href="https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/school/sample/stuUp.xls"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#337ab7] hover:underline font-bold"
                      >
                        stuUp.xls
                      </a>
                      )
                    </span>
                  </div>
                  <div className="text-[12px] text-[#555] space-y-1 bg-[#fafafa] p-2.5 rounded border border-[#eee]">
                    <p>ℹ️ 나이스(4세대) &gt; 학적 &gt; 진급자반편성관리 &gt; <strong>반편성조회 [이전반기준]</strong> 에서 다운로드</p>
                    <p>ℹ️ 한셀로 만들어진 엑셀파일은 MS Excel 형식으로 변환 후 사용할 수 있습니다.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center justify-center space-x-2">
            <Link
              href={`/sczigi/student/lists/sn/${schoolId}`}
              className="px-6 py-2 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] font-semibold rounded text-[13px]"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-[#d9534f] hover:bg-[#c9302c] text-white font-bold rounded text-[13px] shadow-sm"
            >
              진급 처리 시작
            </button>
          </div>
        </form>
      </div>
    </SczigiLayout>
  );
}
