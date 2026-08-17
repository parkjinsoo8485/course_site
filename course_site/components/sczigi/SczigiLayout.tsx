'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SczigiLayoutProps {
  children: React.ReactNode;
  schoolId?: string;
  pageTitle?: string;
}

interface NavItem {
  type: 'single' | 'group';
  id: string;
  title: string;
  href?: string;
  icon: string;
  badge?: string;
  baseHref?: string;
  subItems?: { title: string; href: string; id: string }[];
}

function buildNav(schoolId: string): NavItem[] {
  return [
    {
      type: 'single',
      id: 'lec_goto',
      title: '늘봄학교 보기',
      href: `/af/ad_faq/main/sn/${schoolId}`,
      icon: '📊',
    },
    {
      type: 'single',
      id: 'service_lists',
      title: '서비스목록',
      href: `/sczigi/service/lists/sn/${schoolId}`,
      icon: '🗂️',
    },
    {
      type: 'group',
      id: 'teacher',
      title: '교직원관리',
      baseHref: '/sczigi/teacher',
      icon: '👨‍🏫',
      subItems: [
        { id: 'teacher_lists', title: '교직원관리', href: `/sczigi/teacher/lists/sn/${schoolId}` },
        { id: 'teacher_field', title: '회원필드설정', href: `/sczigi/teacher/field/sn/${schoolId}` },
        { id: 'teacher_level', title: '직위명설정', href: `/sczigi/teacher/level/sn/${schoolId}` },
        { id: 'teacher_clear', title: '초기화', href: `/sczigi/teacher/clear/sn/${schoolId}` },
      ],
    },
    {
      type: 'group',
      id: 'student',
      title: '학생관리',
      baseHref: '/sczigi/student',
      icon: '🎒',
      subItems: [
        { id: 'student_lists', title: '학생관리', href: `/sczigi/student/lists/sn/${schoolId}` },
        { id: 'student_main', title: '기본설정', href: `/sczigi/student/main/sn/${schoolId}` },
        { id: 'student_field', title: '회원필드설정', href: `/sczigi/student/field/sn/${schoolId}` },
        { id: 'student_course', title: '학과설정', href: `/sczigi/student/course/sn/${schoolId}` },
        { id: 'student_clear', title: '초기화', href: `/sczigi/student/clear/sn/${schoolId}` },
      ],
    },
    {
      type: 'group',
      id: 'sms',
      title: '문자관리',
      baseHref: '/sczigi/sms',
      icon: '💬',
      subItems: [
        { id: 'sms_tel', title: '발신번호관리', href: `/sczigi/sms_tel/lists/sn/${schoolId}` },
        { id: 'sms_sin', title: '충전신청', href: `/sczigi/sms_sin/lists/sn/${schoolId}` },
        { id: 'sms_charge', title: '충전내역', href: `/sczigi/sms_charge/lists/sn/${schoolId}` },
        { id: 'sms_report', title: '발송통계', href: `/sczigi/sms_report/lists/sn/${schoolId}` },
      ],
    },
    {
      type: 'single',
      id: 'auth_main',
      title: '권한설정',
      href: `/sczigi/auth/main/sn/${schoolId}`,
      icon: '⚙️',
    },
    {
      type: 'single',
      id: 'privacy_log',
      title: '서비스접근로그',
      href: `/sczigi/privacy_log/main/sn/${schoolId}`,
      icon: '📋',
    },
  ];
}

