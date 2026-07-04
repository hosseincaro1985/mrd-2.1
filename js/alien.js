/**
 * ============================================================
 *  ALIEN v5.0 — Emotion Spaceship Character Controller
 *  Visual animation & state for the alien avatar
 * ============================================================
 *
 *  Dependencies: NONE
 *  Consumes:     DOM (reads .sr-alien__emoji created by renderers.js)
 *  Produces:     Alien (global)
 *
 *  Compatible with:
 *    renderers.js (creates alien DOM → alien.js animates it)
 *    app.js (calls speakStart/speakEnd via TTS callbacks)
 *    engine.js (NOT used — zero coupling)
 *    content-layer.js (NOT used)
 *    answer-store.js  (NOT used)
 *    audio.js (NOT used)
 *
 *  Load order: before renderers.js (defines global, no DOM yet)
 *
 *  API:
 *    init(rootEl)        → bind to alien DOM element
 *    rebind()            → re-find alien element after render
 *    setPose(pose)       → change pose (idle, happy, sad, etc.)
 *    setMood(mood)       → change mood (neutral, excited, worried, etc.)
 *    speakStart()        → start speaking animation
 *    speakEnd()          → stop speaking animation
 *    animate(type)       → trigger one-shot animation
 *    destroy()           → full cleanup
 *
 *  Pose values:
 *    idle | happy | sad | surprised | thinking |
 *    worried | excited | proud | confused
 *
 *  Mood values:
 *    neutral | excited | worried | sad | happy |
 *    curious | proud | confused
 *
 * ============================================================
 */

