'use client';

import React, { useState, useEffect } from 'react';

interface SchoolItem {
  id: string;
  code: string;
  name: string;
  plan: string;
  status: string;
  expireDate: string;
  adminName: string;
  adminEmail: string;
  phone: string;
  courses: number;
  students: number;
}

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([
    {
      id: '3267',
      code: 'PUNGHYANG3267',
      name: '광주풍향초등학교',
      plan: 'Premium',
      status: '정상운영',
      expireDate: '2026-12-31',
      adminName: '김혜련 (늘봄실무사)',
      adminEmail: 'khh147979@naver.com',
      phone: '010-2494-1479',
      courses: 18,
      students: 450,
    },
    {
      id: '1001',
      code: 'SEOUL1001',
      name: '서울초등학교',
      plan: 'Standard',
      status: '정상운영',
      expireDate: '2026-11-30',
      adminName: '박상현',
      adminEmail: 'park1001@seoul.es.kr',
      phone: '010-9876-5432',
      courses: 14,
      students: 320,
    },
    {
      id: '1002',
      code: 'BUSAN1002',
      name: '부산초등학교',
      plan: 'Standard',
      status: '정상운영',
      expireDate: '2026-10-15',
      adminName: '이동현',
      adminEmail: 'lee1002@busan.es.kr',
      phone: '010-5555-1234',
      courses: 12,
      students: 280,
    },
    {
      id: '1003',
      code: 'DAEGU1003',
      name: '대구초등학교',
      plan: 'Basic',
      status: '정상운영',
      expireDate: '2026-09-30',
      adminName: '정수진',
      adminEmail: 'jung1003@daegu.es.kr',
      phone: '010-7777-8888',
      courses: 14,
      students: 370,
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetch('/api/schools/all')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.schools) setSchools(data.schools);
      })
      .catch(() => {});
  }, []);

  const filteredSchools = schools.filter((s) => {
    const matchPlan = selectedPlan === '전체' || s.plan === selectedPlan;
    const matchStatus = selectedStatus === '전체' || s.status === selectedStatus;
    const matchSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.adminName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchPlan && matchStatus && matchSearch;
  });

  const totalCourses = schools.reduce((acc, s) => acc + (s.courses || 0), 0);
  const totalStudents = schools.reduce((acc, s) => acc + (s.students || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-6 text-slate-800">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-lg p-6 mb-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Super Admin</span>
            <span>전체 학교 (SaaS 테넌트) 관리 센터</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🏫 디비디비스쿨 전체 학교 관리
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            전체 테넌트 학교의 구독 플랜, 만료일, 서비스 상태 및 담당자를 종합적으로 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a href="/superadmin" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium border border-slate-700">
            📊 관제 대시보드
          </a>
          <a href="/superadmin/schools" className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold">
            🏫 전체 학교 관리
          </a>
          <a href="/superadmin/qna" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium border border-slate-700">
            🎧 고객지원 문의
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">전체 등록 학교</div>
            <div className="text-2xl font-bold text-slate-900">{schools.length}개 학교</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl">🏫</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">정상 운영 테넌트</div>
            <div className="text-2xl font-bold text-emerald-600">{schools.filter((s) => s.status === '정상운영').length}개 학교</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-xl">✅</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">프리미엄 플랜</div>
            <div className="text-2xl font-bold text-purple-600">{schools.filter((s) => s.plan === 'Premium').length}개 학교</div>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-xl">👑</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">총 강좌 / 수강생</div>
            <div className="text-lg font-bold text-slate-800">{totalCourses}강좌 / {totalStudents.toLocaleString()}명</div>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 text-xl">👥</div>
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">📋 SaaS 테넌트 학교 목록</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
            >
              <option value="전체">전체 플랜</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
            >
              <option value="전체">전체 상태</option>
              <option value="정상운영">정상운영</option>
              <option value="만료예정">만료예정</option>
              <option value="서비스정지">서비스정지</option>
            </select>
            <input
              type="text"
              placeholder="학교명/코드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3">학교 코드</th>
                <th className="p-3">학교명</th>
                <th className="p-3 text-center">구독 플랜</th>
                <th className="p-3 text-center">만료일</th>
                <th className="p-3 text-center">상태</th>
                <th className="p-3">담당 관리자</th>
                <th className="p-3 text-center">강좌/수강생</th>
                <th className="p-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSchools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-semibold text-blue-600">{s.code}</td>
                  <td className="p-3 font-bold text-slate-800">{s.name}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      s.plan === 'Premium' ? 'bg-purple-100 text-purple-700' : s.plan === 'Standard' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">{s.expireDate}</td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-700">{s.adminName}</div>
                    <div className="text-[11px] text-slate-500">{s.phone}</div>
                  </td>
                  <td className="p-3 text-center font-mono font-semibold">
                    {s.courses}강좌 / {s.students}명
                  </td>
                  <td className="p-3 text-center">
                    <a
                      href={`/af/qanda/lists/sn/${s.id}`}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      바로가기 ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
