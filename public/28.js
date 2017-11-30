webpackJsonp([28],{

/***/ 576:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 631:
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

/***/ 632:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(576);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 654:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(911)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(913)
/* template */
var __vue_template__ = __webpack_require__(933)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4c32c06c"
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
Component.options.__file = "resources\\assets\\js\\pages\\Posts.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4c32c06c", Component.options)
  } else {
    hotAPI.reload("data-v-4c32c06c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 658:
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

var listToStyles = __webpack_require__(667)

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

/***/ 659:
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

/***/ 660:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(674)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(676)
/* template */
var __vue_template__ = __webpack_require__(677)
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

/***/ 661:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(662);

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

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(663), __esModule: true };

/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(664);
module.exports = __webpack_require__(31).Object.assign;


/***/ }),

/***/ 664:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(60);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(665) });


/***/ }),

/***/ 665:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(91);
var gOPS = __webpack_require__(131);
var pIE = __webpack_require__(92);
var toObject = __webpack_require__(315);
var IObject = __webpack_require__(316);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(69)(function () {
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

/***/ 666:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        isLoggedIn: function isLoggedIn() {
            return !!this.$store.getters['auth/getMe'];
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

/***/ 667:
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

/***/ 668:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(669)
/* template */
var __vue_template__ = __webpack_require__(697)
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

/***/ 669:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue__ = __webpack_require__(670);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue__ = __webpack_require__(679);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue__ = __webpack_require__(684);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue__ = __webpack_require__(690);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__partials_CookieLaw_vue__ = __webpack_require__(693);
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






// import ShoppingCart from '../partials/ShoppingCart.vue'

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        AppFooter: __WEBPACK_IMPORTED_MODULE_0__partials_AppFooter_vue___default.a,
        AppNavBar: __WEBPACK_IMPORTED_MODULE_1__partials_AppNavBar_vue___default.a,
        LeftSideBar: __WEBPACK_IMPORTED_MODULE_2__partials_LeftSideBar_vue___default.a,
        FabButton: __WEBPACK_IMPORTED_MODULE_3__components_FabButton_vue___default.a,
        CookieLaw: __WEBPACK_IMPORTED_MODULE_4__partials_CookieLaw_vue___default.a
        // ShoppingCart
    }
});

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
var __vue_template__ = __webpack_require__(678)
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

/***/ 671:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(672);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("b358074c", content, false);
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

/***/ 672:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 673:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_theme__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__ = __webpack_require__(660);
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

/***/ 674:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(675);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("75fe3b23", content, false);
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

/***/ 675:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n.styleAvatar[data-v-0af594a9] {\n  position: relative;\n  margin-left: -55px;\n}\n", ""]);

// exports


/***/ }),

/***/ 676:
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

/***/ 677:
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

/***/ 678:
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

/***/ 679:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(680)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(682)
/* template */
var __vue_template__ = __webpack_require__(683)
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

/***/ 680:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(681);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("3a868879", content, false);
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

/***/ 681:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 682:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_theme__ = __webpack_require__(659);
//
//
//
//
//
//
//
//
//
//
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

/***/ 683:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-toolbar",
    {
      staticStyle: { "z-index": "999" },
      style: _vm.navbarStyle,
      attrs: { dark: !_vm.isDark, fixed: "" }
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
              staticClass: "text-xs-center",
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

/***/ 684:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(685)
/* template */
var __vue_template__ = __webpack_require__(689)
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

/***/ 685:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_acl__ = __webpack_require__(666);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_VLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_CategoryLink_vue__ = __webpack_require__(686);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_CategoryLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_CategoryLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mixins_theme__ = __webpack_require__(659);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    mixins: [__WEBPACK_IMPORTED_MODULE_3__mixins_theme__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0__mixins_acl__["a" /* default */]],
    data: function data() {
        return {
            drawer: false,
            links: [], // site navigation links
            members: [], // change with featured Products
            grouplinks: [] // product categories
        };
    },
    components: {
        VLink: __WEBPACK_IMPORTED_MODULE_1__components_VLink_vue___default.a,
        CategoryLink: __WEBPACK_IMPORTED_MODULE_2__components_CategoryLink_vue___default.a
    },
    mounted: function mounted() {
        var self = this;
        Bus.$on('toggleDrawer', function () {
            self.drawer = !self.drawer;
        });
        self.fetchCategories();
        self.fetchNavLinks();
    },

    methods: {
        fetchCategories: function fetchCategories() {
            this.grouplinks = App.grouplinks;
        },
        fetchNavLinks: function fetchNavLinks() {
            this.links = App.menu;
        }
    }

});

/***/ }),

/***/ 686:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(687)
/* template */
var __vue_template__ = __webpack_require__(688)
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
Component.options.__file = "resources\\assets\\js\\components\\CategoryLink.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b1af5e2", Component.options)
  } else {
    hotAPI.reload("data-v-4b1af5e2", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 687:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_VLink_vue__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_VLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_VLink_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['items'],
    components: {
        VLink: __WEBPACK_IMPORTED_MODULE_0__components_VLink_vue___default.a
    },
    data: function data() {
        return {
            dark: App.theme.dark
        };
    },
    methods: {
        loadview: function loadview(item, subItem) {
            this.$router.push({ path: '' + subItem.href });
        },
        hasAvatar: function hasAvatar(subItem) {
            return subItem.avatar !== undefined;
        },
        loadAvatar: function loadAvatar(avatar) {
            return avatar || 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460';
        },
        isGroupActive: function isGroupActive(item) {
            var itemsegment = '';
            var segment = '';
            if (item.href !== undefined) {
                itemsegment = item.href.split('/')[1];
                segment = window.location.pathname.split('/')[1];
                if (itemsegment === segment) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            }
        },
        isActive: function isActive(subItem) {
            if (subItem.href !== undefined) {
                if (subItem.href === window.location.pathname) {
                    subItem.active = true;
                } else {
                    subItem.active = false;
                }
            }
        }
    },
    computed: {
        isDark: function isDark() {
            return this.dark === true;
        }
    }

});

/***/ }),

/***/ 688:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-list",
    _vm._l(_vm.items, function(item) {
      return _c(
        "v-list-group",
        { key: item.title },
        [
          _c(
            "v-list-tile",
            { attrs: { slot: "item" }, slot: "item" },
            [
              !item.avatar
                ? _c(
                    "v-list-tile-action",
                    [_c("v-icon", [_vm._v(_vm._s(item.action))])],
                    1
                  )
                : _c("v-avatar", { attrs: { size: "25px" } }, [
                    _c("img", { attrs: { src: item.avatar, alt: "" } })
                  ]),
              _vm._v(" "),
              !_vm.isDark
                ? _c(
                    "v-list-tile-content",
                    [
                      _c(
                        "v-list-tile-title",
                        {
                          class: {
                            "primary--text": item.active,
                            "blue-grey--text": !item.active,
                            "text--lighten-1": !item.active
                          }
                        },
                        [_vm._v(_vm._s(item.title))]
                      )
                    ],
                    1
                  )
                : _c(
                    "v-list-tile-content",
                    [
                      _c(
                        "v-list-tile-title",
                        {
                          class: {
                            "primary--text": item.active,
                            "text--lighten-2": item.active
                          }
                        },
                        [_vm._v(_vm._s(item.title))]
                      )
                    ],
                    1
                  ),
              _vm._v(" "),
              _c(
                "v-list-tile-action",
                [
                  _c(
                    "v-icon",
                    {
                      class: {
                        "primary--text": !_vm.isDark,
                        "white--text": _vm.isDark
                      }
                    },
                    [_vm._v("keyboard_arrow_down")]
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _vm._l(item.items, function(subItem) {
            return _c("v-link", {
              key: subItem.id,
              attrs: {
                dark: _vm.isDark,
                title: subItem.title,
                avatar: subItem.avatar,
                icon: subItem.action,
                href: subItem.href
              }
            })
          })
        ],
        2
      )
    })
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4b1af5e2", module.exports)
  }
}

/***/ }),

/***/ 689:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-navigation-drawer",
    {
      staticClass: "secondary",
      attrs: { fixed: "", "enable-resize-watcher": "", clipped: "" },
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
        { staticStyle: { "padding-top": "100px" }, attrs: { dense: "" } },
        [
          _vm._l(_vm.links, function(link) {
            return _c("v-link", {
              key: link.id,
              attrs: {
                dark: _vm.darkClass,
                title: link.title,
                href: link.href,
                icon: link.action
              }
            })
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
          _vm.isLoggedIn() && _vm.hasRole("admin")
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          _vm.isLoggedIn()
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
          !_vm.isLoggedIn()
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
          !_vm.isLoggedIn()
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
    require("vue-hot-reload-api")      .rerender("data-v-648c4aca", module.exports)
  }
}

/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(691)
/* template */
var __vue_template__ = __webpack_require__(692)
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

/***/ 691:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(90);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    mapGetters = _createNamespacedHelp.mapGetters;

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
            buttons: [{ name: 'home', href: '/', class: 'indigo lighten-2', icon: 'fa-home', requiresAuth: false }, { name: 'dashboard', href: '/dashboard', class: 'amber lighten-2', icon: 'fa-shopping-bag', requiresAuth: false }, { name: 'login', href: '/login', class: 'success', icon: 'fa-key', requiresAuth: false }, { name: 'register', href: '/register', class: 'info', icon: 'fa-user-plus', requiresAuth: false }, { name: 'logout', href: '/logout', class: 'red lighten-2', icon: 'fa-power-off', requiresAuth: true }, { name: 'scroll-up', href: null, class: 'blue-grey', icon: 'flight_takeoff', requiresAuth: false }],
            activeFab: {
                'class': 'primary', icon: 'fa-rocket'
            }
        };
    },
    computed: __WEBPACK_IMPORTED_MODULE_0_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default()({}, mapGetters({
        getAuth: 'getAuth'
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
                return !self.getAuth;
            } else if (button.requiresAuth === false && button.name === 'register') {
                return !self.getAuth;
            } else if (button.requiresAuth === true) {
                return self.getAuth;
            } else if (button.requiresAuth === false) {
                return true;
            }
        }
    }
});

/***/ }),

