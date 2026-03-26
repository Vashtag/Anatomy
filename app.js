/* =========================
   App State
========================= */
const $ = (id)=>document.getElementById(id);

const card = $("card");
const coverImg = $("coverImg");
const coverTitle = $("coverTitle");
const coverSub = $("coverSub");

const qLab = $("qLab");
const qText = $("qText");
const choicesEl = $("choices");
const feedbackEl = $("feedback");

const modePill = $("modePill");
const labPill = $("labPill");
const progressPill = $("progressPill");
const timerPill = $("timerPill");

const settingsModalBack = $("settingsModalBack");
const helpModalBack = $("helpModalBack");
const resultsModalBack = $("resultsModalBack");

const labsList = $("labsList");

const examFields = $("examFields");
const examCount = $("examCount");
const examTime = $("examTime");

const sessionCount = $("sessionCount");
const remember = $("remember");

const resetBtn = $("resetBtn");
const startBtn = $("startBtn");

const flipBtn = $("flipBtn");
const revealBtn = $("revealBtn");
const submitBtn = $("submitBtn");
const nextBtn = $("nextBtn");

let state = {
  selectedLabs: [1,2,3,4,5,6],
  mode: "learn", // learn | test | exam | blank | match
  sessionN: 30,
  remember: true,

  queue: [],
  idx: 0,
  flipped: false,

  selectedChoice: null,
  submitted: false,
  revealed: false,

  streak: 0,
  bestStreak: 0,
  hintsUsed: 0,
  soundOn: true,

  // Matching mode
  matchSet: null, // {prompts:[], answers:[], shuffledAnswers:[], links:{}, selectedPrompt:null, submitted:false}

  exam: {
    active: false,
    n: 20,
    timeMin: 0,
    startTs: 0,
    endTs: 0,
    timerId: null,
    answers: [] // {q, pickedIndex, correctIndex, correctText, pickedText, isCorrect}
  }
};

function savePrefs(){
  if(!state.remember) return;
  const prefs = {
    selectedLabs: state.selectedLabs,
    mode: state.mode,
    sessionN: state.sessionN,
    examN: state.exam.n,
    examTimeMin: state.exam.timeMin
  };
  localStorage.setItem("kin100_flashcards_prefs", JSON.stringify(prefs));
}
function loadPrefs(){
  try{
    const raw = localStorage.getItem("kin100_flashcards_prefs");
    if(!raw) return;
    const prefs = JSON.parse(raw);
    if(Array.isArray(prefs.selectedLabs) && prefs.selectedLabs.length) state.selectedLabs = prefs.selectedLabs;
    if(["learn","test","exam","blank","match"].includes(prefs.mode)) state.mode = prefs.mode;
    if(typeof prefs.sessionN === "number") state.sessionN = prefs.sessionN;
    if(typeof prefs.examN === "number") state.exam.n = prefs.examN;
    if(typeof prefs.examTimeMin === "number") state.exam.timeMin = prefs.examTimeMin;
  }catch(e){}
}

function labLabel(ids){
  if(!ids || !ids.length) return "—";
  const sorted = [...ids].sort((a,b)=>a-b);
  if(sorted.length===LABS.length) return "All";
  // compress ranges (e.g., 1–6, 8–10)
  let out = [];
  let start = sorted[0], prev = sorted[0];
  for(let i=1;i<sorted.length;i++){
    const cur = sorted[i];
    if(cur===prev+1){ prev=cur; continue; }
    out.push(start===prev ? `${start}` : `${start}–${prev}`);
    start=prev=cur;
  }
  out.push(start===prev ? `${start}` : `${start}–${prev}`);
  return out.join(", ");
}

function setPills(){
  modePill.textContent = `Mode: ${state.mode.toUpperCase()}`;
  const isLecture = (LABS === LABS_LECTURE);
  labPill.textContent = `${isLecture ? "Topics" : "Labs"}: ${labLabel(state.selectedLabs)}`;
  progressPill.textContent = `${Math.min(state.idx+1, state.queue.length)} / ${state.queue.length}`;
  timerPill.style.display = state.mode==="exam" ? "inline-flex" : "none";
}

function openSettings(){
  settingsModalBack.classList.add("show");
}
function closeSettings(){
  settingsModalBack.classList.remove("show");
}
function openHelp(){
  helpModalBack.classList.add("show");
}
function closeHelp(){
  helpModalBack.classList.remove("show");
}
function openResults(){
  resultsModalBack.classList.add("show");
}
function closeResults(){
  resultsModalBack.classList.remove("show");
}

function flip(toQuestion){
  if(typeof toQuestion === "boolean"){
    state.flipped = toQuestion;
  }else{
    state.flipped = !state.flipped;
  }
  card.classList.toggle("flipped", state.flipped);
}

function randItem(arr){
  if(!arr || !arr.length) return null;
  return arr[Math.floor(Math.random()*arr.length)];
}

