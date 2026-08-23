'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdminTable, Column } from '@/components/common/AdminTable';
import { AdminFilterBar, FilterSelectField } from '@/components/common/AdminFilterBar';
import { AdminModal } from '@/components/common/AdminModal';
import { AdminForm, FormField } from '@/components/common/AdminForm';

export interface Lecture {
  id: string;
  category: string;
  neulbomType?: string;
  title: string;
  instructor: string;
  teacherId?: string;
  targetGrade: string;
  enrolledCount: number;
  capacity: number;
  waitingCount: number;
  waitingCapacity: number;
  tuitionFee: number;
  costInstructor?: number;
  costFacility?: number;
  materialFee: number;
  textbookFee?: number;
  dayOfWeek: string;
  scheduleTime: string;
  totalHours?: number;
  location?: string;
  instructorClosed?: boolean;
  status: 'OUTPUT' | 'CLOSED' | 'WAITING';
  allowTimeConflict?: boolean;
}

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function CourseManagementPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';

  // 1. Data States
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [schoolName, setSchoolName] = useState<string>('운천초등학교');

  // 2. Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [neulbomFilter, setNeulbomFilter] = useState<string>('전체');
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  const [gradeFilter, setGradeFilter] = useState<string>('전체');
  const [searchType, setSearchType] = useState<string>('강좌명');
  const [keyword, setKeyword] = useState<string>('');

  // 3. Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isBatchUploadModalOpen, setIsBatchUploadModalOpen] = useState<boolean>(false);
  const [isBatchCopyModalOpen, setIsBatchCopyModalOpen] = useState<boolean>(false);
  const [isSingleCopyModalOpen, setIsSingleCopyModalOpen] = useState<boolean>(false);
  const [targetCourseForCopy, setTargetCourseForCopy] = useState<Lecture | null>(null);

  // 4. Form Data for Add Modal
  const [addFormData, setAddFormData] = useState<Record<string, any>>({
    category: '2026년 1분기',
    neulbomType: '방과후',
    title: '',
    instructor: '',
    targetGrade: '전학년',
    capacity: 20,
    waitingCapacity: 5,
    tuitionFee: 35000,
    materialFee: 0,
    textbookFee: 0,
    dayOfWeek: '월',
    scheduleTime: '14:00~14:50',
    totalHours: 12,
    location: '방과후 교실 101호',
  });

  // Batch Upload Text
  const [batchUploadCsv, setBatchUploadCsv] = useState<string>('');

  // Batch Copy Form
  const [batchCopyData, setBatchCopyData] = useState({
    sourceCategory: '2026년 1분기',
    targetCategory: '2026년 2분기',
    copyFees: true,
  });

  // Single Copy Form
  const [singleCopyTitle, setSingleCopyTitle] = useState<string>('');
  const [singleCopyCategory, setSingleCopyCategory] = useState<string>('2026년 2분기');

  // Load Course List from backend API
  const fetchLectures = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: categoryFilter,
        status: statusFilter,
        keyword: keyword,
      });

      const res = await fetch(`/api/af/ad_lec/lists/sn/${schoolId}?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.lectures)) {
        let list = json.lectures as Lecture[];

        // Frontend secondary filtering
        if (neulbomFilter !== '전체') {
          list = list.filter((l) => l.neulbomType === neulbomFilter);
        }
        if (gradeFilter !== '전체') {
          list = list.filter((l) => l.targetGrade.includes(gradeFilter));
        }

        setLectures(list);
        if (json.school?.name) setSchoolName(json.school.name);
      }
    } catch (e) {
      console.error('Failed to fetch lectures:', e);
    } finally {
      setLoading(false);
    }
  }, [schoolId, categoryFilter, statusFilter, neulbomFilter, gradeFilter, keyword]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(lectures.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Status Change Batch
  const handleBatchStatusChange = async (status: 'OUTPUT' | 'CLOSED' | 'WAITING') => {
    if (selectedIds.length === 0) {
      alert('상태를 변경할 강좌를 1개 이상 선택하세요.');
      return;
    }

    try {
      const res = await fetch('/api/af/ad_lec/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          courseIds: selectedIds,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchLectures();
        setSelectedIds([]);
      }
    } catch (e) {
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  // Instructor Lock Toggle
  const handleToggleInstructorClose = async (courseId: string) => {
    try {
      const res = await fetch('/api/af/ad_lec/instructor-close', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, courseId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLectures();
      }
    } catch (e) {
      alert('강사 마감 변경 중 오류가 발생했습니다.');
    }
  };

  // Add Course Submit
  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/af/ad_lec/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          ...addFormData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsAddModalOpen(false);
        fetchLectures();
      } else {
        alert(data.message || '등록 실패');
      }
    } catch (e) {
      alert('강좌 등록 중 오류 발생');
    }
  };

  // Single Course Copy Submit
  const handleSingleCopySubmit = async () => {
    if (!targetCourseForCopy) return;
    try {
      const res = await fetch('/api/af/ad_lec/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          courseId: targetCourseForCopy.id,
          overrides: {
            title: singleCopyTitle || `${targetCourseForCopy.title} (복사본)`,
            category: singleCopyCategory,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsSingleCopyModalOpen(false);
        fetchLectures();
      }
    } catch (e) {
      alert('강좌 복사 중 오류 발생');
    }
  };

  // Batch Copy Submit
  const handleBatchCopySubmit = async () => {
    try {
      const res = await fetch('/api/af/ad_lec/batch-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          sourceCategory: batchCopyData.sourceCategory,
          targetCategory: batchCopyData.targetCategory,
          copyFees: batchCopyData.copyFees,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsBatchCopyModalOpen(false);
        fetchLectures();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('일괄 복사 중 오류 발생');
    }
  };

  // Batch Upload Submit
  const handleBatchUploadSubmit = async () => {
    if (!batchUploadCsv.trim()) {
      alert('CSV/엑셀 데이터를 입력하세요.');
      return;
    }

    const rows = batchUploadCsv
      .trim()
      .split('\n')
      .map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          category: parts[0] || '2026년 1분기',
          title: parts[1] || '임시강좌명',
          instructor: parts[2] || '강사명',
          targetGrade: parts[3] || '전학년',
          capacity: parseInt(parts[4]) || 20,
          waitingCapacity: parseInt(parts[5]) || 5,
          tuitionFee: parseInt(parts[6]) || 30000,
          materialFee: parseInt(parts[7]) || 0,
          dayOfWeek: parts[8] || '월',
          scheduleTime: parts[9] || '14:00~14:50',
          location: parts[10] || '방과후 교실',
        };
      });

    try {
      const res = await fetch('/api/af/ad_lec/batch-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, rows }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsBatchUploadModalOpen(false);
        setBatchUploadCsv('');
        fetchLectures();
      }
    } catch (e) {
      alert('일괄 등록 중 오류 발생');
    }
  };

  // Run Lottery
  const handleRunLottery = async (courseId: string) => {
    if (!confirm('해당 강좌의 우선순위/대기자 추첨을 실행하시겠습니까?')) return;
    try {
      const res = await fetch('/api/af/ad_lec/lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, courseId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || '추첨이 완료되었습니다.');
        fetchLectures();
      }
    } catch (e) {
      alert('추첨 처리 중 오류 발생');
    }
  };

  // Filter Bar Selects
  const filterSelects: FilterSelectField[] = [
    {
      id: 'category',
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: '전체', label: '전체 구분' },
        { value: '26년 8월', label: '26년 8월' },
        { value: '26년 9월', label: '26년 9월' },
        { value: '2026년 1분기', label: '2026년 1분기' },
      ],
    },
    {
      id: 'neulbom',
      value: neulbomFilter,
      onChange: setNeulbomFilter,
      options: [
        { value: '전체', label: '=늘봄과정=' },
        { value: '방과후', label: '방과후' },
        { value: '맞춤형', label: '맞춤형' },
        { value: '돌봄', label: '돌봄' },
      ],
    },
    {
      id: 'status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: '전체', label: '=상태전체=' },
        { value: 'OUTPUT', label: '출력' },
        { value: 'CLOSED', label: '종료' },
        { value: 'WAITING', label: '대기' },
      ],
    },
    {
      id: 'grade',
      value: gradeFilter,
      onChange: setGradeFilter,
      options: [
        { value: '전체', label: '=학년=' },
        { value: '1', label: '1학년' },
        { value: '2', label: '2학년' },
        { value: '3', label: '3학년' },
      ],
    },
  ];

  // Table Columns Definition
  const columns: Column<Lecture>[] = [
    {
      key: 'index',
      header: '연번',
      width: '45px',
      align: 'center',
      render: (_, idx) => idx + 1,
    },
    {
      key: 'category',
      header: '구분(늘봄과정)',
      width: '110px',
      align: 'center',
      render: (item) => (
        <span style={{ fontWeight: 600, color: '#475569' }}>
          {item.category}
          {item.neulbomType ? ` (${item.neulbomType})` : ''}
        </span>
      ),
    },
    {
      key: 'title',
      header: '강좌명',
      align: 'left',
      render: (item) => (
        <div>
          <Link
            href={`/af/ad_lec/view/${item.id}/sn/${schoolId}`}
            style={{ fontWeight: 700, color: '#1e293b', textDecoration: 'none' }}
          >
            {item.title}
          </Link>
          {item.allowTimeConflict && (
            <span style={{ fontSize: '0.75rem', color: '#8b5cf6', display: 'block' }}>
              [시간중복허용]
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'instructor',
      header: '강사명',
      width: '90px',
      align: 'center',
      render: (item) => `${item.instructor} (${item.teacherId || 'inst'})`,
    },
    {
      key: 'targetGrade',
      header: '대상학년',
      width: '75px',
      align: 'center',
    },
    {
      key: 'capacity',
      header: '신청/정원',
      width: '95px',
      align: 'center',
      render: (item) => (
        <span>
          <strong>{item.enrolledCount}</strong>/{item.capacity}
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            (대기 {item.waitingCount}/{item.waitingCapacity})
          </div>
        </span>
      ),
    },
    {
      key: 'tuitionFee',
      header: '수강료',
      width: '120px',
      align: 'right',
      render: (item) => {
        const costInst = item.costInstructor ?? Math.round(item.tuitionFee * 0.8);
        const costFac = item.costFacility ?? Math.round(item.tuitionFee * 0.2);
        return (
          <div>
            <strong>{item.tuitionFee.toLocaleString()}원</strong>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              강사: <span style={{ color: '#16a34a' }}>{costInst.toLocaleString()}</span> / 수용: <span style={{ color: '#2563eb' }}>{costFac.toLocaleString()}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'fees',
      header: '교재/재료비',
      width: '100px',
      align: 'right',
      render: (item) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div>재료: {item.materialFee.toLocaleString()}원</div>
          {item.textbookFee ? <div>교재: {item.textbookFee.toLocaleString()}원</div> : null}
        </div>
      ),
    },
    {
      key: 'schedule',
      header: '강의시간',
      width: '130px',
      align: 'center',
      render: (item) => (
        <div>
          {item.dayOfWeek} {item.scheduleTime}
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            ({item.totalHours || 12}시수 / {item.location || '교실'})
          </div>
        </div>
      ),
    },
    {
      key: 'instructorClose',
      header: '강사마감',
      width: '75px',
      align: 'center',
      render: (item) => (
        <button
          onClick={() => handleToggleInstructorClose(item.id)}
          style={{
            padding: '3px 8px',
            fontSize: '0.78rem',
            borderRadius: '3px',
            border: 'none',
            cursor: 'pointer',
            background: item.instructorClosed ? '#ef4444' : '#10b981',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {item.instructorClosed ? '마감됨' : '진행중'}
        </button>
      ),
    },
    {
      key: 'status',
      header: '상태',
      width: '65px',
      align: 'center',
      render: (item) => {
        const badgeColors = {
          OUTPUT: { bg: '#dbeafe', text: '#1d4ed8', label: '출력' },
          CLOSED: { bg: '#fee2e2', text: '#b91c1c', label: '종료' },
          WAITING: { bg: '#fef3c7', text: '#b45309', label: '대기' },
        };
        const st = badgeColors[item.status] || badgeColors.OUTPUT;
        return (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: st.bg,
              color: st.text,
            }}
          >
            {st.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '관리',
      width: '140px',
      align: 'center',
      render: (item) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              setTargetCourseForCopy(item);
              setSingleCopyTitle(`${item.title} (2분기)`);
              setIsSingleCopyModalOpen(true);
            }}
            style={{
              padding: '3px 6px',
              fontSize: '0.78rem',
              border: '1px solid #cbd5e1',
              borderRadius: '3px',
              background: '#ffffff',
              cursor: 'pointer',
            }}
          >
            복사
          </button>
          <button
            onClick={() => handleRunLottery(item.id)}
            style={{
              padding: '3px 6px',
              fontSize: '0.78rem',
              border: '1px solid #8b5cf6',
              borderRadius: '3px',
              background: '#f5f3ff',
              color: '#7c3aed',
              cursor: 'pointer',
            }}
          >
            추첨
          </button>
          <Link
            href={`/af/ad_lec/edit/${item.id}/sn/${schoolId}`}
            style={{
              padding: '3px 6px',
              fontSize: '0.78rem',
              border: '1px solid #3b82f6',
              borderRadius: '3px',
              background: '#eff6ff',
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            수정
          </Link>
        </div>
      ),
    },
  ];

  // Add Form Field configs
  const addFormFields: FormField[] = [
    {
      name: 'category',
      label: '운영 구분',
      type: 'select',
      required: true,
      options: [
        { value: '26년 8월', label: '26년 8월' },
        { value: '26년 9월', label: '26년 9월' },
        { value: '2026년 1분기', label: '2026년 1분기' },
      ],
    },
    {
      name: 'neulbomType',
      label: '늘봄과정 분류',
      type: 'select',
      options: [
        { value: '방과후', label: '방과후' },
        { value: '맞춤형', label: '맞춤형' },
        { value: '돌봄', label: '돌봄' },
      ],
    },
    {
      name: 'title',
      label: '강좌명',
      type: 'text',
      required: true,
      placeholder: '예: [특기적성] 창의로봇 A반',
    },
    {
      name: 'instructor',
      label: '강사 성명',
      type: 'text',
      required: true,
      placeholder: '예: 홍길동',
    },
    {
      name: 'targetGrade',
      label: '대상 학년',
      type: 'text',
      required: true,
      placeholder: '1,2,3',
    },
    {
      name: 'capacity',
      label: '수강 정원',
      type: 'number',
      required: true,
    },
    {
      name: 'waitingCapacity',
      label: '대기 정원',
      type: 'number',
      required: true,
    },
    {
      name: 'tuitionFee',
      label: '수강료 (원)',
      type: 'number',
      required: true,
    },
    {
      name: 'materialFee',
      label: '재료비 (원)',
      type: 'number',
    },
    {
      name: 'textbookFee',
      label: '교재비 (원)',
      type: 'number',
    },
    {
      name: 'dayOfWeek',
      label: '강의 요일',
      type: 'text',
      required: true,
      placeholder: '월, 수, 금',
    },
    {
      name: 'scheduleTime',
      label: '강의 시간',
      type: 'text',
      required: true,
      placeholder: '14:00~14:50',
    },
    {
      name: 'location',
      label: '강의 장소',
      type: 'text',
      placeholder: '과학실 202호',
    },
  ];

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', background: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Top Header Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #2563eb', paddingBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚽ 강좌관리 (/af/ad_lec/lists)
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              {schoolName} 늘봄·방과후학교 통합 시스템 (SN: {schoolId})
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Link
              href={`/af/ad_faq/main/sn/${schoolId}`}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                border: '1px solid #2563eb',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              📖 매뉴얼
            </Link>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: '6px 14px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + 강좌 등록
            </button>
          </div>
        </div>

        {/* Notice Info Box */}
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '4px',
            padding: '10px 14px',
            fontSize: '0.85rem',
            color: '#1e40af',
            marginBottom: '14px',
            lineHeight: 1.5,
          }}
        >
          <strong>💡 안내:</strong> 수강신청 전 각 강좌의 상태를 <strong>"출력"</strong>으로 설정해야 학생/학부모 화면에 노출됩니다. 강좌 복사 시 수강료 및 시간표 설정이 대상 분기로 자동 이관됩니다.
        </div>

        {/* Filter Bar */}
        <AdminFilterBar
          selects={filterSelects}
          searchTypeOptions={[
            { value: '강좌명', label: '강좌명' },
            { value: '강사명', label: '강사명' },
          ]}
          searchTypeValue={searchType}
          onSearchTypeChange={setSearchType}
          keywordValue={keyword}
          onKeywordChange={setKeyword}
          onSearch={fetchLectures}
          onReset={() => {
            setCategoryFilter('전체');
            setNeulbomFilter('전체');
            setStatusFilter('전체');
            setGradeFilter('전체');
            setKeyword('');
            fetchLectures();
          }}
          extraActions={
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setIsBatchUploadModalOpen(true)}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                📥 강좌 일괄입력
              </button>
              <button
                onClick={() => setIsBatchCopyModalOpen(true)}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#0891b2',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                📋 강좌 일괄복사
              </button>
              <Link
                href={`/af/ad_lec/stats/sn/${schoolId}`}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#475569',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                📊 강좌 통계
              </Link>
            </div>
          }
        />

        {/* Bulk Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              선택 ({selectedIds.length}개) 일괄 상태변경:
            </span>
            <button
              onClick={() => handleBatchStatusChange('OUTPUT')}
              style={{
                padding: '3px 8px',
                fontSize: '0.78rem',
                borderRadius: '3px',
                border: '1px solid #93c5fd',
                background: '#eff6ff',
                color: '#1d4ed8',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              출력으로 변경
            </button>
            <button
              onClick={() => handleBatchStatusChange('CLOSED')}
              style={{
                padding: '3px 8px',
                fontSize: '0.78rem',
                borderRadius: '3px',
                border: '1px solid #fca5a5',
                background: '#fef2f2',
                color: '#b91c1c',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              종료로 변경
            </button>
            <button
              onClick={() => handleBatchStatusChange('WAITING')}
              style={{
                padding: '3px 8px',
                fontSize: '0.78rem',
                borderRadius: '3px',
                border: '1px solid #fde68a',
                background: '#fffbeb',
                color: '#b45309',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              대기로 변경
            </button>
          </div>
        </div>

        {/* Course Data Table */}
        <AdminTable<Lecture>
          columns={columns}
          data={lectures}
          keyField="id"
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          loading={loading}
          totalCount={lectures.length}
        />
      </div>

      {/* 1. Modal: Add Course */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ 방과후학교/늘봄 강좌 신규 등록"
        maxWidth="680px"
      >
        <AdminForm
          fields={addFormFields}
          formData={addFormData}
          onChange={(name, val) => setAddFormData((prev) => ({ ...prev, [name]: val }))}
          onSubmit={handleAddCourseSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="강좌 등록 완료"
        />
      </AdminModal>

      {/* 2. Modal: Batch Upload */}
      <AdminModal
        isOpen={isBatchUploadModalOpen}
        onClose={() => setIsBatchUploadModalOpen(false)}
        title="📥 23개 표준 컬럼 강좌 일괄등록 (CSV/엑셀)"
        maxWidth="700px"
        onConfirm={handleBatchUploadSubmit}
        confirmLabel="일괄등록 실행"
      >
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
          * 구분, 강좌명, 강사명, 학년, 정원, 대기정원, 수강료, 재료비, 요일, 시간, 장소 순으로 쉼표(,) 구분하여 입력하세요.
        </div>
        <textarea
          rows={8}
          value={batchUploadCsv}
          onChange={(e) => setBatchUploadCsv(e.target.value)}
          placeholder="2026년 1분기, [특기] 바이올린 A반, 홍길동, 1-3학년, 20, 5, 35000, 5000, 월, 14:00~14:50, 음악실"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '0.82rem',
            fontFamily: 'monospace',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            lineHeight: 1.5,
          }}
        />
      </AdminModal>

      {/* 3. Modal: Batch Copy */}
      <AdminModal
        isOpen={isBatchCopyModalOpen}
        onClose={() => setIsBatchCopyModalOpen(false)}
        title="📋 이전 분기 강좌 일괄복사"
        maxWidth="500px"
        onConfirm={handleBatchCopySubmit}
        confirmLabel="일괄복사 실행"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>원본 강좌 구분</label>
            <input
              type="text"
              value={batchCopyData.sourceCategory}
              onChange={(e) => setBatchCopyData((prev) => ({ ...prev, sourceCategory: e.target.value }))}
              style={{ width: '100%', height: '32px', padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>대상 강좌 구분 (신규 분기)</label>
            <input
              type="text"
              value={batchCopyData.targetCategory}
              onChange={(e) => setBatchCopyData((prev) => ({ ...prev, targetCategory: e.target.value }))}
              style={{ width: '100%', height: '32px', padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={batchCopyData.copyFees}
                onChange={(e) => setBatchCopyData((prev) => ({ ...prev, copyFees: e.target.checked }))}
              />
              {' '}수강료 및 시간표 설정값 동시 복제
            </label>
          </div>
        </div>
      </AdminModal>

      {/* 4. Modal: Single Course Copy */}
      <AdminModal
        isOpen={isSingleCopyModalOpen}
        onClose={() => setIsSingleCopyModalOpen(false)}
        title="단일 강좌 복제"
        maxWidth="480px"
        onConfirm={handleSingleCopySubmit}
        confirmLabel="복사 완료"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>신규 강좌명</label>
            <input
              type="text"
              value={singleCopyTitle}
              onChange={(e) => setSingleCopyTitle(e.target.value)}
              style={{ width: '100%', height: '32px', padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '3px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>대상 구분</label>
            <input
              type="text"
              value={singleCopyCategory}
              onChange={(e) => setSingleCopyCategory(e.target.value)}
              style={{ width: '100%', height: '32px', padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '3px' }}
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