/***/ 692:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-speed-dial",
    {
      staticStyle: { "z-index": "999" },
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

/***/ 693:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(694)
/* template */
var __vue_template__ = __webpack_require__(696)
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

/***/ 694:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_cookie_law__ = __webpack_require__(695);
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

/***/ 695:
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

/***/ 696:
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

/***/ 697:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-app",
    { attrs: { standalone: "" } },
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

/***/ 700:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(701)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(703)
/* template */
var __vue_template__ = __webpack_require__(710)
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
Component.options.__file = "resources\\assets\\js\\components\\TextEditor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b3f9ab1", Component.options)
  } else {
    hotAPI.reload("data-v-4b3f9ab1", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 701:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(702);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("73888f36", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b3f9ab1\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./TextEditor.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4b3f9ab1\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./TextEditor.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 702:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 703:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg__ = __webpack_require__(704);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg_dist_ui_trumbowyg_css__ = __webpack_require__(707);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg_dist_ui_trumbowyg_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_trumbowyg_dist_ui_trumbowyg_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_plugins_noembed_trumbowyg_noembed_min_js__ = __webpack_require__(709);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_plugins_noembed_trumbowyg_noembed_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_plugins_noembed_trumbowyg_noembed_min_js__);
//
//
//
//





// import 'trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js'
// import 'trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.css'
// import 'trumbowyg/dist/plugins/base64/trumbowyg.base64.min.js'
// import '../plugins/trumbowyg.upload.js'

/* harmony default export */ __webpack_exports__["default"] = ({
    //* html = content
    //* disabled = disabled
    //* trumbowyg = current instance of trumbowyg
    props: ['html', 'disabled', 'uploadLink', 'id'],
    components: {
        trumbowyg: __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg___default.a
    },
    data: function data() {
        return {
            content: '',
            trumbowyg: null,
            // ? Configuration : https://alex-d.github.io/Trumbowyg/documentation/#use-plugins
            config: {
                advanced: {
                    disabled: false,
                    autogrow: true,
                    removeformatPasted: true,
                    autogrowOnEnter: false,
                    resetCss: true,
                    //! Customized Visible Buttons
                    btns: [['viewHTML'], ['undo'], ['redo'],
                    // ['foreColor'], ['backColor'],
                    ['fontstyle'], ['formatting'], ['alignments'], ['scripts'], ['lists'], ['embeds'], ['links'], ['horizontalRule'], ['removeformat'], ['fullscreen']],
                    //! Customized Buttons Groups
                    btnsDef: {
                        'fontstyle': {
                            title: 'Bold, Italic, Underline, and Strikethrough',
                            dropdown: ['strong', 'em', 'underline', 'strikethrough'],
                            ico: 'strong',
                            hasIcon: true
                        },
                        'scripts': {
                            title: 'Superscript and Subscript',
                            dropdown: ['superscript', 'subscript'],
                            ico: 'superscript',
                            hasIcon: true
                        },
                        'lists': {
                            title: 'Unordered List and Ordered List',
                            dropdown: ['unorderedList', 'orderedList'],
                            ico: 'unorderedList',
                            hasIcon: true
                        },
                        'links': {
                            title: 'Add Link and Remove Link',
                            dropdown: ['createLink', 'unlink'],
                            ico: 'createLink',
                            hasIcon: true
                        },
                        'alignments': {
                            title: 'Align Left, Center, Right , and Justify',
                            dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                            ico: 'justifyCenter'
                        },
                        'embeds': {
                            title: 'Attach Image and Video',
                            //! removed base64 , 'upload'
                            dropdown: ['insertImage', 'noembed'],
                            ico: 'insertImage',
                            hasIcon: true
                        }
                    }
                } // End of Configs

            } };
    },
    mounted: function mounted() {
        var self = this;
        //* Initialized Text Editor Component Data From Props
        self.config.advanced.disabled = self.disabled ? self.disabled : false;
        //* Listen For Upload File Event
        // ? Desctructure payload --> $modal && values
        Bus.$on('upload-file', function () {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : payload,
                data = _ref.data,
                trumbowyg = _ref.trumbowyg;

            self.trumbowyg = trumbowyg;
            self.uploadImage(data);
        });
    },

    watch: {
        //* Whenever Parent Change Active Props Update Config
        // ? Useful For Disabling Text Editor
        'config.advanced.disabled': function configAdvancedDisabled() {
            var self = this;
            if (self.config.advanced.disabled === true) {
                $('#' + self.id).trumbowyg('disable');
            } else {
                $('#' + self.id).trumbowyg('enable');
            }
        },
        content: function content(newValue) {
            var self = this;
            Bus.$emit(self.id + '-updated', newValue);
        },
        html: function html(newValue) {
            var self = this;
            self.content = newValue;
        }
    },
    methods: {
        uploadImage: function uploadImage(form) {
            var self = this;
            axios.post(self.uploadLink, form).then(function (response) {
                self.trumbowyg.execCmd('insertImage', response.data.url);
                //* Attach Uploaded Image , Newly Created Link To Text Editor Component
                $('img[src="' + response.data.url + '"]:not([alt])', __WEBPACK_IMPORTED_MODULE_0_vue_trumbowyg___default.a.$box).attr('alt', response.data.description);
                self.trumbowyg.closeModal();
                self.trumbowyg.$c.trigger('tbwuploadsuccess', [self.trumbowyg, form, response.data.url]);
            }).catch(function () {
                self.$popup({ message: 'Oops! Sorry, Cant Upload Image.', backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
            });
        }
    }
});

/***/ }),

/***/ 704:
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(132), __webpack_require__(705), __webpack_require__(706));
	else if(typeof define === 'function' && define.amd)
		define("VueTrumbowyg", ["jquery", "trumbowyg", "trumbowyg/dist/ui/icons.svg"], factory);
	else if(typeof exports === 'object')
		exports["VueTrumbowyg"] = factory(require("jquery"), require("trumbowyg"), require("trumbowyg/dist/ui/icons.svg"));
	else
		root["VueTrumbowyg"] = factory(root["jQuery"], root["trumbowyg"], root["trumbowyg/dist/ui/icons.svg"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trumbowygPlugin", function() { return trumbowygPlugin; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component_vue__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "component", function() { return __WEBPACK_IMPORTED_MODULE_0__component_vue__["a"]; });


var trumbowygPlugin = function trumbowygPlugin(Vue, params) {
  var name = 'trumbowyg';
  if (typeof params === 'string') name = params;

  Vue.component(name, __WEBPACK_IMPORTED_MODULE_0__component_vue__["a" /* default */]);
};

__WEBPACK_IMPORTED_MODULE_0__component_vue__["a" /* default */].install = trumbowygPlugin;

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__component_vue__["a" /* default */]);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_component_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37154406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_component_vue__ = __webpack_require__(7);
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_component_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37154406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_component_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
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
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
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
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_trumbowyg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_trumbowyg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//




// You have to import css yourself

// You have to configure webpack to load svg files


// https://alex-d.github.io/Trumbowyg/documentation/#events
var events = ['focus', 'blur', 'change', 'resize', 'paste', 'openfullscreen', 'closefullscreen', 'close'];

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'trumbowyg',
  props: {
    value: {
      default: null,
      required: true,
      validator: function validator(value) {
        return value === null || typeof value === 'string' || value instanceof String;
      }
    },
    // http://alex-d.github.io/Trumbowyg/documentation.html#basic-options
    config: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // https://alex-d.github.io/Trumbowyg/documentation/#svg-icons
    svgPath: {
      type: [String, Boolean],
      default: __WEBPACK_IMPORTED_MODULE_2_trumbowyg_dist_ui_icons_svg___default.a
    }
  },
  data: function data() {
    return {
      // jQuery DOM
      el: null
    };
  },
  mounted: function mounted() {
    // Return early if instance is already loaded
    if (this.el) return;

    // Store DOM
    this.el = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this.$el);

    // Init editor with config
    this.el.trumbowyg(_extends({ svgPath: this.svgPath }, this.config));
    // Set initial value
    this.el.trumbowyg('html', this.value);

    // Watch for further changes
    this.el.on('tbwchange', this.onChange);

    // Workaround : trumbowyg does not trigger change event on Ctrl+V
    this.el.on('tbwpaste', this.onChange);

    // Register events
    this.registerEvents();
  },
  beforeDestroy: function beforeDestroy() {
    // Free up memory
    if (this.el) {
      this.el.trumbowyg('destroy');
      this.el = null;
    }
  },

  watch: {
    /**
     * Listen to change from outside of component and update DOM
     *
     * @param newValue String
     */
    value: function value(newValue) {
      if (this.el) {
        // Prevent multiple input events
        if (newValue === this.el.trumbowyg('html')) return;
        // Set new value
        this.el.trumbowyg('html', newValue);
      }
    }
  },
  methods: {
    /**
     * Emit input event with current editor value
     * This will update v-model on parent component
     * This method gets called when value gets changed by editor itself
     *
     * @param event
     */
    onChange: function onChange(event) {
      this.$emit('input', event.target.value);
    },


    /**
     * Emit all available events
     */
    registerEvents: function registerEvents() {
      var _this = this;

      events.forEach(function (name) {
        _this.el.on('tbw' + name, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this.$emit.apply(_this, ['tbw-' + name].concat(args));
        });
      });
    }
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('textarea')}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })
/******/ ]);
});

/***/ }),

