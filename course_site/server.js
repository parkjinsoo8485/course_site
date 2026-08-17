require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Domain Routers
const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const adminRoutes = require('./routes/admin.routes');
const instructorRoutes = require('./routes/instructor.routes');
const parentRoutes = require('./routes/parent.routes');
const communityRoutes = require('./routes/community.routes');
const sczigiRoutes = require('./routes/sczigi.routes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Allow loading inline scripts & cdn resources for smooth developer demo
}));
app.use(express.json());

// Mount Domain API Routes
app.use('/api/auth', authRoutes);
app.use('/api', coursesRoutes);
app.use('/api', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api', instructorRoutes); // Backwards compatibility for /api/attendance, /api/settlements
app.use('/api/parent', parentRoutes);
app.use('/api/refunds', parentRoutes); // Backwards compatibility for /api/refunds/calculate
app.use('/api', communityRoutes);
app.use('/api', sczigiRoutes);

// Official dbdbschool URL direct handler: /help/go_data/num/:num/data/:type
app.get('/help/go_data/num/:num/data/:type', (req, res) => {
  const { num, type } = req.params;
  if (type === 'video' || type === 'mov') {
    return res.redirect(`https://www.youtube.com/results?search_query=dbdbschool+manual+${num}`);
  }
  return res.redirect(`/api/manual/doc/${num}`);
});

// ==================== SUPER ADMIN (MASTER) ROUTES ====================
// 대시보드
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// 통합 Q&A 목록
app.get(['/admin/qanda', '/admin/qanda/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'qanda', 'index.html'));
});

// Q&A 답변 작성 상세 (?id=xxx)
app.get(['/admin/qanda/view', '/admin/qanda/view/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'qanda', 'view.html'));
});

// 학교 목록 관리
app.get(['/admin/schools', '/admin/schools/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'schools', 'index.html'));
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// ==================== DBDBSCHOOL CLONE ROUTES ====================
app.get(['/af/ad_lec/lists/sn/3267', '/af/ad_lec/lists/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/index.html'));
});

app.get(['/member/login/sn/3267', '/member/login/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/3267/index.html'));
});

app.get(['/member/findpw/sn/3267', '/member/findpw/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'member/findpw/sn/3267/index.html'));
});

app.get(['/member/faq/sn/3267', '/member/faq/sn/3267/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'member/faq/sn/3267/index.html'));
});

app.get(['/af/ad_app/lists/sn/:school_id', '/af/ad_app/lists/sn/:school_id/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'af/ad_lec/lists/sn/index.html'));
});

// Dynamic store for school 3267 courses
let dbdbschool3267Courses = [
  {
    id: "c_3267_1",
    category: "늘봄",
    title: "[늘봄] AI 로봇 코딩 교실",
    targetGrade: "1~2학년",
    schedule: "월/수 14:00~15:30",
    instructor: "한수진",
    location: "컴퓨터1실",
    capacity: 20,
    enrolled: 20,
    waitlist: 3,
    fee: "무상 지원",
    materialFee: "15,000원",
    edufineCode: "EDU-2026-AI01"
  },
  {
    id: "c_3267_2",
    category: "방과후",
    title: "[방과후] 창의 미술과 드로잉",
    targetGrade: "1~6학년",
    schedule: "화/목 15:00~16:30",
    instructor: "이유리",
    location: "미술실",
    capacity: 20,
    enrolled: 18,
    waitlist: 0,
    fee: "30,000원",
    materialFee: "10,000원",
    edufineCode: "EDU-2026-ART02"
  },
  {
    id: "c_3267_3",
    category: "늘봄",
    title: "[늘봄] 신나는 K-POP 댄스",
    targetGrade: "1~3학년",
    schedule: "월/금 15:00~16:00",
    instructor: "박지민",
    location: "무용실",
    capacity: 25,
    enrolled: 25,
    waitlist: 5,
    fee: "무상 지원",
    materialFee: "0원",
    edufineCode: "EDU-2026-DAN03"
  },
  {
    id: "c_3267_4",
    category: "방과후",
    title: "[방과후] 주포만 바둑교실",
    targetGrade: "2~6학년",
    schedule: "수 15:00~16:40",
    instructor: "최성호",
    location: "2학년 1반",
    capacity: 15,
    enrolled: 12,
    waitlist: 0,
    fee: "25,000원",
    materialFee: "5,000원",
    edufineCode: "EDU-2026-GO04"
  },
  {
    id: "c_3267_5",
    category: "늘봄",
    title: "[늘봄] 생명과학 실험 탐구",
    targetGrade: "3~6학년",
    schedule: "목 15:00~16:30",
    instructor: "김도현",
    location: "과학2실",
    capacity: 20,
    enrolled: 20,
    waitlist: 2,
    fee: "무상 지원",
    materialFee: "12,000원",
    edufineCode: "EDU-2026-SCI05"
  },
  {
    id: "c_3267_6",
    category: "방과후",
    title: "[방과후] 원어민 영어회화 (초급)",
    targetGrade: "1~4학년",
    schedule: "화/금 14:00~15:00",
    instructor: "John Smith",
    location: "영어체험실",
    capacity: 18,
    enrolled: 16,
    waitlist: 0,
    fee: "35,000원",
    materialFee: "15,000원",
    edufineCode: "EDU-2026-ENG06"
  }
];

