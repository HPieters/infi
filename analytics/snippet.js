if (typeof window._pta !== "object") {
  window._pta = (function (window) {
    "use strict";

    /**
     * Create new pta tracking client
     *
     * @param {*} siteID
     * @param {*} serverUrl
     */
    function create(siteID, serverUrl, options) {
      this.siteID = siteID;
      this.serverUrl = serverUrl ? serverUrl : "http://localhost:3000/";
      this.sessionId = getSessionID(document);
      this.debug = options && options.debug ? options.debug : false;
      this.fingerPrint = false;
    }

    /**
     * Track pageview
     */
    function track() {
      if (!this.siteID) {
        if (this.debug) {
          // eslint-disable-next-line
          window.console && console.error("No trackingId found.");
        }
        return;
      }

      if (!this.sessionId) {
        this.sessionId = "SERVER_RESOLVE";
      }

      var dataObject = {
        siteID: this.siteID,
        sessionID: this.sessionId,
        currentUrl: getCurrentBrowserUrl(window),
        utm: getUTMParameters(getCurrentBrowserUrl(window)),
        referrer: getReferrer(document),
        resolution: getScreenResolution(window),
        language: getLanguage(navigator),
        browser: getBrowser(window),
        userAgent: navigator.userAgent,
        fingerPrint: this.fingerPrint,
      };
      ajax(this.serverUrl + "api/event", dataObject, function (err) {
        if (err && this.debug) {
          // eslint-disable-next-line
          window.console && console.error(err);
        }
      });
    }

    /**
     *
     */
    function getCurrentBrowserUrl(windowObject) {
      var currentUrl = windowObject.location.pathname;
      if (currentUrl === "/") {
        currentUrl = "/home";
      }
      currentUrl = currentUrl.replace(/\/$/, "");
      return currentUrl || "SERVER_RESOLVE";
    }

    /**
     * Get UTM parameters from a url
     *
     * @param {*} url
     */
    function getUTMParameters(url) {
      if (!url || url === "SERVER_RESOLVE") {
        return "SERVER_RESOLVE";
      }

      var queryObject = getQueryString(window.location.search);

      if (!queryObject.utm_source) {
        return {};
      }

      return {
        utm_source: queryObject.utm_source || undefined,
        utm_medium: queryObject.utm_medium || undefined,
        utm_term: queryObject.utm_term || undefined,
        utm_content: queryObject.utm_content || undefined,
        utm_campaign: queryObject.utm_campaign || undefined,
      };
    }

    /**
     * Get "Actual" browser
     *
     * @param {object} _window Window object
     */
    function getBrowser(_window) {
      // Opera 8.0+
      // eslint-disable-next-line no-undef
      var isOpera =
        (!!_window.opr && !!opr.addons) ||
        !!_window.opera ||
        navigator.userAgent.indexOf(" OPR/") >= 0;
      // Firefox 1.0+
      var isFirefox = typeof InstallTrigger !== "undefined";
      // Safari 3.0+ "[object HTMLElementConstructor]"
      var isSafari =
        /constructor/i.test(_window.HTMLElement) ||
        (function (p) {
          return p.toString() === "[object SafariRemoteNotification]";
        })(!_window["safari"] || safari.pushNotification); // eslint-disable-line no-undef
      // Internet Explorer 6-11
      var isIE = /*@cc_on!@*/ false || !!document.documentMode;
      // Edge 20+
      var isEdge = !isIE && !!_window.StyleMedia;
      // Chrome 1+
      var isChrome = !!_window.chrome && !!_window.chrome.webstore;

      var browser = isOpera
        ? "Opera"
        : isFirefox
        ? "Firefox"
        : isSafari
        ? "Safari"
        : isChrome
        ? "Chrome"
        : isIE
        ? "IE"
        : isEdge
        ? "Edge"
        : "UNKNOWN";

      return browser;
    }

    /**
     * Get language from browser
     *
     * @param {object} _navigator Navigtor object
     */
    function getLanguage(_navigator) {
      return _navigator.language || _navigator.userLanguage;
    }

    /**
     * IE 6+, Firefox, Opera, Chrome, Safari XHR object
     *
     * @param {mixed} window
     */
    function getScreenResolution(_window) {
      var height = _window.screen.height || 0;
      var width = _window.screen.width || 0;

      return {
        height: height,
        width: width,
      };
    }

    /**
     * Get referrer from document information
     *
     * Support level: DOM Level 2: referrer
     *
     * @param {*} document
     */
    function getReferrer(document) {
      return document.referrer || "direct";
    }

    /**
     * Return or generate a new session id
     *
     * @param {object} _document
     */
    function getSessionID(_document) {
      var cookieValue = readCookie(_document, "_pta");

      if (
        cookieValue !== "undefined" &&
        cookieValue !== null &&
        typeof cookieValue === "string"
      ) {
        return cookieValue;
      }

      var sessionID = generateUUID();
      createCookie(_document, "_pta", sessionID, 365);
      return sessionID;
    }

    /**
     * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
     *
     * Courtesy of https://gist.github.com/Xeoncross/7663273
     *
     * @param {string} url
     * @param {mixed} data
     * @param {function} callback
     * @param {null} xhr
     */
    function ajax(url, data, callback, x) {
      try {
        x = new (window.XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0"); // eslint-disable-line
        x.open("POST", url, 1);
        x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        x.setRequestHeader("Accept", "application/json");
        x.setRequestHeader("Content-type", "application/json");
        x.onreadystatechange = function () {
          x.readyState > 3 && callback && callback(null, x.responseText, x);
        };
        x.send(JSON.stringify(data));
      } catch (e) {
        // @TODO If no Ajax try inserting a pixel
        if (this.debug) {
          window.console && console.error(e); // eslint-disable-line no-console
        }
      }
    }

    /**
     * Transform query string into object
     *
     * @param {string} locationSearch
     */
    function getQueryString(locationSearch) {
      var queryString = {};

      if (!locationSearch === "") {
        return queryString;
      }

      var temp;
      var i;
      var l;
      var query = locationSearch.slice(1).split("&");

      for (i = 0, l = query.length; i < l; i++) {
        temp = query[i].split("=");
        queryString[temp[0]] = temp[1];
      }

      return queryString;
    }

    /**
     * Create a new cookie
     *
     * Addapted from https://www.quirksmode.org/js/cookies.html
     *
     * @param {String} name
     * @param {Mixed} value
     * @param {Number} days
     */
    function createCookie(_document, name, value, days) {
      var expires = "";

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
      }
      try {
        _document.cookie = name + "=" + value + expires + "; path=/";
      } catch (e) {
        // Unable to set cookie, server will need to do fingerprinting
        this.fingerPrint = true;
      }
    }

    /**
     * readCookie
     *
     * Addapted from https://www.quirksmode.org/js/cookies.html
     *
     * @param {String} name
     */
    function readCookie(_document, name) {
      var nameEQ = name + "=";
      var ca = _document.cookie.split(";");

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }

      return null;
    }

    /**
     * Generate a UUID
     */
    function generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    return {
      create: create,
      track: track,
    };
  })(window);
}
