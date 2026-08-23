'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
    id: string;
  };
}

export default function CourseViewPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const courseId = params?.id;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourseDetail() {
      try {
        const res = await fetch(`/api/af/ad_lec/lists/sn/${schoolId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.lectures)) {
          const found = data.lectures.find((c: any) => String(c.id) === String(courseId)) || data.lectures[0];
          setCourse(found);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCourseDetail();
  }, [schoolId, courseId]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>강좌 상세정보를 불러오는 중입니다...</div>;
  }

  if (!course) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>해당 강좌를 찾을 수 없습니다.</div>;
  }

  const costInstructor = course.costInstructor ?? Math.round(course.tuitionFee * 0.8);
  const costFacility = course.costFacility ?? Math.round(course.tuitionFee * 0.2);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #2563eb', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              {course.category} {course.neulbomType ? `| ${course.neulbomType}` : ''}
            </span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: '6px 0 0 0' }}>
              {course.title}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href={`/af/ad_lec/edit/${course.id}/sn/${schoolId}`}
              style={{
                padding: '6px 14px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              수정하기
            </Link>
            <Link
              href={`/af/ad_lec/lists/sn/${schoolId}`}
              style={{
                padding: '6px 14px',
                backgroundColor: '#475569',
                color: '#ffffff',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              목록으로
            </Link>
          </div>
        </div>

        {/* Course Info Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ width: '160px', padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>강사명</td>
              <td style={{ padding: '10px 14px' }}>{course.instructor} ({course.teacherId || 'inst'})</td>
              <td style={{ width: '160px', padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>대상 학년</td>
              <td style={{ padding: '10px 14px' }}>{course.targetGrade}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>정원 및 현황</td>
              <td style={{ padding: '10px 14px' }}>
                신청: <strong>{course.enrolledCount}</strong> / {course.capacity}명 (대기: {course.waitingCount}/{course.waitingCapacity}명)
              </td>
              <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>출력 상태</td>
              <td style={{ padding: '10px 14px' }}>
                <span style={{ fontWeight: 700, color: course.status === 'OUTPUT' ? '#2563eb' : '#ef4444' }}>
                  {course.status === 'OUTPUT' ? '출력중 (학생 노출)' : '종료/대기'}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>수강료 총액</td>
              <td style={{ padding: '10px 14px' }}>
                <strong>{course.tuitionFee?.toLocaleString()}원</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '8px' }}>
                  (강사료: {costInstructor.toLocaleString()}원, 수용비: {costFacility.toLocaleString()}원)
                </span>
              </td>
              <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>교재/재료비</td>
              <td style={{ padding: '10px 14px' }}>
                재료비: {course.materialFee?.toLocaleString() || 0}원 / 교재비: {course.textbookFee?.toLocaleString() || 0}원
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>강의 요일 및 시간</td>
              <td style={{ padding: '10px 14px' }}>{course.dayOfWeek}요일 {course.scheduleTime} ({course.totalHours || 12}시수)</td>
              <td style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>강의 장소</td>
              <td style={{ padding: '10px 14px' }}>{course.location || '방과후 교실'}</td>
            </tr>
          </tbody>
        </table>

        {/* Action Link shortcuts */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Link
            href={`/af/ad_app/lists/sn/${schoolId}`}
            style={{
              padding: '8px 18px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            👥 수강 신청자 명단 확인
          </Link>
          <Link
            href={`/af/ad_att/stat/sn/${schoolId}`}
            style={{
              padding: '8px 18px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            📋 출석부 기록 조회
          </Link>
        </div>
      </div>
    </div>
  );
}
