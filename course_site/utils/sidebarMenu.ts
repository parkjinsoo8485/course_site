/**
 * sidebarMenu.ts
 * dbdbschool After-School Management Admin Sidebar Navigation Structure
 */

export interface SubMenuItem {
  id: string;
  name: string;
  href: (schoolId: string) => string;
  badge?: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  href?: (schoolId: string) => string;
  children?: SubMenuItem[];
}

export const ADMIN_SIDEBAR_MENUS: MenuItem[] = [
  // 1. 단독 대메뉴 (13개)
  {
    id: 'ad_faq_main',
    name: '매뉴얼',
    icon: 'fa-solid fa-book',
    href: (sn) => `/af/ad_faq/main/sn/${sn}`,
  },
  {
    id: 'qanda_lists',
    name: '고객지원 게시판',
    icon: 'fa-solid fa-comments',
    href: (sn) => `/af/qanda/lists/sn/${sn}`,
  },
  {
    id: 'sczigi_service_lists',
    name: '학교관리',
    icon: 'fa-solid fa-school',
    href: (sn) => `/sczigi/service/lists/sn/${sn}`,
  },
  {
    id: 'ad_lec_lists',
    name: '강좌관리',
    icon: 'fa-solid fa-futbol',
    href: (sn) => `/af/ad_lec/lists/sn/${sn}`,
  },
  {
    id: 'ad_app_lists',
    name: '신청자관리',
    icon: 'fa-solid fa-user-group',
    href: (sn) => `/af/ad_app/lists/sn/${sn}`,
  },
  {
    id: 'ad_wait_lists',
    name: '대기자관리',
    icon: 'fa-solid fa-user-clock',
    href: (sn) => `/af/ad_wait/lists/sn/${sn}`,
  },
  {
    id: 'ad_att_stat',
    name: '출석부관리',
    icon: 'fa-solid fa-square-check',
    href: (sn) => `/af/ad_att/stat/sn/${sn}`,
  },
  {
    id: 'ad_ref_lists',
    name: '환불/취소관리',
    icon: 'fa-solid fa-user-minus',
    href: (sn) => `/af/ad_ref/lists/sn/${sn}`,
  },
  // 2. 지원금관리 ∨ (4개)
  {
    id: 'ad_subsidy',
    name: '지원금관리',
    icon: 'fa-solid fa-building-columns',
    children: [
      {
        id: 'ad_free2_stu',
        name: '대상자관리',
        href: (sn) => `/af/ad_free2_stu/lists/sn/${sn}`,
      },
      {
        id: 'ad_free2_app',
        name: '수강자관리',
        href: (sn) => `/af/ad_free2_app/lists/sn/${sn}`,
      },
      {
        id: 'ad_free2_cfg_main',
        name: '지원금설정',
        href: (sn) => `/af/ad_free2_cfg/main/sn/${sn}`,
      },
      {
        id: 'ad_free2_cfg_free1',
        name: '순위구분설정',
        href: (sn) => `/af/ad_free2_cfg/free1/sn/${sn}`,
      },
    ],
  },
  {
    id: 'ad_abs_lists',
    name: '결석/귀가신청',
    icon: 'fa-solid fa-calendar-xmark',
    href: (sn) => `/af/ad_abs/lists/sn/${sn}`,
  },
  {
    id: 'ad_tea_lists',
    name: '강사관리',
    icon: 'fa-solid fa-briefcase',
    href: (sn) => `/af/ad_tea/lists/sn/${sn}`,
  },
  // 3. 설문관리 ∨ (2개)
  {
    id: 'ad_survey',
    name: '설문관리',
    icon: 'fa-solid fa-chart-pie',
    children: [
      {
        id: 'ad_sur_lists',
        name: '설문',
        href: (sn) => `/af/ad_sur/lists/sn/${sn}`,
      },
      {
        id: 'ad_surs_lists',
        name: '샘플설문',
        href: (sn) => `/af/ad_surs/lists/sn/${sn}`,
      },
    ],
  },
  // 4. 환경설정 ∨ (10개)
  {
    id: 'ad_config',
    name: '환경설정',
    icon: 'fa-solid fa-gear',
    children: [
      {
        id: 'ad_cfg_main',
        name: '기본설정',
        href: (sn) => `/af/ad_cfg/main/sn/${sn}`,
      },
      {
        id: 'ad_time_lists',
        name: '신청기간',
        href: (sn) => `/af/ad_time/lists/sn/${sn}`,
      },
      {
        id: 'ad_cfg_period',
        name: '강의시간',
        href: (sn) => `/af/ad_cfg/period/sn/${sn}`,
      },
      {
        id: 'ad_cfg_afDiv',
        name: '강좌구분',
        href: (sn) => `/af/ad_cfg/afDiv/sn/${sn}`,
      },
      {
        id: 'ad_cfg_appLiGrp',
        name: '중복제한그룹',
        href: (sn) => `/af/ad_cfg/appLiGrp/sn/${sn}`,
      },
      {
        id: 'ad_verify_main',
        name: '학적검증',
        href: (sn) => `/af/ad_verify/main/sn/${sn}`,
      },
      {
        id: 'ad_neis_edufine_lists',
        name: '나이스/에듀파인 설정',
        href: (sn) => `/af/ad_neis_edufine/lists/sn/${sn}`,
      },
      {
        id: 'ad_cfg_message',
        name: '안내글설정',
        href: (sn) => `/af/ad_cfg/message/sn/${sn}`,
      },
      {
        id: 'ad_cfg_clear',
        name: '초기화',
        href: (sn) => `/af/ad_cfg/clear/sn/${sn}`,
      },
      {
        id: 'ad_info_modify',
        name: '담당자정보',
        href: (sn) => `/af/ad_info/modify/sn/${sn}`,
      },
    ],
  },
  {
    id: 'notification_lists',
    name: '알림관리',
    icon: 'fa-solid fa-volume-high',
    href: (sn) => `/af/notification/lists/sn/${sn}`,
  },
  {
    id: 'spush_lists',
    name: '푸시알림관리',
    icon: 'fa-solid fa-bell',
    href: (sn) => `/af/spush/lists/sn/${sn}`,
  },
  {
    id: 'ad_extension_lists',
    name: '연장신청',
    icon: 'fa-solid fa-calendar-check',
    badge: '198일 남음',
    href: (sn) => `/af/ad_extension/lists/sn/${sn}`,
  },
];
