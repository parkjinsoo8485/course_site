'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: { school_id: string };
}

type AppStatus = '신청' | '취소' | '대기' | '환불';

interface Applicant {
  id: string;
  num: number;
  schoolId: string;
  studentName: string;
  grade: string;
  className: string;
  parentName: string;
  phone: string;
  courseTitle: string;
  courseId: string;
  fee: number;
  feeStatus: '납부' | '미납' | '면제';
  appDate: string;
  status: AppStatus;
  memo?: string;
}

const MOCK_APPLICANTS: Applicant[] = [
  { id: 'app_1', num: 5, schoolId: '3267', studentName: '이수아', grade: '3', className: '2', parentName: '이미경', phone: '010-3311-2244', courseTitle: '[늘봄] AI 로봇 코딩 교실', courseId: 'crs_1', fee: 0, feeStatus: '면제', appDate: '2026-03-04', status: '신청' },
  { id: 'app_2', num: 4, schoolId: '3267', studentName: '박준서', grade: '2', className: '1', parentName: '박영호', phone: '010-5522-7788', courseTitle: '[방과후] 창의 미술과 드로잉', courseId: 'crs_2', fee: 60000, feeStatus: '납부', appDate: '2026-03-03', status: '신청' },
  { id: 'app_3', num: 3, schoolId: '3267', studentName: '최지우', grade: '4', className: '3', parentName: '최현주', phone: '010-9988-1122', courseTitle: '[방과후] 피아노 기초 & 앙상블', courseId: 'crs_3', fee: 80000, feeStatus: '미납', appDate: '2026-03-02', status: '신청' },
  { id: 'app_4', num: 2, schoolId: '3267', studentName: '김하은', grade: '1', className: '2', parentName: '김민지', phone: '010-1234-5678', courseTitle: '[늘봄] AI 로봇 코딩 교실', courseId: 'crs_1', fee: 0, feeStatus: '면제', appDate: '2026-03-02', status: '대기' },
  { id: 'app_5', num: 1, schoolId: '3267', studentName: '정민준', grade: '5', className: '1', parentName: '정성호', phone: '010-7777-3333', courseTitle: '[방과후] 창의 미술과 드로잉', courseId: 'crs_2', fee: 60000, feeStatus: '납부', appDate: '2026-03-01', status: '취소' },
];

const STATUS_COLORS: Record<AppStatus, string> = {
  '신청': '#16a34a',
  '취소': '#dc2626',
  '대기': '#d97706',
  '환불': '#7c3aed',
};

