const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_FILE = path.join(__dirname, 'data.json');

// Initial seed data for immediate out-of-the-box demo
const defaultData = {
  schools: [
    {
      id: 'sch_1',
      code: 'UNCHON2025',
      name: '운천초등학교',
      plan: 'standard', // basic, standard, premium
      status: 'active',
      expireDate: '2026-12-31',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sch_2',
      code: 'SEOUL2025',
      name: '서울늘봄초등학교',
      plan: 'premium',
      status: 'active',
      expireDate: '2026-11-30',
      createdAt: new Date().toISOString()
    }
  ],
  users: [],
  courses: [
    {
      id: 'crs_1',
      schoolId: 'sch_1',
      code: '312',
      category: '7월 돌봄',
      title: '[돌봄] 선택형 돌봄 1부 (월 14:00~14:50)',
      teacherName: '돌봄전담사',
      applied: 14,
      capacity: 40,
      waiting: 0,
      waitingCapacity: 5,
      grade: '1,2,3,4,5,6',
      period: '2025-07-01~2025-07-25',
      schedule: '월:14:00~14:50',
      fee: 0,
      feeReceipt: 'Y',
      teacherClosed: 'Y',
      refundClosed: 'Y',
      status: '종료'
    },
    {
      id: 'crs_2',
      schoolId: 'sch_1',
      code: '311',
      category: '7월 돌봄',
      title: '[돌봄] 선택형 돌봄 2부 (월 15:00~15:50)',
      teacherName: '돌봄전담사',
      applied: 10,
      capacity: 40,
      waiting: 0,
      waitingCapacity: 5,
      grade: '1,2,3,4,5,6',
      period: '2025-07-01~2025-07-25',
      schedule: '월:15:00~15:50',
      fee: 0,
      feeReceipt: 'Y',
      teacherClosed: 'Y',
      refundClosed: 'Y',
      status: '종료'
    },
    {
      id: 'crs_3',
      schoolId: 'sch_1',
      code: '313',
      category: '방과후 특기적성',
      title: '[특기적성] 창의 로봇교실 A반',
      teacherName: '김로봇 강사',
      applied: 18,
      capacity: 20,
      waiting: 2,
      waitingCapacity: 5,
      grade: '1,2,3',
      period: '2026-03-01~2026-06-30',
      schedule: '화,목:15:00~15:50',
      fee: 35000,
      feeReceipt: 'Y',
      teacherClosed: 'N',
      refundClosed: 'N',
      status: '모집중'
    }
  ],
  applicants: [
    {
      id: 'app_1',
      schoolId: 'sch_1',
      studentName: '김민준',
      gradeClass: '1학년 2반',
      parentPhone: '010-2345-6789',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-02 10:15',
      subsidyType: '자유수강권',
      paymentStatus: '결제완료',
      status: '승인'
    },
    {
      id: 'app_2',
      schoolId: 'sch_1',
      studentName: '이서연',
      gradeClass: '2학년 1반',
      parentPhone: '010-3456-7890',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-02 11:30',
      subsidyType: '늘봄 지원금',
      paymentStatus: '지원금 수령',
      status: '승인'
    },
    {
      id: 'app_3',
      schoolId: 'sch_1',
      studentName: '박지후',
      gradeClass: '1학년 3반',
      parentPhone: '010-4567-8901',
      courseId: 'crs_1',
      courseTitle: '[돌봄] 선택형 돌봄 1부 (월 14:00~14:50)',
      appliedAt: '2026-03-03 09:40',
      subsidyType: '늘봄 무상지원',
      paymentStatus: '무상',
      status: '승인'
    },
    {
      id: 'app_4',
      schoolId: 'sch_1',
      studentName: '최예은',
      gradeClass: '3학년 4반',
      parentPhone: '010-5678-9012',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-04 14:20',
      subsidyType: '일반 자부담',
      paymentStatus: '결제대기',
      status: '신청대기'
    }
  ],
  waitlist: [
    {
      id: 'wt_1',
      schoolId: 'sch_1',
      rank: 1,
      studentName: '정현우',
      gradeClass: '2학년 3반',
      parentPhone: '010-6789-0123',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-05 16:05',
      status: '대기중'
    },
    {
      id: 'wt_2',
      schoolId: 'sch_1',
      rank: 2,
      studentName: '한소율',
      gradeClass: '1학년 1반',
      parentPhone: '010-7890-1234',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-05 17:22',
      status: '대기중'
    },
    {
      id: 'wt_3',
      schoolId: 'sch_1',
      rank: 1,
      studentName: '윤우진',
      gradeClass: '4학년 2반',
      parentPhone: '010-8901-2345',
      courseId: 'crs_2',
      courseTitle: '[돌봄] 선택형 돌봄 2부 (월 15:00~15:50)',
      appliedAt: '2026-03-06 08:50',
      status: '대기중'
    }
  ],
  settlements: [
    {
      id: 'stl_1',
      schoolId: 'sch_1',
      type: '자유수강권 지원금',
      studentName: '김민준',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      amount: 35000,
      requestedAt: '2026-03-10',
      status: '정산완료',
      note: '지자체 1분기 보조금 정산 완료'
    },
    {
      id: 'stl_2',
      schoolId: 'sch_1',
      type: '늘봄 무상 지원금',
      studentName: '이서연',
      courseTitle: '[돌봄] 선택형 돌봄 1부',
      amount: 40000,
      requestedAt: '2026-03-11',
      status: '정산대기',
      note: '늘봄 전담 지원금 3월분 정산 신청'
    },
    {
      id: 'stl_3',
      schoolId: 'sch_1',
      type: '수강료 환불',
      studentName: '강도윤',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      amount: 17500,
      requestedAt: '2026-03-12',
      status: '환불완료',
      note: '타지역 전출로 인한 50% 중도 환불'
    },
    {
      id: 'stl_4',
      schoolId: 'sch_1',
      type: '수강료 환불',
      studentName: '오하은',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      amount: 35000,
      requestedAt: '2026-03-12',
      status: '환불신청',
      note: '개인 사정 수강 취소 요청'
    }
  ]
};

