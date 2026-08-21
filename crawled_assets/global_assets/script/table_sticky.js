// { 메인 테이블 th 고정 --------------
let responsiveContainer = null; 

// 상단 타이틀 고정값
let rcTitleBox = null; 
let rcTopOffset = null; 

// th가 2개 이상인 경우 고려
let rcHeaderRows = null; 

//let stickyCnt = 0;
function adjustTableSticky() {
	//stickyCnt++;
	
	// 위치 계산
	const rect = responsiveContainer.getBoundingClientRect();
	let baseOffset = rect.top < rcTopOffset ? (rcTopOffset - rect.top) : 0;
    let cumulativeHeight = 0;
	
	// th가 2개 이상인 경우 고려
	rcHeaderRows.forEach((tr) => {
		//const rowTopValue = (baseOffset + cumulativeHeight) + 'px';
		const rowTopValue = Math.ceil(baseOffset + cumulativeHeight) + 'px';
		tr.style.setProperty('--sticky-row-top', rowTopValue);

		if (baseOffset != 0) {
			tr.classList.add('is-stuck');
		} else {
			tr.classList.remove('is-stuck');
		}

		cumulativeHeight += tr.offsetHeight;

		// 확인용 로그
		//console.log(`${stickyCnt}) : ${rowTopValue}`);
	});
}	

let isTick = false;
const adjustTableStickyTrigger = () => {
	if (!isTick) {
		window.requestAnimationFrame(() => {
			adjustTableSticky();
			isTick = false;
		});
		isTick = true;
	}
};	

// 이벤트에 연결
$(document).ready(function(){	
	responsiveContainer = document.getElementById('main_table_responsive_container');
	if (responsiveContainer) {
		rcHeaderRows = responsiveContainer.querySelectorAll('.table-responsive-container table thead tr');

		// 상단 타이틀 고정값
		rcTitleBox = document.getElementById('header');
		rcTopOffset = rcTitleBox ? (rcTitleBox.offsetHeight - 1): 0;

		// th가 2개 이상인 경우 고려
		adjustTableSticky();

		window.addEventListener('scroll', adjustTableStickyTrigger, { passive: true });
		window.addEventListener('resize', adjustTableStickyTrigger);

		// (선택사항) 이미지가 많은 페이지라면 모든 리소스 로드 후 한 번 더 실행
		//window.addEventListener('load', adjustTableSticky);
	}
});
// } --------------