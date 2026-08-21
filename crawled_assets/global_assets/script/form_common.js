function validate_required(obj, type) {
	if(typeof obj == 'object') {
		var obj_type = $(obj).attr('type');

		if(obj_type == 'checkbox' || obj_type == 'radio') {
			var obj_name = $(obj).attr('name');
			if($("input[name='" + obj_name + "']:checked").length < 1) {
				return false
			}
		} else {
			val = $.trim(obj.value);
			if (val == null || val == "") { return false }
		}
	}
	return true;
}

function chkMoney(obj)
{
	var num1 = filterNum(obj.value);
	var tmpNum = parseInt(num1, 10);
	if(!tmpNum) { tmpNum = 0; }
	obj.value = commaSplit(tmpNum);
}

// 0인 경우 0 제거
function chkMoneyFocus(obj) {
	if (obj.value == 0) {
		obj.value = '';
	}
}

function checkRoundMoney(obj) {
	var tmpStr = obj.value;
	if(tmpStr == null) { tmpStr = ''; }
	var num = '';
	var tmpChar = ''
	var i = 0;
	var totLen = 0;

	totLen = tmpStr.length;
	for(i = 0 ; i < totLen; i++)
	{
		tmpChar = tmpStr.charAt(i);
		if(isNaN(tmpChar) == true) {}
		else { 
			//console.log(num.length + ',' + tmpChar + ',' + num);
			if (num.length > 0) { // 두번째 자리부터는 0으로 채움(12 -> 10, 123 -> 100)
				tmpChar = 0;
			}
			num = num + tmpChar; 
		}
	}

	var tmpNum = parseInt(num, 10);
	if(!tmpNum) { tmpNum = 0; }
	obj.value = commaSplit(tmpNum);
}

function filterNum(tmpStr) 
{ 
	if(tmpStr == null) { tmpStr = ''; }
	var num = '';
	var tmpChar = ''
	var i = 0;
	var totLen = 0;

	totLen = tmpStr.length;
	for(i = 0 ; i < totLen; i++)
	{
		tmpChar = tmpStr.charAt(i);
		//alert(isNaN(tmpChar))
		if(isNaN(tmpChar) == true) {}
		else { num = num + tmpChar; }
	}
	
	return num;
} 

function commaSplit(srcNumber) 
{ 
	var txtNumber = '' + srcNumber; 
	
	var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])'); 
	var arrNumber = txtNumber.split('.'); 
	arrNumber[0] += '.'; 
	
	do
	{
		arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2'); 
	} while (rxSplit.test(arrNumber[0])); 
	
	if (arrNumber.length > 1) { return arrNumber.join(''); } 
	else { return arrNumber[0].split('.')[0]; } 	   
} 

function isValidDate(date) {
	// 1900 ~2099
	var reDate = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
	return reDate.test(date);
}

// { datepicker
$(function() {
	$( "input.form-date" ).datepicker({
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNames: ['일','월','화','수','목','금','토'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토']
	});
});
// }

function chkMaxStrLength(obj_id, max, target_id) {
	var $obj = $('#' + obj_id);
	var $target = $('#' + target_id);
	var cont = $obj.val();
	var cont_length = cont.length;
	if(cont_length > max) {
		alert(max + '자 이내로 작성해 주세요.');

		$obj.val(cont.substring(0, max));
		cont_length = max;
	}
	//$target.text(cont.replace(/\s/g,"").length);
	$target.text(cont_length);
}

/* 첨부파일 확장자 제한 확인 */
function chkFileExt(obj_id, allow_ext) {
	var file_name = $('#' + obj_id).get(0).files[0].name;
	var file_ext = file_name.slice(file_name.lastIndexOf('.') + 1).toLowerCase();
	var allow_ext_list = allow_ext.split(',').map(ext => ext.trim()); // 허용 확장자 배열 생성

	if (allow_ext_list.indexOf(file_ext) === -1) {
		return false;
	}

	return true;
}

/* 첨부파일 용량 제한 확인 */
function chkMaxFileSize(obj_id, max) {
	//용량체크
	var fileSize = $('#' + obj_id).get(0).files[0].size;
	var maxSize = max * 1024 * 1024;
	//alert(fileSize + ', ' + maxSize);
	
	if(fileSize > maxSize){
		return false;
	}

	return true;
}

/* form에 있는 모든 file 합산 */
function chkMaxFilesSize(form_id, max) {
	//용량체크
	var filesSize = 0;
	$('#' + form_id + ' input[type=file]').each(function(j) {
		if (this.files[0] != undefined) {
			filesSize += this.files[0].size;			
		}
	});

	var maxSize = max * 1024 * 1024;
	
	if(filesSize > maxSize){
		return false;
	}

	return true;
}