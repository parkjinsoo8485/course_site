'use client';

import { create } from 'zustand';
import {
  ServicePlanItem,
  TeacherMember,
  TeacherFieldConfig,
  PositionCode,
  StudentMember,
  StudentBasicConfig,
  StudentFieldConfig,
  StudentCourseCode,
  SmsSenderNumber,
  SmsChargeRequest,
  SmsChargeHistory,
  SmsDailyReport,
  AdminAuthPermission,
  PrivacyAccessLog,
} from '@/types/sczigi';

interface SczigiState {
  // Service Plan
  services: ServicePlanItem[];

  // Teacher Management
  teachers: TeacherMember[];
  teacherFieldConfig: TeacherFieldConfig;
  positionCodes: PositionCode[];

  // Student Management
  students: StudentMember[];
  studentBasicConfig: StudentBasicConfig;
  studentFieldConfig: StudentFieldConfig;
  studentCourseCodes: StudentCourseCode[];

  // SMS Management
  smsSenders: SmsSenderNumber[];
  smsChargeRequests: SmsChargeRequest[];
  smsChargeHistories: SmsChargeHistory[];
  smsDailyReports: SmsDailyReport[];

  // Auth & Privacy Log
  adminAuthPermissions: AdminAuthPermission[];
  privacyLogs: PrivacyAccessLog[];

  // Actions - Teacher
  addTeacher: (teacher: Omit<TeacherMember, 'id' | 'seq'>) => void;
  updateTeacher: (id: string, updates: Partial<TeacherMember>) => void;
  deleteTeacher: (id: string) => void;
  updateTeacherFieldConfig: (config: Partial<TeacherFieldConfig>) => void;
  addPositionCode: (codeName: string) => void;
  updatePositionCode: (id: string, updates: Partial<PositionCode>) => void;
  deletePositionCode: (id: string) => void;
  clearTeacherData: (type: 'fields' | 'members' | 'homeroom' | 'all') => void;

  // Actions - Student
  addStudent: (student: Omit<StudentMember, 'id' | 'seq'>) => void;
  updateStudent: (id: string, updates: Partial<StudentMember>) => void;
  deleteStudent: (id: string) => void;
  promoteStudents: (gradeIncrement: number) => void;
  updateStudentBasicConfig: (config: Partial<StudentBasicConfig>) => void;
  updateStudentFieldConfig: (config: Partial<StudentFieldConfig>) => void;
  addStudentCourseCode: (codeName: string) => void;
  updateStudentCourseCode: (id: string, updates: Partial<StudentCourseCode>) => void;
  deleteStudentCourseCode: (id: string) => void;
  clearStudentData: (type: 'fields' | 'password' | 'members' | 'courses' | 'all') => void;

  // Actions - SMS
  addSmsSender: (sender: Omit<SmsSenderNumber, 'id' | 'seq' | 'status' | 'approvedDate'>) => void;
  cancelSmsSender: (id: string) => void;
  addSmsChargeRequest: (amount: number, count: number) => void;
  cancelSmsChargeRequest: (id: string) => void;

  // Actions - Auth & Log
  updateAdminAuthPermission: (id: string, updates: Partial<AdminAuthPermission>) => void;
  addPrivacyLog: (action: string, service?: string) => void;
}

