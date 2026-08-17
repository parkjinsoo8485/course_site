'use client';

import React from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function SmsTelHelpPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const router = useRouter();

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="문자관리 > 발신번호등록 안내">
      <div className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          발신번호등록 안내
        </div>

        <div className="p-5 text-[13px] space-y-6 text-[#444] leading-relaxed">
          {/* 섹션 1: 사전등록제 시행 안내 */}
          <div>
            <h3 className="font-bold text-[14px] text-[#333] mb-2 flex items-center space-x-1.5">
              <span className="text-[#3c8dbc]">✔</span>
              <span>발신번호 사전등록제 시행 안내</span>
            </h3>
            <div className="bg-[#f9f9f9] border border-[#eee] p-3.5 rounded text-[12.5px] leading-relaxed">
              전기통신사업법 제 84조 2(전화번호의 거짓표기 금지 및 이용자보호)에 의거하여 모든 인터넷 발송 문자메시지 이용자는 사전에 등록된 발신번호로만 문자 발송이 가능합니다.<br />
              사전에 등록된 발신번호가 변작으로 의심되어 한국인터넷진흥원(KISA)로부터 소명요청을 받을 경우 3일 이내에 제출해야 하고, 서비스의 제공이 즉각 중지 처리 될 수 있습니다.<br />
              또한, <span className="text-[#a94442] font-bold">[거짓으로 표시된 전화번호로 인한 이용자의 피해 예방 등에 관한 고시]</span> 개정에 따라 발신번호 추가 등록 방법 및 등록 서류가 강화되어 통신서비스 이용증명원을 필수로 제출하여야 합니다.
            </div>
          </div>

          {/* 섹션 2: 등록 방법 절차 */}
          <div>
            <h3 className="font-bold text-[14px] text-[#333] mb-2 flex items-center space-x-1.5">
              <span className="text-[#3c8dbc]">✔</span>
              <span>발신번호 등록 절차</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-center text-[13px]">
              <div className="bg-[#f0f7fd] border border-[#d0e5f5] p-3 rounded font-semibold text-[#2b669a]">
                <div className="w-6 h-6 rounded-full bg-[#337ab7] text-white flex items-center justify-center mx-auto mb-1 text-[11px]">1</div>
                문자 발신번호 등록 요청
              </div>
              <div className="bg-[#f0f7fd] border border-[#d0e5f5] p-3 rounded font-semibold text-[#2b669a]">
                <div className="w-6 h-6 rounded-full bg-[#337ab7] text-white flex items-center justify-center mx-auto mb-1 text-[11px]">2</div>
                서류 검토 (1~2 영업일)
              </div>
              <div className="bg-[#f0f7fd] border border-[#d0e5f5] p-3 rounded font-semibold text-[#2b669a]">
                <div className="w-6 h-6 rounded-full bg-[#337ab7] text-white flex items-center justify-center mx-auto mb-1 text-[11px]">3</div>
                승인 및 발신번호 등록 완료
              </div>
            </div>

            <p className="text-[12.5px] text-[#666] mb-2">
              등록하고자 하는 발신번호(기관 또는 재직자)에 대한 유효성 및 소유자 증명을 위해 관련 서류를 제출해 주셔야 합니다.
            </p>

            <table className="w-full border border-[#ddd] text-[12.5px]">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#ddd] text-[#555]">
                  <th className="py-2.5 px-4 border-r border-[#ddd] w-[180px] text-left">발신번호 명의</th>
                  <th className="py-2.5 px-4 text-left">제출 서류</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#ddd]">
                  <td className="py-2.5 px-4 font-semibold border-r border-[#ddd]">사업자/학교 명의</td>
                  <td className="py-2.5 px-4">- 통신서비스 가입증명원 (학교/기관 사업자)</td>
                </tr>
                <tr className="border-b border-[#ddd]">
                  <td className="py-2.5 px-4 font-semibold border-r border-[#ddd]">재직자/교직원 명의</td>
                  <td className="py-2.5 px-4">
                    - 통신서비스 가입증명원 (재직자 명의)<br />
                    - 재직증명서 또는 재직확인서 (서비스를 이용 중인 학교의 재직자에 한함)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-2 pt-4 border-t border-[#eee]">
            <Link
              href={`/sczigi/sms_tel/lists/sn/${schoolId}`}
              className="px-6 py-2 bg-[#337ab7] hover:bg-[#286090] text-white font-bold rounded text-[13px] shadow-sm"
            >
              발신번호 목록으로 이동
            </Link>
          </div>
        </div>
      </div>
    </SczigiLayout>
  );
}
