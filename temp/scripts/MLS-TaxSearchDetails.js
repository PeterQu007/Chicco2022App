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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/content/taxSearchDetails.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/content/taxSearchDetails.js":
/***/ (function(module, exports) {

eval("////READ TAX DETAILS REPORT\n////SAVE TAX DATA TO DATABASE\nvar divContainerID = \"divHtmlReport\";\nvar curTabID = null;\nvar taxDetails = {\n  pid: $('div[style=\"top:113px;left:150px;width:221px;height:14px;\"]').text(),\n  address: $('div[style=\"top:71px;left:150px;width:221px;height:14px;\"]').text(),\n  taxYear: $('div[style=\"top:176px;left:150px;width:221px;height:14px;\"]').text(),\n  taxRollNumber: $('div[style=\"top:162px;left:150px;width:221px;height:14px;\"]').text(),\n  grossTaxes: $('div[style=\"top:162px;left:525px;width:221px;height:14px;\"]').text(),\n  legal: $('div[style=\"top:264px;left:0px;width:746px;height:14px;\"]').text(),\n  legalFreeFormDescription: $('div[style=\"top:303px;left:0px;width:746px;height:14px;\"]').text(),\n  reportTitleClass: $(\"div[style='top:0px;left:0px;width:746px;height:17px;']\").attr(\"class\"),\n  //base class for reading the variable position fields\n  landValue: null,\n  improvementValue: null,\n  totalValue: null,\n  bcaDescription: null,\n  bcaDataUpdateDate: null,\n  lotSize: null,\n  planNum: null,\n  reportLink: null,\n  houseType: null,\n  recentSaleDate: \"\",\n  recentSalePrice: \"\",\n  recentSaleDocNum: \"\",\n  recentSaleType: \"\",\n  newTaxAssessRecord: false,\n  init: function init() {\n    var self = this;\n    chrome.storage.local.get([\"houseType\", \"taxSearchRequester\", \"taxYear\"], function (result) {\n      self.houseType = result.houseType;\n      console.log(\"houseType is: \", self.houseType);\n      console.log(\"TopPosition: \", self.ActualTotalsTopPosition);\n      self.getTaxReportDetails();\n      var assess = {\n        _id: self.pid + \"-\" + result.taxYear,\n        landValue: self.landValue,\n        improvementValue: self.improvementValue,\n        totalValue: self.totalValue,\n        PID: self.pid,\n        taxYear: self.taxYear,\n        address: self.address,\n        legal: self.legal,\n        taxRollNumber: self.taxRollNumber,\n        grossTaxes: self.grossTaxes,\n        planNum: self.planNum,\n        houseType: self.houseType,\n        lotSize: self.lotSize,\n        bcaDataUpdateDate: self.bcaDataUpdateDate,\n        bcaDescription: self.bcaDescription,\n        bcaSearch: \"success\",\n        from: \"assess-\" + result.taxSearchRequester + \"-\" + Math.random().toFixed(8),\n        dataFromDB: false\n      };\n\n      if (self.newTaxAssessRecord) {\n        assess.from = \"assess-\" + result.taxSearchRequester + \"-TaxSearchFailed-\" + Math.random().toFixed(8);\n        assess.bcaSearch = \"failed\";\n      }\n\n      chrome.storage.local.set(assess, function () {\n        console.log(\"TaxDetails.bcAssessment is...\", assess); // self.getReportLink(function () {\n        // \tself.reportLink[0].click();\n        // \tconsole.log(\"1 Current Tab When Doing Tax Search is : \", curTabID);\n        // \tlet curTabContentContainer = $('div' + curTabID, top.document);\n        // \tcurTabContentContainer.attr(\"style\", \"display:block!important\");\n        // });\n      }); // if (!self.newTaxAssessRecord) {\n\n      chrome.runtime.sendMessage({\n        todo: \"saveTax\",\n        taxData: assess\n      }, function (response) {\n        console.log(\"tax Data has been save to the database!\");\n      }); // }\n    });\n  },\n  // getReportLink: function (callback) {\n  // \tlet self = this;\n  // \tchrome.storage.local.get('curTabID', function (result) {\n  // \t\tconsole.log(\"2 Current Tab When Doing Tax Search is : \", result.curTabID);\n  // \t\tself.reportLink = $('div#app_tab_switcher a[href=\"' + result.curTabID + '\"]', top.document);\n  // \t\tconsole.log(self.reportLink);\n  // \t\tcurTabID = result.curTabID;\n  // \t\tcallback();\n  // \t});\n  // },\n  getAssessClass: function getAssessClass(reportTitleClass) {\n    var assessClass = \"\";\n    console.log(\"reportTitleClass is: \", reportTitleClass);\n    assessClass = \"mls\" + (Number(reportTitleClass.replace(\"mls\", \"\")) + 7);\n    return assessClass;\n  },\n  getPlanNumClass: function getPlanNumClass(reportTitleClass) {\n    var planNumClass = \"\";\n    console.log(\"reportTitleClass is: \", reportTitleClass);\n    planNumClass = \"mls\" + (Number(reportTitleClass.replace(\"mls\", \"\")) + 5);\n    return planNumClass;\n  },\n  getOtherFieldsClass: function getOtherFieldsClass(reportTitleClass) {\n    var otherFieldsClass = \"\";\n    console.log(\"reportTitleClass is: \", reportTitleClass);\n    otherFieldsClass = \"mls\" + (Number(reportTitleClass.replace(\"mls\", \"\")) + 3);\n    return otherFieldsClass;\n  },\n  getTaxReportDetails: function getTaxReportDetails() {\n    var x0 = $(\"div#\" + divContainerID).children(0).children();\n    var i; // LOOP ALL THE CELLS IN THE \"DETAILED TAX REPORT\"\n\n    for (i = 0; i <= x0.length; i++) {\n      if ($(x0[i]).is(\"div\")) {\n        if (x0[i].textContent == \"Prop Address\") {\n          this.address = x0[i + 1].textContent;\n\n          if (x0[i + 2].textContent != \"Jurisdiction\") {\n            this.address += x0[i + 2].textContent;\n          }\n        }\n\n        if (x0[i].textContent == \"PropertyID\") {\n          this.pid = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"Tax Year\") {\n          this.taxYear = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"Gross Taxes\") {\n          this.grossTaxes = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"Actual Totals\") {\n          this.landValue = x0[i + 4].textContent;\n          this.improvementValue = x0[i + 5].textContent;\n          this.totalValue = x0[i + 6].textContent;\n\n          if (this.landValue == \"$0.00\") {\n            this.newTaxAssessRecord = true;\n            this.landValue = 0;\n            this.improvementValue = 0;\n            this.totalValue = 0;\n          } else {\n            this.newTaxAssessRecord = false;\n          }\n        }\n\n        if (x0[i].textContent == \"PlanNum\") {\n          this.planNum = x0[i + 9].textContent;\n        } // ADD LEGAL FULLDESCRIPTION\n\n\n        if (x0[i].textContent == \"Legal Information\") {\n          this.legal = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"BCA Description\") {\n          this.bcaDescription = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"BCAData Update\") {\n          this.bcaDataUpdateDate = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"Lot Size\") {\n          this.lotSize = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"BCA Description\") {\n          this.bcaDescription = x0[i + 1].textContent;\n        }\n\n        if (x0[i].textContent == \"BCAData Update\") {\n          this.bcaDataUpdateDate = x0[i + 1].textContent;\n        } //ADD RECENT SALES RECORDS\n\n\n        if (x0[i].textContent == \"SaleTransaction Type\") {\n          this.recentSaleDate = x0[i + 1].textContent;\n          this.recentSalePrice = x0[i + 2].textContent;\n          this.recentSaleDocNum = x0[i + 3].textContent;\n          this.recentSaleType = x0[i + 4].textContent;\n        }\n      }\n    }\n\n    if (!this.totalValue) {\n      this.newTaxAssessRecord = true;\n      this.landValue = 0;\n      this.improvementValue = 0;\n      this.totalValue = 0;\n    } else {\n      this.newTaxAssessRecord = false;\n    }\n  },\n  //Revision 0, legacy version\n  getTaxReportDetails_R0: function getTaxReportDetails_R0() {\n    var self = this;\n    var assessClass = self.getAssessClass(self.reportTitleClass);\n    var planNumClass = self.getPlanNumClass(self.reportTitleClass);\n    var otherFieldsClass = self.getOtherFieldsClass(self.reportTitleClass); // got Actual Totals:\n\n    var x1 = $(\"div.\" + assessClass);\n    self.landValue = x1[0].innerText;\n    self.improvementValue = x1[1].innerText;\n    self.totalValue = x1[2].innerText; // got plan number & other fields:\n\n    var x2 = $(\"div.\" + planNumClass);\n    self.planNum = x2[1].textContent;\n\n    if (self.landValue != \"$0.00\") {\n      var x3 = $(\"div.\" + otherFieldsClass);\n      self.lotSize = x3[17].textContent; //lotSize Field Index: 17\n\n      self.bcaDescription = x3[24].textContent; //BCA Description Field Index: 24\n\n      self.bcaDataUpdateDate = x3[28].textContent; //BCAData Update: 28\n    } else {\n      self.lotSize = \"\";\n      self.bcaDescription = \"\";\n      self.bcaDataUpdateDate = \"\";\n    }\n  }\n}; // start point:\n\n$(function () {\n  console.log(\"mls-taxdetails iFrame: \");\n  taxDetails.init();\n});\n\n//# sourceURL=webpack:///./app/content/taxSearchDetails.js?");

/***/ })

/******/ });