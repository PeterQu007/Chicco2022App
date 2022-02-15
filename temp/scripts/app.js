/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _assets_scripts_ui_uiListingInfo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"./app/assets/scripts/ui/uiListingInfo.js\");\n//test UI\n\nvar uiListingInfo = new _assets_scripts_ui_uiListingInfo__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nuiListingInfo.showUI($('body'));\nvar l = L$();\nconsole.log(l.convertUnit('10.76'));\n\n//# sourceURL=webpack:///./app/app.js?");

/***/ }),

/***/ "./app/assets/scripts/ui/uiListingInfo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"./node_modules/@babel/runtime/helpers/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(\"./node_modules/@babel/runtime/helpers/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n// UI element: ListingInfo\n// import GoogleMapsApi from \"../modules/GoogleMapsApi\";\n// const gmapApi = new GoogleMapsApi();\nvar UIListingInfo =\n/*#__PURE__*/\nfunction () {\n  function UIListingInfo() {\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, UIListingInfo);\n\n    this.UIDiv = $('<div id=\"uiListingInfo\"></div>');\n    this.UIMap = $('<div id=\"uiListingMap\"></div>');\n    this.UIPics = $('<div id=\"uiListingPics\"></div>');\n    this.listingPic = $('<img src=\"\">');\n    this.mapBox = $('<div id=\"mapBox\"></div>');\n    this.mapView = $('<iframe id=\"mapViewFrame\" src=\"https://bcres.paragonrels.com/ParagonLS/Reports/Report.mvc?listingIDs=262360698&amp;screenWidth=1007&amp;uniqueIDs=&amp;viewID=77&amp;classID=1&amp;usePDF=false&amp;ShowAds=false&amp;searchID=tab4_1_2&amp;listingMode=0&amp;compact=true\" ></iframe>');\n    this.listingID = null;\n    this.mapSrc1 = \"https://bcres.paragonrels.com/ParagonLS/Reports/Report.mvc?listingIDs=\";\n    this.mapSrc2 = \"&screenWidth=1007&uniqueIDs=&viewID=77&classID=1&usePDF=false&ShowAds=false&searchID=tab4_1_2&listingMode=1&compact=true\";\n    this.mlsNo = $(\"<div>MLS #</div>\"); //divs for strata & complex info:\n\n    this.planNo = $('<div id=\"strataPlan\">PlanNo: </div>');\n    this.planLink = $(\"<a href=\\\"https://bcres.paragonrels.com/ParagonLS/Home/Page.mvc#HomeTab\\\" \\n                            target=\\\"HomeTab\\\" id=\\\"strataPlanLink\\\" ></a>\");\n    this.formalAddress = $('<div id=\"formalAddress\"></div>');\n    this.complexSummary = $('<div id=\"complexSummary\"></div>');\n    this.complexName = $('<span id=\"complexName\" class=\"inputHighlight\" >ComplexName</span>');\n    this.complexListingQuantity = $('<span id=\"listingQuantity\"></span>');\n    this.inputComplexName = $('<input class=\"inputHighlight\" name=\"inputComplexName\" id=\"inputComplexName\"/>');\n    this.btnSaveComplexName = $('<button name=\"saveComplexName\" id=\"saveComplexName\" class=\"SearchBtn\">Save Complex</button>'); //Show Large Map\n\n    this.btnShowLargeMap = $('<button name=\"showLargeMap\" id=\"showLargeMap\" class=\"SearchBtn\">Show Pics</button>'); //Exposure\n\n    this.inputExposure = $('<input class=\"inputHighlight\" name=\"inputExposure\" id=\"inputExposure\"/>');\n    this.btnSaveExposure = $('<button name=\"saveExposure\" id=\"saveExposure\" class=\"SearchBtn\">Save Exposure</button>'); //Listing Status\n\n    this.inputListing = $('<input class=\"inputHighlight\" name=\"inputListing\" id=\"inputListing\"/>');\n    this.btnSaveListing = $('<button name=\"saveListing\" id=\"saveListing\" class=\"SearchBtn\">Save Status</button>'); //divs for BC Assessment:\n\n    this.landValue = $('<div id=\"landValue\">land value</div>');\n    this.houseValue = $('<div id=\"houseValue\">house value</div>');\n    this.landValuePercent = $(\"<div>land value percent</div>\");\n    this.houseValuePercent = $(\"<div>house value percent</div>\");\n    this.landHouseRatio = $('<div id=\"land2HouseRatio\">land house ratio</div>');\n    this.totalValue = $('<div id=\"totalValue\"></div>');\n    this.valueChange = $('<div id=\"valueChange\"></div>');\n    this.valueChangePercent = $('<div id=\"valueChangePercent\"></div>');\n    this.oldTimerLotValuePerSF = $('<div id=\"oldTimerLotValuePerSF\"></div>');\n    this.marketValuePerSF = $('<div id=\"marketValuePerSF\"></div>');\n    this.currentTaxAssessYear = $('<div id=\"currentTaxAssessYear\"></div>'); //divs for remarks:\n\n    this.realtorRemarks = $('<div id=\"realtorRemarks\"></div>');\n    this.publicRemarks = $('<div id=\"publicRemarks\"></div>'); //divs for listing agent sms:\n\n    this.listingAgentSMS = $('<div id=\"listingAgentSMS\"></div>'); //divs for showing info:\n\n    this.showingInfo = $('<div id=\"showingInfo\">Showing info:</div>');\n    this.inputClientName = $('<span>ClientName:</span><input id=\"clientName\" class=\"inputHighlight\"  type=\"text\"/>');\n    this.inputShowingNote = $('<span>ShowingNote:</span><input id =\"showingNote\" class=\"inputHighlight\" type=\"text\"/>');\n    this.inputShowingDate = $('<span>Date:</span><input id=\"showingDate\" class=\"inputHighlight\" />');\n    this.inputShowingTime = $('<span>Time:</span><input id=\"showingTime\" class=\"inputHighlight\" />');\n    this.btnSaveShowing = $('<button id=\"saveShowing\" class=\"SearchBtn\">Save</button>'); //Google Map Apis\n\n    this.map = null;\n    this.geocoder = null; //assemble the elements:\n\n    this.buildUI();\n  }\n\n  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(UIListingInfo, [{\n    key: \"buildMapSrc\",\n    value: function buildMapSrc(listingID) {\n      var src = this.mapSrc1 + listingID + this.mapSrc2;\n      return src;\n    }\n  }, {\n    key: \"buildUI\",\n    value: function buildUI() {\n      var uiDiv = this.UIDiv;\n      var uiMap = this.UIMap;\n      var uiPics = this.UIPics;\n      this.mapBox.append(this.mapView);\n      uiMap.append(this.mapBox); //add images\n\n      var i = 0;\n\n      for (i = 0; i < 40; i++) {\n        var imgAnchor = $('<a href=\"\"></a>');\n        imgAnchor.attr(\"id\", \"imgAnchor\" + i);\n        var tempPic = $('<img src=\"\">');\n        tempPic.attr(\"id\", \"img\" + i);\n        tempPic.addClass(\"picBox\");\n        tempPic.appendTo(imgAnchor); //uiPics.append(tempPic);\n\n        uiPics.append(imgAnchor);\n      }\n\n      uiDiv.append(this.mlsNo); //add strata & complex info\n\n      this.planLink.appendTo(this.planNo);\n      uiDiv.append(this.planNo);\n      uiDiv.append(this.formalAddress);\n      this.complexName.appendTo(this.complexSummary);\n      this.complexListingQuantity.appendTo(this.complexSummary);\n      uiDiv.append(this.complexSummary);\n      uiDiv.append(this.inputComplexName);\n      uiDiv.append(this.btnSaveComplexName); //add exposure elements:\n\n      uiDiv.append(this.inputExposure);\n      uiDiv.append(this.btnSaveExposure); //\n\n      uiDiv.append(this.btnShowLargeMap); //add listing status elements:\n\n      uiDiv.append(this.inputListing);\n      uiDiv.append(this.btnSaveListing); //add bca info\n\n      uiDiv.append($(\"<hr/>\"));\n      uiDiv.append(this.landValue);\n      uiDiv.append(this.houseValue);\n      uiDiv.append(this.totalValue);\n      uiDiv.append(this.valueChange);\n      uiDiv.append(this.oldTimerLotValuePerSF);\n      uiDiv.append(this.marketValuePerSF);\n      uiDiv.append(this.currentTaxAssessYear); //add remarks\n\n      uiDiv.append($(\"<hr/>\"));\n      uiDiv.append(this.listingAgentSMS);\n      uiDiv.append($(\"<hr/>\"));\n      uiDiv.append(this.realtorRemarks);\n      uiDiv.append(this.publicRemarks); //add showing info\n\n      uiDiv.append($(\"<hr/>\"));\n      uiDiv.append(this.showingInfo);\n      uiDiv.append(this.inputClientName);\n      uiDiv.append(this.inputShowingNote);\n      uiDiv.append(this.inputShowingDate);\n      uiDiv.append(this.inputShowingTime);\n      uiDiv.append(this.btnSaveShowing);\n    }\n  }, {\n    key: \"showUI\",\n    value: function showUI(container) {\n      //map\n      this.mapView.attr(\"src\", this.buildMapSrc(this.listingID));\n      this.UIMap.appendTo(container);\n      this.UIPics.appendTo(container);\n      this.UIPics.addClass(\"picContainer\");\n      this.UIMap.addClass(\"mapView\");\n      this.mapBox.addClass(\"mapBox\");\n      this.mapView.addClass(\"mapBox\");\n      this.UIDiv.appendTo(container);\n      this.UIDiv.addClass(\"uilistinginfo\"); //change inputbox width:\n\n      this.UIDiv.children(\"input\").addClass(\"inputbox\");\n      this.realtorRemarks.addClass(\"bottomline\");\n    }\n  }]);\n\n  return UIListingInfo;\n}();\n\n//# sourceURL=webpack:///./app/assets/scripts/ui/uiListingInfo.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\nmodule.exports = _classCallCheck;\nmodule.exports[\"default\"] = module.exports, module.exports.__esModule = true;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/***/ (function(module, exports) {

eval("function _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\n\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\n\nmodule.exports = _createClass;\nmodule.exports[\"default\"] = module.exports, module.exports.__esModule = true;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/createClass.js?");

/***/ })

/******/ });