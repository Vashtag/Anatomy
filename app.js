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

const labsList = $("labsList");

const sessionCount = $("sessionCount");
const remember = $("remember");

const resetBtn = $("resetBtn");
const startBtn = $("startBtn");

const submitBtn = $("submitBtn");
const nextBtn = $("nextBtn");

let state = {
  selectedLabs: [1,2,3,4,5,6],
  mode: "test", // test | blank | match
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
  matchSet: null // {prompts:[], answers:[], shuffledAnswers:[], links:{}, selectedPrompt:null, submitted:false}
};

function savePrefs(){
  if(!state.remember) return;
  const prefs = {
    selectedLabs: state.selectedLabs,
    mode: state.mode,
    sessionN: state.sessionN
  };
  localStorage.setItem("kin100_flashcards_prefs", JSON.stringify(prefs));
}
function loadPrefs(){
  try{
    const raw = localStorage.getItem("kin100_flashcards_prefs");
    if(!raw) return;
    const prefs = JSON.parse(raw);
    if(Array.isArray(prefs.selectedLabs) && prefs.selectedLabs.length) state.selectedLabs = prefs.selectedLabs;
    if(["test","blank","match"].includes(prefs.mode)) state.mode = prefs.mode;
    if(typeof prefs.sessionN === "number") state.sessionN = prefs.sessionN;
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
  const modeLabel = {test:"Multiple Choice", blank:"Short Answer", match:"Matching"}[state.mode] || state.mode;
  modePill.textContent = `Mode: ${modeLabel}`;
  const isLecture = (LABS === LABS_LECTURE);
  labPill.textContent = `${isLecture ? "Topics" : "Labs"}: ${labLabel(state.selectedLabs)}`;
  progressPill.textContent = `${Math.min(state.idx+1, state.queue.length)} / ${state.queue.length}`;
  timerPill.style.display = "none";
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


function flip(toQuestion, instant){
  if(typeof toQuestion === "boolean"){
    state.flipped = toQuestion;
  }else{
    state.flipped = !state.flipped;
  }
  if(instant){
    card.style.transition = "none";
    card.classList.toggle("flipped", state.flipped);
    void card.offsetWidth; // force reflow before re-enabling transition
    card.style.transition = "";
  } else {
    card.classList.toggle("flipped", state.flipped);
  }
}

function randItem(arr){
  if(!arr || !arr.length) return null;
  return arr[Math.floor(Math.random()*arr.length)];
}

function setCoverForLab(labId){
  const lab = LABS.find(l=>l.id===labId);
  coverTitle.textContent = lab ? `${lab.name}: ${lab.topic}` : "KIN100 Flashcards";
  coverSub.textContent = "Select an option, then submit.";

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
      const fillExp = (parts[3] || "").trim();
      return {labId, prompt, type:"fill", choices:[answer,"","",""], correctIndex:0, explanation:fillExp};
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
  if(state.mode === "blank" || state.mode === "match") return;

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
const MATCH_COLORS = ["#69b3ff","#3ddc97","#ffd166","#ff6b6b","#c084fc"];

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

  qLab.textContent = "Matching Mode";
  qText.textContent = "Tap a number, then tap its answer to link them.";

  choicesEl.innerHTML = "";
  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";

  const layout = document.createElement("div");
  layout.className = "match-layout";

  const leftCol  = document.createElement("div");
  leftCol.className = "match-left";
  const rightCol = document.createElement("div");
  rightCol.className = "match-right";

  // SVG overlay for arrows
  const svgWrap = document.createElement("div");
  svgWrap.className = "match-svg-wrap";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.className = "match-svg";
  svgWrap.appendChild(svg);

  // Left column: prompts in order
  ms.prompts.forEach((p, pi)=>{
    const el = document.createElement("div");
    el.className = "match-item match-prompt" + (ms.selectedPrompt === pi ? " selected" : "");
    el.dataset.pi = String(pi);
    el.innerHTML = `<span class="match-num">${pi+1}</span>${escapeHtml(p.text)}`;
    el.addEventListener("click", ()=>{
      if(ms.submitted) return;
      ms.selectedPrompt = pi;
      renderMatchMode();
    });
    leftCol.appendChild(el);
  });

  // Right column: shuffled answers
  ms.shuffledAnswers.forEach((a, si)=>{
    const el = document.createElement("div");
    el.className = "match-item match-answer";
    el.dataset.si = String(si);
    if(ms.submitted){
      const entry = Object.entries(ms.links).find(([,v])=>v===si);
      if(entry){
        const pIdx = Number(entry[0]);
        el.classList.add(ms.shuffledAnswers[si].idx === pIdx ? "match-correct" : "match-wrong");
      }
    }
    el.innerHTML = `${escapeHtml(a.text)}`;
    el.addEventListener("click", ()=>{
      if(ms.submitted) return;
      if(ms.selectedPrompt === null){
        feedbackEl.className = "feedback show warn";
        feedbackEl.textContent = "Select a question number on the left first.";
        return;
      }
      // Remove any existing link to this answer slot
      Object.keys(ms.links).forEach(k=>{ if(ms.links[k]===si) delete ms.links[k]; });
      ms.links[ms.selectedPrompt] = si;
      ms.selectedPrompt = null;
      sfxMatch();
      renderMatchMode();
    });
    rightCol.appendChild(el);
  });

  layout.appendChild(leftCol);
  layout.appendChild(svgWrap);
  layout.appendChild(rightCol);
  choicesEl.appendChild(layout);

  // Draw arrows after layout is painted
  requestAnimationFrame(()=> drawMatchArrows(ms, svg, layout));

  const linkCount = Object.keys(ms.links).length;
  if(linkCount > 0 && linkCount < 5 && !ms.submitted){
    feedbackEl.className = "feedback show";
    feedbackEl.textContent = `${linkCount}/5 paired. Link all 5, then submit.`;
  }
}

function drawMatchArrows(ms, svg, layout){
  const lr = layout.getBoundingClientRect();
  if(!lr.width) return;

  svg.setAttribute("viewBox", `0 0 ${lr.width} ${lr.height}`);
  svg.innerHTML = "";

  Object.entries(ms.links).forEach(([piStr, si])=>{
    const pi = Number(piStr);
    const promptEl = layout.querySelector(`[data-pi="${pi}"]`);
    const answerEl = layout.querySelector(`[data-si="${si}"]`);
    if(!promptEl || !answerEl) return;

    const pr = promptEl.getBoundingClientRect();
    const ar = answerEl.getBoundingClientRect();
    const color = MATCH_COLORS[pi];

    // Start: right edge of prompt card, mid-height
    const x1 = pr.right  - lr.left;
    const y1 = pr.top    - lr.top + pr.height / 2;
    // End: left edge of answer card, mid-height
    const x2 = ar.left   - lr.left;
    const y2 = ar.top    - lr.top + ar.height / 2;

    // Cubic bezier with horizontal control points
    const cp = (x2 - x1) * 0.55;
    const d = `M${x1},${y1} C${x1+cp},${y1} ${x2-cp},${y2} ${x2},${y2}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width","2.5");
    path.setAttribute("fill","none");
    path.setAttribute("stroke-linecap","round");
    svg.appendChild(path);
  });
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

  state.idx = 0;
  state.selectedChoice = null;
  state.submitted = false;
  state.revealed = false;
  state.streak = 0;
  state.bestStreak = 0;
  state.hintsUsed = 0;
  state.matchSet = null;
  renderStreak();

  const pool = buildPool(state.selectedLabs);
  if(!pool.length){
    alert("No questions found for selected labs.");
    return;
  }

  const sc = sessionCount.value;
  const desiredN = (sc==="9999") ? pool.length : Math.min(Number(sc)||30, pool.length);

  shuffleInPlace(pool);
  const chosen = pool.slice(0, desiredN).map(makeShuffledQuestion);

  state.queue = chosen;

  setCoverForLab(state.queue[0].labId);
  renderCurrent();
  flip(true, true);
  setPills();
  closeSettings();

  if(state.mode==="match"){
    startMatchRound();
    flip(true, true);
  }
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
  $("hintBtn").style.display = (!isBlank && !isFill && !isMatch) ? "inline-block" : "none";
  submitBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";

  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("show","good","bad","warn");

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
  if(state.submitted) return; // lock after submit
  state.selectedChoice = i;
  [...choicesEl.querySelectorAll(".choice")].forEach(el=>{
    el.classList.toggle("selected", Number(el.dataset.index)===i);
  });
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

  const isCorrect = (state.selectedChoice === q.correctIndex);
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

  if(!state.submitted){
    feedbackEl.className = "feedback show warn";
    feedbackEl.textContent = "Submit your answer before moving on.";
    return;
  }

  if(state.idx >= state.queue.length - 1){
    // loop by reshuffling
    shuffleInPlace(state.queue);
    state.idx = 0;
    renderCurrent();
    flip(true, true);
    return;
  }

  state.idx++;
  renderCurrent();
  flip(true, true);
}


/* =========================
   UI Wiring
========================= */
$("settingsBtn").addEventListener("click", openSettings);
$("closeSettingsBtn").addEventListener("click", closeSettings);

$("helpBtn").addEventListener("click", openHelp);
$("closeHelpBtn").addEventListener("click", closeHelp);

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
  state.mode = "test";
  state.sessionN = 30;
  remember.value = "yes";
  renderSettings();
});

startBtn.addEventListener("click", ()=>{
  // pull settings from modal
  state.remember = (remember.value === "yes");
  state.sessionN = Number(sessionCount.value)==9999 ? 9999 : Number(sessionCount.value)||30;
  savePrefs();
  startSession();
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
  $("studyFields").style.display = (state.mode === "match") ? "none" : "block";
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

  if(e.key === "Escape"){
    if(helpOpen) closeHelp();
    else if(settingsOpen) closeSettings();
    else openSettings();
    return;
  }
  if(e.key === "?" || (e.shiftKey && e.key === "/")){
    if(!helpOpen) openHelp(); else closeHelp();
    return;
  }

  if(settingsOpen || helpOpen) return;

  if(e.key.toLowerCase() === "n"){
    nextQuestion();
    return;
  }
  if(e.key.toLowerCase() === "h"){
    giveHint();
    return;
  }
  if(e.key === "Enter"){
    if(state.submitted) nextQuestion(); else submitAnswer();
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
      // Vertical swipe — swipe up to show question side
      if(dy < 0) flip(true);
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