var Alien = (function () {
  'use strict';



  /* ============================================================
   *  0. CONSTANTS
   * ============================================================ */

 var _SELECTORS = {
  container: '.sr-alien, .slide__dialogue-icon',
  emoji:     '.sr-alien__emoji, .slide__dialogue-icon',
  fallback:  '[data-alien], .slide__dialogue-icon'
};

  var _VALID_POSES = {
    idle       : true,
    happy      : true,
    sad        : true,
    surprised  : true,
    thinking   : true,
    worried    : true,
    excited    : true,
    proud      : true,
    confused   : true
  };

  var _VALID_MOODS = {
    neutral    : true,
    excited    : true,
    worried    : true,
    sad        : true,
    happy      : true,
    curious    : true,
    proud      : true,
    confused   : true
  };

  /* Pose → emoji mapping */
 var _POSE_IMAGES = {
  idle:        'assets/images/alien_idle.png',
  happy:       'assets/images/alien_happy.png',
  sad:         'assets/images/alien_sad.png',
  thinking:    'assets/images/alien_thinking.png',
  surprised:   'assets/images/alien_surprised.png',
  talking:     'assets/images/alien_talking.png',
  celebration: 'assets/images/alien_celebration.png',
  sleep:       'assets/images/alien_sleep.png',
  wave:        'assets/images/alien_wave.png',
  point:       'assets/images/alien_point.png'
};

  /* Default emoji when pose is unknown */
  var _DEFAULT_EMOJI = '🧑‍🚀';

  /* CSS class prefix */
  var _CLS_PREFIX     = 'alien--';
  var _MOOD_PREFIX    = 'alien-mood--';
  var _SPEAKING_CLS   = 'alien--speaking';
  var _ANIM_PREFIX    = 'alien-anim--';

  /* Speaking bob interval (ms) */
  var _SPEAK_INTERVAL = 250;

  /* Blink interval (ms) */
  var _BLINK_INTERVAL = 3000;

  /* Blink duration (ms) */
  var _BLINK_DURATION = 150;



  /* ============================================================
   *  1. PRIVATE STATE
   * ============================================================ */

  var _initialized     = false;
  var _destroyed       = false;

  var _rootEl          = null;   // .sr-alien container
  var _emojiEl         = null;   // .sr-alien__emoji element

  var _currentPose     = 'idle';
  var _currentMood     = 'neutral';

  var _speaking        = false;
  var _speakInterval   = null;
  var _speakPhase      = 0;

  var _blinkTimer      = null;
  var _blinkActive     = false;

  var _transTimer      = null;

  var _bobActive       = false;



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         INIT / REBIND                       ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  2. INIT — Initialize the Alien module
   *
   *  @param {Element} [rootEl] — optional root element to search in
   * ============================================================ */

  function init(rootEl) {

    if (_destroyed) {
      _destroyed = false;
    }

    _log('init()');

    /* Find the alien element */
    _findElement(rootEl);

    _initialized = true;

    /* Apply initial state */
    if (_emojiEl) {
      _applyPose(_currentPose);
      _applyMood(_currentMood);
      _startBlink();
    }
  }



  /* ============================================================
   *  3. REBIND — Re-find alien element after renderers re-render
   *
   *  Call this after Renderers.render() completes, because
   *  innerHTML replacement destroys old DOM nodes.
   * ============================================================ */

  function rebind(rootEl) {

    _log('rebind()');

    /* Preserve state */
    var wasSpeaking = _speaking;
    var pose        = _currentPose;
    var mood        = _currentMood;

    /* Stop animations (they reference old DOM) */
    _stopSpeakAnim();
    _stopBlink();

    /* Find new element */
    _findElement(rootEl);

    /* Restore state */
    if (_emojiEl) {
      _applyPose(pose);
      _applyMood(mood);
      _startBlink();

      if (wasSpeaking) {
        _startSpeakAnim();
      }
    }
  }



  /* ============================================================
   *  4. FIND ELEMENT — Locate alien DOM element
   * ============================================================ */

  function _findElement(rootEl) {

    var root = rootEl || document;

    /* Try primary selector */
    _emojiEl = root.querySelector(_SELECTORS.emoji);

    /* Try fallback */
    if (!_emojiEl) {
      _emojiEl = root.querySelector(_SELECTORS.fallback);
    }

    /* Find container */
    _rootEl = _emojiEl
                ? _emojiEl.closest(_SELECTORS.container) || _emojiEl.parentElement
                : null;

    if (_emojiEl) {
      _log('Alien element found');
    } else {
      _log('Alien element NOT found — will retry on rebind');
    }
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         POSE                                 ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  5. SET POSE — Change the alien's pose
   *
   *  @param {string} pose — one of the _VALID_POSES values
   * ============================================================ */

  function setPose(pose) {

    if (_destroyed) return;
    if (!pose || !_VALID_POSES[pose]) {
      _log('Invalid pose: ' + pose);
      return;
    }

    if (pose === _currentPose) return;

    _log('setPose: ' + _currentPose + ' → ' + pose);

    _currentPose = pose;

    if (_emojiEl) {
      _applyPose(pose);
    }
  }



  /* ============================================================
   *  6. APPLY POSE — Update DOM for pose
   * ============================================================ */

  function _applyPose(pose) {

    if (!_emojiEl) return;

    /* Remove all pose classes */
    _removeAllPoseClasses(_emojiEl);

    /* Add new pose class */
    _emojiEl.classList.add(_CLS_PREFIX + pose);

    /* Update image src */
    var imgSrc = _POSE_IMAGES[pose];
    if (imgSrc && _emojiEl.tagName === 'IMG') {
      _emojiEl.src = imgSrc;
    }

    /* Add pose class to container too */
    if (_rootEl && _rootEl !== _emojiEl) {
      _removeAllPoseClasses(_rootEl);
      _rootEl.classList.add(_CLS_PREFIX + pose);
    }
  }



  /* ============================================================
   *  7. REMOVE ALL POSE CLASSES
   * ============================================================ */

  function _removeAllPoseClasses(el) {
    if (!el || !el.classList) return;
    var poses = Object.keys(_VALID_POSES);
    for (var i = 0; i < poses.length; i++) {
      el.classList.remove(_CLS_PREFIX + poses[i]);
    }
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         MOOD                                 ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  8. SET MOOD — Change the alien's mood (visual overlay)
   *
   *  @param {string} mood — one of the _VALID_MOODS values
   * ============================================================ */

  function setMood(mood) {

    if (_destroyed) return;
    if (!mood || !_VALID_MOODS[mood]) {
      _log('Invalid mood: ' + mood);
      return;
    }

    if (mood === _currentMood) return;

    _log('setMood: ' + _currentMood + ' → ' + mood);

    _currentMood = mood;

    if (_emojiEl) {
      _applyMood(mood);
    }
  }



  /* ============================================================
   *  9. APPLY MOOD — Update DOM for mood
   * ============================================================ */

  function _applyMood(mood) {

    if (!_emojiEl) return;

    /* Remove all mood classes */
    _removeAllMoodClasses(_emojiEl);

    /* Add new mood class */
    _emojiEl.classList.add(_MOOD_PREFIX + mood);

    /* Add mood class to container too */
    if (_rootEl && _rootEl !== _emojiEl) {
      _removeAllMoodClasses(_rootEl);
      _rootEl.classList.add(_MOOD_PREFIX + mood);
    }
  }



  /* ============================================================
   *  10. REMOVE ALL MOOD CLASSES
   * ============================================================ */

  function _removeAllMoodClasses(el) {
    if (!el || !el.classList) return;
    var moods = Object.keys(_VALID_MOODS);
    for (var i = 0; i < moods.length; i++) {
      el.classList.remove(_MOOD_PREFIX + moods[i]);
    }
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         SPEAKING ANIMATION                   ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  11. SPEAK START — Begin speaking animation
   *
   *  Called by app.js when AudioManager TTS starts.
   *  Adds visual "speaking" state: bobbing + glow.
   * ============================================================ */

  function speakStart() {

    if (_destroyed) return;
    if (_speaking) return;

    _log('speakStart()');

    _speaking = true;

    if (!_emojiEl) return;

    /* Add speaking class */
    _emojiEl.classList.add(_SPEAKING_CLS);
    if (_rootEl && _rootEl !== _emojiEl) {
      _rootEl.classList.add(_SPEAKING_CLS);
    }

    /* Start bob animation */
    _startSpeakAnim();
  }



  /* ============================================================
   *  12. SPEAK END — Stop speaking animation
   *
   *  Called by app.js when AudioManager TTS ends.
   * ============================================================ */

  function speakEnd() {

    if (_destroyed) return;
    if (!_speaking) return;

    _log('speakEnd()');

    _speaking = false;

    /* Stop bob */
    _stopSpeakAnim();

    /* Remove speaking class */
    if (_emojiEl) {
      _emojiEl.classList.remove(_SPEAKING_CLS);
    }
    if (_rootEl && _rootEl !== _emojiEl) {
      _rootEl.classList.remove(_SPEAKING_CLS);
    }
  }



  /* ============================================================
   *  13. SPEAK ANIMATION — Internal bob cycle
   * ============================================================ */

  function _startSpeakAnim() {
    _stopSpeakAnim();

    _speakPhase = 0;

    _speakInterval = setInterval(function () {

      if (!_emojiEl) {
        _stopSpeakAnim();
        return;
      }

      _speakPhase = (_speakPhase + 1) % 2;

      /* Alternate between two visual states via transform */
      if (_speakPhase === 0) {
        _emojiEl.style.transform = 'translateY(-3px) scale(1.05)';
      } else {
        _emojiEl.style.transform = 'translateY(2px) scale(0.97)';
      }

    }, _SPEAK_INTERVAL);
  }

  function _stopSpeakAnim() {
    if (_speakInterval) {
      clearInterval(_speakInterval);
      _speakInterval = null;
    }

    _speakPhase = 0;

    /* Reset transform */
    if (_emojiEl) {
      _emojiEl.style.transform = '';
    }
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         BLINK ANIMATION                      ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  14. BLINK — Periodic blink effect
   * ============================================================ */

  function _startBlink() {
    _stopBlink();

    _blinkTimer = setInterval(function () {

      if (!_emojiEl || _destroyed) {
        _stopBlink();
        return;
      }

     /* Blink: scale Y to 0.1 briefly via CSS class */
      _blinkActive = true;
      _emojiEl.classList.add('alien--blink');

      setTimeout(function () {
        if (_emojiEl && _blinkActive) {
          _emojiEl.classList.remove('alien--blink');
          _blinkActive = false;
        }
      }, _BLINK_DURATION);

    }, _BLINK_INTERVAL);
  }

  function _stopBlink() {
    if (_blinkTimer) {
      clearInterval(_blinkTimer);
      _blinkTimer = null;
    }
    _blinkActive = false;
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         ONE-SHOT ANIMATIONS                   ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  15. ANIMATE — Trigger a one-shot animation
   *
   *  @param {string} type — animation type
   *    'bounce'     — quick bounce up and down
   *    'shake'      — horizontal shake
   *    'spin'       — 360° rotation
   *    'pulse'      — scale pulse
   *    'wiggle'     — playful wiggle
   *    'celebrate'  — celebration bounce + spin
   *    'nod'        — nod yes
   *    'shake-head' — shake no
   * ============================================================ */

  function animate(type) {

    if (_destroyed) return;
    if (!_emojiEl) return;

    _log('animate: ' + type);

    /* Clear any pending transition timeout */
    _clearTransTimer();

    /* Ensure transition is enabled */
    _emojiEl.style.transition = 'transform 0.3s ease';

    switch (type) {

      case 'bounce':
        _runSequence([
          { transform: 'translateY(-12px) scale(1.1)',  duration: 150 },
          { transform: 'translateY(0) scale(1)',         duration: 150 },
          { transform: 'translateY(-8px) scale(1.05)',   duration: 120 },
          { transform: 'translateY(0) scale(1)',         duration: 120 }
        ]);
        break;

      case 'shake':
        _runSequence([
          { transform: 'translateX(-5px)',  duration: 80 },
          { transform: 'translateX(5px)',   duration: 80 },
          { transform: 'translateX(-4px)',  duration: 80 },
          { transform: 'translateX(4px)',   duration: 80 },
          { transform: 'translateX(0)',     duration: 80 }
        ]);
        break;

      case 'spin':
        _runSequence([
          { transform: 'rotate(360deg) scale(1.1)', duration: 500 },
          { transform: 'rotate(0deg) scale(1)',      duration: 100 }
        ]);
        break;

      case 'pulse':
        _runSequence([
          { transform: 'scale(1.25)',  duration: 200 },
          { transform: 'scale(0.95)',  duration: 150 },
          { transform: 'scale(1)',     duration: 150 }
        ]);
        break;

      case 'wiggle':
        _runSequence([
          { transform: 'rotate(-10deg)',  duration: 100 },
          { transform: 'rotate(10deg)',   duration: 100 },
          { transform: 'rotate(-8deg)',   duration: 100 },
          { transform: 'rotate(8deg)',    duration: 100 },
          { transform: 'rotate(-4deg)',   duration: 80  },
          { transform: 'rotate(0deg)',    duration: 80  }
        ]);
        break;

      case 'celebrate':
        _runSequence([
          { transform: 'translateY(-15px) rotate(10deg) scale(1.15)', duration: 200 },
          { transform: 'translateY(0) rotate(-10deg) scale(1)',       duration: 200 },
          { transform: 'translateY(-10px) rotate(5deg) scale(1.1)',   duration: 180 },
          { transform: 'translateY(0) rotate(0deg) scale(1)',         duration: 180 }
        ]);
        break;

      case 'nod':
        _runSequence([
          { transform: 'rotateX(15deg)',  duration: 200 },
          { transform: 'rotateX(0deg)',   duration: 200 },
          { transform: 'rotateX(15deg)',  duration: 200 },
          { transform: 'rotateX(0deg)',   duration: 200 }
        ]);
        break;

      case 'shake-head':
        _runSequence([
          { transform: 'rotate(-12deg)', duration: 150 },
          { transform: 'rotate(12deg)',  duration: 150 },
          { transform: 'rotate(-10deg)', duration: 150 },
          { transform: 'rotate(10deg)',  duration: 150 },
          { transform: 'rotate(0deg)',   duration: 100 }
        ]);
        break;

      default:
        _log('Unknown animation type: ' + type);
    }
  }



  /* ============================================================
   *  16. RUN SEQUENCE — Execute a series of transform steps
   *
   *  @param {Array} steps — [{ transform, duration }, ...]
   * ============================================================ */

  function _runSequence(steps) {

    if (!_emojiEl || !steps || steps.length === 0) return;

    var i = 0;

    function nextStep() {
      if (i >= steps.length || _destroyed || !_emojiEl) {
        /* Reset after sequence */
        _clearTransTimer();
        if (_emojiEl && !_speaking) {
          _emojiEl.style.transition = 'transform 0.3s ease';
          _emojiEl.style.transform  = '';
        }
        return;
      }

      var step = steps[i];
      _emojiEl.style.transition = 'transform ' + step.duration + 'ms ease';
      _emojiEl.style.transform  = step.transform;

      i++;
      _transTimer = setTimeout(nextStep, step.duration + 10);
    }

    nextStep();
  }



  /* ============================================================
   *  17. CLEAR TRANSITION TIMER
   * ============================================================ */

  function _clearTransTimer() {
    if (_transTimer) {
      clearTimeout(_transTimer);
      _transTimer = null;
    }
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         DESTROY                              ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */



  /* ============================================================
   *  18. DESTROY — Full cleanup
   * ============================================================ */

  function destroy() {

    if (_destroyed) return;
    _destroyed = true;

    _log('destroy()');

    /* Stop all animations */
    _stopSpeakAnim();
    _stopBlink();
    _clearTransTimer();

    /* Reset DOM state */
    if (_emojiEl) {
      _removeAllPoseClasses(_emojiEl);
      _removeAllMoodClasses(_emojiEl);
      _emojiEl.classList.remove(_SPEAKING_CLS);
      _emojiEl.style.transform  = '';
      _emojiEl.style.transition = '';
    }

    if (_rootEl && _rootEl !== _emojiEl) {
      _removeAllPoseClasses(_rootEl);
      _removeAllMoodClasses(_rootEl);
      _rootEl.classList.remove(_SPEAKING_CLS);
    }

    /* Clear references */
    _rootEl      = null;
    _emojiEl     = null;
    _initialized = false;
    _speaking    = false;
    _currentPose = 'idle';
    _currentMood = 'neutral';

    _log('Alien destroyed');
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         STATUS GETTERS                       ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */

  function isReady() {
    return _initialized && !_destroyed && !!_emojiEl;
  }

  function getCurrentPose() {
    return _currentPose;
  }

  function getCurrentMood() {
    return _currentMood;
  }

  function isSpeaking() {
    return _speaking;
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         DIAGNOSE                             ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */

  function diagnose() {
    var sep = '═══════════════════════════════════════════';
    console.info(sep);
    console.info('  ALIEN DIAGNOSTIC');
    console.info(sep);
    console.info('  State:');
    console.info('    initialized : ' + _initialized);
    console.info('    destroyed   : ' + _destroyed);
    console.info('    rootEl      : ' + (_rootEl  ? '✓ ' + _rootEl.tagName  : '✗ null'));
    console.info('    emojiEl     : ' + (_emojiEl ? '✓ ' + _emojiEl.tagName : '✗ null'));
    console.info('    currentPose : ' + _currentPose);
    console.info('    currentMood : ' + _currentMood);
    console.info('    speaking    : ' + _speaking);
    console.info('    blinkActive : ' + _blinkActive);
    console.info('');
    console.info('  Timers:');
    console.info('    speakInterval : ' + (_speakInterval ? 'ACTIVE' : 'none'));
    console.info('    blinkTimer    : ' + (_blinkTimer    ? 'ACTIVE' : 'none'));
    console.info('    transTimer    : ' + (_transTimer     ? 'ACTIVE' : 'none'));
    console.info('');
    console.info('  Valid Poses: ' + Object.keys(_VALID_POSES).join(', '));
    console.info('  Valid Moods: ' + Object.keys(_VALID_MOODS).join(', '));
    console.info(sep);
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         LOGGING                              ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */

  var _debug = true;

  function _log(msg) {
    if (_debug) {
      console.info('[Alien] ' + msg);
    }
  }



  /* ============================================================
   *
   *  ╔══════════════════════════════════════════════╗
   *  ║         PUBLIC API                           ║
   *  ╚══════════════════════════════════════════════╝
   *
   * ============================================================ */

  return {

    /* ── Lifecycle ── */
    init              : init,
    rebind            : rebind,
    destroy           : destroy,

    /* ── State ── */
    setPose           : setPose,
    setMood           : setMood,

    /* ── Speaking ── */
    speakStart        : speakStart,
    speakEnd          : speakEnd,

    /* ── Animation ── */
    animate           : animate,

    /* ── Status ── */
    isReady           : isReady,
    getCurrentPose    : getCurrentPose,
    getCurrentMood    : getCurrentMood,
    isSpeaking        : isSpeaking,

    /* ── Debug ── */
    diagnose          : diagnose,

    /* ── Constants (for external reference) ── */
    POSES             : Object.keys(_VALID_POSES),
    MOODS             : Object.keys(_VALID_MOODS),

    /* ── Version ── */
    version           : function () { return '5.0.0'; }

  };

})();