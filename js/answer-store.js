/**
 * ============================================================
 *  ANSWER STORE v1.0 — Safar Ehsasat Persistence Layer
 *  Centralized answer storage, progress tracking & reporting
 * ============================================================
 *
 *  Dependency: content-layer.js (ContentLayer API)
 *  Dependency: content_v5_draft.js (CONTENT data)
 *
 *  Load order:
 *    1. content_v5_draft.js
 *    2. content-layer.js
 *    3. answer-store.js      ← this file
 *    4. engine.js
 *    5. renderers.js
 *    6. app.js
 *
 *  Storage key: emotion_spaceship_progress
 *
 * ============================================================
 */



/* ============================================================
 *  0. GUARD
 * ============================================================ */

(function () {
  if (typeof ContentLayer === "undefined") {
    throw new Error(
      "[AnswerStore] content-layer.js must be loaded before answer-store.js"
    );
  }
})();



/* ============================================================
 *  1. ANSWER STORE NAMESPACE
 * ============================================================ */

var AnswerStore = {};



/* ============================================================
 *  2. CONSTANTS
 * ============================================================ */

AnswerStore.STORAGE_KEY = "emotion_spaceship_progress";
AnswerStore.STORAGE_VERSION = 5;



/* ============================================================
 *  3. INTERNAL STATE — Never accessed directly from outside
 * ============================================================ */

AnswerStore._state = {

  version: AnswerStore.STORAGE_VERSION,

  /* Current position */
  currentSlide: 1,

  /* All recorded answers */
  answersStore: [],

  /* Cumulative scores by questionId */
  scores: {},

  /* Total accumulated score */
  totalScore: 0,

  /* Station completion cache */
  stationCompletionCache: {},

  /* Session timestamps */
  startedAt: null,
  lastSavedAt: null,
  finishedAt: null,

  /* Flags */
  isComplete: false,
  isDirty: false

};



/* ============================================================
 *  4. ANSWER RECORD STRUCTURE
 * ============================================================ */

/**
 * Creates a standardized answer record.
 *
 * @param {Object} params
 * @param {number} params.slideNumber
 * @param {number} params.storyId
 * @param {number} params.questionId
 * @param {number} params.stationId
 * @param {*}      params.answer          — string, number, or number[]
 * @param {string} params.answerType      — "descriptive" | "single-choice" | "multi-choice"
 * @param {number} params.score
 * @param {boolean|null} params.isCorrect — null for descriptive
 * @returns {Object} answer record
 */

AnswerStore._createRecord = function (params) {

  return {
    slideNumber:  params.slideNumber  || null,
    storyId:      params.storyId      || null,
    questionId:   params.questionId   || null,
    stationId:    params.stationId    || null,
    answer:       params.answer,
    answerType:   params.answerType   || "unknown",
    timestamp:    Date.now(),
    score:        params.score        || 0,
    isCorrect:    params.isCorrect    // null for descriptive
  };

};



/* ============================================================
 *  5. INITIALIZATION
 * ============================================================ */

AnswerStore.init = function () {

  var state = AnswerStore._state;

  state.startedAt = Date.now();
  state.lastSavedAt = null;
  state.finishedAt = null;
  state.isComplete = false;
  state.isDirty = false;

  AnswerStore.log("Initialized — storage key: " + AnswerStore.STORAGE_KEY);

  return state;

};



/* ============================================================
 *  6. SAVE — Persist to LocalStorage
 * ============================================================ */

AnswerStore._save = function () {

  var state = AnswerStore._state;

  state.lastSavedAt = Date.now();
  state.isDirty = false;

  var payload = {
    version:            state.version,
    currentSlide:       state.currentSlide,
    answersStore:       state.answersStore,
    scores:             state.scores,
    totalScore:         state.totalScore,
    stationCompletionCache: state.stationCompletionCache,
    startedAt:          state.startedAt,
    lastSavedAt:        state.lastSavedAt,
    finishedAt:         state.finishedAt,
    isComplete:         state.isComplete
  };

  try {
    var serialized = JSON.stringify(payload);
    localStorage.setItem(AnswerStore.STORAGE_KEY, serialized);
    AnswerStore.log(
      "Saved — " + state.answersStore.length + " answers, " +
      "score:" + state.totalScore + ", " +
      "slide:" + state.currentSlide
    );
    return { success: true, bytes: serialized.length };
  } catch (e) {
    AnswerStore.log("SAVE FAILED: " + e.message);
    return { success: false, error: e.message };
  }

};



/* ============================================================
 *  7. LOAD — Restore from LocalStorage
 * ============================================================ */

