-- 늘봄학교 SaaS 플랫폼 - PostgreSQL 테이블 스키마 DDL

-- 1. 학교 테이블 (schools)
CREATE TABLE IF NOT EXISTS schools (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  plan VARCHAR(32) DEFAULT 'standard',
  status VARCHAR(32) DEFAULT 'active',
  expire_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 사용자 테이블 (users)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  username VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  role VARCHAR(32) DEFAULT 'teacher',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 강좌 테이블 (courses)
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  code VARCHAR(32),
  category VARCHAR(64) NOT NULL,
  title VARCHAR(128) NOT NULL,
  teacher_name VARCHAR(64) NOT NULL,
  applied INT DEFAULT 0,
  capacity INT DEFAULT 20,
  waiting INT DEFAULT 0,
  waiting_capacity INT DEFAULT 5,
  grade VARCHAR(64),
  period VARCHAR(128),
  schedule VARCHAR(128),
  fee INT DEFAULT 0,
  material_fee INT DEFAULT 0,
  auto_renew VARCHAR(8) DEFAULT 'Y',
  fee_receipt VARCHAR(8) DEFAULT 'Y',
  teacher_closed VARCHAR(8) DEFAULT 'N',
  refund_closed VARCHAR(8) DEFAULT 'N',
  status VARCHAR(32) DEFAULT '모집중',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 수강 신청자 테이블 (applicants)
CREATE TABLE IF NOT EXISTS applicants (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  student_name VARCHAR(64) NOT NULL,
  grade_class VARCHAR(64) NOT NULL,
  parent_phone VARCHAR(32) NOT NULL,
  course_id VARCHAR(64) REFERENCES courses(id) ON DELETE SET NULL,
  course_title VARCHAR(128) NOT NULL,
  applied_at VARCHAR(64) NOT NULL,
  subsidy_type VARCHAR(64) DEFAULT '일반 자부담',
  payment_status VARCHAR(64) DEFAULT '결제대기',
  voucher_balance INT DEFAULT 600000,
  material_paid VARCHAR(8) DEFAULT 'N',
  status VARCHAR(32) DEFAULT '승인',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 대기자 명단 테이블 (waitlist)
CREATE TABLE IF NOT EXISTS waitlist (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  rank INT DEFAULT 1,
  student_name VARCHAR(64) NOT NULL,
  grade_class VARCHAR(64) NOT NULL,
  parent_phone VARCHAR(32) NOT NULL,
  course_id VARCHAR(64) REFERENCES courses(id) ON DELETE SET NULL,
  course_title VARCHAR(128) NOT NULL,
  applied_at VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT '대기중',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. 정산 및 환불 테이블 (settlements)
CREATE TABLE IF NOT EXISTS settlements (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL,
  student_name VARCHAR(64) NOT NULL,
  course_title VARCHAR(128) NOT NULL,
  amount INT DEFAULT 0,
  requested_at DATE NOT NULL,
  status VARCHAR(32) DEFAULT '정산대기',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. 출석부 및 등하교 안심 알림 테이블 (attendance)
CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
  student_name VARCHAR(64) NOT NULL,
  parent_phone VARCHAR(32) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(32) DEFAULT '출석', -- 출석, 결석, 조퇴
  notified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. 클래스별 Q&A 게시판 (qa_board)
CREATE TABLE IF NOT EXISTS qa_board (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
  course_title VARCHAR(128) NOT NULL,
  author_name VARCHAR(64) NOT NULL,
  author_role VARCHAR(32) DEFAULT 'parent',
  title VARCHAR(256) NOT NULL,
  content TEXT NOT NULL,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. 하교/귀가 일정표 (safety_schedules)
CREATE TABLE IF NOT EXISTS safety_schedules (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  student_name VARCHAR(64) NOT NULL,
  grade_class VARCHAR(64) NOT NULL,
  parent_phone VARCHAR(32) NOT NULL,
  day_of_week VARCHAR(16) NOT NULL, -- 월, 화, 수, 목, 금
  return_time VARCHAR(32) NOT NULL, -- 예: 16:30
  pickup_person VARCHAR(64) NOT NULL, -- 예: 어머니 자차, 학원차량
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. 결석 및 조퇴 신청 (absence_requests)
CREATE TABLE IF NOT EXISTS absence_requests (
  id VARCHAR(64) PRIMARY KEY,
  school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
  student_name VARCHAR(64) NOT NULL,
  parent_phone VARCHAR(32) NOT NULL,
  course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
  course_title VARCHAR(128) NOT NULL,
  absence_date DATE NOT NULL,
  type VARCHAR(32) DEFAULT '결석', -- 결석, 조퇴
  reason TEXT NOT NULL,
  status VARCHAR(32) DEFAULT '승인대기',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