/***/ 705:
/***/ (function(module, exports) {

/**
 * Trumbowyg v2.8.1 - A lightweight WYSIWYG editor
 * Trumbowyg core file
 * ------------------------
 * @link http://alex-d.github.io/Trumbowyg
 * @license MIT
 * @author Alexandre Demode (Alex-D)
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

jQuery.trumbowyg = {
    langs: {
        en: {
            viewHTML: 'View HTML',

            undo: 'Undo',
            redo: 'Redo',

            formatting: 'Formatting',
            p: 'Paragraph',
            blockquote: 'Quote',
            code: 'Code',
            header: 'Header',

            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Stroke',
            underline: 'Underline',

            strong: 'Strong',
            em: 'Emphasis',
            del: 'Deleted',

            superscript: 'Superscript',
            subscript: 'Subscript',

            unorderedList: 'Unordered list',
            orderedList: 'Ordered list',

            insertImage: 'Insert Image',
            link: 'Link',
            createLink: 'Insert link',
            unlink: 'Remove link',

            justifyLeft: 'Align Left',
            justifyCenter: 'Align Center',
            justifyRight: 'Align Right',
            justifyFull: 'Align Justify',

            horizontalRule: 'Insert horizontal rule',
            removeformat: 'Remove format',

            fullscreen: 'Fullscreen',

            close: 'Close',

            submit: 'Confirm',
            reset: 'Cancel',

            required: 'Required',
            description: 'Description',
            title: 'Title',
            text: 'Text',
            target: 'Target'
        }
    },

    // Plugins
    plugins: {},

    // SVG Path globally
    svgPath: null,

    hideButtonTexts: null
};

// Makes default options read-only
Object.defineProperty(jQuery.trumbowyg, 'defaultOptions', {
    value: {
        lang: 'en',

        fixedBtnPane: false,
        fixedFullWidth: false,
        autogrow: false,
        autogrowOnEnter: false,

        prefix: 'trumbowyg-',

        semantic: true,
        resetCss: false,
        removeformatPasted: false,
        tagsToRemove: [],
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['fullscreen']
        ],
        // For custom button definitions
        btnsDef: {},

        inlineElementsSelector: 'a,abbr,acronym,b,caption,cite,code,col,dfn,dir,dt,dd,em,font,hr,i,kbd,li,q,span,strikeout,strong,sub,sup,u',

        pasteHandlers: [],

        // imgDblClickHandler: default is defined in constructor

        plugins: {}
    },
    writable: false,
    enumerable: true,
    configurable: false
});


(function (navigator, window, document, $) {
    'use strict';

    var CONFIRM_EVENT = 'tbwconfirm',
        CANCEL_EVENT = 'tbwcancel';

    $.fn.trumbowyg = function (options, params) {
        var trumbowygDataName = 'trumbowyg';
        if (options === Object(options) || !options) {
            return this.each(function () {
                if (!$(this).data(trumbowygDataName)) {
                    $(this).data(trumbowygDataName, new Trumbowyg(this, options));
                }
            });
        }
        if (this.length === 1) {
            try {
                var t = $(this).data(trumbowygDataName);
                switch (options) {
                    // Exec command
                    case 'execCmd':
                        return t.execCmd(params.cmd, params.param, params.forceCss);

                    // Modal box
                    case 'openModal':
                        return t.openModal(params.title, params.content);
                    case 'closeModal':
                        return t.closeModal();
                    case 'openModalInsert':
                        return t.openModalInsert(params.title, params.fields, params.callback);

                    // Range
                    case 'saveRange':
                        return t.saveRange();
                    case 'getRange':
                        return t.range;
                    case 'getRangeText':
                        return t.getRangeText();
                    case 'restoreRange':
                        return t.restoreRange();

                    // Enable/disable
                    case 'enable':
                        return t.setDisabled(false);
                    case 'disable':
                        return t.setDisabled(true);

                    // Destroy
                    case 'destroy':
                        return t.destroy();

                    // Empty
                    case 'empty':
                        return t.empty();

                    // HTML
                    case 'html':
                        return t.html(params);
                }
            } catch (c) {
            }
        }

        return false;
    };

    // @param: editorElem is the DOM element
    var Trumbowyg = function (editorElem, options) {
        var t = this,
            trumbowygIconsId = 'trumbowyg-icons',
            $trumbowyg = $.trumbowyg;

        // Get the document of the element. It use to makes the plugin
        // compatible on iframes.
        t.doc = editorElem.ownerDocument || document;

        // jQuery object of the editor
        t.$ta = $(editorElem); // $ta : Textarea
        t.$c = $(editorElem); // $c : creator

        options = options || {};

        // Localization management
        if (options.lang != null || $trumbowyg.langs[options.lang] != null) {
            t.lang = $.extend(true, {}, $trumbowyg.langs.en, $trumbowyg.langs[options.lang]);
        } else {
            t.lang = $trumbowyg.langs.en;
        }

        t.hideButtonTexts = $trumbowyg.hideButtonTexts != null ? $trumbowyg.hideButtonTexts : options.hideButtonTexts;

        // SVG path
        var svgPathOption = $trumbowyg.svgPath != null ? $trumbowyg.svgPath : options.svgPath;
        t.hasSvg = svgPathOption !== false;
        t.svgPath = !!t.doc.querySelector('base') ? window.location.href.split('#')[0] : '';
        if ($('#' + trumbowygIconsId, t.doc).length === 0 && svgPathOption !== false) {
            if (svgPathOption == null) {
                // Hack to get svgPathOption based on trumbowyg.js path
                try {
                    throw new Error();
                } catch (e) {
                    if (!e.hasOwnProperty('stack')) {
                        console.warn('You must define svgPath: https://goo.gl/CfTY9U'); // jshint ignore:line
                    } else {
                        var stackLines = e.stack.split('\n');

                        for (var i in stackLines) {
                            if (!stackLines[i].match(/https?:\/\//)) {
                                continue;
                            }
                            svgPathOption = stackLines[Number(i)].match(/((https?:\/\/.+\/)([^\/]+\.js))(\?.*)?:/)[1].split('/');
                            svgPathOption.pop();
                            svgPathOption = svgPathOption.join('/') + '/ui/icons.svg';
                            break;
                        }
                    }
                }
            }

            var div = t.doc.createElement('div');
            div.id = trumbowygIconsId;
            t.doc.body.insertBefore(div, t.doc.body.childNodes[0]);
            $.ajax({
                async: true,
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'xml',
                crossDomain: true,
                url: svgPathOption,
                data: null,
                beforeSend: null,
                complete: null,
                success: function (data) {
                    div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
                }
            });
        }


        /**
         * When the button is associated to a empty object
         * fn and title attributs are defined from the button key value
         *
         * For example
         *      foo: {}
         * is equivalent to :
         *      foo: {
         *          fn: 'foo',
         *          title: this.lang.foo
         *      }
         */
        var h = t.lang.header, // Header translation
            isBlinkFunction = function () {
                return (window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window;
            };
        t.btnsDef = {
            viewHTML: {
                fn: 'toggle'
            },

            undo: {
                isSupported: isBlinkFunction,
                key: 'Z'
            },
            redo: {
                isSupported: isBlinkFunction,
                key: 'Y'
            },

            p: {
                fn: 'formatBlock'
            },
            blockquote: {
                fn: 'formatBlock'
            },
            h1: {
                fn: 'formatBlock',
                title: h + ' 1'
            },
            h2: {
                fn: 'formatBlock',
                title: h + ' 2'
            },
            h3: {
                fn: 'formatBlock',
                title: h + ' 3'
            },
            h4: {
                fn: 'formatBlock',
                title: h + ' 4'
            },
            subscript: {
                tag: 'sub'
            },
            superscript: {
                tag: 'sup'
            },

            bold: {
                key: 'B',
                tag: 'b'
            },
            italic: {
                key: 'I',
                tag: 'i'
            },
            underline: {
                tag: 'u'
            },
            strikethrough: {
                tag: 'strike'
            },

            strong: {
                fn: 'bold',
                key: 'B'
            },
            em: {
                fn: 'italic',
                key: 'I'
            },
            del: {
                fn: 'strikethrough'
            },

            createLink: {
                key: 'K',
                tag: 'a'
            },
            unlink: {},

            insertImage: {},

            justifyLeft: {
                tag: 'left',
                forceCss: true
            },
            justifyCenter: {
                tag: 'center',
                forceCss: true
            },
            justifyRight: {
                tag: 'right',
                forceCss: true
            },
            justifyFull: {
                tag: 'justify',
                forceCss: true
            },

            unorderedList: {
                fn: 'insertUnorderedList',
                tag: 'ul'
            },
            orderedList: {
                fn: 'insertOrderedList',
                tag: 'ol'
            },

            horizontalRule: {
                fn: 'insertHorizontalRule'
            },

            removeformat: {},

            fullscreen: {
                class: 'trumbowyg-not-disable'
            },
            close: {
                fn: 'destroy',
                class: 'trumbowyg-not-disable'
            },

            // Dropdowns
            formatting: {
                dropdown: ['p', 'blockquote', 'h1', 'h2', 'h3', 'h4'],
                ico: 'p'
            },
            link: {
                dropdown: ['createLink', 'unlink']
            }
        };

        // Defaults Options
        t.o = $.extend(true, {}, $trumbowyg.defaultOptions, options);
        if (!t.o.hasOwnProperty('imgDblClickHandler')) {
            t.o.imgDblClickHandler = t.getDefaultImgDblClickHandler();
        }

        t.disabled = t.o.disabled || (editorElem.nodeName === 'TEXTAREA' && editorElem.disabled);

        if (options.btns) {
            t.o.btns = options.btns;
        } else if (!t.o.semantic) {
            t.o.btns[3] = ['bold', 'italic', 'underline', 'strikethrough'];
        }

        $.each(t.o.btnsDef, function (btnName, btnDef) {
            t.addBtnDef(btnName, btnDef);
        });

        // put this here in the event it would be merged in with options
        t.eventNamespace = 'trumbowyg-event';

        // Keyboard shortcuts are load in this array
        t.keys = [];

        // Tag to button dynamically hydrated
        t.tagToButton = {};
        t.tagHandlers = [];

        // Admit multiple paste handlers
        t.pasteHandlers = [].concat(t.o.pasteHandlers);

        // Check if browser is IE
        t.isIE = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') !== -1);

        t.init();
    };

    Trumbowyg.prototype = {
        init: function () {
            var t = this;
            t.height = t.$ta.height();

            t.initPlugins();

            try {
                // Disable image resize, try-catch for old IE
                t.doc.execCommand('enableObjectResizing', false, false);
                t.doc.execCommand('defaultParagraphSeparator', false, 'p');
            } catch (e) {
            }

            t.buildEditor();
            t.buildBtnPane();

            t.fixedBtnPaneEvents();

            t.buildOverlay();

            setTimeout(function () {
                if (t.disabled) {
                    t.setDisabled(true);
                }
                t.$c.trigger('tbwinit');
            });
        },

        addBtnDef: function (btnName, btnDef) {
            this.btnsDef[btnName] = btnDef;
        },

        buildEditor: function () {
            var t = this,
                prefix = t.o.prefix,
                html = '';

            t.$box = $('<div/>', {
                class: prefix + 'box ' + prefix + 'editor-visible ' + prefix + t.o.lang + ' trumbowyg'
            });

            // $ta = Textarea
            // $ed = Editor
            t.isTextarea = t.$ta.is('textarea');
            if (t.isTextarea) {
                html = t.$ta.val();
                t.$ed = $('<div/>');
                t.$box
                    .insertAfter(t.$ta)
                    .append(t.$ed, t.$ta);
            } else {
                t.$ed = t.$ta;
                html = t.$ed.html();

                t.$ta = $('<textarea/>', {
                    name: t.$ta.attr('id'),
                    height: t.height
                }).val(html);

                t.$box
                    .insertAfter(t.$ed)
                    .append(t.$ta, t.$ed);
                t.syncCode();
            }

            t.$ta
                .addClass(prefix + 'textarea')
                .attr('tabindex', -1)
            ;

            t.$ed
                .addClass(prefix + 'editor')
                .attr({
                    contenteditable: true,
                    dir: t.lang._dir || 'ltr'
                })
                .html(html)
            ;

            if (t.o.tabindex) {
                t.$ed.attr('tabindex', t.o.tabindex);
            }

            if (t.$c.is('[placeholder]')) {
                t.$ed.attr('placeholder', t.$c.attr('placeholder'));
            }

            if (t.$c.is('[spellcheck]')) {
                t.$ed.attr('spellcheck', t.$c.attr('spellcheck'));
            }

            if (t.o.resetCss) {
                t.$ed.addClass(prefix + 'reset-css');
            }

            if (!t.o.autogrow) {
                t.$ta.add(t.$ed).css({
                    height: t.height
                });
            }

            t.semanticCode();

            if (t.o.autogrowOnEnter) {
                t.$ed.addClass(prefix + 'autogrow-on-enter');
            }

            var ctrl = false,
                composition = false,
                debounceButtonPaneStatus,
                updateEventName = t.isIE ? 'keyup' : 'input';

            t.$ed
                .on('dblclick', 'img', t.o.imgDblClickHandler)
                .on('keydown', function (e) {
                    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                        ctrl = true;
                        var key = t.keys[String.fromCharCode(e.which).toUpperCase()];

                        try {
                            t.execCmd(key.fn, key.param);
                            return false;
                        } catch (c) {
                        }
                    }
                })
                .on('compositionstart compositionupdate', function () {
                    composition = true;
                })
                .on(updateEventName + ' compositionend', function (e) {
                    if (e.type === 'compositionend') {
                        composition = false;
                    } else if (composition) {
                        return;
                    }

                    var keyCode = e.which;

                    if (keyCode >= 37 && keyCode <= 40) {
                        return;
                    }

                    if ((e.ctrlKey || e.metaKey) && (keyCode === 89 || keyCode === 90)) {
                        t.$c.trigger('tbwchange');
                    } else if (!ctrl && keyCode !== 17) {
                        t.semanticCode(false, e.type === 'compositionend' && keyCode === 13);
                        t.$c.trigger('tbwchange');
                    } else if (typeof e.which === 'undefined') {
                        t.semanticCode(false, false, true);
                    }

                    setTimeout(function () {
                        ctrl = false;
                    }, 200);
                })
                .on('mouseup keydown keyup', function () {
                    clearTimeout(debounceButtonPaneStatus);
                    debounceButtonPaneStatus = setTimeout(function () {
                        t.updateButtonPaneStatus();
                    }, 50);
                })
                .on('focus blur', function (e) {
                    t.$c.trigger('tbw' + e.type);
                    if (e.type === 'blur') {
                        $('.' + prefix + 'active-button', t.$btnPane).removeClass(prefix + 'active-button ' + prefix + 'active');
                    }
                    if (t.o.autogrowOnEnter) {
                        if (t.autogrowOnEnterDontClose) {
                            return;
                        }
                        if (e.type === 'focus') {
                            t.autogrowOnEnterWasFocused = true;
                            t.autogrowEditorOnEnter();
                        }
                        else if (!t.o.autogrow) {
                            t.$ed.css({height: t.$ed.css('min-height')});
                            t.$c.trigger('tbwresize');
                        }
                    }
                })
                .on('cut', function () {
                    setTimeout(function () {
                        t.semanticCode(false, true);
                        t.$c.trigger('tbwchange');
                    }, 0);
                })
                .on('paste', function (e) {
                    if (t.o.removeformatPasted) {
                        e.preventDefault();

                        if (window.getSelection && window.getSelection().deleteFromDocument) {
                            window.getSelection().deleteFromDocument();
                        }

                        try {
                            // IE
                            var text = window.clipboardData.getData('Text');

                            try {
                                // <= IE10
                                t.doc.selection.createRange().pasteHTML(text);
                            } catch (c) {
                                // IE 11
                                t.doc.getSelection().getRangeAt(0).insertNode(t.doc.createTextNode(text));
                            }
                            t.$c.trigger('tbwchange', e);
                        } catch (d) {
                            // Not IE
                            t.execCmd('insertText', (e.originalEvent || e).clipboardData.getData('text/plain'));
                        }
                    }

                    // Call pasteHandlers
                    $.each(t.pasteHandlers, function (i, pasteHandler) {
                        pasteHandler(e);
                    });

                    setTimeout(function () {
                        t.semanticCode(false, true);
                        t.$c.trigger('tbwpaste', e);
                    }, 0);
                });

            t.$ta
                .on('keyup', function () {
                    t.$c.trigger('tbwchange');
                })
                .on('paste', function () {
                    setTimeout(function () {
                        t.$c.trigger('tbwchange');
                    }, 0);
                });

            t.$box.on('keydown', function (e) {
                if (e.which === 27 && $('.' + prefix + 'modal-box', t.$box).length === 1) {
                    t.closeModal();
                    return false;
                }
            });
        },

        //autogrow when entering logic
        autogrowEditorOnEnter: function () {
            var t = this;
            t.$ed.removeClass('autogrow-on-enter');
            var oldHeight = t.$ed[0].clientHeight;
            t.$ed.height('auto');
            var totalHeight = t.$ed[0].scrollHeight;
            t.$ed.addClass('autogrow-on-enter');
            if (oldHeight !== totalHeight) {
                t.$ed.height(oldHeight);
                setTimeout(function () {
                    t.$ed.css({height: totalHeight});
                    t.$c.trigger('tbwresize');
                }, 0);
            }
        },


        // Build button pane, use o.btns option
        buildBtnPane: function () {
            var t = this,
                prefix = t.o.prefix;

            var $btnPane = t.$btnPane = $('<div/>', {
                class: prefix + 'button-pane'
            });

            $.each(t.o.btns, function (i, btnGrp) {
                if (!$.isArray(btnGrp)) {
                    btnGrp = [btnGrp];
                }

                var $btnGroup = $('<div/>', {
                    class: prefix + 'button-group ' + ((btnGrp.indexOf('fullscreen') >= 0) ? prefix + 'right' : '')
                });
                $.each(btnGrp, function (i, btn) {
                    try { // Prevent buildBtn error
                        if (t.isSupportedBtn(btn)) { // It's a supported button
                            $btnGroup.append(t.buildBtn(btn));
                        }
                    } catch (c) {
                    }
                });
                $btnPane.append($btnGroup);
            });

            t.$box.prepend($btnPane);
        },


        // Build a button and his action
        buildBtn: function (btnName) { // btnName is name of the button
            var t = this,
                prefix = t.o.prefix,
                btn = t.btnsDef[btnName],
                isDropdown = btn.dropdown,
                hasIcon = btn.hasIcon != null ? btn.hasIcon : true,
                textDef = t.lang[btnName] || btnName,

                $btn = $('<button/>', {
                    type: 'button',
                    class: prefix + btnName + '-button ' + (btn.class || '') + (!hasIcon ? ' ' + prefix + 'textual-button' : ''),
                    html: t.hasSvg && hasIcon ?
                        '<svg><use xlink:href="' + t.svgPath + '#' + prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>' :
                        t.hideButtonTexts ? '' : (btn.text || btn.title || t.lang[btnName] || btnName),
                    title: (btn.title || btn.text || textDef) + ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : ''),
                    tabindex: -1,
                    mousedown: function () {
                        if (!isDropdown || $('.' + btnName + '-' + prefix + 'dropdown', t.$box).is(':hidden')) {
                            $('body', t.doc).trigger('mousedown');
                        }

                        if (t.$btnPane.hasClass(prefix + 'disable') && !$(this).hasClass(prefix + 'active') && !$(this).hasClass(prefix + 'not-disable')) {
                            return false;
                        }

                        t.execCmd((isDropdown ? 'dropdown' : false) || btn.fn || btnName, btn.param || btnName, btn.forceCss);

                        return false;
                    }
                });

            if (isDropdown) {
                $btn.addClass(prefix + 'open-dropdown');
                var dropdownPrefix = prefix + 'dropdown',
                    $dropdown = $('<div/>', { // the dropdown
                        class: dropdownPrefix + '-' + btnName + ' ' + dropdownPrefix + ' ' + prefix + 'fixed-top',
                        'data-dropdown': btnName
                    });
                $.each(isDropdown, function (i, def) {
                    if (t.btnsDef[def] && t.isSupportedBtn(def)) {
                        $dropdown.append(t.buildSubBtn(def));
                    }
                });
                t.$box.append($dropdown.hide());
            } else if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            if (!isDropdown) {
                t.tagToButton[(btn.tag || btnName).toLowerCase()] = btnName;
            }

            return $btn;
        },
        // Build a button for dropdown menu
        // @param n : name of the subbutton
        buildSubBtn: function (btnName) {
            var t = this,
                prefix = t.o.prefix,
                btn = t.btnsDef[btnName],
                hasIcon = btn.hasIcon != null ? btn.hasIcon : true;

            if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            t.tagToButton[(btn.tag || btnName).toLowerCase()] = btnName;

            return $('<button/>', {
                type: 'button',
                class: prefix + btnName + '-dropdown-button' + (btn.ico ? ' ' + prefix + btn.ico + '-button' : ''),
                html: t.hasSvg && hasIcon ? '<svg><use xlink:href="' + t.svgPath + '#' + prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>' + (btn.text || btn.title || t.lang[btnName] || btnName) : (btn.text || btn.title || t.lang[btnName] || btnName),
                title: ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : null),
                style: btn.style || null,
                mousedown: function () {
                    $('body', t.doc).trigger('mousedown');

                    t.execCmd(btn.fn || btnName, btn.param || btnName, btn.forceCss);

                    return false;
                }
            });
        },
        // Check if button is supported
        isSupportedBtn: function (b) {
            try {
                return this.btnsDef[b].isSupported();
            } catch (c) {
            }
            return true;
        },

        // Build overlay for modal box
        buildOverlay: function () {
            var t = this;
            t.$overlay = $('<div/>', {
                class: t.o.prefix + 'overlay'
            }).appendTo(t.$box);
            return t.$overlay;
        },
        showOverlay: function () {
            var t = this;
            $(window).trigger('scroll');
            t.$overlay.fadeIn(200);
            t.$box.addClass(t.o.prefix + 'box-blur');
        },
        hideOverlay: function () {
            var t = this;
            t.$overlay.fadeOut(50);
            t.$box.removeClass(t.o.prefix + 'box-blur');
        },

        // Management of fixed button pane
        fixedBtnPaneEvents: function () {
            var t = this,
                fixedFullWidth = t.o.fixedFullWidth,
                $box = t.$box;

            if (!t.o.fixedBtnPane) {
                return;
            }

            t.isFixed = false;

            $(window)
                .on('scroll.' + t.eventNamespace + ' resize.' + t.eventNamespace, function () {
                    if (!$box) {
                        return;
                    }

                    t.syncCode();

                    var scrollTop = $(window).scrollTop(),
                        offset = $box.offset().top + 1,
                        bp = t.$btnPane,
                        oh = bp.outerHeight() - 2;

                    if ((scrollTop - offset > 0) && ((scrollTop - offset - t.height) < 0)) {
                        if (!t.isFixed) {
                            t.isFixed = true;
                            bp.css({
                                position: 'fixed',
                                top: 0,
                                left: fixedFullWidth ? '0' : 'auto',
                                zIndex: 7
                            });
                            $([t.$ta, t.$ed]).css({marginTop: bp.height()});
                        }
                        bp.css({
                            width: fixedFullWidth ? '100%' : (($box.width() - 1) + 'px')
                        });

                        $('.' + t.o.prefix + 'fixed-top', $box).css({
                            position: fixedFullWidth ? 'fixed' : 'absolute',
                            top: fixedFullWidth ? oh : oh + (scrollTop - offset) + 'px',
                            zIndex: 15
                        });
                    } else if (t.isFixed) {
                        t.isFixed = false;
                        bp.removeAttr('style');
                        $([t.$ta, t.$ed]).css({marginTop: 0});
                        $('.' + t.o.prefix + 'fixed-top', $box).css({
                            position: 'absolute',
                            top: oh
                        });
                    }
                });
        },

        // Disable editor
        setDisabled: function (disable) {
            var t = this,
                prefix = t.o.prefix;

            t.disabled = disable;

            if (disable) {
                t.$ta.attr('disabled', true);
            } else {
                t.$ta.removeAttr('disabled');
            }
            t.$box.toggleClass(prefix + 'disabled', disable);
            t.$ed.attr('contenteditable', !disable);
        },

        // Destroy the editor
        destroy: function () {
            var t = this,
                prefix = t.o.prefix;

            if (t.isTextarea) {
                t.$box.after(
                    t.$ta
                        .css({height: ''})
                        .val(t.html())
                        .removeClass(prefix + 'textarea')
                        .show()
                );
            } else {
                t.$box.after(
                    t.$ed
                        .css({height: ''})
                        .removeClass(prefix + 'editor')
                        .removeAttr('contenteditable')
                        .removeAttr('dir')
                        .html(t.html())
                        .show()
                );
            }

            t.$ed.off('dblclick', 'img');

            t.destroyPlugins();

            t.$box.remove();
            t.$c.removeData('trumbowyg');
            $('body').removeClass(prefix + 'body-fullscreen');
            t.$c.trigger('tbwclose');
            $(window).off('scroll.' + t.eventNamespace + ' resize.' + t.eventNamespace);
        },


        // Empty the editor
        empty: function () {
            this.$ta.val('');
            this.syncCode(true);
        },


        // Function call when click on viewHTML button
        toggle: function () {
            var t = this,
                prefix = t.o.prefix;

            if (t.o.autogrowOnEnter) {
                t.autogrowOnEnterDontClose = !t.$box.hasClass(prefix + 'editor-hidden');
            }

            t.semanticCode(false, true);

            setTimeout(function () {
                t.doc.activeElement.blur();
                t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                t.$btnPane.toggleClass(prefix + 'disable');
                $('.' + prefix + 'viewHTML-button', t.$btnPane).toggleClass(prefix + 'active');
                if (t.$box.hasClass(prefix + 'editor-visible')) {
                    t.$ta.attr('tabindex', -1);
                } else {
                    t.$ta.removeAttr('tabindex');
                }

                if (t.o.autogrowOnEnter && !t.autogrowOnEnterDontClose) {
                    t.autogrowEditorOnEnter();
                }
            }, 0);
        },

        // Open dropdown when click on a button which open that
        dropdown: function (name) {
            var t = this,
                d = t.doc,
                prefix = t.o.prefix,
                $dropdown = $('[data-dropdown=' + name + ']', t.$box),
                $btn = $('.' + prefix + name + '-button', t.$btnPane),
                show = $dropdown.is(':hidden');

            $('body', d).trigger('mousedown');

            if (show) {
                var o = $btn.offset().left;
                $btn.addClass(prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: $btn.offset().top - t.$btnPane.offset().top + $btn.outerHeight(),
                    left: (t.o.fixedFullWidth && t.isFixed) ? o + 'px' : (o - t.$btnPane.offset().left) + 'px'
                }).show();

                $(window).trigger('scroll');

                $('body', d).on('mousedown.' + t.eventNamespace, function (e) {
                    if (!$dropdown.is(e.target)) {
                        $('.' + prefix + 'dropdown', d).hide();
                        $('.' + prefix + 'active', d).removeClass(prefix + 'active');
                        $('body', d).off('mousedown.' + t.eventNamespace);
                    }
                });
            }
        },


        // HTML Code management
        html: function (html) {
            var t = this;
            if (html != null) {
                t.$ta.val(html);
                t.syncCode(true);
                return t;
            }
            return t.$ta.val();
        },
        syncTextarea: function () {
            var t = this;
            t.$ta.val(t.$ed.text().trim().length > 0 || t.$ed.find('hr,img,embed,iframe,input').length > 0 ? t.$ed.html() : '');
        },
        syncCode: function (force) {
            var t = this;
            if (!force && t.$ed.is(':visible')) {
                t.syncTextarea();
            } else {
                // wrap the content in a div it's easier to get the innerhtml
                var html = $('<div>').html(t.$ta.val());
                //scrub the html before loading into the doc
                var safe = $('<div>').append(html);
                $(t.o.tagsToRemove.join(','), safe).remove();
                t.$ed.html(safe.contents().html());
            }

            if (t.o.autogrow) {
                t.height = t.$ed.height();
                if (t.height !== t.$ta.css('height')) {
                    t.$ta.css({height: t.height});
                    t.$c.trigger('tbwresize');
                }
            }
            if (t.o.autogrowOnEnter) {
                // t.autogrowEditorOnEnter();
                t.$ed.height('auto');
                var totalheight = t.autogrowOnEnterWasFocused ? t.$ed[0].scrollHeight : t.$ed.css('min-height');
                if (totalheight !== t.$ta.css('height')) {
                    t.$ed.css({height: totalheight});
                    t.$c.trigger('tbwresize');
                }
            }
        },

        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
        // @param keepRange  : leave selection range as it is
        semanticCode: function (force, full, keepRange) {
            var t = this;
            t.saveRange();
            t.syncCode(force);

            if (t.o.semantic) {
                t.semanticTag('b', 'strong');
                t.semanticTag('i', 'em');
                t.semanticTag('strike', 'del');

                if (full) {
                    var inlineElementsSelector = t.o.inlineElementsSelector,
                        blockElementsSelector = ':not(' + inlineElementsSelector + ')';

                    // Wrap text nodes in span for easier processing
                    t.$ed.contents().filter(function () {
                        return this.nodeType === 3 && this.nodeValue.trim().length > 0;
                    }).wrap('<span data-tbw/>');

                    // Wrap groups of inline elements in paragraphs (recursive)
                    var wrapInlinesInParagraphsFrom = function ($from) {
                        if ($from.length !== 0) {
                            var $finalParagraph = $from.nextUntil(blockElementsSelector).addBack().wrapAll('<p/>').parent(),
                                $nextElement = $finalParagraph.nextAll(inlineElementsSelector).first();
                            $finalParagraph.next('br').remove();
                            wrapInlinesInParagraphsFrom($nextElement);
                        }
                    };
                    wrapInlinesInParagraphsFrom(t.$ed.children(inlineElementsSelector).first());

                    t.semanticTag('div', 'p', true);

                    // Unwrap paragraphs content, containing nothing usefull
                    t.$ed.find('p').filter(function () {
                        // Don't remove currently being edited element
                        if (t.range && this === t.range.startContainer) {
                            return false;
                        }
                        return $(this).text().trim().length === 0 && $(this).children().not('br,span').length === 0;
                    }).contents().unwrap();

                    // Get rid of temporial span's
                    $('[data-tbw]', t.$ed).contents().unwrap();

                    // Remove empty <p>
                    t.$ed.find('p:empty').remove();
                }

                if (!keepRange) {
                    t.restoreRange();
                }

                t.syncTextarea();
            }
        },

        semanticTag: function (oldTag, newTag, copyAttributes) {
            $(oldTag, this.$ed).each(function () {
                var $oldTag = $(this);
                $oldTag.wrap('<' + newTag + '/>');
                if (copyAttributes) {
                    $.each($oldTag.prop('attributes'), function () {
                        $oldTag.parent().attr(this.name, this.value);
                    });
                }
                $oldTag.contents().unwrap();
            });
        },

        // Function call when user click on "Insert Link"
        createLink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode,
                url,
                title,
                target;

            while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                node = node.parentNode;
            }

            if (node && node.nodeName === 'A') {
                var $a = $(node);
                url = $a.attr('href');
                title = $a.attr('title');
                target = $a.attr('target');
                var range = t.doc.createRange();
                range.selectNode(node);
                documentSelection.removeAllRanges();
                documentSelection.addRange(range);
            }

            t.saveRange();

            t.openModalInsert(t.lang.createLink, {
                url: {
                    label: 'URL',
                    required: true,
                    value: url
                },
                title: {
                    label: t.lang.title,
                    value: title
                },
                text: {
                    label: t.lang.text,
                    value: t.getRangeText()
                },
                target: {
                    label: t.lang.target,
                    value: target
                }
            }, function (v) { // v is value
                var link = $(['<a href="', v.url, '">', v.text, '</a>'].join(''));
                if (v.title.length > 0) {
                    link.attr('title', v.title);
                }
                if (v.target.length > 0) {
                    link.attr('target', v.target);
                }
                t.range.deleteContents();
                t.range.insertNode(link[0]);
                return true;
            });
        },
        unlink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode;

            if (documentSelection.isCollapsed) {
                while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                    node = node.parentNode;
                }

                if (node && node.nodeName === 'A') {
                    var range = t.doc.createRange();
                    range.selectNode(node);
                    documentSelection.removeAllRanges();
                    documentSelection.addRange(range);
                }
            }
            t.execCmd('unlink', undefined, undefined, true);
        },
        insertImage: function () {
            var t = this;
            t.saveRange();
            t.openModalInsert(t.lang.insertImage, {
                url: {
                    label: 'URL',
                    required: true
                },
                alt: {
                    label: t.lang.description,
                    value: t.getRangeText()
                }
            }, function (v) { // v are values
                t.execCmd('insertImage', v.url);
                $('img[src="' + v.url + '"]:not([alt])', t.$box).attr('alt', v.alt);
                return true;
            });
        },
        fullscreen: function () {
            var t = this,
                prefix = t.o.prefix,
                fullscreenCssClass = prefix + 'fullscreen',
                isFullscreen;

            t.$box.toggleClass(fullscreenCssClass);
            isFullscreen = t.$box.hasClass(fullscreenCssClass);
            $('body').toggleClass(prefix + 'body-fullscreen', isFullscreen);
            $(window).trigger('scroll');
            t.$c.trigger('tbw' + (isFullscreen ? 'open' : 'close') + 'fullscreen');
        },


        /*
         * Call method of trumbowyg if exist
         * else try to call anonymous function
         * and finaly native execCommand
         */
        execCmd: function (cmd, param, forceCss, skipTrumbowyg) {
            var t = this;
            skipTrumbowyg = !!skipTrumbowyg || '';

            if (cmd !== 'dropdown') {
                t.$ed.focus();
            }

            try {
                t.doc.execCommand('styleWithCSS', false, forceCss || false);
            } catch (c) {
            }

            try {
                t[cmd + skipTrumbowyg](param);
            } catch (c) {
                try {
                    cmd(param);
                } catch (e2) {
                    if (cmd === 'insertHorizontalRule') {
                        param = undefined;
                    } else if (cmd === 'formatBlock' && t.isIE) {
                        param = '<' + param + '>';
                    }

                    t.doc.execCommand(cmd, false, param);

                    t.syncCode();
                    t.semanticCode(false, true);
                }

                if (cmd !== 'dropdown') {
                    t.updateButtonPaneStatus();
                    t.$c.trigger('tbwchange');
                }
            }
        },


        // Open a modal box
        openModal: function (title, content) {
            var t = this,
                prefix = t.o.prefix;

            // No open a modal box when exist other modal box
            if ($('.' + prefix + 'modal-box', t.$box).length > 0) {
                return false;
            }
            if (t.o.autogrowOnEnter) {
                t.autogrowOnEnterDontClose = true;
            }

            t.saveRange();
            t.showOverlay();

            // Disable all btnPane btns
            t.$btnPane.addClass(prefix + 'disable');

            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                class: prefix + 'modal ' + prefix + 'fixed-top'
            }).css({
                top: t.$btnPane.height()
            }).appendTo(t.$box);

            // Click on overlay close modal by cancelling them
            t.$overlay.one('click', function () {
                $modal.trigger(CANCEL_EVENT);
                return false;
            });

            // Build the form
            var $form = $('<form/>', {
                action: '',
                html: content
            })
                .on('submit', function () {
                    $modal.trigger(CONFIRM_EVENT);
                    return false;
                })
                .on('reset', function () {
                    $modal.trigger(CANCEL_EVENT);
                    return false;
                })
                .on('submit reset', function () {
                    if (t.o.autogrowOnEnter) {
                        t.autogrowOnEnterDontClose = false;
                    }
                });


            // Build ModalBox and animate to show them
            var $box = $('<div/>', {
                class: prefix + 'modal-box',
                html: $form
            })
                .css({
                    top: '-' + t.$btnPane.outerHeight() + 'px',
                    opacity: 0
                })
                .appendTo($modal)
                .animate({
                    top: 0,
                    opacity: 1
                }, 100);


            // Append title
            $('<span/>', {
                text: title,
                class: prefix + 'modal-title'
            }).prependTo($box);

            $modal.height($box.outerHeight() + 10);


            // Focus in modal box
            $('input:first', $box).focus();


            // Append Confirm and Cancel buttons
            t.buildModalBtn('submit', $box);
            t.buildModalBtn('reset', $box);


            $(window).trigger('scroll');

            return $modal;
        },
        // @param n is name of modal
        buildModalBtn: function (n, $modal) {
            var t = this,
                prefix = t.o.prefix;

            return $('<button/>', {
                class: prefix + 'modal-button ' + prefix + 'modal-' + n,
                type: n,
                text: t.lang[n] || n
            }).appendTo($('form', $modal));
        },
        // close current modal box
        closeModal: function () {
            var t = this,
                prefix = t.o.prefix;

            t.$btnPane.removeClass(prefix + 'disable');
            t.$overlay.off();

            // Find the modal box
            var $modalBox = $('.' + prefix + 'modal-box', t.$box);

            $modalBox.animate({
                top: '-' + $modalBox.height()
            }, 100, function () {
                $modalBox.parent().remove();
                t.hideOverlay();
            });

            t.restoreRange();
        },
        // Preformated build and management modal
        openModalInsert: function (title, fields, cmd) {
            var t = this,
                prefix = t.o.prefix,
                lg = t.lang,
                html = '';

            $.each(fields, function (fieldName, field) {
                var l = field.label,
                    n = field.name || fieldName,
                    a = field.attributes || {};

                var attr = Object.keys(a).map(function (prop) {
                    return prop + '="' + a[prop] + '"';
                }).join(' ');

                html += '<label><input type="' + (field.type || 'text') + '" name="' + n + '" value="' + (field.value || '').replace(/"/g, '&quot;') + '"' + attr + '><span class="' + prefix + 'input-infos"><span>' +
                    ((!l) ? (lg[fieldName] ? lg[fieldName] : fieldName) : (lg[l] ? lg[l] : l)) +
                    '</span></span></label>';
            });

            return t.openModal(title, html)
                .on(CONFIRM_EVENT, function () {
                    var $form = $('form', $(this)),
                        valid = true,
                        values = {};

                    $.each(fields, function (fieldName, field) {
                        var $field = $('input[name="' + fieldName + '"]', $form),
                            inputType = $field.attr('type');

                        if (inputType.toLowerCase() === 'checkbox') {
                            values[fieldName] = $field.is(':checked');
                        } else {
                            values[fieldName] = $.trim($field.val());
                        }
                        // Validate value
                        if (field.required && values[fieldName] === '') {
                            valid = false;
                            t.addErrorOnModalField($field, t.lang.required);
                        } else if (field.pattern && !field.pattern.test(values[fieldName])) {
                            valid = false;
                            t.addErrorOnModalField($field, field.patternError);
                        }
                    });

                    if (valid) {
                        t.restoreRange();

                        if (cmd(values, fields)) {
                            t.syncCode();
                            t.$c.trigger('tbwchange');
                            t.closeModal();
                            $(this).off(CONFIRM_EVENT);
                        }
                    }
                })
                .one(CANCEL_EVENT, function () {
                    $(this).off(CONFIRM_EVENT);
                    t.closeModal();
                });
        },
        addErrorOnModalField: function ($field, err) {
            var prefix = this.o.prefix,
                $label = $field.parent();

            $field
                .on('change keyup', function () {
                    $label.removeClass(prefix + 'input-error');
                });

            $label
                .addClass(prefix + 'input-error')
                .find('input+span')
                .append(
                    $('<span/>', {
                        class: prefix + 'msg-error',
                        text: err
                    })
                );
        },

        getDefaultImgDblClickHandler: function () {
            var t = this;

            return function () {
                var $img = $(this),
                    src = $img.attr('src'),
                    base64 = '(Base64)';

                if (src.indexOf('data:image') === 0) {
                    src = base64;
                }

                t.openModalInsert(t.lang.insertImage, {
                    url: {
                        label: 'URL',
                        value: src,
                        required: true
                    },
                    alt: {
                        label: t.lang.description,
                        value: $img.attr('alt')
                    }
                }, function (v) {
                    if (v.src !== base64) {
                        $img.attr({
                            src: v.src
                        });
                    }
                    $img.attr({
                        alt: v.alt
                    });
                    return true;
                });
                return false;
            };
        },

        // Range management
        saveRange: function () {
            var t = this,
                documentSelection = t.doc.getSelection();

            t.range = null;

            if (documentSelection.rangeCount) {
                var savedRange = t.range = documentSelection.getRangeAt(0),
                    range = t.doc.createRange(),
                    rangeStart;
                range.selectNodeContents(t.$ed[0]);
                range.setEnd(savedRange.startContainer, savedRange.startOffset);
                rangeStart = (range + '').length;
                t.metaRange = {
                    start: rangeStart,
                    end: rangeStart + (savedRange + '').length
                };
            }
        },
        restoreRange: function () {
            var t = this,
                metaRange = t.metaRange,
                savedRange = t.range,
                documentSelection = t.doc.getSelection(),
                range;

            if (!savedRange) {
                return;
            }

            if (metaRange && metaRange.start !== metaRange.end) { // Algorithm from http://jsfiddle.net/WeWy7/3/
                var charIndex = 0,
                    nodeStack = [t.$ed[0]],
                    node,
                    foundStart = false,
                    stop = false;

                range = t.doc.createRange();

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType === 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && metaRange.start >= charIndex && metaRange.start <= nextCharIndex) {
                            range.setStart(node, metaRange.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && metaRange.end >= charIndex && metaRange.end <= nextCharIndex) {
                            range.setEnd(node, metaRange.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var cn = node.childNodes,
                            i = cn.length;

                        while (i > 0) {
                            i -= 1;
                            nodeStack.push(cn[i]);
                        }
                    }
                }
            }

            documentSelection.removeAllRanges();
            documentSelection.addRange(range || savedRange);
        },
        getRangeText: function () {
            return this.range + '';
        },

        updateButtonPaneStatus: function () {
            var t = this,
                prefix = t.o.prefix,
                tags = t.getTagsRecursive(t.doc.getSelection().focusNode),
                activeClasses = prefix + 'active-button ' + prefix + 'active';

            $('.' + prefix + 'active-button', t.$btnPane).removeClass(activeClasses);
            $.each(tags, function (i, tag) {
                var btnName = t.tagToButton[tag.toLowerCase()],
                    $btn = $('.' + prefix + btnName + '-button', t.$btnPane);

                if ($btn.length > 0) {
                    $btn.addClass(activeClasses);
                } else {
                    try {
                        $btn = $('.' + prefix + 'dropdown .' + prefix + btnName + '-dropdown-button', t.$box);
                        var dropdownBtnName = $btn.parent().data('dropdown');
                        $('.' + prefix + dropdownBtnName + '-button', t.$box).addClass(activeClasses);
                    } catch (e) {
                    }
                }
            });
        },
        getTagsRecursive: function (element, tags) {
            var t = this;
            tags = tags || (element && element.tagName ? [element.tagName] : []);

            if (element && element.parentNode) {
                element = element.parentNode;
            } else {
                return tags;
            }

            var tag = element.tagName;
            if (tag === 'DIV') {
                return tags;
            }
            if (tag === 'P' && element.style.textAlign !== '') {
                tags.push(element.style.textAlign);
            }

            $.each(t.tagHandlers, function (i, tagHandler) {
                tags = tags.concat(tagHandler(element, t));
            });

            tags.push(tag);

            return t.getTagsRecursive(element, tags).filter(function(tag) { return tag != null; });
        },

        // Plugins
        initPlugins: function () {
            var t = this;
            t.loadedPlugins = [];
            $.each($.trumbowyg.plugins, function (name, plugin) {
                if (!plugin.shouldInit || plugin.shouldInit(t)) {
                    plugin.init(t);
                    if (plugin.tagHandler) {
                        t.tagHandlers.push(plugin.tagHandler);
                    }
                    t.loadedPlugins.push(plugin);
                }
            });
        },
        destroyPlugins: function () {
            $.each(this.loadedPlugins, function (i, plugin) {
                if (plugin.destroy) {
                    plugin.destroy();
                }
            });
        }
    };
})(navigator, window, document, jQuery);


