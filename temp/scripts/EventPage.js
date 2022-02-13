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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/background/eventPage.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/background/eventPage.js":
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: C:\\\\wamp64\\\\www\\\\mlshelper\\\\app\\\\background\\\\eventPage.js: Support for the experimental syntax 'nullishCoalescingOperator' isn't currently enabled (641:31):\\n\\n\\u001b[0m \\u001b[90m 639 | \\u001b[39m  let result \\u001b[33m=\\u001b[39m {\\u001b[0m\\n\\u001b[0m \\u001b[90m 640 | \\u001b[39m    msg\\u001b[33m:\\u001b[39m \\u001b[32m\\\">>> Tax Search Return From Front Service <<<\\\"\\u001b[39m\\u001b[33m,\\u001b[39m\\u001b[0m\\n\\u001b[0m\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 641 | \\u001b[39m    status\\u001b[33m:\\u001b[39m resultInfo\\u001b[33m.\\u001b[39mstatus \\u001b[33m?\\u001b[39m\\u001b[33m?\\u001b[39m \\u001b[32m\\\"OK\\\"\\u001b[39m\\u001b[33m,\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m     | \\u001b[39m                              \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 642 | \\u001b[39m    data\\u001b[33m:\\u001b[39m assessInfo\\u001b[33m,\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 643 | \\u001b[39m  }\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 644 | \\u001b[39m  \\u001b[36mreturn\\u001b[39m result\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\nAdd @babel/plugin-proposal-nullish-coalescing-operator (https://git.io/vb4Se) to the 'plugins' section of your Babel config to enable transformation.\\n    at _class.raise (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:4028:15)\\n    at _class.expectPlugin (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5348:18)\\n    at _class.parseExprOp (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5938:16)\\n    at _class.parseExprOps (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5917:17)\\n    at _class.parseMaybeConditional (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5879:21)\\n    at _class.parseMaybeAssign (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5826:21)\\n    at _class.parseObjectProperty (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6897:101)\\n    at _class.parseObjPropValue (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6922:99)\\n    at _class.parseObj (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6833:12)\\n    at _class.parseExprAtom (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6398:21)\\n    at _class.parseExprAtom (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:3724:52)\\n    at _class.parseExprSubscripts (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:6019:21)\\n    at _class.parseMaybeUnary (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5998:21)\\n    at _class.parseExprOps (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5907:21)\\n    at _class.parseMaybeConditional (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5879:21)\\n    at _class.parseMaybeAssign (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:5826:21)\\n    at _class.parseVar (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7898:26)\\n    at _class.parseVarStatement (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7728:10)\\n    at _class.parseStatementContent (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7327:21)\\n    at _class.parseStatement (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7277:17)\\n    at _class.parseBlockOrModuleBlockBody (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7829:23)\\n    at _class.parseBlockBody (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7816:10)\\n    at _class.parseBlock (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7805:10)\\n    at _class.parseFunctionBody (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7042:24)\\n    at _class.parseFunctionBodyAndFinish (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7024:10)\\n    at _class.parseFunction (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7958:10)\\n    at _class.parseStatementContent (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7382:25)\\n    at _class.parseStatement (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7277:17)\\n    at _class.parseBlockOrModuleBlockBody (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7829:23)\\n    at _class.parseBlockBody (C:\\\\wamp64\\\\www\\\\mlshelper\\\\node_modules\\\\@babel\\\\parser\\\\lib\\\\index.js:7816:10)\");\n\n//# sourceURL=webpack:///./app/background/eventPage.js?");

/***/ })

/******/ });