function setCoverForLab(labId){
  const lab = LABS.find(l=>l.id===labId);
  coverTitle.textContent = lab ? `${lab.name}: ${lab.topic}` : "KIN100 Flashcards";
  coverSub.textContent = state.mode==="exam"
    ? "Exam mode: no feedback until the end."
    : state.mode==="test"
      ? "Test mode: select an option, then submit."
      : "Learn mode: reveal or submit at your pace.";

  const src = randItem(LAB_IMAGES[labId]) || "";
  if(!src){
    coverImg.removeAttribute("src");
    coverImg.style.display = "none";
    return;
  }
  coverImg.style.display = "block";
  coverImg.src = src;
  coverImg.onerror = () => {
    coverImg.style.display = "none";
  };
  coverImg.onload = () => {
    coverImg.style.display = "block";
  };
}

function parseQuestionsForLab(labId){
  const raw = QUESTION_DATA[labId];
  if(!raw) return [];
  return raw.split("\n").map(line=>{
    const parts = line.split("\t");
    if(parts.length < 2) return null;
    const prompt = parts[0].trim();
    // Fill-in-the-blank: prompt<TAB>FILL<TAB>answer
    if(parts[1].trim().toUpperCase() === "FILL"){
      const answer = (parts[2] || "").trim();
      return {labId, prompt, type:"fill", choices:[answer,"","",""], correctIndex:0, explanation:""};
    }
    if(parts.length < 6) return null;
    const choices = parts.slice(1,5).map(s=>s.trim());
    const correctLetter = parts[5].trim().toUpperCase();
    const correctIndex = ["A","B","C","D"].indexOf(correctLetter);
    const explanation = (parts[6] || "").trim();
    return {labId, prompt, choices, correctIndex, explanation};
  }).filter(Boolean);
}

function shuffleInPlace(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function makeShuffledQuestion(q){
  // shuffle choices while preserving correct
  const indexed = q.choices.map((text, i)=>({text, i}));
  shuffleInPlace(indexed);
  const newChoices = indexed.map(x=>x.text);
  const newCorrect = indexed.findIndex(x=>x.i===q.correctIndex);
  return {
    ...q,
    choices: newChoices,
    correctIndex: newCorrect,
    explanation: q.explanation
  };
}

/* =========================
   Sound Effects (Web Audio API)
========================= */
let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, dur, type, vol){
  if(!state.soundOn) return;
  try{
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }catch(e){}
}
function sfxCorrect(){
  playTone(523, 0.12, "sine", 0.15);
  setTimeout(()=>playTone(659, 0.12, "sine", 0.15), 80);
  setTimeout(()=>playTone(784, 0.18, "sine", 0.12), 160);
}
function sfxWrong(){
  playTone(200, 0.2, "square", 0.08);
  setTimeout(()=>playTone(160, 0.3, "square", 0.06), 150);
}
function sfxHint(){
  playTone(440, 0.08, "triangle", 0.1);
}
function sfxMatch(){
  playTone(600, 0.1, "sine", 0.1);
}

/* =========================
   Streak Display
========================= */
const streakPill = $("streakPill");
const streakNum = $("streakNum");

function updateStreak(correct){
  if(correct){
    state.streak++;
    if(state.streak > state.bestStreak) state.bestStreak = state.streak;
  } else {
    state.streak = 0;
  }
  renderStreak();
}
function renderStreak(){
  streakPill.style.display = (state.streak > 0) ? "inline-flex" : "none";
  streakNum.textContent = state.streak;
  streakPill.classList.remove("hot","blazing","pop");
  if(state.streak >= 10) streakPill.classList.add("blazing");
  else if(state.streak >= 5) streakPill.classList.add("hot");
  if(state.streak > 0){
    // trigger pop animation
    void streakPill.offsetWidth; // reflow
    streakPill.classList.add("pop");
  }
}

/* =========================
   Hint System
========================= */
function giveHint(){
  if(state.submitted || state.revealed) return;
  const q = state.queue[state.idx];
  if(!q) return;
  if(state.mode === "exam" || state.mode === "blank" || state.mode === "match") return;

  const choiceEls = [...choicesEl.querySelectorAll(".choice")];
  // find wrong choices that haven't been eliminated yet
  const available = choiceEls.filter(el => {
    const idx = Number(el.dataset.index);
    return idx !== q.correctIndex && !el.classList.contains("eliminated");
  });
  if(available.length <= 1) return; // keep at least one wrong + the correct

  // eliminate one random wrong choice
  const target = available[Math.floor(Math.random() * available.length)];
  target.classList.add("eliminated");
  state.hintsUsed++;
  sfxHint();
}

/* =========================
   Fill-in-the-Blank Mode
========================= */
function fuzzyMatch(input, answer){
  // Normalize both strings
  const normalize = s => s.toLowerCase().trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
  const a = normalize(input);
  const b = normalize(answer);
  if(!a) return {match: false, similarity: 0};
  if(a === b) return {match: true, similarity: 100};
  // Check if input is a substantial substring of the answer or vice-versa
  if(b.includes(a) && a.length >= b.length * 0.6) return {match: true, similarity: 90};
  if(a.includes(b)) return {match: true, similarity: 90};
  // Levenshtein distance
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, ()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++) dp[i][0]=i;
  for(let j=0;j<=n;j++) dp[0][j]=j;
  for(let i=1;i<=m;i++){
    for(let j=1;j<=n;j++){
      dp[i][j] = Math.min(
        dp[i-1][j]+1,
        dp[i][j-1]+1,
        dp[i-1][j-1] + (a[i-1]===b[j-1] ? 0 : 1)
      );
    }
  }
  const dist = dp[m][n];
  const maxLen = Math.max(m,n);
  const similarity = Math.round((1 - dist/maxLen)*100);
  // Accept if similarity >= 75%
  return {match: similarity >= 75, similarity};
}

