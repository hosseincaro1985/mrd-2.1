/**
 * ============================================================
 *  engine.js v7.1.0 — Emotion Spaceship Game Engine
 *
 *  Dependencies:
 *    - content.js       (CONTENT global)
 *    - content-layer.js (ContentLayer global)
 *    - answer-store.js  (AnswerStore global — optional)
 *
 *  Exposes: window.Engine
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
   *  SLIDE TYPES
   * ============================================================ */

 var SLIDE_TYPES = {
    CHILD_INFO    : 'child-info',
    STATION_INTRO : 'station-intro',
    STORY_SLIDE   : 'story-slide',
    QUESTION_SLIDE: 'question-slide',
    FAREWELL      : 'farewell',
    MISSION2_START: 'mission2-start'
};

  /* ============================================================
   *  INTERNAL STATE
   * ============================================================ */

  var _state = {
    currentSlide        : 0,
    currentQuestionId   : null,
    currentQuestionIds  : null,
    currentQuestionIndex: 0,
    phase               : 'idle',
    selectedSingle      : null,
    selectedMulti       : [],
    maxSelections       : 2,
    childName           : '',
    score               : 0,
    totalSlides         : 0,
    initialized         : false,

    waitingMission2 : false
  };

  var _listeners = {};

  /* ============================================================
   *  EVENT BUS
   * ============================================================ */

  function _on(event, callback) {
    if (!_listeners[event]) {
      _listeners[event] = [];
    }
    _listeners[event].push(callback);
  }

  function _off(event, callback) {
    if (!_listeners[event]) { return; }
    var result = [];
    for (var i = 0; i < _listeners[event].length; i++) {
      if (_listeners[event][i] !== callback) {
        result.push(_listeners[event][i]);
      }
    }
    _listeners[event] = result;
  }

  function _fire(event, data) {
    if (!_listeners[event]) { return; }
    for (var i = 0; i < _listeners[event].length; i++) {
      try {
        _listeners[event][i](data);
      } catch (e) {
        console.error('[Engine] Listener error on "' + event + '":', e);
      }
    }
  }

  /* ============================================================
   *  INTERNAL HELPERS
   * ============================================================ */

  function _log() {
    if (typeof console !== 'undefined' && console.log) {
      var args = ['[Engine v7.1]'];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      console.log.apply(console, args);
    }
  }

  function _getSlide(slideNumber) {
    if (typeof ContentLayer === 'undefined' || typeof ContentLayer.getSlide !== 'function') {
      console.error('[Engine] ContentLayer.getSlide is not available.');
      return null;
    }
    return ContentLayer.getSlide(slideNumber);
  }

  function _resolveStation(stationId) {
    if (!stationId) { return null; }
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getStation === 'function') {
        return ContentLayer.getStation(stationId);
      }
    } catch (e) { /* silent */ }
    return null;
  }

  function _resolveStory(storyId) {
    if (!storyId) { return null; }
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getStory === 'function') {
        return ContentLayer.getStory(storyId);
      }
    } catch (e) { /* silent */ }
    return null;
  }

  function _resolveQuestion(questionId) {
    if (!questionId) { return null; }
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getQuestion === 'function') {
        return ContentLayer.getQuestion(questionId);
      }
    } catch (e) { /* silent */ }
    return null;
  }

  function _resolveOptions(question) {
    if (!question) {
      return [];
    }
    if (!question.optionIds || !Array.isArray(question.optionIds)) {
      console.warn('[Engine] Question "' + question.id + '" has no optionIds array.');
      return [];
    }
    var result = [];
    for (var i = 0; i < question.optionIds.length; i++) {
      try {
        if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getOption === 'function') {
          var opt = ContentLayer.getOption(question.optionIds[i]);
          if (opt) { result.push(opt); }
        }
      } catch (e) { /* silent */ }
    }
    return result;
  }

  function _resolveEmotionName(emotionId) {
    if (!emotionId) { return ''; }
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getEmotion === 'function') {
        var emotion = ContentLayer.getEmotion(emotionId);
        return emotion ? (emotion.name || '') : '';
      }
    } catch (e) { /* silent */ }
    return '';
  }

  /* ============================================================
   *  MULTI-CHOICE HELPERS
   * ============================================================ */

  function _isMultiChoiceQuestion(question) {
    if (!question) { return false; }
    var type = question.type || '';
    return type === 'multi-choice' || type === 'multi';
  }

  function _getCorrectOptionIds(question) {
    if (!question) { return []; }

    if (question.correctOptionIds && Array.isArray(question.correctOptionIds)) {
      return question.correctOptionIds.slice();
    }

    var correctIds = [];
    var options = _resolveOptions(question);

    for (var i = 0; i < options.length; i++) {
      if (options[i].isCorrect) {
        correctIds.push(options[i].id);
      }
    }

    return correctIds;
  }

  function _checkMultiChoiceAnswer(question, selectedIds) {
    if (!question || !selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
      return false;
    }

    var correctIds = _getCorrectOptionIds(question);

    if (correctIds.length === 0) {
      console.warn('[Engine] No correct options found for multi-choice question: ' + question.id);
      return false;
    }

    if (selectedIds.length !== correctIds.length) {
      return false;
    }

    for (var i = 0; i < selectedIds.length; i++) {
      if (correctIds.indexOf(selectedIds[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  function _calculateMultiChoiceScore(question, selectedIds, isCorrect) {
    if (!question) { return 0; }

    var maxScore = (typeof question.score === 'number') ? question.score : 10;

    if (isCorrect) {
      return maxScore;
    }

    if (question.partialScoring) {
      var correctIds = _getCorrectOptionIds(question);

      if (correctIds.length === 0) { return 0; }

      var correctCount = 0;
      for (var i = 0; i < selectedIds.length; i++) {
        if (correctIds.indexOf(selectedIds[i]) > -1) {
          correctCount++;
        }
      }

      var perCorrect = Math.floor(maxScore / correctIds.length);
      return correctCount * perCorrect;
    }

    return 0;
  }

  /* ============================================================
   *  ANSWER RESTORATION
   * ============================================================ */

  function _restoreSelectedFromStore(slideNumber) {
    try {
      if (typeof AnswerStore === 'undefined' || typeof AnswerStore.getAnswerValue !== 'function') {
        return null;
      }
      var slide = _getSlide(slideNumber);
      if (!slide || !slide.questionId) { return null; }
      var saved = AnswerStore.getAnswerValue(slide.questionId);
      return (typeof saved !== 'undefined' && saved !== null) ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function _restoreMultiFromStore(slideNumber) {
    try {
      if (typeof AnswerStore === 'undefined' || typeof AnswerStore.getAnswerValue !== 'function') {
        return [];
      }
      var slide = _getSlide(slideNumber);
      if (!slide || !slide.questionId) { return []; }

      var saved = AnswerStore.getAnswerValue(slide.questionId);

      if (Array.isArray(saved)) {
        return saved.slice();
      }

      if (saved && typeof saved === 'object' && Array.isArray(saved.selectedOptionIds)) {
        return saved.selectedOptionIds.slice();
      }

      return [];
    } catch (e) {
      return [];
    }
  }

  /* ============================================================
   *  PHASE MANAGEMENT
   * ============================================================ */

  function _updatePhaseFromSlide(slide) {
    if (!slide) { return; }

    switch (slide.type) {
      case SLIDE_TYPES.CHILD_INFO:
        _state.phase = 'child-info';
        _state.currentQuestionId = null;
        _state.currentQuestionIds = null;
        break;
      case SLIDE_TYPES.STATION_INTRO:
        _state.phase = 'playing';
        _state.currentQuestionId = null;
        _state.currentQuestionIds = null;
        break;
      case SLIDE_TYPES.STORY_SLIDE:
        _state.phase = 'story';
        if (slide.questionIds && slide.questionIds.length > 0) {
          _state.currentQuestionIds = slide.questionIds.slice();
          _state.currentQuestionIndex = 0;
          _state.currentQuestionId = slide.questionIds[0];
        } else {
          _state.currentQuestionIds = null;
          _state.currentQuestionId = null;
        }
        break;
      case SLIDE_TYPES.QUESTION_SLIDE:
        _state.phase = 'question';
        _state.currentQuestionId = slide.questionId || null;
        _state.currentQuestionIds = null;
        break;
      case SLIDE_TYPES.FAREWELL:
        _state.phase = 'finished';
        _state.currentQuestionId = null;
        _state.currentQuestionIds = null;
        break;
      default:
        _state.phase = 'playing';
        _state.currentQuestionId = null;
        _state.currentQuestionIds = null;
        break;
    }
  }

  /* ============================================================
   *  SAVE CURRENT ANSWER
   * ============================================================ */

  function _saveCurrentAnswer() {
    if (_state.phase !== 'question' && _state.phase !== 'story') {
      return;
    }
    if (!_state.currentQuestionId) {
      return;
    }

    var question = _resolveQuestion(_state.currentQuestionId);

    if (!question) {
      console.warn('[Engine] Cannot save answer — question not found: ' + _state.currentQuestionId);
      return;
    }

    /* ===== MULTI-CHOICE ===== */
    if (_isMultiChoiceQuestion(question)) {
      if (!_state.selectedMulti || _state.selectedMulti.length === 0) {
        return;
      }

      var multiCorrect = _checkMultiChoiceAnswer(question, _state.selectedMulti);
      var multiScore   = _calculateMultiChoiceScore(question, _state.selectedMulti, multiCorrect);

      if (multiScore > 0) {
        _state.score += multiScore;
      }

      try {
        if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.recordAnswer === 'function') {
          AnswerStore.recordAnswer({
            questionId       : _state.currentQuestionId,
            type             : 'multi-choice',
            answer           : _state.selectedMulti.slice(),
            selectedOptionIds: _state.selectedMulti.slice(),
            isCorrect        : multiCorrect,
            score            : multiScore
          });
        }
      } catch (e) { /* silent */ }

      _fire('answerSubmitted', {
        questionId: _state.currentQuestionId,
        type      : 'multi-choice',
        selected  : _state.selectedMulti.slice(),
        isCorrect : multiCorrect,
        score     : _state.score
      });

      return;
    }

    /* ===== SINGLE-CHOICE ===== */
    if (_state.selectedSingle === null || _state.selectedSingle === undefined) {
      return;
    }

    var option = null;

    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getOption === 'function') {
        option = ContentLayer.getOption(_state.selectedSingle);
      }
    } catch (e) { /* silent */ }

    var isCorrect = option ? !!option.isCorrect : false;
    var points    = (question && typeof question.score === 'number') ? question.score : 1;

    if (isCorrect) {
      _state.score += points;
    }

    try {
      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.recordAnswer === 'function') {
        AnswerStore.recordAnswer({
          questionId: _state.currentQuestionId,
          type      : 'single-choice',
          answer    : _state.selectedSingle,
          isCorrect : isCorrect,
          score     : isCorrect ? points : 0
        });
      }
    } catch (e) { /* silent */ }

    _fire('answerSubmitted', {
      questionId: _state.currentQuestionId,
      type      : 'single-choice',
      optionId  : _state.selectedSingle,
      isCorrect : isCorrect,
      score     : _state.score
    });
  }
 function startMission2() {
     _state.selectedSingle = null;
     _state.selectedMulti = [];
     _state.currentQuestionId = null;
     _state.currentQuestionIds = null;
     _state.currentQuestionIndex = 0;
    _state.waitingMission2 = false;

    var indices = ContentLayer.getSlideIndices();

    for (var i = 0; i < indices.length; i++) {

        var slide = _getSlide(indices[i]);

        if (slide && slide.part === 2) {

            _state.currentSlide = indices[i];

            _updatePhaseFromSlide(slide);

            _fire("slideChanged", {
                slideNumber: indices[i],
                slide: slide
            });

            return true;
        }
    }

    return false;
}
  /* ============================================================
   *  PUBLIC API — INITIALIZATION
   * ============================================================ */

  function init() {
    if (_state.initialized) {
      _log('Already initialized.');
      return true;
    }

    if (typeof ContentLayer === 'undefined' || typeof ContentLayer.getSlide !== 'function') {
      console.error('[Engine] ContentLayer or ContentLayer.getSlide not found.');
      return false;
    }

    if (typeof CONTENT === 'undefined' || !CONTENT.slides || typeof CONTENT.slides.length !== 'number') {
      console.error('[Engine] CONTENT.slides not found or invalid.');
      return false;
    }

    _state.totalSlides = ContentLayer.getSlideCount();

    if (_state.totalSlides === 0) {
      console.error('[Engine] Zero slides found.');
      return false;
    }

    var indices = ContentLayer.getSlideIndices();
    var firstIndex = (indices && indices.length > 0) ? indices[0] : 0;

    _state.currentSlide         = firstIndex;
    _state.currentQuestionId    = null;
    _state.currentQuestionIds   = null;
    _state.currentQuestionIndex = 0;
    _state.phase                = 'idle';
    _state.selectedSingle       = null;
    _state.selectedMulti        = [];
    _state.childName            = '';
    _state.score                = 0;
    _state.initialized          = true;

    var firstSlide = _getSlide(firstIndex);
    if (firstSlide) {
      _updatePhaseFromSlide(firstSlide);
    }

    _log('Initialized — ' + _state.totalSlides + ' slides.');

    if (firstSlide) {
      _fire('slideChanged', { slideNumber: firstIndex, slide: firstSlide });
    }

    return true;
  }

  /* ============================================================
   *  PUBLIC API — NAVIGATION
   * ============================================================ */

  function next() {
    if (!_state.initialized) {
      console.error('[Engine] Not initialized.');
      return false;
    }

    _saveCurrentAnswer();

    var currentSlide = _getSlide(_state.currentSlide);
    if (currentSlide && currentSlide.questionIds && currentSlide.questionIds.length > 0) {
      _state.currentQuestionIndex++;
      if (_state.currentQuestionIndex < currentSlide.questionIds.length) {
        _state.currentQuestionId = currentSlide.questionIds[_state.currentQuestionIndex];
        _state.selectedSingle = null;
        _state.selectedMulti  = [];
        var slide2 = _getSlide(_state.currentSlide);
        _fire('slideChanged', { slideNumber: _state.currentSlide, slide: slide2 });
        return true;
      }
    }

    _state.currentQuestionIndex = 0;
    _state.currentQuestionIds   = null;
    _state.currentQuestionId    = null;

    var nextIndex = ContentLayer.getNextSlideIndex(_state.currentSlide);

    if (nextIndex !== null) {
      _state.currentSlide = nextIndex;

      _state.selectedSingle = _restoreSelectedFromStore(_state.currentSlide);
      _state.selectedMulti  = _restoreMultiFromStore(_state.currentSlide);

      var slide = _getSlide(_state.currentSlide);
      _updatePhaseFromSlide(slide);

      _fire('slideChanged', { slideNumber: _state.currentSlide, slide: slide });
      return true;
    }

    /* ── Stage 2 Activation ── */
    /* If Part 2 is not yet enabled, check if it should be. */
    var part2Enabled = false;
    try {
      if (typeof ContentLayer !== 'undefined' && typeof ContentLayer.getPart2Enabled === 'function') {
        part2Enabled = ContentLayer.getPart2Enabled();
      }
    } catch (e) { /* silent */ }
     console.log("Stage2 Enabled =", part2Enabled);

     try{
    console.log(
        "Slide Count =",
        ContentLayer.getSlideCount()
        );
    }catch(e){}

    if (!part2Enabled) {
      /* Check if Part 2 exists at all */
      var hasPart2 = false;
      try {
        if (typeof CONTENT !== 'undefined' && CONTENT.slides) {
          for (var pi = 0; pi < CONTENT.slides.length; pi++) {
            if (CONTENT.slides[pi].part === 2) { hasPart2 = true; break; }
          }
        }
      } catch (e) { /* silent */ }

      if (hasPart2) {
       console.log("Part2 EXISTS");
        /* Enable Part 2 and refresh slide count */
        try {
          if (typeof ContentLayer.setPart2Enabled === 'function') {
            ContentLayer.setPart2Enabled(true);
            console.log("Part2 ENABLED");
            console.log(
            "Slide Count After Enable =",
             ContentLayer.getSlideCount()
           );
          }
        } catch (e) { /* silent */ }
           _state.totalSlides = ContentLayer.getSlideCount();
       
        /* Find the first Part 2 slide index */
        var part2FirstIndex = null;
        var allIndices = ContentLayer.getSlideIndices();
        for (var qi = 0; qi < allIndices.length; qi++) {
          var p2slide = _getSlide(allIndices[qi]);
          if (p2slide && p2slide.part === 2) {
            part2FirstIndex = allIndices[qi];
            break;
          }
        }

        if (part2FirstIndex !== null) {

       _state.waitingMission2 = true;

       _fire('slideChanged', {
          slideNumber: _state.currentSlide,
          slide: _getSlide(_state.currentSlide)
     });

      return true;

         }
      }
    }

    _state.phase = 'finished';
    _fire('finished', { score: _state.score, childName: _state.childName });
    _log('Reached end.');
    return false;
  }

  function prev() {
    if (!_state.initialized) {
      console.error('[Engine] Not initialized.');
      return false;
    }

    var prevIndex = ContentLayer.getPrevSlideIndex(_state.currentSlide);

    if (prevIndex !== null) {
      _state.currentSlide = prevIndex;

      _state.selectedSingle = _restoreSelectedFromStore(_state.currentSlide);
      _state.selectedMulti  = _restoreMultiFromStore(_state.currentSlide);

      var slide = _getSlide(_state.currentSlide);
      _updatePhaseFromSlide(slide);

      _fire('slideChanged', { slideNumber: _state.currentSlide, slide: slide });
      return true;
    }

    _log('Already at first slide.');
    return false;
  }

  function canGoForward() {
    if (!_state.initialized) { return false; }
    return ContentLayer.getNextSlideIndex(_state.currentSlide) !== null;
  }

  function canGoBack() {
    if (!_state.initialized) { return false; }
    return ContentLayer.getPrevSlideIndex(_state.currentSlide) !== null;
  }

  /* ============================================================
   *  PUBLIC API — SLIDE DATA
   * ============================================================ */

  function getCurrentSlide() {
    if (!_state.initialized) { return null; }
    return _getSlide(_state.currentSlide);
  }

  function getCurrentIndex() {
    return _state.currentSlide;
  }

  /* ============================================================
   *  PUBLIC API — RENDER PIPELINE
   * ============================================================ */

  function renderCurrentSlide() {

   if (_state.waitingMission2) {

    return {
        type: "mission2-ready"
    };

  }
    var slide = getCurrentSlide();
    
    if (!slide) {
      console.error('[Engine] No slide at slideNumber ' + _state.currentSlide);
      return null;
    }

    var type = slide.type || '';

    var activeQuestionId = slide.questionId || null;
    if (!activeQuestionId && slide.questionIds && slide.questionIds.length > 0) {
      var qIdx = _state.currentQuestionIndex || 0;
      if (qIdx < slide.questionIds.length) {
        activeQuestionId = slide.questionIds[qIdx];
      }
    }

    var context = {
      slide      : slide,
      slideNumber: _state.currentSlide,
      childName  : _state.childName,
      score      : _state.score,
      station    : _resolveStation(slide.stationId),
      story      : _resolveStory(slide.storyId),
      question   : _resolveQuestion(activeQuestionId)
    };

    switch (type) {
      case SLIDE_TYPES.CHILD_INFO:
        return _renderChildInfo(context);

      case SLIDE_TYPES.STATION_INTRO:
        return _renderStationIntro(context);

      case SLIDE_TYPES.STORY_SLIDE:
        return _renderStorySlide(context);

      case SLIDE_TYPES.QUESTION_SLIDE:
        return _renderQuestionSlide(context);

      case SLIDE_TYPES.FAREWELL:
        return _renderFarewell(context);
      case "mission2-ready":
        return renderMission2Ready();

      default:
        console.error('[Engine] Unknown slide type: "' + type + '"');
        return null;
    }
  }

  /* ============================================================
   *  RENDER BUILDERS
   * ============================================================ */

  function _renderChildInfo(ctx) {
    return {
      type       : 'child-info',
      title      : ctx.slide.title || 'به سفینه احساسات خوش آمدی!',
      body       : ctx.slide.body  || '',
      dialogueRef: ctx.slide.dialogueRef || null,
      slideNumber: ctx.slideNumber
    };
  }

  function _renderStationIntro(ctx) {
    var s = ctx.station;
    var emotionId = ctx.slide.emotion || (s ? s.emotionId : '');
    var emotionName = _resolveEmotionName(emotionId);

    return {
      type        : 'station-intro',
      title       : ctx.slide.title || (s ? s.name : ''),
      body        : ctx.slide.body  || (s ? s.description : ''),
      stationId   : ctx.slide.stationId || null,
      station     : s,
      emotion     : emotionId,
      emotionName : emotionName,
      dialogueRef : ctx.slide.dialogueRef || null,
      slideNumber : ctx.slideNumber
    };
  }

  function _renderStorySlide(ctx) {
    var st = ctx.story;
    var storyTitle = ctx.slide.title || (st ? (st.title || st.topic) : '');
    var storyText  = ctx.slide.body  || (st ? st.text : '');

    var renderData = {
      type       : 'story-slide',
      title      : storyTitle,
      storyTitle : storyTitle,
      body       : storyText,
      storyText  : storyText,
      story      : st,
      storyId    : ctx.slide.storyId || null,
      stationId  : ctx.slide.stationId || null,
      emotion    : ctx.slide.emotion || '',
      dialogueRef: ctx.slide.dialogueRef || null,
      slideNumber: ctx.slideNumber
    };

    if (ctx.slide.questionIds && ctx.slide.questionIds.length > 0) {
      var qIdx = _state.currentQuestionIndex || 0;
      if (qIdx < ctx.slide.questionIds.length) {
        var qId = ctx.slide.questionIds[qIdx];
        var q = _resolveQuestion(qId);
        var options = _resolveOptions(q);
        renderData.questionId    = qId;
        renderData.question      = q;
        renderData.questionText  = (q && (q.prompt || q.text)) || '';
        renderData.questionType  = (q && q.type) || 'single-choice';
        renderData.options       = options;
        renderData.questionIndex = qIdx;
        renderData.questionTotal = ctx.slide.questionIds.length;

        if (renderData.questionType === 'multi-choice' || renderData.questionType === 'multi') {
          renderData.maxSelections = (q && q.maxSelections) ? q.maxSelections : _state.maxSelections;
        }
      }
    }
    
    return renderData;
  }

  function _renderQuestionSlide(ctx) {
    var q = ctx.question;
    var options = _resolveOptions(q);
    var qType = (q && q.type) || 'single-choice';

    var renderData = {
      type         : 'question-slide',
      title        : ctx.slide.title || '',
      questionId   : ctx.slide.questionId || null,
      question     : q,
      questionText : (q && (q.prompt || q.text)) || '',
      questionType : qType,
      options      : options,
      storyId      : ctx.slide.storyId || null,
      stationId    : ctx.slide.stationId || null,
      emotion      : ctx.slide.emotion || '',
      dialogueRef  : ctx.slide.dialogueRef || null,
      slideNumber  : ctx.slideNumber
    };

    if (qType === 'multi-choice' || qType === 'multi') {
      renderData.maxSelections = (q && q.maxSelections) ? q.maxSelections : _state.maxSelections;
    }

    return renderData;
  }

  function _renderFarewell(ctx) {
    return {
      type        : 'farewell',
      title       : ctx.slide.title || 'تبریک!',
      body        : ctx.slide.body  || '',
      score       : ctx.score,
      totalScore  : ctx.score,
      childName   : ctx.childName,
      totalSlides : _state.totalSlides,
      dialogueRef : ctx.slide.dialogueRef || null,
      slideNumber : ctx.slideNumber
    };
  }
   function renderMission2Ready() {

    return {
       type:"mission2-ready",
       title:"ماموریت اول تمام شد",
       body:"اگر آماده‌ای وارد ماموریت دوم شو."
    };

  }
  /* ============================================================
   *  PUBLIC API — PROGRESS & STATE
   * ============================================================ */

  function getProgress() {
    var percentage = _state.totalSlides > 0
      ? Math.round((_state.currentSlide / _state.totalSlides) * 100)
      : 0;

    return {
      currentSlide: _state.currentSlide,
      totalSlides : _state.totalSlides,
      percentage  : percentage,
      score       : _state.score
    };
  }

  function getStateSnapshot() {
    return {
      currentSlide        : _state.currentSlide,
      currentQuestionId   : _state.currentQuestionId,
      currentQuestionIds  : _state.currentQuestionIds ? _state.currentQuestionIds.slice() : null,
      currentQuestionIndex: _state.currentQuestionIndex,
      phase               : _state.phase,
      selectedSingle      : _state.selectedSingle,
      selectedMulti       : _state.selectedMulti ? _state.selectedMulti.slice() : [],
      childName           : _state.childName,
      score               : _state.score,
      totalSlides         : _state.totalSlides,
      initialized         : _state.initialized
    };
  }

  /* ============================================================
   *  PUBLIC API — CHILD NAME
   * ============================================================ */

  function setChildName(name) {
    var trimmed = (typeof name === 'string') ? name.trim() : '';
    if (trimmed.length === 0) {
      console.warn('[Engine] setChildName called with empty name.');
      return false;
    }
    _state.childName = trimmed;
    _log('Child name set: "' + _state.childName + '"');
    _fire('nameSet', { name: _state.childName });
    return true;
  }

  function getChildName() {
    return _state.childName;
  }

  /* ============================================================
   *  PUBLIC API — ANSWER HANDLING
   * ============================================================ */

  function selectOption(optionId) {
    if (!_state.currentQuestionId) {
      console.warn('[Engine] selectOption called without active question.');
      return false;
    }

    var question = _resolveQuestion(_state.currentQuestionId);

    if (_isMultiChoiceQuestion(question)) {
      return toggleOption(optionId);
    }

    _state.selectedSingle = optionId;
    _state.selectedMulti  = [];

    _log('Option selected: ' + optionId);
    _fire('optionSelected', {
      questionId: _state.currentQuestionId,
      optionId  : optionId
    });

    return true;
  }

  /* ============================================================
   *  PUBLIC API — TOGGLE OPTION (Multi-Choice)
   * ============================================================ */

  function toggleOption(optionId) {
    if (!_state.currentQuestionId) {
      console.warn('[Engine] toggleOption called without active question.');
      return false;
    }

    var question = _resolveQuestion(_state.currentQuestionId);

    if (!_isMultiChoiceQuestion(question)) {
      return selectOption(optionId);
    }

    if (!_state.selectedMulti) {
      _state.selectedMulti = [];
    }

    var idx = _state.selectedMulti.indexOf(optionId);
    if (idx > -1) {
      _state.selectedMulti.splice(idx, 1);

      _log('Option deselected: ' + optionId);
      _fire('optionDeselected', {
        questionId: _state.currentQuestionId,
        optionId  : optionId,
        selected  : _state.selectedMulti.slice()
      });

      return true;
    }

    var max = (question && question.maxSelections) ? question.maxSelections : _state.maxSelections;

    if (_state.selectedMulti.length >= max) {
      console.warn('[Engine] Max selections reached (' + max + ').');
      _fire('selectionLimit', {
        questionId: _state.currentQuestionId,
        max       : max
      });
      return false;
    }

    _state.selectedMulti.push(optionId);

    _log('Option selected (multi): ' + optionId);
    _fire('optionSelected', {
      questionId: _state.currentQuestionId,
      optionId  : optionId,
      selected  : _state.selectedMulti.slice()
    });

    return true;
  }

  function submitOpenEnded(text) {
    if (!_state.currentQuestionId) {
      console.warn('[Engine] submitOpenEnded called without active question.');
      return false;
    }

    var trimmed = (typeof text === 'string') ? text.trim() : '';
    if (trimmed.length === 0) {
      console.warn('[Engine] submitOpenEnded called with empty text.');
      return false;
    }

    var question = _resolveQuestion(_state.currentQuestionId);
    var points   = (question && typeof question.score === 'number') ? question.score : 1;

    _state.score += points;

    try {
      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.recordAnswer === 'function') {
        AnswerStore.recordAnswer({
          questionId: _state.currentQuestionId,
          type      : 'open-ended',
          answer    : trimmed,
          isCorrect : true,
          score     : points
        });
      }
    } catch (e) { /* silent */ }

    _fire('answerSubmitted', {
      questionId: _state.currentQuestionId,
      type      : 'open-ended',
      text      : trimmed,
      isCorrect : true,
      score     : _state.score
    });

    return true;
  }

  /* ============================================================
   *  PUBLIC API — STATUS
   * ============================================================ */

  function isStarted() {
    return _state.initialized && _state.phase !== 'idle';
  }

  function isFinished() {
    return _state.phase === 'finished';
  }

  /* ============================================================
   *  PUBLIC API — RESTART / RESET
   * ============================================================ */

  function restart() {
    var indices = ContentLayer.getSlideIndices();
    var firstIndex = (indices && indices.length > 0) ? indices[0] : 0;

    _state.currentSlide         = firstIndex;
    _state.currentQuestionId    = null;
    _state.currentQuestionIds   = null;
    _state.currentQuestionIndex = 0;
    _state.selectedSingle       = null;
    _state.selectedMulti        = [];
    _state.score                = 0;
    _state.phase                = 'idle';

    try {
      if (typeof AnswerStore !== 'undefined' && typeof AnswerStore.clear === 'function') {
        AnswerStore.clear();
      }
    } catch (e) { /* silent */ }

    var firstSlide = _getSlide(firstIndex);
    if (firstSlide) {
      _updatePhaseFromSlide(firstSlide);
    }

    _log('Restarted.');
    _fire('restarted', {});
  }

  function reset() {
    restart();
    _state.childName = '';
    _log('Fully reset.');
  }

  /* ============================================================
   *  PUBLIC API — EVENTS
   * ============================================================ */

  function on(event, callback) {
    _on(event, callback);
  }

  function off(event, callback) {
    _off(event, callback);
  }

  /* ============================================================
   *  EXPOSE ON WINDOW
   * ============================================================ */

  window.Engine = {
    SLIDE_TYPES: Object.freeze ? Object.freeze(SLIDE_TYPES) : SLIDE_TYPES,

    init   : init,
    restart: restart,
    reset  : reset,
    startMission2: startMission2,

    next        : next,
    prev        : prev,
    canGoForward: canGoForward,
    canGoBack   : canGoBack,

    getCurrentSlide: getCurrentSlide,
    getCurrentIndex: getCurrentIndex,

    renderCurrentSlide : renderCurrentSlide,

    getProgress     : getProgress,
    getStateSnapshot: getStateSnapshot,

    setChildName: setChildName,
    getChildName: getChildName,

    selectOption   : selectOption,
    toggleOption   : toggleOption,
    submitOpenEnded: submitOpenEnded,

    isStarted : isStarted,
    isFinished: isFinished,

    on : on,
    off: off
  };

})();