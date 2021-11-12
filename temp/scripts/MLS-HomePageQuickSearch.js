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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/content/HomePageQuickSearch.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/content/HomePageQuickSearch.js":
/***/ (function(module, exports) {

eval("// mls-data.js : try to read the MLS data day by day\n// download limit: <1500 records / time\n// quick search feature is a iframe page\n$(function () {\n  //console.groupCollapsed('mls-data');\n  var strataPlanNumber, complexName, countResult;\n  var $fx = L$(); // iframe loaded, trigger search event\n\n  window.addEventListener(\"load\", myMain, false);\n\n  function myMain(evt) {\n    var checkTimer = setInterval(checkForSearchFinish, 100);\n\n    function checkForSearchFinish() {\n      if (document.querySelector(\"#CountResult\")) {\n        clearInterval(checkTimer); // DO YOUR STUFF HERE.\n\n        $(function () {\n          var mlsDateLow = $(\"#f_33_Low__1-2-3-4-5\");\n          var mlsDateHigh = $(\"#f_33_High__1-2-3-4-5\"); // function .blur() is used to trigger PARAGON to split the mls#s\n\n          mlsDateLow.focus().val($fx.today).blur();\n          mlsDateHigh.focus().val($fx.today); //var keydown = new KeyboardEvent(\"keydown\", {bubbles: true, cancelable: true, keyCode: 13});\n          //document.querySelector('#f_33_High__1-2-3-4-5').dispatchEvent(keydown);\n\n          var mlsCount = $(\"#Count\");\n          mlsCount.click();\n        }); //do not show search results, do not save results\n\n        getCountResult(false, false);\n      }\n    }\n  } // waiting the search result from Quick Search box\n\n\n  function getCountResult(showResult, saveResult) {\n    //console.groupCollapsed('getCountResult');\n    var checkTimer = setInterval(checkSearchResult, 100);\n    var counter = 1;\n\n    function checkSearchResult() {\n      // result is a text with commas, remove the commas\n      var mlsCountResult = $(\"#CountResult\").val().replace(\",\", \"\");\n\n      if ($fx.isInt(mlsCountResult)) {\n        clearInterval(checkTimer);\n        countResult = mlsCountResult;\n        var btnSearch = $(\"#Search\"); //console.log('mls Quick Search Done: ', mlsCountResult);\n        //console.log($('#CountResult').val());\n        //console.groupEnd();\n\n        if (saveResult) {\n          saveCountResult();\n        } // jump to detailed page view of the search results\n\n\n        if (showResult && countResult > 1) {\n          btnSearch.click();\n          chrome.storage.local.set({\n            showTabQuickSearch: false\n          });\n        }\n      } else {\n        console.log(\"mls data searching ...\", checkTimer);\n\n        if (counter++ > 300) {\n          clearInterval(checkTimer); //console.warn('overtimed, stop checking result', counter);\n          //console.groupEnd();\n        }\n      }\n    }\n  } //save count result\n\n\n  function saveCountResult() {\n    var spSummary = {\n      _id: strataPlanNumber + \"-\" + $fx.getToday(),\n      strataPlan: strataPlanNumber,\n      name: complexName,\n      searchDate: $fx.getToday(),\n      count: countResult,\n      active: \"todo\",\n      sold: \"todo\",\n      from: \"strataPlanSummary\" + Math.random().toFixed(8)\n    }; //save results to storage:\n\n    chrome.storage.local.set(spSummary); //console.log('mls-data wrap up the complex data: ', spSummary);\n\n    chrome.runtime.sendMessage({\n      todo: \"saveStrataPlanSummary\",\n      spSummaryData: spSummary\n    });\n  }\n\n  chrome.runtime.onMessage.addListener(function (msg, sender, response) {\n    //console.log('mls-data got message: ', msg);\n    if (msg.todo != \"switchTab\" && msg.todo != \"searchComplexListingCount\") {\n      return;\n    }\n\n    response(\"mls-data got a message\");\n    var mlsDateLow = $(\"#f_33_Low__1-2-3-4-5\");\n    var mlsDateHigh = $(\"#f_33_High__1-2-3-4-5\");\n    var strataPlan = $(\"#f_41__1-2-3-4-5\");\n    var strataPlanHidden = $(\"#hdnf_41__1-2-3-4-5\");\n    var liStrataPlan = $('div[rel=\"f_41__1-2-3-4-5\"] ul li.acfb-data');\n    var today = new Date();\n    var day60 = new Date();\n    day60.setDate(today.getDate() - 60); // function .blur() is used to trigger PARAGON to split the mls#s\n\n    liStrataPlan.remove();\n    strataPlanHidden.val(\"\");\n    mlsDateLow.focus().val(\"\").blur();\n    mlsDateHigh.focus().val(\"\").blur();\n    strataPlan.focus().val(\"\").blur();\n    chrome.storage.local.get([\"strataPlan1\", \"strataPlan2\", \"strataPlan3\", \"strataPlan4\", \"complexName\"], function (listing) {\n      mlsDateLow.focus().val($fx.formatDate(day60)).blur();\n      mlsDateHigh.focus().val($fx.formatDate(today)).blur(); //let strataPlans = \"['\" + listing.strataPlan1 + \"','\" + listing.strataPlan2 + \"','\" + listing.strataPlan3 + \"','\" + listing.strataPlan4 + \"']\";\n\n      var strataPlansInput = listing.strataPlan1 + \",\" + listing.strataPlan2 + \",\" + listing.strataPlan3 + \",\" + listing.strataPlan4 + \",\"; // inputHidenPID.val('');\n      // inputHidenPID.val(\"['\" + result.PID + \"']\");\n\n      strataPlan.focus().val(strataPlansInput).blur();\n      var keydown = new KeyboardEvent(\"keydown\", {\n        bubbles: true,\n        cancelable: true,\n        keyCode: 13\n      });\n      document.querySelector(\"#f_41__1-2-3-4-5\").dispatchEvent(keydown); //strataPlan.val('');\n      //strataPlanHidden.val('');\n      //strataPlanHidden.val(strataPlans);\n\n      strataPlanNumber = listing.strataPlan1;\n      complexName = listing.complexName;\n      getCountResult(msg.showResult && false, msg.saveResult);\n    });\n  }); //console.groupEnd();\n});\n\n//# sourceURL=webpack:///./app/content/HomePageQuickSearch.js?");

/***/ })

/******/ });