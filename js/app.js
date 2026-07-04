/**
 * ============================================================
 *  app.js v8.0.0 — Emotion Spaceship Application Controller
 *
 *  Fixes:
 *    - multi-choice bug (selectedCount → nowSelected)
 *    - audio (TTS + uploaded files + dialogue support)
 *    - re-enable buttons on deselect
 *
 *  Dependencies:
 *    - engine.js       (Engine global)
 *    - renderers.js    (Renderers global)
 *    - content-layer.js (ContentLayer global — optional)
 *    - answer-store.js  (AnswerStore global — optional)
 *    - utils.js         (Utils global — optional)
 *    - audio.js         (AudioManager global — optional)
 *    - alien.js         (Alien global — optional)
 *
 *  Public API:
 *    - App.bootstrap()
 *    - App.destroy()
 *
 *  Exposes: window.App
 * ============================================================
 */

(function () {
  'use strict';

  var VERSION = '8.0.0';

  /* ============================================================
   *  DOM CACHE
   * ============================================================ */

  var _dom = {
    slideWrapper : null,
    stationBadge : null,
    progressFill : null,
    progressPct  : null,
    navCurrent   : null,
    navTotal     : null,
    btnPrev      : null,
    btnNext      : null,
    valError     : null,
    valSuccess   : null
  };

  var _booted    = false;
  var _destroyed = false;

  /* ============================================================
   *  DOM RESOLUTION
   * ============================================================ */

  function _resolveDom() {
    var ids = [
      'slideWrapper',
      'stationBadge',
      'progressFill',
      'progressPct',
      'navCurrent',
      'navTotal',
      'btnPrev',
      'btnNext',
      'valError',
      'valSuccess'
    ];

    var missing = [];
    var i, el;

    for (i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      _dom[ids[i]] = el;
      if (!el) {
        missing.push(ids[i]);
      }
    }

    if (missing.length > 0) {
      console.error('[App] Missing DOM elements: ' + missing.join(', '));
      return false;
    }

    return true;
  }

  /* ============================================================
   *  PERSIAN NUMBER HELPER
   * ============================================================ */

  function _toPersianNum(n) {
    if (typeof Utils !== 'undefined' && typeof Utils.toPersianNum === 'function') {
      return Utils.toPersianNum(n);
    }
    var fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(n).replace(/[0-9]/g, function (d) { return fa[+d]; });
  }

  /* ============================================================
   *  MESSAGE HELPERS
   * ============================================================ */

  function _showError(message) {
    if (!_dom.valError) { return; }
    _dom.valError.textContent = message;
    _dom.valError.style.display = 'block';
    setTimeout(function () {
      _hideError();
    }, 4000);
  }

  function _hideError() {
    if (!_dom.valError) { return; }
    _dom.valError.style.display = 'none';
    _dom.valError.textContent = '';
  }

  function _showSuccess(message) {
    if (!_dom.valSuccess) { return; }
    _dom.valSuccess.textContent = message;
    _dom.valSuccess.style.display = 'block';
    setTimeout(function () {
      _hideSuccess();
    }, 3000);
  }

  function _hideSuccess() {
    if (!_dom.valSuccess) { return; }
    _dom.valSuccess.style.display = 'none';
    _dom.valSuccess.textContent = '';
  }

  /* ============================================================
   *  SPEAK SLIDE (Voice) — FIXED v8.0.0
   * ============================================================ */

  function _speakSlide(renderData) {
    if (typeof AudioManager === 'undefined' || typeof AudioManager.speak !== 'function') {
      return;
    }

    var text = '';

    /* Priority: dialogueRef > dialogueText > body > title */
    if (renderData.dialogueRef) {
      try {
        if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getEditableText === 'function') {
          var dt = ContentLayer.getEditableText(renderData.dialogueRef);
          if (dt && typeof dt === 'object' && dt.text) {
            text = dt.text;
          } else if (typeof dt === 'string') {
            text = dt;
          }
        }
      } catch (e) { /* silent */ }
    }

    if (!text && renderData.dialogueText) {
      text = renderData.dialogueText;
    }

    if (!text && renderData.body) {
      text = renderData.body;
    }

    if (!text && renderData.title) {
      text = renderData.title;
    }

    /* Check for uploaded audio file from admin panel */
    var audioKey = renderData.dialogueRef || ('slide-' + (renderData.index || 0) + '-body');
    var audioOverrides = {};
    try {
      var raw = localStorage.getItem('admin_audio_overrides');
      if (raw) audioOverrides = JSON.parse(raw);
    } catch (e) { /* silent */ }

    if (audioOverrides[audioKey]) {
      try {
        AudioManager.playSfx(audioOverrides[audioKey]);
        return;
      } catch (e) {
        console.warn('[App] Audio file playback failed, falling back to TTS');
      }
    }

    /* Use TTS — send full text without chunking */
    if (text && text.trim().length > 0) {
      try {
        AudioManager.speak({
          text: text,
          lang: 'fa-IR',
          rate: 0.9,
          pitch: 1.0,
          volume: 1.0
        });
      } catch (e) {
        console.warn('[App] AudioManager.speak() failed:', e);
      }
    }
  }

  /* ============================================================
   *  SECTIONS CONFIG
   * ============================================================ */

  function _checkSectionsConfig(renderData) {
    try {
      var config = JSON.parse(localStorage.getItem('admin_sections_config') || '{}');
      if (config.section2 === false && renderData.stationId && renderData.stationId > 4) {
        _dom.slideWrapper.innerHTML =
          '<section class="slide slide--locked">' +
            '<div class="slide__icon" style="font-size:64px;text-align:center;margin-bottom:20px">🔒</div>' +
            '<h2 class="slide__title">بخش دوم به‌زودی!</h2>' +
            '<div class="slide__body"><p>بخش دوم بازی هنوز فعال نشده. بعداً برگرد!</p></div>' +
            '<div class="slide__footer">' +
              '<button class="js-restart" type="button">🔄 شروع دوباره</button>' +
            '</div>' +
          '</section>';
      }
    } catch (e) { /* silent */ }
  }

  /* ============================================================
   *  RENDER
   * ============================================================ */

  function _renderCurrentSlide() {
    if (!Engine || typeof Engine.renderCurrentSlide !== 'function') {
      console.error('[App] Engine.renderCurrentSlide not available.');
      return;
    }

    var renderData = Engine.renderCurrentSlide();

    if (!renderData) {
      console.error('[App] Engine.renderCurrentSlide() returned null.');
      return;
    }

    if (typeof Renderers === 'undefined' || typeof Renderers.render !== 'function') {
      console.error('[App] Renderers.render not available.');
      return;
    }

   Renderers.render(renderData);

    /* Rebind Alien to new DOM */
    if (typeof Alien !== 'undefined' && typeof Alien.rebind === 'function') {
      Alien.rebind();
    }

    /* Speak dialogue text (if available) */
    _speakSlide(renderData);

    /* Check sections config */
    _checkSectionsConfig(renderData);

    /* Update progress chrome after rendering */
    _updateProgress();

    /* Hide any lingering messages */
    _hideError();
  }

  /* ============================================================
   *  PROGRESS UPDATE
   * ============================================================ */

  function _updateProgress() {
    var progress = Engine.getProgress();

    if (_dom.progressFill) {
      _dom.progressFill.style.width = progress.percentage + '%';
    }

    if (_dom.progressPct) {
      _dom.progressPct.textContent = _toPersianNum(progress.percentage) + '٪';
    }

    if (_dom.navCurrent) {
      _dom.navCurrent.textContent = _toPersianNum(progress.currentSlide);
    }

    if (_dom.navTotal) {
      _dom.navTotal.textContent = _toPersianNum(progress.totalSlides);
    }

    /* Update aria-valuenow on progressbar */
    var progressbar = _dom.progressFill ? _dom.progressFill.parentElement : null;
    if (progressbar && progressbar.getAttribute('role') === 'progressbar') {
      progressbar.setAttribute('aria-valuenow', String(progress.percentage));
    }

    /* Update station badge */
    if (_dom.stationBadge) {
      var slide = Engine.getCurrentSlide();
      if (slide && slide.stationId) {
        var station = null;
        try {
          if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getStation === 'function') {
            station = ContentLayer.getStation(slide.stationId);
          }
        } catch (e) { /* silent */ }
        if (station && station.name) {
          _dom.stationBadge.textContent = station.name;
        } else {
          _dom.stationBadge.textContent = '';
        }
      } else {
        _dom.stationBadge.textContent = '';
      }
    }

    /* Update nav button states */
    if (_dom.btnPrev) {
      _dom.btnPrev.disabled = !Engine.canGoBack();
    }
    if (_dom.btnNext) {
      _dom.btnNext.disabled = !Engine.canGoForward();
    }
  }

  /* ============================================================
   *  NAVIGATION
   * ============================================================ */

  function _handleNext() {
    if (_destroyed) { return; }

    var ok = Engine.next();
    if (ok) {
      _renderCurrentSlide();
    } else {
      _updateProgress();
    }
  }

  function _handlePrevious() {
    if (_destroyed) { return; }

    var ok = Engine.prev();
    if (ok) {
      _renderCurrentSlide();
    } else {
      _updateProgress();
    }
  }

  function _handleRestart() {
    if (_destroyed) { return; }

    Engine.restart();
    _renderCurrentSlide();
  }

  /* ============================================================
   *  CHILD NAME SUBMIT
   * ============================================================ */

  function _handleChildNameSubmit() {
    var input = document.getElementById('childNameInput');
    if (!input) {
      console.warn('[App] childNameInput not found.');
      return;
    }

    var name = input.value;
    if (!name || !name.trim()) {
      _showError('لطفاً نام خود را وارد کن.');
      return;
    }

    var nameOk = Engine.setChildName(name.trim());
    if (!nameOk) {
      _showError('نام واردشده معتبر نیست.');
      return;
    }

    _hideError();

    var nextOk = Engine.next();
    if (nextOk) {
      _renderCurrentSlide();
    }
  }

  /* ============================================================
   *  OPTION SELECTION — FIXED v8.0.0
   * ============================================================ */

  function _handleOptionClick(optionId, questionId) {
    var buttons = _dom.slideWrapper.querySelectorAll('.js-option');
    var i, btn;

 /* Check if this is multi-choice — read from .slide__question not .slide */
    var slide = document.querySelector('.slide');
    var questionEl = _dom.slideWrapper.querySelector('.slide__question');
    var isMulti = false;
    var maxSel = 1;

    if (questionEl) {
      var qType = questionEl.getAttribute('data-question-type');
      if (qType === 'multi-choice' || qType === 'multi' || qType === 'multiple') {
        isMulti = true;
      }
      maxSel = parseInt(questionEl.getAttribute('data-max-selections') || '1', 10);
    }

    /* Fallback: check ContentLayer */
    if (!isMulti) {
      try {
        var qId = (questionEl && questionEl.getAttribute('data-question-id')) || questionId;
        if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getQuestion === 'function') {
          var q = ContentLayer.getQuestion(qId);
          if (q && (q.type === 'multi-choice' || q.type === 'multi' || q.type === 'multiple')) {
            isMulti = true;
          }
        }
      } catch (e) { /* silent */ }
    }

    /* Force maxSel=2 for multi-choice in station 4 */
    if (isMulti && maxSel < 2) {
      maxSel = 2;
    }    if (isMulti) {
      /* Toggle selection */
      var selectedBtn = null;
      for (i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-option-id') === String(optionId)) {
          selectedBtn = buttons[i];
          break;
        }
      }

      if (selectedBtn) {
        if (selectedBtn.classList.contains('selected')) {
          /* Deselect */
          selectedBtn.classList.remove('selected');
          selectedBtn.classList.remove('wrong');
          selectedBtn.classList.remove('correct');

          /* Sync to Engine */
          Engine.toggleOption(optionId);

          /* Re-enable all buttons since we are below max now */
          for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].classList.contains('selected')) {
              buttons[i].disabled = false;
              buttons[i].classList.remove('disabled');
            }
          }

          /* Hide continue button if it was shown */
          var nextBtnMulti = _dom.slideWrapper.querySelector('.js-next');
          if (nextBtnMulti) {
            nextBtnMulti.style.display = 'none';
          }

          /* Hide feedback if shown */
          var fcMulti = _dom.slideWrapper.querySelector('.slide__feedback--correct');
          var fwMulti = _dom.slideWrapper.querySelector('.slide__feedback--wrong');
          if (fcMulti) fcMulti.style.display = 'none';
          if (fwMulti) fwMulti.style.display = 'none';
        } else {
          /* Check max selections */
          var selectedCount = 0;
          for (i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains('selected')) selectedCount++;
          }

         if (selectedCount < maxSel) {
            selectedBtn.classList.add('selected');

            /* Sync to Engine */
            Engine.toggleOption(optionId);
          } else {
            _showError('حداکثر ' + _toPersianNum(maxSel) + ' گزینه می‌توانی انتخاب کنی.');
            return;
          }
        }
      }

      /* Check if max reached — FIXED: nowSelected instead of selectedCount */
      var nowSelected = 0;
      for (i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains('selected')) nowSelected++;
      }

      if (nowSelected === maxSel) {
        /* Disable all buttons */
        for (i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
        }

        /* Mark correct/wrong */
        for (i = 0; i < buttons.length; i++) {
          btn = buttons[i];
          var optId = btn.getAttribute('data-option-id');
          var opt = null;
          try {
            if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getOption === 'function') {
              opt = ContentLayer.getOption(optId);
            }
          } catch (e) { /* silent */ }

          if (opt && opt.isCorrect) {
            btn.classList.add('correct');
          } else if (btn.classList.contains('selected')) {
            btn.classList.add('wrong');
          }
        }

        /* Show feedback */
        var feedbackCorrect = _dom.slideWrapper.querySelector('.slide__feedback--correct');
        var feedbackWrong = _dom.slideWrapper.querySelector('.slide__feedback--wrong');

        /* Check if all selected are correct */
        var allCorrect = true;
        for (i = 0; i < buttons.length; i++) {
          if (buttons[i].classList.contains('selected')) {
            var sOpt = null;
            try {
              if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getOption === 'function') {
                sOpt = ContentLayer.getOption(buttons[i].getAttribute('data-option-id'));
              }
            } catch (e) { /* silent */ }

            if (!sOpt || !sOpt.isCorrect) {
              allCorrect = false;
              break;
            }
          }
        }

        if (allCorrect && feedbackCorrect) {
          feedbackCorrect.style.display = 'block';
        } else if (!allCorrect && feedbackWrong) {
          feedbackWrong.style.display = 'block';
        }

        /* Show continue button */
        var nextBtn = _dom.slideWrapper.querySelector('.js-next');
        if (nextBtn) {
          nextBtn.style.display = 'block';
        }

        /* Record to Engine */
        var selectedIds = [];
        for (i = 0; i < buttons.length; i++) {
          if (buttons[i].classList.contains('selected')) {
            selectedIds.push(buttons[i].getAttribute('data-option-id'));
          }
        }
        Engine.selectOption(selectedIds.join(','));
      }
    } else {
      /* Single choice — original logic */
      Engine.selectOption(optionId);

      for (i = 0; i < buttons.length; i++) {
        btn = buttons[i];
        btn.disabled = true;
        if (btn.getAttribute('data-option-id') === String(optionId)) {
          btn.classList.add('selected');
        }
      }

      var optionsList = _dom.slideWrapper.querySelector('.options-list');
      if (optionsList) {
        optionsList.classList.add('answered');
      }

      var selectedOpt = null;
      try {
        if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getOption === 'function') {
          selectedOpt = ContentLayer.getOption(optionId);
        }
      } catch (e) { /* silent */ }

      var isCorrect = selectedOpt ? !!selectedOpt.isCorrect : false;

      for (i = 0; i < buttons.length; i++) {
        btn = buttons[i];
        var optId2 = btn.getAttribute('data-option-id');

        if (optId2 === String(optionId)) {
          if (isCorrect) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
          }
        }

        var opt2 = null;
        try {
          if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getOption === 'function') {
            opt2 = ContentLayer.getOption(optId2);
          }
        } catch (e) { /* silent */ }

        if (opt2 && opt2.isCorrect) {
          btn.classList.add('correct');
        }
      }

      var feedbackCorrect2 = _dom.slideWrapper.querySelector('.slide__feedback--correct');
      var feedbackWrong2 = _dom.slideWrapper.querySelector('.slide__feedback--wrong');

      if (isCorrect && feedbackCorrect2) {
        feedbackCorrect2.style.display = 'block';
      } else if (!isCorrect && feedbackWrong2) {
        feedbackWrong2.style.display = 'block';
      }

      var nextBtn2 = _dom.slideWrapper.querySelector('.js-next');
      if (nextBtn2) {
        nextBtn2.style.display = 'block';
      }
    }
  }

  /* ============================================================
   *  OPEN-ENDED SUBMIT
   * ============================================================ */

  function _handleOpenEndedSubmit() {
    var textarea = document.getElementById('openEndedAnswer');
    if (!textarea) {
      console.warn('[App] openEndedAnswer not found.');
      return;
    }

    var text = textarea.value;
    if (!text || !text.trim()) {
      _showError('لطفاً پاسخ خود را بنویس.');
      return;
    }

    var ok = Engine.submitOpenEnded(text.trim());
    if (!ok) {
      _showError('ثبت پاسخ ناموفق بود.');
      return;
    }

    _hideError();

    textarea.disabled = true;

    var submitBtn = _dom.slideWrapper.querySelector('.js-submit-open');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    /* Show continue button */
    var nextBtn = _dom.slideWrapper.querySelector('.js-next');
    if (nextBtn) {
      nextBtn.style.display = 'block';
    }
  }

  /* ============================================================
   *  EVENT DELEGATION ON SLIDE WRAPPER
   * ============================================================ */
