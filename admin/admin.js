/**
 * admin.js v2.1.0 — پنل مدیریت سفر احساسات
 * نسخه نهایی و کامل — بدون باگ
 */

(function () {
  'use strict';

  var ADMIN_PASSWORD = 'admin123';
  var STORAGE_KEYS = {
    content: 'admin_content_overrides',
    audio: 'admin_audio_overrides',
    sections: 'admin_sections_config',
    answers: 'emotion_spaceship_progress'
  };

  var dom = {};

  function _cacheDom() {
    dom.loginScreen = document.getElementById('loginScreen');
    dom.dashboard = document.getElementById('dashboard');
    dom.adminPassword = document.getElementById('adminPassword');
    dom.loginBtn = document.getElementById('loginBtn');
    dom.loginError = document.getElementById('loginError');
    dom.logoutBtn = document.getElementById('logoutBtn');
    dom.tabs = document.querySelectorAll('.admin-tab');
    dom.tabContents = document.querySelectorAll('.admin-tab-content');
    dom.contentList = document.getElementById('contentList');
    dom.saveContentBtn = document.getElementById('saveContentBtn');
    dom.audioList = document.getElementById('audioList');
    dom.saveAudioBtn = document.getElementById('saveAudioBtn');
    dom.section1Enabled = document.getElementById('section1Enabled');
    dom.section2Enabled = document.getElementById('section2Enabled');
    dom.saveSectionsBtn = document.getElementById('saveSectionsBtn');
    dom.exportExcelBtn = document.getElementById('exportExcelBtn');
    dom.refreshAnswersBtn = document.getElementById('refreshAnswersBtn');
    dom.clearAnswersBtn = document.getElementById('clearAnswersBtn');
    dom.answersList = document.getElementById('answersList');
  }

  function _getStored(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* silent */ }
    return fallback;
  }

  function _setStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[Admin] Storage save failed:', e);
    }
  }

  function _esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var _toastTimer = null;

  function _showToast(message) {
    var toast = document.getElementById('adminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToast';
      toast.style.cssText =
        'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
        'background:rgba(122,44,245,0.95);backdrop-filter:blur(12px);' +
        'color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;' +
        'font-family:Vazirmatn,sans-serif;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.3);' +
        'opacity:0;transition:opacity 0.3s ease;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';

    if (_toastTimer) clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () {
      toast.style.opacity = '0';
    }, 3000);
  }

  /* ============================================================
   *  LOGIN
   * ============================================================ */

  function _handleLogin() {
    var password = dom.adminPassword.value;
    if (password === ADMIN_PASSWORD) {
      dom.loginScreen.style.display = 'none';
      dom.dashboard.style.display = 'block';
      sessionStorage.setItem('admin_logged_in', 'true');
      _initDashboard();
    } else {
      dom.loginError.style.display = 'block';
      dom.adminPassword.value = '';
    }
  }

  function _handleLogout() {
    sessionStorage.removeItem('admin_logged_in');
    dom.dashboard.style.display = 'none';
    dom.loginScreen.style.display = 'flex';
    dom.adminPassword.value = '';
    dom.loginError.style.display = 'none';
  }

  /* ============================================================
   *  TABS
   * ============================================================ */

  function _handleTabClick(e) {
    var tabName = e.target.getAttribute('data-tab');
    var i;

    for (i = 0; i < dom.tabs.length; i++) {
      dom.tabs[i].classList.remove('active');
    }
    e.target.classList.add('active');

    for (i = 0; i < dom.tabContents.length; i++) {
      dom.tabContents[i].classList.remove('active');
    }
    document.getElementById('tab-' + tabName).classList.add('active');
  }

  /* ============================================================
   *  CONTENT TAB
   * ============================================================ */

 function _loadContent() {
    var slides = [];
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getAllSlides === 'function') {
        slides = ContentLayer.getAllSlides();
      }
    } catch (e) { /* silent */ }

    var overrides = _getStored(STORAGE_KEYS.content, {});
    var html = '';
    var count = 0;

    for (var i = 0; i < slides.length; i++) {
      var slide = slides[i];
      var textId = slide.dialogueRef || ('slide-' + i + '-body');
      var currentText = '';
      var labelPrefix = 'اسلاید ' + (i + 1);

      /* ── Resolve full text from ContentLayer ── */

      /* 1) Check overrides first */
      if (overrides[textId]) {
        currentText = overrides[textId];
      }

      /* 2) Story slides — get full story text */
      if ((!currentText || currentText.trim().length === 0) && slide.storyId) {
        try {
          var story = ContentLayer.getStory(slide.storyId);
          if (story) {
            if (story.text) {
              currentText = story.text;
              labelPrefix = 'داستان — ' + (story.title || ('slide-' + i));
            } else if (story.title) {
              currentText = story.title;
            }
          }
        } catch (e) { /* silent */ }
      }

      /* 3) Question slides — get question prompt */
      if ((!currentText || currentText.trim().length === 0) && slide.questionIds && slide.questionIds.length > 0) {
        var qTexts = [];
        for (var qi = 0; qi < slide.questionIds.length; qi++) {
          try {
            var q = ContentLayer.getQuestion(slide.questionIds[qi]);
            if (q) {
              var qText = q.prompt || q.text || '';
              if (qText) qTexts.push(qText);
              /* Also get options */
              var opts = ContentLayer.getOptionsByQuestion(slide.questionIds[qi]);
              for (var oi = 0; oi < opts.length; oi++) {
                if (opts[oi].text) {
                  qTexts.push('  ▸ ' + opts[oi].text + (opts[oi].isCorrect ? ' ✓' : ''));
                }
              }
            }
          } catch (e) { /* silent */ }
        }
        if (qTexts.length > 0) {
          currentText = qTexts.join('\n');
          labelPrefix = 'سؤالات — ' + (slide.title || ('slide-' + i));
        }
      }

      /* 4) Single question slide */
      if ((!currentText || currentText.trim().length === 0) && slide.questionId) {
        try {
          var sq = ContentLayer.getQuestion(slide.questionId);
          if (sq) {
            currentText = sq.prompt || sq.text || '';
            labelPrefix = 'سؤال — ' + (slide.title || ('slide-' + i));
          }
        } catch (e) { /* silent */ }
      }

      /* 5) Fallback to slide body / title */
      if ((!currentText || currentText.trim().length === 0) && slide.body) {
        currentText = slide.body;
      }
      if ((!currentText || currentText.trim().length === 0) && slide.title) {
        currentText = slide.title;
      }

      if (!currentText || currentText.trim().length === 0) continue;

      count++;

      html +=
        '<div class="content-item">' +
          '<div class="content-item__label">' + _esc(labelPrefix) + ' — ' + _esc(textId) + '</div>' +
          '<textarea class="content-item__textarea" data-text-id="' + _esc(textId) + '" rows="' + (currentText.split('\n').length > 3 ? 6 : 3) + '">' + _esc(currentText) + '</textarea>' +
        '</div>';
    }

    if (count === 0) {
      dom.contentList.innerHTML = '<p style="color:#888;text-align:center;padding:20px">متن‌ یافت نشد</p>';
    } else {
      dom.contentList.innerHTML = html;
    }
  }

  function _saveContent() {
    var textareas = dom.contentList.querySelectorAll('textarea');
    var overrides = _getStored(STORAGE_KEYS.content, {});

    for (var i = 0; i < textareas.length; i++) {
      var ta = textareas[i];
      overrides[ta.getAttribute('data-text-id')] = ta.value;
    }

    _setStored(STORAGE_KEYS.content, overrides);
    _showToast('متن‌ها ذخیره شدند ✅');
  }

  /* ============================================================
   *  AUDIO TAB
   * ============================================================ */

  function _loadAudio() {
    var slides = [];
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getAllSlides === 'function') {
        slides = ContentLayer.getAllSlides();
      }
    } catch (e) { /* silent */ }

    var audioOverrides = _getStored(STORAGE_KEYS.audio, {});
    var html = '';
    var count = 0;

    for (var i = 0; i < slides.length; i++) {
      var slide = slides[i];
      var textId = slide.dialogueRef || ('slide-' + i + '-body');
      var hasAudio = audioOverrides[textId] ? true : false;

      count++;

      html +=
        '<div class="audio-item">' +
          '<div class="audio-item__label">اسلاید ' + (i + 1) + ' — ' + _esc(textId) + '</div>' +
          '<div class="audio-item__file">' +
            '<input type="file" accept="audio/mp3,audio/*" data-text-id="' + _esc(textId) + '">' +
          '</div>' +
          '<div class="audio-item__status">' + (hasAudio ? '✅ صدا موجود' : '⬜ بدون صدا') + '</div>' +
        '</div>';
    }

    if (count === 0) {
      dom.audioList.innerHTML = '<p style="color:#888;text-align:center;padding:20px">متن‌ یافت نشد</p>';
    } else {
      dom.audioList.innerHTML = html;
    }
  }

  function _saveAudio() {
    var fileInputs = dom.audioList.querySelectorAll('input[type="file"]');
    var audioOverrides = _getStored(STORAGE_KEYS.audio, {});
    var pending = 0;
    var done = 0;

    for (var i = 0; i < fileInputs.length; i++) {
      var input = fileInputs[i];
      var textId = input.getAttribute('data-text-id');

      if (input.files && input.files[0]) {
        pending++;
        _readFileAsBase64(input.files[0], function (id, base64) {
          audioOverrides[id] = base64;
          done++;
          if (done === pending) {
            _setStored(STORAGE_KEYS.audio, audioOverrides);
            _loadAudio();
            _showToast('صداها ذخیره شدند ✅');
          }
        }.bind(null, textId));
      }
    }

    if (pending === 0) {
      _showToast('هیچ فایل جدیدی انتخاب نشده');
    }
  }

  function _readFileAsBase64(file, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  /* ============================================================
   *  SECTIONS TAB
   * ============================================================ */

  function _loadSections() {
    var config = _getStored(STORAGE_KEYS.sections, {
      section1: true,
      section2: false
    });
    dom.section1Enabled.checked = config.section1;

    /* Read Part 2 state from localStorage first, then sync to ContentLayer */
    var part2Enabled = config.section2 === true;
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.setPart2Enabled === 'function') {
        ContentLayer.setPart2Enabled(part2Enabled);
      }
    } catch (e) { /* silent */ }

    dom.section2Enabled.checked = part2Enabled;
  }

  function _saveSections() {
    var config = {
      section1: dom.section1Enabled.checked,
      section2: dom.section2Enabled.checked
    };
    _setStored(STORAGE_KEYS.sections, config);

    /* Sync Part 2 state to ContentLayer */
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.setPart2Enabled === 'function') {
        ContentLayer.setPart2Enabled(config.section2);
      }
    } catch (e) { /* silent */ }

    _showToast('تنظیمات بخش‌ها ذخیره شد ✅');
  }
  /* ============================================================
   *  ANSWERS TAB
   * ============================================================ */

  function _loadAnswers() {
    var stored = _getStored(STORAGE_KEYS.answers, null);

    if (!stored || !stored.answersStore || stored.answersStore.length === 0) {
      dom.answersList.innerHTML = '<p style="color:#888;text-align:center;padding:20px">هنوز پاسخی ثبت نشده است</p>';
      return;
    }

    var records = stored.answersStore;
    var html = '';

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var name = r.childName || 'ناشناس';
      var age = r.childAge || '';
      var qId = r.questionId || '';
      var ansVal = r.answerValue || r.answer || '';
      if (typeof ansVal === 'object') ansVal = JSON.stringify(ansVal);
      var score = r.score || 0;

      html +=
        '<div class="answer-card">' +
          '<div class="answer-card__header">' +
            '<div class="answer-card__name">' + _esc(name) + ' (' + _esc(age) + ' ساله)</div>' +
            '<div class="answer-card__score">امتیاز: ' + _esc(score) + '</div>' +
          '</div>' +
          '<div class="answer-card__details">' +
            '<div class="answer-card__detail">' +
              '<span class="answer-card__detail-label">سؤال:</span> ' +
              '<span>' + _esc(qId) + '</span>' +
            '</div>' +
            '<div class="answer-card__detail">' +
              '<span class="answer-card__detail-label">پاسخ:</span> ' +
              '<span>' + _esc(ansVal) + '</span>' +
            '</div>' +
          '</div>' +
          '<div style="margin-top:12px;text-align:left">' +
            '<button class="answer-card__delete" data-index="' + i + '">🗑️ حذف</button>' +
          '</div>' +
        '</div>';
    }

    dom.answersList.innerHTML = html;

    var deleteBtns = dom.answersList.querySelectorAll('.answer-card__delete');
    for (var j = 0; j < deleteBtns.length; j++) {
      deleteBtns[j].addEventListener('click', _handleDeleteAnswer);
    }
  }

  function _handleDeleteAnswer(e) {
    var index = parseInt(e.target.getAttribute('data-index'), 10);
    if (isNaN(index)) return;

    if (!confirm('آیا از حذف این پاسخ مطمئن هستید؟')) return;

    var stored = _getStored(STORAGE_KEYS.answers, null);
    if (!stored || !stored.answersStore) return;

    stored.answersStore.splice(index, 1);
    _setStored(STORAGE_KEYS.answers, stored);
    _loadAnswers();
    _showToast('پاسخ حذف شد');
  }

  function _handleClearAnswers() {
    if (!confirm('⚠️ آیا از حذف تمام پاسخ‌ها مطمئن هستید؟ این عمل قابل بازگشت نیست!')) return;
    if (!confirm('برای تأیید نهایی دوباره کلیک کنید.')) return;

    localStorage.removeItem(STORAGE_KEYS.answers);
    _loadAnswers();
    _showToast('تمام پاسخ‌ها حذف شدند');
  }

  /* ============================================================
   *  EXPORT EXCEL
   * ============================================================ */

  function _exportExcel() {
    var stored = _getStored(STORAGE_KEYS.answers, null);

    if (!stored || !stored.answersStore || stored.answersStore.length === 0) {
      _showToast('هیچ پاسخی برای خروجی وجود ندارد');
      return;
    }

    var records = stored.answersStore;

    var header = ['ردیف', 'نام', 'سن', 'سؤال', 'پاسخ', 'امتیاز'];
    var rows = [header];

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var name = r.childName || 'ناشناس';
      var age = r.childAge || '';
      var qId = r.questionId || '';
      var ansVal = r.answerValue || r.answer || '';
      if (typeof ansVal === 'object') ansVal = JSON.stringify(ansVal);
      var score = r.score || 0;

      rows.push([
        String(i + 1),
        name,
        age,
        qId,
        String(ansVal),
        String(score)
      ]);
    }

    var csv = '\uFEFF';
    for (var r2 = 0; r2 < rows.length; r2++) {
      var cells = rows[r2].map(function (cell) {
        var s = String(cell).replace(/"/g, '""');
        if (s.indexOf(',') !== -1 || s.indexOf('\n') !== -1) {
          s = '"' + s + '"';
        }
        return s;
      });
      csv += cells.join(',') + '\n';
    }

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'safar-e-ehsas-answers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    _showToast('فایل اکسل دانلود شد 📊');
  }

  /* ============================================================
   *  INIT DASHBOARD
   * ============================================================ */

  function _initDashboard() {
    _loadContent();
    _loadAudio();
    _loadSections();
    _loadAnswers();
  }

  /* ============================================================
   *  BIND EVENTS
   * ============================================================ */

  function _bindEvents() {
    dom.loginBtn.addEventListener('click', _handleLogin);
    dom.adminPassword.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') _handleLogin();
    });
    dom.logoutBtn.addEventListener('click', _handleLogout);

    for (var i = 0; i < dom.tabs.length; i++) {
      dom.tabs[i].addEventListener('click', _handleTabClick);
    }

    dom.saveContentBtn.addEventListener('click', _saveContent);
    dom.saveAudioBtn.addEventListener('click', _saveAudio);
    dom.saveSectionsBtn.addEventListener('click', _saveSections);
    dom.exportExcelBtn.addEventListener('click', _exportExcel);
    dom.refreshAnswersBtn.addEventListener('click', _loadAnswers);
    dom.clearAnswersBtn.addEventListener('click', _handleClearAnswers);
  }

  /* ============================================================
   *  INIT
   * ============================================================ */

  function init() {
    _cacheDom();
    _bindEvents();

    if (sessionStorage.getItem('admin_logged_in') === 'true') {
      dom.loginScreen.style.display = 'none';
      dom.dashboard.style.display = 'block';
      _initDashboard();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
