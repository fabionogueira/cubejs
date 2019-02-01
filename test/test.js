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
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("development" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/adapters/csv.js":
/*!*****************************!*\
  !*** ./src/adapters/csv.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// @ts-check

exports.default = {
    request: function request() {
        return null;
    },
    response: function response(cubejs, result) {
        var i = void 0,
            j = void 0,
            v = void 0,
            h = void 0,
            o = void 0,
            k = void 0;
        var all = {};
        var rows = {};
        var measureValues = {};
        var arr = [];
        var definition = cubejs.getDefinition();
        var lines = result.split('\n');
        var headers = lines[0].split(';');
        var obj = void 0,
            currentline = void 0;

        definition.cols.forEach(function (item) {
            all[item.dimension || item.measure] = item;
        });
        definition.rows.forEach(function (item) {
            all[item.dimension || item.measure] = item;
        });

        for (i = 1; i < lines.length; i++) {
            obj = {};
            k = '';
            currentline = lines[i].split(";");

            for (j = 0; j < headers.length; j++) {
                h = headers[j];
                o = all[h];

                if (o) {
                    v = currentline[j].trim().replace(',', '.');
                    k += o.dimension ? v : h;

                    if (o.measure) {
                        v = Number(v);
                        measureValues[k] = (measureValues[k] || 0) + v;
                        obj[h] = measureValues[k];
                    } else {
                        obj[h] = v;
                    }
                }
            }

            rows[k] = obj;
        }

        for (i in rows) {
            arr.push(rows[i]);
        }

        return arr;
    },
    header: function header(data) {
        var value = void 0,
            type = void 0,
            datatype = void 0;
        var arr = [];
        var lines = data.split('\n');
        var headers = lines[0].split(';');
        var line1 = lines[1] ? lines[1].split(';') : [];

        headers.forEach(function (name, index) {
            name = name.trim();
            value = line1[index];

            if (value) {
                type = isNaN(Number(value)) ? 'dimension' : 'measure';
                datatype = type == 'measure' ? 'number' : stringIsDate(value) ? 'date' : 'string';
            } else {
                type = null;
                datatype = 'string';
            }

            arr.push({
                name: name,
                type: type || 'dimension',
                datatype: datatype
            });
        });

        return arr;
    },
    toDataset: function toDataset(data) {
        var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        var i = void 0,
            j = void 0,
            v = void 0,
            h = void 0,
            o = void 0,
            k = void 0,
            lines = void 0;
        var all = {};
        var rows = {};
        var measureValues = {};
        var arr = [];
        var obj = void 0,
            currentline = void 0;

        data = data || '';
        lines = data.split('\n', limit);

        headers = headers || this.header(data);

        headers.forEach(function (item) {
            all[item.name] = item;
        });

        for (i = 1; i < lines.length; i++) {
            obj = {};
            k = '';
            currentline = lines[i].split(";");

            for (j = 0; j < headers.length; j++) {
                h = headers[j];
                o = all[h.name];

                if (o) {
                    v = o.expression ? 0 : currentline[j].trim().replace(',', '.');
                    k += o.type == 'dimension' ? v : h.name;

                    if (o.type == 'measure') {
                        v = Number(v);
                        measureValues[k] = (measureValues[k] || 0) + v;
                        obj[h.name] = measureValues[k];
                    } else {
                        obj[h.name] = v;
                    }
                }
            }

            rows[k] = obj;
        }

        for (i in rows) {
            arr.push(rows[i]);
        }

        return arr;
    }
};


function stringIsDate(value) {
    var d = void 0;

    if (!value) {
        return false;
    }

    if (!isNaN(Number(value))) {
        return false;
    }

    if (value.split('/').length == 3 || value.split('-').length == 3) {
        d = new Date(value);

        // @ts-ignore
        return d != 'Invalid Date';
    }

    return false;
}

/***/ }),

/***/ "./src/adapters/elasticsearch.js":
/*!***************************************!*\
  !*** ./src/adapters/elasticsearch.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// @ts-check

exports.default = {
    request: function request(cubejs) {
        var previous = {};
        var dimensions = [];
        var measures = [];
        var aggs = {};
        var definition = cubejs.getDefinition();
        var result = {
            size: 0,
            from: 0,
            aggs: aggs
            /* query: query_string ? {
                query_string: {
                    query: query_string
                }
            } : {} */
        };

        definition.cols.forEach(function (c) {
            c.dimension ? dimensions.push(c) : measures.push(c);
        });
        definition.rows.forEach(function (c) {
            c.dimension ? dimensions.push(c) : measures.push(c);
        });

        dimensions.forEach(function (col) {
            aggs[col.dimension] = {
                terms: {
                    field: col.dimension,
                    size: 50
                },
                aggs: {}
            };
            previous = aggs[col.dimension];
            aggs = previous.aggs;
        });

        delete previous.aggs;

        // filters
        /* {id:1, exclude: false, cluster:'armas', dimension:'calibre', name:'calibre', type:'list', value:['38', '380', '.40']},
        {id:2, exclude: true, cluster:'armas', dimension:'especie', name:'sem espingarda', type:'list', value:['espingarda']},
        {id:3, exclude: false, cluster:'armas', dimension:'situacao', name:'situação regular e outras', type:'value', value:'regu', match:'startwith'} */
        if (definition.filters) {
            result.query = {};
            definition.filters.forEach(function (f) {
                if (f.type == 'list') {
                    result.query.terms = {};
                    result.query.terms[f.dimension] = f.value;
                }
            });
        }

        return result;
    },
    response: function response(cubejs, result) {
        var i = void 0,
            activeRow = void 0;
        var arr = [];
        var activeKeys = {};
        var measures = {};
        var dimensions = {};
        var aggregations = result.aggregations;
        var definition = cubejs.getDefinition();
        var cols = definition.cols;
        var rows = definition.rows;

        cols.forEach(function (c) {
            c.dimension ? dimensions[c.dimension] = true : measures[c.measure] = true;
        });
        rows.forEach(function (c) {
            c.dimension ? dimensions[c.dimension] = true : measures[c.measure] = true;
        });

        for (i in aggregations) {
            newRow();
            processBuckets(i, aggregations[i].buckets, aggregations[i]);
        }

        function newRow() {
            if (activeRow) {
                arr.push(activeRow);
            }

            activeRow = {};

            for (var _i in activeKeys) {
                activeRow[_i] = activeKeys[_i];
            }
        }

        function processBuckets(dm, buckets, parent) {
            buckets.forEach(function (bucket) {
                var b = void 0,
                    i = void 0,
                    v = void 0,
                    r = void 0;

                activeRow[dm] = bucket.key;

                b = getBucketDimension(bucket);
                if (b) {
                    activeKeys[dm] = bucket.key;
                    processBuckets(b.bucketKey, b.bucketObj.buckets, b.bucketObj);
                } else {
                    // adiciona as métricas na linha atual
                    for (i in bucket) {
                        if (measures[i]) {
                            v = bucket[i];
                            activeRow[i] = v.value == undefined ? v : v.value;
                        }
                    }

                    // sum_other_doc_count
                    if (parent.sum_other_doc_count) {
                        r = Object.assign({}, activeRow);
                        newRow();
                        activeRow = r;
                        activeRow[dm] = 'other_doc_count';
                        activeRow['doc_count'] = parent.sum_other_doc_count;
                    }

                    newRow();
                }
            });

            delete activeKeys[dm];
        }

        function getBucketDimension(bucket) {
            var k = void 0;

            for (k in bucket) {
                if (dimensions[k]) {
                    return {
                        bucketKey: k,
                        bucketObj: bucket[k]
                    };
                }
            }

            return null;
        }

        return arr;
    }
};

/***/ }),

/***/ "./src/cubejs.css":
/*!************************!*\
  !*** ./src/cubejs.css ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".cubejs-hbox{display:flex; justify-content:flex-start; align-items:stretch; flex-direction:row;}\n.cubejs-vbox{display:flex; justify-content:flex-start; align-items:stretch; flex-direction:column;}\n\n.cubejs-table-corner{\n    border: solid 1px #cccccc;\n    border-style: solid solid none solid;\n}\n.cubejs-table-categories{\n    border: solid 1px #cccccc;\n    border-style: none none solid solid;\n}\n.cubejs-table-values{\n    border: solid 1px #cccccc;\n    border-style: none none solid none;\n}\n.cubejs-cell{\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-family: monospace;\n    font-size: 12px;\n    border: solid 1px #cccccc;\n    border-style: solid solid none none;\n}\n.cell-content{\n    white-space: nowrap;\n    overflow: hidden;\n    margin: 6px;\n}\n.cubejs-category-cell{\n    min-height: 24px;\n    background: #fffce4;\n    font-weight: bold;\n}\n.cubejs-category-row{\n    width: 100px;\n}\n.cubejs-category-row-parent{\n    align-items: flex-start;\n    height: auto;\n    padding-top: 4px;\n}\n.cubejs-category-col{\n    width: 100px;\n}\n.cubejs-category-col-parent{\n    width: auto;\n    position: relative;\n}\n.cubejs-category-flex{\n    flex: 1;\n    height: 100%;\n}\n.cubejs-is-measure{\n    color: #533d56;\n    font-style: italic;\n    font-weight: normal;\n}\n.cubejs-data-cell{\n    width: 100px;\n    height: 24px;\n    background: #f3f3f3;\n    justify-content: flex-end;\n}\n.cubejs-calculated-category{\n    color: red;\n    font-weight: bold\n}\n.cubejs-calculated-data{\n    color: red;\n    font-weight: bold\n}\n.cubejs-data-cell .cell-content{\n    padding-right: 10px;\n}\n.plus{\n    width: 10px;\n    height: 10px;\n    position: absolute;\n    cursor: pointer;\n}\n.plus:hover{\n    background: #e0e0e0;\n}\n.plus::after {\n    content: '';\n    position: absolute;\n    top: 1px;\n    left: 4px;\n    border-left: solid 2px #000;\n    height: 8px; \n}\n.plus::before {\n    content: '';\n    position: absolute;\n    top: 4px;\n    left: 1px;\n    border-top: solid 2px #000;\n    width: 8px; \n}\n.cubejs-category-col-parent .plus{\n    top: 2px;\n    left: 2px;\n}", ""]);

// exports


/***/ }),

/***/ "./src/cubejs.js":
/*!***********************!*\
  !*** ./src/cubejs.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // @ts-check

var _dataFormat = __webpack_require__(/*! ./data-format */ "./src/data-format.js");

