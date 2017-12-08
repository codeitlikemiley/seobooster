webpackJsonp([4],{

/***/ 626:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 641:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(819)
/* template */
var __vue_template__ = __webpack_require__(839)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\pages\\Reports.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-277ee418", Component.options)
  } else {
    hotAPI.reload("data-v-277ee418", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 649:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(658)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 650:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Export the Any Component
 */
/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            darkClass: App.theme.dark,
            primaryClass: App.theme.primary,
            accentClass: App.theme.accent,
            secondaryClass: App.theme.secondary,
            infoClass: App.theme.info,
            warningClass: App.theme.warning,
            errorClass: App.theme.error,
            successClass: App.theme.success,
            toggleBarStyle: App.site.toggleBarStyle,
            titleStyle: App.site.titleStyle,
            navbarStyle: App.site.navbarStyle,
            footerStyle: App.site.footerStyle,
            sidebarStyle: App.site.sidebarStyle,
            domain: App.site.domain,
            year: new Date().getFullYear(),
            trademark: App.site.trademark,
            logo: App.site.logo.url,
            logoStyle: {
                width: App.site.logo.width,
                height: App.site.logo.height
            },
            showLogo: App.site.logo.show,
            showIcon: App.site.icon.show,
            icon: App.site.icon.name ? App.site.icon.name : null,
            iconColor: App.site.icon.color,
            title: App.site.trademark
        };
    },
    computed: {
        isDark: function isDark() {
            return this.darkClass === true;
        }
    }

});

/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(665)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(667)
/* template */
var __vue_template__ = __webpack_require__(668)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0af594a9"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\VLink.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0af594a9", Component.options)
  } else {
    hotAPI.reload("data-v-0af594a9", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(654);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 653:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        isLoggedIn: function isLoggedIn() {
            return !!this.$store.state.auth.isAuthenticated;
        },
        hasRole: function hasRole(payload) {
            var me = this.$store.getters['auth/getMe'];
            return _.includes(me.roles, payload);
        },
        hasPermission: function hasPermission(payload) {
            var me = this.$store.getters['auth/getMe'];
            return _.includes(me.permissions, payload);
        },
        hasAnyPermission: function hasAnyPermission(permissions) {
            var me = this.$store.getters['auth/getMe'];
            return permissions.some(function (p) {
                return me.permissions.includes(p);
            });
        },
        hasAnyRole: function hasAnyRole(roles) {
            var me = this.$store.getters['auth/getMe'];
            return roles.some(function (r) {
                return me.roles.includes(r);
            });
        },
        hasAllRoles: function hasAllRoles(roles) {
            var me = this.$store.getters['auth/getMe'];
            return _.difference(roles, me.roles).length === 0;
        },
        hasAllPermissions: function hasAllPermissions(permissions) {
            var me = this.$store.getters['auth/getMe'];
            return _.difference(permissions, me.permissions).length === 0;
        },
        can: function can(permission) {
            return this.$store.getters['auth/getMe'].can[permission];
        }
    }
});

/***/ }),

/***/ 654:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(655), __esModule: true };

/***/ }),

/***/ 655:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(656);
module.exports = __webpack_require__(31).Object.assign;


/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(60);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(657) });


/***/ }),

/***/ 657:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(89);
var gOPS = __webpack_require__(129);
var pIE = __webpack_require__(90);
var toObject = __webpack_require__(315);
var IObject = __webpack_require__(316);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(67)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 658:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 659:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(660)
/* template */
var __vue_template__ = __webpack_require__(685)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\layouts\\Main.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b9f9d6a", Component.options)
  } else {
    hotAPI.reload("data-v-2b9f9d6a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 660:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue__ = __webpack_require__(670);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue__ = __webpack_require__(675);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue__ = __webpack_require__(678);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__partials_CookieLaw_vue__ = __webpack_require__(681);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__partials_CookieLaw_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__partials_CookieLaw_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        AppFooter: __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue___default.a,
        AppNavBar: __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue___default.a,
        LeftSideBar: __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue___default.a,
        FabButton: __WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue___default.a,
        CookieLaw: __WEBPACK_IMPORTED_MODULE_4__partials_CookieLaw_vue___default.a
    }
});

/***/ }),

/***/ 661:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(662)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(664)
/* template */
var __vue_template__ = __webpack_require__(669)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\AppFooter.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d518971e", Component.options)
  } else {
    hotAPI.reload("data-v-d518971e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(663);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("b358074c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d518971e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppFooter.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d518971e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppFooter.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 664:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_theme__ = __webpack_require__(650);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__);
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            footerClass: { 'primary--text': true, 'grey': true, 'darken-4': true }
        };
    },
    created: function created() {
        var _this = this;

        /* Emit On a Child Component If You Want This To Be Visible */
        Bus.$on('footer-content-visible', function (visibility) {
            _this.contentVisible = visibility;
        });
    },

    components: {
        VLink: __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default.a
    }
});

/***/ }),

/***/ 665:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(666);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("75fe3b23", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0af594a9\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VLink.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0af594a9\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VLink.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 666:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n.styleAvatar[data-v-0af594a9] {\n  position: relative;\n  margin-left: -55px;\n}\n", ""]);

// exports


/***/ }),

/***/ 667:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        dark: {
            type: Boolean,
            default: function _default() {
                return App.theme.dark;
            }
        },
        href: {
            type: String
        },
        title: {
            type: String
        },
        avatar: {
            type: String,
            default: function _default() {
                return '';
            }
        },
        icon: {
            type: String
        },
        iconColor: {
            type: String,
            default: function _default() {
                return this.dark ? '#fafafa' : '#78909C'; // white or blue-grey lighten-1
            }
        },
        linkColor: {
            type: String,
            default: function _default() {
                return this.dark ? '#fafafa' : '#78909C'; // white or blue-grey lighten-1
            }
        },
        activeColor: {
            type: String,
            default: function _default() {
                return '#4db6ac'; // teal lighten 2
            }
        }
    },
    computed: {
        isActive: function isActive() {
            return this.href === this.$route.path;
        },
        isDark: function isDark() {
            return this.dark === true;
        },
        avatarOn: function avatarOn() {
            return !!this.avatar;
        },
        iconOn: function iconOn() {
            return !!this.icon;
        }
    },
    methods: {
        navigate: function navigate(href) {
            var self = this;
            /* if valid url */
            if (self.isURL(href)) {
                window.open(href);
            } else {
                /* when using vue router path */
                this.$router.push({ path: '' + href });
            }
        },
        isURL: function isURL(str) {
            var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
            var url = new RegExp(urlRegex, 'i');
            return str.length < 2083 && url.test(str);
        }
    }
});

/***/ }),