/***/ }),

/***/ 706:
/***/ (function(module, exports) {

module.exports = "/fonts/vendor/trumbowyg/dist/ui/icons.svg?fe14a6066b297f1848cbaafa1efb22c5";

/***/ }),

/***/ 707:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(708);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(632)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./trumbowyg.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./trumbowyg.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 708:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "/**\n * Trumbowyg v2.8.1 - A lightweight WYSIWYG editor\n * Default stylesheet for Trumbowyg editor\n * ------------------------\n * @link http://alex-d.github.io/Trumbowyg\n * @license MIT\n * @author Alexandre Demode (Alex-D)\n *         Twitter : @AlexandreDemode\n *         Website : alex-d.fr\n */\n\n#trumbowyg-icons {\n  overflow: hidden;\n  visibility: hidden;\n  height: 0;\n  width: 0; }\n  #trumbowyg-icons svg {\n    height: 0;\n    width: 0; }\n\n.trumbowyg-box *,\n.trumbowyg-box *::before,\n.trumbowyg-box *::after {\n  box-sizing: border-box; }\n\n.trumbowyg-box svg {\n  width: 17px;\n  height: 100%;\n  fill: #222; }\n\n.trumbowyg-box,\n.trumbowyg-editor {\n  display: block;\n  position: relative;\n  border: 1px solid #DDD;\n  width: 100%;\n  min-height: 300px;\n  margin: 17px auto; }\n\n.trumbowyg-box .trumbowyg-editor {\n  margin: 0 auto; }\n\n.trumbowyg-box.trumbowyg-fullscreen {\n  background: #FEFEFE;\n  border: none !important; }\n\n.trumbowyg-editor,\n.trumbowyg-textarea {\n  position: relative;\n  box-sizing: border-box;\n  padding: 20px;\n  min-height: 300px;\n  width: 100%;\n  border-style: none;\n  resize: none;\n  outline: none;\n  overflow: auto; }\n  .trumbowyg-editor.trumbowyg-autogrow-on-enter,\n  .trumbowyg-textarea.trumbowyg-autogrow-on-enter {\n    transition: height 300ms ease-out; }\n\n.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-box-blur .trumbowyg-editor::before {\n  color: transparent !important;\n  text-shadow: 0 0 7px #333; }\n  @media screen and (min-width: 0 \\0) {\n    .trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-box-blur .trumbowyg-editor::before {\n      color: rgba(200, 200, 200, 0.6) !important; } }\n  @supports (-ms-accelerator: true) {\n    .trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-box-blur .trumbowyg-editor::before {\n      color: rgba(200, 200, 200, 0.6) !important; } }\n\n.trumbowyg-box-blur .trumbowyg-editor img,\n.trumbowyg-box-blur .trumbowyg-editor hr {\n  opacity: 0.2; }\n\n.trumbowyg-textarea {\n  position: relative;\n  display: block;\n  overflow: auto;\n  border: none;\n  white-space: normal;\n  font-size: 14px;\n  font-family: \"Inconsolata\", \"Consolas\", \"Courier\", \"Courier New\", sans-serif;\n  line-height: 18px; }\n\n.trumbowyg-box.trumbowyg-editor-visible .trumbowyg-textarea {\n  height: 1px !important;\n  width: 25%;\n  min-height: 0 !important;\n  padding: 0 !important;\n  background: none;\n  opacity: 0 !important; }\n\n.trumbowyg-box.trumbowyg-editor-hidden .trumbowyg-textarea {\n  display: block; }\n\n.trumbowyg-box.trumbowyg-editor-hidden .trumbowyg-editor {\n  display: none; }\n\n.trumbowyg-box.trumbowyg-disabled .trumbowyg-textarea {\n  opacity: 0.8;\n  background: none; }\n\n.trumbowyg-editor[contenteditable=true]:empty:not(:focus)::before {\n  content: attr(placeholder);\n  color: #999;\n  pointer-events: none; }\n\n.trumbowyg-button-pane {\n  width: 100%;\n  min-height: 36px;\n  background: #ecf0f1;\n  border-bottom: 1px solid #d7e0e2;\n  margin: 0;\n  padding: 0 5px;\n  position: relative;\n  list-style-type: none;\n  line-height: 10px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  z-index: 11; }\n  .trumbowyg-button-pane::after {\n    content: \" \";\n    display: block;\n    position: absolute;\n    top: 36px;\n    left: 0;\n    right: 0;\n    width: 100%;\n    height: 1px;\n    background: #d7e0e2; }\n  .trumbowyg-button-pane .trumbowyg-button-group {\n    display: inline-block; }\n    .trumbowyg-button-pane .trumbowyg-button-group .trumbowyg-fullscreen-button svg {\n      color: transparent; }\n    .trumbowyg-button-pane .trumbowyg-button-group:not(:empty) + .trumbowyg-button-group::before {\n      content: \" \";\n      display: inline-block;\n      width: 1px;\n      background: #d7e0e2;\n      margin: 0 5px;\n      height: 35px;\n      vertical-align: top; }\n  .trumbowyg-button-pane button {\n    display: inline-block;\n    position: relative;\n    width: 35px;\n    height: 35px;\n    padding: 1px 6px !important;\n    margin-bottom: 1px;\n    overflow: hidden;\n    border: none;\n    cursor: pointer;\n    background: none;\n    vertical-align: middle;\n    transition: background-color 150ms, opacity 150ms; }\n    .trumbowyg-button-pane button.trumbowyg-textual-button {\n      width: auto;\n      line-height: 35px;\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none; }\n  .trumbowyg-button-pane.trumbowyg-disable button:not(.trumbowyg-not-disable):not(.trumbowyg-active),\n  .trumbowyg-disabled .trumbowyg-button-pane button:not(.trumbowyg-not-disable):not(.trumbowyg-viewHTML-button) {\n    opacity: 0.2;\n    cursor: default; }\n  .trumbowyg-button-pane.trumbowyg-disable .trumbowyg-button-group::before,\n  .trumbowyg-disabled .trumbowyg-button-pane .trumbowyg-button-group::before {\n    background: #e3e9eb; }\n  .trumbowyg-button-pane button:not(.trumbowyg-disable):hover,\n  .trumbowyg-button-pane button:not(.trumbowyg-disable):focus,\n  .trumbowyg-button-pane button.trumbowyg-active {\n    background-color: #FFF;\n    outline: none; }\n  .trumbowyg-button-pane .trumbowyg-open-dropdown::after {\n    display: block;\n    content: \" \";\n    position: absolute;\n    top: 25px;\n    right: 3px;\n    height: 0;\n    width: 0;\n    border: 3px solid transparent;\n    border-top-color: #555; }\n  .trumbowyg-button-pane .trumbowyg-open-dropdown.trumbowyg-textual-button {\n    padding-left: 10px !important;\n    padding-right: 18px !important; }\n    .trumbowyg-button-pane .trumbowyg-open-dropdown.trumbowyg-textual-button::after {\n      top: 17px;\n      right: 7px; }\n  .trumbowyg-button-pane .trumbowyg-right {\n    float: right; }\n    .trumbowyg-button-pane .trumbowyg-right::before {\n      display: none !important; }\n\n.trumbowyg-dropdown {\n  width: 200px;\n  border: 1px solid #ecf0f1;\n  padding: 5px 0;\n  border-top: none;\n  background: #FFF;\n  margin-left: -1px;\n  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 3px;\n  z-index: 11; }\n  .trumbowyg-dropdown button {\n    display: block;\n    width: 100%;\n    height: 35px;\n    line-height: 35px;\n    text-decoration: none;\n    background: #FFF;\n    padding: 0 10px;\n    color: #333 !important;\n    border: none;\n    cursor: pointer;\n    text-align: left;\n    font-size: 15px;\n    transition: all 150ms; }\n    .trumbowyg-dropdown button:hover, .trumbowyg-dropdown button:focus {\n      background: #ecf0f1; }\n    .trumbowyg-dropdown button svg {\n      float: left;\n      margin-right: 14px; }\n\n/* Modal box */\n.trumbowyg-modal {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  max-width: 520px;\n  width: 100%;\n  height: 350px;\n  z-index: 11;\n  overflow: hidden;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n\n.trumbowyg-modal-box {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  max-width: 500px;\n  width: calc(100% - 20px);\n  padding-bottom: 45px;\n  z-index: 1;\n  background-color: #FFF;\n  text-align: center;\n  font-size: 14px;\n  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 3px;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden; }\n  .trumbowyg-modal-box .trumbowyg-modal-title {\n    font-size: 24px;\n    font-weight: bold;\n    margin: 0 0 20px;\n    padding: 15px 0 13px;\n    display: block;\n    border-bottom: 1px solid #EEE;\n    color: #333;\n    background: #fbfcfc; }\n  .trumbowyg-modal-box .trumbowyg-progress {\n    width: 100%;\n    height: 3px;\n    position: absolute;\n    top: 58px; }\n    .trumbowyg-modal-box .trumbowyg-progress .trumbowyg-progress-bar {\n      background: #2BC06A;\n      width: 0;\n      height: 100%;\n      transition: width 150ms linear; }\n  .trumbowyg-modal-box label {\n    display: block;\n    position: relative;\n    margin: 15px 12px;\n    height: 29px;\n    line-height: 29px;\n    overflow: hidden; }\n    .trumbowyg-modal-box label .trumbowyg-input-infos {\n      display: block;\n      text-align: left;\n      height: 25px;\n      line-height: 25px;\n      transition: all 150ms; }\n      .trumbowyg-modal-box label .trumbowyg-input-infos span {\n        display: block;\n        color: #69878f;\n        background-color: #fbfcfc;\n        border: 1px solid #DEDEDE;\n        padding: 0 7px;\n        width: 150px; }\n      .trumbowyg-modal-box label .trumbowyg-input-infos span.trumbowyg-msg-error {\n        color: #e74c3c; }\n    .trumbowyg-modal-box label.trumbowyg-input-error input,\n    .trumbowyg-modal-box label.trumbowyg-input-error textarea {\n      border: 1px solid #e74c3c; }\n    .trumbowyg-modal-box label.trumbowyg-input-error .trumbowyg-input-infos {\n      margin-top: -27px; }\n    .trumbowyg-modal-box label input {\n      position: absolute;\n      top: 0;\n      right: 0;\n      height: 27px;\n      line-height: 27px;\n      border: 1px solid #DEDEDE;\n      background: #fff;\n      font-size: 14px;\n      max-width: 330px;\n      width: 70%;\n      padding: 0 7px;\n      transition: all 150ms; }\n      .trumbowyg-modal-box label input:hover, .trumbowyg-modal-box label input:focus {\n        outline: none;\n        border: 1px solid #95a5a6; }\n      .trumbowyg-modal-box label input:focus {\n        background: #fbfcfc; }\n  .trumbowyg-modal-box .error {\n    margin-top: 25px;\n    display: block;\n    color: red; }\n  .trumbowyg-modal-box .trumbowyg-modal-button {\n    position: absolute;\n    bottom: 10px;\n    right: 0;\n    text-decoration: none;\n    color: #FFF;\n    display: block;\n    width: 100px;\n    height: 35px;\n    line-height: 33px;\n    margin: 0 10px;\n    background-color: #333;\n    border: none;\n    cursor: pointer;\n    font-family: \"Trebuchet MS\", Helvetica, Verdana, sans-serif;\n    font-size: 16px;\n    transition: all 150ms; }\n    .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit {\n      right: 110px;\n      background: #2bc06a; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:hover, .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:focus {\n        background: #40d47e;\n        outline: none; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:active {\n        background: #25a25a; }\n    .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset {\n      color: #555;\n      background: #e6e6e6; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:hover, .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:focus {\n        background: #fbfbfb;\n        outline: none; }\n      .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:active {\n        background: #d5d5d5; }\n\n.trumbowyg-overlay {\n  position: absolute;\n  background-color: rgba(255, 255, 255, 0.5);\n  height: 100%;\n  width: 100%;\n  left: 0;\n  display: none;\n  top: 0;\n  z-index: 10; }\n\n/**\n * Fullscreen\n */\nbody.trumbowyg-body-fullscreen {\n  overflow: hidden; }\n\n.trumbowyg-fullscreen {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  z-index: 99999; }\n  .trumbowyg-fullscreen.trumbowyg-box,\n  .trumbowyg-fullscreen .trumbowyg-editor {\n    border: none; }\n  .trumbowyg-fullscreen .trumbowyg-editor,\n  .trumbowyg-fullscreen .trumbowyg-textarea {\n    height: calc(100% - 37px) !important;\n    overflow: auto; }\n  .trumbowyg-fullscreen .trumbowyg-overlay {\n    height: 100% !important; }\n  .trumbowyg-fullscreen .trumbowyg-button-group .trumbowyg-fullscreen-button svg {\n    color: #222;\n    fill: transparent; }\n\n.trumbowyg-editor {\n  /*\n     * lset for resetCss option\n     */ }\n  .trumbowyg-editor object,\n  .trumbowyg-editor embed,\n  .trumbowyg-editor video,\n  .trumbowyg-editor img {\n    max-width: 100%; }\n  .trumbowyg-editor video,\n  .trumbowyg-editor img {\n    height: auto; }\n  .trumbowyg-editor img {\n    cursor: move; }\n  .trumbowyg-editor.trumbowyg-reset-css {\n    background: #FEFEFE !important;\n    font-family: \"Trebuchet MS\", Helvetica, Verdana, sans-serif !important;\n    font-size: 14px !important;\n    line-height: 1.45em !important;\n    white-space: normal !important;\n    color: #333; }\n    .trumbowyg-editor.trumbowyg-reset-css a {\n      color: #15c !important;\n      text-decoration: underline !important; }\n    .trumbowyg-editor.trumbowyg-reset-css div,\n    .trumbowyg-editor.trumbowyg-reset-css p,\n    .trumbowyg-editor.trumbowyg-reset-css ul,\n    .trumbowyg-editor.trumbowyg-reset-css ol,\n    .trumbowyg-editor.trumbowyg-reset-css blockquote {\n      box-shadow: none !important;\n      background: none !important;\n      margin: 0 !important;\n      margin-bottom: 15px !important;\n      line-height: 1.4em !important;\n      font-family: \"Trebuchet MS\", Helvetica, Verdana, sans-serif !important;\n      font-size: 14px !important;\n      border: none; }\n    .trumbowyg-editor.trumbowyg-reset-css iframe,\n    .trumbowyg-editor.trumbowyg-reset-css object,\n    .trumbowyg-editor.trumbowyg-reset-css hr {\n      margin-bottom: 15px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css blockquote {\n      margin-left: 32px !important;\n      font-style: italic !important;\n      color: #555; }\n    .trumbowyg-editor.trumbowyg-reset-css ul,\n    .trumbowyg-editor.trumbowyg-reset-css ol {\n      padding-left: 20px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css ul ul,\n    .trumbowyg-editor.trumbowyg-reset-css ol ol,\n    .trumbowyg-editor.trumbowyg-reset-css ul ol,\n    .trumbowyg-editor.trumbowyg-reset-css ol ul {\n      border: none;\n      margin: 2px !important;\n      padding: 0 !important;\n      padding-left: 24px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css hr {\n      display: block;\n      height: 1px;\n      border: none;\n      border-top: 1px solid #CCC; }\n    .trumbowyg-editor.trumbowyg-reset-css h1,\n    .trumbowyg-editor.trumbowyg-reset-css h2,\n    .trumbowyg-editor.trumbowyg-reset-css h3,\n    .trumbowyg-editor.trumbowyg-reset-css h4 {\n      color: #111;\n      background: none;\n      margin: 0 !important;\n      padding: 0 !important;\n      font-weight: bold; }\n    .trumbowyg-editor.trumbowyg-reset-css h1 {\n      font-size: 32px !important;\n      line-height: 38px !important;\n      margin-bottom: 20px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css h2 {\n      font-size: 26px !important;\n      line-height: 34px !important;\n      margin-bottom: 15px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css h3 {\n      font-size: 22px !important;\n      line-height: 28px !important;\n      margin-bottom: 7px !important; }\n    .trumbowyg-editor.trumbowyg-reset-css h4 {\n      font-size: 16px !important;\n      line-height: 22px !important;\n      margin-bottom: 7px !important; }\n\n/*\n * Dark theme\n */\n.trumbowyg-dark .trumbowyg-textarea {\n  background: #111;\n  color: #ddd; }\n\n.trumbowyg-dark .trumbowyg-box {\n  border: 1px solid #343434; }\n  .trumbowyg-dark .trumbowyg-box.trumbowyg-fullscreen {\n    background: #111; }\n  .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor::before {\n    text-shadow: 0 0 7px #ccc; }\n    @media screen and (min-width: 0 \\0 ) {\n      .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor::before {\n        color: rgba(20, 20, 20, 0.6) !important; } }\n    @supports (-ms-accelerator: true) {\n      .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor *, .trumbowyg-dark .trumbowyg-box.trumbowyg-box-blur .trumbowyg-editor::before {\n        color: rgba(20, 20, 20, 0.6) !important; } }\n  .trumbowyg-dark .trumbowyg-box svg {\n    fill: #ecf0f1;\n    color: #ecf0f1; }\n\n.trumbowyg-dark .trumbowyg-button-pane {\n  background-color: #222;\n  border-bottom-color: #343434; }\n  .trumbowyg-dark .trumbowyg-button-pane::after {\n    background: #343434; }\n  .trumbowyg-dark .trumbowyg-button-pane .trumbowyg-button-group:not(:empty)::before {\n    background-color: #343434; }\n  .trumbowyg-dark .trumbowyg-button-pane .trumbowyg-button-group:not(:empty) .trumbowyg-fullscreen-button svg {\n    color: transparent; }\n  .trumbowyg-dark .trumbowyg-button-pane.trumbowyg-disable .trumbowyg-button-group::before {\n    background-color: #2a2a2a; }\n  .trumbowyg-dark .trumbowyg-button-pane button:not(.trumbowyg-disable):hover,\n  .trumbowyg-dark .trumbowyg-button-pane button:not(.trumbowyg-disable):focus,\n  .trumbowyg-dark .trumbowyg-button-pane button.trumbowyg-active {\n    background-color: #333; }\n  .trumbowyg-dark .trumbowyg-button-pane .trumbowyg-open-dropdown::after {\n    border-top-color: #fff; }\n\n.trumbowyg-dark .trumbowyg-fullscreen .trumbowyg-button-group .trumbowyg-fullscreen-button svg {\n  color: #ecf0f1;\n  fill: transparent; }\n\n.trumbowyg-dark .trumbowyg-dropdown {\n  border-color: #222;\n  background: #333;\n  box-shadow: rgba(0, 0, 0, 0.3) 0 2px 3px; }\n  .trumbowyg-dark .trumbowyg-dropdown button {\n    background: #333;\n    color: #fff !important; }\n    .trumbowyg-dark .trumbowyg-dropdown button:hover, .trumbowyg-dark .trumbowyg-dropdown button:focus {\n      background: #222; }\n\n.trumbowyg-dark .trumbowyg-modal-box {\n  background-color: #222; }\n  .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-title {\n    border-bottom: 1px solid #555;\n    color: #fff;\n    background: #3c3c3c; }\n  .trumbowyg-dark .trumbowyg-modal-box label {\n    display: block;\n    position: relative;\n    margin: 15px 12px;\n    height: 27px;\n    line-height: 27px;\n    overflow: hidden; }\n    .trumbowyg-dark .trumbowyg-modal-box label .trumbowyg-input-infos span {\n      color: #eee;\n      background-color: #2f2f2f;\n      border-color: #222; }\n    .trumbowyg-dark .trumbowyg-modal-box label .trumbowyg-input-infos span.trumbowyg-msg-error {\n      color: #e74c3c; }\n    .trumbowyg-dark .trumbowyg-modal-box label.trumbowyg-input-error input,\n    .trumbowyg-dark .trumbowyg-modal-box label.trumbowyg-input-error textarea {\n      border-color: #e74c3c; }\n    .trumbowyg-dark .trumbowyg-modal-box label input {\n      border-color: #222;\n      color: #eee;\n      background: #333; }\n      .trumbowyg-dark .trumbowyg-modal-box label input:hover, .trumbowyg-dark .trumbowyg-modal-box label input:focus {\n        border-color: #626262; }\n      .trumbowyg-dark .trumbowyg-modal-box label input:focus {\n        background-color: #2f2f2f; }\n  .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit {\n    background: #1b7943; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:hover, .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:focus {\n      background: #25a25a; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit:active {\n      background: #176437; }\n  .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset {\n    background: #333;\n    color: #ccc; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:hover, .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:focus {\n      background: #444; }\n    .trumbowyg-dark .trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-reset:active {\n      background: #111; }\n\n.trumbowyg-dark .trumbowyg-overlay {\n  background-color: rgba(15, 15, 15, 0.6); }\n", ""]);

