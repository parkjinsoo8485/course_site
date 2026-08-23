'use client';

import { create } from 'zustand';
import { QnaItem, QnaFilterParams, QnaStatusType } from '@/types/qna';

const INITIAL_QNA_ITEMS: QnaItem[] = [
  {
    num: 2,
    id: '8806',
    schoolId: '3267',
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
        ext: 'hwp'
      }
    ],
    status: '2',
    statusText: '완료',
    statusColor: '#EB9316',
    createdAt: '2026-06-01',
    answerDate: '06/01',
    answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.',
    updateManagerInfo: false,
  },
  {
    num: 1,
    id: '3356',
    schoolId: '3267',
    authorName: '김혜련',
    hp1: '010',
    hp2: '2494',
    hp3: '1479',
    phone: '062-609-1182',
    email: 'khh147979@naver.com',
    subject: '지원금 스쿨뱅킹 현황',
    contents: '1학기 지원금 스쿨뱅킹 수납 현황 파일 확인 부탁드립니다.',
    files: [],
    status: '2',
    statusText: '완료',
    statusColor: '#EB9316',
    createdAt: '2025-06-13',
    answerDate: '06/13',
    answerContent: '스쿨뱅킹 집계 데이터 정상 반영 완료되었습니다.',
    updateManagerInfo: false,
  }
];

interface QnaState {
  items: QnaItem[];
  filteredItems: QnaItem[];
  filterParams: QnaFilterParams;
  setFilterParams: (params: Partial<QnaFilterParams>) => void;
  filterList: () => void;
  addItem: (item: Omit<QnaItem, 'num' | 'id' | 'createdAt' | 'statusText' | 'statusColor'>) => QnaItem;
  updateItem: (id: string, updates: Partial<QnaItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => QnaItem | undefined;
}

export const useQnaStore = create<QnaState>((set, get) => ({
  items: INITIAL_QNA_ITEMS,
  filteredItems: INITIAL_QNA_ITEMS,
  filterParams: {
    as: 'all',
    st: 'sub_con',
    sw: '',
  },

  setFilterParams: (params) => {
    set((state) => ({
      filterParams: { ...state.filterParams, ...params },
    }));
    get().filterList();
  },

  filterList: () => {
    const { items, filterParams } = get();
    let result = [...items];

    // Status filter
    if (filterParams.as && filterParams.as !== 'all') {
      result = result.filter((item) => item.status === filterParams.as);
    }

    // Keyword filter
    if (filterParams.sw && filterParams.sw.trim()) {
      const keyword = filterParams.sw.trim().toLowerCase();
      result = result.filter((item) => {
        if (filterParams.st === 'subject') {
          return item.subject.toLowerCase().includes(keyword);
        } else if (filterParams.st === 'contents') {
          return item.contents.toLowerCase().includes(keyword);
        } else {
          // sub_con
          return (
            item.subject.toLowerCase().includes(keyword) ||
            item.contents.toLowerCase().includes(keyword)
          );
        }
      });
    }

    set({ filteredItems: result });
  },

  addItem: (newPost) => {
    const { items } = get();
    const nextNum = items.length > 0 ? Math.max(...items.map((i) => i.num)) + 1 : 1;
    const nextId = String(Date.now()).slice(-4);
    const today = new Date().toISOString().split('T')[0];

    const statusTextMap: Record<QnaStatusType, '접수' | '처리중' | '완료' | '답변완료'> = {
      '0': '접수',
      '1': '처리중',
      '2': '완료',
      '3': '답변완료',
    };

    const statusColorMap: Record<QnaStatusType, string> = {
      '0': '#475569',
      '1': '#2563EB',
      '2': '#EB9316',
      '3': '#16A34A',
    };

    const status = newPost.status || '0';

    const item: QnaItem = {
      ...newPost,
      num: nextNum,
      id: nextId,
      status,
      statusText: statusTextMap[status],
      statusColor: statusColorMap[status],
      createdAt: today,
      answerDate: '',
      answerContent: '',
    };

    const updated = [item, ...items];
    set({ items: updated });
    get().filterList();
    return item;
  },

  updateItem: (id, updates) => {
    const { items } = get();
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextStatus = updates.status || item.status;
        const statusTextMap: Record<QnaStatusType, '접수' | '처리중' | '완료' | '답변완료'> = {
          '0': '접수',
          '1': '처리중',
          '2': '완료',
          '3': '답변완료',
        };
        const statusColorMap: Record<QnaStatusType, string> = {
          '0': '#475569',
          '1': '#2563EB',
          '2': '#EB9316',
          '3': '#16A34A',
        };

        return {
          ...item,
          ...updates,
          statusText: statusTextMap[nextStatus],
          statusColor: statusColorMap[nextStatus],
        };
      }
      return item;
    });

    set({ items: updated });
    get().filterList();
  },

  deleteItem: (id) => {
    const { items } = get();
    const updated = items.filter((item) => item.id !== id);
    set({ items: updated });
    get().filterList();
  },

  getItemById: (id) => {
    const { items } = get();
    return items.find((item) => item.id === id);
  },
}));
