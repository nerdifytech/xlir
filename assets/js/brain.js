var $ = jQuery.noConflict();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Messenger = function () {
  function Messenger() {
    _classCallCheck(this, Messenger);

    this.messageList = [];
    this.deletedList = [];
	this.isOpen = false;

    this.me = 1; // completely arbitrary id
    this.them = 5; // and another one

    this.onRecieve = function (message) {
      return console.log('Recieved: ' + message.text);
    };
    this.onSend = function (message) {
      return console.log('Sent: ' + message.text);
    };
    this.onDelete = function (message) {
      return console.log('Deleted: ' + message.text);
    };
  }

  Messenger.prototype.send = function send() {
    var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    text = this.filter(text);

    if (this.validate(text)) {
      var message = {
        user: this.me,
        text: text,
        time: new Date().getTime()
      };

      this.messageList.push(message);

      this.onSend(message);
    }
  };

  Messenger.prototype.recieve = function recieve() {
    var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    text = this.filter(text);

    if (this.validate(text)) {
      var message = {
        user: this.them,
        text: text,
        time: new Date().getTime()
      };

      this.messageList.push(message);

      this.onRecieve(message);
    }
  };

  Messenger.prototype.delete = function _delete(index) {
    index = index || this.messageLength - 1;

    var deleted = this.messageLength.pop();

    this.deletedList.push(deleted);
    this.onDelete(deleted);
  };

  Messenger.prototype.filter = function filter(input) {
    var output = input.replace('bad input', 'good output'); // such amazing filter there right?
    return output;
  };

  Messenger.prototype.validate = function validate(input) {
    return !!input.length; // an amazing example of validation I swear.
  };

  return Messenger;
}();

var BuildHTML = function () {
  function BuildHTML() {
    _classCallCheck(this, BuildHTML);

    this.messageWrapper = 'message-wrapper';
    this.boldTextClass = 'bold-text';
    this.circleWrapper = 'circle-wrapper';
    this.textWrapper = 'text-wrapper';

    this.meClass = 'me';
    this.themClass = 'them';
  }

  BuildHTML.prototype._build = function _build(text, who) {
    const textStyle = who === 'me' ? '' : `class="${this.boldTextClass}"`;
    var imageSource = 'https://github.com/nerdifytech/xlir.github.io/blob/main/images/profile.png?raw=true'; // Replace with the actual image source
    return '<div class="' + this.messageWrapper + ' ' + this[who + 'Class'] + '">\n' +
           '  <img src="' + imageSource + '" class="' + this.circleWrapper + ' animated bounceIn">\n' +
           '  <div class="' + this.textWrapper + '">...</div>\n' +
           '</div>';
  };

  BuildHTML.prototype.me = function me(text) {
    return this._build(text, 'me');
  };

  BuildHTML.prototype.them = function them(text) {
    return this._build(text, 'them');
  };

  return BuildHTML;
}();


var divs = 
'<div id="aco-wrapper" class="aco-wrapper">' +
'<nav id="aco-nav" class="aco-nav">' +
'	<div class="default-nav">' +
'      <div class="main-nav">' +
'        <div id="default-msg">Click Me to Chat</div>' +
'        <div id="options" class="options"></div>' +
'      </div>' +
'    </div>' +
'  </nav>' +
'  <div id="aco-inner" class="aco-inner">' +
'    <div id="aco-content" class="aco-content"></div>' +
'  </div>' +
'  <div id="aco-bottom" class="aco-bottom">' +
'    <textarea id="aco-input" class="aco-input" style="color: black; font-weight: bold;"></textarea>' +
'    <div id="aco-send" class="aco-send"></div>' +
'  </div>' +
'</div>';

var path = 'https://brainshop.ai/web/';
var path2 = 'http://raw.githubusercontent.com/BurntBubblegmEater/Brainshop/main/'
var csses = 
"<link rel='stylesheet' href='" + path + "css/normalize.css'>" +
"<link rel='stylesheet prefetch' href='" + path + "css/animate.min.css'>" +
"<link rel='stylesheet' href='" + path + "css/style.css'>";




