import React from 'react';

export const metadata = {
  title: '디비디비스쿨 학교관리 시스템 | 스쿨지기',
  description: '디비디비스쿨 학교관리, 교직원관리, 학생관리, 문자관리 및 권한 설정',
};

export default function SczigiRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
