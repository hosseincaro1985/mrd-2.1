/**
 * ============================================================
 *  ui.js v2.0.0 — Emotion Spaceship UI Layer
 *
 *  ADDITIVE LAYER — does NOT replace app.js, engine.js, renderers.js
 *
 *  Responsibilities:
 *    - TTS (Text-to-Speech) via Web Speech API
 *    - Admin Panel overlay
 *    - Report generation (badges, level)
 *    - UI utilities (toast, shake, animate)
 *
 *  Dependencies:
 *    - Engine (engine.js)
 *    - AnswerStore (answer-store.js — optional)
 *    - Renderers (renderers.js — optional)
 *
 *  Exposes: window.UI
 *
 *  NOTE: This module does NOT auto-init.
 *        Call UI.init() from app.js bootstrap or DOMContentLoaded.
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
   *  CONSTANTS
   * ============================================================ */

  var VERSION = '2.0.0';

  var TTS_LANG = 'fa-IR';
  var TTS_RATE = 0.9;
  var TTS_PITCH = 1.0;

  /* ============================================================
   *  STATE
   * ============================================================ */

  var _state = {
    initialized     : false,
    ttsEnabled      : true,
    ttsSupported    : false,
    adminVisible    : false,
    currentVoice    : null,
    btnSound        : null,
    btnSoundCreated : false
  };

  /* ============================================================
   *  DOM CACHE
   * ============================================================ */

  var _dom = {
    btnSound   : null,
    adminOverlay: null
  };

  /* ============================================================
   *  PERSIAN NUMBER HELPER
   * ============================================================ */

  function _toPersianNum(num) {
    if (typeof Utils !== 'undefined' && typeof Utils.toPersianNum === 'function') {
      return Utils.toPersianNum(num);
    }
    var fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(num).replace(/[0-9]/g, function (d) { return fa[+d]; });
  }

  /* ============================================================
   *  HTML ESCAPING
   * ============================================================ */

  function _esc(val) {
    if (val === null || val === undefined) { return ''; }
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  }

  /* ============================================================
   *  LOGGING
   * ============================================================ */

  function _log() {
    if (typeof console !== 'undefined' && console.log) {
      var args = ['[UI v' + VERSION + ']'];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      console.log.apply(console, args);
    }
  }

  /* ============================================================
   *  INIT
   * ============================================================ */

  function init() {
    if (_state.initialized) {
      _log('Already initialized.');
      return true;
    }

    /* Setup TTS */
    _initTTS();

    /* Setup sound button */
    _setupSoundButton();

    /* Subscribe to Engine events (additive — no conflict with app.js) */
    _bindEngineEvents();

    _state.initialized = true;
    _log('Initialized. TTS supported: ' + _state.ttsSupported);

    return true;
  }

  /* ============================================================
   *  TTS INITIALIZATION
   * ============================================================ */

  function _initTTS() {
    _state.ttsSupported = false;

    if (typeof window === 'undefined') { return; }

    if (typeof window.speechSynthesis === 'undefined') {
      _log('Speech Synthesis not supported.');
      return;
    }

    _state.ttsSupported = true;

    /* Load voices */
    _loadVoices();

    /* Voices may load asynchronously */
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = _loadVoices;
    }
  }

  function _loadVoices() {
    try {
      var voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) { return; }

      /* Try to find a Persian voice */
      for (var i = 0; i < voices.length; i++) {
        var lang = voices[i].lang || '';
        if (lang.indexOf('fa') === 0 || lang.indexOf('persian') > -1) {
          _state.currentVoice = voices[i];
          _log('Persian voice found: ' + voices[i].name);
          break;
        }
      }

      /* Fallback to first available voice */
      if (!_state.currentVoice && voices.length > 0) {
        _state.currentVoice = voices[0];
        _log('Using fallback voice: ' + voices[0].name);
      }
    } catch (e) {
      _log('Error loading voices:', e);
    }
  }

  /* ============================================================
   *  SOUND BUTTON
   * ============================================================ */

  function _setupSoundButton() {
    _dom.btnSound = document.getElementById('btnSound');

    /* If #btnSound doesn't exist in index.html, create it dynamically */
    if (!_dom.btnSound) {
      _dom.btnSound = _createSoundButton();
      _state.btnSoundCreated = true;
    }

    if (_dom.btnSound) {
      _dom.btnSound.addEventListener('click', _onSoundToggle);
      _updateSoundButton();
    }
  }

  function _createSoundButton() {
    var header = document.querySelector('.game-header') ||
                 document.querySelector('header') ||
                 document.querySelector('#game header');

    if (!header) {
      _log('No header found — sound button not created.');
      return null;
    }

    var btn = document.createElement('button');
    btn.id = 'btnSound';
    btn.className = 'btn-icon btn-sound';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'روشن/خاموش کردن صدا');
    btn.setAttribute('title', 'صدا');
    btn.textContent = '🔊';

    /* Try to append to header-right or header */
    var headerRight = header.querySelector('.header-right') || header;
    headerRight.appendChild(btn);

    _log('Sound button created dynamically.');
    return btn;
  }

  function _onSoundToggle() {
    _state.ttsEnabled = !_state.ttsEnabled;
    _updateSoundButton();

    if (!_state.ttsEnabled) {
      stopTTS();
    }

    _log('TTS ' + (_state.ttsEnabled ? 'enabled' : 'disabled') + '.');
  }

  function _updateSoundButton() {
    if (!_dom.btnSound) { return; }
    _dom.btnSound.textContent = _state.ttsEnabled ? '🔊' : '🔇';
    _dom.btnSound.classList.toggle('muted', !_state.ttsEnabled);
  }

  /* ============================================================
   *  TTS — SPEAK
   * ============================================================ */

  function speak(text) {
    if (!_state.ttsEnabled || !_state.ttsSupported) {
      return false;
    }

    var trimmed = (typeof text === 'string') ? text.trim() : '';
    if (trimmed.length === 0) {
      return false;
    }

    try {
      /* Cancel any ongoing speech */
      window.speechSynthesis.cancel();

      var utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = TTS_LANG;
      utterance.rate = TTS_RATE;
      utterance.pitch = TTS_PITCH;

      if (_state.currentVoice) {
        utterance.voice = _state.currentVoice;
      }

      utterance.onstart = function () {
        if (_dom.btnSound) {
          _dom.btnSound.classList.add('speaking');
        }
      };

      utterance.onend = function () {
        if (_dom.btnSound) {
          _dom.btnSound.classList.remove('speaking');
        }
      };

      utterance.onerror = function (e) {
        _log('TTS error:', e);
        if (_dom.btnSound) {
          _dom.btnSound.classList.remove('speaking');
        }
      };

      window.speechSynthesis.speak(utterance);
      return true;

    } catch (e) {
      _log('TTS speak error:', e);
      return false;
    }
  }

  function stopTTS() {
    if (!_state.ttsSupported) { return; }

    try {
      window.speechSynthesis.cancel();
      if (_dom.btnSound) {
        _dom.btnSound.classList.remove('speaking');
      }
    } catch (e) {
      _log('TTS stop error:', e);
    }
  }

  function isTTSEnabled() {
    return _state.ttsEnabled;
  }

  function isTTSSupported() {
    return _state.ttsSupported;
  }

  /* ============================================================
   *  ENGINE EVENT BINDING (Additive — no conflict with app.js)
   * ============================================================ */

  function _bindEngineEvents() {
    if (typeof Engine === 'undefined' || typeof Engine.on !== 'function') {
      _log('Engine not available — skipping event binding.');
      return;
    }

    Engine.on('slideChanged', _onSlideChanged);
    Engine.on('finished', _onFinished);
  }

  /* ============================================================
   *  SLIDE CHANGED HANDLER — TTS only
   * ============================================================ */

  function _onSlideChanged(data) {
    if (!_state.ttsEnabled || !_state.ttsSupported) { return; }

    /* Stop any ongoing speech */
    stopTTS();

    if (!data || !data.slide) { return; }

    var slide = data.slide;
    var ttsText = '';

    /* Determine TTS text based on slide type */
    switch (slide.type) {
      case 'child-info':
        ttsText = slide.title || 'به سفینه احساسات خوش آمدی!';
        break;

      case 'station-intro':
        ttsText = slide.title || '';
        if (slide.body) {
          ttsText += (ttsText ? '. ' : '') + slide.body;
        }
        break;

      case 'story-slide':
        ttsText = slide.body || slide.title || '';
        break;

      case 'question-slide':
        ttsText = slide.title || '';
        break;

      case 'farewell':
        ttsText = slide.title || '';
        if (slide.body) {
          ttsText += (ttsText ? '. ' : '') + slide.body;
        }
        break;

      default:
        break;
    }

    if (ttsText) {
      /* Delay slightly to let DOM render */
      setTimeout(function () {
        speak(ttsText);
      }, 300);
    }
  }

  /* ============================================================
   *  FINISHED HANDLER
   * ============================================================ */

  function _onFinished(data) {
    /* Stop TTS */
    stopTTS();

    _log('Game finished. Score:', data ? data.score : 'unknown');
  }

  /* ============================================================
   *  REPORT GENERATION
   * ============================================================ */

  function generateReport() {
    var report = {
      childName       : '',
      score           : 0,
      maxScore        : 0,
      answeredQuestions: 0,
      totalQuestions  : 0,
      elapsedMinutes  : 0,
      level           : { emoji: '⭐', label: 'تازه‌کار', color: '#95a5a6' },
      badges          : []
    };

    /* Get child name */
    try {
      if (typeof Engine !== 'undefined' && typeof Engine.getChildName === 'function') {
        report.childName = Engine.getChildName() || '';
      }
    } catch (e) { /* silent */ }

    /* Get score */
    try {
      if (typeof Engine !== 'undefined' && typeof Engine.getProgress === 'function') {
        var progress = Engine.getProgress();
        report.score = progress.score || 0;
      }
    } catch (e) { /* silent */ }

    /* Get answer data from AnswerStore if available */
    try {
      if (typeof AnswerStore !== 'undefined') {
        if (typeof AnswerStore.getReport === 'function') {
          var storeReport = AnswerStore.getReport();
          if (storeReport) {
            report.answeredQuestions = storeReport.answeredQuestions || 0;
            report.totalQuestions    = storeReport.totalQuestions || 0;
            report.maxScore          = storeReport.maxScore || 0;
            report.elapsedMinutes    = storeReport.elapsedMinutes || 0;
          }
        } else if (typeof AnswerStore.getStats === 'function') {
          var stats = AnswerStore.getStats();
          if (stats) {
            report.answeredQuestions = stats.answered || 0;
            report.totalQuestions    = stats.total || 0;
          }
        }
      }
    } catch (e) { /* silent */ }

    /* Get total slides from Engine */
    try {
      if (typeof Engine !== 'undefined' && typeof Engine.getProgress === 'function') {
        var prog = Engine.getProgress();
        if (prog && prog.totalSlides) {
          report.totalQuestions = report.totalQuestions || prog.totalSlides;
        }
      }
    } catch (e) { /* silent */ }

    /* Calculate level */
    report.level = _calculateLevel(report.score, report.maxScore);

    /* Calculate badges */
    report.badges = _calculateBadges(report);

    return report;
  }

  function _calculateLevel(score, maxScore) {
    var pct = maxScore > 0 ? (score / maxScore) : 0;

    if (pct >= 0.9) {
      return { emoji: '🏆', label: 'قهرمان احساسات', color: '#f1c40f' };
    }
    if (pct >= 0.75) {
      return { emoji: '🌟', label: 'ستاره احساسات', color: '#e67e22' };
    }
    if (pct >= 0.5) {
      return { emoji: '😊', label: 'کاوشگر احساسات', color: '#2ecc71' };
    }
    if (pct >= 0.25) {
      return { emoji: '🚀', label: 'مسافر احساسات', color: '#3498db' };
    }
    return { emoji: '⭐', label: 'تازه‌کار', color: '#95a5a6' };
  }

  function _calculateBadges(report) {
    var badges = [];

    /* First journey badge */
    if (report.answeredQuestions > 0) {
      badges.push({
        id    : 'first-journey',
        name  : 'اولین سفر',
        icon  : '🛸',
        color : '#3498db'
      });
    }

    /* Perfect score badge */
    if (report.maxScore > 0 && report.score >= report.maxScore) {
      badges.push({
        id    : 'perfect-score',
        name  : 'امتیاز کامل',
        icon  : '💯',
        color : '#f1c40f'
      });
    }

    /* Champion badge */
    if (report.score >= 50) {
      badges.push({
        id    : 'champion',
        name  : 'قهرمان احساسات',
        icon  : '🏆',
        color : '#e67e22'
      });
    }

    /* Explorer badge */
    if (report.totalQuestions > 0 && report.answeredQuestions >= report.totalQuestions) {
      badges.push({
        id    : 'explorer',
        name  : 'کاوشگر کامل',
        icon  : '🌟',
        color : '#2ecc71'
      });
    }

    return badges;
  }

  /* ============================================================
   *  REPORT HTML
   * ============================================================ */

  function getReportHTML() {
    var report = generateReport();

    var html = '';
    html += '<div class="report-card">';
    html += '<h2 class="report-title">📊 نتایج سفر احساسات</h2>';

    /* Student info */
    html += '<p class="report-line">👤 ';
    if (report.childName) {
      html += '<strong>' + _esc(report.childName) + '</strong>';
    } else {
      html += 'مسافر عزیز';
    }
    html += '</p>';

    /* Score */
    html += '<p class="report-line">⭐ امتیاز: <strong>' + _toPersianNum(report.score) + '</strong>';
    if (report.maxScore > 0) {
      html += ' از ' + _toPersianNum(report.maxScore);
    }
    html += '</p>';

    /* Questions answered */
    if (report.totalQuestions > 0) {
      html += '<p class="report-line">📝 سوالات: <strong>' +
        _toPersianNum(report.answeredQuestions) + '</strong> از ' +
        _toPersianNum(report.totalQuestions) + '</p>';
    }

    /* Time */
    if (report.elapsedMinutes > 0) {
      html += '<p class="report-line">⏱️ زمان: <strong>' +
        _toPersianNum(report.elapsedMinutes) + '</strong> دقیقه</p>';
    }

    /* Level */
    html += '<p class="report-line report-level" style="color:' + _esc(report.level.color) + ';">' +
      report.level.emoji + ' ' + _esc(report.level.label) + '</p>';

    /* Badges */
    if (report.badges.length > 0) {
      html += '<div class="badges-container">';
      for (var i = 0; i < report.badges.length; i++) {
        var b = report.badges[i];
        html += '<div class="badge-item" style="border-color:' + _esc(b.color) + ';">';
        html += '<span class="badge-icon">' + b.icon + '</span>';
        html += '<span class="badge-name">' + _esc(b.name) + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';

    return html;
  }

  /* ============================================================
   *  ADMIN PANEL
   * ============================================================ */

  function showAdmin() {
    if (_state.adminVisible) { return; }
    _state.adminVisible = true;

    var existing = document.getElementById('adminOverlay');
    if (existing) { existing.remove(); }

    var overlay = document.createElement('div');
    overlay.id = 'adminOverlay';
    overlay.className = 'admin-overlay';

    var panel = document.createElement('div');
    panel.className = 'admin-panel';

    /* Panel content */
    panel.innerHTML = _getAdminHTML();

    /* Close button */
    var closeBtn = document.createElement('button');
    closeBtn.className = 'admin-close-btn';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'بستن پنل مدیریت');
    closeBtn.textContent = '✕';
    closeBtn.onclick = function () { hideAdmin(); };

    panel.insertBefore(closeBtn, panel.firstChild);
    overlay.appendChild(panel);

    /* Click outside to close */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { hideAdmin(); }
    });

    document.body.appendChild(overlay);

    /* Animate in */
    setTimeout(function () {
      overlay.classList.add('visible');
    }, 50);

    /* Bind admin actions */
    _bindAdminActions(panel);

    _log('Admin panel shown.');
  }

  function hideAdmin() {
    if (!_state.adminVisible) { return; }
    _state.adminVisible = false;

    var overlay = document.getElementById('adminOverlay');
    if (overlay) {
      overlay.classList.remove('visible');
      setTimeout(function () {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }

    _log('Admin panel hidden.');
  }

  function toggleAdmin() {
    if (_state.adminVisible) {
      hideAdmin();
    } else {
      showAdmin();
    }
  }

  function _getAdminHTML() {
    var snapshot = {};
    var progress = {};

    try {
      if (typeof Engine !== 'undefined') {
        if (typeof Engine.getStateSnapshot === 'function') {
          snapshot = Engine.getStateSnapshot();
        }
        if (typeof Engine.getProgress === 'function') {
          progress = Engine.getProgress();
        }
      }
    } catch (e) { /* silent */ }

    var html = '';
    html += '<div class="admin-header">';
    html += '<h2 class="admin-title">⚙️ پنل مدیریت</h2>';
    html += '</div>';

    html += '<div class="admin-section">';
    html += '<h3 class="admin-section-title">📊 وضعیت بازی</h3>';
    html += '<div class="admin-stats">';

    html += '<div class="admin-stat">';
    html += '<span class="admin-stat-label">اسلاید فعلی:</span>';
    html += '<span class="admin-stat-value">' + _toPersianNum(progress.currentSlide || 1) +
      ' / ' + _toPersianNum(progress.totalSlides || 0) + '</span>';
    html += '</div>';

    html += '<div class="admin-stat">';
    html += '<span class="admin-stat-label">امتیاز:</span>';
    html += '<span class="admin-stat-value">' + _toPersianNum(progress.score || 0) + '</span>';
    html += '</div>';

    html += '<div class="admin-stat">';
    html += '<span class="admin-stat-label">فاز:</span>';
    html += '<span class="admin-stat-value">' + _esc(snapshot.phase || 'idle') + '</span>';
    html += '</div>';

    html += '<div class="admin-stat">';
    html += '<span class="admin-stat-label">نام کودک:</span>';
    html += '<span class="admin-stat-value">' + _esc(snapshot.childName || '—') + '</span>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    /* Actions */
    html += '<div class="admin-section">';
    html += '<h3 class="admin-section-title">🔧 اقدامات</h3>';
    html += '<div class="admin-actions">';

    html += '<button class="admin-action-btn" data-action="prev" type="button">⬅️ اسلاید قبلی</button>';
    html += '<button class="admin-action-btn" data-action="next" type="button">➡️ اسلاید بعدی</button>';
    html += '<button class="admin-action-btn" data-action="restart" type="button">🔄 شروع دوباره</button>';
    html += '<button class="admin-action-btn admin-danger" data-action="reset" type="button">🗑️ بازنشانی کامل</button>';

    html += '</div>';
    html += '</div>';

    /* TTS */
    html += '<div class="admin-section">';
    html += '<h3 class="admin-section-title">🔊 صدا</h3>';
    html += '<div class="admin-actions">';
    html += '<button class="admin-action-btn" data-action="tts-toggle" type="button">';
    html += _state.ttsEnabled ? '🔇 خاموش کردن صدا' : '🔊 روشن کردن صدا';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    /* Answer Store info */
    html += '<div class="admin-section">';
    html += '<h3 class="admin-section-title">💾 پاسخ‌ها</h3>';
    html += '<div class="admin-stats">';

    var answerCount = 0;
    try {
      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.getStats === 'function') {
        var stats = AnswerStore.getStats();
        answerCount = stats.answered || 0;
      }
    } catch (e) { /* silent */ }

    html += '<div class="admin-stat">';
    html += '<span class="admin-stat-label">پاسخ‌های ثبت‌شده:</span>';
    html += '<span class="admin-stat-value">' + _toPersianNum(answerCount) + '</span>';
    html += '</div>';

    html += '</div>';

    html += '<div class="admin-actions">';
    html += '<button class="admin-action-btn" data-action="export" type="button">📥 خروجی پاسخ‌ها</button>';
    html += '<button class="admin-action-btn admin-danger" data-action="clear-answers" type="button">🗑️ پاک کردن پاسخ‌ها</button>';
    html += '</div>';

    html += '</div>';

    return html;
  }

  function _bindAdminActions(panel) {
    if (!panel) { return; }

    var buttons = panel.querySelectorAll('[data-action]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', _onAdminAction);
    }
  }

  function _onAdminAction(e) {
    var action = e.currentTarget.getAttribute('data-action');

    try {
      switch (action) {
        case 'prev':
          if (typeof Engine !== 'undefined' && typeof Engine.prev === 'function') {
            Engine.prev();
          }
          break;

        case 'next':
          if (typeof Engine !== 'undefined' && typeof Engine.next === 'function') {
            Engine.next();
          }
          break;

        case 'restart':
          if (typeof Engine !== 'undefined' && typeof Engine.restart === 'function') {
            Engine.restart();
          }
          hideAdmin();
          break;

        case 'reset':
          if (typeof Engine !== 'undefined' && typeof Engine.reset === 'function') {
            Engine.reset();
          }
          hideAdmin();
          break;

        case 'tts-toggle':
          _onSoundToggle();
          /* Refresh panel */
          hideAdmin();
          setTimeout(showAdmin, 350);
          break;

        case 'export':
          _exportAnswers();
          break;

        case 'clear-answers':
          _clearAnswers();
          hideAdmin();
          setTimeout(showAdmin, 350);
          break;

        default:
          _log('Unknown admin action: ' + action);
          break;
      }
    } catch (err) {
      _log('Admin action error:', err);
    }
  }

  function _exportAnswers() {
    try {
      var data = {};

      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.getAllAnswers === 'function') {
        data.answers = AnswerStore.getAllAnswers();
      }

      if (typeof Engine !== 'undefined' && typeof Engine.getStateSnapshot === 'function') {
        data.state = Engine.getStateSnapshot();
      }

      var json = JSON.stringify(data, null, 2);
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);

      var a = document.createElement('a');
      a.href = url;
      a.download = 'emotion-spaceship-answers.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      _log('Answers exported.');
    } catch (e) {
      _log('Export error:', e);
    }
  }

  function _clearAnswers() {
    try {
      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.clear === 'function') {
        AnswerStore.clear();
        _log('Answers cleared.');
      }
    } catch (e) {
      _log('Clear answers error:', e);
    }
  }

  /* ============================================================
   *  UI UTILITIES
   * ============================================================ */

  function toast(message, duration) {
    if (!message) { return; }
    var dur = duration || 2500;

    var existing = document.getElementById('ui-toast');
    if (existing) { existing.remove(); }

    var el = document.createElement('div');
    el.id = 'ui-toast';
    el.className = 'ui-toast';
    el.textContent = message;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    document.body.appendChild(el);

    setTimeout(function () {
      el.classList.add('visible');
    }, 10);

    setTimeout(function () {
      el.classList.remove('visible');
      setTimeout(function () {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 300);
    }, dur);
  }

  function shake(element) {
    if (!element || !element.classList) { return; }
    element.classList.add('shake');
    setTimeout(function () {
      element.classList.remove('shake');
    }, 500);
  }

  function animateSlideEnter(container) {
    if (!container || !container.classList) { return; }
    container.classList.add('slide-enter');
    setTimeout(function () {
      container.classList.remove('slide-enter');
      container.classList.add('slide-visible');
    }, 50);
  }

  /* ============================================================
   *  DESTROY
   * ============================================================ */

  function destroy() {
    /* Stop TTS */
    stopTTS();

    /* Unsubscribe from Engine events */
    try {
      if (typeof Engine !== 'undefined' && typeof Engine.off === 'function') {
        Engine.off('slideChanged', _onSlideChanged);
        Engine.off('finished', _onFinished);
      }
    } catch (e) { /* silent */ }

    /* Remove sound button listener */
    if (_dom.btnSound) {
      _dom.btnSound.removeEventListener('click', _onSoundToggle);
    }

    /* Hide admin */
    hideAdmin();

    /* Clear DOM cache */
    _dom.btnSound = null;
    _dom.adminOverlay = null;

    _state.initialized = false;
    _log('Destroyed.');
  }

  /* ============================================================
   *  EXPOSE ON WINDOW
   * ============================================================ */

  window.UI = {
    /* Lifecycle */
    init   : init,
    destroy: destroy,

    /* TTS */
    speak          : speak,
    stopTTS        : stopTTS,
    isTTSEnabled   : isTTSEnabled,
    isTTSSupported : isTTSSupported,

    /* Admin */
    showAdmin  : showAdmin,
    hideAdmin  : hideAdmin,
    toggleAdmin: toggleAdmin,

    /* Report */
    generateReport: generateReport,
    getReportHTML : getReportHTML,

    /* Utilities */
    toast           : toast,
    shake           : shake,
    animateSlideEnter: animateSlideEnter,

    /* Version */
    VERSION: VERSION
  };

})();