function renderBlankMode(q){
  choicesEl.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "blank-input-wrap";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "blank-input";
  input.placeholder = "Type your answer...";
  input.id = "blankInput";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      e.stopPropagation();
      if(state.submitted) nextQuestion();
      else submitBlank();
    }
  });
  wrap.appendChild(input);
  choicesEl.appendChild(wrap);
  // Focus after flip animation
  setTimeout(()=>input.focus(), 600);
}

function submitBlank(){
  const q = state.queue[state.idx];
  if(!q) return;
  const input = $("blankInput");
  if(!input) return;
  const typed = input.value.trim();
  if(!typed){
    feedbackEl.className = "feedback show warn";
    feedbackEl.textContent = "Type an answer first.";
    return;
  }
  state.submitted = true;
  const correctText = q.choices[q.correctIndex];
  const result = fuzzyMatch(typed, correctText);
  input.disabled = true;

  // In exam mode, record the answer and show minimal feedback
  if(state.mode === "exam"){
    state.exam.answers[state.idx] = {
      q,
      pickedIndex: null,
      correctIndex: q.correctIndex,
      pickedText: typed,
      correctText,
      isCorrect: result.match
    };
    feedbackEl.className = "feedback show";
    feedbackEl.textContent = "Answer recorded. (Exam mode: feedback shown at the end.)";
    return;
  }

  if(result.match){
    input.classList.add("correct-input");
    feedbackEl.className = "feedback show good";
    const simBadge = result.similarity < 100
      ? ` <span class="similarity-badge">${result.similarity}% match</span>` : "";
    feedbackEl.innerHTML = `Correct!${simBadge}`
      + (q.explanation ? `<div class="explanation"><strong>Why?</strong> ${escapeHtml(q.explanation)}</div>` : "");
    updateStreak(true);
    sfxCorrect();
  } else {
    input.classList.add("wrong-input");
    feedbackEl.className = "feedback show bad";
    const simBadge = result.similarity > 0
      ? ` <span class="similarity-badge">${result.similarity}% match</span>` : "";
    feedbackEl.innerHTML = `Incorrect.${simBadge} Correct answer: "${escapeHtml(correctText)}".`
      + (q.explanation ? `<div class="explanation"><strong>Why?</strong> ${escapeHtml(q.explanation)}</div>` : "");
    updateStreak(false);
    sfxWrong();
  }
}

/* =========================
   Matching Mode
========================= */
function startMatchRound(){
  const pool = state.queue;
  if(pool.length < 5){
    feedbackEl.className = "feedback show warn";
    feedbackEl.textContent = "Need at least 5 questions for matching mode.";
    return;
  }

  // Pick 5 questions starting from current index
  const start = state.idx;
  const items = [];
  for(let i=0;i<5 && (start+i)<pool.length;i++){
    items.push(pool[start+i]);
  }
  if(items.length < 5){
    // wrap around
    for(let i=0;items.length<5 && i<pool.length;i++){
      if(!items.includes(pool[i])) items.push(pool[i]);
    }
  }

  const prompts = items.map((q,i)=>({idx:i, text: q.prompt, answer: q.choices[q.correctIndex]}));
  const answers = prompts.map((p,i)=>({idx:i, text: p.answer}));
  const shuffledAnswers = [...answers];
  shuffleInPlace(shuffledAnswers);

  state.matchSet = {
    prompts,
    answers,
    shuffledAnswers,
    links: {}, // promptIdx -> answerIdx
    selectedPrompt: null,
    submitted: false,
    items
  };

  renderMatchMode();
}

