window.playAttachAndAct = async function playAttachAndAct(rootEl, labData, mode='study'){
  const stage = document.createElement('div');
  stage.className = 'svg-stage';
  stage.setAttribute('role','region');
  stage.setAttribute('aria-label','Muscle attachment diagram');
  const panel = document.createElement('div');
  panel.className = 'data-panel';

  const wrapper = document.createElement('div');
  wrapper.className = 'game-wrap';
  wrapper.appendChild(stage);
  wrapper.appendChild(panel);
  rootEl.innerHTML = '';
  rootEl.appendChild(wrapper);

  // Load primary view
  const view = labData.views?.[0] || { id:'upper_limb_proximal', src:'./assets/svg/upper_limb_proximal.svg', title:'Upper limb (proximal)'};
  const svgText = await fetch(view.src).then(r=>r.text());
  stage.innerHTML = svgText + '<div class="overlay-hint" aria-hidden="true"></div>';
  const svg = stage.querySelector('svg');
  svg.setAttribute('focusable','false');
  svg.setAttribute('aria-hidden','false');

  const muscles = labData.muscles || [];
  let idx = 0;
  let correct = 0;
  const max = muscles.length;

  const statsEl = document.createElement('div');
  statsEl.className = 'stats';
  panel.appendChild(statsEl);

  const titleEl = document.createElement('h4');
  panel.appendChild(titleEl);

  const promptEl = document.createElement('div');
  promptEl.className = 'instructions';
  panel.appendChild(promptEl);

  const controls = document.createElement('div');
  controls.className = 'grid-2';
  panel.appendChild(controls);

  const actionsRow = document.createElement('div');
  actionsRow.className = 'actions';
  panel.appendChild(actionsRow);

  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  panel.appendChild(feedback);

  const allActions = [
    'Shoulder flexion','Shoulder extension','Shoulder abduction','Shoulder adduction',
    'Shoulder internal rotation','Shoulder external rotation','Scapular protraction',
    'Scapular retraction','Scapular elevation','Scapular depression','Arm horizontal adduction',
    'Arm horizontal abduction'
  ];

  let placing = 'origin';
  let picked = { origin:null, insertion:null, action:null, nerve:null, roots:[] };
  let pinOrigin = null, pinInsertion = null;

  function render(){
    const m = muscles[idx];
    if(!m){ finish(); return; }
    titleEl.textContent = `Muscle ${idx+1} of ${max}`;
    promptEl.innerHTML = `<strong>${m.name}</strong>: Place <em>origin</em> and <em>insertion</em> pins, then choose its <em>primary action</em>. <span class="badge">Bonus</span>: nerve + roots`;
    renderStats();

    controls.innerHTML = '';

    // Column 1: pin placement controls
    const col1 = document.createElement('div');
    const placeRow = document.createElement('div');
    placeRow.className = 'actions';
    const originBtn = document.createElement('button');
    originBtn.className = 'btn ' + (placing==='origin'?'primary':'');
    originBtn.textContent = 'Place Origin';
    const insertionBtn = document.createElement('button');
    insertionBtn.className = 'btn ' + (placing==='insertion'?'primary':'');
    insertionBtn.textContent = 'Place Insertion';
    placeRow.appendChild(originBtn);
    placeRow.appendChild(insertionBtn);
    col1.appendChild(placeRow);

    originBtn.addEventListener('click', ()=>{ placing='origin'; render(); });
    insertionBtn.addEventListener('click', ()=>{ placing='insertion'; render(); });

    const pickedList = document.createElement('ul');
    pickedList.className = 'clean';
    pickedList.innerHTML = `
      <li>Origin: <strong>${picked.origin || '—'}</strong></li>
      <li>Insertion: <strong>${picked.insertion || '—'}</strong></li>`;
    col1.appendChild(pickedList);

    // Column 2: action + bonus
    const col2 = document.createElement('div');
    const actionLabel = document.createElement('label');
    actionLabel.textContent = 'Primary action';
    const actionSel = document.createElement('select');
    actionSel.className = 'btn';
    const opts = (m.actionsChoices && m.actionsChoices.length ? m.actionsChoices : allActions);
    actionSel.innerHTML = '<option value="">Choose…</option>' + opts.map(a=>`<option value="${a}">${a}</option>`).join('');
    if(picked.action){ actionSel.value = picked.action; }
    actionSel.addEventListener('change', ()=> picked.action = actionSel.value);
    col2.appendChild(actionLabel);
    col2.appendChild(actionSel);

    const bonusWrap = document.createElement('div');
    bonusWrap.style.marginTop = '12px';
    bonusWrap.innerHTML = '<div class="badge">Bonus</div>';
    const nerveLabel = document.createElement('label');
    nerveLabel.textContent = 'Innervation (nerve)';
    const nerveInput = document.createElement('input');
    nerveInput.className = 'btn';
    nerveInput.setAttribute('placeholder','e.g., Axillary nerve');
    nerveInput.value = picked.nerve || '';
    nerveInput.addEventListener('input', ()=> picked.nerve = nerveInput.value);
    bonusWrap.appendChild(nerveLabel);
    bonusWrap.appendChild(nerveInput);

    const rootsLabel = document.createElement('label');
    rootsLabel.textContent = 'Root levels (comma separated, e.g., C5,C6)';
    const rootsInput = document.createElement('input');
    rootsInput.className = 'btn';
    rootsInput.setAttribute('placeholder','C5,C6');
    rootsInput.value = picked.roots?.join(',') || '';
    rootsInput.addEventListener('input', ()=> picked.roots = rootsInput.value.split(',').map(s=>s.trim()).filter(Boolean));
    bonusWrap.appendChild(rootsLabel);
    bonusWrap.appendChild(rootsInput);

    col2.appendChild(bonusWrap);

    controls.appendChild(col1);
    controls.appendChild(col2);

    actionsRow.innerHTML = '';
    const hintBtn = document.createElement('button');
    hintBtn.className = 'btn ghost';
    hintBtn.textContent = 'Hint';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn ghost';
    resetBtn.textContent = 'Reset pins';
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn primary';
    checkBtn.textContent = 'Check Answer';

    if(mode === 'challenge'){ hintBtn.disabled = true; }
    actionsRow.appendChild(hintBtn);
    actionsRow.appendChild(resetBtn);
    actionsRow.appendChild(checkBtn);

    hintBtn.addEventListener('click', ()=>{
      // flash acceptable targets
      [...m.originTargets, ...m.insertionTargets].forEach(id=>{
        const el = svg.querySelector('#'+id);
        if(el){ el.classList.add('hotspot-hint'); setTimeout(()=>el.classList.remove('hotspot-hint'), 1200); }
      });
      a11yAnnounce(`Hints shown for ${m.name}.`);
    });

    resetBtn.addEventListener('click', ()=>{
      picked = { origin:null, insertion:null, action:null, nerve:null, roots:[] };
      pinOrigin?.remove(); pinOrigin = null;
      pinInsertion?.remove(); pinInsertion = null;
      render();
      a11yAnnounce('Pins reset');
    });

    checkBtn.addEventListener('click', ()=> check(m));
  }

  function renderStats(){
    const pct = max ? Math.round((correct/max)*100) : 0;
    statsEl.innerHTML = `<span class="badge">Progress ${idx}/${max}</span> · <span class="badge">Score ${correct.toFixed(1)}/${max} (${pct}%)</span>`;
  }

  function check(m){
    feedback.textContent='';
    let scoreAdd = 0;
    let notes = [];

    const goodOrigin = m.originTargets.includes(picked.origin);
    const goodInsertion = m.insertionTargets.includes(picked.insertion);
    const goodAction = picked.action && m.primary_actions.includes(picked.action);
    const hasBonus = m.innervation && m.roots && m.roots.length;
    let bonusAdd = 0;

    if(goodOrigin) scoreAdd += 1/3;
    if(goodInsertion) scoreAdd += 1/3;
    if(goodAction) scoreAdd += 1/3;

    if(hasBonus){
      const nerveOk = picked.nerve && picked.nerve.trim().toLowerCase() === m.innervation.toLowerCase();
      const rootsOk = Array.isArray(picked.roots) && picked.roots.length &&
        picked.roots.map(x=>x.toUpperCase()).sort().join(',') === m.roots.map(x=>x.toUpperCase()).sort().join(',');
      if(nerveOk && rootsOk){ bonusAdd = 0.25; }
      if(nerveOk && !rootsOk){ bonusAdd = 0.1; }
      if(!nerveOk && rootsOk){ bonusAdd = 0.1; }
    }

    const passed = (scoreAdd >= 0.99); // all three core pieces
    correct += scoreAdd + bonusAdd;

    if(passed){
      feedback.className = 'feedback ok';
      feedback.innerHTML = `<strong>Correct.</strong> ${m.why || ''}`;
      a11yAnnounce(`Correct: ${m.name}`);
      setTimeout(()=> next(), 700);
    }else{
      feedback.className = 'feedback err';
      feedback.innerHTML = `<strong>Not quite.</strong> Check pins and action. ${m.why || ''}`;
      a11yAnnounce(`Not correct: ${m.name}`);
    }
    renderStats();
  }

  // pin placement
  stage.addEventListener('click', (e)=>{
    const el = e.target.closest('.hotspot');
    if(!el) return;
    const rect = stage.getBoundingClientRect();
    const bbox = el.getBoundingClientRect();
    const cx = bbox.left + bbox.width/2 - rect.left;
    const cy = bbox.top + bbox.height/2 - rect.top;

    if(placing === 'origin'){
      pinOrigin?.remove();
      pinOrigin = document.createElement('div');
      pinOrigin.className = 'pin pin-origin';
      pinOrigin.style.left = cx + 'px';
      pinOrigin.style.top = cy + 'px';
      stage.appendChild(pinOrigin);
      picked.origin = el.id;
      a11yAnnounce(`Origin set: ${el.getAttribute('aria-label') || el.id}`);
    }else{
      pinInsertion?.remove();
      pinInsertion = document.createElement('div');
      pinInsertion.className = 'pin pin-insertion';
      pinInsertion.style.left = cx + 'px';
      pinInsertion.style.top = cy + 'px';
      stage.appendChild(pinInsertion);
      picked.insertion = el.id;
      a11yAnnounce(`Insertion set: ${el.getAttribute('aria-label') || el.id}`);
    }
  });

  function next(){
    idx++;
    picked = { origin:null, insertion:null, action:null, nerve:null, roots:[] };
    pinOrigin?.remove(); pinOrigin = null;
    pinInsertion?.remove(); pinInsertion = null;

    if(idx >= max){ finish(); }
    else{ render(); }
  }

  function finish(){
    const pct = max ? Math.round((correct/max)*100) : 0;
    panel.innerHTML = `<h4>Attach & Act complete</h4>
      <div class="stats">Score: <strong>${correct.toFixed(1)}</strong> / ${max} (${pct}%)</div>
      <div class="actions"><button class="btn primary" id="finishLab">Finish Lab</button></div>`;
    document.getElementById('finishLab')?.focus();
    const evt = new CustomEvent('game:complete', { detail:{ type:'attach', correct, total:max, pct }});
    rootEl.dispatchEvent(evt);
  }

  render();
};