AnswerStore.load = function () {

  try {
    var raw = localStorage.getItem(AnswerStore.STORAGE_KEY);

    if (!raw) {
      AnswerStore.log("No saved data found — fresh start");
      return { success: false, reason: "no-data" };
    }

    var payload = JSON.parse(raw);
    var state = AnswerStore._state;

    /* Version check */
    if (payload.version && payload.version !== AnswerStore.STORAGE_VERSION) {
      AnswerStore.log(
        "Version mismatch — saved:" + payload.version +
        " current:" + AnswerStore.STORAGE_VERSION
      );
      /* Future: migration logic here */
    }

    /* Restore all fields */
    state.version               = payload.version || AnswerStore.STORAGE_VERSION;
    state.currentSlide          = payload.currentSlide || 1;
    state.answersStore          = payload.answersStore || [];
    state.scores                = payload.scores || {};
    state.totalScore            = payload.totalScore || 0;
    state.stationCompletionCache = payload.stationCompletionCache || {};
    state.startedAt             = payload.startedAt || Date.now();
    state.lastSavedAt           = payload.lastSavedAt || null;
    state.finishedAt            = payload.finishedAt || null;
    state.isComplete            = payload.isComplete || false;
    state.isDirty               = false;

    AnswerStore.log(
      "Loaded — " + state.answersStore.length + " answers, " +
      "score:" + state.totalScore + ", " +
      "slide:" + state.currentSlide
    );

    return {
      success:           true,
      currentSlide:      state.currentSlide,
      answerCount:       state.answersStore.length,
      totalScore:        state.totalScore,
      isComplete:        state.isComplete,
      startedAt:         state.startedAt,
      lastSavedAt:       state.lastSavedAt
    };

  } catch (e) {
    AnswerStore.log("LOAD FAILED: " + e.message);
    return { success: false, error: e.message };
  }

};



/* ============================================================
 *  8. CLEAR — Remove all saved data
 * ============================================================ */

AnswerStore.clear = function () {

  try {
    localStorage.removeItem(AnswerStore.STORAGE_KEY);
  } catch (e) {
    /* silent */
  }

  AnswerStore._state = {
    version:                AnswerStore.STORAGE_VERSION,
    currentSlide:           1,
    answersStore:           [],
    scores:                 {},
    totalScore:             0,
    stationCompletionCache: {},
    startedAt:              Date.now(),
    lastSavedAt:            null,
    finishedAt:             null,
    isComplete:             false,
    isDirty:                false
  };

  AnswerStore.log("Cleared all data");

  return { success: true };

};



/* ============================================================
 *  9. RECORD ANSWER — Main entry point for storing answers
 * ============================================================ */

/**
 * Records a single answer and persists immediately.
 *
 * @param {Object} params
 * @param {number}         params.questionId   — required
 * @param {*}              params.answer        — required
 * @param {number}         params.score         — default 0
 * @param {boolean|null}   params.isCorrect     — null for descriptive
 * @returns {Object} result with stored record
 */

AnswerStore.recordAnswer = function (params) {

  if (!params || params.questionId === undefined || params.questionId === null) {
    AnswerStore.log("recordAnswer: questionId is required");
    return { success: false, error: "questionId is required" };
  }

  if (params.answer === undefined || params.answer === null) {
    AnswerStore.log("recordAnswer: answer is required");
    return { success: false, error: "answer is required" };
  }

  var state = AnswerStore._state;

  /* Resolve all IDs through ContentLayer */
  var question = ContentLayer.getQuestion(params.questionId);
  if (!question) {
    AnswerStore.log("recordAnswer: question not found — " + params.questionId);
    return { success: false, error: "question not found" };
  }

  var story = ContentLayer.getStory(question.storyId);
  var slide = story ? AnswerStore._findSlideForStory(story.id) : null;

  /* Build record */
  var record = AnswerStore._createRecord({
    slideNumber:  slide ? slide.slideNumber : null,
    storyId:      question.storyId,
    questionId:   question.id,
    stationId:    question.stationId,
    answer:       params.answer,
    answerType:   question.type,
    score:        params.score || 0,
    isCorrect:    params.isCorrect !== undefined ? params.isCorrect : null
  });

  /* Check for existing answer to this question (update vs insert) */
  var existingIndex = -1;
  for (var i = 0; i < state.answersStore.length; i++) {
    if (state.answersStore[i].questionId === record.questionId) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex > -1) {
    /* Update existing — subtract old score */
    var oldScore = state.answersStore[existingIndex].score || 0;
    state.totalScore -= oldScore;

    /* Overwrite record but keep original timestamp */
    record.timestamp = state.answersStore[existingIndex].timestamp;
    record._updatedAt = Date.now();
    state.answersStore[existingIndex] = record;

    AnswerStore.log(
      "Updated answer for Q" + record.questionId +
      " (was score:" + oldScore + ", now score:" + record.score + ")"
    );
  } else {
    /* Insert new */
    state.answersStore.push(record);

    AnswerStore.log(
      "Recorded answer for Q" + record.questionId +
      " [" + record.answerType + "]" +
      " score:" + record.score
    );
  }

  /* Update cumulative score */
  state.scores[record.questionId] = record.score;
  state.totalScore += record.score;

  /* Invalidate station completion cache */
  delete state.stationCompletionCache[record.stationId];

  /* Mark dirty and persist */
  state.isDirty = true;
  AnswerStore._save();

  return {
    success:  true,
    record:   record,
    totalScore: state.totalScore,
    answerCount: state.answersStore.length
  };

};



