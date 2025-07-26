// ==UserScript==
// @name         BiliSing Master - 哔哩哔哩卡拉OK播放端
// @namespace    https://github.com/bilising
// @version      1.0.0
// @description  在哔哩哔哩页面上添加卡拉OK播放控制浮窗
// @author       BiliSing
// @match        https://*.bilibili.com/*
// @match        https://bilibili.com/*
// @match        https://sing.bilibiili.com/*
// @grant        none
// ==/UserScript==

const myURL = "https://sing.bilibiili.com";
// const myURL = "http://localhost:11817" // For local testing

/*!
 * Socket.IO v4.0.0
 * (c) 2014-2021 Guillermo Rauch
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(self,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=18)}([function(t,e,n){var r=n(24),o=n(25),i=String.fromCharCode(30);t.exports={protocol:4,encodePacket:r,encodePayload:function(t,e){var n=t.length,o=new Array(n),s=0;t.forEach((function(t,c){r(t,!1,(function(t){o[c]=t,++s===n&&e(o.join(i))}))}))},decodePacket:o,decodePayload:function(t,e){for(var n=t.split(i),r=[],s=0;s<n.length;s++){var c=o(n[s],e);if(r.push(c),"error"===c.type)break}return r}}},function(t,e,n){function r(t){if(t)return function(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}(t)}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n,r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o=0;o<r.length;o++)if((n=r[o])===e||n.fn===e){r.splice(o,1);break}return 0===r.length&&delete this._callbacks["$"+t],this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(n){r=0;for(var o=(n=n.slice(0)).length;r<o;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e){t.exports="undefined"!=typeof self?self:"undefined"!=typeof window?window:Function("return this")()},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=a(t);if(e){var o=a(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=n(0),f=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(a,t);var e,n,r,c=s(a);function a(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),(e=c.call(this)).opts=t,e.query=t.query,e.readyState="",e.socket=t.socket,e}return e=a,(n=[{key:"onError",value:function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this}},{key:"open",value:function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this}},{key:"close",value:function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this}},{key:"send",value:function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)}},{key:"onOpen",value:function(){this.readyState="open",this.writable=!0,this.emit("open")}},{key:"onData",value:function(t){var e=u.decodePacket(t,this.socket.binaryType);this.onPacket(e)}},{key:"onPacket",value:function(t){this.emit("packet",t)}},{key:"onClose",value:function(){this.readyState="closed",this.emit("close")}}])&&o(e.prototype,n),r&&o(e,r),a}(n(1));t.exports=f},function(t,e){e.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},e.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;r<o;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e,n){return(o="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=a(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=a(t);if(e){var o=a(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function f(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function p(t,e,n){return e&&f(t.prototype,e),n&&f(t,n),t}Object.defineProperty(e,"__esModule",{value:!0}),e.Decoder=e.Encoder=e.PacketType=e.protocol=void 0;var l,h=n(1),y=n(30),d=n(15);e.protocol=5,function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"}(l=e.PacketType||(e.PacketType={}));var v=function(){function t(){u(this,t)}return p(t,[{key:"encode",value:function(t){return t.type!==l.EVENT&&t.type!==l.ACK||!d.hasBinary(t)?[this.encodeAsString(t)]:(t.type=t.type===l.EVENT?l.BINARY_EVENT:l.BINARY_ACK,this.encodeAsBinary(t))}},{key:"encodeAsString",value:function(t){var e=""+t.type;return t.type!==l.BINARY_EVENT&&t.type!==l.BINARY_ACK||(e+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(e+=t.nsp+","),null!=t.id&&(e+=t.id),null!=t.data&&(e+=JSON.stringify(t.data)),e}},{key:"encodeAsBinary",value:function(t){var e=y.deconstructPacket(t),n=this.encodeAsString(e.packet),r=e.buffers;return r.unshift(n),r}}]),t}();e.Encoder=v;var b=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(n,t);var e=s(n);function n(){return u(this,n),e.call(this)}return p(n,[{key:"add",value:function(t){var e;if("string"==typeof t)(e=this.decodeString(t)).type===l.BINARY_EVENT||e.type===l.BINARY_ACK?(this.reconstructor=new m(e),0===e.attachments&&o(a(n.prototype),"emit",this).call(this,"decoded",e)):o(a(n.prototype),"emit",this).call(this,"decoded",e);else{if(!d.isBinary(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");(e=this.reconstructor.takeBinaryData(t))&&(this.reconstructor=null,o(a(n.prototype),"emit",this).call(this,"decoded",e))}}},{key:"decodeString",value:function(t){var e=0,r={type:Number(t.charAt(0))};if(void 0===l[r.type])throw new Error("unknown packet type "+r.type);if(r.type===l.BINARY_EVENT||r.type===l.BINARY_ACK){for(var o=e+1;"-"!==t.charAt(++e)&&e!=t.length;);var i=t.substring(o,e);if(i!=Number(i)||"-"!==t.charAt(e))throw new Error("Illegal attachments");r.attachments=Number(i)}if("/"===t.charAt(e+1)){for(var s=e+1;++e;){if(","===t.charAt(e))break;if(e===t.length)break}r.nsp=t.substring(s,e)}else r.nsp="/";var c=t.charAt(e+1);if(""!==c&&Number(c)==c){for(var a=e+1;++e;){var u=t.charAt(e);if(null==u||Number(u)!=u){--e;break}if(e===t.length)break}r.id=Number(t.substring(a,e+1))}if(t.charAt(++e)){var f=function(t){try{return JSON.parse(t)}catch(t){return!1}}(t.substr(e));if(!n.isPayloadValid(r.type,f))throw new Error("invalid payload");r.data=f}return r}},{key:"destroy",value:function(){this.reconstructor&&this.reconstructor.finishedReconstruction()}}],[{key:"isPayloadValid",value:function(t,e){switch(t){case l.CONNECT:return"object"===r(e);case l.DISCONNECT:return void 0===e;case l.CONNECT_ERROR:return"string"==typeof e||"object"===r(e);case l.EVENT:case l.BINARY_EVENT:return Array.isArray(e)&&e.length>0;case l.ACK:case l.BINARY_ACK:return Array.isArray(e)}}}]),n}(h);e.Decoder=b;var m=function(){function t(e){u(this,t),this.packet=e,this.buffers=[],this.reconPack=e}return p(t,[{key:"takeBinaryData",value:function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=y.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null}},{key:"finishedReconstruction",value:function(){this.reconPack=null,this.buffers=[]}}]),t}()},function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");-1!=o&&-1!=i&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s,c,a=n.exec(t||""),u={},f=14;f--;)u[r[f]]=a[f]||"";return-1!=o&&-1!=i&&(u.source=e,u.host=u.host.substring(1,u.host.length-1).replace(/;/g,":"),u.authority=u.authority.replace("[","").replace("]","").replace(/;/g,":"),u.ipv6uri=!0),u.pathNames=function(t,e){var n=e.replace(/\/{2,9}/g,"/").split("/");"/"!=e.substr(0,1)&&0!==e.length||n.splice(0,1);"/"==e.substr(e.length-1,1)&&n.splice(n.length-1,1);return n}(0,u.path),u.queryKey=(s=u.query,c={},s.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,(function(t,e,n){e&&(c[e]=n)})),c),u}},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=a(t);if(e){var o=a(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.Manager=void 0;var u=n(20),f=n(14),p=n(5),l=n(16),h=n(31),y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(y,t);var e,n,c,a=s(y);function y(t,e){var n;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,y),(n=a.call(this)).nsps={},n.subs=[],t&&"object"===r(t)&&(e=t,t=void 0),(e=e||{}).path=e.path||"/socket.io",n.opts=e,n.reconnection(!1!==e.reconnection),n.reconnectionAttempts(e.reconnectionAttempts||1/0),n.reconnectionDelay(e.reconnectionDelay||1e3),n.reconnectionDelayMax(e.reconnectionDelayMax||5e3),n.randomizationFactor(e.randomizationFactor||.5),n.backoff=new h({min:n.reconnectionDelay(),max:n.reconnectionDelayMax(),jitter:n.randomizationFactor()}),n.timeout(null==e.timeout?2e4:e.timeout),n._readyState="closed",n.uri=t;var o=e.parser||p;return n.encoder=new o.Encoder,n.decoder=new o.Decoder,n._autoConnect=!1!==e.autoConnect,n._autoConnect&&n.open(),n}return e=y,(n=[{key:"reconnection",value:function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection}},{key:"reconnectionAttempts",value:function(t){return void 0===t?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}},{key:"reconnectionDelay",value:function(t){var e;return void 0===t?this._reconnectionDelay:(this._reconnectionDelay=t,null===(e=this.backoff)||void 0===e||e.setMin(t),this)}},{key:"randomizationFactor",value:function(t){var e;return void 0===t?this._randomizationFactor:(this._randomizationFactor=t,null===(e=this.backoff)||void 0===e||e.setJitter(t),this)}},{key:"reconnectionDelayMax",value:function(t){var e;return void 0===t?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,null===(e=this.backoff)||void 0===e||e.setMax(t),this)}},{key:"timeout",value:function(t){return arguments.length?(this._timeout=t,this):this._timeout}},{key:"maybeReconnectOnOpen",value:function(){!this._reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()}},{key:"open",value:function(t){var e=this;if(~this._readyState.indexOf("open"))return this;this.engine=u(this.uri,this.opts);var n=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;var o=l.on(n,"open",(function(){r.onopen(),t&&t()})),i=l.on(n,"error",(function(n){r.cleanup(),r._readyState="closed",e.emitReserved("error",n),t?t(n):r.maybeReconnectOnOpen()}));if(!1!==this._timeout){var s=this._timeout;0===s&&o();var c=setTimeout((function(){o(),n.close(),n.emit("error",new Error("timeout"))}),s);this.opts.autoUnref&&c.unref(),this.subs.push((function(){clearTimeout(c)}))}return this.subs.push(o),this.subs.push(i),this}},{key:"connect",value:function(t){return this.open(t)}},{key:"onopen",value:function(){this.cleanup(),this._readyState="open",this.emitReserved("open");var t=this.engine;this.subs.push(l.on(t,"ping",this.onping.bind(this)),l.on(t,"data",this.ondata.bind(this)),l.on(t,"error",this.onerror.bind(this)),l.on(t,"close",this.onclose.bind(this)),l.on(this.decoder,"decoded",this.ondecoded.bind(this)))}},{key:"onping",value:function(){this.emitReserved("ping")}},{key:"ondata",value:function(t){this.decoder.add(t)}},{key:"ondecoded",value:function(t){this.emitReserved("packet",t)}},{key:"onerror",value:function(t){this.emitReserved("error",t)}},{key:"socket",value:function(t,e){var n=this.nsps[t];return n||(n=new f.Socket(this,t,e),this.nsps[t]=n),n}},{key:"_destroy",value:function(t){for(var e=0,n=Object.keys(this.nsps);e<n.length;e++){var r=n[e];if(this.nsps[r].active)return}this._close()}},{key:"_packet",value:function(t){for(var e=this.encoder.encode(t),n=0;n<e.length;n++)this.engine.write(e[n],t.options)}},{key:"cleanup",value:function(){this.subs.forEach((function(t){return t()})),this.subs.length=0,this.decoder.destroy()}},{key:"_close",value:function(){this.skipReconnect=!0,this._reconnecting=!1,"opening"===this._readyState&&this.cleanup(),this.backoff.reset(),this._readyState="closed",this.engine&&this.engine.close()}},{key:"disconnect",value:function(){return this._close()}},{key:"onclose",value:function(t){this.cleanup(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()}},{key:"reconnect",value:function(){var t=this;if(this._reconnecting||this.skipReconnect)return this;var e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{var n=this.backoff.duration();this._reconnecting=!0;var r=setTimeout((function(){e.skipReconnect||(t.emitReserved("reconnect_attempt",e.backoff.attempts),e.skipReconnect||e.open((function(n){n?(e._reconnecting=!1,e.reconnect(),t.emitReserved("reconnect_error",n)):e.onreconnect()})))}),n);this.opts.autoUnref&&r.unref(),this.subs.push((function(){clearTimeout(r)}))}}},{key:"onreconnect",value:function(){var t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}])&&o(e.prototype,n),c&&o(e,c),y}(n(17).StrictEventEmitter);e.Manager=y},function(t,e,n){var r=n(9),o=n(23),i=n(27),s=n(28);e.polling=function(t){var e=!1,n=!1,s=!1!==t.jsonp;if("undefined"!=typeof location){var c="https:"===location.protocol,a=location.port;a||(a=c?443:80),e=t.hostname!==location.hostname||a!==t.port,n=t.secure!==c}if(t.xdomain=e,t.xscheme=n,"open"in new r(t)&&!t.forceJSONP)return new o(t);if(!s)throw new Error("JSONP disabled");return new i(t)},e.websocket=s},function(t,e,n){var r=n(22),o=n(2);t.exports=function(t){var e=t.xdomain,n=t.xscheme,i=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||r))return new XMLHttpRequest}catch(t){}try{if("undefined"!=typeof XDomainRequest&&!n&&i)return new XDomainRequest}catch(t){}if(!e)try{return new(o[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}}},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=u(t);if(e){var o=u(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return a(this,n)}}function a(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var f=n(3),p=n(4),l=n(0),h=n(12),y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(u,t);var e,n,r,a=c(u);function u(){return o(this,u),a.apply(this,arguments)}return e=u,(n=[{key:"doOpen",value:function(){this.poll()}},{key:"pause",value:function(t){var e=this;function n(){e.readyState="paused",t()}if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(r++,this.once("pollComplete",(function(){--r||n()}))),this.writable||(r++,this.once("drain",(function(){--r||n()})))}else n()}},{key:"poll",value:function(){this.polling=!0,this.doPoll(),this.emit("poll")}},{key:"onData",value:function(t){var e=this;l.decodePayload(t,this.socket.binaryType).forEach((function(t,n,r){if("opening"===e.readyState&&"open"===t.type&&e.onOpen(),"close"===t.type)return e.onClose(),!1;e.onPacket(t)})),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState&&this.poll())}},{key:"doClose",value:function(){var t=this;function e(){t.write([{type:"close"}])}"open"===this.readyState?e():this.once("open",e)}},{key:"write",value:function(t){var e=this;this.writable=!1,l.encodePayload(t,(function(t){e.doWrite(t,(function(){e.writable=!0,e.emit("drain")}))}))}},{key:"uri",value:function(){var t=this.query||{},e=this.opts.secure?"https":"http",n="";return!1!==this.opts.timestampRequests&&(t[this.opts.timestampParam]=h()),this.supportsBinary||t.sid||(t.b64=1),t=p.encode(t),this.opts.port&&("https"===e&&443!==Number(this.opts.port)||"http"===e&&80!==Number(this.opts.port))&&(n=":"+this.opts.port),t.length&&(t="?"+t),e+"://"+(-1!==this.opts.hostname.indexOf(":")?"["+this.opts.hostname+"]":this.opts.hostname)+n+this.opts.path+t}},{key:"name",get:function(){return"polling"}}])&&i(e.prototype,n),r&&i(e,r),u}(f);t.exports=y},function(t,e){var n=Object.create(null);n.open="0",n.close="1",n.ping="2",n.pong="3",n.message="4",n.upgrade="5",n.noop="6";var r=Object.create(null);Object.keys(n).forEach((function(t){r[n[t]]=t}));t.exports={PACKET_TYPES:n,PACKET_TYPES_REVERSE:r,ERROR_PACKET:{type:"error",data:"parser error"}}},function(t,e,n){"use strict";var r,o="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),i={},s=0,c=0;function a(t){var e="";do{e=o[t%64]+e,t=Math.floor(t/64)}while(t>0);return e}function u(){var t=a(+new Date);return t!==r?(s=0,r=t):t+"."+a(s++)}for(;c<64;c++)i[o[c]]=c;u.encode=a,u.decode=function(t){var e=0;for(c=0;c<t.length;c++)e=64*e+i[t.charAt(c)];return e},t.exports=u},function(t,e){t.exports.pick=function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];return n.reduce((function(e,n){return t.hasOwnProperty(n)&&(e[n]=t[n]),e}),{})}},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,c=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return c=t.done,t},e:function(t){a=!0,s=t},f:function(){try{c||null==n.return||n.return()}finally{if(a)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e,n){return(c="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=p(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function u(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=p(t);if(e){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.Socket=void 0;var l=n(5),h=n(16),y=n(17),d=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1}),v=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}(f,t);var e,n,r,i=u(f);function f(t,e,n){var r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,f),(r=i.call(this)).receiveBuffer=[],r.sendBuffer=[],r.ids=0,r.acks={},r.flags={},r.io=t,r.nsp=e,r.ids=0,r.acks={},r.receiveBuffer=[],r.sendBuffer=[],r.connected=!1,r.disconnected=!0,r.flags={},n&&n.auth&&(r.auth=n.auth),r.io._autoConnect&&r.open(),r}return e=f,(n=[{key:"subEvents",value:function(){if(!this.subs){var t=this.io;this.subs=[h.on(t,"open",this.onopen.bind(this)),h.on(t,"packet",this.onpacket.bind(this)),h.on(t,"error",this.onerror.bind(this)),h.on(t,"close",this.onclose.bind(this))]}}},{key:"connect",value:function(){return this.connected||(this.subEvents(),this.io._reconnecting||this.io.open(),"open"===this.io._readyState&&this.onopen()),this}},{key:"open",value:function(){return this.connect()}},{key:"send",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.unshift("message"),this.emit.apply(this,e),this}},{key:"emit",value:function(t){if(d.hasOwnProperty(t))throw new Error('"'+t+'" is a reserved event name');for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];n.unshift(t);var o={type:l.PacketType.EVENT,data:n,options:{}};o.options.compress=!1!==this.flags.compress,"function"==typeof n[n.length-1]&&(this.acks[this.ids]=n.pop(),o.id=this.ids++);var i=this.io.engine&&this.io.engine.transport&&this.io.engine.transport.writable,s=this.flags.volatile&&(!i||!this.connected);return s||(this.connected?this.packet(o):this.sendBuffer.push(o)),this.flags={},this}},{key:"packet",value:function(t){t.nsp=this.nsp,this.io._packet(t)}},{key:"onopen",value:function(){var t=this;"function"==typeof this.auth?this.auth((function(e){t.packet({type:l.PacketType.CONNECT,data:e})})):this.packet({type:l.PacketType.CONNECT,data:this.auth})}},{key:"onerror",value:function(t){this.connected||this.emitReserved("connect_error",t)}},{key:"onclose",value:function(t){this.connected=!1,this.disconnected=!0,delete this.id,this.emitReserved("disconnect",t)}},{key:"onpacket",value:function(t){if(t.nsp===this.nsp)switch(t.type){case l.PacketType.CONNECT:if(t.data&&t.data.sid){var e=t.data.sid;this.onconnect(e)}else this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case l.PacketType.EVENT:case l.PacketType.BINARY_EVENT:this.onevent(t);break;case l.PacketType.ACK:case l.PacketType.BINARY_ACK:this.onack(t);break;case l.PacketType.DISCONNECT:this.ondisconnect();break;case l.PacketType.CONNECT_ERROR:var n=new Error(t.data.message);n.data=t.data.data,this.emitReserved("connect_error",n)}}},{key:"onevent",value:function(t){var e=t.data||[];null!=t.id&&e.push(this.ack(t.id)),this.connected?this.emitEvent(e):this.receiveBuffer.push(Object.freeze(e))}},{key:"emitEvent",value:function(t){if(this._anyListeners&&this._anyListeners.length){var e,n=o(this._anyListeners.slice());try{for(n.s();!(e=n.n()).done;)e.value.apply(this,t)}catch(t){n.e(t)}finally{n.f()}}c(p(f.prototype),"emit",this).apply(this,t)}},{key:"ack",value:function(t){var e=this,n=!1;return function(){if(!n){n=!0;for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];e.packet({type:l.PacketType.ACK,id:t,data:o})}}}},{key:"onack",value:function(t){var e=this.acks[t.id];"function"==typeof e&&(e.apply(this,t.data),delete this.acks[t.id])}},{key:"onconnect",value:function(t){this.id=t,this.connected=!0,this.disconnected=!1,this.emitReserved("connect"),this.emitBuffered()}},{key:"emitBuffered",value:function(){var t=this;this.receiveBuffer.forEach((function(e){return t.emitEvent(e)})),this.receiveBuffer=[],this.sendBuffer.forEach((function(e){return t.packet(e)})),this.sendBuffer=[]}},{key:"ondisconnect",value:function(){this.destroy(),this.onclose("io server disconnect")}},{key:"destroy",value:function(){this.subs&&(this.subs.forEach((function(t){return t()})),this.subs=void 0),this.io._destroy(this)}},{key:"disconnect",value:function(){return this.connected&&this.packet({type:l.PacketType.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}},{key:"close",value:function(){return this.disconnect()}},{key:"compress",value:function(t){return this.flags.compress=t,this}},{key:"onAny",value:function(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}},{key:"prependAny",value:function(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}},{key:"offAny",value:function(t){if(!this._anyListeners)return this;if(t){for(var e=this._anyListeners,n=0;n<e.length;n++)if(t===e[n])return e.splice(n,1),this}else this._anyListeners=[];return this}},{key:"listenersAny",value:function(){return this._anyListeners||[]}},{key:"active",get:function(){return!!this.subs}},{key:"volatile",get:function(){return this.flags.volatile=!0,this}}])&&s(e.prototype,n),r&&s(e,r),f}(y.StrictEventEmitter);e.Socket=v},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.hasBinary=e.isBinary=void 0;var o="function"==typeof ArrayBuffer,i=Object.prototype.toString,s="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===i.call(Blob),c="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===i.call(File);function a(t){return o&&(t instanceof ArrayBuffer||function(t){return"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer}(t))||s&&t instanceof Blob||c&&t instanceof File}e.isBinary=a,e.hasBinary=function t(e,n){if(!e||"object"!==r(e))return!1;if(Array.isArray(e)){for(var o=0,i=e.length;o<i;o++)if(t(e[o]))return!0;return!1}if(a(e))return!0;if(e.toJSON&&"function"==typeof e.toJSON&&1===arguments.length)return t(e.toJSON(),!0);for(var s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&t(e[s]))return!0;return!1}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.on=void 0,e.on=function(t,e,n){return t.on(e,n),function(){t.off(e,n)}}},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function s(t,e,n){return(s="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=f(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=f(t);if(e){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return u(this,n)}}function u(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.StrictEventEmitter=void 0;var p=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(p,t);var e,n,r,u=a(p);function p(){return o(this,p),u.apply(this,arguments)}return e=p,(n=[{key:"on",value:function(t,e){return s(f(p.prototype),"on",this).call(this,t,e),this}},{key:"once",value:function(t,e){return s(f(p.prototype),"once",this).call(this,t,e),this}},{key:"emit",value:function(t){for(var e,n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return(e=s(f(p.prototype),"emit",this)).call.apply(e,[this,t].concat(r)),this}},{key:"emitReserved",value:function(t){for(var e,n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return(e=s(f(p.prototype),"emit",this)).call.apply(e,[this,t].concat(r)),this}},{key:"listeners",value:function(t){return s(f(p.prototype),"listeners",this).call(this,t)}}])&&i(e.prototype,n),r&&i(e,r),p}(n(1));e.StrictEventEmitter=p},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.Socket=e.io=e.Manager=e.protocol=void 0;var o=n(19),i=n(7),s=n(14);Object.defineProperty(e,"Socket",{enumerable:!0,get:function(){return s.Socket}}),t.exports=e=a;var c=e.managers={};function a(t,e){"object"===r(t)&&(e=t,t=void 0),e=e||{};var n,s=o.url(t,e.path),a=s.source,u=s.id,f=s.path,p=c[u]&&f in c[u].nsps;return e.forceNew||e["force new connection"]||!1===e.multiplex||p?n=new i.Manager(a,e):(c[u]||(c[u]=new i.Manager(a,e)),n=c[u]),s.query&&!e.query&&(e.query=s.queryKey),n.socket(s.path,e)}e.io=a;var u=n(5);Object.defineProperty(e,"protocol",{enumerable:!0,get:function(){return u.protocol}}),e.connect=a;var f=n(7);Object.defineProperty(e,"Manager",{enumerable:!0,get:function(){return f.Manager}})},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.url=void 0;var r=n(6);e.url=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2?arguments[2]:void 0,o=t;n=n||"undefined"!=typeof location&&location,null==t&&(t=n.protocol+"//"+n.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?n.protocol+t:n.host+t),/^(https?|wss?):\/\//.test(t)||(t=void 0!==n?n.protocol+"//"+t:"https://"+t),o=r(t)),o.port||(/^(http|ws)$/.test(o.protocol)?o.port="80":/^(http|ws)s$/.test(o.protocol)&&(o.port="443")),o.path=o.path||"/";var i=-1!==o.host.indexOf(":"),s=i?"["+o.host+"]":o.host;return o.id=o.protocol+"://"+s+":"+o.port+e,o.href=o.protocol+"://"+s+(n&&n.port===o.port?"":":"+o.port),o}},function(t,e,n){var r=n(21);t.exports=function(t,e){return new r(t,e)},t.exports.Socket=r,t.exports.protocol=r.protocol,t.exports.Transport=n(3),t.exports.transports=n(8),t.exports.parser=n(0)},function(t,e,n){function r(){return(r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=f(t);if(e){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return u(this,n)}}function u(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var p=n(8),l=n(1),h=n(0),y=n(6),d=n(4),v=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(l,t);var e,n,u,f=a(l);function l(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return i(this,l),e=f.call(this),t&&"object"===o(t)&&(n=t,t=null),t?(t=y(t),n.hostname=t.host,n.secure="https"===t.protocol||"wss"===t.protocol,n.port=t.port,t.query&&(n.query=t.query)):n.host&&(n.hostname=y(n.host).host),e.secure=null!=n.secure?n.secure:"undefined"!=typeof location&&"https:"===location.protocol,n.hostname&&!n.port&&(n.port=e.secure?"443":"80"),e.hostname=n.hostname||("undefined"!=typeof location?location.hostname:"localhost"),e.port=n.port||("undefined"!=typeof location&&location.port?location.port:e.secure?443:80),e.transports=n.transports||["polling","websocket"],e.readyState="",e.writeBuffer=[],e.prevBufferLen=0,e.opts=r({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,jsonp:!0,timestampParam:"t",rememberUpgrade:!1,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{}},n),e.opts.path=e.opts.path.replace(/\/$/,"")+"/","string"==typeof e.opts.query&&(e.opts.query=d.decode(e.opts.query)),e.id=null,e.upgrades=null,e.pingInterval=null,e.pingTimeout=null,e.pingTimeoutTimer=null,"function"==typeof addEventListener&&(addEventListener("beforeunload",(function(){e.transport&&(e.transport.removeAllListeners(),e.transport.close())}),!1),"localhost"!==e.hostname&&(e.offlineEventListener=function(){e.onClose("transport close")},addEventListener("offline",e.offlineEventListener,!1))),e.open(),e}return e=l,(n=[{key:"createTransport",value:function(t){var e=function(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}(this.opts.query);e.EIO=h.protocol,e.transport=t,this.id&&(e.sid=this.id);var n=r({},this.opts.transportOptions[t],this.opts,{query:e,socket:this,hostname:this.hostname,secure:this.secure,port:this.port});return new p[t](n)}},{key:"open",value:function(){var t;if(this.opts.rememberUpgrade&&l.priorWebsocketSuccess&&-1!==this.transports.indexOf("websocket"))t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout((function(){e.emit("error","No transports available")}),0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)}},{key:"setTransport",value:function(t){var e=this;this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",(function(){e.onDrain()})).on("packet",(function(t){e.onPacket(t)})).on("error",(function(t){e.onError(t)})).on("close",(function(){e.onClose("transport close")}))}},{key:"probe",value:function(t){var e=this.createTransport(t,{probe:1}),n=!1,r=this;function o(){if(r.onlyBinaryUpgrades){var t=!this.supportsBinary&&r.transport.supportsBinary;n=n||t}n||(e.send([{type:"ping",data:"probe"}]),e.once("packet",(function(t){if(!n)if("pong"===t.type&&"probe"===t.data){if(r.upgrading=!0,r.emit("upgrading",e),!e)return;l.priorWebsocketSuccess="websocket"===e.name,r.transport.pause((function(){n||"closed"!==r.readyState&&(f(),r.setTransport(e),e.send([{type:"upgrade"}]),r.emit("upgrade",e),e=null,r.upgrading=!1,r.flush())}))}else{var o=new Error("probe error");o.transport=e.name,r.emit("upgradeError",o)}})))}function i(){n||(n=!0,f(),e.close(),e=null)}function s(t){var n=new Error("probe error: "+t);n.transport=e.name,i(),r.emit("upgradeError",n)}function c(){s("transport closed")}function a(){s("socket closed")}function u(t){e&&t.name!==e.name&&i()}function f(){e.removeListener("open",o),e.removeListener("error",s),e.removeListener("close",c),r.removeListener("close",a),r.removeListener("upgrading",u)}l.priorWebsocketSuccess=!1,e.once("open",o),e.once("error",s),e.once("close",c),this.once("close",a),this.once("upgrading",u),e.open()}},{key:"onOpen",value:function(){if(this.readyState="open",l.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.opts.upgrade&&this.transport.pause)for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},{key:"onPacket",value:function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this.resetPingTimeout(),this.sendPacket("pong"),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}}},{key:"onHandshake",value:function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&this.resetPingTimeout()}},{key:"resetPingTimeout",value:function(){var t=this;clearTimeout(this.pingTimeoutTimer),this.pingTimeoutTimer=setTimeout((function(){t.onClose("ping timeout")}),this.pingInterval+this.pingTimeout),this.opts.autoUnref&&this.pingTimeoutTimer.unref()}},{key:"onDrain",value:function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()}},{key:"flush",value:function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))}},{key:"write",value:function(t,e,n){return this.sendPacket("message",t,e,n),this}},{key:"send",value:function(t,e,n){return this.sendPacket("message",t,e,n),this}},{key:"sendPacket",value:function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!==this.readyState&&"closed"!==this.readyState){(n=n||{}).compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}}},{key:"close",value:function(){var t=this;function e(){t.onClose("forced close"),t.transport.close()}function n(){t.removeListener("upgrade",n),t.removeListener("upgradeError",n),e()}function r(){t.once("upgrade",n),t.once("upgradeError",n)}return"opening"!==this.readyState&&"open"!==this.readyState||(this.readyState="closing",this.writeBuffer.length?this.once("drain",(function(){this.upgrading?r():e()})):this.upgrading?r():e()),this}},{key:"onError",value:function(t){l.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)}},{key:"onClose",value:function(t,e){"opening"!==this.readyState&&"open"!==this.readyState&&"closing"!==this.readyState||(clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),"function"==typeof removeEventListener&&removeEventListener("offline",this.offlineEventListener,!1),this.readyState="closed",this.id=null,this.emit("close",t,e),this.writeBuffer=[],this.prevBufferLen=0)}},{key:"filterUpgrades",value:function(t){for(var e=[],n=0,r=t.length;n<r;n++)~this.transports.indexOf(t[n])&&e.push(t[n]);return e}}])&&s(e.prototype,n),u&&s(e,u),l}(l);v.priorWebsocketSuccess=!1,v.protocol=h.protocol,t.exports=v},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(e){t.exports=!1}},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(){return(o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e,n){return e&&s(t.prototype,e),n&&s(t,n),t}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=l(t);if(e){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p(this,n)}}function p(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function l(t){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var h=n(9),y=n(10),d=n(1),v=n(13).pick,b=n(2);function m(){}var g=null!=new h({xdomain:!1}).responseType,k=function(t){a(n,t);var e=f(n);function n(t){var r;if(i(this,n),r=e.call(this,t),"undefined"!=typeof location){var o="https:"===location.protocol,s=location.port;s||(s=o?443:80),r.xd="undefined"!=typeof location&&t.hostname!==location.hostname||s!==t.port,r.xs=t.secure!==o}var c=t&&t.forceBase64;return r.supportsBinary=g&&!c,r}return c(n,[{key:"request",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return o(t,{xd:this.xd,xs:this.xs},this.opts),new w(this.uri(),t)}},{key:"doWrite",value:function(t,e){var n=this.request({method:"POST",data:t}),r=this;n.on("success",e),n.on("error",(function(t){r.onError("xhr post error",t)}))}},{key:"doPoll",value:function(){var t=this.request(),e=this;t.on("data",(function(t){e.onData(t)})),t.on("error",(function(t){e.onError("xhr poll error",t)})),this.pollXhr=t}}]),n}(y),w=function(t){a(n,t);var e=f(n);function n(t,r){var o;return i(this,n),(o=e.call(this)).opts=r,o.method=r.method||"GET",o.uri=t,o.async=!1!==r.async,o.data=void 0!==r.data?r.data:null,o.create(),o}return c(n,[{key:"create",value:function(){var t=v(this.opts,"agent","enablesXDR","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this.opts.xd,t.xscheme=!!this.opts.xs;var e=this.xhr=new h(t),r=this;try{e.open(this.method,this.uri,this.async);try{if(this.opts.extraHeaders)for(var o in e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0),this.opts.extraHeaders)this.opts.extraHeaders.hasOwnProperty(o)&&e.setRequestHeader(o,this.opts.extraHeaders[o])}catch(t){}if("POST"===this.method)try{e.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(t){}try{e.setRequestHeader("Accept","*/*")}catch(t){}"withCredentials"in e&&(e.withCredentials=this.opts.withCredentials),this.opts.requestTimeout&&(e.timeout=this.opts.requestTimeout),this.hasXDR()?(e.onload=function(){r.onLoad()},e.onerror=function(){r.onError(e.responseText)}):e.onreadystatechange=function(){4===e.readyState&&(200===e.status||1223===e.status?r.onLoad():setTimeout((function(){r.onError("number"==typeof e.status?e.status:0)}),0))},e.send(this.data)}catch(t){return void setTimeout((function(){r.onError(t)}),0)}"undefined"!=typeof document&&(this.index=n.requestsCount++,n.requests[this.index]=this)}},{key:"onSuccess",value:function(){this.emit("success"),this.cleanup()}},{key:"onData",value:function(t){this.emit("data",t),this.onSuccess()}},{key:"onError",value:function(t){this.emit("error",t),this.cleanup(!0)}},{key:"cleanup",value:function(t){if(void 0!==this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=m:this.xhr.onreadystatechange=m,t)try{this.xhr.abort()}catch(t){}"undefined"!=typeof document&&delete n.requests[this.index],this.xhr=null}}},{key:"onLoad",value:function(){var t=this.xhr.responseText;null!==t&&this.onData(t)}},{key:"hasXDR",value:function(){return"undefined"!=typeof XDomainRequest&&!this.xs&&this.enablesXDR}},{key:"abort",value:function(){this.cleanup()}}]),n}(d);if(w.requestsCount=0,w.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",_);else if("function"==typeof addEventListener){addEventListener("onpagehide"in b?"pagehide":"unload",_,!1)}function _(){for(var t in w.requests)w.requests.hasOwnProperty(t)&&w.requests[t].abort()}t.exports=k,t.exports.Request=w},function(t,e,n){var r=n(11).PACKET_TYPES,o="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===Object.prototype.toString.call(Blob),i="function"==typeof ArrayBuffer,s=function(t,e){var n=new FileReader;return n.onload=function(){var t=n.result.split(",")[1];e("b"+t)},n.readAsDataURL(t)};t.exports=function(t,e,n){var c,a=t.type,u=t.data;return o&&u instanceof Blob?e?n(u):s(u,n):i&&(u instanceof ArrayBuffer||(c=u,"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(c):c&&c.buffer instanceof ArrayBuffer))?e?n(u instanceof ArrayBuffer?u:u.buffer):s(new Blob([u]),n):n(r[a]+(u||""))}},function(t,e,n){var r,o=n(11),i=o.PACKET_TYPES_REVERSE,s=o.ERROR_PACKET;"function"==typeof ArrayBuffer&&(r=n(26));var c=function(t,e){if(r){var n=r.decode(t);return a(n,e)}return{base64:!0,data:t}},a=function(t,e){switch(e){case"blob":return t instanceof ArrayBuffer?new Blob([t]):t;case"arraybuffer":default:return t}};t.exports=function(t,e){if("string"!=typeof t)return{type:"message",data:a(t,e)};var n=t.charAt(0);return"b"===n?{type:"message",data:c(t.substring(1),e)}:i[n]?t.length>1?{type:i[n],data:t.substring(1)}:{type:i[n]}:s}},function(t,e){!function(t){"use strict";e.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;n<o;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3==2?i=i.substring(0,i.length-1)+"=":o%3==1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(e){var n,r,o,i,s,c=.75*e.length,a=e.length,u=0;"="===e[e.length-1]&&(c--,"="===e[e.length-2]&&c--);var f=new ArrayBuffer(c),p=new Uint8Array(f);for(n=0;n<a;n+=4)r=t.indexOf(e[n]),o=t.indexOf(e[n+1]),i=t.indexOf(e[n+2]),s=t.indexOf(e[n+3]),p[u++]=r<<2|o>>4,p[u++]=(15&o)<<4|i>>2,p[u++]=(3&i)<<6|63&s;return f}}("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e,n){return(i="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=f(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=f(t);if(e){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return a(this,n)}}function a(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?u(t):e}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var p,l=n(10),h=n(2),y=/\n/g,d=/\\n/g,v=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(l,t);var e,n,r,a=c(l);function l(t){var e;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),(e=a.call(this,t)).query=e.query||{},p||(p=h.___eio=h.___eio||[]),e.index=p.length;var n=u(e);return p.push((function(t){n.onData(t)})),e.query.j=e.index,e}return e=l,(n=[{key:"doClose",value:function(){this.script&&(this.script.onerror=function(){},this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i(f(l.prototype),"doClose",this).call(this)}},{key:"doPoll",value:function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e,"undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent)&&setTimeout((function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)}),100)}},{key:"doWrite",value:function(t,e){var n,r=this;if(!this.form){var o=document.createElement("form"),i=document.createElement("textarea"),s=this.iframeId="eio_iframe_"+this.index;o.className="socketio",o.style.position="absolute",o.style.top="-1000px",o.style.left="-1000px",o.target=s,o.method="POST",o.setAttribute("accept-charset","utf-8"),i.name="d",o.appendChild(i),document.body.appendChild(o),this.form=o,this.area=i}function c(){a(),e()}function a(){if(r.iframe)try{r.form.removeChild(r.iframe)}catch(t){r.onError("jsonp polling iframe removal error",t)}try{var t='<iframe src="javascript:0" name="'+r.iframeId+'">';n=document.createElement(t)}catch(t){(n=document.createElement("iframe")).name=r.iframeId,n.src="javascript:0"}n.id=r.iframeId,r.form.appendChild(n),r.iframe=n}this.form.action=this.uri(),a(),t=t.replace(d,"\\\n"),this.area.value=t.replace(y,"\\n");try{this.form.submit()}catch(t){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===r.iframe.readyState&&c()}:this.iframe.onload=c}},{key:"supportsBinary",get:function(){return!1}}])&&o(e.prototype,n),r&&o(e,r),l}(l);t.exports=v},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=a(t);if(e){var o=a(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=n(3),f=n(0),p=n(4),l=n(12),h=n(13).pick,y=n(29),d=y.WebSocket,v=y.usingBrowserWebSocket,b=y.defaultBinaryType,m="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase(),g=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(a,t);var e,n,r,c=s(a);function a(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),(e=c.call(this,t)).supportsBinary=!t.forceBase64,e}return e=a,(n=[{key:"doOpen",value:function(){if(this.check()){var t=this.uri(),e=this.opts.protocols,n=m?{}:h(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(n.headers=this.opts.extraHeaders);try{this.ws=v&&!m?e?new d(t,e):new d(t):new d(t,e,n)}catch(t){return this.emit("error",t)}this.ws.binaryType=this.socket.binaryType||b,this.addEventListeners()}}},{key:"addEventListeners",value:function(){var t=this;this.ws.onopen=function(){t.opts.autoUnref&&t.ws._socket.unref(),t.onOpen()},this.ws.onclose=this.onClose.bind(this),this.ws.onmessage=function(e){return t.onData(e.data)},this.ws.onerror=function(e){return t.onError("websocket error",e)}}},{key:"write",value:function(t){var e=this;this.writable=!1;for(var n=t.length,r=0,o=n;r<o;r++)!function(t){f.encodePacket(t,e.supportsBinary,(function(r){var o={};v||(t.options&&(o.compress=t.options.compress),e.opts.perMessageDeflate&&("string"==typeof r?Buffer.byteLength(r):r.length)<e.opts.perMessageDeflate.threshold&&(o.compress=!1));try{v?e.ws.send(r):e.ws.send(r,o)}catch(t){}--n||(e.emit("flush"),setTimeout((function(){e.writable=!0,e.emit("drain")}),0))}))}(t[r])}},{key:"onClose",value:function(){u.prototype.onClose.call(this)}},{key:"doClose",value:function(){void 0!==this.ws&&(this.ws.close(),this.ws=null)}},{key:"uri",value:function(){var t=this.query||{},e=this.opts.secure?"wss":"ws",n="";return this.opts.port&&("wss"===e&&443!==Number(this.opts.port)||"ws"===e&&80!==Number(this.opts.port))&&(n=":"+this.opts.port),this.opts.timestampRequests&&(t[this.opts.timestampParam]=l()),this.supportsBinary||(t.b64=1),(t=p.encode(t)).length&&(t="?"+t),e+"://"+(-1!==this.opts.hostname.indexOf(":")?"["+this.opts.hostname+"]":this.opts.hostname)+n+this.opts.path+t}},{key:"check",value:function(){return!(!d||"__initialize"in d&&this.name===a.prototype.name)}},{key:"name",get:function(){return"websocket"}}])&&o(e.prototype,n),r&&o(e,r),a}(u);t.exports=g},function(t,e,n){var r=n(2);t.exports={WebSocket:r.WebSocket||r.MozWebSocket,usingBrowserWebSocket:!0,defaultBinaryType:"arraybuffer"}},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.reconstructPacket=e.deconstructPacket=void 0;var o=n(15);e.deconstructPacket=function(t){var e=[],n=t.data,i=t;return i.data=function t(e,n){if(!e)return e;if(o.isBinary(e)){var i={_placeholder:!0,num:n.length};return n.push(e),i}if(Array.isArray(e)){for(var s=new Array(e.length),c=0;c<e.length;c++)s[c]=t(e[c],n);return s}if("object"===r(e)&&!(e instanceof Date)){var a={};for(var u in e)e.hasOwnProperty(u)&&(a[u]=t(e[u],n));return a}return e}(n,e),i.attachments=e.length,{packet:i,buffers:e}},e.reconstructPacket=function(t,e){return t.data=function t(e,n){if(!e)return e;if(e&&e._placeholder)return n[e.num];if(Array.isArray(e))for(var o=0;o<e.length;o++)e[o]=t(e[o],n);else if("object"===r(e))for(var i in e)e.hasOwnProperty(i)&&(e[i]=t(e[i],n));return e}(t.data,e),t.attachments=void 0,t}},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}}])}));