export const useSczigiStore = create<SczigiState>((set, get) => ({
  // Service Plan List
  services: [
    {
      id: 'srv_3267_1',
      serviceName: '늘봄학교',
      serviceUrl: 'https://www.dbdbschool.kr/go/ai/0hc5dFL',
      period: '2025-05-09 ~ 2027-02-28',
      status: 'active',
    },
  ],

  // Teachers
  teachers: [
    {
      id: 't_3',
      seq: 3,
      userId: '김혜련',
      name: '김혜련',
      phone: '010-2494-1479',
      note: '관리자',
      homeroom: '',
      position: '늘봄실무사',
      lastLogin: '2026-08-17 11:32:00',
      tempPassword: 'Y',
      identityVerified: 'Y',
      twoFactorAuth: 'N',
      termsAgreedDate: '-',
      status: '사용',
    },
    {
      id: 't_2',
      seq: 2,
      userId: '박진수',
      name: '박진수',
      phone: '010-9876-5432',
      note: '실장',
      homeroom: '',
      position: '늘봄지원실장',
      lastLogin: '2025-09-11 14:29:19',
      tempPassword: 'N',
      identityVerified: 'Y',
      twoFactorAuth: 'Y',
      termsAgreedDate: '2025-09-11',
      status: '사용',
    },
    {
      id: 't_1',
      seq: 1,
      userId: '풍향초',
      name: '풍향초',
      phone: '062-609-1182',
      note: '',
      homeroom: '1학년 1반',
      position: '교직원',
      lastLogin: '2026-04-24 11:40:16',
      tempPassword: 'N',
      identityVerified: 'N',
      twoFactorAuth: 'N',
      termsAgreedDate: '2026-04-24',
      status: '사용',
    },
  ],

  teacherFieldConfig: {
    phone: true,
    position: true,
    birthdate: false,
    neisNumber: true,
  },

  positionCodes: [
    { id: 'pos_1', seq: 1, use: true, codeName: '교장', displayOrder: 1 },
    { id: 'pos_2', seq: 2, use: true, codeName: '교감', displayOrder: 2 },
    { id: 'pos_3', seq: 3, use: true, codeName: '늘봄지원실장', displayOrder: 3 },
    { id: 'pos_4', seq: 4, use: true, codeName: '늘봄실무사', displayOrder: 4 },
    { id: 'pos_5', seq: 5, use: true, codeName: '교직원', displayOrder: 5 },
    { id: 'pos_6', seq: 6, use: true, codeName: '방과후강사', displayOrder: 6 },
  ],

  // Students
  students: [
    {
      id: 's_1',
      seq: 1,
      grade: 1,
      classNum: 1,
      studentNum: 1,
      name: '김민준',
      gender: '남',
      phone: '010-1234-5678',
      note: '보호자: 김철수 (010-1111-2222)',
      previousAcademicRecord: '신입학',
      lastModified: '2026-03-02 09:00:00',
      lastLogin: '2026-08-16 17:20:10',
      tempPassword: 'N',
      termsAgreedDate: '2026-03-02',
      status: '사용',
    },
    {
      id: 's_2',
      seq: 2,
      grade: 1,
      classNum: 1,
      studentNum: 2,
      name: '이서아',
      gender: '여',
      phone: '010-2345-6789',
      note: '보호자: 이미영 (010-3333-4444)',
      previousAcademicRecord: '신입학',
      lastModified: '2026-03-02 09:10:00',
      lastLogin: '2026-08-15 14:12:30',
      tempPassword: 'N',
      termsAgreedDate: '2026-03-02',
      status: '사용',
    },
    {
      id: 's_3',
      seq: 3,
      grade: 2,
      classNum: 1,
      studentNum: 15,
      name: '박도현',
      gender: '남',
      phone: '010-3456-7890',
      note: '보호자: 박성훈 (010-5555-6666)',
      previousAcademicRecord: '1학년 1반 14번',
      lastModified: '2026-03-03 10:00:00',
      lastLogin: '2026-08-14 18:40:00',
      tempPassword: 'N',
      termsAgreedDate: '2025-03-02',
      status: '사용',
    },
    {
      id: 's_4',
      seq: 4,
      grade: 3,
      classNum: 2,
      studentNum: 8,
      name: '최지우',
      gender: '여',
      phone: '010-4567-8901',
      note: '보호자: 최진영 (010-7777-8888)',
      previousAcademicRecord: '2학년 2반 8번',
      lastModified: '2026-03-03 10:30:00',
      lastLogin: '2026-08-10 11:20:00',
      tempPassword: 'N',
      termsAgreedDate: '2024-03-02',
      status: '사용',
    },
  ],

  studentBasicConfig: {
    multiChildLoginShare: true,
    maxGrade: 6,
    maxClass: 10,
    maxStudentNum: 35,
  },

  studentFieldConfig: {
    studentPhone: { display: true, required: false },
    guardianName: { display: true, required: true },
    guardianPhone: { display: true, required: true },
    gender: { display: true, required: true },
  },

  studentCourseCodes: [
    { id: 'sc_1', seq: 1, use: true, codeName: '일반과정', displayOrder: 1 },
    { id: 'sc_2', seq: 2, use: true, codeName: '특수교육대상', displayOrder: 2 },
    { id: 'sc_3', seq: 3, use: true, codeName: '늘봄연계과정', displayOrder: 3 },
  ],

  // SMS
  smsSenders: [
    {
      id: 'sms_1',
      seq: 1,
      senderNumber: '062-609-1182',
      ownerName: '광주풍향초등학교',
      authMethod: '통신사 증명서',
      category: '대표번호',
      note: '행정실 대표 발신번호',
      status: '승인완료',
      approvedDate: '2025-05-10',
    },
    {
      id: 'sms_2',
      seq: 2,
      senderNumber: '062-609-1180',
      ownerName: '광주풍향초등학교',
      authMethod: '통신사 증명서',
      category: '일반',
      note: '늘봄교실 전용 발신번호',
      status: '승인완료',
      approvedDate: '2025-06-01',
    },
  ],

  smsChargeRequests: [
    {
      id: 'req_1',
      seq: 1,
      amount: 100000,
      count: 5000,
      estimateDocUrl: '/docs/estimate_3267_1.pdf',
      approvalStatus: '품의완료',
      status: '충전완료',
      requestDate: '2026-05-10',
    },
  ],

  smsChargeHistories: [
    {
      id: 'chg_1',
      seq: 1,
      count: 5000,
      chargeType: '유료충전',
      note: '2026년도 상반기 늘봄/방과후 문자 발송 예산 충전',
      processType: '충전완료',
      processDate: '2026-05-10 15:30:20',
    },
    {
      id: 'chg_2',
      seq: 2,
      count: 300,
      chargeType: '이벤트',
      note: '시스템 오픈 기념 무상 지원 충전',
      processType: '충전완료',
      processDate: '2025-05-09 10:00:00',
    },
  ],

  smsDailyReports: [
    {
      id: 'rep_1',
      seq: 1,
      sendDate: '2026-08-16',
      sms: { success: 120, fail: 2, total: 122 },
      lms: { success: 45, fail: 0, total: 45 },
      deduction: { deducted: 165, recharged: 2, total: 167 },
    },
    {
      id: 'rep_2',
      seq: 2,
      sendDate: '2026-08-15',
      sms: { success: 98, fail: 1, total: 99 },
      lms: { success: 30, fail: 0, total: 30 },
      deduction: { deducted: 128, recharged: 1, total: 129 },
    },
    {
      id: 'rep_3',
      seq: 3,
      sendDate: '2026-08-14',
      sms: { success: 210, fail: 5, total: 215 },
      lms: { success: 80, fail: 1, total: 81 },
      deduction: { deducted: 290, recharged: 6, total: 296 },
    },
  ],

  adminAuthPermissions: [
    {
      id: 'auth_1',
      serviceName: '늘봄학교',
      adminId: '김혜련',
      adminName: '김혜련',
      canManageTeachers: true,
      canManageStudents: true,
      canManageSms: true,
    },
    {
      id: 'auth_2',
      serviceName: '방과후학교',
      adminId: '박진수',
      adminName: '박진수',
      canManageTeachers: true,
      canManageStudents: true,
      canManageSms: true,
    },
  ],

  privacyLogs: [
    {
      id: 'log_1',
      seq: 1,
      service: '학교관리',
      userId: '김혜련',
      userGroup: '최고관리자',
      ipAddress: '121.134.88.201',
      accessTime: '2026-08-17 13:28:10',
      action: '교직원 목록 및 학생 목록 조회',
    },
    {
      id: 'log_2',
      seq: 2,
      service: '늘봄학교',
      userId: '박진수',
      userGroup: '지원실장',
      ipAddress: '118.235.12.94',
      accessTime: '2026-08-17 11:15:42',
      action: '강좌 개설 및 수강신청 승인',
    },
    {
      id: 'log_3',
      seq: 3,
      service: '문자관리',
      userId: '김혜련',
      userGroup: '최고관리자',
      ipAddress: '121.134.88.201',
      accessTime: '2026-08-16 16:40:22',
      action: '발송통계 및 충전내역 확인',
    },
  ],

  // Implementations
  addTeacher: (teacherData) => {
    const state = get();
    const newSeq = state.teachers.length > 0 ? Math.max(...state.teachers.map((t) => t.seq)) + 1 : 1;
    const newTeacher: TeacherMember = {
      ...teacherData,
      id: `t_${Date.now()}`,
      seq: newSeq,
    };
    set({ teachers: [newTeacher, ...state.teachers] });
  },

  updateTeacher: (id, updates) => {
    set((state) => ({
      teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTeacher: (id) => {
    set((state) => ({
      teachers: state.teachers.filter((t) => t.id !== id),
    }));
  },

  updateTeacherFieldConfig: (config) => {
    set((state) => ({
      teacherFieldConfig: { ...state.teacherFieldConfig, ...config },
    }));
  },

  addPositionCode: (codeName) => {
    const state = get();
    const newSeq = state.positionCodes.length > 0 ? Math.max(...state.positionCodes.map((p) => p.seq)) + 1 : 1;
    const newPos: PositionCode = {
      id: `pos_${Date.now()}`,
      seq: newSeq,
      use: true,
      codeName,
      displayOrder: newSeq,
    };
    set({ positionCodes: [...state.positionCodes, newPos] });
  },

  updatePositionCode: (id, updates) => {
    set((state) => ({
      positionCodes: state.positionCodes.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deletePositionCode: (id) => {
    set((state) => ({
      positionCodes: state.positionCodes.filter((p) => p.id !== id),
    }));
  },

  clearTeacherData: (type) => {
    if (type === 'fields') {
      set({ teacherFieldConfig: { phone: false, position: false, birthdate: false, neisNumber: false } });
    } else if (type === 'members') {
      set({ teachers: [] });
    } else if (type === 'homeroom') {
      set((state) => ({ teachers: state.teachers.map((t) => ({ ...t, homeroom: '' })) }));
    } else if (type === 'all') {
      set({
        teachers: [],
        teacherFieldConfig: { phone: true, position: true, birthdate: false, neisNumber: false },
        positionCodes: [],
      });
    }
  },

  // Student Actions
  addStudent: (studentData) => {
    const state = get();
    const newSeq = state.students.length > 0 ? Math.max(...state.students.map((s) => s.seq)) + 1 : 1;
    const newStudent: StudentMember = {
      ...studentData,
      id: `s_${Date.now()}`,
      seq: newSeq,
    };
    set({ students: [newStudent, ...state.students] });
  },

  updateStudent: (id, updates) => {
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteStudent: (id) => {
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    }));
  },

  promoteStudents: (gradeIncrement = 1) => {
    set((state) => ({
      students: state.students.map((s) => ({
        ...s,
        previousAcademicRecord: `${s.grade}학년 ${s.classNum}반 ${s.studentNum}번`,
        grade: s.grade + gradeIncrement > 6 ? 6 : s.grade + gradeIncrement,
        lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      })),
    }));
  },

  updateStudentBasicConfig: (config) => {
    set((state) => ({
      studentBasicConfig: { ...state.studentBasicConfig, ...config },
    }));
  },

  updateStudentFieldConfig: (config) => {
    set((state) => ({
      studentFieldConfig: { ...state.studentFieldConfig, ...config },
    }));
  },

  addStudentCourseCode: (codeName) => {
    const state = get();
    const newSeq = state.studentCourseCodes.length > 0 ? Math.max(...state.studentCourseCodes.map((c) => c.seq)) + 1 : 1;
    const newCourse: StudentCourseCode = {
      id: `sc_${Date.now()}`,
      seq: newSeq,
      use: true,
      codeName,
      displayOrder: newSeq,
    };
    set({ studentCourseCodes: [...state.studentCourseCodes, newCourse] });
  },

  updateStudentCourseCode: (id, updates) => {
    set((state) => ({
      studentCourseCodes: state.studentCourseCodes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  deleteStudentCourseCode: (id) => {
    set((state) => ({
      studentCourseCodes: state.studentCourseCodes.filter((c) => c.id !== id),
    }));
  },

  clearStudentData: (type) => {
    if (type === 'members') {
      set({ students: [] });
    } else if (type === 'courses') {
      set({ studentCourseCodes: [] });
    } else if (type === 'all') {
      set({ students: [], studentCourseCodes: [] });
    }
  },

  // SMS Actions
  addSmsSender: (senderData) => {
    const state = get();
    const newSeq = state.smsSenders.length > 0 ? Math.max(...state.smsSenders.map((s) => s.seq)) + 1 : 1;
    const newSender: SmsSenderNumber = {
      ...senderData,
      id: `sms_${Date.now()}`,
      seq: newSeq,
      status: '승인대기',
      approvedDate: '-',
    };
    set({ smsSenders: [newSender, ...state.smsSenders] });
  },

  cancelSmsSender: (id) => {
    set((state) => ({
      smsSenders: state.smsSenders.filter((s) => s.id !== id),
    }));
  },

  addSmsChargeRequest: (amount, count) => {
    const state = get();
    const newSeq = state.smsChargeRequests.length > 0 ? Math.max(...state.smsChargeRequests.map((r) => r.seq)) + 1 : 1;
    const newReq: SmsChargeRequest = {
      id: `req_${Date.now()}`,
      seq: newSeq,
      amount,
      count,
      approvalStatus: '품의대기',
      status: '입금대기',
      requestDate: new Date().toISOString().slice(0, 10),
    };
    set({ smsChargeRequests: [newReq, ...state.smsChargeRequests] });
  },

  cancelSmsChargeRequest: (id) => {
    set((state) => ({
      smsChargeRequests: state.smsChargeRequests.map((r) => (r.id === id ? { ...r, status: '취소' } : r)),
    }));
  },

  updateAdminAuthPermission: (id, updates) => {
    set((state) => ({
      adminAuthPermissions: state.adminAuthPermissions.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  addPrivacyLog: (action, service = '학교관리') => {
    const state = get();
    const newSeq = state.privacyLogs.length > 0 ? Math.max(...state.privacyLogs.map((l) => l.seq)) + 1 : 1;
    const newLog: PrivacyAccessLog = {
      id: `log_${Date.now()}`,
      seq: newSeq,
      service,
      userId: '김혜련',
      userGroup: '최고관리자',
      ipAddress: '121.134.88.201',
      accessTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
    };
    set({ privacyLogs: [newLog, ...state.privacyLogs] });
  },
}));