function renderMatchMode(){
  const ms = state.matchSet;
  if(!ms) return;

  // Hide normal question header, repurpose qBody
  qLab.textContent = "Matching Mode";
  qText.textContent = "Tap a number, then tap its answer to link them.";

  choicesEl.innerHTML = "";
  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";

  const container = document.createElement("div");
  container.className = "match-container";

  ms.prompts.forEach((p, pi)=>{
    const row = document.createElement("div");
    row.className = "match-row";

    // Prompt side
    const promptEl = document.createElement("div");
    promptEl.className = "match-prompt";
    if(ms.selectedPrompt === pi) promptEl.style.borderColor = "rgba(105,179,255,.5)";
    promptEl.innerHTML = `<span class="match-num">${pi+1}</span>${escapeHtml(p.text)}`;
    promptEl.style.cursor = "pointer";
    promptEl.addEventListener("click", ()=>{
      if(ms.submitted) return;
      ms.selectedPrompt = pi;
      renderMatchMode();
    });

    // Connector
    const conn = document.createElement("div");
    conn.className = "match-connector" + (ms.links[pi] !== undefined ? " linked" : "");
    conn.textContent = ms.links[pi] !== undefined ? "\u2194" : "\u2022";

    // Answer side
    const ai = ms.shuffledAnswers[pi];
    const ansEl = document.createElement("div");
    ansEl.className = "match-answer";
    if(ms.submitted){
      // Check if this answer is correctly linked
      const linkedPrompt = Object.entries(ms.links).find(([k,v])=>v===pi);
      if(linkedPrompt){
        const pIdx = Number(linkedPrompt[0]);
        const isCorrect = ms.shuffledAnswers[pi].idx === pIdx;
        ansEl.classList.add(isCorrect ? "match-correct" : "match-wrong");
      }
    }
    // Show which prompt it's linked to
    const linkedBy = Object.entries(ms.links).find(([k,v])=>v===pi);
    const tag = linkedBy ? String(Number(linkedBy[0])+1) : "?";
    ansEl.innerHTML = `<span class="match-tag">${tag}</span>${escapeHtml(ai.text)}`;
    ansEl.addEventListener("click", ()=>{
      if(ms.submitted) return;
      if(ms.selectedPrompt === null){
        feedbackEl.className = "feedback show warn";
        feedbackEl.textContent = "Select a question number on the left first.";
        return;
      }
      // Link selectedPrompt to this answer slot
      // Remove any previous link to this answer slot
      Object.keys(ms.links).forEach(k=>{
        if(ms.links[k]===pi) delete ms.links[k];
      });
      ms.links[ms.selectedPrompt] = pi;
      ms.selectedPrompt = null;
      sfxMatch();
      renderMatchMode();
    });

    row.appendChild(promptEl);
    row.appendChild(conn);
    row.appendChild(ansEl);
    container.appendChild(row);
  });

  choicesEl.appendChild(container);

  // Show link count
  const linkCount = Object.keys(ms.links).length;
  if(linkCount > 0 && linkCount < 5 && !ms.submitted){
    feedbackEl.className = "feedback show";
    feedbackEl.textContent = `${linkCount}/5 paired. Link all 5, then submit.`;
  }
}

function submitMatch(){
  const ms = state.matchSet;
  if(!ms || ms.submitted) return;
  if(Object.keys(ms.links).length < 5){
    feedbackEl.className = "feedback show warn";
    feedbackEl.textContent = "Link all 5 pairs before submitting.";
    return;
  }
  ms.submitted = true;

  let correct = 0;
  for(let pi=0;pi<5;pi++){
    const ansSlot = ms.links[pi];
    if(ansSlot !== undefined && ms.shuffledAnswers[ansSlot].idx === pi) correct++;
  }

  const allCorrect = correct === 5;
  if(allCorrect) sfxCorrect(); else sfxWrong();
  for(let i=0;i<correct;i++) updateStreak(true);
  if(!allCorrect) updateStreak(false);

  feedbackEl.className = "feedback show " + (allCorrect ? "good" : "bad");
  feedbackEl.innerHTML = allCorrect
    ? "Perfect! All 5 matched correctly."
    : `${correct}/5 correct. Wrong pairs are highlighted in red.`;

  renderMatchMode();
}

function nextMatch(){
  state.idx = Math.min(state.idx + 5, state.queue.length - 1);
  if(state.idx >= state.queue.length - 5){
    shuffleInPlace(state.queue);
    state.idx = 0;
  }
  state.matchSet = null;
  state.submitted = false;
  startMatchRound();
  flip(true);
}

function buildPool(selectedLabs){
  let pool = [];
  if(LABS === LABS_LECTURE && typeof LECTURE_TOPIC_MAP !== "undefined"){
    // Lecture mode: map topic IDs → lecture IDs, deduplicating shared lectures
    const lectureIds = new Set();
    for(const topicId of selectedLabs){
      (LECTURE_TOPIC_MAP[topicId] || []).forEach(id => lectureIds.add(id));
    }
    for(const id of lectureIds) pool = pool.concat(parseQuestionsForLab(id));
  } else {
    for(const id of selectedLabs) pool = pool.concat(parseQuestionsForLab(id));
  }
  return pool;
}

function startSession(){
  // validate
  if(!state.selectedLabs.length){
    alert("Please select at least one lab.");
    return;
  }

  // clear exam timer
  if(state.exam.timerId) { clearInterval(state.exam.timerId); state.exam.timerId=null; }

  state.idx = 0;
  state.selectedChoice = null;
  state.submitted = false;
  state.revealed = false;
  state.streak = 0;
  state.bestStreak = 0;
  state.hintsUsed = 0;
  state.matchSet = null;
  state.exam.active = (state.mode==="exam");
  state.exam.answers = [];
  timerPill.textContent = "Time: —";
  renderStreak();

  const pool = buildPool(state.selectedLabs);
  if(!pool.length){
    alert("No questions found for selected labs.");
    return;
  }

  let desiredN;
  if(state.mode==="exam"){
    desiredN = Math.max(5, Math.min(Number(state.exam.n)||20, pool.length));
  }else{
    const sc = sessionCount.value;
    desiredN = (sc==="9999") ? pool.length : Math.min(Number(sc)||30, pool.length);
  }

  shuffleInPlace(pool);
  const chosen = pool.slice(0, desiredN).map(makeShuffledQuestion);

  state.queue = chosen;

  // set cover based on first question lab
  setCoverForLab(state.queue[0].labId);
  renderCurrent();
  flip(false);
  setPills();
  closeSettings();

  if(state.mode==="exam"){
    setupExamTimer();
  }
  if(state.mode==="match"){
    startMatchRound();
    flip(true);
  }
}

