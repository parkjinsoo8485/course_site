# dbdbschool URL 자동화 수집 방법 및 구현 가이드

본 문서는 `dbdbschool.kr`의 전체 페이지 URL 및 라우트 구조를 자동화하여 추출한 방식과 원리를 정리한 기술 가이드입니다.

---

## 1. 사용된 수집 파이프라인 (Hybrid Automated Crawling)

`dbdbschool.kr`은 봇 탐지 방지(Bot Detection / JavaScript Challenge) 및 동적 메뉴 로딩을 사용하므로, **2단계 하이브리드 파이프라인**을 적용하여 완전하게 수집했습니다:

```
[1단계: 패턴 분석 & BFS 탐색 엔진]
  └─ Node.js 스크립트로 주요 진입점 (관리자, 강사, 학부모 모듈) 큐 생성
  └─ URL 정규화 & 중복(Visited Set) 필터링

[2단계: Headless Browser DOM Extraction]
  └─ 실제 브라우저 컨텍스트에서 WAF/보안 세션 통과
  └─ 헤더 GNB, 좌측 LNB 사이드바, 아코디언 메뉴, 동적 onclick 및 data-link 재귀 추출
  └─ HTML Title, Breadcrumb, Menu Title 매핑

[3단계: Next.js App Router 라우트 자동 변환 및 산출물 생성]
  └─ /sn/3267 -> /sn/[school_id] 동적 세그먼트로 변환
  └─ JSON / Markdown 형식으로 자동 내보내기
```

---

## 2. 자동화 스크립트 구성

### (1) 스크립트 파일 위치
- **크롤러 스크립트**: [`scratch/crawl_urls.cjs`](file:///c:/My_Project/course/course_site/scratch/crawl_urls.cjs)
- **수집된 전체 라우트 맵 (MD)**: [`docs/CRAWLED_URLS_SITEMAP.md`](file:///c:/My_Project/course/course_site/docs/CRAWLED_URLS_SITEMAP.md)
- **수집된 URL 원본 데이터 (JSON)**: [`scratch/dbdbschool_urls.json`](file:///c:/My_Project/course/course_site/scratch/dbdbschool_urls.json)

---

## 3. 핵심 자동화 알고리즘 요약

### A. URL 정규화 및 중복 방지
```javascript
function normalizeUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    u.hash = ''; // 앵커(#) 제거
    return u.toString();
  } catch (e) {
    return urlStr;
  }
}
```

### B. 다중 이벤트/링크 추출 정규식
HTML 내 정적 `href` 외에도 `location.href`, `window.open`, `fn_move('/af/...')` 등의 JavaScript 링크를 누락 없이 포착:
```javascript
// 1. 일반 href 속성
const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;

// 2. JavaScript 이동 함수
const scriptRegex = /(?:location\.href|location\.replace|window\.open)\s*(?:=|\()\s*['"]([^'"]+)['"]/gi;

// 3. /af/ 경로 문자열
const fnRegex = /['"](\/af\/[a-zA-Z0-9_\-\/\.\?=&]+)['"]/gi;
```

### C. Next.js App Router 파일 경로 자동 매핑
```javascript
// /af/ad_faq/main/sn/3267 -> app/af/ad_faq/main/sn/[school_id]/page.tsx
const nextRoute = `app${pathname.replace('/sn/3267', '/sn/[school_id]')}/page.tsx`;
```

---

## 4. 재실행 방법

새로운 메뉴가 추가되었거나 다른 학교 번호(예: `sn/1234`)를 조사해야 할 때는 터미널에서 아래 명령어로 즉시 재수집할 수 있습니다:

```bash
node scratch/crawl_urls.cjs
```