var _dataFormat2 = _interopRequireDefault(_dataFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operations = {};
var instanceId = 0;
var dataId = 0;
var adapters = {};
var DEFAULT_OPERATION_OPTIONS = {
    position: 'last',
    priority: 0,
    prefix: '',
    suffix: '',
    format: '',
    precision: 2,
    thousand: ',',
    decimal: '.'
};

var CubeJS = function () {
    _createClass(CubeJS, null, [{
        key: 'registerAdapter',
        value: function registerAdapter(name, definition) {
            adapters[name] = definition;
        }

        /*
         * 
         * @ param {*} name 
         * @ param {{priority?:number, init:function}} definition 
         */

    }, {
        key: 'createOperation',
        value: function createOperation(options, callback) {
            operations[options.name] = { options: options, callback: callback };
        }
    }, {
        key: 'getOperation',
        value: function getOperation(name) {
            return operations[name];
        }
    }, {
        key: 'defaults',
        value: function defaults(def) {
            Object.assign(DEFAULT_OPERATION_OPTIONS, def);
        }

        /**
         * @param {{rows:Array<any>, cols:Array<any>, filters?:Array<any>}} definition 
         */

    }]);

    function CubeJS(definition) {
        var _this = this;

        _classCallCheck(this, CubeJS);

        this._instanceId = instanceId++;
        this._definition = definition;
        this._dataset = [];
        this._maps = {
            keys: {},
            rows: [],
            cols: []
        };
        this._aggregations = {};
        this._dimensions = {};
        this._measures = {};
        this._operations = [];
        this._operationsKeys = {};
        this._categoryAlias = {};
        this._CACHE = {
            findRow: {},
            findCol: {},
            formatMeasure: {}
        };

        definition.rows.forEach(function (item, index) {
            definition.rows[index] = Object.assign({}, DEFAULT_OPERATION_OPTIONS, item);

            item.$categoriesOf = 'row';

            if (item.dimension) _this._dimensions[item.dimension] = item;
            if (item.measure) _this._measures[item.measure] = item;
        });
        definition.cols.forEach(function (item, index) {
            definition.cols[index] = Object.assign({}, DEFAULT_OPERATION_OPTIONS, item);

            item.$categoriesOf = 'col';

            if (item.dimension) _this._dimensions[item.dimension] = item;
            if (item.measure) _this._measures[item.measure] = item;
        });
    }

    _createClass(CubeJS, [{
        key: 'clone',
        value: function clone() {
            var clone = new CubeJS(this._definition);

            clone._operations = this._operations;
            clone._operationsKeys = this._operationsKeys;
            clone._categoryAlias = this._categoryAlias;
            clone._aux = this._aux;

            clone._calculatedFields = this._calculatedFields;
            clone.setDataset(this._dataset);

            clone._headers = this._headers;
            clone._maps = JSON.parse(JSON.stringify(this._maps));

            return clone;
        }
    }, {
        key: 'getDefinition',
        value: function getDefinition() {
            return this._definition;
        }
    }, {
        key: 'setDataset',
        value: function setDataset(dataset) {
            var _this2 = this;

            this._categoryAlias = {};
            this._dataId = dataId++;
            this._dataset = dataset; // adapter ? adapter.response(this, dataset) : dataset
            this._peddings = true;

            // limpa todo o cache
            this.clearCache();

            // processa métricas calculadas
            if (this._calculatedFields) {
                this._dataset.forEach(function (row) {
                    for (var k in _this2._calculatedFields) {
                        row[k] = _this2._calculatedFields[k].expression(row);
                    }
                });
            }

            return this;
        }
    }, {
        key: 'applyOperations',
        value: function applyOperations() {
            var _this3 = this;

            var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this._peddings || force) {

                this._headers = {};
                this._maps = {
                    keys: {},
                    rows: [],
                    cols: []
                };

                console.log('applyOperations running');

                this._createAux();
                this._createKeysMap();
                this._createHead(this._definition.rows, this._maps.rows);
                this._createHead(this._definition.cols, this._maps.cols);

                // ordena as operações por prioridade
                this._operations.sort(function (o1, o2) {
                    return o1.priority - o2.priority;
                });

                // executa as operações
                this._operations.forEach(function (def) {
                    _this3._doOperation(def);
                });
            }
        }
    }, {
        key: 'getQuery',
        value: function getQuery() {}
        // let adapter = adapters[this._adapter]
        // return adapter ? adapter.request(this) : this._definition


        // agrega valores de uma célula, somando todos os seus filhos

    }, {
        key: 'aggregateByCategory',
        value: function aggregateByCategory(category) {
            var _this4 = this;

            var maps = this._maps;
            var f = this._dimensions[category.dimension];

            if (!f || !category.children) {
                return;
            }

            if (!category.aggr) {
                category.aggr = {
                    children: category.children,
                    include: {},
                    exclude: {}
                };
            }

            if (f.$categoriesOf == 'row') {
                maps.cols.forEach(function (c) {
                    _this4.eachLeaf(c, function (leafCol) {
                        var s = 0;
                        var k = leafCol.key + category.key;

                        _this4.eachLeaf(category, function (leafRow) {
                            var k = leafCol.key + leafRow.key;
                            var cell = maps.keys[k];

                            if (cell) {
                                s += cell.value;
                                category.aggr.exclude[k] = maps.keys[k];
                                delete maps.keys[k];
                            }
                        });

                        category.aggr.include[k] = maps.keys[k] = {
                            value: s,
                            display: s
                        };
                    });
                });
            } else if (f.$categoriesOf == 'col') {
                maps.rows.forEach(function (r) {
                    _this4.eachLeaf(r, function (leafRow) {
                        var s = 0;
                        var k = category.key + leafRow.key;

                        _this4.eachLeaf(category, function (leafCol) {
                            var k = leafCol.key + leafRow.key;
                            var cell = maps.keys[k];

                            if (cell) {
                                s += cell.value;
                                category.aggr.exclude[k] = maps.keys[k];
                                delete maps.keys[k];
                            }
                        });

                        category.aggr.include[k] = maps.keys[k] = {
                            value: s,
                            display: s
                        };
                    });
                });
            }

            delete category.children;
        }

        // desagrega valores de uma célula

    }, {
        key: 'unAggregateByCategory',
        value: function unAggregateByCategory(category) {
            var k = void 0,
                o = void 0;
            var keys = this._maps.keys;
            var aggr = category.aggr;

            if (aggr) {
                category.children = aggr.children;

                for (k in aggr.include) {
                    delete keys[k];
                }

                for (k in aggr.exclude) {
                    o = aggr.exclude[k];
                    keys[k] = o;
                }

                delete category.aggr;
            }
        }
    }, {
        key: 'aggregateRowByLevel',
        value: function aggregateRowByLevel(level) {
            var _this5 = this;

            this.forEach(this._maps.rows, function (r) {
                _this5.aggregateByCategory(r);
            }, level);
        }
    }, {
        key: 'aggregateColByLevel',
        value: function aggregateColByLevel(level) {
            var _this6 = this;

            this.forEach(this._maps.cols, function (c) {
                _this6.aggregateByCategory(c);
            }, level);
        }
    }, {
        key: 'getMaps',
        value: function getMaps() {
            return this._maps;
        }
    }, {
        key: 'getColRangeValues',
        value: function getColRangeValues(rowKey, start, end) {
            return _getColRangeValues(this, rowKey, start, end);
        }
    }, {
        key: 'getRowRangeValues',
        value: function getRowRangeValues(colKey, start, end) {
            return _getRowRangeValues(this, colKey, start, end);
        }
    }, {
        key: 'setAlias',
        value: function setAlias(aliasDefinition) {
            Object.assign(this._categoryAlias, aliasDefinition);
        }

        /**
         * @param {{key:string, operation:string, target:string, position?:string, reference?:string, expression?:string, precision?, options?, display?, prefix?, suffix?}} definition 
         */

    }, {
        key: 'addOperation',
        value: function addOperation(definition) {
            var def = void 0,
                op = void 0;

            if (definition.key && this._operationsKeys[definition.key]) return;

            op = operations[definition.operation];
            if (op) {
                def = Object.assign({}, DEFAULT_OPERATION_OPTIONS, definition);

                if (definition.key) {
                    this._operationsKeys[def.key] = true;
                }

                this._peddings = true;
                this._operations.push(def);

                if (op.options.add) {
                    op.options.add.call(this, def);
                }
            }
        }
    }, {
        key: 'removeOperation',
        value: function removeOperation(key) {
            var i = void 0;

            if (this._operationsKeys[key]) {
                delete this._operationsKeys[key];

                i = this._operations.findIndex(function (def) {
                    return def.key == key;
                });
                if (i >= 0) {
                    this._peddings = true;
                    this._operations.splice(i, 1);
                }
            }
        }
    }, {
        key: 'clearOperations',
        value: function clearOperations() {
            this.clearCache();

            this._categoryAlias = {};
            this._operationsKeys = {};
            this._operations = [];
            this._peddings = true;
        }
    }, {
        key: 'clearCache',
        value: function clearCache() {
            this._CACHE = {
                findRow: {},
                findCol: {},
                formatMeasure: {}
            };
        }
    }, {
        key: 'removeRow',
        value: function removeRow(row) {
            var arr = void 0;
            var parent = this._getHeader(row.parentKey);

            arr = parent ? parent : this._maps.rows;
            arr.splice(row._index, 1);

            // limpa o cache
            this._CACHE.findRow = {};

            // atualiza _index
            arr.forEach(function (item, index) {
                item._index = index;
            });
        }
    }, {
        key: 'removeCol',
        value: function removeCol(col) {
            var arr = void 0;
            var parent = this._getHeader(col.parentKey);

            arr = parent ? parent : this._maps.cols;
            arr.splice(col._index, 1);

            // limpa o cache
            this._CACHE.findCol = {};

            // atualiza _index
            arr.forEach(function (item, index) {
                item._index = index;
            });
        }
    }, {
        key: 'createField',
        value: function createField(definition) {
            this._calculatedFields = this._calculatedFields || {};
            this._calculatedFields[definition.key] = definition;
        }
    }, {
        key: 'mergeCols',
        value: function mergeCols(definition) {
            var _this7 = this;

            var cubejs = this;
            var remove = [];
            var obj = void 0;
            var parent = void 0;

            // obtém as colunas que serão removidas(colunas raiz) e a chave da coluna que será mesclada(no caso de mesclar filhos)
            definition.references.forEach(function (item) {
                var col = cubejs.findCol(item);

                if (col) {
                    parent = _this7._getHeader(col.parentKey);
                    if (!parent) remove.push(col); // não remove agora pq generateHeaders precisa das colunas para montar o no header
                }
            });
            if (parent) definition.key = parent['key'];
            obj = generateHeaders(cubejs, definition, 'col');
            remove.forEach(function (col) {
                cubejs.removeCol(col);
            });

            if (!obj) {
                return;
            }

            if (parent) {
                //@ts-ignore
                parent.children = obj.root.children;
            } else {
                obj.root._index = cubejs._maps.cols.length;
                cubejs._maps.cols.push(obj.root);
            }

            // calcula os valores
            cubejs.forEach(cubejs._maps.rows, function (row) {
                var k1 = void 0,
                    k2 = void 0,
                    v = void 0;

                obj.leafs.forEach(function (item) {
                    k1 = item.newHeadKey + row.key;
                    k2 = item.headKey + row.key;

                    if (cubejs._maps.keys[k1]) {
                        v = cubejs._maps.keys[k1].value;
                    } else {
                        v = 0;
                    }

                    v += cubejs._maps.keys[k2].value;

                    cubejs._maps.keys[k1] = {
                        value: v,
                        display: cubejs._formatMeasure( /* row.measure ? row.key : item.headKey */row.measure || item.headKey, v)
                    };
                });
            });
        }
    }, {
        key: 'mergeRows',
        value: function mergeRows(definition) {
            var _this8 = this;

            var cubejs = this;
            var obj = void 0,
                parent = void 0;
            var remove = [];

            definition.references.forEach(function (item) {
                var row = cubejs.findRow(item);

                if (row) {
                    parent = _this8._getHeader(row.parentKey);
                    if (!parent) remove.push(row);
                }
            });
            if (parent) definition.key = parent['key'];
            obj = generateHeaders(cubejs, definition, 'row');

            if (!obj) {
                return;
            }

            if (parent) {
                //@ts-ignore
                parent.children = obj.root.children;
            } else {
                remove.forEach(function (row) {
                    cubejs.removeRow(row);
                });
                obj.root._index = cubejs._maps.rows.length;
                cubejs._maps.rows.push(obj.root);
            }

            // calcula os valores
            cubejs.forEach(cubejs._maps.cols, function (col) {
                var k1 = void 0,
                    k2 = void 0,
                    v = void 0;

                obj.leafs.forEach(function (item) {
                    k1 = col.key + item.newHeadKey;
                    k2 = col.key + item.headKey;

                    if (cubejs._maps.keys[k1]) {
                        v = cubejs._maps.keys[k1].value;
                    } else {
                        v = 0;
                    }

                    v += cubejs._maps.keys[k2].value;

                    cubejs._maps.keys[k1] = {
                        value: v,
                        display: cubejs._formatMeasure( /*col.measure ? col.key : item.headKey*/col.measure || item.headKey, v)
                    };
                });
            });
        }
    }, {
        key: 'findRow',
        value: function findRow(key) {
            var r = this._CACHE.findRow[key];

            if (!r) {
                r = this._findCategoryHead(key, 'rows');
                this._CACHE.findRow[key] = r;
            }

            return r;
        }
    }, {
        key: 'findCol',
        value: function findCol(key) {
            var c = this._CACHE.findCol[key];

            if (!c) {
                c = this._findCategoryHead(key, 'cols');
                this._CACHE.findCol[key] = c;
            }

            return c;
        }
    }, {
        key: 'findLastRow',
        value: function findLastRow() {
            var r = this._CACHE.findRow['_findLastRow_'];

            if (!r) {
                r = this._findLeafHead('rows');
                this._CACHE.findRow['_findLastRow_'] = r;
            }

            return r;
        }
    }, {
        key: 'findLastCol',
        value: function findLastCol() {
            var c = this._CACHE.findCol['_findLastCol_'];

            if (!c) {
                c = this._findLeafHead('cols');
                this._CACHE.findCol['_findLastCol_'] = c;
            }

            return c;
        }
    }, {
        key: 'findFirstRow',
        value: function findFirstRow() {
            var r = this._CACHE.findCol['_findFirstRow_'];

            if (!r) {
                r = this._maps.rows[0];
                this._CACHE.findCol['_findFirstRow_'] = r;
            }

            return r;
        }
    }, {
        key: 'findFirstCol',
        value: function findFirstCol() {
            var c = this._CACHE.findCol['_findFirstCol_'];

            if (!c) {
                c = this._maps.cols[0];
                this._CACHE.findCol['_findFirstCol_'] = c;
            }

            return c;
        }
    }, {
        key: 'eachLeaf',
        value: function eachLeaf(item, callback) {
            if (item) {
                doEach(item);
            }

            function doEach(o) {
                if (o.children) {
                    o.children.forEach(function (child) {
                        doEach(child);
                    });
                } else {
                    callback(o);
                }
            }
        }

        // TODO: implements cache

    }, {
        key: 'forEach',
        value: function forEach(arr, callback) {
            var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;


            doForEach(arr, 0);

            function doForEach(arr, activeLevel) {
                var i = void 0,
                    item = void 0;

                for (i = 0; i < arr.length; i++) {
                    item = arr[i];
                    if (level == -1) {
                        if (item.children) {
                            doForEach(item.children, activeLevel);
                        } else {
                            callback(item);
                        }
                    } else {
                        if (activeLevel == level) {
                            callback(item);
                        } else if (item.children) {
                            doForEach(item.children, activeLevel + 1);
                        }
                    }
                }
            }
        }
    }, {
        key: '_doOperation',
        value: function _doOperation(operationDef) {
            var op = operations[operationDef.operation];

            if (op) {
                console.log(op.options.description);
                op.callback.call(this, operationDef);
            }
        }

        /**
         * @param {{position, key, summary?, measureOpt?, keyRef?}} calculatedOptions 
         * @param {Function} callback 
         */

    }, {
        key: '_createCalculatedRow',
        value: function _createCalculatedRow(calculatedOptions, operationDef, callback) {
            var _this9 = this;

            var v = void 0,
                arr = void 0,
                o = void 0,
                parent = void 0;
            var row = calculatedOptions.position == 'last' ? this.findLastRow() : this.findRow(calculatedOptions.keyRef);

            if (row) {
                parent = this._getHeader(row.parentKey) || { key: '' };
                arr = parent.children || this._maps.rows;
                o = {
                    key: calculatedOptions.key,
                    measure: calculatedOptions.key,
                    caculated: true,
                    summary: calculatedOptions.summary,
                    parentKey: parent.key
                };

                this._aux.measures[calculatedOptions.key] = Object.assign({ key: calculatedOptions.key }, DEFAULT_OPERATION_OPTIONS, operationDef);

                // limpa o cache
                this._CACHE.findRow = {};
                this._CACHE.formatMeasure = {};

                // calcula os valores das colunas
                this.forEach(this._maps.cols, function (col) {
                    v = callback(col, row);
                    _this9._maps.keys[col.key + calculatedOptions.key] = {
                        value: v,
                        display: _this9._formatMeasure(calculatedOptions.key, v),
                        summary: calculatedOptions.summary
                    };
                });

                // adiciona a linha na posição definida
                if (calculatedOptions.position == 'after') {
                    arr.splice(row._index + 1, 0, o);
                } else if (calculatedOptions.position == 'before') {
                    arr.splice(row._index, 0, o);
                } else if (calculatedOptions.position == 'last') {
                    arr.push(o);
                }

                // atualiza _index
                arr.forEach(function (item, index) {
                    item._index = index;
                });
            }

            return o;
        }
    }, {
        key: '_createCalculatedCol',
        value: function _createCalculatedCol(calculatedOptions, operationDef, callback) {
            var _this10 = this;

            var v = void 0,
                arr = void 0,
                o = void 0,
                parent = void 0;
            var col = calculatedOptions.position == 'last' ? this.findLastCol() : this.findCol(calculatedOptions.keyRef);

            if (col) {
                parent = this._getHeader(col.parentKey) || { key: '' };
                arr = parent.children || this._maps.cols;
                o = {
                    key: calculatedOptions.key,
                    measure: calculatedOptions.key,
                    caculated: true,
                    summary: calculatedOptions.summary,
                    parentKey: parent.key
                };

                this._aux.measures[calculatedOptions.key] = Object.assign({ key: calculatedOptions.key }, DEFAULT_OPERATION_OPTIONS, operationDef);

                // limpa o cache
                this._CACHE.findCol = {};
                this._CACHE.formatMeasure = {};

                // calcula os valores das linhas
                this.forEach(this._maps.rows, function (row) {
                    v = callback(row, col);
                    _this10._maps.keys[calculatedOptions.key + row.key] = { // key + r.key = chave da coluna + chave da linha, sempre nessa ordem
                        value: v,
                        display: _this10._formatMeasure(calculatedOptions.key, v),
                        summary: calculatedOptions.summary
                    };
                });

                if (calculatedOptions.position == 'after') {
                    arr.splice(col._index + 1, 0, o);
                } else if (calculatedOptions.position == 'before') {
                    arr.splice(col._index, 0, o);
                } else if (calculatedOptions.position == 'last') {
                    arr.push(o);
                }

                // atualiza _index
                arr.forEach(function (item, index) {
                    item._index = index;
                });
            }

            return o;
        }
    }, {
        key: '_createHead',
        value: function _createHead(def, root) {
            var self = this;
            var exists = {};

            this._dataset.forEach(function (row) {
                processDataRow(row, 0, '', root);
            });

            function processDataRow(dataRow, defIndex, parentKey, children) {
                var k = void 0,
                    o = void 0,
                    a = void 0,
                    d = void 0,
                    item = void 0;

                item = def[defIndex];

                if (item && (item.dimension || item.measure)) {

                    if (item.dimension) {
                        d = dataRow[item.dimension];
                        a = [];
                        k = parentKey + d;
                        o = {
                            key: k,
                            dimension: item.dimension,
                            category: d,
                            display: self._formatCategory(item, self._categoryAlias[d] || d),
                            parentKey: null,
                            children: null,
                            _index: null
                        };

                        if (!exists[k]) {
                            self._headers[k] = o;
                            exists[k] = {
                                children: a,
                                item: o
                            };
                            o._index = children.length;
                            children.push(o);
                            o.parentKey = parentKey;
                            processDataRow(dataRow, defIndex + 1, k, a);

                            if (a.length > 0) {
                                o.children = a;
                            }
                        } else {
                            processDataRow(dataRow, defIndex + 1, k, exists[k].children);
                        }
                    } else {
                        k = parentKey + item.measure;
                        o = {
                            key: k,
                            measure: item.measure,
                            display: self._categoryAlias[item.measure] || item.display || item.measure,
                            parentKey: null,
                            _index: null
                        };

                        if (!exists[k]) {
                            self._headers[k] = o;
                            exists[k] = {
                                children: children,
                                item: o
                            };
                            o._index = children.length;
                            children.push(o);
                            o.parentKey = parentKey;
                            processDataRow(dataRow, defIndex + 1, parentKey, children);
                        } else {
                            processDataRow(dataRow, defIndex + 1, parentKey, exists[k].children);
                        }
                    }
                }
            }
        }
    }, {
        key: '_getHeader',
        value: function _getHeader(key) {
            return this._headers[key];
        }

        // cria this._maps.keys

    }, {
        key: '_createKeysMap',
        value: function _createKeysMap() {
            var _this11 = this;

            var i = void 0,
                s = void 0,
                k = void 0,
                item = void 0;
            var aux = this._aux;

            this._dataset.forEach(function (r) {
                s = '';

                for (i = 0; i < aux.all.length; i++) {
                    item = aux.all[i];

                    if (item.dimension) {
                        if (r.hasOwnProperty(item.dimension)) {
                            s += r[item.dimension];
                        }
                    }

                    if (item.measure) {
                        // métrica de coluna ou de linha
                        if (aux.colmap[item.measure] || aux.rowmap[item.measure]) {
                            s += '{measure}';
                        }
                    }
                }

                for (i in aux.measures) {
                    if (r[i] !== undefined) {
                        k = s.replace('{measure}', i).replace('{measure}', '').replace('{measure}', '');
                        _this11._maps.keys[k] = {
                            value: r[i],
                            display: _this11._formatMeasure(i, r[i])
                        };
                    }
                }
            });
        }
    }, {
        key: '_findCategoryHead',
        value: function _findCategoryHead(key, head) {
            var i = void 0;
            var headItem = null;
            var children = arguments[2] || this._maps[head];

            for (i = 0; i < children.length; i++) {
                if (children[i].key == key) {
                    return children[i];
                }

                if (children[i].children) {
                    headItem = this._findCategoryHead(key, head, children[i].children);
                    if (headItem) return headItem;
                }
            }

            return null;
        }
    }, {
        key: '_findLeafHead',
        value: function _findLeafHead(head) {
            var index = this._maps[head].length - 1;
            return this._maps[head][index];
        }
    }, {
        key: '_createAux',
        value: function _createAux() {
            var rowsdef = this._definition.rows;
            var colsdef = this._definition.cols;
            var aux = {
                measures: {},
                dimensions: {},
                colmap: {},
                rowmap: {},
                all: colsdef.concat(rowsdef)
            };

            aux.all.forEach(function (item) {
                if (item.measure) {
                    aux.measures[item.measure] = item;
                } else {
                    aux.dimensions[item.dimension] = item;
                }
            });

            colsdef.forEach(function (item) {
                aux.colmap[item.measure || item.dimension] = item;
            });
            rowsdef.forEach(function (item) {
                aux.rowmap[item.measure || item.dimension] = item;
            });

            this._aux = aux;
        }
    }, {
        key: '_formatMeasure',
        value: function _formatMeasure(measure, value) {
            var formated = void 0,
                def = void 0,
                num = void 0,
                rest = void 0;

            this._CACHE.formatMeasure[measure] = this._CACHE.formatMeasure[measure] || {};
            formated = this._CACHE.formatMeasure[measure][value];

            if (formated == undefined) {
                def = this._aux.measures[measure];
                if (!def) {
                    debugger;
                }
                num = parseInt(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + def.thousand);
                rest = value.toFixed(def.precision).split('.')[1] || '';

                formated = def.prefix + num + (rest ? def.decimal : '') + rest + def.suffix;
                this._CACHE.formatMeasure[measure][value] = formated;
            }

            return formated;
        }
    }, {
        key: '_formatCategory',
        value: function _formatCategory(category, value) {
            value = _dataFormat2.default.Text.format(category, value);
            return value;
        }
    }]);

    return CubeJS;
}();

exports.default = CubeJS;


function _getColRangeValues(cubejs, rowKey, kstart, kend) {
    var parent = void 0;
    var aux = void 0,
        arr = void 0,
        start = void 0,
        end = void 0;
    var range = [];

    start = cubejs.findCol(kstart);
    end = cubejs.findCol(kend);

    if (end._index < start._index) {
        aux = start;
        start = end;
        end = aux;
    }

    parent = cubejs._getHeader(start.parentKey);

    arr = parent ? parent.children : cubejs._maps.cols;
    arr.forEach(function (item, index) {
        if (index <= end._index) {

            cubejs.eachLeaf(item, function (leaf) {
                var k = leaf.key + rowKey;
                var m = cubejs._maps.keys[k];

                if (m && m.summary != 'col') {
                    range.push(m ? m.value : 0);
                }
            });
        }
    });

    return range;
}

function _getRowRangeValues(cubejs, colKey, kstart, kend) {
    var parent = void 0;
    var aux = void 0,
        arr = void 0,
        start = void 0,
        end = void 0;
    var range = [];

    start = cubejs.findRow(kstart);
    end = cubejs.findRow(kend);

    if (end._index < start._index) {
        aux = start;
        start = end;
        end = aux;
    }

    parent = cubejs._getHeader(start.parentKey);

    arr = parent ? parent.children : cubejs._maps.rows;
    arr.forEach(function (item, index) {
        if (index <= end._index) {
            cubejs.eachLeaf(item, function (leaf) {
                var k = colKey + leaf.key;
                var m = cubejs._maps.keys[k];

                if (m && m.summary != 'row') {
                    range.push(m ? m.value : 0);
                }
            });
        }
    });

    return range;
}

function generateHeaders(cubejs, operationDef, finder) {
    var headers = {};
    var leafs = [];
    var root = {
        key: operationDef.key,
        display: operationDef.display
    };
    var headCreated = false;

    operationDef.references.forEach(function (k) {
        var o = finder == 'row' ? cubejs.findRow(k) : cubejs.findCol(k);

        if (o) {
            headCreated = true;
            process(root, o);
        }
    });

    return headCreated ? { root: root, leafs: leafs } : null;

    function process(newHead, activeHead) {
        var key = void 0;

        if (activeHead.children) {
            newHead.children = newHead.children || [];

            activeHead.children.forEach(function (child) {
                key = newHead.key + (child.category || child.measure);

                if (!headers[key]) {
                    headers[key] = {
                        key: key,
                        display: child.display,
                        dimension: child.dimension,
                        measure: child.measure,
                        parentKey: newHead.key,
                        _index: newHead.children.length
                    };
                    newHead.children.push(headers[key]);
                }

                process(headers[key], child);
            });
        } else {
            leafs.push({
                newHeadKey: newHead.key,
                headKey: activeHead.key
            });
        }
    }
}

/***/ }),

/***/ "./src/data-format.js":
/*!****************************!*\
  !*** ./src/data-format.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var TextFormat = {
    format: function format(definition, value) {
        var i = void 0,
            k = void 0;

        for (i in TextFormat.transformers) {
            k = definition[i];
            if (k) {
                return TextFormat.transformers[i](k, value);
            }
        }

        return value;
    },


    transformers: {
        'text.transform': function textTransform(value, data) {
            data = data || '';

            switch (value) {
                case 'uppercase':
                    data = data.toLocaleUpperCase();
                    break;

                case 'lowercase':
                    data = data.toLocaleLowerCase();
                    break;
            }

            return data;
        }
    }
};

var NumberFormat = function NumberFormat(def, data) {
    var num = parseInt(data).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + def.thousand);
    var rest = data.toFixed(def.precision).split('.')[1] || '';

    return num + (rest ? def.decimal : '') + rest;
};

exports.default = {
    Text: TextFormat,
    Number: NumberFormat
};

/***/ }),

/***/ "./src/functions/Functions.js":
/*!************************************!*\
  !*** ./src/functions/Functions.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @ts-check

var Functions = function () {
    function Functions(instance, context) {
        _classCallCheck(this, Functions);

        this.instance = instance;
        this.context = context;
    }

    _createClass(Functions, null, [{
        key: 'create',
        value: function create(name, fn) {
            this.prototype[name] = fn;
        }
    }, {
        key: 'compile',
        value: function compile(exp) {
            var i = void 0,
                r = void 0,
                c = void 0;

            if (!Functions['expressions'][exp]) {
                for (i in this.prototype) {
                    r = new RegExp('\\' + i + '\\s*\\(', 'g');
                    c = 'this.' + i + '(';

                    exp = exp.replace(r, c);
                }

                // ignora aregra no-new-func do eslint
                /* eslint-disable */
                Functions['expressions'][exp] = Function('$INDEX', 'return ' + exp);
                /* eslint-enable */
            }
            return Functions['expressions'][exp];
        }
    }]);

    return Functions;
}();

Functions['expressions'] = {};

var FunctionsCache = function () {
    function FunctionsCache() {
        _classCallCheck(this, FunctionsCache);
    }

    _createClass(FunctionsCache, null, [{
        key: 'get',
        value: function get(instance, f, key) {
            var o = instance[f];

            if (o && o[key] != undefined) {
                console.log('using cache ' + f);
                return o[key];
            }
        }
    }, {
        key: 'set',
        value: function set(instance, f, key, value) {
            var o = instance[f];

            if (!o) {
                o = instance[f] = {};
            }

            o[key] = value;
        }
    }]);

    return FunctionsCache;
}();

exports.default = Functions;
exports.Functions = Functions;
exports.FunctionsCache = FunctionsCache;

/***/ }),

/***/ "./src/functions/IF.js":
/*!*****************************!*\
  !*** ./src/functions/IF.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Functions = __webpack_require__(/*! ./Functions */ "./src/functions/Functions.js");

var _Functions2 = _interopRequireDefault(_Functions);

var _ptBR = __webpack_require__(/*! ./lang/ptBR */ "./src/functions/lang/ptBR.js");

var _ptBR2 = _interopRequireDefault(_ptBR);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Functions2.default.create(_ptBR2.default.IF, function (condition, iftrue, iffalse) {
    return condition ? iftrue : iffalse;
});

/***/ }),

/***/ "./src/functions/RANGE.js":
/*!********************************!*\
  !*** ./src/functions/RANGE.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Functions = __webpack_require__(/*! ./Functions */ "./src/functions/Functions.js");

var _Functions2 = _interopRequireDefault(_Functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Functions2.default.create('RANGE', function (start, end) {
    var context = this.context;
    var cubejs = this.instance;

    return context.activeRow ? cubejs.getColRangeValues(context.activeRow.key, start, end) : cubejs.getRowRangeValues(context.activeCol.key, start, end);
}); // @ts-check

/***/ }),

/***/ "./src/functions/SUM.js":
/*!******************************!*\
  !*** ./src/functions/SUM.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Functions = __webpack_require__(/*! ./Functions */ "./src/functions/Functions.js");