// QRCode.js

var QRCode=function(t){"use strict";function R(){return void 0!==a}var a,O=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706],Q=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||40<t)throw new Error('"version" should be in range from 1 to 40');return 4*t+17},n=function(t){for(var e=0;0!==t;)e++,t>>>=1;return e};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var g=e(function(t,n){n.L={bit:1},n.M={bit:0},n.Q={bit:3},n.H={bit:2},n.isValid=function(t){return t&&void 0!==t.bit&&0<=t.bit&&t.bit<4},n.from=function(t,e){if(n.isValid(t))return t;try{var r=t;if("string"!=typeof r)throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return n.L;case"m":case"medium":return n.M;case"q":case"quartile":return n.Q;case"h":case"high":return n.H;default:throw new Error("Unknown EC Level: "+r)}return}catch(t){return e}}});function T(){this.buffer=[],this.length=0}g.L,g.M,g.Q,g.H,g.isValid,T.prototype={get:function(t){var e=Math.floor(t/8);return 1==(this.buffer[e]>>>7-t%8&1)},put:function(t,e){for(var r=0;r<e;r++)this.putBit(1==(t>>>e-r-1&1))},getLengthInBits:function(){return this.length},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}};var W=T;function r(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}r.prototype.set=function(t,e,r,n){t=t*this.size+e;this.data[t]=r,n&&(this.reservedBit[t]=!0)},r.prototype.get=function(t,e){return this.data[t*this.size+e]},r.prototype.xor=function(t,e,r){this.data[t*this.size+e]^=r},r.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]};for(var G=r,V=e(function(t,i){var a=Q;i.getRowColCoords=function(t){if(1===t)return[];for(var e=Math.floor(t/7)+2,t=a(t),r=145===t?26:2*Math.ceil((t-13)/(2*e-2)),n=[t-7],o=1;o<e-1;o++)n[o]=n[o-1]-r;return n.push(6),n.reverse()},i.getPositions=function(t){for(var e=[],r=i.getRowColCoords(t),n=r.length,o=0;o<n;o++)for(var a=0;a<n;a++)0===o&&0===a||0===o&&a===n-1||o===n-1&&0===a||e.push([r[o],r[a]]);return e}}),L=(V.getRowColCoords,V.getPositions,Q),tt=function(t){t=L(t);return[[0,0],[t-7,0],[0,t-7]]},q=e(function(t,u){u.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};u.isValid=function(t){return null!=t&&""!==t&&!isNaN(t)&&0<=t&&t<=7},u.from=function(t){return u.isValid(t)?parseInt(t,10):void 0},u.getPenaltyN1=function(t){for(var e=t.size,r=0,n=0,o=0,a=null,i=null,u=0;u<e;u++){for(var n=o=0,a=i=null,s=0;s<e;s++){var h=t.get(u,s);h===a?n++:(5<=n&&(r+=n-5+3),a=h,n=1),(h=t.get(s,u))===i?o++:(5<=o&&(r+=o-5+3),i=h,o=1)}5<=n&&(r+=n-5+3),5<=o&&(r+=o-5+3)}return r},u.getPenaltyN2=function(t){for(var e=t.size,r=0,n=0;n<e-1;n++)for(var o=0;o<e-1;o++){var a=t.get(n,o)+t.get(n,o+1)+t.get(n+1,o)+t.get(n+1,o+1);4!==a&&0!==a||r++}return 3*r},u.getPenaltyN3=function(t){for(var e=t.size,r=0,n=0,o=0,a=0;a<e;a++)for(var n=o=0,i=0;i<e;i++)n=n<<1&2047|t.get(a,i),10<=i&&(1488===n||93===n)&&r++,o=o<<1&2047|t.get(i,a),10<=i&&(1488===o||93===o)&&r++;return 40*r},u.getPenaltyN4=function(t){for(var e=0,r=t.data.length,n=0;n<r;n++)e+=t.data[n];return 10*Math.abs(Math.ceil(100*e/r/5)-10)},u.applyMask=function(t,e){for(var r=e.size,n=0;n<r;n++)for(var o=0;o<r;o++)e.isReserved(o,n)||e.xor(o,n,function(t,e,r){switch(t){case u.Patterns.PATTERN000:return(e+r)%2==0;case u.Patterns.PATTERN001:return e%2==0;case u.Patterns.PATTERN010:return r%3==0;case u.Patterns.PATTERN011:return(e+r)%3==0;case u.Patterns.PATTERN100:return(Math.floor(e/2)+Math.floor(r/3))%2==0;case u.Patterns.PATTERN101:return e*r%2+e*r%3==0;case u.Patterns.PATTERN110:return(e*r%2+e*r%3)%2==0;case u.Patterns.PATTERN111:return(e*r%3+(e+r)%2)%2==0;default:throw new Error("bad maskPattern:"+t)}}(t,o,n))},u.getBestMask=function(t,e){for(var r=Object.keys(u.Patterns).length,n=0,o=1/0,a=0;a<r;a++){e(a),u.applyMask(a,t);var i=u.getPenaltyN1(t)+u.getPenaltyN2(t)+u.getPenaltyN3(t)+u.getPenaltyN4(t);u.applyMask(a,t),i<o&&(o=i,n=a)}return n}}),o=(q.Patterns,q.isValid,q.getPenaltyN1,q.getPenaltyN2,q.getPenaltyN3,q.getPenaltyN4,q.applyMask,q.getBestMask,[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81]),i=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430],et=function(t,e){switch(e){case g.L:return o[4*(t-1)+0];case g.M:return o[4*(t-1)+1];case g.Q:return o[4*(t-1)+2];case g.H:return o[4*(t-1)+3];default:return}},j=function(t,e){switch(e){case g.L:return i[4*(t-1)+0];case g.M:return i[4*(t-1)+1];case g.Q:return i[4*(t-1)+2];case g.H:return i[4*(t-1)+3];default:return}},u=new Uint8Array(512),s=new Uint8Array(256),h=1,f=0;f<255;f++)u[f]=h,s[h]=f,256&(h<<=1)&&(h^=285);for(var c=255;c<512;c++)u[c]=u[c-255];function b(t,e){return 0===t||0===e?0:u[s[t]+s[e]]}var d=e(function(t,n){n.mul=function(t,e){for(var r=new Uint8Array(t.length+e.length-1),n=0;n<t.length;n++)for(var o=0;o<e.length;o++)r[n+o]^=b(t[n],e[o]);return r},n.mod=function(t,e){for(var r=new Uint8Array(t);0<=r.length-e.length;){for(var n=r[0],o=0;o<e.length;o++)r[o]^=b(e[o],n);for(var a=0;a<r.length&&0===r[a];)a++;r=r.slice(a)}return r},n.generateECPolynomial=function(t){for(var e=new Uint8Array([1]),r=0;r<t;r++)e=n.mul(e,new Uint8Array([1,u[r]]));return e}});function l(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}d.mul,d.mod,d.generateECPolynomial,l.prototype.initialize=function(t){this.degree=t,this.genPoly=d.generateECPolynomial(this.degree)},l.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");var e,r=new Uint8Array(t.length+this.degree),t=(r.set(t),d.mod(r,this.genPoly)),r=this.degree-t.length;return 0<r?((e=new Uint8Array(this.degree)).set(t,r),e):t};function p(t){return!isNaN(t)&&1<=t&&t<=40}function U(t,e){for(var r=(t=t.bit<<3|e)<<10;0<=n(r)-S;)r^=1335<<n(r)-S;return 21522^(t<<10|r)}var rt=l,v="(?:(?![A-Z0-9 $%*+\\-./:]|"+(P="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+".replace(/u/g,"\\u"))+")(?:.|[\r\n]))+",w=new RegExp(P,"g"),m=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),v=new RegExp(v,"g"),E=new RegExp("[0-9]+","g"),y=new RegExp("[A-Z $%*+\\-./:]+","g"),x=new RegExp("^"+P+"$"),k=new RegExp("^[0-9]+$"),F=new RegExp("^[A-Z0-9 $%*+\\-./:]+$"),A={KANJI:w,BYTE_KANJI:m,BYTE:v,NUMERIC:E,ALPHANUMERIC:y,testKanji:function(t){return x.test(t)},testNumeric:function(t){return k.test(t)},testAlphanumeric:function(t){return F.test(t)}},$=e(function(t,n){n.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},n.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},n.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},n.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},n.MIXED={bit:-1},n.getCharCountIndicator=function(t,e){if(!t.ccBits)throw new Error("Invalid mode: "+t);if(p(e))return 1<=e&&e<10?t.ccBits[0]:e<27?t.ccBits[1]:t.ccBits[2];throw new Error("Invalid version: "+e)},n.getBestModeForData=function(t){return A.testNumeric(t)?n.NUMERIC:A.testAlphanumeric(t)?n.ALPHANUMERIC:A.testKanji(t)?n.KANJI:n.BYTE},n.toString=function(t){if(t&&t.id)return t.id;throw new Error("Invalid mode")},n.isValid=function(t){return t&&t.bit&&t.ccBits},n.from=function(t,e){if(n.isValid(t))return t;try{var r=t;if("string"!=typeof r)throw new Error("Param is not a string");switch(r.toLowerCase()){case"numeric":return n.NUMERIC;case"alphanumeric":return n.ALPHANUMERIC;case"kanji":return n.KANJI;case"byte":return n.BYTE;default:throw new Error("Unknown mode: "+r)}return}catch(t){return e}}}),X=($.NUMERIC,$.ALPHANUMERIC,$.BYTE,$.KANJI,$.MIXED,$.getCharCountIndicator,$.getBestModeForData,$.isValid,e(function(t,f){var r=n(7973);function c(t,e){return $.getCharCountIndicator(t,e)+4}f.from=function(t,e){return p(t)?parseInt(t,10):e},f.getCapacity=function(t,e,r){if(!p(t))throw new Error("Invalid QR Code version");void 0===r&&(r=$.BYTE);e=8*(O[t]-j(t,e));if(r===$.MIXED)return e;var n=e-c(r,t);switch(r){case $.NUMERIC:return Math.floor(n/10*3);case $.ALPHANUMERIC:return Math.floor(n/11*2);case $.KANJI:return Math.floor(n/13);default:$.BYTE;return Math.floor(n/8)}},f.getBestVersionForData=function(t,e){var r,e=g.from(e,g.M);if(Array.isArray(t)){if(1<t.length){var n=t;var o=e;for(var a=1;a<=40;a++)if(function(t,r){var n=0;return t.forEach(function(t){var e=c(t.mode,r);n+=e+t.getBitsLength()}),n}(n,a)<=f.getCapacity(a,o,$.MIXED))return a;return}if(0===t.length)return 1;r=t[0]}else r=t;for(var i=r.mode,u=r.getLength(),s=e,h=1;h<=40;h++)if(u<=f.getCapacity(h,s,i))return h},f.getEncodedBits=function(t){if(!p(t)||t<7)throw new Error("Invalid QR Code version");for(var e=t<<12;0<=n(e)-r;)e^=7973<<n(e)-r;return t<<12|e}})),S=(X.getCapacity,X.getBestVersionForData,X.getEncodedBits,n(1335));function I(t){this.mode=$.NUMERIC,this.data=t.toString()}I.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)},I.prototype.getLength=function(){return this.data.length},I.prototype.getBitsLength=function(){return I.getBitsLength(this.data.length)},I.prototype.write=function(t){for(var e,r,n=0;n+3<=this.data.length;n+=3)e=this.data.substr(n,3),r=parseInt(e,10),t.put(r,10);var o=this.data.length-n;0<o&&(e=this.data.substr(n),r=parseInt(e,10),t.put(r,3*o+1))};var D=I,Y=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function M(t){this.mode=$.ALPHANUMERIC,this.data=t}M.getBitsLength=function(t){return 11*Math.floor(t/2)+t%2*6},M.prototype.getLength=function(){return this.data.length},M.prototype.getBitsLength=function(){return M.getBitsLength(this.data.length)},M.prototype.write=function(t){for(var e=0;e+2<=this.data.length;e+=2){var r=45*Y.indexOf(this.data[e]);r+=Y.indexOf(this.data[e+1]),t.put(r,11)}this.data.length%2&&t.put(Y.indexOf(this.data[e]),6)};var _=M;function N(t){this.mode=$.BYTE,"string"==typeof t&&(t=function(t){for(var e=[],r=t.length,n=0;n<r;n++){var o,a=t.charCodeAt(n);55296<=a&&a<=56319&&n+1<r&&(56320<=(o=t.charCodeAt(n+1))&&o<=57343&&(a=1024*(a-55296)+o-56320+65536,n+=1)),a<128?e.push(a):a<2048?(e.push(a>>6|192),e.push(63&a|128)):a<55296||57344<=a&&a<65536?(e.push(a>>12|224),e.push(a>>6&63|128),e.push(63&a|128)):65536<=a&&a<=1114111?(e.push(a>>18|240),e.push(a>>12&63|128),e.push(a>>6&63|128),e.push(63&a|128)):e.push(239,191,189)}return new Uint8Array(e).buffer}(t)),this.data=new Uint8Array(t)}N.getBitsLength=function(t){return 8*t},N.prototype.getLength=function(){return this.data.length},N.prototype.getBitsLength=function(){return N.getBitsLength(this.data.length)},N.prototype.write=function(t){for(var e=0,r=this.data.length;e<r;e++)t.put(this.data[e],8)};var z=N;function B(t){this.mode=$.KANJI,this.data=t}B.getBitsLength=function(t){return 13*t},B.prototype.getLength=function(){return this.data.length},B.prototype.getBitsLength=function(){return B.getBitsLength(this.data.length)},B.prototype.write=function(t){for(var e=0;e<this.data.length;e++){r=this.data[e];var r=a(r);if(33088<=r&&r<=40956)r-=33088;else{if(!(57408<=r&&r<=60351))throw new Error("Invalid SJIS character: "+this.data[e]+"\nMake sure your charset is UTF-8");r-=49472}t.put(r=192*(r>>>8&255)+(255&r),13)}};var H=B,J=e(function(t){var d={single_source_shortest_paths:function(t,e,r){var n={},o={};o[e]=0;var a,i,u,s,h,f,c,g=d.PriorityQueue.make();for(g.push(e,0);!g.empty();)for(u in i=(a=g.pop()).value,s=a.cost,h=t[i]||{})h.hasOwnProperty(u)&&(f=s+h[u],c=o[u],(void 0===o[u]||f<c)&&(o[u]=f,g.push(u,f),n[u]=i));if(void 0!==r&&void 0===o[r])throw e=["Could not find a path from ",e," to ",r,"."].join(""),new Error(e);return n},extract_shortest_path_from_predecessor_list:function(t,e){for(var r=[],n=e;n;)r.push(n),n=t[n];return r.reverse(),r},find_path:function(t,e,r){t=d.single_source_shortest_paths(t,e,r);return d.extract_shortest_path_from_predecessor_list(t,r)},PriorityQueue:{make:function(t){var e,r=d.PriorityQueue,n={};for(e in t=t||{},r)r.hasOwnProperty(e)&&(n[e]=r[e]);return n.queue=[],n.sorter=t.sorter||r.default_sorter,n},default_sorter:function(t,e){return t.cost-e.cost},push:function(t,e){this.queue.push({value:t,cost:e}),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return 0===this.queue.length}}};t.exports=d}),Z=e(function(t,i){function u(t){return unescape(encodeURIComponent(t)).length}function o(t,e,r){for(var n,o=[];null!==(n=t.exec(r));)o.push({data:n[0],index:n.index,mode:e,length:n[0].length});return o}function s(t){var e,r=o(A.NUMERIC,$.NUMERIC,t),n=o(A.ALPHANUMERIC,$.ALPHANUMERIC,t),t=R()?(e=o(A.BYTE,$.BYTE,t),o(A.KANJI,$.KANJI,t)):(e=o(A.BYTE_KANJI,$.BYTE,t),[]);return r.concat(n,e,t).sort(function(t,e){return t.index-e.index}).map(function(t){return{data:t.data,mode:t.mode,length:t.length}})}function l(t,e){switch(e){case $.NUMERIC:return D.getBitsLength(t);case $.ALPHANUMERIC:return _.getBitsLength(t);case $.KANJI:return H.getBitsLength(t);case $.BYTE:return z.getBitsLength(t)}}function r(t,e){var r=$.getBestModeForData(t);if((e=$.from(e,r))!==$.BYTE&&e.bit<r.bit)throw new Error('"'+t+'" cannot be encoded with mode '+$.toString(e)+".\n Suggested mode is: "+$.toString(r));switch(e=e!==$.KANJI||R()?e:$.BYTE){case $.NUMERIC:return new D(t);case $.ALPHANUMERIC:return new _(t);case $.KANJI:return new H(t);case $.BYTE:return new z(t)}}i.fromArray=function(t){return t.reduce(function(t,e){return"string"==typeof e?t.push(r(e,null)):e.data&&t.push(r(e.data,e.mode)),t},[])},i.fromString=function(t,e){for(var r=function(t,e){for(var r={},n={start:{}},o=["start"],a=0;a<t.length;a++){for(var i=t[a],u=[],s=0;s<i.length;s++){var h=i[s],f=""+a+s;u.push(f),r[f]={node:h,lastCount:0},n[f]={};for(var c=0;c<o.length;c++){var g=o[c];r[g]&&r[g].node.mode===h.mode?(n[g][f]=l(r[g].lastCount+h.length,h.mode)-l(r[g].lastCount,h.mode),r[g].lastCount+=h.length):(r[g]&&(r[g].lastCount=h.length),n[g][f]=l(h.length,h.mode)+4+$.getCharCountIndicator(h.mode,e))}}o=u}for(var d=0;d<o.length;d++)n[o[d]].end=0;return{map:n,table:r}}(function(t){for(var e=[],r=0;r<t.length;r++){var n=t[r];switch(n.mode){case $.NUMERIC:e.push([n,{data:n.data,mode:$.ALPHANUMERIC,length:n.length},{data:n.data,mode:$.BYTE,length:n.length}]);break;case $.ALPHANUMERIC:e.push([n,{data:n.data,mode:$.BYTE,length:n.length}]);break;case $.KANJI:e.push([n,{data:n.data,mode:$.BYTE,length:u(n.data)}]);break;case $.BYTE:e.push([{data:n.data,mode:$.BYTE,length:u(n.data)}])}}return e}(s(t)),e),n=J.find_path(r.map,"start","end"),o=[],a=1;a<n.length-1;a++)o.push(r.table[n[a]].node);return i.fromArray(o.reduce(function(t,e){var r=0<=t.length-1?t[t.length-1]:null;return r&&r.mode===e.mode?t[t.length-1].data+=e.data:t.push(e),t},[]))},i.rawSplit=function(t){return i.fromArray(s(t))}});function nt(t,e,r){for(var n,o=t.size,a=U(e,r),i=0;i<15;i++)n=1==(a>>i&1),i<6?t.set(i,8,n,!0):i<8?t.set(i+1,8,n,!0):t.set(o-15+i,8,n,!0),i<8?t.set(8,o-i-1,n,!0):i<9?t.set(8,15-i-1+1,n,!0):t.set(8,15-i-1,n,!0);t.set(o-8,8,1,!0)}function K(t,e,r,n){var o;if(Array.isArray(t))o=Z.fromArray(t);else{if("string"!=typeof t)throw new Error("Invalid data");var a=e;a||(i=Z.rawSplit(t),a=X.getBestVersionForData(i,r)),o=Z.fromString(t,a||40)}var i=X.getBestVersionForData(o,r);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(e){if(e<i)throw new Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: "+i+".\n")}else e=i;for(var t=function(e,t,r){var n=new W,r=(r.forEach(function(t){n.put(t.mode.bit,4),n.put(t.getLength(),$.getCharCountIndicator(t.mode,e)),t.write(n)}),8*(O[e]-j(e,t)));for(n.getLengthInBits()+4<=r&&n.put(0,4);n.getLengthInBits()%8!=0;)n.putBit(0);for(var o=(r-n.getLengthInBits())/8,a=0;a<o;a++)n.put(a%2?17:236,8);for(var r=n,i=O[f=e],u=i-j(f,t),s=et(f,t),h=s-i%s,f=Math.floor(i/s),c=Math.floor(u/s),g=c+1,d=f-c,l=new rt(d),p=0,v=new Array(s),w=new Array(s),m=0,E=new Uint8Array(r.buffer),y=0;y<s;y++){var A=y<h?c:g;v[y]=E.slice(p,p+A),w[y]=l.encode(v[y]),p+=A,m=Math.max(m,A)}for(var I,M=new Uint8Array(i),N=0,B=0;B<m;B++)for(I=0;I<s;I++)B<v[I].length&&(M[N++]=v[I][B]);for(B=0;B<d;B++)for(I=0;I<s;I++)M[N++]=w[I][B];return M}(e,r,o),a=Q(e),i=new G(a),u=i,a=e,s=u.size,h=tt(a),f=0;f<h.length;f++)for(var c=h[f][0],g=h[f][1],d=-1;d<=7;d++)if(!(c+d<=-1||s<=c+d))for(var l=-1;l<=7;l++)g+l<=-1||s<=g+l||(0<=d&&d<=6&&(0===l||6===l)||0<=l&&l<=6&&(0===d||6===d)||2<=d&&d<=4&&2<=l&&l<=4?u.set(c+d,g+l,!0,!0):u.set(c+d,g+l,!1,!0));for(var p=i,S=p.size,v=8;v<S-8;v++){var w=v%2==0;p.set(v,6,w,!0),p.set(6,v,w,!0)}for(var m=i,E=e,y=V.getPositions(E),A=0;A<y.length;A++)for(var D=y[A][0],Y=y[A][1],I=-2;I<=2;I++)for(var M=-2;M<=2;M++)-2===I||2===I||-2===M||2===M||0===I&&0===M?m.set(D+I,Y+M,!0,!0):m.set(D+I,Y+M,!1,!0);if(nt(i,r,0),7<=e){var N=i;E=e;for(var B,_,z,H=N.size,J=X.getEncodedBits(E),C=0;C<18;C++)B=Math.floor(C/3),N.set(B,_=C%3+H-8-3,z=1==(J>>C&1),!0),N.set(_,B,z,!0)}for(var P=i,K=t,R=P.size,T=-1,L=R-1,b=7,U=0,x=R-1;0<x;x-=2)for(6===x&&x--;;){for(var k,F=0;F<2;F++)P.isReserved(L,x-F)||(k=!1,U<K.length&&(k=1==(K[U]>>>b&1)),P.set(L,x-F,k),-1==--b&&(U++,b=7));if((L+=T)<0||R<=L){L-=T,T=-T;break}}return isNaN(n)&&(n=q.getBestMask(i,nt.bind(null,i,r))),q.applyMask(n,i),nt(i,r,n),{modules:i,version:e,errorCorrectionLevel:r,maskPattern:n,segments:o}}Z.fromArray,Z.fromString,Z.rawSplit;function ot(t,e){if(void 0===t||""===t)throw new Error("No input text");var r,n,o=g.M;if(void 0!==e&&(o=g.from(e.errorCorrectionLevel,g.M),r=X.from(e.version),n=q.from(e.maskPattern),e.toSJISFunc)){if("function"!=typeof(e=e.toSJISFunc))throw new Error('"toSJISFunc" is not a valid function.');a=e}return K(t,r,o,n)}var C=e(function(t,d){function o(t){if("string"!=typeof(t="number"==typeof t?t.toString():t))throw new Error("Color should be defined as hex string");var e=t.slice().replace("#","").split("");if(e.length<3||5===e.length||8<e.length)throw new Error("Invalid hex color: "+t);6===(e=3!==e.length&&4!==e.length?e:Array.prototype.concat.apply([],e.map(function(t){return[t,t]}))).length&&e.push("F","F");t=parseInt(e.join(""),16);return{r:t>>24&255,g:t>>16&255,b:t>>8&255,a:255&t,hex:"#"+e.slice(0,6).join("")}}d.getOptions=function(t){(t=t||{}).color||(t.color={});var e=void 0===t.margin||null===t.margin||t.margin<0?4:t.margin,r=t.width&&21<=t.width?t.width:void 0,n=t.scale||4;return{width:r,scale:r?4:n,margin:e,color:{dark:o(t.color.dark||"#000000ff"),light:o(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}},d.getScale=function(t,e){return e.width&&e.width>=t+2*e.margin?e.width/(t+2*e.margin):e.scale},d.getImageWidth=function(t,e){var r=d.getScale(t,e);return Math.floor((t+2*e.margin)*r)},d.qrToImageData=function(t,e,r){for(var n=e.modules.size,o=e.modules.data,a=d.getScale(n,r),i=Math.floor((n+2*r.margin)*a),u=r.margin*a,s=[r.color.light,r.color.dark],h=0;h<i;h++)for(var f=0;f<i;f++){var c=4*(h*i+f),g=r.color.light;u<=h&&u<=f&&h<i-u&&f<i-u&&(g=s[o[Math.floor((h-u)/a)*n+Math.floor((f-u)/a)]?1:0]),t[c++]=g.r,t[c++]=g.g,t[c++]=g.b,t[c]=g.a}}}),P=(C.getOptions,C.getScale,C.getImageWidth,C.qrToImageData,e(function(t,n){n.render=function(t,e,r){var n=e,e=(void 0!==r||e&&e.getContext||(r=e,e=void 0),e||(n=function(){try{return document.createElement("canvas")}catch(t){throw new Error("You need to specify a canvas element")}}()),r=C.getOptions(r),C.getImageWidth(t.modules.size,r)),o=n.getContext("2d"),a=o.createImageData(e,e);return C.qrToImageData(a.data,t,r),t=n,r=e,o.clearRect(0,0,t.width,t.height),t.style||(t.style={}),t.height=r,t.width=r,t.style.height=r+"px",t.style.width=r+"px",o.putImageData(a,0,0),n},n.renderToDataURL=function(t,e,r){void 0!==r||e&&e.getContext||(r=e,e=void 0),t=n.render(t,e,r=r||{}),e=r.type||"image/png",r=r.rendererOpts||{};return t.toDataURL(e,r.quality)}}));function at(t,e){var r=t.a/255,t=e+'="'+t.hex+'"';return r<1?t+" "+e+'-opacity="'+r.toFixed(2).slice(1)+'"':t}function it(t,e,r){t+=e;return void 0!==r&&(t+=" "+r),t}P.render,P.renderToDataURL;function ut(n,o,a,i,t){var e=[].slice.call(arguments,1),r=e.length,e="function"==typeof e[r-1];if(!(e||"function"==typeof Promise&&Promise.prototype&&Promise.prototype.then))throw new Error("Callback required as last argument");if(!e){if(r<1)throw new Error("Too few arguments provided");return 1===r?(a=o,o=i=void 0):2!==r||o.getContext||(i=a,a=o,o=void 0),new Promise(function(t,e){try{var r=ot(a,i);t(n(r,o,i))}catch(t){e(t)}})}if(r<2)throw new Error("Too few arguments provided");2===r?(t=a,a=o,o=i=void 0):3===r&&(o.getContext&&void 0===t?(t=i,i=void 0):(t=i,i=a,a=o,o=void 0));try{var u=ot(a,i);t(null,n(u,o,i))}catch(n){t(n)}}w=ot,m=ut.bind(null,P.render),v=ut.bind(null,P.renderToDataURL),E=ut.bind(null,function(t,e,r){return t=t,r=r,r=C.getOptions(r),o=t.modules.size,t=t.modules.data,a=o+2*r.margin,i=r.color.light.a?"<path "+at(r.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",t="<path "+at(r.color.dark,"stroke")+' d="'+function(t,e,r){for(var n="",o=0,a=!1,i=0,u=0;u<t.length;u++){var s=Math.floor(u%e),h=Math.floor(u/e);s||a||(a=!0),t[u]?(i++,0<u&&0<s&&t[u-1]||(n+=a?it("M",s+r,.5+h+r):it("m",o,0),o=0,a=!1),s+1<e&&t[u+1]||(n+=it("h",i),i=0)):o++}return n}(t,o,r.margin)+'"/>',o='<svg xmlns="http://www.w3.org/2000/svg" '+(r.width?'width="'+r.width+'" height="'+r.width+'" ':"")+('viewBox="0 0 '+a+" "+a+'"')+' shape-rendering="crispEdges">'+i+t+"</svg>\n","function"==typeof n&&n(null,o),o;var n,o,a,i}),y={create:w,toCanvas:m,toDataURL:v,toString:E};return t.create=w,t.default=y,t.toCanvas=m,t.toDataURL=v,t.toString=E,Object.defineProperty(t,"__esModule",{value:!0}),t}({});

// bilising.user.js

(function() {
    'use strict';

    const headerContentController = {
        originalText: '',
        temporaryContentTimer: null,
        setOriginalText: function(content) {
            this.originalText = content;
            if (this.temporaryContentTimer === null) {
                document.getElementById('bilising-header-content').textContent = content;
            }
        },
        setTemporaryText: function(content, duration = 5000) {
            if (this.temporaryContentTimer) {
                clearTimeout(this.temporaryContentTimer);
            }
            document.getElementById('bilising-header-content').textContent = content;
            this.temporaryContentTimer = setTimeout(() => {
                this.temporaryContentTimer = null;
                document.getElementById('bilising-header-content').textContent = this.originalText;
            }, duration);
        }
    }

    function batchAddToFavList(bvList) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const favTitle = `BiliSing ${year}${month}${day}`;
      const favIntro = `BiliSing 自动添加收藏夹 - ${year}-${month}-${day} ${hour}:${minute}`;
      const favPrivacy = 1; // 0: 公开, 1: 自己可见

      // 🍪 获取 csrf_token
      function getCsrf() {
          return document.cookie.match(/bili_jct=([^;]+)/)?.[1] ?? '';
      }

      // 🔧 通用 fetch 请求封装（自动附带 Cookie）
      async function doPost(url, bodyObj) {
          const body = new URLSearchParams(bodyObj);
          const res = await fetch(url, {
              method: 'POST',
              credentials: 'include', // 🚨 关键：带上 Cookie
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Referer': 'https://www.bilibili.com/',
              },
              body: body.toString()
          });
          return await res.json();
      }

      // 🛠 创建收藏夹
      async function createFavFolder(title, intro, privacy) {
          const csrf = getCsrf();
          if (!csrf) throw new Error('未获取到 csrf，可能未登录');
          const res = await doPost('https://api.bilibili.com/x/v3/fav/folder/add', {
              title,
              intro,
              privacy: String(privacy),
              csrf
          });
          if (res.code === 0) {
              headerContentController.setTemporaryText(`✅ 收藏夹创建成功: ${title}, 待添加视频`, 60000);
              return res.data.id;
          } else {
              throw new Error(`❌ 创建失败: ${res.message}`);
          }
      }

      // 🔄 BV号转aid
      async function bv2aid(bv) {
          const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`, {
              credentials: 'include'
          });
          const json = await res.json();
          if (json.code !== 0) throw new Error(`❌ 无法解析BV号: ${bv}`);
          return json.data.aid;
      }

      // ➕ 添加视频到收藏夹
      async function addToFav(aid, favId) {
          const csrf = getCsrf();
          const res = await doPost('https://api.bilibili.com/x/v3/fav/resource/deal', {
              rid: aid,
              type: '2',
              add_media_ids: favId,
              csrf
          });
          if (res.code === 0) {
              headerContentController.setTemporaryText(`✅ 成功添加 aid=${aid}`, 60000);
          } else {
              headerContentController.setTemporaryText(`❌ 添加失败 aid=${aid}: ${res.message}`, 60000);
          }
      }

      // 🚀 主程序
      (async function () {
          try {
              headerContentController.setTemporaryText(`🔄 开始批量收藏 ${bvList.length} 个视频...`, 60000);
              const favId = await createFavFolder(favTitle, favIntro, favPrivacy);
              for (const bv of bvList) {
                  try {
                      const aid = await bv2aid(bv);
                      await addToFav(aid, favId);
                      await new Promise(r => setTimeout(r, 500)); // 防止触发风控
                  } catch (e) {
                      console.error(`处理 BV ${bv} 时出错:`, e);
                      headerContentController.setTemporaryText(`❌ 处理 BV ${bv} 失败: ${e.message}`, 60000);
                  }
              }
              headerContentController.setTemporaryText('🎉 完成所有添加任务', 5000);
          } catch (e) {
              console.error('批量添加收藏夹出错:', e);
              headerContentController.setTemporaryText('❌ 出错且无法继续执行:', 60000);
          }
      })();
    }

    let socket;
    let currentRoom = null;
    let currentUser = '播放设备';
    let currentUserType = 'master';
    let isConnected = false;
    let currentPlaying = null;
    let played_songs = [];
    let play_list = [];
    let nextSong = null;

    // 创建浮窗HTML
    function createFloatingWindow() {
        if (!location.href.includes('bilibili.com')) return;
        if (!sessionStorage.getItem('bilising-room-id') && !location.href.includes('bilising-room-id')) return;
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'bilising-float';
        floatingWindow.classList.add("bilising-collapsed");
        floatingWindow.style.opacity = '0.8';
        floatingWindow.innerHTML = `
            <div id="bilising-header">
                <span id="bilising-header-content">🎤 BiliSing</span>
                <button id="bilising-toggle">+</button>
            </div>
            <div id="bilising-content">
                <div id="bilising-roomInfo">
                  <div id="bilising-connection">
                      <input type="text" id="bilising-room-id" placeholder="房间ID" value="">
                      <button id="bilising-connect">连接</button>
                      <span id="bilising-status">未连接</span>
                  </div>
                  <div id="bilising-controls" style="display: none;">
                      <div id="bilising-current">
                          <strong>正在播放：</strong>
                          <div id="bilising-current-song">暂无歌曲</div>
                      </div>
                      <div id="bilising-next">
                          <strong>下一首：</strong>
                          <div id="bilising-next-song">暂无歌曲</div>
                      </div>
                      <button id="bilising-play-next">播放下一首</button>
                      <button id="bilising-batch-add-fav">批量添加收藏夹</button>
                  </div>
                </div>
                <div id="bilising-roomQR-section">
                  <strong id="bilising-noqr-text">二维码未生成，请先连接到一个房间。</strong>
                  <div id="bilising-qr-code" style="display: none;">
                      <canvas id="bilising-qr-image" alt="房间二维码"></canvas>
                      <p>扫码点歌</p>
                  </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #bilising-float {
                position: fixed;
                top: 20px;
                left: 20px;
                width: calc(100vw - 40px);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                z-index: 1145141919810;
                font-size: 1.3em;
            }
            
            #bilising-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: rgba(0, 174, 236, 0.8);
                border-radius: 8px 8px 0 0;
                cursor: move;
                font-weight: bold;
            }
            
            #bilising-toggle {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            
            #bilising-content {
                padding: 12px;
                display: flex;
            }

            #bilising-content {
                padding: 12px;
                display: flex;
            }
            
            #bilising-content > div {
                flex: 1;
            }
            
            #bilising-connection {
                margin-bottom: 12px;
            }
            
            #bilising-connection input {
                width: 120px;
                padding: 4px 6px;
                border: 1px solid #ccc;
                border-radius: 4px;
                margin-right: 6px;
                font-size: 12px;
                color: black;
            }
            
            #bilising-connection button {
                padding: 4px 12px;
                background: #00aeec;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            #bilising-connection button:hover {
                background: #0099d4;
            }
            
            #bilising-status {
                display: block;
                margin-top: 6px;
                font-size: 11px;
                color: #ccc;
            }
            
            #bilising-controls div {
                margin-bottom: 8px;
                padding: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            #bilising-controls strong {
                display: block;
                margin-bottom: 4px;
                color: #00aeec;
            }
            
            #bilising-current-song, #bilising-next-song {
                font-size: 11px;
                line-height: 1.3;
                color: #fff;
            }
            
            #bilising-play-next,#bilising-batch-add-fav {
                width: 100%;
                padding: 8px;
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
            }
            
            #bilising-play-next:hover,#bilising-batch-add-fav:hover {
                background: #ff5252;
            }

            #bilising-play-next:disabled,#bilising-batch-add-fav:disabled {
                background: #666;
                cursor: not-allowed;
            }

            #bilising-batch-add-fav { margin-top: 8px; }

            div#bilising-roomQR-section {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            div#bilising-qr-code {
                text-align: center;
            }
            
            .bilising-collapsed #bilising-content {
                display: none;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(floatingWindow);

        // 添加拖拽功能
        makeDraggable(floatingWindow);
        
        // 添加事件监听器
        setupEventListeners();
        
        // 恢复上次的房间ID
        let lastRoomId = sessionStorage.getItem('bilising-room-id');
        const urlParams = new URLSearchParams(window.location.search);
        if (!lastRoomId) {
          lastRoomId = urlParams.get('bilising-room-id');
          if (lastRoomId) {
              sessionStorage.setItem('bilising-room-id', lastRoomId);
          }
        }
        if (lastRoomId) {
          document.getElementById('bilising-room-id').value = lastRoomId;
          document.getElementById('bilising-connect').click();
        }
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 折叠/展开
        document.getElementById('bilising-toggle').addEventListener('click', function() {
            const floatWindow = document.getElementById('bilising-float');
            floatWindow.classList.toggle('bilising-collapsed');
            this.textContent = floatWindow.classList.contains('bilising-collapsed') ? '+' : '−';
        });

        // 连接按钮
        document.getElementById('bilising-connect').addEventListener('click', function() {
            const roomId = document.getElementById('bilising-room-id').value.trim();
            if (!roomId) {
                alert('请输入房间ID');
                return;
            }
            
            if (isConnected) {
                disconnectSocket();
            } else {
                connectToRoom(roomId);
            }
        });

        // 播放下一首按钮
        document.getElementById('bilising-play-next').addEventListener('click', function() {
            if (socket && isConnected && currentRoom) {
                socket.emit('next_song', {
                    room_id: currentRoom,
                    user_name: currentUser
                });
            }
        });
        document.getElementById('bilising-batch-add-fav').addEventListener('click', function() {
            const listAll = played_songs.concat(play_list);
            if (listAll.length > 0) {
                const uniqueBvList = [...listAll.map(song => extractBVId(song.url)).filter(bv => bv)];
                if (uniqueBvList.length > 0) {
                    batchAddToFavList(uniqueBvList);
                    return;
                }
            }
            headerContentController.setTemporaryText('没有可添加的歌曲', 5000);
        });

        // 回车键连接
        document.getElementById('bilising-room-id').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('bilising-connect').click();
            }
        });
    }

    // 连接到房间
    function connectToRoom(roomId) {
        try {
            // 保存房间ID
            sessionStorage.setItem('bilising-room-id', roomId);
            
            // 初始化Socket.IO连接
            socket = io(myURL);
            
            // 设置Socket事件监听器
            setupSocketListeners();
            
            // 更新状态
            updateStatus('连接中...');
            
            // 加入房间
            socket.emit('join_room', {
                room_id: roomId,
                user_name: currentUser,
                user_type: currentUserType
            });
            
            currentRoom = roomId;
            
        } catch (error) {
            console.error('连接失败:', error);
            updateStatus('连接失败');
        }
    }

    // 断开连接
    function disconnectSocket() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        isConnected = false;
        currentRoom = null;
        updateStatus('未连接');
        document.getElementById('bilising-connect').textContent = '连接';
        document.getElementById('bilising-controls').style.display = 'none';
        document.getElementById('bilising-noqr-text').style.display = 'block';
        document.getElementById('bilising-qr-code').style.display = 'none';
        sessionStorage.removeItem('bilising-room-id');
    }

    // 设置Socket事件监听器
    function setupSocketListeners() {
        socket.on('connect', function() {
            console.log('Socket.IO连接成功');
        });

        socket.on('room_joined', function(data) {
            isConnected = true;
            updateStatus(`已连接到房间: ${currentRoom}`);
            document.getElementById('bilising-noqr-text').style.display = 'none';
            document.getElementById('bilising-qr-code').style.display = 'block';

            // use node-qrcode to generate QR code
            const maxWidth = 480 / (window.devicePixelRatio || 1);
            const width = Math.min(maxWidth, ((window.visualViewport ? window.visualViewport.width : window.innerWidth) - 40) * .4);
            QRCode.toCanvas(document.getElementById('bilising-qr-image'), `${myURL}/?bilising-room-id=${currentRoom}`, {
                width: width,
                margin: 1,
                errorCorrectionLevel: 'H',
            });

            document.getElementById('bilising-connect').textContent = '断开';
            document.getElementById('bilising-controls').style.display = 'block';
            
            // 更新当前播放和下一首
            updateCurrentPlaying(data.current_playing);
            updateNextSong(data.play_list);
            played_songs = data.played_songs || [];
        });

        socket.on('now_playing', function(data) {
            updateCurrentPlaying(data.current_playing);
        });

        socket.on('playlist_updated', function(data) {
            updateNextSong(data.play_list);
            played_songs = data.played_songs || [];
            console.warn('播放列表已更新:', played_songs);
        });

        socket.on('error', function(data) {
            console.error('Socket错误:', data.message);
            updateStatus('错误: ' + data.message);
        });

        socket.on('disconnect', function() {
            isConnected = false;
            updateStatus('连接断开');
            document.getElementById('bilising-connect').textContent = '连接';
            document.getElementById('bilising-controls').style.display = 'none';
        });

        socket.on('new_message', function(data) {
            if (!data.message) return;
            const message = data.message;
            let msgText;
            if (message.message_type === "system") {
              msgText = `${message.user_name} ${message.content}`;
            } else {
              msgText = `${message.user_name} 说: ${message.content}`;
            }
            headerContentController.setTemporaryText(msgText);
        });
    }

    // 更新状态显示
    function updateStatus(status) {
        document.getElementById('bilising-status').textContent = status;
    }

    // 更新当前播放
    async function updateCurrentPlaying(song) {
        currentPlaying = song;
        const currentSongElement = document.getElementById('bilising-current-song');
        
        if (song && song.title) {
            currentSongElement.innerHTML = `
                <div>${song.title}</div>
                <div style="color: #ccc; font-size: 10px;">UP主: ${song.producer}</div>
            `;
            
            // 如果当前页面不是播放该视频，则导航到该视频
            if (song.url && !window.location.href.includes(extractBVId(song.url))) {
                navigateToVideo(song.url);
            }
        } else {
            currentSongElement.textContent = '暂无歌曲';
            headerContentController.setOriginalText('已播放完所有歌曲，正在重复播放最后一首，请扫码点歌');
            const floatWindow = document.getElementById('bilising-float');
            floatWindow.classList.remove('bilising-collapsed');
            return;
        }

        function untilPlayer() {
            return new Promise(resolve => {
                let timer = setTimeout(() => {
                    if(document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-web")) {
                        resolve();
                        return;
                    }
                    timer = setTimeout(() => resolve(untilPlayer()), 1000);
                }, 500);
            });
        }
        await untilPlayer();
        try { await player.setAutoplay(false); } catch(e) { console.warn('设置自动播放失败:', e); }
        try { await player.seek(0); } catch(e) { console.warn('设置播放位置失败:', e); }
        try { await player.setPlaybackRate(1); } catch(e) { console.warn('设置播放速度失败:', e); }
        try { await player.setLoop(true); } catch(e) { console.warn('设置循环播放失败:', e); }
        try { await player.setMuted(false); } catch(e) { console.warn('设置静音失败:', e); }
        try { await player.play(); } catch(e) { console.warn('播放失败:', e); }
        try { document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-web").click(); } catch(e) { console.warn('全屏失败:', e); }
        document.querySelector("#bilibili-player video").onended = () => {
            setTimeout(()=>document.querySelector(".bpx-player-ending-related-item-cancel").click(), 1000);
            document.getElementById('bilising-play-next').click();
        }
    }

    // 更新下一首歌曲
    function updateNextSong(playlist) {
        play_list = playlist || [];
        const nextSongElement = document.getElementById('bilising-next-song');
        const playNextButton = document.getElementById('bilising-play-next');
        
        if (playlist && playlist.length > 0) {
            nextSong = playlist[0];
            nextSongElement.innerHTML = `
                <div>${nextSong.title}</div>
                <div style="color: #ccc; font-size: 10px;">UP主: ${nextSong.producer}</div>
            `;
            headerContentController.setOriginalText(`下一首: ${nextSong.title}; 正播放: ${currentPlaying ? currentPlaying.title : '暂无歌曲'}`);
        } else {
            nextSong = null;
            nextSongElement.textContent = '暂无歌曲';
            headerContentController.setOriginalText('已是最后一首歌曲; 正播放: ' + (currentPlaying ? currentPlaying.title : '暂无歌曲'));
        }
    }

    // 提取BV号
    function extractBVId(url) {
        const match = url.match(/BV[\w]+/);
        return match ? match[0] : null;
    }

    // 导航到视频
    function navigateToVideo(url) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);

        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        anchor.dispatchEvent(clickEvent);
        // if (location.href.includes("/video/")) {
        //     document.querySelector("a[href^='/video/'].video-awesome-img img").click()
        //     setTimeout(() => {
        //         // const newUrl = url.replace(/http(s)?:\/\/(www\.)?bilibili\.com/, '');
        //         // console.warn(newUrl)
        //         const bvId = extractBVId(url);
        //         if (bvId) {
        //             const targetUrl = `/video/${bvId}`;
        //             history.pushState(null, '', targetUrl);
        //             window.dispatchEvent(new Event('popstate'));
        //         }
        //     }, 1000);
        // } else {
        //     location.href = url;
        // }
        
    }

    // 使浮窗可拖拽
    function makeDraggable(element) {
        const header = element.querySelector('#bilising-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.id === 'bilising-toggle') return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragMove(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // 页面加载完成后创建浮窗
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWindow);
    } else {
        createFloatingWindow();
    }

})();

if (typeof GM_info !== 'undefined' && location.href.includes(myURL)) {
  window.__BILISING_USERSCRIPT_ENABLED__ = true;
}