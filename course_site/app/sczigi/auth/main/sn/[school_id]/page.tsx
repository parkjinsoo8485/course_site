'use client';

import React, { useState } from 'react';
import SczigiLayout from '@/components/sczigi/SczigiLayout';
import { useSczigiStore } from '@/store/useSczigiStore';

interface PageProps {
  params: {
    school_id: string;
  };
}

export default function AuthMainConfigPage({ params }: PageProps) {
  const schoolId = params?.school_id || '3267';
  const { adminAuthPermissions, updateAdminAuthPermission } = useSczigiStore();

  const [permissions, setPermissions] = useState([...adminAuthPermissions]);

  const handleToggle = (id: string, field: 'canManageTeachers' | 'canManageStudents' | 'canManageSms') => {
    setPermissions(
      permissions.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: !p[field] };
        }
        return p;
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    permissions.forEach((p) => {
      updateAdminAuthPermission(p.id, p);
    });
    alert('서비스 관리자 권한 설정이 성공적으로 저장되었습니다.');
  };

  return (
    <SczigiLayout schoolId={schoolId} pageTitle="권한설정">
      <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded text-[13px] mb-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>각 개별 서비스 관리자에게 학교관리 하위 메뉴(교직원관리, 학생관리, 문자관리) 접근 권한을 부여합니다.</li>
        </ul>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#dcdcdc] rounded shadow-sm overflow-hidden">
        <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#dcdcdc] font-bold text-[14px] text-[#333]">
          서비스 관리자 권한 설정
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse text-center">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th rowSpan={2} className="py-2.5 px-4 border-r border-[#e5e5e5] w-[180px]">
                  서비스명
                </th>
                <th colSpan={3} className="py-2 px-4 bg-gray-100 font-bold text-gray-800">
                  학교관리 메뉴 이용 권한
                </th>
              </tr>
              <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5] text-[#555] font-semibold">
                <th className="py-2 px-4 border-r border-[#e5e5e5] w-[160px]">관리자ID</th>
                <th className="py-2 px-4 border-r border-[#e5e5e5]">교직원관리</th>
                <th className="py-2 px-4">학생관리</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p.id} className="border-b border-[#e5e5e5] hover:bg-[#f5f8fa] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#337ab7] border-r border-[#e5e5e5] bg-gray-50/50">
                    {p.serviceName}
                  </td>
                  <td className="py-3 px-4 border-r border-[#e5e5e5] font-semibold text-gray-800">
                    {p.adminId} ({p.adminName})
                  </td>
                  <td className="py-3 px-4 border-r border-[#e5e5e5]">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.canManageTeachers}
                        onChange={() => handleToggle(p.id, 'canManageTeachers')}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700">권한 부여</span>
                    </label>
                  </td>
                  <td className="py-3 px-4">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={p.canManageStudents}
                        onChange={() => handleToggle(p.id, 'canManageStudents')}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700">권한 부여</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-[#dcdcdc] flex justify-center space-x-2">
          <button
            type="submit"
            className="bg-[#337ab7] hover:bg-[#286090] text-white px-6 py-2 rounded font-bold text-[13.5px] shadow-sm"
          >
            수정 (설정 저장)
          </button>
          <button
            type="button"
            onClick={() => setPermissions([...adminAuthPermissions])}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded font-medium text-[13.5px]"
          >
            취소
          </button>
        </div>
      </form>
    </SczigiLayout>
  );
}