/* ============================================================
 *  10. SET CURRENT SLIDE — Track position
 * ============================================================ */

AnswerStore.setCurrentSlide = function (slideNumber) {

  AnswerStore._state.currentSlide = slideNumber;
  AnswerStore._state.isDirty = true;
  AnswerStore._save();

  AnswerStore.log("Current slide → " + slideNumber);

  return { success: true, slideNumber: slideNumber };

};


AnswerStore.getCurrentSlide = function () {
  return AnswerStore._state.currentSlide;
};



/* ============================================================
 *  11. MARK COMPLETE — Part finished
 * ============================================================ */

AnswerStore.markComplete = function () {

  var state = AnswerStore._state;
  state.isComplete = true;
  state.finishedAt = Date.now();
  state.isDirty = true;
  AnswerStore._save();

  AnswerStore.log("Part marked COMPLETE");

  return { success: true, finishedAt: state.finishedAt };

};



/* ============================================================
 *  12. GET ANSWER — Retrieve a specific answer
 * ============================================================ */

AnswerStore.getAnswer = function (questionId) {

  var store = AnswerStore._state.answersStore;

  for (var i = 0; i < store.length; i++) {
    if (store[i].questionId === questionId) {
      return store[i];
    }
  }

  return null;

};


AnswerStore.getAnswerValue = function (questionId) {

  var record = AnswerStore.getAnswer(questionId);
  return record ? record.answer : null;

};


AnswerStore.isQuestionAnswered = function (questionId) {
  return AnswerStore.getAnswer(questionId) !== null;
};


AnswerStore.getScoreForQuestion = function (questionId) {
  var record = AnswerStore.getAnswer(questionId);
  return record ? (record.score || 0) : 0;
};



/* ============================================================
 *  13. GET ALL ANSWERS
 * ============================================================ */

AnswerStore.getAllAnswers = function () {
  return AnswerStore._state.answersStore.slice();
};

AnswerStore.getAnswerCount = function () {
  return AnswerStore._state.answersStore.length;
};

AnswerStore.getTotalScore = function () {
  return AnswerStore._state.totalScore;
};



/* ============================================================
 *  14. STATION COMPLETION
 * ============================================================ */

/**
 * Returns completion stats for a specific station.
 *
 * @param {number} stationId
 * @returns {Object}
 *   {
 *     stationId,
 *     stationName,
 *     totalStories,
 *     totalQuestions,
 *     answeredQuestions,
 *     answeredStoryIds[],
 *     unansweredQuestionIds[],
 *     percent,
 *     score,
 *     maxPossibleScore,
 *     isComplete
 *   }
 */

