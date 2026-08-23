/*
	http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/
	if( isMobile.any() ) alert('Mobile');
	if( isMobile.iOS() ) alert('iOS');
*/
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    Mac: function() {
        return navigator.userAgent.match(/Macintosh/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || isMobile.Mac());
    }
};

/*
	2016-02-04
	ie7 ~ 11, edge
*/
function getBrowserType(){
	  
	var _ua = navigator.userAgent;
	var rv = -1;
	 
	//IE 11,10,9,8
	var trident = _ua.match(/Trident\/(\d.\d)/i);
	if( trident != null )
	{
		if( trident[1] == "7.0" ) return rv = "IE" + 11;
		if( trident[1] == "6.0" ) return rv = "IE" + 10;
		if( trident[1] == "5.0" ) return rv = "IE" + 9;
		if( trident[1] == "4.0" ) return rv = "IE" + 8;
	}
	 
	//IE 7...
	if( navigator.appName == 'Microsoft Internet Explorer' ) return rv = "IE" + 7;
	 
	/*
	var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if(re.exec(_ua) != null) rv = parseFloat(RegExp.$1);
	if( rv == 7 ) return rv = "IE" + 7; 
	*/
	 
	//other
	var agt = _ua.toLowerCase();

	if (agt.indexOf("edge") != -1) return 'Edge';
	if (agt.indexOf("chrome") != -1) return 'Chrome';
	if (agt.indexOf("opera") != -1) return 'Opera'; 
	if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
	if (agt.indexOf("webtv") != -1) return 'WebTV'; 
	if (agt.indexOf("beonex") != -1) return 'Beonex'; 
	if (agt.indexOf("chimera") != -1) return 'Chimera'; 
	if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
	if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
	if (agt.indexOf("firefox") != -1) return 'Firefox'; 
	if (agt.indexOf("safari") != -1) return 'Safari'; 
	if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
	if (agt.indexOf("netscape") != -1) return 'Netscape'; 
	if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
}
	 
function setCookie(name, value, expiredays)
{
	if(expiredays != 0)
	{
		var today = new Date();
		today.setDate( today.getDate() + expiredays );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";";
	}
	else
	{
		document.cookie = name + "=" + escape( value ) + "; path=/;";
	}
}

function getCookie(name)
{
	var nameOfCookie=name+"=";
	var x=0;
	while(x<=document.cookie.length)
	{
	   var y=(x+nameOfCookie.length);
	   if(document.cookie.substring(x,y)==nameOfCookie)
	   {
		  if((endOfCookie=document.cookie.indexOf(";",y))==-1)
			 endOfCookie=document.cookie.length;
		  return unescape(document.cookie.substring(y,endOfCookie));
	   }
	   x=document.cookie.indexOf(" ",x) +1;
	   if(x==0)
		  break;
	}
	return "";
}

function areCookiesEnabled() {
    try {
      document.cookie = 'cookietest=1';
      var cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
      document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return cookiesEnabled;
    } catch (e) {
      return false;
    }
}

/*메뉴얼버튼 모바일 클릭이벤트*/
$(document).ready(function(){	
	function manual_react() {
		var mn_rw = $("body").width();
		if (mn_rw >= 1025) { 		
		/* PC 스크립트*/ 
			$('.new_help_manualbox ul').removeClass('mn_none');
		}
		else { 
		/* mob 스크립트 */
			$('.new_help_manualbox .hm_title').on('click',function(){
				$(this).siblings('ul').toggleClass('mn_none');
			});	
		}
	}

	manual_react();	
	$(window).on('resize',function(){ 
		manual_react();
	}); 
});
