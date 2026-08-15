'use client';

import React, { useState, useMemo } from 'react';

// ─────────────────────────────────────────────
// 데이터 타입 정의
// ─────────────────────────────────────────────
interface LinkItem {
  label: string;
  href: string;
}

interface ProcedureItem {
  num: number;
  title: string;
  doc?: string;
  video?: string;
}

interface FaqItem {
  title: string;
  doc?: string;
  video?: string;
  extra?: LinkItem[];
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

// ─────────────────────────────────────────────
// 1. 수강신청 운영 절차 데이터 (23단계)
// ─────────────────────────────────────────────
const PROCEDURES: ProcedureItem[] = [
  { num: 1,  title: '학교홈페이지 배너 등록',     doc: 'https://www.dbdbschool.kr/help/go_data/num/239/data/link2' },
  { num: 2,  title: '학생 이용 동의서 받기',       doc: 'https://www.dbdbschool.kr/help/go_data/num/182/data/link2' },
  { num: 3,  title: '가정통신문 발송',             doc: 'https://www.dbdbschool.kr/help/go_data/num/183/data/link2' },
  { num: 4,  title: '학생등록',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/71/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/71/data/link1' },
  { num: 5,  title: '강사등록',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/185/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/72/data/link1' },
  { num: 6,  title: '환경설정',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/73/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/73/data/link1' },
  { num: 7,  title: '강좌등록',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/74/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/74/data/link1' },
  { num: 8,  title: '수강신청 기간 설정',          doc: 'https://www.dbdbschool.kr/help/go_data/num/75/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/75/data/link1' },
  { num: 9,  title: '수강신청 테스트',             doc: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link1' },
  { num: 10, title: '대기자 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/77/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/77/data/link1' },
  { num: 11, title: '추첨하기',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/78/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/78/data/link1' },
  { num: 12, title: '신청결과 조회',               doc: 'https://www.dbdbschool.kr/help/go_data/num/186/data/link2' },
  { num: 13, title: '출석부 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/237/data/link2' },
  { num: 14, title: '수강료 산출',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/80/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/80/data/link1' },
  { num: 15, title: '강사마감',                   doc: 'https://www.dbdbschool.kr/help/go_data/num/81/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/81/data/link1' },
  { num: 16, title: '지원금 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/255/data/link2' },
  { num: 17, title: '자유수강권자 관리',            doc: 'https://www.dbdbschool.kr/help/go_data/num/187/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/82/data/link1' },
  { num: 18, title: '스쿨뱅킹 파일 다운로드',       doc: 'https://www.dbdbschool.kr/help/go_data/num/84/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/84/data/link1' },
  { num: 19, title: '다음달 수강신청 준비',         doc: 'https://www.dbdbschool.kr/help/go_data/num/188/data/link2' },
  { num: 20, title: '환불자 관리',                 doc: 'https://www.dbdbschool.kr/help/go_data/num/85/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/85/data/link1' },
  { num: 21, title: '데이터 백업 및 초기화',        doc: 'https://www.dbdbschool.kr/help/go_data/num/190/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/86/data/link1' },
  { num: 22, title: '설문조사 가정통신문',          doc: 'https://www.dbdbschool.kr/help/go_data/num/191/data/link2' },
  { num: 23, title: '설문조사 관리',               doc: 'https://www.dbdbschool.kr/help/go_data/num/45/data/link2',  video: 'https://www.dbdbschool.kr/help/go_data/num/45/data/link1' },
];

// ─────────────────────────────────────────────
// 2. 양식 다운로드 데이터
// ─────────────────────────────────────────────
const FORMS: { title: string; links: LinkItem[] }[] = [
  {
    title: '배너 / 팝업 이미지',
    links: [
      { label: '배너 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/177/data/link2' },
      { label: '팝업 이미지 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/178/data/link2' },
    ],
  },
  {
    title: '학생 수강신청 안내 동영상',
    links: [
      { label: '동영상', href: 'https://www.dbdbschool.kr/help/go_data/num/88/data/link1' },
      { label: '다운로드', href: 'https://www.dbdbschool.kr/help/go_data/num/168/data/link2' },
    ],
  },
  {
    title: '모바일 앱 이용 방법',
    links: [
      { label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/181/data/link2' },
    ],
  },
];

// ─────────────────────────────────────────────
// 3. 매뉴얼 다운로드 데이터
// ─────────────────────────────────────────────
const MANUALS: { title: string; links: LinkItem[]; isHighlight?: boolean }[] = [
  {
    title: '관리자 수강신청 관리 매뉴얼',
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/161/data/link2' }],
  },
  {
    title: '강사 매뉴얼',
    links: [
      { label: '동영상', href: 'https://www.dbdbschool.kr/help/go_data/num/101/data/link1' },
      { label: '초등학교 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/162/data/link2' },
      { label: '중·고등학교 문서', href: 'https://www.dbdbschool.kr/help/go_data/num/163/data/link2' },
    ],
  },
  {
    title: '담임 매뉴얼',
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/166/data/link2' }],
  },
  {
    title: '수강신청 전 필수 점검사항',
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/164/data/link2' }],
  },
  {
    title: '★ 월별 마감 및 다음 달 수강신청 준비 절차 ★',
    isHighlight: true,
    links: [{ label: '문서', href: 'https://www.dbdbschool.kr/help/go_data/num/165/data/link2' }],
  },
];

// ─────────────────────────────────────────────
// 4. FAQ 데이터 (12개 카테고리 / 41문항)
// ─────────────────────────────────────────────
const FAQ_DATA: FaqCategory[] = [
  {
    category: '학생관리',
    items: [
      { title: '학생 비밀번호를 초기화하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/89/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/89/data/link1' },
      { title: '로그인 화면에 번호가 다 출력되지 않아요', doc: 'https://www.dbdbschool.kr/help/go_data/num/154/data/link2' },
      { title: '학생 진급 처리는 어떻게 하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/61/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/90/data/link1' },
      { title: '1학년 학적이 나오지 않아 가학적으로 받고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/62/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/62/data/link1' },
      { title: '학생 학적이 중간에 변경되었는데 어떻게 반영하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/134/data/link2' },
      { title: '학생 학적을 일괄변경하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/135/data/link2' },
      { title: '다자녀 기능은 어떻게 활용하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/155/data/link2' },
      { title: '학생 성별 일괄 업데이트 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/156/data/link2' },
    ],
  },
  {
    category: '교직원관리',
    items: [
      { title: '추가로 서비스 관리자를 지정하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/70/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/70/data/link1' },
    ],
  },
  {
    category: '강사관리',
    items: [
      { title: '강사권한 설정(수강생 등록, 삭제, 수강료 입력)', doc: 'https://www.dbdbschool.kr/help/go_data/num/150/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/95/data/link1' },
      { title: '강사에게 강좌 등록 권한을 주고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/146/data/link2' },
      { title: '강사에게 전체 강좌 조회 권한을 주고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/149/data/link2' },
      { title: '강사가 바뀌었어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/148/data/link2' },
      { title: '강사 모바일 출결 문자 발송 기능 이용 안내', doc: 'https://www.dbdbschool.kr/help/go_data/num/151/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/151/data/link1' },
    ],
  },
  {
    category: '강좌관리',
    items: [
      { title: '강좌 일괄 입력', doc: 'https://www.dbdbschool.kr/help/go_data/num/92/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/92/data/link1' },
      { title: '강좌 일괄 수정 - 엑셀로 강좌 정보를 일괄수정하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/138/data/link2' },
      { title: '강좌 일괄 삭제 - 강좌를 한꺼번에 지우고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/158/data/link2' },
      { title: '강좌 통계 기능 - 강좌 마감 상태 확인을 위한 강좌통계 기능 활용하기', doc: 'https://www.dbdbschool.kr/help/go_data/num/93/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/93/data/link1' },
      { title: '강좌 상태 “출력, 종료, 대기” 이해하기', doc: 'https://www.dbdbschool.kr/help/go_data/num/159/data/link2' },
      {
        title: '정확한 강의시간 중복 체크 방법',
        extra: [{ label: '문서 (.hwp)', href: 'https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/after/%EA%B0%95%EC%A2%8C%EA%B4%80%EB%A6%AC_06_%EC%8B%9C%EA%B0%84%EC%A4%91%EB%B3%B5%20%EC%B2%B4%ED%81%AC.hwp' }],
      },
      { title: '수강료를 강사료와 수용비로 나눠 관리하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/44/data/link2' },
    ],
  },
  {
    category: '신청자 관리',
    items: [
      { title: '수강신청 테스트 - 수강신청에 문제가 없는지 테스트 하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/96/data/link1' },
      { title: '신청자 관리 등록 / 신청자를 미리 입력해 놓고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/171/data/link2' },
      { title: '신청자 관리 삭제 / 특정 강좌의 신청자를 모두 삭제하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/172/data/link2' },
      { title: '신청자 관리 이동 / 신청자를 다른 강좌로 옮기고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/174/data/link2' },
      { title: '신청자 관리 복사 / 신청자를 다른 강좌로 복사하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/175/data/link2' },
      { title: '신청자 통계 - 방과후학교를 수강한 학생수(단수)를 어디에서 확인하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/58/data/link2' },
      { title: '학생화면에 이전 강좌구분을 출력하지 않게하는 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/176/data/link2' },
    ],
  },
  {
    category: '자유수강권자 관리',
    items: [
      { title: '자유수강권자를 추가하고 개별 처리하는 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/94/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/94/data/link1' },
      { title: '자유수강권자를 환불하고 개별 처리하는 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/192/data/link2' },
      { title: '학생 자유수강권 잔액 조회 기능 활성화', doc: 'https://www.dbdbschool.kr/help/go_data/num/193/data/link2' },
    ],
  },
  {
    category: '스쿨뱅킹 & 나이스',
    items: [
      { title: '에듀파인 감면자(자유수강권자) 일괄입력 파일 다운로드', doc: 'https://www.dbdbschool.kr/help/go_data/num/169/data/link2' },
      { title: '에듀파인 개인부담금반환 입력용 파일 다운로드', doc: 'https://www.dbdbschool.kr/help/go_data/num/170/data/link2' },
      { title: '분기 접수, 월별 징수 처리 방법', doc: 'https://www.dbdbschool.kr/help/go_data/num/126/data/link2' },
      { title: '나이스 방과후학교 프로그램 수강생, 수강료 일괄입력 파일 다운로드', doc: 'https://www.dbdbschool.kr/help/go_data/num/97/data/link2', video: 'https://www.dbdbschool.kr/help/go_data/num/97/data/link1' },
    ],
  },
  {
    category: '환경설정',
    items: [
      { title: '학생 최대 신청 강좌수를 제한할 수 있나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/194/data/link2' },
      { title: '안내글 설정', doc: 'https://www.dbdbschool.kr/help/go_data/num/100/data/link2' },
    ],
  },
  {
    category: '알림관리',
    items: [
      { title: '알림 관리', doc: 'https://www.dbdbschool.kr/help/go_data/num/195/data/link2' },
    ],
  },
  {
    category: '모바일앱',
    items: [
      { title: '모바일 푸시 알림은 어떻게 등록하나요?', doc: 'https://www.dbdbschool.kr/help/go_data/num/167/data/link2' },
    ],
  },
  {
    category: '계약',
    items: [
      { title: '계약을 연장하고 싶어요', doc: 'https://www.dbdbschool.kr/help/go_data/num/160/data/link2' },
    ],
  },
  {
    category: '설문관리',
    items: [
      { title: '설문 참여율을 높이는 설문참여 안내 문자 발송하는 법', doc: 'https://www.dbdbschool.kr/help/go_data/num/47/data/link2' },
    ],
  },
];

// ─────────────────────────────────────────────
// 링크 배지 컴포넌트
// ─────────────────────────────────────────────
function DocBadge({ href, label = '문서' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold rounded shadow-2xs transition-colors shrink-0"
    >
      📄 {label}
    </a>
  );
}

function VideoBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-rose-500 hover:bg-rose-600 text-white text-[10.5px] font-bold rounded shadow-2xs transition-colors shrink-0"
    >
      ▶ 동영상
    </a>
  );
}

function DownloadBadge({ href, label = '다운로드' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded shadow-2xs transition-colors shrink-0"
    >
      ⬇ {label}
    </a>
  );
}

// ─────────────────────────────────────────────
// 메인 FAQ 컴포넌트
// ─────────────────────────────────────────────
export default function FaqPage({ params }: { params?: { school_id?: string } }) {
  const schoolId = params?.school_id || '3267';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('전체');

  // FAQ 검색 필터링
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.map((cat) => {
      const isCatMatch = selectedCat === '전체' || cat.category === selectedCat;
      if (!isCatMatch) return null;

      const matchedItems = cat.items.filter((item) => {
        if (!searchTerm.trim()) return true;
        return item.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
      });

      if (matchedItems.length === 0) return null;

      return {
        category: cat.category,
        items: matchedItems,
      };
    }).filter(Boolean) as FaqCategory[];
  }, [searchTerm, selectedCat]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── 1. 페이지 상단 헤더 ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-0.5 flex items-center gap-1.5">
              <span>광주풍향초등학교 늘봄학교</span>
              <span>(SN: {schoolId})</span>
              <span>&gt;</span>
              <span className="font-bold text-blue-600">안내 &amp; FAQ</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full" />
              매뉴얼 &amp; 자주 묻는 질문 (FAQ)
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/manual/af/manual_af.zip"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              download
            >
              📥 매뉴얼 다운로드 (.ZIP)
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PLA-pyXX5hMe9nkqFKeJKOCtGwlIVD2Ck2"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              ▶ 동영상 매뉴얼 전체보기
            </a>
          </div>
        </div>

        {/* ── 2. 안내 공지 배너 ── */}
        <div className="bg-amber-50/80 border border-amber-200/80 text-amber-900 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 shadow-xs">
          <span className="text-base">⚠️</span>
          <span>아래 매뉴얼 및 자주 묻는 질문을 먼저 확인하신 후 해결되지 않는 문의는 <strong>[고객지원 게시판]</strong>을 이용해 주시기 바랍니다.</span>
        </div>

        {/* ── 3. 상단 2열 그리드: 하단 박스와 동일한 폭(50% : 50% = grid-cols-1 md:grid-cols-2) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

          {/* [좌측: 수강신청 운영 절차 1 ~ 23] - 하단 박스와 동일한 50% 폭 */}
          <section className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-blue-300 transition-colors flex flex-col overflow-hidden">
            <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs" />
                📋 수강신청 운영 절차 (1 ~ 23단계)
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                23단계
              </span>
            </div>

            {/* 23단계 목록 리스트 (컴팩트 스크롤 영역) */}
            <div className="p-2.5 divide-y divide-slate-50 space-y-0.5 max-h-[360px] overflow-y-auto grow">
              {PROCEDURES.map((item) => (
                <div
                  key={item.num}
                  className="py-1.5 px-1 flex items-center justify-between gap-2 hover:bg-slate-50/60 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-extrabold shrink-0">
                      {item.num}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate" title={item.title}>
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.doc && <DocBadge href={item.doc} />}
                    {item.video && <VideoBadge href={item.video} />}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* [우측: 양식 & 매뉴얼 다운로드] - 하단 박스와 동일한 50% 폭 */}
          <div className="flex flex-col justify-between gap-4">

            {/* 1. 양식 다운로드 카드 */}
            <section className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-emerald-300 transition-colors flex flex-col overflow-hidden grow">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-emerald-600 rounded-xs" />
                  📂 양식 다운로드
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {FORMS.length}건
                </span>
              </div>
              <div className="p-2.5 divide-y divide-slate-50 space-y-0.5 grow flex flex-col justify-around">
                {FORMS.map((form, idx) => (
                  <div key={idx} className="py-1.5 px-1 flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-800 truncate" title={form.title}>
                      {form.title}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {form.links.map((lk, li) => {
                        if (lk.label.includes('동영상')) return <VideoBadge key={li} href={lk.href} />;
                        if (lk.label.includes('다운로드')) return <DownloadBadge key={li} href={lk.href} />;
                        return <DocBadge key={li} href={lk.href} label={lk.label} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. 매뉴얼 다운로드 카드 */}
            <section className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-indigo-300 transition-colors flex flex-col overflow-hidden grow">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-xs" />
                  📘 매뉴얼 다운로드
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {MANUALS.length}건
                </span>
              </div>
              <div className="p-2.5 divide-y divide-slate-50 space-y-0.5 grow flex flex-col justify-around">
                {MANUALS.map((man, idx) => (
                  <div key={idx} className="py-1 px-1 flex items-center justify-between gap-2">
                    <div
                      className={`text-xs font-semibold truncate ${
                        man.isHighlight ? 'text-rose-600 font-bold' : 'text-slate-800'
                      }`}
                      title={man.title}
                    >
                      {man.title}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {man.links.map((lk, li) => {
                        if (lk.label.includes('동영상')) return <VideoBadge key={li} href={lk.href} />;
                        return <DocBadge key={li} href={lk.href} label={lk.label} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* ── 4. 하단 섹션 : 자주하는 질문 (FAQ) ── */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <h2 className="text-base md:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-5 bg-sky-600 rounded-full" />
                ❓ 자주하는 질문 (FAQ)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                분야별 12개 카테고리의 핵심 매뉴얼과 해결책을 확인하실 수 있습니다.
              </p>
            </div>

            {/* 검색 & 카테고리 필터 */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="전체">전체 분류</option>
                {FAQ_DATA.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="FAQ 키워드 검색..."
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg w-48 md:w-56 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              {(searchTerm || selectedCat !== '전체') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCat('전체');
                  }}
                  className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* 카테고리 2열 카드 그리드 (동일한 50% : 50% = grid-cols-1 md:grid-cols-2) */}
          {filteredFaqs.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs md:text-sm">
              검색 조건에 일치하는 자주하는 질문(FAQ) 항목이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaqs.map((cat) => (
                <div
                  key={cat.category}
                  className="border border-slate-200/90 rounded-xl bg-white shadow-2xs hover:border-blue-300 transition-colors flex flex-col overflow-hidden"
                >
                  {/* 카테고리 헤더 */}
                  <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs" />
                      {cat.category}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.2 rounded-full">
                      {cat.items.length}건
                    </span>
                  </div>

                  {/* 문항 목록 */}
                  <div className="p-2.5 divide-y divide-slate-50 space-y-0.5 grow">
                    {cat.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-1.5 px-1 flex items-center justify-between gap-2 hover:bg-slate-50/60 rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 text-xs text-slate-700">
                          <span className="text-blue-500 font-bold">·</span>
                          <span className="font-medium truncate" title={item.title}>{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.doc && <DocBadge href={item.doc} />}
                          {item.video && <VideoBadge href={item.video} />}
                          {item.extra?.map((lk, li) => (
                            lk.label.includes('동영상') ? (
                              <VideoBadge key={li} href={lk.href} />
                            ) : lk.label.includes('다운로드') ? (
                              <DownloadBadge key={li} href={lk.href} />
                            ) : (
                              <DocBadge key={li} href={lk.href} label={lk.label} />
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 5. 푸터 ── */}
        <footer className="text-center text-xs text-slate-400 py-3">
          Copyright ⓒ{' '}
          <a
            href="http://www.xmecca.com"
            target="_blank"
            rel="noreferrer"
            className="font-bold underline hover:text-slate-600"
          >
            xmecca.com
          </a>{' '}
          All Rights Reserved. &nbsp;|&nbsp; dbdbschool@naver.com
        </footer>

      </div>
    </div>
  );
}
