export type PaymentStatusType = '결제완료' | '결제대기' | '무상' | '지원금 수령' | '환불완료' | '취소';
export type ApplicantStatusType = '승인' | '신청대기' | '취소' | '환불';
export type SubsidyType = '일반 자부담' | '자유수강권' | '늘봄 지원금' | '늘봄 무상지원' | '다자녀 지원';

export interface ApplicantItem {
  id: string;
  schoolId: string;
  studentName: string;
  gradeClass: string; // 예: 1학년 2반
  studentNum?: string; // 번호 예: 14
  parentPhone: string;
  courseId: string;
  courseTitle: string;
  instructorName?: string;
  appliedAt: string; // 'YYYY-MM-DD HH:mm'
  subsidyType: SubsidyType;
  tuitionFee: number; // 수강료 (기본)
  instructorFee?: number; // 강사료 (80%)
  facilityFee?: number; // 수용비 (20%)
  materialFee?: number; // 교재/재료비
  totalFee?: number; // 총 결제/수납액
  paymentStatus: PaymentStatusType;
  status: ApplicantStatusType;
  schoolBankingAccount?: string; // 스쿨뱅킹 계좌번호
  bankName?: string;
  depositorName?: string; // 예금주
  memo?: string;
}

export interface ApplicantFilterOptions {
  category?: string;
  courseId?: string;
  grade?: string;
  paymentStatus?: string;
  status?: string;
  keyword?: string;
}

export interface ApplicantSummaryStats {
  totalCount: number;
  approvedCount: number;
  waitingCount: number;
  canceledCount: number;
  totalTuitionFee: number;
  totalMaterialFee: number;
  totalCollectedFee: number;
}
