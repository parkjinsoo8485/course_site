import { create } from 'zustand';

export interface QnaItem {
  id: number;
  schoolId?: string;
  schoolName?: string;
  title: string;
  author: string;
  hp1?: string;
  hp2?: string;
  hp3?: string;
  phone?: string;
  tel?: string;
  email?: string;
  status: '대기' | '완료' | '접수' | '처리중';
  createdAt: string;
  views: number;
  answerDate: string | null;
  content?: string;
  answerContent?: string;
  fileName?: string;
  fileUrl?: string;
  updateManagerInfo?: boolean;
}

export type QnaStatus = '전체' | '대기' | '완료' | '접수' | '처리중' | '=진행상태=';
export type QnaSearchType = 'sub_con' | 'subject' | 'contents' | 'author';

interface QnaState {
  qnas: QnaItem[];
  selectedStatus: QnaStatus;
  searchType: QnaSearchType;
  searchTerm: string;
  setSelectedStatus: (status: QnaStatus) => void;
  setSearchType: (type: QnaSearchType) => void;
  setSearchTerm: (term: string) => void;
  resetFilter: () => void;
  getFilteredQnas: () => QnaItem[];
  addQna: (newQna: Omit<QnaItem, 'id' | 'createdAt' | 'views' | 'answerDate' | 'status'>) => void;
  replyQna: (id: number, answerContent: string, status: QnaItem['status']) => void;
  deleteQna: (id: number) => void;
}

export const useQnaStore = create<QnaState>((set, get) => ({
  qnas: [
    {
      id: 3,
      schoolId: '1001',
      schoolName: '서울초등학교',
      title: '2026학년도 늘봄학교 교재 수량 변경 요청건',
      author: '박상현',
      hp1: '010',
      hp2: '9876',
      hp3: '5432',
      phone: '010-9876-5432',
      tel: '02-123-4567',
      email: 'park1001@seoul.es.kr',
      status: '접수',
      createdAt: '2026-08-17',
      views: 12,
      answerDate: null,
      content: '늘봄학교 교실 추가로 인한 로봇교실 교재 20세트 추가 요청드립니다.',
    },
    {
      id: 2,
      schoolId: '3267',
      schoolName: '광주풍향초등학교',
      title: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
      author: '김혜련',
      hp1: '010',
      hp2: '2494',
      hp3: '1479',
      phone: '010-2494-1479',
      tel: '062-609-1182',
      email: 'khh147979@naver.com',
      status: '완료',
      createdAt: '2026-06-01',
      views: 42,
      answerDate: '06/01',
      content: '2026학년도 바뀐 설문지 보내드립니다.\n감사합니다.',
      answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.',
      fileName: '2026학년도1학기늘봄학교만족도조사설문지.hwp',
    },
    {
      id: 1,
      schoolId: '3267',
      schoolName: '광주풍향초등학교',
      title: '지원금 스쿨뱅킹 현황',
      author: '관리자',
      hp1: '010',
      hp2: '1234',
      hp3: '5678',
      phone: '010-1234-5678',
      tel: '062-609-1180',
      email: 'admin@school.go.kr',
      status: '완료',
      createdAt: '2025-06-13',
      views: 38,
      answerDate: '06/13',
      content: '지원금 스쿨뱅킹 이체 현황 및 자동 차감 설정 관련 문의입니다.',
      answerContent: '안녕하세요. 지원금 스쿨뱅킹 처리 내역 조회가 완료되었습니다.',
    },
  ],
  selectedStatus: '전체',
  searchType: 'sub_con',
  searchTerm: '',
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSearchType: (type) => set({ searchType: type }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  resetFilter: () => set({ selectedStatus: '전체', searchType: 'sub_con', searchTerm: '' }),
  getFilteredQnas: () => {
    const { qnas, selectedStatus, searchType, searchTerm } = get();
    return qnas.filter((item) => {
      const matchesStatus =
        selectedStatus === '전체' ||
        selectedStatus === '=진행상태=' ||
        selectedStatus === 'all' ||
        item.status === selectedStatus;
      
      if (!searchTerm) return matchesStatus;

      const term = searchTerm.toLowerCase();
      let matchesSearch = false;
      if (searchType === 'subject') {
        matchesSearch = item.title.toLowerCase().includes(term);
      } else if (searchType === 'contents') {
        matchesSearch = (item.content || '').toLowerCase().includes(term);
      } else if (searchType === 'author') {
        matchesSearch = item.author.toLowerCase().includes(term);
      } else {
        // sub_con default
        matchesSearch =
          item.title.toLowerCase().includes(term) ||
          (item.content || '').toLowerCase().includes(term);
      }
      return matchesStatus && matchesSearch;
    });
  },
  addQna: (newQna) => {
    const { qnas } = get();
    const nextId = Math.max(...qnas.map((q) => q.id), 0) + 1;
    const now = new Date();
    const createdAtStr = now.toISOString().split('T')[0];
    const fullPhone = newQna.phone || `${newQna.hp1 || '010'}-${newQna.hp2 || ''}-${newQna.hp3 || ''}`;
    const created: QnaItem = {
      ...newQna,
      schoolId: newQna.schoolId || '3267',
      schoolName: newQna.schoolName || '광주풍향초등학교',
      phone: fullPhone,
      id: nextId,
      status: '접수',
      createdAt: createdAtStr,
      views: 1,
      answerDate: null,
    };
    set({ qnas: [created, ...qnas] });
  },
  replyQna: (id, answerContent, status) => {
    const { qnas } = get();
    const now = new Date();
    const answerDateStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    set({
      qnas: qnas.map((q) =>
        q.id === id ? { ...q, answerContent, status, answerDate: answerDateStr } : q
      ),
    });
  },
  deleteQna: (id) => {
    const { qnas } = get();
    set({ qnas: qnas.filter((q) => q.id !== id) });
  },
}));

export default useQnaStore;