var _Functions2 = _interopRequireDefault(_Functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * case 01: SUM([1,2,3])
 * case 02: SUM('keyStart', 'keyEnd') ou SUM('keyStart') // assume keyEnd=última linha/coluna
 * case 03: SUM() // assume keyStart=primeira linha/coluna e keyEnd=última linha/coluna
 */

_Functions2.default.create('SUM', function (start, end) {
    var context = this.context;
    var cubejs = this.instance;
    var sum = 0;
    var range = void 0;

    if (Array.isArray(start)) {
        // case 01
        range = start;
    } else {
        // case 02 e case 03
        start = start || (context.activeRow ? cubejs.findFirstCol().key : cubejs.findFirstRow().key);
        end = end || (context.activeRow ? cubejs.findLastCol().key : cubejs.findLastRow().key);

        range = context.activeRow ? cubejs.getColRangeValues(context.activeRow.key, start, end) : cubejs.getRowRangeValues(context.activeCol.key, start, end);
    }

    range.forEach(function (v) {
        sum += v;
    });

    return sum;
});

/***/ }),

/***/ "./src/functions/VALUE.js":
/*!********************************!*\
  !*** ./src/functions/VALUE.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Functions = __webpack_require__(/*! ./Functions */ "./src/functions/Functions.js");

/**
 * Retorna um array com os valores das chaves/intervalo
 *  case 01: VALUES('key1', 'key2', 'key3')
 *  case 02: VALUES() // retorna toda a linha/coluna
 */

_Functions.Functions.create('COL_VALUE', function (rowKey, key) {
    var m = void 0;
    var cubejs = this.instance;

    m = cubejs._maps.keys[key + rowKey];
    return m ? m.value : 0;
}); // @ts-check

_Functions.Functions.create('ROW_VALUE', function (colKey, key) {
    var m = void 0;
    var cubejs = this.instance;

    m = cubejs._maps.keys[colKey + key];
    return m ? m.value : 0;
});

_Functions.Functions.create('VALUE', function (key) {
    var context = this.context;
    return context.activeRow ? this.COL_VALUE(context.activeRow.key, key) : this.ROW_VALUE(context.activeCol.key, key);
});

_Functions.Functions.create('VALUEX', function (key, index) {
    var context = this.context;
    var cubejs = this.instance;
    var m = void 0,
        k = void 0;

    if (this._VI == undefined) {
        this._VI = [];
    }

    k = this._VI[index]; // chave da linha referência de "index"

    if (context.activeRow) {
        m = cubejs._maps.keys[key + k];
        this._VI.push(context.activeRow.key);
    } else {
        m = cubejs._maps.keys[k + key];
        this._VI.push(context.activeCol.key);
    }

    return m ? m.value : 0;
});

_Functions.Functions.create('$', function (key) {
    return this.VALUE(key);
});

/***/ }),

/***/ "./src/functions/VALUES.js":
/*!*********************************!*\
  !*** ./src/functions/VALUES.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Functions = __webpack_require__(/*! ./Functions */ "./src/functions/Functions.js");

/**
 * Retorna um array com os valores das chaves/intervalo
 *  case 01: VALUES('key1', 'key2', 'key3')
 *  case 02: VALUES() // retorna toda a linha/coluna
 */

_Functions.Functions.create('COL_VALUES', function (rowKey, args) {
    var item = void 0,
        i = void 0;
    var cubejs = this.instance;
    var range = [];

    for (i = 0; i < args.length; i++) {
        item = cubejs.findCol(args[i]);

        cubejs.eachLeaf(item, function (col) {
            var m = cubejs._maps.keys[col.key + rowKey];
            if (m && m.summary != 'col') {
                range.push(m ? m.value : 0);
            }
        });
    }

    return range;
});

_Functions.Functions.create('ROW_VALUES', function (colKey, args) {
    var item = void 0,
        i = void 0;
    var cubejs = this.instance;
    var range = [];

    for (i = 0; i < args.length; i++) {
        item = cubejs.findRow(args[i]);

        cubejs.eachLeaf(item, function (row) {
            var m = cubejs._maps.keys[colKey + row.key];
            if (m && m.summary != 'row') {
                range.push(m ? m.value : 0);
            }
        });
    }

    return range;
});

_Functions.Functions.create('VALUES', function () {
    var start = void 0,
        end = void 0;
    var cubejs = this.instance;
    var context = this.context;

    if (arguments.length == 0) {
        start = context.activeRow ? cubejs.findFirstCol().key : cubejs.findFirstRow().key;
        end = context.activeRow ? cubejs.findLastCol().key : cubejs.findLastRow().key;

        return context.activeRow ? cubejs.getColRangeValues(context.activeRow.key, start, end) : cubejs.getRowRangeValues(context.activeCol.key, start, end);
    }

    return context.activeRow ? cubejs.getColRangeValues(context.activeRow.key, arguments[0], arguments[1]) : cubejs.getRowRangeValues(context.activeCol.key, arguments[0], arguments[1]);
});

/***/ }),

/***/ "./src/functions/index.js":
/*!********************************!*\
  !*** ./src/functions/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FunctionsCache = exports.Functions = undefined;

__webpack_require__(/*! ./VALUE */ "./src/functions/VALUE.js");

__webpack_require__(/*! ./VALUES */ "./src/functions/VALUES.js");

__webpack_require__(/*! ./RANGE */ "./src/functions/RANGE.js");

__webpack_require__(/*! ./SUM */ "./src/functions/SUM.js");

__webpack_require__(/*! ./IF */ "./src/functions/IF.js");

var _Functions = __webpack_require__(/*! ./Functions */ "./src/functions/Functions.js");

// @ts-check

exports.default = _Functions.Functions;
exports.Functions = _Functions.Functions;
exports.FunctionsCache = _Functions.FunctionsCache;

/***/ }),

/***/ "./src/functions/lang/ptBR.js":
/*!************************************!*\
  !*** ./src/functions/lang/ptBR.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    IF: 'IF',
    RANGE: 'INTERVALO',
    SUM: 'SOMA',
    SUMMARY: 'SUMARIO',
    VALUES: 'VALORES'
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cubejs = __webpack_require__(/*! ./cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

var _elasticsearch = __webpack_require__(/*! ./adapters/elasticsearch */ "./src/adapters/elasticsearch.js");

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _csv = __webpack_require__(/*! ./adapters/csv */ "./src/adapters/csv.js");

var _csv2 = _interopRequireDefault(_csv);

__webpack_require__(/*! ./functions */ "./src/functions/index.js");

__webpack_require__(/*! ./operations */ "./src/operations/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cubejs2.default.registerAdapter('elasticsearch', _elasticsearch2.default);
_cubejs2.default.registerAdapter('csv', _csv2.default);

exports.default = _cubejs2.default;

/***/ }),

/***/ "./src/operations/ADD_COL.js":
/*!***********************************!*\
  !*** ./src/operations/ADD_COL.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

var _Functions = __webpack_require__(/*! ../functions/Functions */ "./src/functions/Functions.js");

var _Functions2 = _interopRequireDefault(_Functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

_cubejs2.default.createOperation({
    name: 'ADD_COL',
    description: 'Added Column'
}, function (operationDef) {
    var o = void 0,
        f = void 0;
    var $INDEX = 0;
    var context = {};
    var functions = new _Functions2.default(this, context);
    var calculatedOptions = {
        key: operationDef.key,
        position: operationDef.position,
        keyRef: operationDef.reference,
        summary: operationDef.summary ? 'col' : null

        // calcula os valores da coluna, linha a linha
    };o = this._createCalculatedCol(calculatedOptions, operationDef, function (row, col) {

        f = _Functions2.default.compile(operationDef.expression);

        // linha atual da nova coluna
        context.activeRow = row;
        return f.apply(functions, [$INDEX++] /*[this._maps.keys, col, row, this]*/);
    });

    if (o) {
        if (operationDef.display) o.display = operationDef.display;

        if (operationDef.options) {
            Object.assign(o, operationDef.options);
        }
    }
});

/***/ }),

/***/ "./src/operations/ADD_ROW.js":
/*!***********************************!*\
  !*** ./src/operations/ADD_ROW.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

var _Functions = __webpack_require__(/*! ../functions/Functions */ "./src/functions/Functions.js");

var _Functions2 = _interopRequireDefault(_Functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

_cubejs2.default.createOperation({
    name: 'ADD_ROW',
    description: 'Added Row'
}, function (operationDef) {
    var o = void 0,
        f = void 0;
    var $INDEX = 0;
    var context = {};
    var functions = new _Functions2.default(this, context);
    var calculatedOptions = {
        key: operationDef.key,
        position: operationDef.position,
        keyRef: operationDef.reference,
        summary: operationDef.summary ? 'row' : null

        // define o contexto das funções
    };o = this._createCalculatedRow(calculatedOptions, operationDef, function (col, row) {
        // define a coluna atual do contexto das funções
        f = _Functions2.default.compile(operationDef.expression);

        // faz a chamada da função
        context.activeCol = col;
        return f.apply(functions, [$INDEX++] /*[this._maps.keys, col, row, this]*/);
    });

    if (o) {
        if (operationDef.display) o.display = operationDef.display;

        if (operationDef.options) {
            Object.assign(o, operationDef.options);
        }
    }
});

/***/ }),

/***/ "./src/operations/ALIAS.js":
/*!*********************************!*\
  !*** ./src/operations/ALIAS.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cubejs2.default.createOperation({
    name: 'ALIAS',
    description: 'Apply Alias',
    add: function add(def) {
        this.setAlias(def.values);
    }
}, function () {}); // @ts-check

/***/ }),

/***/ "./src/operations/MERGE_COLS.js":
/*!**************************************!*\
  !*** ./src/operations/MERGE_COLS.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cubejs2.default.createOperation({
    name: 'MERGE_COLS',
    description: 'Merged Cols'
}, function (operationDef) {
    this.mergeCols(operationDef);
}); // @ts-check

/***/ }),

/***/ "./src/operations/MERGE_ROWS.js":
/*!**************************************!*\
  !*** ./src/operations/MERGE_ROWS.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cubejs2.default.createOperation({
    name: 'MERGE_ROWS',
    description: 'Merged Rows'
}, function (operationDef) {
    this.mergeRows(operationDef);
}); // @ts-check

/***/ }),

/***/ "./src/operations/REMOVE_ROW.js":
/*!**************************************!*\
  !*** ./src/operations/REMOVE_ROW.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cubejs2.default.createOperation({
    name: 'REMOVE_ROW',
    description: 'Removed Row'
}, function (operationDef) {
    var arr = void 0;
    var row = this.findRow(operationDef.reference);

    if (row) {
        arr = row.parent ? row.parent : this.getMaps().rows;
        arr.splice(row._index, 1);

        // atualiza _index
        arr.forEach(function (item, index) {
            item._index = index;
        });
    }
}); // @ts-check

/***/ }),

/***/ "./src/operations/SORT.js":
/*!********************************!*\
  !*** ./src/operations/SORT.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cubejs = __webpack_require__(/*! ../cubejs */ "./src/cubejs.js");

var _cubejs2 = _interopRequireDefault(_cubejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cubejs2.default.createOperation({
    name: 'SORT_COLS',
    description: 'Sorted Cols'
}, function (operationDef) {
    doSort(operationDef.dimension, this._maps.cols, operationDef.order);
}); // @ts-check

_cubejs2.default.createOperation({
    name: 'SORT_ROWS',
    description: 'Sorted Rows'
}, function (operationDef) {
    doSort(operationDef.dimension, this._maps.rows, operationDef.order);
});

function doSort(dimension, arr, order) {
    var i = void 0;

    arr._sorted = false;

    if (dimension) {
        for (i = 0; i < arr.length; i++) {
            findDimension(arr, arr[i], dimension, order);
            if (arr._sorted) return;
        }
    } else {
        applySort(arr, true, order);
    }
}

function findDimension(arr, item, dimension, order) {
    var i = void 0;

    arr._sorted = false;

    if (item.dimension == dimension) {
        return applySort(arr, null, order);
    }

    if (item.children) {
        for (i = 0; i < item.children.length; i++) {
            findDimension(item.children, item.children[i], dimension, order);
            if (item.children._sorted) return;
        }
    }
}

function applySort(arr) {
    var includeChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var order = arguments[2];

    if (arr._sorted) return;

    if (includeChildren) {
        arr.forEach(function (item) {
            if (item.dimension && item.children) {
                applySort(item.children, includeChildren, order);
            }
        });
    }

    if (order == 'asc') {
        arr.sort(function (o1, o2) {
            return o1.summary || o2.summary ? 0 : o1.display < o2.display ? -1 : o1.display > o2.display ? 1 : 0;
        });
    } else if (order == 'desc') {
        arr.sort(function (o1, o2) {
            return o1.summary || o2.summary ? 0 : o1.display > o2.display ? -1 : o1.display < o2.display ? 1 : 0;
        });
    }

    // atualiza _index
    arr.forEach(function (item, index) {
        item._index = index;
    });

    arr._sorted = true;
}

/***/ }),

/***/ "./src/operations/index.js":
/*!*********************************!*\
  !*** ./src/operations/index.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./ADD_COL */ "./src/operations/ADD_COL.js");

__webpack_require__(/*! ./ADD_ROW */ "./src/operations/ADD_ROW.js");

__webpack_require__(/*! ./REMOVE_ROW */ "./src/operations/REMOVE_ROW.js");

__webpack_require__(/*! ./SORT */ "./src/operations/SORT.js");

__webpack_require__(/*! ./MERGE_ROWS */ "./src/operations/MERGE_ROWS.js");

__webpack_require__(/*! ./MERGE_COLS */ "./src/operations/MERGE_COLS.js");

__webpack_require__(/*! ./ALIAS */ "./src/operations/ALIAS.js");

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cubejs, element, id) {
    var r = void 0,
        i = void 0,
        d = void 0,
        html = void 0,
        el = void 0;
    var rc = '';
    var cc = '';

    if (views) {
        views[id] = cubejs;
    }

    // rows categories
    for (i = 0; i < cubejs._maps.rows.length; i++) {
        r = cubejs._maps.rows[i];
        rc += createRowCategory(r);
    }

    // cols categories
    cc = '<div class="cubejs-hbox">';
    for (i = 0; i < cubejs._maps.cols.length; i++) {
        r = cubejs._maps.cols[i];
        cc += createColCategory(r);
    }
    cc += '</div>';

    // values
    d = '<div class="cubejs-hbox">' + createDataValue() + '</div>';

    html = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%; height:100%">\n        <tr>\n            <td class="cubejs-table-corner"></td>\n            <td>' + cc + '</td>\n        </tr>\n        <tr>\n            <td class="cubejs-table-categories">' + rc + '</td>\n            <td class="cubejs-table-values" style="width:100%; height:100%;">' + d + '</td>\n        </tr>\n    </table>';

    el = typeof element == 'string' ? document.getElementById(element) : element;
    if (el) el.innerHTML = html;

    function createRowCategory(r) {
        var div = void 0,
            i = void 0,
            cls = void 0,
            t = void 0,
            plus = void 0;
        var oneChild = r.children && r.children.length == 1;
        var oneMeasureChild = oneChild && r.children[0].measure;

        cls = (r.children ? oneChild ? '' : ' cubejs-category-row-parent' : ' cubejs-category-flex') + (r.measure ? ' cubejs-is-measure' : '') + (r.caculated ? ' cubejs-calculated-category' : '');

        t = r.display || r.categoty || r.measure;
        plus = r.measure ? '' : '';
        div = '<div class="cubejs-hbox">';
        div += '<div class="cubejs-cell cubejs-category-cell cubejs-category-row' + cls + '">' + plus + '<div title="' + t + '" class="cell-content">' + t + '</div></div>';
        if (r.children) {
            div += '<div class="cubejs-vbox">';
            if (!oneMeasureChild) {
                for (i = 0; i < r.children.length; i++) {
                    div += createRowCategory(r.children[i]);
                }
            }
            div += '</div>';
        }
        div += '</div>';

        return div;
    }

    function createColCategory(r) {
        var div = void 0,
            i = void 0,
            cls = void 0,
            t = void 0,
            plus = void 0;
        var oneChild = r.children && r.children.length == 1;
        var oneMeasureChild = oneChild && r.children[0].measure;
        var key = r.key;

        cls = (r.children ? oneChild ? '' : ' cubejs-category-col-parent' : ' cubejs-category-flex') + (r.measure ? ' cubejs-is-measure' : '') + (r.caculated ? ' cubejs-calculated-category' : '');

        t = r.display || r.categoty || r.measure;
        plus = r.measure ? '' : r.children ? '' : ''; // `<div class="plus" onclick="cubejsCollapse('${id}','${key}', 'col')"></div>`
        div = '<div class="vbox">';
        div += '<div class="cubejs-cell cubejs-category-cell cubejs-category-col' + cls + '" key="' + key + '">' + plus + '<div title="' + t + '" class="cell-content">' + t + '</div></div>';

        if (r.children) {
            div += '<div class="cubejs-hbox">';
            if (!oneMeasureChild) {
                for (i = 0; i < r.children.length; i++) {
                    div += createColCategory(r.children[i]);
                }
            }
            div += '</div>';
        }
        div += '</div>';

        return div;
    }

    function createDataValue() {
        var s = void 0,
            v = void 0,
            o = void 0;
        var ss = '';

        cubejs.forEach(cubejs._maps.cols, function (c) {
            s = '<div class="cubejs-vbox">';
            cubejs.forEach(cubejs._maps.rows, function (r) {
                o = cubejs._maps.keys[c.key + r.key];
                v = o ? o.display : undefined;
                s += '<div class="cubejs-cell cubejs-data-cell' + (r.caculated || c.caculated ? ' cubejs-calculated-data' : '') + '"><div class="cell-content">' + (v == undefined ? '&nbsp;' : v) + '</div></div>';
            });
            s += '</div>';
            ss += s;
        });

        return ss;
    }

    return html;
};

// @ts-check

// import './cubejs.css'

var views = {};

window['cubejsCollapse'] = function (cubeId, key, head) {
    var o = void 0;
    var a = [];
    var cubejs = views[cubeId];

    if (cubejs) {
        if (head == 'row') {} else {
            o = cubejs.findCol(key);
            o.children.forEach(function (child) {
                a.push(child.key);
            });
            cubejs.mergeCols({
                key: 'xxx'

            });
        }

        console.log(o);
    }
};

/***/ }),

