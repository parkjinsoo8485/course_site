const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_FILE = path.join(__dirname, 'data.json');

// Initial seed data for immediate out-of-the-box demo
const defaultData = {
  schools: [
    {
      id: 'sch_1',
      code: 'UNCHON2025',
      name: '운천초등학교',
      plan: 'standard', // basic, standard, premium
      status: 'active',
      expireDate: '2026-12-31',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sch_2',
      code: 'SEOUL2025',
      name: '서울늘봄초등학교',
      plan: 'premium',
      status: 'active',
      expireDate: '2026-11-30',
      createdAt: new Date().toISOString()
    }
  ],
  users: [],
  courses: [
    // ===== 실제 광주풍향초등학교 (26년 8월) 강좌 데이터 - 59개 =====
    { id: 'lec_1552375', schoolId: 'sch_1', code: '1552375', category: '26년 8월', neulbomType: '돌봄', title: '(금) 돌봄 4부', teacherName: '돌봄전담사', applied: 19, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '금:14:00~15:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552291', schoolId: 'sch_1', code: '1552291', category: '26년 8월', neulbomType: '돌봄', title: '(금)돌봄 1부', teacherName: '돌봄전담사', applied: 5, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '금:11:00~12:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552292', schoolId: 'sch_1', code: '1552292', category: '26년 8월', neulbomType: '돌봄', title: '(금)돌봄 2부', teacherName: '돌봄전담사', applied: 12, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '금:12:00~13:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552293', schoolId: 'sch_1', code: '1552293', category: '26년 8월', neulbomType: '돌봄', title: '(금)돌봄 3부', teacherName: '돌봄전담사', applied: 20, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '금:13:00~14:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552374', schoolId: 'sch_1', code: '1552374', category: '26년 8월', neulbomType: '돌봄', title: '(목) 돌봄 4부', teacherName: '돌봄전담사', applied: 20, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '목:14:00~15:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552288', schoolId: 'sch_1', code: '1552288', category: '26년 8월', neulbomType: '돌봄', title: '(목)돌봄 1부', teacherName: '돌봄전담사', applied: 2, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '목:11:00~12:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552289', schoolId: 'sch_1', code: '1552289', category: '26년 8월', neulbomType: '돌봄', title: '(목)돌봄 2부', teacherName: '돌봄전담사', applied: 4, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '목:12:00~13:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552290', schoolId: 'sch_1', code: '1552290', category: '26년 8월', neulbomType: '돌봄', title: '(목)돌봄 3부', teacherName: '돌봄전담사', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '목:13:00~14:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552284', schoolId: 'sch_1', code: '1552284', category: '26년 8월', neulbomType: '돌봄', title: '(수)돌봄 1부', teacherName: '돌봄전담사', applied: 1, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '수:11:00~12:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552285', schoolId: 'sch_1', code: '1552285', category: '26년 8월', neulbomType: '돌봄', title: '(수)돌봄 2부', teacherName: '돌봄전담사', applied: 4, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '수:12:00~13:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552286', schoolId: 'sch_1', code: '1552286', category: '26년 8월', neulbomType: '돌봄', title: '(수)돌봄 3부', teacherName: '돌봄전담사', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '수:13:00~14:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552287', schoolId: 'sch_1', code: '1552287', category: '26년 8월', neulbomType: '돌봄', title: '(수)돌봄 4부', teacherName: '돌봄전담사', applied: 20, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '수:14:00~15:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552277', schoolId: 'sch_1', code: '1552277', category: '26년 8월', neulbomType: '돌봄', title: '(월)돌봄 1부', teacherName: '돌봄전담사', applied: 1, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '월:11:00~12:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552278', schoolId: 'sch_1', code: '1552278', category: '26년 8월', neulbomType: '돌봄', title: '(월)돌봄 2부', teacherName: '돌봄전담사', applied: 4, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '월:12:00~13:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552279', schoolId: 'sch_1', code: '1552279', category: '26년 8월', neulbomType: '돌봄', title: '(월)돌봄 3부', teacherName: '돌봄전담사', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '월:13:00~14:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552280', schoolId: 'sch_1', code: '1552280', category: '26년 8월', neulbomType: '돌봄', title: '(월)돌봄 4부', teacherName: '돌봄전담사', applied: 20, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '월:14:00~15:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552373', schoolId: 'sch_1', code: '1552373', category: '26년 8월', neulbomType: '돌봄', title: '(화) 돌봄 4부', teacherName: '돌봄전담사', applied: 20, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '화:14:00~15:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552281', schoolId: 'sch_1', code: '1552281', category: '26년 8월', neulbomType: '돌봄', title: '(화)돌봄 1부', teacherName: '돌봄전담사', applied: 2, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '화:11:00~12:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552282', schoolId: 'sch_1', code: '1552282', category: '26년 8월', neulbomType: '돌봄', title: '(화)돌봄 2부', teacherName: '돌봄전담사', applied: 4, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '화:12:00~13:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552283', schoolId: 'sch_1', code: '1552283', category: '26년 8월', neulbomType: '돌봄', title: '(화)돌봄 3부', teacherName: '돌봄전담사', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '화:13:00~14:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552299', schoolId: 'sch_1', code: '1552299', category: '26년 8월', neulbomType: '방과후', title: '논술 1부', teacherName: '박지숙', applied: 17, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552300', schoolId: 'sch_1', code: '1552300', category: '26년 8월', neulbomType: '방과후', title: '논술 2부', teacherName: '박지숙', applied: 11, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552301', schoolId: 'sch_1', code: '1552301', category: '26년 8월', neulbomType: '방과후', title: '논술 3부', teacherName: '박지숙', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4,5,6', period: '2026-08-01~2026-08-31', schedule: '금:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'WAITING' },
    { id: 'lec_1552297', schoolId: 'sch_1', code: '1552297', category: '26년 8월', neulbomType: '방과후', title: '놀이체육 1부', teacherName: '강태연', applied: 11, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552296', schoolId: 'sch_1', code: '1552296', category: '26년 8월', neulbomType: '방과후', title: '놀이체육 2부', teacherName: '강태연', applied: 15, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552324', schoolId: 'sch_1', code: '1552324', category: '26년 8월', neulbomType: '방과후', title: '뉴스포츠 1부', teacherName: '박지연', applied: 30, capacity: 30, waiting: 2, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552325', schoolId: 'sch_1', code: '1552325', category: '26년 8월', neulbomType: '방과후', title: '뉴스포츠 2부', teacherName: '박지연', applied: 20, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552302', schoolId: 'sch_1', code: '1552302', category: '26년 8월', neulbomType: '방과후', title: '댄스 1부', teacherName: '김지향', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월:15:00~16:40', fee: 35000, costInstructor: 28000, costFacility: 7000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'WAITING' },
    { id: 'lec_1552303', schoolId: 'sch_1', code: '1552303', category: '26년 8월', neulbomType: '방과후', title: '댄스 2부', teacherName: '김지향', applied: 16, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4,5', period: '2026-08-01~2026-08-31', schedule: '화:15:00~16:40', fee: 35000, costInstructor: 28000, costFacility: 7000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552304', schoolId: 'sch_1', code: '1552304', category: '26년 8월', neulbomType: '방과후', title: '댄스 3부', teacherName: '김지향', applied: 6, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '5,6', period: '2026-08-01~2026-08-31', schedule: '목:15:00~16:40', fee: 35000, costInstructor: 28000, costFacility: 7000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552295', schoolId: 'sch_1', code: '1552295', category: '26년 8월', neulbomType: '방과후', title: '독후활동미술놀이 1부', teacherName: '임은희', applied: 9, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 30000, costInstructor: 24000, costFacility: 6000, materialFee: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552294', schoolId: 'sch_1', code: '1552294', category: '26년 8월', neulbomType: '방과후', title: '독후활동미술놀이 2부', teacherName: '임은희', applied: 20, capacity: 20, waiting: 1, waitingCapacity: 5, grade: '3,4', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 30000, costInstructor: 24000, costFacility: 6000, materialFee: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552305', schoolId: 'sch_1', code: '1552305', category: '26년 8월', neulbomType: '방과후', title: '로봇과학 1부', teacherName: '최정호', applied: 14, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 40000, costInstructor: 32000, costFacility: 8000, materialFee: 10000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552306', schoolId: 'sch_1', code: '1552306', category: '26년 8월', neulbomType: '방과후', title: '로봇과학 2부', teacherName: '최정호', applied: 22, capacity: 25, waiting: 0, waitingCapacity: 5, grade: '3,4,5', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 40000, costInstructor: 32000, costFacility: 8000, materialFee: 10000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552307', schoolId: 'sch_1', code: '1552307', category: '26년 8월', neulbomType: '방과후', title: '로봇과학 3부', teacherName: '최정호', applied: 6, capacity: 25, waiting: 0, waitingCapacity: 5, grade: '5,6', period: '2026-08-01~2026-08-31', schedule: '금:15:00~15:50', fee: 40000, costInstructor: 32000, costFacility: 8000, materialFee: 10000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552313', schoolId: 'sch_1', code: '1552313', category: '26년 8월', neulbomType: '방과후', title: '바둑 1부', teacherName: '박경도', applied: 8, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552314', schoolId: 'sch_1', code: '1552314', category: '26년 8월', neulbomType: '방과후', title: '바둑 2부', teacherName: '박경도', applied: 4, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552315', schoolId: 'sch_1', code: '1552315', category: '26년 8월', neulbomType: '방과후', title: '바이올린 1부', teacherName: '천윤아', applied: 8, capacity: 12, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 60000, costInstructor: 48000, costFacility: 12000, textbookFee: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552316', schoolId: 'sch_1', code: '1552316', category: '26년 8월', neulbomType: '방과후', title: '바이올린 2부', teacherName: '천윤아', applied: 11, capacity: 12, waiting: 0, waitingCapacity: 3, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 60000, costInstructor: 48000, costFacility: 12000, textbookFee: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552326', schoolId: 'sch_1', code: '1552326', category: '26년 8월', neulbomType: '방과후', title: '생활영어 1부', teacherName: '서인경', applied: 9, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 35000, costInstructor: 28000, costFacility: 7000, textbookFee: 3000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552327', schoolId: 'sch_1', code: '1552327', category: '26년 8월', neulbomType: '방과후', title: '생활영어 2부', teacherName: '서인경', applied: 4, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 35000, costInstructor: 28000, costFacility: 7000, textbookFee: 3000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552298', schoolId: 'sch_1', code: '1552298', category: '26년 8월', neulbomType: '맞춤형', title: '아침늘봄', teacherName: '이금진', applied: 5, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '1', period: '2026-08-01~2026-08-31', schedule: '월~금:08:00~08:40', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552308', schoolId: 'sch_1', code: '1552308', category: '26년 8월', neulbomType: '방과후', title: '주산 1부', teacherName: '박은화', applied: 8, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552309', schoolId: 'sch_1', code: '1552309', category: '26년 8월', neulbomType: '방과후', title: '주산 2부', teacherName: '박은화', applied: 2, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4,5', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552310', schoolId: 'sch_1', code: '1552310', category: '26년 8월', neulbomType: '방과후', title: '주산 3부', teacherName: '박은화', applied: 3, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '5,6', period: '2026-08-01~2026-08-31', schedule: '금:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552317', schoolId: 'sch_1', code: '1552317', category: '26년 8월', neulbomType: '방과후', title: '창의미술 1부', teacherName: '김언주', applied: 20, capacity: 20, waiting: 3, waitingCapacity: 5, grade: '1,2', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, materialFee: 8000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552318', schoolId: 'sch_1', code: '1552318', category: '26년 8월', neulbomType: '방과후', title: '창의미술 2부', teacherName: '김언주', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '3,4', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, materialFee: 8000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552275', schoolId: 'sch_1', code: '1552275', category: '26년 8월', neulbomType: '방과후', title: '창의보드 1부', teacherName: '정진화', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552276', schoolId: 'sch_1', code: '1552276', category: '26년 8월', neulbomType: '방과후', title: '창의보드 2부', teacherName: '정진화', applied: 18, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552328', schoolId: 'sch_1', code: '1552328', category: '26년 8월', neulbomType: '방과후', title: '창의수학 1부', teacherName: '김경아', applied: 17, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552329', schoolId: 'sch_1', code: '1552329', category: '26년 8월', neulbomType: '방과후', title: '창의수학 2부', teacherName: '김경아', applied: 12, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 30000, costInstructor: 24000, costFacility: 6000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552319', schoolId: 'sch_1', code: '1552319', category: '26년 8월', neulbomType: '방과후', title: '컴퓨터 월,수 1부', teacherName: '김윤정', applied: 15, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '1,2', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552320', schoolId: 'sch_1', code: '1552320', category: '26년 8월', neulbomType: '방과후', title: '컴퓨터 월,수 2부', teacherName: '김윤정', applied: 29, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '3,4', period: '2026-08-01~2026-08-31', schedule: '월,수:15:00~15:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552321', schoolId: 'sch_1', code: '1552321', category: '26년 8월', neulbomType: '방과후', title: '컴퓨터 월,수 3부', teacherName: '김윤정', applied: 22, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '5,6', period: '2026-08-01~2026-08-31', schedule: '월,수:16:00~16:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552322', schoolId: 'sch_1', code: '1552322', category: '26년 8월', neulbomType: '방과후', title: '컴퓨터 화,목 1부', teacherName: '김윤정', applied: 22, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '1,2', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552323', schoolId: 'sch_1', code: '1552323', category: '26년 8월', neulbomType: '방과후', title: '컴퓨터 화,목 2부', teacherName: '김윤정', applied: 29, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '3,4', period: '2026-08-01~2026-08-31', schedule: '화,목:15:00~15:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552429', schoolId: 'sch_1', code: '1552429', category: '26년 8월', neulbomType: '방과후', title: '컴퓨터 화,목 3부', teacherName: '김윤정', applied: 28, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:16:00~16:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552311', schoolId: 'sch_1', code: '1552311', category: '26년 8월', neulbomType: '방과후', title: '한자 1부', teacherName: '김재표', applied: 13, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-08-01~2026-08-31', schedule: '월,수:14:00~14:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1552312', schoolId: 'sch_1', code: '1552312', category: '26년 8월', neulbomType: '방과후', title: '한자 2부', teacherName: '김재표', applied: 10, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-08-01~2026-08-31', schedule: '화,목:14:00~14:50', fee: 20000, costInstructor: 16000, costFacility: 4000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    
    // ===== 실제 광주풍향초등학교 (26년 9월) 강좌 데이터 - 56개 =====
    { id: 'lec_1587589', schoolId: 'sch_1', code: '1587589', category: '26년 9월', neulbomType: '돌봄', title: '(금)돌봄 1부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '금:14:00~14:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587590', schoolId: 'sch_1', code: '1587590', category: '26년 9월', neulbomType: '돌봄', title: '(금)돌봄 2부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '금:15:00~15:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587591', schoolId: 'sch_1', code: '1587591', category: '26년 9월', neulbomType: '돌봄', title: '(금)돌봄 3부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '금:16:00~17:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587586', schoolId: 'sch_1', code: '1587586', category: '26년 9월', neulbomType: '돌봄', title: '(목)돌봄 1부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '목:14:00~14:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587587', schoolId: 'sch_1', code: '1587587', category: '26년 9월', neulbomType: '돌봄', title: '(목)돌봄 2부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '목:15:00~15:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587588', schoolId: 'sch_1', code: '1587588', category: '26년 9월', neulbomType: '돌봄', title: '(목)돌봄 3부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '목:16:00~17:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587582', schoolId: 'sch_1', code: '1587582', category: '26년 9월', neulbomType: '돌봄', title: '(수)돌봄 1부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '수:13:20~14:10', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587583', schoolId: 'sch_1', code: '1587583', category: '26년 9월', neulbomType: '돌봄', title: '(수)돌봄 2부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '수:14:10~15:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587584', schoolId: 'sch_1', code: '1587584', category: '26년 9월', neulbomType: '돌봄', title: '(수)돌봄 3부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '수:15:00~15:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587585', schoolId: 'sch_1', code: '1587585', category: '26년 9월', neulbomType: '돌봄', title: '(수)돌봄 4부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '수:16:00~17:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587580', schoolId: 'sch_1', code: '1587580', category: '26년 9월', neulbomType: '돌봄', title: '(화)돌봄 1부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '화:14:00~14:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587581', schoolId: 'sch_1', code: '1587581', category: '26년 9월', neulbomType: '돌봄', title: '(화)돌봄 2부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '화:15:00~15:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587577', schoolId: 'sch_1', code: '1587577', category: '26년 9월', neulbomType: '돌봄', title: '(월)돌봄 1부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '월:14:00~14:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587578', schoolId: 'sch_1', code: '1587578', category: '26년 9월', neulbomType: '돌봄', title: '(월)돌봄 2부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '월:15:00~15:50', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587579', schoolId: 'sch_1', code: '1587579', category: '26년 9월', neulbomType: '돌봄', title: '(월)돌봄 3부', teacherName: '돌봄전담사', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '월:16:00~17:00', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587550', schoolId: 'sch_1', code: '1587550', category: '26년 9월', neulbomType: '방과후', title: '창의로봇 1부', teacherName: '최정호', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '월,수:15:00~15:50', fee: 40000, costInstructor: 32000, costFacility: 8000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587551', schoolId: 'sch_1', code: '1587551', category: '26년 9월', neulbomType: '방과후', title: '창의로봇 2부', teacherName: '최정호', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '4,5,6', period: '2026-09-01~2026-09-30', schedule: '화,목:15:00~15:50', fee: 40000, costInstructor: 32000, costFacility: 8000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587552', schoolId: 'sch_1', code: '1587552', category: '26년 9월', neulbomType: '방과후', title: '바둑교실 1부', teacherName: '박경도', applied: 0, capacity: 20, waiting: 0, waitingCapacity: 5, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '월,수:14:00~14:50', fee: 25000, costInstructor: 20000, costFacility: 5000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587553', schoolId: 'sch_1', code: '1587553', category: '26년 9월', neulbomType: '방과후', title: '바이올린 1부', teacherName: '천윤아', applied: 0, capacity: 12, waiting: 0, waitingCapacity: 3, grade: '1,2,3', period: '2026-09-01~2026-09-30', schedule: '월,수:15:00~15:50', fee: 60000, costInstructor: 48000, costFacility: 12000, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' },
    { id: 'lec_1587554', schoolId: 'sch_1', code: '1587554', category: '26년 9월', neulbomType: '맞춤형', title: '아침늘봄', teacherName: '이금진', applied: 0, capacity: 30, waiting: 0, waitingCapacity: 5, grade: '1', period: '2026-09-01~2026-09-30', schedule: '월~금:08:00~08:40', fee: 0, feeReceipt: 'Y', teacherClosed: 'N', refundClosed: 'N', status: 'OUTPUT' }
  ],
  applicants: [
    {
      id: 'app_1',
      schoolId: 'sch_1',
      studentName: '김민준',
      gradeClass: '1학년 2반',
      parentPhone: '010-2345-6789',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-02 10:15',
      subsidyType: '자유수강권',
      paymentStatus: '결제완료',
      status: '승인'
    },
    {
      id: 'app_2',
      schoolId: 'sch_1',
      studentName: '이서연',
      gradeClass: '2학년 1반',
      parentPhone: '010-3456-7890',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-02 11:30',
      subsidyType: '늘봄 지원금',
      paymentStatus: '지원금 수령',
      status: '승인'
    },
    {
      id: 'app_3',
      schoolId: 'sch_1',
      studentName: '박지후',
      gradeClass: '1학년 3반',
      parentPhone: '010-4567-8901',
      courseId: 'crs_1',
      courseTitle: '[돌봄] 선택형 돌봄 1부 (월 14:00~14:50)',
      appliedAt: '2026-03-03 09:40',
      subsidyType: '늘봄 무상지원',
      paymentStatus: '무상',
      status: '승인'
    },
    {
      id: 'app_4',
      schoolId: 'sch_1',
      studentName: '최예은',
      gradeClass: '3학년 4반',
      parentPhone: '010-5678-9012',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-04 14:20',
      subsidyType: '일반 자부담',
      paymentStatus: '결제대기',
      status: '신청대기'
    }
  ],
  waitlist: [
    {
      id: 'wt_1',
      schoolId: 'sch_1',
      rank: 1,
      studentName: '정현우',
      gradeClass: '2학년 3반',
      parentPhone: '010-6789-0123',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-05 16:05',
      status: '대기중'
    },
    {
      id: 'wt_2',
      schoolId: 'sch_1',
      rank: 2,
      studentName: '한소율',
      gradeClass: '1학년 1반',
      parentPhone: '010-7890-1234',
      courseId: 'crs_3',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      appliedAt: '2026-03-05 17:22',
      status: '대기중'
    },
    {
      id: 'wt_3',
      schoolId: 'sch_1',
      rank: 1,
      studentName: '윤우진',
      gradeClass: '4학년 2반',
      parentPhone: '010-8901-2345',
      courseId: 'crs_2',
      courseTitle: '[돌봄] 선택형 돌봄 2부 (월 15:00~15:50)',
      appliedAt: '2026-03-06 08:50',
      status: '대기중'
    }
  ],
  settlements: [
    {
      id: 'stl_1',
      schoolId: 'sch_1',
      type: '자유수강권 지원금',
      studentName: '김민준',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      amount: 35000,
      requestedAt: '2026-03-10',
      status: '정산완료',
      note: '지자체 1분기 보조금 정산 완료'
    },
    {
      id: 'stl_2',
      schoolId: 'sch_1',
      type: '늘봄 무상 지원금',
      studentName: '이서연',
      courseTitle: '[돌봄] 선택형 돌봄 1부',
      amount: 40000,
      requestedAt: '2026-03-11',
      status: '정산대기',
      note: '늘봄 전담 지원금 3월분 정산 신청'
    },
    {
      id: 'stl_3',
      schoolId: 'sch_1',
      type: '수강료 환불',
      studentName: '강도윤',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      amount: 17500,
      requestedAt: '2026-03-12',
      status: '환불완료',
      note: '타지역 전출로 인한 50% 중도 환불'
    },
    {
      id: 'stl_4',
      schoolId: 'sch_1',
      type: '수강료 환불',
      studentName: '오하은',
      courseTitle: '[특기적성] 창의 로봇교실 A반',
      amount: 35000,
      requestedAt: '2026-03-12',
      status: '환불신청',
      note: '개인 사정 수강 취소 요청'
    }
  ],
  students: [
    { id: 'stu_1', name: '김민준', gradeClass: '1학년 2반 5번', parentPhone: '010-2345-6789' },
    { id: 'stu_2', name: '김서진', gradeClass: '3학년 1반 12번', parentPhone: '010-2345-6789' },
    { id: 'stu_3', name: '김예나', gradeClass: '7학년 12반 31번 (신입생)', parentPhone: '010-2345-6789' }
  ]
};

// Seed default demo user password (hashed)
const initSeedUsers = async () => {
  if (defaultData.users.length === 0) {
    const saltRounds = 10;
    const teacherPasswordHash = await bcrypt.hash('12341234', saltRounds);
    const adminPasswordHash = await bcrypt.hash('admin1234', saltRounds);

    defaultData.users = [
      {
        id: 'usr_teacher1',
        schoolId: 'sch_1',
        username: 'teacher',
        name: '박진수',
        email: 'teacher@unchon.es.kr',
        phone: '010-1234-5678',
        role: 'teacher',
        passwordHash: teacherPasswordHash,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_admin1',
        schoolId: 'sch_1',
        username: 'schadmin',
        name: '학교관리자',
        email: 'admin@unchon.es.kr',
        phone: '010-9999-8888',
        role: 'school_admin',
        passwordHash: adminPasswordHash,
        createdAt: new Date().toISOString()
      }
    ];
  }
};

class JSONDatabase {
  constructor() {
    this.data = defaultData;
    this.init();
  }

  async init() {
    await initSeedUsers();
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        this.data = { ...defaultData, ...fileData };
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = [...defaultData.users];
          this.save();
        }
      } catch (err) {
        console.error('Failed to load DB file, using default seed:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save DB file:', err);
    }
  }

  // School Operations
  findSchoolByCode(code) {
    return this.data.schools.find(s => s.code.toUpperCase() === code.trim().toUpperCase());
  }

  findSchoolById(id) {
    return this.data.schools.find(s => s.id === id);
  }

  createSchool(schoolData) {
    const newSchool = {
      id: 'sch_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active',
      ...schoolData
    };
    this.data.schools.push(newSchool);
    this.save();
    return newSchool;
  }

  updateSchoolSubscription(schoolId, plan, additionalDays = 365) {
    const school = this.findSchoolById(schoolId);
    if (!school) return null;
    
    let baseDate = new Date();
    if (school.expireDate && new Date(school.expireDate) > baseDate) {
      baseDate = new Date(school.expireDate);
    }
    baseDate.setDate(baseDate.getDate() + additionalDays);
    
    school.plan = plan || school.plan;
    school.expireDate = baseDate.toISOString().split('T')[0];
    school.status = 'active';
    this.save();
    return school;
  }

  // User Operations
  findUserByUsername(username) {
    return this.data.users.find(u => u.username === username);
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  async createUser(userData) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const newUser = {
      id: 'usr_' + Date.now(),
      schoolId: userData.schoolId,
      username: userData.username,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'teacher',
      passwordHash: passwordHash,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Course Operations
  getCoursesBySchool(schoolId) {
    return this.data.courses.filter(c => c.schoolId === schoolId);
  }

  // dbdbschool 호환 강좌 목록 및 필터링
  getLecturesBySchool(schoolId, filters = {}) {
    let courses = this.getCoursesBySchool(schoolId);

    if (filters.category && filters.category !== '전체') {
      courses = courses.filter(c => c.category === filters.category);
    }

    if (filters.status && filters.status !== '전체') {
      courses = courses.filter(c => {
        if (filters.status === 'OUTPUT' || filters.status === '출력') return c.status === '모집중' || c.status === '출력' || c.status === 'OUTPUT';
        if (filters.status === 'CLOSED' || filters.status === '종료') return c.status === '종료' || c.status === 'CLOSED';
        if (filters.status === 'WAITING' || filters.status === '대기') return c.status === '대기' || c.status === 'WAITING';
        return c.status === filters.status;
      });
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      courses = courses.filter(c => 
        (c.title && c.title.toLowerCase().includes(kw)) ||
        (c.teacherName && c.teacherName.toLowerCase().includes(kw)) ||
        (c.code && c.code.toLowerCase().includes(kw))
      );
    }

    // Map dbdbschool standardized response format with Chapter 3 complete attributes
    return courses.map(c => {
      const fee = parseInt(c.fee || c.tuitionFee) || 0;
      const costFacility = c.costFacility !== undefined ? parseInt(c.costFacility) : Math.round(fee * 0.2);
      const costInstructor = c.costInstructor !== undefined ? parseInt(c.costInstructor) : (fee - costFacility);

      return {
        id: c.id,
        schoolId: c.schoolId,
        code: c.code || '101',
        category: c.category || '2026년 1분기',
        neulbomType: c.neulbomType || '방과후',
        title: c.title,
        instructor: c.teacherName || c.instructor || '담당 강사',
        teacherId: c.teacherId || 'inst_1',
        targetGrade: c.grade || c.targetGrade || '전학년',
        department: c.department || '',
        groupLimit: c.groupLimit || '',
        capacity: c.capacity || 20,
        waitingCapacity: c.waitingCapacity || 5,
        enrolledCount: c.applied || 0,
        waitingCount: c.waiting || 0,
        tuitionFee: fee,
        costInstructor: costInstructor,
        costFacility: costFacility,
        textbookFee: parseInt(c.textbookFee) || 0,
        materialFee: parseInt(c.materialFee) || 0,
        dayOfWeek: (c.schedule || '').split(':')[0] || '월,수',
        scheduleTime: (c.schedule || '').split(':')[1] || '14:00~14:50',
        schedule: c.schedule || '월:14:00~14:50',
        location: c.classroom || c.location || '방과후 교실',
        period: c.period || '2026-03-01~2026-06-30',
        totalHours: parseInt(c.totalHours) || 12,
        allowTimeConflict: c.allowTimeConflict === 'Y' || c.allowTimeConflict === true,
        noSameTeacher: c.noSameTeacher === 'Y' || c.noSameTeacher === true,
        subsidyExcludeTuition: c.subsidyExcludeTuition || '',
        subsidyExcludeTextbook: c.subsidyExcludeTextbook || '',
        subsidyExcludeMaterial: c.subsidyExcludeMaterial || '',
        maxSubsidyAmount: parseInt(c.maxSubsidyAmount) || 0,
        description: c.description || '',
        status: (c.status === '모집중' || c.status === 'OUTPUT' || c.status === '출력') ? 'OUTPUT' : ((c.status === '종료' || c.status === 'CLOSED') ? 'CLOSED' : 'WAITING'),
        statusText: (c.status === '모집중' || c.status === 'OUTPUT' || c.status === '출력') ? '출력' : ((c.status === '종료' || c.status === 'CLOSED') ? '종료' : '대기'),
        autoRenew: c.autoRenew === 'Y' || c.autoRenew === true,
        instructorClosed: c.teacherClosed === 'Y' || c.instructorClosed === true,
        teacherClosed: c.teacherClosed === 'Y' ? 'Y' : 'N',
        refundClosed: c.refundClosed === 'Y' || c.refundClosed === true,
        feeReceipt: c.feeReceipt || 'Y',
        teacherEditable: c.teacherEditable || 'N'
      };
    });
  }

  createCourse(courseData) {
    const fee = parseInt(courseData.fee || courseData.tuitionFee) || 0;
    const costFacility = courseData.costFacility !== undefined ? parseInt(courseData.costFacility) : Math.round(fee * 0.2);
    const costInstructor = courseData.costInstructor !== undefined ? parseInt(courseData.costInstructor) : (fee - costFacility);

    const newCourse = {
      id: 'crs_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      schoolId: courseData.schoolId || 'sch_1',
      code: courseData.code || String(Math.floor(100 + Math.random() * 900)),
      category: courseData.category || '2026년 1분기',
      neulbomType: courseData.neulbomType || '방과후',
      title: courseData.title,
      teacherId: courseData.teacherId || 'inst_1',
      teacherName: courseData.teacherName || courseData.instructor || '강사',
      grade: courseData.grade || courseData.targetGrade || '전학년',
      department: courseData.department || '',
      groupLimit: courseData.groupLimit || '',
      applied: parseInt(courseData.applied) || 0,
      capacity: parseInt(courseData.capacity) || 20,
      waiting: parseInt(courseData.waiting) || 0,
      waitingCapacity: parseInt(courseData.waitingCapacity) || 5,
      period: courseData.period || '2026-03-01~2026-06-30',
      schedule: courseData.schedule || `${courseData.dayOfWeek || '월'}:${courseData.scheduleTime || '14:00~14:50'}`,
      allowTimeConflict: (courseData.allowTimeConflict === 'Y' || courseData.allowTimeConflict === true) ? 'Y' : 'N',
      noSameTeacher: (courseData.noSameTeacher === 'Y' || courseData.noSameTeacher === true) ? 'Y' : 'N',
      totalHours: parseInt(courseData.totalHours) || 12,
      classroom: courseData.classroom || courseData.location || '방과후 교실',
      location: courseData.classroom || courseData.location || '방과후 교실',
      fee: fee,
      costInstructor: costInstructor,
      costFacility: costFacility,
      textbookFee: parseInt(courseData.textbookFee) || 0,
      materialFee: parseInt(courseData.materialFee) || 0,
      subsidyExcludeTuition: courseData.subsidyExcludeTuition || '',
      subsidyExcludeTextbook: courseData.subsidyExcludeTextbook || '',
      subsidyExcludeMaterial: courseData.subsidyExcludeMaterial || '',
      maxSubsidyAmount: parseInt(courseData.maxSubsidyAmount) || 0,
      description: courseData.description || '',
      autoRenew: courseData.autoRenew || 'Y',
      feeReceipt: courseData.feeReceipt || 'Y',
      teacherClosed: courseData.teacherClosed || 'N',
      refundClosed: courseData.refundClosed || 'N',
      teacherEditable: courseData.teacherEditable || 'N',
      status: (courseData.status === 'OUTPUT' || courseData.status === '출력' || courseData.status === '모집중') ? '출력' : ((courseData.status === 'CLOSED' || courseData.status === '종료') ? '종료' : '대기'),
      createdAt: new Date().toISOString()
    };
    this.data.courses.unshift(newCourse);
    this.save();
    return newCourse;
  }

  // 3.2 단일 강좌 복사 (Course Clone)
  copyCourse(schoolId, courseId, overrides = {}) {
    const orig = this.data.courses.find(c => c.id === courseId && c.schoolId === schoolId);
    if (!orig) return null;

    const copyData = {
      ...orig,
      ...overrides,
      title: overrides.title || `${orig.title} (복사본)`,
      applied: 0,
      waiting: 0,
      status: '대기',
      teacherClosed: 'N',
      refundClosed: 'N'
    };
    delete copyData.id;
    return this.createCourse(copyData);
  }

  // 3.3 23개 컬럼 강좌 일괄등록 파서 및 일괄입력 (Batch Upload)
  batchUploadCourses(schoolId, rows) {
    if (!Array.isArray(rows)) return { count: 0, courses: [] };
    const createdCourses = [];

    rows.forEach(r => {
      const title = r.title || r['강좌명'];
      if (!title) return;

      const fee = parseInt(r.fee || r['수강료'] || 0);
      const costFacility = r.costFacility !== undefined ? parseInt(r.costFacility) : (r['수용비'] !== undefined ? parseInt(r['수용비']) : Math.round(fee * 0.2));
      const costInstructor = fee - costFacility;

      const courseObj = {
        schoolId,
        neulbomType: r.neulbomType || r['늘봄과정'] || '방과후',
        groupLimit: r.groupLimit || r['중복제한그룹'] || '',
        department: r.department || r['대상학과'] || '',
        teacherId: r.teacherId || r['강사아이디'] || 'inst_1',
        teacherName: r.teacherName || r['강사명'] || r.teacherId || '담당 강사',
        noSameTeacher: (r.noSameTeacher === 'Y' || r['강사중복불가'] === 'Y') ? 'Y' : 'N',
        grade: r.grade || r['대상학년'] || '1,2,3,4,5,6',
        schedule: r.schedule || r['강의시간'] || '월:14:00~14:50',
        allowTimeConflict: (r.allowTimeConflict === 'Y' || r['강의시간중복허용'] === 'Y') ? 'Y' : 'N',
        capacity: parseInt(r.capacity || r['정원'] || 20),
        waitingCapacity: parseInt(r.waitingCapacity || r['대기정원'] || 5),
        period: r.period || r['운영기간'] || '2026-03-01~2026-06-30',
        totalHours: parseInt(r.totalHours || r['총시수'] || 12),
        classroom: r.classroom || r['강의실'] || '방과후 교실',
        fee: fee,
        costInstructor: costInstructor,
        costFacility: costFacility,
        textbookFee: parseInt(r.textbookFee || r['교재비'] || 0),
        materialFee: parseInt(r.materialFee || r['재료비'] || 0),
        subsidyExcludeTuition: r.subsidyExcludeTuition || r['지원금차감제외(수강료)'] || '',
        subsidyExcludeTextbook: r.subsidyExcludeTextbook || r['지원금차감제외(교재비)'] || '',
        subsidyExcludeMaterial: r.subsidyExcludeMaterial || r['지원금차감제외(재료비)'] || '',
        maxSubsidyAmount: parseInt(r.maxSubsidyAmount || r['최대지원금액'] || 0),
        description: r.description || r['내용'] || '',
        category: r.category || r['강좌구분'] || '2026년 1분기',
        title: title,
        status: '출력'
      };

      const created = this.createCourse(courseObj);
      createdCourses.push(created);
    });

    return { count: createdCourses.length, courses: createdCourses };
  }

  // 3.4 강좌 통계 (구분별 상태, 수강료 출력, 강사마감, 강사편집)
  getCourseStatistics(schoolId) {
    const courses = this.getCoursesBySchool(schoolId);
    const categoryStats = {};

    courses.forEach(c => {
      const cat = c.category || '기본구분';
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          category: cat,
          total: 0,
          outputCount: 0,
          closedCount: 0,
          waitingCount: 0,
          feeVisibleCount: 0,
          teacherClosedCount: 0,
          teacherEditableCount: 0,
          totalApplied: 0,
          totalCapacity: 0
        };
      }

      categoryStats[cat].total += 1;
      const st = c.status;
      if (st === '모집중' || st === '출력' || st === 'OUTPUT') categoryStats[cat].outputCount += 1;
      else if (st === '종료' || st === 'CLOSED') categoryStats[cat].closedCount += 1;
      else if (st === '대기' || st === 'WAITING') categoryStats[cat].waitingCount += 1;

      if (c.feeReceipt !== 'N') categoryStats[cat].feeVisibleCount += 1;
      if (c.teacherClosed === 'Y') categoryStats[cat].teacherClosedCount += 1;
      if (c.teacherEditable === 'Y') categoryStats[cat].teacherEditableCount += 1;

      categoryStats[cat].totalApplied += (c.applied || 0);
      categoryStats[cat].totalCapacity += (c.capacity || 0);
    });

    return Object.values(categoryStats);
  }

  // 강좌 정원 단건 수정
  updateLectureCapacity(schoolId, courseId, capacity) {
    const course = this.data.courses.find(c => (c.id === courseId || c.code === courseId || String(c.id).includes(courseId)) && (!schoolId || c.schoolId === schoolId));
    if (!course) return null;
    course.capacity = parseInt(capacity, 10) || 20;
    this.save();
    return course;
  }

  // 강좌 일괄 필드 수정
  bulkUpdateLectures(schoolId, courseIds, updates) {
    let count = 0;
    this.data.courses.forEach(c => {
      if ((courseIds.includes(c.id) || courseIds.includes(c.code)) && (!schoolId || c.schoolId === schoolId)) {
        if (updates.fee !== undefined) c.fee = parseInt(updates.fee, 10);
        if (updates.capacity !== undefined) c.capacity = parseInt(updates.capacity, 10);
        if (updates.status !== undefined) c.status = updates.status;
        if (updates.period !== undefined) c.period = updates.period;
        if (updates.category !== undefined) c.category = updates.category;
        count++;
      }
    });
    if (count > 0) this.save();
    return count;
  }

  // 강좌 통계 (과정별/월별 집계)
  getLectureStats(schoolId) {
    return this.getCourseStatistics(schoolId);
  }

  // 3.9 강좌 수용비를 신청자 수용비에 일괄 적용하기
  applyFacilityFeeToApplicants(schoolId, category) {
    const courses = this.getCoursesBySchool(schoolId).filter(c => !category || category === '전체' || c.category === category);
    const courseMap = {};
    courses.forEach(c => {
      const fee = parseInt(c.fee) || 0;
      const costFacility = c.costFacility !== undefined ? parseInt(c.costFacility) : Math.round(fee * 0.2);
      courseMap[c.id] = costFacility;
    });

    let updatedCount = 0;
    (this.data.applicants || []).forEach(app => {
      if (app.schoolId === schoolId && courseMap[app.courseId] !== undefined) {
        app.costFacility = courseMap[app.courseId];
        updatedCount++;
      }
    });
    this.save();
    return updatedCount;
  }

  // 3.11 나이스(NEIS) 연계용 수강료 데이터 추출
  getNeisExportData(schoolId, category) {
    const courses = this.getCoursesBySchool(schoolId).filter(c => !category || category === '전체' || c.category === category);
    return courses.map(c => {
      const fee = parseInt(c.fee) || 0;
      const costFacility = c.costFacility !== undefined ? parseInt(c.costFacility) : Math.round(fee * 0.2);
      const costInstructor = fee - costFacility;

      return {
        courseCode: c.code || '101',
        courseName: c.title,
        instructorName: c.teacherName || '담당 강사',
        targetGrade: c.grade || '전학년',
        enrolledCount: c.applied || 0,
        tuitionTotal: fee,
        costInstructor: costInstructor,
        costFacility: costFacility,
        textbookFee: parseInt(c.textbookFee) || 0,
        materialFee: parseInt(c.materialFee) || 0,
        totalHours: parseInt(c.totalHours) || 12,
        period: c.period || ''
      };
    });
  }

  // 3.12 에듀파인(Edufine) 세입 징수용 데이터 추출
  getEdufineExportData(schoolId, category) {
    const courses = this.getCoursesBySchool(schoolId).filter(c => !category || category === '전체' || c.category === category);
    return courses.map(c => {
      const fee = parseInt(c.fee) || 0;
      const applied = c.applied || 0;
      const costFacility = c.costFacility !== undefined ? parseInt(c.costFacility) : Math.round(fee * 0.2);
      const costInstructor = fee - costFacility;
      const totalCollected = fee * applied;
      const totalInstructor = costInstructor * applied;
      const totalFacility = costFacility * applied;
      const totalMaterial = ((parseInt(c.materialFee) || 0) + (parseInt(c.textbookFee) || 0)) * applied;

      return {
        category: c.category || '2026년 1분기',
        courseName: c.title,
        instructorName: c.teacherName || '담당 강사',
        applied: applied,
        unitTuition: fee,
        totalCollected: totalCollected,
        totalInstructorPay: totalInstructor,
        totalFacilityIncome: totalFacility,
        totalMaterialIncome: totalMaterial
      };
    });
  }

  // 일괄 복사 기능 (이전 분기/월 강좌 복사)
  batchCopyLectures(schoolId, sourceCategory, targetCategory, copyFees = true) {
    const sourceCourses = this.data.courses.filter(c => c.schoolId === schoolId && c.category === sourceCategory);
    if (sourceCourses.length === 0) return [];

    const newCourses = [];
    sourceCourses.forEach((src, idx) => {
      const copy = {
        ...src,
        id: 'crs_' + Date.now() + '_' + idx,
        category: targetCategory,
        applied: 0,
        waiting: 0,
        fee: copyFees ? src.fee : 0,
        costInstructor: copyFees ? src.costInstructor : 0,
        costFacility: copyFees ? src.costFacility : 0,
        materialFee: copyFees ? src.materialFee : 0,
        textbookFee: copyFees ? src.textbookFee : 0,
        status: '출력',
        teacherClosed: 'N',
        refundClosed: 'N',
        createdAt: new Date().toISOString()
      };
      this.data.courses.unshift(copy);
      newCourses.push(copy);
    });
    this.save();
    return newCourses;
  }

  // 강좌 상태 일괄 변경 (OUTPUT, CLOSED, WAITING)
  updateLectureStatusBatch(schoolId, courseIds, targetStatus) {
    let updatedCount = 0;
    const statusMap = {
      'OUTPUT': '출력',
      'CLOSED': '종료',
      'WAITING': '대기'
    };
    const dbStatus = statusMap[targetStatus] || targetStatus;

    this.data.courses.forEach(c => {
      if (c.schoolId === schoolId && (courseIds === 'ALL' || courseIds.includes(c.id))) {
        c.status = dbStatus;
        updatedCount++;
      }
    });
    this.save();
    return updatedCount;
  }

  // 강사 마감 일괄 토글
  toggleTeacherLockBatch(schoolId, courseIds, lockState) {
    let updatedCount = 0;
    const isLock = lockState === 'Y' || lockState === true;
    this.data.courses.forEach(c => {
      if (c.schoolId === schoolId && (courseIds === 'ALL' || courseIds.includes(c.id))) {
        c.teacherClosed = isLock ? 'Y' : 'N';
        c.instructorClosed = isLock;
        updatedCount++;
      }
    });
    this.save();
    return updatedCount;
  }

  // 강사 마감 토글
  toggleInstructorClosed(schoolId, courseId) {
    const course = this.data.courses.find(c => c.id === courseId && c.schoolId === schoolId);
    if (!course) return null;

    const isClosed = course.teacherClosed === 'Y' || course.instructorClosed === true;
    course.teacherClosed = isClosed ? 'N' : 'Y';
    course.instructorClosed = !isClosed;
    this.save();
    return { id: course.id, instructorClosed: course.instructorClosed, teacherClosed: course.teacherClosed };
  }

  autoRenewCourses(schoolId) {
    const courses = this.getCoursesBySchool(schoolId);
    let renewedCount = 0;
    courses.forEach(c => {
      if (c.autoRenew === 'Y' && c.applied > 0) {
        renewedCount += c.applied;
      }
    });
    return renewedCount;
  }

  deleteCourse(courseId, schoolId) {
    const index = this.data.courses.findIndex(c => c.id === courseId && c.schoolId === schoolId);
    if (index !== -1) {
      const removed = this.data.courses.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  // 강좌 목록 조회 (schoolId 및 필터 지원)
  getLecturesBySchool(schoolId, filters = {}) {
    let list = this.data.courses.filter(c => c.schoolId === schoolId || schoolId === 'ALL');
    if (filters.category && filters.category !== 'all') {
      list = list.filter(c => c.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(c => (c.title && c.title.toLowerCase().includes(kw)) || (c.teacherName && c.teacherName.toLowerCase().includes(kw)) || (c.instructor && c.instructor.toLowerCase().includes(kw)));
    }
    return list;
  }

  // 강좌 정원 단건 인라인 수정
  updateLectureCapacity(schoolId, courseId, newCapacity) {
    const course = this.data.courses.find(c => String(c.id) === String(courseId) && (c.schoolId === schoolId || schoolId === 'sch_1'));
    if (!course) return null;
    course.capacity = parseInt(newCapacity, 10) || 0;
    this.save();
    return course;
  }

  // 강좌 일괄 수정
  bulkUpdateLectures(schoolId, courseIds, updates) {
    let count = 0;
    this.data.courses.forEach(c => {
      if ((c.schoolId === schoolId || schoolId === 'sch_1') && courseIds.includes(String(c.id))) {
        Object.assign(c, updates);
        count++;
      }
    });
    this.save();
    return count;
  }

  // 강좌 통계 데이터 집계
  getLectureStats(schoolId) {
    const courses = this.data.courses.filter(c => c.schoolId === schoolId || schoolId === 'sch_1');
    const groupMap = {};

    courses.forEach(c => {
      const cat = c.category || '26년 9월';
      if (!groupMap[cat]) {
        groupMap[cat] = {
          category: cat,
          total: 0,
          outputCount: 0,
          waitingCount: 0,
          closedCount: 0,
          totalCapacity: 0,
          totalApplied: 0
        };
      }
      groupMap[cat].total++;
      if (c.status === 'OUTPUT' || c.status === '출력') groupMap[cat].outputCount++;
      else if (c.status === 'WAITING' || c.status === '대기') groupMap[cat].waitingCount++;
      else groupMap[cat].closedCount++;

      groupMap[cat].totalCapacity += (c.capacity || 0);
      groupMap[cat].totalApplied += (c.applied || c.enrolledCount || 0);
    });

    return Object.values(groupMap);
  }


  // Applicant & Parent Operations
  getApplicantsBySchool(schoolId) {
    return (this.data.applicants || []).filter(a => a.schoolId === schoolId);
  }

  getApplicantsByParentPhone(phone, schoolId) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const applicants = (this.data.applicants || []).filter(a => {
      const p = (a.parentPhone || '').replace(/[^0-9]/g, '');
      return (!schoolId || a.schoolId === schoolId) && p === cleanPhone;
    });
    const waitlist = (this.data.waitlist || []).filter(w => {
      const p = (w.parentPhone || '').replace(/[^0-9]/g, '');
      return (!schoolId || w.schoolId === schoolId) && p === cleanPhone;
    });
    return { applicants, waitlist };
  }

  // Parent One-Click Application with Time Overlap Check
  applyCourseParent(schoolId, appData) {
    const { studentName, gradeClass, parentPhone, courseId, subsidyType } = appData;
    const course = this.data.courses.find(c => c.id === courseId && c.schoolId === schoolId);
    if (!course) return { error: '해당 강좌를 찾을 수 없습니다.' };

    // 1. Time Overlap Check (시간표 겹침 방지)
    const existingApps = (this.data.applicants || []).filter(a => 
      a.schoolId === schoolId && 
      a.studentName === studentName && 
      a.status === '승인'
    );

    for (const existing of existingApps) {
      const targetCourse = this.data.courses.find(c => c.id === existing.courseId);
      if (targetCourse && targetCourse.schedule && course.schedule) {
        // Compare day/time overlap (e.g. 월 vs 월)
        const targetDays = targetCourse.schedule.split(':')[0] || '';
        const currentDays = course.schedule.split(':')[0] || '';
        const daysOverlap = targetDays.split(',').some(d => currentDays.includes(d));
        
        if (daysOverlap) {
          return { 
            error: `시간표가 중복됩니다! 이미 '${targetCourse.title}' (${targetCourse.schedule}) 강좌가 동일 요일에 등록되어 있습니다.` 
          };
        }
      }
    }

    // 2. Capacity Check (정원/대기 판별)
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (course.applied < course.capacity) {
      // Add to Applicants
      const newApp = {
        id: 'app_' + Date.now(),
        schoolId,
        studentName,
        gradeClass: gradeClass || '1학년',
        parentPhone,
        courseId: course.id,
        courseTitle: course.title,
        appliedAt: nowStr,
        subsidyType: subsidyType || '일반 자부담',
        paymentStatus: subsidyType === '자유수강권' ? '지원금 수령' : '결제대기',
        voucherBalance: 600000,
        materialPaid: 'N',
        status: '승인'
      };
      course.applied += 1;
      this.data.applicants.unshift(newApp);
      this.save();
      return { success: true, isWaitlist: false, applicant: newApp, message: '🎉 수강 신청이 성공적으로 완료되었습니다!' };
    } else {
      // Add to Waitlist
      const currentWaitCount = (this.data.waitlist || []).filter(w => w.courseId === course.id).length;
      const newWait = {
        id: 'wt_' + Date.now(),
        schoolId,
        rank: currentWaitCount + 1,
        studentName,
        gradeClass: gradeClass || '1학년',
        parentPhone,
        courseId: course.id,
        courseTitle: course.title,
        appliedAt: nowStr,
        status: '대기중'
      };
      course.waiting += 1;
      if (!this.data.waitlist) this.data.waitlist = [];
      this.data.waitlist.push(newWait);
      this.save();
      return { success: true, isWaitlist: true, waitlist: newWait, message: `⚠️ 정원 초과로 대기 순번 #${newWait.rank}순위로 등록되었습니다.` };
    }
  }

  updateApplicantStatus(applicantId, schoolId, status) {
    const applicant = (this.data.applicants || []).find(a => a.id === applicantId && a.schoolId === schoolId);
    if (applicant) {
      applicant.status = status;
      this.save();
      return applicant;
    }
    return null;
  }

  deleteApplicant(applicantId, schoolId) {
    const index = (this.data.applicants || []).findIndex(a => a.id === applicantId && a.schoolId === schoolId);
    if (index !== -1) {
      const removed = this.data.applicants.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  // Waitlist Operations
  getWaitlistBySchool(schoolId) {
    return (this.data.waitlist || []).filter(w => w.schoolId === schoolId);
  }

  promoteWaitlist(waitlistId, schoolId) {
    const index = (this.data.waitlist || []).findIndex(w => w.id === waitlistId && w.schoolId === schoolId);
    if (index !== -1) {
      const item = this.data.waitlist.splice(index, 1)[0];
      // Convert to applicant
      const newApplicant = {
        id: 'app_' + Date.now(),
        schoolId: schoolId,
        studentName: item.studentName,
        gradeClass: item.gradeClass,
        parentPhone: item.parentPhone,
        courseId: item.courseId,
        courseTitle: item.courseTitle,
        appliedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        subsidyType: '일반 자부담',
        paymentStatus: '결제대기',
        status: '승인'
      };
      if (!this.data.applicants) this.data.applicants = [];
      this.data.applicants.unshift(newApplicant);
      this.save();
      return newApplicant;
    }
    return null;
  }

  deleteWaitlist(waitlistId, schoolId) {
    const index = (this.data.waitlist || []).findIndex(w => w.id === waitlistId && w.schoolId === schoolId);
    if (index !== -1) {
      const removed = this.data.waitlist.splice(index, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  // Settlement Operations
  getSettlementsBySchool(schoolId) {
    return (this.data.settlements || []).filter(s => s.schoolId === schoolId);
  }

  createSettlement(schoolId, data) {
    const newSettlement = {
      id: 'stl_' + Date.now(),
      schoolId: schoolId,
      requestedAt: new Date().toISOString().split('T')[0],
      status: '정산대기',
      ...data
    };
    if (!this.data.settlements) this.data.settlements = [];
    this.data.settlements.unshift(newSettlement);
    this.save();
    return newSettlement;
  }

  updateSettlementStatus(settlementId, schoolId, status) {
    const settlement = (this.data.settlements || []).find(s => s.id === settlementId && s.schoolId === schoolId);
    if (settlement) {
      settlement.status = status;
      this.save();
      return settlement;
    }
    return null;
  }

  // Attendance Operations
  getAttendanceByCourseAndDate(schoolId, courseId, date) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const records = (this.data.attendance || []).filter(a => 
      a.schoolId === schoolId && 
      (!courseId || a.courseId === courseId) && 
      a.date === targetDate
    );
    return records;
  }

  recordAttendance(schoolId, courseId, records) {
    if (!this.data.attendance) this.data.attendance = [];
    const targetDate = new Date().toISOString().split('T')[0];
    const createdLogs = [];

    records.forEach(r => {
      // Find existing or update
      const existingIdx = this.data.attendance.findIndex(a => 
        a.schoolId === schoolId && 
        a.courseId === courseId && 
        a.studentName === r.studentName && 
        a.date === targetDate
      );

      const logObj = {
        id: existingIdx !== -1 ? this.data.attendance[existingIdx].id : 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        schoolId,
        courseId,
        studentName: r.studentName,
        parentPhone: r.parentPhone || '',
        date: targetDate,
        status: r.status || '출석',
        notifiedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        this.data.attendance[existingIdx] = logObj;
      } else {
        this.data.attendance.push(logObj);
      }
      createdLogs.push(logObj);
    });

    this.save();
    return createdLogs;
  }

  // Q&A Board Operations
  getQABoard(schoolId, courseId) {
    if (!this.data.qaBoard) {
      this.data.qaBoard = [
        {
          id: 'qa_1',
          schoolId: 'sch_1',
          courseId: 'crs_3',
          courseTitle: '[특기적성] 창의 로봇교실 A반',
          authorName: '김민준 보호자',
          authorRole: 'parent',
          title: '3월 준비물 및 교재 관련 문의드립니다.',
          content: '로봇 교재 키트를 별도 구매해야 하는지 늘봄 무상 지원금에 포함되어 있는지 궁금합니다.',
          reply: '안녕하세요! 로봇 키트 교재비(10,000원)는 수강 신청 시 재료비 항목에 자동 계산되며, 자유수강권 및 늘봄 지원금으로 함께 차감 정산됩니다.',
          repliedAt: '2026-03-03 14:20',
          createdAt: '2026-03-03 10:15'
        }
      ];
    }
    return (this.data.qaBoard || []).filter(q => 
      q.schoolId === schoolId && (!courseId || q.courseId === courseId)
    );
  }

  createQA(schoolId, data) {
    if (!this.data.qaBoard) this.data.qaBoard = [];
    const newQA = {
      id: 'qa_' + Date.now(),
      schoolId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reply: null,
      repliedAt: null,
      ...data
    };
    this.data.qaBoard.unshift(newQA);
    this.save();
    return newQA;
  }

  replyQA(qaId, replyText) {
    const qa = (this.data.qaBoard || []).find(q => q.id === qaId);
    if (qa) {
      qa.reply = replyText;
      qa.repliedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.save();
      return qa;
    }
    return null;
  }

  // Safety & Return Schedule Operations
  getSafetySchedules(schoolId, studentName) {
    if (!this.data.safetySchedules) {
      this.data.safetySchedules = [
        {
          id: 'sft_1',
          schoolId: 'sch_1',
          studentName: '김민준',
          gradeClass: '1학년 2반',
          parentPhone: '010-2345-6789',
          dayOfWeek: '월,수,금',
          returnTime: '16:30',
          pickupPerson: '어머니 직접 동행 귀가'
        }
      ];
    }
    return (this.data.safetySchedules || []).filter(s => 
      s.schoolId === schoolId && (!studentName || s.studentName.includes(studentName))
    );
  }

  saveSafetySchedule(schoolId, data) {
    if (!this.data.safetySchedules) this.data.safetySchedules = [];
    const newSchedule = {
      id: 'sft_' + Date.now(),
      schoolId,
      createdAt: new Date().toISOString().split('T')[0],
      ...data
    };
    this.data.safetySchedules.unshift(newSchedule);
    this.save();
    return newSchedule;
  }

  deleteSafetySchedule(id) {
    if (!this.data.safetySchedules) return false;
    const index = this.data.safetySchedules.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.safetySchedules.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Absence Requests
  getAbsenceRequests(schoolId, parentPhone) {
    if (!this.data.absenceRequests) {
      this.data.absenceRequests = [
        {
          id: 'abs_1',
          schoolId: 'sch_1',
          studentName: '김민준',
          parentPhone: '010-2345-6789',
          courseTitle: '[특기적성] 창의 로봇교실 A반',
          absenceDate: '2026-03-25',
          type: '결석',
          reason: '가정 사유 병원 진료로 인한 결석 신청',
          status: '승인완료'
        }
      ];
    }
    return (this.data.absenceRequests || []).filter(a => 
      a.schoolId === schoolId && (!parentPhone || a.parentPhone === parentPhone)
    );
  }

  createAbsenceRequest(schoolId, data) {
    if (!this.data.absenceRequests) this.data.absenceRequests = [];
    const newAbs = {
      id: 'abs_' + Date.now(),
      schoolId,
      status: '승인완료',
      createdAt: new Date().toISOString().split('T')[0],
      ...data
    };
    this.data.absenceRequests.unshift(newAbs);
    this.save();
    return newAbs;
  }

  deleteAbsenceRequest(id) {
    if (!this.data.absenceRequests) return false;
    const index = this.data.absenceRequests.findIndex(a => a.id === id);
    if (index !== -1) {
      this.data.absenceRequests.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  deleteQA(id) {
    if (!this.data.qaBoard) return false;
    const index = this.data.qaBoard.findIndex(q => q.id === id);
    if (index !== -1) {
      this.data.qaBoard.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  cancelApplicantParent(applicantId, phone) {
    if (!this.data.applicants) return null;
    const index = this.data.applicants.findIndex(a => a.id === applicantId && (!phone || a.parentPhone === phone));
    if (index !== -1) {
      const removed = this.data.applicants.splice(index, 1)[0];
      // Decrement course applied count if > 0
      const course = (this.data.courses || []).find(c => c.id === removed.courseId);
      if (course && course.applied > 0) {
        course.applied -= 1;
      }
      this.save();
      return removed;
    }
    return null;
  }

  cancelWaitlistParent(waitlistId, phone) {
    if (!this.data.waitlist) return null;
    const index = this.data.waitlist.findIndex(w => w.id === waitlistId && (!phone || w.parentPhone === phone));
    if (index !== -1) {
      const removed = this.data.waitlist.splice(index, 1)[0];
      // Decrement course waiting count if > 0
      const course = (this.data.courses || []).find(c => c.id === removed.courseId);
      if (course && course.waiting > 0) {
        course.waiting -= 1;
      }
      this.save();
      return removed;
    }
    return null;
  }


  // Financials & Edufine Export
  getEdufineExport(schoolId) {
    const courses = this.getCoursesBySchool(schoolId);
    const result = courses.map((c, idx) => {
      const totalRevenue = (c.applied || 0) * (c.fee || 0);
      const instructorFee = Math.round(totalRevenue * 0.8); // 80% 강사료
      const accommodationFee = totalRevenue - instructorFee; // 20% 학교 수용비
      const totalMaterial = (c.applied || 0) * (c.materialFee || 0);

      return {
        '연번': idx + 1,
        '강사명': c.teacherName,
        '강좌명': c.title,
        '수강인원': c.applied,
        '수강료(원)': c.fee,
        '총 징수액(원)': totalRevenue,
        '에듀파인 강사료(80%)': instructorFee,
        '에듀파인 수용비(20%)': accommodationFee,
        '교재재료비 총액(원)': totalMaterial
      };
    });
    return result;
  }

  // Fractional Pro-Rata Refund Calculator
  calculateRefundAmount(fee, totalDays, attendedDays) {
    const feeNum = parseInt(fee) || 0;
    const total = parseInt(totalDays) || 20;
    const attended = parseInt(attendedDays) || 0;
    if (attended <= 0) return feeNum; // 100% 전액 환불
    if (attended >= total) return 0; // 0원 환불 (수업 종료)

    const remainingDays = total - attended;
    const refundAmt = Math.round((feeNum / total) * remainingDays);
    return refundAmt;
  }

  // Lottery Execution Engine
  executeLottery(schoolId, courseId) {
    const course = (this.data.courses || []).find(c => c.id === courseId && c.schoolId === schoolId);
    if (!course) return { error: '강좌를 찾을 수 없습니다.' };

    const applicants = (this.data.applicants || []).filter(a => a.courseId === courseId && a.schoolId === schoolId);
    const capacity = course.capacity || 20;

    // Shuffle applicants randomly
    const shuffled = [...applicants].sort(() => Math.random() - 0.5);

    let winCount = 0;
    let waitCount = 0;

    shuffled.forEach((a, idx) => {
      if (idx < capacity) {
        a.status = '승인';
        winCount++;
      } else {
        a.status = '신청대기';
        waitCount++;
      }
    });

    this.save();
    return {
      success: true,
      courseTitle: course.title,
      totalApplied: applicants.length,
      winCount,
      waitCount,
      message: `🎲 '${course.title}' 강좌 추첨이 완료되었습니다. (당첨: ${winCount}명, 대기: ${waitCount}명)`
    };
  }

  // SMS Templates & Bulk Send
  getSmsTemplates() {
    return [
      { id: 'tpl_1', title: '수강신청 확정 안내', content: '[운천초] #{학생명} 학생의 #{강좌명} 수강 신청이 최종 승인되었습니다.' },
      { id: 'tpl_2', title: '휴강 및 보강 안내', content: '[운천초] #{강좌명} 강좌의 #{날짜} 수업이 학교 행사로 휴강되며 #{보강일}에 보강이 진행됩니다.' },
      { id: 'tpl_3', title: '등하교 안심 알림', content: '[안심알림] #{학생명} 학생이 #{시간}에 #{강좌명} 방과후 교실을 출발하여 하교합니다.' },
      { id: 'tpl_4', title: '수강료 및 재료비 납부 안내', content: '[운천초] #{강좌명} 수강료 #{금액}원이 스쿨뱅킹으로 인출될 예정입니다.' }
    ];
  }

  sendBulkSms(schoolId, { recipientCount, templateId, message }) {
    if (!this.data.smsLogs) this.data.smsLogs = [];
    const log = {
      id: 'sms_' + Date.now(),
      schoolId,
      recipientCount: parseInt(recipientCount) || 1,
      templateId: templateId || 'custom',
      message: message || '알림 메시지',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: '전송완료 (카카오 알림톡)'
    };
    this.data.smsLogs.unshift(log);
    this.save();
    return log;
  }

  getSmsHistory(schoolId) {
    if (!this.data.smsLogs) {
      this.data.smsLogs = [
        {
          id: 'sms_1001',
          schoolId: 'sch_1',
          recipientCount: 24,
          templateId: 'tpl_1',
          message: '[운천초] 1분기 방과후학교 수강 확정 안내가 전송되었습니다.',
          sentAt: '2026-03-01 10:00',
          status: '전송완료 (카카오 알림톡)'
        }
      ];
    }
    return (this.data.smsLogs || []).filter(s => s.schoolId === schoolId);
  }

  // Applicant approval & Grade Transfer
  updateApplicantStatus(schoolId, applicantId, status) {
    const applicant = (this.data.applicants || []).find(a => a.id === applicantId && a.schoolId === schoolId);
    if (!applicant) return null;
    applicant.status = status;
    this.save();
    return applicant;
  }

  transferGradeClass(schoolId, fromGrade, toGrade) {
    let transferredCount = 0;
    (this.data.applicants || []).forEach(a => {
      if (a.schoolId === schoolId && a.gradeClass.includes(fromGrade)) {
        a.gradeClass = a.gradeClass.replace(fromGrade, toGrade);
        transferredCount++;
      }
    });
    this.save();
    return transferredCount;
  }

  approveAbsenceRequest(id, status = '승인완료') {
    const abs = (this.data.absenceRequests || []).find(a => a.id === id);
    if (!abs) return null;
    abs.status = status;
    this.save();
    return abs;
  }

  // FAQ & Guide
  getFaqList() {
    return [
      { id: 'faq_1', category: '수강신청', question: '수강 신청 시간표 중복 시 어떻게 처리되나요?', answer: '동일 요일/시간대 강좌는 자동 중복 감지 엔진에 의해 신청이 차단되며 경고 메시지가 출력됩니다.' },
      { id: 'faq_2', category: '정산 및 환불', question: '중도 포기 시 수강료 환불 기준은 어떻게 되나요?', answer: '소비자분쟁해결기준에 따라 총 수업일수 대비 미수강 일수를 일할 계산하여 자동 환불금이 산출됩니다.' },
      { id: 'faq_3', category: '추첨 시스템', question: '정원 초과 강좌의 자동 추첨은 어떻게 진행되나요?', answer: '추첨 실행 엔진 버튼 클릭 시 난수 알로그림으로 정원 당첨자와 대기 1, 2, 3 순번이 자동 부여됩니다.' },
      { id: 'faq_4', category: '에듀파인 연동', question: '에듀파인 집계 파일은 어떤 형식으로 추출되나요?', answer: '학교 수용비(20%) 및 강사료(80%)가 자동 분류된 엑셀(.xlsx / .csv) 파일로 즉시 다운로드됩니다.' }
    ];
  }

  // Official Manual Section 2.7~2.11 Settings
  getBasicSettings(schoolId) {
    if (!this.data.basicSettings) {
      this.data.basicSettings = {
        serviceName: '늘봄·방과후학교',
        defaultCategory: '2026년 1분기',
        timeCheckMode: '시간',
        courseSortOrder: '가나다순',
        nealbomProcess: '사용',
        feeSplitMode: '수용비분리',
        acceptanceRate: 20,
        instructorRate: 80,
        lotteryEnabled: true,
        allowWaitingList: true,
        showWaitingRank: true,
        supportFundEnabled: true,
        refundMode: '일할/분할계산'
      };
    }
    return this.data.basicSettings;
  }

  updateBasicSettings(data) {
    this.data.basicSettings = { ...this.getBasicSettings(), ...data };
    this.save();
    return this.data.basicSettings;
  }

  getInstructorPermissions() {
    if (!this.data.instructorPermissions) {
      this.data.instructorPermissions = {
        showWaitingCourses: true,
        allowCourseAdd: false,
        allowViewAllCourses: true,
        allowAddStudent: true,
        allowDeleteStudent: true,
        allowMoveStudent: true,
        allowEditFees: true,
        showStudentContacts: true
      };
    }
    return this.data.instructorPermissions;
  }

  updateInstructorPermissions(data) {
    this.data.instructorPermissions = { ...this.getInstructorPermissions(), ...data };
    this.save();
    return this.data.instructorPermissions;
  }

  getAttendanceOptions() {
    if (!this.data.attendanceOptions) {
      this.data.attendanceOptions = {
        approverName: '운천초등학교장',
        signatureImage: '',
        printOrientation: '가로',
        onlineAttendance: true,
        parentAttendanceView: true
      };
    }
    return this.data.attendanceOptions;
  }

  updateAttendanceOptions(data) {
    this.data.attendanceOptions = { ...this.getAttendanceOptions(), ...data };
    this.save();
    return this.data.attendanceOptions;
  }

  // --- Official Manual Section 2 Implementation ---

  // 2.2 & 2.3 Service Administrator & Staff Management
  getStaff(schoolId) {
    if (!this.data.staff) {
      this.data.staff = [
        { id: 'stf_1', schoolId: 'sch_1', name: '김교무', username: '김교무', role: 'service_admin', permissions: ['교직원관리', '학생관리', '강좌관리'] },
        { id: 'stf_2', schoolId: 'sch_1', name: '이연구', username: '이연구', role: 'staff', permissions: ['학생관리'] },
        { id: 'stf_3', schoolId: 'sch_1', name: '박방과', username: '박방과', role: 'service_admin', permissions: ['교직원관리', '학생관리', '강좌관리', '정산관리'] }
      ];
    }
    return (this.data.staff || []).filter(s => !schoolId || s.schoolId === schoolId);
  }

  addStaff(schoolId, staffData) {
    if (!this.data.staff) this.data.staff = [];
    const newStaff = {
      id: 'stf_' + Date.now(),
      schoolId: schoolId || 'sch_1',
      name: staffData.name,
      username: staffData.username || staffData.name,
      role: staffData.role || 'staff',
      permissions: staffData.permissions || ['학생관리'],
      createdAt: new Date().toISOString()
    };
    this.data.staff.push(newStaff);
    this.save();
    return newStaff;
  }

  assignServiceAdmin(schoolId, staffId, permissions) {
    const staff = (this.data.staff || []).find(s => s.id === staffId && s.schoolId === schoolId);
    if (!staff) return null;
    staff.role = 'service_admin';
    if (permissions) staff.permissions = permissions;
    this.save();
    return staff;
  }

  // 2.4.1 Temporary Student Rules (신학기 임시학적: 7학년 생월반 생일번)
  generateTempStudent(schoolId, { name, birthDate, phone }) {
    // birthDate format: YYYY-MM-DD or MM-DD
    const parts = birthDate.split('-');
    let month = 1;
    let day = 1;
    if (parts.length === 3) {
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      month = parseInt(parts[0], 10);
      day = parseInt(parts[1], 10);
    }

    const tempGradeClass = `7학년 ${month}반`;
    const tempStudentNum = day;
    const tempStudentRecord = {
      id: 'temp_stu_' + Date.now(),
      schoolId: schoolId || 'sch_1',
      name,
      gradeClass: `${tempGradeClass} ${tempStudentNum}번`,
      grade: 7,
      classNum: month,
      studentNum: day,
      birthDate,
      parentPhone: phone || '010-2345-6789',
      phone: phone || '',
      isTemp: true,
      initialPassword: '1234',
      createdAt: new Date().toISOString()
    };

    if (!this.data.students || this.data.students.length === 0) {
      this.data.students = [
        { id: 'stu_1', name: '김민준', gradeClass: '1학년 2반 5번', parentPhone: '010-2345-6789' },
        { id: 'stu_2', name: '김서진', gradeClass: '3학년 1반 12번', parentPhone: '010-2345-6789' },
        { id: 'stu_3', name: '김예나', gradeClass: '7학년 12반 31번 (신입생)', parentPhone: '010-2345-6789' }
      ];
    }
    this.data.students.push(tempStudentRecord);
    this.save();
    return tempStudentRecord;
  }

  // 2.4.1 Multi-Child Account Sharing (다자녀 로그인 공유 및 전환)
  getMultiChildAccounts(parentPhone) {
    const defaultList = [
      { id: 'stu_1', name: '김민준', gradeClass: '1학년 2반 5번', parentPhone: '010-2345-6789' },
      { id: 'stu_2', name: '김서진', gradeClass: '3학년 1반 12번', parentPhone: '010-2345-6789' },
      { id: 'stu_3', name: '김예나', gradeClass: '7학년 12반 31번 (신입생)', parentPhone: '010-2345-6789' }
    ];
    if (!this.data.students || this.data.students.length === 0) {
      this.data.students = [...defaultList];
      this.save();
    }
    const cleanPhone = (parentPhone || '010-2345-6789').replace(/[^0-9]/g, '');
    const matched = this.data.students.filter(s => (s.parentPhone || s.phone || '').replace(/[^0-9]/g, '') === cleanPhone);
    return matched.length > 0 ? matched : defaultList;
  }

  // 2.5 Homeroom Teacher Management (담임 등록 & 비밀번호 초기화)
  getHomeroomTeachers(schoolId) {
    if (!this.data.homeroomTeachers) {
      this.data.homeroomTeachers = [
        { id: 'hr_1', schoolId: 'sch_1', name: '김담임', username: '김담임', assignedClass: '1학년 1반', phone: '010-1111-2222' },
        { id: 'hr_2', schoolId: 'sch_1', name: '이담임', username: '이담임', assignedClass: '1학년 2반', phone: '010-3333-4444' },
        { id: 'hr_3', schoolId: 'sch_1', name: '박담임', username: '박담임', assignedClass: '2학년 1반', phone: '010-5555-6666' }
      ];
    }
    return (this.data.homeroomTeachers || []).filter(h => !schoolId || h.schoolId === schoolId);
  }

  addHomeroomTeacher(schoolId, hrData) {
    if (!this.data.homeroomTeachers) this.data.homeroomTeachers = [];
    const newHR = {
      id: 'hr_' + Date.now(),
      schoolId: schoolId || 'sch_1',
      name: hrData.name,
      username: hrData.username || hrData.name,
      assignedClass: hrData.assignedClass || '1학년 1반',
      phone: hrData.phone || '',
      initialPassword: '1234',
      createdAt: new Date().toISOString()
    };
    this.data.homeroomTeachers.push(newHR);
    this.save();
    return newHR;
  }

  // 2.6 Instructors & Banking ID Grouping (동일 강사 ID 스쿨뱅킹 묶음 징수)
  getInstructors(schoolId) {
    if (!this.data.instructors) {
      this.data.instructors = [
        { id: 'inst_1', schoolId: 'sch_1', instructorId: '홍길동', name: '홍길동', subject: '로봇과학', phone: '010-7777-8888', isMain: true },
        { id: 'inst_2', schoolId: 'sch_1', instructorId: '홍길동', name: '홍길동 (보조강사: 이보조)', subject: '로봇과학B반', phone: '010-7777-8889', isMain: false },
        { id: 'inst_3', schoolId: 'sch_1', instructorId: '이창의', name: '이창의', subject: '창의미술', phone: '010-8888-9999', isMain: true }
      ];
    }
    return (this.data.instructors || []).filter(i => !schoolId || i.schoolId === schoolId);
  }

  getInstructorBankingGroups(schoolId) {
    const instructors = this.getInstructors(schoolId);
    const courses = this.getCoursesBySchool(schoolId);
    const grouped = {};

    courses.forEach(c => {
      const instName = c.teacherName || '기타';
      if (!grouped[instName]) {
        grouped[instName] = {
          instructorName: instName,
          courses: [],
          totalTuition: 0,
          totalMaterial: 0,
          totalCombined: 0
        };
      }
      const tuition = (c.applied || 0) * (c.fee || 0);
      const material = (c.applied || 0) * (c.materialFee || 0);
      grouped[instName].courses.push(c.title);
      grouped[instName].totalTuition += tuition;
      grouped[instName].totalMaterial += material;
      grouped[instName].totalCombined += (tuition + material);
    });

    return Object.values(grouped);
  }

  // 2.10 SMS Sender & Credit Management (발신번호 등록, 충전, 발송시간 제한)
  getSmsConfig(schoolId) {
    if (!this.data.smsConfig) {
      this.data.smsConfig = {
        schoolId: schoolId || 'sch_1',
        senderNumber: '02-1234-5678',
        isApproved: true,
        freeCredits: 1000,
        usedCredits: 24,
        allowSendStart: '08:00',
        allowSendEnd: '20:00',
        commonFooter: '[운천초 늘봄·방과후학교 지원센터]'
      };
    }
    return this.data.smsConfig;
  }

  updateSmsConfig(schoolId, data) {
    this.data.smsConfig = { ...this.getSmsConfig(schoolId), ...data };
    this.save();
    return this.data.smsConfig;
  }

  // 2.11.3 Overlap Restriction Groups (중복제한그룹 - 돌봄 맞춤형 신청 차단 코드)
  getRestrictionGroups(schoolId) {
    if (!this.data.restrictionGroups) {
      this.data.restrictionGroups = [
        { id: 'rg_a', schoolId: 'sch_1', code: 'a', name: '맞춤형 A그룹 (월/수)', description: '돌봄 학생 맞춤형 강좌 1차 차단 코드' },
        { id: 'rg_b', schoolId: 'sch_1', code: 'b', name: '맞춤형 B그룹 (화/목)', description: '돌봄 학생 맞춤형 강좌 2차 차단 코드' },
        { id: 'rg_c', schoolId: 'sch_1', code: 'c', name: '맞춤형 C그룹 (금)', description: '돌봄 학생 맞춤형 강좌 3차 차단 코드' }
      ];
    }
    return (this.data.restrictionGroups || []).filter(r => !schoolId || r.schoolId === schoolId);
  }

  addRestrictionGroup(schoolId, { code, name, description }) {
    if (!this.data.restrictionGroups) this.data.restrictionGroups = [];
    const newGroup = {
      id: 'rg_' + Date.now(),
      schoolId: schoolId || 'sch_1',
      code: code.trim(),
      name: name.trim(),
      description: description || ''
    };
    this.data.restrictionGroups.push(newGroup);
    this.save();
    return newGroup;
  }

  // 2.11.4 Notice Text Settings (안내글 설정: 로그인, 신청화면, 출석부 하단)
  getNoticeSettings(schoolId) {
    if (!this.data.noticeSettings) {
      this.data.noticeSettings = {
        loginTopText: '2026학년도 운천초등학교 늘봄·방과후학교 신청 포털입니다.',
        loginBottomText: '※ 초기 비밀번호는 1234이며 최초 로그인 시 즉시 변경하셔야 합니다.',
        applyGuideText: '※ 수강신청은 분 단위 시간표 중복 여부를 자동 검사하며 정원 초과 시 대기로 접수됩니다.',
        attendanceFooterText: '※ 출석 확인 서명은 학교보관용 결재 규정에 따라 효력이 발생합니다.'
      };
    }
    return this.data.noticeSettings;
  }

  updateNoticeSettings(schoolId, data) {
    this.data.noticeSettings = { ...this.getNoticeSettings(schoolId), ...data };
    this.save();
    return this.data.noticeSettings;
  }

  // --- Additional Live dbdbschool Submodel Data Stores ---

  // 1. Waitlist Management (/af/ad_wait/lists)
  getWaitlist(schoolId) {
    if (!this.data.waitlist) {
      this.data.waitlist = [
        { id: 'wait_1', schoolId: 'sch_1', studentName: '이지우', gradeClass: '1학년 3반', parentPhone: '010-3333-4444', courseTitle: '[특기적성] 창의 로봇교실 A반', rank: 1, appliedAt: '2026-03-02 10:05:22', status: '대기중' },
        { id: 'wait_2', schoolId: 'sch_1', studentName: '최예준', gradeClass: '2학년 1반', parentPhone: '010-5555-6666', courseTitle: '[특기적성] 창의 로봇교실 A반', rank: 2, appliedAt: '2026-03-02 10:08:14', status: '대기중' },
        { id: 'wait_3', schoolId: 'sch_1', studentName: '정하은', gradeClass: '3학년 2반', parentPhone: '010-7777-9999', courseTitle: '01. [특기] 바이올린 A반', rank: 1, appliedAt: '2026-03-02 10:12:00', status: '대기중' }
      ];
    }
    return (this.data.waitlist || []).filter(w => !schoolId || w.schoolId === schoolId);
  }

  getAllSchools() {
    return this.data.schools || [];
  }

  promoteWaitlist(waitId) {
    if (!this.data.waitlist) this.getWaitlist();
    let item = (this.data.waitlist || []).find(w => w.id === waitId);
    if (!item && (this.data.waitlist || []).length > 0) {
      item = this.data.waitlist[0];
    }
    if (!item) return null;
    item.status = '승격완료';
    const newApp = {
      id: 'app_' + Date.now(),
      schoolId: item.schoolId || 'sch_1',
      studentName: item.studentName,
      gradeClass: item.gradeClass,
      parentPhone: item.parentPhone,
      courseTitle: item.courseTitle,
      subsidyType: '일반',
      paymentStatus: '결제대기',
      status: '수강승인',
      appliedAt: new Date().toISOString()
    };
    if (!this.data.applicants) this.data.applicants = [];
    this.data.applicants.push(newApp);
    this.save();
    return newApp;
  }

  // 2. Attendance Stats & Stamp Printing (/af/ad_att/stat)
  getAttendanceStats(schoolId) {
    if (!this.data.attendanceStats) {
      this.data.attendanceStats = [
        { courseId: 'crs_1', courseTitle: '[돌봄] 선택형 돌봄 1부', teacherName: '돌봄전담사', enrolled: 14, targetDays: 20, attendedSum: 270, absentSum: 10, attRate: '96.4%', stampStatus: '직인날인완료' },
        { courseId: 'crs_2', courseTitle: '[돌봄] 선택형 돌봄 2부', teacherName: '돌봄전담사', enrolled: 10, targetDays: 20, attendedSum: 195, absentSum: 5, attRate: '97.5%', stampStatus: '직인날인완료' },
        { courseId: 'crs_3', courseTitle: '[특기적성] 창의 로봇교실 A반', teacherName: '김로봇 강사', enrolled: 18, targetDays: 12, attendedSum: 210, absentSum: 6, attRate: '97.2%', stampStatus: '서명대기' }
      ];
    }
    return this.data.attendanceStats;
  }

  // 3. Refunds & Cancellation Management (/af/ad_ref/lists)
  getRefunds(schoolId) {
    if (!this.data.refunds) {
      this.data.refunds = [
        { id: 'ref_1', schoolId: 'sch_1', studentName: '박서준', gradeClass: '2학년 2반', courseTitle: '[특기적성] 창의 로봇교실 A반', fee: 35000, totalDays: 12, attendedDays: 3, rule: '1/3경과전(2/3환불)', refundAmount: 23330, status: '환불완료', requestedAt: '2026-03-10' },
        { id: 'ref_2', schoolId: 'sch_1', studentName: '윤도현', gradeClass: '3학년 1반', courseTitle: '01. [특기] 바이올린 A반', fee: 30000, totalDays: 12, attendedDays: 5, rule: '1/2경과전(1/2환불)', refundAmount: 15000, status: '처리대기', requestedAt: '2026-03-15' }
      ];
    }
    return (this.data.refunds || []).filter(r => !schoolId || r.schoolId === schoolId);
  }

  addRefund(schoolId, refundData) {
    if (!this.data.refunds) this.data.refunds = [];
    const newRef = {
      id: 'ref_' + Date.now(),
      schoolId: schoolId || 'sch_1',
      studentName: refundData.studentName,
      gradeClass: refundData.gradeClass || '',
      courseTitle: refundData.courseTitle,
      fee: parseInt(refundData.fee) || 0,
      totalDays: parseInt(refundData.totalDays) || 12,
      attendedDays: parseInt(refundData.attendedDays) || 0,
      rule: refundData.rule || '일할계산',
      refundAmount: parseInt(refundData.refundAmount) || 0,
      status: refundData.status || '처리대기',
      requestedAt: new Date().toISOString().slice(0, 10)
    };
    this.data.refunds.push(newRef);
    this.save();
    return newRef;
  }

  // 4. Absences & Dismissal Pickup (/af/ad_abs/lists)
  getAbsences(schoolId) {
    if (!this.data.absences) {
      this.data.absences = [
        { id: 'abs_1', schoolId: 'sch_1', studentName: '김민준', gradeClass: '1학년 2반', parentPhone: '010-2345-6789', type: '결석', reason: '감기몸살 병결', date: '2026-03-16', status: '승인완료', returnCompanion: '학부모 자진귀가' },
        { id: 'abs_2', schoolId: 'sch_1', studentName: '이서아', gradeClass: '1학년 1반', parentPhone: '010-3456-7890', type: '조퇴', reason: '병원 진료 (15:30 귀가)', date: '2026-03-17', status: '신청대기', returnCompanion: '조모(010-1111-2222)' }
      ];
    }
    return (this.data.absences || []).filter(a => !schoolId || a.schoolId === schoolId);
  }

  updateAbsenceStatus(id, status) {
    const item = (this.data.absences || []).find(a => a.id === id);
    if (item) {
      item.status = status;
      this.save();
    }
    return item;
  }

  // 5. Notifications & Push Records (/af/notification/lists, /af/spush/lists)
  getNotifications(schoolId) {
    if (!this.data.notifications) {
      this.data.notifications = [
        { id: 'noti_1', schoolId: 'sch_1', type: '알림톡', recipientCount: 24, title: '2026학년도 방과후학교 수강신청 안내', status: '성공 24건', sentAt: '2026-03-01 09:00:15', sender: '02-1234-5678' },
        { id: 'noti_2', schoolId: 'sch_1', type: 'SMS', recipientCount: 18, title: '[특기적성] 로봇교실 개강 준비물 안내', status: '성공 18건', sentAt: '2026-03-05 14:20:00', sender: '02-1234-5678' }
      ];
    }
    return (this.data.notifications || []).filter(n => !schoolId || n.schoolId === schoolId);
  }

  getPushNotifications(schoolId) {
    if (!this.data.pushNotifications) {
      this.data.pushNotifications = [
        { id: 'push_1', schoolId: 'sch_1', title: '오늘의 방과후 수업 알림', body: '15:00 창의 로봇교실 A반 수업이 시작됩니다.', targetRole: '학생/학부모', readCount: 18, sentAt: '2026-03-10 14:30:00' },
        { id: 'push_2', schoolId: 'sch_1', title: '결석 신청 승인 안내', body: '신청하신 3월 16일 결석이 안전하게 승인되었습니다.', targetRole: '학부모', readCount: 1, sentAt: '2026-03-16 08:45:10' }
      ];
    }
    return (this.data.pushNotifications || []).filter(p => !schoolId || p.schoolId === schoolId);
  }

  // 6. Service Extension (/af/ad_extension/lists)
  getServiceExtensions(schoolId) {
    if (!this.data.extensions) {
      this.data.extensions = [
        { id: 'ext_1', schoolId: 'sch_1', serviceName: '방과후학교 늘봄 포털', termName: '2026학년도 1학기', startDate: '2026-03-01', endDate: '2026-08-31', status: '사용중', cost: '무료(공공도입)' },
        { id: 'ext_2', schoolId: 'sch_1', serviceName: 'SMS/알림톡 부가서비스', termName: '2026학년도 연간', startDate: '2026-03-01', endDate: '2027-02-28', status: '충전완료 (잔여 976건)', cost: '포인트' }
      ];
    }
    return (this.data.extensions || []).filter(e => !schoolId || e.schoolId === schoolId);
  }

  // 7. Subsidies 4-Submodels (/af/ad_free2_stu, /af/ad_free2_app, /af/ad_free2_cfg, /af/ad_free2_cfg/free1)
  getSubsidyStudents(schoolId) {
    if (!this.data.subsidyStudents) {
      this.data.subsidyStudents = [
        { id: 'sub_stu_1', schoolId: 'sch_1', studentName: '김지원', gradeClass: '1학년 1반', parentPhone: '010-4444-5555', rank: '1순위(국민기초)', annualBudget: 600000, usedAmount: 140000, balance: 460000, status: '지원가능' },
        { id: 'sub_stu_2', schoolId: 'sch_1', studentName: '박하늘', gradeClass: '2학년 3반', parentPhone: '010-6666-7777', rank: '2순위(한부모)', annualBudget: 600000, usedAmount: 210000, balance: 390000, status: '지원가능' },
        { id: 'sub_stu_3', schoolId: 'sch_1', studentName: '이동건', gradeClass: '3학년 1반', parentPhone: '010-8888-9999', rank: '3순위(차상위)', annualBudget: 600000, usedAmount: 600000, balance: 0, status: '한도소진' }
      ];
    }
    return (this.data.subsidyStudents || []).filter(s => !schoolId || s.schoolId === schoolId);
  }

  getSubsidyApplicants(schoolId) {
    if (!this.data.subsidyApplicants) {
      this.data.subsidyApplicants = [
        { id: 'sub_app_1', schoolId: 'sch_1', studentName: '김지원', courseTitle: '[특기적성] 창의 로봇교실 A반', fee: 35000, subsidizedAmount: 35000, outOfPocket: 0, deductionDate: '2026-03-02', subsidyType: '자유수강권' },
        { id: 'sub_app_2', schoolId: 'sch_1', studentName: '박하늘', courseTitle: '01. [특기] 바이올린 A반', fee: 30000, subsidizedAmount: 30000, outOfPocket: 0, deductionDate: '2026-03-02', subsidyType: '자유수강권' }
      ];
    }
    return (this.data.subsidyApplicants || []).filter(s => !schoolId || s.schoolId === schoolId);
  }

  getSubsidyRanks(schoolId) {
    if (!this.data.subsidyRanks) {
      this.data.subsidyRanks = [
        { rankNumber: 1, name: '1순위 (국민기초생활수급자)', limitAmount: 600000, isPriority: true, note: '수강료/재료비 100% 우선 지원' },
        { rankNumber: 2, name: '2순위 (한부모가족보호대상자)', limitAmount: 600000, isPriority: true, note: '연 60만원 한도 내 전액 지원' },
        { rankNumber: 3, name: '3순위 (법정 차상위계층)', limitAmount: 600000, isPriority: false, note: '예산 범위 내 지원' },
        { rankNumber: 4, name: '4순위 (학교장 추천 다자녀/특수)', limitAmount: 300000, isPriority: false, note: '학교 자체 심사 지원' }
      ];
    }
    return this.data.subsidyRanks;
  }

  // 8. Surveys & Sample Surveys (/af/ad_sur/lists, /af/ad_surs/lists)
  getSurveys(schoolId) {
    if (!this.data.surveys) {
      this.data.surveys = [
        { id: 'sur_1', schoolId: 'sch_1', title: '2026학년도 1분기 방과후학교 학부모 만족도 설문', period: '2026-03-20 ~ 2026-03-31', targetCount: 120, responseCount: 89, responseRate: '74.2%', status: '진행중' },
        { id: 'sur_2', schoolId: 'sch_1', title: '2025학년도 4분기 늘봄돌봄 프로그램 평가 설문', period: '2025-12-15 ~ 2025-12-24', targetCount: 95, responseCount: 91, responseRate: '95.8%', status: '마감완료' }
      ];
    }
    return (this.data.surveys || []).filter(s => !schoolId || s.schoolId === schoolId);
  }

  getSampleSurveys() {
    return [
      { id: 'smp_1', category: '교육청표준', title: '[교육청 표준] 방과후학교 프로그램 만족도 조사 (학생용 5문항)', questions: 5 },
      { id: 'smp_2', category: '교육청표준', title: '[교육청 표준] 방과후학교 프로그램 만족도 조사 (학부모용 8문항)', questions: 8 },
      { id: 'smp_3', category: '돌봄전용', title: '[늘봄 전용] 초등돌봄교실 급·간식 및 안전 귀가 만족도 (6문항)', questions: 6 }
    ];
  }

  // 9. Class Time Schedule Periods (/af/ad_cfg/period)
  getPeriods(schoolId) {
    if (!this.data.periods) {
      this.data.periods = [
        { id: 'prd_1', periodName: '1교시 (방과후)', startTime: '13:00', endTime: '13:45', duration: '45분' },
        { id: 'prd_2', periodName: '2교시 (방과후)', startTime: '14:00', endTime: '14:45', duration: '45분' },
        { id: 'prd_3', periodName: '3교시 (방과후)', startTime: '15:00', endTime: '15:45', duration: '45분' },
        { id: 'prd_4', periodName: '4교시 (방과후)', startTime: '16:00', endTime: '16:45', duration: '45분' }
      ];
    }
    return this.data.periods;
  }

  // 10. Course Divisions (/af/ad_cfg/afDiv)
  getAfDivisions(schoolId) {
    if (!this.data.afDivisions) {
      this.data.afDivisions = [
        { id: 'div_1', code: 'DIV_2026_1Q', name: '2026년 1분기', period: '2026.03.01 ~ 2026.05.31', isCurrent: true, courseCount: 14 },
        { id: 'div_2', code: 'DIV_2026_2Q', name: '2026년 2분기', period: '2026.06.01 ~ 2026.08.31', isCurrent: false, courseCount: 0 },
        { id: 'div_3', code: 'DIV_2026_CARE', name: '7월 돌봄', period: '2026.07.01 ~ 2026.07.31', isCurrent: false, courseCount: 6 },
        { id: 'div_4', code: 'DIV_AF_SPEC', name: '방과후 특기적성', period: '2026.03.01 ~ 2027.02.28', isCurrent: false, courseCount: 8 }
      ];
    }
    return this.data.afDivisions;
  }

  // 11. Manager Info (/af/ad_info/modify)
  getManagerInfo(schoolId) {
    if (!this.data.managerInfo) {
      this.data.managerInfo = {
        schoolName: '운천초등학교',
        schoolCode: 'UNCHON2025',
        managerName: '김선생 (방과후부장)',
        managerPhone: '010-9876-5432',
        officePhone: '02-1234-5678',
        email: 'af_master@unchon.es.kr',
        address: '서울특별시 송파구 백제고분로 123'
      };
    }
    return this.data.managerInfo;
  }

  updateManagerInfo(schoolId, data) {
    this.data.managerInfo = { ...this.getManagerInfo(schoolId), ...data };
    this.save();
    return this.data.managerInfo;
  }

  // 12. Application Period (/af/ad_time/lists)
  getApplyPeriods(schoolId) {
    if (!this.data.applyPeriods) {
      this.data.applyPeriods = [
        { id: 'ap_1', category: '2026년 1분기', startAt: '2026-03-02 09:00:00', endAt: '2026-03-06 18:00:00', gradeTarget: '1,2,3,4,5,6학년', allowCancel: true, status: '신청진행중' },
        { id: 'ap_2', category: '2026년 2분기', startAt: '2026-05-15 09:00:00', endAt: '2026-05-20 18:00:00', gradeTarget: '1,2,3,4,5,6학년', allowCancel: true, status: '대기중' }
      ];
    }
    return this.data.applyPeriods;
  }

  // 13. Q&A 고객지원 게시판 (/af/qanda/*)
  getQnaList(schoolId) {
    if (!this.data.qnaList) {
      this.data.qnaList = [
        {
          id: 'qna_8806',
          num: 2,
          schoolId: schoolId || '3267',
          authorName: '김혜련',
          hp1: '010',
          hp2: '2494',
          hp3: '1479',
          phone: '062-609-1182',
          email: 'khh147979@naver.com',
          subject: '2026학년도 1학기 늘봄학교 만족도 조사 설문지',
          contents: '2026학년도 바뀐 설문지 보내드립니다.\n감사합니다.',
          files: [{ id: 'f_1', name: '2026학년도1학기늘봄학교만족도조사설문지.hwp' }],
          status: '2',
          statusText: '완료',
          createdAt: '2026-06-01',
          answerDate: '06/01',
          answerContent: '자료 올려 주셔서 감사합니다.\n4가지 샘플 설문에 등록해드렸습니다.\n확인 바랍니다.'
        },
        {
          id: 'qna_3356',
          num: 1,
          schoolId: schoolId || '3267',
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
          createdAt: '2026-05-15',
          answerDate: '05/16',
          answerContent: '요청하신 지원금 스쿨뱅킹 수납 현황을 에듀파인 연계 규격에 맞게 생성하여 등록 처리하였습니다.'
        }
      ];
      this.save();
    }
    return this.data.qnaList;
  }

  getQnaById(id) {
    const list = this.getQnaList();
    return list.find(i => String(i.id) === String(id)) || null;
  }

  createQna(data) {
    const list = this.getQnaList();
    const newItem = {
      id: `qna_${Date.now()}`,
      num: list.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      status: '0',
      statusText: '접수',
      answerDate: '',
      answerContent: '',
      ...data
    };
    list.unshift(newItem);
    this.save();
    return newItem;
  }

  updateQnaReply(id, data) {
    const list = this.getQnaList();
    const target = list.find(i => String(i.id) === String(id));
    if (!target) return null;

    target.answerContent = data.replyContent || target.answerContent;
    target.status = data.status || '2';
    target.statusText = target.status === '3' ? '답변완료' : (target.status === '2' ? '완료' : '처리중');
    target.answerDate = new Date().toISOString().split('T')[0].substring(5);
    this.save();
    return target;
  }

  deleteQna(id) {
    const list = this.getQnaList();
    const initLen = list.length;
    this.data.qnaList = list.filter(i => String(i.id) !== String(id));
    this.save();
    return this.data.qnaList.length < initLen;
  }

  // 14. Applicants Management (/af/ad_app/*)
  getApplicantsBySchool(schoolId, filters = {}) {
    if (!this.data.applicants) {
      this.data.applicants = [
        {
          id: 'app_1',
          schoolId: '3267',
          courseId: 'c_3267_1',
          courseTitle: '[늘봄] AI 로봇 코딩 교실',
          category: '늘봄',
          neulbomType: '초등1~2학년 늘봄',
          studentId: 'stu_1',
          studentName: '김민준',
          grade: '1',
          classNum: '2',
          studentNumber: '08',
          guardianName: '김상우',
          guardianPhone: '010-3344-5566',
          tuitionFee: 30000,
          materialFee: 15000,
          totalFee: 45000,
          paymentStatus: '납부완료',
          status: '정상',
          isPriority: true,
          appliedAt: '2026-03-02 09:15:20'
        },
        {
          id: 'app_2',
          schoolId: '3267',
          courseId: 'c_3267_1',
          courseTitle: '[늘봄] AI 로봇 코딩 교실',
          category: '늘봄',
          neulbomType: '초등1~2학년 늘봄',
          studentId: 'stu_2',
          studentName: '이서연',
          grade: '1',
          classNum: '1',
          studentNumber: '14',
          guardianName: '이지훈',
          guardianPhone: '010-7788-9900',
          tuitionFee: 30000,
          materialFee: 15000,
          totalFee: 45000,
          paymentStatus: '납부완료',
          status: '정상',
          isPriority: false,
          appliedAt: '2026-03-02 09:20:11'
        },
        {
          id: 'app_3',
          schoolId: '3267',
          courseId: 'c_3267_2',
          courseTitle: '창의 융합 생명과학 실험',
          category: '방과후',
          neulbomType: '',
          studentId: 'stu_3',
          studentName: '박도윤',
          grade: '2',
          classNum: '3',
          studentNumber: '03',
          guardianName: '박성민',
          guardianPhone: '010-1234-5678',
          tuitionFee: 35000,
          materialFee: 20000,
          totalFee: 55000,
          paymentStatus: '미납',
          status: '정상',
          isPriority: false,
          appliedAt: '2026-03-02 09:35:44'
        },
        {
          id: 'app_4',
          schoolId: '3267',
          courseId: 'c_3267_3',
          courseTitle: '신나는 음악 줄넘기',
          category: '방과후',
          neulbomType: '',
          studentId: 'stu_4',
          studentName: '최예은',
          grade: '3',
          classNum: '1',
          studentNumber: '21',
          guardianName: '최원석',
          guardianPhone: '010-9988-7766',
          tuitionFee: 25000,
          materialFee: 5000,
          totalFee: 30000,
          paymentStatus: '납부완료',
          status: '정상',
          isPriority: true,
          appliedAt: '2026-03-02 09:40:02'
        }
      ];
      this.save();
    }

    let items = this.data.applicants.filter(a => String(a.schoolId) === String(schoolId || '3267'));

    if (filters.category && filters.category !== 'all' && filters.category !== '전체') {
      items = items.filter(a => a.category === filters.category);
    }
    if (filters.neulbomType && filters.neulbomType !== 'all') {
      items = items.filter(a => a.neulbomType === filters.neulbomType);
    }
    if (filters.courseId && filters.courseId !== 'all') {
      items = items.filter(a => a.courseId === filters.courseId);
    }
    if (filters.grade && filters.grade !== 'all') {
      items = items.filter(a => String(a.grade) === String(filters.grade));
    }
    if (filters.classNum && filters.classNum !== 'all') {
      items = items.filter(a => String(a.classNum) === String(filters.classNum));
    }
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      items = items.filter(a => a.paymentStatus === filters.paymentStatus);
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter(a => a.status === filters.status);
    }
    if (filters.keyword && filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase();
      items = items.filter(a => 
        (a.studentName && a.studentName.toLowerCase().includes(kw)) ||
        (a.guardianName && a.guardianName.toLowerCase().includes(kw)) ||
        (a.guardianPhone && a.guardianPhone.includes(kw)) ||
        (a.courseTitle && a.courseTitle.toLowerCase().includes(kw))
      );
    }

    return items;
  }

  getApplicantStats(schoolId) {
    const items = this.getApplicantsBySchool(schoolId);
    return {
      totalCount: items.length,
      paidCount: items.filter(i => i.paymentStatus === '납부완료').length,
      unpaidCount: items.filter(i => i.paymentStatus === '미납').length,
      priorityCount: items.filter(i => i.isPriority).length,
      totalTuitionFee: items.reduce((sum, i) => sum + (Number(i.tuitionFee) || 0), 0),
      totalMaterialFee: items.reduce((sum, i) => sum + (Number(i.materialFee) || 0), 0),
      totalFeeSum: items.reduce((sum, i) => sum + (Number(i.totalFee) || 0), 0)
    };
  }

  getApplicantById(id) {
    if (!this.data.applicants) this.getApplicantsBySchool();
    return this.data.applicants.find(a => String(a.id) === String(id)) || null;
  }

  createApplicant(data) {
    if (!this.data.applicants) this.getApplicantsBySchool();
    const tuition = Number(data.tuitionFee) || 0;
    const material = Number(data.materialFee) || 0;
    const book = Number(data.bookFee) || 0;
    const instructorFee = data.instructorFee !== undefined ? Number(data.instructorFee) : Math.round(tuition * 0.8);
    const facilityFee = data.facilityFee !== undefined ? Number(data.facilityFee) : (tuition - instructorFee);
    const totalFee = tuition + material + book;

    const newApp = {
      id: data.id || `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      schoolId: data.schoolId || '3267',
      courseId: data.courseId || 'c_3267_1',
      courseTitle: data.courseTitle || '신규 강좌',
      category: data.category || '26년 8월',
      neulbomType: data.neulbomType || '방과후',
      studentId: data.studentId || `stu_${Date.now()}`,
      studentName: data.studentName || '홍길동',
      gradeClass: data.gradeClass || `${data.grade || 1}학년 ${data.classNum || 1}반`,
      grade: String(data.grade || (data.gradeClass ? data.gradeClass.substring(0, 1) : '1')),
      classNum: String(data.classNum || (data.gradeClass && data.gradeClass.includes('반') ? data.gradeClass.split('반')[0].slice(-1) : '1')),
      studentNum: String(data.studentNum || data.studentNumber || '01'),
      studentNumber: String(data.studentNum || data.studentNumber || '01'),
      guardianName: data.guardianName || data.depositorName || '보호자',
      guardianPhone: data.guardianPhone || data.parentPhone || '010-0000-0000',
      parentPhone: data.guardianPhone || data.parentPhone || '010-0000-0000',
      tuitionFee: tuition,
      bookFee: book,
      materialFee: material,
      instructorFee,
      facilityFee,
      totalFee,
      paymentStatus: data.paymentStatus || '미납',
      status: data.status || '정상',
      isPriority: !!data.isPriority,
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...data
    };
    newApp.totalFee = totalFee; // Ensure correct total fee
    this.data.applicants.unshift(newApp);
    this.save();
    return newApp;
  }

  copyApplicants({ schoolId, fromCategory, toCategory } = {}) {
    if (!this.data.applicants) this.getApplicantsBySchool();
    const sourceList = this.data.applicants.filter(a => {
      const matchSchool = !schoolId || String(a.schoolId) === String(schoolId);
      const matchCategory = !fromCategory || a.category === fromCategory;
      return matchSchool && matchCategory;
    });

    const targetCategory = toCategory || '26년 9월';
    const copied = [];
    sourceList.forEach(app => {
      const cloned = {
        ...app,
        id: `app_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        category: targetCategory,
        appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      this.data.applicants.unshift(cloned);
      copied.push(cloned);
    });

    this.save();
    return { copiedCount: copied.length, count: copied.length, items: copied };
  }

  createApplicantsBatch(schoolId, items = []) {
    if (!this.data.applicants) this.getApplicantsBySchool();
    const created = [];
    items.forEach(item => {
      const app = this.createApplicant({ schoolId, ...item });
      created.push(app);
    });
    return created;
  }

  batchCreateApplicants(schoolId, items = []) {
    return this.createApplicantsBatch(schoolId, items);
  }

  batchUpdateFee(courseId, { tuitionFee, materialFee, applyToAll } = {}) {
    if (!this.data.applicants) this.getApplicantsBySchool();
    let count = 0;
    this.data.applicants.forEach(app => {
      if (applyToAll || app.courseId === courseId) {
        if (tuitionFee !== undefined) app.tuitionFee = Number(tuitionFee);
        if (materialFee !== undefined) app.materialFee = Number(materialFee);
        app.totalFee = (Number(app.tuitionFee) || 0) + (Number(app.materialFee) || 0) + (Number(app.bookFee) || 0);
        count++;
      }
    });
    this.save();
    return { updatedCount: count, count };
  }

  batchUpdateApplicantFees(courseIdOrSchoolId, options = {}) {
    const courseId = typeof courseIdOrSchoolId === 'object' ? courseIdOrSchoolId.courseId : (options.courseId || courseIdOrSchoolId);
    return this.batchUpdateFee(courseId, options);
  }

  updateApplicant(id, data) {
    const list = this.data.applicants || [];
    const target = list.find(a => String(a.id) === String(id));
    if (!target) return null;

    Object.assign(target, data);
    if (data.tuitionFee !== undefined || data.materialFee !== undefined) {
      target.totalFee = (Number(target.tuitionFee) || 0) + (Number(target.materialFee) || 0);
    }
    this.save();
    return target;
  }

  deleteApplicant(id) {
    if (!this.data.applicants) return false;
    const initLen = this.data.applicants.length;
    this.data.applicants = this.data.applicants.filter(a => String(a.id) !== String(id));
    this.save();
    return this.data.applicants.length < initLen;
  }

  batchDeleteApplicants(ids = []) {
    if (!this.data.applicants) return 0;
    const idSet = new Set(ids.map(String));
    const initLen = this.data.applicants.length;
    this.data.applicants = this.data.applicants.filter(a => !idSet.has(String(a.id)));
    this.save();
    return initLen - this.data.applicants.length;
  }

  batchTransferApplicants(ids = [], targetCourseId, targetCourseTitle) {
    if (!this.data.applicants) return 0;
    let count = 0;
    const idSet = new Set(ids.map(String));
    this.data.applicants.forEach(a => {
      if (idSet.has(String(a.id))) {
        a.courseId = targetCourseId;
        if (targetCourseTitle) a.courseTitle = targetCourseTitle;
        count++;
      }
    });
    this.save();
    return count;
  }

  batchUpdateDrawPriority(ids = [], isPriority = true) {
    if (!this.data.applicants) return 0;
    let count = 0;
    const idSet = new Set(ids.map(String));
    this.data.applicants.forEach(a => {
      if (idSet.has(String(a.id))) {
        a.isPriority = isPriority;
        count++;
      }
    });
    this.save();
    return count;
  }
}

module.exports = new JSONDatabase();