// exports


/***/ }),

/***/ 709:
/***/ (function(module, exports) {

!function(e){"use strict";var r={proxy:"https://noembed.com/embed?nowrap=on",urlFiled:"url",data:[],success:void 0,error:void 0};e.extend(!0,e.trumbowyg,{langs:{en:{noembed:"Noembed",noembedError:"Error"},sk:{noembedError:"Chyba"},fr:{noembedError:"Erreur"},cs:{noembedError:"Chyba"},ru:{noembedError:"Ошибка"},ja:{noembedError:"エラー"}},plugins:{noembed:{init:function(o){o.o.plugins.noembed=e.extend(!0,{},r,o.o.plugins.noembed||{});var n={fn:function(){var r=o.openModalInsert(o.lang.noembed,{url:{label:"URL",required:!0}},function(n){e.ajax({url:o.o.plugins.noembed.proxy,type:"GET",data:n,cache:!1,dataType:"json",success:o.o.plugins.noembed.success||function(n){n.html?(o.execCmd("insertHTML",n.html),setTimeout(function(){o.closeModal()},250)):o.addErrorOnModalField(e("input[type=text]",r),n.error)},error:o.o.plugins.noembed.error||function(){o.addErrorOnModalField(e("input[type=text]",r),o.lang.noembedError)}})})}};o.addBtnDef("noembed",n)}}}})}(jQuery);

/***/ }),

