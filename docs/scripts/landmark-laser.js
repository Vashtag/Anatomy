window.playLandmarkLaser = async function playLandmarkLaser(rootEl, labData, mode='study'){
  const stage = document.createElement('div');
  stage.className = 'svg-stage';
  stage.setAttribute('role','region');
  stage.setAttribute('aria-label','Landmark diagram');
  const panel = document.createElement('div');
  panel.className = 'data-panel';

  const wrapper = document.createElement('div');
  wrapper.className = 'game-wrap';
  wrapper.appendChild(stage);
  wrapper.appendChild(panel);
  rootEl.innerHTML = '';
  rootEl.appendChild(wrapper);

  // Load SVG view
  const view = labData.views?.[0] || { id:'upper_limb_proximal', src:'./assets/svg/upper_limb_proximal.svg', title:'Upper limb (proximal)'};
  const svgText = await fetch(view.src).then(r=>r.text());
  stage.innerHTML = svgText + '<div class="overlay-hint" aria-hidden="true"></div>';
  const svg = stage.querySelector('svg');
  svg.setAttribute('focusable','false');
  svg.setAttribute('aria-hidden','false');

  const allLandmarks = labData.landmarks || [];
  let idx = 0;
  let correct = 0;
  const max = allLandmarks.length;
  const statsEl = document.createElement('div');
  statsEl.className = 'stats';
  panel.appendChild(statsEl);

  const promptEl = document.createElement('div');
  promptEl.className = 'instructions';
  panel.appendChild(promptEl);

  const actionsEl = document.createElement('div');
  actionsEl.className = 'actions';
  panel.appendChild(actionsEl);

  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  panel.appendChild(feedback);

  function renderStats(){
    statsEl.innerHTML = `<span class="badge">Item ${idx+1} of ${max}</span> · <span class="badge">Correct ${correct}</span>`;
  }

  function renderItem(){
    actionsEl.innerHTML = '';
    feedback.textContent = '';
    const item = allLandmarks[idx];
    if(!item){ finish(); return; }
    promptEl.innerHTML = `<strong>Find:</strong> ${item.name}`;

    const hintBtn = document.createElement('button');
    hintBtn.className = 'btn ghost';
    hintBtn.textContent = 'Hint';
    const revealBtn = document.createElement('button');
    revealBtn.className = 'btn ghost';
    revealBtn.textContent = 'Reveal';
    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn';
    skipBtn.textContent = 'Skip';

    if(mode === 'challenge'){ hintBtn.disabled = true; revealBtn.disabled = true; }
    actionsEl.appendChild(hintBtn);
    actionsEl.appendChild(revealBtn);
    actionsEl.appendChild(skipBtn);

    const target = svg.querySelector('#' + item.targetId);
    if(!target){
      feedback.className = 'feedback err';
      feedback.textContent = `Missing hotspot in SVG for ${item.name} (#${item.targetId}).`;
    }

    let attempts = 0;
    let gaveHint = false;
    let revealed = false;

    // Activate all hotspots only in the current view
    const hotspots = Array.from(svg.querySelectorAll('.hotspot'));
    hotspots.forEach(h=>{
      h.addEventListener('click', ()=>choose(h));
      h.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); choose(h); }
      });
    });

    function choose(el){
      attempts++;
      const isCorrect = el.id === item.targetId;
      if(isCorrect){
        let scoreAdd = 1;
        if(attempts === 2) scoreAdd = 0.7;
        if(revealed) scoreAdd = 0.3;
        correct += scoreAdd;
        a11yAnnounce(`Correct: ${item.name}`);
        feedback.className = 'feedback ok';
        feedback.innerHTML = `<strong>Correct.</strong> ${item.why || ''}`;
        target.classList.add('hotspot-hint');
        setTimeout(()=>{
          target.classList.remove('hotspot-hint');
          next();
        }, 700);
      }else{
        a11yAnnounce(`Not ${item.name}. Try again.`);
        feedback.className = 'feedback err';
        feedback.textContent = attempts === 1 ? 'Close—try again or use a hint.' : 'Incorrect—use hint or reveal, then try next.';
      }
    }

    hintBtn.addEventListener('click', ()=>{
      if(!target) return;
      target.classList.add('hotspot-hint');
      gaveHint = true;
      a11yAnnounce(`Hint shown for ${item.name}`);
      setTimeout(()=>target.classList.remove('hotspot-hint'), 2000);
    });

    revealBtn.addEventListener('click', ()=>{
      if(!target) return;
      revealed = true;
      target.classList.add('hotspot-hint');
      feedback.className = 'feedback ok';
      feedback.innerHTML = `<strong>Revealed.</strong> ${item.why || ''}`;
      a11yAnnounce(`Revealed ${item.name}`);
    });

    skipBtn.addEventListener('click', ()=> next());
    renderStats();
  }

  function next(){
    idx++;
    if(idx >= max){ finish(); }
    else{ renderItem(); }
  }

  function finish(){
    const pct = max ? Math.round((correct/max)*100) : 0;
    panel.innerHTML = `<h4>Landmark Laser complete</h4>
      <div class="stats">Score: <strong>${correct.toFixed(1)}</strong> / ${max} (${pct}%)</div>
      <div class="actions"><button class="btn primary" id="continue">Continue to Attach & Act</button></div>`;
    document.getElementById('continue')?.focus();
    const evt = new CustomEvent('game:complete', { detail:{ type:'landmarks', correct, total:max, pct }});
    rootEl.dispatchEvent(evt);
  }

  renderItem();
};
