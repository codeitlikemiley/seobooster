webpackJsonp([14],{

/***/ 644:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = __webpack_require__(789)
/* template */
var __vue_template__ = __webpack_require__(790)
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
Component.options.__file = "resources\\assets\\js\\pages\\Support.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7264ebb0", Component.options)
  } else {
    hotAPI.reload("data-v-7264ebb0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 660:
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

/***/ 701:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(317)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(702)
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

/***/ 702:
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

/***/ 789:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_ModalLayout__ = __webpack_require__(701);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layouts_ModalLayout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layouts_ModalLayout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_theme__ = __webpack_require__(660);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        ModalLayout: __WEBPACK_IMPORTED_MODULE_0__layouts_ModalLayout___default.a
    },
    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_theme__["a" /* default */]],
    data: function data() {
        return {
            contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true },
            name: '',
            email: '',
            subject: '',
            message: '',
            contactForm: new AppForm(App.forms.contactForm)
        };
    },
    methods: {
        resetForm: function resetForm() {
            this.contactForm = new AppForm(App.forms.contactForm);
        },
        submit: function submit() {
            var self = this;
            self.contactForm.name = self.name;
            self.contactForm.email = self.email;
            self.contactForm.subject = self.subject;
            self.contactForm.message = self.message;
            axios.post(route('api.@contact'), self.contactForm).then(function () {
                self.resetForm();
                vm.$popup({ message: 'Message Sent!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' });
            }).catch(function () {
                vm.$popup({ message: 'Failed To send Message', backgroundColor: '#e57373', delay: 5, color: '#fffffa' });
            });
        },
        redirectBack: function redirectBack() {
            var self = this;
            return self.$nextTick(function () {
                return self.$router.go(-1);
            });
        },
        goHome: function goHome() {
            var self = this;
            self.$nextTick(function () {
                return self.$router.push({ name: 'home' });
            });
        }
    }
});

/***/ }),