AnswerStore.getStationCompletion = function (stationId) {

  var state = AnswerStore._state;

  /* Check cache first */
  if (state.stationCompletionCache[stationId]) {
    return state.stationCompletionCache[stationId];
  }

  var station = ContentLayer.getStation(stationId);
  if (!station) {
    AnswerStore.log("getStationCompletion: station not found — " + stationId);
    return {
      stationId: stationId,
      stationName: null,
      totalStories: 0,
      totalQuestions: 0,
      answeredQuestions: 0,
      answeredStoryIds: [],
      unansweredQuestionIds: [],
      percent: 0,
      score: 0,
      maxPossibleScore: 0,
      isComplete: false
    };
  }

  /* Get all stories for this station via ContentLayer */
  var stories = ContentLayer.getStoriesByStation(stationId);

  var totalQuestions = 0;
  var answeredQuestions = 0;
  var answeredStoryIds = [];
  var unansweredQuestionIds = [];
  var stationScore = 0;
  var maxPossibleScore = 0;

  stories.forEach(function (story) {

    var questions = ContentLayer.getQuestionsByStory(story.id);
    var storyFullyAnswered = true;

    questions.forEach(function (question) {
      totalQuestions++;

      /* Max possible score */
      var qScoring = question.scoring || {};
      maxPossibleScore += (qScoring.points || 0);

      /* Check if answered */
      var record = AnswerStore.getAnswer(question.id);
      if (record) {
        answeredQuestions++;
        stationScore += (record.score || 0);
      } else {
        storyFullyAnswered = false;
        unansweredQuestionIds.push(question.id);
      }
    });

    if (storyFullyAnswered && questions.length > 0) {
      answeredStoryIds.push(story.id);
    }

  });

  var percent = totalQuestions > 0
                  ? Math.round((answeredQuestions / totalQuestions) * 100)
                  : 0;

  var result = {
    stationId:            stationId,
    stationName:          station.name,
    totalStories:         stories.length,
    totalQuestions:       totalQuestions,
    answeredQuestions:    answeredQuestions,
    answeredStoryIds:     answeredStoryIds,
    unansweredQuestionIds: unansweredQuestionIds,
    percent:              percent,
    score:                stationScore,
    maxPossibleScore:     maxPossibleScore,
    isComplete:           answeredQuestions >= totalQuestions
  };

  /* Cache it */
  state.stationCompletionCache[stationId] = result;

  return result;

};



/* ============================================================
 *  15. JOURNEY COMPLETION
 * ============================================================ */

/**
 * Returns overall journey completion across all stations.
 *
 * @returns {Object}
 *   {
 *     totalStations,
 *     totalStories,
 *     totalQuestions,
 *     answeredQuestions,
 *     unansweredQuestionIds[],
 *     percent,
 *     totalScore,
 *     maxPossibleScore,
 *     stationDetails[],
 *     isComplete
 *   }
 */

AnswerStore.getJourneyCompletion = function () {

  var stations = ContentLayer.getAllStations();

  var totalQuestions = 0;
  var answeredQuestions = 0;
  var totalStories = 0;
  var unansweredQuestionIds = [];
  var totalScore = 0;
  var maxPossibleScore = 0;
  var stationDetails = [];

  stations.forEach(function (station) {

    var completion = AnswerStore.getStationCompletion(station.id);

    totalQuestions    += completion.totalQuestions;
    answeredQuestions += completion.answeredQuestions;
    totalStories      += completion.totalStories;
    totalScore        += completion.score;
    maxPossibleScore  += completion.maxPossibleScore;

    completion.unansweredQuestionIds.forEach(function (qid) {
      unansweredQuestionIds.push(qid);
    });

    stationDetails.push({
      stationId:         station.id,
      stationName:       station.name,
      totalQuestions:    completion.totalQuestions,
      answeredQuestions: completion.answeredQuestions,
      percent:           completion.percent,
      score:             completion.score,
      isComplete:        completion.isComplete
    });

  });

  var percent = totalQuestions > 0
                  ? Math.round((answeredQuestions / totalQuestions) * 100)
                  : 0;

  return {
    totalStations:        stations.length,
    totalStories:         totalStories,
    totalQuestions:       totalQuestions,
    answeredQuestions:    answeredQuestions,
    unansweredQuestionIds: unansweredQuestionIds,
    percent:              percent,
    totalScore:           totalScore,
    maxPossibleScore:     maxPossibleScore,
    stationDetails:       stationDetails,
    isComplete:           answeredQuestions >= totalQuestions
  };

};



/* ============================================================
 *  16. INCREMENTAL STATION PROGRESS
 *
 *  Returns which questions are answered for a specific story.
 *  Useful for showing progress within a story.
 * ============================================================ */

AnswerStore.getStoryCompletion = function (storyId) {

  var story = ContentLayer.getStory(storyId);
  if (!story) {
    return {
      storyId: storyId,
      totalQuestions: 0,
      answeredQuestions: 0,
      percent: 0,
      isComplete: false
    };
  }

  var questions = ContentLayer.getQuestionsByStory(storyId);
  var answered = 0;

  questions.forEach(function (q) {
    if (AnswerStore.isQuestionAnswered(q.id)) {
      answered++;
    }
  });

  var percent = questions.length > 0
                  ? Math.round((answered / questions.length) * 100)
                  : 0;

  return {
    storyId:           storyId,
    storyTitle:        story.title,
    stationId:         story.stationId,
    totalQuestions:    questions.length,
    answeredQuestions: answered,
    percent:           percent,
    isComplete:        answered >= questions.length
  };

};