/***/ 668:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-list-tile",
    {
      class: [{ styleAvatar: _vm.avatarOn }],
      attrs: { avatar: _vm.avatarOn },
      nativeOn: {
        click: function($event) {
          _vm.navigate(_vm.href)
        }
      }
    },
    [
      _vm.iconOn && !_vm.avatarOn
        ? _c(
            "v-list-tile-action",
            [
              _c(
                "v-icon",
                {
                  style: {
                    color: _vm.isActive ? _vm.activeColor : _vm.iconColor,
                    cursor: _vm.href ? "pointer" : ""
                  }
                },
                [_vm._v(_vm._s(_vm.icon))]
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.iconOn && _vm.avatarOn
        ? _c("v-list-tile-avatar", [
            _c("img", { attrs: { src: _vm.avatar, alt: "" } })
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "v-list-tile-content",
        [
          _c(
            "v-list-tile-title",
            {
              style: { color: _vm.isActive ? _vm.activeColor : _vm.linkColor }
            },
            [
              _c("span", { style: { cursor: _vm.href ? "pointer" : "" } }, [
                _vm._v(_vm._s(_vm.title))
              ])
            ]
          )
        ],
        1
      ),
      _vm._v(" "),
      _vm.iconOn && _vm.avatarOn
        ? _c(
            "v-list-tile-action",
            [
              _c(
                "v-icon",
                {
                  style: {
                    color: _vm.isActive ? _vm.activeColor : _vm.iconColor,
                    cursor: _vm.href ? "pointer" : ""
                  }
                },
                [_vm._v(_vm._s(_vm.icon))]
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0af594a9", module.exports)
  }
}

/***/ }),

/***/ 669:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-footer",
    { class: [_vm.footerClass] },
    [
      _c("v-spacer"),
      _c("span", [
        _vm._v(
          "© " +
            _vm._s(_vm.year) +
            " " +
            _vm._s(_vm.domain) +
            " ® | " +
            _vm._s(_vm.trademark) +
            "™"
        )
      ]),
      _c("v-spacer")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d518971e", module.exports)
  }
}

/***/ }),

/***/ 670:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(671)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(673)
/* template */
var __vue_template__ = __webpack_require__(674)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\AppNavBar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d1431f74", Component.options)
  } else {
    hotAPI.reload("data-v-d1431f74", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 671:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(672);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("3a868879", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1431f74\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppNavBar.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1431f74\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./AppNavBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 672:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 673:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_theme__ = __webpack_require__(650);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            extension: false
        };
    },
    created: function created() {
        var _this = this;

        /* Emit On a Child Component If You Want This To Be Visible */
        Bus.$on('header-extension-visible', function (visibility) {
            _this.extension = visibility;
        });
    },

    methods: {
        toggleDrawer: function toggleDrawer() {
            Bus.$emit('toggleDrawer');
        }
    }
});

/***/ }),

/***/ 674:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-toolbar",
    {
      attrs: {
        color: "accent",
        dense: "",
        fixed: "",
        "clipped-left": "",
        app: ""
      }
    },
    [
      _c("v-toolbar-side-icon", {
        style: _vm.toggleBarStyle,
        nativeOn: {
          click: function($event) {
            $event.stopPropagation()
            _vm.toggleDrawer()
          }
        }
      }),
      _vm._v(" "),
      _vm.extension
        ? _c(
            "v-toolbar-title",
            {
              staticClass: "text-xs-center ml-0 pl-3",
              class: _vm.$vuetify.breakpoint.width <= 1264 && "pr-3",
              style: _vm.$vuetify.breakpoint.width > 1264 && "width: 300px",
              attrs: { slot: "extension" },
              slot: "extension"
            },
            [
              _vm.showIcon
                ? _c(
                    "v-icon",
                    {
                      staticClass: "ml-3 hidden-md-and-down",
                      style: { color: _vm.iconColor }
                    },
                    [_vm._v(_vm._s(_vm.icon))]
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "span",
                { staticClass: "hidden-md-and-down", style: _vm.titleStyle },
                [_vm._v(_vm._s(_vm.title))]
              )
            ],
            1
          )
        : _c(
            "v-toolbar-title",
            { staticClass: "text-xs-center" },
            [
              _vm.showIcon
                ? _c(
                    "v-icon",
                    {
                      staticClass: "ml-3 hidden-md-and-down",
                      style: { color: _vm.iconColor }
                    },
                    [_vm._v(_vm._s(_vm.icon))]
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "span",
                { staticClass: "hidden-md-and-down", style: _vm.titleStyle },
                [_vm._v(_vm._s(_vm.title))]
              )
            ],
            1
          ),
      _vm._v(" "),
      _c("v-spacer"),
      _vm._v(" "),
      _vm.showLogo
        ? _c("img", {
            staticClass: "hidden-md-and-up",
            style: [_vm.logoStyle],
            attrs: { src: _vm.logo, alt: "App.site.title" }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("v-spacer")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d1431f74", module.exports)
  }
}

/***/ }),

/***/ 675:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(676)
/* template */
var __vue_template__ = __webpack_require__(677)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\LeftSideBar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-648c4aca", Component.options)
  } else {
    hotAPI.reload("data-v-648c4aca", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 676:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(652);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_theme__ = __webpack_require__(650);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(88);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["createNamespacedHelpers"])('auth'),
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["default"] = ({
    mixins: [__WEBPACK_IMPORTED_MODULE_2__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            drawer: false
        };
    },
    components: {
        VLink: __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default.a
    },
    mounted: function mounted() {
        var self = this;
        Bus.$on('toggleDrawer', function () {
            self.drawer = !self.drawer;
        });
    },

    computed: __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default()({}, mapState({
        isAuthenticated: 'isAuthenticated'
    }))

});

/***/ }),

/***/ 677:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-navigation-drawer",
    {
      staticClass: "secondary",
      attrs: {
        fixed: "",
        clipped: _vm.$vuetify.breakpoint.width > 1264,
        app: ""
      },
      model: {
        value: _vm.drawer,
        callback: function($$v) {
          _vm.drawer = $$v
        },
        expression: "drawer"
      }
    },
    [
      _c(
        "v-list",
        { attrs: { dense: "" } },
        [
          _c("v-link", {
            attrs: {
              dark: _vm.darkClass,
              title: "Home",
              href: "/",
              icon: "fa-home"
            }
          }),
          _vm._v(" "),
          _c("v-link", {
            attrs: {
              dark: _vm.darkClass,
              title: "Company Profile",
              href: "/about",
              icon: "fa-building"
            }
          }),
          _vm._v(" "),
          _c("v-link", {
            attrs: {
              dark: _vm.darkClass,
              title: "Support",
              href: "/support",
              icon: "message"
            }
          }),
          _vm._v(" "),
          _c(
            "v-subheader",
            {
              class: {
                "blue-grey--text": !_vm.isDark,
                "text--lighten-1": !_vm.isDark,
                "white--text": _vm.isDark
              }
            },
            [_vm._v("Members Area")]
          ),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "User Management",
                  href: "/users",
                  icon: "supervisor_account"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Dashboard",
                  href: "/dashboard",
                  icon: "fa-tachometer"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Reports",
                  href: "/reports",
                  icon: "fa-wpforms "
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Accounts",
                  href: "/accounts",
                  icon: "fa-users"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Create Post",
                  href: "/posts",
                  icon: "event_note"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Failed Post",
                  href: "/failure",
                  icon: "event_busy"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Published Post",
                  href: "/published",
                  icon: "event_available"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Scheduled Post",
                  href: "/scheduled",
                  icon: "update"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Boost Organic Traffic",
                  href: "/traffic",
                  icon: "trending_up"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Settings",
                  href: "/settings",
                  icon: "fa-cogs"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Logout",
                  href: "/logout",
                  icon: "power_settings_new"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Login",
                  href: "/login",
                  icon: "fa-key"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.isAuthenticated
            ? _c("v-link", {
                attrs: {
                  dark: _vm.darkClass,
                  title: "Register",
                  href: "/register",
                  icon: "fa-user-plus"
                }
              })
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-648c4aca", module.exports)
  }
}

/***/ }),

