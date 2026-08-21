import os
import re
import sys
import time
import json
import random
import base64
from urllib.parse import urlparse, unquote, urljoin

# Windows 콘솔 UTF-8 출력 보장
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

try:
    from playwright_stealth import Stealth
    HAS_STEALTH = True
except ImportError:
    HAS_STEALTH = False

# ==============================================================================
# 🎯 [설정] 강좌관리(ad_lec) 클론코딩 전용 올인원 수집기
# ==============================================================================
AUTH_FILE = "auth.json"
LOGIN_URL = "https://www.dbdbschool.kr/member/login/sn/3267"
TARGET_PAGE_NAME = "강좌관리"
TARGET_PAGE_URL = "https://www.dbdbschool.kr/af/ad_lec/lists/sn/3267"
BASE_LEC_URL = "https://www.dbdbschool.kr/af/ad_lec"

OUTPUT_DIR = "./crawled_assets"
PAGES_DIR = os.path.join(OUTPUT_DIR, "pages")
GLOBAL_ASSETS_DIR = os.path.join(OUTPUT_DIR, "global_assets")
HAR_DIR = os.path.join(OUTPUT_DIR, "har")

for d in [OUTPUT_DIR, PAGES_DIR, GLOBAL_ASSETS_DIR, HAR_DIR]:
    os.makedirs(d, exist_ok=True)

def sanitize(name: str) -> str:
    clean = re.sub(r'[\\/*?:"<>| \t\n\r]', '_', str(name))
    clean = re.sub(r'_+', '_', clean).strip('_')
    return clean[:45] if clean else "page"

def human_delay(page, min_ms: int = 1500, max_ms: int = 2500, action_desc: str = ""):
    wait_time = random.randint(min_ms, max_ms)
    if action_desc: 
        print(f"    [대기] {action_desc} ({wait_time}ms)")
    try:
        if not page.is_closed():
            page.wait_for_timeout(wait_time)
    except Exception:
        time.sleep(wait_time / 1000.0)

def apply_stealth_to_page(page):
    if HAS_STEALTH:
        try: Stealth().apply_stealth_sync(page)
        except Exception: pass

def inject_base_tag(page):
    try:
        if not page.is_closed():
            page.evaluate(f"""
                if (!document.querySelector('base')) {{
                    const base = document.createElement('base');
                    base.href = '{page.url}';
                    document.head.prepend(base);
                }}
            """)
    except Exception: pass

def auto_scroll_to_bottom(page):
    try:
        if not page.is_closed():
            print("    [동작] 부드러운 스크롤링 시뮬레이션...")
            page.evaluate("""
                async () => {
                    await new Promise((resolve) => {
                        let totalHeight = 0;
                        const distance = 300;
                        const timer = setInterval(() => {
                            const scrollHeight = document.body.scrollHeight;
                            window.scrollBy({ top: distance, behavior: 'smooth' });
                            totalHeight += distance;
                            if(totalHeight >= scrollHeight - window.innerHeight){
                                clearInterval(timer);
                                setTimeout(() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    resolve();
                                }, 300);
                            }
                        }, 150);
                    });
                }
            """)
            page.wait_for_timeout(800)
    except Exception: pass

# 🔥 [네트워크 리소스 다운로드 핸들러]
saved_urls = set()
collected_page_network_log = {} # screen_name -> [requests]
current_screen_context = "00_강좌관리_기본목록"