/***/ 710:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("trumbowyg", {
    attrs: { config: _vm.config.advanced, id: _vm.id },
    model: {
      value: _vm.content,
      callback: function($$v) {
        _vm.content = $$v
      },
      expression: "content"
    }
  })
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4b3f9ab1", module.exports)
  }
}

/***/ }),

/***/ 713:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(918)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(920)
/* template */
var __vue_template__ = __webpack_require__(921)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0cdd7a0a"
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
Component.options.__file = "resources\\assets\\js\\components\\UploadButton.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0cdd7a0a", Component.options)
  } else {
    hotAPI.reload("data-v-0cdd7a0a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 911:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(912);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("b06887a0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4c32c06c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Posts.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4c32c06c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Posts.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 912:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n.breadcrumbs li[data-v-4c32c06c]:not(:last-child):after {\n    color: #009688;\n    content: attr(data-divider);\n    vertical-align: middle;\n}\n", ""]);

// exports


/***/ }),

/***/ 913:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue__ = __webpack_require__(668);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layouts_Main_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_theme__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixins_acl__ = __webpack_require__(666);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_posts_BlogPost_vue__ = __webpack_require__(914);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_posts_BlogPost_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_posts_BlogPost_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_posts_SocialPost_vue__ = __webpack_require__(923);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_posts_SocialPost_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_posts_SocialPost_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_posts_VideoPost_vue__ = __webpack_require__(928);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_posts_VideoPost_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_posts_VideoPost_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        BlogPost: __WEBPACK_IMPORTED_MODULE_3__components_posts_BlogPost_vue___default.a,
        SocialPost: __WEBPACK_IMPORTED_MODULE_4__components_posts_SocialPost_vue___default.a,
        VideoPost: __WEBPACK_IMPORTED_MODULE_5__components_posts_VideoPost_vue___default.a

    },
    data: function data() {
        return {
            /* tabs */
            tabs: [{ name: 'blog post', component: 'blog-post', icon: 'fa-newspaper-o', iconColor: 'amber lighten-2' }, { name: 'social post', component: 'social-post', icon: 'fa-address-book', iconColor: 'cyan' }, { name: 'video post', component: 'video-post', icon: 'fa-youtube-play ', iconColor: 'red darken-4' }],
            active: {
                name: 'blog post'
            }
        };
    }
});

