/**
 * ============================================================
 *  content-layer.js — Final (compatible with new content.js)
 *
 *  This layer sits between content.js and engine.js.
 *  It flattens all { textId, editable, text } objects into
 *  plain strings before returning data to the Engine.
 *
 *  It also filters Part 2 slides when settings.part2Enabled
 *  is false.
 *
 *  Engine and Renderers receive flat data exactly as before.
 * ============================================================
 */

var ContentLayer = (function () {
  'use strict';

  /* ============================================================
   *  Internal: flatten editable text objects
   * ============================================================ */

  /**
   * If value is an object with { textId, editable, text },
   * return the .text string. Otherwise return the value as-is.
   * Handles null / undefined safely.
   */
  function _flattenText(value) {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object' && typeof value.text === 'string') {
      return value.text;
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  }

  /**
   * Deep-clone a slide and flatten all editable text fields.
   */
  function _flattenSlide(slide) {
    if (!slide) return null;

    var out = {};
    for (var key in slide) {
      if (!slide.hasOwnProperty(key)) continue;
      out[key] = slide[key];
    }

    // Flatten title
    if (out.title !== null && out.title !== undefined) {
      out.title = _flattenText(out.title);
    }

    // Flatten body
    if (out.body !== null && out.body !== undefined) {
      out.body = _flattenText(out.body);
    }

    // Flatten ttsText (it's already a string or null, but just in case)
    if (out.ttsText !== null && out.ttsText !== undefined && typeof out.ttsText === 'object') {
      out.ttsText = _flattenText(out.ttsText);
    }

    return out;
  }

  /**
   * Deep-clone a story and flatten its text field.
   */
  function _flattenStory(story) {
    if (!story) return null;

    var out = {};
    for (var key in story) {
      if (!story.hasOwnProperty(key)) continue;
      out[key] = story[key];
    }

    if (out.text !== null && out.text !== undefined) {
      out.text = _flattenText(out.text);
    }

    return out;
  }

  /**
   * Deep-clone a question and flatten all editable text fields.
   */
  function _flattenQuestion(question) {
    if (!question) return null;

    var out = {};
    for (var key in question) {
      if (!question.hasOwnProperty(key)) continue;
      out[key] = question[key];
    }

    if (out.prompt !== null && out.prompt !== undefined) {
      out.prompt = _flattenText(out.prompt);
    }

    if (out.feedbackCorrect !== null && out.feedbackCorrect !== undefined) {
      out.feedbackCorrect = _flattenText(out.feedbackCorrect);
    }

    if (out.feedbackWrong !== null && out.feedbackWrong !== undefined) {
      out.feedbackWrong = _flattenText(out.feedbackWrong);
    }

    return out;
  }

  /**
   * Deep-clone an option and flatten its text field.
   */
  function _flattenOption(option) {
    if (!option) return null;

    var out = {};
    for (var key in option) {
      if (!option.hasOwnProperty(key)) continue;
      out[key] = option[key];
    }

    if (out.text !== null && out.text !== undefined) {
      out.text = _flattenText(out.text);
    }

    return out;
  }

  /* ============================================================
   *  Internal: lookup helpers
   * ============================================================ */

  function _findSlideByIndex(index) {
    var all = CONTENT.slides;
    for (var i = 0; i < all.length; i++) {
      if (all[i].index === index) return all[i];
    }
    return null;
  }

  function _findStoryById(id) {
    var all = CONTENT.stories;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  function _findQuestionById(id) {
    var all = CONTENT.questions;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  function _findOptionById(id) {
    var all = CONTENT.options;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  function _findStationById(id) {
    var all = CONTENT.stations;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  function _findEmotionById(id) {
    var all = CONTENT.emotions;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  /* ============================================================
   *  Internal: filtered slide list
   * ============================================================ */

  /**
   * Returns the effective slide list based on settings.part2Enabled.
   * If Part 2 is disabled, slides with part: 2 are excluded.
   */
  function _getFilteredSlides() {
    var all = CONTENT.slides || [];
    var enabled = CONTENT.settings && CONTENT.settings.part2Enabled === true;

    if (enabled) {
      return all;
    }

    var result = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].part !== 2) {
        result.push(all[i]);
      }
    }
    return result;
  }

  /* ============================================================
   *  Public API
   * ============================================================ */

  /**
   * Get settings object.
   */
  function getSettings() {
    return CONTENT.settings || {};
  }

  /**
   * Get all stations (optionally filtered by part).
   */
  function getStations(part) {
    var stations = CONTENT.stations || [];
    if (part === undefined || part === null) {
      return stations.slice();
    }
    return stations.filter(function (s) {
      return s.part === part;
    });
  }

  /**
   * Get a single station by id.
   */
  function getStation(id) {
    return _findStationById(id);
  }

  /**
   * Get all emotions.
   */
  function getEmotions() {
    return (CONTENT.emotions || []).slice();
  }

  /**
   * Get a single emotion by id.
   */
  function getEmotion(id) {
    return _findEmotionById(id);
  }

  /**
   * Get the total number of slides (after filtering).
   */
  function getSlideCount() {
    return _getFilteredSlides().length;
  }

  /**
   * Get a slide by its index, flattened and ready for Engine.
   * Returns null if not found.
   */
  function getSlide(index) {
    var raw = _findSlideByIndex(index);
    if (!raw) return null;

    // If Part 2 is disabled and this slide belongs to Part 2, return null
    var enabled = CONTENT.settings && CONTENT.settings.part2Enabled === true;
    if (!enabled && raw.part === 2) return null;

    return _flattenSlide(raw);
  }

  /**
   * Get all slide indices (after filtering), in order.
   */
  function getSlideIndices() {
    var filtered = _getFilteredSlides();
    var result = [];
    for (var i = 0; i < filtered.length; i++) {
      result.push(filtered[i].index);
    }
    return result;
  }

  /**
   * Get all slides (flattened), after filtering.
   */
  function getAllSlides() {
    var filtered = _getFilteredSlides();
    var result = [];
    for (var i = 0; i < filtered.length; i++) {
      result.push(_flattenSlide(filtered[i]));
    }
    return result;
  }

  /**
   * Get the next slide index after the given index.
   * Returns null if there is no next slide.
   */
  function getNextSlideIndex(currentIndex) {
    var indices = getSlideIndices();
    var pos = indices.indexOf(currentIndex);
    if (pos === -1 || pos + 1 >= indices.length) return null;
    return indices[pos + 1];
  }

  /**
   * Get the previous slide index before the given index.
   * Returns null if there is no previous slide.
   */
  function getPrevSlideIndex(currentIndex) {
    var indices = getSlideIndices();
    var pos = indices.indexOf(currentIndex);
    if (pos <= 0) return null;
    return indices[pos - 1];
  }

  /**
   * Get a story by id, flattened.
   */
  function getStory(id) {
    var raw = _findStoryById(id);
    if (!raw) return null;
    return _flattenStory(raw);
  }

  /**
   * Get all stories for a given station.
   */
  function getStoriesByStation(stationId) {
    var all = CONTENT.stories || [];
    var result = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].stationId === stationId) {
        result.push(_flattenStory(all[i]));
      }
    }
    return result;
  }

  /**
   * Get a question by id, flattened.
   */
  function getQuestion(id) {
    var raw = _findQuestionById(id);
    if (!raw) return null;
    return _flattenQuestion(raw);
  }

  /**
   * Get all questions for a given story.
   */
  function getQuestionsByStory(storyId) {
    var all = CONTENT.questions || [];
    var result = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].storyId === storyId) {
        result.push(_flattenQuestion(all[i]));
      }
    }
    return result;
  }

  /**
   * Get all questions for a given station.
   */
  function getQuestionsByStation(stationId) {
    var all = CONTENT.questions || [];
    var result = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].stationId === stationId) {
        result.push(_flattenQuestion(all[i]));
      }
    }
    return result;
  }

  /**
   * Get an option by id, flattened.
   */
  function getOption(id) {
    var raw = _findOptionById(id);
    if (!raw) return null;
    return _flattenOption(raw);
  }

  /**
   * Get all options for a given question.
   */
  function getOptionsByQuestion(questionId) {
    var all = CONTENT.options || [];
    var result = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].questionId === questionId) {
        result.push(_flattenOption(all[i]));
      }
    }
    return result;
  }

  /**
   * Get the raw editable text object for a given textId.
   * Used by admin panel for editing.
   * Returns null if not found.
   */
  function getEditableText(textId) {
    if (!textId) return null;

    function searchIn(obj) {
      if (!obj || typeof obj !== 'object') return null;

      // Check if this object itself has a matching textId
      if (obj.textId === textId && obj.editable === true) {
        return obj;
      }

      // Search in arrays
      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          var found = searchIn(obj[i]);
          if (found) return found;
        }
        return null;
      }

      // Search in object properties
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        var result = searchIn(obj[key]);
        if (result) return result;
      }
      return null;
    }

    // Search in all content collections
    var collections = ['slides', 'stories', 'questions', 'options'];
    for (var c = 0; c < collections.length; c++) {
      var collection = CONTENT[collections[c]];
      if (!collection) continue;
      var found = searchIn(collection);
      if (found) return found;
    }
    return null;
  }

  /**
   * Get all editable text objects (for admin panel).
   */
  function getAllEditableTexts() {
    var result = [];

    function collectFrom(obj, path) {
      if (!obj || typeof obj !== 'object') return;

      if (obj.textId && obj.editable === true) {
        result.push({
          textId: obj.textId,
          text: obj.text,
          editable: true,
          path: path
        });
        return;
      }

      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          collectFrom(obj[i], path + '[' + i + ']');
        }
        return;
      }

      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        collectFrom(obj[key], path ? path + '.' + key : key);
      }
    }

    var collections = ['slides', 'stories', 'questions', 'options'];
    for (var c = 0; c < collections.length; c++) {
      var collection = CONTENT[collections[c]];
      if (!collection) continue;
      collectFrom(collection, collections[c]);
    }

    return result;
  }

 /**
   * Check if Part 2 is enabled.
   */
  function getPart2Enabled() {
    return !!(CONTENT.settings && CONTENT.settings.part2Enabled === true);
  }

  /**
   * Enable or disable Part 2.
   */
  function setPart2Enabled(enabled) {
    if (!CONTENT.settings) {
      CONTENT.settings = {};
    }
    CONTENT.settings.part2Enabled = (enabled === true);
  }

  /* ============================================================
   *  Return public API
   * ============================================================ */