app.get('/api/dbdbschool/3267/courses', (req, res) => {
  return res.json({
    success: true,
    schoolName: "광주풍향초등학교",
    serviceName: "늘봄학교",
    courses: dbdbschool3267Courses
  });
});

app.post('/api/dbdbschool/3267/enroll', (req, res) => {
  const { courseId, studentName, isWaitlist } = req.body;
  if (!courseId || !studentName) {
    return res.status(400).json({ success: false, message: '강좌 ID와 학생명을 입력하세요.' });
  }

  const course = dbdbschool3267Courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: '강좌를 찾을 수 없습니다.' });
  }

  if (isWaitlist) {
    course.waitlist += 1;
    return res.json({
      success: true,
      message: `[대기 신청 완료] ${studentName} 학생의 ${course.title} 대기자 ${course.waitlist}순위 신청이 완료되었습니다.`
    });
  } else {
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ success: false, message: '정원이 초과되었습니다. 대기 신청을 이용해 주세요.' });
    }
    course.enrolled += 1;
    return res.json({
      success: true,
      message: `[수강 신청 완료] ${studentName} 학생의 ${course.title} 수강 신청이 완료되었습니다.`
    });
  }
});

// dbdbschool Page Routing Middleware (Serves individual sczigi static pages or falls back to master SPA)
app.use((req, res, next) => {
  const fs = require('fs');
  if (req.path && req.path.startsWith('/sczigi/')) {
    const cleanPath = req.path.replace(/^\/sczigi\//, '').replace(/\/$/, '');
    const directIndexPath = path.join(__dirname, 'sczigi', cleanPath, 'index.html');
    const directHtmlPath = path.join(__dirname, 'sczigi', `${cleanPath}.html`);
    const fallbackSnPath = path.join(__dirname, 'sczigi', cleanPath, 'sn', '3267', 'index.html');
    if (fs.existsSync(directIndexPath)) {
      return res.sendFile(directIndexPath);
    }
    if (fs.existsSync(directHtmlPath)) {
      return res.sendFile(directHtmlPath);
    }
    if (fs.existsSync(fallbackSnPath)) {
      return res.sendFile(fallbackSnPath);
    }
  }

  if (req.path && (req.path.startsWith('/af/') || req.path.startsWith('/sczigi/'))) {
    if (req.path.endsWith('.js') || req.path.endsWith('.css') || req.path.endsWith('.png') || req.path.endsWith('.ico') || req.path.endsWith('.jpg')) {
      return next();
    }
    return res.sendFile(path.join(__dirname, 'af', 'ad_lec', 'lists', 'sn', 'index.html'));
  }
  // Super Admin fallback: /admin/* 하위 미등록 경로는 대시보드로
  if (req.path && req.path.startsWith('/admin/') && !req.path.includes('.')) {
    return res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 [늘봄학교 SaaS 플랫폼] 서버 구동 완료: http://localhost:${PORT}`);
});
