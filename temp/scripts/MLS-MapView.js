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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/content/mls-MapView.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/content/mls-MapView.js":
/***/ (function(module, exports) {

eval("console.log(\">>>>>>>mapview js injected!!<<<<<<<<<???????\");\nvar countTimer = setInterval(checkComplete, 100);\nvar loginCount = 0;\nvar x1 = $(\"input#inputListingInfo\", top.document);\nvar lockMapSize = $(\"input#checkShowSmallMap\", top.document).is(\":checked\");\nvar lockRoadMap = $(\"input#checkLockRoadMap\", top.document).is(\":checked\");\nvar zoomNumber;\n\nif (x1.val() == \"Attached\") {\n  zoomNumber = 18;\n} else {\n  zoomNumber = 20;\n}\n\nfunction showLargeMap() {\n  console.log(\"show large map clicked\");\n  var x = $(window.frameElement);\n  var z = $(\"#divMap\");\n  var v = $(\"#jqMpCntlTopMenu\");\n  var w = $(\"div.jqMpCntlSubMenuImg.jqMpCntlSubMenuMpTypeAerial\");\n  var pics = $(\"div#uiListingPics\", parent.document);\n  w.click();\n  v.css(\"z-index\", 9999);\n\n  if (z.hasClass(\"mapBox__large\")) {\n    // z.removeClass(\"mapbox__large\");\n    x.width(500);\n    x.height(810);\n    x.css(\"z-index\", 5000);\n    console.log(z);\n    z.removeClass(\"mapBox__large\");\n    z.width(498);\n    z.css(\"z-index\", 5000);\n    z.height(800);\n    pics.css(\"z-index\", 10);\n    pics.css(\"background-color\", \"#fff\");\n  } else {\n    // console.log(x);\n    x.width(1000);\n    x.height(820);\n    x.css(\"z-index\", 5000);\n    console.log(z);\n    z.addClass(\"mapBox__large\");\n    z.width(990);\n    z.css(\"z-index\", 5000);\n    z.height(810);\n    pics.css(\"z-index\", -10);\n  }\n}\n\nfunction checkComplete() {\n  // console.log(\"Check bkfsMap:\");\n  // console.log($.bkfsMap);\n  loginCount++;\n\n  if ($(\"#jqMpCntlTopMenuList\").children(\"li.jqMpCntlTopMenListItm\").length == 11 || $(\"#jqMpCntlTopMenuList\").children(\"li.jqMpCntlTopMenListItm\").length == 9) {\n    if ($(\"li.zoomInChange\").length == 0) {\n      //check the new item exists or not\n      console.log($(\"#jqMpCntlTopMenuList\"));\n      var menu = $(\"#jqMpCntlTopMenuList\");\n      var newItem = $(\"<li class=\\\"jqMpCntlTopMenListItm\\\"><div class=\\\"jqMpCntlTopMenuDivider\\\"></div></li>\\n                    <li class=\\\"jqMpCntlTopMenListItm zoomInChange\\\", id=\\\"jqMpCntlTopMenuActionLayers\\\">\\n                    <div class=\\\"jqMpCntlTopMenuBtn zoomInChange\\\" onclick=\\\"$.bkfsMap.divMap.setZoom(\".concat(zoomNumber, \")\\\" \\n                    data-tooltip=\\\"Change Map Zoom\\\"><span><strong>+</strong></span></div>\\n                    </li>\"));\n      newItem.appendTo(menu);\n    } else if ($(\"li.zoomOutChange\").length == 0) {\n      console.log($(\"#jqMpCntlTopMenuList\"));\n      var menu = $(\"#jqMpCntlTopMenuList\");\n      var newItem = $(\"<li class=\\\"jqMpCntlTopMenListItm\\\"><div class=\\\"jqMpCntlTopMenuDivider\\\"></div></li>\\n                    <li class=\\\"jqMpCntlTopMenListItm zoomOutChange\\\", id=\\\"jqMpCntlTopMenuActionLegends\\\">\\n                    <div class=\\\"jqMpCntlTopMenuBtn zoomOutChange\\\" onclick=\\\"$.bkfsMap.divMap.setZoom(15)\\\" \\n                    data-tooltip=\\\"Change Map Zoom\\\"><span><strong>-</strong></span></div>\\n                    </li>\");\n      newItem.appendTo(menu);\n      var newMapTypeItem = $(\"<li class=\\\"jqMpCntlTopMenListItm\\\"><div class=\\\"jqMpCntlTopMenuDivider\\\"></div></li>\\n                    <li class=\\\"jqMpCntlTopMenListItm\\\">\\n                    <div class=\\\"jqMpCntlTopMenuBtn jqMpCntlSubMenuImg jqMpCntlSubMenuMpTypeRoad roadMapType\\\" onclick=\\\"zoomOutToRoadMapView()\\\" \\n                    data-tooltip=\\\"Change Map Zoom\\\"><span><strong style=\\\"color:red\\\">-</strong></span></div>\\n                    </li>\");\n      newMapTypeItem.appendTo(menu); //$.bkfsMap.divMap.setMapTypeId('satellite')\n      // $.bkfsMap.divMap.setMapTypeId(\"roadmap\");\n\n      var newMapType2Item = $(\"<li class=\\\"jqMpCntlTopMenListItm\\\"><div class=\\\"jqMpCntlTopMenuDivider\\\"></div></li>\\n                    <li class=\\\"jqMpCntlTopMenListItm\\\">\\n                    <div class=\\\"jqMpCntlTopMenuBtn jqMpCntlSubMenuImg jqMpCntlSubMenuMpTypeAerial aerialMapType\\\" onclick=\\\"zoomInToSatelliteView()\\\" \\n                    data-tooltip=\\\"Change Map Zoom\\\"><span><strong style=\\\"color:red\\\">+</strong></span></div>\\n                    </li>\");\n      newMapType2Item.appendTo(menu);\n      var newButtonItem = $(\"<li class=\\\"jqMpCntlTopMenListItm\\\"><div class=\\\"jqMpCntlTopMenuDivider\\\"></div></li>\\n                    <li class=\\\"jqMpCntlTopMenListItm\\\">\\n                    <button id=\\\"changeSizeButton\\\" class=\\\"changeSizeButton\\\"  \\n                    data-tooltip=\\\"Change Map Size\\\">Pic</button>\\n                    </li>\");\n      var showMapCheck = $(\"<li class=\\\"jqMpCntlTopMenListItm\\\"><div class=\\\"jqMpCntlTopMenuDivider\\\"></div></li>\\n                    <li class=\\\"jqMpCntlTopMenListItm\\\" >\\n                    <input id=\\\"showSmallMap\\\" type=\\\"checkbox\\\" name=\\\"checkbox\\\" style=\\\"width: 14px!important\\\" />\\n                    </li>\\n                    \");\n      var newScript = $(\"<script>\\n                      let x1 = $(\\\"input#inputListingInfo\\\", top.document);\\n                      let zoomNumber;\\n                      if (x1.val() == \\\"Attached\\\") {\\n                        zoomNumber = 18;\\n                      } else {\\n                        zoomNumber = 20;\\n                      }\\n                      function zoomInToSatelliteView(){\\n                        $.bkfsMap.divMap.setMapTypeId('hybrid');\\n                        $.bkfsMap.divMap.setZoom(zoomNumber);\\n                      };\\n                      function zoomOutToRoadMapView(){\\n                        $.bkfsMap.divMap.setMapTypeId('roadmap');\\n                        $.bkfsMap.divMap.setZoom(15);\\n                      }\\n                      </script>\");\n      newButtonItem.appendTo(menu);\n      menu.append(showMapCheck);\n      menu.append(newScript);\n      var y = $(\"div.jqMpCntlTopMenuBtn.zoomInChange\"); // var y = $(\"div.jqMpCntlTopMenuBtn.zoomOutChange\");\n\n      y.click();\n      var z = $(\"#divMap\");\n\n      if (!lockMapSize) {\n        z.addClass(\"mapBox__large\");\n      } else {\n        z.removeClass(\"mapBox__large\");\n      }\n\n      var x = lockRoadMap ? $(\"div.jqMpCntlSubMenuImg.jqMpCntlSubMenuMpTypeRoad\") : $(\"div.jqMpCntlSubMenuImg.jqMpCntlSubMenuMpTypeAerial\");\n      x.click(); // var x2 = $(\"#jqMpCntlTopMenuActionLayers\");\n      // var x2_div = x2.children(\"div\")[0];\n      // x2_div.click();\n\n      var x3 = $(\"div.jqMpCntlLayerCheckBox\");\n      var x3_div0 = x3[0]; //Fraser Valley Board\n\n      var x3_div1 = x3[1]; //Vancouver Board\n\n      var x3_div2 = x3[2]; //Vancouver Board\n\n      var x4 = $(\"div.jqMpCntlCheckSlider\");\n      var x4_div0 = x4[0]; //Fraser Valley Lables\n\n      var x4_div1 = x4[1]; //Vancouver Board Lables\n\n      var x4_div2 = x4[2]; //Vancouver Board sub area lables\n\n      var buttonClosePanel = $(\"#jqMpCntlLyrsPnlCloser\");\n      var x5 = buttonClosePanel.children(\"div\")[0];\n      setTimeout(function () {\n        x3_div0.click();\n        x4_div0.click();\n        x3_div1.click();\n        x4_div1.click(); // x5.click();\n      }, 1000); // var z = $(\"div.jqMpCntlTopMenuBtn.zoomOutChange\");\n      // //  onclick=\"$.bkfsMap.divMap.setZoom(15).setMapTypeId('roadmap'\n      // z.bind(\"click\", function() {\n      //   $.bkfsMap.divMap.setZoom(15);\n      //   $.bkfsMap.divMap.setMapTypeId(\"roadmap\");\n      // });\n    }\n  }\n\n  if (loginCount > 25) {\n    clearInterval(countTimer);\n    var x = $(\"#changeSizeButton\");\n    var y = $(\"#showSmallMap\").val();\n    x.click(function () {\n      // console.log(\"test\");\n      showLargeMap();\n    }); // console.log(\"Map Failed\");\n  } else if ($(\"div.jqMpCntlSubMenuImg.jqMpCntlSubMenuMpTypeAerial\").length) {// clearInterval(countTimer);\n  }\n}\n\n//# sourceURL=webpack:///./app/content/mls-MapView.js?");

/***/ })

/******/ });