/* ==========================================================
   Part 2
========================================================== */

function getPart2Enabled() {

  if (!CONTENT.settings) {
    CONTENT.settings = {};
  }

  if (typeof CONTENT.settings.part2Enabled !== 'boolean') {

    try {

      var raw = localStorage.getItem('admin_sections_config');

      if (raw) {

        var cfg = JSON.parse(raw);

        CONTENT.settings.part2Enabled = !!cfg.section2;

      } else {

        CONTENT.settings.part2Enabled = false;

      }

    } catch(e){

      CONTENT.settings.part2Enabled = false;

    }

  }

  return CONTENT.settings.part2Enabled;

}

function setPart2Enabled(value){

  if (!CONTENT.settings){
      CONTENT.settings = {};
  }

  CONTENT.settings.part2Enabled = !!value;

  try{

      var raw = localStorage.getItem('admin_sections_config');

      var cfg = raw ? JSON.parse(raw) : {};

      cfg.section1 = true;
      cfg.section2 = !!value;

      localStorage.setItem(
          'admin_sections_config',
          JSON.stringify(cfg)
      );

  }catch(e){}

}
  return {
   // Settings
    getSettings: getSettings,
    getPart2Enabled: getPart2Enabled,
    setPart2Enabled: setPart2Enabled,

    // Stations
    getStations: getStations,
    getStation: getStation,

    // Emotions
    getEmotions: getEmotions,
    getEmotion: getEmotion,

    // Slides
    getSlideCount: getSlideCount,
    getSlide: getSlide,
    getSlideIndices: getSlideIndices,
    getAllSlides: getAllSlides,
    getNextSlideIndex: getNextSlideIndex,
    getPrevSlideIndex: getPrevSlideIndex,

    // Stories
    getStory: getStory,
    getStoriesByStation: getStoriesByStation,

    // Questions
    getQuestion: getQuestion,
    getQuestionsByStory: getQuestionsByStory,
    getQuestionsByStation: getQuestionsByStation,

    // Options
    getOption: getOption,
    getOptionsByQuestion: getOptionsByQuestion,

    // Editable texts (for admin panel)
    getEditableText: getEditableText,
    getAllEditableTexts: getAllEditableTexts
  };

})();