$(document).ready(function () {
	$('body').append(divs);
	$('body').append(csses);

    var messenger = new Messenger();
    var buildHTML = new BuildHTML();

    var $input = $('#aco-input');
    var $send = $('#aco-send');
    var $content = $('#aco-content');
    var $inner = $('#aco-inner');
    var $options = $('#options');
    var $bottom = $('#aco-bottom');
    var uid = getAcoUid();
  

    function safeText(text) {
      $content.find('.message-wrapper').last().find('.text-wrapper').html(text);
    }

    function animateText() {
      setTimeout(function () {
        $content.find('.message-wrapper').last().find('.text-wrapper').addClass('animated fadeIn');
      }, 100);
    }

    function scrollBottom() {
  	  //console.log("offset-top:" + $($content).offset().top);
  	  //console.log("outerheight:" + $($content).outerHeight(true));
  	  //var scrollHeight = $($content).offset().top + $($content).outerHeight(true);
  	  var scrollHeight = $($content).outerHeight(true);
  	  //console.log("Height:" + scrollHeight);
  	  $($inner).animate({
  		  scrollTop: scrollHeight
  	  }, {
  		  queue: false,
  		  duration: 'ease'
  	  });
    }

    function buildSent(message) {
      console.log('sending: ', message.text);

      $content.append(buildHTML.me(message.text));
      safeText(message.text);
      animateText();

      scrollBottom();
    }

    function buildRecieved(message) {
      console.log('recieving: ', message.text);

      $content.append(buildHTML.them(message.text));
      safeText(message.text);
      animateText();

      scrollBottom();
    }

    function sendMessage(event) {
      var bid = '175714';
      var key = 'zZAJrwSdQKZACE6A';
      var msg = '';      
  	  var text = $input.val();
      if (event === '' || event === undefined){
        if(!text || !text.trim()) return;
        messenger.send(text);
        $input.val('');
        $input.focus();
        msg = text;
      }
      else {
        msg = event;
      }
      
  	  var burl = 'http://api.brainshop.ai/get?bid=' + bid + '&key=' + key + '&f=json&jsoncallback=callback';
	 
  	  $.ajax({
  		  url: burl + '&uid=' + uid + '&msg=' + encodeURIComponent(msg),
   	      dataType: 'jsonp',
   	  	  jsonpCallback: 'callback',
   	      success: function(resp){
  			  setTimeout(function () {
  			    messenger.recieve(resp);
  			  }, 1000);		  
   	 	 }
   	  });
    }

    messenger.onSend = buildSent;
    messenger.onRecieve = buildRecieved;

    $send.on('click', function (e) {
      sendMessage();
    });

    $input.on('keydown', function (e) {
      var key = e.which || e.keyCode;

      if (key === 13) {
        // enter key
        e.preventDefault();
        sendMessage();
      }
    });
  

  
    $options.on('click', function() {
  	  if(messenger.isOpen) {
  		  console.log('close: ');
  		  $options.css("background-image", "url(http://brainshop.ai/web/img/chat_white.png)");
  		  messenger.isOpen = false;
  		  // $('#aco-inner').show();
  		  // $('#aco-bottom').show();
  		  $('#aco-inner').slideUp();
  		  $('#aco-bottom').slideUp();
  		  $('#aco-wrapper').height(64);
          $content.empty();
          sendMessage('clickDown'); 
  	  } else {
  		  console.log('open: ');
  		   $options.css("background-image", "url(http://brainshop.ai/web/img/ic_arrow_down_white_48dp.png)");
  		  messenger.isOpen = true;
          $('#aco-inner').slideDown();
  		  $('#aco-bottom').slideDown();
  		  //$('#aco-wrapper').height(520);
		 if(window.innerWidth  >= 560) {
		  	$('#aco-wrapper').height(520);
			$('#aco-content').css("margin-bottom", "32px");
		  } else {
		  	$('#aco-wrapper').height(300);
			$('#aco-content').css("margin-bottom", "300px");
		  } 
          $input.focus();
          sendMessage('clickUp ');  		  
  	  }
	  
    });        
});