/***/ 790:
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
                [_vm._v("Customer Support Page")]
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
              _c(
                "v-container",
                { attrs: { fluid: "" } },
                [
                  _c(
                    "v-layout",
                    { attrs: { row: "", wrap: "" } },
                    [
                      _c(
                        "v-flex",
                        {
                          attrs: {
                            "d-flex": "",
                            xs12: "",
                            sm12: "",
                            md6: "",
                            lg6: ""
                          }
                        },
                        [
                          _c(
                            "v-layout",
                            { attrs: { row: "", wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                {
                                  attrs: {
                                    "d-flex": "",
                                    xs12: "",
                                    "text-xs-center": ""
                                  }
                                },
                                [
                                  _c(
                                    "v-container",
                                    { attrs: { "fill-height": "", fluid: "" } },
                                    [
                                      _c(
                                        "v-layout",
                                        { attrs: { "fill-height": "" } },
                                        [
                                          _c(
                                            "v-flex",
                                            {
                                              attrs: {
                                                xs12: "",
                                                "align-end": "",
                                                flexbox: ""
                                              }
                                            },
                                            [
                                              _c(
                                                "p",
                                                {
                                                  staticClass:
                                                    "headline accent--text"
                                                },
                                                [_vm._v("Ask Questions")]
                                              ),
                                              _vm._v(" "),
                                              _c("v-text-field", {
                                                attrs: {
                                                  light: "",
                                                  name: "name",
                                                  label: "Full Name"
                                                },
                                                model: {
                                                  value: _vm.name,
                                                  callback: function($$v) {
                                                    _vm.name = $$v
                                                  },
                                                  expression: "name"
                                                }
                                              }),
                                              _vm._v(" "),
                                              _c("v-text-field", {
                                                attrs: {
                                                  light: "",
                                                  name: "email",
                                                  label: "Email"
                                                },
                                                model: {
                                                  value: _vm.email,
                                                  callback: function($$v) {
                                                    _vm.email = $$v
                                                  },
                                                  expression: "email"
                                                }
                                              }),
                                              _vm._v(" "),
                                              _c("v-text-field", {
                                                attrs: {
                                                  light: "",
                                                  name: "subject",
                                                  label: "Subject"
                                                },
                                                model: {
                                                  value: _vm.subject,
                                                  callback: function($$v) {
                                                    _vm.subject = $$v
                                                  },
                                                  expression: "subject"
                                                }
                                              }),
                                              _vm._v(" "),
                                              _c("v-text-field", {
                                                attrs: {
                                                  light: "",
                                                  name: "message",
                                                  label: "Message",
                                                  "multi-line": ""
                                                },
                                                model: {
                                                  value: _vm.message,
                                                  callback: function($$v) {
                                                    _vm.message = $$v
                                                  },
                                                  expression: "message"
                                                }
                                              }),
                                              _vm._v(" "),
                                              _c(
                                                "v-btn",
                                                {
                                                  staticClass: "white--text",
                                                  attrs: {
                                                    block: "",
                                                    color: "accent"
                                                  },
                                                  on: { click: _vm.submit }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                        Send\n                        "
                                                  ),
                                                  _c(
                                                    "v-icon",
                                                    { attrs: { right: "" } },
                                                    [_vm._v("send")]
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
                            "d-flex": "",
                            xs12: "",
                            sm12: "",
                            md6: "",
                            lg6: ""
                          }
                        },
                        [
                          _c(
                            "v-layout",
                            { attrs: { row: "", wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                { attrs: { "d-flex": "", xs12: "" } },
                                [
                                  _c(
                                    "v-card",
                                    { attrs: { flat: "", light: "" } },
                                    [
                                      _c(
                                        "v-card-title",
                                        {
                                          staticClass: "headline accent--text"
                                        },
                                        [_vm._v("Contact Details")]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-card-text",
                                        {
                                          staticClass:
                                            "headline blue-grey--text"
                                        },
                                        [
                                          _c(
                                            "v-icon",
                                            { attrs: { color: "red" } },
                                            [_vm._v("place")]
                                          ),
                                          _vm._v(
                                            " 1120 5TH Street\n                  "
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-card-text",
                                        {
                                          staticClass:
                                            "headline blue-grey--text"
                                        },
                                        [
                                          _c(
                                            "v-icon",
                                            { attrs: { color: "indigo" } },
                                            [_vm._v("location_city")]
                                          ),
                                          _vm._v(
                                            " Alexandria\n                  "
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-card-text",
                                        {
                                          staticClass:
                                            "headline blue-grey--text"
                                        },
                                        [
                                          _c(
                                            "v-icon",
                                            { attrs: { color: "info" } },
                                            [_vm._v("map")]
                                          ),
                                          _vm._v(
                                            " Louisiana 71301\n                  "
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-card-text",
                                        {
                                          staticClass:
                                            "headline blue-grey--text"
                                        },
                                        [
                                          _c(
                                            "v-icon",
                                            { attrs: { color: "accent" } },
                                            [_vm._v("fa-fa")]
                                          ),
                                          _vm._v(
                                            " United States\n                  "
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-card-text",
                                        {
                                          staticClass:
                                            "headline blue-grey--text"
                                        },
                                        [
                                          _c(
                                            "v-icon",
                                            { attrs: { color: "brown" } },
                                            [_vm._v("phone")]
                                          ),
                                          _vm._v(
                                            "+1 (318) 290-3674\n                  "
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-card-text",
                                        {
                                          staticClass:
                                            "headline blue-grey--text"
                                        },
                                        [
                                          _c(
                                            "v-icon",
                                            {
                                              attrs: {
                                                color: "yellow darken-2"
                                              }
                                            },
                                            [_vm._v("mail")]
                                          ),
                                          _c("span", {
                                            domProps: {
                                              textContent: _vm._s(
                                                _vm.App.site.email
                                              )
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
    require("vue-hot-reload-api")      .rerender("data-v-7264ebb0", module.exports)
  }
}

/***/ })

});