export default function SczigiLayout({ children, schoolId = '3267', pageTitle }: SczigiLayoutProps) {
  const pathname = usePathname() || '';
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('김혜련');
  const [adminPhone, setAdminPhone] = useState('010-3267-8899');
  const [adminEmail, setAdminEmail] = useState('hyeryeon@gwangju-es.kr');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['teacher', 'student', 'sms']));

  const navGroups = buildNav(schoolId);

  const isPathActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isGroupActive = (baseHref: string) => pathname.startsWith(baseHref);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('superAdminAuth');
      localStorage.removeItem('parentAuthInfo');
      alert('안전하게 로그아웃 되었습니다.');
      window.location.href = `/af/ad_lec/lists/sn/${schoolId}/`;
    }
  }

  function handleAdminSave(e: React.FormEvent) {
    e.preventDefault();
    alert(`[관리자 정보 수정 완료]\n성명: ${adminName}\n연락처: ${adminPhone}\n성공적으로 저장되었습니다.`);
    setIsAdminModalOpen(false);
  }

  React.useEffect(() => {
    navGroups.forEach((item) => {
      if (item.type === 'group' && item.subItems) {
        const hasActive = item.subItems.some((sub) => isPathActive(sub.href));
        if (hasActive) {
          setOpenGroups((prev) => new Set([...prev, item.id]));
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333333] font-sans flex flex-col antialiased" style={{ fontFamily: "'Malgun Gothic', '맑은 고딕', 'Noto Sans KR', sans-serif" }}>
      
      {/* ====== Top Header (디비디비스쿨 원본 헤더) ====== */}
      <header className="h-[52px] bg-[#3c8dbc] text-white flex items-center justify-between px-4 z-40 shrink-0 shadow-sm border-b border-[#3078a0]">
        <div className="flex items-center space-x-3">
          {/* School Name (Logo) */}
          <Link href={`/sczigi/service/lists/sn/${schoolId}`} className="flex items-center space-x-2 group">
            <span className="text-white font-bold text-[16px] tracking-tight">
              광주풍향초등학교
            </span>
          </Link>

          {/* Service Switcher Dropdown (학교관리 ▼) */}
          <div className="relative">
            <button
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              className="flex items-center space-x-1.5 bg-black/15 hover:bg-black/25 text-white text-[13px] font-bold px-3 py-1 rounded transition-colors"
            >
              <span>학교관리</span>
              <span className="text-[10px]">▼</span>
            </button>
            {isServiceDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white text-[#333] rounded shadow-lg border border-[#ddd] py-1 text-[13px] z-50">
                <div className="px-3 py-1.5 text-[11px] text-gray-500 font-bold border-b border-gray-100 mb-1">서비스 전환</div>
                <Link
                  href={`/af/ad_faq/main/sn/${schoolId}`}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-[#e8f4f8] text-[#333] hover:text-[#3c8dbc]"
                  onClick={() => setIsServiceDropdownOpen(false)}
                >
                  <span>📊</span><span>늘봄학교</span>
                </Link>
                <Link
                  href={`/sczigi/service/lists/sn/${schoolId}`}
                  className="flex items-center space-x-2 px-3 py-2 bg-[#f4f4f4] text-[#3c8dbc] font-bold"
                  onClick={() => setIsServiceDropdownOpen(false)}
                >
                  <span>🏫</span><span>학교관리 (현재)</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Header Menu */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center text-[12px] text-white/90 space-x-2">
            <span className="font-semibold">관리자(김혜련)님</span>
            <span className="text-white/40">|</span>
            <Link href={`/member/logout/sn/${schoolId}`} className="hover:text-white underline">로그아웃</Link>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-white hover:bg-black/20 rounded"
          >
            ☰
          </button>
        </div>
      </header>

      {/* ====== Main Container ====== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ====== Left Sidebar (LNB: #left_menu) ====== */}
        <aside
          className={`${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-200 ease-in-out fixed md:static inset-y-0 left-0 top-[52px] z-30 w-[220px] bg-[#222d32] text-[#b8c7ce] flex flex-col shadow-lg md:shadow-none overflow-y-auto shrink-0`}
        >
          {/* User Profile Box */}
          <div className="p-4 border-b border-[#1a2226] bg-[#1e282c]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#3c8dbc] flex items-center justify-center text-white font-bold text-[15px]">
                김
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-white truncate">관리자({adminName})님</div>
                <div className="flex items-center space-x-2 text-[11px] text-[#8aa4af] mt-1">
                  <button onClick={handleLogout} className="hover:text-white transition-colors">로그아웃</button>
                  <span>•</span>
                  <button onClick={() => setIsAdminModalOpen(true)} className="hover:text-white transition-colors">정보수정</button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu (ul.parent) */}
          <nav className="flex-1 py-1 text-[13px]">
            <ul className="space-y-0">
              {navGroups.map((item) => {
                if (item.type === 'single') {
                  const active = item.href ? isPathActive(item.href) : false;
                  return (
                    <li key={item.id} className="border-b border-[#1a2226]/50">
                      <Link
                        href={item.href!}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 space-x-2.5 transition-all border-l-4 ${
                          active
                            ? 'bg-[#1e282c] text-white border-[#3c8dbc] font-bold'
                            : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white hover:border-[#3c8dbc]/50'
                        }`}
                      >
                        <span className="text-[15px] w-5 text-center">{item.icon}</span>
                        <span className="flex-1">{item.title}</span>
                      </Link>
                    </li>
                  );
                }

                // Group item
                const groupActive = item.baseHref ? isGroupActive(item.baseHref) : false;
                const isOpen = openGroups.has(item.id) || groupActive;

                return (
                  <li key={item.id} className="border-b border-[#1a2226]/50">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-[13px] font-bold border-l-4 transition-all ${
                        groupActive
                          ? 'bg-[#1a2226] text-white border-[#3c8dbc]'
                          : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white hover:border-[#3c8dbc]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[15px] w-5 text-center">{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <span className={`text-[10px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>

                    {/* Sub Items (ul.depth) */}
                    <ul
                      className={`overflow-hidden transition-all duration-200 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      } bg-[#2c3b41]`}
                    >
                      {item.subItems?.map((sub) => {
                        const subActive = isPathActive(sub.href);
                        return (
                          <li key={sub.id}>
                            <Link
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block pl-10 pr-4 py-2.5 transition-colors text-[12.5px] ${
                                subActive
                                  ? 'text-white font-bold bg-[#1e282c] border-l-2 border-[#3c8dbc]'
                                  : 'text-[#8aa4af] hover:text-white hover:bg-[#222d32]'
                              }`}
                            >
                              <span className={`mr-1.5 ${subActive ? 'text-[#3c8dbc]' : 'text-[#4e6775]'}`}>›</span>
                              {sub.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* ====== Main Content Area (#contents_box) ====== */}
        <main className="flex-1 overflow-y-auto bg-[#ecf0f5] flex flex-col justify-between">
          <div className="p-4 md:p-5 max-w-[1400px]">
            {/* Contents Title (#contents_title) */}
            {pageTitle && (
              <div className="mb-4">
                <h1 className="text-[18px] font-bold text-[#333333] tracking-tight">
                  {pageTitle}
                </h1>
              </div>
            )}

            {/* Page Body */}
            {children}
          </div>

          {/* ====== Footer (#footer) ====== */}
          <footer className="p-4 border-t border-[#d2d6de] bg-white text-center text-[12px] text-[#666] leading-relaxed mt-8">
            <div>
              Copyright ⓒ <a href="http://www.xmecca.com" target="_blank" rel="noreferrer" className="text-[#3c8dbc] font-bold hover:underline">xmecca.com</a> All Rights Reserved.
            </div>
            <div className="text-gray-500 mt-0.5">
              ✉ dbdbschool@naver.com
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Info Edit Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-[460px] w-full overflow-hidden">
            <div className="bg-[#3c8dbc] text-white px-4 py-3 font-bold text-[14px] flex justify-between items-center">
              <span>👤 관리자({adminName}) 정보수정</span>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="text-white hover:text-gray-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAdminSave} className="p-4">
              <table className="w-full text-[13px] border-collapse mb-4">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-bold bg-gray-50 w-28">관리자 ID</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value="admin_hyeryeon"
                        readOnly
                        className="w-full px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-gray-600 text-[12px]"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-bold bg-gray-50">성명</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-bold bg-gray-50">휴대폰 번호</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-bold bg-gray-50">이메일</td>
                    <td className="p-2">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-bold bg-gray-50">새 비밀번호</td>
                    <td className="p-2">
                      <input
                        type="password"
                        placeholder="변경 시에만 입력"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold bg-gray-50">비밀번호 확인</td>
                    <td className="p-2">
                      <input
                        type="password"
                        placeholder="새 비밀번호 재입력"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-[12px]"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-3 py-1.5 text-[12px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  닫기
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[12px] bg-[#3c8dbc] text-white font-bold rounded hover:bg-[#367fa9]"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