/***/ }),

/***/ 914:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(915)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(917)
/* template */
var __vue_template__ = __webpack_require__(922)
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
Component.options.__file = "resources\\assets\\js\\components\\posts\\BlogPost.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c5d1c1fc", Component.options)
  } else {
    hotAPI.reload("data-v-c5d1c1fc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 915:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(916);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("f3a9c4d2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c5d1c1fc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BlogPost.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c5d1c1fc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BlogPost.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 916:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 917:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue__ = __webpack_require__(700);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue__ = __webpack_require__(713);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['tab'],
    components: {
        TextEditor: __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue___default.a,
        UploadButton: __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue___default.a
    },
    data: function data() {
        return {
            name: '',
            title: '',
            body: '',
            bookmark: '',
            embed: '',
            spin: false,
            description: '',
            keywords: [],
            scheduled_at: null,
            preview_title: '',
            /* image related */
            image: null,
            imageUrl: '',
            imageName: '',
            /* set of save keywords in db */
            items: [],
            modal: false

        };
    },
    computed: {
        'image_title': function image_title() {
            if (!this.imageName) {
                return 'Upload Image';
            } else {
                return 'Remove Image';
            }
        }
    },
    methods: {
        //! prop function of upload button
        fileSelectedFunc: function fileSelectedFunc(file) {
            var self = this;
            this.imageName = file.name;
            this.image = file;
            var reader = new FileReader();

            reader.onload = function (event) {
                self.imageUrl = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeImage: function removeImage() {
            this.image = null;
            this.imageName = '';
            this.imageUrl = '';
        }
    }
});

/***/ }),

/***/ 918:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(919);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("2e66acb8", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0cdd7a0a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./UploadButton.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0cdd7a0a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./UploadButton.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 919:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n.jbtn-file[data-v-0cdd7a0a] {\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  bottom: -15px;\n}\n.jbtn-file input[type=file][data-v-0cdd7a0a] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  font-size: 100px;\n  text-align: right;\n  filter: alpha(opacity=0);\n  opacity: 0;\n  outline: none;\n  cursor: inherit;\n  display: block;\n}\n", ""]);

// exports


/***/ }),

/***/ 920:
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        selectedCallback: Function,
        title: String
    },
    methods: {
        fileSelected: function fileSelected(e) {
            if (this.selectedCallback) {
                if (e.target.files[0]) {
                    this.selectedCallback(e.target.files[0]);
                } else {
                    this.selectedCallback(null);
                }
            }
        }
    }
});

/***/ }),

/***/ 921:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-btn",
    {
      staticClass: "jbtn-file",
      attrs: { flat: "", icon: "", color: "cyan", dark: "" }
    },
    [
      _c("v-icon", [_vm._v("fa-upload")]),
      _vm._v(" "),
      _c("input", {
        attrs: { id: "selectFile", type: "file" },
        on: { change: _vm.fileSelected }
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
    require("vue-hot-reload-api")      .rerender("data-v-0cdd7a0a", module.exports)
  }
}

/***/ }),

