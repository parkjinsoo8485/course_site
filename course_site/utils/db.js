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
}

module.exports = new JSONDatabase();
