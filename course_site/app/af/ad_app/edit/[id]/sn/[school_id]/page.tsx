'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: { school_id: string; id: string };
}

const COURSES = [
  { id: 'crs_1', title: '[늘봄] AI 로봇 코딩 교실' },
  { id: 'crs_2', title: '[방과후] 창의 미술과 드로잉' },
  { id: 'crs_3', title: '[방과후] 피아노 기초 & 앙상블' },
  { id: 'crs_4', title: '[방과후] 영어 스피킹 클럽' },
];

export default function AppEditPage({ params }: PageProps) {
  const router = useRouter();
  const schoolId = params?.school_id || '3267';
  const id = params?.id || 'app_1';

  const [form, setForm] = useState({
    studentName: '이수아',
    grade: '3', className: '2',
    studentNum: '20260302',
    birthDate: '2017-03-15',
    parentName: '이미경',
    phone1: '010', phone2: '3311', phone3: '2244',
    courseId: 'crs_1',
    fee: '0',
    feeStatus: '면제',
    status: '신청',
    memo: '늘봄 지원 대상자 1순위',
  });

  const set = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('신청자 정보가 성공적으로 수정되었습니다.');
    router.push(`/af/ad_app/view/${id}/sn/${schoolId}`);
  };

  const inputStyle: React.CSSProperties = { height: 32, padding: '2px 10px', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.87rem' };
  const thStyle: React.CSSProperties = { width: 140, background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333', fontSize: '0.87rem', borderBottom: '1px solid #e7e7e7' };
  const tdStyle: React.CSSProperties = { padding: '10px 16px', borderBottom: '1px solid #e7e7e7' };

  return (
    <div style={{ padding: '20px 24px', fontFamily: '"맑은 고딕", Malgun Gothic, sans-serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4791d2', paddingBottom: 10, marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#333', margin: 0 }}>
          <i className="fa fa-pencil" style={{ color: '#4791d2', marginRight: 6 }}></i> 신청자 정보 수정
        </h1>
        <Link href={`/af/ad_app/lists/sn/${schoolId}`} style={{ padding: '6px 14px', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: 3, textDecoration: 'none', fontSize: '0.85rem' }}>목록으로</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
            <tbody>
              <tr>
                <th style={thStyle}>강좌 변경</th>
                <td style={tdStyle} colSpan={3}>
                  <select value={form.courseId} onChange={e => set('courseId', e.target.value)} style={{ ...inputStyle, width: '60%' }}>
                    {COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </td>
              </tr>
              <tr>
                <th style={thStyle}>학생명</th>
                <td style={tdStyle}><input type="text" value={form.studentName} onChange={e => set('studentName', e.target.value)} style={{ ...inputStyle, width: '60%' }} /></td>
                <th style={thStyle}>학번</th>
                <td style={tdStyle}><input type="text" value={form.studentNum} onChange={e => set('studentNum', e.target.value)} style={{ ...inputStyle, width: '60%' }} /></td>
              </tr>
              <tr>
                <th style={thStyle}>학년/반</th>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select value={form.grade} onChange={e => set('grade', e.target.value)} style={inputStyle}>
                      {['1','2','3','4','5','6'].map(g => <option key={g} value={g}>{g}학년</option>)}
                    </select>
                    <select value={form.className} onChange={e => set('className', e.target.value)} style={inputStyle}>
                      {['1','2','3','4','5','6','7','8','9','10'].map(c => <option key={c} value={c}>{c}반</option>)}
                    </select>
                  </div>
                </td>
                <th style={thStyle}>생년월일</th>
                <td style={tdStyle}><input type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)} style={inputStyle} /></td>
              </tr>
              <tr>
                <th style={thStyle}>학부모명</th>
                <td style={tdStyle}><input type="text" value={form.parentName} onChange={e => set('parentName', e.target.value)} style={{ ...inputStyle, width: '60%' }} /></td>
                <th style={thStyle}>연락처</th>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <select value={form.phone1} onChange={e => set('phone1', e.target.value)} style={inputStyle}>
                      {['010','011','016','017','018','019'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <span>-</span>
                    <input type="text" maxLength={4} value={form.phone2} onChange={e => set('phone2', e.target.value)} style={{ ...inputStyle, width: 80 }} />
                    <span>-</span>
                    <input type="text" maxLength={4} value={form.phone3} onChange={e => set('phone3', e.target.value)} style={{ ...inputStyle, width: 80 }} />
                  </div>
                </td>
              </tr>
              <tr>
                <th style={thStyle}>수강료</th>
                <td style={tdStyle}><input type="number" value={form.fee} onChange={e => set('fee', e.target.value)} style={{ ...inputStyle, width: 120 }} /></td>
                <th style={thStyle}>납부상태</th>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {(['미납', '납부', '면제'] as const).map(s => (
                      <label key={s} style={{ cursor: 'pointer', fontSize: '0.87rem' }}>
                        <input type="radio" name="feeStatus" value={s} checked={form.feeStatus === s} onChange={() => set('feeStatus', s)} style={{ marginRight: 4 }} />
                        {s}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th style={thStyle}>신청상태</th>
                <td style={tdStyle} colSpan={3}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {(['신청', '대기', '취소', '환불'] as const).map(s => (
                      <label key={s} style={{ cursor: 'pointer', fontSize: '0.87rem' }}>
                        <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => set('status', s)} style={{ marginRight: 4 }} />
                        {s}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th style={thStyle}>메모</th>
                <td style={tdStyle} colSpan={3}>
                  <textarea rows={3} value={form.memo} onChange={e => set('memo', e.target.value)} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: 3, fontSize: '0.87rem' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button type="submit" style={{ padding: '8px 24px', background: '#428bca', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>수정완료</button>
          <button type="button" onClick={() => router.back()} style={{ padding: '8px 20px', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: 4, fontSize: '0.9rem', cursor: 'pointer' }}>취소</button>
        </div>
      </form>
    </div>
  );
}