function _handleSlideClick(e) {

    if (_destroyed) { return; }

    var target = e.target;

    while (target && target !== _dom.slideWrapper) {

        if (
            target.classList &&
            target.classList.contains("js-start-mission2")
        ) {

            Engine.startMission2();
            _renderCurrentSlide();
            return;
        }

        if (target.tagName !== 'BUTTON') {
            target = target.parentNode;
            continue;
        }

      /* Next button inside slide */
      if (target.classList.contains('js-next')) {
        _handleNext();
        return;
      }

      /* Option button */
      if (target.classList.contains('js-option')) {
        var optionId   = target.getAttribute('data-option-id');
        var questionId = target.getAttribute('data-question-id');
        if (optionId && questionId) {
          _handleOptionClick(optionId, questionId);
        }
        return;
      }

      /* Open-ended submit */
      if (target.classList.contains('js-submit-open')) {
        _handleOpenEndedSubmit();
        return;
      }

      /* Restart */
      if (target.classList.contains('js-restart')) {
        _handleRestart();
        return;
      }

      /* Child name submit */
      if (target.id === 'childNameSubmit' || target.classList.contains('js-submit-name')) {
        _handleChildNameSubmit();
        return;
      }

      target = target.parentNode;
    }
  }

  /* ============================================================
   *  KEYBOARD NAVIGATION
   * ============================================================ */

  function _handleKeydown(e) {
    if (_destroyed) { return; }

    /* Don't hijack when typing in inputs */
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      if (e.target.id === 'childNameInput' && e.key === 'Enter') {
        e.preventDefault();
        _handleChildNameSubmit();
      }
      if (e.target.id === 'openEndedAnswer' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        _handleOpenEndedSubmit();
      }
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 39) {
      e.preventDefault();
      _handleNext();
    } else if (e.key === 'ArrowLeft' || e.key === 37) {
      e.preventDefault();
      _handlePrevious();
    }
  }

  /* ============================================================
   *  BIND / UNBIND EVENTS
   * ============================================================ */

  function _bindEvents() {
    if (_dom.btnPrev) {
      _dom.btnPrev.addEventListener('click', _handlePrevious);
    }

    if (_dom.btnNext) {
      _dom.btnNext.addEventListener('click', _handleNext);
    }

    if (_dom.slideWrapper) {
      _dom.slideWrapper.addEventListener('click', _handleSlideClick);
    }

    document.addEventListener('keydown', _handleKeydown);
  }

  function _unbindEvents() {
    if (_dom.btnPrev) {
      _dom.btnPrev.removeEventListener('click', _handlePrevious);
    }

    if (_dom.btnNext) {
      _dom.btnNext.removeEventListener('click', _handleNext);
    }

    if (_dom.slideWrapper) {
      _dom.slideWrapper.removeEventListener('click', _handleSlideClick);
    }

    document.removeEventListener('keydown', _handleKeydown);
  }

  /* ============================================================
   *  BOOTSTRAP
   * ============================================================ */

  function bootstrap() {
    if (_booted) {
      console.warn('[App] Already bootstrapped.');
      return true;
    }

    console.log('[App] Bootstrapping v' + VERSION);

    /* 1. Resolve DOM */
    if (!_resolveDom()) {
      console.error('[App] Bootstrap failed: missing DOM elements.');
      return false;
    }

    /* 2. Init AnswerStore (if available) */
    try {
      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.init === 'function') {
        AnswerStore.init();
      }
    } catch (e) {
      console.warn('[App] AnswerStore.init() failed:', e);
    }

    /* 3. Configure AudioManager */