/* ============================================================
 *  17. SCORING HELPERS
 * ============================================================ */

AnswerStore.getScoreByStation = function (stationId) {

  var completion = AnswerStore.getStationCompletion(stationId);
  return {
    stationId:    stationId,
    score:        completion.score,
    maxPossible:  completion.maxPossibleScore,
    percent:      completion.maxPossibleScore > 0
                    ? Math.round((completion.score / completion.maxPossibleScore) * 100)
                    : 0
  };

};


AnswerStore.getTotalScore = function () {
  return AnswerStore._state.totalScore;
};


AnswerStore.getMaxPossibleScore = function () {

  var allQuestions = [];
  ContentLayer.getAllStories().forEach(function (story) {
    var questions = ContentLayer.getQuestionsByStory(story.id);
    allQuestions = allQuestions.concat(questions);
  });

  var max = 0;
  allQuestions.forEach(function (q) {
    var scoring = q.scoring || {};
    max += (scoring.points || 0);
  });

  return max;

};



/* ============================================================
 *  18. FINAL REPORT GENERATOR
 * ============================================================ */

/**
 * Generates a comprehensive final report.
 * Logs to console and returns structured data.
 *
 * @param {Object} childInfo — optional { name, age }
 * @returns {Object} full report
 */

AnswerStore.generateFinalReport = function (childInfo) {

  childInfo = childInfo || {};

  var state = AnswerStore._state;
  var meta = ContentLayer.getMeta();

  var journey = AnswerStore.getJourneyCompletion();
  var now = new Date();
  var duration = state.startedAt
                   ? (now.getTime() - state.startedAt)
                   : 0;

  /* ── Build Station Scores ── */
  var stationScores = [];
  var stations = ContentLayer.getAllStations();

  stations.forEach(function (station) {

    var sScore = AnswerStore.getScoreByStation(station.id);
    var sCompletion = AnswerStore.getStationCompletion(station.id);

    stationScores.push({
      stationId:          station.id,
      stationName:        station.name,
      score:              sScore.score,
      maxPossibleScore:   sScore.maxPossible,
      scorePercent:       sScore.percent,
      totalQuestions:     sCompletion.totalQuestions,
      answeredQuestions:  sCompletion.answeredQuestions,
      completionPercent:  sCompletion.percent,
      isComplete:         sCompletion.isComplete,
      totalStories:       sCompletion.totalStories,
      answeredStoryCount: sCompletion.answeredStoryIds.length
    });

  });

  /* ── Build Station Completion Array ── */
  var stationCompletion = journey.stationDetails.map(function (sd) {
    return {
      stationId:   sd.stationId,
      stationName: sd.stationName,
      percent:     sd.percent,
      isComplete:  sd.isComplete
    };
  });

  /* ── Build Answers Array ── */
  var answers = state.answersStore.map(function (record) {

    var question = ContentLayer.getQuestion(record.questionId);
    var story = record.storyId ? ContentLayer.getStory(record.storyId) : null;
    var station = record.stationId ? ContentLayer.getStation(record.stationId) : null;

    return {
      questionId:    record.questionId,
      questionText:  question ? question.text : null,
      questionType:  record.answerType,
      storyId:       record.storyId,
      storyTitle:    story ? story.title : null,
      stationId:     record.stationId,
      stationName:   station ? station.name : null,
      answer:        record.answer,
      score:         record.score,
      isCorrect:     record.isCorrect,
      timestamp:     record.timestamp
    };

  });

  /* ── Build Report ── */
  var report = {

    childInfo: {
      name: childInfo.name || "نامشخص",
      age:  childInfo.age  || "نامشخص"
    },

    totalScore:        state.totalScore,
    maxPossibleScore:  journey.maxPossibleScore,
    scorePercent:      journey.maxPossibleScore > 0
                         ? Math.round((state.totalScore / journey.maxPossibleScore) * 100)
                         : 0,

    stationScores:     stationScores,
    stationCompletion: stationCompletion,

    journey: {
      totalStations:     journey.totalStations,
      totalStories:      journey.totalStories,
      totalQuestions:    journey.totalQuestions,
      answeredQuestions: journey.answeredQuestions,
      completionPercent: journey.percent,
      isComplete:        journey.isComplete
    },

    answers:     answers,
    answerCount: answers.length,

    timing: {
      startedAt:     state.startedAt     ? new Date(state.startedAt).toISOString() : null,
      finishedAt:    state.finishedAt    ? new Date(state.finishedAt).toISOString() : now.toISOString(),
      durationMs:    duration,
      durationMin:   Math.round(duration / 60000),
      durationSec:   Math.round(duration / 1000)
    },

    meta: {
      version:   meta.version,
      part:      meta.part,
      language:  meta.language,
      targetAge: meta.targetAge,
      generatedAt: now.toISOString()
    }

  };

  /* ── Log to Console ── */
  AnswerStore._logReport(report);

  return report;

};



