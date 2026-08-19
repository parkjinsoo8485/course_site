const fs = require('fs');

const path = '../course_site/af/ad_app/com/sn/3267/index.html';
let html = fs.readFileSync(path, 'utf8');

const startTag = '<main id="contents_box">';
const endTag = '</main>';

const startIdx = html.indexOf(startTag);
const endIdx = html.indexOf(endTag);

const newContent = `
    <main id="contents_box">
      <!-- Title Area -->
      <div id="contents_title">
        <i class="fa fa-file-text-o"></i> 신청자관리 <br>
        <span class="title">광주풍향초등학교 늘봄학교</span>
      </div>

			<div class="panel_main panel-default_main" style="border: 1px solid #dcdcdc; border-radius: 3px; margin-bottom: 15px; background: #fff;">
	<div class="panel-heading" style="background: #fcfcfc; border-bottom: 1px solid #dcdcdc; padding: 10px 15px; font-size: 13.5px; font-weight: normal; color: #555;">추가/취소자조회</div>
	<div class="panel-body" style="padding: 15px;">
		<p style="margin-bottom:10px;"><i class="fa fa-check-square" style="color:#337ab7; font-size:13px;" title="필수항목"></i><span style="font-size:12px; margin-left:4px;">표시가 있는 항목은 반드시 입력해야 합니다.</span></p>	
<form action="javascript:alert('엑셀 출력 (기능 보류)');" name="fm_excel" id="fm_excel" method="post" onsubmit="return fm_excel_check(this);" accept-charset="utf-8">
		
		<table class="table list table-form" style="margin:0px; width:100%; border-top:1px solid #dcdcdc; border-bottom:1px solid #dcdcdc;">
		<tbody><tr style="border-bottom:1px solid #eee;">
			<th style="width:140px; background-color:#f9f9f9; text-align:left; padding:10px 15px; font-weight:normal; color:#555;">검색 조건 <i class="fa fa-check-square" style="color:#337ab7; font-size:12px;"></i></th>		
			<td style="text-align:left; padding:10px 15px; border-left:1px solid #eee;">
				<span class="mobile_clear">			
					<span style="line-height:1.6;">
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="com_gubun" id="com_gubun_2" value="2" checked="checked" onclick="document.getElementById('tr_sld2').style.display='none';"> 수강생의 추가일자 &amp; 최종수강일(환불/취소) 기준</label><br>
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="com_gubun" id="com_gubun_1" value="1" onclick="document.getElementById('tr_sld2').style.display='table-row';"> 현재/이전 강좌 비교</label>				
					</span>			
				</span>			
			</td>
		</tr>			
		<tr style="border-bottom:1px solid #eee;">
			<th style="background-color:#f9f9f9; text-align:left; padding:10px 15px; font-weight:normal; color:#555;">현재 강좌 <i class="fa fa-check-square" style="color:#337ab7; font-size:12px;"></i></th>
			<td style="text-align:left; padding:10px 15px; border-left:1px solid #eee;">
				<div style="display:flex; gap:5px;">
					<select name="sld" id="sld" class="form-control" style="width:120px; font-size:12px; height:28px;">
						<option value="">=강좌구분=</option>
						<option value="5">3월</option>
						<option value="6">26년 4월</option>
						<option value="7">26년 5월</option>
						<option value="8">26년 6월</option>
						<option value="9">26년 7월</option>
						<option value="10" selected="selected">26년 8월</option>
						<option value="11">26년 9월</option>
					</select>	
					<select id="sln" name="sln" class="form-control" style="width:300px; font-size:12px; height:28px;">
						<option value="">-강좌전체-</option>
						<option value="1552375"> [26년 8월] (금) 돌봄 4부(돌봄전담사,19명)</option>
					</select>
				</div>
			</td>
		</tr>
		<tr id="tr_sld2" style="display:none; border-bottom:1px solid #eee;">
			<th style="background-color:#f9f9f9; text-align:left; padding:10px 15px; font-weight:normal; color:#555;">이전 강좌 <i class="fa fa-check-square" style="color:#337ab7; font-size:12px;"></i></th>
			<td style="text-align:left; padding:10px 15px; border-left:1px solid #eee;">
				<div style="display:flex; gap:5px;">
					<select name="sld2" id="sld2" class="form-control" style="width:120px; font-size:12px; height:28px;">
						<option value="">=강좌구분=</option>
						<option value="5">3월</option>
						<option value="6">26년 4월</option>
						<option value="7">26년 5월</option>
						<option value="8">26년 6월</option>
						<option value="9">26년 7월</option>
						<option value="10">26년 8월</option>
						<option value="11">26년 9월</option>
					</select>							
					<select id="sln2" name="sln2" class="form-control" style="width:300px; font-size:12px; height:28px;">
						<option value="">-강좌전체-</option>
					</select>				
				</div>
			</td>
		</tr>		
		<tr style="border-bottom:1px solid #eee;">
			<th style="background-color:#f9f9f9; text-align:left; padding:10px 15px; font-weight:normal; color:#555;">출력 구분 <i class="fa fa-check-square" style="color:#337ab7; font-size:12px;"></i></th>		
			<td style="text-align:left; padding:10px 15px; border-left:1px solid #eee;">
				<span class="mobile_clear">			
					<span style="line-height:1.6;">
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="excel_gubun" id="excel_gubun_1" value="1" checked="checked"> 신청 취소자</label><br>				
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="excel_gubun" id="excel_gubun_2" value="2"> 신청 추가자</label>
					</span>			
				</span>			
			</td>
		</tr>						
		<tr>
			<th style="background-color:#f9f9f9; text-align:left; padding:10px 15px; font-weight:normal; color:#555;">출력 파일 <i class="fa fa-check-square" style="color:#337ab7; font-size:12px;"></i></th>		
			<td style="text-align:left; padding:10px 15px; border-left:1px solid #eee;">
				<span class="mobile_clear">			
					<span style="line-height:1.6;">
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="file_type" id="file_type_one" value="one" checked="checked"> 강좌별로 파일 출력</label><br>				
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="file_type" id="file_type_all" value="all"> 한 개의 파일에 모두 출력</label><br>
						<label style="cursor:pointer; font-weight:normal;"><input type="radio" name="file_type" id="file_type_tea" value="tea"> 강사별로 파일 출력</label>
					</span>			
				</span>			
			</td>
		</tr>			
		</tbody></table>
		
		<div style="text-align:center; margin-top:20px;">
			<button type="button" onclick="location.href='/af/ad_app/lists/sn/3267'" class="btn" style="background:#f4f4f4; border:1px solid #ccc; color:#333; padding:5px 15px;">취소</button>		
			<button type="submit" class="btn" style="background:#5cb85c; border:1px solid #4cae4c; color:#fff; padding:5px 15px;"><i class="fa fa-file-excel-o"></i> 엑셀 출력</button>
		</div>		
</form>			
	</div>	
</div>

<div style="background:#fff; border:1px solid #eee; border-left:3px solid #d9534f; padding:15px; margin-top:15px; font-size:12px; color:#555; line-height:1.6;">
	<div style="font-weight:bold; color:#d9534f; margin-bottom:5px;">&lt; 현재/이전 강좌 비교 &gt;</div>
	<ul style="list-style:none; padding-left:15px; margin-bottom:15px;">
		<li style="position:relative; margin-bottom:2px;"><span style="position:absolute; left:-10px; color:#d9534f; font-weight:bold;">•</span> 강좌를 '강좌전체'로 선택한 경우 강좌명이 같은 이전, 현재 강좌를 비교하여 취소자와 추가자를 출력합니다.</li>
		<li style="position:relative; margin-bottom:2px;"><span style="position:absolute; left:-10px; color:#d9534f; font-weight:bold;">•</span> 신청 추가자 : 이전 강좌에는 신청하지 않고, 현재 강좌에는 신청한 학생입니다.</li>
		<li style="position:relative; margin-bottom:2px;"><span style="position:absolute; left:-10px; color:#d9534f; font-weight:bold;">•</span> 신청 취소자 : 이전 강좌에는 신청되어 있고, 현재 강좌에는 신청하지 않은 학생입니다.</li>
	</ul>

	<div style="font-weight:bold; color:#d9534f; margin-bottom:5px;">&lt; 수강생의 추가일자 &amp; 최종수강일(환불/취소) 기준 &gt;</div>
	<ul style="list-style:none; padding-left:15px; margin-bottom:0;">
		<li style="position:relative; margin-bottom:2px;"><span style="position:absolute; left:-10px; color:#d9534f; font-weight:bold;">•</span> 신청 추가자 : 추가일자가 등록되어있는 학생입니다.</li>
		<li style="position:relative; margin-bottom:2px;"><span style="position:absolute; left:-10px; color:#d9534f; font-weight:bold;">•</span> 신청 취소자 : 환불/취소 내역에 최종수강일이 등록되어있는 학생입니다.</li>
	</ul>
</div>
`;

if (startIdx > -1 && endIdx > -1) {
  html = html.substring(0, startIdx) + newContent + '\n    ' + html.substring(endIdx);
  fs.writeFileSync(path, html);
  console.log('Fixed contents_box');
} else {
  console.log('Could not find start or end tags');
}