/***/ 678:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(679)
/* template */
var __vue_template__ = __webpack_require__(680)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\FabButton.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-20a58332", Component.options)
  } else {
    hotAPI.reload("data-v-20a58332", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 679:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(652);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(88);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["createNamespacedHelpers"])('auth'),
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            direction: 'top',
            fixed: true,
            fab: false,
            hover: false,
            top: false,
            right: true,
            bottom: true,
            left: false,
            absolute: false,
            transition: 'slide-y-reverse-transition',
            buttons: [{ name: 'home', href: '/', class: 'indigo lighten-2', icon: 'fa-home', requiresAuth: false }, { name: 'dashboard', href: '/dashboard', class: 'amber lighten-2', icon: 'fa-tachometer', requiresAuth: true }, { name: 'login', href: '/login', class: 'success', icon: 'fa-key', requiresAuth: false }, { name: 'register', href: '/register', class: 'info', icon: 'fa-user-plus', requiresAuth: false }, { name: 'logout', href: '/logout', class: 'red lighten-2', icon: 'fa-power-off', requiresAuth: true }, { name: 'scroll-up', href: null, class: 'blue-grey', icon: 'flight_takeoff', requiresAuth: false }],
            activeFab: {
                'class': 'primary', icon: 'fa-rocket'
            }
        };
    },
    computed: __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default()({}, mapState({
        isAuthenticated: 'isAuthenticated'
    })),
    watch: {
        top: function top(val) {
            this.bottom = !val;
        },
        right: function right(val) {
            this.left = !val;
        },
        bottom: function bottom(val) {
            this.top = !val;
        },
        left: function left(val) {
            this.right = !val;
        }
    },
    methods: {
        navigate: function navigate(button) {
            var self = this;
            self.activeFab = { class: button.class, icon: button.icon };

            setTimeout(function () {
                self.activeFab = {
                    'class': 'primary', icon: 'fa-rocket'
                };
                if (button.href !== null) {
                    self.$router.push({ path: '' + button.href });
                } else {
                    self.scrollToTop(300);
                }
            }, 500);
        },
        scrollToTop: function scrollToTop(scrollDuration) {
            var cosParameter = window.scrollY / 2;
            var scrollCount = 0;
            var oldTimestamp = performance.now();

            function step(newTimestamp) {
                scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
                if (scrollCount >= Math.PI) window.scrollTo(0, 0);
                if (window.scrollY === 0) return;
                window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
                oldTimestamp = newTimestamp;
                window.requestAnimationFrame(step);
            }

            window.requestAnimationFrame(step);
        },
        isVisible: function isVisible(button) {
            var self = this;
            if (button.requiresAuth === false && button.name === 'login') {
                return !self.isAuthenticated;
            } else if (button.requiresAuth === false && button.name === 'register') {
                return !self.isAuthenticated;
            } else if (button.requiresAuth === true) {
                return self.isAuthenticated;
            } else if (button.requiresAuth === false) {
                return true;
            }
        }
    }
});

/***/ }),

/***/ 680:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-speed-dial",
    {
      attrs: {
        top: _vm.top,
        bottom: _vm.bottom,
        right: _vm.right,
        left: _vm.left,
        direction: _vm.direction,
        hover: _vm.hover,
        transition: _vm.transition,
        absolute: _vm.absolute,
        fixed: _vm.fixed
      },
      model: {
        value: _vm.fab,
        callback: function($$v) {
          _vm.fab = $$v
        },
        expression: "fab"
      }
    },
    [
      _c(
        "v-btn",
        {
          class: [_vm.activeFab.class],
          attrs: { slot: "activator", dark: "", fab: "", hover: "" },
          slot: "activator",
          model: {
            value: _vm.fab,
            callback: function($$v) {
              _vm.fab = $$v
            },
            expression: "fab"
          }
        },
        [
          _c("v-icon", { staticClass: "white--text" }, [
            _vm._v(_vm._s(_vm.activeFab.icon))
          ]),
          _vm._v(" "),
          _c("v-icon", { staticClass: "error--text" }, [_vm._v("close")])
        ],
        1
      ),
      _vm._v(" "),
      _vm._l(_vm.buttons, function(button) {
        return _vm.isVisible(button)
          ? _c(
              "v-btn",
              {
                key: button.name,
                class: [button.class],
                attrs: { fab: "", dark: "", small: "" },
                nativeOn: {
                  click: function($event) {
                    _vm.navigate(button)
                  }
                }
              },
              [_c("v-icon", [_vm._v(_vm._s(button.icon))])],
              1
            )
          : _vm._e()
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-20a58332", module.exports)
  }
}

/***/ }),

/***/ 681:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(682)
/* template */
var __vue_template__ = __webpack_require__(684)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\partials\\CookieLaw.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-519438f3", Component.options)
  } else {
    hotAPI.reload("data-v-519438f3", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 682:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cookie_law__ = __webpack_require__(683);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cookie_law___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_cookie_law__);
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    components: { CookieLaw: __WEBPACK_IMPORTED_MODULE_0_vue_cookie_law___default.a }
});

/***/ }),