/***/ "./test/data1.csv":
/*!************************!*\
  !*** ./test/data1.csv ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "Segment;Country;Product;Discount Band;Units Sold;Manufacturing Price;Sale Price;Gross Sales;Discounts; Sales;COGS;Profit;Date;Month Number;Month Name;Year\nGovernment;Canada;Carretera;None;1618,5;3;20;32370;0;32370;16185;16185;01/01/2014;1;January;2014\nGovernment;Germany;Carretera;None;1321;3;20;26420;0;26420;13210;13210;01/01/2014;1;January;2014\nMidmarket;France;Carretera;None;2178;3;15;32670;0;32670;21780;10890;01/06/2014;6;June;2014\nMidmarket;Germany;Carretera;None;888;3;15;13320;0;13320;8880;4440;01/06/2014;6;June;2014\nMidmarket;Mexico;Carretera;None;2470;3;15;37050;0;37050;24700;12350;01/06/2014;6;June;2014\nGovernment;Germany;Carretera;None;1513;3;350;529550;0;529550;393380;136170;01/12/2014;12;December;2014\nMidmarket;Germany;Montana;None;921;5;15;13815;0;13815;9210;4605;01/03/2014;3;March;2014\nChannel Partners;Canada;Montana;None;2518;5;12;30216;0;30216;7554;22662;01/06/2014;6;June;2014\nGovernment;France;Montana;None;1899;5;20;37980;0;37980;18990;18990;01/06/2014;6;June;2014\nChannel Partners;Germany;Montana;None;1545;5;12;18540;0;18540;4635;13905;01/06/2014;6;June;2014\nMidmarket;Mexico;Montana;None;2470;5;15;37050;0;37050;24700;12350;01/06/2014;6;June;2014\nEnterprise;Canada;Montana;None;2665,5;5;125;333187,5;0;333187,5;319860;13327,5;01/07/2014;7;July;2014\nSmall Business;Mexico;Montana;None;958;5;300;287400;0;287400;239500;47900;01/08/2014;8;August;2014\nGovernment;Germany;Montana;None;2146;5;7;15022;0;15022;10730;4292;01/09/2014;9;September;2014\nEnterprise;Canada;Montana;None;345;5;125;43125;0;43125;41400;1725;01/10/2013;10;October;2013\nMidmarket;United States of America;Montana;None;615;5;15;9225;0;9225;6150;3075;01/12/2014;12;December;2014\nGovernment;Canada;Paseo;None;292;10;20;5840;0;5840;2920;2920;01/02/2014;2;February;2014\nMidmarket;Mexico;Paseo;None;974;10;15;14610;0;14610;9740;4870;01/02/2014;2;February;2014\nChannel Partners;Canada;Paseo;None;2518;10;12;30216;0;30216;7554;22662;01/06/2014;6;June;2014\nGovernment;Germany;Paseo;None;1006;10;350;352100;0;352100;261560;90540;01/06/2014;6;June;2014\nChannel Partners;Germany;Paseo;None;367;10;12;4404;0;4404;1101;3303;01/07/2014;7;July;2014\nGovernment;Mexico;Paseo;None;883;10;7;6181;0;6181;4415;1766;01/08/2014;8;August;2014\nMidmarket;France;Paseo;None;549;10;15;8235;0;8235;5490;2745;01/09/2013;9;September;2013\nSmall Business;Mexico;Paseo;None;788;10;300;236400;0;236400;197000;39400;01/09/2013;9;September;2013\nMidmarket;Mexico;Paseo;None;2472;10;15;37080;0;37080;24720;12360;01/09/2014;9;September;2014\nGovernment;United States of America;Paseo;None;1143;10;7;8001;0;8001;5715;2286;01/10/2014;10;October;2014\nGovernment;Canada;Paseo;None;1725;10;350;603750;0;603750;448500;155250;01/11/2013;11;November;2013\nChannel Partners;United States of America;Paseo;None;912;10;12;10944;0;10944;2736;8208;01/11/2013;11;November;2013\nMidmarket;Canada;Paseo;None;2152;10;15;32280;0;32280;21520;10760;01/12/2013;12;December;2013\nGovernment;Canada;Paseo;None;1817;10;20;36340;0;36340;18170;18170;01/12/2014;12;December;2014\nGovernment;Germany;Paseo;None;1513;10;350;529550;0;529550;393380;136170;01/12/2014;12;December;2014\nGovernment;Mexico;Velo;None;1493;120;7;10451;0;10451;7465;2986;01/01/2014;1;January;2014\nEnterprise;France;Velo;None;1804;120;125;225500;0;225500;216480;9020;01/02/2014;2;February;2014\nChannel Partners;Germany;Velo;None;2161;120;12;25932;0;25932;6483;19449;01/03/2014;3;March;2014\nGovernment;Germany;Velo;None;1006;120;350;352100;0;352100;261560;90540;01/06/2014;6;June;2014\nChannel Partners;Germany;Velo;None;1545;120;12;18540;0;18540;4635;13905;01/06/2014;6;June;2014\nEnterprise;United States of America;Velo;None;2821;120;125;352625;0;352625;338520;14105;01/08/2014;8;August;2014\nEnterprise;Canada;Velo;None;345;120;125;43125;0;43125;41400;1725;01/10/2013;10;October;2013\nSmall Business;Canada;VTT;None;2001;250;300;600300;0;600300;500250;100050;01/02/2014;2;February;2014\nChannel Partners;Germany;VTT;None;2838;250;12;34056;0;34056;8514;25542;01/04/2014;4;April;2014\nMidmarket;France;VTT;None;2178;250;15;32670;0;32670;21780;10890;01/06/2014;6;June;2014\nMidmarket;Germany;VTT;None;888;250;15;13320;0;13320;8880;4440;01/06/2014;6;June;2014\nGovernment;France;VTT;None;1527;250;350;534450;0;534450;397020;137430;01/09/2013;9;September;2013\nSmall Business;France;VTT;None;2151;250;300;645300;0;645300;537750;107550;01/09/2014;9;September;2014\nGovernment;Canada;VTT;None;1817;250;20;36340;0;36340;18170;18170;01/12/2014;12;December;2014\nGovernment;France;Amarilla;None;2750;260;350;962500;0;962500;715000;247500;01/02/2014;2;February;2014\nChannel Partners;United States of America;Amarilla;None;1953;260;12;23436;0;23436;5859;17577;01/04/2014;4;April;2014\nEnterprise;Germany;Amarilla;None;4219,5;260;125;527437,5;0;527437,5;506340;21097,5;01/04/2014;4;April;2014\nGovernment;France;Amarilla;None;1899;260;20;37980;0;37980;18990;18990;01/06/2014;6;June;2014\nGovernment;Germany;Amarilla;None;1686;260;7;11802;0;11802;8430;3372;01/07/2014;7;July;2014\nChannel Partners;United States of America;Amarilla;None;2141;260;12;25692;0;25692;6423;19269;01/08/2014;8;August;2014\nGovernment;United States of America;Amarilla;None;1143;260;7;8001;0;8001;5715;2286;01/10/2014;10;October;2014\nMidmarket;United States of America;Amarilla;None;615;260;15;9225;0;9225;6150;3075;01/12/2014;12;December;2014\nGovernment;France;Paseo;Low;3945;10;7;27615;276,15;27338,85;19725;7613,85;01/01/2014;1;January;2014\nMidmarket;France;Paseo;Low;2296;10;15;34440;344,4;34095,6;22960;11135,6;01/02/2014;2;February;2014\nGovernment;France;Paseo;Low;1030;10;7;7210;72,1;7137,9;5150;1987,9;01/05/2014;5;May;2014\nGovernment;France;Velo;Low;639;120;7;4473;44,73;4428,27;3195;1233,27;01/11/2014;11;November;2014\nGovernment;Canada;VTT;Low;1326;250;7;9282;92,82;9189,18;6630;2559,18;01/03/2014;3;March;2014\nChannel Partners;United States of America;Carretera;Low;1858;3;12;22296;222,96;22073,04;5574;16499,04;01/02/2014;2;February;2014\nGovernment;Mexico;Carretera;Low;1210;3;350;423500;4235;419265;314600;104665;01/03/2014;3;March;2014\nGovernment;United States of America;Carretera;Low;2529;3;7;17703;177,03;17525,97;12645;4880,97;01/07/2014;7;July;2014\nChannel Partners;Canada;Carretera;Low;1445;3;12;17340;173,4;17166,6;4335;12831,6;01/09/2014;9;September;2014\nEnterprise;United States of America;Carretera;Low;330;3;125;41250;412,5;40837,5;39600;1237,5;01/09/2013;9;September;2013\nChannel Partners;France;Carretera;Low;2671;3;12;32052;320,52;31731,48;8013;23718,48;01/09/2014;9;September;2014\nChannel Partners;Germany;Carretera;Low;766;3;12;9192;91,92;9100,08;2298;6802,08;01/10/2013;10;October;2013\nSmall Business;Mexico;Carretera;Low;494;3;300;148200;1482;146718;123500;23218;01/10/2013;10;October;2013\nGovernment;Mexico;Carretera;Low;1397;3;350;488950;4889,5;484060,5;363220;120840,5;01/10/2014;10;October;2014\nGovernment;France;Carretera;Low;2155;3;350;754250;7542,5;746707,5;560300;186407,5;01/12/2014;12;December;2014\nMidmarket;Mexico;Montana;Low;2214;5;15;33210;332,1;32877,9;22140;10737,9;01/03/2014;3;March;2014\nSmall Business;United States of America;Montana;Low;2301;5;300;690300;6903;683397;575250;108147;01/04/2014;4;April;2014\nGovernment;France;Montana;Low;1375,5;5;20;27510;275,1;27234,9;13755;13479,9;01/07/2014;7;July;2014\nGovernment;Canada;Montana;Low;1830;5;7;12810;128,1;12681,9;9150;3531,9;01/08/2014;8;August;2014\nSmall Business;United States of America;Montana;Low;2498;5;300;749400;7494;741906;624500;117406;01/09/2013;9;September;2013\nEnterprise;United States of America;Montana;Low;663;5;125;82875;828,75;82046,25;79560;2486,25;01/10/2013;10;October;2013\nMidmarket;United States of America;Paseo;Low;1514;10;15;22710;227,1;22482,9;15140;7342,9;01/02/2014;2;February;2014\nGovernment;United States of America;Paseo;Low;4492,5;10;7;31447,5;314,475;31133,025;22462,5;8670,525;01/04/2014;4;April;2014\nEnterprise;United States of America;Paseo;Low;727;10;125;90875;908,75;89966,25;87240;2726,25;01/06/2014;6;June;2014\nEnterprise;France;Paseo;Low;787;10;125;98375;983,75;97391,25;94440;2951,25;01/06/2014;6;June;2014\nEnterprise;Mexico;Paseo;Low;1823;10;125;227875;2278,75;225596,25;218760;6836,25;01/07/2014;7;July;2014\nMidmarket;Germany;Paseo;Low;747;10;15;11205;112,05;11092,95;7470;3622,95;01/09/2014;9;September;2014\nChannel Partners;Germany;Paseo;Low;766;10;12;9192;91,92;9100,08;2298;6802,08;01/10/2013;10;October;2013\nSmall Business;United States of America;Paseo;Low;2905;10;300;871500;8715;862785;726250;136535;01/11/2014;11;November;2014\nGovernment;France;Paseo;Low;2155;10;350;754250;7542,5;746707,5;560300;186407,5;01/12/2014;12;December;2014\nGovernment;France;Velo;Low;3864;120;20;77280;772,8;76507,2;38640;37867,2;01/04/2014;4;April;2014\nGovernment;Mexico;Velo;Low;362;120;7;2534;25,34;2508,66;1810;698,66;01/05/2014;5;May;2014\nEnterprise;Canada;Velo;Low;923;120;125;115375;1153,75;114221,25;110760;3461,25;01/08/2014;8;August;2014\nEnterprise;United States of America;Velo;Low;663;120;125;82875;828,75;82046,25;79560;2486,25;01/10/2013;10;October;2013\nGovernment;Canada;Velo;Low;2092;120;7;14644;146,44;14497,56;10460;4037,56;01/11/2013;11;November;2013\nGovernment;Germany;VTT;Low;263;250;7;1841;18,41;1822,59;1315;507,59;01/03/2014;3;March;2014\nGovernment;Canada;VTT;Low;943,5;250;350;330225;3302,25;326922,75;245310;81612,75;01/04/2014;4;April;2014\nEnterprise;United States of America;VTT;Low;727;250;125;90875;908,75;89966,25;87240;2726,25;01/06/2014;6;June;2014\nEnterprise;France;VTT;Low;787;250;125;98375;983,75;97391,25;94440;2951,25;01/06/2014;6;June;2014\nSmall Business;Germany;VTT;Low;986;250;300;295800;2958;292842;246500;46342;01/09/2014;9;September;2014\nSmall Business;Mexico;VTT;Low;494;250;300;148200;1482;146718;123500;23218;01/10/2013;10;October;2013\nGovernment;Mexico;VTT;Low;1397;250;350;488950;4889,5;484060,5;363220;120840,5;01/10/2014;10;October;2014\nEnterprise;France;VTT;Low;1744;250;125;218000;2180;215820;209280;6540;01/11/2014;11;November;2014\nChannel Partners;United States of America;Amarilla;Low;1989;260;12;23868;238,68;23629,32;5967;17662,32;01/09/2013;9;September;2013\nMidmarket;France;Amarilla;Low;321;260;15;4815;48,15;4766,85;3210;1556,85;01/11/2013;11;November;2013\nEnterprise;Canada;Carretera;Low;742,5;3;125;92812,5;1856,25;90956,25;89100;1856,25;01/04/2014;4;April;2014\nChannel Partners;Canada;Carretera;Low;1295;3;12;15540;310,8;15229,2;3885;11344,2;01/10/2014;10;October;2014\nSmall Business;Germany;Carretera;Low;214;3;300;64200;1284;62916;53500;9416;01/10/2013;10;October;2013\nGovernment;France;Carretera;Low;2145;3;7;15015;300,3;14714,7;10725;3989,7;01/11/2013;11;November;2013\nGovernment;Canada;Carretera;Low;2852;3;350;998200;19964;978236;741520;236716;01/12/2014;12;December;2014\nChannel Partners;United States of America;Montana;Low;1142;5;12;13704;274,08;13429,92;3426;10003,92;01/06/2014;6;June;2014\nGovernment;United States of America;Montana;Low;1566;5;20;31320;626,4;30693,6;15660;15033,6;01/10/2014;10;October;2014\nChannel Partners;Mexico;Montana;Low;690;5;12;8280;165,6;8114,4;2070;6044,4;01/11/2014;11;November;2014\nEnterprise;Mexico;Montana;Low;1660;5;125;207500;4150;203350;199200;4150;01/11/2013;11;November;2013\nMidmarket;Canada;Paseo;Low;2363;10;15;35445;708,9;34736,1;23630;11106,1;01/02/2014;2;February;2014\nSmall Business;France;Paseo;Low;918;10;300;275400;5508;269892;229500;40392;01/05/2014;5;May;2014\nSmall Business;Germany;Paseo;Low;1728;10;300;518400;10368;508032;432000;76032;01/05/2014;5;May;2014\nChannel Partners;United States of America;Paseo;Low;1142;10;12;13704;274,08;13429,92;3426;10003,92;01/06/2014;6;June;2014\nEnterprise;Mexico;Paseo;Low;662;10;125;82750;1655;81095;79440;1655;01/06/2014;6;June;2014\nChannel Partners;Canada;Paseo;Low;1295;10;12;15540;310,8;15229,2;3885;11344,2;01/10/2014;10;October;2014\nEnterprise;Germany;Paseo;Low;809;10;125;101125;2022,5;99102,5;97080;2022,5;01/10/2013;10;October;2013\nEnterprise;Mexico;Paseo;Low;2145;10;125;268125;5362,5;262762,5;257400;5362,5;01/10/2013;10;October;2013\nChannel Partners;France;Paseo;Low;1785;10;12;21420;428,4;20991,6;5355;15636,6;01/11/2013;11;November;2013\nSmall Business;Canada;Paseo;Low;1916;10;300;574800;11496;563304;479000;84304;01/12/2014;12;December;2014\nGovernment;Canada;Paseo;Low;2852;10;350;998200;19964;978236;741520;236716;01/12/2014;12;December;2014\nEnterprise;Canada;Paseo;Low;2729;10;125;341125;6822,5;334302,5;327480;6822,5;01/12/2014;12;December;2014\nMidmarket;United States of America;Paseo;Low;1925;10;15;28875;577,5;28297,5;19250;9047,5;01/12/2013;12;December;2013\nGovernment;United States of America;Paseo;Low;2013;10;7;14091;281,82;13809,18;10065;3744,18;01/12/2013;12;December;2013\nChannel Partners;France;Paseo;Low;1055;10;12;12660;253,2;12406,8;3165;9241,8;01/12/2014;12;December;2014\nChannel Partners;Mexico;Paseo;Low;1084;10;12;13008;260,16;12747,84;3252;9495,84;01/12/2014;12;December;2014\nGovernment;United States of America;Velo;Low;1566;120;20;31320;626,4;30693,6;15660;15033,6;01/10/2014;10;October;2014\nGovernment;Germany;Velo;Low;2966;120;350;1038100;20762;1017338;771160;246178;01/10/2013;10;October;2013\nGovernment;Germany;Velo;Low;2877;120;350;1006950;20139;986811;748020;238791;01/10/2014;10;October;2014\nEnterprise;Germany;Velo;Low;809;120;125;101125;2022,5;99102,5;97080;2022,5;01/10/2013;10;October;2013\nEnterprise;Mexico;Velo;Low;2145;120;125;268125;5362,5;262762,5;257400;5362,5;01/10/2013;10;October;2013\nChannel Partners;France;Velo;Low;1055;120;12;12660;253,2;12406,8;3165;9241,8;01/12/2014;12;December;2014\nGovernment;Mexico;Velo;Low;544;120;20;10880;217,6;10662,4;5440;5222,4;01/12/2013;12;December;2013\nChannel Partners;Mexico;Velo;Low;1084;120;12;13008;260,16;12747,84;3252;9495,84;01/12/2014;12;December;2014\nEnterprise;Mexico;VTT;Low;662;250;125;82750;1655;81095;79440;1655;01/06/2014;6;June;2014\nSmall Business;Germany;VTT;Low;214;250;300;64200;1284;62916;53500;9416;01/10/2013;10;October;2013\nGovernment;Germany;VTT;Low;2877;250;350;1006950;20139;986811;748020;238791;01/10/2014;10;October;2014\nEnterprise;Canada;VTT;Low;2729;250;125;341125;6822,5;334302,5;327480;6822,5;01/12/2014;12;December;2014\nGovernment;United States of America;VTT;Low;266;250;350;93100;1862;91238;69160;22078;01/12/2013;12;December;2013\nGovernment;Mexico;VTT;Low;1940;250;350;679000;13580;665420;504400;161020;01/12/2013;12;December;2013\nSmall Business;Germany;Amarilla;Low;259;260;300;77700;1554;76146;64750;11396;01/03/2014;3;March;2014\nSmall Business;Mexico;Amarilla;Low;1101;260;300;330300;6606;323694;275250;48444;01/03/2014;3;March;2014\nEnterprise;Germany;Amarilla;Low;2276;260;125;284500;5690;278810;273120;5690;01/05/2014;5;May;2014\nGovernment;Germany;Amarilla;Low;2966;260;350;1038100;20762;1017338;771160;246178;01/10/2013;10;October;2013\nGovernment;United States of America;Amarilla;Low;1236;260;20;24720;494,4;24225,6;12360;11865,6;01/11/2014;11;November;2014\nGovernment;France;Amarilla;Low;941;260;20;18820;376,4;18443,6;9410;9033,6;01/11/2014;11;November;2014\nSmall Business;Canada;Amarilla;Low;1916;260;300;574800;11496;563304;479000;84304;01/12/2014;12;December;2014\nEnterprise;France;Carretera;Low;4243,5;3;125;530437,5;15913,125;514524,375;509220;5304,375;01/04/2014;4;April;2014\nGovernment;Germany;Carretera;Low;2580;3;20;51600;1548;50052;25800;24252;01/04/2014;4;April;2014\nSmall Business;Germany;Carretera;Low;689;3;300;206700;6201;200499;172250;28249;01/06/2014;6;June;2014\nChannel Partners;United States of America;Carretera;Low;1947;3;12;23364;700,92;22663,08;5841;16822,08;01/09/2014;9;September;2014\nChannel Partners;Canada;Carretera;Low;908;3;12;10896;326,88;10569,12;2724;7845,12;01/12/2013;12;December;2013\nGovernment;Germany;Montana;Low;1958;5;7;13706;411,18;13294,82;9790;3504,82;01/02/2014;2;February;2014\nChannel Partners;France;Montana;Low;1901;5;12;22812;684,36;22127,64;5703;16424,64;01/06/2014;6;June;2014\nGovernment;France;Montana;Low;544;5;7;3808;114,24;3693,76;2720;973,76;01/09/2014;9;September;2014\nGovernment;Germany;Montana;Low;1797;5;350;628950;18868,5;610081,5;467220;142861,5;01/09/2013;9;September;2013\nEnterprise;France;Montana;Low;1287;5;125;160875;4826,25;156048,75;154440;1608,75;01/12/2014;12;December;2014\nEnterprise;Germany;Montana;Low;1706;5;125;213250;6397,5;206852,5;204720;2132,5;01/12/2014;12;December;2014\nSmall Business;France;Paseo;Low;2434,5;10;300;730350;21910,5;708439,5;608625;99814,5;01/01/2014;1;January;2014\nEnterprise;Canada;Paseo;Low;1774;10;125;221750;6652,5;215097,5;212880;2217,5;01/03/2014;3;March;2014\nChannel Partners;France;Paseo;Low;1901;10;12;22812;684,36;22127,64;5703;16424,64;01/06/2014;6;June;2014\nSmall Business;Germany;Paseo;Low;689;10;300;206700;6201;200499;172250;28249;01/06/2014;6;June;2014\nEnterprise;Germany;Paseo;Low;1570;10;125;196250;5887,5;190362,5;188400;1962,5;01/06/2014;6;June;2014\nChannel Partners;United States of America;Paseo;Low;1369,5;10;12;16434;493,02;15940,98;4108,5;11832,48;01/07/2014;7;July;2014\nEnterprise;Canada;Paseo;Low;2009;10;125;251125;7533,75;243591,25;241080;2511,25;01/10/2014;10;October;2014\nMidmarket;Germany;Paseo;Low;1945;10;15;29175;875,25;28299,75;19450;8849,75;01/10/2013;10;October;2013\nEnterprise;France;Paseo;Low;1287;10;125;160875;4826,25;156048,75;154440;1608,75;01/12/2014;12;December;2014\nEnterprise;Germany;Paseo;Low;1706;10;125;213250;6397,5;206852,5;204720;2132,5;01/12/2014;12;December;2014\nEnterprise;Canada;Velo;Low;2009;120;125;251125;7533,75;243591,25;241080;2511,25;01/10/2014;10;October;2014\nSmall Business;United States of America;VTT;Low;2844;250;300;853200;25596;827604;711000;116604;01/02/2014;2;February;2014\nChannel Partners;Mexico;VTT;Low;1916;250;12;22992;689,76;22302,24;5748;16554,24;01/04/2014;4;April;2014\nEnterprise;Germany;VTT;Low;1570;250;125;196250;5887,5;190362,5;188400;1962,5;01/06/2014;6;June;2014\nSmall Business;Canada;VTT;Low;1874;250;300;562200;16866;545334;468500;76834;01/08/2014;8;August;2014\nGovernment;Mexico;VTT;Low;1642;250;350;574700;17241;557459;426920;130539;01/08/2014;8;August;2014\nMidmarket;Germany;VTT;Low;1945;250;15;29175;875,25;28299,75;19450;8849,75;01/10/2013;10;October;2013\nGovernment;Canada;Carretera;Low;831;3;20;16620;498,6;16121,4;8310;7811,4;01/05/2014;5;May;2014\nGovernment;Mexico;Paseo;Low;1760;10;7;12320;369,6;11950,4;8800;3150,4;01/09/2013;9;September;2013\nGovernment;Canada;Velo;Low;3850,5;120;20;77010;2310,3;74699,7;38505;36194,7;01/04/2014;4;April;2014\nChannel Partners;Germany;VTT;Low;2479;250;12;29748;892,44;28855,56;7437;21418,56;01/01/2014;1;January;2014\nMidmarket;Mexico;Montana;Low;2031;5;15;30465;1218,6;29246,4;20310;8936,4;01/10/2014;10;October;2014\nMidmarket;Mexico;Paseo;Low;2031;10;15;30465;1218,6;29246,4;20310;8936,4;01/10/2014;10;October;2014\nMidmarket;France;Paseo;Low;2261;10;15;33915;1356,6;32558,4;22610;9948,4;01/12/2013;12;December;2013\nGovernment;United States of America;Velo;Low;736;120;20;14720;588,8;14131,2;7360;6771,2;01/09/2013;9;September;2013\nGovernment;Canada;Carretera;Low;2851;3;7;19957;798,28;19158,72;14255;4903,72;01/10/2013;10;October;2013\nSmall Business;Germany;Carretera;Low;2021;3;300;606300;24252;582048;505250;76798;01/10/2014;10;October;2014\nGovernment;United States of America;Carretera;Low;274;3;350;95900;3836;92064;71240;20824;01/12/2014;12;December;2014\nMidmarket;Canada;Montana;Low;1967;5;15;29505;1180,2;28324,8;19670;8654,8;01/03/2014;3;March;2014\nSmall Business;Germany;Montana;Low;1859;5;300;557700;22308;535392;464750;70642;01/08/2014;8;August;2014\nGovernment;Canada;Montana;Low;2851;5;7;19957;798,28;19158,72;14255;4903,72;01/10/2013;10;October;2013\nSmall Business;Germany;Montana;Low;2021;5;300;606300;24252;582048;505250;76798;01/10/2014;10;October;2014\nEnterprise;Mexico;Montana;Low;1138;5;125;142250;5690;136560;136560;0;01/12/2014;12;December;2014\nGovernment;Canada;Paseo;Low;4251;10;7;29757;1190,28;28566,72;21255;7311,72;01/01/2014;1;January;2014\nEnterprise;Germany;Paseo;Low;795;10;125;99375;3975;95400;95400;0;01/03/2014;3;March;2014\nSmall Business;Germany;Paseo;Low;1414,5;10;300;424350;16974;407376;353625;53751;01/04/2014;4;April;2014\nSmall Business;United States of America;Paseo;Low;2918;10;300;875400;35016;840384;729500;110884;01/05/2014;5;May;2014\nGovernment;United States of America;Paseo;Low;3450;10;350;1207500;48300;1159200;897000;262200;01/07/2014;7;July;2014\nEnterprise;France;Paseo;Low;2988;10;125;373500;14940;358560;358560;0;01/07/2014;7;July;2014\nMidmarket;Canada;Paseo;Low;218;10;15;3270;130,8;3139,2;2180;959,2;01/09/2014;9;September;2014\nGovernment;Canada;Paseo;Low;2074;10;20;41480;1659,2;39820,8;20740;19080,8;01/09/2014;9;September;2014\nGovernment;United States of America;Paseo;Low;1056;10;20;21120;844,8;20275,2;10560;9715,2;01/09/2014;9;September;2014\nMidmarket;United States of America;Paseo;Low;671;10;15;10065;402,6;9662,4;6710;2952,4;01/10/2013;10;October;2013\nMidmarket;Mexico;Paseo;Low;1514;10;15;22710;908,4;21801,6;15140;6661,6;01/10/2013;10;October;2013\nGovernment;United States of America;Paseo;Low;274;10;350;95900;3836;92064;71240;20824;01/12/2014;12;December;2014\nEnterprise;Mexico;Paseo;Low;1138;10;125;142250;5690;136560;136560;0;01/12/2014;12;December;2014\nChannel Partners;United States of America;Velo;Low;1465;120;12;17580;703,2;16876,8;4395;12481,8;01/03/2014;3;March;2014\nGovernment;Canada;Velo;Low;2646;120;20;52920;2116,8;50803,2;26460;24343,2;01/09/2013;9;September;2013\nGovernment;France;Velo;Low;2177;120;350;761950;30478;731472;566020;165452;01/10/2014;10;October;2014\nChannel Partners;France;VTT;Low;866;250;12;10392;415,68;9976,32;2598;7378,32;01/05/2014;5;May;2014\nGovernment;United States of America;VTT;Low;349;250;350;122150;4886;117264;90740;26524;01/09/2013;9;September;2013\nGovernment;France;VTT;Low;2177;250;350;761950;30478;731472;566020;165452;01/10/2014;10;October;2014\nMidmarket;Mexico;VTT;Low;1514;250;15;22710;908,4;21801,6;15140;6661,6;01/10/2013;10;October;2013\nGovernment;Mexico;Amarilla;Low;1865;260;350;652750;26110;626640;484900;141740;01/02/2014;2;February;2014\nEnterprise;Mexico;Amarilla;Low;1074;260;125;134250;5370;128880;128880;0;01/04/2014;4;April;2014\nGovernment;Germany;Amarilla;Low;1907;260;350;667450;26698;640752;495820;144932;01/09/2014;9;September;2014\nMidmarket;United States of America;Amarilla;Low;671;260;15;10065;402,6;9662,4;6710;2952,4;01/10/2013;10;October;2013\nGovernment;Canada;Amarilla;Low;1778;260;350;622300;24892;597408;462280;135128;01/12/2013;12;December;2013\nGovernment;Germany;Montana;Medium;1159;5;7;8113;405,65;7707,35;5795;1912,35;01/10/2013;10;October;2013\nGovernment;Germany;Paseo;Medium;1372;10;7;9604;480,2;9123,8;6860;2263,8;01/01/2014;1;January;2014\nGovernment;Canada;Paseo;Medium;2349;10;7;16443;822,15;15620,85;11745;3875,85;01/09/2013;9;September;2013\nGovernment;Mexico;Paseo;Medium;2689;10;7;18823;941,15;17881,85;13445;4436,85;01/10/2014;10;October;2014\nChannel Partners;Canada;Paseo;Medium;2431;10;12;29172;1458,6;27713,4;7293;20420,4;01/12/2014;12;December;2014\nChannel Partners;Canada;Velo;Medium;2431;120;12;29172;1458,6;27713,4;7293;20420,4;01/12/2014;12;December;2014\nGovernment;Mexico;VTT;Medium;2689;250;7;18823;941,15;17881,85;13445;4436,85;01/10/2014;10;October;2014\nGovernment;Mexico;Amarilla;Medium;1683;260;7;11781;589,05;11191,95;8415;2776,95;01/07/2014;7;July;2014\nChannel Partners;Mexico;Amarilla;Medium;1123;260;12;13476;673,8;12802,2;3369;9433,2;01/08/2014;8;August;2014\nGovernment;Germany;Amarilla;Medium;1159;260;7;8113;405,65;7707,35;5795;1912,35;01/10/2013;10;October;2013\nChannel Partners;France;Carretera;Medium;1865;3;12;22380;1119;21261;5595;15666;01/02/2014;2;February;2014\nChannel Partners;Germany;Carretera;Medium;1116;3;12;13392;669,6;12722,4;3348;9374,4;01/02/2014;2;February;2014\nGovernment;France;Carretera;Medium;1563;3;20;31260;1563;29697;15630;14067;01/05/2014;5;May;2014\nSmall Business;United States of America;Carretera;Medium;991;3;300;297300;14865;282435;247750;34685;01/06/2014;6;June;2014\nGovernment;Germany;Carretera;Medium;1016;3;7;7112;355,6;6756,4;5080;1676,4;01/11/2013;11;November;2013\nMidmarket;Mexico;Carretera;Medium;2791;3;15;41865;2093,25;39771,75;27910;11861,75;01/11/2014;11;November;2014\nGovernment;United States of America;Carretera;Medium;570;3;7;3990;199,5;3790,5;2850;940,5;01/12/2014;12;December;2014\nGovernment;France;Carretera;Medium;2487;3;7;17409;870,45;16538,55;12435;4103,55;01/12/2014;12;December;2014\nGovernment;France;Montana;Medium;1384,5;5;350;484575;24228,75;460346,25;359970;100376,25;01/01/2014;1;January;2014\nEnterprise;United States of America;Montana;Medium;3627;5;125;453375;22668,75;430706,25;435240;-4533,75;01/07/2014;7;July;2014\nGovernment;Mexico;Montana;Medium;720;5;350;252000;12600;239400;187200;52200;01/09/2013;9;September;2013\nChannel Partners;Germany;Montana;Medium;2342;5;12;28104;1405,2;26698,8;7026;19672,8;01/11/2014;11;November;2014\nSmall Business;Mexico;Montana;Medium;1100;5;300;330000;16500;313500;275000;38500;01/12/2013;12;December;2013\nGovernment;France;Paseo;Medium;1303;10;20;26060;1303;24757;13030;11727;01/02/2014;2;February;2014\nEnterprise;United States of America;Paseo;Medium;2992;10;125;374000;18700;355300;359040;-3740;01/03/2014;3;March;2014\nEnterprise;France;Paseo;Medium;2385;10;125;298125;14906,25;283218,75;286200;-2981,25;01/03/2014;3;March;2014\nSmall Business;Mexico;Paseo;Medium;1607;10;300;482100;24105;457995;401750;56245;01/04/2014;4;April;2014\nGovernment;United States of America;Paseo;Medium;2327;10;7;16289;814,45;15474,55;11635;3839,55;01/05/2014;5;May;2014\nSmall Business;United States of America;Paseo;Medium;991;10;300;297300;14865;282435;247750;34685;01/06/2014;6;June;2014\nGovernment;United States of America;Paseo;Medium;602;10;350;210700;10535;200165;156520;43645;01/06/2014;6;June;2014\nMidmarket;France;Paseo;Medium;2620;10;15;39300;1965;37335;26200;11135;01/09/2014;9;September;2014\nGovernment;Canada;Paseo;Medium;1228;10;350;429800;21490;408310;319280;89030;01/10/2013;10;October;2013\nGovernment;Canada;Paseo;Medium;1389;10;20;27780;1389;26391;13890;12501;01/10/2013;10;October;2013\nEnterprise;United States of America;Paseo;Medium;861;10;125;107625;5381,25;102243,75;103320;-1076,25;01/10/2014;10;October;2014\nEnterprise;France;Paseo;Medium;704;10;125;88000;4400;83600;84480;-880;01/10/2013;10;October;2013\nGovernment;Canada;Paseo;Medium;1802;10;20;36040;1802;34238;18020;16218;01/12/2013;12;December;2013\nGovernment;United States of America;Paseo;Medium;2663;10;20;53260;2663;50597;26630;23967;01/12/2014;12;December;2014\nGovernment;France;Paseo;Medium;2136;10;7;14952;747,6;14204,4;10680;3524,4;01/12/2013;12;December;2013\nMidmarket;Germany;Paseo;Medium;2116;10;15;31740;1587;30153;21160;8993;01/12/2013;12;December;2013\nMidmarket;United States of America;Velo;Medium;555;120;15;8325;416,25;7908,75;5550;2358,75;01/01/2014;1;January;2014\nMidmarket;Mexico;Velo;Medium;2861;120;15;42915;2145,75;40769,25;28610;12159,25;01/01/2014;1;January;2014\nEnterprise;Germany;Velo;Medium;807;120;125;100875;5043,75;95831,25;96840;-1008,75;01/02/2014;2;February;2014\nGovernment;United States of America;Velo;Medium;602;120;350;210700;10535;200165;156520;43645;01/06/2014;6;June;2014\nGovernment;United States of America;Velo;Medium;2832;120;20;56640;2832;53808;28320;25488;01/08/2014;8;August;2014\nGovernment;France;Velo;Medium;1579;120;20;31580;1579;30001;15790;14211;01/08/2014;8;August;2014\nEnterprise;United States of America;Velo;Medium;861;120;125;107625;5381,25;102243,75;103320;-1076,25;01/10/2014;10;October;2014\nEnterprise;France;Velo;Medium;704;120;125;88000;4400;83600;84480;-880;01/10/2013;10;October;2013\nGovernment;France;Velo;Medium;1033;120;20;20660;1033;19627;10330;9297;01/12/2013;12;December;2013\nSmall Business;Germany;Velo;Medium;1250;120;300;375000;18750;356250;312500;43750;01/12/2014;12;December;2014\nGovernment;Canada;VTT;Medium;1389;250;20;27780;1389;26391;13890;12501;01/10/2013;10;October;2013\nGovernment;United States of America;VTT;Medium;1265;250;20;25300;1265;24035;12650;11385;01/11/2013;11;November;2013\nGovernment;Germany;VTT;Medium;2297;250;20;45940;2297;43643;22970;20673;01/11/2013;11;November;2013\nGovernment;United States of America;VTT;Medium;2663;250;20;53260;2663;50597;26630;23967;01/12/2014;12;December;2014\nGovernment;United States of America;VTT;Medium;570;250;7;3990;199,5;3790,5;2850;940,5;01/12/2014;12;December;2014\nGovernment;France;VTT;Medium;2487;250;7;17409;870,45;16538,55;12435;4103,55;01/12/2014;12;December;2014\nGovernment;Germany;Amarilla;Medium;1350;260;350;472500;23625;448875;351000;97875;01/02/2014;2;February;2014\nGovernment;Canada;Amarilla;Medium;552;260;350;193200;9660;183540;143520;40020;01/08/2014;8;August;2014\nGovernment;Canada;Amarilla;Medium;1228;260;350;429800;21490;408310;319280;89030;01/10/2013;10;October;2013\nSmall Business;Germany;Amarilla;Medium;1250;260;300;375000;18750;356250;312500;43750;01/12/2014;12;December;2014\nMidmarket;France;Paseo;Medium;3801;10;15;57015;3420,9;53594,1;38010;15584,1;01/04/2014;4;April;2014\nGovernment;United States of America;Carretera;Medium;1117,5;3;20;22350;1341;21009;11175;9834;01/01/2014;1;January;2014\nMidmarket;Canada;Carretera;Medium;2844;3;15;42660;2559,6;40100,4;28440;11660,4;01/06/2014;6;June;2014\nChannel Partners;Mexico;Carretera;Medium;562;3;12;6744;404,64;6339,36;1686;4653,36;01/09/2014;9;September;2014\nChannel Partners;Canada;Carretera;Medium;2299;3;12;27588;1655,28;25932,72;6897;19035,72;01/10/2013;10;October;2013\nMidmarket;United States of America;Carretera;Medium;2030;3;15;30450;1827;28623;20300;8323;01/11/2014;11;November;2014\nGovernment;United States of America;Carretera;Medium;263;3;7;1841;110,46;1730,54;1315;415,54;01/11/2013;11;November;2013\nEnterprise;Germany;Carretera;Medium;887;3;125;110875;6652,5;104222,5;106440;-2217,5;01/12/2013;12;December;2013\nGovernment;Mexico;Montana;Medium;980;5;350;343000;20580;322420;254800;67620;01/04/2014;4;April;2014\nGovernment;Germany;Montana;Medium;1460;5;350;511000;30660;480340;379600;100740;01/05/2014;5;May;2014\nGovernment;France;Montana;Medium;1403;5;7;9821;589,26;9231,74;7015;2216,74;01/10/2013;10;October;2013\nChannel Partners;United States of America;Montana;Medium;2723;5;12;32676;1960,56;30715,44;8169;22546,44;01/11/2014;11;November;2014\nGovernment;France;Paseo;Medium;1496;10;350;523600;31416;492184;388960;103224;01/06/2014;6;June;2014\nChannel Partners;Canada;Paseo;Medium;2299;10;12;27588;1655,28;25932,72;6897;19035,72;01/10/2013;10;October;2013\nGovernment;United States of America;Paseo;Medium;727;10;350;254450;15267;239183;189020;50163;01/10/2013;10;October;2013\nEnterprise;Canada;Velo;Medium;952;120;125;119000;7140;111860;114240;-2380;01/02/2014;2;February;2014\nEnterprise;United States of America;Velo;Medium;2755;120;125;344375;20662,5;323712,5;330600;-6887,5;01/02/2014;2;February;2014\nMidmarket;Germany;Velo;Medium;1530;120;15;22950;1377;21573;15300;6273;01/05/2014;5;May;2014\nGovernment;France;Velo;Medium;1496;120;350;523600;31416;492184;388960;103224;01/06/2014;6;June;2014\nGovernment;Mexico;Velo;Medium;1498;120;7;10486;629,16;9856,84;7490;2366,84;01/06/2014;6;June;2014\nSmall Business;France;Velo;Medium;1221;120;300;366300;21978;344322;305250;39072;01/10/2013;10;October;2013\nGovernment;France;Velo;Medium;2076;120;350;726600;43596;683004;539760;143244;01/10/2013;10;October;2013\nMidmarket;Canada;VTT;Medium;2844;250;15;42660;2559,6;40100,4;28440;11660,4;01/06/2014;6;June;2014\nGovernment;Mexico;VTT;Medium;1498;250;7;10486;629,16;9856,84;7490;2366,84;01/06/2014;6;June;2014\nSmall Business;France;VTT;Medium;1221;250;300;366300;21978;344322;305250;39072;01/10/2013;10;October;2013\nGovernment;Mexico;VTT;Medium;1123;250;20;22460;1347,6;21112,4;11230;9882,4;01/11/2013;11;November;2013\nSmall Business;Canada;VTT;Medium;2436;250;300;730800;43848;686952;609000;77952;01/12/2013;12;December;2013\nEnterprise;France;Amarilla;Medium;1987,5;260;125;248437,5;14906,25;233531,25;238500;-4968,75;01/01/2014;1;January;2014\nGovernment;Mexico;Amarilla;Medium;1679;260;350;587650;35259;552391;436540;115851;01/09/2014;9;September;2014\nGovernment;United States of America;Amarilla;Medium;727;260;350;254450;15267;239183;189020;50163;01/10/2013;10;October;2013\nGovernment;France;Amarilla;Medium;1403;260;7;9821;589,26;9231,74;7015;2216,74;01/10/2013;10;October;2013\nGovernment;France;Amarilla;Medium;2076;260;350;726600;43596;683004;539760;143244;01/10/2013;10;October;2013\nGovernment;France;Montana;Medium;1757;5;20;35140;2108,4;33031,6;17570;15461,6;01/10/2013;10;October;2013\nMidmarket;United States of America;Paseo;Medium;2198;10;15;32970;1978,2;30991,8;21980;9011,8;01/08/2014;8;August;2014\nMidmarket;Germany;Paseo;Medium;1743;10;15;26145;1568,7;24576,3;17430;7146,3;01/08/2014;8;August;2014\nMidmarket;United States of America;Paseo;Medium;1153;10;15;17295;1037,7;16257,3;11530;4727,3;01/10/2014;10;October;2014\nGovernment;France;Paseo;Medium;1757;10;20;35140;2108,4;33031,6;17570;15461,6;01/10/2013;10;October;2013\nGovernment;Germany;Velo;Medium;1001;120;20;20020;1201,2;18818,8;10010;8808,8;01/08/2014;8;August;2014\nGovernment;Mexico;Velo;Medium;1333;120;7;9331;559,86;8771,14;6665;2106,14;01/11/2014;11;November;2014\nMidmarket;United States of America;VTT;Medium;1153;250;15;17295;1037,7;16257,3;11530;4727,3;01/10/2014;10;October;2014\nChannel Partners;Mexico;Carretera;Medium;727;3;12;8724;610,68;8113,32;2181;5932,32;01/02/2014;2;February;2014\nChannel Partners;Canada;Carretera;Medium;1884;3;12;22608;1582,56;21025,44;5652;15373,44;01/08/2014;8;August;2014\nGovernment;Mexico;Carretera;Medium;1834;3;20;36680;2567,6;34112,4;18340;15772,4;01/09/2013;9;September;2013\nChannel Partners;Mexico;Montana;Medium;2340;5;12;28080;1965,6;26114,4;7020;19094,4;01/01/2014;1;January;2014\nChannel Partners;France;Montana;Medium;2342;5;12;28104;1967,28;26136,72;7026;19110,72;01/11/2014;11;November;2014\nGovernment;France;Paseo;Medium;1031;10;7;7217;505,19;6711,81;5155;1556,81;01/09/2013;9;September;2013\nMidmarket;Canada;Velo;Medium;1262;120;15;18930;1325,1;17604,9;12620;4984,9;01/05/2014;5;May;2014\nGovernment;Canada;Velo;Medium;1135;120;7;7945;556,15;7388,85;5675;1713,85;01/06/2014;6;June;2014\nGovernment;United States of America;Velo;Medium;547;120;7;3829;268,03;3560,97;2735;825,97;01/11/2014;11;November;2014\nGovernment;Canada;Velo;Medium;1582;120;7;11074;775,18;10298,82;7910;2388,82;01/12/2014;12;December;2014\nChannel Partners;France;VTT;Medium;1738,5;250;12;20862;1460,34;19401,66;5215,5;14186,16;01/04/2014;4;April;2014\nChannel Partners;Germany;VTT;Medium;2215;250;12;26580;1860,6;24719,4;6645;18074,4;01/09/2013;9;September;2013\nGovernment;Canada;VTT;Medium;1582;250;7;11074;775,18;10298,82;7910;2388,82;01/12/2014;12;December;2014\nGovernment;Canada;Amarilla;Medium;1135;260;7;7945;556,15;7388,85;5675;1713,85;01/06/2014;6;June;2014\nGovernment;United States of America;Carretera;Medium;1761;3;350;616350;43144,5;573205,5;457860;115345,5;01/03/2014;3;March;2014\nSmall Business;France;Carretera;Medium;448;3;300;134400;9408;124992;112000;12992;01/06/2014;6;June;2014\nSmall Business;France;Carretera;Medium;2181;3;300;654300;45801;608499;545250;63249;01/10/2014;10;October;2014\nGovernment;France;Montana;Medium;1976;5;20;39520;2766,4;36753,6;19760;16993,6;01/10/2014;10;October;2014\nSmall Business;France;Montana;Medium;2181;5;300;654300;45801;608499;545250;63249;01/10/2014;10;October;2014\nEnterprise;Germany;Montana;Medium;2500;5;125;312500;21875;290625;300000;-9375;01/11/2013;11;November;2013\nSmall Business;Canada;Paseo;Medium;1702;10;300;510600;35742;474858;425500;49358;01/05/2014;5;May;2014\nSmall Business;France;Paseo;Medium;448;10;300;134400;9408;124992;112000;12992;01/06/2014;6;June;2014\nEnterprise;Germany;Paseo;Medium;3513;10;125;439125;30738,75;408386,25;421560;-13173,75;01/07/2014;7;July;2014\nMidmarket;France;Paseo;Medium;2101;10;15;31515;2206,05;29308,95;21010;8298,95;01/08/2014;8;August;2014\nMidmarket;United States of America;Paseo;Medium;2931;10;15;43965;3077,55;40887,45;29310;11577,45;01/09/2013;9;September;2013\nGovernment;France;Paseo;Medium;1535;10;20;30700;2149;28551;15350;13201;01/09/2014;9;September;2014\nSmall Business;Germany;Paseo;Medium;1123;10;300;336900;23583;313317;280750;32567;01/09/2013;9;September;2013\nSmall Business;Canada;Paseo;Medium;1404;10;300;421200;29484;391716;351000;40716;01/11/2013;11;November;2013\nChannel Partners;Mexico;Paseo;Medium;2763;10;12;33156;2320,92;30835,08;8289;22546,08;01/11/2013;11;November;2013\nGovernment;Germany;Paseo;Medium;2125;10;7;14875;1041,25;13833,75;10625;3208,75;01/12/2013;12;December;2013\nSmall Business;France;Velo;Medium;1659;120;300;497700;34839;462861;414750;48111;01/07/2014;7;July;2014\nGovernment;Mexico;Velo;Medium;609;120;20;12180;852,6;11327,4;6090;5237,4;01/08/2014;8;August;2014\nEnterprise;Germany;Velo;Medium;2087;120;125;260875;18261,25;242613,75;250440;-7826,25;01/09/2014;9;September;2014\nGovernment;France;Velo;Medium;1976;120;20;39520;2766,4;36753,6;19760;16993,6;01/10/2014;10;October;2014\nGovernment;United States of America;Velo;Medium;1421;120;20;28420;1989,4;26430,6;14210;12220,6;01/12/2013;12;December;2013\nSmall Business;United States of America;Velo;Medium;1372;120;300;411600;28812;382788;343000;39788;01/12/2014;12;December;2014\nGovernment;Germany;Velo;Medium;588;120;20;11760;823,2;10936,8;5880;5056,8;01/12/2013;12;December;2013\nChannel Partners;Canada;VTT;Medium;3244,5;250;12;38934;2725,38;36208,62;9733,5;26475,12;01/01/2014;1;January;2014\nSmall Business;France;VTT;Medium;959;250;300;287700;20139;267561;239750;27811;01/02/2014;2;February;2014\nSmall Business;Mexico;VTT;Medium;2747;250;300;824100;57687;766413;686750;79663;01/02/2014;2;February;2014\nEnterprise;Canada;Amarilla;Medium;1645;260;125;205625;14393,75;191231,25;197400;-6168,75;01/05/2014;5;May;2014\nGovernment;France;Amarilla;Medium;2876;260;350;1006600;70462;936138;747760;188378;01/09/2014;9;September;2014\nEnterprise;Germany;Amarilla;Medium;994;260;125;124250;8697,5;115552,5;119280;-3727,5;01/09/2013;9;September;2013\nGovernment;Canada;Amarilla;Medium;1118;260;20;22360;1565,2;20794,8;11180;9614,8;01/11/2014;11;November;2014\nSmall Business;United States of America;Amarilla;Medium;1372;260;300;411600;28812;382788;343000;39788;01/12/2014;12;December;2014\nGovernment;Canada;Montana;Medium;488;5;7;3416;273,28;3142,72;2440;702,72;01/02/2014;2;February;2014\nGovernment;United States of America;Montana;Medium;1282;5;20;25640;2051,2;23588,8;12820;10768,8;01/06/2014;6;June;2014\nGovernment;Canada;Paseo;Medium;257;10;7;1799;143,92;1655,08;1285;370,08;01/05/2014;5;May;2014\nGovernment;United States of America;Amarilla;Medium;1282;260;20;25640;2051,2;23588,8;12820;10768,8;01/06/2014;6;June;2014\nEnterprise;Mexico;Carretera;Medium;1540;3;125;192500;15400;177100;184800;-7700;01/08/2014;8;August;2014\nMidmarket;France;Carretera;Medium;490;3;15;7350;588;6762;4900;1862;01/11/2014;11;November;2014\nGovernment;Mexico;Carretera;Medium;1362;3;350;476700;38136;438564;354120;84444;01/12/2014;12;December;2014\nMidmarket;France;Montana;Medium;2501;5;15;37515;3001,2;34513,8;25010;9503,8;01/03/2014;3;March;2014\nGovernment;Canada;Montana;Medium;708;5;20;14160;1132,8;13027,2;7080;5947,2;01/06/2014;6;June;2014\nGovernment;Germany;Montana;Medium;645;5;20;12900;1032;11868;6450;5418;01/07/2014;7;July;2014\nSmall Business;France;Montana;Medium;1562;5;300;468600;37488;431112;390500;40612;01/08/2014;8;August;2014\nSmall Business;Canada;Montana;Medium;1283;5;300;384900;30792;354108;320750;33358;01/09/2013;9;September;2013\nMidmarket;Germany;Montana;Medium;711;5;15;10665;853,2;9811,8;7110;2701,8;01/12/2014;12;December;2014\nEnterprise;Mexico;Paseo;Medium;1114;10;125;139250;11140;128110;133680;-5570;01/03/2014;3;March;2014\nGovernment;Germany;Paseo;Medium;1259;10;7;8813;705,04;8107,96;6295;1812,96;01/04/2014;4;April;2014\nGovernment;Germany;Paseo;Medium;1095;10;7;7665;613,2;7051,8;5475;1576,8;01/05/2014;5;May;2014\nGovernment;Germany;Paseo;Medium;1366;10;20;27320;2185,6;25134,4;13660;11474,4;01/06/2014;6;June;2014\nSmall Business;Mexico;Paseo;Medium;2460;10;300;738000;59040;678960;615000;63960;01/06/2014;6;June;2014\nGovernment;United States of America;Paseo;Medium;678;10;7;4746;379,68;4366,32;3390;976,32;01/08/2014;8;August;2014\nGovernment;Germany;Paseo;Medium;1598;10;7;11186;894,88;10291,12;7990;2301,12;01/08/2014;8;August;2014\nGovernment;Germany;Paseo;Medium;2409;10;7;16863;1349,04;15513,96;12045;3468,96;01/09/2013;9;September;2013\nGovernment;Germany;Paseo;Medium;1934;10;20;38680;3094,4;35585,6;19340;16245,6;01/09/2014;9;September;2014\nGovernment;Mexico;Paseo;Medium;2993;10;20;59860;4788,8;55071,2;29930;25141,2;01/09/2014;9;September;2014\nGovernment;Germany;Paseo;Medium;2146;10;350;751100;60088;691012;557960;133052;01/11/2013;11;November;2013\nGovernment;Mexico;Paseo;Medium;1946;10;7;13622;1089,76;12532,24;9730;2802,24;01/12/2013;12;December;2013\nGovernment;Mexico;Paseo;Medium;1362;10;350;476700;38136;438564;354120;84444;01/12/2014;12;December;2014\nChannel Partners;Canada;Velo;Medium;598;120;12;7176;574,08;6601,92;1794;4807,92;01/03/2014;3;March;2014\nGovernment;United States of America;Velo;Medium;2907;120;7;20349;1627,92;18721,08;14535;4186,08;01/06/2014;6;June;2014\nGovernment;Germany;Velo;Medium;2338;120;7;16366;1309,28;15056,72;11690;3366,72;01/06/2014;6;June;2014\nSmall Business;France;Velo;Medium;386;120;300;115800;9264;106536;96500;10036;01/11/2013;11;November;2013\nSmall Business;Mexico;Velo;Medium;635;120;300;190500;15240;175260;158750;16510;01/12/2014;12;December;2014\nGovernment;France;VTT;Medium;574,5;250;350;201075;16086;184989;149370;35619;01/04/2014;4;April;2014\nGovernment;Germany;VTT;Medium;2338;250;7;16366;1309,28;15056,72;11690;3366,72;01/06/2014;6;June;2014\nGovernment;France;VTT;Medium;381;250;350;133350;10668;122682;99060;23622;01/08/2014;8;August;2014\nGovernment;Germany;VTT;Medium;422;250;350;147700;11816;135884;109720;26164;01/08/2014;8;August;2014\nSmall Business;Canada;VTT;Medium;2134;250;300;640200;51216;588984;533500;55484;01/09/2014;9;September;2014\nSmall Business;United States of America;VTT;Medium;808;250;300;242400;19392;223008;202000;21008;01/12/2013;12;December;2013\nGovernment;Canada;Amarilla;Medium;708;260;20;14160;1132,8;13027,2;7080;5947,2;01/06/2014;6;June;2014\nGovernment;United States of America;Amarilla;Medium;2907;260;7;20349;1627,92;18721,08;14535;4186,08;01/06/2014;6;June;2014\nGovernment;Germany;Amarilla;Medium;1366;260;20;27320;2185,6;25134,4;13660;11474,4;01/06/2014;6;June;2014\nSmall Business;Mexico;Amarilla;Medium;2460;260;300;738000;59040;678960;615000;63960;01/06/2014;6;June;2014\nGovernment;Germany;Amarilla;Medium;1520;260;20;30400;2432;27968;15200;12768;01/11/2014;11;November;2014\nMidmarket;Germany;Amarilla;Medium;711;260;15;10665;853,2;9811,8;7110;2701,8;01/12/2014;12;December;2014\nChannel Partners;Mexico;Amarilla;Medium;1375;260;12;16500;1320;15180;4125;11055;01/12/2013;12;December;2013\nSmall Business;Mexico;Amarilla;Medium;635;260;300;190500;15240;175260;158750;16510;01/12/2014;12;December;2014\nGovernment;United States of America;VTT;Medium;436,5;250;20;8730;698,4;8031,6;4365;3666,6;01/07/2014;7;July;2014\nSmall Business;Canada;Carretera;Medium;1094;3;300;328200;29538;298662;273500;25162;01/06/2014;6;June;2014\nChannel Partners;Mexico;Carretera;Medium;367;3;12;4404;396,36;4007,64;1101;2906,64;01/10/2013;10;October;2013\nSmall Business;Canada;Montana;Medium;3802,5;5;300;1140750;102667,5;1038082,5;950625;87457,5;01/04/2014;4;April;2014\nGovernment;France;Montana;Medium;1666;5;350;583100;52479;530621;433160;97461;01/05/2014;5;May;2014\nSmall Business;France;Montana;Medium;322;5;300;96600;8694;87906;80500;7406;01/09/2013;9;September;2013\nChannel Partners;Canada;Montana;Medium;2321;5;12;27852;2506,68;25345,32;6963;18382,32;01/11/2014;11;November;2014\nEnterprise;France;Montana;Medium;1857;5;125;232125;20891,25;211233,75;222840;-11606,25;01/11/2013;11;November;2013\nGovernment;Canada;Montana;Medium;1611;5;7;11277;1014,93;10262,07;8055;2207,07;01/12/2013;12;December;2013\nEnterprise;United States of America;Montana;Medium;2797;5;125;349625;31466,25;318158,75;335640;-17481,25;01/12/2014;12;December;2014\nSmall Business;Germany;Montana;Medium;334;5;300;100200;9018;91182;83500;7682;01/12/2013;12;December;2013\nSmall Business;Mexico;Paseo;Medium;2565;10;300;769500;69255;700245;641250;58995;01/01/2014;1;January;2014\nGovernment;Mexico;Paseo;Medium;2417;10;350;845950;76135,5;769814,5;628420;141394,5;01/01/2014;1;January;2014\nMidmarket;United States of America;Paseo;Medium;3675;10;15;55125;4961,25;50163,75;36750;13413,75;01/04/2014;4;April;2014\nSmall Business;Canada;Paseo;Medium;1094;10;300;328200;29538;298662;273500;25162;01/06/2014;6;June;2014\nMidmarket;France;Paseo;Medium;1227;10;15;18405;1656,45;16748,55;12270;4478,55;01/10/2014;10;October;2014\nChannel Partners;Mexico;Paseo;Medium;367;10;12;4404;396,36;4007,64;1101;2906,64;01/10/2013;10;October;2013\nSmall Business;France;Paseo;Medium;1324;10;300;397200;35748;361452;331000;30452;01/11/2014;11;November;2014\nChannel Partners;Germany;Paseo;Medium;1775;10;12;21300;1917;19383;5325;14058;01/11/2013;11;November;2013\nEnterprise;United States of America;Paseo;Medium;2797;10;125;349625;31466,25;318158,75;335640;-17481,25;01/12/2014;12;December;2014\nMidmarket;Mexico;Velo;Medium;245;120;15;3675;330,75;3344,25;2450;894,25;01/05/2014;5;May;2014\nSmall Business;Canada;Velo;Medium;3793,5;120;300;1138050;102424,5;1035625,5;948375;87250,5;01/07/2014;7;July;2014\nGovernment;Germany;Velo;Medium;1307;120;350;457450;41170,5;416279,5;339820;76459,5;01/07/2014;7;July;2014\nEnterprise;Canada;Velo;Medium;567;120;125;70875;6378,75;64496,25;68040;-3543,75;01/09/2014;9;September;2014\nEnterprise;Mexico;Velo;Medium;2110;120;125;263750;23737,5;240012,5;253200;-13187,5;01/09/2014;9;September;2014\nGovernment;Canada;Velo;Medium;1269;120;350;444150;39973,5;404176,5;329940;74236,5;01/10/2014;10;October;2014\nChannel Partners;United States of America;VTT;Medium;1956;250;12;23472;2112,48;21359,52;5868;15491,52;01/01/2014;1;January;2014\nSmall Business;Germany;VTT;Medium;2659;250;300;797700;71793;725907;664750;61157;01/02/2014;2;February;2014\nGovernment;United States of America;VTT;Medium;1351,5;250;350;473025;42572,25;430452,75;351390;79062,75;01/04/2014;4;April;2014\nChannel Partners;Germany;VTT;Medium;880;250;12;10560;950,4;9609,6;2640;6969,6;01/05/2014;5;May;2014\nSmall Business;United States of America;VTT;Medium;1867;250;300;560100;50409;509691;466750;42941;01/09/2014;9;September;2014\nChannel Partners;France;VTT;Medium;2234;250;12;26808;2412,72;24395,28;6702;17693,28;01/09/2013;9;September;2013\nMidmarket;France;VTT;Medium;1227;250;15;18405;1656,45;16748,55;12270;4478,55;01/10/2014;10;October;2014\nEnterprise;Mexico;VTT;Medium;877;250;125;109625;9866,25;99758,75;105240;-5481,25;01/11/2014;11;November;2014\nGovernment;United States of America;Amarilla;Medium;2071;260;350;724850;65236,5;659613,5;538460;121153,5;01/09/2014;9;September;2014\nGovernment;Canada;Amarilla;Medium;1269;260;350;444150;39973,5;404176,5;329940;74236,5;01/10/2014;10;October;2014\nMidmarket;Germany;Amarilla;Medium;970;260;15;14550;1309,5;13240,5;9700;3540,5;01/11/2013;11;November;2013\nGovernment;Mexico;Amarilla;Medium;1694;260;20;33880;3049,2;30830,8;16940;13890,8;01/11/2014;11;November;2014\nGovernment;Germany;Carretera;Medium;663;3;20;13260;1193,4;12066,6;6630;5436,6;01/05/2014;5;May;2014\nGovernment;Canada;Carretera;Medium;819;3;7;5733;515,97;5217,03;4095;1122,03;01/07/2014;7;July;2014\nChannel Partners;Germany;Carretera;Medium;1580;3;12;18960;1706,4;17253,6;4740;12513,6;01/09/2014;9;September;2014\nGovernment;Mexico;Carretera;Medium;521;3;7;3647;328,23;3318,77;2605;713,77;01/12/2014;12;December;2014\nGovernment;United States of America;Paseo;Medium;973;10;20;19460;1751,4;17708,6;9730;7978,6;01/03/2014;3;March;2014\nGovernment;Mexico;Paseo;Medium;1038;10;20;20760;1868,4;18891,6;10380;8511,6;01/06/2014;6;June;2014\nGovernment;Germany;Paseo;Medium;360;10;7;2520;226,8;2293,2;1800;493,2;01/10/2014;10;October;2014\nChannel Partners;France;Velo;Medium;1967;120;12;23604;2124,36;21479,64;5901;15578,64;01/03/2014;3;March;2014\nMidmarket;Mexico;Velo;Medium;2628;120;15;39420;3547,8;35872,2;26280;9592,2;01/04/2014;4;April;2014\nGovernment;Germany;VTT;Medium;360;250;7;2520;226,8;2293,2;1800;493,2;01/10/2014;10;October;2014\nGovernment;France;VTT;Medium;2682;250;20;53640;4827,6;48812,4;26820;21992,4;01/11/2013;11;November;2013\nGovernment;Mexico;VTT;Medium;521;250;7;3647;328,23;3318,77;2605;713,77;01/12/2014;12;December;2014\nGovernment;Mexico;Amarilla;Medium;1038;260;20;20760;1868,4;18891,6;10380;8511,6;01/06/2014;6;June;2014\nMidmarket;Canada;Amarilla;Medium;1630,5;260;15;24457,5;2201,175;22256,325;16305;5951,325;01/07/2014;7;July;2014\nChannel Partners;France;Amarilla;Medium;306;260;12;3672;330,48;3341,52;918;2423,52;01/12/2013;12;December;2013\nChannel Partners;United States of America;Carretera;High;386;3;12;4632;463,2;4168,8;1158;3010,8;01/10/2013;10;October;2013\nGovernment;United States of America;Montana;High;2328;5;7;16296;1629,6;14666,4;11640;3026,4;01/09/2014;9;September;2014\nChannel Partners;United States of America;Paseo;High;386;10;12;4632;463,2;4168,8;1158;3010,8;01/10/2013;10;October;2013\nEnterprise;United States of America;Carretera;High;3445,5;3;125;430687,5;43068,75;387618,75;413460;-25841,25;01/04/2014;4;April;2014\nEnterprise;France;Carretera;High;1482;3;125;185250;18525;166725;177840;-11115;01/12/2013;12;December;2013\nGovernment;United States of America;Montana;High;2313;5;350;809550;80955;728595;601380;127215;01/05/2014;5;May;2014\nEnterprise;United States of America;Montana;High;1804;5;125;225500;22550;202950;216480;-13530;01/11/2013;11;November;2013\nMidmarket;France;Montana;High;2072;5;15;31080;3108;27972;20720;7252;01/12/2014;12;December;2014\nGovernment;France;Paseo;High;1954;10;20;39080;3908;35172;19540;15632;01/03/2014;3;March;2014\nSmall Business;Mexico;Paseo;High;591;10;300;177300;17730;159570;147750;11820;01/05/2014;5;May;2014\nMidmarket;France;Paseo;High;2167;10;15;32505;3250,5;29254,5;21670;7584,5;01/10/2013;10;October;2013\nGovernment;Germany;Paseo;High;241;10;20;4820;482;4338;2410;1928;01/10/2014;10;October;2014\nMidmarket;Germany;Velo;High;681;120;15;10215;1021,5;9193,5;6810;2383,5;01/01/2014;1;January;2014\nMidmarket;Germany;Velo;High;510;120;15;7650;765;6885;5100;1785;01/04/2014;4;April;2014\nMidmarket;United States of America;Velo;High;790;120;15;11850;1185;10665;7900;2765;01/05/2014;5;May;2014\nGovernment;France;Velo;High;639;120;350;223650;22365;201285;166140;35145;01/07/2014;7;July;2014\nEnterprise;United States of America;Velo;High;1596;120;125;199500;19950;179550;191520;-11970;01/09/2014;9;September;2014\nSmall Business;United States of America;Velo;High;2294;120;300;688200;68820;619380;573500;45880;01/10/2013;10;October;2013\nGovernment;Germany;Velo;High;241;120;20;4820;482;4338;2410;1928;01/10/2014;10;October;2014\nGovernment;Germany;Velo;High;2665;120;7;18655;1865,5;16789,5;13325;3464,5;01/11/2014;11;November;2014\nEnterprise;Canada;Velo;High;1916;120;125;239500;23950;215550;229920;-14370;01/12/2013;12;December;2013\nSmall Business;France;Velo;High;853;120;300;255900;25590;230310;213250;17060;01/12/2014;12;December;2014\nEnterprise;Mexico;VTT;High;341;250;125;42625;4262,5;38362,5;40920;-2557,5;01/05/2014;5;May;2014\nMidmarket;Mexico;VTT;High;641;250;15;9615;961,5;8653,5;6410;2243,5;01/07/2014;7;July;2014\nGovernment;United States of America;VTT;High;2807;250;350;982450;98245;884205;729820;154385;01/08/2014;8;August;2014\nSmall Business;Mexico;VTT;High;432;250;300;129600;12960;116640;108000;8640;01/09/2014;9;September;2014\nSmall Business;United States of America;VTT;High;2294;250;300;688200;68820;619380;573500;45880;01/10/2013;10;October;2013\nMidmarket;France;VTT;High;2167;250;15;32505;3250,5;29254,5;21670;7584,5;01/10/2013;10;October;2013\nEnterprise;Canada;VTT;High;2529;250;125;316125;31612,5;284512,5;303480;-18967,5;01/11/2014;11;November;2014\nGovernment;Germany;VTT;High;1870;250;350;654500;65450;589050;486200;102850;01/12/2013;12;December;2013\nEnterprise;United States of America;Amarilla;High;579;260;125;72375;7237,5;65137,5;69480;-4342,5;01/01/2014;1;January;2014\nGovernment;Canada;Amarilla;High;2240;260;350;784000;78400;705600;582400;123200;01/02/2014;2;February;2014\nSmall Business;United States of America;Amarilla;High;2993;260;300;897900;89790;808110;748250;59860;01/03/2014;3;March;2014\nChannel Partners;Canada;Amarilla;High;3520,5;260;12;42246;4224,6;38021,4;10561,5;27459,9;01/04/2014;4;April;2014\nGovernment;Mexico;Amarilla;High;2039;260;20;40780;4078;36702;20390;16312;01/05/2014;5;May;2014\nChannel Partners;Germany;Amarilla;High;2574;260;12;30888;3088,8;27799,2;7722;20077,2;01/08/2014;8;August;2014\nGovernment;Canada;Amarilla;High;707;260;350;247450;24745;222705;183820;38885;01/09/2014;9;September;2014\nMidmarket;France;Amarilla;High;2072;260;15;31080;3108;27972;20720;7252;01/12/2014;12;December;2014\nSmall Business;France;Amarilla;High;853;260;300;255900;25590;230310;213250;17060;01/12/2014;12;December;2014\nChannel Partners;France;Carretera;High;1198;3;12;14376;1581,36;12794,64;3594;9200,64;01/10/2013;10;October;2013\nGovernment;France;Paseo;High;2532;10;7;17724;1949,64;15774,36;12660;3114,36;01/04/2014;4;April;2014\nChannel Partners;France;Paseo;High;1198;10;12;14376;1581,36;12794,64;3594;9200,64;01/10/2013;10;October;2013\nMidmarket;Canada;Velo;High;384;120;15;5760;633,6;5126,4;3840;1286,4;01/01/2014;1;January;2014\nChannel Partners;Germany;Velo;High;472;120;12;5664;623,04;5040,96;1416;3624,96;01/10/2014;10;October;2014\nGovernment;United States of America;VTT;High;1579;250;7;11053;1215,83;9837,17;7895;1942,17;01/03/2014;3;March;2014\nChannel Partners;Mexico;VTT;High;1005;250;12;12060;1326,6;10733,4;3015;7718,4;01/09/2013;9;September;2013\nMidmarket;United States of America;Amarilla;High;3199,5;260;15;47992,5;5279,175;42713,325;31995;10718,325;01/07/2014;7;July;2014\nChannel Partners;Germany;Amarilla;High;472;260;12;5664;623,04;5040,96;1416;3624,96;01/10/2014;10;October;2014\nChannel Partners;Canada;Carretera;High;1937;3;12;23244;2556,84;20687,16;5811;14876,16;01/02/2014;2;February;2014\nGovernment;Germany;Carretera;High;792;3;350;277200;30492;246708;205920;40788;01/03/2014;3;March;2014\nSmall Business;Germany;Carretera;High;2811;3;300;843300;92763;750537;702750;47787;01/07/2014;7;July;2014\nEnterprise;France;Carretera;High;2441;3;125;305125;33563,75;271561,25;292920;-21358,75;01/10/2014;10;October;2014\nMidmarket;Canada;Carretera;High;1560;3;15;23400;2574;20826;15600;5226;01/11/2013;11;November;2013\nGovernment;Mexico;Carretera;High;2706;3;7;18942;2083,62;16858,38;13530;3328,38;01/11/2013;11;November;2013\nGovernment;Germany;Montana;High;766;5;350;268100;29491;238609;199160;39449;01/01/2014;1;January;2014\nGovernment;Germany;Montana;High;2992;5;20;59840;6582,4;53257,6;29920;23337,6;01/10/2013;10;October;2013\nMidmarket;Mexico;Montana;High;2157;5;15;32355;3559,05;28795,95;21570;7225,95;01/12/2014;12;December;2014\nSmall Business;Canada;Paseo;High;873;10;300;261900;28809;233091;218250;14841;01/01/2014;1;January;2014\nGovernment;Mexico;Paseo;High;1122;10;20;22440;2468,4;19971,6;11220;8751,6;01/03/2014;3;March;2014\nGovernment;Canada;Paseo;High;2104,5;10;350;736575;81023,25;655551,75;547170;108381,75;01/07/2014;7;July;2014\nChannel Partners;Canada;Paseo;High;4026;10;12;48312;5314,32;42997,68;12078;30919,68;01/07/2014;7;July;2014\nChannel Partners;France;Paseo;High;2425,5;10;12;29106;3201,66;25904,34;7276,5;18627,84;01/07/2014;7;July;2014\nGovernment;Canada;Paseo;High;2394;10;20;47880;5266,8;42613,2;23940;18673,2;01/08/2014;8;August;2014\nMidmarket;Mexico;Paseo;High;1984;10;15;29760;3273,6;26486,4;19840;6646,4;01/08/2014;8;August;2014\nEnterprise;France;Paseo;High;2441;10;125;305125;33563,75;271561,25;292920;-21358,75;01/10/2014;10;October;2014\nGovernment;Germany;Paseo;High;2992;10;20;59840;6582,4;53257,6;29920;23337,6;01/10/2013;10;October;2013\nSmall Business;Canada;Paseo;High;1366;10;300;409800;45078;364722;341500;23222;01/11/2014;11;November;2014\nGovernment;France;Velo;High;2805;120;20;56100;6171;49929;28050;21879;01/09/2013;9;September;2013\nMidmarket;Mexico;Velo;High;655;120;15;9825;1080,75;8744,25;6550;2194,25;01/09/2013;9;September;2013\nGovernment;Mexico;Velo;High;344;120;350;120400;13244;107156;89440;17716;01/10/2013;10;October;2013\nGovernment;Canada;Velo;High;1808;120;7;12656;1392,16;11263,84;9040;2223,84;01/11/2014;11;November;2014\nChannel Partners;France;VTT;High;1734;250;12;20808;2288,88;18519,12;5202;13317,12;01/01/2014;1;January;2014\nEnterprise;Mexico;VTT;High;554;250;125;69250;7617,5;61632,5;66480;-4847,5;01/01/2014;1;January;2014\nGovernment;Canada;VTT;High;2935;250;20;58700;6457;52243;29350;22893;01/11/2013;11;November;2013\nEnterprise;Germany;Amarilla;High;3165;260;125;395625;43518,75;352106,25;379800;-27693,75;01/01/2014;1;January;2014\nGovernment;Mexico;Amarilla;High;2629;260;20;52580;5783,8;46796,2;26290;20506,2;01/01/2014;1;January;2014\nEnterprise;France;Amarilla;High;1433;260;125;179125;19703,75;159421,25;171960;-12538,75;01/05/2014;5;May;2014\nEnterprise;Mexico;Amarilla;High;947;260;125;118375;13021,25;105353,75;113640;-8286,25;01/09/2013;9;September;2013\nGovernment;Mexico;Amarilla;High;344;260;350;120400;13244;107156;89440;17716;01/10/2013;10;October;2013\nMidmarket;Mexico;Amarilla;High;2157;260;15;32355;3559,05;28795,95;21570;7225,95;01/12/2014;12;December;2014\nGovernment;United States of America;Paseo;High;380;10;7;2660;292,6;2367,4;1900;467,4;01/09/2013;9;September;2013\nGovernment;Mexico;Carretera;High;886;3;350;310100;37212;272888;230360;42528;01/06/2014;6;June;2014\nEnterprise;Canada;Carretera;High;2416;3;125;302000;36240;265760;289920;-24160;01/09/2013;9;September;2013\nEnterprise;Mexico;Carretera;High;2156;3;125;269500;32340;237160;258720;-21560;01/10/2014;10;October;2014\nMidmarket;Canada;Carretera;High;2689;3;15;40335;4840,2;35494,8;26890;8604,8;01/11/2014;11;November;2014\nMidmarket;United States of America;Montana;High;677;5;15;10155;1218,6;8936,4;6770;2166,4;01/03/2014;3;March;2014\nSmall Business;France;Montana;High;1773;5;300;531900;63828;468072;443250;24822;01/04/2014;4;April;2014\nGovernment;Mexico;Montana;High;2420;5;7;16940;2032,8;14907,2;12100;2807,2;01/09/2014;9;September;2014\nGovernment;Canada;Montana;High;2734;5;7;19138;2296,56;16841,44;13670;3171,44;01/10/2014;10;October;2014\nGovernment;Mexico;Montana;High;1715;5;20;34300;4116;30184;17150;13034;01/10/2013;10;October;2013\nSmall Business;France;Montana;High;1186;5;300;355800;42696;313104;296500;16604;01/12/2013;12;December;2013\nSmall Business;United States of America;Paseo;High;3495;10;300;1048500;125820;922680;873750;48930;01/01/2014;1;January;2014\nGovernment;Mexico;Paseo;High;886;10;350;310100;37212;272888;230360;42528;01/06/2014;6;June;2014\nEnterprise;Mexico;Paseo;High;2156;10;125;269500;32340;237160;258720;-21560;01/10/2014;10;October;2014\nGovernment;Mexico;Paseo;High;905;10;20;18100;2172;15928;9050;6878;01/10/2014;10;October;2014\nGovernment;Mexico;Paseo;High;1715;10;20;34300;4116;30184;17150;13034;01/10/2013;10;October;2013\nGovernment;France;Paseo;High;1594;10;350;557900;66948;490952;414440;76512;01/11/2014;11;November;2014\nSmall Business;Germany;Paseo;High;1359;10;300;407700;48924;358776;339750;19026;01/11/2014;11;November;2014\nSmall Business;Mexico;Paseo;High;2150;10;300;645000;77400;567600;537500;30100;01/11/2014;11;November;2014\nGovernment;Mexico;Paseo;High;1197;10;350;418950;50274;368676;311220;57456;01/11/2014;11;November;2014\nMidmarket;Mexico;Paseo;High;380;10;15;5700;684;5016;3800;1216;01/12/2013;12;December;2013\nGovernment;Mexico;Paseo;High;1233;10;20;24660;2959,2;21700,8;12330;9370,8;01/12/2014;12;December;2014\nGovernment;Mexico;Velo;High;1395;120;350;488250;58590;429660;362700;66960;01/07/2014;7;July;2014\nGovernment;United States of America;Velo;High;986;120;350;345100;41412;303688;256360;47328;01/10/2014;10;October;2014\nGovernment;Mexico;Velo;High;905;120;20;18100;2172;15928;9050;6878;01/10/2014;10;October;2014\nChannel Partners;Canada;VTT;High;2109;250;12;25308;3036,96;22271,04;6327;15944,04;01/05/2014;5;May;2014\nMidmarket;France;VTT;High;3874,5;250;15;58117,5;6974,1;51143,4;38745;12398,4;01/07/2014;7;July;2014\nGovernment;Canada;VTT;High;623;250;350;218050;26166;191884;161980;29904;01/09/2013;9;September;2013\nGovernment;United States of America;VTT;High;986;250;350;345100;41412;303688;256360;47328;01/10/2014;10;October;2014\nEnterprise;United States of America;VTT;High;2387;250;125;298375;35805;262570;286440;-23870;01/11/2014;11;November;2014\nGovernment;Mexico;VTT;High;1233;250;20;24660;2959,2;21700,8;12330;9370,8;01/12/2014;12;December;2014\nGovernment;United States of America;Amarilla;High;270;260;350;94500;11340;83160;70200;12960;01/02/2014;2;February;2014\nGovernment;France;Amarilla;High;3421,5;260;7;23950,5;2874,06;21076,44;17107,5;3968,94;01/07/2014;7;July;2014\nGovernment;Canada;Amarilla;High;2734;260;7;19138;2296,56;16841,44;13670;3171,44;01/10/2014;10;October;2014\nMidmarket;United States of America;Amarilla;High;2548;260;15;38220;4586,4;33633,6;25480;8153,6;01/11/2013;11;November;2013\nGovernment;France;Carretera;High;2521,5;3;20;50430;6051,6;44378,4;25215;19163,4;01/01/2014;1;January;2014\nChannel Partners;Mexico;Montana;High;2661;5;12;31932;3831,84;28100,16;7983;20117,16;01/05/2014;5;May;2014\nGovernment;Germany;Paseo;High;1531;10;20;30620;3674,4;26945,6;15310;11635,6;01/12/2014;12;December;2014\nGovernment;France;VTT;High;1491;250;7;10437;1252,44;9184,56;7455;1729,56;01/03/2014;3;March;2014\nGovernment;Germany;VTT;High;1531;250;20;30620;3674,4;26945,6;15310;11635,6;01/12/2014;12;December;2014\nChannel Partners;Canada;Amarilla;High;2761;260;12;33132;3975,84;29156,16;8283;20873,16;01/09/2013;9;September;2013\nMidmarket;United States of America;Carretera;High;2567;3;15;38505;5005,65;33499,35;25670;7829,35;01/06/2014;6;June;2014\nMidmarket;United States of America;VTT;High;2567;250;15;38505;5005,65;33499,35;25670;7829,35;01/06/2014;6;June;2014\nGovernment;Canada;Carretera;High;923;3;350;323050;41996,5;281053,5;239980;41073,5;01/03/2014;3;March;2014\nGovernment;France;Carretera;High;1790;3;350;626500;81445;545055;465400;79655;01/03/2014;3;March;2014\nGovernment;Germany;Carretera;High;442;3;20;8840;1149,2;7690,8;4420;3270,8;01/09/2013;9;September;2013\nGovernment;United States of America;Montana;High;982,5;5;350;343875;44703,75;299171,25;255450;43721,25;01/01/2014;1;January;2014\nGovernment;United States of America;Montana;High;1298;5;7;9086;1181,18;7904,82;6490;1414,82;01/02/2014;2;February;2014\nChannel Partners;Mexico;Montana;High;604;5;12;7248;942,24;6305,76;1812;4493,76;01/06/2014;6;June;2014\nGovernment;Mexico;Montana;High;2255;5;20;45100;5863;39237;22550;16687;01/07/2014;7;July;2014\nGovernment;Canada;Montana;High;1249;5;20;24980;3247,4;21732,6;12490;9242,6;01/10/2014;10;October;2014\nGovernment;United States of America;Paseo;High;1438,5;10;7;10069,5;1309,035;8760,465;7192,5;1567,965;01/01/2014;1;January;2014\nSmall Business;Germany;Paseo;High;807;10;300;242100;31473;210627;201750;8877;01/01/2014;1;January;2014\nGovernment;United States of America;Paseo;High;2641;10;20;52820;6866,6;45953,4;26410;19543,4;01/02/2014;2;February;2014\nGovernment;Germany;Paseo;High;2708;10;20;54160;7040,8;47119,2;27080;20039,2;01/02/2014;2;February;2014\nGovernment;Canada;Paseo;High;2632;10;350;921200;119756;801444;684320;117124;01/06/2014;6;June;2014\nEnterprise;Canada;Paseo;High;1583;10;125;197875;25723,75;172151,25;189960;-17808,75;01/06/2014;6;June;2014\nChannel Partners;Mexico;Paseo;High;571;10;12;6852;890,76;5961,24;1713;4248,24;01/07/2014;7;July;2014\nGovernment;France;Paseo;High;2696;10;7;18872;2453,36;16418,64;13480;2938,64;01/08/2014;8;August;2014\nMidmarket;Canada;Paseo;High;1565;10;15;23475;3051,75;20423,25;15650;4773,25;01/10/2014;10;October;2014\nGovernment;Canada;Paseo;High;1249;10;20;24980;3247,4;21732,6;12490;9242,6;01/10/2014;10;October;2014\nGovernment;Germany;Paseo;High;357;10;350;124950;16243,5;108706,5;92820;15886,5;01/11/2014;11;November;2014\nChannel Partners;Germany;Paseo;High;1013;10;12;12156;1580,28;10575,72;3039;7536,72;01/12/2014;12;December;2014\nMidmarket;France;Velo;High;3997,5;120;15;59962,5;7795,125;52167,375;39975;12192,375;01/01/2014;1;January;2014\nGovernment;Canada;Velo;High;2632;120;350;921200;119756;801444;684320;117124;01/06/2014;6;June;2014\nGovernment;France;Velo;High;1190;120;7;8330;1082,9;7247,1;5950;1297,1;01/06/2014;6;June;2014\nChannel Partners;Mexico;Velo;High;604;120;12;7248;942,24;6305,76;1812;4493,76;01/06/2014;6;June;2014\nMidmarket;Germany;Velo;High;660;120;15;9900;1287;8613;6600;2013;01/09/2013;9;September;2013\nChannel Partners;Mexico;Velo;High;410;120;12;4920;639,6;4280,4;1230;3050,4;01/10/2014;10;October;2014\nSmall Business;Mexico;Velo;High;2605;120;300;781500;101595;679905;651250;28655;01/11/2013;11;November;2013\nChannel Partners;Germany;Velo;High;1013;120;12;12156;1580,28;10575,72;3039;7536,72;01/12/2014;12;December;2014\nEnterprise;Canada;VTT;High;1583;250;125;197875;25723,75;172151,25;189960;-17808,75;01/06/2014;6;June;2014\nMidmarket;Canada;VTT;High;1565;250;15;23475;3051,75;20423,25;15650;4773,25;01/10/2014;10;October;2014\nEnterprise;Canada;Amarilla;High;1659;260;125;207375;26958,75;180416,25;199080;-18663,75;01/01/2014;1;January;2014\nGovernment;France;Amarilla;High;1190;260;7;8330;1082,9;7247,1;5950;1297,1;01/06/2014;6;June;2014\nChannel Partners;Mexico;Amarilla;High;410;260;12;4920;639,6;4280,4;1230;3050,4;01/10/2014;10;October;2014\nChannel Partners;Germany;Amarilla;High;1770;260;12;21240;2761,2;18478,8;5310;13168,8;01/12/2013;12;December;2013\nGovernment;Mexico;Carretera;High;2579;3;20;51580;7221,2;44358,8;25790;18568,8;01/04/2014;4;April;2014\nGovernment;United States of America;Carretera;High;1743;3;20;34860;4880,4;29979,6;17430;12549,6;01/05/2014;5;May;2014\nGovernment;United States of America;Carretera;High;2996;3;7;20972;2936,08;18035,92;14980;3055,92;01/10/2013;10;October;2013\nGovernment;Germany;Carretera;High;280;3;7;1960;274,4;1685,6;1400;285,6;01/12/2014;12;December;2014\nGovernment;France;Montana;High;293;5;7;2051;287,14;1763,86;1465;298,86;01/02/2014;2;February;2014\nGovernment;United States of America;Montana;High;2996;5;7;20972;2936,08;18035,92;14980;3055,92;01/10/2013;10;October;2013\nMidmarket;Germany;Paseo;High;278;10;15;4170;583,8;3586,2;2780;806,2;01/02/2014;2;February;2014\nGovernment;Canada;Paseo;High;2428;10;20;48560;6798,4;41761,6;24280;17481,6;01/03/2014;3;March;2014\nMidmarket;United States of America;Paseo;High;1767;10;15;26505;3710,7;22794,3;17670;5124,3;01/09/2014;9;September;2014\nChannel Partners;France;Paseo;High;1393;10;12;16716;2340,24;14375,76;4179;10196,76;01/10/2014;10;October;2014\nGovernment;Germany;VTT;High;280;250;7;1960;274,4;1685,6;1400;285,6;01/12/2014;12;December;2014\nChannel Partners;France;Amarilla;High;1393;260;12;16716;2340,24;14375,76;4179;10196,76;01/10/2014;10;October;2014\nChannel Partners;United States of America;Amarilla;High;2015;260;12;24180;3385,2;20794,8;6045;14749,8;01/12/2013;12;December;2013\nSmall Business;Mexico;Carretera;High;801;3;300;240300;33642;206658;200250;6408;01/07/2014;7;July;2014\nEnterprise;France;Carretera;High;1023;3;125;127875;17902,5;109972,5;122760;-12787,5;01/09/2013;9;September;2013\nSmall Business;Canada;Carretera;High;1496;3;300;448800;62832;385968;374000;11968;01/10/2014;10;October;2014\nSmall Business;United States of America;Carretera;High;1010;3;300;303000;42420;260580;252500;8080;01/10/2014;10;October;2014\nMidmarket;Germany;Carretera;High;1513;3;15;22695;3177,3;19517,7;15130;4387,7;01/11/2014;11;November;2014\nMidmarket;Canada;Carretera;High;2300;3;15;34500;4830;29670;23000;6670;01/12/2014;12;December;2014\nEnterprise;Mexico;Carretera;High;2821;3;125;352625;49367,5;303257,5;338520;-35262,5;01/12/2013;12;December;2013\nGovernment;Canada;Montana;High;2227,5;5;350;779625;109147,5;670477,5;579150;91327,5;01/01/2014;1;January;2014\nGovernment;Germany;Montana;High;1199;5;350;419650;58751;360899;311740;49159;01/04/2014;4;April;2014\nGovernment;Canada;Montana;High;200;5;350;70000;9800;60200;52000;8200;01/05/2014;5;May;2014\nGovernment;Canada;Montana;High;388;5;7;2716;380,24;2335,76;1940;395,76;01/09/2014;9;September;2014\nGovernment;Mexico;Montana;High;1727;5;7;12089;1692,46;10396,54;8635;1761,54;01/10/2013;10;October;2013\nMidmarket;Canada;Montana;High;2300;5;15;34500;4830;29670;23000;6670;01/12/2014;12;December;2014\nGovernment;Mexico;Paseo;High;260;10;20;5200;728;4472;2600;1872;01/02/2014;2;February;2014\nMidmarket;Canada;Paseo;High;2470;10;15;37050;5187;31863;24700;7163;01/09/2013;9;September;2013\nMidmarket;Canada;Paseo;High;1743;10;15;26145;3660,3;22484,7;17430;5054,7;01/10/2013;10;October;2013\nChannel Partners;United States of America;Paseo;High;2914;10;12;34968;4895,52;30072,48;8742;21330,48;01/10/2014;10;October;2014\nGovernment;France;Paseo;High;1731;10;7;12117;1696,38;10420,62;8655;1765,62;01/10/2014;10;October;2014\nGovernment;Canada;Paseo;High;700;10;350;245000;34300;210700;182000;28700;01/11/2014;11;November;2014\nChannel Partners;Canada;Paseo;High;2222;10;12;26664;3732,96;22931,04;6666;16265,04;01/11/2013;11;November;2013\nGovernment;United States of America;Paseo;High;1177;10;350;411950;57673;354277;306020;48257;01/11/2014;11;November;2014\nGovernment;France;Paseo;High;1922;10;350;672700;94178;578522;499720;78802;01/11/2013;11;November;2013\nEnterprise;Mexico;Velo;High;1575;120;125;196875;27562,5;169312,5;189000;-19687,5;01/02/2014;2;February;2014\nGovernment;United States of America;Velo;High;606;120;20;12120;1696,8;10423,2;6060;4363,2;01/04/2014;4;April;2014\nSmall Business;United States of America;Velo;High;2460;120;300;738000;103320;634680;615000;19680;01/07/2014;7;July;2014\nSmall Business;Canada;Velo;High;269;120;300;80700;11298;69402;67250;2152;01/10/2013;10;October;2013\nSmall Business;Germany;Velo;High;2536;120;300;760800;106512;654288;634000;20288;01/11/2013;11;November;2013\nGovernment;Mexico;VTT;High;2903;250;7;20321;2844,94;17476,06;14515;2961,06;01/03/2014;3;March;2014\nSmall Business;United States of America;VTT;High;2541;250;300;762300;106722;655578;635250;20328;01/08/2014;8;August;2014\nSmall Business;Canada;VTT;High;269;250;300;80700;11298;69402;67250;2152;01/10/2013;10;October;2013\nSmall Business;Canada;VTT;High;1496;250;300;448800;62832;385968;374000;11968;01/10/2014;10;October;2014\nSmall Business;United States of America;VTT;High;1010;250;300;303000;42420;260580;252500;8080;01/10/2014;10;October;2014\nGovernment;France;VTT;High;1281;250;350;448350;62769;385581;333060;52521;01/12/2013;12;December;2013\nSmall Business;Canada;Amarilla;High;888;260;300;266400;37296;229104;222000;7104;01/03/2014;3;March;2014\nEnterprise;United States of America;Amarilla;High;2844;260;125;355500;49770;305730;341280;-35550;01/05/2014;5;May;2014\nChannel Partners;France;Amarilla;High;2475;260;12;29700;4158;25542;7425;18117;01/08/2014;8;August;2014\nMidmarket;Canada;Amarilla;High;1743;260;15;26145;3660,3;22484,7;17430;5054,7;01/10/2013;10;October;2013\nChannel Partners;United States of America;Amarilla;High;2914;260;12;34968;4895,52;30072,48;8742;21330,48;01/10/2014;10;October;2014\nGovernment;France;Amarilla;High;1731;260;7;12117;1696,38;10420,62;8655;1765,62;01/10/2014;10;October;2014\nGovernment;Mexico;Amarilla;High;1727;260;7;12089;1692,46;10396,54;8635;1761,54;01/10/2013;10;October;2013\nMidmarket;Mexico;Amarilla;High;1870;260;15;28050;3927;24123;18700;5423;01/11/2013;11;November;2013\nEnterprise;France;Carretera;High;1174;3;125;146750;22012,5;124737,5;140880;-16142,5;01/08/2014;8;August;2014\nEnterprise;Germany;Carretera;High;2767;3;125;345875;51881,25;293993,75;332040;-38046,25;01/08/2014;8;August;2014\nEnterprise;Germany;Carretera;High;1085;3;125;135625;20343,75;115281,25;130200;-14918,75;01/10/2014;10;October;2014\nSmall Business;Mexico;Montana;High;546;5;300;163800;24570;139230;136500;2730;01/10/2014;10;October;2014\nGovernment;Germany;Paseo;High;1158;10;20;23160;3474;19686;11580;8106;01/03/2014;3;March;2014\nMidmarket;Canada;Paseo;High;1614;10;15;24210;3631,5;20578,5;16140;4438,5;01/04/2014;4;April;2014\nGovernment;Mexico;Paseo;High;2535;10;7;17745;2661,75;15083,25;12675;2408,25;01/04/2014;4;April;2014\nGovernment;Mexico;Paseo;High;2851;10;350;997850;149677,5;848172,5;741260;106912,5;01/05/2014;5;May;2014\nMidmarket;Canada;Paseo;High;2559;10;15;38385;5757,75;32627,25;25590;7037,25;01/08/2014;8;August;2014\nGovernment;United States of America;Paseo;High;267;10;20;5340;801;4539;2670;1869;01/10/2013;10;October;2013\nEnterprise;Germany;Paseo;High;1085;10;125;135625;20343,75;115281,25;130200;-14918,75;01/10/2014;10;October;2014\nMidmarket;Germany;Paseo;High;1175;10;15;17625;2643,75;14981,25;11750;3231,25;01/10/2014;10;October;2014\nGovernment;United States of America;Paseo;High;2007;10;350;702450;105367,5;597082,5;521820;75262,5;01/11/2013;11;November;2013\nGovernment;Mexico;Paseo;High;2151;10;350;752850;112927,5;639922,5;559260;80662,5;01/11/2013;11;November;2013\nChannel Partners;United States of America;Paseo;High;914;10;12;10968;1645,2;9322,8;2742;6580,8;01/12/2014;12;December;2014\nGovernment;France;Paseo;High;293;10;20;5860;879;4981;2930;2051;01/12/2014;12;December;2014\nChannel Partners;Mexico;Velo;High;500;120;12;6000;900;5100;1500;3600;01/03/2014;3;March;2014\nMidmarket;France;Velo;High;2826;120;15;42390;6358,5;36031,5;28260;7771,5;01/05/2014;5;May;2014\nEnterprise;France;Velo;High;663;120;125;82875;12431,25;70443,75;79560;-9116,25;01/09/2014;9;September;2014\nSmall Business;United States of America;Velo;High;2574;120;300;772200;115830;656370;643500;12870;01/11/2013;11;November;2013\nEnterprise;United States of America;Velo;High;2438;120;125;304750;45712,5;259037,5;292560;-33522,5;01/12/2013;12;December;2013\nChannel Partners;United States of America;Velo;High;914;120;12;10968;1645,2;9322,8;2742;6580,8;01/12/2014;12;December;2014\nGovernment;Canada;VTT;High;865,5;250;20;17310;2596,5;14713,5;8655;6058,5;01/07/2014;7;July;2014\nMidmarket;Germany;VTT;High;492;250;15;7380;1107;6273;4920;1353;01/07/2014;7;July;2014\nGovernment;United States of America;VTT;High;267;250;20;5340;801;4539;2670;1869;01/10/2013;10;October;2013\nMidmarket;Germany;VTT;High;1175;250;15;17625;2643,75;14981,25;11750;3231,25;01/10/2014;10;October;2014\nEnterprise;Canada;VTT;High;2954;250;125;369250;55387,5;313862,5;354480;-40617,5;01/11/2013;11;November;2013\nEnterprise;Germany;VTT;High;552;250;125;69000;10350;58650;66240;-7590;01/11/2014;11;November;2014\nGovernment;France;VTT;High;293;250;20;5860;879;4981;2930;2051;01/12/2014;12;December;2014\nSmall Business;France;Amarilla;High;2475;260;300;742500;111375;631125;618750;12375;01/03/2014;3;March;2014\nSmall Business;Mexico;Amarilla;High;546;260;300;163800;24570;139230;136500;2730;01/10/2014;10;October;2014\nGovernment;Mexico;Montana;High;1368;5;7;9576;1436,4;8139,6;6840;1299,6;01/02/2014;2;February;2014\nGovernment;Canada;Paseo;High;723;10;7;5061;759,15;4301,85;3615;686,85;01/04/2014;4;April;2014\nChannel Partners;United States of America;VTT;High;1806;250;12;21672;3250,8;18421,2;5418;13003,2;01/05/2014;5;May;2014"

/***/ }),

