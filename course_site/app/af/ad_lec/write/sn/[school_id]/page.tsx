'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminForm, FormField } from '@/components/common/AdminForm';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function CourseCreatePage({ params }: PageProps) {
  const router = useRouter();
  const schoolId = params?.school_id || '3267';
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Record<string, any>>({
    category: '2026년 1분기',
    neulbomType: '방과후',
    title: '',
    instructor: '',
    targetGrade: '1,2,3',
    capacity: 20,
    waitingCapacity: 5,
    tuitionFee: 35000,
    materialFee: 0,
    textbookFee: 0,
    dayOfWeek: '월',
    scheduleTime: '14:00~14:50',
    location: '방과후 교실 101호',
  });

  const fields: FormField[] = [
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
      placeholder: '예: [특기적성] 창의로봇교실 A반',
    },
    {
      name: 'instructor',
      label: '강사명',
      type: 'text',
      required: true,
      placeholder: '예: 김선생',
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
      label: '수강 정원 (명)',
      type: 'number',
      required: true,
    },
    {
      name: 'waitingCapacity',
      label: '대기 정원 (명)',
      type: 'number',
      required: true,
    },
    {
      name: 'tuitionFee',
      label: '수강료 (원)',
      type: 'number',
      required: true,
      helperText: '※ 수강료 입력 시 강사료(80%) 및 학교 수용비(20%)가 자동 분할 산출됩니다.',
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
      label: '강의 장소 (교실)',
      type: 'text',
      placeholder: '별관 3층 과학실',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/af/ad_lec/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        router.push(`/af/ad_lec/lists/sn/${schoolId}`);
      } else {
        alert(data.message || '등록 실패');
      }
    } catch (e) {
      alert('강좌 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #2563eb', paddingBottom: '12px' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            ➕ 방과후학교/늘봄 강좌 신규 등록 (/write)
          </h1>
          <Link
            href={`/af/ad_lec/lists/sn/${schoolId}`}
            style={{
              padding: '6px 12px',
              backgroundColor: '#475569',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← 강좌 목록으로
          </Link>
        </div>

        <AdminForm
          fields={fields}
          formData={formData}
          onChange={(name, val) => setFormData((prev) => ({ ...prev, [name]: val }))}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/af/ad_lec/lists/sn/${schoolId}`)}
          submitLabel="강좌 등록 완료"
          loading={loading}
        />
      </div>
    </div>
  );
}
