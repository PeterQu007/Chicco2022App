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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/content/mls-QuickSearch2.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/content/mls-QuickSearch2.js":
/***/ (function(module, exports) {

eval("console.log(\"Quick Search!!!!\");\nvar mlsTable = []; // var tableInfo = {\n//   todo: \"readMLSTableInfo\",\n//   from: \"mls-QuickSearch2.js\",\n// };\n// chrome.runtime.sendMessage(tableInfo, function (response) {\n//   console.log(response);\n// });\n\nvar mlsContent = null;\nvar mlsVeOverlay = document.getElementById('veOverlay');\nvar mlsDiv = mlsVeOverlay.firstElementChild;\nvar startMonitor = false;\nvar mlsBody = document.getElementsByTagName('body')[0];\nvar options = {\n  root: document.getElementById('veOverlay'),\n  threshold: 1.0\n};\n\nrespondToVisibility = function respondToVisibility(element, options, callback) {\n  var _options = options;\n  var observer = new IntersectionObserver(function (entries, observer) {\n    entries.forEach(function (entry) {\n      callback(entry.intersectionRatio > 0);\n    });\n  }, _options);\n  observer.observe(element);\n};\n\nsetTimeout(respondToVisibility(mlsDiv, options, function (visible) {\n  if (visible) {\n    console.log(\"Visible!\");\n    startMonitor = true;\n  } else {\n    console.log(\"Not Visible\");\n\n    if (startMonitor) {\n      // start monitor context box\n      mlsContent = document.getElementById(\"jqMpCntlToolboxInfobox\");\n      mlsContent.style.display = 'block';\n      var mlsPropertyInfo = document.getElementById('propertyInfo');\n      var elmArea = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Area:</span><span id=\"mls-area\"></span></div>'); // let elmCDOM = $('<div><span class=\"jqMpCntlInfoxboxLabel\">CDOM:</span><span id=\"mls-cdom\"></span></div>');\n\n      var elmFlrTotFin = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Total Finished:</span><span id=\"mls-flrtotfin\"></span></div>'); // let elmFrontage = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Frontage:</span><span id=\"mls-frontage\"></span></div>');\n\n      var elmFloodPlain = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Flood Plain:</span><span id=\"mls-flood-plain\"></span></div>');\n      var elmListDate = $('<div><span class=\"jqMpCntlInfoxboxLabel\">List Date:</span><span id=\"mls-list-date\"></span></div>');\n      var elmLotSize = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Lot Size /Frontage:</span><span id=\"mls-lot-size\"></span></div>');\n      var elmPriceSqFt = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Price SqFt:</span><span id=\"mls-price-sqft\"></span></div>');\n      var elmSubArea = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Sub Area:</span><span id=\"mls-sub-area\"></span></div>');\n      var elmStyleOfHome = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Style of Home:</span><span id=\"mls-style-of-home\"></span></div>'); // let elmTotFlArea = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Total Floor Area:</span><span id=\"mls-total-floor-area\"></span></div>');\n\n      var elmTotalBed = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Tot Bed/Bath:</span><span id=\"mls-total-bed\"></span></div>');\n      var elmTotalKitchen = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Total Kitchens:</span><span id=\"mls-total-kitchen\"></span></div>');\n      var elmHr = $('<hr class=\"mls-hr\">');\n      var elmYearBuilt = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Year built:</span><span id=\"mls-year-built\"></span></div>');\n      var elmBCAImprove = $('<div><span class=\"jqMpCntlInfoxboxLabel\">Improve/Land:</span><span id=\"mls-bca-improve-value\"></span></div>'); // let elmBCALand = $('<div><span class=\"jqMpCntlInfoxboxLabel\">BCA Land:</span><span id=\"mls-bca-land-value\"></span></div>');\n\n      var elmTotalValue = $('<div><span class=\"jqMpCntlInfoxboxLabel\">BCA Total:</span><span id=\"mls-bca-total-value\"></span></div>'); // let elmBCAChange = $('<div><span class=\"jqMpCntlInfoxboxLabel\">BCA Change:</span><span id=\"mls-bca-change\"></span></div>');\n\n      var elmMLSNO = $('<div><span class=\"jqMpCntlInfoxboxLabel\">MLS NO#:</span><span id=\"mls-mls-no\"></span></div>');\n      var htmlListingData = $('div.jqMpCntlDataScroll')[0];\n      var htmlArea = document.getElementById('mls-area');\n\n      if (!htmlArea) {\n        $(htmlListingData).append(elmArea);\n        $(htmlListingData).append(elmSubArea);\n        $(htmlListingData).append(elmFloodPlain);\n        $(htmlListingData).append(elmStyleOfHome);\n        $(htmlListingData).append(elmListDate);\n        $(htmlListingData).append(elmHr); // $(htmlListingData).append(elmCDOM);\n\n        $(htmlListingData).append(elmLotSize); // $(htmlListingData).append(elmFrontage);\n\n        $(htmlListingData).append(elmPriceSqFt); // $(htmlListingData).append(elmTotFlArea);\n\n        $(htmlListingData).append(elmFlrTotFin);\n        $(htmlListingData).append(elmTotalBed);\n        $(htmlListingData).append(elmTotalKitchen);\n        $(htmlListingData).append(elmYearBuilt);\n        $(htmlListingData).append(elmHr);\n        $(htmlListingData).append(elmBCAImprove); // $(htmlListingData).append(elmBCALand);\n\n        $(htmlListingData).append(elmTotalValue); // $(htmlListingData).append(elmBCAChange);\n\n        $(htmlListingData).append(elmMLSNO);\n      }\n\n      var htmlButton = document.createElement('button');\n      htmlButton.innerHTML = \"Show More\";\n      htmlButton.id = \"mls-show-more\";\n\n      htmlButton.onclick = function () {\n        console.log('click me');\n        var htmlMLSNo = document.getElementById('mlsNumLabelText'); // get MLS No\n\n        var htmlMLSNoSpan = htmlMLSNo.nextElementSibling;\n        var mlsNo = htmlMLSNoSpan.firstElementChild.innerText; // watch mls # when changed\n        // select the target node\n\n        var target = document.getElementsByClassName('jqMpCntlDetailLink')[0]; // create an observer instance\n\n        var observer = new MutationObserver(function (mutations) {\n          console.log($('.jqMpCntlDetailLink').text());\n          var htmlMLSNo = document.getElementById('mlsNumLabelText'); // get MLS No\n\n          var htmlMLSNoSpan = htmlMLSNo.nextElementSibling;\n          var mlsNo = htmlMLSNoSpan.firstElementChild.innerText;\n          getListingData(mlsNo);\n        });\n        var config = {\n          attributes: true,\n          childList: true,\n          characterData: true,\n          subtree: true\n        }; // pass in the target node, as well as the observer options\n\n        observer.observe(target, config);\n        getListingData(mlsNo);\n      };\n\n      var elmShowMoreButton = document.getElementById(\"mls-show-more\");\n\n      if (!elmShowMoreButton) {\n        mlsPropertyInfo.appendChild(htmlButton);\n        htmlButton.click();\n      } // let htmlImgs = $('#divMap Img');\n      // htmlImgs.click((img) => {\n      //   $(img).addClass('map-image-border');\n      // })\n\n\n      $('body').on('click', 'img', function (e) {\n        // alert('it works');\n        // Search divMap , search z-index = 106 to get to the img element\n        var htmlDiv = $(e.target).parent();\n        var htmlDivAttributeTitle = htmlDiv.attr('title');\n        var markTextPattern = /(?=.)^\\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\\.[0-9]{1,2})?k/i;\n        var markTextPattern2 = /(?=.)^\\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\\.[0-9]{1,2})?$/;\n        var htmlAllDivs = $('#divMap div').filter(function () {\n          return $(this).text().toLowerCase().match(markTextPattern) || $(this).text().toLowerCase().match(markTextPattern2);\n        }); //remove all underlines\n\n        htmlAllDivs.removeClass('mls-color-red-2');\n        var htmlDivs = $('#divMap div').filter(function () {\n          return $(this).text().toLowerCase() === htmlDivAttributeTitle.toLowerCase();\n        });\n        htmlDivs.addClass('mls-color-red-2');\n      });\n      var markTextPattern = /(?=.)^\\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\\.[0-9]{1,2})?k/i;\n      var markTextPattern2 = /(?=.)^\\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\\.[0-9]{1,2})?$/; // let htmlNumberDivs = $('#divMap div').filter(function () {\n      //   return $(this).text().toLowerCase().match(markTextPattern2);\n      // });\n\n      $('body').on('click', 'div', function (e) {\n        var numberDiv = $(e.target);\n        console.log(numberDiv.text());\n\n        if (numberDiv.text().match(markTextPattern) || numberDiv.text().match(markTextPattern2)) {\n          var allDivs = $('#divMap div');\n          allDivs.removeClass('mls-color-red');\n          numberDiv.addClass('mls-color-red');\n        }\n      });\n    }\n  }\n}), 500);\n\ngetListingData = function getListingData(mlsNo) {\n  var listInfo = {\n    mlsNo: mlsNo,\n    todo: \"readMLSTableInfo\",\n    from: \"mls-QuickSearch2.js\"\n  };\n  chrome.runtime.sendMessage(listInfo, function (response) {\n    console.log(response);\n    var listingInfo = response;\n    var dwellingType = listingInfo['Prop Type'];\n    var listingStatus = listingInfo['1) Status'] || listingInfo['Status']; // show listing info:\n\n    var htmlArea = $('#mls-area'); // let htmlCDOM = $('#mls-cdom');\n\n    var htmlFlrTotFin = $('#mls-flrtotfin'); // let htmlFrontage = $('#mls-frontage');\n\n    var htmlFloodPlain = $('#mls-flood-plain');\n    var htmlListDate = $('#mls-list-date');\n    var htmlLotSize = $('#mls-lot-size');\n    var htmlPriceSqFt = $('#mls-price-sqft');\n    var htmlSubArea = $('#mls-sub-area');\n    var htmlStyleOfHome = $('#mls-style-of-home');\n    var htmlTotFlArea = $('#mls-total-floor-area');\n    var htmlTotalBed = $('#mls-total-bed'); // let htmlTotalBath = $('#mls-total-bath');\n\n    var htmlYearBuilt = $('#mls-year-built');\n    var htmlBCAImprove = $('#mls-bca-improve-value'); // let htmlBCALand = $('#mls-bca-land-value');\n\n    var htmlTotalValue = $('#mls-bca-total-value'); // let htmlBCAChange = $('#mls-bca-change');\n\n    var htmlMLSNO = $('#mls-mls-no');\n    htmlArea.text(listingInfo['Area'] + ' | ' + listingInfo['S/A']);\n    htmlSubArea.text(listingInfo['S/A']);\n\n    if (dwellingType.indexOf('Detached') >= 0) {\n      htmlFloodPlain.text(listingInfo['Flood Plain']);\n    } else {\n      htmlFloodPlain.text(listingInfo['TypeDwel']);\n      htmlFloodPlain.prev('span').text('Type Dwell');\n    }\n\n    htmlListDate.html(listingInfo['List Date'] + '<span class=\"mls-highlighted\"> [ ' + listingInfo['CDOM'] + ' ] </span>'); // htmlCDOM.text(listingInfo['CDOM']);\n\n    htmlLotSize.text(listingInfo['Lot Sz (Sq.Ft.)'] + ' [ ' + listingInfo['Frontage - Feet'] + ' ]'); // htmlFrontage.text(listingInfo['Frontage - Feet']);\n\n    if (listingStatus == 'A') {\n      htmlPriceSqFt.html(listingInfo['List Price'] + '<span class=\"mls-highlighted\"> [ ' + listingInfo['PrcSqft'] + ' ] </span>');\n      htmlPriceSqFt.prev().text('List Price');\n    } else {\n      htmlPriceSqFt.html('<span class=\"mls-highlighted\">' + listingInfo['Sold Price'] + '</span><span class=\"mls-highlighted\"> [ ' + listingInfo['List Price'] + ' | ' + listingInfo['SP Sqft'] + ' ] </span>');\n      htmlPriceSqFt.prev().text('Sold Price');\n    }\n\n    if (dwellingType.indexOf('Detached') >= 0) {\n      htmlStyleOfHome.text(listingInfo['Style of Home']);\n    } else {\n      htmlStyleOfHome.html(listingInfo['StratMtFee'] + '<span class=\"mls-highlighted\"> [ ' + listingInfo['StrFeePSF'] + ' ] </span>');\n      htmlStyleOfHome.prev('span').text('Strata Fee');\n    }\n\n    htmlFlrTotFin.html(listingInfo['FlArTotFin'] + ' | ' + '<span class=\"mls-highlighted\"> [ ' + listingInfo['TotFlArea'] + ' ] </span>');\n    htmlTotalBed.text(listingInfo['Tot BR'] + ' | ' + listingInfo['Tot Baths'] + ' | ' + listingInfo['#Kitchens']); // htmlTotalBath.text(listingInfo['Tot Baths']);\n\n    htmlYearBuilt.html(listingInfo['Yr Blt'] + '<span class=\"mls-highlighted\"> [ ' + listingInfo['Age'] + ' ] </span>');\n    htmlBCAImprove.text(listingInfo['imprvValue'] + ' | ' + listingInfo['landValue']); // htmlBCALand.text(listingInfo['landValue']);\n\n    htmlTotalValue.html(listingInfo['totalValue'] + '<span class=\"mls-highlighted\"> [ ' + listingInfo['change%'] + ' ] </span>'); // htmlBCAChange.text(listingInfo['change%']);\n\n    htmlMLSNO.text(listingInfo['ML #']);\n  });\n};\n\n//# sourceURL=webpack:///./app/content/mls-QuickSearch2.js?");

/***/ })

/******/ });