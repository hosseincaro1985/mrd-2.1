/**
 * ============================================================
 *  UTILS v5.0 — Emotion Spaceship Shared Utilities
 *  Pure helpers — zero content access, zero storage access
 * ============================================================
 *
 *  Dependencies: NONE
 *  Consumes:     NONE (standalone)
 *  Produces:     Utils (global)
 *
 *  Compatible with:
 *    content-layer.js, answer-store.js,
 *    engine.js, renderers.js, app.js
 *
 *  Load order: after answer-store.js, before renderers.js
 *
 *  Rules:
 *    - Zero direct CONTENT access
 *    - Zero ContentLayer usage
 *    - Zero AnswerStore usage
 *    - Zero localStorage for answers
 *    - Zero station.number references
 *    - Zero story.question references
 *    - Pure utility functions only
 *
 * ============================================================
 */

var Utils = (function () {
  'use strict';



  /* ============================================================
   *  PERSIAN DIGITS
   * ============================================================ */

  var _PDIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  /**
   * Convert a number or numeric string to Persian digits.
   * Handles integers, floats, negatives.
   *
   * @param  {number|string} n
   * @return {string}
   */
  function toPersianNum(n) {
    if (n === null || n === undefined) return '';
    return String(n).replace(/[0-9]/g, function (d) {
      return _PDIGITS[parseInt(d, 10)];
    });
  }

  /**
   * Alias for toPersianNum (shorter name).
   */
  var toFa = toPersianNum;



  /* ============================================================
   *  TIME FORMATTING
   * ============================================================ */

  /**
   * Format seconds to mm:ss or hh:mm:ss.
   *
   * @param  {number} totalSeconds
   * @param  {boolean} [showHours=false] — force hours display
   * @return {string} e.g. "۰۳:۴۵" or "۰۱:۰۳:۴۵"
   */
  function formatT(totalSeconds, showHours) {
    if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0) {
      return '۰۰:۰۰';
    }

    var s  = Math.floor(totalSeconds);
    var h  = Math.floor(s / 3600);
    var m  = Math.floor((s % 3600) / 60);
    var sc = s % 60;

    var pad2 = function (v) {
      return v < 10 ? '0' + v : '' + v;
    };

    if (h > 0 || showHours) {
      return toPersianNum(pad2(h) + ':' + pad2(m) + ':' + pad2(sc));
    }
    return toPersianNum(pad2(m) + ':' + pad2(sc));
  }

  /**
   * Format a Unix timestamp (ms) to a Persian-readable date+time.
   *
   * @param  {number} timestamp — milliseconds since epoch
   * @return {string} e.g. "۱۴۰۳/۰۳/۱۵  ۱۲:۳۰"
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) return '';

    try {
      var d = new Date(timestamp);

      var year   = d.getFullYear();
      var month  = _pad(d.getMonth() + 1);
      var day    = _pad(d.getDate());
      var hour   = _pad(d.getHours());
      var minute = _pad(d.getMinutes());

      var gregorian = year + '/' + month + '/' + day + '  ' + hour + ':' + minute;
      return toPersianNum(gregorian);
    } catch (e) {
      return '';
    }
  }

  /**
   * Format duration in milliseconds to a human-readable Persian string.
   *
   * @param  {number} ms — milliseconds
   * @return {string} e.g. "۲ ساعت و ۱۵ دقیقه" or "۳ دقیقه و ۲۰ ثانیه"
   */
  function formatDuration(ms) {
    if (!ms || ms < 0) return '۰ ثانیه';

    var totalSec = Math.floor(ms / 1000);
    var h  = Math.floor(totalSec / 3600);
    var m  = Math.floor((totalSec % 3600) / 60);
    var s  = totalSec % 60;

    var parts = [];
    if (h > 0) parts.push(toPersianNum(h) + ' ساعت');
    if (m > 0) parts.push(toPersianNum(m) + ' دقیقه');
    if (s > 0 || parts.length === 0) parts.push(toPersianNum(s) + ' ثانیه');

    return parts.join(' و ');
  }



  /* ============================================================
   *  WORD & TEXT UTILITIES
   * ============================================================ */

  /**
   * Count words in a string.
   * Handles Persian and Latin text.
   *
   * @param  {string} text
   * @return {number}
   */
  function countWords(text) {
    if (!text) return 0;
    var trimmed = String(text).trim();
    if (trimmed.length === 0) return 0;
    return trimmed.split(/\s+/).filter(function (w) {
      return w.length > 0;
    }).length;
  }

  /**
   * Escape HTML special characters.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  /**
   * Strip HTML tags from a string.
   *
   * @param  {string} html
   * @return {string} plain text
   */
  function stripHtml(html) {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '');
  }

  /**
   * Truncate text to a maximum length, adding ellipsis.
   *
   * @param  {string} text
   * @param  {number} maxLen
   * @param  {string} [suffix='...']
   * @return {string}
   */
  function truncate(text, maxLen, suffix) {
    if (!text) return '';
    if (suffix === undefined) suffix = '...';
    text = String(text);
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen).trimRight() + suffix;
  }

  /**
   * Normalize Persian/Arabic characters.
   * Converts Arabic kaf/yeh/alef to Persian equivalents.
   *
   * @param  {string} text
   * @return {string}
   */
  function normalizePersian(text) {
    if (!text) return '';
    return String(text)
      .replace(/ك/g, 'ک')
      .replace(/ي/g, 'ی')
      .replace(/ء/g, 'ٔ')
      .replace(/\u064A/g, 'ی')   // Arabic yeh → Persian yeh
      .replace(/\u0643/g, 'ک')   // Arabic kaf → Persian kaf
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, '') // zero-width chars
      .replace(/\u00A0/g, ' ');  // nbsp → space
  }



  /* ============================================================
   *  TOAST NOTIFICATION
   * ============================================================ */

  var _toastTimer = null;
  var _toastEl    = null;

  /**
   * Show a temporary toast message.
   * Creates a floating element if no target is provided.
   *
   * @param {string}  message
   * @param {string}  [type='info'] — 'success' | 'error' | 'info' | 'warning'
   * @param {number}  [duration=3000] — ms
   * @param {Element} [target] — optional DOM element to fill
   */
  function showToastMsg(message, type, duration, target) {
    type     = type     || 'info';
    duration = duration || 3000;

    /* ── If target element provided, use it directly ── */
    if (target) {
      target.textContent  = message;
      target.style.display = 'block';
      target.className = 'msg msg--' + type;

      _clearToastTimer();
      _toastTimer = setTimeout(function () {
        target.style.display = 'none';
        _toastTimer = null;
      }, duration);
      return;
    }

    /* ── Otherwise create a floating toast ── */
    _removeToast();

    var el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    el.textContent = message;

    /* Styles (inline for self-containment) */
    el.style.cssText =
      'position:fixed;' +
      'bottom:24px;' +
      'left:50%;' +
      'transform:translateX(-50%);' +
      'padding:12px 24px;' +
      'border-radius:10px;' +
      'font-family:inherit;' +
      'font-size:0.95rem;' +
      'z-index:10000;' +
      'text-align:center;' +
      'max-width:90vw;' +
      'direction:rtl;' +
      'opacity:0;' +
      'transition:opacity 0.3s ease;' +
      'pointer-events:none;';

    switch (type) {
      case 'success':
        el.style.background = 'rgba(34,197,94,0.92)';
        el.style.color      = '#fff';
        break;
      case 'error':
        el.style.background = 'rgba(239,68,68,0.92)';
        el.style.color      = '#fff';
        break;
      case 'warning':
        el.style.background = 'rgba(245,158,11,0.92)';
        el.style.color      = '#fff';
        break;
      default:
        el.style.background = 'rgba(30,30,60,0.92)';
        el.style.color      = '#e0e0e0';
        el.style.border     = '1px solid rgba(255,255,255,0.15)';
    }

    document.body.appendChild(el);
    _toastEl = el;

    /* Fade in */
    requestAnimationFrame(function () {
      if (_toastEl) {
        _toastEl.style.opacity = '1';
      }
    });

    /* Auto-remove */
    _clearToastTimer();
    _toastTimer = setTimeout(function () {
      _removeToast();
    }, duration);
  }

  function _removeToast() {
    _clearToastTimer();
    if (_toastEl && _toastEl.parentNode) {
      _toastEl.style.opacity = '0';
      var el = _toastEl;
      setTimeout(function () {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 300);
    }
    _toastEl = null;
  }

  function _clearToastTimer() {
    if (_toastTimer) {
      clearTimeout(_toastTimer);
      _toastTimer = null;
    }
  }



  /* ============================================================
   *  DEBOUNCE & THROTTLE
   * ============================================================ */

  /**
   * Debounce a function call.
   *
   * @param  {Function} fn
   * @param  {number}   delay — ms
   * @return {Function}
   */
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var ctx  = this;
      var args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        fn.apply(ctx, args);
      }, delay);
    };
  }

  /**
   * Throttle a function call.
   *
   * @param  {Function} fn
   * @param  {number}   interval — ms
   * @return {Function}
   */
  function throttle(fn, interval) {
    var last = 0;
    var timer = null;
    return function () {
      var ctx    = this;
      var args   = arguments;
      var now    = Date.now();
      var remain = interval - (now - last);

      if (remain <= 0) {
        if (timer) { clearTimeout(timer); timer = null; }
        last = now;
        fn.apply(ctx, args);
      } else if (!timer) {
        timer = setTimeout(function () {
          last  = Date.now();
          timer = null;
          fn.apply(ctx, args);
        }, remain);
      }
    };
  }



  /* ============================================================
   *  TYPE CHECKING
   * ============================================================ */

  /**
   * Check if value is a finite number.
   */
  function isNumber(v) {
    return typeof v === 'number' && isFinite(v);
  }

  /**
   * Check if value is a non-empty string.
   */
  function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
  }

  /**
   * Check if value is a positive integer.
   */
  function isPositiveInt(v) {
    return typeof v === 'number' && v > 0 && v === Math.floor(v);
  }

  /**
   * Check if value is null, undefined, or empty string.
   */
  function isEmpty(v) {
    return v === null || v === undefined || v === '';
  }

  /**
   * Check if value is an array with at least one element.
   */
  function isNonEmptyArray(v) {
    return Array.isArray(v) && v.length > 0;
  }

  /**
   * Check if value is a plain object (not null, not array).
   */
  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }



  /* ============================================================
   *  SAFE PARSING
   * ============================================================ */

  /**
   * Parse JSON safely. Returns fallback on failure.
   *
   * @param  {string} str
   * @param  {*}      fallback
   * @return {*}
   */
  function safeJsonParse(str, fallback) {
    if (fallback === undefined) fallback = null;
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  /**
   * Parse an integer safely.
   *
   * @param  {*}      v
   * @param  {number} fallback
   * @return {number}
   */
  function safeParseInt(v, fallback) {
    if (fallback === undefined) fallback = 0;
    var n = parseInt(v, 10);
    return isNaN(n) ? fallback : n;
  }



  /* ============================================================
   *  DOM HELPERS
   * ============================================================ */

  /**
   * Safely query a DOM element by ID.
   *
   * @param  {string} id
   * @return {Element|null}
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Safely query a DOM element by selector.
   *
   * @param  {string}       selector
   * @param  {Element}      [root=document]
   * @return {Element|null}
   */
  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  /**
   * Query all matching elements.
   *
   * @param  {string}    selector
   * @param  {Element}   [root=document]
   * @return {NodeList}
   */
  function qAll(selector, root) {
    return (root || document).querySelectorAll(selector);
  }

  /**
   * Add a class to an element.
   */
  function addClass(el, cls) {
    if (el && el.classList) el.classList.add(cls);
  }

  /**
   * Remove a class from an element.
   */
  function removeClass(el, cls) {
    if (el && el.classList) el.classList.remove(cls);
  }

  /**
   * Toggle a class on an element.
   */
  function toggleClass(el, cls, force) {
    if (el && el.classList) {
      if (force !== undefined) {
        el.classList.toggle(cls, force);
      } else {
        el.classList.toggle(cls);
      }
    }
  }

  /**
   * Check if element has a class.
   */
  function hasClass(el, cls) {
    return el && el.classList && el.classList.contains(cls);
  }

  /**
   * Set multiple attributes on an element.
   *
   * @param {Element} el
   * @param {Object}  attrs — { key: value, ... }
   */
  function setAttrs(el, attrs) {
    if (!el || !attrs) return;
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
  }

  /**
   * Create a DOM element with optional class and text.
   *
   * @param  {string}  tag
   * @param  {string}  [cls]
   * @param  {string}  [text]
   * @return {Element}
   */
  function createElement(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls)  el.className = cls;
    if (text) el.textContent = text;
    return el;
  }



  /* ============================================================
   *  SCROLL HELPERS
   * ============================================================ */

  /**
   * Smooth scroll an element to top.
   *
   * @param {Element} el
   * @param {number}  [top=0]
   */
  function scrollToTop(el, top) {
    if (!el) return;
    top = top || 0;
    try {
      el.scrollTo({ top: top, behavior: 'smooth' });
    } catch (e) {
      el.scrollTop = top;
    }
  }

  /**
   * Scroll an element into view.
   *
   * @param {Element} el
   */
  function scrollIntoView(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
      el.scrollIntoView();
    }
  }



  /* ============================================================
   *  ANIMATION HELPERS
   * ============================================================ */

  /**
   * Fade in an element.
   *
   * @param {Element}  el
   * @param {number}   [duration=300] — ms
   * @param {Function} [callback]
   */
  function fadeIn(el, duration, callback) {
    if (!el) return;
    duration = duration || 300;

    el.style.opacity    = '0';
    el.style.display    = '';
    el.style.transition = 'opacity ' + duration + 'ms ease';

    requestAnimationFrame(function () {
      el.style.opacity = '1';
    });

    if (callback) {
      setTimeout(callback, duration);
    }
  }

  /**
   * Fade out an element.
   *
   * @param {Element}  el
   * @param {number}   [duration=300] — ms
   * @param {Function} [callback]
   */
  function fadeOut(el, duration, callback) {
    if (!el) return;
    duration = duration || 300;

    el.style.transition = 'opacity ' + duration + 'ms ease';
    el.style.opacity    = '0';

    setTimeout(function () {
      el.style.display = 'none';
      if (callback) callback();
    }, duration);
  }



  /* ============================================================
   *  STORAGE HELPERS (read-only, non-answer data)
   * ============================================================ */

  /**
   * Read a value from localStorage safely.
   * NOT used for answers — that's AnswerStore's job.
   *
   * @param  {string} key
   * @param  {*}      fallback
   * @return {*}
   */
  function storageGet(key, fallback) {
    if (fallback === undefined) fallback = null;
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return safeJsonParse(raw, fallback);
    } catch (e) {
      return fallback;
    }
  }

  /**
   * Write a value to localStorage safely.
   * NOT used for answers — that's AnswerStore's job.
   *
   * @param  {string} key
   * @param  {*}      value
   * @return {boolean} success
   */
  function storageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Remove a key from localStorage safely.
   *
   * @param  {string}  key
   * @return {boolean} success
   */
  function storageRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }



  /* ============================================================
   *  ID GENERATION
   * ============================================================ */

  /**
   * Generate a simple unique ID (not cryptographically secure).
   *
   * @return {string}
   */
  function generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }



  /* ============================================================
   *  COPY UTILITIES
   * ============================================================ */

  /**
   * Deep clone a plain object / array (JSON-safe only).
   *
   * @param  {*} obj
   * @return {*}
   */
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return obj;
    }
  }

  /**
   * Deep freeze an object (make all properties immutable).
   *
   * @param  {Object} obj
   * @return {Object}
   */
  function deepFreeze(obj) {
    if (typeof Object.freeze !== 'function') return obj;

    var names = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < names.length; i++) {
      var val = obj[names[i]];
      if (val && typeof val === 'object') {
        deepFreeze(val);
      }
    }
    return Object.freeze(obj);
  }



  /* ============================================================
   *  MISC HELPERS
   * ============================================================ */

  /**
   * Clamp a number between min and max.
   *
   * @param  {number} n
   * @param  {number} min
   * @param  {number} max
   * @return {number}
   */
  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  /**
   * Get a random integer between min (inclusive) and max (inclusive).
   *
   * @param  {number} min
   * @param  {number} max
   * @return {number}
   */
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle an array in place (Fisher-Yates).
   *
   * @param  {Array} arr
   * @return {Array}
   */
  function shuffle(arr) {
    if (!Array.isArray(arr)) return arr;
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  /**
   * Delay execution (Promise-based).
   *
   * @param  {number} ms
   * @return {Promise}
   */
  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }



  /* ============================================================
   *  PRIVATE HELPERS
   * ============================================================ */

  /**
   * Zero-pad a number to 2 digits.
   */
  function _pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }



  /* ============================================================
   *  CLEANUP (call on App.destroy)
   * ============================================================ */

  /**
   * Clean up any timers or DOM elements created by Utils.
   * Should be called from App.destroy().
   */
  function destroy() {
    _clearToastTimer();
    _removeToast();
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         PUBLIC API                           ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */

  return {

    /* ── Persian ── */
    toPersianNum     : toPersianNum,
    toFa             : toFa,
    normalizePersian : normalizePersian,

    /* ── Time ── */
    formatT          : formatT,
    formatTimestamp  : formatTimestamp,
    formatDuration   : formatDuration,

    /* ── Text ── */
    countWords       : countWords,
    escapeHtml       : escapeHtml,
    stripHtml        : stripHtml,
    truncate         : truncate,

    /* ── Toast ── */
    showToastMsg     : showToastMsg,

    /* ── Timing ── */
    debounce         : debounce,
    throttle         : throttle,
    delay            : delay,

    /* ── Type Checking ── */
    isNumber         : isNumber,
    isNonEmptyString : isNonEmptyString,
    isPositiveInt    : isPositiveInt,
    isEmpty          : isEmpty,
    isNonEmptyArray  : isNonEmptyArray,
    isPlainObject    : isPlainObject,

    /* ── Safe Parsing ── */
    safeJsonParse    : safeJsonParse,
    safeParseInt     : safeParseInt,

    /* ── DOM ── */
    $                : $,
    q                : q,
    qAll             : qAll,
    addClass         : addClass,
    removeClass      : removeClass,
    toggleClass      : toggleClass,
    hasClass         : hasClass,
    setAttrs         : setAttrs,
    createElement    : createElement,

    /* ── Scroll ── */
    scrollToTop      : scrollToTop,
    scrollIntoView   : scrollIntoView,

    /* ── Animation ── */
    fadeIn           : fadeIn,
    fadeOut          : fadeOut,

    /* ── Storage (non-answer only) ── */
    storageGet       : storageGet,
    storageSet       : storageSet,
    storageRemove    : storageRemove,

    /* ── ID / Clone / Freeze ── */
    generateId       : generateId,
    deepClone        : deepClone,
    deepFreeze       : deepFreeze,

    /* ── Math ── */
    clamp            : clamp,
    randomInt        : randomInt,
    shuffle          : shuffle,

    /* ── Lifecycle ── */
    destroy          : destroy,

    /* ── Version ── */
    version          : function () { return '5.0.0'; }

  };

})();