def save_raw_asset(response):
    global current_screen_context
    try:
        if not (200 <= response.status < 400): return
        url = response.url
        if not url or url.startswith(('data:', 'blob:', 'javascript:')): return

        resource_type = response.request.resource_type
        target_types = ['stylesheet', 'script', 'image', 'xhr', 'fetch', 'font', 'document']
        if resource_type not in target_types: return

        # 현재 페이지의 네트워크 로그에 기록
        if current_screen_context not in collected_page_network_log:
            collected_page_network_log[current_screen_context] = []
        collected_page_network_log[current_screen_context].append({
            "url": url,
            "status": response.status,
            "type": resource_type,
            "method": response.request.method
        })

        if url in saved_urls: return
        saved_urls.add(url)

        parsed_url = urlparse(url)
        path = unquote(parsed_url.path)
        file_name = os.path.basename(path)

        # 전역 에셋 폴더에 저장
        type_dir = os.path.join(GLOBAL_ASSETS_DIR, resource_type)
        os.makedirs(type_dir, exist_ok=True)

        if not file_name or "." not in file_name:
            ext_map = {'stylesheet': '.css', 'script': '.js', 'image': '.png', 'font': '.woff2', 'document': '.html'}
            ext = ext_map.get(resource_type, '.dat')
            clean_name = f"asset_{abs(hash(url))%1000000}{ext}"
        else:
            clean_name = sanitize(file_name)

        file_path = os.path.join(type_dir, clean_name)
        if not os.path.exists(file_path):
            try:
                body = response.body()
                with open(file_path, "wb") as f:
                    f.write(body)
            except Exception: pass
    except Exception: pass

# ==============================================================================
# 1. UI 명세서 추출기
# ==============================================================================
def extract_ui_spec(page) -> dict:
    js_code = """
    () => {
        const result = {
            title: document.title, url: window.location.href,
            buttons: [], inputs: [], selects: [], tables: []
        };
        document.querySelectorAll('#contents_box input:not([type="hidden"]), #contents_box textarea').forEach(el => {
            result.inputs.push({
                type: el.getAttribute('type') || 'text',
                id: el.id || '', name: el.name || '', placeholder: el.placeholder || '', value: el.value || ''
            });
        });
        document.querySelectorAll('#contents_box select').forEach(sel => {
            result.selects.push({
                id: sel.id || '', name: sel.name || '',
                options: Array.from(sel.options).map(o => ({ text: o.text.trim(), value: o.value, selected: o.selected }))
            });
        });
        document.querySelectorAll('#contents_box input[type="button"], #contents_box input[type="submit"], #contents_box a.btn, #contents_box .btn, #contents_box button').forEach(btn => {
            const txt = (btn.innerText || btn.getAttribute('value') || btn.getAttribute('title') || '').trim();
            if (txt) result.buttons.push({ text: txt, onclick: btn.getAttribute('onclick') || '', href: btn.getAttribute('href') || '' });
        });
        document.querySelectorAll('#contents_box table').forEach((tbl, idx) => {
            const headers = Array.from(tbl.querySelectorAll('th')).map(th => th.innerText.trim()).filter(Boolean);
            result.tables.push({ idx: idx, headers: headers, rowCount: tbl.querySelectorAll('tbody tr').length });
        });
        return result;
    }
    """
    try:
        if not page.is_closed(): return page.evaluate(js_code)
    except Exception: pass
    return {"title": "Error", "url": "", "error": "failed"}

# ==============================================================================
# 2. 개별 페이지 전용 패키징 저장기 (해당 페이지 이름의 독립 폴더 생성)
# ==============================================================================
def save_page_package(page, screen_name: str):
    clean_name = sanitize(screen_name)
    page_folder = os.path.join(PAGES_DIR, clean_name)
    os.makedirs(page_folder, exist_ok=True)

    print(f"    [📦 패키징 저장] '{clean_name}' 폴더 생성 및 저장 중...")
    try:
        auto_scroll_to_bottom(page)
        inject_base_tag(page)
        human_delay(page, 1000, 1800, "화면 렌더링 대기")

        # 1. 페이지 스크린샷 저장
        shot_file = os.path.join(page_folder, f"{clean_name}_스크린샷.png")
        page.screenshot(path=shot_file, full_page=True)

        # 2. 원본 HTML 저장
        html_file = os.path.join(page_folder, f"{clean_name}_원본.html")
        with open(html_file, "w", encoding="utf-8") as f:
            f.write(page.content())

        # 3. UI 명세서 JSON 저장
        spec = extract_ui_spec(page)
        spec_file = os.path.join(page_folder, f"{clean_name}_UI구조명세.json")
        with open(spec_file, "w", encoding="utf-8") as f:
            json.dump(spec, f, ensure_ascii=False, indent=2)

        # 4. 해당 페이지 호출 네트워크 트래픽 로그 저장
        net_logs = collected_page_network_log.get(screen_name, [])
        net_file = os.path.join(page_folder, f"{clean_name}_네트워크요청목록.json")
        with open(net_file, "w", encoding="utf-8") as f:
            json.dump(net_logs, f, ensure_ascii=False, indent=2)

        print(f"    [OK] '{clean_name}' 패키지 저장 완료 -> {page_folder}")
    except Exception as e:
        print(f"    [!] 화면 아카이빙 중 오류: {e}")