/***/ 683:
/***/ (function(module, exports, __webpack_require__) {

/*!
 * vue-cookie-law v1.3.0
 * (c) 2017 Jakub Juszczak <jakub@posteo.de>
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("CookieLaw", [], factory);
	else if(typeof exports === 'object')
		exports["CookieLaw"] = factory();
	else
		root["CookieLaw"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1)
}
var Component = __webpack_require__(6)(
  /* script */
  __webpack_require__(7),
  /* template */
  __webpack_require__(8),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Users/jjuszczak/Projekte/Privat/vue-cookie-law/src/components/CookieLaw.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CookieLaw.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-863fd97e", Component.options)
  } else {
    hotAPI.reload("data-v-863fd97e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("91c05312", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-863fd97e\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CookieLaw.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-863fd97e\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CookieLaw.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.Cookie {\n  position: fixed;\n  overflow: hidden;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  z-index: 9999;\n  width: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: baseline;\n      -ms-flex-align: baseline;\n          align-items: baseline;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.Cookie > * {\n    margin: 0.9375rem 0;\n    -ms-flex-item-align: center;\n        align-self: center;\n}\n@media screen and (min-width: 48rem) {\n.Cookie {\n      -webkit-box-orient: horizontal;\n      -webkit-box-direction: normal;\n          -ms-flex-flow: row;\n              flex-flow: row;\n}\n.Cookie > * {\n        margin: 0;\n}\n}\n.Cookie--top {\n  top: 0;\n  left: 0;\n  right: 0;\n}\n.Cookie--bottom {\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n.Cookie__buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.Cookie__buttons > * {\n    margin: 0.3125rem 0;\n}\n@media screen and (min-width: 48rem) {\n.Cookie__buttons {\n      -webkit-box-orient: horizontal;\n      -webkit-box-direction: normal;\n          -ms-flex-direction: row;\n              flex-direction: row;\n}\n.Cookie__buttons > * {\n        margin: 0 0.9375rem;\n}\n}\n.Cookie__button {\n  cursor: pointer;\n  -ms-flex-item-align: center;\n      align-self: center;\n}\n.Cookie--base {\n  background: #F1F1F1;\n  color: #232323;\n  padding: 1.250em;\n}\n.Cookie--base .Cookie__button {\n    background: #97D058;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 0;\n}\n.Cookie--base .Cookie__button:hover {\n      background: #7ebf36;\n}\n.Cookie--base--rounded {\n  background: #F1F1F1;\n  color: #232323;\n  padding: 1.250em;\n}\n.Cookie--base--rounded .Cookie__button {\n    background: #97D058;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 20px;\n}\n.Cookie--base--rounded .Cookie__button:hover {\n      background: #7ebf36;\n}\n.Cookie--blood-orange {\n  background: #424851;\n  color: #fff;\n  padding: 1.250em;\n}\n.Cookie--blood-orange .Cookie__button {\n    background: #E76A68;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 0;\n}\n.Cookie--blood-orange .Cookie__button:hover {\n      background: #e03f3c;\n}\n.Cookie--blood-orange--rounded {\n  background: #424851;\n  color: #fff;\n  padding: 1.250em;\n}\n.Cookie--blood-orange--rounded .Cookie__button {\n    background: #E76A68;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 20px;\n}\n.Cookie--blood-orange--rounded .Cookie__button:hover {\n      background: #e03f3c;\n}\n.Cookie--dark-lime {\n  background: #424851;\n  color: #fff;\n  padding: 1.250em;\n}\n.Cookie--dark-lime .Cookie__button {\n    background: #97D058;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 0;\n}\n.Cookie--dark-lime .Cookie__button:hover {\n      background: #7ebf36;\n}\n.Cookie--dark-lime--rounded {\n  background: #424851;\n  color: #fff;\n  padding: 1.250em;\n}\n.Cookie--dark-lime--rounded .Cookie__button {\n    background: #97D058;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 20px;\n}\n.Cookie--dark-lime--rounded .Cookie__button:hover {\n      background: #7ebf36;\n}\n.Cookie--royal {\n  background: #FBC227;\n  color: #232323;\n  padding: 1.250em;\n}\n.Cookie--royal .Cookie__button {\n    background: #726CEA;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 0;\n}\n.Cookie--royal .Cookie__button:hover {\n      background: #473fe4;\n}\n.Cookie--royal--rounded {\n  background: #FBC227;\n  color: #232323;\n  padding: 1.250em;\n}\n.Cookie--royal--rounded .Cookie__button {\n    background: #726CEA;\n    padding: 0.625em 3.125em;\n    color: #fff;\n    border-radius: 20px;\n}\n.Cookie--royal--rounded .Cookie__button:hover {\n      background: #473fe4;\n}\n.slideFromTop-enter, .slideFromTop-leave-to {\n  -webkit-transform: translate(0px, -12.5em);\n          transform: translate(0px, -12.5em);\n}\n.slideFromTop-enter-to, .slideFromTop-leave {\n  -webkit-transform: translate(0px, 0px);\n          transform: translate(0px, 0px);\n}\n.slideFromBottom-enter, .slideFromBottom-leave-to {\n  -webkit-transform: translate(0px, 12.5em);\n          transform: translate(0px, 12.5em);\n}\n.slideFromBottom-enter-to, .slideFromBottom-leave {\n  -webkit-transform: translate(0px, 0px);\n          transform: translate(0px, 0px);\n}\n.slideFromBottom-enter-active,\n.slideFromBottom-leave-active,\n.slideFromTop-enter-active,\n.slideFromTop-leave-active {\n  -webkit-transition: -webkit-transform .4s ease-in;\n  transition: -webkit-transform .4s ease-in;\n  transition: transform .4s ease-in;\n  transition: transform .4s ease-in, -webkit-transform .4s ease-in;\n}\n.fade-enter-active, .fade-leave-active {\n  -webkit-transition: opacity .5s;\n  transition: opacity .5s;\n}\n.fade-enter, .fade-leave-to {\n  opacity: 0;\n}\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(5)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  props: {
    buttonText: {
      type: String,
      default: 'Got it!'
    },
    buttonLink: {
      type: String
    },
    buttonLinkText: {
      type: String,
      default: 'More info'
    },
    message: {
      type: String,
      default: 'This website uses cookies to ensure you get the best experience on our website.'
    },
    theme: {
      type: String,
      default: 'base'
    },

    position: {
      type: String,
      default: 'bottom'
    },

    transitionName: {
      type: String,
      default: 'slideFromBottom'
    },
    buttonClass: {
      type: String,
      default: 'Cookie__button'
    }
  },
  data: function data() {
    return {
      isOpen: false
    };
  },

  computed: {
    containerPosition: function containerPosition() {
      return 'Cookie--' + this.position;
    },
    cookieTheme: function cookieTheme() {
      return 'Cookie--' + this.theme;
    }
  },
  created: function created() {
    if (!this.getVisited() === true) {
      this.isOpen = true;
    }
  },

  methods: {
    setVisited: function setVisited() {
      localStorage.setItem('cookie:accepted', true);
    },
    getVisited: function getVisited() {
      return localStorage.getItem('cookie:accepted');
    },
    accept: function accept() {
      this.setVisited();
      this.isOpen = false;
    }
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "appear": "",
      "name": _vm.transitionName
    }
  }, [(_vm.isOpen) ? _c('div', {
    staticClass: "Cookie",
    class: [_vm.containerPosition, _vm.cookieTheme]
  }, [_c('div', {
    staticClass: "Cookie__content"
  }, [_vm._t("message", [_vm._v(_vm._s(_vm.message))])], 2), _vm._v(" "), _c('div', {
    staticClass: "Cookie__buttons"
  }, [(_vm.buttonLink) ? _c('a', {
    class: _vm.buttonClass,
    attrs: {
      "href": _vm.buttonLink
    }
  }, [_vm._v(_vm._s(_vm.buttonLinkText))]) : _vm._e(), _vm._v(" "), _c('div', {
    class: _vm.buttonClass,
    on: {
      "click": _vm.accept
    }
  }, [_vm._v(_vm._s(_vm.buttonText))])])]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-863fd97e", module.exports)
  }
}

/***/ })
/******/ ]);
});

/***/ }),

/***/ 684:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "cookie-law",
    {
      attrs: {
        theme: "dark-lime",
        buttonText: "Yes, I Understand This Site Uses Cookie."
      }
    },
    [
      _c("div", { attrs: { slot: "message" }, slot: "message" }, [
        _c(
          "p",
          [
            _vm._v(
              "This website uses cookies to ensure you get the best experience on our website.\r\n                "
            ),
            _c("span", [
              _vm._v("Read Our Cookie Terms and Usage For More Info:")
            ]),
            _vm._v(" "),
            _c("router-link", { attrs: { to: "/cookie-law-agreement" } }, [
              _vm._v("Click here")
            ])
          ],
          1
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-519438f3", module.exports)
  }
}

/***/ }),

/***/ 685:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-app",
    {},
    [
      _c("left-side-bar"),
      _vm._v(" "),
      _c("app-nav-bar"),
      _vm._v(" "),
      _c(
        "main",
        [
          _c(
            "v-container",
            {
              attrs: {
                transition: "slide-x-transition",
                fluid: "",
                "pa-0": "",
                "ma-0": ""
              }
            },
            [_vm._t("default")],
            2
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("fab-button"),
      _vm._v(" "),
      _c("cookie-law"),
      _vm._v(" "),
      _c("app-footer")
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2b9f9d6a", module.exports)
  }
}

/***/ }),

/***/ 705:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(824)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(826)
/* template */
var __vue_template__ = __webpack_require__(827)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\reports\\ReportProps.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8e621850", Component.options)
  } else {
    hotAPI.reload("data-v-8e621850", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 819:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_theme__ = __webpack_require__(650);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_acl__ = __webpack_require__(653);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_reports_BlogReports_vue__ = __webpack_require__(820);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_reports_BlogReports_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_reports_BlogReports_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_reports_SocialReports_vue__ = __webpack_require__(829);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_reports_SocialReports_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_reports_SocialReports_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_reports_VideoReports_vue__ = __webpack_require__(834);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_reports_VideoReports_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_reports_VideoReports_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ __webpack_exports__["default"] = ({
    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_theme__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__mixins_acl__["a" /* default */]],
    components: {
        MainLayout: __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue___default.a,
        BlogReports: __WEBPACK_IMPORTED_MODULE_3__components_reports_BlogReports_vue___default.a,
        SocialReports: __WEBPACK_IMPORTED_MODULE_4__components_reports_SocialReports_vue___default.a,
        VideoReports: __WEBPACK_IMPORTED_MODULE_5__components_reports_VideoReports_vue___default.a
    },
    data: function data() {
        return {

            /* tabs */
            tabs: [{ name: 'blog reports', component: 'blog-reports', icon: 'fa-newspaper-o', iconColor: 'amber' }, { name: 'social reports', component: 'social-reports', icon: 'fa-address-book', iconColor: 'cyan' }, { name: 'video reports', component: 'video-reports', icon: 'fa-youtube-play ', iconColor: 'red darken-4' }],
            active: {
                name: 'blog reports'
            }
        };
    }
});

/***/ }),

