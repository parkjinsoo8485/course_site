'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQnaStore } from '@/store/useQnaStore';
import { QnaItem, QnaStatusType } from '@/types/qna';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function QnaListPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { filteredItems, filterParams, setFilterParams, filterList, addItem, updateItem, deleteItem } = useQnaStore();

  // Search filter states
  const [searchStatus, setSearchStatus] = useState<string>(filterParams.as || 'all');
  const [searchType, setSearchType] = useState<'sub_con' | 'subject' | 'contents'>(filterParams.st || 'sub_con');
  const [searchKeyword, setSearchKeyword] = useState<string>(filterParams.sw || '');

  // Modal states for interactive UI
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QnaItem | null>(null);

  // Form states for new Q&A
  const [newSubject, setNewSubject] = useState('');
  const [newAuthor, setNewAuthor] = useState('김혜련');
  const [newHp1, setNewHp1] = useState('010');
  const [newHp2, setNewHp2] = useState('2494');
  const [newHp3, setNewHp3] = useState('1479');
  const [newPhone, setNewPhone] = useState('062-609-1182');
  const [newEmail, setNewEmail] = useState('khh147979@naver.com');
  const [newContents, setNewContents] = useState('');
  const [updateManagerInfo, setUpdateManagerInfo] = useState(false);

  // Admin reply state in detail modal
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<QnaStatusType>('2');

  useEffect(() => {
    filterList();
  }, [filterList]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilterParams({
      as: searchStatus,
      st: searchType,
      sw: searchKeyword,
    });
  };

  const handleReset = () => {
    setSearchStatus('all');
    setSearchType('sub_con');
    setSearchKeyword('');
    setFilterParams({
      as: 'all',
      st: 'sub_con',
      sw: '',
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContents.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    addItem({
      schoolId,
      authorName: newAuthor,
      hp1: newHp1,
      hp2: newHp2,
      hp3: newHp3,
      phone: newPhone,
      email: newEmail,
      subject: newSubject.trim(),
      contents: newContents.trim(),
      files: [],
      status: '0',
      updateManagerInfo,
    });

    alert('고객지원 문의글이 정상적으로 등록되었습니다.');
    setNewSubject('');
    setNewContents('');
    setIsWriteModalOpen(false);
  };

  const handleSaveReply = () => {
    if (!selectedItem) return;
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    updateItem(selectedItem.id, {
      status: replyStatus,
      answerContent: replyText,
      answerDate: `${mm}/${dd}`,
    });

    const updated = {
      ...selectedItem,
      status: replyStatus,
      answerContent: replyText,
      answerDate: `${mm}/${dd}`,
      statusText: (replyStatus === '2' ? '완료' : replyStatus === '1' ? '처리중' : replyStatus === '3' ? '답변완료' : '접수') as any,
    };
    setSelectedItem(updated);
    alert('답변 및 처리 상태가 저장되었습니다.');
  };

  const handleDelete = (id: string) => {
    if (confirm('해당 고객지원 문의글을 삭제하시겠습니까?')) {
      deleteItem(id);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      alert('삭제되었습니다.');
    }
  };

  return (
    <div style={{ padding: '20px 24px', fontFamily: '"맑은 고딕", Malgun Gothic, Nanum Gothic, "돋움", Dotum, sans-serif', background: '#f5f5f5', minHeight: '100vh', color: '#333' }}>
      
      {/* 1. Page Header Title Area (Exact 1:1 Matching) */}
      <div style={{ marginBottom: '14px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333333', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa fa-file-text-o" style={{ color: '#337ab7', fontSize: '18px' }}></i> 고객지원 게시판
        </h1>
        <div style={{ fontSize: '12px', color: '#777777', marginTop: '4px' }}>
          광주풍향초등학교 늘봄학교
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div style={{ background: '#ffffff', border: '1px solid #d2d6de', padding: '16px 20px', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
        
        {/* Section Title */}
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#333333', marginBottom: '12px' }}>
          목록
        </div>

        {/* Top Info Alert Box */}
        <div
          style={{
            background: '#fcf8e3',
            border: '1px solid #faebcc',
            color: '#8a6d3b',
            borderRadius: '3px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '14px' }}>ℹ️</span>
          <span>
            <strong style={{ color: '#c9302c' }}>문의사항을 고객지원 게시판에 올려주시면 </strong>
            <strong style={{ color: '#31708f' }}>담당자가 빠르게 확인하고 신속하게 답변</strong>
            <strong style={{ color: '#c9302c' }}>드리겠습니다.</strong>
          </span>
        </div>

        {/* Search Filter Box (Centered / Exact Bordered Box) */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '5px',
            background: '#fbfbfb',
            border: '1px solid #e7e7e7',
            padding: '8px 12px',
            borderRadius: '3px',
            marginBottom: '12px',
          }}
        >
          <select
            value={searchStatus}
            onChange={(e) => {
              setSearchStatus(e.target.value);
              setFilterParams({ as: e.target.value, st: searchType, sw: searchKeyword });
            }}
            style={{ height: '30px', padding: '2px 8px', fontSize: '12px', border: '1px solid #cccccc', borderRadius: '2px', background: '#ffffff', color: '#333' }}
          >
            <option value="all">=진행상태=</option>
            <option value="0">접수</option>
            <option value="1">처리중</option>
            <option value="2">완료</option>
          </select>

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            style={{ height: '30px', padding: '2px 8px', fontSize: '12px', border: '1px solid #cccccc', borderRadius: '2px', background: '#ffffff', color: '#333' }}
          >
            <option value="sub_con">제목 + 내용</option>
            <option value="subject">제목</option>
            <option value="contents">내용</option>
          </select>

          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ height: '30px', padding: '2px 8px', fontSize: '12px', border: '1px solid #cccccc', borderRadius: '2px', width: '220px' }}
          />

          <button
            type="submit"
            style={{
              height: '30px',
              padding: '0 12px',
              backgroundColor: '#f4f4f4',
              color: '#333333',
              border: '1px solid #cccccc',
              borderRadius: '2px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            검색
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              height: '30px',
              padding: '0 12px',
              backgroundColor: '#f4f4f4',
              color: '#333333',
              border: '1px solid #cccccc',
              borderRadius: '2px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            전체
          </button>
        </form>

        {/* Sub-header Guide Text & Registration Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '12px' }}>
          <span style={{ color: '#555555' }}>
            ※ <Link href={`/af/ad_faq/main/sn/${schoolId}`} style={{ color: '#c9302c', textDecoration: 'underline', fontWeight: 'bold' }}>매뉴얼</Link>을 먼저 확인 후 고객지원 게시판을 이용하시기 바랍니다.
          </span>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            style={{
              padding: '5px 14px',
              backgroundColor: '#337ab7',
              color: '#ffffff',
              border: '1px solid #2e6da4',
              borderRadius: '2px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            등록
          </button>
        </div>

        {/* Main Q&A Table */}
        <div style={{ borderTop: '1px solid #dddddd', borderBottom: '1px solid #dddddd' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #dddddd', color: '#333333' }}>
                <th style={{ width: '60px', padding: '9px 6px', fontWeight: 'bold', borderRight: '1px solid #eeeeee' }}>연번</th>
                <th style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #eeeeee' }}>제목</th>
                <th style={{ width: '110px', padding: '9px 6px', fontWeight: 'bold', borderRight: '1px solid #eeeeee' }}>등록일자</th>
                <th style={{ width: '90px', padding: '9px 6px', fontWeight: 'bold', borderRight: '1px solid #eeeeee' }}>진행</th>
                <th style={{ width: '90px', padding: '9px 6px', fontWeight: 'bold' }}>답변</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', color: '#999999', textAlign: 'center' }}>
                    등록된 고객지원 문의글이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #eeeeee',
                      background: '#ffffff',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fbfd')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <td style={{ padding: '8px 6px', color: '#666666', borderRight: '1px solid #eeeeee' }}>
                      {item.num || idx + 1}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'left', borderRight: '1px solid #eeeeee' }}>
                      <span
                        onClick={() => {
                          setSelectedItem(item);
                          setReplyText(item.answerContent || '');
                          setReplyStatus(item.status || '2');
                        }}
                        style={{
                          color: '#333333',
                          cursor: 'pointer',
                          borderBottom: '1px dotted #999999',
                          paddingBottom: '1px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#337ab7')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#333333')}
                      >
                        {item.subject}
                      </span>
                      {item.files && item.files.length > 0 && (
                        <span style={{ marginLeft: '6px', color: '#888888', fontSize: '11px' }}>
                          📎
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '8px 6px', color: '#666666', borderRight: '1px solid #eeeeee' }}>
                      {item.createdAt}
                    </td>
                    <td style={{ padding: '8px 6px', borderRight: '1px solid #eeeeee' }}>
                      <span
                        style={{
                          color: item.status === '2' ? '#d58512' : item.status === '1' ? '#337ab7' : '#333333',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.statusText || (item.status === '2' ? '완료' : item.status === '1' ? '처리중' : '접수')}
                      </span>
                    </td>
                    <td style={{ padding: '8px 6px', color: '#666666' }}>
                      {item.answerDate || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Footer */}
      <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: '#888888' }}>
        Copyright ⓒ <strong style={{ color: '#333333' }}>xmecca.com</strong> All Rights Reserved. &nbsp;|&nbsp; ✉ dbdbschool@naver.com
      </div>

      {/* ======================================================== */}
      {/* 4. Write Modal (고객지원 문의 등록 모달) */}
      {/* ======================================================== */}
      {isWriteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '680px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#337ab7',
                color: '#ffffff',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                <i className="fa fa-pencil-square-o" style={{ marginRight: '6px' }}></i> 고객지원 문의글 등록
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateSubmit} style={{ padding: '18px 22px' }}>
              <div style={{ fontSize: '12px', color: '#337ab7', marginBottom: '12px' }}>
                ☑ 표시가 있는 항목은 반드시 입력해야 합니다.
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ width: '110px', padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>학교명</td>
                    <td style={{ padding: '8px' }}>광주풍향초등학교 늘봄학교</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>성명 ☑</td>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        required
                        style={{ width: '160px', height: '28px', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>휴대폰 ☑</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="text"
                          value={newHp1}
                          onChange={(e) => setNewHp1(e.target.value)}
                          style={{ width: '50px', height: '28px', textAlign: 'center', border: '1px solid #ccc' }}
                        />
                        -
                        <input
                          type="text"
                          value={newHp2}
                          onChange={(e) => setNewHp2(e.target.value)}
                          style={{ width: '60px', height: '28px', textAlign: 'center', border: '1px solid #ccc' }}
                        />
                        -
                        <input
                          type="text"
                          value={newHp3}
                          onChange={(e) => setNewHp3(e.target.value)}
                          style={{ width: '60px', height: '28px', textAlign: 'center', border: '1px solid #ccc' }}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>전화번호</td>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        style={{ width: '160px', height: '28px', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>이메일 ☑</td>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        style={{ width: '260px', height: '28px', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>제목 ☑</td>
                    <td style={{ padding: '8px' }}>
                      <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="문의 제목을 입력하세요"
                        required
                        style={{ width: '100%', height: '28px', padding: '2px 8px', border: '1px solid #ccc', borderRadius: '2px' }}
                      />
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>내용 ☑</td>
                    <td style={{ padding: '8px' }}>
                      <textarea
                        value={newContents}
                        onChange={(e) => setNewContents(e.target.value)}
                        placeholder="문의하실 내용을 상세히 기재해 주세요."
                        required
                        style={{ width: '100%', height: '120px', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '2px', resize: 'vertical' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>담당자 정보</td>
                    <td style={{ padding: '8px' }}>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="checkbox"
                          checked={updateManagerInfo}
                          onChange={(e) => setUpdateManagerInfo(e.target.checked)}
                        />
                        위 정보로 학교 담당자 정보를 동시에 업데이트합니다.
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  style={{ padding: '6px 18px', backgroundColor: '#f4f4f4', border: '1px solid #ccc', borderRadius: '2px', cursor: 'pointer', fontSize: '12px' }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{ padding: '6px 22px', backgroundColor: '#337ab7', color: '#ffffff', border: '1px solid #2e6da4', borderRadius: '2px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. Detail View & Admin Answer Modal */}
      {/* ======================================================== */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '720px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#337ab7',
                color: '#ffffff',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                <i className="fa fa-file-text-o" style={{ marginRight: '6px' }}></i> 고객지원 문의 상세 보기
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ width: '100px', padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>제목</td>
                    <td colSpan={3} style={{ padding: '8px', fontWeight: 'bold', color: '#333' }}>
                      {selectedItem.subject}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>작성자</td>
                    <td style={{ padding: '8px' }}>{selectedItem.authorName}</td>
                    <td style={{ width: '90px', padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>등록일자</td>
                    <td style={{ padding: '8px' }}>{selectedItem.createdAt}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>연락처</td>
                    <td style={{ padding: '8px' }}>{selectedItem.hp1}-{selectedItem.hp2}-{selectedItem.hp3}</td>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>진행상태</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ color: selectedItem.status === '2' ? '#d58512' : '#337ab7', fontWeight: 'bold' }}>
                        {selectedItem.statusText}
                      </span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>이메일</td>
                    <td colSpan={3} style={{ padding: '8px' }}>{selectedItem.email}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9', verticalAlign: 'top' }}>문의 내용</td>
                    <td colSpan={3} style={{ padding: '12px 8px', whiteSpace: 'pre-wrap', lineHeight: '1.6', minHeight: '80px' }}>
                      {selectedItem.contents}
                    </td>
                  </tr>
                  {selectedItem.files && selectedItem.files.length > 0 && (
                    <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold', background: '#f9f9f9' }}>첨부파일</td>
                      <td colSpan={3} style={{ padding: '8px' }}>
                        {selectedItem.files.map((file) => (
                          <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📎 {file.name}</span>
                            <button
                              type="button"
                              onClick={() => alert(`[다운로드 시작] ${file.name}`)}
                              style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#f4f4f4', border: '1px solid #ccc', borderRadius: '2px', cursor: 'pointer' }}
                            >
                              다운로드
                            </button>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Admin Answer Box */}
              <div style={{ marginTop: '18px', background: '#fbfbfb', border: '1px solid #e7e7e7', padding: '14px', borderRadius: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#337ab7', fontWeight: 'bold' }}>
                    <i className="fa fa-reply" style={{ marginRight: '4px' }}></i> 고객지원 답변 & 상태 변경
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>진행상태:</label>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value as QnaStatusType)}
                      style={{ height: '26px', fontSize: '12px', padding: '2px 6px', border: '1px solid #ccc', borderRadius: '2px' }}
                    >
                      <option value="0">접수</option>
                      <option value="1">처리중</option>
                      <option value="2">완료</option>
                    </select>
                  </div>
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="답변 내용을 작성해 주세요..."
                  style={{ width: '100%', height: '80px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '2px', resize: 'vertical' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={handleSaveReply}
                    style={{ padding: '5px 14px', backgroundColor: '#5cb85c', color: '#ffffff', border: '1px solid #4cae4c', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    답변 저장하기
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '10px 18px', background: '#f9f9f9', borderTop: '1px solid #eeeeee', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                style={{ padding: '5px 14px', backgroundColor: '#d9534f', color: '#ffffff', border: '1px solid #d43f3a', borderRadius: '2px', fontSize: '12px', cursor: 'pointer' }}
              >
                삭제
              </button>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{ padding: '5px 16px', backgroundColor: '#f4f4f4', border: '1px solid #ccc', borderRadius: '2px', fontSize: '12px', cursor: 'pointer' }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