function setupExamTimer(){
  const minutes = Number(state.exam.timeMin)||0;
  if(minutes <= 0){
    timerPill.textContent = "Time: ∞";
    return;
  }
  state.exam.startTs = Date.now();
  state.exam.endTs = state.exam.startTs + minutes*60*1000;

  function tick(){
    const now = Date.now();
    const remaining = Math.max(0, state.exam.endTs - now);
    const mm = Math.floor(remaining/60000);
    const ss = Math.floor((remaining%60000)/1000);
    timerPill.textContent = `Time: ${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
    if(remaining<=0){
      clearInterval(state.exam.timerId);
      state.exam.timerId=null;
      finishExam(true);
    }
  }
  tick();
  state.exam.timerId = setInterval(tick, 250);
}

function renderCurrent(){
  const q = state.queue[state.idx];
  if(!q) return;

  const lab = LABS.find(l=>l.id===q.labId);
  qLab.textContent = lab ? `${lab.name}: ${lab.topic}` : `Lab ${q.labId}`;
  qText.textContent = q.prompt;

  // reset local question state
  state.selectedChoice = null;
  state.submitted = false;
  state.revealed = false;

  // buttons behavior per mode
  const isBlank = (state.mode==="blank");
  const isMatch = (state.mode==="match");
  const isFill = (q.type === "fill");
  revealBtn.style.display = (state.mode==="learn" && !isFill) ? "inline-block" : "none";
  $("hintBtn").style.display = (!isBlank && !isFill && !isMatch && state.mode!=="exam") ? "inline-block" : "none";
  submitBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";

  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("show","good","bad","warn");

  // cover image updates per question (keeps the "cue card cover" tied to lab)
  setCoverForLab(q.labId);

  // For matching mode, don't render normal choices
  if(isMatch) { setPills(); return; }

  // Fill-in-the-blank mode (either selected mode or fill-type question)
  if(isBlank || isFill){
    renderBlankMode(q);
    setPills();
    return;
  }

  // Normal multiple choice
  choicesEl.innerHTML = "";
  const letters = ["A","B","C","D"];
  q.choices.forEach((choiceText, i)=>{
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.setAttribute("role","button");
    btn.setAttribute("tabindex","0");
    btn.dataset.index = String(i);
    btn.innerHTML = `<strong>${letters[i]}</strong><div class="label">${escapeHtml(choiceText)}</div>`;
    btn.addEventListener("click", ()=>selectChoice(i));
    btn.addEventListener("keydown", (e)=>{
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        selectChoice(i);
      }
    });
    choicesEl.appendChild(btn);
  });

  setPills();
}

function escapeHtml(s){
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

function selectChoice(i){
  if(state.submitted && state.mode!=="learn") return; // lock after submit in test/exam
  state.selectedChoice = i;
  [...choicesEl.querySelectorAll(".choice")].forEach(el=>{
    el.classList.toggle("selected", Number(el.dataset.index)===i);
  });
}

function revealAnswer(){
  if(state.mode!=="learn") return;
  const q = state.queue[state.idx];
  if(!q) return;
  state.revealed = true;

  [...choicesEl.querySelectorAll(".choice")].forEach(el=>{
    const idx = Number(el.dataset.index);
    el.classList.remove("wrong","correct");
    if(idx === q.correctIndex) el.classList.add("correct");
  });

  feedbackEl.className = "feedback show warn";
  feedbackEl.innerHTML = `Reveal: Correct answer is "${escapeHtml(q.choices[q.correctIndex])}".`
    + (q.explanation ? `<div class="explanation"><strong>Why?</strong> ${escapeHtml(q.explanation)}</div>` : "");
}

function submitAnswer(){
  // Handle special modes / fill-type questions
  if(state.mode==="blank") return submitBlank();
  const _q = state.queue[state.idx];
  if(_q && _q.type === "fill") return submitBlank();
  if(state.mode==="match") return submitMatch();

  const q = state.queue[state.idx];
  if(!q) return;

  if(state.selectedChoice === null || state.selectedChoice === undefined){
    feedbackEl.className = "feedback show warn";
    feedbackEl.textContent = "Select an option first (keys 1–4 or tap), then press Submit / Enter.";
    return;
  }

  // Learn mode can show feedback immediately; Test mode shows correctness; Exam mode records only
  const isCorrect = (state.selectedChoice === q.correctIndex);

  if(state.mode==="exam"){
    state.submitted = true;
    // record
    const pickedText = q.choices[state.selectedChoice];
    const correctText = q.choices[q.correctIndex];
    state.exam.answers[state.idx] = {
      q,
      pickedIndex: state.selectedChoice,
      correctIndex: q.correctIndex,
      pickedText,
      correctText,
      isCorrect
    };
    // no feedback now
    feedbackEl.className = "feedback show";
    feedbackEl.textContent = "Answer recorded. (Exam mode: feedback shown at the end.)";
  }else{
    state.submitted = true;

    [...choicesEl.querySelectorAll(".choice")].forEach(el=>{
      const idx = Number(el.dataset.index);
      el.classList.remove("wrong","correct");
      if(idx === q.correctIndex) el.classList.add("correct");
      if(idx === state.selectedChoice && idx !== q.correctIndex) el.classList.add("wrong");
    });

    feedbackEl.className = "feedback show " + (isCorrect ? "good" : "bad");
    const base = isCorrect
      ? "Correct!"
      : `Incorrect. Correct answer: "${escapeHtml(q.choices[q.correctIndex])}".`;
    feedbackEl.innerHTML = base
      + (q.explanation ? `<div class="explanation"><strong>Why?</strong> ${escapeHtml(q.explanation)}</div>` : "");

    updateStreak(isCorrect);
    if(isCorrect) sfxCorrect(); else sfxWrong();
  }
}

function nextQuestion(){
  // Matching mode has its own next
  if(state.mode==="match"){
    if(state.matchSet && !state.matchSet.submitted){
      feedbackEl.className = "feedback show warn";
      feedbackEl.textContent = "Submit your matches first.";
      return;
    }
    nextMatch();
    return;
  }

  if(state.mode==="exam"){
    // In exam mode, require an answer before moving on
    const recorded = state.exam.answers[state.idx];
    if(!recorded){
      feedbackEl.className = "feedback show warn";
      feedbackEl.textContent = "Exam mode: submit an answer before moving on.";
      return;
    }
  }else if(state.mode==="test" || state.mode==="blank"){
    // Test/blank mode: require submit before moving on
    if(!state.submitted){
      feedbackEl.className = "feedback show warn";
      feedbackEl.textContent = "Submit your answer before moving on.";
      return;
    }
  }

  if(state.idx >= state.queue.length - 1){
    if(state.mode==="exam"){
      finishExam(false);
      return;
    }
    // loop by reshuffling
    shuffleInPlace(state.queue);
    state.idx = 0;
    renderCurrent();
    flip(false);
    return;
  }

  state.idx++;
  renderCurrent();
  flip(false);
}

function finishExam(forcedByTime){
  if(state.exam.timerId){ clearInterval(state.exam.timerId); state.exam.timerId=null; }

  // ensure all answered? If not, mark unanswered as incorrect
  for(let i=0;i<state.queue.length;i++){
    if(!state.exam.answers[i]){
      const q = state.queue[i];
      state.exam.answers[i] = {
        q,
        pickedIndex: null,
        correctIndex: q.correctIndex,
        pickedText: "(no answer)",
        correctText: q.choices[q.correctIndex],
        isCorrect: false
      };
    }
  }

  const total = state.exam.answers.length;
  const correct = state.exam.answers.filter(a=>a.isCorrect).length;
  const pct = Math.round((correct/total)*100);

  $("resultsSummary").textContent =
    `${forcedByTime ? "Time is up. " : ""}Score: ${correct} / ${total} (${pct}%). Review below.`;

  const list = $("resultsList");
  list.innerHTML = "";
  state.exam.answers.forEach((a, i)=>{
    const lab = LABS.find(l=>l.id===a.q.labId);
    const div = document.createElement("div");
    div.className = "resultCard";
    div.innerHTML = `
      <div class="meta">
        Q${i+1} • ${lab ? lab.name : "Lab"} • ${lab ? lab.topic : ""}
        <span class="badge ${a.isCorrect ? "good" : "bad"}">${a.isCorrect ? "Correct" : "Incorrect"}</span>
      </div>
      <p class="qt">${escapeHtml(a.q.prompt)}</p>
      <div class="ans"><strong>Your answer:</strong> ${escapeHtml(a.pickedText || "(no answer)")}</div>
      <div class="ans"><strong>Correct:</strong> ${escapeHtml(a.correctText)}</div>
      ${a.q.explanation ? `<div class="explanation"><strong>Why?</strong> ${escapeHtml(a.q.explanation)}</div>` : ""}
    `;
    list.appendChild(div);
  });

  openResults();
}

/* =========================
   UI Wiring
========================= */
$("settingsBtn").addEventListener("click", openSettings);
$("closeSettingsBtn").addEventListener("click", closeSettings);

$("helpBtn").addEventListener("click", openHelp);
$("closeHelpBtn").addEventListener("click", closeHelp);

$("closeResultsBtn").addEventListener("click", closeResults);
$("restartBtn").addEventListener("click", ()=>{
  closeResults();
  openSettings();
});

flipBtn.addEventListener("click", ()=>flip());
$("coverSide").addEventListener("click", ()=>flip(true));

revealBtn.addEventListener("click", revealAnswer);
$("hintBtn").addEventListener("click", giveHint);
submitBtn.addEventListener("click", submitAnswer);
nextBtn.addEventListener("click", nextQuestion);

// Sound toggle
const soundToggle = $("soundToggle");
soundToggle.classList.add("on");
soundToggle.addEventListener("click", ()=>{
  state.soundOn = !state.soundOn;
  soundToggle.classList.toggle("on", state.soundOn);
  soundToggle.innerHTML = state.soundOn ? "&#x1f50a;" : "&#x1f507;";
});

resetBtn.addEventListener("click", ()=>{
  localStorage.removeItem("kin100_flashcards_prefs");
  state.selectedLabs = [1,2,3,4,5,6];
  state.mode = "learn";
  state.sessionN = 30;
  state.exam.n = 20;
  state.exam.timeMin = 0;
  remember.value = "yes";
  renderSettings();
});

startBtn.addEventListener("click", ()=>{
  // pull settings from modal
  state.remember = (remember.value === "yes");
  state.sessionN = Number(sessionCount.value)==9999 ? 9999 : Number(sessionCount.value)||30;
  state.exam.n = Number(examCount.value)||20;
  state.exam.timeMin = Number(examTime.value)||0;
  savePrefs();
  startSession();
});

$("restartBtn").addEventListener("click", ()=>{
  closeResults();
  openSettings();
});

/* =========================
   Region quick-select mapping
========================= */
const REGION_MAP = {
  upper: [1,2,3,4,5,6],
  lower: [7,8,9,10],
  core:  [7],
  neuro: [11],
  all:   [1,2,3,4,5,6,7,8,9,10,11],
  none:  []
};

function getPoolCount(labIds){
  if(LABS === LABS_LECTURE && typeof LECTURE_TOPIC_MAP !== "undefined"){
    const lectureIds = new Set();
    for(const topicId of labIds){
      (LECTURE_TOPIC_MAP[topicId] || []).forEach(id => lectureIds.add(id));
    }
    let n = 0;
    for(const id of lectureIds) n += parseQuestionsForLab(id).length;
    return n;
  }
  let n = 0;
  for(const id of labIds) n += (parseQuestionsForLab(id)).length;
  return n;
}

function updateSelectCount(){
  const n = state.selectedLabs.length;
  const q = getPoolCount(state.selectedLabs);
  $("selectCount").innerHTML = `<strong>${n}</strong> lab${n!==1?"s":""} selected &middot; <strong>${q}</strong> question${q!==1?"s":""} in pool`;
}

function updateLabTiles(){
  document.querySelectorAll(".lab-tile").forEach(tile=>{
    const id = Number(tile.dataset.labId);
    tile.classList.toggle("selected", state.selectedLabs.includes(id));
  });
  updateSelectCount();
  updateRegionChips();
  setPills();
}

function updateRegionChips(){
  document.querySelectorAll(".region-chip").forEach(chip=>{
    const region = chip.dataset.region;
    const ids = REGION_MAP[region];
    if(!ids || region==="none") {
      chip.classList.remove("active");
      return;
    }
    const allSelected = ids.every(id => state.selectedLabs.includes(id));
    chip.classList.toggle("active", allSelected);
  });
}

function updateModeCards(){
  document.querySelectorAll(".mode-card").forEach(card=>{
    const mode = card.dataset.mode;
    card.classList.toggle("selected", state.mode === mode);
    card.querySelector("input").checked = (state.mode === mode);
  });
  examFields.style.display = (state.mode==="exam") ? "block" : "none";
  const showStudy = !["exam","match"].includes(state.mode);
  $("studyFields").style.display = showStudy ? "block" : "none";
}

// Region bar clicks
$("regionBar").addEventListener("click", (e)=>{
  const chip = e.target.closest(".region-chip");
  if(!chip) return;
  const region = chip.dataset.region;
  const ids = REGION_MAP[region];
  if(!ids) return;

  if(region === "none"){
    state.selectedLabs = [];
  } else if(region === "all"){
    state.selectedLabs = LABS.map(l=>l.id);
  } else {
    // Toggle: if all in region are selected, deselect them; otherwise select them
    const allSelected = ids.every(id => state.selectedLabs.includes(id));
    if(allSelected){
      state.selectedLabs = state.selectedLabs.filter(id => !ids.includes(id));
    } else {
      for(const id of ids){
        if(!state.selectedLabs.includes(id)) state.selectedLabs.push(id);
      }
    }
  }
  updateLabTiles();
});

// Mode card clicks
$("modeRow").addEventListener("click", (e)=>{
  const card = e.target.closest(".mode-card");
  if(!card) return;
  const mode = card.dataset.mode;
  state.mode = mode;
  updateModeCards();
  setPills();
});

function renderSettings(){
  // Lab tiles
  labsList.innerHTML = "";
  LABS.forEach((l, i)=>{
    const tile = document.createElement("div");
    tile.className = "lab-tile" + (state.selectedLabs.includes(l.id) ? " selected" : "");
    tile.dataset.labId = String(l.id);
    tile.style.animationDelay = `${i * 0.04}s`;
    tile.innerHTML = `
      <div class="tile-check">\u2713</div>
      <div class="tile-num">${String(l.id).padStart(2,"0")}</div>
      <div class="tile-name">${l.name}</div>
      <div class="tile-topic">${l.topic}</div>
    `;
    tile.addEventListener("click", ()=>{
      const id = l.id;
      if(state.selectedLabs.includes(id)){
        state.selectedLabs = state.selectedLabs.filter(x=>x!==id);
      } else {
        state.selectedLabs.push(id);
      }
      updateLabTiles();
    });
    labsList.appendChild(tile);
  });

  // Mode cards
  document.querySelectorAll(".mode-card").forEach((card, i)=>{
    card.style.animationDelay = `${0.44 + i * 0.06}s`;
  });
  updateModeCards();

  // Fields
  examCount.value = String(state.exam.n || 20);
  examTime.value = String(state.exam.timeMin || 0);
  if(state.sessionN===9999) sessionCount.value = "9999";
  else sessionCount.value = String(state.sessionN || 30);
  remember.value = state.remember ? "yes" : "no";

  updateLabTiles();
  setPills();
}

/* =========================
   Keyboard Shortcuts
========================= */
document.addEventListener("keydown", (e)=>{
  // If a modal is open, keep shortcuts minimal
  const settingsOpen = settingsModalBack.classList.contains("show");
  const helpOpen = helpModalBack.classList.contains("show");
  const resultsOpen = resultsModalBack.classList.contains("show");

  if(e.key === "Escape"){
    if(helpOpen) closeHelp();
    else if(resultsOpen) closeResults();
    else if(settingsOpen) closeSettings();
    else openSettings();
    return;
  }
  if(e.key === "?" || (e.shiftKey && e.key === "/")){
    if(!helpOpen) openHelp(); else closeHelp();
    return;
  }

  if(settingsOpen || helpOpen || resultsOpen) return;

  if(e.key === " "){
    e.preventDefault();
    flip();
    return;
  }
  if(e.key.toLowerCase() === "n"){
    nextQuestion();
    return;
  }
  if(e.key.toLowerCase() === "r"){
    revealAnswer();
    return;
  }
  if(e.key.toLowerCase() === "h"){
    giveHint();
    return;
  }
  if(e.key === "Enter"){
    // if already submitted in test/exam, Enter advances; otherwise submits
    if(state.mode==="exam"){
      const recorded = state.exam.answers[state.idx];
      if(recorded) nextQuestion(); else submitAnswer();
    }else if(state.mode==="test"){
      if(state.submitted) nextQuestion(); else submitAnswer();
    }else{
      // Learn: if revealed or submitted, advance; else submit
      if(state.revealed || state.submitted) nextQuestion();
      else submitAnswer();
    }
    return;
  }

  // 1–4 selects option (but does not auto-submit)
  const k = e.key;
  if(["1","2","3","4"].includes(k)){
    const idx = Number(k)-1;
    selectChoice(idx);
    return;
  }
});

/* =========================
   Touch / Swipe Gestures
========================= */
(function(){
  let startX = 0, startY = 0, startTime = 0;
  const MIN_DIST = 50;   // minimum swipe distance in px
  const MAX_TIME = 400;  // max ms for a swipe
  const cardWrap = document.querySelector(".cardWrap");
  if(!cardWrap) return;

  cardWrap.addEventListener("touchstart", function(e){
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startTime = Date.now();
  }, {passive: true});

  cardWrap.addEventListener("touchend", function(e){
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const elapsed = Date.now() - startTime;
    if(elapsed > MAX_TIME) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Require one axis to dominate
    if(absDx < MIN_DIST && absDy < MIN_DIST) return;

    if(absDy > absDx){
      // Vertical swipe — swipe up to flip to question, swipe down to flip to cover
      if(dy < 0) flip(true);   // swipe up → show question
      else flip(false);         // swipe down → show cover
    }else{
      // Horizontal swipe — swipe left for next
      if(dx < 0) nextQuestion();
      // swipe right is intentionally a no-op (no "previous" feature)
    }
  }, {passive: true});
})();

/* =========================
   Course Selection
========================= */
const courseModalBack = $("courseModalBack");

function selectCourse(course){
  if(course === "lecture"){
    LABS = LABS_LECTURE;
    QUESTION_DATA = QUESTION_DATA_LECTURE;
  } else {
    LABS = LABS_LAB;
    QUESTION_DATA = QUESTION_DATA_LAB;
  }
  // Update the settings title to reflect the course
  const versionEl = document.querySelector(".setup-version");
  if(versionEl) versionEl.textContent = course === "lecture" ? "KIN 100" : "KIN 100L";
  // Show region bar only for lab mode (anatomy regions don't apply to lecture)
  const regionBar = $("regionBar");
  if(regionBar) regionBar.style.display = course === "lab" ? "" : "none";

  courseModalBack.classList.remove("show");
  state.selectedLabs = [];
  renderSettings();
  setPills();
  setCoverForLab((LABS[0] || {id:1}).id);
  renderCurrent();
  openSettings();
}

$("selectLecture").addEventListener("click", ()=> selectCourse("lecture"));
$("selectLab").addEventListener("click",     ()=> selectCourse("lab"));

/* =========================
   Init
========================= */
loadPrefs();
state.remember = true; // default; modal controls whether to persist

// initial UI state (behind the course modal)
setPills();
renderCurrent();