/***/ 820:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(821)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(823)
/* template */
var __vue_template__ = __webpack_require__(828)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\reports\\BlogReports.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-25a51679", Component.options)
  } else {
    hotAPI.reload("data-v-25a51679", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 821:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(822);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("36a27e0a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-25a51679\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BlogReports.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-25a51679\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BlogReports.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 822:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 823:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ReportProps_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


//! Fetch Blog Reports From Database
/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['tab'],
    components: {
        ReportProps: __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue___default.a
    },
    data: function data() {
        return {
            pagination: {
                sortBy: 'name'
            },
            search: '',
            selected: [],
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'left', sortable: true }, { text: 'Post Title', value: 'title', align: 'left', sortable: true }, { text: 'Post Count', value: 'posts.length', align: 'left', sortable: true }, { text: 'Scheduled At', value: 'scheduled_at', align: 'left', sortable: true }],
            //! campaign list by category of blog-accounts
            items: [{
                //! campaign id
                id: 1,
                name: 'First Campaign',
                title: 'Hello World',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 1,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    //! link posted @
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 2,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 3,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 4,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 5,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 2,
                name: 'Second Campaign',
                title: 'Hello Universe',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 6,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 3,
                name: 'Second Campaign',
                title: 'Hello hI',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 7,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 4,
                name: 'Second Campaign',
                title: 'Hello Hello',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 8,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 5,
                name: 'Second Campaign',
                title: 'Hello Dolly',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 9,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 10,
                    posted: false, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }]
        };
    },
    methods: {
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        },
        deleteSelected: function deleteSelected() {
            var self = this;
            var newItems = _.difference(self.items, self.selected);
            self.items = newItems;
            self.selected = [];
            //! Send Api Call To Delete The Social Account
        },
        deleteItem: function deleteItem(item) {
            var self = this;
            var itemIndex = _.findIndex(self.items, ['id', item.id]);
            self.items.splice(itemIndex, 1);
            var selectedIndex = _.findIndex(self.selected, ['id', item.id]);
            self.selected.splice(selectedIndex, 1);
        }
    }
});

/***/ }),

/***/ 824:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(825);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("66296b3e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8e621850\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./ReportProps.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8e621850\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./ReportProps.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 825:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 826:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['posts'],
    data: function data() {
        return {
            pagination: {
                sortBy: 'name'
            },
            selected: [],
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Platform', value: 'platform', align: 'left', sortable: true }, { text: 'Status', value: 'posted', align: 'center', sortable: true }],
            items: []
        };
    },
    mounted: function mounted() {
        this.items = this.posts;
    },

    methods: {
        //! Add Logic to Determine a Failure Of Post
        isActive: function isActive(item) {
            return !!item.posted;
        },
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        },
        deleteSelected: function deleteSelected() {
            var self = this;
            var newItems = _.difference(self.items, self.selected);
            self.items = newItems;
            self.selected = [];
            //! Send Api Call To Delete The Social Account
        },
        deleteItem: function deleteItem(item) {
            var self = this;
            var itemIndex = _.findIndex(self.items, ['id', item.id]);
            self.items.splice(itemIndex, 1);
            var selectedIndex = _.findIndex(self.selected, ['id', item.id]);
            self.selected.splice(selectedIndex, 1);
        }
    }
});

/***/ }),

