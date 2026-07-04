/**
 * ============================================================
 *  AUDIO v5.3.0 — Emotion Spaceship Audio Manager
 *  TTS + SFX + Recording — standalone, zero dependencies
 * ============================================================
 */

var AudioManager = (function () {
  'use strict';

  var _HAS_SPEECH = typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
  var _HAS_MEDIA_REC = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined';
  var _HAS_GET_MEDIA = typeof navigator !== 'undefined' && typeof navigator.mediaDevices !== 'undefined' && typeof navigator.mediaDevices.getUserMedia === 'function';
  var _HAS_AUDIO_CTX = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);

  var _ttsQueue = [];
  var _ttsCurrent = null;
  var _ttsPlaying = false;
  var _ttsWatchdog = null;
  var _ttsWatchdogTime = 60000;
  var _ttsVoiceMode = 0;

  var _chromeKeepAlive = null;

  var _sfxPool = [];
  var _sfxCtx = null;

  var _recStream = null;
  var _recRecorder = null;
  var _recChunks = [];
  var _recActive = false;
  var _recMaxTimer = null;
  var _recStartTime = 0;

  var _isSpeaking = false;
  var _isRecording = false;
  var _destroyed = false;

  function _clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  var _debug = true;

  function _log(msg) {
    if (_debug) {
      console.info('[Audio] ' + msg);
    }
  }

  /* ============================================================
   *  CHROME KEEP-ALIVE
   * ============================================================ */

  function _startChromeKeepAlive() {
    if (!_HAS_SPEECH) return;
    if (_chromeKeepAlive) clearInterval(_chromeKeepAlive);
    _chromeKeepAlive = setInterval(function () {
      if (window.speechSynthesis.speaking) {
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch (e) { /* silent */ }
      } else {
        clearInterval(_chromeKeepAlive);
        _chromeKeepAlive = null;
      }
    }, 10000);
  }

  function _stopChromeKeepAlive() {
    if (_chromeKeepAlive) {
      clearInterval(_chromeKeepAlive);
      _chromeKeepAlive = null;
    }
  }

  /* ============================================================
   *  TTS — Text To Speech
   * ============================================================ */

  function speak(config) {
    if (_destroyed) return;
    if (!config || !config.text || config.text.trim().length === 0) {
      if (config && config.onError) {
        config.onError('empty text');
      }
      return;
    }

    if (!_HAS_SPEECH) {
      _log('SpeechSynthesis not available');
      if (config.onError) {
        config.onError('SpeechSynthesis not supported');
      }
      return;
    }

    _ttsCancel();

    var fullText = config.text;
    var sentences = fullText.split(/(?<=[.!?؟])/);
    var chunks = [];
    var currentChunk = '';
    var i;

    for (i = 0; i < sentences.length; i++) {
      if ((currentChunk + sentences[i]).length <= 200) {
        currentChunk += sentences[i];
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentences[i];
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    if (chunks.length <= 1) {
      _speakSingleChunk(config.text, config);
      return;
    }

    _speakChunks(chunks, 0, config);
  }

  function _speakSingleChunk(text, config) {
    var synth = window.speechSynthesis;
    var utt = new SpeechSynthesisUtterance();

    utt.text = text;
    utt.lang = config.lang || 'fa-IR';
    utt.rate = _clamp(config.rate || 0.9, 0.1, 10);
    utt.pitch = _clamp(config.pitch || 1.0, 0, 2);
    utt.volume = _clamp(config.volume || 1.0, 0, 1);

  if (_ttsVoiceMode === 1) {
    utt.pitch = 1.8;
    utt.rate = 0.85;
}
    _ttsCurrent = {
      utterance: utt,
      config: config
    };

    utt.onstart = function () {
      _ttsPlaying = true;
      _isSpeaking = true;
      _ttsStartWatchdog(utt);
      _startChromeKeepAlive();
      _log('TTS started');
      if (config.onStart) {
        try { config.onStart(); } catch (e) { /* silent */ }
      }
    };

    utt.onend = function () {
      _ttsCleanup();
      _stopChromeKeepAlive();
      _log('TTS ended');
      if (config.onEnd) {
        try { config.onEnd(); } catch (e) { /* silent */ }
      }
    };

    utt.onerror = function (e) {
      var errName = (e && e.error) ? e.error : 'unknown';
      _ttsCleanup();
      _stopChromeKeepAlive();
      _log('TTS error: ' + errName);
      if (errName !== 'canceled' && config.onError) {
        try { config.onError(errName); } catch (ex) { /* silent */ }
      }
    };

    try {
      synth.speak(utt);
      _log('TTS queued: "' + config.text.substring(0, 50) + '..."');
    } catch (err) {
      _ttsCleanup();
      _log('TTS speak() threw: ' + err.message);
      if (config.onError) {
        try { config.onError(err.message); } catch (e) { /* silent */ }
      }
    }
  }

  function _speakChunks(chunks, index, config) {
    if (index >= chunks.length) {
      _ttsCleanup();
      _stopChromeKeepAlive();
      if (config.onEnd) {
        try { config.onEnd(); } catch (e) { /* silent */ }
      }
      return;
    }

    var synth = window.speechSynthesis;
    var utt = new SpeechSynthesisUtterance();

    utt.text = chunks[index];
    utt.lang = config.lang || 'fa-IR';
    utt.rate = _clamp(config.rate || 0.9, 0.1, 10);
    utt.pitch = _clamp(config.pitch || 1.0, 0, 2);
    utt.volume = _clamp(config.volume || 1.0, 0, 1);

    if (_ttsVoiceMode === 1) {
    utt.pitch = 1.8;
    utt.rate = 0.85;
}

    utt.onstart = function () {
      _ttsPlaying = true;
      _isSpeaking = true;
      if (index === 0) {
        _ttsStartWatchdog(utt);
        _startChromeKeepAlive();
        if (config.onStart) {
          try { config.onStart(); } catch (e) { /* silent */ }
        }
      }
    };

    utt.onend = function () {
      _speakChunks(chunks, index + 1, config);
    };

    utt.onerror = function (e) {
      var errName = (e && e.error) ? e.error : 'unknown';
      _ttsCleanup();
      _stopChromeKeepAlive();
      _log('TTS error: ' + errName);
      if (errName !== 'canceled' && config.onError) {
        try { config.onError(errName); } catch (ex) { /* silent */ }
      }
    };

    try {
      synth.speak(utt);
    } catch (err) {
      _ttsCleanup();
      _log('TTS speak() threw: ' + err.message);
      if (config.onError) {
        try { config.onError(err.message); } catch (e) { /* silent */ }
      }
    }
  }

  function _ttsCancel() {
    if (!_HAS_SPEECH) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) { /* silent */ }
    _ttsCleanup();
  }

  function _ttsCleanup() {
    _ttsStopWatchdog();
    _ttsPlaying = false;
    _isSpeaking = false;
    _ttsCurrent = null;
  }

  function _ttsStartWatchdog(utt) {
    _ttsStopWatchdog();
    _ttsWatchdog = setTimeout(function () {
      _log('TTS watchdog fired');
      _ttsCancel();
      if (_ttsCurrent && _ttsCurrent.config && _ttsCurrent.config.onEnd) {
        try { _ttsCurrent.config.onEnd(); } catch (e) { /* silent */ }
      }
      _ttsCleanup();
    }, _ttsWatchdogTime);
  }

  function _ttsStopWatchdog() {
    if (_ttsWatchdog) {
      clearTimeout(_ttsWatchdog);
      _ttsWatchdog = null;
    }
  }

  /* ============================================================
   *  SFX — Sound Effects
   * ============================================================ */

  function playSfx(src, options) {
    if (_destroyed) return null;
    if (!src) return null;
    options = options || {};

    try {
      var audio = new Audio();
      audio.src = src;
      audio.volume = _clamp(options.volume || 1.0, 0, 1);
      audio.loop = !!options.loop;
      audio.preload = 'auto';

      _sfxPool.push(audio);

      audio.onended = function () {
        _sfxRemove(audio);
        if (options.onEnd) {
          try { options.onEnd(); } catch (e) { /* silent */ }
        }
      };

      audio.onerror = function () {
        _sfxRemove(audio);
        _log('SFX error for: ' + src);
        if (options.onError) {
          try { options.onError('audio load error'); } catch (e) { /* silent */ }
        }
      };

      var playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function (err) {
          _sfxRemove(audio);
          _log('SFX play() rejected: ' + err.message);
          if (options.onError) {
            try { options.onError(err.message); } catch (e) { /* silent */ }
          }
        });
      }

      _log('SFX playing: ' + src);

      return {
        stop: function () {
          _sfxStopSingle(audio);
        },
        audio: audio
      };

    } catch (err) {
      _log('SFX creation error: ' + err.message);
      if (options.onError) {
        try { options.onError(err.message); } catch (e) { /* silent */ }
      }
      return null;
    }
  }

  function _sfxRemove(audio) {
    if (!audio) return;
    var idx = _sfxPool.indexOf(audio);
    if (idx > -1) {
      _sfxPool.splice(idx, 1);
    }
  }

  function _sfxStopSingle(audio) {
    if (!audio) return;
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    } catch (e) { /* silent */ }
    _sfxRemove(audio);
  }

  function _sfxStopAll() {
    var copy = _sfxPool.slice();
    for (var i = 0; i < copy.length; i++) {
      _sfxStopSingle(copy[i]);
    }
    _sfxPool = [];
  }

  function _getAudioCtx() {
    if (!_HAS_AUDIO_CTX) return null;
    if (!_sfxCtx) {
      try {
        var Ctor = window.AudioContext || window.webkitAudioContext;
        _sfxCtx = new Ctor();
      } catch (e) {
        _log('AudioContext creation failed: ' + e.message);
        return null;
      }
    }
    if (_sfxCtx.state === 'suspended') {
      _sfxCtx.resume().catch(function () { /* silent */ });
    }
    return _sfxCtx;
  }

  /* ============================================================
   *  RECORDING — Microphone
   * ============================================================ */

  function startRecording(config) {
    if (_destroyed) return { success: false, error: 'destroyed' };
    config = config || {};

    if (!_HAS_MEDIA_REC) {
      _log('MediaRecorder not available');
      if (config.onError) {
        config.onError('MediaRecorder not supported');
      }
      return { success: false, error: 'not supported' };
    }

    if (!_HAS_GET_MEDIA) {
      _log('getUserMedia not available');
      if (config.onError) {
        config.onError('getUserMedia not supported');
      }
      return { success: false, error: 'not supported' };
    }

    if (_recActive) {
      _recForceStop();
    }

    var maxSec = config.maxSec || 60;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        _recStream = stream;
        _recChunks = [];
        _recStartTime = Date.now();

        var mimeType = _getBestMimeType();
        var recorderOpts = {};
        if (mimeType) {
          recorderOpts.mimeType = mimeType;
        }

        try {
          _recRecorder = new MediaRecorder(stream, recorderOpts);
        } catch (e) {
          try {
            _recRecorder = new MediaRecorder(stream);
          } catch (e2) {
            _recCleanup();
            _log('MediaRecorder creation failed: ' + e2.message);
            if (config.onError) {
              config.onError('MediaRecorder creation failed');
            }
            return;
          }
        }

        _recRecorder.ondataavailable = function (e) {
          if (e.data && e.data.size > 0) {
            _recChunks.push(e.data);
          }
        };

        _recRecorder.onstop = function () {
          _recActive = false;
          _clearRecMaxTimer();

          var blob = new Blob(_recChunks, {
            type: _recRecorder.mimeType || 'audio/webm'
          });

          _log('Recording stopped - blob size: ' + blob.size);

          if (config.onStop) {
            try { config.onStop(blob); } catch (e) { /* silent */ }
          }

          _recCleanup();
        };

        _recRecorder.onerror = function (e) {
          _recActive = false;
          _clearRecMaxTimer();
          _log('MediaRecorder error: ' + (e.error || 'unknown'));
          if (config.onError) {
            config.onError(e.error || 'recording error');
          }
          _recCleanup();
        };

        _recRecorder.start(100);
        _recActive = true;
        _isRecording = true;

        _recMaxTimer = setTimeout(function () {
          _log('Recording max time reached (' + maxSec + 's)');
          if (config.onMaxTime) {
            try { config.onMaxTime(); } catch (e) { /* silent */ }
          }
          stopRecording();
        }, maxSec * 1000);

        _log('Recording started (max ' + maxSec + 's)');

        if (config.onStart) {
          try { config.onStart(); } catch (e) { /* silent */ }
        }

      })
      .catch(function (err) {
        _recCleanup();
        _log('getUserMedia error: ' + err.name + ' - ' + err.message);
        if (config.onError) {
          if (err.name === 'NotAllowedError') {
            config.onError('microphone permission denied');
          } else if (err.name === 'NotFoundError') {
            config.onError('no microphone found');
          } else {
            config.onError(err.name || 'getUserMedia error');
          }
        }
      });

    return { success: true, maxSec: maxSec };
  }

  function stopRecording() {
    if (!_recActive || !_recRecorder) {
      _log('stopRecording called but not recording');
      return;
    }
    _clearRecMaxTimer();
    try {
      if (_recRecorder.state !== 'inactive') {
        _recRecorder.stop();
      }
    } catch (e) {
      _log('stopRecording error: ' + e.message);
      _recCleanup();
    }
  }

  function _recForceStop() {
    _clearRecMaxTimer();
    if (_recRecorder) {
      try {
        if (_recRecorder.state !== 'inactive') {
          _recRecorder.stop();
        }
      } catch (e) { /* silent */ }
    }
    _recCleanup();
  }

  function _recCleanup() {
    _recActive = false;
    _isRecording = false;
    _recChunks = [];
    if (_recStream) {
      var tracks = _recStream.getTracks();
      for (var i = 0; i < tracks.length; i++) {
        try { tracks[i].stop(); } catch (e) { /* silent */ }
      }
      _recStream = null;
    }
    _recRecorder = null;
  }

  function _clearRecMaxTimer() {
    if (_recMaxTimer) {
      clearTimeout(_recMaxTimer);
      _recMaxTimer = null;
    }
  }

  function _getBestMimeType() {
    var types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/wav'
    ];
    for (var i = 0; i < types.length; i++) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(types[i])) {
        return types[i];
      }
    }
    return '';
  }

  /* ============================================================
   *  GLOBAL CONTROLS
   * ============================================================ */

  function stopAll() {
    if (_destroyed) return;
    _log('stopAll() called');
    _ttsCancel();
    _sfxStopAll();
    _recForceStop();
  }

  function destroy() {
    if (_destroyed) return;
    _destroyed = true;
    _log('destroy() called');
    _ttsCancel();
    _sfxStopAll();
    _recForceStop();
    _stopChromeKeepAlive();
    if (_sfxCtx) {
      try { _sfxCtx.close(); } catch (e) { /* silent */ }
      _sfxCtx = null;
    }
    _ttsQueue = [];
    _ttsCurrent = null;
    _sfxPool = [];
    _recChunks = [];
    _log('AudioManager destroyed');
  }

  function restart() {
    _destroyed = false;
    _ttsQueue = [];
    _ttsCurrent = null;
    _ttsPlaying = false;
    _sfxPool = [];
    _recChunks = [];
    _isSpeaking = false;
    _ttsVoiceMode = 0;
    _isRecording = false;
    _recActive = false;
    _log('AudioManager restarted');
  }

  /* ============================================================
   *  STATUS GETTERS
   * ============================================================ */

  function isSpeaking() {
    return _isSpeaking || _ttsPlaying;
  }

  function setVoiceMode(mode) {
    _ttsVoiceMode = mode;
    _log('Voice mode set to: ' + mode);
  }

  function getVoiceMode() {
    return _ttsVoiceMode;
  }

  function isRecording() {
    return _isRecording || _recActive;
  }

  function isTTSSupported() {
    return _HAS_SPEECH;
  }

  function isRecordingSupported() {
    return _HAS_MEDIA_REC && _HAS_GET_MEDIA;
  }

  /* ============================================================
   *  DIAGNOSE
   * ============================================================ */

  function diagnose() {
    var sep = '==================================================';
    console.info(sep);
    console.info('  AUDIO MANAGER DIAGNOSTIC');
    console.info(sep);
    console.info('  Browser Support:');
    console.info('    SpeechSynthesis : ' + (_HAS_SPEECH ? 'YES' : 'NO'));
    console.info('    MediaRecorder   : ' + (_HAS_MEDIA_REC ? 'YES' : 'NO'));
    console.info('    getUserMedia    : ' + (_HAS_GET_MEDIA ? 'YES' : 'NO'));
    console.info('    AudioContext    : ' + (_HAS_AUDIO_CTX ? 'YES' : 'NO'));
    console.info('');
    console.info('  State:');
    console.info('    destroyed       : ' + _destroyed);
    console.info('    isSpeaking      : ' + _isSpeaking);
    console.info('    isRecording     : ' + _isRecording);
    console.info('    SFX pool size   : ' + _sfxPool.length);
    console.info('    TTS current     : ' + (_ttsCurrent ? 'yes' : 'no'));
    console.info('    AudioContext    : ' + (_sfxCtx ? _sfxCtx.state : 'null'));
    console.info('    Voice Mode      : ' + _ttsVoiceMode);
    console.info(sep);
  }

  return {
    speak: speak,
    playSfx: playSfx,
    startRecording: startRecording,
    stopRecording: stopRecording,
    stopAll: stopAll,
    setVoiceMode: setVoiceMode,
    getVoiceMode: getVoiceMode,
    destroy: destroy,
    restart: restart,
    isSpeaking: isSpeaking,
    isRecording: isRecording,
    isTTSSupported: isTTSSupported,
    isRecordingSupported: isRecordingSupported,
    diagnose: diagnose,
    version: function () { return '5.3.0'; }
  };

})();