/* ============================================================
 *  19. CONSOLE REPORT PRINTER
 * ============================================================ */

AnswerStore._logReport = function (report) {

  var divider     = "═══════════════════════════════════════════════════";
  var thinDivider = "───────────────────────────────────────────────────";

  console.info("");
  console.info(divider);
  console.info("  گزارش نهایی سفر احساسات — بخش " + report.meta.part);
  console.info(divider);

  /* Child */
  console.info("");
  console.info("  👶 اطلاعات کودک:");
  console.info("    نام: " + report.childInfo.name);
  console.info("    سن:  " + report.childInfo.age);

  /* Score Summary */
  console.info("");
  console.info("  🏆 خلاصه امتیاز:");
  console.info("    امتیاز کل:        " + report.totalScore + " / " + report.maxPossibleScore);
  console.info("    درصد امتیاز:      " + report.scorePercent + "%");

  /* Journey */
  console.info("");
  console.info("  🚀 پیشرفت سفر:");
  console.info("    کل ایستگاه‌ها:    " + report.journey.totalStations);
  console.info("    کل داستان‌ها:     " + report.journey.totalStories);
  console.info("    کل سوالات:        " + report.journey.totalQuestions);
  console.info("    پاسخ داده شده:   " + report.journey.answeredQuestions);
  console.info("    درصد پیشرفت:     " + report.journey.completionPercent + "%");
  console.info("    تکمیل شده:       " + (report.journey.isComplete ? "بله ✅" : "خیر ❌"));

  /* Station Scores */
  console.info("");
  console.info("  📊 امتیاز به تفکیک ایستگاه:");
  console.info("  " + thinDivider);

  report.stationScores.forEach(function (s) {
    var bar = AnswerStore._progressBar(s.completionPercent, 20);
    console.info(
      "    " + s.stationName +
      " — امتیاز: " + s.score + "/" + s.maxPossibleScore +
      " (" + s.scorePercent + "%)" +
      "  " + bar +
      "  پیشرفت: " + s.completionPercent + "%"
    );
    console.info(
      "      سوالات: " + s.answeredQuestions + "/" + s.totalQuestions +
      " — داستان: " + s.answeredStoryCount + "/" + s.totalStories +
      (s.isComplete ? " ✅" : "")
    );
  });

  /* Station Completion */
  console.info("");
  console.info("  ✅ وضعیت تکمیل ایستگاه‌ها:");
  report.stationCompletion.forEach(function (sc) {
    var status = sc.isComplete ? "✅ تکمیل" : ("⬜ " + sc.percent + "%");
    console.info("    " + sc.stationName + ": " + status);
  });

  /* Timing */
  console.info("");
  console.info("  ⏱ زمان‌بندی:");
  console.info("    شروع:    " + (report.timing.startedAt || "نامشخص"));
  console.info("    پایان:   " + report.timing.finishedAt);
  console.info("    مدت:     " + report.timing.durationMin + " دقیقه (" + report.timing.durationSec + " ثانیه)");

  /* Answer Detail */
  console.info("");
  console.info("  📝 جزئیات پاسخ‌ها (" + report.answerCount + " سوال):");
  console.info("  " + thinDivider);

  var currentStation = null;
  report.answers.forEach(function (a, index) {

    /* Station header */
    if (a.stationId !== currentStation) {
      currentStation = a.stationId;
      console.info("");
      console.info("  ── " + (a.stationName || "ایستگاه " + a.stationId) + " ──");
    }

    var correctSymbol = a.isCorrect === true  ? "✅"
                      : a.isCorrect === false ? "❌"
                      : "📝";

    var answerDisplay;
    if (a.questionType === "descriptive") {
      answerDisplay = typeof a.answer === "string"
                        ? (a.answer.length > 50
                            ? a.answer.substring(0, 50) + "..."
                            : a.answer)
                        : String(a.answer);
    } else if (a.questionType === "multi-choice") {
      answerDisplay = Array.isArray(a.answer)
                        ? "[" + a.answer.join(", ") + "]"
                        : String(a.answer);
    } else {
      answerDisplay = String(a.answer);
    }

    console.info(
      "    " + correctSymbol +
      " Q" + a.questionId +
      " (" + a.questionType + ")" +
      " → " + answerDisplay +
      " | امتیاز: " + a.score
    );

  });

  /* Final */
  console.info("");
  console.info(divider);
  console.info("  پایان گزارش — " + report.meta.generatedAt);
  console.info(divider);
  console.info("");

};



