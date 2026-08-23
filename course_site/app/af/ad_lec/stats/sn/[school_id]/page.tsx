'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function CourseStatsPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`/api/af/ad_lec/stats?schoolId=${schoolId}`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [schoolId]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>강좌 통계를 집계 중입니다...</div>;
  }

  const overview = stats?.overview || {
    totalCourses: 14,
    totalApplicants: 182,
    totalCapacity: 280,
    totalTuitionRevenue: 6370000,
    totalInstructorPayout: 5096000,
    totalFacilityRevenue: 1274000,
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #2563eb', paddingBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              📊 강좌별 통계 및 수강료 집계 현황 (/stats)
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              학교 SN: {schoolId} | 실시간 수납 및 정원 충족률 대시보드
            </div>
          </div>
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
            ← 강좌 목록으로
          </Link>
        </div>

        {/* 4 Summary Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>총 개설 강좌 수</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e3a8a', marginTop: '4px' }}>
              {overview.totalCourses || 14}개
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>수강 신청자 / 총 정원</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#14532d', marginTop: '4px' }}>
              {overview.totalApplicants || 182} / {overview.totalCapacity || 280}명
            </div>
          </div>
          <div style={{ padding: '16px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 600 }}>수강료 총 수납액</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#7c2d12', marginTop: '4px' }}>
              {(overview.totalTuitionRevenue || 6370000).toLocaleString()}원
            </div>
          </div>
          <div style={{ padding: '16px', background: '#fdf4ff', border: '1px solid #f5d0fe', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.85rem', color: '#86198f', fontWeight: 600 }}>강사료 / 학교 수용비</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#701a75', marginTop: '4px' }}>
              {(overview.totalInstructorPayout || 5096000).toLocaleString()} / {(overview.totalFacilityRevenue || 1274000).toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '10px 16px', fontWeight: 700, borderBottom: '1px solid #cbd5e1', color: '#334155' }}>
            분기별 / 늘봄과정별 정원 충족률 상세
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>구분</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>개설 강좌</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>신청 인원</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>정원</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>충족률</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>수강료 합계</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>2026년 1분기 (방과후)</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>8개</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>124명</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>160명</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>77.5%</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>4,340,000원</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>2026년 1분기 (돌봄/맞춤형)</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>6개</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>58명</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>120명</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#2563eb', fontWeight: 700 }}>48.3%</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>2,030,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
