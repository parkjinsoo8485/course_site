/**
 * Q&A Customer Support Data Schema
 * Extracted from Playwright inspection of https://www.dbdbschool.kr/af/qanda/lists/sn/3267
 */

export interface QnaFileItem {
  id: string;
  name: string;
  size?: number;
  url?: string;
  ext?: string;
}

export type QnaStatusType = '0' | '1' | '2' | '3'; // 0: 접수, 1: 처리중, 2: 완료, 3: 답변완료

export interface QnaItem {
  num: number;
  id: string;
  schoolId: string;
  authorName: string; // w_name (예: 김혜련)
  hp1: string; // 010
  hp2: string; // 2494
  hp3: string; // 1479
  phone: string; // w_tel (예: 062-609-1182)
  email: string; // w_email (예: khh147979@naver.com)
  subject: string; // 제목
  contents: string; // w_contents
  files?: QnaFileItem[]; // 첨부파일
  status: QnaStatusType; // 0: 접수, 1: 처리중, 2: 완료, 3: 답변완료
  statusText: '접수' | '처리중' | '완료' | '답변완료';
  statusColor: string; // 접수(#475569), 처리중(#2563EB), 완료(#EB9316), 답변완료(#16A34A)
  createdAt: string; // 2026-06-01
  answerDate?: string; // 06/01
  answerContent?: string; // 관리자/고객센터 답변 내용
  updateManagerInfo?: boolean; // chk_update
}

export interface QnaFilterParams {
  as?: string; // all, 0, 1, 2, 3
  st?: 'sub_con' | 'subject' | 'contents';
  sw?: string; // 검색어
}
