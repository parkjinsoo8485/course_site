'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQnaStore } from '@/store/useQnaStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function QnaWritePage({ params }: PageProps) {
  const router = useRouter();
  const schoolId = params?.school_id || '3267';
  const { addItem } = useQnaStore();

  const [authorName, setAuthorName] = useState('김혜련');
  const [hp1, setHp1] = useState('010');
  const [hp2, setHp2] = useState('2494');
  const [hp3, setHp3] = useState('1479');
  const [phone, setPhone] = useState('062-609-1182');
  const [email, setEmail] = useState('khh147979@naver.com');
  const [subject, setSubject] = useState('');
  const [contents, setContents] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; size: number }[]>([]);
  const [updateManagerInfo, setUpdateManagerInfo] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        id: `f_${Date.now()}_${Math.random()}`,
        name: f.name,
        size: f.size,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim()) {
      alert('성명을 입력하세요.');
      return;
    }
    if (!subject.trim()) {
      alert('제목을 입력하세요.');
      return;
    }
    if (!contents.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    addItem({
      schoolId,
      authorName,
      hp1,
      hp2,
      hp3,
      phone,
      email,
      subject,
      contents,
      files: uploadedFiles,
      status: '0', // 접수
      updateManagerInfo,
    });

    alert('고객지원 문의가 성공적으로 등록되었습니다.');
    router.push(`/af/qanda/lists/sn/${schoolId}`);
  };

  return (
    <div style={{ padding: '20px 24px', fontFamily: '"맑은 고딕", Malgun Gothic, Nanum Gothic, sans-serif', background: '#ffffff', minHeight: '100vh' }}>
      
      {/* 1. Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #4791d2', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#333333', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-pencil-square-o" style={{ color: '#4791d2' }}></i> 고객지원 문의 등록
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '4px' }}>
            광주풍향초등학교 늘봄학교 (SN: {schoolId})
          </div>
        </div>
        <Link
          href={`/af/qanda/lists/sn/${schoolId}`}
          style={{
            padding: '6px 14px',
            backgroundColor: '#ffffff',
            color: '#333333',
            border: '1px solid #cccccc',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          목록으로
        </Link>
      </div>

      {/* 2. Main Write Form (1:1 dbdbschool Table Structure) */}
      <form onSubmit={handleSubmit}>
        <div style={{ border: '1px solid #dddddd', borderRadius: '4px', overflow: 'hidden', background: '#ffffff', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <tbody>
              {/* 성명 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ width: '150px', background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  성명
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    style={{ height: '32px', width: '30%', padding: '2px 8px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem' }}
                    required
                  />
                </td>
              </tr>

              {/* 휴대폰 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  휴대폰
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <select
                      value={hp1}
                      onChange={(e) => setHp1(e.target.value)}
                      style={{ height: '32px', padding: '2px 8px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem' }}
                    >
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                      <option value="018">018</option>
                      <option value="019">019</option>
                    </select>
                    <span>-</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={hp2}
                      onChange={(e) => setHp2(e.target.value)}
                      style={{ height: '32px', width: '90px', padding: '2px 8px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem' }}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={hp3}
                      onChange={(e) => setHp3(e.target.value)}
                      style={{ height: '32px', width: '90px', padding: '2px 8px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666666', marginLeft: '8px' }}>
                      ※ 상담 전화 및 처리 결과를 문자로 발송해 드립니다.
                    </span>
                  </div>
                </td>
              </tr>

              {/* 전화 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  전화
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ height: '32px', width: '30%', padding: '2px 8px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem' }}
                  />
                </td>
              </tr>

              {/* 이메일 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  이메일
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ height: '32px', width: '50%', padding: '2px 8px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#666666' }}>
                      ※ 필요한 자료를 메일로 받기 원하시는 경우 입력하세요.
                    </span>
                  </div>
                </td>
              </tr>

              {/* 제목 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  제목
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="문의 제목을 입력하세요."
                    style={{ height: '34px', width: '70%', padding: '2px 10px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.9rem' }}
                    required
                  />
                </td>
              </tr>

              {/* 내용 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  내용
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <textarea
                    rows={12}
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    placeholder="상세 문의 내용을 자유롭게 입력하세요."
                    style={{ width: '95%', padding: '10px', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.88rem', lineHeight: 1.6 }}
                    required
                  />
                </td>
              </tr>

              {/* 첨부파일 */}
              <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                  첨부파일
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#ffffff',
                          color: '#333333',
                          border: '1px solid #cccccc',
                          borderRadius: '3px',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        파일추가
                        <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                      </label>
                      <span style={{ fontSize: '0.8rem', color: '#666666' }}>
                        (※ 한 번에 최대 3M 이하만 올릴 수 있습니다.)
                      </span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div style={{ background: '#fafafa', border: '1px solid #ebebeb', padding: '8px 12px', borderRadius: '4px' }}>
                        {uploadedFiles.map((f) => (
                          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.83rem', color: '#333333', marginBottom: '4px' }}>
                            <span>📎 {f.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(f.id)}
                              style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontWeight: 700 }}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {/* 서비스 담당자 정보 수정 */}
              <tr>
                <th style={{ background: '#f5f5f5', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#333333', lineHeight: 1.4 }}>
                  서비스 담당자<br />정보 수정
                </th>
                <td style={{ padding: '10px 16px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#333333' }}>
                    <input
                      type="checkbox"
                      checked={updateManagerInfo}
                      onChange={(e) => setUpdateManagerInfo(e.target.checked)}
                      style={{ marginRight: '6px' }}
                    />
                    위에 입력된 작성자 정보를 '<span style={{ color: '#d9534f', fontWeight: 700 }}>환경설정 &gt; 담당자정보</span>'에 업데이트합니다.
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 24px',
              backgroundColor: '#428bca',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            등록완료
          </button>
          <button
            type="button"
            onClick={() => router.push(`/af/qanda/lists/sn/${schoolId}`)}
            style={{
              padding: '8px 20px',
              backgroundColor: '#ffffff',
              color: '#333333',
              border: '1px solid #cccccc',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
