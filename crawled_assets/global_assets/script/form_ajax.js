// { ajax form
// 줄바꿈 : \r\n
function fm_ajax(fm, cfg){
	if(typeof cfg != 'object') { cfg = {}; }

	if(typeof cfg['async'] == 'boolean') { cfg_async = cfg['async']; }
	else { cfg_async = true; }

	if(typeof cfg['ajax_type'] == 'string' && cfg['ajax_type'] == 'GET') { cfg_ajax_type = cfg['ajax_type']; }
	else { cfg_ajax_type = 'POST'; }

	if(typeof cfg['headers'] != 'object') { cfg_headers = {}; }
	else { cfg_headers = cfg['headers']; }

	$.ajax({
		headers: cfg_headers,
		type: cfg_ajax_type,
		timeout: 60000,
		url: fm.action,
		data: $(fm).serialize(),
		dataType: 'json',
		async: cfg_async,
		cache: false,
		beforeSend: function() {
			fm_ajax_before(fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['before'] == 'function') {
				cfg['callback']['before'](fm.id, cfg);
			}
		},
		success: function(json_data, textStatus) {
			fm_ajax_success(json_data, fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['success'] == 'function') {
				cfg['callback']['success'](json_data, fm.id, cfg);
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			fm_ajax_error(xhr, textStatus, errorThrown, fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['error'] == 'function') {
				cfg['callback']['error'](xhr, textStatus, errorThrown, fm.id, cfg);
			}
		},
		complete: function () {
			fm_ajax_always(fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['always'] == 'function') {
				cfg['callback']['always'](fm.id, cfg);
			}
		}
	});
}

// { ajaxForm
// http://jquery.malsup.com/form/
// 줄바꿈 : \n
function fm_ajaxForm(fm, cfg){
	if(!window.FormData) { $form.submit(); } // 익스9 이하이면 ajax 사용 안함

	if(typeof cfg != 'object') { cfg = {}; }

    var options = {
        timeout: 60000, // 60 sec
		type: 'POST',
		dataType: 'json',		
        beforeSerialize:  function($form, options) {
			fm_ajaxForm_beforeSerialize($form, options);
		}, 
        beforeSubmit:  function(formData, $form, options) {
			fm_ajax_before(fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['before'] == 'function') {
				cfg['callback']['before'](fm.id, cfg);
			}
		}, 
        success: function(json_data, textStatus, xhr, $form) {
			fm_ajax_success(json_data, fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['success'] == 'function') {
				cfg['callback']['success'](json_data, fm.id, cfg);
			}
		},
		error: function(xhr, textStatus, errorThrown, $form) {
			fm_ajax_error(xhr, textStatus, errorThrown, fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['error'] == 'function') {
				cfg['callback']['error'](xhr, textStatus, errorThrown, fm.id, cfg);
			}
		},
		complete: function (xhr, status, $form) {
			fm_ajax_always(fm.id, cfg);
			if(typeof cfg['callback'] == 'object' && typeof cfg['callback']['always'] == 'function') {
				cfg['callback']['always'](fm.id, cfg);
			}
		}
        // other available options: 
        //url:       url         // override for form's 'action' attribute 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 
         // $.ajax options can be used here too, for example: 
        //timeout:   3000 
    }; 
 
	$(fm).ajaxSubmit(options); 
}

function fm_ajaxForm_beforeSerialize ($form, options) { 
    // return false to cancel submit                  
}
/*
function fm_ajaxForm_before(formData, $form, options) { 
	fm_ajax_before($($form).attr('id'));
} 
 
// post-submit callback 
function fm_ajaxForm_success(responseText, statusText, xhr, $form)  { 
	fm_ajax_success(responseText, $($form).attr('id'));
} 

function fm_ajaxForm_error(xhr, status, error, $form) {
	fm_ajax_error(xhr, status, error);
}

function fm_ajaxForm_always(xhr, status, $form) {
	fm_ajax_always($($form).attr('id'));
}
*/
// } ajaxForm

function fm_ajax_before(fm_id, cfg) {
	$obj = $('#' + fm_id);
	$obj.find('input[type=submit]').button('loading');
}

function fm_ajax_always(fm_id, cfg) {
	$obj = $('#' + fm_id);
	$obj.find('input[type=submit]').button('reset');
}

function fm_ajax_error(xhr, textStatus, errorThrown, cfg) {
	fm_ajax_error_msg(xhr, textStatus, errorThrown);
}
function fm_ajax_error_msg(xhr, textStatus, errorThrown, cfg) {
	//alert("[ 오류 ]\n" + xhr.status + "\n" + textStatus + "\n" + errorThrown);
	if(xhr.status == 403 && xhr.getResponseHeader('Xm-Msg-Code') == 'error_csrf'){ // csrf 에러
		alert('요청한 작업은 허용되지 않습니다(CSRF 인증 오류).\n브라우저를 새로 고침 후 이용 바랍니다.');
	} else if(xhr.status == 404){
		alert('페이지를 찾을수없습니다.');
	} else if(xhr.status == 500){
		alert('서버 에러입니다.\n잠시 후 다시 한번 시도 바랍니다.');
	} else if(textStatus == 'parsererror'){
		alert('응답 데이터 처리중 오류가 발생하였습니다.');
	} else if(textStatus == 'timeout'){
		alert('요청 제한 시간을 초과하였습니다.\n잠시 후 다시 한번 시도 바랍니다.');
	} else if(xhr.status == 0){
		alert('접속이 불가능 합니다.\n다시 한번 시도 바랍니다.');
	} else {
		alert('알수없는 에러가 발생하였습니다.\n' + errorThrown + '(' + xhr.status + ')');
		//alert('알수없는 에러가 발생하였습니다.\n\n' + xhr.responseText);
	}
}

function fm_ajax_success(json_data, fm_id, cfg) {
	if((typeof cfg == 'object') && cfg['msg_style'] == 'string') { msg_style = cfg['msg_style']; }
	else { msg_style = 'modal'; }

	if(msg_style == 'modal') { 
		msg_fn = (function(msg) { show_modal(msg); });
	} else if(msg_style == 'alert') { 
		msg_fn = (function(msg) { alert(msg); });
	} 

	// 폼 에러 초기화
	$obj = $('#' + fm_id);
	$obj.find('div.error_msg').each(function(e) {
		$(this).html('');
	});

	// return 값 처리
	var cnt = json_data.length;	
	var msg = '';
	$.each(json_data, function(key, val){
		if(key == 'errors') {
			if(val['type'] == 'login') {
				//alert('로그인 창 띄워 주세요.');
				$('#login_Modal').modal();
			} else if(val['type'] == 'auth2') {
				$('#auth2_Modal').modal();

				// 값 초기화
				$('#auth2_Modal input[name="otp_num"]').val('');
				$('#auth2_Modal .error_otp_num').empty();
				$('#auth2_Modal .error_modal_message').empty();
			} else {
				if(val['message']) {
					//msg_fn(val['message']);
					msg = val['message'];
				}
			}
		} else if(key == 'form_error') {
			var first_id = '';
			$.each(val, function(key1, val1){
				// 이름이 배열로 되어 있는경우 [] 삭제, 배열 기호 제외한 이름으로 class명 지정 필요
				re = /\[\]/g;
				key1 = key1.replace(re, '');	

				if(obj = $('#' + fm_id + ' div.error_' + key1).get(0)) { // class로 지정되어 있으면
					$(obj).html(val1);
				} else {
					$('#' + key1).siblings('div.error_msg').html(val1);
				}
				if(!first_id) { first_id = key1; }
					//alert(key1 + ':' + val1);
			});
			
			if(first_id) {
				$('#' + first_id).focus();
			}
		} else if(key == 'message' && val) {
			//msg_fn(val);
			msg = val;
		} else if(key == 'loginOk' && val == true) {
			// 모달 로그인 완료
			document.getElementById(fm_id).login_id.value = '';
			document.getElementById(fm_id).login_passwd.value = '';

			msg_fn('로그인 되었습니다.');
			$('#login_Modal').modal('hide');
		} else if(key == 'auth2Ok' && val == true) {
			// 모달 2단계 인증 완료
			$('#auth2_Modal input[name="otp_num"]').val('');
			msg_fn('2단계 인증이 완료되었습니다.');
			$('#auth2_Modal').modal('hide');
		} else if(key == 'redirect' && val) {			
			if (val.search('dbdbschoolapp') === 0) {
				// 앱으로 이동
				window.location = val;
				
				// iphone 에서 한번에 안가는 증상 때문에  ㅠ,.ㅠ
				// iphone5 에서는 더 안됨, 될 떄 까지 반복
				var call_cnt = 0;
				var call_app_Int = setInterval(callApp, 200);

				function callApp() {
					if (call_cnt > 10) {
						clearInterval(call_app_Int);
						self.close(); // 앱 내부인 경우에는 close 안됨
					} else {
						window.location = val + '&call_cnt=' + call_cnt;
						call_cnt++;
					}
				}
			} else {
				document.location.href = val;
			}
		} else {
			//alert(val);
		}
	});

	if(msg) {
		msg_fn(msg);
	}
}
// } ajax form