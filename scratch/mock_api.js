let express, cors;
try {
  express = require('express');
} catch (_) {
  express = require('../course_site/node_modules/express');
}

try {
  cors = require('cors');
} catch (_) {
  cors = require('../course_site/node_modules/cors');
}

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory dataset modeled after dbdbschool ad_app/lists/sn/3267
let applicants = [
  {
    app_num: '21016254',
    seq: 712,
    mem_num: '4841988',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '10',
    student_name: '오하율',
    stu_hp: '',
    parent_name: '최인화',
    parent_hp: '010-3331-1011',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:28:38',
    draw_first: false
  },
  {
    app_num: '21016237',
    seq: 711,
    mem_num: '4841990',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '11',
    student_name: '이소윤',
    stu_hp: '010-3718-3500',
    parent_name: '최경신',
    parent_hp: '010-8108-3500',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:26:54',
    draw_first: false
  },
  {
    app_num: '21016247',
    seq: 710,
    mem_num: '4841994',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '13',
    student_name: '이채린',
    stu_hp: '',
    parent_name: '정태정',
    parent_hp: '010-2377-2400',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:27:38',
    draw_first: false
  },
  {
    app_num: '21016260',
    seq: 709,
    mem_num: '4841996',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '14',
    student_name: '임채원',
    stu_hp: '010-5334-7217',
    parent_name: '이소미',
    parent_hp: '010-5334-7217',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:29:14',
    draw_first: true
  },
  {
    app_num: '21016240',
    seq: 708,
    mem_num: '4842002',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '17',
    student_name: '조은유',
    stu_hp: '010-5219-2196',
    parent_name: '임수정',
    parent_hp: '010-5219-2196',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:27:06',
    draw_first: false
  },
  {
    app_num: '21016276',
    seq: 707,
    mem_num: '4842006',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '19',
    student_name: '최은서',
    stu_hp: '010-3373-3683',
    parent_name: '김은정',
    parent_hp: '010-3373-3683',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:30:11',
    draw_first: false
  },
  {
    app_num: '21016252',
    seq: 706,
    mem_num: '4842010',
    division_id: '10',
    division_name: '26년 8월',
    program_type: '3',
    program_name: '돌봄',
    lec_id: '1552375',
    lec_name: '(금) 돌봄 4부',
    grade: '1',
    class_num: '1',
    bunho: '21',
    student_name: '황서우',
    stu_hp: '010-9073-5302',
    parent_name: '황문철',
    parent_hp: '010-9073-5302',
    tuition_fee: 0,
    material_fee: 0,
    instructor_fee: 0,
    book_fee: 0,
    item_fee: 0,
    total_fee: 0,
    reg_date: '2026-07-10 15:28:09',
    draw_first: false
  }
];

const lectures = [
  { lec_id: '1552375', lec_name: '[26년 8월] (금) 돌봄 4부(돌봄전담사,19명)', division_id: '10', program_type: '3' },
  { lec_id: '1552291', lec_name: '[26년 8월] (금)돌봄 1부(돌봄전담사,5명)', division_id: '10', program_type: '3' },
  { lec_id: '1552292', lec_name: '[26년 8월] (금)돌봄 2부(돌봄전담사,12명)', division_id: '10', program_type: '3' },
  { lec_id: '1552293', lec_name: '[26년 8월] (금)돌봄 3부(돌봄전담사,20명)', division_id: '10', program_type: '3' },
  { lec_id: '1552299', lec_name: '[26년 8월] 논술 1부(박지숙,17명)', division_id: '10', program_type: '1' },
  { lec_id: '1552297', lec_name: '[26년 8월] 놀이체육 1부(강태연,11명)', division_id: '10', program_type: '1' },
  { lec_id: '1552305', lec_name: '[26년 8월] 로봇과학 1부(최정호,14명)', division_id: '10', program_type: '1' }
];

