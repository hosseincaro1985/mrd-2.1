/**
 * ============================================================
 *  content.js — Emotion Spaceship Game Content (Final)
 *
 *  Based on two PDF sources:
 *    Part 1 (PDF 2): 23 pages — 4 stations
 *    Part 2 (PDF 1): 23 pages — 4 stations
 *
 *  Total: 47 slides (1 child-info + 23 + 23)
 *         8 stations, 36 stories, 83 questions
 *
 *  Part 2 is disabled by default (settings.part2Enabled = false)
 *
 *  All editable texts have { textId, text, editable: true }
 * ============================================================
 */

var CONTENT = (function () {
  'use strict';

  /* ============================================================
   *  SETTINGS
   * ============================================================ */

  var settings = {
    part2Enabled: false
  };

  /* ============================================================
   *  STATIONS
   * ============================================================ */

  var stations = [
    /* Part 1 */
    { id: 1, name: 'ایستگاه اول — فهرست احساسات',     emotionId: 'mixed', icon: '🛸', color: '#3498db', part: 1 },
    { id: 2, name: 'ایستگاه دوم — داستان‌های احساس',   emotionId: 'mixed', icon: '📖', color: '#2ecc71', part: 1 },
    { id: 3, name: 'ایستگاه سوم — احساس‌های پنهان',    emotionId: 'mixed', icon: '🎭', color: '#e67e22', part: 1 },
    { id: 4, name: 'ایستگاه چهارم — احساس‌های ترکیبی', emotionId: 'mixed', icon: '🌈', color: '#9b59b6', part: 1 },
    /* Part 2 */
    { id: 5, name: 'ایستگاه اول — فهرست احساسات (بخش دوم)',     emotionId: 'mixed', icon: '🛸', color: '#1abc9c', part: 2 },
    { id: 6, name: 'ایستگاه دوم — داستان‌های احساس (بخش دوم)',   emotionId: 'mixed', icon: '📚', color: '#f39c12', part: 2 },
    { id: 7, name: 'ایستگاه سوم — احساس‌های پنهان (بخش دوم)',    emotionId: 'mixed', icon: '🔮', color: '#e74c3c', part: 2 },
    { id: 8, name: 'ایستگاه چهارم — احساس‌های ترکیبی (بخش دوم)', emotionId: 'mixed', icon: '✨', color: '#8e44ad', part: 2 }
  
];
  /* ============================================================
   *  EMOTIONS
   * ============================================================ */

  var emotions = [
    { id: 'joy',        name: 'شادی',    icon: '😊', color: '#FFD700' },
    { id: 'sadness',    name: 'غم',      icon: '😢', color: '#5DADE2' },
    { id: 'fear',       name: 'ترس',     icon: '😨', color: '#8E44AD' },
    { id: 'anger',      name: 'خشم',     icon: '😠', color: '#E74C3C' },
    { id: 'surprise',   name: 'تعجب',    icon: '😲', color: '#F39C12' },
    { id: 'calm',       name: 'آرامش',   icon: '😌', color: '#2ECC71' },
    { id: 'pride',      name: 'افتخار',  icon: '🥰', color: '#E67E22' },
    { id: 'jealousy',   name: 'حسادت',   icon: '😒', color: '#27AE60' },
    { id: 'worry',      name: 'نگرانی',  icon: '😟', color: '#85C1E9' },
    { id: 'hope',       name: 'امید',    icon: '🌱', color: '#52BE80' },
    { id: 'curiosity',  name: 'کنجکاوی', icon: '🤔', color: '#BB8FCE' },
    { id: 'compassion', name: 'دلسوزی',  icon: '🤗', color: '#EC7063' },
    { id: 'fatigue',    name: 'خستگی',   icon: '😮‍💨', color: '#AAB7B8' },
    { id: 'wonder',     name: 'شگفتی',   icon: '✨', color: '#F7DC6F' },
    { id: 'mischief',   name: 'شیطنت',   icon: '😼', color: '#85929E' },
    { id: 'mixed',      name: 'ترکیبی',  icon: '🌈', color: '#D2B4DE' }
  ];

  /* ============================================================
   *  STORIES
   * ============================================================ */

  var stories = [
    /* ───── Part 1 — Station 2 ───── */
    { id: 1, stationId: 2, part: 1, topic: 'نقاشی روی دیوار کلاس', targetEmotion: 'joy',
      text: { textId: 'story-1-text', editable: true,
        text: 'وقتی وارد کلاس شدم، مثل همیشه رفتم طرف میزم بعد چشمم به دیوار افتاد. چند تا نقاشی به دیوار چسبانده بودند. کمی جلوتر رفتم و نگاه کردم. یکدفعه دیدم یکی از نقاشی‌ها مال خودم است! اسمم هم زیرش نوشته شده بود. چند تا از بچه‌ها ایستاده بودند و نقاشی‌ها را نگاه می‌کردند. یکی از آنها گفت: «جلوتر رفتم و نقاشی‌ام را نگاه کردم. یادم افتاد وقتی آن را می‌کشیدم، چقدر حواسم به رنگ‌ها بود. دلم می‌خواست زودتر زنگ بخورد و مامانم بیاید مدرسه تا نقاشی‌ام را ببیند. سر جایم نشستم، اما باز هم چشمم به دیوار بود و به نقاشی‌ام نگاه می‌کردم.' },
      questionIds: ['q-001', 'q-002', 'q-003', 'q-004'] },

    { id: 2, stationId: 2, part: 1, topic: 'صندلی خالی', targetEmotion: 'sadness',
      text: { textId: 'story-2-text', editable: true,
        text: 'وقتی وارد کلاس شدم، اول به میزم نگاه کردم. بعد دیدم صندلی کنارم خالی است. هر روز دوستم آنجا می‌نشست. معلم گفت امروز نیامده. سر کلاس حواسم به درس بود، اما هر چند دقیقه یک‌بار نگاهم می‌رفت سمت صندلی خالی. زنگ تفریح که شد، بچه‌ها رفتند توی حیاط و شروع کردند به بازی. من ولی گوشه‌ای ایستاده بودم و بازی آنها را نگاه می‌کردم.' },
      questionIds: ['q-005', 'q-006', 'q-007', 'q-008'] },

    { id: 3, stationId: 2, part: 1, topic: 'بسته روی میز', targetEmotion: 'surprise',
      text: { textId: 'story-3-text', editable: true,
        text: 'وقتی به خانه رسیدم، دیدم یک بسته روی میز است هیچ کس چیزی نمی‌گفت. روی بسته، اسم من نوشته شده بود. مامان گفت: «آرام آرام کاغذش را باز کردم. داخلش چیزی بود که اصلاً فکرش را هم نمی‌کردم. چند لحظه فقط نگاهش کردم و باورم نمی‌شد.' },
      questionIds: ['q-009', 'q-010', 'q-011', 'q-012'] },

    { id: 4, stationId: 2, part: 1, topic: 'چراغ‌ها خاموش شد', targetEmotion: 'fear',
      text: { textId: 'story-4-text', editable: true,
        text: 'داشتم از اتاق رد می‌شدم که چراغ‌ها خاموش شد. همه‌جا تاریکِ تاریک شد. همان جا ایستادم. چند ثانیه هیچ کس حرفی نمی‌زد. نفسم بند آمده بود. یک‌دفعه کسی گفت: «برق رفته.»' },
      questionIds: ['q-013', 'q-014', 'q-015', 'q-016'] },

    { id: 5, stationId: 2, part: 1, topic: 'نوبت من بود', targetEmotion: 'anger',
      text: { textId: 'story-5-text', editable: true,
        text: 'داشتم با لگوها بازی می‌کردم. قبلش با بچه‌ها قرار گذاشته بودیم که هر کسی نوبت خودش بازی کند. آن موقع نوبت من بود و داشتم با لگوها چیزی می‌ساختم. یک‌دفعه یکی از بچه‌ها آمد و لگوها را از جلوی من برداشت. گفتم: «الان نوبت منه.» اما او گوش نداد. بدنم داغ شد. دست‌هایم را محکم مشت کردم. به او نگاه کردم و چیزی نگفتم. دوست داشتم لگوها را پس بگیرم، اما همان جا نشستم و چند نفس عمیق کشیدم.' },
      questionIds: ['q-017', 'q-018', 'q-019', 'q-020'] },

    /* ───── Part 1 — Station 3 ───── */
    { id: 6, stationId: 3, part: 1, topic: 'سارا و کاردستی', targetEmotion: 'mixed',
      text: { textId: 'story-6-text', editable: true,
        text: 'سارا با کاردستی‌اش وارد کلاس شد. دیروز برای درست کردن آن خیلی زحمت کشیده بود. آن را به معلم نشان داد. معلم نگاهی انداخت و گفت: «بذارش اونجا.» سارا لبخندی زد و گفت: «باشه خانم.» بعد رفت سر جایش نشست و چند لحظه ساکت ماند. دوستش آرام از او پرسید: «خیلی روش کار کرده بودی.» سارا شانه‌هایش را بالا انداخت و گفت: «نه... مهم نیست.»' },
      questionIds: ['q-021', 'q-022'] },

    { id: 7, stationId: 3, part: 1, topic: 'خرگوش و هویج', targetEmotion: 'mixed',
      text: { textId: 'story-7-text', editable: true,
        text: 'خرگوش کوچولو با هویجش آمد کنار دوستش. دوستش گفت: «من امروز هویج ندارم.» خرگوش هویجش را جلو گرفت و گفت: «اشکال نداره، تو بخور، من سیرم.» بعد لبخندی زد و کمی رفت عقب‌تر. دوستش گفت: «باشه، پس من می‌خورم.» اما نگاهش روی خرگوش ماند.' },
      questionIds: ['q-023', 'q-024'] },

    { id: 8, stationId: 3, part: 1, topic: 'دو گلدان کنار پنجره', targetEmotion: 'mixed',
      text: { textId: 'story-8-text', editable: true,
        text: 'کنار پنجره، دو تا گلدان کنار هم بودند. امروز یکی از آنها به جای آفتاب، توی سایه مانده بود. گلدان اول آرام گفت: «و سعی کرد برگ‌هایش را صاف و مرتب نگه دارد. گلدان کناری کمی جلوتر رفته بود و زیر نور آفتاب بود. او گفت: «بعد دوباره به دوستش نگاه کرد.' },
      questionIds: ['q-025', 'q-026'] },

    { id: 9, stationId: 3, part: 1, topic: 'علی و تیم فوتبال', targetEmotion: 'mixed',
      text: { textId: 'story-9-text', editable: true,
        text: 'امروز قرار بود اسامی افرادی که برای تیم فوتبال انتخاب شده بودند، سر صف خوانده شود. علی خیلی منتظر این لحظه بود اما اسمش برای تیم فوتبال خوانده نشد. دوستش دوید سمت علی و گفت: «من قبول شدم!» علی برایش دست زد و گفت: «آفرین! چه خبر خوبی.» بعد لبخند زد و کمی عقب‌تر ایستاد. دوستش پرسد: «علی حالت خوبه؟» علی گفت: «آره، خوبم.»' },
      questionIds: ['q-027', 'q-028'] },

    { id: 10, stationId: 3, part: 1, topic: 'توله‌سگ و اسباب‌بازی', targetEmotion: 'mixed',
      text: { textId: 'story-10-text', editable: true,
        text: 'توله‌سگ دنبال اسباب‌بازی‌اش می‌گشت، اما هر قدر می‌گشت و می‌گشت، نمی‌توانست آن را پیدا کند. گربه روی میز نشسته بود و از دور می‌دید که توپ زیر مبل است. توله‌سگ چرخی زد و به سمت گربه آمد و به او گفت: «اشکال نداره، بدون توپ هم می‌تونم بازی کنم.» بعد دمش را تکان داد. گربه گفت: «خوبه» ولی نگاهش هنوز به زیر مبل بود.' },
      questionIds: ['q-029', 'q-030'] },

    { id: 11, stationId: 3, part: 1, topic: 'دو درخت در باغ', targetEmotion: 'mixed',
      text: { textId: 'story-11-text', editable: true,
        text: 'دو درخت کنار هم در باغ ایستاده بودند یکی از آنها شاخه‌هایش پُر از گل‌های رنگی بود. هر طرف که نگاه می‌کردی، گل دیده می‌شد. درخت کناری به گل‌ها نگاه کرد و گفت: «گل‌ات خیلی قشنگن.» بعد نگاهی به شاخه‌های خودش انداخت. روی شاخه‌هایش فقط چند تا گل کوچک بود. چند برگش آرام تکان خوردند. درخت پُرگل گفت: «همان لحظه باد آرامی وزید. شاخه‌های درخت تکان خوردند و تنش کمی سفت شد، انگار می‌خواست خیلی محکم بایستد. درخت کناری هنوز به گل‌ها نگاه می‌کرد. درخت پُرگل هم ساکت شد.' },
      questionIds: ['q-031', 'q-032'] },

    /* ───── Part 1 — Station 4 ───── */
    { id: 12, stationId: 4, part: 1, topic: 'اجرای شعر جلوی کلاس', targetEmotion: 'mixed',
      text: { textId: 'story-12-text', editable: true,
        text: 'امروز در کلاس نوبت اجرا بود. قرار بود من جلوی همه شعر بخوانم. دیشب در خانه خیلی تمرین کرده بودم، ولی وقتی نوبتم شد، قلبم تندتند می‌زد. رفتم پای تخته. چند نفر از بچه‌ها به من نگاه می‌کردند. شروع کردم به خواندن. وسط شعر، صدایم کمی لرزید، اما ادامه دادم تا شعر تمام شد. وقتی تمام شد، معلم لبخند زد و بچه‌ها دست زدند.' },
      questionIds: ['q-033'] },

    { id: 13, stationId: 4, part: 1, topic: 'توله‌سگ در حیاط', targetEmotion: 'mixed',
      text: { textId: 'story-13-text', editable: true,
        text: 'امروز توله‌سگ برای اولین بار بدون مادرش بیرون رفت. حیاط برایش خیلی بزرگتر از همیشه به نظر می‌رسید. چند قدم جلو رفت، بعد ایستاد. بوهای تازه‌ای در هوا می‌آمد. صداهایی هم می‌شنید که قبلاً نشنیده بود. کمی نگاه کرد و گوش داد. اما بعد چشمش به یک توپ افتاد. آهسته جلو رفت و با پنجه‌اش توپ را تکان داد.' },
      questionIds: ['q-034'] },

    { id: 14, stationId: 4, part: 1, topic: 'نهال تازه کاشته‌شده', targetEmotion: 'mixed',
      text: { textId: 'story-14-text', editable: true,
        text: 'من یک نهال تازه کاشته‌شده هستم. دیروز مرا از گلدان کوچکم بیرون آوردند و در خاک باغچه گذاشتند. خاک جدید و تازه بود و ریشه‌هایم هنوز جا نگرفته بودند. خورشید می‌تابید و آب هم به من رسید. حس می‌کردم جایم بزرگتر شده، اما هنوز به اینجا عادت نکرده بودم.' },
      questionIds: ['q-035'] },

    { id: 15, stationId: 4, part: 1, topic: 'خداحافظی با دوست', targetEmotion: 'mixed',
      text: { textId: 'story-15-text', editable: true,
        text: 'امروز بهترین دوستم به شهر دیگری رفت. صبح با هم خداحافظی کردیم. او گفت حتماً با من تماس می‌گیرد. وقتی رفت، دلم کمی گرفت. جایش کنارم خالی شد. اما بعد با خودم فکر کردم که او قرار است جای جدیدی را ببیند و چیزهای جدیدی تجربه کند. در دلم برایش آرزو کردم همیشه موفق باشد.' },
      questionIds: ['q-036'] },

    { id: 16, stationId: 4, part: 1, topic: 'پرنده و اولین پرواز', targetEmotion: 'mixed',
      text: { textId: 'story-16-text', editable: true,
        text: 'پرنده‌ی کوچکی برای اولین بار از لانه بیرون پرید. بال‌هایش را تندتند تکان داد. کمی هم لرزیدند. اما بالاخره توانست روی نزدیک‌ترین شاخه بنشیند. چند لحظه همان جا ماند. به پایین نگاه کرد. زمین خیلی دورتر از چیزی بود که از داخل لانه به نظر می‌رسید. نسیم ملایمی از میان پرهایش رد شد و شاخه کمی تکان خورد. پرنده سرش را بالا آورد و به شاخه‌های دورتر نگاه کرد. انگار دلش می‌خواست دوباره بال بزند و جلوتر برود. اما هنوز چند لحظه روی همان شاخه ماند.' },
      questionIds: ['q-037'] },

    { id: 17, stationId: 4, part: 1, topic: 'درخت و پاییز', targetEmotion: 'mixed',
      text: { textId: 'story-17-text', editable: true,
        text: 'پاییز رسیده است. کم‌کم رنگ بعضی از برگ‌هایم عوض شده. رنگ سبزشان دارد زرد و نارنجی می‌شود. چند برگ هم از شاخه‌ها جدا شده‌اند و آرام روی زمین نشسته‌اند. باد حالا خنک‌تر از قبل از میان شاخه‌هایم می‌گذرد. گاهی شاخه‌هایم کمی تکان می‌خورند. به زمین نگاه می‌کنم؛ برگ‌هایم زیر پایم جمع شده‌اند و دیگر برگی ندارم. اما پایین‌تر، جایی که دیده نمی‌شود، ریشه‌هایم هنوز در خاک هستند. آرام و محکم. می‌دانم وقتی زمستان بگذرد، روی شاخه‌هایم دوباره جوانه‌های کوچکی پیدا می‌شود و بعد، برگ‌های تازه برمی‌گردند.' },
      questionIds: ['q-038'] },

    { id: 18, stationId: 4, part: 1, topic: 'مسابقه نامه‌نگاری', targetEmotion: 'mixed',
      text: { textId: 'story-18-text', editable: true,
        text: 'امروز نتیجۀ مسابقۀ نامه‌نگاری را اعلام کردند. همه در سالن نشسته بودیم. معلم اسم‌ها را یکی‌یکی می‌خواند. ناگهان اسم من را صدا زد. گفتند: «از جا پریدم و رفتم جلو. بچه‌ها دست زدند. یک جایزه به من دادند و من آن را محکم در دستم گرفتم. وقتی برگشتم سر جایم، به برگۀ مسابقه فکر کردم. یادم آمد قبل از اعلام نتیجه، با خودم تصور کرده بودم اسمم را برای نفر اول می‌خوانند. به جایزه نگاه کردم. بعد دوباره به جلوی سالن نگاه کردم؛ جایی که نفر اول ایستاده بود.' },
      questionIds: ['q-039'] },

    /* ───── Part 2 — Station 2 ───── */
    { id: 19, stationId: 6, part: 2, topic: 'اسمم را گفت', targetEmotion: 'mixed',
      text: { textId: 'story-19-text', editable: true,
        text: 'امروز معلم گفت یکی از بچه‌ها باید مسئول گروه باشد. من فکر نمی‌کردم اسمم را بگوید. اما گفت. چند نفر نگاهم کردند. رفتم کنار گروه ایستادم. دلم می‌خواست هرچه زودتر کار را شروع کنیم و چیزی را که معلم گفته بود با هم بسازیم.' },
      questionIds: ['q-040', 'q-041', 'q-042', 'q-043', 'q-044'] },

    { id: 20, stationId: 6, part: 2, topic: 'بازی بدون من', targetEmotion: 'mixed',
      text: { textId: 'story-20-text', editable: true,
        text: 'زنگ تفریح که شد، بچه‌ها شروع کردند به بازی. من هم رفتم طرفشان تا با آنها بازی کنم. اما گروه‌ها پر شده بود و دیگر جایی برای من نمانده بود. آرام آرام رفتم و کنار دیوار ایستادم و از دور نگاهشان کردم. بازی ادامه داشت و من فقط تماشا می‌کردم.' },
      questionIds: ['q-045', 'q-046', 'q-047', 'q-048', 'q-049'] },

    { id: 21, stationId: 6, part: 2, topic: 'معلم جدید', targetEmotion: 'mixed',
      text: { textId: 'story-21-text', editable: true,
        text: 'وقتی وارد کلاس شدم، دیدم معلم همیشگیمان نیست. خانمی جلوی کلاسمان ایستاده بود که قبلاً او را ندیده بودم. بچه‌ها همه ساکت روی صندلی‌هایشان نشسته بودند. من هم سر جایم نشستم و همین‌طور به آن خانم نگاه می‌کردم و منتظر بودم ببینم چه اتفاقی می‌افتد.' },
      questionIds: ['q-050', 'q-051', 'q-052', 'q-053', 'q-054'] },

    { id: 22, stationId: 6, part: 2, topic: 'در بسته شد', targetEmotion: 'mixed',
      text: { textId: 'story-22-text', editable: true,
        text: 'داشتم از پله‌ها پایین می‌رفتم. یک‌دفعه در پشت سرم محکم بسته شد. صدای در توی راهرو پیچید. من همان‌جا ایستادم. نفسم تند شد. چند لحظه طول کشید تا بفهمم کار باد بوده است.' },
      questionIds: ['q-055', 'q-056', 'q-057', 'q-058', 'q-059'] },

    { id: 23, stationId: 6, part: 2, topic: 'نوبت حرف زدن', targetEmotion: 'mixed',
      text: { textId: 'story-23-text', editable: true,
        text: 'داشتم داستانم را تعریف می‌کردم. وسط حرفم یکی دیگر شروع کرد به حرف زدن. معلم هم چیزی نگفت. ساکت شدم. دست‌هایم را روی پاهایم فشار دادم. دوست داشتم حرفم را ادامه بدهم.' },
      questionIds: ['q-060', 'q-061', 'q-062', 'q-063', 'q-064'] },

    /* ───── Part 2 — Station 3 ───── */
    { id: 24, stationId: 7, part: 2, topic: 'مینا و نقاشی', targetEmotion: 'mixed',
      text: { textId: 'story-24-text', editable: true,
        text: 'مینا در مدرسه نقاشی‌ای کشیده بود که آن را خیلی دوستش داشت. او تمام روز را روی آن کار کرده بود. وقتی می‌خواست از مدرسه به خانه بیاید، آن را نیز با خودش آورد. مینا تا به خانه رسید، سمت مادرش دوید تا نقاشی‌اش را به مادرش نشان بدهد. مادرش نگاه کوتاهی به نقاشی کرد و گفت: «بذارش روی میز.» بعد هم بلند شد و مشغول تلفن شد. مینا لبخندی زد و گفت: «باشه.» برادر مینا که آنجا بود به مینا گفت: «کشیده بودی نقاشی را گذاشت روی میز و آرام به اتاقش رفت.' },
      questionIds: ['q-065', 'q-066'] },

    { id: 25, stationId: 7, part: 2, topic: 'جوجه‌تیغی کوچولو', targetEmotion: 'mixed',
      text: { textId: 'story-25-text', editable: true,
        text: 'جوجه‌تیغی کوچولو چند ساعت بود که داشت دنبال غذا می‌گشت. ناگهان دید دوستش که دیرتر از او مشغول پیدا کردن غذا شده بود، غذای خوشمزه‌ای را پیدا کرده است. دوستش رو کرد به جوجه‌تیغی کوچولو و بهش گفت: «بیا کنار من بشین تا با هم بخوریم.» جوجه‌تیغی کوچولو ولی گفت: «نه، عجله ندارم.» بعد لبخندی زد و از آنجا دور شد. دوستش شروع به خوردن کرد اما هر چند لحظه یک‌بار نگاهش برمی‌گردد سمت جوجه‌تیغی.' },
      questionIds: ['q-067', 'q-068'] },

    { id: 26, stationId: 7, part: 2, topic: 'دو گلدان روی طاقچه', targetEmotion: 'mixed',
      text: { textId: 'story-26-text', editable: true,
        text: 'دو گلدان کنار هم روی طاقچه بودند. یکی از آنها امروز آب خورده بود ولی دیگری نه. گلدان بی‌آب گفت: «اشکالی نداره، فردا آب می‌خورم.» برگ‌هایش را صاف نگه داشت. گلدان دیگر می‌گوید: «من هم خیلی تشنه نبودم.» اما ریشه‌هایش را جمع کرد.' },
      questionIds: ['q-069', 'q-070'] },

    { id: 27, stationId: 7, part: 2, topic: 'امیر و تولد دوستش', targetEmotion: 'mixed',
      text: { textId: 'story-27-text', editable: true,
        text: 'دیروز تولد دوست امیر بود. با اینکه دوستش خیلی تأکید کرده بود که به موقع برسد، امیر دیر رسیده بود. وقتی رسید، نصف تولد گذشته بود و بقیۀ بچه‌ها همه آمده بودند و مشغول بازی بودند. دوستش امیر را که دید گفت: «عیبی نداره، مهم نیست.» لبخند زد و دوباره رفت سمت بچه‌ها تا بازی را ادامه دهد. امیر گفت: «خوبه.» کناری ایستاد و نگاهشان کرد.' },
      questionIds: ['q-071', 'q-072'] },

    { id: 28, stationId: 7, part: 2, topic: 'پشمک و پاپی', targetEmotion: 'mixed',
      text: { textId: 'story-28-text', editable: true,
        text: 'بچه‌گربه کوچولو به اسم خودش را کش و قوسی داد و رفت سراغ ظرف غذایش. اما دید که ظرف خالی است. پشمک کمی به ظرف خالی خیره شد. بعد چشمش افتاد به کنار ظرف پر از غذایش نشسته بود. پشمک گفت: «بعد آرام نشست و دم نرمش را دور خودش پیچید. اما شکمش یک صدای پاپی این صدا را شنید. وقتی شروع کرد به غذا خوردن، خیلی آرام می‌خورد. سرش پایین بود و گاهی یواشکی به پشمک نگاه می‌کرد. پشمک به ظرف خالی نگاه کرد. پاپی به غذای داخل ظرفش. خانه ساکت شده بود.' },
      questionIds: ['q-073', 'q-074'] },

    { id: 29, stationId: 7, part: 2, topic: 'دو درخت در پارک', targetEmotion: 'mixed',
      text: { textId: 'story-29-text', editable: true,
        text: 'دو درخت کنار هم توی پارک بودند یکیشان بزرگ و پُرشاخه بود. هر روز چند نفر می‌آمدند زیر سایه‌اش می‌نشستند، کتاب می‌خواندند یا بستنی می‌خوردند. درخت کناری‌اش کوچک‌تر بود. سایه‌اش هم کوچک‌تر بود. یک روز درخت کوچک‌تر گفت: «من کوچیک‌تره... ولی مهم نیست.» اما همان موقع شاخه‌هایش را کمی جمع کرد. چند برگش آرام پایین افتادند. درخت بزرگ گفت: «ولی وقتی صدای قدم‌ها نزدیک شد و چند نفر آمدند زیر سایه‌اش نشستند، تنش سفت شد. شاخه‌هایش تکان نخوردند. انگار نفسش را حبس کرده باشد. درخت کوچک‌تر یواشکی نگاهش کرد. درخت بزرگ هم بی‌حرکت ماند.' },
      questionIds: ['q-075', 'q-076'] },

    /* ───── Part 2 — Station 4 ───── */
    { id: 30, stationId: 8, part: 2, topic: 'اولین روز مدرسه جدید', targetEmotion: 'mixed',
      text: { textId: 'story-30-text', editable: true,
        text: 'امروز اولین روزی بود که به مدرسۀ جدید می‌رفتم. شب قبلش کیفم را آماده کرده بودم و لباس‌هایم را هم مرتب کنار تخت گذاشته بودم. فکر می‌کردم فردا روز جالبی می‌شود. صبح که وارد حیاط مدرسه شدم، یک‌دفعه همه‌چیز خیلی بزرگ به نظر رسید. بچه‌ها با هم حرف می‌زدند و می‌خندیدند، اما من هیچ کدامشان را نمی‌شناختم. وارد کلاس شدم و روی یک صندلی کنار پنجره نشستم. صدای حرف زدن بچه‌ها همه‌جا پیچیده بود. کمی بعد معلم وارد کلاس شد. اسمم را خواند و گفت: «چند نفر از بچه‌ها برگشتند نگاهم کردند و لبخند زدند. من هم لبخند کوچکی زدم. دلم می‌خواست زودتر دوست پیدا کنم. اما هنوز نتوانسته بودم.' },
      questionIds: ['q-077'] },

    { id: 31, stationId: 8, part: 2, topic: 'بچه‌گربه و دنیای بیرون', targetEmotion: 'mixed',
      text: { textId: 'story-31-text', editable: true,
        text: 'بچه‌گربه کوچک برای اولین بار بدون مادرش از لانه بیرون آمد. دنیای بیرون خیلی بزرگ‌تر از چیزی بود که تا حالا دیده بود. صداهای جدیدی می‌آمد؛ صدای پرنده‌ها، خش‌خش برگ‌ها، و گاهی هم صدای دورِ آدم‌ها. بچه‌گربه چند لحظه همان جا ایستاد و با چشم‌های گرد اطراف را نگاه کرد. گوش‌هایش تیز شده بود و هر صدایی را با دقت گوش می‌داد. همان وقت بوی خوشی به بینی‌اش رسید. بوی غذا! آرام‌آرام جلو رفت. کمی بو کشید و یک ظرف غذا پیدا کرد. شروع کرد به خوردن. لقمه‌های کوچکی برمی‌داشت و می‌خورد. کم‌کم شکمش داشت سیر می‌شد. اما گوش‌هایش هنوز تیز بود و هر چند لحظه سرش را بالا می‌آورد و اطراف را نگاه می‌کرد.' },
      questionIds: ['q-078'] },

    { id: 32, stationId: 8, part: 2, topic: 'گلدان در دفتر مدرسه', targetEmotion: 'mixed',
      text: { textId: 'story-32-text', editable: true,
        text: 'من یک گلدان کوچک هستم. تا دیروز در کلاس بودم. جایم کنار پنجره بود و نور آفتاب هر روز روی برگ‌هایم می‌تابید. صدای آرام بچه‌ها را هم می‌شنیدم. امروز مرا به دفتر مدرسه آوردند. اینجا کمی فرق دارد. نورش مثل قبل نیست و صداها بیشترند. گاهی تلفن زنگ می‌زند، گاهی آدم‌های مختلف می‌آیند و می‌روند. ریشه‌هایم هنوز به این جای تازه عادت نکرده‌اند. اما کنارم یک گلدان بزرگ‌تر قرار دارد و به خاطر همین، کسی هم مرتب به من آب می‌دهد. هنوز جای جدید برایم کمی ناآشناست، اما حس می‌کنم اینجا هم می‌توانم آرام آرام رشد کنم.' },
      questionIds: ['q-079'] },

    { id: 33, stationId: 8, part: 2, topic: 'دعوت تولد بعد از دعوا', targetEmotion: 'mixed',
      text: { textId: 'story-33-text', editable: true,
        text: 'چند هفته پیش من و دوستم با هم دعوا کرده بودیم. بعد از آن دیگر با هم حرف نزدیم. یک روز گوشی‌ام را نگاه کردم و دیدم از طرف او پیام آمده است. نوشته بود که تولدش است و من را دعوت کرده. پیام را یک بار خواندم. بعد دوباره خواندم. و باز هم یک بار دیگر. مدتی به صفحۀ گوشی نگاه می‌کردم. یاد روزهایی افتادم که با هم بازی می‌کردیم و می‌خندیدیم. بعد یاد دعوایمان افتادم. با خودم فکر کردم اگر به تولدش بروم، وقتی همدیگر را ببینیم چه می‌شود؟ آیا راحت با هم حرف می‌زنیم؟ یا اول کمی ساکت می‌مانیم؟ چند لحظه گوشی را کنار گذاشتم. بعد دوباره برداشتم و نوشتم: «آیم. حالا باید ببینم وقتی به تولدش می‌رسم، چه اتفاقی می‌افتد.' },
      questionIds: ['q-080'] },

    { id: 34, stationId: 8, part: 2, topic: 'اسب و بار سنگین', targetEmotion: 'mixed',
      text: { textId: 'story-34-text', editable: true,
        text: 'امروز برای اولین بار، اسب باید بار سنگینی را با خودش می‌کشید. اولش خیلی سخت بود. نفس‌هایش تند شد. پاهایش هم کمی درد گرفت. اما اسب ایستاد و تلاش کرد. آرام‌آرام جلو رفت و کارش را ادامه داد. وقتی کار تمام شد، صاحبش جلو آمد، دستش را روی گردن اسب کشید و گفت: «محکم ایستاد.' },
      questionIds: ['q-081'] },

    { id: 35, stationId: 8, part: 2, topic: 'درخت و باغبان', targetEmotion: 'mixed',
      text: { textId: 'story-35-text', editable: true,
        text: 'امروز باغبان با قیچی بزرگش به سراغم آمد. مدتی به شاخه‌هایم نگاه کرد، بعد چند تا از آنها را برید. شاخه‌ها روی زمین افتادند و جای بریدگی‌ها روی تنه‌ام ماند. برای مدتی همان‌جا ساکت ایستادم. بعد کم‌کم متوجه شدم نور بیشتری روی برگ‌هایم می‌تابد. باد هم راحت‌تر از میان شاخه‌هایم عبور می‌کند و برگ‌هایم را تکان می‌دهد. به زمین نگاه کردم؛ چند شاخه‌ام هنوز آنجا افتاده بودند. اما در نوک بعضی از شاخه‌های باقی‌مانده، جوانه‌های کوچکی پیدا شده‌اند. به نظر می‌رسد شاخه‌های تازه در راه‌اند.' },
      questionIds: ['q-082'] },

    { id: 36, stationId: 8, part: 2, topic: 'مسابقه نقاشی و صندلی خالی', targetEmotion: 'mixed',
      text: { textId: 'story-36-text', editable: true,
        text: 'امروز در مدرسه مسابقۀ نقاشی برگزار شد. وقتی معلم اسم برنده را خواند، اسم من بود. از جا پریدم و رفتم جلوی کلاس. بچه‌ها دست زدند و معلم یک جایزه به من داد. کاغذ نقاشی‌ام را هم بالا گرفتند تا بقیه ببینند. بعد آرام برگشتم سر جایم. به صندلی کنارم نگاه کردم. صندلی دوستم خالی بود. امروز به مدرسه نیامده بود. جایزه را در دستم نگه داشتم و دوباره به آن صندلی نگاه کردم. دوستم امروز در کلاس نبود تا نقاشی‌ام را ببیند و کنار بقیه برایم دست بزند.' },
      questionIds: ['q-083'] }
];
/* ============================================================
   *  QUESTIONS
   * ============================================================ */

  var questions = [
    /* ═══ Part 1 — Station 2 — Story 1 ═══ */
    { id: 'q-001', stationId: 2, storyId: 1, part: 1, emotionId: 'joy', type: 'open-ended',
      prompt: { textId: 'q-001-prompt', editable: true, text: 'به نظرت وقتی کودک قصۀ ما نقاشی‌اش را روی دیوار دید، چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-001-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-001-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-002', stationId: 2, storyId: 1, part: 1, emotionId: 'joy', type: 'open-ended',
      prompt: { textId: 'q-002-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-002-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-002-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-003', stationId: 2, storyId: 1, part: 1, emotionId: 'joy', type: 'open-ended',
      prompt: { textId: 'q-003-prompt', editable: true, text: 'وقتی این اتفاق افتاد، بدنش چه واکنشی نشان داد؟ مثلاً دست‌هایش، قلبش یا صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-003-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-003-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-004', stationId: 2, storyId: 1, part: 1, emotionId: 'joy', type: 'open-ended',
      prompt: { textId: 'q-004-prompt', editable: true, text: 'فکر می‌کنی آن موقع دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-004-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-004-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 1 — Station 2 — Story 2 ═══ */
    { id: 'q-005', stationId: 2, storyId: 2, part: 1, emotionId: 'sadness', type: 'open-ended',
      prompt: { textId: 'q-005-prompt', editable: true, text: 'به نظر تو این کودک چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-005-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-005-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-006', stationId: 2, storyId: 2, part: 1, emotionId: 'sadness', type: 'open-ended',
      prompt: { textId: 'q-006-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-006-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-006-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-007', stationId: 2, storyId: 2, part: 1, emotionId: 'sadness', type: 'open-ended',
      prompt: { textId: 'q-007-prompt', editable: true, text: 'وقتی این اتفاق افتاد، بدنش چه واکنشی نشان داد؟ مثلاً دست‌هایش، قلبش یا صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-007-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-007-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-008', stationId: 2, storyId: 2, part: 1, emotionId: 'sadness', type: 'open-ended',
      prompt: { textId: 'q-008-prompt', editable: true, text: 'فکر می‌کنی دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-008-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-008-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 1 — Station 2 — Story 3 ═══ */
    { id: 'q-009', stationId: 2, storyId: 3, part: 1, emotionId: 'surprise', type: 'open-ended',
      prompt: { textId: 'q-009-prompt', editable: true, text: 'کودک قصه وقتی فهمید جعبه برای اوست، چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-009-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-009-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-010', stationId: 2, storyId: 3, part: 1, emotionId: 'surprise', type: 'open-ended',
      prompt: { textId: 'q-010-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-010-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-010-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-011', stationId: 2, storyId: 3, part: 1, emotionId: 'surprise', type: 'open-ended',
      prompt: { textId: 'q-011-prompt', editable: true, text: 'وقتی این اتفاق افتاد، بدنش چه واکنشی نشان داد؟ مثلاً دست‌هایش، قلبش یا صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-011-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-011-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-012', stationId: 2, storyId: 3, part: 1, emotionId: 'surprise', type: 'open-ended',
      prompt: { textId: 'q-012-prompt', editable: true, text: 'فکر می‌کنی آن لحظه دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-012-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-012-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 1 — Station 2 — Story 4 ═══ */
    { id: 'q-013', stationId: 2, storyId: 4, part: 1, emotionId: 'fear', type: 'open-ended',
      prompt: { textId: 'q-013-prompt', editable: true, text: 'به نظر تو وقتی همه جا تاریک شد، کودک چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-013-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-013-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-014', stationId: 2, storyId: 4, part: 1, emotionId: 'fear', type: 'open-ended',
      prompt: { textId: 'q-014-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-014-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-014-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-015', stationId: 2, storyId: 4, part: 1, emotionId: 'fear', type: 'open-ended',
      prompt: { textId: 'q-015-prompt', editable: true, text: 'وقتی این اتفاق افتاد، بدنش چه واکنشی نشان داد؟ مثلاً دست‌هایش، قلبش یا صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-015-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-015-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-016', stationId: 2, storyId: 4, part: 1, emotionId: 'fear', type: 'open-ended',
      prompt: { textId: 'q-016-prompt', editable: true, text: 'فکر می‌کنی دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-016-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-016-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 1 — Station 2 — Story 5 ═══ */
    { id: 'q-017', stationId: 2, storyId: 5, part: 1, emotionId: 'anger', type: 'open-ended',
      prompt: { textId: 'q-017-prompt', editable: true, text: 'به نظر تو وقتی یکی از بچه‌ها لگو را از جلوی کودک داستان برداشت، کودک چه احساسی پیدا کرد؟' },
      feedbackCorrect: { textId: 'q-017-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-017-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-018', stationId: 2, storyId: 5, part: 1, emotionId: 'anger', type: 'open-ended',
      prompt: { textId: 'q-018-prompt', editable: true, text: 'فکر می‌کنی کودک توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-018-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-018-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-019', stationId: 2, storyId: 5, part: 1, emotionId: 'anger', type: 'open-ended',
      prompt: { textId: 'q-019-prompt', editable: true, text: 'وقتی این اتفاق افتاد، بدنش چه واکنشی نشان داد؟ مثلاً دست‌هایش، قلبش یا صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-019-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-019-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-020', stationId: 2, storyId: 5, part: 1, emotionId: 'anger', type: 'open-ended',
      prompt: { textId: 'q-020-prompt', editable: true, text: 'فکر می‌کنی دلش می‌خواست در آن لحظه چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-020-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-020-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 1 — Station 3 — Story 6 ═══ */
    { id: 'q-021', stationId: 3, storyId: 6, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-021-prompt', editable: true, text: 'سارا چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-021-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-021-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-021-a', 'q-021-b', 'q-021-c', 'q-021-d'] },

    { id: 'q-022', stationId: 3, storyId: 6, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-022-prompt', editable: true, text: 'دوست سارا چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-022-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-022-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-022-a', 'q-022-b', 'q-022-c', 'q-022-d'] },

    /* ═══ Part 1 — Station 3 — Story 7 ═══ */
    { id: 'q-023', stationId: 3, storyId: 7, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-023-prompt', editable: true, text: 'خرگوش چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-023-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-023-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-023-a', 'q-023-b', 'q-023-c', 'q-023-d'] },

    { id: 'q-024', stationId: 3, storyId: 7, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-024-prompt', editable: true, text: 'دوست خرگوش چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-024-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-024-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-024-a', 'q-024-b', 'q-024-c', 'q-024-d'] },

    /* ═══ Part 1 — Station 3 — Story 8 ═══ */
    { id: 'q-025', stationId: 3, storyId: 8, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-025-prompt', editable: true, text: 'گلدانِ در سایه چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-025-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-025-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-025-a', 'q-025-b', 'q-025-c', 'q-025-d'] },

    { id: 'q-026', stationId: 3, storyId: 8, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-026-prompt', editable: true, text: 'گلدانِ زیر آفتاب چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-026-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-026-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-026-a', 'q-026-b', 'q-026-c', 'q-026-d'] },

    /* ═══ Part 1 — Station 3 — Story 9 ═══ */
    { id: 'q-027', stationId: 3, storyId: 9, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-027-prompt', editable: true, text: 'علی چه احساسی را پنهان می‌کند؟' },
      feedbackCorrect: { textId: 'q-027-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-027-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-027-a', 'q-027-b', 'q-027-c', 'q-027-d'] },

    { id: 'q-028', stationId: 3, storyId: 9, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-028-prompt', editable: true, text: 'دوست علی چه احساسی را پنهان می‌کند؟' },
      feedbackCorrect: { textId: 'q-028-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-028-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-028-a', 'q-028-b', 'q-028-c', 'q-028-d'] },

    /* ═══ Part 1 — Station 3 — Story 10 ═══ */
    { id: 'q-029', stationId: 3, storyId: 10, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-029-prompt', editable: true, text: 'توله‌سگ چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-029-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-029-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-029-a', 'q-029-b', 'q-029-c', 'q-029-d'] },

    { id: 'q-030', stationId: 3, storyId: 10, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-030-prompt', editable: true, text: 'گربه چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-030-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-030-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-030-a', 'q-030-b', 'q-030-c', 'q-030-d'] },

    /* ═══ Part 1 — Station 3 — Story 11 ═══ */
    { id: 'q-031', stationId: 3, storyId: 11, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-031-prompt', editable: true, text: 'درخت کم‌گل چه احساسی را پنهان می‌کرد؟' },
      feedbackCorrect: { textId: 'q-031-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-031-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-031-a', 'q-031-b', 'q-031-c', 'q-031-d'] },

    { id: 'q-032', stationId: 3, storyId: 11, part: 1, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-032-prompt', editable: true, text: 'درخت پرگل چه احساسی را پنهان می‌کرد؟' },
      feedbackCorrect: { textId: 'q-032-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-032-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-032-a', 'q-032-b', 'q-032-c', 'q-032-d'] },

    /* ═══ Part 1 — Station 4 ═══ */
    { id: 'q-033', stationId: 4, storyId: 12, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-033-prompt', editable: true, text: 'شخصیت اصلی داستان چه احساس‌هایی داشت؟' },
      feedbackCorrect: { textId: 'q-033-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-033-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-033-a', 'q-033-b', 'q-033-c', 'q-033-d'] },

    { id: 'q-034', stationId: 4, storyId: 13, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-034-prompt', editable: true, text: 'توله‌سگ چه احساس‌هایی دارد؟' },
      feedbackCorrect: { textId: 'q-034-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-034-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-034-a', 'q-034-b', 'q-034-c', 'q-034-d'] },

    { id: 'q-035', stationId: 4, storyId: 14, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-035-prompt', editable: true, text: 'نهال چه احساس‌هایی دارد؟' },
      feedbackCorrect: { textId: 'q-035-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-035-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-035-a', 'q-035-b', 'q-035-c', 'q-035-d'] },

    { id: 'q-036', stationId: 4, storyId: 15, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-036-prompt', editable: true, text: 'کودک چه احساس‌هایی دارد؟' },
      feedbackCorrect: { textId: 'q-036-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-036-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-036-a', 'q-036-b', 'q-036-c', 'q-036-d'] },

    { id: 'q-037', stationId: 4, storyId: 16, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-037-prompt', editable: true, text: 'پرنده چه احساس‌هایی دارد؟' },
      feedbackCorrect: { textId: 'q-037-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-037-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-037-a', 'q-037-b', 'q-037-c', 'q-037-d'] },

    { id: 'q-038', stationId: 4, storyId: 17, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-038-prompt', editable: true, text: 'درخت چه احساس‌هایی دارد؟' },
      feedbackCorrect: { textId: 'q-038-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-038-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-038-a', 'q-038-b', 'q-038-c', 'q-038-d'] },

    { id: 'q-039', stationId: 4, storyId: 18, part: 1, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-039-prompt', editable: true, text: 'کودک چه احساس‌هایی دارد؟' },
      feedbackCorrect: { textId: 'q-039-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-039-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-039-a', 'q-039-b', 'q-039-c', 'q-039-d'] },

    /* ═══ Part 2 — Station 2 — Story 19 ═══ */
    { id: 'q-040', stationId: 6, storyId: 19, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-040-prompt', editable: true, text: 'به نظرت دانش‌آموز وقتی اسمش را شنید، چه احساسی پیدا کرد؟' },
      feedbackCorrect: { textId: 'q-040-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-040-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-041', stationId: 6, storyId: 19, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-041-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-041-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-041-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-042', stationId: 6, storyId: 19, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-042-prompt', editable: true, text: 'وقتی این اتفاق افتاد، به نظرت توی بدنش چه نشانه‌ای پیدا شد؟' },
      feedbackCorrect: { textId: 'q-042-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-042-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-043', stationId: 6, storyId: 19, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-043-prompt', editable: true, text: 'فکر می‌کنی وقتی اسمش را شنید دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-043-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-043-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-044', stationId: 6, storyId: 19, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-044-prompt', editable: true, text: 'به نظرت وقتی اسمش را شنید، صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-044-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-044-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 2 — Station 2 — Story 20 ═══ */
    { id: 'q-045', stationId: 6, storyId: 20, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-045-prompt', editable: true, text: 'به نظر تو این کودک چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-045-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-045-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-046', stationId: 6, storyId: 20, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-046-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-046-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-046-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-047', stationId: 6, storyId: 20, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-047-prompt', editable: true, text: 'وقتی این اتفاق افتاد، به نظرت توی بدنش چه نشانه‌ای پیدا شد؟' },
      feedbackCorrect: { textId: 'q-047-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-047-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-048', stationId: 6, storyId: 20, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-048-prompt', editable: true, text: 'فکر می‌کنی آن موقع دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-048-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-048-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-049', stationId: 6, storyId: 20, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-049-prompt', editable: true, text: 'به نظرت وقتی رفت کنار دیوار ایستاد، صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-049-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-049-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 2 — Station 2 — Story 21 ═══ */
    { id: 'q-050', stationId: 6, storyId: 21, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-050-prompt', editable: true, text: 'دانش‌آموز وقتی وارد کلاس شد و یک فرد غریبه را دید، چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-050-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-050-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-051', stationId: 6, storyId: 21, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-051-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-051-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-051-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-052', stationId: 6, storyId: 21, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-052-prompt', editable: true, text: 'وقتی این اتفاق افتاد، به نظرت توی بدنش چه نشانه‌ای پیدا شد؟' },
      feedbackCorrect: { textId: 'q-052-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-052-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-053', stationId: 6, storyId: 21, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-053-prompt', editable: true, text: 'فکر می‌کنی آن موقع دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-053-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-053-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-054', stationId: 6, storyId: 21, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-054-prompt', editable: true, text: 'به نظرت وقتی فهمید آن خانم غریبه را دید، صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-054-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-054-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 2 — Station 2 — Story 22 ═══ */
    { id: 'q-055', stationId: 6, storyId: 22, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-055-prompt', editable: true, text: 'به نظر تو وقتی در راهرو صدا پیچید، کودک چه احساسی داشت؟' },
      feedbackCorrect: { textId: 'q-055-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-055-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-056', stationId: 6, storyId: 22, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-056-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-056-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-056-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-057', stationId: 6, storyId: 22, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-057-prompt', editable: true, text: 'وقتی این اتفاق افتاد، به نظرت توی بدنش چه نشانه‌ای پیدا شد؟' },
      feedbackCorrect: { textId: 'q-057-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-057-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-058', stationId: 6, storyId: 22, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-058-prompt', editable: true, text: 'فکر می‌کنی آن موقع دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-058-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-058-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-059', stationId: 6, storyId: 22, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-059-prompt', editable: true, text: 'به نظرت وقتی ناگهان صدا پیچید، صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-059-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-059-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 2 — Station 2 — Story 23 ═══ */
    { id: 'q-060', stationId: 6, storyId: 23, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-060-prompt', editable: true, text: 'به نظر تو وقتی کودک نتوانست حرفش را بزند، چه احساسی پیدا کرد؟' },
      feedbackCorrect: { textId: 'q-060-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-060-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-061', stationId: 6, storyId: 23, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-061-prompt', editable: true, text: 'فکر می‌کنی توی دلش درباره این اتفاق چه فکری کرد؟' },
      feedbackCorrect: { textId: 'q-061-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-061-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-062', stationId: 6, storyId: 23, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-062-prompt', editable: true, text: 'وقتی این اتفاق افتاد، به نظرت توی بدنش چه نشانه‌ای پیدا شد؟' },
      feedbackCorrect: { textId: 'q-062-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-062-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-063', stationId: 6, storyId: 23, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-063-prompt', editable: true, text: 'فکر می‌کنی آن موقع دلش می‌خواست چه کاری انجام بدهد؟' },
      feedbackCorrect: { textId: 'q-063-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-063-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    { id: 'q-064', stationId: 6, storyId: 23, part: 2, emotionId: 'mixed', type: 'open-ended',
      prompt: { textId: 'q-064-prompt', editable: true, text: 'به نظرت صورتش چه تغییری کرد؟' },
      feedbackCorrect: { textId: 'q-064-fb-correct', editable: true, text: 'ممنون که جواب دادی!' },
      feedbackWrong:   { textId: 'q-064-fb-wrong',   editable: true, text: '' },
      score: 1, optionIds: [] },

    /* ═══ Part 2 — Station 3 ═══ */
    { id: 'q-065', stationId: 7, storyId: 24, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-065-prompt', editable: true, text: 'مینا چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-065-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-065-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-065-a', 'q-065-b', 'q-065-c', 'q-065-d'] },

    { id: 'q-066', stationId: 7, storyId: 24, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-066-prompt', editable: true, text: 'برادر مینا چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-066-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-066-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-066-a', 'q-066-b', 'q-066-c', 'q-066-d'] },

    { id: 'q-067', stationId: 7, storyId: 25, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-067-prompt', editable: true, text: 'جوجه‌تیغی کوچولو چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-067-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-067-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-067-a', 'q-067-b', 'q-067-c', 'q-067-d'] },

    { id: 'q-068', stationId: 7, storyId: 25, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-068-prompt', editable: true, text: 'دوست جوجه‌تیغی چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-068-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-068-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-068-a', 'q-068-b', 'q-068-c', 'q-068-d'] },

    { id: 'q-069', stationId: 7, storyId: 26, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-069-prompt', editable: true, text: 'گلدانِ بدون آب چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-069-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-069-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-069-a', 'q-069-b', 'q-069-c', 'q-069-d'] },

    { id: 'q-070', stationId: 7, storyId: 26, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-070-prompt', editable: true, text: 'گلدانِ آب خورده چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-070-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-070-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-070-a', 'q-070-b', 'q-070-c', 'q-070-d'] },

    { id: 'q-071', stationId: 7, storyId: 27, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-071-prompt', editable: true, text: 'امیر چه احساسی را پنهان می‌کند؟' },
      feedbackCorrect: { textId: 'q-071-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-071-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-071-a', 'q-071-b', 'q-071-c', 'q-071-d'] },

    { id: 'q-072', stationId: 7, storyId: 27, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-072-prompt', editable: true, text: 'دوست امیر چه احساسی را پنهان می‌کند؟' },
      feedbackCorrect: { textId: 'q-072-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-072-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-072-a', 'q-072-b', 'q-072-c', 'q-072-d'] },

    { id: 'q-073', stationId: 7, storyId: 28, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-073-prompt', editable: true, text: 'پشمک چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-073-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-073-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-073-a', 'q-073-b', 'q-073-c', 'q-073-d'] },

    { id: 'q-074', stationId: 7, storyId: 28, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-074-prompt', editable: true, text: 'پاپی چه احساسی را پنهان کرد؟' },
      feedbackCorrect: { textId: 'q-074-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-074-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-074-a', 'q-074-b', 'q-074-c', 'q-074-d'] },

    { id: 'q-075', stationId: 7, storyId: 29, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-075-prompt', editable: true, text: 'درخت کوچک‌تر چه احساسی را پنهان می‌کرد؟' },
      feedbackCorrect: { textId: 'q-075-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-075-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-075-a', 'q-075-b', 'q-075-c', 'q-075-d'] },

    { id: 'q-076', stationId: 7, storyId: 29, part: 2, emotionId: 'mixed', type: 'single-choice',
      prompt: { textId: 'q-076-prompt', editable: true, text: 'درخت بزرگ‌تر چه احساسی را پنهان می‌کرد؟' },
      feedbackCorrect: { textId: 'q-076-fb-correct', editable: true, text: 'آفرین! درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-076-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 1, optionIds: ['q-076-a', 'q-076-b', 'q-076-c', 'q-076-d'] },

    /* ═══ Part 2 — Station 4 ═══ */
    { id: 'q-077', stationId: 8, storyId: 30, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-077-prompt', editable: true, text: 'شخصیت اصلی چه احساس‌هایی را با هم داشت؟' },
      feedbackCorrect: { textId: 'q-077-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-077-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-077-a', 'q-077-b', 'q-077-c', 'q-077-d'] },

    { id: 'q-078', stationId: 8, storyId: 31, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-078-prompt', editable: true, text: 'بچه‌گربه چه احساس‌هایی را با هم دارد؟' },
      feedbackCorrect: { textId: 'q-078-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-078-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-078-a', 'q-078-b', 'q-078-c', 'q-078-d'] },

    { id: 'q-079', stationId: 8, storyId: 32, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-079-prompt', editable: true, text: 'گلدان چه احساس‌هایی را با هم دارد؟' },
      feedbackCorrect: { textId: 'q-079-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-079-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-079-a', 'q-079-b', 'q-079-c', 'q-079-d'] },

    { id: 'q-080', stationId: 8, storyId: 33, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-080-prompt', editable: true, text: 'کودک چه احساس‌هایی را با هم دارد؟' },
      feedbackCorrect: { textId: 'q-080-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-080-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-080-a', 'q-080-b', 'q-080-c', 'q-080-d'] },

    { id: 'q-081', stationId: 8, storyId: 34, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-081-prompt', editable: true, text: 'اسب چه احساس‌هایی را با هم دارد؟' },
      feedbackCorrect: { textId: 'q-081-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-081-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-081-a', 'q-081-b', 'q-081-c', 'q-081-d'] },

    { id: 'q-082', stationId: 8, storyId: 35, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-082-prompt', editable: true, text: 'درخت چه احساس‌هایی را با هم دارد؟' },
      feedbackCorrect: { textId: 'q-082-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-082-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-082-a', 'q-082-b', 'q-082-c', 'q-082-d'] },

    { id: 'q-083', stationId: 8, storyId: 36, part: 2, emotionId: 'mixed', type: 'multi-choice', maxSelections: 2,
      prompt: { textId: 'q-083-prompt', editable: true, text: 'دانش‌آموز داستان ما چه احساس‌هایی را با هم دارد؟' },
      feedbackCorrect: { textId: 'q-083-fb-correct', editable: true, text: 'آفرین! هر دو احساس را درست انتخاب کردی.' },
      feedbackWrong:   { textId: 'q-083-fb-wrong',   editable: true, text: 'اشکال نداره! دفعه بعد بهتر می‌شه.' },
      score: 2, optionIds: ['q-083-a', 'q-083-b', 'q-083-c', 'q-083-d'] }
     ];

  /* ============================================================
   *  OPTIONS
   * ============================================================ */

  var options = [
    /* ── q-021: سارا ── */
    { id: 'q-021-a', questionId: 'q-021', part: 1, text: { textId: 'q-021-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-021-b', questionId: 'q-021', part: 1, text: { textId: 'q-021-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-021-c', questionId: 'q-021', part: 1, text: { textId: 'q-021-c-text', editable: true, text: 'خشم' },    isCorrect: true,  type: 'choice' },
    { id: 'q-021-d', questionId: 'q-021', part: 1, text: { textId: 'q-021-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ── q-022: دوست سارا ── */
    { id: 'q-022-a', questionId: 'q-022', part: 1, text: { textId: 'q-022-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-022-b', questionId: 'q-022', part: 1, text: { textId: 'q-022-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-022-c', questionId: 'q-022', part: 1, text: { textId: 'q-022-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-022-d', questionId: 'q-022', part: 1, text: { textId: 'q-022-d-text', editable: true, text: 'افتخار' }, isCorrect: true,  type: 'choice' },

    /* ── q-023: خرگوش ── */
    { id: 'q-023-a', questionId: 'q-023', part: 1, text: { textId: 'q-023-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-023-b', questionId: 'q-023', part: 1, text: { textId: 'q-023-b-text', editable: true, text: 'غم' },      isCorrect: true,  type: 'choice' },
    { id: 'q-023-c', questionId: 'q-023', part: 1, text: { textId: 'q-023-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-023-d', questionId: 'q-023', part: 1, text: { textId: 'q-023-d-text', editable: true, text: 'دلسوزی' },  isCorrect: false, type: 'choice' },

    /* ── q-024: دوست خرگوش ── */
    { id: 'q-024-a', questionId: 'q-024', part: 1, text: { textId: 'q-024-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-024-b', questionId: 'q-024', part: 1, text: { textId: 'q-024-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-024-c', questionId: 'q-024', part: 1, text: { textId: 'q-024-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-024-d', questionId: 'q-024', part: 1, text: { textId: 'q-024-d-text', editable: true, text: 'دلسوزی' },  isCorrect: true,  type: 'choice' },

    /* ── q-025: گلدان در سایه ── */
    { id: 'q-025-a', questionId: 'q-025', part: 1, text: { textId: 'q-025-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-025-b', questionId: 'q-025', part: 1, text: { textId: 'q-025-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-025-c', questionId: 'q-025', part: 1, text: { textId: 'q-025-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-025-d', questionId: 'q-025', part: 1, text: { textId: 'q-025-d-text', editable: true, text: 'نگرانی' },  isCorrect: true,  type: 'choice' },

    /* ── q-026: گلدان زیر آفتاب ── */
    { id: 'q-026-a', questionId: 'q-026', part: 1, text: { textId: 'q-026-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-026-b', questionId: 'q-026', part: 1, text: { textId: 'q-026-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-026-c', questionId: 'q-026', part: 1, text: { textId: 'q-026-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-026-d', questionId: 'q-026', part: 1, text: { textId: 'q-026-d-text', editable: true, text: 'نگرانی' },  isCorrect: true,  type: 'choice' },

    /* ── q-027: علی ── */
    { id: 'q-027-a', questionId: 'q-027', part: 1, text: { textId: 'q-027-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-027-b', questionId: 'q-027', part: 1, text: { textId: 'q-027-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-027-c', questionId: 'q-027', part: 1, text: { textId: 'q-027-c-text', editable: true, text: 'حسادت' },  isCorrect: true,  type: 'choice' },
    { id: 'q-027-d', questionId: 'q-027', part: 1, text: { textId: 'q-027-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ── q-028: دوست علی ── */
    { id: 'q-028-a', questionId: 'q-028', part: 1, text: { textId: 'q-028-a-text', editable: true, text: 'شادی' },   isCorrect: true,  type: 'choice' },
    { id: 'q-028-b', questionId: 'q-028', part: 1, text: { textId: 'q-028-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-028-c', questionId: 'q-028', part: 1, text: { textId: 'q-028-c-text', editable: true, text: 'حسادت' },  isCorrect: false, type: 'choice' },
    { id: 'q-028-d', questionId: 'q-028', part: 1, text: { textId: 'q-028-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ── q-029: توله‌سگ ── */
    { id: 'q-029-a', questionId: 'q-029', part: 1, text: { textId: 'q-029-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-029-b', questionId: 'q-029', part: 1, text: { textId: 'q-029-b-text', editable: true, text: 'غم' },      isCorrect: true,  type: 'choice' },
    { id: 'q-029-c', questionId: 'q-029', part: 1, text: { textId: 'q-029-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-029-d', questionId: 'q-029', part: 1, text: { textId: 'q-029-d-text', editable: true, text: 'شیطنت' },   isCorrect: false, type: 'choice' },

    /* ── q-030: گربه ── */
    { id: 'q-030-a', questionId: 'q-030', part: 1, text: { textId: 'q-030-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-030-b', questionId: 'q-030', part: 1, text: { textId: 'q-030-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-030-c', questionId: 'q-030', part: 1, text: { textId: 'q-030-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-030-d', questionId: 'q-030', part: 1, text: { textId: 'q-030-d-text', editable: true, text: 'شیطنت' },   isCorrect: true,  type: 'choice' },

    /* ── q-031: درخت کم‌گل ── */
    { id: 'q-031-a', questionId: 'q-031', part: 1, text: { textId: 'q-031-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-031-b', questionId: 'q-031', part: 1, text: { textId: 'q-031-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-031-c', questionId: 'q-031', part: 1, text: { textId: 'q-031-c-text', editable: true, text: 'حسادت' },  isCorrect: true,  type: 'choice' },
    { id: 'q-031-d', questionId: 'q-031', part: 1, text: { textId: 'q-031-d-text', editable: true, text: 'نگرانی' }, isCorrect: false, type: 'choice' },

    /* ── q-032: درخت پرگل ── */
    { id: 'q-032-a', questionId: 'q-032', part: 1, text: { textId: 'q-032-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-032-b', questionId: 'q-032', part: 1, text: { textId: 'q-032-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-032-c', questionId: 'q-032', part: 1, text: { textId: 'q-032-c-text', editable: true, text: 'حسادت' },  isCorrect: false, type: 'choice' },
    { id: 'q-032-d', questionId: 'q-032', part: 1, text: { textId: 'q-032-d-text', editable: true, text: 'نگرانی' }, isCorrect: true,  type: 'choice' },

    /* ── q-033: اجرای شعر (multi) ── */
    { id: 'q-033-a', questionId: 'q-033', part: 1, text: { textId: 'q-033-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-033-b', questionId: 'q-033', part: 1, text: { textId: 'q-033-b-text', editable: true, text: 'ترس' },    isCorrect: true,  type: 'choice' },
    { id: 'q-033-c', questionId: 'q-033', part: 1, text: { textId: 'q-033-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-033-d', questionId: 'q-033', part: 1, text: { textId: 'q-033-d-text', editable: true, text: 'افتخار' }, isCorrect: true,  type: 'choice' },

    /* ── q-034: توله‌سگ در حیاط (multi) ── */
    { id: 'q-034-a', questionId: 'q-034', part: 1, text: { textId: 'q-034-a-text', editable: true, text: 'کنجکاوی' }, isCorrect: true,  type: 'choice' },
    { id: 'q-034-b', questionId: 'q-034', part: 1, text: { textId: 'q-034-b-text', editable: true, text: 'ترس' },     isCorrect: true,  type: 'choice' },
    { id: 'q-034-c', questionId: 'q-034', part: 1, text: { textId: 'q-034-c-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-034-d', questionId: 'q-034', part: 1, text: { textId: 'q-034-d-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },

    /* ── q-035: نهال (multi) ── */
    { id: 'q-035-a', questionId: 'q-035', part: 1, text: { textId: 'q-035-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-035-b', questionId: 'q-035', part: 1, text: { textId: 'q-035-b-text', editable: true, text: 'نگرانی' }, isCorrect: true,  type: 'choice' },
    { id: 'q-035-c', questionId: 'q-035', part: 1, text: { textId: 'q-035-c-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-035-d', questionId: 'q-035', part: 1, text: { textId: 'q-035-d-text', editable: true, text: 'امید' },   isCorrect: true,  type: 'choice' },

    /* ── q-036: خداحافظی با دوست (multi) ── */
    { id: 'q-036-a', questionId: 'q-036', part: 1, text: { textId: 'q-036-a-text', editable: true, text: 'غم' },       isCorrect: true,  type: 'choice' },
    { id: 'q-036-b', questionId: 'q-036', part: 1, text: { textId: 'q-036-b-text', editable: true, text: 'شادی' },     isCorrect: true,  type: 'choice' },
    { id: 'q-036-c', questionId: 'q-036', part: 1, text: { textId: 'q-036-c-text', editable: true, text: 'خشم' },      isCorrect: false, type: 'choice' },
    { id: 'q-036-d', questionId: 'q-036', part: 1, text: { textId: 'q-036-d-text', editable: true, text: 'دلتنگی' },   isCorrect: false, type: 'choice' },

    /* ── q-037: پرنده و اولین پرواز (multi) ── */
    { id: 'q-037-a', questionId: 'q-037', part: 1, text: { textId: 'q-037-a-text', editable: true, text: 'ترس' },    isCorrect: true,  type: 'choice' },
    { id: 'q-037-b', questionId: 'q-037', part: 1, text: { textId: 'q-037-b-text', editable: true, text: 'شگفتی' },  isCorrect: true,  type: 'choice' },
    { id: 'q-037-c', questionId: 'q-037', part: 1, text: { textId: 'q-037-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-037-d', questionId: 'q-037', part: 1, text: { textId: 'q-037-d-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },

    /* ── q-038: درخت و پاییز (multi) ── */
    { id: 'q-038-a', questionId: 'q-038', part: 1, text: { textId: 'q-038-a-text', editable: true, text: 'غم' },   isCorrect: true,  type: 'choice' },
    { id: 'q-038-b', questionId: 'q-038', part: 1, text: { textId: 'q-038-b-text', editable: true, text: 'امید' }, isCorrect: true,  type: 'choice' },
    { id: 'q-038-c', questionId: 'q-038', part: 1, text: { textId: 'q-038-c-text', editable: true, text: 'شادی' }, isCorrect: false, type: 'choice' },
    { id: 'q-038-d', questionId: 'q-038', part: 1, text: { textId: 'q-038-d-text', editable: true, text: 'ترس' },  isCorrect: false, type: 'choice' },

    /* ── q-039: مسابقه نامه‌نگاری (multi) ── */
    { id: 'q-039-a', questionId: 'q-039', part: 1, text: { textId: 'q-039-a-text', editable: true, text: 'شادی' },   isCorrect: true,  type: 'choice' },
    { id: 'q-039-b', questionId: 'q-039', part: 1, text: { textId: 'q-039-b-text', editable: true, text: 'غم' },     isCorrect: true,  type: 'choice' },
    { id: 'q-039-c', questionId: 'q-039', part: 1, text: { textId: 'q-039-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-039-d', questionId: 'q-039', part: 1, text: { textId: 'q-039-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ═══════════════════════════════════════════ */
    /* ═══ Part 2 — Station 3 Options ═══ */
    /* ═══════════════════════════════════════════ */

    /* ── q-065: مینا ── */
    { id: 'q-065-a', questionId: 'q-065', part: 2, text: { textId: 'q-065-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-065-b', questionId: 'q-065', part: 2, text: { textId: 'q-065-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-065-c', questionId: 'q-065', part: 2, text: { textId: 'q-065-c-text', editable: true, text: 'خشم' },    isCorrect: true,  type: 'choice' },
    { id: 'q-065-d', questionId: 'q-065', part: 2, text: { textId: 'q-065-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ── q-066: برادر مینا ── */
    { id: 'q-066-a', questionId: 'q-066', part: 2, text: { textId: 'q-066-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-066-b', questionId: 'q-066', part: 2, text: { textId: 'q-066-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-066-c', questionId: 'q-066', part: 2, text: { textId: 'q-066-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-066-d', questionId: 'q-066', part: 2, text: { textId: 'q-066-d-text', editable: true, text: 'افتخار' }, isCorrect: true,  type: 'choice' },

    /* ── q-067: جوجه‌تیغی ── */
    { id: 'q-067-a', questionId: 'q-067', part: 2, text: { textId: 'q-067-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-067-b', questionId: 'q-067', part: 2, text: { textId: 'q-067-b-text', editable: true, text: 'غم' },      isCorrect: true,  type: 'choice' },
    { id: 'q-067-c', questionId: 'q-067', part: 2, text: { textId: 'q-067-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-067-d', questionId: 'q-067', part: 2, text: { textId: 'q-067-d-text', editable: true, text: 'دلسوزی' },  isCorrect: false, type: 'choice' },

    /* ── q-068: دوست جوجه‌تیغی ── */
    { id: 'q-068-a', questionId: 'q-068', part: 2, text: { textId: 'q-068-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-068-b', questionId: 'q-068', part: 2, text: { textId: 'q-068-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-068-c', questionId: 'q-068', part: 2, text: { textId: 'q-068-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-068-d', questionId: 'q-068', part: 2, text: { textId: 'q-068-d-text', editable: true, text: 'دلسوزی' },  isCorrect: true,  type: 'choice' },

    /* ── q-069: گلدان بدون آب ── */
    { id: 'q-069-a', questionId: 'q-069', part: 2, text: { textId: 'q-069-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-069-b', questionId: 'q-069', part: 2, text: { textId: 'q-069-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-069-c', questionId: 'q-069', part: 2, text: { textId: 'q-069-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-069-d', questionId: 'q-069', part: 2, text: { textId: 'q-069-d-text', editable: true, text: 'نگرانی' },  isCorrect: true,  type: 'choice' },

    /* ── q-070: گلدان آب خورده ── */
    { id: 'q-070-a', questionId: 'q-070', part: 2, text: { textId: 'q-070-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-070-b', questionId: 'q-070', part: 2, text: { textId: 'q-070-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-070-c', questionId: 'q-070', part: 2, text: { textId: 'q-070-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-070-d', questionId: 'q-070', part: 2, text: { textId: 'q-070-d-text', editable: true, text: 'نگرانی' },  isCorrect: true,  type: 'choice' },

    /* ── q-071: امیر ── */
    { id: 'q-071-a', questionId: 'q-071', part: 2, text: { textId: 'q-071-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-071-b', questionId: 'q-071', part: 2, text: { textId: 'q-071-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-071-c', questionId: 'q-071', part: 2, text: { textId: 'q-071-c-text', editable: true, text: 'حسادت' },  isCorrect: true,  type: 'choice' },
    { id: 'q-071-d', questionId: 'q-071', part: 2, text: { textId: 'q-071-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ── q-072: دوست امیر ── */
    { id: 'q-072-a', questionId: 'q-072', part: 2, text: { textId: 'q-072-a-text', editable: true, text: 'شادی' },   isCorrect: true,  type: 'choice' },
    { id: 'q-072-b', questionId: 'q-072', part: 2, text: { textId: 'q-072-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-072-c', questionId: 'q-072', part: 2, text: { textId: 'q-072-c-text', editable: true, text: 'حسادت' },  isCorrect: false, type: 'choice' },
    { id: 'q-072-d', questionId: 'q-072', part: 2, text: { textId: 'q-072-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' },

    /* ── q-073: پشمک ── */
    { id: 'q-073-a', questionId: 'q-073', part: 2, text: { textId: 'q-073-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-073-b', questionId: 'q-073', part: 2, text: { textId: 'q-073-b-text', editable: true, text: 'غم' },      isCorrect: true,  type: 'choice' },
    { id: 'q-073-c', questionId: 'q-073', part: 2, text: { textId: 'q-073-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-073-d', questionId: 'q-073', part: 2, text: { textId: 'q-073-d-text', editable: true, text: 'دلسوزی' },  isCorrect: false, type: 'choice' },

    /* ── q-074: پاپی ── */
    { id: 'q-074-a', questionId: 'q-074', part: 2, text: { textId: 'q-074-a-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-074-b', questionId: 'q-074', part: 2, text: { textId: 'q-074-b-text', editable: true, text: 'غم' },      isCorrect: false, type: 'choice' },
    { id: 'q-074-c', questionId: 'q-074', part: 2, text: { textId: 'q-074-c-text', editable: true, text: 'خشم' },     isCorrect: true,  type: 'choice' },
    { id: 'q-074-d', questionId: 'q-074', part: 2, text: { textId: 'q-074-d-text', editable: true, text: 'دلسوزی' },  isCorrect: false, type: 'choice' },

    /* ── q-075: درخت کوچک‌تر ── */
    { id: 'q-075-a', questionId: 'q-075', part: 2, text: { textId: 'q-075-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-075-b', questionId: 'q-075', part: 2, text: { textId: 'q-075-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-075-c', questionId: 'q-075', part: 2, text: { textId: 'q-075-c-text', editable: true, text: 'حسادت' },  isCorrect: true,  type: 'choice' },
    { id: 'q-075-d', questionId: 'q-075', part: 2, text: { textId: 'q-075-d-text', editable: true, text: 'نگرانی' }, isCorrect: false, type: 'choice' },

    /* ── q-076: درخت بزرگ‌تر ── */
    { id: 'q-076-a', questionId: 'q-076', part: 2, text: { textId: 'q-076-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-076-b', questionId: 'q-076', part: 2, text: { textId: 'q-076-b-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-076-c', questionId: 'q-076', part: 2, text: { textId: 'q-076-c-text', editable: true, text: 'حسادت' },  isCorrect: false, type: 'choice' },
    { id: 'q-076-d', questionId: 'q-076', part: 2, text: { textId: 'q-076-d-text', editable: true, text: 'نگرانی' }, isCorrect: true,  type: 'choice' },

    /* ═══════════════════════════════════════════ */
    /* ═══ Part 2 — Station 4 Options (multi) ═══ */
    /* ═══════════════════════════════════════════ */

    /* ── q-077: اولین روز مدرسه جدید ── */
    { id: 'q-077-a', questionId: 'q-077', part: 2, text: { textId: 'q-077-a-text', editable: true, text: 'شادی' },   isCorrect: true,  type: 'choice' },
    { id: 'q-077-b', questionId: 'q-077', part: 2, text: { textId: 'q-077-b-text', editable: true, text: 'نگرانی' }, isCorrect: true,  type: 'choice' },
    { id: 'q-077-c', questionId: 'q-077', part: 2, text: { textId: 'q-077-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-077-d', questionId: 'q-077', part: 2, text: { textId: 'q-077-d-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },

    /* ── q-078: بچه‌گربه و دنیای بیرون ── */
    { id: 'q-078-a', questionId: 'q-078', part: 2, text: { textId: 'q-078-a-text', editable: true, text: 'کنجکاوی' }, isCorrect: true,  type: 'choice' },
    { id: 'q-078-b', questionId: 'q-078', part: 2, text: { textId: 'q-078-b-text', editable: true, text: 'نگرانی' },  isCorrect: true,  type: 'choice' },
    { id: 'q-078-c', questionId: 'q-078', part: 2, text: { textId: 'q-078-c-text', editable: true, text: 'شادی' },    isCorrect: false, type: 'choice' },
    { id: 'q-078-d', questionId: 'q-078', part: 2, text: { textId: 'q-078-d-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },

    /* ── q-079: گلدان در دفتر مدرسه ── */
    { id: 'q-079-a', questionId: 'q-079', part: 2, text: { textId: 'q-079-a-text', editable: true, text: 'شادی' },   isCorrect: false, type: 'choice' },
    { id: 'q-079-b', questionId: 'q-079', part: 2, text: { textId: 'q-079-b-text', editable: true, text: 'نگرانی' }, isCorrect: true,  type: 'choice' },
    { id: 'q-079-c', questionId: 'q-079', part: 2, text: { textId: 'q-079-c-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },
    { id: 'q-079-d', questionId: 'q-079', part: 2, text: { textId: 'q-079-d-text', editable: true, text: 'امید' },   isCorrect: true,  type: 'choice' },

    /* ── q-080: دعوت تولد بعد از دعوا ── */
    { id: 'q-080-a', questionId: 'q-080', part: 2, text: { textId: 'q-080-a-text', editable: true, text: 'غم' },      isCorrect: true,  type: 'choice' },
    { id: 'q-080-b', questionId: 'q-080', part: 2, text: { textId: 'q-080-b-text', editable: true, text: 'شادی' },    isCorrect: true,  type: 'choice' },
    { id: 'q-080-c', questionId: 'q-080', part: 2, text: { textId: 'q-080-c-text', editable: true, text: 'خشم' },     isCorrect: false, type: 'choice' },
    { id: 'q-080-d', questionId: 'q-080', part: 2, text: { textId: 'q-080-d-text', editable: true, text: 'نگرانی' },  isCorrect: false, type: 'choice' },

    /* ── q-081: اسب و بار سنگین ── */
    { id: 'q-081-a', questionId: 'q-081', part: 2, text: { textId: 'q-081-a-text', editable: true, text: 'خستگی' },  isCorrect: true,  type: 'choice' },
    { id: 'q-081-b', questionId: 'q-081', part: 2, text: { textId: 'q-081-b-text', editable: true, text: 'افتخار' }, isCorrect: true,  type: 'choice' },
    { id: 'q-081-c', questionId: 'q-081', part: 2, text: { textId: 'q-081-c-text', editable: true, text: 'ترس' },    isCorrect: false, type: 'choice' },
    { id: 'q-081-d', questionId: 'q-081', part: 2, text: { textId: 'q-081-d-text', editable: true, text: 'غم' },     isCorrect: false, type: 'choice' },

    /* ── q-082: درخت و باغبان ── */
    { id: 'q-082-a', questionId: 'q-082', part: 2, text: { textId: 'q-082-a-text', editable: true, text: 'غم' },   isCorrect: true,  type: 'choice' },
    { id: 'q-082-b', questionId: 'q-082', part: 2, text: { textId: 'q-082-b-text', editable: true, text: 'امید' }, isCorrect: true,  type: 'choice' },
    { id: 'q-082-c', questionId: 'q-082', part: 2, text: { textId: 'q-082-c-text', editable: true, text: 'شادی' }, isCorrect: false, type: 'choice' },
    { id: 'q-082-d', questionId: 'q-082', part: 2, text: { textId: 'q-082-d-text', editable: true, text: 'خشم' },  isCorrect: false, type: 'choice' },

    /* ── q-083: مسابقه نقاشی و صندلی خالی ── */
    { id: 'q-083-a', questionId: 'q-083', part: 2, text: { textId: 'q-083-a-text', editable: true, text: 'شادی' },   isCorrect: true,  type: 'choice' },
    { id: 'q-083-b', questionId: 'q-083', part: 2, text: { textId: 'q-083-b-text', editable: true, text: 'غم' },     isCorrect: true,  type: 'choice' },
    { id: 'q-083-c', questionId: 'q-083', part: 2, text: { textId: 'q-083-c-text', editable: true, text: 'خشم' },    isCorrect: false, type: 'choice' },
    { id: 'q-083-d', questionId: 'q-083', part: 2, text: { textId: 'q-083-d-text', editable: true, text: 'افتخار' }, isCorrect: false, type: 'choice' }
    
  ];
/* ============================================================
   *  SLIDES — Each PDF page = one slide
   * ============================================================ */

  var slides = [
    /* ═══ Slide 0 — child-info ═══ */
    { index: 0, part: 0, type: 'child-info', stationId: null,
      title: { textId: 'slide-0-title', editable: true, text: 'به سفینه احساسات خوش آمدی!' },
      body:  { textId: 'slide-0-body',  editable: true, text: 'قبل از شروع سفر فضایی، اسمت و سنت رو بهم بگو تا بهتر آشنا بشیم.' },
      ttsText: 'به سفینه احساسات خوش آمدی! اسمت رو بگو.',
      emotion: null, questionId: null, storyId: null, dialogueRef: 'child-info' },

    /* ═══════════════════════════════════════ */
    /* ═══ Part 1 (PDF 2) — 23 pages ═══ */
    /* ═══════════════════════════════════════ */

    /* Page 1 — Station 1 intro */
    { index: 1, part: 1, type: 'station-intro', stationId: 1,
      title: { textId: 'slide-1-title', editable: true, text: 'ایستگاه اول' },
      body:  { textId: 'slide-1-body',  editable: true, text: 'سلام آدم زمینی باهوش! کمکم می‌کنی؟ من برای سفینه‌ام باید یک فهرست از احساسات و هیجان‌های آدم‌ها درست کنم، ولی اسم هیچ‌کدوم رو نمی‌دونم. تو می‌تونی اسم هیجان‌های آدم‌ها را به من یاد بدی؟ هر چندتا که بلدی بگو.' },
      ttsText: 'سلام آدم زمینی باهوش! کمکم می‌کنی؟', emotion: null, questionId: null, storyId: null, dialogueRef: 'p1-station1' },

    /* Page 2 — Station 2 intro */
    { index: 2, part: 1, type: 'station-intro', stationId: 2,
      title: { textId: 'slide-2-title', editable: true, text: 'ایستگاه دوم' },
      body:  { textId: 'slide-2-body',  editable: true, text: 'آفرین! تو تا اینجا خیلی به من کمک کردی. دارم کم‌کم هیجان‌ها را یاد می‌گیرم، ولی هنوز همه‌چیز را نمی‌فهمم. حالا می‌خواهم چند داستان برایت بفرستم تا بخوانی. در این داستان‌ها، برای بچه‌هایی مثل خودت اتفاق‌های مختلفی می‌افتد و آنها احساس‌ها و هیجان‌های گوناگونی پیدا می‌کنند. من می‌خواهم از تو یاد بگیرم که هرکدام چه احساسی دارند. پس داستان‌ها را با دقت بخوان. بعد از هر داستان، چند سؤال از تو می‌پرسم تا به من کمک کنی بهتر یاد بگیرم.' },
      ttsText: 'آفرین! تو تا اینجا خیلی به من کمک کردی.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p1-station2' },

    /* Page 3 — Story 1 + Questions */
    { index: 3, part: 1, type: 'story-slide', stationId: 2,
      title: { textId: 'slide-3-title', editable: true, text: 'داستان ۱: نقاشی روی دیوار کلاس' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 1, dialogueRef: 'p1-story1',
      questionIds: ['q-001', 'q-002', 'q-003', 'q-004'] },

    /* Page 4 — Story 2 + Questions */
    { index: 4, part: 1, type: 'story-slide', stationId: 2,
      title: { textId: 'slide-4-title', editable: true, text: 'داستان ۲: صندلی خالی' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 2, dialogueRef: 'p1-story2',
      questionIds: ['q-005', 'q-006', 'q-007', 'q-008'] },

    /* Page 5 — Story 3 + Questions */
    { index: 5, part: 1, type: 'story-slide', stationId: 2,
      title: { textId: 'slide-5-title', editable: true, text: 'داستان ۳: بسته روی میز' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 3, dialogueRef: 'p1-story3',
      questionIds: ['q-009', 'q-010', 'q-011', 'q-012'] },

    /* Page 6 — Story 4 + Questions */
    { index: 6, part: 1, type: 'story-slide', stationId: 2,
      title: { textId: 'slide-6-title', editable: true, text: 'داستان ۴: چراغ‌ها خاموش شد' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 4, dialogueRef: 'p1-story4',
      questionIds: ['q-013', 'q-014', 'q-015', 'q-016'] },

    /* Page 7 — Story 5 + Questions */
    { index: 7, part: 1, type: 'story-slide', stationId: 2,
      title: { textId: 'slide-7-title', editable: true, text: 'داستان ۵: نوبت من بود' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 5, dialogueRef: 'p1-story5',
      questionIds: ['q-017', 'q-018', 'q-019', 'q-020'] },

    /* Page 8 — Station 3 intro */
    { index: 8, part: 1, type: 'station-intro', stationId: 3,
      title: { textId: 'slide-8-title', editable: true, text: 'ایستگاه سوم' },
      body:  { textId: 'slide-8-body',  editable: true, text: 'وای، من دارم چیزهای زیادی درباره هیجان‌های آدم‌ها از تو یاد می‌گیرم! اما یک چیز هنوز برایم خیلی عجیب است. گاهی وقت‌ها آدم‌ها احساسی را که واقعاً دارند نشان نمی‌دهند. یعنی در دلشان یک احساس دارند، اما بیرون چیز دیگری می‌گویند یا نشان می‌دهند. من هنوز خوب نمی‌فهمم در این موقعیت‌ها واقعاً چه احساسی در دلشان هست. کمکم کن یاد بگیرم. من چند داستان کوتاه برایت می‌گویم. در هر داستان، ممکن است یکی از شخصیت‌ها احساس واقعی‌اش را پنهان کرده باشد. بعد هر داستان، از بین گزینه‌هایی که نشان داده می‌شود، گزینه‌ای که احساس واقعی او را نشان می‌دهد، انتخاب کن. آماده‌ای؟ پس برویم سراغ داستان اول.' },
      ttsText: 'ایستگاه سوم. گاهی آدم‌ها احساس واقعی‌شان را پنهان می‌کنند.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p1-station3' },

    /* Page 9 — Story 6 + Questions */
    { index: 9, part: 1, type: 'story-slide', stationId: 3,
      title: { textId: 'slide-9-title', editable: true, text: 'داستان ۱: سارا و کاردستی' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 6, dialogueRef: 'p1-story6',
      questionIds: ['q-021', 'q-022'] },

    /* Page 10 — Story 7 + Questions */
    { index: 10, part: 1, type: 'story-slide', stationId: 3,
      title: { textId: 'slide-10-title', editable: true, text: 'داستان ۲: خرگوش و هویج' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 7, dialogueRef: 'p1-story7',
      questionIds: ['q-023', 'q-024'] },

    /* Page 11 — Story 8 + Questions */
    { index: 11, part: 1, type: 'story-slide', stationId: 3,
      title: { textId: 'slide-11-title', editable: true, text: 'داستان ۳: دو گلدان کنار پنجره' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 8, dialogueRef: 'p1-story8',
      questionIds: ['q-025', 'q-026'] },

    /* Page 12 — Story 9 + Questions */
    { index: 12, part: 1, type: 'story-slide', stationId: 3,
      title: { textId: 'slide-12-title', editable: true, text: 'داستان ۴: علی و تیم فوتبال' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 9, dialogueRef: 'p1-story9',
      questionIds: ['q-027', 'q-028'] },

    /* Page 13 — Story 10 + Questions */
    { index: 13, part: 1, type: 'story-slide', stationId: 3,
      title: { textId: 'slide-13-title', editable: true, text: 'داستان ۵: توله‌سگ و اسباب‌بازی' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 10, dialogueRef: 'p1-story10',
      questionIds: ['q-029', 'q-030'] },

    /* Page 14 — Story 11 + Questions */
    { index: 14, part: 1, type: 'story-slide', stationId: 3,
      title: { textId: 'slide-14-title', editable: true, text: 'داستان ۶: دو درخت در باغ' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 11, dialogueRef: 'p1-story11',
      questionIds: ['q-031', 'q-032'] },

    /* Page 15 — Station 4 intro */
    { index: 15, part: 1, type: 'station-intro', stationId: 4,
      title: { textId: 'slide-15-title', editable: true, text: 'ایستگاه چهارم' },
      body:  { textId: 'slide-15-body',  editable: true, text: 'تا اینجا به من چیزهای زیادی یاد دادی. ازت ممنونم. اما یک چیز تازۀ دیگر هم هست که می‌خواهم مطمئن شوم آن را درست فهمیده‌ام. گاهی آدم‌ها در یک زمان فقط یک احساس ندارند؛ ممکن است دو احساس مختلف داشته باشند. اما تشخیص دادن این احساس‌ها برای من هنوز سخت است. می‌شود کمکم کنی؟ من چند داستان کوتاه برایت می‌گویم. بعد از هر داستان چند احساس به تو نشان می‌دهم و تو باید دو احساسی را انتخاب کنی که فکر می‌کنی شخصیت داستان آن دو تا احساس را با هم داشته است. آماده‌ای؟ بزن بریم...' },
      ttsText: 'ایستگاه چهارم. گاهی آدم‌ها همزمان دو احساس دارند.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p1-station4' },

    /* Page 16 — Story 12 + Question */
    { index: 16, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-16-title', editable: true, text: 'داستان ۱: اجرای شعر جلوی کلاس' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 12, dialogueRef: 'p1-story12',
      questionIds: ['q-033'] },

    /* Page 17 — Story 13 + Question */
    { index: 17, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-17-title', editable: true, text: 'داستان ۲: توله‌سگ در حیاط' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 13, dialogueRef: 'p1-story13',
      questionIds: ['q-034'] },

    /* Page 18 — Story 14 + Question */
    { index: 18, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-18-title', editable: true, text: 'داستان ۳: نهال تازه کاشته‌شده' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 14, dialogueRef: 'p1-story14',
      questionIds: ['q-035'] },

    /* Page 19 — Story 15 + Question */
    { index: 19, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-19-title', editable: true, text: 'داستان ۴: خداحافظی با دوست' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 15, dialogueRef: 'p1-story15',
      questionIds: ['q-036'] },

    /* Page 20 — Story 16 + Question */
    { index: 20, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-20-title', editable: true, text: 'داستان ۵: پرنده و اولین پرواز' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 16, dialogueRef: 'p1-story16',
      questionIds: ['q-037'] },

    /* Page 21 — Story 17 + Question */
    { index: 21, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-21-title', editable: true, text: 'داستان ۶: درخت و پاییز' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 17, dialogueRef: 'p1-story17',
      questionIds: ['q-038'] },

    /* Page 22 — Story 18 + Question */
    { index: 22, part: 1, type: 'story-slide', stationId: 4,
      title: { textId: 'slide-22-title', editable: true, text: 'داستان ۷: مسابقه نامه‌نگاری' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 18, dialogueRef: 'p1-story18',
      questionIds: ['q-039'] },

    /* Page 23 — Farewell Part 1 */
    { index: 23, part: 1, type: 'farewell', stationId: null,
      title: { textId: 'slide-23-title', editable: true, text: 'خداحافظ!' },
      body:  { textId: 'slide-23-body',  editable: true, text: 'چه سفر هیجان‌انگیزی داشتیم! با کمک تو، من چیزهای زیادی درباره احساس‌های آدم‌ها یاد گرفتم. ممنون که کنارم بودی. تا ماجرای بعدی، خداحافظ دوست زمینی من!' },
      ttsText: 'چه سفر هیجان‌انگیزی داشتیم! خداحافظ دوست زمینی من!', emotion: null, questionId: null, storyId: null, dialogueRef: 'p1-farewell' },

    /* ═══════════════════════════════════════ */
    /* ═══ Part 2 (PDF 1) — 23 pages ═══ */
    /* ═══════════════════════════════════════ */

    /* Page 1 — Station 1 intro (Part 2) */
    { index: 24, part: 2, type: 'station-intro', stationId: 5,
      title: { textId: 'slide-24-title', editable: true, text: 'ایستگاه اول (بخش دوم)' },
      body:  { textId: 'slide-24-body',  editable: true, text: 'سلام دوست من! دوباره از راه دور آمده‌ام تا از تو کمک بگیرم. تو قبلاً خیلی خوب بهم کمک کردی. اما می‌دانی من چون از یک سیارۀ دیگر آمده‌ام، چیزهای مربوط به شما زمینی‌ها خیلی زود از یادم می‌رود. دیشب از سیاره‌ام به زمین آمدم تا دوباره از تو کمک بگیرم. می‌شود اسم هیجان‌هایی را که آدم‌ها دارند برایم بگویی؟ هر چندتا که بلدی بگو.' },
      ttsText: 'سلام دوست من! دوباره از راه دور آمده‌ام.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p2-station1' },

    /* Page 2 — Station 2 intro (Part 2) */
    { index: 25, part: 2, type: 'station-intro', stationId: 6,
      title: { textId: 'slide-25-title', editable: true, text: 'ایستگاه دوم (بخش دوم)' },
      body:  { textId: 'slide-25-body',  editable: true, text: 'بارِ قبل تو کلی به من کمک کردی تا احساس‌های آدم‌ها را بهتر بفهمم. اما راستش را بخواهی، فکر می‌کنم بعضی چیزها را هنوز کامل یاد نگرفته‌ام. می‌خواهم چند داستان دیگر هم برایت بفرستم. در این داستان‌ها برای بچه‌هایی مثل خودت اتفاق‌هایی می‌افتد و آن‌ها احساس‌های مختلفی پیدا می‌کنند. من دوباره از تو کمک می‌خواهم تا بفهمم هرکدام چه احساسی دارند. پس داستان‌ها را با دقت بخوان. بعد از هر داستان چند سؤال از تو می‌پرسم تا باز هم یک چیز جدید یاد بگیرم.' },
      ttsText: 'بار قبل تو کلی به من کمک کردی.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p2-station2' },

    /* Page 3 — Story 19 + Questions */
    { index: 26, part: 2, type: 'story-slide', stationId: 6,
      title: { textId: 'slide-26-title', editable: true, text: 'داستان ۱: اسمم را گفت' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 19, dialogueRef: 'p2-story19',
      questionIds: ['q-040', 'q-041', 'q-042', 'q-043', 'q-044'] },

    /* Page 4 — Story 20 + Questions */
    { index: 27, part: 2, type: 'story-slide', stationId: 6,
      title: { textId: 'slide-27-title', editable: true, text: 'داستان ۲: بازی بدون من' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 20, dialogueRef: 'p2-story20',
      questionIds: ['q-045', 'q-046', 'q-047', 'q-048', 'q-049'] },

    /* Page 5 — Story 21 + Questions */
    { index: 28, part: 2, type: 'story-slide', stationId: 6,
      title: { textId: 'slide-28-title', editable: true, text: 'داستان ۳: معلم جدید' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 21, dialogueRef: 'p2-story21',
      questionIds: ['q-050', 'q-051', 'q-052', 'q-053', 'q-054'] },

    /* Page 6 — Story 22 + Questions */
    { index: 29, part: 2, type: 'story-slide', stationId: 6,
      title: { textId: 'slide-29-title', editable: true, text: 'داستان ۴: در بسته شد' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 22, dialogueRef: 'p2-story22',
      questionIds: ['q-055', 'q-056', 'q-057', 'q-058', 'q-059'] },

    /* Page 7 — Story 23 + Questions */
    { index: 30, part: 2, type: 'story-slide', stationId: 6,
      title: { textId: 'slide-30-title', editable: true, text: 'داستان ۵: نوبت حرف زدن' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 23, dialogueRef: 'p2-story23',
      questionIds: ['q-060', 'q-061', 'q-062', 'q-063', 'q-064'] },

    /* Page 8 — Station 3 intro (Part 2) */
    { index: 31, part: 2, type: 'station-intro', stationId: 7,
      title: { textId: 'slide-31-title', editable: true, text: 'ایستگاه سوم (بخش دوم)' },
      body:  { textId: 'slide-31-body',  editable: true, text: 'گیرم اما هنوز یک بخش هست که برای من خیلی عجیب و سخت است. من فهمیده‌ام که آدم‌ها گاهی یک احساسی دارند، اما یک جورِ دیگر نشان می‌دهند! مثلاً ممکن است چیزی بگویند یا لبخند بزنند، ولی در دلشان یک احساسِ دیگر داشته باشند. این هنوز برای من خیلی گیج‌کننده است! می‌توانی دوباره به من کمک کنی؟ من چند داستان کوتاه برایت می‌فرستم. در هر داستان، یک شخصیت چیزی می‌گوید یا کاری می‌کند؛ من می‌خواهم تو به من بگویی در دل او واقعاً چه احساسی می‌گذرد. بعد هر داستان، از بین گزینه‌هایی که نشان داده می‌شود، گزینه‌ای که احساس واقعی او را نشان می‌دهد، انتخاب کن. آماده‌ای؟ پس برویم سراغ داستان اول.' },
      ttsText: 'ایستگاه سوم. آدم‌ها گاهی احساس واقعی‌شان را پنهان می‌کنند.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p2-station3' },

    /* Page 9 — Story 24 + Questions */
    { index: 32, part: 2, type: 'story-slide', stationId: 7,
      title: { textId: 'slide-32-title', editable: true, text: 'داستان ۱: مینا و نقاشی' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 24, dialogueRef: 'p2-story24',
      questionIds: ['q-065', 'q-066'] },

    /* Page 10 — Story 25 + Questions */
    { index: 33, part: 2, type: 'story-slide', stationId: 7,
      title: { textId: 'slide-33-title', editable: true, text: 'داستان ۲: جوجه‌تیغی کوچولو' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 25, dialogueRef: 'p2-story25',
      questionIds: ['q-067', 'q-068'] },

    /* Page 11 — Story 26 + Questions */
    { index: 34, part: 2, type: 'story-slide', stationId: 7,
      title: { textId: 'slide-34-title', editable: true, text: 'داستان ۳: دو گلدان روی طاقچه' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 26, dialogueRef: 'p2-story26',
      questionIds: ['q-069', 'q-070'] },

    /* Page 12 — Story 27 + Questions */
    { index: 35, part: 2, type: 'story-slide', stationId: 7,
      title: { textId: 'slide-35-title', editable: true, text: 'داستان ۴: امیر و تولد دوستش' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 27, dialogueRef: 'p2-story27',
      questionIds: ['q-071', 'q-072'] },

    /* Page 13 — Story 28 + Questions */
    { index: 36, part: 2, type: 'story-slide', stationId: 7,
      title: { textId: 'slide-36-title', editable: true, text: 'داستان ۵: پشمک و پاپی' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 28, dialogueRef: 'p2-story28',
      questionIds: ['q-073', 'q-074'] },

    /* Page 14 — Story 29 + Questions */
    { index: 37, part: 2, type: 'story-slide', stationId: 7,
      title: { textId: 'slide-37-title', editable: true, text: 'داستان ۶: دو درخت در پارک' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 29, dialogueRef: 'p2-story29',
      questionIds: ['q-075', 'q-076'] },

    /* Page 15 — Station 4 intro (Part 2) */
    { index: 38, part: 2, type: 'station-intro', stationId: 8,
      title: { textId: 'slide-38-title', editable: true, text: 'ایستگاه چهارم (بخش دوم)' },
      body:  { textId: 'slide-38-body',  editable: true, text: 'دوست زمینی عزیزم؛ تو تا اینجا به من خیلی کمک کردی. از تو واقعاً ممنونم. فقط یک چیز دیگر هم هست که می‌خواهم مطمئن شوم آن را درست فهمیده‌ام. گاهی برای آدم‌ها اتفاقی می‌افتد و آن‌ها فقط یک احساس ندارند؛ ممکن است در یک زمان چند احساس مختلف داشته باشند. حالا می‌خواهم چند داستان کوتاه دیگر برایت بفرستم. بعد از هر داستان، از تو می‌پرسم چه احساس‌هایی ممکن است با هم در دلِ شخصیت داستان باشد. این آخرین بخش است. آماده‌ای یک بار دیگر به من کمک کنی؟' },
      ttsText: 'ایستگاه چهارم. گاهی آدم‌ها همزمان چند احساس دارند.', emotion: null, questionId: null, storyId: null, dialogueRef: 'p2-station4' },

    /* Page 16 — Story 30 + Question */
    { index: 39, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-39-title', editable: true, text: 'داستان ۱: اولین روز مدرسه جدید' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 30, dialogueRef: 'p2-story30',
      questionIds: ['q-077'] },

    /* Page 17 — Story 31 + Question */
    { index: 40, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-40-title', editable: true, text: 'داستان ۲: بچه‌گربه و دنیای بیرون' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 31, dialogueRef: 'p2-story31',
      questionIds: ['q-078'] },

    /* Page 18 — Story 32 + Question */
    { index: 41, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-41-title', editable: true, text: 'داستان ۳: گلدان در دفتر مدرسه' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 32, dialogueRef: 'p2-story32',
      questionIds: ['q-079'] },

    /* Page 19 — Story 33 + Question */
    { index: 42, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-42-title', editable: true, text: 'داستان ۴: دعوت تولد بعد از دعوا' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 33, dialogueRef: 'p2-story33',
      questionIds: ['q-080'] },

    /* Page 20 — Story 34 + Question */
    { index: 43, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-43-title', editable: true, text: 'داستان ۵: اسب و بار سنگین' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 34, dialogueRef: 'p2-story34',
      questionIds: ['q-081'] },

    /* Page 21 — Story 35 + Question */
    { index: 44, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-44-title', editable: true, text: 'داستان ۶: درخت و باغبان' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 35, dialogueRef: 'p2-story35',
      questionIds: ['q-082'] },

    /* Page 22 — Story 36 + Question */
    { index: 45, part: 2, type: 'story-slide', stationId: 8,
      title: { textId: 'slide-45-title', editable: true, text: 'داستان ۷: مسابقه نقاشی و صندلی خالی' },
      body: null, ttsText: null, emotion: null, questionId: null, storyId: 36, dialogueRef: 'p2-story36',
      questionIds: ['q-083'] },

    /* Page 23 — Farewell Part 2 */
    { index: 46, part: 2, type: 'farewell', stationId: null,
      title: { textId: 'slide-46-title', editable: true, text: 'خداحافظ!' },
      body:  { textId: 'slide-46-body',  editable: true, text: 'دوست زمینی من! تو امروز خیلی به من کمک کردی تا درباره احساس‌های آدم‌ها چیزهای زیادی یاد بگیرم. ممنون که در این ماجراجویی کنارم بودی و به سؤال‌هایم جواب دادی. من حالا چیزهای تازۀ زیادی می‌دانم! فعلاً خداحافظ دوست زمینی من. شاید یک روز دوباره از تو کمک بگیرم.' },
      ttsText: 'دوست زمینی من! ممنون که کنارم بودی. خداحافظ!', emotion: null, questionId: null, storyId: null, dialogueRef: 'p2-farewell' }
  ];

  /* ============================================================
   *  RETURN
   * ============================================================ */

  return {
    settings : settings,
    stations : stations,
    emotions : emotions,
    stories  : stories,
    questions: questions,
    options  : options,
    slides   : slides
  };

})();