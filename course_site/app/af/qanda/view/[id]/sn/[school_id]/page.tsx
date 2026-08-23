'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQnaStore } from '@/store/useQnaStore';
import { QnaStatusType } from '@/types/qna';

interface PageProps {
  params: {
    school_id: string;
    id: string;
  };
}

export default function QnaViewPage({ params }: PageProps) {
  const router = useRouter();
  const schoolId = params?.school_id || '3267';
  const qnaId = params?.id || '8806';

  const { getItemById, updateItem, deleteItem } = useQnaStore();
  const item = getItemById(qnaId) || {
    num: 2,
    id: qnaId,
    schoolId,
    authorName: '김혜련',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
    contents: '2026학년도 바뀐 설문지 보내드립니다.\n감사합니다.',
    files: [
      {
        id: 'f_1',
        name: '2026학년도1학기늘봄학교만족도조사설문지.hwp',
        url: '#',
        ext: 'hwp',
      },
    ],
    status: '2' as QnaStatusType,
    statusText: '완료' as const,
    statusColor: '#EB9316',
    createdAt: '2026-06-01',
    answerDate: '06/01',
    answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.',
  };

  const [isAdminReplyMode, setIsAdminReplyMode] = useState(false);
  const [replyStatus, setReplyStatus] = useState<QnaStatusType>(item.status || '2');
  const [replyText, setReplyText] = useState(item.answerContent || '');

  const handleSaveReply = () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    updateItem(item.id, {
      status: replyStatus,
      answerContent: replyText,
      answerDate: `${mm}/${dd}`,
    });

    setIsAdminReplyMode(false);
    alert('답변 및 처리상태가 성공적으로 저장되었습니다.');
  };

  const handleDelete = () => {
    if (confirm('해당 고객지원 문의글을 삭제하시겠습니까?')) {
      deleteItem(item.id);
      alert('삭제되었습니다.');
      router.push(`/af/qanda/lists/sn/${schoolId}`);
    }
  };

  return (
    <div style={{ padding: '20px 24px', fontFamily: '"맑은 고딕", Malgun Gothic, Nanum Gothic, sans-serif', background: '#ffffff', minHeight: '100vh' }}>
      
      {/* 1. Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #4791d2', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#333333', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-file-text-o" style={{ color: '#4791d2' }}></i> 고객지원 상세 보기
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '4px' }}>
            광주풍향초등학교 늘봄학교 (SN: {schoolId})
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setIsAdminReplyMode(!isAdminReplyMode)}
            style={{
              padding: '6px 12px',
              backgroundColor: isAdminReplyMode ? '#475569' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAdminReplyMode ? '답변 수정 취소' : '💬 관리자 답변 작성/수정'}
          </button>
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
              display: 'inline-block',
            }}
          >
            목록으로
          </Link>
        </div>
      </div>

      {/* 2. Main Detail Table (Exact 1:1 Matching) */}
      <div style={{ border: '1px solid #dddddd', borderRadius: '4px', overflow: 'hidden', background: '#ffffff', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <th style={{ width: '130px', background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                성명
              </th>
              <td style={{ padding: '10px 16px', color: '#333333' }}>{item.authorName}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <th style={{ background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                휴대폰
              </th>
              <td style={{ padding: '10px 16px', color: '#333333' }}>
                {item.hp1}-{item.hp2}-{item.hp3}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <th style={{ background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                전화
              </th>
              <td style={{ padding: '10px 16px', color: '#333333' }}>{item.phone || '-'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <th style={{ background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                이메일
              </th>
              <td style={{ padding: '10px 16px', color: '#333333' }}>{item.email || '-'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <th style={{ background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                제목
              </th>
              <td style={{ padding: '10px 16px', fontWeight: 700, color: '#333333' }}>{item.subject}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <th style={{ background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                첨부파일
              </th>
              <td style={{ padding: '10px 16px' }}>
                {item.files && item.files.length > 0 ? (
                  item.files.map((f) => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#428bca' }}>
                      <span style={{ fontWeight: 600 }}>📎 {f.name}</span>
                      <button
                        onClick={() => alert(`'${f.name}' 파일이 다운로드됩니다.`)}
                        style={{ padding: '2px 8px', fontSize: '0.75rem', background: '#f0f0f0', border: '1px solid #cccccc', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        다운로드
                      </button>
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#888888' }}>첨부파일 없음</span>
                )}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e7e7e7' }}>
              <td colSpan={2} style={{ padding: '20px 16px', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#333333' }}>
                {item.contents}
              </td>
            </tr>
            <tr>
              <th style={{ background: '#f5f5f5', padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#333333' }}>
                진행상태
              </th>
              <td style={{ padding: '10px 16px' }}>
                <span style={{ color: item.statusColor || '#EB9316', fontWeight: 700 }}>
                  {item.statusText}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#888888', marginLeft: '10px' }}>
                  (등록일: {item.createdAt})
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Reply / Answer Area (Exact 1:1 Matching) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333333', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa fa-check" style={{ color: '#428bca' }}></i> 답변내용
        </div>

        {isAdminReplyMode ? (
          <div style={{ border: '1px solid #428bca', borderRadius: '4px', padding: '16px', background: '#f0f7fd' }}>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>진행상태 변경:</label>
              <select
                value={replyStatus}
                onChange={(e) => setReplyStatus(e.target.value as QnaStatusType)}
                style={{ height: '30px', padding: '2px 8px', fontSize: '0.85rem', border: '1px solid #cccccc', borderRadius: '3px' }}
              >
                <option value="0">접수</option>
                <option value="1">처리중</option>
                <option value="2">완료</option>
                <option value="3">답변완료</option>
              </select>
            </div>
            <textarea
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="고객지원 답변 내용을 입력하세요."
              style={{ width: '100%', padding: '10px', fontSize: '0.88rem', border: '1px solid #cccccc', borderRadius: '3px', lineHeight: 1.6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsAdminReplyMode(false)}
                style={{ padding: '6px 14px', background: '#ffffff', border: '1px solid #cccccc', borderRadius: '3px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveReply}
                style={{ padding: '6px 18px', background: '#428bca', color: '#ffffff', border: 'none', borderRadius: '3px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                답변 저장 완료
              </button>
            </div>
          </div>
        ) : (
          <div style={{ border: '1px solid #dddddd', borderRadius: '4px', overflow: 'hidden', background: '#fafafa' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '18px 16px', lineHeight: 1.7, color: '#333333', whiteSpace: 'pre-wrap' }}>
                    {item.answerContent ? (
                      item.answerContent
                    ) : (
                      <span style={{ color: '#888888' }}>아직 등록된 답변이 없습니다. 담당자가 확인 중입니다.</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Bottom Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <Link
          href={`/af/qanda/lists/sn/${schoolId}`}
          style={{
            padding: '7px 20px',
            backgroundColor: '#ffffff',
            color: '#333333',
            border: '1px solid #cccccc',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          목록
        </Link>
        <button
          onClick={() => window.print()}
          style={{
            padding: '7px 20px',
            backgroundColor: '#f0ad4e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          화면인쇄
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: '7px 18px',
            backgroundColor: '#ffffff',
            color: '#d9534f',
            border: '1px solid #d9534f',
            borderRadius: '4px',
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