function getAcoUid() {
	if(Cookies.get('acouid')) {
		console.log('acouid in cookie ');
		return Cookies.get("acouid");
	}
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function")
    {
        d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
    {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
	Cookies.set('acouid', uuid, {expires: 365});
    return uuid;
}


/*!
 * JavaScript Cookie v2.1.2
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
					attributes.path    && '; path=' + attributes.path,
					attributes.domain  && '; domain=' + attributes.domain,
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api(key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));window.Modernizr=function(e,t,n){function r(e){b.cssText=e}function o(e,t){return r(S.join(e+";")+(t||""))}function a(e,t){return typeof e===t}function i(e,t){return!!~(""+e).indexOf(t)}function c(e,t){for(var r in e){var o=e[r];if(!i(o,"-")&&b[o]!==n)return"pfx"==t?o:!0}return!1}function s(e,t,r){for(var o in e){var i=t[e[o]];if(i!==n)return r===!1?e[o]:a(i,"function")?i.bind(r||t):i}return!1}function l(e,t,n){var r=e.charAt(0).toUpperCase()+e.slice(1),o=(e+" "+k.join(r+" ")+r).split(" ");return a(t,"string")||a(t,"undefined")?c(o,t):(o=(e+" "+T.join(r+" ")+r).split(" "),s(o,t,n))}function u(){m.input=function(n){for(var r=0,o=n.length;o>r;r++)M[n[r]]=n[r]in E;return M.list&&(M.list=!!t.createElement("datalist")&&!!e.HTMLDataListElement),M}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),m.inputtypes=function(e){for(var r,o,a,i=0,c=e.length;c>i;i++)E.setAttribute("type",o=e[i]),r="text"!==E.type,r&&(E.value=w,E.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(o)&&E.style.WebkitAppearance!==n?(g.appendChild(E),a=t.defaultView,r=a.getComputedStyle&&"textfield"!==a.getComputedStyle(E,null).WebkitAppearance&&0!==E.offsetHeight,g.removeChild(E)):/^(search|tel)$/.test(o)||(r=/^(url|email)$/.test(o)?E.checkValidity&&E.checkValidity()===!1:E.value!=w)),P[e[i]]=!!r;return P}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var f,d,p="2.8.3",m={},h=!0,g=t.documentElement,v="modernizr",y=t.createElement(v),b=y.style,E=t.createElement("input"),w=":)",x={}.toString,S=" -webkit- -moz- -o- -ms- ".split(" "),C="Webkit Moz O ms",k=C.split(" "),T=C.toLowerCase().split(" "),j={svg:"http://www.w3.org/2000/svg"},N={},P={},M={},A=[],L=A.slice,$=function(e,n,r,o){var a,i,c,s,l=t.createElement("div"),u=t.body,f=u||t.createElement("body");if(parseInt(r,10))for(;r--;)c=t.createElement("div"),c.id=o?o[r]:v+(r+1),l.appendChild(c);return a=["&#173;",'<style id="s',v,'">',e,"</style>"].join(""),l.id=v,(u?l:f).innerHTML+=a,f.appendChild(l),u||(f.style.background="",f.style.overflow="hidden",s=g.style.overflow,g.style.overflow="hidden",g.appendChild(f)),i=n(l,e),u?l.parentNode.removeChild(l):(f.parentNode.removeChild(f),g.style.overflow=s),!!i},z=function(){function e(e,o){o=o||t.createElement(r[e]||"div"),e="on"+e;var i=e in o;return i||(o.setAttribute||(o=t.createElement("div")),o.setAttribute&&o.removeAttribute&&(o.setAttribute(e,""),i=a(o[e],"function"),a(o[e],"undefined")||(o[e]=n),o.removeAttribute(e))),o=null,i}var r={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return e}(),D={}.hasOwnProperty;d=a(D,"undefined")||a(D.call,"undefined")?function(e,t){return t in e&&a(e.constructor.prototype[t],"undefined")}:function(e,t){return D.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=L.call(arguments,1),r=function(){if(this instanceof r){var o=function(){};o.prototype=t.prototype;var a=new o,i=t.apply(a,n.concat(L.call(arguments)));return Object(i)===i?i:a}return t.apply(e,n.concat(L.call(arguments)))};return r}),N.flexbox=function(){return l("flexWrap")},N.canvas=function(){var e=t.createElement("canvas");return!!e.getContext&&!!e.getContext("2d")},N.canvastext=function(){return!!m.canvas&&!!a(t.createElement("canvas").getContext("2d").fillText,"function")},N.webgl=function(){return!!e.WebGLRenderingContext},N.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:$(["@media (",S.join("touch-enabled),("),v,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=9===e.offsetTop}),n},N.geolocation=function(){return"geolocation"in navigator},N.postmessage=function(){return!!e.postMessage},N.websqldatabase=function(){return!!e.openDatabase},N.indexedDB=function(){return!!l("indexedDB",e)},N.hashchange=function(){return z("hashchange",e)&&(t.documentMode===n||t.documentMode>7)},N.history=function(){return!!e.history&&!!history.pushState},N.draganddrop=function(){var e=t.createElement("div");return"draggable"in e||"ondragstart"in e&&"ondrop"in e},N.websockets=function(){return"WebSocket"in e||"MozWebSocket"in e},N.rgba=function(){return r("background-color:rgba(150,255,150,.5)"),i(b.backgroundColor,"rgba")},N.hsla=function(){return r("background-color:hsla(120,40%,100%,.5)"),i(b.backgroundColor,"rgba")||i(b.backgroundColor,"hsla")},N.multiplebgs=function(){return r("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(b.background)},N.backgroundsize=function(){return l("backgroundSize")},N.borderimage=function(){return l("borderImage")},N.borderradius=function(){return l("borderRadius")},N.boxshadow=function(){return l("boxShadow")},N.textshadow=function(){return""===t.createElement("div").style.textShadow},N.opacity=function(){return o("opacity:.55"),/^0.55$/.test(b.opacity)},N.cssanimations=function(){return l("animationName")},N.csscolumns=function(){return l("columnCount")},N.cssgradients=function(){var e="background-image:",t="gradient(linear,left top,right bottom,from(#9f9),to(white));",n="linear-gradient(left top,#9f9, white);";return r((e+"-webkit- ".split(" ").join(t+e)+S.join(n+e)).slice(0,-e.length)),i(b.backgroundImage,"gradient")},N.cssreflections=function(){return l("boxReflect")},N.csstransforms=function(){return!!l("transform")},N.csstransforms3d=function(){var e=!!l("perspective");return e&&"webkitPerspective"in g.style&&$("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t){e=9===t.offsetLeft&&3===t.offsetHeight}),e},N.csstransitions=function(){return l("transition")},N.fontface=function(){var e;return $('@font-face {font-family:"font";src:url("https://")}',function(n,r){var o=t.getElementById("smodernizr"),a=o.sheet||o.styleSheet,i=a?a.cssRules&&a.cssRules[0]?a.cssRules[0].cssText:a.cssText||"":"";e=/src/i.test(i)&&0===i.indexOf(r.split(" ")[0])}),e},N.generatedcontent=function(){var e;return $(["#",v,"{font:0/0 a}#",v,':after{content:"',w,'";visibility:hidden;font:3px/1 a}'].join(""),function(t){e=t.offsetHeight>=3}),e},N.video=function(){var e=t.createElement("video"),n=!1;try{(n=!!e.canPlayType)&&(n=new Boolean(n),n.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),n.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),n.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(r){}return n},N.audio=function(){var e=t.createElement("audio"),n=!1;try{(n=!!e.canPlayType)&&(n=new Boolean(n),n.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),n.mp3=e.canPlayType("audio/mpeg;").replace(/^no$/,""),n.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),n.m4a=(e.canPlayType("audio/x-m4a;")||e.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(r){}return n},N.localstorage=function(){try{return localStorage.setItem(v,v),localStorage.removeItem(v),!0}catch(e){return!1}},N.sessionstorage=function(){try{return sessionStorage.setItem(v,v),sessionStorage.removeItem(v),!0}catch(e){return!1}},N.webworkers=function(){return!!e.Worker},N.applicationcache=function(){return!!e.applicationCache},N.svg=function(){return!!t.createElementNS&&!!t.createElementNS(j.svg,"svg").createSVGRect},N.inlinesvg=function(){var e=t.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==j.svg},N.smil=function(){return!!t.createElementNS&&/SVGAnimate/.test(x.call(t.createElementNS(j.svg,"animate")))},N.svgclippaths=function(){return!!t.createElementNS&&/SVGClipPath/.test(x.call(t.createElementNS(j.svg,"clipPath")))};for(var F in N)d(N,F)&&(f=F.toLowerCase(),m[f]=N[F](),A.push((m[f]?"":"no-")+f));return m.input||u(),m.addTest=function(e,t){if("object"==typeof e)for(var r in e)d(e,r)&&m.addTest(r,e[r]);else{if(e=e.toLowerCase(),m[e]!==n)return m;t="function"==typeof t?t():t,"undefined"!=typeof h&&h&&(g.className+=" "+(t?"":"no-")+e),m[e]=t}return m},r(""),y=E=null,function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=y.elements;return"string"==typeof e?e.split(" "):e}function o(e){var t=v[e[h]];return t||(t={},g++,e[h]=g,v[g]=t),t}function a(e,n,r){if(n||(n=t),u)return n.createElement(e);r||(r=o(n));var a;return a=r.cache[e]?r.cache[e].cloneNode():m.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e),!a.canHaveChildren||p.test(e)||a.tagUrn?a:r.frag.appendChild(a)}function i(e,n){if(e||(e=t),u)return e.createDocumentFragment();n=n||o(e);for(var a=n.frag.cloneNode(),i=0,c=r(),s=c.length;s>i;i++)a.createElement(c[i]);return a}function c(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return y.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,t.frag)}function s(e){e||(e=t);var r=o(e);return y.shivCSS&&!l&&!r.hasCSS&&(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),u||c(e,r),e}var l,u,f="3.7.0",d=e.html5||{},p=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,m=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,h="_html5shiv",g=0,v={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,u=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){l=!0,u=!0}}();var y={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:f,shivCSS:d.shivCSS!==!1,supportsUnknownElements:u,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:s,createElement:a,createDocumentFragment:i};e.html5=y,s(t)}(this,t),m._version=p,m._prefixes=S,m._domPrefixes=T,m._cssomPrefixes=k,m.hasEvent=z,m.testProp=function(e){return c([e])},m.testAllProps=l,m.testStyles=$,m.prefixed=function(e,t,n){return t?l(e,t,n):l(e,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(h?" js "+A.join(" "):""),m}(this,this.document),function(e,t,n){function r(e){return"[object Function]"==g.call(e)}function o(e){return"string"==typeof e}function a(){}function i(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function c(){var e=v.shift();y=1,e?e.t?m(function(){("c"==e.t?d.injectCss:d.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),c()):y=0}function s(e,n,r,o,a,s,l){function u(t){if(!p&&i(f.readyState)&&(b.r=p=1,!y&&c(),f.onload=f.onreadystatechange=null,t)){"img"!=e&&m(function(){w.removeChild(f)},50);for(var r in T[n])T[n].hasOwnProperty(r)&&T[n][r].onload()}}var l=l||d.errorTimeout,f=t.createElement(e),p=0,g=0,b={t:r,s:n,e:a,a:s,x:l};1===T[n]&&(g=1,T[n]=[]),"object"==e?f.data=n:(f.src=n,f.type=e),f.width=f.height="0",f.onerror=f.onload=f.onreadystatechange=function(){u.call(this,g)},v.splice(o,0,b),"img"!=e&&(g||2===T[n]?(w.insertBefore(f,E?null:h),m(u,l)):T[n].push(f))}function l(e,t,n,r,a){return y=0,t=t||"j",o(e)?s("c"==t?S:x,e,t,this.i++,n,r,a):(v.splice(this.i++,0,e),1==v.length&&c()),this}function u(){var e=d;return e.loader={load:l,i:0},e}var f,d,p=t.documentElement,m=e.setTimeout,h=t.getElementsByTagName("script")[0],g={}.toString,v=[],y=0,b="MozAppearance"in p.style,E=b&&!!t.createRange().compareNode,w=E?p:h.parentNode,p=e.opera&&"[object Opera]"==g.call(e.opera),p=!!t.attachEvent&&!p,x=b?"object":p?"script":"img",S=p?"script":x,C=Array.isArray||function(e){return"[object Array]"==g.call(e)},k=[],T={},j={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};d=function(e){function t(e){var t,n,r,e=e.split("!"),o=k.length,a=e.pop(),i=e.length,a={url:a,origUrl:a,prefixes:e};for(n=0;i>n;n++)r=e[n].split("="),(t=j[r.shift()])&&(a=t(a,r));for(n=0;o>n;n++)a=k[n](a);return a}function i(e,o,a,i,c){var s=t(e),l=s.autoCallback;s.url.split(".").pop().split("?").shift(),s.bypass||(o&&(o=r(o)?o:o[e]||o[i]||o[e.split("/").pop().split("?")[0]]),s.instead?s.instead(e,o,a,i,c):(T[s.url]?s.noexec=!0:T[s.url]=1,a.load(s.url,s.forceCSS||!s.forceJS&&"css"==s.url.split(".").pop().split("?").shift()?"c":n,s.noexec,s.attrs,s.timeout),(r(o)||r(l))&&a.load(function(){u(),o&&o(s.origUrl,c,i),l&&l(s.origUrl,c,i),T[s.url]=2})))}function c(e,t){function n(e,n){if(e){if(o(e))n||(f=function(){var e=[].slice.call(arguments);d.apply(this,e),p()}),i(e,f,t,0,l);else if(Object(e)===e)for(s in c=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}(),e)e.hasOwnProperty(s)&&(!n&&!--c&&(r(f)?f=function(){var e=[].slice.call(arguments);d.apply(this,e),p()}:f[s]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),p()}}(d[s])),i(e[s],f,t,s,l))}else!n&&p()}var c,s,l=!!e.test,u=e.load||e.both,f=e.callback||a,d=f,p=e.complete||a;n(l?e.yep:e.nope,!!u),u&&n(u)}var s,l,f=this.yepnope.loader;if(o(e))i(e,0,f,0);else if(C(e))for(s=0;s<e.length;s++)l=e[s],o(l)?i(l,0,f,0):C(l)?d(l):Object(l)===l&&c(l,f);else Object(e)===e&&c(e,f)},d.addPrefix=function(e,t){j[e]=t},d.addFilter=function(e){k.push(e)},d.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",f=function(){t.removeEventListener("DOMContentLoaded",f,0),t.readyState="complete"},0)),e.yepnope=u(),e.yepnope.executeStack=c,e.yepnope.injectJs=function(e,n,r,o,s,l){var u,f,p=t.createElement("script"),o=o||d.errorTimeout;p.src=e;for(f in r)p.setAttribute(f,r[f]);n=l?c:n||a,p.onreadystatechange=p.onload=function(){!u&&i(p.readyState)&&(u=1,n(),p.onload=p.onreadystatechange=null)},m(function(){u||(u=1,n(1))},o),s?p.onload():h.parentNode.insertBefore(p,h)},e.yepnope.injectCss=function(e,n,r,o,i,s){var l,o=t.createElement("link"),n=s?c:n||a;o.href=e,o.rel="stylesheet",o.type="text/css";for(l in r)o.setAttribute(l,r[l]);i||(h.parentNode.insertBefore(o,h),m(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};