/* ============================================================
 *  20. PROGRESS BAR HELPER (for console)
 * ============================================================ */

AnswerStore._progressBar = function (percent, width) {

  width = width || 20;
  var filled = Math.round((percent / 100) * width);
  var empty  = width - filled;

  var bar = "[";
  for (var i = 0; i < filled; i++) bar += "█";
  for (var j = 0; j < empty; j++)  bar += "░";
  bar += "]";

  return bar;

};



/* ============================================================
 *  21. HELPER — Find slide for a story
 * ============================================================ */

AnswerStore._findSlideForStory = function (storyId) {

  var slides = ContentLayer.getAllSlides();

  for (var i = 0; i < slides.length; i++) {
    if (slides[i].storyId === storyId) {
      return slides[i];
    }
  }

  return null;

};



/* ============================================================
 *  22. RECOVERY — Restore Engine state from saved data
 * ============================================================ */

/**
 * Returns the data needed to restore engine state after refresh.
 * Call this after AnswerStore.load() succeeds.
 *
 * @returns {Object}
 *   {
 *     currentSlide,
 *     answers    — { questionId: answer } map
 *     scores     — { questionId: score } map
 *     totalScore,
 *     answerCount
 *   }
 */

AnswerStore.getRecoveryData = function () {

  var state = AnswerStore._state;

  /* Build answers map from answersStore */
  var answersMap = {};
  var scoresMap = {};

  state.answersStore.forEach(function (record) {
    answersMap[record.questionId] = record.answer;
    scoresMap[record.questionId]  = record.score;
  });

  return {
    currentSlide: state.currentSlide,
    answers:      answersMap,
    scores:       scoresMap,
    totalScore:   state.totalScore,
    answerCount:  state.answersStore.length,
    isComplete:   state.isComplete,
    startedAt:    state.startedAt
  };

};



/* ============================================================
 *  23. BATCH OPERATIONS
 * ============================================================ */

/**
 * Records multiple answers at once (for recovery or bulk import).
 * Persists once after all records are added.
 *
 * @param {Array} records — array of record params
 * @returns {Object}
 */

AnswerStore.recordBatch = function (records) {

  if (!Array.isArray(records) || records.length === 0) {
    return { success: false, error: "empty batch" };
  }

  var state = AnswerStore._state;
  var successCount = 0;
  var failCount = 0;

  records.forEach(function (params) {

    var question = ContentLayer.getQuestion(params.questionId);
    if (!question) {
      failCount++;
      return;
    }

    var story = ContentLayer.getStory(question.storyId);
    var slide = story ? AnswerStore._findSlideForStory(story.id) : null;

    var record = AnswerStore._createRecord({
      slideNumber:  slide ? slide.slideNumber : null,
      storyId:      question.storyId,
      questionId:   question.id,
      stationId:    question.stationId,
      answer:       params.answer,
      answerType:   question.type,
      score:        params.score || 0,
      isCorrect:    params.isCorrect !== undefined ? params.isCorrect : null
    });

    /* Check for existing */
    var exists = false;
    for (var i = 0; i < state.answersStore.length; i++) {
      if (state.answersStore[i].questionId === record.questionId) {
        var oldScore = state.answersStore[i].score || 0;
        state.totalScore -= oldScore;
        state.answersStore[i] = record;
        exists = true;
        break;
      }
    }

    if (!exists) {
      state.answersStore.push(record);
    }

    state.scores[record.questionId] = record.score;
    state.totalScore += record.score;
    successCount++;

  });

  /* Single persist */
  state.isDirty = true;
  AnswerStore._save();

  /* Clear station cache */
  state.stationCompletionCache = {};

  AnswerStore.log("Batch recorded " + successCount + " answers (" + failCount + " failed)");

  return {
    success:      true,
    successCount: successCount,
    failCount:    failCount,
    totalScore:   state.totalScore
  };

};



/* ============================================================
 *  24. EXPORT / DEBUG
 * ============================================================ */

/**
 * Returns a plain object with all state for debugging.
 * Does NOT include binary data (blobs).
 */

