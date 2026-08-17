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

export default function TeacherInputPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('엑셀 데이터 파일 : 필수항목입니다.');
      return;
    }
    alert(`[${file.name}] 교직원 일괄입력 파일이 성공적으로 업로드되었습니다.\n총 12명의 교직원 데이터가 등록되었습니다.`);
    router.push(`/sczigi/teacher/lists/sn/${schoolId}`);
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="교직원관리 > 일괄입력">
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          일괄입력
        </div>

        <div className="p-4 border-b border-[#eee]">
          <p className="text-[12.5px] text-[#555]">
            <span className="text-red-500 font-bold">*</span> 표시가 있는 항목은 반드시 입력해야 합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 text-[13px]">
          <table className="w-full border border-[#ddd] text-[13px] mb-6">
            <tbody>
              <tr className="border-b border-[#ddd]">
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left w-[180px] font-semibold border-r border-[#ddd]">
                  엑셀 데이터 파일 <span className="text-red-500 font-bold">*</span>
                </th>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="border border-[#ccc] rounded px-3 py-1.5 bg-white text-[13px]"
                    />
                    <span className="text-[12px] text-gray-500">
                      (일괄입력 샘플 :{' '}
                      <a
                        href="https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/school/sample/teaInput.xlsx"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#337ab7] hover:underline font-bold"
                      >
                        teaInput.xlsx
                      </a>
                      )
                    </span>
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1">
                    ℹ️ 한셀로 만들어진 엑셀파일은 MS Excel (.xlsx) 형식으로 변환 후 사용할 수 있습니다.
                  </div>
                </td>
              </tr>

              <tr>
                <th className="bg-[#f9f9f9] text-[#555] px-4 py-3 text-left font-semibold border-r border-[#ddd] align-top">
                  참고사항
                </th>
                <td className="p-3 leading-relaxed text-[#555] text-[12.5px]">
                  - 샘플파일 <span className="text-[#a94442] font-bold">첫 번째 줄의 내용은 변경할 수 없습니다.</span><br />
                  - <span className="text-[#a94442] font-bold">아이디 : 필수 항목</span>입니다 (한글, 영문, 숫자, 언더바(_), 대쉬(-) 2~15자 이내)<br />
                  - <span className="text-[#a94442] font-bold">이름 : 필수 항목</span>입니다.<br />
                  - <span className="text-[#a94442] font-bold">비밀번호 : 등록 시 필수 항목</span>입니다 (4~15자 이내의 영문, 숫자)<br />
                  - <span className="text-[#31708f] font-bold">생년월일 : 선택 항목</span>입니다 (형식: 1980-01-01)<br />
                  - <span className="text-[#31708f] font-bold">나이스 번호 : 선택 항목</span>입니다 (영문, 숫자 10자리)<br />
                  - <span className="text-[#31708f] font-bold">담임 : 선택 항목</span>입니다 (O학년 OO학과(선택) O반)
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center justify-center space-x-2">
            <Link
              href={`/sczigi/teacher/lists/sn/${schoolId}`}
              className="px-6 py-2 bg-white border border-[#ccc] hover:bg-gray-50 text-[#333] font-semibold rounded text-[13px]"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-[#337ab7] hover:bg-[#286090] text-white font-bold rounded text-[13px] shadow-sm"
            >
              등록
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3.5 rounded text-[13px] leading-relaxed">
        <ul className="list-disc pl-5 m-0 space-y-1">
          <li>
            <span className="text-[#a94442] font-bold">아이디가 동일한</span> 교직원이 이미 등록된 경우{' '}
            <span className="text-[#a94442] font-bold">담임 정보만 수정</span>됩니다.
            <br />
            (비밀번호, 생년월일, 나이스 번호는 <span className="text-[#a94442] font-bold">수정 안됨</span>)
          </li>
        </ul>
      </div>
    </SczigiLayout>
  );
}