// 1. GET applicant lists
app.get(['/af/ad_app/lists/sn/:school_id', '/api/af/ad_app/lists/sn/:school_id'], (req, res) => {
  const { school_id } = req.params;
  const { sld, slp, sln, sgr, scl, st, sw, page = 1, limit = 50 } = req.query;

  let filtered = [...applicants];

  if (sld && sld !== 'all') {
    filtered = filtered.filter(a => a.division_id === sld);
  }
  if (slp && slp !== 'all') {
    filtered = filtered.filter(a => a.program_type === slp);
  }
  if (sln) {
    filtered = filtered.filter(a => a.lec_id === sln);
  }
  if (sgr) {
    filtered = filtered.filter(a => a.grade === sgr);
  }
  if (scl) {
    filtered = filtered.filter(a => a.class_num === scl);
  }
  if (sw && sw.trim()) {
    const term = sw.trim().toLowerCase();
    if (st === 'tel') {
      filtered = filtered.filter(a => (a.stu_hp && a.stu_hp.includes(term)) || (a.parent_hp && a.parent_hp.includes(term)));
    } else {
      filtered = filtered.filter(a => a.student_name.toLowerCase().includes(term));
    }
  }

  const totalCount = filtered.length;
  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const paginated = filtered.slice(startIndex, startIndex + parseInt(limit, 10));

  res.json({
    status: 200,
    school_id,
    school_name: '광주풍향초등학교',
    admin_name: '관리자(김혜련)님',
    total_count: totalCount,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    data: paginated,
    lectures: lectures
  });
});

// 2. POST update student/parent contact
app.post(['/af/ad_app/stu_hp/sn/:school_id', '/api/af/ad_app/stu_hp/sn/:school_id'], (req, res) => {
  const { num, mem_num, mem_hp, mem_pa_name, mem_pa_tel } = req.body;

  const target = applicants.find(a => a.app_num === String(num) || a.mem_num === String(mem_num));
  if (target) {
    if (mem_hp !== undefined) target.stu_hp = mem_hp;
    if (mem_pa_name !== undefined) target.parent_name = mem_pa_name;
    if (mem_pa_tel !== undefined) target.parent_hp = mem_pa_tel;
  }

  res.json({
    status: 200,
    num: num || target?.app_num,
    mem_num: mem_num || target?.mem_num,
    mem_hp: target?.stu_hp || '',
    mem_pa_name: target?.parent_name || '보호자',
    mem_pa_tel: target?.parent_hp || '',
    message: '연락처가 성공적으로 수정되었습니다.'
  });
});

// 3. POST delete/cancel applicant
app.post(['/af/ad_app/cancel/sn/:school_id', '/api/af/ad_app/cancel/sn/:school_id'], (req, res) => {
  const { cancel_num, data_checked } = req.body;
  const toDelete = new Set();

  if (cancel_num) {
    toDelete.add(String(cancel_num));
  }
  if (Array.isArray(data_checked)) {
    data_checked.forEach(id => toDelete.add(String(id)));
  } else if (typeof data_checked === 'string') {
    toDelete.add(data_checked);
  }

  applicants = applicants.filter(a => !toDelete.has(String(a.app_num)));

  res.json({
    status: 200,
    deletedCount: toDelete.size,
    message: '성공적으로 삭제되었습니다.'
  });
});

// 4. POST toggle draw first priority
app.post(['/af/ad_app/draw_first/sn/:school_id', '/api/af/ad_app/draw_first/sn/:school_id'], (req, res) => {
  const { mode, data_checked } = req.body;
  const isFirst = mode === 'Y' || mode === 'draw_first_Y';
  const targetIds = new Set(Array.isArray(data_checked) ? data_checked.map(String) : [String(data_checked)]);

  applicants.forEach(a => {
    if (targetIds.has(String(a.app_num))) {
      a.draw_first = isFirst;
    }
  });

  res.json({
    status: 200,
    mode: isFirst ? 'Y' : 'N',
    updatedCount: targetIds.size,
    message: isFirst ? '우선추첨대상자로 지정되었습니다.' : '우선추첨대상자에서 제외되었습니다.'
  });
});

// 5. GET student schedule/timetable modal data
app.get(['/af/ad_app/schedule/sn/:school_id', '/api/af/ad_app/schedule/sn/:school_id'], (req, res) => {
  const { mem_num } = req.query;
  const target = applicants.find(a => a.mem_num === String(mem_num));

  res.json({
    status: 200,
    student: target ? {
      name: target.student_name,
      grade: target.grade,
      class_num: target.class_num,
      bunho: target.bunho
    } : { name: '오하율', grade: 1, class_num: 1, bunho: 10 },
    schedule: [
      { day: '월', period: '1부 (13:00~13:40)', lec_name: '창의보드 1부', room: '늘봄1실' },
      { day: '화', period: '2부 (13:50~14:30)', lec_name: '로봇과학 1부', room: '과학실' },
      { day: '수', period: '1부 (13:00~13:40)', lec_name: '논술 1부', room: '늘봄2실' },
      { day: '목', period: '2부 (13:50~14:30)', lec_name: '놀이체육 1부', room: '체육관' },
      { day: '금', period: '4부 (15:30~16:10)', lec_name: '(금) 돌봄 4부', room: '돌봄전용실' }
    ]
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Mock API server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