AnswerStore.exportState = function () {

  var state = AnswerStore._state;

  return {
    version:                state.version,
    currentSlide:           state.currentSlide,
    answerCount:            state.answersStore.length,
    answersStore:           state.answersStore.slice(),
    scores:                 JSON.parse(JSON.stringify(state.scores)),
    totalScore:             state.totalScore,
    stationCompletionCache: JSON.parse(JSON.stringify(state.stationCompletionCache)),
    startedAt:              state.startedAt,
    lastSavedAt:            state.lastSavedAt,
    finishedAt:             state.finishedAt,
    isComplete:             state.isComplete,
    isDirty:                state.isDirty
  };

};


/**
 * Returns storage usage info.
 */

AnswerStore.getStorageInfo = function () {

  try {
    var raw = localStorage.getItem(AnswerStore.STORAGE_KEY);
    var bytes = raw ? raw.length : 0;

    return {
      exists:    raw !== null,
      bytes:     bytes,
      kilobytes: Math.round(bytes / 1024 * 100) / 100,
      answerCount: AnswerStore._state.answersStore.length
    };
  } catch (e) {
    return { exists: false, bytes: 0, error: e.message };
  }

};


/**
 * Full diagnostic dump.
 */

AnswerStore.diagnose = function () {

  var divider = "═══════════════════════════════════════";

  console.info(divider);
  console.info("  ANSWER STORE DIAGNOSTIC");
  console.info(divider);

  var state = AnswerStore._state;
  var storage = AnswerStore.getStorageInfo();
  var journey = AnswerStore.getJourneyCompletion();

  console.info("");
  console.info("  State:");
  console.info("    version     : " + state.version);
  console.info("    currentSlide: " + state.currentSlide);
  console.info("    answerCount : " + state.answersStore.length);
  console.info("    totalScore  : " + state.totalScore);
  console.info("    isComplete  : " + state.isComplete);
  console.info("    isDirty     : " + state.isDirty);
  console.info("    startedAt   : " + (state.startedAt ? new Date(state.startedAt).toISOString() : "null"));

  console.info("");
  console.info("  Storage:");
  console.info("    exists    : " + storage.exists);
  console.info("    size      : " + storage.kilobytes + " KB");
  console.info("    answers   : " + storage.answerCount);

  console.info("");
  console.info("  Journey:");
  console.info("    questions : " + journey.answeredQuestions + " / " + journey.totalQuestions);
  console.info("    percent   : " + journey.percent + "%");
  console.info("    complete  : " + journey.isComplete);

  console.info("");
  console.info("  Stations:");
  journey.stationDetails.forEach(function (sd) {
    console.info(
      "    " + sd.stationName + ": " +
      sd.answeredQuestions + "/" + sd.totalQuestions +
      " (" + sd.percent + "%)" +
      (sd.isComplete ? " ✅" : "")
    );
  });

  console.info("");
  console.info(divider);

};



/* ============================================================
 *  25. LOGGING
 * ============================================================ */

AnswerStore._debug = true;

AnswerStore.log = function (message) {
  if (AnswerStore._debug) {
    console.info("[AnswerStore] " + message);
  }
};



/* ============================================================
 *  PUBLIC API SUMMARY
 *
 *  ── Lifecycle ──
 *  AnswerStore.init()
 *  AnswerStore.load()
 *  AnswerStore.clear()
 *
 *  ── Record ──
 *  AnswerStore.recordAnswer({ questionId, answer, score, isCorrect })
 *  AnswerStore.recordBatch([{ questionId, answer, score, isCorrect }])
 *
 *  ── Retrieve ──
 *  AnswerStore.getAnswer(questionId)
 *  AnswerStore.getAnswerValue(questionId)
 *  AnswerStore.isQuestionAnswered(questionId)
 *  AnswerStore.getScoreForQuestion(questionId)
 *  AnswerStore.getAllAnswers()
 *  AnswerStore.getAnswerCount()
 *  AnswerStore.getTotalScore()
 *
 *  ── Slide ──
 *  AnswerStore.setCurrentSlide(slideNumber)
 *  AnswerStore.getCurrentSlide()
 *
 *  ── Completion ──
 *  AnswerStore.getStationCompletion(stationId)
 *  AnswerStore.getJourneyCompletion()
 *  AnswerStore.getStoryCompletion(storyId)
 *
 *  ── Scoring ──
 *  AnswerStore.getScoreByStation(stationId)
 *  AnswerStore.getMaxPossibleScore()
 *
 *  ── Report ──
 *  AnswerStore.generateFinalReport(childInfo)
 *
 *  ── Recovery ──
 *  AnswerStore.getRecoveryData()
 *
 *  ── State ──
 *  AnswerStore.markComplete()
 *  AnswerStore.exportState()
 *  AnswerStore.getStorageInfo()
 *  AnswerStore.diagnose()
 *
 * ============================================================ */