export default function AppListPage({ params }: PageProps) {
  const router = useRouter();
  const schoolId = params?.school_id || '3267';

  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [filtered, setFiltered] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeeStatus, setFilterFeeStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [searchType, setSearchType] = useState('name');
  const [searchKeyword, setSearchKeyword] = useState('');

  const courses = Array.from(new Set(MOCK_APPLICANTS.map(a => a.courseTitle)));

  const applyFilter = () => {
    let result = [...applicants];
    if (filterStatus !== 'all') result = result.filter(a => a.status === filterStatus);
    if (filterFeeStatus !== 'all') result = result.filter(a => a.feeStatus === filterFeeStatus);
    if (filterCourse !== 'all') result = result.filter(a => a.courseTitle === filterCourse);
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(a => {
        if (searchType === 'name') return a.studentName.includes(kw) || a.parentName.includes(kw);
        if (searchType === 'phone') return a.phone.includes(kw);
        if (searchType === 'course') return a.courseTitle.includes(kw);
        return a.studentName.includes(kw) || a.parentName.includes(kw) || a.phone.includes(kw);
      });
    }
    setFiltered(result);
  };

  useEffect(() => { applyFilter(); }, [filterStatus, filterFeeStatus, filterCourse]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? filtered.map(a => a.id) : []);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkCancel = () => {
    if (selectedIds.length === 0) { alert('취소할 신청자를 선택하세요.'); return; }
    if (!confirm(`선택한 ${selectedIds.length}명을 취소 처리하시겠습니까?`)) return;
    setApplicants(prev => prev.map(a => selectedIds.includes(a.id) ? { ...a, status: '취소' } : a));
    setFiltered(prev => prev.map(a => selectedIds.includes(a.id) ? { ...a, status: '취소' } : a));
    setSelectedIds([]);
    alert('취소 처리가 완료되었습니다.');
  };

  const thStyle: React.CSSProperties = { padding: '10px 8px', background: '#f5f5f5', fontWeight: 700, color: '#333', fontSize: '0.83rem', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { padding: '9px 8px', fontSize: '0.83rem', color: '#333', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' };

  return (
    <div style={{ padding: '20px 24px', fontFamily: '"맑은 고딕", Malgun Gothic, sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4791d2', paddingBottom: '10px', marginBottom: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#333', margin: 0 }}>
            <i className="fa fa-users" style={{ color: '#4791d2', marginRight: 6 }}></i> 신청자관리
          </h1>
          <div style={{ fontSize: '0.82rem', color: '#666', marginTop: 3 }}>광주풍향초등학교 늘봄학교 (SN: {schoolId})</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link href={`/af/ad_app/write/sn/${schoolId}`} style={{ padding: '6px 14px', background: '#428bca', color: '#fff', borderRadius: 3, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            + 개별등록
          </Link>
          <Link href={`/af/ad_app/batch-upload/sn/${schoolId}`} style={{ padding: '6px 14px', background: '#5cb85c', color: '#fff', borderRadius: 3, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            엑셀 일괄입력
          </Link>
          <button onClick={handleBulkCancel} style={{ padding: '6px 12px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: 3, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            선택취소
          </button>
        </div>
      </div>

      {/* Filter */}
      <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, background: '#f8f8f8', border: '1px solid #e3e3e3', padding: '10px 14px', borderRadius: 4, marginBottom: 12 }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ height: 30, padding: '2px 8px', fontSize: '0.83rem', border: '1px solid #ccc', borderRadius: 3 }}>
          <option value="all">=신청상태=</option>
          <option value="신청">신청</option>
          <option value="대기">대기</option>
          <option value="취소">취소</option>
          <option value="환불">환불</option>
        </select>
        <select value={filterFeeStatus} onChange={e => setFilterFeeStatus(e.target.value)} style={{ height: 30, padding: '2px 8px', fontSize: '0.83rem', border: '1px solid #ccc', borderRadius: 3 }}>
          <option value="all">=납부상태=</option>
          <option value="납부">납부</option>
          <option value="미납">미납</option>
          <option value="면제">면제</option>
        </select>
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} style={{ height: 30, padding: '2px 8px', fontSize: '0.83rem', border: '1px solid #ccc', borderRadius: 3, maxWidth: 200 }}>
          <option value="all">=강좌선택=</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={searchType} onChange={e => setSearchType(e.target.value)} style={{ height: 30, padding: '2px 8px', fontSize: '0.83rem', border: '1px solid #ccc', borderRadius: 3 }}>
          <option value="name">학생/학부모명</option>
          <option value="phone">연락처</option>
          <option value="course">강좌명</option>
        </select>
        <input type="text" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} placeholder="검색어 입력" style={{ height: 30, padding: '2px 10px', fontSize: '0.83rem', border: '1px solid #ccc', borderRadius: 3, width: 160 }} />
        <button type="submit" style={{ height: 30, padding: '0 14px', background: '#fff', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>검색</button>
        <button type="button" onClick={() => { setFilterStatus('all'); setFilterFeeStatus('all'); setFilterCourse('all'); setSearchKeyword(''); setFiltered(applicants); }} style={{ height: 30, padding: '0 12px', background: '#fff', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.83rem', cursor: 'pointer' }}>전체</button>
      </form>

      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: '0.83rem', color: '#666' }}>
          총 <strong style={{ color: '#428bca' }}>{filtered.length}</strong>명 · 선택 <strong style={{ color: '#d9534f' }}>{selectedIds.length}</strong>명
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => alert('수강신청서 출력 (인쇄 미리보기 팝업)')} style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.8rem', cursor: 'pointer' }}>📄 신청서출력</button>
          <button onClick={() => alert('고지서 출력')} style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.8rem', cursor: 'pointer' }}>🧾 고지서출력</button>
          <button onClick={() => alert('스쿨뱅킹 CSV 다운로드')} style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.8rem', cursor: 'pointer' }}>💾 스쿨뱅킹CSV</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #ddd', borderRadius: 4, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', textAlign: 'center', minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 36 }}><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filtered.length && filtered.length > 0} /></th>
              <th style={{ ...thStyle, width: 44 }}>연번</th>
              <th style={{ ...thStyle, width: 72 }}>학년반</th>
              <th style={{ ...thStyle, width: 80 }}>학생명</th>
              <th style={{ ...thStyle, width: 80 }}>학부모명</th>
              <th style={{ ...thStyle, width: 120 }}>연락처</th>
              <th style={{ ...thStyle }}>강좌명</th>
              <th style={{ ...thStyle, width: 80 }}>수강료</th>
              <th style={{ ...thStyle, width: 70 }}>납부</th>
              <th style={{ ...thStyle, width: 90 }}>신청일</th>
              <th style={{ ...thStyle, width: 60 }}>상태</th>
              <th style={{ ...thStyle, width: 80 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12} style={{ ...tdStyle, textAlign: 'center', padding: '36px', color: '#aaa' }}>등록된 신청자가 없습니다.</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} style={{ background: selectedIds.includes(a.id) ? '#eef6ff' : '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = selectedIds.includes(a.id) ? '#eef6ff' : '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = selectedIds.includes(a.id) ? '#eef6ff' : '#fff')}
              >
                <td style={tdStyle}><input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => handleSelect(a.id)} /></td>
                <td style={tdStyle}>{a.num}</td>
                <td style={tdStyle}>{a.grade}학년 {a.className}반</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{a.studentName}</td>
                <td style={tdStyle}>{a.parentName}</td>
                <td style={tdStyle}>{a.phone}</td>
                <td style={{ ...tdStyle, textAlign: 'left', maxWidth: 220 }}>
                  <Link href={`/af/ad_lec/view/${a.courseId}/sn/${schoolId}`} style={{ color: '#428bca', textDecoration: 'none' }}>{a.courseTitle}</Link>
                </td>
                <td style={tdStyle}>{a.fee === 0 ? <span style={{ color: '#16a34a', fontWeight: 700 }}>무상</span> : `${a.fee.toLocaleString()}원`}</td>
                <td style={tdStyle}>
                  <span style={{ color: a.feeStatus === '납부' ? '#16a34a' : a.feeStatus === '미납' ? '#dc2626' : '#7c3aed', fontWeight: 700 }}>{a.feeStatus}</span>
                </td>
                <td style={tdStyle}>{a.appDate}</td>
                <td style={tdStyle}>
                  <span style={{ color: STATUS_COLORS[a.status], fontWeight: 700 }}>{a.status}</span>
                </td>
                <td style={{ ...tdStyle }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                    <Link href={`/af/ad_app/view/${a.id}/sn/${schoolId}`} style={{ padding: '2px 8px', background: '#5bc0de', color: '#fff', borderRadius: 3, fontSize: '0.75rem', textDecoration: 'none' }}>보기</Link>
                    <Link href={`/af/ad_app/edit/${a.id}/sn/${schoolId}`} style={{ padding: '2px 8px', background: '#f0ad4e', color: '#fff', borderRadius: 3, fontSize: '0.75rem', textDecoration: 'none' }}>수정</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 28, fontSize: '0.78rem', color: '#aaa' }}>
        Copyright ⓒ xmecca.com All Rights Reserved.
      </div>
    </div>
  );
}
