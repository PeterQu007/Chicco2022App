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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/content/taxSearchCriteria.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/content/taxSearchCriteria.js":
/***/ (function(module, exports) {

eval("//Query tax information\n//console.log(\"MLS tax search iframe\");\n// chrome.storage.local.get(\"PID\",function(result){\n// \tvar inputPID = $('#f_22');\n// \tinputPID.focus().val(result.PID).blur();\n// \tvar btnSearch = $('#Search');\n// \tbtnSearch.click();\n// })\nchrome.runtime.onMessage.addListener(function (msg, sender, response) {\n  if (String(msg.todo).indexOf(\"taxSearchFor\") > -1) {\n    //console.log(\"I am in mls-tax.js\");\n    //console.log(\"mls-tax got msg: \", msg);\n    response(\"mls-tax got a message\");\n    chrome.storage.local.get([\"PID\", \"taxYear\"], function (result) {\n      var inputPID = $(\"#f_22\");\n      var liPID = $('div[rel=\"f_22\"] ul li.acfb-data');\n      var inputHidenPID = $(\"#hdnf_22\");\n      liPID.remove();\n      inputHidenPID.val(\"\"); //inputHidenPID.val(\"['\" + result.PID + \"']\");\n\n      var $count = $(\"#CountResult\");\n      inputPID.focus().val(result.PID).blur();\n      var keydown = new KeyboardEvent(\"keydown\", {\n        bubbles: true,\n        cancelable: true,\n        keyCode: 13\n      });\n      document.querySelector(\"#f_22\").dispatchEvent(keydown);\n      var btnSearch = $(\"#Search\");\n      var monitorCounter = 1;\n      var checkTimer = setInterval(checkSearchResult, 100);\n\n      function checkSearchResult() {\n        if (parseInt($count.val()) == 1) {\n          clearInterval(checkTimer);\n          chrome.storage.local.set({\n            totalValue: 0,\n            landValue: 0,\n            improvementValue: 0,\n            planNum: \"\",\n            taxSearchRequester: msg.todo\n          });\n          btnSearch.click();\n        } else if (parseInt($count.val()) == 0 || monitorCounter++ > 100) {\n          clearInterval(checkTimer);\n          console.log(\"Tax Search Failed!\"); //inform background the tax search does not work\n\n          var assess = {\n            _id: result.PID + \"-\" + result.taxYear,\n            landValue: 0,\n            improvementValue: 0,\n            totalValue: 0,\n            planNum: \"\",\n            PID: result.PID,\n            taxYear: result.taxYear,\n            bcaSearch: \"failed\",\n            from: \"assess-\" + msg.todo + \"-TaxSearchFailed\" + Math.random().toFixed(8),\n            dataFromDB: false\n          };\n          chrome.storage.local.set(assess, function () {\n            console.log(\"Tax Search Failed...\", assess); // self.getReportLink(function () {\n            // \tself.reportLink[0].click();\n            // \tconsole.log(\"1 Current Tab When Doing Tax Search is : \", curTabID);\n            // \tlet curTabContentContainer = $('div' + curTabID, top.document);\n            // \tcurTabContentContainer.attr(\"style\", \"display:block!important\");\n            // });\n          });\n          chrome.runtime.sendMessage({\n            todo: \"saveTax\",\n            taxData: assess\n          }, function (response) {\n            console.log(\"tax Data has been save to the database!\");\n          });\n        }\n\n        console.log(\"Waiting for tax Search result...\", checkTimer);\n      }\n    });\n  }\n});\n\n//# sourceURL=webpack:///./app/content/taxSearchCriteria.js?");

/***/ })

/******/ });