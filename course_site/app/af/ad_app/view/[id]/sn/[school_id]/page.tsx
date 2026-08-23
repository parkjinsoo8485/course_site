'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: { school_id: string; id: string };
}

const MOCK_APP = {
  id: 'app_1',
  num: 5,
  studentName: '이수아',
  grade: '3', className: '2',
  studentNum: '20260302',
  birthDate: '2017-03-15',
  parentName: '이미경',
  phone1: '010', phone2: '3311', phone3: '2244',
  courseTitle: '[늘봄] AI 로봇 코딩 교실',
  courseId: 'crs_1',
  fee: 0,
  feeStatus: '면제',
  appDate: '2026-03-04',
  status: '신청',
  memo: '늘봄 지원 대상자 1순위',
  bankingGroup: '늘봄_코딩1',
};

export default function AppViewPage({ params }: PageProps) {
  const router = useRouter();
  const schoolId = params?.school_id || '3267';
  const id = params?.id || 'app_1';

  // In production this would fetch from store
  const app = MOCK_APP;

  const thStyle: React.CSSProperties = { width: 150, background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333', fontSize: '0.87rem', borderBottom: '1px solid #e7e7e7' };
  const tdStyle: React.CSSProperties = { padding: '10px 16px', borderBottom: '1px solid #e7e7e7', fontSize: '0.87rem', color: '#333' };

  return (
    <div style={{ padding: '20px 24px', fontFamily: '"맑은 고딕", Malgun Gothic, sans-serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4791d2', paddingBottom: 10, marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#333', margin: 0 }}>
          <i className="fa fa-id-card" style={{ color: '#4791d2', marginRight: 6 }}></i> 신청자 상세 정보
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link href={`/af/ad_app/edit/${id}/sn/${schoolId}`} style={{ padding: '6px 14px', background: '#f0ad4e', color: '#fff', borderRadius: 3, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>수정</Link>
          <Link href={`/af/ad_app/lists/sn/${schoolId}`} style={{ padding: '6px 14px', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: 3, textDecoration: 'none', fontSize: '0.85rem' }}>목록</Link>
        </div>
      </div>

      {/* 학생/신청 정보 */}
      <div style={{ border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ background: '#4791d2', color: '#fff', padding: '8px 16px', fontWeight: 700, fontSize: '0.9rem' }}>📋 수강신청 정보</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <th style={thStyle}>강좌명</th>
              <td style={{ ...tdStyle, fontWeight: 700 }} colSpan={3}>
                <Link href={`/af/ad_lec/view/${app.courseId}/sn/${schoolId}`} style={{ color: '#428bca' }}>{app.courseTitle}</Link>
              </td>
            </tr>
            <tr>
              <th style={thStyle}>학생명</th>
              <td style={tdStyle}><strong>{app.studentName}</strong></td>
              <th style={thStyle}>학번</th>
              <td style={tdStyle}>{app.studentNum}</td>
            </tr>
            <tr>
              <th style={thStyle}>학년/반</th>
              <td style={tdStyle}>{app.grade}학년 {app.className}반</td>
              <th style={thStyle}>생년월일</th>
              <td style={tdStyle}>{app.birthDate}</td>
            </tr>
            <tr>
              <th style={thStyle}>학부모명</th>
              <td style={tdStyle}>{app.parentName}</td>
              <th style={thStyle}>연락처</th>
              <td style={tdStyle}>{app.phone1}-{app.phone2}-{app.phone3}</td>
            </tr>
            <tr>
              <th style={thStyle}>수강료</th>
              <td style={tdStyle}>
                {app.fee === 0 ? <span style={{ color: '#16a34a', fontWeight: 700 }}>무상(면제)</span> : `${app.fee.toLocaleString()}원`}
              </td>
              <th style={thStyle}>납부상태</th>
              <td style={tdStyle}>
                <span style={{ color: app.feeStatus === '납부' ? '#16a34a' : app.feeStatus === '미납' ? '#dc2626' : '#7c3aed', fontWeight: 700 }}>
                  {app.feeStatus}
                </span>
              </td>
            </tr>
            <tr>
              <th style={thStyle}>신청일</th>
              <td style={tdStyle}>{app.appDate}</td>
              <th style={thStyle}>신청상태</th>
              <td style={tdStyle}>
                <span style={{ color: app.status === '신청' ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: '1rem' }}>{app.status}</span>
              </td>
            </tr>
            {app.memo && (
              <tr>
                <th style={thStyle}>메모</th>
                <td style={tdStyle} colSpan={3}>{app.memo}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 스쿨뱅킹 이력 섹션 */}
      <div style={{ border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ background: '#5cb85c', color: '#fff', padding: '8px 16px', fontWeight: 700, fontSize: '0.9rem' }}>🏦 스쿨뱅킹 수납 이력</div>
        <div style={{ padding: '20px 16px', color: '#888', fontSize: '0.87rem', textAlign: 'center' }}>
          해당 학생의 스쿨뱅킹 수납 이력이 없습니다.<br />
          <span style={{ fontSize: '0.8rem' }}>납부가 완료되면 이 영역에 수납일자 및 금액이 자동 반영됩니다.</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button onClick={() => window.print()} style={{ padding: '7px 20px', background: '#f0ad4e', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>📄 수강신청서 출력</button>
        <Link href={`/af/ad_app/lists/sn/${schoolId}`} style={{ padding: '7px 20px', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: 4, textDecoration: 'none', fontSize: '0.88rem', display: 'inline-block' }}>목록</Link>
      </div>
    </div>
  );
}