# ==============================================================================
# 3. 강좌관리 핵심 버튼 타겟 식별기 (표준 DOM 탐색기)
# ==============================================================================
def get_lecture_core_actions(page):
    js_code = """
    () => {
        const targets = [];
        
        // 헬퍼: 텍스트를 포함하는 요소 찾기
        function findByText(selector, text) {
            const list = document.querySelectorAll(selector);
            for (const el of list) {
                const val = (el.innerText || el.getAttribute('value') || el.getAttribute('title') || '').trim();
                if (val.includes(text)) return el;
            }
            return null;
        }

        // 1. 상단 주요 기능 액션 버튼들
        const btnConfigs = [
            { type: 'input', text: '강좌 등록', name: '01_강좌등록', fallback: 'input[value*="강좌 등록"]' },
            { type: 'a', text: '강좌 일괄입력', name: '02_강좌_일괄입력', fallback: 'a[href*="input"]' },
            { type: 'a', text: '강좌 일괄수정', name: '03_강좌_일괄수정', fallback: 'a[href*="modifyField"]' },
            { type: 'a', text: '강좌 일괄복사', name: '04_강좌_일괄복사', fallback: 'a[href*="copy"]' },
            { type: 'input', text: '강좌 통계', name: '05_강좌_통계', fallback: 'input[value*="통계"]' },
            { type: 'input', text: '출석부 출력', name: '06_출석부_출력', fallback: 'input[value*="출석부"]' },
            { type: 'input', text: '검색결과엑셀출력', name: '07_검색결과_엑셀출력', fallback: 'input[value*="엑셀"]' },
            { type: 'a', text: '상세검색', name: '08_상세검색_펼침', fallback: '#main_control_box_btn01' }
        ];

        btnConfigs.forEach(b => {
            let el = findByText(b.type, b.text);
            if (!el && b.fallback) {
                try { el = document.querySelector(b.fallback); } catch(e) {}
            }
            if (el) {
                targets.push({
                    category: '메인액션',
                    name: b.name,
                    text: b.text,
                    tag: el.tagName.toLowerCase(),
                    href: el.getAttribute('href') || '',
                    onclick: el.getAttribute('onclick') || ''
                });
            }
        });

        // 2. 강좌 목록 첫 번째 대표 강좌의 [수정] 버튼
        const firstModifyBtn = document.querySelector('table.list tbody tr td a i.fa-cog, table tbody tr td a[href*="modify"]');
        if (firstModifyBtn) {
            const a = firstModifyBtn.closest('a') || firstModifyBtn;
            targets.push({
                category: '강좌목록',
                name: '09_강좌_상세수정화면',
                text: '수정',
                tag: 'a',
                href: a.getAttribute('href') || '',
                onclick: a.getAttribute('onclick') || ''
            });
        }

        // 3. 강좌 목록 첫 번째 대표 강좌의 [신청자 목록] 링크
        const firstAppBtn = document.querySelector('table.list tbody tr td a[href*="/af/ad_app/lists/sln/"]');
        if (firstAppBtn) {
            targets.push({
                category: '강좌목록',
                name: '10_강좌별_신청자목록',
                text: '신청자명단',
                tag: 'a',
                href: firstAppBtn.getAttribute('href') || '',
                onclick: firstAppBtn.getAttribute('onclick') || ''
            });
        }

        return targets;
    }
    """
    try:
        if not page.is_closed(): return page.evaluate(js_code)
    except Exception as e:
        print(f"    [!] 타겟 추출 오류: {e}")
    return []

