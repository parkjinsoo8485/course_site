'use client';

import React, { useState, useMemo } from 'react';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminFilterBar } from '@/components/admin/AdminFilterBar';
import { AdminPagination } from '@/components/admin/AdminPagination';

// ─────────────────────────────────────────────
// 1. 데이터 타입 정의
// ─────────────────────────────────────────────
export interface LinkItem {
  label: string;
  href: string;
}

export interface ProcedureItem {
  num: number;
  title: string;
  doc?: string;
  video?: string;
}

export interface FaqItem {
  id: string;
  category: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  hasAttachment: boolean;
  attachmentName?: string;
  doc?: string;
  video?: string;
  content?: string;
  extra?: LinkItem[];
}

// ─────────────────────────────────────────────
// 2. 수강신청 운영 절차 데이터 (23단계)
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
// 3. 양식 다운로드 데이터
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
// 4. 매뉴얼 다운로드 데이터
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
// 5. FAQ Mock 데이터 (테이블 & 필터링용 20개 실전 문항)
// ─────────────────────────────────────────────
const FAQ_MOCK_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: '학생관리',
    title: '학생 비밀번호를 초기화하고 싶어요',
    author: '시스템관리자',
    createdAt: '2026-08-10',
    views: 432,
    hasAttachment: true,
    attachmentName: '학생_비밀번호_초기화_매뉴얼.pdf',
    doc: 'https://www.dbdbschool.kr/help/go_data/num/89/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/89/data/link1',
    content: '### 학생 비밀번호 초기화 절차\n1. [학생관리 > 학생목록] 메뉴로 이동합니다.\n2. 비밀번호를 초기화할 학생을 선택 후 [비밀번호 초기화] 버튼을 클릭합니다.\n3. 초기 비밀번호는 학생 생년월일 6자리(YYMMDD)로 리셋됩니다.'
  },
  {
    id: 'faq-2',
    category: '학생관리',
    title: '로그인 화면에 번호가 다 출력되지 않아요',
    author: '방과후전담',
    createdAt: '2026-08-08',
    views: 290,
    hasAttachment: false,
    doc: 'https://www.dbdbschool.kr/help/go_data/num/154/data/link2',
    content: '### 학급별 번호 노출 설정\n- 환경설정 > 기본설정에서 각 학년/반의 최대 번호(최대 인원)를 설정하면 번호 선택 드롭다운에 모두 표시됩니다.'
  },
  {
    id: 'faq-3',
    category: '학생관리',
    title: '학생 진급 처리는 어떻게 하나요?',
    author: '늘봄지원실',
    createdAt: '2026-08-05',
    views: 512,
    hasAttachment: true,
    attachmentName: '신학년_진급처리_지침.hwp',
    doc: 'https://www.dbdbschool.kr/help/go_data/num/61/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/90/data/link1',
    content: '### 신학년도 진급 처리 방법\n- 나이스 학적 데이터를 엑셀 다운로드 후 [학생관리 > 일괄등록]에서 진급 학년/반으로 덮어쓰기 업로드합니다.'
  },
  {
    id: 'faq-4',
    category: '강사관리',
    title: '강사권한 설정 (수강생 등록, 삭제, 수강료 입력)',
    author: '행정실장',
    createdAt: '2026-08-02',
    views: 380,
    hasAttachment: true,
    attachmentName: '강사권한_부여_가이드.pdf',
    doc: 'https://www.dbdbschool.kr/help/go_data/num/150/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/95/data/link1',
    content: '### 강사별 편집/조회 권한 설정\n- 강사관리 메뉴에서 각 강사의 출석부 입력, 수강생 관리, 수강료 입력 권한을 개별 On/Off 할 수 있습니다.'
  },
  {
    id: 'faq-5',
    category: '강사관리',
    title: '강사 모바일 출결 문자 발송 기능 이용 안내',
    author: '늘봄지원실',
    createdAt: '2026-07-30',
    views: 340,
    hasAttachment: false,
    doc: 'https://www.dbdbschool.kr/help/go_data/num/151/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/151/data/link1',
    content: '### 모바일 출결 알림톡/SMS 발송\n- 강사가 수업 시작/종료 시 모바일 웹에서 출석 체크하면 학부모 안심알리미 문자가 즉시 자동 발송됩니다.'
  },
  {
    id: 'faq-6',
    category: '강좌관리',
    title: '강좌 일괄 입력 (23개 표준 컬럼 엑셀 서식)',
    author: '방과후전담',
    createdAt: '2026-07-28',
    views: 620,
    hasAttachment: true,
    attachmentName: '강좌일괄등록_23컬럼_표준서식.xlsx',
    doc: 'https://www.dbdbschool.kr/help/go_data/num/92/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/92/data/link1',
    content: '### 23컬럼 표준 엑셀 업로드\n- 강좌명, 강사ID, 정원, 요일, 교시, 수강료, 재료비 등을 엑셀로 한 번에 등록합니다.'
  },
  {
    id: 'faq-7',
    category: '강좌관리',
    title: '정확한 강의시간 중복 체크 방법',
    author: '시스템관리자',
    createdAt: '2026-07-25',
    views: 440,
    hasAttachment: true,
    attachmentName: '강좌관리_06_시간중복_체크.hwp',
    doc: 'https://s3-ap-northeast-2.amazonaws.com/www.dbdbschool.kr/doc/faq/after/%EA%B0%95%EC%A2%8C%EA%B4%80%EB%A6%AC_06_%EC%8B%9C%EA%B0%84%EC%A4%91%EB%B3%B5%20%EC%B2%B4%ED%81%AC.hwp',
    content: '### 시간표 중복 방지 로직\n- 동일 요일/교시 강좌 간 학생의 중복 수강 신청을 시스템에서 실시간 감지하여 차단합니다.'
  },
  {
    id: 'faq-8',
    category: '신청자 관리',
    title: '수강신청 테스트 - 수강신청에 문제가 없는지 테스트 하고 싶어요',
    author: '교무부장',
    createdAt: '2026-07-20',
    views: 315,
    hasAttachment: false,
    doc: 'https://www.dbdbschool.kr/help/go_data/num/76/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/96/data/link1',
    content: '### 관리자 수강신청 시뮬레이션 모드\n- 실제 학생 계정으로 로그인하여 신청 시간 제한 없이 수강신청 정상 접수 여부를 점검합니다.'
  },
  {
    id: 'faq-9',
    category: '자유수강권자 관리',
    title: '자유수강권자를 추가하고 개별 처리하는 방법',
    author: '행정실장',
    createdAt: '2026-07-18',
    views: 270,
    hasAttachment: false,
    doc: 'https://www.dbdbschool.kr/help/go_data/num/94/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/94/data/link1',
    content: '### 1인당 연간 지원한도 및 차감\n- 학생별 지원금 잔액 범위 내에서 수강료가 자동 감면 처리됩니다.'
  },
  {
    id: 'faq-10',
    category: '스쿨뱅킹 & 나이스',
    title: '나이스 방과후학교 프로그램 수강생, 수강료 일괄입력 파일 다운로드',
    author: '행정실장',
    createdAt: '2026-07-15',
    views: 580,
    hasAttachment: true,
    attachmentName: 'NEIS_나이스_수납집계_연동서식.xlsx',
    doc: 'https://www.dbdbschool.kr/help/go_data/num/97/data/link2',
    video: 'https://www.dbdbschool.kr/help/go_data/num/97/data/link1',
    content: '### 나이스/에듀파인 엑셀 변환\n- 나이스 양식에 맞춰 수강생 및 징수 금액을 에듀파인 수납 엑셀로 자동 변환 추출합니다.'
  },
  {
    id: 'faq-11',
    category: '스쿨뱅킹 & 나이스',
    title: '에듀파인 감면자(자유수강권자) 일괄입력 파일 다운로드',
    author: '시스템관리자',
    createdAt: '2026-07-12',
    views: 390,
    hasAttachment: true,
    attachmentName: '에듀파인_감면자_일괄서식.xlsx',
    doc: 'https://www.dbdbschool.kr/help/go_data/num/169/data/link2',
    content: '### 에듀파인 감면자 일괄입력 서식\n- 나이스/에듀파인 설정 메뉴의 납입금명 기준으로 감면자 목록을 일괄 추출합니다.'
  },
  {
    id: 'faq-12',
    category: '환경설정',
    title: '학생 최대 신청 강좌수를 제한할 수 있나요?',
    author: '교무부장',
    createdAt: '2026-07-10',
    views: 260,
    hasAttachment: false,
    doc: 'https://www.dbdbschool.kr/help/go_data/num/194/data/link2',
    content: '### 중복제한그룹 및 최대 신청 수 설정\n- 학생 1인당 신청 가능한 강좌 수를 지정하여 특정 인기 강좌 독점을 방지합니다.'
  }
];