/***/ "./test/index.js":
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _src = __webpack_require__(/*! ../src */ "./src/index.js");

var _src2 = _interopRequireDefault(_src);

var _axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");

var _axios2 = _interopRequireDefault(_axios);

var _view = __webpack_require__(/*! ./view */ "./test/view.js");

var _view2 = _interopRequireDefault(_view);

var _operations = __webpack_require__(/*! ./operations.elastic */ "./test/operations.elastic.js");

var _operations2 = _interopRequireDefault(_operations);

var _operations3 = __webpack_require__(/*! ./operations.csv */ "./test/operations.csv.js");

var _operations4 = _interopRequireDefault(_operations3);

var _csv = __webpack_require__(/*! ../src/adapters/csv */ "./src/adapters/csv.js");

var _csv2 = _interopRequireDefault(_csv);

var _data = __webpack_require__(/*! ./data1.csv */ "./test/data1.csv");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function elasticsearch() {
    var definition = {
        cols: [{ dimension: 'modelo' }, { measure: 'doc_count' }],
        rows: [{ dimension: 'calibre' }],
        filters: [{
            type: 'list',
            dimension: 'modelo',
            value: ['PT 24/7', 'PT 24/7 PRÓ', 'PT 100', 'MD1', '94', '85 S', '87', '122.2']
        }]
    };

    var cube = new _src2.default(definition, 'elasticsearch');

    var query = cube.getQuery();

    (0, _axios2.default)({
        method: 'post',
        url: 'http://localhost:3000/armas/search',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: query
    }).then(function (response) {
        cube.setData(response.data);

        (0, _operations2.default)(cube);
        (0, _view2.default)(cube);
        console.log('complete');
    }).catch(function (error) {
        console.log(error);
    });
}