// Seed default demo user password (hashed)
const initSeedUsers = async () => {
  if (defaultData.users.length === 0) {
    const saltRounds = 10;
    const teacherPasswordHash = await bcrypt.hash('12341234', saltRounds);
    const adminPasswordHash = await bcrypt.hash('admin1234', saltRounds);

    defaultData.users = [
      {
        id: 'usr_teacher1',
        schoolId: 'sch_1',
        username: 'teacher',
        name: '박진수',
        email: 'teacher@unchon.es.kr',
        phone: '010-1234-5678',
        role: 'teacher',
        passwordHash: teacherPasswordHash,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_admin1',
        schoolId: 'sch_1',
        username: 'schadmin',
        name: '학교관리자',
        email: 'admin@unchon.es.kr',
        phone: '010-9999-8888',
        role: 'school_admin',
        passwordHash: adminPasswordHash,
        createdAt: new Date().toISOString()
      }
    ];
  }
};

class JSONDatabase {
  constructor() {
    this.data = defaultData;
    this.init();
  }

  async init() {
    await initSeedUsers();
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        this.data = { ...defaultData, ...fileData };
      } catch (err) {
        console.error('Failed to load DB file, using default seed:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save DB file:', err);
    }
  }

  // School Operations
  findSchoolByCode(code) {
    return this.data.schools.find(s => s.code.toUpperCase() === code.trim().toUpperCase());
  }

  findSchoolById(id) {
    return this.data.schools.find(s => s.id === id);
  }

  createSchool(schoolData) {
    const newSchool = {
      id: 'sch_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active',
      ...schoolData
    };
    this.data.schools.push(newSchool);
    this.save();
    return newSchool;
  }

  updateSchoolSubscription(schoolId, plan, additionalDays = 365) {
    const school = this.findSchoolById(schoolId);
    if (!school) return null;
    
    let baseDate = new Date();
    if (school.expireDate && new Date(school.expireDate) > baseDate) {
      baseDate = new Date(school.expireDate);
    }
    baseDate.setDate(baseDate.getDate() + additionalDays);
    
    school.plan = plan || school.plan;
    school.expireDate = baseDate.toISOString().split('T')[0];
    school.status = 'active';
    this.save();
    return school;
  }

  // User Operations
  findUserByUsername(username) {
    return this.data.users.find(u => u.username === username);
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  async createUser(userData) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const newUser = {
      id: 'usr_' + Date.now(),
      schoolId: userData.schoolId,
      username: userData.username,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'teacher',
      passwordHash: passwordHash,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Course Operations
  getCoursesBySchool(schoolId) {
    return this.data.courses.filter(c => c.schoolId === schoolId);
  }

  createCourse(courseData) {
    const newCourse = {
      id: 'crs_' + Date.now(),
      code: String(Math.floor(100 + Math.random() * 900)),
      applied: 0,
      waiting: 0,
      feeReceipt: 'Y',
      teacherClosed: 'N',
      refundClosed: 'N',
      status: '모집중',
      ...courseData
    };
    this.data.courses.unshift(newCourse);
    this.save();
    return newCourse;
  }

  deleteCourse(courseId, schoolId) {
    const index = this.data.courses.findIndex(c => c.id === courseId && c.schoolId === schoolId);
    if (index !== -1) {
      const removed = this.data.courses.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  // Applicant Operations
  getApplicantsBySchool(schoolId) {
    return (this.data.applicants || []).filter(a => a.schoolId === schoolId);
  }

  updateApplicantStatus(applicantId, schoolId, status) {
    const applicant = (this.data.applicants || []).find(a => a.id === applicantId && a.schoolId === schoolId);
    if (applicant) {
      applicant.status = status;
      this.save();
      return applicant;
    }
    return null;
  }

  deleteApplicant(applicantId, schoolId) {
    const index = (this.data.applicants || []).findIndex(a => a.id === applicantId && a.schoolId === schoolId);
    if (index !== -1) {
      const removed = this.data.applicants.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  // Waitlist Operations
  getWaitlistBySchool(schoolId) {
    return (this.data.waitlist || []).filter(w => w.schoolId === schoolId);
  }

  promoteWaitlist(waitlistId, schoolId) {
    const index = (this.data.waitlist || []).findIndex(w => w.id === waitlistId && w.schoolId === schoolId);
    if (index !== -1) {
      const item = this.data.waitlist.splice(index, 1)[0];
      // Convert to applicant
      const newApplicant = {
        id: 'app_' + Date.now(),
        schoolId: schoolId,
        studentName: item.studentName,
        gradeClass: item.gradeClass,
        parentPhone: item.parentPhone,
        courseId: item.courseId,
        courseTitle: item.courseTitle,
        appliedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        subsidyType: '일반 자부담',
        paymentStatus: '결제대기',
        status: '승인'
      };
      if (!this.data.applicants) this.data.applicants = [];
      this.data.applicants.unshift(newApplicant);
      this.save();
      return newApplicant;
    }
    return null;
  }

  deleteWaitlist(waitlistId, schoolId) {
    const index = (this.data.waitlist || []).findIndex(w => w.id === waitlistId && w.schoolId === schoolId);
    if (index !== -1) {
      const removed = this.data.waitlist.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  // Settlement Operations
  getSettlementsBySchool(schoolId) {
    return (this.data.settlements || []).filter(s => s.schoolId === schoolId);
  }

  createSettlement(schoolId, data) {
    const newSettlement = {
      id: 'stl_' + Date.now(),
      schoolId: schoolId,
      requestedAt: new Date().toISOString().split('T')[0],
      status: '정산대기',
      ...data
    };
    if (!this.data.settlements) this.data.settlements = [];
    this.data.settlements.unshift(newSettlement);
    this.save();
    return newSettlement;
  }

  updateSettlementStatus(settlementId, schoolId, status) {
    const settlement = (this.data.settlements || []).find(s => s.id === settlementId && s.schoolId === schoolId);
    if (settlement) {
      settlement.status = status;
      this.save();
      return settlement;
    }
    return null;
  }
}

module.exports = new JSONDatabase();
