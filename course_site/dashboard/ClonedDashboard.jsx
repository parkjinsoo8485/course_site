import React, { useState, useEffect, useMemo, useCallback } from 'react';

export default function ClonedDashboard() {
  // State definitions
  const [schoolId] = useState('3267');
  const [schoolName] = useState('광주풍향초등학교');
  const [adminName] = useState('관리자(김혜련)님');
  const [loading, setLoading] = useState(false);

  // Search & Filter state
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [isExtraMenuOpen, setIsExtraMenuOpen] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [division, setDivision] = useState('10'); // '10': 26년 8월
  const [programType, setProgramType] = useState('all'); // 'all', '1': 방과후, '2': 맞춤형, '3': 돌봄
  const [selectedLec, setSelectedLec] = useState('');
  const [grade, setGrade] = useState('');
  const [classNum, setClassNum] = useState('');
  const [searchType, setSearchType] = useState('app_mem_name');
  const [keyword, setKeyword] = useState('');

  // Table Data State
  const [applicants, setApplicants] = useState([
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
      reg_date: '2026-07-10\n15:28:38',
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
      reg_date: '2026-07-10\n15:26:54',
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
      reg_date: '2026-07-10\n15:27:38',
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
      reg_date: '2026-07-10\n15:29:14',
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
      reg_date: '2026-07-10\n15:27:06',
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
      reg_date: '2026-07-10\n15:30:11',
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
      reg_date: '2026-07-10\n15:28:09',
      draw_first: false
    }
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [batchAction, setBatchAction] = useState('');

  // Inline Contact Edit State
  const [editingContactAppNum, setEditingContactAppNum] = useState(null);
  const [contactForm, setContactForm] = useState({
    mem_hp_1: '010',
    mem_hp_2: '',
    mem_hp_3: '',
    parent_name: '',
    parent_hp_1: '010',
    parent_hp_2: '',
    parent_hp_3: ''
  });

  // Modal Dialogs State
  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    studentName: '',
    grade: '',
    classNum: '',
    bunho: '',
    schedule: []
  });

  // Fetch from API
  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sld: division,
        slp: programType,
        sln: selectedLec,
        sgr: grade,
        scl: classNum,
        st: searchType,
        sw: keyword
      });
      const res = await fetch(`http://localhost:3005/api/af/ad_app/lists/sn/${schoolId}?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setApplicants(json.data);
        }
      }
    } catch (_) {
      // Keep state if offline
    } finally {
      setLoading(false);
    }
  }, [schoolId, division, programType, selectedLec, grade, classNum, searchType, keyword]);

  useEffect(() => {
    fetchApplicants();
  }, [division, programType, selectedLec, grade, classNum]);

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(applicants.map(a => a.app_num));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Open inline contact editor
  const handleOpenContactEdit = (applicant) => {
    if (editingContactAppNum) {
      alert('이미 편집 중인 연락처가 있습니다.');
      return;
    }
    const hpParts = (applicant.stu_hp || '').split('-');
    const paParts = (applicant.parent_hp || '').split('-');

    setContactForm({
      mem_hp_1: hpParts[0] || '010',
      mem_hp_2: hpParts[1] || '',
      mem_hp_3: hpParts[2] || '',
      parent_name: applicant.parent_name || '',
      parent_hp_1: paParts[0] || '010',
      parent_hp_2: paParts[1] || '',
      parent_hp_3: paParts[2] || ''
    });
    setEditingContactAppNum(applicant.app_num);
  };

  // Save inline contact edit
  const handleSaveContact = async (appNum, memNum) => {
    const newStuHp = contactForm.mem_hp_2 && contactForm.mem_hp_3 
      ? `${contactForm.mem_hp_1}-${contactForm.mem_hp_2}-${contactForm.mem_hp_3}` 
      : '';
    const newPaHp = contactForm.parent_hp_2 && contactForm.parent_hp_3 
      ? `${contactForm.parent_hp_1}-${contactForm.parent_hp_2}-${contactForm.parent_hp_3}` 
      : '';

    try {
      await fetch(`http://localhost:3005/api/af/ad_app/stu_hp/sn/${schoolId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num: appNum,
          mem_num: memNum,
          mem_hp: newStuHp,
          mem_pa_name: contactForm.parent_name,
          mem_pa_tel: newPaHp
        })
      });
    } catch (_) {}

    setApplicants(prev => prev.map(a => {
      if (a.app_num === appNum) {
        return {
          ...a,
          stu_hp: newStuHp,
          parent_name: contactForm.parent_name,
          parent_hp: newPaHp
        };
      }
      return a;
    }));

    setEditingContactAppNum(null);
  };

  // Delete single applicant
  const handleDeleteApplicant = async (appNum) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await fetch(`http://localhost:3005/api/af/ad_app/cancel/sn/${schoolId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancel_num: appNum })
      });
    } catch (_) {}

    setApplicants(prev => prev.filter(a => a.app_num !== appNum));
    setSelectedIds(prev => prev.filter(id => id !== appNum));
  };

  // Batch action submit
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIds.length) {
      alert('선택된 학생이 없습니다.');
      return;
    }
    if (!batchAction) {
      alert('일괄적용: 선택하세요.');
      return;
    }

    if (batchAction === 'del') {
      if (!window.confirm('선택된 신청 정보를 삭제하시겠습니까?')) return;
      try {
        await fetch(`http://localhost:3005/api/af/ad_app/cancel/sn/${schoolId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data_checked: selectedIds })
        });
      } catch (_) {}
      setApplicants(prev => prev.filter(a => !selectedIds.includes(a.app_num)));
      setSelectedIds([]);
      alert('삭제되었습니다.');
    } else if (batchAction === 'move') {
      alert("신청자 이동은 검색 조건에서 '강좌'를 먼저 선택해야 이용할 수 있습니다.");
    } else if (batchAction === 'draw_first_Y' || batchAction === 'draw_first_N') {
      const isY = batchAction === 'draw_first_Y';
      const msg = isY ? "선택된 신청자를 '우선추첨대상자'로 '지정'하시겠습니까?" : "선택된 신청자를 '우선추첨대상자'에서 '제외'하겠습니까?";
      if (!window.confirm(msg)) return;

      try {
        await fetch(`http://localhost:3005/api/af/ad_app/draw_first/sn/${schoolId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: isY ? 'Y' : 'N', data_checked: selectedIds })
        });
      } catch (_) {}

      setApplicants(prev => prev.map(a => {
        if (selectedIds.includes(a.app_num)) {
          return { ...a, draw_first: isY };
        }
        return a;
      }));
      alert(isY ? '우선추첨대상자로 지정되었습니다.' : '우선추첨대상자에서 제외되었습니다.');
    }
  };

  // Open schedule modal
  const handleOpenSchedule = (applicant) => {
    setScheduleModal({
      isOpen: true,
      studentName: applicant.student_name,
      grade: applicant.grade,
      classNum: applicant.class_num,
      bunho: applicant.bunho,
      schedule: [
        { day: '월', period: '1부 (13:00~13:40)', lec_name: '창의보드 1부', room: '늘봄1실' },
        { day: '화', period: '2부 (13:50~14:30)', lec_name: '로봇과학 1부', room: '과학실' },
        { day: '수', period: '1부 (13:00~13:40)', lec_name: '논술 1부', room: '늘봄2실' },
        { day: '목', period: '2부 (13:50~14:30)', lec_name: '놀이체육 1부', room: '체육관' },
        { day: '금', period: '4부 (15:30~16:10)', lec_name: applicant.lec_name, room: '돌봄전용실' }
      ]
    });
  };

  return (
    <div className="dbdbschool-app" style={{ fontFamily: 'Dotum, 돋움, Helvetica, sans-serif', color: '#333', fontSize: '12px' }}>
      <div id="header" style={{ height: '50px', background: '#303841', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', position: 'relative' }}>
        <p id="logo" style={{ margin: 0, fontWeight: 'bold', fontSize: '15px' }}>
          <a href="#none" style={{ color: '#fff', textDecoration: 'none' }}>{schoolName}</a>
        </p>
        <h1 style={{ margin: '0 0 0 20px', fontSize: '15px', position: 'relative' }}>
          <a href="#none" onClick={() => setIsServiceMenuOpen(!isServiceMenuOpen)} style={{ color: '#ffb400', textDecoration: 'none', cursor: 'pointer' }}>
            늘봄학교 <i className={`fa fa-angle-${isServiceMenuOpen ? 'up' : 'down'}`}></i>
          </a>
          {isServiceMenuOpen && (
            <div style={{ position: 'absolute', top: '30px', left: '0', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '3px', padding: '8px', zIndex: 1000, minWidth: '120px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li style={{ padding: '4px 8px' }}><a href="#none" style={{ color: '#333', textDecoration: 'none' }}>늘봄학교</a></li>
                <li style={{ padding: '4px 8px' }}><a href="#none" style={{ color: '#333', textDecoration: 'none' }}>방과후학교</a></li>
              </ul>
            </div>
          )}
        </h1>
        <p className="menu_btn" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} style={{ marginLeft: 'auto', cursor: 'pointer', fontSize: '16px' }}>
          <i className="fa fa-bars"></i>
        </p>
      </div>

      <div id="container" style={{ display: 'flex', minHeight: 'calc(100vh - 50px)' }}>
        {/* Left Sidebar Navigation */}
        <div id="left_menu" style={{ width: '220px', background: '#f5f6f8', borderRight: '1px solid #ddd', padding: '15px 0' }}>
          <div className="user_box" style={{ padding: '0 15px 15px 15px', borderBottom: '1px solid #e1e4e8' }}>
            <dl className="user" style={{ margin: 0 }}>
              <dt style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>
                {adminName} <span className="ball_num" style={{ background: '#d9534f', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '11px' }}><i className="fa fa-bell"></i> 0</span>
              </dt>
              <dd style={{ margin: 0, color: '#666' }}>
                <a href="#none" style={{ color: '#666', textDecoration: 'none', marginRight: '5px' }}>[로그아웃]</a>
                <a href="#none" style={{ color: '#666', textDecoration: 'none' }}>[정보수정]</a>
              </dd>
            </dl>
            <ul className="main_btn" style={{ display: 'flex', gap: '5px', listStyle: 'none', padding: 0, marginTop: '10px' }}>
              <li style={{ flex: 1 }}><button className="btn btn-default btn-xs" style={{ width: '100%', padding: '4px' }}>홈으로</button></li>
              <li style={{ flex: 1 }}><button className="btn btn-primary btn-xs" style={{ width: '100%', padding: '4px' }}>강좌등록</button></li>
            </ul>
          </div>

          <ul className="parent" style={{ listStyle: 'none', margin: '10px 0', padding: 0 }}>
            <li style={{ padding: '8px 15px', borderBottom: '1px solid #eee' }}>
              <a href={`/af/ad_faq/main/sn/${schoolId}`} style={{ color: '#337ab7', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-download" style={{ width: '22px', fontSize: '14px' }}></i>
                <span>매뉴얼</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px', borderBottom: '1px solid #eee' }}>
              <a href={`/af/qanda/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-phone" style={{ width: '22px', fontSize: '14px' }}></i>
                <span>고객지원 게시판</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px', borderBottom: '1px solid #eee', background: '#fcf8e3' }}>
              <a href={`/sczigi/service/lists/sn/${schoolId}`} style={{ color: '#c9302c', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-cog" style={{ width: '22px', fontSize: '14px' }}></i>
                <span>학교관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_lec/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-futbol-o" style={{ width: '22px' }}></i>
                <span>강좌관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px', background: '#337ab7', color: '#fff' }}>
              <a href={`/af/ad_app/lists/sn/${schoolId}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-slideshare" style={{ width: '22px' }}></i>
                <span>신청자관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_wait/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-slideshare" style={{ width: '22px' }}></i>
                <span>대기자관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_att/stat/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-check-square-o" style={{ width: '22px' }}></i>
                <span>출석부관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_ref/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-slideshare" style={{ width: '22px' }}></i>
                <span>환불/취소관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_free2_stu/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-university" style={{ width: '22px' }}></i>
                <span>지원금관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_abs/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-calendar-o" style={{ width: '22px' }}></i>
                <span>결석/귀가신청</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_tea/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-briefcase" style={{ width: '22px' }}></i>
                <span>강사관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_sur/lists/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-pie-chart" style={{ width: '22px' }}></i>
                <span>설문관리</span>
              </a>
            </li>
            <li style={{ padding: '8px 15px' }}>
              <a href={`/af/ad_cfg/main/sn/${schoolId}`} style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-cog" style={{ width: '22px' }}></i>
                <span>환경설정</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div id="contents_box" style={{ flex: 1, padding: '20px', background: '#fff' }}>
          <div id="contents_title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #337ab7', paddingBottom: '10px', marginBottom: '15px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#222' }}>
                <i className="fa fa-file-text-o"></i> 신청자관리
              </h2>
              <span className="title" style={{ color: '#777', fontSize: '12px' }}>{schoolName} 늘봄학교</span>
            </div>
            <div className="write_yun">
              <button className="btn btn-default btn-sm"><i className="fa fa-futbol-o"></i> 강좌관리</button>
            </div>
          </div>

          {/* Help Manual Banner */}
          <div className="new_help_manualbox" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '4px', padding: '10px 15px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <p style={{ margin: '0 15px 0 0', fontWeight: 'bold', color: '#337ab7' }}><i className="fa fa-file-text-o"></i> 매뉴얼</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-default btn-xs"><i className="fa fa-download"></i> 신청자 등록</button>
              <button className="btn btn-default btn-xs"><i className="fa fa-youtube-play"></i> 수강신청 테스트</button>
              <button className="btn btn-default btn-xs"><i className="fa fa-download"></i> 신청결과 조회</button>
              <button className="btn btn-default btn-xs"><i className="fa fa-youtube-play"></i> 스쿨뱅킹 파일 다운로드</button>
            </div>
          </div>

          {/* Panel Main */}
          <div className="panel_main" style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '20px' }}>
            <div className="panel-heading" style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd', padding: '10px 15px', fontWeight: 'bold' }}>
              신청목록
            </div>

            {/* Filter / Search Bar */}
            <div className="panel-search" style={{ padding: '12px 15px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  id="main_control_box_btn01"
                  className="btn btn-default btn-sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  style={{ fontWeight: 'bold' }}
                >
                  상세검색 <strong>{isSearchOpen ? '닫기' : '열기'}</strong> <i className={`fa fa-angle-${isSearchOpen ? 'up' : 'down'}`}></i>
                </button>

                {isSearchOpen && (
                  <>
                    <select
                      name="sld"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="form-control input-sm"
                      style={{ width: '100px', display: 'inline-block' }}
                    >
                      <option value="all">=강좌구분=</option>
                      <option value="5">3월</option>
                      <option value="6">26년 4월</option>
                      <option value="7">26년 5월</option>
                      <option value="8">26년 6월</option>
                      <option value="9">26년 7월</option>
                      <option value="10">26년 8월</option>
                      <option value="11">26년 9월</option>
                    </select>

                    <select
                      name="slp"
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value)}
                      className="form-control input-sm"
                      style={{ width: '90px', display: 'inline-block' }}
                    >
                      <option value="all">=늘봄과정=</option>
                      <option value="1">방과후</option>
                      <option value="2">맞춤형</option>
                      <option value="3">돌봄</option>
                    </select>

                    <select
                      id="sel_lec_num"
                      name="sln"
                      value={selectedLec}
                      onChange={(e) => setSelectedLec(e.target.value)}
                      className="form-control input-sm"
                      style={{ width: '220px', display: 'inline-block' }}
                    >
                      <option value="">=강좌전체=</option>
                      <option value="1552375">[26년 8월] (금) 돌봄 4부(돌봄전담사,19명)</option>
                      <option value="1552291">[26년 8월] (금)돌봄 1부(돌봄전담사,5명)</option>
                      <option value="1552292">[26년 8월] (금)돌봄 2부(돌봄전담사,12명)</option>
                      <option value="1552293">[26년 8월] (금)돌봄 3부(돌봄전담사,20명)</option>
                      <option value="1552299">[26년 8월] 논술 1부(박지숙,17명)</option>
                    </select>

                    <select
                      name="sgr"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="form-control input-sm"
                      style={{ width: '70px', display: 'inline-block' }}
                    >
                      <option value="">=학년=</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>

                    <select
                      name="scl"
                      value={classNum}
                      onChange={(e) => setClassNum(e.target.value)}
                      className="form-control input-sm"
                      style={{ width: '60px', display: 'inline-block' }}
                    >
                      <option value="">=반=</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>

                    <select
                      name="st"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="form-control input-sm"
                      style={{ width: '80px', display: 'inline-block' }}
                    >
                      <option value="app_mem_name">이름</option>
                      <option value="tel">연락처</option>
                    </select>

                    <input
                      type="text"
                      name="sw"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="검색어"
                      className="form-control input-sm"
                      style={{ width: '120px', display: 'inline-block' }}
                    />

                    <button className="btn btn-default btn-sm" onClick={fetchApplicants}>검색</button>
                    <button
                      className="btn btn-default btn-sm"
                      onClick={() => {
                        setDivision('all');
                        setProgramType('all');
                        setSelectedLec('');
                        setGrade('');
                        setClassNum('');
                        setKeyword('');
                      }}
                    >
                      전체
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => alert('엑셀 출력이 시작됩니다.')}>검색결과출력</button>
                  </>
                )}
              </div>
            </div>

            {/* Action Bar Above Table */}
            <div className="panel-body" style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <div>
                <button className="btn btn-default btn-sm" onClick={() => alert('대기자목록으로 이동')}>대기자목록</button>
              </div>

              <div style={{ position: 'relative', display: 'flex', gap: '5px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => alert('신청자등록 페이지로 이동')}>신청자등록</button>
                <button
                  id="main_control_box_btn02"
                  className="btn btn-default btn-sm"
                  onClick={() => setIsExtraMenuOpen(!isExtraMenuOpen)}
                >
                  추가기능.. <i className={`fa fa-angle-${isExtraMenuOpen ? 'up' : 'down'}`}></i>
                </button>

                {isExtraMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '35px', background: '#fff', border: '1px solid #ccc', borderRadius: '3px', padding: '6px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <button className="btn btn-warning btn-xs" style={{ textAlign: 'left' }}>신청자일괄입력</button>
                    <button className="btn btn-warning btn-xs" style={{ textAlign: 'left' }}>수강료입력</button>
                    <button className="btn btn-info btn-xs" style={{ textAlign: 'left' }}>신청자복사</button>
                    <button className="btn btn-default btn-xs" style={{ textAlign: 'left' }}>추가/취소자조회</button>
                    <button className="btn btn-default btn-xs" style={{ textAlign: 'left' }}>미신청자목록</button>
                    <button className="btn btn-success btn-xs" style={{ textAlign: 'left' }}>신청결과엑셀출력</button>
                    <button className="btn btn-success btn-xs" style={{ textAlign: 'left' }}>수강신청서출력</button>
                    <button className="btn btn-success btn-xs" style={{ textAlign: 'left' }}>고지서출력</button>
                    <button className="btn btn-success btn-xs" style={{ textAlign: 'left' }}>시간표출력</button>
                  </div>
                )}
              </div>
            </div>

            {/* Applicant Data Table */}
            <div style={{ overflowX: 'auto', borderTop: '1px solid #ddd' }}>
              <table className="table table-hover table-bordered" style={{ width: '100%', margin: 0, textAlign: 'center', verticalAlign: 'middle', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', color: '#444', height: '36px' }}>
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === applicants.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={{ width: '50px', textAlign: 'center' }}>연번</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>구분<br />(늘봄과정)</th>
                    <th style={{ textAlign: 'left', paddingLeft: '10px' }}>강좌명</th>
                    <th style={{ width: '45px', textAlign: 'center' }}>학년</th>
                    <th style={{ width: '45px', textAlign: 'center' }}>반</th>
                    <th style={{ width: '50px', textAlign: 'center' }}>번호</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>이름</th>
                    <th style={{ width: '170px', textAlign: 'center' }}>연락처</th>
                    <th style={{ width: '65px', textAlign: 'center' }}>수강료</th>
                    <th style={{ width: '65px', textAlign: 'center' }}>수용비</th>
                    <th style={{ width: '65px', textAlign: 'center' }}>강사료</th>
                    <th style={{ width: '65px', textAlign: 'center' }}>교재비</th>
                    <th style={{ width: '65px', textAlign: 'center' }}>재료비</th>
                    <th style={{ width: '65px', textAlign: 'center' }}>합계</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>등록일자</th>
                    <th style={{ width: '45px', textAlign: 'center' }}>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan="17" style={{ padding: '30px', color: '#888' }}>
                        검색된 신청 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    applicants.map((item) => (
                      <tr key={item.app_num} style={{ height: '40px', background: item.draw_first ? '#fff9e6' : '#fff' }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.app_num)}
                            onChange={() => handleSelectRow(item.app_num)}
                          />
                        </td>
                        <td>{item.seq}</td>
                        <td>
                          {item.division_name}
                          <br />
                          <span style={{ fontSize: '11px', color: '#337ab7', fontWeight: 'bold' }}>
                            [{item.program_name}]
                          </span>
                        </td>
                        <td style={{ textAlign: 'left', paddingLeft: '10px' }}>
                          {item.lec_name}
                        </td>
                        <td>{item.grade}</td>
                        <td>{item.class_num}</td>
                        <td>{item.bunho}</td>
                        <td style={{ position: 'relative' }}>
                          <span style={{ fontWeight: 'bold', color: '#337ab7' }}>{item.student_name}</span>
                          <a
                            href="#none"
                            onClick={(e) => { e.preventDefault(); handleOpenSchedule(item); }}
                            style={{ position: 'absolute', right: '4px', top: '4px', color: '#777' }}
                            title="시간표 보기"
                          >
                            <i className="fa fa-list-alt"></i>
                          </a>
                        </td>
                        <td style={{ position: 'relative', fontSize: '11px', textAlign: 'left', paddingLeft: '8px' }}>
                          <div>
                            {item.stu_hp && <span>{item.stu_hp}</span>}
                            {item.parent_hp && (
                              <div style={{ color: '#666' }}>
                                {item.parent_hp} ({item.parent_name || '보호자'})
                              </div>
                            )}
                          </div>
                          <a
                            href="#none"
                            onClick={(e) => { e.preventDefault(); handleOpenContactEdit(item); }}
                            style={{ position: 'absolute', right: '4px', top: '4px', color: '#337ab7' }}
                            title="연락처 수정"
                          >
                            <i className="fa fa-pencil-square"></i>
                          </a>

                          {/* Inline Contact Popover Editor */}
                          {editingContactAppNum === item.app_num && (
                            <div style={{ position: 'absolute', top: '30px', left: '0', zIndex: 100, background: '#fff', border: '1px solid #337ab7', borderRadius: '4px', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: '240px' }}>
                              <div style={{ marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>학생 연락처:</div>
                              <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                                <select
                                  value={contactForm.mem_hp_1}
                                  onChange={(e) => setContactForm({ ...contactForm, mem_hp_1: e.target.value })}
                                  className="form-control input-sm"
                                  style={{ width: '65px', padding: '2px 4px' }}
                                >
                                  <option value="010">010</option>
                                  <option value="011">011</option>
                                  <option value="016">016</option>
                                </select>
                                <span>-</span>
                                <input
                                  type="text"
                                  maxLength="4"
                                  value={contactForm.mem_hp_2}
                                  onChange={(e) => setContactForm({ ...contactForm, mem_hp_2: e.target.value })}
                                  className="form-control input-sm"
                                  style={{ width: '50px', padding: '2px 4px' }}
                                />
                                <span>-</span>
                                <input
                                  type="text"
                                  maxLength="4"
                                  value={contactForm.mem_hp_3}
                                  onChange={(e) => setContactForm({ ...contactForm, mem_hp_3: e.target.value })}
                                  className="form-control input-sm"
                                  style={{ width: '50px', padding: '2px 4px' }}
                                />
                              </div>

                              <div style={{ marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>보호자 연락처 / 성함:</div>
                              <input
                                type="text"
                                placeholder="보호자 성함"
                                value={contactForm.parent_name}
                                onChange={(e) => setContactForm({ ...contactForm, parent_name: e.target.value })}
                                className="form-control input-sm"
                                style={{ marginBottom: '4px', padding: '2px 4px' }}
                              />
                              <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                                <select
                                  value={contactForm.parent_hp_1}
                                  onChange={(e) => setContactForm({ ...contactForm, parent_hp_1: e.target.value })}
                                  className="form-control input-sm"
                                  style={{ width: '65px', padding: '2px 4px' }}
                                >
                                  <option value="010">010</option>
                                  <option value="011">011</option>
                                  <option value="016">016</option>
                                </select>
                                <span>-</span>
                                <input
                                  type="text"
                                  maxLength="4"
                                  value={contactForm.parent_hp_2}
                                  onChange={(e) => setContactForm({ ...contactForm, parent_hp_2: e.target.value })}
                                  className="form-control input-sm"
                                  style={{ width: '50px', padding: '2px 4px' }}
                                />
                                <span>-</span>
                                <input
                                  type="text"
                                  maxLength="4"
                                  value={contactForm.parent_hp_3}
                                  onChange={(e) => setContactForm({ ...contactForm, parent_hp_3: e.target.value })}
                                  className="form-control input-sm"
                                  style={{ width: '50px', padding: '2px 4px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                <button className="btn btn-default btn-xs" onClick={() => setEditingContactAppNum(null)}>취소</button>
                                <button className="btn btn-primary btn-xs" onClick={() => handleSaveContact(item.app_num, item.mem_num)}>저장</button>
                              </div>
                            </div>
                          )}
                        </td>
                        <td>{item.tuition_fee.toLocaleString()}</td>
                        <td>{item.material_fee.toLocaleString()}</td>
                        <td>{item.instructor_fee.toLocaleString()}</td>
                        <td>{item.book_fee.toLocaleString()}</td>
                        <td>{item.item_fee.toLocaleString()}</td>
                        <td>{item.total_fee.toLocaleString()}</td>
                        <td style={{ fontSize: '11px', whiteSpace: 'pre-line' }}>{item.reg_date}</td>
                        <td>
                          <a
                            href="#none"
                            onClick={(e) => { e.preventDefault(); handleDeleteApplicant(item.app_num); }}
                            style={{ color: '#d9534f' }}
                            title="삭제"
                          >
                            <i className="fa fa-trash-o"></i>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Batch Actions & Pagination */}
            <div className="panel-footer" style={{ padding: '10px 15px', background: '#f8f9fa', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <select
                  value={batchAction}
                  onChange={(e) => setBatchAction(e.target.value)}
                  className="form-control input-sm"
                  style={{ width: '170px' }}
                >
                  <option value="">일괄적용: 선택하세요</option>
                  <option value="del">선택삭제</option>
                  <option value="move">신청자이동</option>
                  <option value="draw_first_Y">우선추첨대상자지정</option>
                  <option value="draw_first_N">우선추첨대상자제외</option>
                </select>
                <button className="btn btn-default btn-sm" onClick={handleBatchSubmit}>적용</button>
                <span style={{ color: '#777', marginLeft: '10px' }}>선택: {selectedIds.length}명 / 전체: {applicants.length}명</span>
              </div>

              <div className="pagination-wrap">
                <ul className="pagination" style={{ margin: 0, display: 'flex', gap: '3px', listStyle: 'none', padding: 0 }}>
                  <li><button className="btn btn-default btn-xs" disabled>&laquo;</button></li>
                  <li><button className="btn btn-primary btn-xs">1</button></li>
                  <li><button className="btn btn-default btn-xs" disabled>&raquo;</button></li>
                </ul>
              </div>
            </div>
          </div>

          <div id="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#888', fontSize: '11px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            Copyright ⓒ <a href="http://www.xmecca.com" target="_blank" rel="noreferrer" style={{ color: '#666', fontWeight: 'bold' }}>xmecca.com</a> All Rights Reserved.
            <br />
            <i className="fa fa-envelope"></i> dbdbschool@naver.com
          </div>
        </div>
      </div>

      {/* Student Schedule Timetable Modal */}
      {scheduleModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div style={{ background: '#fff', borderRadius: '5px', width: '500px', maxWidth: '90%', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            <div style={{ background: '#337ab7', color: '#fff', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '15px' }}><i className="fa fa-calendar"></i> 수강 시간표 ({scheduleModal.studentName})</h4>
              <button onClick={() => setScheduleModal({ ...scheduleModal, isOpen: false })} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>
                <strong>학생 정보:</strong> {scheduleModal.grade}학년 {scheduleModal.classNum}반 {scheduleModal.bunho}번 {scheduleModal.studentName}
              </p>
              <table className="table table-bordered" style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th>요일</th>
                    <th>교시/시간</th>
                    <th>강좌명</th>
                    <th>강의실</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleModal.schedule.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 'bold', color: '#337ab7' }}>{row.day}</td>
                      <td>{row.period}</td>
                      <td>{row.lec_name}</td>
                      <td>{row.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 15px', background: '#f5f5f5', textAlign: 'right' }}>
              <button className="btn btn-default btn-sm" onClick={() => setScheduleModal({ ...scheduleModal, isOpen: false })}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