// @ts-ignore
// @ts-check

function csv() {
    var cube = void 0,
        definition = void 0,
        data = void 0;

    _src2.default.defaults({
        precision: 0,
        thousand: '',
        decimal: ','
    });

    data = _csv2.default.toDataset(_data2.default);
    definition = {
        cols: [{ dimension: 'Segment' }, { dimension: 'Year' }],
        rows: [
        //{dimension: 'Country'}, 
        { measure: 'Sale Price' /*, prefix:'R$ '*/ }, { measure: 'Manufacturing Price' /*, prefix:'R$ '*/ }, { measure: 'Profit' }],
        filters: []
    };

    cube = new _src2.default(definition);

    cube.createField({
        key: 'Profit',
        expression: function expression(row) {
            return row['Sale Price'] - row['Manufacturing Price'];
        }
    });
    cube.setDataset(data);

    showOperations(_operations4.default, cube);
    renderCube(cube);

    console.log('csv test complete');
}

function showOperations(operations, cube) {
    var html = '';

    operations.forEach(function (op, index) {
        var i = (index < 9 ? '0' : '') + (index + 1);
        var display = op.description || op.operation + displayValue(op.dimension) + displayValue(op.position) + displayValue(op.reference) + displayValue(op.expression);
        html += '<label class="input-operation">' + i + ' <input onchange="opCheckbox_onChange(this, ' + index + ')" type="checkbox"> ' + display + '</label>';
    });

    document.getElementById('operations').innerHTML = html;

    function displayValue(value) {
        return value ? ' [' + value + ']' : '';
    }

    window['opCheckbox_onChange'] = function (checkbox, index) {
        var op = operations[index];

        op._checked = checkbox.checked;

        cube.clearOperations();

        operations.forEach(function (o) {
            if (o._checked) {
                cube.addOperation(o);
            }
        });

        renderCube(cube);
    };
}

