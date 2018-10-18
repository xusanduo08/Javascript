(function (modules) { // webpackBootstrap
	// The module cache
	var installedModules = {};
	// The require function
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.l = true;
		// Return the exports of the module
		return module.exports;
	}


	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;
	// expose the module cache
	__webpack_require__.c = installedModules;
	// define getter function for harmony exports
	__webpack_require__.d = function (exports, name, getter) {
		if (!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter });
		}

	};

	// define __esModule on exports
	__webpack_require__.r = function (exports) {
		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		}
		Object.defineProperty(exports, '__esModule', { value: true });
	};

	// create a fake namespace object
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
	__webpack_require__.t = function (value, mode) {
		if (mode & 1) value = __webpack_require__(value);
		if (mode & 8) return value;
		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
		var ns = Object.create(null);
		__webpack_require__.r(ns);
		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
		return ns;
	};

	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = function (module) {
		var getter = module && module.__esModule ?
			function getDefault() { return module['default']; } :
			function getModuleExports() { return module; };
		__webpack_require__.d(getter, 'a', getter);
		return getter;
	};

	// Object.prototype.hasOwnProperty.call
	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	// __webpack_public_path__
	__webpack_require__.p = "";
	// Load entry module and return exports
	return __webpack_require__(__webpack_require__.s = "./index.js");
})
	({

		"./es6.js": (function (module, __webpack_exports__, __webpack_require__) {
			"use strict";
			__webpack_require__.r(__webpack_exports__);
			var A = {
				a: "A"
			}
			__webpack_exports__["default"] = (A);
            //这地方为什么会挂载在default属性下？因为代码里export时是通过export { A as default}这样导出去的
            //也就是说，es6.js这个文件与外界的接口就是default
            //本质上export default 就是将当前模块的东西放在default接口下，并把这个接口输出出去供外界使用
		}),

		"./index.js":
			(function (module, __webpack_exports__, __webpack_require__) {
				"use strict";
				__webpack_require__.r(__webpack_exports__);
				
				var _es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./es6.js");
                console.log(_es6__WEBPACK_IMPORTED_MODULE_0__["default"])//这地方为什么自动取了default属性？
                //在导入的时候是通过import { default as A } from 'xxx'这样方式导入的，default为es6.js与外界的接口，模块内的东西都放在default接口下
                //所以，这地方就自动打印了es6.js模块的default属性来输出模块中的内容
                //说白了，这地方的default和上面的default是一个东西，都是es6.js这个模块对外的接口，两者是一样的
				//# sourceURL=webpack:///./index.js?;
			})
	});