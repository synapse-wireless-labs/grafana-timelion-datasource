/*! For license information please see module.js.LICENSE.txt */
define(["react","@grafana/data","@grafana/ui","@grafana/runtime"],(function(t,e,n,r){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=51)}([function(e,n){e.exports=t},function(t,n){t.exports=e},function(t,e){t.exports=n},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},function(t,e){t.exports=r},function(t,e,n){var r=n(10),o=n(28),a=n(29),i=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":i&&i in Object(t)?o(t):a(t)}},function(t,e,n){var r=n(11),o="object"==typeof self&&self&&self.Object===Object&&self,a=r||o||Function("return this")();t.exports=a},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}},function(t,e){t.exports=function(t){return t}},function(t,e,n){var r=n(5),o=n(3);t.exports=function(t){if(!o(t))return!1;var e=r(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e}},function(t,e,n){var r=n(6).Symbol;t.exports=r},function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(this,n(27))},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e}},function(t,e,n){var r=n(9),o=n(14);t.exports=function(t){return null!=t&&o(t.length)&&!r(t)}},function(t,e){t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}},function(t,e){var n=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var r=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==r||"symbol"!=r&&n.test(t))&&t>-1&&t%1==0&&t<e}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,n){var r=n(18),o=n(12),a=n(35),i=n(36),u=Object.prototype,c=u.hasOwnProperty,s=r((function(t,e){t=Object(t);var n=-1,r=e.length,s=r>2?e[2]:void 0;for(s&&a(e[0],e[1],s)&&(r=1);++n<r;)for(var f=e[n],l=i(f),p=-1,y=l.length;++p<y;){var b=l[p],v=t[b];(void 0===v||o(v,u[b])&&!c.call(t,b))&&(t[b]=f[b])}return t}));t.exports=s},function(t,e,n){var r=n(8),o=n(19),a=n(21);t.exports=function(t,e){return a(o(t,e,r),t+"")}},function(t,e,n){var r=n(20),o=Math.max;t.exports=function(t,e,n){return e=o(void 0===e?t.length-1:e,0),function(){for(var a=arguments,i=-1,u=o(a.length-e,0),c=Array(u);++i<u;)c[i]=a[e+i];i=-1;for(var s=Array(e+1);++i<e;)s[i]=a[i];return s[e]=n(c),r(t,this,s)}}},function(t,e){t.exports=function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}},function(t,e,n){var r=n(22),o=n(34)(r);t.exports=o},function(t,e,n){var r=n(23),o=n(24),a=n(8),i=o?function(t,e){return o(t,"toString",{configurable:!0,enumerable:!1,value:r(e),writable:!0})}:a;t.exports=i},function(t,e){t.exports=function(t){return function(){return t}}},function(t,e,n){var r=n(25),o=function(){try{var t=r(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=o},function(t,e,n){var r=n(26),o=n(33);t.exports=function(t,e){var n=o(t,e);return r(n)?n:void 0}},function(t,e,n){var r=n(9),o=n(30),a=n(3),i=n(32),u=/^\[object .+?Constructor\]$/,c=Function.prototype,s=Object.prototype,f=c.toString,l=s.hasOwnProperty,p=RegExp("^"+f.call(l).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!a(t)||o(t))&&(r(t)?p:u).test(i(t))}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){var r=n(10),o=Object.prototype,a=o.hasOwnProperty,i=o.toString,u=r?r.toStringTag:void 0;t.exports=function(t){var e=a.call(t,u),n=t[u];try{t[u]=void 0;var r=!0}catch(t){}var o=i.call(t);return r&&(e?t[u]=n:delete t[u]),o}},function(t,e){var n=Object.prototype.toString;t.exports=function(t){return n.call(t)}},function(t,e,n){var r,o=n(31),a=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";t.exports=function(t){return!!a&&a in t}},function(t,e,n){var r=n(6)["__core-js_shared__"];t.exports=r},function(t,e){var n=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]}},function(t,e){var n=Date.now;t.exports=function(t){var e=0,r=0;return function(){var o=n(),a=16-(o-r);if(r=o,a>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}},function(t,e,n){var r=n(12),o=n(13),a=n(15),i=n(3);t.exports=function(t,e,n){if(!i(n))return!1;var u=typeof e;return!!("number"==u?o(n)&&a(e,n.length):"string"==u&&e in n)&&r(n[e],t)}},function(t,e,n){var r=n(37),o=n(48),a=n(13);t.exports=function(t){return a(t)?r(t,!0):o(t)}},function(t,e,n){var r=n(38),o=n(39),a=n(41),i=n(42),u=n(15),c=n(44),s=Object.prototype.hasOwnProperty;t.exports=function(t,e){var n=a(t),f=!n&&o(t),l=!n&&!f&&i(t),p=!n&&!f&&!l&&c(t),y=n||f||l||p,b=y?r(t.length,String):[],v=b.length;for(var h in t)!e&&!s.call(t,h)||y&&("length"==h||l&&("offset"==h||"parent"==h)||p&&("buffer"==h||"byteLength"==h||"byteOffset"==h)||u(h,v))||b.push(h);return b}},function(t,e){t.exports=function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}},function(t,e,n){var r=n(40),o=n(7),a=Object.prototype,i=a.hasOwnProperty,u=a.propertyIsEnumerable,c=r(function(){return arguments}())?r:function(t){return o(t)&&i.call(t,"callee")&&!u.call(t,"callee")};t.exports=c},function(t,e,n){var r=n(5),o=n(7);t.exports=function(t){return o(t)&&"[object Arguments]"==r(t)}},function(t,e){var n=Array.isArray;t.exports=n},function(t,e,n){(function(t){var r=n(6),o=n(43),a=e&&!e.nodeType&&e,i=a&&"object"==typeof t&&t&&!t.nodeType&&t,u=i&&i.exports===a?r.Buffer:void 0,c=(u?u.isBuffer:void 0)||o;t.exports=c}).call(this,n(16)(t))},function(t,e){t.exports=function(){return!1}},function(t,e,n){var r=n(45),o=n(46),a=n(47),i=a&&a.isTypedArray,u=i?o(i):r;t.exports=u},function(t,e,n){var r=n(5),o=n(14),a=n(7),i={};i["[object Float32Array]"]=i["[object Float64Array]"]=i["[object Int8Array]"]=i["[object Int16Array]"]=i["[object Int32Array]"]=i["[object Uint8Array]"]=i["[object Uint8ClampedArray]"]=i["[object Uint16Array]"]=i["[object Uint32Array]"]=!0,i["[object Arguments]"]=i["[object Array]"]=i["[object ArrayBuffer]"]=i["[object Boolean]"]=i["[object DataView]"]=i["[object Date]"]=i["[object Error]"]=i["[object Function]"]=i["[object Map]"]=i["[object Number]"]=i["[object Object]"]=i["[object RegExp]"]=i["[object Set]"]=i["[object String]"]=i["[object WeakMap]"]=!1,t.exports=function(t){return a(t)&&o(t.length)&&!!i[r(t)]}},function(t,e){t.exports=function(t){return function(e){return t(e)}}},function(t,e,n){(function(t){var r=n(11),o=e&&!e.nodeType&&e,a=o&&"object"==typeof t&&t&&!t.nodeType&&t,i=a&&a.exports===o&&r.process,u=function(){try{var t=a&&a.require&&a.require("util").types;return t||i&&i.binding&&i.binding("util")}catch(t){}}();t.exports=u}).call(this,n(16)(t))},function(t,e,n){var r=n(3),o=n(49),a=n(50),i=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return a(t);var e=o(t),n=[];for(var u in t)("constructor"!=u||!e&&i.call(t,u))&&n.push(u);return n}},function(t,e){var n=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||n)}},function(t,e){t.exports=function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}},function(t,e,n){"use strict";n.r(e);var r=n(1),o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)};function a(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}var i=function(){return(i=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function u(t,e,n,r){return new(n||(n=Promise))((function(o,a){function i(t){try{c(r.next(t))}catch(t){a(t)}}function u(t){try{c(r.throw(t))}catch(t){a(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}c((r=r.apply(t,e||[])).next())}))}function c(t,e){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=e.call(t,i)}catch(t){a=[6,t],r=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}}var s=n(4),f={target:".es()"},l=function(t){function e(e){var n=t.call(this,e)||this;return n.basicAuth=e.basicAuth,n.withCredentials=e.withCredentials,n.url=e.url,n.esVersion=e.jsonData.esVersion,n}return a(e,t),e.prototype.query=function(t){return u(this,void 0,Promise,(function(){var e,n=this;return c(this,(function(r){switch(r.label){case 0:return e=t.targets.filter((function(t){return t.target!==f.target&&!t.hide})),[4,Promise.all(e.map((function(e){return n.runQuery(e,t)})))];case 1:return[2,{data:r.sent()}]}}))}))},e.prototype.runQuery=function(t,e){return u(this,void 0,Promise,(function(){var n=this;return c(this,(function(r){return[2,this.post({sheet:[Object(s.getTemplateSrv)().replace(t.target,e.scopedVars,"lucene")],time:{timezone:e.range.from.format("ZZ"),from:e.range.from.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),interval:t.interval||e.interval,mode:"absolute",to:e.range.to.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ")}}).then((function(e){return n.toTimeLionDataFrame(t,e.data.sheet[0].list[0])}))]}))}))},e.prototype.toTimeLionDataFrame=function(t,e){var n={name:"Time",type:r.FieldType.time,config:{},values:new r.ArrayVector},o={name:e.label||"Value",type:r.FieldType.number,config:{},values:new r.ArrayVector};return{refId:t.refId,name:e.label,fields:e.data.reduce((function(t,e){return t[0].values.add(e[0]),t[1].values.add(e[1]),t}),[n,o]),length:e.data.length}},e.prototype.interpolateVariablesInQueries=function(t,e){var n=this;return t.map((function(t){return i(i({},t),{datasource:n.name,target:Object(s.getTemplateSrv)().replace(t.target,e,"lucene")})}))},e.prototype.testDatasource=function(){return u(this,void 0,void 0,(function(){return c(this,(function(t){switch(t.label){case 0:return[4,this.post({time:{from:"now-1s",to:"now",interval:"1s"}})];case 1:return 200===t.sent().status?[2,{status:"success",message:"Data source is working",title:"Success"}]:[2,{status:"error",message:"Data source is not working",title:"Error"}]}}))}))},e.prototype.post=function(t){return u(this,void 0,Promise,(function(){var e;return c(this,(function(n){return(e={url:this.url+"/run",method:"POST",data:t}).headers=i({"Content-Type":"application/json","kbn-version":this.esVersion},this.basicAuth?{Authorization:this.basicAuth}:{}),(this.basicAuth||this.withCredentials)&&(e.withCredentials=!0),[2,Object(s.getBackendSrv)().datasourceRequest(e)]}))}))},e}(r.DataSourceApi),p=n(0),y=n.n(p),b=n(2),v=b.LegacyForms.FormField,h=n(17),d=n.n(h),g=b.LegacyForms.FormField,m=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.onTargetChange=function(t){var n=e.props,r=n.onChange,o=n.query;r(i(i({},o),{target:t.target.value}))},e}return a(e,t),e.prototype.render=function(){var t=d()(this.props.query,f).target;return y.a.createElement("div",{className:"gf-form"},y.a.createElement(g,{labelWidth:8,inputWidth:32,value:t||"",onChange:this.onTargetChange,label:"Expression",tooltip:"Timelion expression"}))},e}(p.PureComponent);n.d(e,"plugin",(function(){return j}));var j=new r.DataSourcePlugin(l).setConfigEditor((function(t){var e=t.options,n=t.onOptionsChange;Object(p.useEffect)((function(){n(e)}),[]);return y.a.createElement(y.a.Fragment,null,y.a.createElement(b.DataSourceHttpSettings,{defaultUrl:"http://localhost:3100",dataSourceConfig:e,showAccessOptions:!0,onChange:function(t){n(i(i({},e),{jsonData:i(i({},e.jsonData),t.jsonData)}))}}),y.a.createElement("h3",{className:"page-heading"},"Other settings"),y.a.createElement("div",{className:"gf-form-group"},y.a.createElement("div",{className:"gf-form-inline"},y.a.createElement("div",{className:"gf-form max-width-25"},y.a.createElement(v,{labelWidth:10,inputWidth:15,label:"Kibana Version",value:e.jsonData.esVersion||"",onChange:function(t){n(i(i({},e),{jsonData:i(i({},e.jsonData),{esVersion:t.target.value})}))},placeholder:"7.0.0",required:!0})))))})).setQueryEditor(m)}])}));
//# sourceMappingURL=module.js.map