/***/ 922:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    { attrs: { flat: "" } },
    [
      _c(
        "v-card-text",
        [
          _c(
            "v-container",
            [
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "name",
                          label: "Campaign Name",
                          "single-line": "",
                          "prepend-icon": "fa-fa"
                        },
                        model: {
                          value: _vm.name,
                          callback: function($$v) {
                            _vm.name = $$v
                          },
                          expression: "name"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "title",
                          label: "Blog Title",
                          "prepend-icon": "fa-book",
                          "single-line": ""
                        },
                        model: {
                          value: _vm.title,
                          callback: function($$v) {
                            _vm.title = $$v
                          },
                          expression: "title"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "body",
                          label: "Body",
                          "prepend-icon": "subject",
                          disabled: "",
                          "single-line": ""
                        }
                      }),
                      _vm._v(" "),
                      _c("text-editor", {
                        attrs: {
                          id: "blogpost-body",
                          html: _vm.body,
                          disabled: false
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "url",
                          label: "Bookmark Url",
                          "prepend-icon": "bookmark",
                          hint:
                            "Enter your website URL will be added as a bookmark",
                          "persistent-hint": "",
                          "single-line": ""
                        },
                        model: {
                          value: _vm.bookmark,
                          callback: function($$v) {
                            _vm.bookmark = $$v
                          },
                          expression: "bookmark"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "preview-embed",
                          label: "Video Embeded Code",
                          "prepend-icon": "code",
                          "single-line": "",
                          disabled: ""
                        }
                      }),
                      _vm._v(" "),
                      _c("v-text-field", {
                        attrs: { name: "embed", textarea: "" },
                        model: {
                          value: _vm.embed,
                          callback: function($$v) {
                            _vm.embed = $$v
                          },
                          expression: "embed"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-checkbox",
                        {
                          attrs: { color: "green" },
                          model: {
                            value: _vm.spin,
                            callback: function($$v) {
                              _vm.spin = $$v
                            },
                            expression: "spin"
                          }
                        },
                        [
                          _c(
                            "div",
                            {
                              attrs: { slot: "label" },
                              on: {
                                click: function($event) {
                                  $event.stopPropagation()
                                }
                              },
                              slot: "label"
                            },
                            [
                              _vm._v(
                                "\n                 Do you Want To Spin  "
                              ),
                              _c("v-icon", { attrs: { color: "info" } }, [
                                _vm._v("autorenew")
                              ]),
                              _vm._v(" Text?\n                ")
                            ],
                            1
                          )
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "preview_title",
                          label: "Preview title",
                          "prepend-icon": "rate_review",
                          hint: "*Plurk Title",
                          "persistent-hint": "",
                          "single-line": ""
                        },
                        model: {
                          value: _vm.preview_title,
                          callback: function($$v) {
                            _vm.preview_title = $$v
                          },
                          expression: "preview_title"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "preview_decription",
                          label: "Preview Description",
                          hint: "*Blogger Body",
                          "persistent-hint": "",
                          "prepend-icon": "pageview",
                          disabled: "",
                          "single-line": ""
                        }
                      }),
                      _vm._v(" "),
                      _c("v-text-field", {
                        attrs: { name: "decription", textarea: "" },
                        model: {
                          value: _vm.description,
                          callback: function($$v) {
                            _vm.description = $$v
                          },
                          expression: "description"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-select", {
                        attrs: {
                          label: "Keywords",
                          chips: "",
                          tags: "",
                          "prepend-icon": "fa-tags",
                          items: _vm.items
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "selection",
                            fn: function(data) {
                              return [
                                _c(
                                  "v-chip",
                                  {
                                    key: JSON.stringify(data.item),
                                    staticClass: "chip--select-multi",
                                    attrs: {
                                      selected: data.selected,
                                      disabled: data.disabled
                                    },
                                    on: {
                                      input: function($event) {
                                        data.parent.selectItem(data.item)
                                      }
                                    }
                                  },
                                  [
                                    _c("v-avatar", { staticClass: "primary" }, [
                                      _vm._v(
                                        _vm._s(
                                          data.item.slice(0, 1).toUpperCase()
                                        )
                                      )
                                    ]),
                                    _vm._v(
                                      "\n                    " +
                                        _vm._s(data.item) +
                                        "\n                  "
                                    )
                                  ],
                                  1
                                )
                              ]
                            }
                          }
                        ]),
                        model: {
                          value: _vm.keywords,
                          callback: function($$v) {
                            _vm.keywords = $$v
                          },
                          expression: "keywords"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-dialog",
                        {
                          attrs: {
                            persistent: "",
                            lazy: "",
                            "full-width": "",
                            width: "290px"
                          },
                          model: {
                            value: _vm.modal,
                            callback: function($$v) {
                              _vm.modal = $$v
                            },
                            expression: "modal"
                          }
                        },
                        [
                          _c("v-text-field", {
                            attrs: {
                              slot: "activator",
                              label: "Schedule Blog Post",
                              "prepend-icon": "event",
                              readonly: ""
                            },
                            slot: "activator",
                            model: {
                              value: _vm.scheduled_at,
                              callback: function($$v) {
                                _vm.scheduled_at = $$v
                              },
                              expression: "scheduled_at"
                            }
                          }),
                          _vm._v(" "),
                          _c("v-date-picker", {
                            attrs: { scrollable: "", actions: "" },
                            scopedSlots: _vm._u([
                              {
                                key: "default",
                                fn: function(ref) {
                                  var save = ref.save
                                  var cancel = ref.cancel
                                  return [
                                    _c(
                                      "v-card-actions",
                                      [
                                        _c("v-spacer"),
                                        _vm._v(" "),
                                        _c(
                                          "v-btn",
                                          {
                                            attrs: {
                                              flat: "",
                                              color: "primary"
                                            },
                                            on: { click: cancel }
                                          },
                                          [_vm._v("Cancel")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "v-btn",
                                          {
                                            attrs: {
                                              flat: "",
                                              color: "primary"
                                            },
                                            on: { click: save }
                                          },
                                          [_vm._v("OK")]
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.scheduled_at,
                              callback: function($$v) {
                                _vm.scheduled_at = $$v
                              },
                              expression: "scheduled_at"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "filename",
                          label: "Featured Image",
                          "prepend-icon": "image",
                          "single-line": "",
                          "append-icon": !!_vm.imageName ? "fa-remove" : "",
                          "append-icon-cb": function() {
                            return _vm.removeImage()
                          }
                        },
                        model: {
                          value: _vm.imageName,
                          callback: function($$v) {
                            _vm.imageName = $$v
                          },
                          expression: "imageName"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { xs2: "" } },
                    [
                      _c("upload-button", {
                        attrs: {
                          title: _vm.image_title,
                          selectedCallback: _vm.fileSelectedFunc
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _vm.image
                        ? _c("v-card-media", {
                            attrs: {
                              src: _vm.imageUrl,
                              height: "250px",
                              contain: ""
                            }
                          })
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-btn",
                        {
                          staticClass: "white--text",
                          attrs: { block: "", color: "accent" }
                        },
                        [
                          _vm._v("Create New Post "),
                          _c("v-icon", { attrs: { right: "" } }, [
                            _vm._v("send")
                          ])
                        ],
                        1
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
    require("vue-hot-reload-api")      .rerender("data-v-c5d1c1fc", module.exports)
  }
}

/***/ }),

/***/ 923:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(924)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(926)
/* template */
var __vue_template__ = __webpack_require__(927)
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
Component.options.__file = "resources\\assets\\js\\components\\posts\\SocialPost.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-01d1a9cd", Component.options)
  } else {
    hotAPI.reload("data-v-01d1a9cd", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 924:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(925);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("6097a169", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-01d1a9cd\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./SocialPost.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-01d1a9cd\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./SocialPost.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 925:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 926:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue__ = __webpack_require__(700);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue__ = __webpack_require__(713);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['tab'],
    components: {
        TextEditor: __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue___default.a,
        UploadButton: __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue___default.a
    },
    data: function data() {
        return {
            name: '',
            title: '',
            body: '',
            bookmark: '',
            embed: '',
            spin: false,
            description: '',
            keywords: [],
            scheduled_at: null,
            /* image related */
            image: null,
            imageUrl: '',
            imageName: '',
            /* set of save keywords in db */
            items: [],
            modal: false

        };
    },
    computed: {
        'image_title': function image_title() {
            if (!this.imageName) {
                return 'Upload Image';
            } else {
                return 'Remove Image';
            }
        }
    },
    methods: {
        //! prop function of upload button
        fileSelectedFunc: function fileSelectedFunc(file) {
            var self = this;
            this.imageName = file.name;
            this.image = file;
            var reader = new FileReader();

            reader.onload = function (event) {
                self.imageUrl = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeImage: function removeImage() {
            this.image = null;
            this.imageName = '';
            this.imageUrl = '';
        }
    }
});

/***/ }),

/***/ 927:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    { attrs: { flat: "" } },
    [
      _c(
        "v-card-text",
        [
          _c(
            "v-container",
            [
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "name",
                          label: "Campaign Name",
                          "single-line": "",
                          "prepend-icon": "fa-fa"
                        },
                        model: {
                          value: _vm.name,
                          callback: function($$v) {
                            _vm.name = $$v
                          },
                          expression: "name"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "title",
                          label: "Social Title",
                          "prepend-icon": "fa-book",
                          "single-line": ""
                        },
                        model: {
                          value: _vm.title,
                          callback: function($$v) {
                            _vm.title = $$v
                          },
                          expression: "title"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "social_decription",
                          label: "Social Description",
                          "prepend-icon": "pageview",
                          disabled: "",
                          "single-line": ""
                        }
                      }),
                      _vm._v(" "),
                      _c("v-text-field", {
                        attrs: { name: "decription", textarea: "" },
                        model: {
                          value: _vm.description,
                          callback: function($$v) {
                            _vm.description = $$v
                          },
                          expression: "description"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "url",
                          label: "Domain Url",
                          "prepend-icon": "link",
                          hint: "*Domain is required to post Linked",
                          "persistent-hint": "",
                          "single-line": ""
                        },
                        model: {
                          value: _vm.bookmark,
                          callback: function($$v) {
                            _vm.bookmark = $$v
                          },
                          expression: "bookmark"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-checkbox",
                        {
                          attrs: { color: "green" },
                          model: {
                            value: _vm.spin,
                            callback: function($$v) {
                              _vm.spin = $$v
                            },
                            expression: "spin"
                          }
                        },
                        [
                          _c(
                            "div",
                            {
                              attrs: { slot: "label" },
                              on: {
                                click: function($event) {
                                  $event.stopPropagation()
                                }
                              },
                              slot: "label"
                            },
                            [
                              _vm._v(
                                "\n                 Do you Want To Spin  "
                              ),
                              _c("v-icon", { attrs: { color: "info" } }, [
                                _vm._v("autorenew")
                              ]),
                              _vm._v(" Text?\n                ")
                            ],
                            1
                          )
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-dialog",
                        {
                          attrs: {
                            persistent: "",
                            lazy: "",
                            "full-width": "",
                            width: "290px"
                          },
                          model: {
                            value: _vm.modal,
                            callback: function($$v) {
                              _vm.modal = $$v
                            },
                            expression: "modal"
                          }
                        },
                        [
                          _c("v-text-field", {
                            attrs: {
                              slot: "activator",
                              label: "Schedule Social Post",
                              "prepend-icon": "event",
                              readonly: ""
                            },
                            slot: "activator",
                            model: {
                              value: _vm.scheduled_at,
                              callback: function($$v) {
                                _vm.scheduled_at = $$v
                              },
                              expression: "scheduled_at"
                            }
                          }),
                          _vm._v(" "),
                          _c("v-date-picker", {
                            attrs: { scrollable: "", actions: "" },
                            scopedSlots: _vm._u([
                              {
                                key: "default",
                                fn: function(ref) {
                                  var save = ref.save
                                  var cancel = ref.cancel
                                  return [
                                    _c(
                                      "v-card-actions",
                                      [
                                        _c("v-spacer"),
                                        _vm._v(" "),
                                        _c(
                                          "v-btn",
                                          {
                                            attrs: {
                                              flat: "",
                                              color: "primary"
                                            },
                                            on: { click: cancel }
                                          },
                                          [_vm._v("Cancel")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "v-btn",
                                          {
                                            attrs: {
                                              flat: "",
                                              color: "primary"
                                            },
                                            on: { click: save }
                                          },
                                          [_vm._v("OK")]
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.scheduled_at,
                              callback: function($$v) {
                                _vm.scheduled_at = $$v
                              },
                              expression: "scheduled_at"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "filename",
                          label: "Image",
                          "prepend-icon": "image",
                          "single-line": "",
                          hint: "JPG img Only in Instagram",
                          "persistent-hint": "",
                          "append-icon": !!_vm.imageName ? "fa-remove" : "",
                          "append-icon-cb": function() {
                            return _vm.removeImage()
                          }
                        },
                        model: {
                          value: _vm.imageName,
                          callback: function($$v) {
                            _vm.imageName = $$v
                          },
                          expression: "imageName"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { xs2: "" } },
                    [
                      _c("upload-button", {
                        attrs: {
                          title: _vm.image_title,
                          selectedCallback: _vm.fileSelectedFunc
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _vm.image
                        ? _c("v-card-media", {
                            attrs: {
                              src: _vm.imageUrl,
                              height: "250px",
                              contain: ""
                            }
                          })
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-btn",
                        {
                          staticClass: "white--text",
                          attrs: { block: "", color: "accent" }
                        },
                        [
                          _vm._v("Create New Post "),
                          _c("v-icon", { attrs: { right: "" } }, [
                            _vm._v("send")
                          ])
                        ],
                        1
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
    require("vue-hot-reload-api")      .rerender("data-v-01d1a9cd", module.exports)
  }
}

/***/ }),

/***/ 928:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(929)
}
var normalizeComponent = __webpack_require__(314)
/* script */
var __vue_script__ = __webpack_require__(931)
/* template */
var __vue_template__ = __webpack_require__(932)
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
Component.options.__file = "resources\\assets\\js\\components\\posts\\VideoPost.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e02906a", Component.options)
  } else {
    hotAPI.reload("data-v-5e02906a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 929:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(930);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(658)("145bf5f6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5e02906a\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VideoPost.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5e02906a\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./VideoPost.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 930:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(631)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 931:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue__ = __webpack_require__(700);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue__ = __webpack_require__(713);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['tab'],
    components: {
        TextEditor: __WEBPACK_IMPORTED_MODULE_0__components_TextEditor_vue___default.a,
        UploadButton: __WEBPACK_IMPORTED_MODULE_1__components_UploadButton_vue___default.a
    },
    data: function data() {
        return {
            name: '',
            title: '',
            body: '',
            bookmark: '',
            embed: '',
            spin: false,
            description: '',
            keywords: [],
            scheduled_at: null,
            /* image related */
            video: null,
            imageUrl: '',
            videoName: '',
            /* set of save keywords in db */
            items: [],
            modal: false

        };
    },
    computed: {
        'video_title': function video_title() {
            if (!this.videoName) {
                return 'Upload Video';
            } else {
                return 'Remove Video';
            }
        }
    },
    methods: {
        //! prop function of upload button
        fileSelectedFunc: function fileSelectedFunc(file) {
            var self = this;
            this.videoName = file.name;
            this.video = file;
            var reader = new FileReader();

            reader.onload = function (event) {
                self.imageUrl = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeVideo: function removeVideo() {
            this.video = null;
            this.videoName = '';
            this.imageUrl = '';
        }
    }
});

/***/ }),

/***/ 932:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-card",
    { attrs: { flat: "" } },
    [
      _c(
        "v-card-text",
        [
          _c(
            "v-container",
            [
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "name",
                          label: "Campaign Name",
                          "single-line": "",
                          "prepend-icon": "fa-fa"
                        },
                        model: {
                          value: _vm.name,
                          callback: function($$v) {
                            _vm.name = $$v
                          },
                          expression: "name"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "title",
                          label: "Video Title",
                          "prepend-icon": "fa-book",
                          "single-line": ""
                        },
                        model: {
                          value: _vm.title,
                          callback: function($$v) {
                            _vm.title = $$v
                          },
                          expression: "title"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "social_decription",
                          label: "Video Description",
                          "prepend-icon": "pageview",
                          disabled: "",
                          "single-line": ""
                        }
                      }),
                      _vm._v(" "),
                      _c("v-text-field", {
                        attrs: { name: "decription", textarea: "" },
                        model: {
                          value: _vm.description,
                          callback: function($$v) {
                            _vm.description = $$v
                          },
                          expression: "description"
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-checkbox",
                        {
                          attrs: { color: "green" },
                          model: {
                            value: _vm.spin,
                            callback: function($$v) {
                              _vm.spin = $$v
                            },
                            expression: "spin"
                          }
                        },
                        [
                          _c(
                            "div",
                            {
                              attrs: { slot: "label" },
                              on: {
                                click: function($event) {
                                  $event.stopPropagation()
                                }
                              },
                              slot: "label"
                            },
                            [
                              _vm._v(
                                "\n                  Do you Want To Spin  "
                              ),
                              _c("v-icon", { attrs: { color: "info" } }, [
                                _vm._v("autorenew")
                              ]),
                              _vm._v(" Text?\n                ")
                            ],
                            1
                          )
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-dialog",
                        {
                          attrs: {
                            persistent: "",
                            lazy: "",
                            "full-width": "",
                            width: "290px"
                          },
                          model: {
                            value: _vm.modal,
                            callback: function($$v) {
                              _vm.modal = $$v
                            },
                            expression: "modal"
                          }
                        },
                        [
                          _c("v-text-field", {
                            attrs: {
                              slot: "activator",
                              label: "Schedule Social Post",
                              "prepend-icon": "event",
                              readonly: ""
                            },
                            slot: "activator",
                            model: {
                              value: _vm.scheduled_at,
                              callback: function($$v) {
                                _vm.scheduled_at = $$v
                              },
                              expression: "scheduled_at"
                            }
                          }),
                          _vm._v(" "),
                          _c("v-date-picker", {
                            attrs: { scrollable: "", actions: "" },
                            scopedSlots: _vm._u([
                              {
                                key: "default",
                                fn: function(ref) {
                                  var save = ref.save
                                  var cancel = ref.cancel
                                  return [
                                    _c(
                                      "v-card-actions",
                                      [
                                        _c("v-spacer"),
                                        _vm._v(" "),
                                        _c(
                                          "v-btn",
                                          {
                                            attrs: {
                                              flat: "",
                                              color: "primary"
                                            },
                                            on: { click: cancel }
                                          },
                                          [_vm._v("Cancel")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "v-btn",
                                          {
                                            attrs: {
                                              flat: "",
                                              color: "primary"
                                            },
                                            on: { click: save }
                                          },
                                          [_vm._v("OK")]
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ]),
                            model: {
                              value: _vm.scheduled_at,
                              callback: function($$v) {
                                _vm.scheduled_at = $$v
                              },
                              expression: "scheduled_at"
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c("v-text-field", {
                        attrs: {
                          name: "filename",
                          label: "Video",
                          "prepend-icon": "image",
                          "single-line": "",
                          "append-icon": !!_vm.videoName ? "fa-remove" : "",
                          "append-icon-cb": function() {
                            return _vm.removeVideo()
                          }
                        },
                        model: {
                          value: _vm.videoName,
                          callback: function($$v) {
                            _vm.videoName = $$v
                          },
                          expression: "videoName"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-flex",
                    { attrs: { xs2: "" } },
                    [
                      _c("upload-button", {
                        attrs: {
                          title: _vm.video_title,
                          selectedCallback: _vm.fileSelectedFunc
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _vm.video
                        ? _c("v-card-media", {
                            attrs: {
                              src: _vm.imageUrl,
                              height: "250px",
                              contain: ""
                            }
                          })
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-layout",
                { attrs: { row: "", wrap: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { xs12: "", md8: "", "offset-md2": "" } },
                    [
                      _c(
                        "v-btn",
                        {
                          staticClass: "white--text",
                          attrs: { block: "", color: "accent" }
                        },
                        [
                          _vm._v("Create New Post "),
                          _c("v-icon", { attrs: { right: "" } }, [
                            _vm._v("send")
                          ])
                        ],
                        1
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
    require("vue-hot-reload-api")      .rerender("data-v-5e02906a", module.exports)
  }
}

/***/ }),

/***/ 933:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "main-layout",
    { style: { paddingTop: "100px", backgroundColor: "white" } },
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
                    [_vm._v("\n                  Dashboard\n              ")]
                  ),
                  _vm._v(" "),
                  _c("v-breadcrumbs-item", { attrs: { disabled: true } }, [
                    _c("span", { staticClass: "blue-grey--text" }, [
                      _vm._v("Posts")
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
            "v-layout",
            { attrs: { row: "", wrap: "" } },
            [
              _c(
                "v-tabs",
                { attrs: { fixed: "", icons: "", centered: "" } },
                [
                  _c(
                    "v-tabs-bar",
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
                              "\n              " +
                                _vm._s(tab.name) +
                                "\n              "
                            )
                          ],
                          1
                        )
                      })
                    ],
                    2
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
                            { attrs: { flat: "", light: true } },
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
    require("vue-hot-reload-api")      .rerender("data-v-4c32c06c", module.exports)
  }
}

/***/ })

});