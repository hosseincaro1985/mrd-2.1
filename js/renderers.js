/**
 * ============================================================
 *  renderers.js v9.0.1 — Emotion Spaceship Renderers
 * ============================================================
 */

(function () {
  'use strict';

  var VERSION = '9.0.1';

  var _dom = { slideWrapper: null };
  var _initialized = false;

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

  function _toPersianNum(n) {
    if (typeof Utils !== 'undefined' && typeof Utils.toPersianNum === 'function') {
      return Utils.toPersianNum(n);
    }
    var fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(n).replace(/[0-9]/g, function (d) { return fa[+d]; });
  }

  function init() {
    _dom.slideWrapper = document.getElementById('slideWrapper');
    if (!_dom.slideWrapper) {
      console.error('[Renderers] #slideWrapper not found.');
      _initialized = false;
      return false;
    }
    _initialized = true;
    return true;
  }

  function destroy() {
    _dom.slideWrapper = null;
    _initialized = false;
  }

  function _insert(html) {
    if (!_dom.slideWrapper) {
      console.warn('[Renderers] Cannot insert HTML — #slideWrapper not cached.');
      return;
    }
    _dom.slideWrapper.innerHTML = html;
  }

  function _errorCard(message) {
    return (
      '<section class="slide slide--error">' +
        '<h2 class="slide__title">خطا</h2>' +
        '<div class="slide__body"><p>' + _esc(message) + '</p></div>' +
      '</section>'
    );
  }

  function _alienHtml(image) {
    var img = image || 'assets/images/alien_idle.png';
    return (
      '<div class="slide__dialogue">' +
        '<div class="slide__dialogue-icon"><img src="' + img + '" alt="فضا نور" /></div>' +
      '</div>'
    );
  }

  function render(renderData) {
    if (!renderData) {
      console.error('[Renderers] render called with null/undefined.');
      _insert(_errorCard('داده‌ای برای نمایش وجود ندارد.'));
      return;
    }

    if (!_initialized || !_dom.slideWrapper) {
      console.error('[Renderers] Not initialized — calling init() now.');
      if (!init()) { return; }
    }

    var type = renderData.type || '';
    var html = '';

    switch (type) {
      case 'child-info':
        html = _renderChildInfo(renderData);
        break;
      case 'station-intro':
        html = _renderStationIntro(renderData);
        break;
      case 'story-slide':
        html = _renderStorySlide(renderData);
        break;
      case 'question-slide':
        html = _renderQuestionSlide(renderData);
        break;
      case 'transition':
        html = _renderTransition(renderData);
        break;
      case 'mission2-ready':
        html = _renderMission2Ready(renderData);
        break;
      case 'farewell':
        html = _renderFarewell(renderData);
        break;
          default:
        console.warn('[Renderers] Unknown type: ' + type);
        html = _errorCard('اسلاید ناشناخته: ' + _esc(type));
        break;
    }

    if (typeof html !== 'string') {
      console.error('[Renderers] Renderer returned non-string for "' + type + '".');
      html = _errorCard('خطا در تولید محتوا');
    }

    _insert(html);
  }

  /* ============================================================
   *  RENDER: child-info
   * ============================================================ */

  function _renderChildInfo(d) {
    var title = (d && d.title) ? d.title : 'به سفینه احساسات خوش آمدی!';
    var body  = (d && d.body)  ? d.body  : '';

    var showContinue = false;
    try {
      if (typeof Engine !== 'undefined' && typeof Engine.isStarted === 'function' &&
          typeof Engine.isFinished === 'function') {
        showContinue = Engine.isStarted() && !Engine.isFinished();
      }
    } catch (e) { /* silent */ }

    return (
      '<section class="slide slide--child-info">' +
       '<div class="slide__character"><img class="sr-alien__emoji" data-alien src="assets/images/alien_waving.png" alt="فضا نور" /></div>' +
        '<h2 class="slide__title">به سفینه احساسات خوش آمدی!</h2>' +
        (body ? '<div class="slide__body"><p>' + _esc(body) + '</p></div>' : '') +
        '<div class="slide__form">' +
          '<div class="form-group">' +
            '<label for="childNameInput">اسمت چیه؟</label>' +
            '<input id="childNameInput" type="text" maxlength="30" autocomplete="off" ' +
              'aria-label="نام کودک" aria-required="true" placeholder="نامت رو اینجا بنویس..." />' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="studentAge">چند سالته؟</label>' +
            '<input id="studentAge" type="number" min="4" max="15" autocomplete="off" ' +
              'aria-label="سن کودک" aria-required="true" placeholder="مثلاً ۸" />' +
          '</div>' +
          '<button id="childNameSubmit" class="js-submit-name" type="button" ' +
            'aria-label="شروع بازی">بریم! 🚀</button>' +
          (showContinue
            ? '<button id="btnContinue" class="js-continue" type="button" ' +
                'aria-label="ادامه بازی">↩️ ادامه بازی</button>'
            : '') +
        '</div>' +
      '</section>'
    );
  }

  /* ============================================================
   *  RENDER: station-intro
   * ============================================================ */

  function _renderStationIntro(d) {
    var title       = (d && d.title)       ? d.title       : '';
    var body        = (d && d.body)        ? d.body        : '';
    var station     = (d && d.station)     ? d.station     : null;
    var emotionName = (d && d.emotionName) ? d.emotionName : '';

    var icon  = (station && station.icon)  ? station.icon  : '⭐';
    var color = (station && station.color) ? station.color : '#FFD700';

    /* ===== Dialogue (alien speech) ===== */
    var dialogueText = '';
    if (d && d.dialogueRef) {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getEditableText === 'function') {
        var dt = ContentLayer.getEditableText(d.dialogueRef);
        if (dt && typeof dt === 'object' && dt.text) {
          dialogueText = dt.text;
        } else if (typeof dt === 'string') {
          dialogueText = dt;
        }
      } else if (typeof d.dialogueRef === 'string') {
        dialogueText = d.dialogueRef;
      } else if (d.dialogueRef && d.dialogueRef.text) {
        dialogueText = d.dialogueRef.text;
      }
    }

    var dialogueHtml = '';
    if (dialogueText) {
      dialogueHtml =
        '<div class="slide__dialogue">' +
          '<div class="slide__dialogue-icon"><img src="assets/images/alien_idle.png" alt="فضا نور" /></div>' +
          '<div class="slide__dialogue-text">' + _esc(dialogueText) + '</div>' +
        '</div>';
    } else {
      dialogueHtml = _alienHtml('assets/images/alien_idle.png');
    }

    var bodyContent = '';
    if (body) {
      bodyContent = body;
    }
    if (!bodyContent && emotionName) {
      bodyContent = 'بیا با احساس «' + emotionName + '» آشنا بشیم!';
    }

    /* ===== فقط ایستگاه اول ===== */
    var responseHtml = '';
    if (d.stationId === 1) {
      responseHtml =
        '<div class="slide__question">' +
          '<textarea id="stationIntroAnswer" rows="4" ' +
            'placeholder="احساس‌هایی که می‌شناسی را اینجا بنویس..." ' +
          '></textarea>' +
          '<br><br>' +
          '<button class="js-station-submit" type="button">ثبت پاسخ ✅</button>' +
        '</div>';
    }

    return (
      '<section class="slide slide--station-intro" data-station-id="' + _esc(d.stationId) + '">' +
        '<div class="slide__icon" style="color:' + _esc(color) + '">' + _esc(icon) + '</div>' +
        '<h2 class="slide__title">' + _esc(title) + '</h2>' +
        (bodyContent ? '<div class="slide__body"><p>' + _esc(bodyContent) + '</p></div>' : '') +
        dialogueHtml +
        responseHtml +
        '<div class="slide__footer">' +
          '<button class="js-next" type="button">ادامه</button>' +
        '</div>' +
      '</section>'
    );
  }

  /* ============================================================
   *  RENDER: story-slide
   * ============================================================ */

  function _renderStorySlide(d) {
    var title     = (d && (d.title || d.storyTitle)) ? (d.title || d.storyTitle) : '';
    var body      = (d && (d.body || d.storyText))   ? (d.body || d.storyText)   : '';
    var story     = (d && d.story) ? d.story : null;

    if (!body && story && story.text) {
      body = story.text;
    }
    if (!title && story && (story.title || story.topic)) {
      title = story.title || story.topic;
    }

    /* ===== Dialogue (alien speech before story) ===== */
    var dialogueText = '';
    if (d && d.dialogueRef) {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getEditableText === 'function') {
        var dt = ContentLayer.getEditableText(d.dialogueRef);
        if (dt && typeof dt === 'object' && dt.text) {
          dialogueText = dt.text;
        } else if (typeof dt === 'string') {
          dialogueText = dt;
        }
      } else if (typeof d.dialogueRef === 'string') {
        dialogueText = d.dialogueRef;
      } else if (d.dialogueRef && d.dialogueRef.text) {
        dialogueText = d.dialogueRef.text;
      }
    }

    var dialogueHtml = '';
    if (dialogueText) {
      dialogueHtml =
        '<div class="slide__dialogue">' +
          '<div class="slide__dialogue-icon"><img src="assets/images/alien_question.png" alt="فضا نور" /></div>' +
          '<div class="slide__dialogue-text">' + _esc(dialogueText) + '</div>' +
        '</div>';
    } else {
      dialogueHtml = _alienHtml('assets/images/alien_question.png');
    }

    var bodyContent = body;

    /* ===== Question data ===== */
    var question     = (d && d.question)     ? d.question     : null;
    var options      = (d && d.options)      ? d.options      : [];
    var questionId   = (d && d.questionId)   ? d.questionId   : '';
    var questionText = (d && d.questionText) ? d.questionText : '';
    var questionType = (d && d.questionType) ? d.questionType : '';
    var hasQuestion  = !!(question || questionText);

    var questionHtml = '';

    if (hasQuestion) {
      var type   = questionType || (question && question.type) || 'single-choice';
      var prompt = questionText || (question && question.prompt) || '';

      var optionsHtml = '';

      if (type === 'open-ended') {
        optionsHtml =
          '<div class="slide__open-ended">' +
            '<textarea id="openEndedAnswer" rows="4" ' +
              'placeholder="جوابت رو اینجا بنویس..." ' +
              'aria-label="پاسخ تشریحی" aria-required="true"></textarea>' +
            '<button class="js-submit-open" type="button" aria-label="ثبت پاسخ">ثبت پاسخ ✅</button>' +
          '</div>';
      } else {
        if (options && options.length > 0) {
          optionsHtml = '<div class="options-list slide__options">';
          for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            var optText = (opt && opt.text) ? opt.text : '';
            optionsHtml +=
              '<button class="slide__option js-option" ' +
                'data-option-id="' + _esc(opt.id) + '" ' +
                'data-question-id="' + _esc(questionId) + '" ' +
                'type="button" ' +
                'aria-label="گزینه ' + _toPersianNum(i + 1) + '">' +
                _esc(optText) +
              '</button>';
          }
          optionsHtml += '</div>';
        }
      }

      var fbCorrect = (question && question.feedbackCorrect) ? question.feedbackCorrect : 'آفرین! درست انتخاب کردی! 🎉';
      var fbWrong   = (question && question.feedbackWrong)   ? question.feedbackWrong   : 'اشکال نداره! دفعه بعد بهتر می‌شه. 💪';

      questionHtml =
        '<div class="slide__question" data-question-id="' + _esc(questionId) + '" data-question-type="' + _esc(type) + '"' +
          (type === 'multi-choice' || type === 'multi' ? ' data-max-selections="' + _esc(d.maxSelections || 2) + '"' : '') +
          '>' +
          (prompt ? '<h3 class="slide__question-text">' + _esc(prompt) + '</h3>' : '') +
          '<div class="slide__question-body">' + optionsHtml + '</div>' +
          '<div class="slide__feedback slide__feedback--correct" style="display:none">' +
            '<span class="slide__feedback-icon">✅</span>' +
            '<span class="slide__feedback-text">' + _esc(fbCorrect) + '</span>' +
          '</div>' +
          '<div class="slide__feedback slide__feedback--wrong" style="display:none">' +
            '<span class="slide__feedback-icon">❌</span>' +
            '<span class="slide__feedback-text">' + _esc(fbWrong) + '</span>' +
          '</div>' +
        '</div>';
    }

    return (
      '<section class="slide slide--story" data-story-id="' + _esc(d.storyId) + '"' +
        (hasQuestion ? ' data-question-id="' + _esc(questionId) + '"' : '') +
        '>' +
        dialogueHtml +
        (title ? '<h2 class="slide__title">' + _esc(title) + '</h2>' : '') +
        (bodyContent ? '<div class="slide__body"><p>' + _esc(bodyContent) + '</p></div>' : '') +
        questionHtml +
        '<div class="slide__footer">' +
          (hasQuestion
            ? '<button class="js-next" type="button" style="display:none">ادامه</button>'
            : '<button class="js-next" type="button">ادامه</button>') +
        '</div>' +
      '</section>'
    );
  }

  /* ============================================================
   *  RENDER: question-slide
   * ============================================================ */

  function _renderQuestionSlide(d) {
    var title        = (d && d.title)        ? d.title        : '';
    var question     = (d && d.question)     ? d.question     : null;
    var options      = (d && d.options)      ? d.options      : [];
    var questionId   = (d && d.questionId)   ? d.questionId   : '';
    var questionText = (d && d.questionText) ? d.questionText : '';
    var questionType = (d && d.questionType) ? d.questionType : '';

    var type = questionType || (question && question.type) || 'single-choice';
    var prompt = questionText || (question && question.prompt) || title || '';

    if (!question && !questionText) {
      console.warn('[Renderers] Question slide has no question data.');
      return _errorCard('سؤال یافت نشد.');
    }

    var optionsHtml = '';

    if (type === 'open-ended') {
      optionsHtml =
        '<div class="slide__open-ended">' +
          '<textarea id="openEndedAnswer" rows="4" ' +
            'placeholder="جوابت رو اینجا بنویس..." ' +
            'aria-label="پاسخ تشریحی" aria-required="true"></textarea>' +
          '<button class="js-submit-open" type="button" aria-label="ثبت پاسخ">ثبت پاسخ ✅</button>' +
        '</div>';
    } else {
      if (!options || options.length === 0) {
        console.warn('[Renderers] Question "' + questionId + '" has no options.');
        optionsHtml = '<div class="slide__options"><p class="slide__no-options">گزینه‌ای موجود نیست.</p></div>';
      } else {
        optionsHtml = '<div class="options-list slide__options">';
        for (var i = 0; i < options.length; i++) {
          var opt = options[i];
          var optText = (opt && opt.text) ? opt.text : '';
          optionsHtml +=
            '<button class="slide__option js-option" ' +
              'data-option-id="' + _esc(opt.id) + '" ' +
              'data-question-id="' + _esc(questionId) + '" ' +
              'type="button" ' +
              'aria-label="گزینه ' + _toPersianNum(i + 1) + '">' +
              _esc(optText) +
            '</button>';
        }
        optionsHtml += '</div>';
      }
    }

    var fbCorrect = (question && question.feedbackCorrect) ? question.feedbackCorrect : 'آفرین! درست انتخاب کردی! 🎉';
    var fbWrong   = (question && question.feedbackWrong)   ? question.feedbackWrong   : 'اشکال نداره! دفعه بعد بهتر می‌شه. 💪';

    var alienHtml = _alienHtml('assets/images/alien_question.png');

    return (
      '<section class="slide slide--question" data-question-id="' + _esc(questionId) + '" data-question-type="' + _esc(type) + '"' +
        (type === 'multi-choice' || type === 'multi' ? ' data-max-selections="' + _esc(d.maxSelections || 2) + '"' : '') +
        '>' +
        alienHtml +
        '<h2 class="slide__title">' + _esc(prompt) + '</h2>' +
        '<div class="slide__body">' + optionsHtml + '</div>' +
        '<div class="slide__feedback slide__feedback--correct" style="display:none">' +
          '<span class="slide__feedback-icon">✅</span>' +
          '<span class="slide__feedback-text">' + _esc(fbCorrect) + '</span>' +
        '</div>' +
        '<div class="slide__feedback slide__feedback--wrong" style="display:none">' +
          '<span class="slide__feedback-icon">❌</span>' +
          '<span class="slide__feedback-text">' + _esc(fbWrong) + '</span>' +
        '</div>' +
        '<div class="slide__footer">' +
          '<button class="js-next" type="button" style="display:none">ادامه</button>' +
        '</div>' +
      '</section>'
    );
  }

  /* ============================================================
   *  RENDER: transition
   * ============================================================ */

  function _renderTransition(d) {
    var title = (d && d.title) ? d.title : 'حرکت به ایستگاه بعدی';
    var body  = (d && d.body)  ? d.body  : '';

    var alienHtml = _alienHtml('assets/images/alien_idle.png');

    return (
      '<section class="slide slide--transition">' +
        alienHtml +
        '<h2 class="slide__title">' + _esc(title) + '</h2>' +
        (body ? '<div class="slide__body"><p>' + _esc(body) + '</p></div>' : '') +
        '<div class="slide__footer">' +
          '<button class="js-next" type="button">ادامه 🚀</button>' +
        '</div>' +
      '</section>'
    );
  }

  /* ============================================================
   *  RENDER: farewell
   * ============================================================ */
