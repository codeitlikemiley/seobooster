webpackJsonp([18],{

/***/ 641:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(736)
/* template */
var __vue_template__ = __webpack_require__(737)
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
Component.options.__file = "resources\\assets\\js\\pages\\ForgotPassword.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-32f9f015", Component.options)
  } else {
    hotAPI.reload("data-v-32f9f015", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(663);

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

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(664), __esModule: true };

/***/ }),

/***/ 664:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(665);
module.exports = __webpack_require__(31).Object.assign;


/***/ }),

/***/ 665:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(61);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(666) });


/***/ }),

/***/ 666:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(89);
var gOPS = __webpack_require__(130);
var pIE = __webpack_require__(90);
var toObject = __webpack_require__(318);
var IObject = __webpack_require__(319);
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

/***/ 689:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(690)
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
Component.options.__file = "resources\\assets\\js\\layouts\\ModalLayout.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5774f095", Component.options)
  } else {
    hotAPI.reload("data-v-5774f095", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("v-app", { attrs: { standalone: "" } }, [
    _c(
      "main",
      [
        _c(
          "v-container",
          {
            staticClass: "pa-0 ma-0 white",
            attrs: { transition: "slide-x-transition", fluid: "" }
          },
          [
            _c(
              "v-card",
              { attrs: { flat: true } },
              [
                _vm._t("toolbar"),
                _vm._v(" "),
                _vm._t("default"),
                _vm._v(" "),
                _vm._t("footer")
              ],
              2
            )
          ],
          1
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5774f095", module.exports)
  }
}

/***/ }),

/***/ 736:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__ = __webpack_require__(662);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__layouts_ModalLayout__ = __webpack_require__(689);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__layouts_ModalLayout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__layouts_ModalLayout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(88);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["createNamespacedHelpers"])('auth'),
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        ModalLayout: __WEBPACK_IMPORTED_MODULE_3__layouts_ModalLayout___default.a
    },
    data: function data() {
        return {
            resetForm: new AppForm(App.forms.resetForm)
        };
    },
    computed: __WEBPACK_IMPORTED_MODULE_2_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_extends___default()({}, mapState({
        isAuthenticated: 'isAuthenticated'
    })),
    mounted: function mounted() {
        var self = this;
        /* Make Sure We Only Load Forgot Password Page If Not Authenticated */
        if (self.isAuthenticated) {
            /* nextick make sure our modal wount be visible before redirect */
            return self.$nextTick(function () {
                return self.$router.go(-1);
            });
        }
        /* Show Forgot Password Modal */
    },

    methods: {
        goHome: function goHome() {
            var self = this;
            self.$nextTick(function () {
                return self.$router.push({ name: 'home' });
            });
        },
        redirectBack: function redirectBack() {
            var self = this;
            return self.$nextTick(function () {
                return self.$router.go(-1);
            });
        },
        sendEmail: function () {
            var _ref = __WEBPACK_IMPORTED_MODULE_1_C_Users_uriah_sites_www_seobooster_node_modules_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
                var self;
                return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                self = this;

                                self.$validator.validateAll();

                                if (self.errors.any()) {
                                    _context.next = 6;
                                    break;
                                }

                                self.resetForm.busy = true;
                                _context.next = 6;
                                return axios.post(route('api.auth.forgotpassword'), self.resetForm).then(function (response) {
                                    self.$popup({ message: response.data.message, backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
                                    self.resetForm.busy = false;
                                    self.$router.push({ name: 'home' });
                                }).catch(function (error) {
                                    self.resetForm.busy = false;
                                    self.$popup({ message: error.response.data.message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
                                });

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function sendEmail() {
                return _ref.apply(this, arguments);
            }

            return sendEmail;
        }()
    }

});

/***/ }),

/***/ 737:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "modal-layout",
    [
      _c(
        "v-card",
        { attrs: { flat: true } },
        [
          _c(
            "v-toolbar",
            { staticClass: "accent" },
            [
              _c(
                "v-btn",
                {
                  attrs: { flat: "", icon: "", color: "primary" },
                  nativeOn: {
                    click: function($event) {
                      _vm.redirectBack()
                    }
                  }
                },
                [_c("v-icon", [_vm._v("arrow_back")])],
                1
              ),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-toolbar-title",
                { staticClass: "text-xs-center primary--text" },
                [_vm._v("Reset Password")]
              ),
              _vm._v(" "),
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-toolbar-items",
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { flat: "", color: "primary" },
                      nativeOn: {
                        click: function($event) {
                          _vm.goHome()
                        }
                      }
                    },
                    [_c("v-icon", [_vm._v("fa-home")])],
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
            "v-card-text",
            { staticStyle: { "padding-top": "100px" } },
            [
              _c("v-container", { attrs: { fluid: "" } }, [
                _c(
                  "form",
                  {
                    on: {
                      submit: function($event) {
                        $event.preventDefault()
                        _vm.sendEmail()
                      }
                    }
                  },
                  [
                    _c(
                      "v-layout",
                      { attrs: { row: "" } },
                      [
                        _c(
                          "v-flex",
                          {
                            attrs: {
                              xs12: "",
                              sm12: "",
                              md4: "",
                              "offset-md4": "",
                              lg4: "",
                              "offset-lg4": "",
                              xl4: "",
                              "offset-xl4": ""
                            }
                          },
                          [
                            _c("v-text-field", {
                              directives: [
                                {
                                  name: "validate",
                                  rawName: "v-validate",
                                  value: "required|email",
                                  expression: "'required|email'"
                                }
                              ],
                              staticClass: "primary--text",
                              attrs: {
                                name: "username",
                                label: "Type Your Registered Email",
                                "prepend-icon": "email",
                                "data-vv-name": "username",
                                "error-messages": _vm.errors.collect(
                                  "username"
                                ),
                                counter: "255"
                              },
                              model: {
                                value: _vm.resetForm.username,
                                callback: function($$v) {
                                  _vm.$set(_vm.resetForm, "username", $$v)
                                },
                                expression: "resetForm.username"
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
                      "v-flex",
                      {
                        attrs: {
                          xs12: "",
                          sm12: "",
                          md4: "",
                          "offset-md4": "",
                          lg4: "",
                          "offset-lg4": "",
                          xl4: "",
                          "offset-xl4": ""
                        }
                      },
                      [
                        _c(
                          "v-btn",
                          {
                            class: {
                              primary: !_vm.resetForm.busy,
                              error: _vm.resetForm.busy
                            },
                            attrs: {
                              disabled: _vm.errors.any(),
                              loading: _vm.resetForm.busy,
                              type: "submit",
                              block: ""
                            }
                          },
                          [
                            _vm._v(
                              "\n              Send Password Reset Email\n            "
                            )
                          ]
                        )
                      ],
                      1
                    )
                  ],
                  1
                )
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
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-32f9f015", module.exports)
  }
}

/***/ })

});