# ==============================================================================
# 4. HAR 파일 후처리 분석 및 에셋 추출기 (Pretty JSON + Markdown 보고서 + Base64 에셋 디코딩)
# ==============================================================================
def process_har_and_extract_assets(har_file: str):
    if not os.path.exists(har_file):
        print(f"  [!] HAR 파일을 찾을 수 없습니다: {har_file}")
        return

    print(f"\n[📦 개발자 도구 HAR 정밀 분석 및 포맷팅] '{har_file}' 처리 중...")
    try:
        with open(har_file, "r", encoding="utf-8", errors="ignore") as f:
            har_data = json.load(f)

        entries = har_data.get("log", {}).get("entries", [])
        print(f"  - 총 기록된 HTTP 트랜잭션: {len(entries)}개")

        # 1. 보기 편한 Pretty JSON 포맷으로 재저장 (.pretty.har 및 원본 덮어쓰기 옵션)
        pretty_har_path = har_file.replace(".har", "_readable.json")
        try:
            with open(pretty_har_path, "w", encoding="utf-8") as pf:
                json.dump(har_data, pf, ensure_ascii=False, indent=2)
            print(f"  [OK] 가독성 향상 포맷팅 완료 -> {pretty_har_path}")
        except Exception as pe:
            print(f"  [!] Pretty JSON 저장 실패: {pe}")

        # 2. 에셋 분류 및 API 엔드포인트 명세 추출
        api_endpoints = []
        api_count = 0
        static_count = 0
        image_count = 0

        extracted_base_dir = os.path.join(HAR_DIR, "extracted_assets")
        os.makedirs(extracted_base_dir, exist_ok=True)

        for idx, entry in enumerate(entries, start=1):
            req = entry.get("request", {})
            res = entry.get("response", {})
            url = req.get("url", "")
            method = req.get("method", "GET")
            status = res.get("status", 0)
            
            content_info = res.get("content", {})
            mime = content_info.get("mimeType", "").lower()
            body_text = content_info.get("text", "")
            encoding = content_info.get("encoding", "")

            if not url: continue

            # 쿼리스트링 및 POST 데이터 추출
            query_params = req.get("queryString", [])
            post_data = req.get("postData", {}).get("text", "")

            # 엔드포인트 정보 기록
            parsed = urlparse(url)
            endpoint_item = {
                "id": idx,
                "method": method,
                "url": url,
                "path": parsed.path,
                "status": status,
                "mimeType": mime,
                "queryParams": query_params,
                "postData": post_data,
                "responseSize": content_info.get("size", 0)
            }
            api_endpoints.append(endpoint_item)

            if not body_text: continue

            # XHR / Fetch JSON 응답인 경우
            if "application/json" in mime or "text/json" in mime or (body_text.strip().startswith(("{", "[")) and "text/html" not in mime):
                clean_api = sanitize(parsed.path.strip("/").replace("/", "_"))
                api_dir = os.path.join(GLOBAL_ASSETS_DIR, "api_responses")
                os.makedirs(api_dir, exist_ok=True)
                api_file = os.path.join(api_dir, f"{clean_api}_{idx}.json")
                try:
                    # JSON 포맷팅 저장
                    try:
                        parsed_json = json.loads(body_text)
                        with open(api_file, "w", encoding="utf-8") as f:
                            json.dump(parsed_json, f, ensure_ascii=False, indent=2)
                    except Exception:
                        with open(api_file, "w", encoding="utf-8") as f:
                            f.write(body_text)
                    api_count += 1
                except Exception: pass
            
            # CSS 파일 추출
            elif "text/css" in mime or parsed.path.endswith(".css"):
                clean_css = sanitize(os.path.basename(parsed.path) or f"style_{idx}")
                css_dir = os.path.join(GLOBAL_ASSETS_DIR, "stylesheet")
                os.makedirs(css_dir, exist_ok=True)
                css_file = os.path.join(css_dir, clean_css if clean_css.endswith(".css") else f"{clean_css}.css")
                try:
                    with open(css_file, "w", encoding="utf-8") as f:
                        f.write(body_text)
                    static_count += 1
                except Exception: pass

            # JS 파일 추출
            elif "javascript" in mime or parsed.path.endswith(".js"):
                clean_js = sanitize(os.path.basename(parsed.path) or f"script_{idx}")
                js_dir = os.path.join(GLOBAL_ASSETS_DIR, "script")
                os.makedirs(js_dir, exist_ok=True)
                js_file = os.path.join(js_dir, clean_js if clean_js.endswith(".js") else f"{clean_js}.js")
                try:
                    with open(js_file, "w", encoding="utf-8") as f:
                        f.write(body_text)
                    static_count += 1
                except Exception: pass

            # 이미지 파일 추출 (Base64 디코딩 포함)
            elif "image" in mime or parsed.path.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico')):
                clean_img = sanitize(os.path.basename(parsed.path) or f"img_{idx}")
                img_dir = os.path.join(GLOBAL_ASSETS_DIR, "image")
                os.makedirs(img_dir, exist_ok=True)
                img_file = os.path.join(img_dir, clean_img)
                try:
                    if encoding == "base64":
                        img_bytes = base64.b64decode(body_text)
                        with open(img_file, "wb") as f:
                            f.write(img_bytes)
                    else:
                        with open(img_file, "w", encoding="utf-8", errors="ignore") as f:
                            f.write(body_text)
                    image_count += 1
                except Exception: pass

        # 3. 네트워크 엔드포인트 명세 JSON 저장
        endpoints_json_path = os.path.join(HAR_DIR, "네트워크_API_엔드포인트_명세.json")
        with open(endpoints_json_path, "w", encoding="utf-8") as ef:
            json.dump(api_endpoints, ef, ensure_ascii=False, indent=2)

        # 4. 사람이 한눈에 읽을 수 있는 네트워크 요약 보고서 Markdown 생성
        report_md_path = os.path.join(HAR_DIR, "네트워크_트래픽_요약보고서.md")
        with open(report_md_path, "w", encoding="utf-8") as rf:
            rf.write("# 🌐 강좌관리 개발자도구 네트워크 트래픽 분석 보고서\n\n")
            rf.write(f"- **총 수집된 HTTP 요청 수**: `{len(entries)}`개\n")
            rf.write(f"- **추출된 API JSON 응답**: `{api_count}`개\n")
            rf.write(f"- **추출된 정적 자원 (CSS/JS)**: `{static_count}`개\n")
            rf.write(f"- **추출된 이미지 리소스**: `{image_count}`개\n")
            rf.write(f"- **포맷팅된 읽기용 HAR 파일**: [`강좌관리_개발자도구_네트워크_readable.json`](file:///{pretty_har_path.replace(os.sep, '/')})\n\n")
            rf.write("## 📋 주요 요청 엔드포인트 목록\n\n")
            rf.write("| # | Method | Status | Type | Path / URL | Query / Post Data |\n")
            rf.write("|---|---|---|---|---|---|\n")
            for ep in api_endpoints[:60]: # 상위 60개 요약
                path_display = ep['path'] if ep['path'] else ep['url'][:50]
                payload = ""
                if ep['queryParams']:
                    payload += f"Query: {json.dumps(ep['queryParams'], ensure_ascii=False)[:30]} "
                if ep['postData']:
                    payload += f"Post: {ep['postData'][:30]}"
                payload = payload.replace("\n", " ").replace("|", "\\|")
                rf.write(f"| {ep['id']} | **{ep['method']}** | `{ep['status']}` | {ep['mimeType'][:20]} | `{path_display}` | {payload} |\n")

        print(f"  [OK] HAR 분석 완료: API JSON {api_count}개, CSS/JS {static_count}개, 이미지 {image_count}개 정밀 추출 완료")
        print(f"  [OK] 보고서 생성 완료: {report_md_path}")
        print(f"  [OK] API 명세 저장 완료: {endpoints_json_path}")
    except Exception as e:
        print(f"  [!] HAR 파일 분석 중 예외: {e}")