function _renderMission2Ready(d) {

    return (
      '<section class="slide slide--mission2">' +

        '<div class="slide__character">' +
        '<img src="assets/images/alien_waving.png">' +
        '</div>' +

        '<h2 class="slide__title">ماموریت اول تمام شد!</h2>' +

        '<div class="slide__body">' +
        '<p>آفرین! حالا آماده ورود به ماموریت دوم هستی.</p>' +
        '</div>' +

        '<div class="slide__footer">' +
        '<button id="btnMission2" class="js-mission2" type="button">' +
        '🚀 شروع مأموریت دوم' +
        '</button>' +
        '</div>' +

      '</section>'
    );
}
  function _renderFarewell(d) {
    var title       = (d && d.title)       ? d.title       : 'تبریک!';
    var body        = (d && d.body)        ? d.body        : '';
    var score       = (d && typeof d.score === 'number')      ? d.score      : 0;
    var totalScore  = (d && typeof d.totalScore === 'number') ? d.totalScore : score;
    var childName   = (d && d.childName)   ? d.childName   : '';
    var totalSlides = (d && typeof d.totalSlides === 'number') ? d.totalSlides : 0;

    var displayScore = (totalScore > score) ? totalScore : score;
    var greeting     = childName ? _esc(childName) + ' عزیز، ' : '';

    var bodyHtml = '';
    if (body) {
      bodyHtml += '<p>' + _esc(body) + '</p>';
    }
    bodyHtml += '<p class="slide__score">امتیاز شما: ' + _toPersianNum(displayScore) + '</p>';

    var alienHtml = _alienHtml('assets/images/alien_waving.png');

    return (
      '<section class="slide slide--farewell">' +
        alienHtml +
        '<h2 class="slide__title">' + greeting + _esc(title) + '</h2>' +
        '<div class="slide__body">' + bodyHtml + '</div>' +
        '<div class="slide__footer">' +
          '<button class="js-restart" type="button" aria-label="شروع دوباره">شروع دوباره 🔄</button>' +
        '</div>' +
      '</section>'
    );
  }
   function _renderMission2Ready() {

    return (

    '<section class="slide slide--mission2">' +

      '<div class="slide__character">' +
        '<img src="assets/images/alien_waving.png" alt="فضا نور" />' +
      '</div>' +

      '<h2 class="slide__title">🎉 مأموریت اول تمام شد!</h2>' +

      '<div class="slide__body">' +
        '<p>آفرین!</p>' +
        '<p>حالا آماده ورود به مأموریت دوم هستی.</p>' +
      '</div>' +

      '<div class="slide__footer">' +
        '<button class="js-start-mission2" type="button">' +
          '🚀 شروع مأموریت دوم' +
        '</button>' +
      '</div>' +

    '</section>'

  );

}
  /* ============================================================
   *  EXPOSE ON WINDOW
   * ============================================================ */

  window.Renderers = {
    init   : init,
    render : render,
    destroy: destroy
  };

})();