const CATEGORIES = [
  '전체',
  '학생관리',
  '강사관리',
  '강좌관리',
  '신청자 관리',
  '자유수강권자 관리',
  '스쿨뱅킹 & 나이스',
  '환경설정',
  '알림관리',
  '모바일앱',
  '계약',
  '설문관리'
];

// ─────────────────────────────────────────────
// 6. 링크 배지 컴포넌트
// ─────────────────────────────────────────────
function DocBadge({ href, label = '문서' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
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
      onClick={(e) => e.stopPropagation()}
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
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded shadow-2xs transition-colors shrink-0"
    >
      ⬇ {label}
    </a>
  );
}

// ─────────────────────────────────────────────
// 7. 메인 FAQ 컴포넌트 (AdminTable + AdminFilterBar + AdminPagination)
// ─────────────────────────────────────────────
export default function FaqPage({ params }: { params?: { school_id?: string } }) {
  const schoolId = params?.school_id || '3267';

  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalItem, setActiveModalItem] = useState<FaqItem | null>(null);

  const PAGE_SIZE = 7;

  // 검색 & 카테고리 필터링
  const filteredData = useMemo(() => {
    return FAQ_MOCK_LIST.filter((item) => {
      const matchCat = selectedCategory === '전체' || item.category === selectedCategory;
      const kw = submittedSearch.toLowerCase().trim();
      const matchKw =
        !kw ||
        item.title.toLowerCase().includes(kw) ||
        item.author.toLowerCase().includes(kw) ||
        (item.content && item.content.toLowerCase().includes(kw));
      return matchCat && matchKw;
    });
  }, [selectedCategory, submittedSearch]);

  // 페이지네이션 슬라이싱
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedCategory('전체');
    setSearchTerm('');
    setSubmittedSearch('');
    setCurrentPage(1);
  };

  // AdminTable 컬럼 정의
  const columns: Column<FaqItem>[] = [
    {
      key: 'id',
      label: '번호',
      width: '56px',
      align: 'center',
      render: (_, index) => (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      key: 'category',
      label: '분류',
      width: '120px',
      align: 'center',
      render: (item) => (
        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-bold">
          {item.category}
        </span>
      ),
    },
    {
      key: 'title',
      label: '제목',
      align: 'left',
      render: (item) => (
        <div className="flex items-center justify-between gap-2 py-0.5">
          <span className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
            {item.title}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {item.doc && <DocBadge href={item.doc} />}
            {item.video && <VideoBadge href={item.video} />}
          </div>
        </div>
      ),
    },
    {
      key: 'hasAttachment',
      label: '첨부',
      width: '50px',
      align: 'center',
      render: (item) => (item.hasAttachment ? '💾' : '-'),
    },
    {
      key: 'author',
      label: '작성자',
      width: '90px',
      align: 'center',
    },
    {
      key: 'createdAt',
      label: '작성일',
      width: '95px',
      align: 'center',
    },
    {
      key: 'views',
      label: '조회수',
      width: '70px',
      align: 'right',
      render: (item) => item.views.toLocaleString(),
    },
  ];

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

        {/* ── 3. 상단 2열 대칭 그리드 (50% : 50%) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

          {/* [좌측: 수강신청 운영 절차 1 ~ 23] */}
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

            <div className="p-2.5 divide-y divide-slate-50 space-y-0.5">
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

          {/* [우측: 양식 & 매뉴얼 다운로드] */}
          <div className="flex flex-col justify-between gap-4">

            {/* 양식 다운로드 카드 */}
            <section className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-emerald-300 transition-colors flex flex-col overflow-hidden">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-emerald-600 rounded-xs" />
                  📂 양식 다운로드
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {FORMS.length}건
                </span>
              </div>
              <div className="p-2.5 divide-y divide-slate-50 space-y-0.5">
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

            {/* 매뉴얼 다운로드 카드 */}
            <section className="bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-indigo-300 transition-colors flex flex-col overflow-hidden">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-xs" />
                  📘 매뉴얼 다운로드
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {MANUALS.length}건
                </span>
              </div>
              <div className="p-2.5 divide-y divide-slate-50 space-y-0.5">
                {MANUALS.map((man, idx) => (
                  <div key={idx} className="py-1.5 px-1 flex items-center justify-between gap-2">
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

        {/* ── 4. 하단 섹션: 자주하는 질문 (AdminFilterBar + AdminTable + AdminPagination) ── */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-3">
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-5 bg-sky-600 rounded-full" />
              ❓ 자주하는 질문 (FAQ) 데이터 그리드
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              공식 매뉴얼 및 분야별 12개 카테고리의 주요 FAQ 항목을 검색하고 조회할 수 있습니다.
            </p>
          </div>

          {/* 공통 필터바 (AdminFilterBar) */}
          <AdminFilterBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onReset={handleReset}
            totalCount={filteredData.length}
          />

          {/* 공통 테이블 컴포넌트 (AdminTable) */}
          <AdminTable<FaqItem>
            columns={columns}
            data={pagedData}
            onRowClick={(item) => setActiveModalItem(item)}
            emptyMessage="조건에 해당하는 FAQ / 매뉴얼 항목이 없습니다."
          />

          {/* 공통 페이지네이션 (AdminPagination) */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>

        {/* ── 5. 상세 모달 (Row Click 시 상세 지침 확인) ── */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
              <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>📖</span> [{activeModalItem.category}] {activeModalItem.title}
                </h3>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                <div className="flex justify-between border-b border-slate-100 pb-2 text-xs text-slate-500">
                  <span>작성자: <strong>{activeModalItem.author}</strong></span>
                  <span>작성일: <strong>{activeModalItem.createdAt}</strong></span>
                  <span>조회수: <strong>{activeModalItem.views.toLocaleString()}</strong></span>
                </div>

                {activeModalItem.attachmentName && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">📎 첨부: {activeModalItem.attachmentName}</span>
                    <button
                      onClick={() => alert(`파일 [${activeModalItem.attachmentName}] 다운로드가 시작됩니다.`)}
                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded font-bold text-slate-700 text-[11px]"
                    >
                      다운로드
                    </button>
                  </div>
                )}

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap font-mono text-xs">
                  {activeModalItem.content || '등록된 상세 지침 내용이 없습니다.'}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {activeModalItem.doc && <DocBadge href={activeModalItem.doc} label="공식 매뉴얼 문서 열기" />}
                  {activeModalItem.video && <VideoBadge href={activeModalItem.video} />}
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. 푸터 ── */}
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