function renderCube(cube) {
    cube.applyOperations();
    (0, _view2.default)(cube);
}

csv();

/***/ }),

/***/ "./test/operations.csv.js":
/*!********************************!*\
  !*** ./test/operations.csv.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = [
// {
//     operation: 'REMOVE_ROW',
//     reference: 'France'
// }

{
    key: 'opSortRows',
    operation: 'SORT_ROWS',
    dimension: 'Country',
    order: 'desc'
}, {
    key: 'opSortCols',
    operation: 'SORT_COLS',
    dimension: 'Year'
}, {
    key: 'Gover_Total',
    operation: 'ADD_COL',
    position: 'after',
    reference: 'Government2014',
    expression: 'SUM(VALUES("Government2013", "Government2014"))',
    display: 'Gover Total',
    summary: true
}, {
    key: 'Gover_Diff',
    operation: 'ADD_COL',
    position: 'after',
    reference: 'Gover_Total',
    expression: 'IF(VALUE("Government2013") - $("Government2014") > 0, 1, 0)',
    display: 'Gover Diff',
    summary: true
}, {
    key: 'Gover_Accum_2014',
    operation: 'ADD_COL',
    position: 'after',
    reference: 'Gover_Diff',
    expression: '$("Government2014") + VALUEX("Gover_Accum_2014", $INDEX - 1)',
    display: 'Accum 2014',
    summary: true
}, {
    key: 'Accum_France',
    operation: 'ADD_ROW',
    position: 'after',
    reference: 'France',
    expression: '$("FranceSale Price") + VALUEX("Accum_France", $INDEX - 1)',
    display: 'Accum France',
    summary: true
}, {
    key: 'opShowTotalRow',
    operation: 'ADD_ROW',
    expression: 'SUM()',
    display: 'total',
    priority: 1000
}, {
    key: 'opShowTotalCol',
    operation: 'ADD_COL',
    expression: 'SUM()',
    display: 'total',
    priority: 1000
},

// {
//     key: 'op_principais',
//     operation: 'ADD_ROW',
//     position: 'after',
//     reference: 'Germany',
//     expression: 'SUM(VALUES())',
//     display: 'Channel Partners Total'
// }

{
    key: 'traduzir',
    operation: 'ALIAS',
    values: {
        'Government': 'Governamental',
        'Midmarket': 'Mercado',
        'Channel Partners': 'Parceiros do Canal',
        'Sale Price': 'Preço',
        'Manufacturing Price': 'Custo',
        'Profit': 'Lucro',
        'United States of America': 'USA'
    }
},

// {
//     key: 'merge-01',
//     operation: 'MERGE_COLS',
//     references: ['Midmarket', 'Government'],
//     display: "MERGE",
//     position: 'before',
//     reference: 'Channel Partners'
// }

{
    key: 'merge-1',
    description: 'Merge cols: Government | Midmarket | Enterprise | Small Business',
    operation: 'MERGE_COLS',
    // references: ['Canada', 'Mexico', 'United States of America'],
    references: ['Government', 'Midmarket', 'Enterprise', 'Small Business'],
    display: 'Merge1'
}, {
    key: 'merge-Government',
    description: 'Merge rows: Government 2013 | Government 2014',
    operation: 'MERGE_COLS',
    references: ['Government2013', 'Government2014'],
    display: 'Government'
}, {
    key: 'merge-2',
    description: 'Merge rows: Sale Price | Manufacturing Price |Profit',
    operation: 'MERGE_ROWS',
    // references: ['Canada', 'Mexico', 'United States of America'],
    references: ['Sale Price', 'Manufacturing Price', 'Profit'],
    display: 'Merge2'
}, {
    key: 'merge-europe',
    operation: 'MERGE_ROWS',
    references: ['Germany', 'France'],
    display: 'Europe'
}];

/***/ }),

