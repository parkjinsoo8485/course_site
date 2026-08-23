export interface ServicePlanItem {
  id: string;
  serviceName: string;
  serviceUrl: string;
  period: string;
  qrCodeUrl?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface TeacherMember {
  id: string;
  seq: number;
  userId: string;
  name: string;
  phone: string;
  note?: string;
  homeroom?: string;
  position: string;
  lastLogin?: string;
  tempPassword?: 'Y' | 'N';
  identityVerified?: 'Y' | 'N';
  twoFactorAuth?: 'Y' | 'N';
  termsAgreedDate?: string;
  status: '사용' | '중지';
}

export interface TeacherFieldConfig {
  phone: boolean;
  position: boolean;
  birthdate: boolean;
  neisNumber: boolean;
}

export interface PositionCode {
  id: string;
  seq: number;
  use: boolean;
  codeName: string;
  displayOrder: number;
}

export interface StudentMember {
  id: string;
  seq: number;
  grade: number;
  classNum: number;
  studentNum: number;
  name: string;
  gender: '남' | '여';
  phone: string;
  note?: string;
  previousAcademicRecord?: string;
  lastModified?: string;
  lastLogin?: string;
  tempPassword?: 'Y' | 'N';
  termsAgreedDate?: string;
  status: '사용' | '중지';
}

export interface StudentBasicConfig {
  multiChildLoginShare: boolean;
  maxGrade: number;
  maxClass: number;
  maxStudentNum: number;
}

export interface StudentFieldConfig {
  studentPhone: { display: boolean; required: boolean };
  guardianName: { display: boolean; required: boolean };
  guardianPhone: { display: boolean; required: boolean };
  gender: { display: boolean; required: boolean };
}

export interface StudentCourseCode {
  id: string;
  seq: number;
  use: boolean;
  codeName: string;
  displayOrder: number;
}

export interface SmsSenderNumber {
  id: string;
  seq: number;
  senderNumber: string;
  ownerName: string;
  authMethod: '통신사 증명서' | '휴대폰 인증' | '재직증명서';
  category: '대표번호' | '일반' | '긴급';
  note?: string;
  status: '승인완료' | '승인대기' | '반려';
  approvedDate?: string;
}

export interface SmsChargeRequest {
  id: string;
  seq: number;
  amount: number; // 원
  count: number; // 건
  estimateDocUrl?: string;
  approvalStatus: '품의완료' | '품의대기' | '미품의';
  status: '충전완료' | '입금대기' | '취소';
  requestDate: string;
}

export interface SmsChargeHistory {
  id: string;
  seq: number;
  count: number;
  chargeType: '유료충전' | '관리자충전' | '이벤트' | '보상';
  note: string;
  processType: '충전완료' | '환불';
  processDate: string;
}

export interface SmsDailyReport {
  id: string;
  seq: number;
  sendDate: string;
  sms: {
    success: number;
    fail: number;
    total: number;
  };
  lms: {
    success: number;
    fail: number;
    total: number;
  };
  deduction: {
    deducted: number;
    recharged: number;
    total: number;
  };
}

export interface AdminAuthPermission {
  id: string;
  serviceName: string;
  adminId: string;
  adminName: string;
  canManageTeachers: boolean;
  canManageStudents: boolean;
  canManageSms: boolean;
}

export interface PrivacyAccessLog {
  id: string;
  seq: number;
  service: string;
  userId: string;
  userGroup: string;
  ipAddress: string;
  accessTime: string;
  action: string;
}