/***/ 827:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    [
      _c(
        "v-card-title",
        [
          _vm.items.length > 0
            ? _c("v-text-field", {
                attrs: {
                  "append-icon": "search",
                  label: "Search By Campaign",
                  "single-line": "",
                  "hide-details": ""
                },
                model: {
                  value: _vm.search,
                  callback: function($$v) {
                    _vm.search = $$v
                  },
                  expression: "search"
                }
              })
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c("v-data-table", {
        attrs: {
          items: _vm.items,
          headers: _vm.headers,
          search: _vm.search,
          "item-key": "id",
          "select-all": "",
          pagination: _vm.pagination
        },
        on: {
          "update:pagination": function($event) {
            _vm.pagination = $event
          }
        },
        scopedSlots: _vm._u([
          {
            key: "headers",
            fn: function(props) {
              return [
                _c(
                  "tr",
                  [
                    _c(
                      "th",
                      [
                        _vm.items.length > 0
                          ? _c("v-checkbox", {
                              attrs: {
                                primary: "",
                                "hide-details": "",
                                "input-value": props.all,
                                indeterminate: props.indeterminate
                              },
                              nativeOn: {
                                click: function($event) {
                                  _vm.toggleAll($event)
                                }
                              }
                            })
                          : _vm._e()
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _vm._l(props.headers, function(header) {
                      return _c(
                        "th",
                        {
                          key: header.text,
                          class: [
                            "column sortable",
                            _vm.pagination.descending ? "desc" : "asc",
                            header.value === _vm.pagination.sortBy
                              ? "active"
                              : ""
                          ],
                          on: {
                            click: function($event) {
                              _vm.changeSort(header.value)
                            }
                          }
                        },
                        [
                          _c("v-icon", [_vm._v("arrow_upward")]),
                          _vm._v(
                            "\n                " +
                              _vm._s(header.text) +
                              "\n            "
                          )
                        ],
                        1
                      )
                    }),
                    _vm._v(" "),
                    _c(
                      "th",
                      [
                        _vm.selected < 1
                          ? _c("span", [_vm._v("Actions")])
                          : _c(
                              "v-btn",
                              {
                                attrs: { flat: "", icon: "", color: "error" },
                                nativeOn: {
                                  click: function($event) {
                                    _vm.deleteSelected($event)
                                  }
                                }
                              },
                              [_c("v-icon", [_vm._v("fa-trash")])],
                              1
                            )
                      ],
                      1
                    )
                  ],
                  2
                )
              ]
            }
          },
          {
            key: "items",
            fn: function(props) {
              return [
                _c(
                  "td",
                  [
                    _c("v-checkbox", {
                      attrs: { primary: "", "hide-details": "" },
                      model: {
                        value: props.selected,
                        callback: function($$v) {
                          _vm.$set(props, "selected", $$v)
                        },
                        expression: "props.selected"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c("td", { staticClass: "text-xs-left" }, [
                  _vm._v(
                    "\n               " +
                      _vm._s(props.item.platform) +
                      "\n            "
                  )
                ]),
                _vm._v(" "),
                _c(
                  "td",
                  { staticClass: "text-xs-center" },
                  [
                    _c(
                      "v-chip",
                      {
                        class: {
                          green: _vm.isActive(props.item),
                          red: !_vm.isActive(props.item)
                        },
                        attrs: { "text-color": "white" }
                      },
                      [
                        _c("span", [
                          _vm._v(
                            _vm._s(
                              "" + (props.item.posted ? "Posted" : "Failed")
                            )
                          )
                        ])
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "td",
                  { staticClass: "text-xs-center" },
                  [
                    props.item.posted
                      ? _c(
                          "v-btn",
                          {
                            attrs: { flat: "", icon: "", color: "cyan" },
                            nativeOn: { click: function($event) {} }
                          },
                          [_c("v-icon", [_vm._v("fa-eye")])],
                          1
                        )
                      : _c(
                          "v-btn",
                          {
                            attrs: { flat: "", icon: "", color: "red" },
                            nativeOn: { click: function($event) {} }
                          },
                          [_c("v-icon", [_vm._v("fa-exclamation-triangle")])],
                          1
                        ),
                    _vm._v(" "),
                    _c(
                      "v-btn",
                      {
                        attrs: { flat: "", icon: "", color: "error" },
                        nativeOn: {
                          click: function($event) {
                            _vm.deleteItem(props.item)
                          }
                        }
                      },
                      [_c("v-icon", [_vm._v("fa-remove")])],
                      1
                    )
                  ],
                  1
                )
              ]
            }
          },
          {
            key: "pageText",
            fn: function(ref) {
              var pageStart = ref.pageStart
              var pageStop = ref.pageStop
              return [
                _vm._v(
                  "\n            From " +
                    _vm._s(pageStart) +
                    " to " +
                    _vm._s(pageStop) +
                    "\n        "
                )
              ]
            }
          }
        ]),
        model: {
          value: _vm.selected,
          callback: function($$v) {
            _vm.selected = $$v
          },
          expression: "selected"
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8e621850", module.exports)
  }
}

/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    [
      _c(
        "v-card-title",
        [
          _vm.items.length > 0
            ? _c("v-text-field", {
                attrs: {
                  "append-icon": "search",
                  label: "Search By Campaign",
                  "single-line": "",
                  "hide-details": ""
                },
                model: {
                  value: _vm.search,
                  callback: function($$v) {
                    _vm.search = $$v
                  },
                  expression: "search"
                }
              })
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-data-table",
        {
          attrs: {
            headers: _vm.headers,
            items: _vm.items,
            search: _vm.search,
            "item-key": "id",
            "select-all": "",
            pagination: _vm.pagination,
            expand: ""
          },
          on: {
            "update:pagination": function($event) {
              _vm.pagination = $event
            }
          },
          scopedSlots: _vm._u([
            {
              key: "headers",
              fn: function(props) {
                return [
                  _c(
                    "tr",
                    [
                      _c(
                        "th",
                        [
                          _vm.items.length > 0
                            ? _c("v-checkbox", {
                                attrs: {
                                  primary: "",
                                  "hide-details": "",
                                  "input-value": props.all,
                                  indeterminate: props.indeterminate
                                },
                                nativeOn: {
                                  click: function($event) {
                                    _vm.toggleAll($event)
                                  }
                                }
                              })
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm._l(props.headers, function(header) {
                        return _c(
                          "th",
                          {
                            key: header.text,
                            class: [
                              "column sortable",
                              _vm.pagination.descending ? "desc" : "asc",
                              header.value === _vm.pagination.sortBy
                                ? "active"
                                : ""
                            ],
                            on: {
                              click: function($event) {
                                _vm.changeSort(header.value)
                              }
                            }
                          },
                          [
                            _c("v-icon", [_vm._v("arrow_upward")]),
                            _vm._v(
                              "\n                " +
                                _vm._s(header.text) +
                                "\n            "
                            )
                          ],
                          1
                        )
                      }),
                      _vm._v(" "),
                      _c(
                        "th",
                        [
                          _vm.selected < 1
                            ? _c("span", [_vm._v("Actions")])
                            : _c(
                                "v-btn",
                                {
                                  attrs: { flat: "", icon: "", color: "error" },
                                  nativeOn: {
                                    click: function($event) {
                                      _vm.deleteSelected($event)
                                    }
                                  }
                                },
                                [_c("v-icon", [_vm._v("fa-trash")])],
                                1
                              )
                        ],
                        1
                      )
                    ],
                    2
                  )
                ]
              }
            },
            {
              key: "items",
              fn: function(props) {
                return [
                  _c(
                    "td",
                    [
                      _c("v-checkbox", {
                        attrs: { primary: "", "hide-details": "" },
                        model: {
                          value: props.selected,
                          callback: function($$v) {
                            _vm.$set(props, "selected", $$v)
                          },
                          expression: "props.selected"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-left primary--text" },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(props.item.name) +
                          "\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-left primary--text" },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(props.item.title) +
                          "\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("span", { staticClass: "title blue-grey--text" }, [
                        _vm._v(_vm._s(props.item.posts.length))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("span", { staticClass: "title blue-grey--text" }, [
                        _vm._v(_vm._s(props.item.scheduled_at))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center" },
                    [
                      _c(
                        "v-btn",
                        {
                          class: {
                            "amber--text": props.expanded,
                            amber: props.expanded,
                            teal: !props.expanded,
                            "teal--text": !props.expanded
                          },
                          attrs: { flat: "", icon: "" },
                          on: {
                            click: function($event) {
                              props.expanded = !props.expanded
                            }
                          }
                        },
                        [
                          !props.expanded
                            ? _c("v-icon", [_vm._v("fa-expand")])
                            : _vm._e(),
                          _vm._v(" "),
                          props.expanded
                            ? _c("v-icon", [_vm._v("fa-compress")])
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { flat: "", icon: "", color: "error" },
                          nativeOn: {
                            click: function($event) {
                              _vm.deleteItem(props.item)
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("fa-remove")])],
                        1
                      )
                    ],
                    1
                  )
                ]
              }
            },
            {
              key: "expand",
              fn: function(props) {
                return [
                  _c("report-props", { attrs: { posts: props.item.posts } })
                ]
              }
            },
            {
              key: "pageText",
              fn: function(ref) {
                var pageStart = ref.pageStart
                var pageStop = ref.pageStop
                return [
                  _vm._v(
                    "\n            From " +
                      _vm._s(pageStart) +
                      " to " +
                      _vm._s(pageStop) +
                      "\n        "
                  )
                ]
              }
            }
          ]),
          model: {
            value: _vm.selected,
            callback: function($$v) {
              _vm.selected = $$v
            },
            expression: "selected"
          }
        },
        [
          _c(
            "template",
            { slot: "no-data" },
            [
              _c(
                "v-alert",
                { attrs: { value: true, color: "info", icon: "warning" } },
                [
                  _vm._v(
                    "\n            You Havent Posted Anything Yet.\n            "
                  )
                ]
              )
            ],
            1
          )
        ],
        2
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-25a51679", module.exports)
  }
}

/***/ }),

/***/ 829:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(830)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(832)
/* template */
var __vue_template__ = __webpack_require__(833)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\reports\\SocialReports.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-225ad8ce", Component.options)
  } else {
    hotAPI.reload("data-v-225ad8ce", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 830:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(831);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("470886de", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-225ad8ce\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./SocialReports.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-225ad8ce\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./SocialReports.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 832:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ReportProps_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


//! Fetch Blog Reports From Database
/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['tab'],
    components: {
        ReportProps: __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue___default.a
    },
    data: function data() {
        return {
            pagination: {
                sortBy: 'name'
            },
            search: '',
            selected: [],
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'left', sortable: true }, { text: 'Post Title', value: 'title', align: 'left', sortable: true }, { text: 'Post Count', value: 'posts.length', align: 'left', sortable: true }, { text: 'Scheduled At', value: 'scheduled_at', align: 'left', sortable: true }],
            //! campaign list by category of blog-accounts
            items: [{
                //! campaign id
                id: 1,
                name: 'First Campaign',
                title: 'Hello World',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 1,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    //! link posted @
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 2,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 3,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 4,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 5,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 2,
                name: 'Second Campaign',
                title: 'Hello Universe',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 6,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 3,
                name: 'Second Campaign',
                title: 'Hello hI',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 7,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 4,
                name: 'Second Campaign',
                title: 'Hello Hello',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 8,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 5,
                name: 'Second Campaign',
                title: 'Hello Dolly',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 9,
                    posted: true, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 10,
                    posted: false, //!
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }]
        };
    },
    methods: {
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        },
        deleteSelected: function deleteSelected() {
            var self = this;
            var newItems = _.difference(self.items, self.selected);
            self.items = newItems;
            self.selected = [];
            //! Send Api Call To Delete The Social Account
        },
        deleteItem: function deleteItem(item) {
            var self = this;
            var itemIndex = _.findIndex(self.items, ['id', item.id]);
            self.items.splice(itemIndex, 1);
            var selectedIndex = _.findIndex(self.selected, ['id', item.id]);
            self.selected.splice(selectedIndex, 1);
        }
    }
});

/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    [
      _c(
        "v-card-title",
        [
          _vm.items.length > 0
            ? _c("v-text-field", {
                attrs: {
                  "append-icon": "search",
                  label: "Search By Campaign",
                  "single-line": "",
                  "hide-details": ""
                },
                model: {
                  value: _vm.search,
                  callback: function($$v) {
                    _vm.search = $$v
                  },
                  expression: "search"
                }
              })
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-data-table",
        {
          attrs: {
            headers: _vm.headers,
            items: _vm.items,
            search: _vm.search,
            "item-key": "id",
            "select-all": "",
            pagination: _vm.pagination,
            expand: ""
          },
          on: {
            "update:pagination": function($event) {
              _vm.pagination = $event
            }
          },
          scopedSlots: _vm._u([
            {
              key: "headers",
              fn: function(props) {
                return [
                  _c(
                    "tr",
                    [
                      _c(
                        "th",
                        [
                          _vm.items.length > 0
                            ? _c("v-checkbox", {
                                attrs: {
                                  primary: "",
                                  "hide-details": "",
                                  "input-value": props.all,
                                  indeterminate: props.indeterminate
                                },
                                nativeOn: {
                                  click: function($event) {
                                    _vm.toggleAll($event)
                                  }
                                }
                              })
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm._l(props.headers, function(header) {
                        return _c(
                          "th",
                          {
                            key: header.text,
                            class: [
                              "column sortable",
                              _vm.pagination.descending ? "desc" : "asc",
                              header.value === _vm.pagination.sortBy
                                ? "active"
                                : ""
                            ],
                            on: {
                              click: function($event) {
                                _vm.changeSort(header.value)
                              }
                            }
                          },
                          [
                            _c("v-icon", [_vm._v("arrow_upward")]),
                            _vm._v(
                              "\n                " +
                                _vm._s(header.text) +
                                "\n            "
                            )
                          ],
                          1
                        )
                      }),
                      _vm._v(" "),
                      _c(
                        "th",
                        [
                          _vm.selected < 1
                            ? _c("span", [_vm._v("Actions")])
                            : _c(
                                "v-btn",
                                {
                                  attrs: { flat: "", icon: "", color: "error" },
                                  nativeOn: {
                                    click: function($event) {
                                      _vm.deleteSelected($event)
                                    }
                                  }
                                },
                                [_c("v-icon", [_vm._v("fa-trash")])],
                                1
                              )
                        ],
                        1
                      )
                    ],
                    2
                  )
                ]
              }
            },
            {
              key: "items",
              fn: function(props) {
                return [
                  _c(
                    "td",
                    [
                      _c("v-checkbox", {
                        attrs: { primary: "", "hide-details": "" },
                        model: {
                          value: props.selected,
                          callback: function($$v) {
                            _vm.$set(props, "selected", $$v)
                          },
                          expression: "props.selected"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-left primary--text" },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(props.item.name) +
                          "\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-left primary--text" },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(props.item.title) +
                          "\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("span", { staticClass: "title blue-grey--text" }, [
                        _vm._v(_vm._s(props.item.posts.length))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("span", { staticClass: "title blue-grey--text" }, [
                        _vm._v(_vm._s(props.item.scheduled_at))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center" },
                    [
                      _c(
                        "v-btn",
                        {
                          class: {
                            "amber--text": props.expanded,
                            amber: props.expanded,
                            teal: !props.expanded,
                            "teal--text": !props.expanded
                          },
                          attrs: { flat: "", icon: "" },
                          on: {
                            click: function($event) {
                              props.expanded = !props.expanded
                            }
                          }
                        },
                        [
                          !props.expanded
                            ? _c("v-icon", [_vm._v("fa-expand")])
                            : _vm._e(),
                          _vm._v(" "),
                          props.expanded
                            ? _c("v-icon", [_vm._v("fa-compress")])
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { flat: "", icon: "", color: "error" },
                          nativeOn: {
                            click: function($event) {
                              _vm.deleteItem(props.item)
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("fa-remove")])],
                        1
                      )
                    ],
                    1
                  )
                ]
              }
            },
            {
              key: "expand",
              fn: function(props) {
                return [
                  _c("report-props", { attrs: { posts: props.item.posts } })
                ]
              }
            },
            {
              key: "pageText",
              fn: function(ref) {
                var pageStart = ref.pageStart
                var pageStop = ref.pageStop
                return [
                  _vm._v(
                    "\n            From " +
                      _vm._s(pageStart) +
                      " to " +
                      _vm._s(pageStop) +
                      "\n        "
                  )
                ]
              }
            }
          ]),
          model: {
            value: _vm.selected,
            callback: function($$v) {
              _vm.selected = $$v
            },
            expression: "selected"
          }
        },
        [
          _c(
            "template",
            { slot: "no-data" },
            [
              _c(
                "v-alert",
                { attrs: { value: true, color: "info", icon: "warning" } },
                [
                  _vm._v(
                    "\n            You Havent Posted Anything Yet.\n            "
                  )
                ]
              )
            ],
            1
          )
        ],
        2
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-225ad8ce", module.exports)
  }
}

/***/ }),

/***/ 834:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(835)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(837)
/* template */
var __vue_template__ = __webpack_require__(838)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\reports\\VideoReports.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b12c190", Component.options)
  } else {
    hotAPI.reload("data-v-4b12c190", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 835:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(836);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(649)("5f4b2e1f", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b12c190\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VideoReports.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b12c190\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VideoReports.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 836:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(626)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 837:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ReportProps_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


//! Fetch Blog Reports From Database
/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['tab'],
    components: {
        ReportProps: __WEBPACK_IMPORTED_MODULE_0__ReportProps_vue___default.a
    },
    data: function data() {
        return {
            pagination: {
                sortBy: 'name'
            },
            search: '',
            selected: [],
            /* table */
            headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'left', sortable: true }, { text: 'Post Title', value: 'title', align: 'left', sortable: true }, { text: 'Post Count', value: 'posts.length', align: 'left', sortable: true }, { text: 'Scheduled At', value: 'scheduled_at', align: 'left', sortable: true }],
            //! campaign list by category of blog-accounts
            items: [{
                //! campaign id
                id: 1,
                name: 'First Campaign',
                title: 'Hello World',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 1,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    //! link posted @
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 2,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 3,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 4,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 5,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 2,
                name: 'Second Campaign',
                title: 'Hello Universe',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 6,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 3,
                name: 'Second Campaign',
                title: 'Hello hI',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 7,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 4,
                name: 'Second Campaign',
                title: 'Hello Hello',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 8,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }, {
                //! campaign id
                id: 5,
                name: 'Second Campaign',
                title: 'Hello Dolly',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [{
                    //! post id
                    id: 9,
                    posted: true, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }, {
                    //! post id
                    id: 10,
                    posted: false, //! 
                    posted_at: '16 Nov 2017 @ 10:15:01',
                    //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                    platform: 'Stumbleupon',
                    username: 'test@stumbleupon.com',
                    link: 'https://google.com',
                    iconColor: 'red',
                    icon: 'fa-stumbleupon '
                }]
            }]
        };
    },
    methods: {
        changeSort: function changeSort(column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending;
            } else {
                this.pagination.sortBy = column;
                this.pagination.descending = false;
            }
        },
        toggleAll: function toggleAll() {
            if (this.selected.length) this.selected = [];else this.selected = this.items.slice();
        },
        deleteSelected: function deleteSelected() {
            var self = this;
            var newItems = _.difference(self.items, self.selected);
            self.items = newItems;
            self.selected = [];
            //! Send Api Call To Delete The Social Account
        },
        deleteItem: function deleteItem(item) {
            var self = this;
            var itemIndex = _.findIndex(self.items, ['id', item.id]);
            self.items.splice(itemIndex, 1);
            var selectedIndex = _.findIndex(self.selected, ['id', item.id]);
            self.selected.splice(selectedIndex, 1);
        }
    }
});

/***/ }),

/***/ 838:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    [
      _c(
        "v-card-title",
        [
          _vm.items.length > 0
            ? _c("v-text-field", {
                attrs: {
                  "append-icon": "search",
                  label: "Search By Campaign",
                  "single-line": "",
                  "hide-details": ""
                },
                model: {
                  value: _vm.search,
                  callback: function($$v) {
                    _vm.search = $$v
                  },
                  expression: "search"
                }
              })
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-data-table",
        {
          attrs: {
            headers: _vm.headers,
            items: _vm.items,
            search: _vm.search,
            "item-key": "id",
            "select-all": "",
            pagination: _vm.pagination,
            expand: ""
          },
          on: {
            "update:pagination": function($event) {
              _vm.pagination = $event
            }
          },
          scopedSlots: _vm._u([
            {
              key: "headers",
              fn: function(props) {
                return [
                  _c(
                    "tr",
                    [
                      _c(
                        "th",
                        [
                          _vm.items.length > 0
                            ? _c("v-checkbox", {
                                attrs: {
                                  primary: "",
                                  "hide-details": "",
                                  "input-value": props.all,
                                  indeterminate: props.indeterminate
                                },
                                nativeOn: {
                                  click: function($event) {
                                    _vm.toggleAll($event)
                                  }
                                }
                              })
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm._l(props.headers, function(header) {
                        return _c(
                          "th",
                          {
                            key: header.text,
                            class: [
                              "column sortable",
                              _vm.pagination.descending ? "desc" : "asc",
                              header.value === _vm.pagination.sortBy
                                ? "active"
                                : ""
                            ],
                            on: {
                              click: function($event) {
                                _vm.changeSort(header.value)
                              }
                            }
                          },
                          [
                            _c("v-icon", [_vm._v("arrow_upward")]),
                            _vm._v(
                              "\n                " +
                                _vm._s(header.text) +
                                "\n            "
                            )
                          ],
                          1
                        )
                      }),
                      _vm._v(" "),
                      _c(
                        "th",
                        [
                          _vm.selected < 1
                            ? _c("span", [_vm._v("Actions")])
                            : _c(
                                "v-btn",
                                {
                                  attrs: { flat: "", icon: "", color: "error" },
                                  nativeOn: {
                                    click: function($event) {
                                      _vm.deleteSelected($event)
                                    }
                                  }
                                },
                                [_c("v-icon", [_vm._v("fa-trash")])],
                                1
                              )
                        ],
                        1
                      )
                    ],
                    2
                  )
                ]
              }
            },
            {
              key: "items",
              fn: function(props) {
                return [
                  _c(
                    "td",
                    [
                      _c("v-checkbox", {
                        attrs: { primary: "", "hide-details": "" },
                        model: {
                          value: props.selected,
                          callback: function($$v) {
                            _vm.$set(props, "selected", $$v)
                          },
                          expression: "props.selected"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-left primary--text" },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(props.item.name) +
                          "\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-left primary--text" },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(props.item.title) +
                          "\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("span", { staticClass: "title blue-grey--text" }, [
                        _vm._v(_vm._s(props.item.posts.length))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center primary--text" },
                    [
                      _c("span", { staticClass: "title blue-grey--text" }, [
                        _vm._v(_vm._s(props.item.scheduled_at))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "td",
                    { staticClass: "title text-xs-center" },
                    [
                      _c(
                        "v-btn",
                        {
                          class: {
                            "amber--text": props.expanded,
                            amber: props.expanded,
                            teal: !props.expanded,
                            "teal--text": !props.expanded
                          },
                          attrs: { flat: "", icon: "" },
                          on: {
                            click: function($event) {
                              props.expanded = !props.expanded
                            }
                          }
                        },
                        [
                          !props.expanded
                            ? _c("v-icon", [_vm._v("fa-expand")])
                            : _vm._e(),
                          _vm._v(" "),
                          props.expanded
                            ? _c("v-icon", [_vm._v("fa-compress")])
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { flat: "", icon: "", color: "error" },
                          nativeOn: {
                            click: function($event) {
                              _vm.deleteItem(props.item)
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("fa-remove")])],
                        1
                      )
                    ],
                    1
                  )
                ]
              }
            },
            {
              key: "expand",
              fn: function(props) {
                return [
                  _c("report-props", { attrs: { posts: props.item.posts } })
                ]
              }
            },
            {
              key: "pageText",
              fn: function(ref) {
                var pageStart = ref.pageStart
                var pageStop = ref.pageStop
                return [
                  _vm._v(
                    "\n            From " +
                      _vm._s(pageStart) +
                      " to " +
                      _vm._s(pageStop) +
                      "\n        "
                  )
                ]
              }
            }
          ]),
          model: {
            value: _vm.selected,
            callback: function($$v) {
              _vm.selected = $$v
            },
            expression: "selected"
          }
        },
        [
          _c(
            "template",
            { slot: "no-data" },
            [
              _c(
                "v-alert",
                { attrs: { value: true, color: "info", icon: "warning" } },
                [
                  _vm._v(
                    "\n            You Havent Posted Anything Yet.\n            "
                  )
                ]
              )
            ],
            1
          )
        ],
        2
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4b12c190", module.exports)
  }
}

/***/ }),

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "main-layout",
    {
      style: { paddingTop: "100px", backgroundColor: "white" },
      attrs: { dark: false }
    },
    [
      _c(
        "v-container",
        { attrs: { fluid: "" } },
        [
          _c(
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-breadcrumbs",
                [
                  _c(
                    "v-icon",
                    {
                      attrs: { slot: "divider", color: "teal" },
                      slot: "divider"
                    },
                    [_vm._v("forward")]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-breadcrumbs-item",
                    {
                      attrs: {
                        "active-class": "primary--text",
                        disabled: false,
                        to: "/dashboard"
                      }
                    },
                    [
                      _vm._v(
                        "\n                    Dashboard\n                "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c("v-breadcrumbs-item", { attrs: { disabled: true } }, [
                    _c("span", { staticClass: "blue-grey--text" }, [
                      _vm._v("Reports")
                    ])
                  ])
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-tabs",
            { attrs: { fixed: "", icons: "", centered: "" } },
            [
              _c(
                "v-toolbar",
                { attrs: { color: "white" } },
                [
                  _c(
                    "v-tabs-bar",
                    { staticClass: "white" },
                    [
                      _c("v-tabs-slider", { attrs: { color: "primary" } }),
                      _vm._v(" "),
                      _vm._l(_vm.tabs, function(tab, key) {
                        return _c(
                          "v-tabs-item",
                          {
                            key: key,
                            staticClass: "primary--text",
                            attrs: { href: "#" + tab.name, ripple: "" }
                          },
                          [
                            _c("v-icon", { attrs: { color: tab.iconColor } }, [
                              _vm._v(_vm._s(tab.icon))
                            ]),
                            _vm._v(
                              "\n                " +
                                _vm._s(tab.name) +
                                "\n                "
                            )
                          ],
                          1
                        )
                      })
                    ],
                    2
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-tabs-items",
                _vm._l(_vm.tabs, function(tab, key) {
                  return _c(
                    "v-tabs-content",
                    { key: key, attrs: { id: tab.name } },
                    [
                      _c(
                        "v-card",
                        { attrs: { flat: "" } },
                        [
                          _c(tab.component, {
                            tag: "component",
                            attrs: { tab: tab }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                })
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-277ee418", module.exports)
  }
}

/***/ })

});