/***/ "./test/operations.elastic.js":
/*!************************************!*\
  !*** ./test/operations.elastic.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cube) {
    cube.addOperation({
        key: 'opShowTotalRow',
        operation: 'ADD_ROW',
        expression: 'SUMMARY()',
        display: 'total',
        priority: 1000
    });

    cube.addOperation({
        key: 'opShowTotalCol',
        operation: 'ADD_COL',
        expression: 'SUMMARY()',
        display: 'total',
        priority: 1000
    });

    cube.addOperation({
        key: 'op_principais',
        operation: 'ADD_COL',
        position: 'after',
        reference: '87',
        expression: 'SUM(VALUES("94", "85 S", "87"))',
        display: 'principais'
    });

    /*cube.addOperation({
        operation: 'REMOVE_ROW',
        reference: 'TAURUS'
    })
     cube.addOperation({
        operation: 'REMOVE_ROW',
        reference: 'ROSSI'
    })
     cube.addOperation({
        operation: 'REMOVE_ROW',
        reference: 'CBC'
    }) */

    cube.addOperation({
        key: 'merge-pt',
        operation: 'MERGE_COLS',
        references: ['PT 24/7 PRÓ', 'PT 24/7', 'PT 100'],
        display: "PT's"
    });

    cube.addOperation({
        key: 'merge-38',
        operation: 'MERGE_ROWS',
        references: ['38', '.38', '38 SPL', '0,38', '38 SPECIAL'],
        display: '38'
    });

    cube.applyOperations();
};

/***/ }),

/***/ "./test/view.js":
/*!**********************!*\
  !*** ./test/view.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (cube) {
    (0, _view2.default)(cube, 'table');
};

var _view = __webpack_require__(/*! ../src/view */ "./src/view.js");

var _view2 = _interopRequireDefault(_view);

var _cubejs = __webpack_require__(/*! ../src/cubejs.css */ "./src/cubejs.css");

var _cubejs2 = _interopRequireDefault(_cubejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var style = document.createElement('style');

// @ts-ignore

style.type = 'text/css';
style.innerHTML = _cubejs2.default.toString();
document.getElementsByTagName('head')[0].appendChild(style);

/***/ })

/******/ });
//# sourceMappingURL=test.js.map