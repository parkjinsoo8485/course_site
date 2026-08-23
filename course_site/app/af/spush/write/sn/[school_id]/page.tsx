'use client';

import React from 'react';
import Link from 'next/link';

interface PageProps {
  params: {
    school_id: string;
    id?: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #3b82f6', paddingBottom: '12px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            타겟팅 푸시 알림 전송
          </h1>
          <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '4px' }}>
            학교 SN: {params?.school_id || '3267'} {params?.id ? ` | ID: ${params.id}` : ''}
          </span>
        </div>

        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '24px' }}>
          본 페이지는 디비디비스쿨 방과후학교 관리자 시스템 <strong>타겟팅 푸시 알림 전송</strong> 전용 서브 페이지 스캐폴딩입니다.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#475569',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            ← 뒤로가기
          </button>
          <Link
            href={`/af/ad_lec/lists/sn/${params?.school_id || '3267'}`}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'inline-block'
            }}
          >
            강좌관리 메인으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