# ==============================================================================
# 5. 종합 실행 엔진
# ==============================================================================
def run_lecture_focused_collector():
    global current_screen_context
    print("=" * 80)
    print("  🚀 [강좌관리 클론코딩 종합 데이터 수집기 가동]")
    print(f"  - 기준 URL: {TARGET_PAGE_URL}")
    print(f"  - 저장 경로: {PAGES_DIR} (각 화면별 독립 폴더 패키징)")
    print("=" * 80)

    har_path = os.path.join(HAR_DIR, "강좌관리_개발자도구_네트워크.har")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=["--disable-blink-features=AutomationControlled", "--no-sandbox"])
        context = browser.new_context(
            storage_state=AUTH_FILE,
            record_har_path=har_path,
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        page.on("dialog", lambda d: d.accept())
        page.on("response", save_raw_asset)
        apply_stealth_to_page(page)

        # ----------------------------------------------------------------------
        # 1. 메인 강좌관리 목록 페이지 수집
        # ----------------------------------------------------------------------
        current_screen_context = "00_강좌관리_기본목록"
        print(f"\n[1/3] 메인 강좌관리 페이지 접속 중: {TARGET_PAGE_URL}")
        page.goto(TARGET_PAGE_URL, wait_until="networkidle", timeout=60000)
        save_page_package(page, current_screen_context)

        # ----------------------------------------------------------------------
        # 2. 강좌관리 핵심 기능 타겟 추출
        # ----------------------------------------------------------------------
        print(f"\n[2/3] 강좌관리 핵심 버튼 타겟 식별 중...")
        actions = get_lecture_core_actions(page)
        print(f"  [*] 총 {len(actions)}개의 핵심 기능 버튼이 식별되었습니다.\n")

        # ----------------------------------------------------------------------
        # 3. 각 핵심 버튼 순차 실행 (직렬 탐색 -> 화면별 패키징 저장)
        # ----------------------------------------------------------------------
        print(f"[3/3] 각 버튼별 화면 순차 아카이빙 시작...")
        
        for idx, act in enumerate(actions, start=1):
            btn_name = act["name"]
            btn_href = act.get("href", "")
            selector = act.get("selector", "")
            current_screen_context = btn_name

            print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"  ▶ [{idx}/{len(actions)}] '{btn_name}' 화면 수집 시작")
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

            try:
                # 1) 명확한 링크가 있는 경우 -> 직접 이동 후 캡처 -> 복귀
                if btn_href and not btn_href.startswith("javascript") and not btn_href.startswith("#"):
                    target_url = urljoin(TARGET_PAGE_URL, btn_href)
                    print(f"    -> [페이지 이동] {target_url}")
                    page.goto(target_url, wait_until="networkidle", timeout=30000)
                    save_page_package(page, btn_name)
                    
                    # 원래 목록으로 복귀
                    page.goto(TARGET_PAGE_URL, wait_until="networkidle", timeout=30000)
                    human_delay(page, 1000, 1800, "기본 목록 복귀")
                    continue

                # 2) Onclick 또는 버튼 클릭 트리거
                # 추가기능 드롭다운 메뉴 안의 버튼이면 먼저 추가기능 버튼을 클릭
                if "02_" in btn_name or "03_" in btn_name or "04_" in btn_name or "05_" in btn_name:
                    drop_btn = page.query_selector("#main_control_box_btn02, a:has-text('추가기능')")
                    if drop_btn and drop_btn.is_visible():
                        drop_btn.click()
                        human_delay(page, 500, 800)

                # 텍스트 또는 selector 매칭
                btn_text = act.get("text", "")
                btn_tag = act.get("tag", "button")
                target_el = None
                
                candidates = page.query_selector_all(f"#contents_box {btn_tag}, #contents_box input, #contents_box a, #contents_box button")
                for c in candidates:
                    try:
                        c_val = (c.inner_text() or c.get_attribute("value") or c.get_attribute("title") or "").strip()
                        if btn_text and btn_text in c_val:
                            if c.is_visible():
                                target_el = c
                                break
                    except Exception: continue

                if not target_el:
                    print(f"    [-] 화면에서 요소를 찾지 못함 (스킵)")
                    continue

                prev_url = page.url
                
                # 마우스 호버 및 클릭
                box = target_el.bounding_box()
                if box:
                    page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
                    human_delay(page, 300, 600)

                target_el.click(timeout=3000)
                human_delay(page, 1500, 2500, "클릭 후 화면 변화 대기")

                # 결과 화면 저장
                save_page_package(page, btn_name)

                # URL 변경 시 복귀
                if page.url != TARGET_PAGE_URL:
                    page.goto(TARGET_PAGE_URL, wait_until="networkidle", timeout=30000)
                    human_delay(page, 1000, 1800, "기본 목록 복귀")

            except Exception as loop_err:
                print(f"    [!] '{btn_name}' 처리 중 예외 발생 (복구 후 계속): {loop_err}")
                try:
                    page.goto(TARGET_PAGE_URL, wait_until="domcontentloaded", timeout=15000)
                except Exception: pass

        # ----------------------------------------------------------------------
        # 4. 브라우저 정상 종료 (HAR 파일 flush)
        # ----------------------------------------------------------------------
        print("\n[*] 브라우저 및 네트워크 컨텍스트를 정상 종료합니다...")
        try:
            if not context.is_closed(): context.close()
            if browser.is_connected(): browser.close()
            print("  [OK] 브라우저 종료 완료.")
        except Exception: pass

    # ----------------------------------------------------------------------
    # 5. 개발자도구 HAR 파싱 및 에셋 자동 정리
    # ----------------------------------------------------------------------
    process_har_and_extract_assets(har_path)

    print("\n" + "=" * 80)
    print("  🎉 [강좌관리 클론코딩 종합 패키징 완료 보고서]")
    print(f"  - 📁 페이지별 독립 패키지 폴더: {PAGES_DIR}")
    print(f"       ㄴ 각 페이지별 스크린샷 (.png), 원본 HTML (.html), UI명세 (.json), 네트워크로그 (.json)")
    print(f"  - 📁 전역 에셋(CSS, JS, Fonts, Images): {GLOBAL_ASSETS_DIR}")
    print(f"  - 📄 전체 네트워크 개발자도구 HAR 파일: {har_path}")
    print("=" * 80)

def save_manual_login_session():
    print("=" * 80)
    print("  [하이브리드 로그인 모드] 'auth.json' 세션이 없습니다.")
    print("  브라우저를 실행합니다. 60초 이내에 화면에서 직접 로그인과 캡차를 완료해 주세요.")
    print("=" * 80)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=["--disable-blink-features=AutomationControlled", "--no-sandbox"])
        context = browser.new_context(viewport={"width": 1920, "height": 1080}, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()
        apply_stealth_to_page(page)

        page.goto(LOGIN_URL)

        for remaining in range(60, 0, -5):
            print(f"  -> [수동 로그인 대기] 남은 시간: {remaining}초...")
            time.sleep(5)

        context.storage_state(path=AUTH_FILE)
        print(f"  [OK] 인증 정보가 '{AUTH_FILE}' 파일에 저장되었습니다.\n")
        context.close()
        browser.close()

def main():
    if not os.path.exists(AUTH_FILE):
        save_manual_login_session()
    else:
        run_lecture_focused_collector()

if __name__ == "__main__":
    main()