try {

    if (typeof AudioManager !== "undefined") {

        /* Alien Voice */
        if (typeof AudioManager.setVoiceMode === "function") {
            AudioManager.setVoiceMode(1);
        }

    }

 } catch (e) {

    console.warn("[App] AudioManager configuration failed:", e);

 }
/* Chrome TTS Unlock */

 document.addEventListener(
    "pointerdown",
    function unlockSpeech() {

        try {

            if (window.speechSynthesis) {

                window.speechSynthesis.resume();

            }

        } catch (e) {}

    },

    { once: true }

);
    /* 4. Init Alien (if available) */
    try {
      if (typeof Alien !== 'undefined' && typeof Alien.init === 'function') {
        Alien.init();
      }
    } catch (e) {
      console.warn('[App] Alien.init() failed:', e);
    }

    /* 5. Init Engine */
    if (typeof Engine === 'undefined' || typeof Engine.init !== 'function') {
      console.error('[App] Engine not found.');
      return false;
    }

    var engineOk = Engine.init();
    if (!engineOk) {
      console.error('[App] Engine.init() failed.');
      return false;
    }

    /* 6. Subscribe to Engine events */
    Engine.on('slideChanged', function (data) {
      _renderCurrentSlide();
    });

    Engine.on('finished', function (data) {
      _renderCurrentSlide();
    });

    /* 7. Init Renderers */
    if (typeof Renderers === 'undefined' || typeof Renderers.init !== 'function') {
      console.error('[App] Renderers not found.');
      return false;
    }
    Renderers.init();

    /* 8. Bind events */
    _bindEvents();

    /* 9. Initial render */
    _renderCurrentSlide();

    /* 10. Update navigation state */
    _updateProgress();

    _booted = true;
    _destroyed = false;

    console.log('[App] Bootstrap complete.');
    return true;
  }

  /* ============================================================
   *  DESTROY
   * ============================================================ */

  function destroy() {
    if (!_booted) { return; }

    _unbindEvents();

    if (typeof Renderers !== 'undefined' && typeof Renderers.destroy === 'function') {
      Renderers.destroy();
    }

    if (typeof Engine !== 'undefined' && typeof Engine.reset === 'function') {
      Engine.reset();
    }

    if (typeof AudioManager !== 'undefined' && typeof AudioManager.destroy === 'function') {
      AudioManager.destroy();
    }

    if (typeof Alien !== 'undefined' && typeof Alien.destroy === 'function') {
      Alien.destroy();
    }

    if (typeof Utils !== 'undefined' && typeof Utils.destroy === 'function') {
      Utils.destroy();
    }

    var keys = Object.keys(_dom);
    for (var i = 0; i < keys.length; i++) {
      _dom[keys[i]] = null;
    }

    _booted = false;
    _destroyed = true;

    console.log('[App] Destroyed.');
  }

  /* ============================================================
   *  EXPOSE ON WINDOW
   * ============================================================ */

  window.App = {
    bootstrap: bootstrap,
    destroy  : destroy
  };

  /* ============================================================
   *  AUTO-BOOTSTRAP
   * ============================================================ */

  function _autoBootstrap() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        bootstrap();
      });
    } else {
      bootstrap();
    }
  }

  _autoBootstrap();

})();
