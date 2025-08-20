window.playCNSConnect = async function playCNSConnect(rootEl, labData, mode='study'){
  const panel = document.createElement('div');
  panel.className = 'data-panel';
  rootEl.innerHTML = '';
  rootEl.appendChild(panel);

  const items = labData.cns || [];
  let idx = 0;
  let correct = 0;
  const max = items.length;

  function render(){
    const it = items[idx];
    if(!it){ finish(); return; }
    panel.innerHTML = `<h4>CNS Connect & Function (${idx+1} of ${max})</h4>
      <div class="instructions"><strong>${it.system}</strong> — select origin, decussation, and primary function.</div>`;

    const grid = document.createElement('div');
    grid.className = 'grid-3';
    panel.appendChild(grid);

    const originSel = makeSel('Origin', it.originOptions, 'origin');
    const decSel = makeSel('Decussation', it.decussationOptions, 'decussation');
    const funcSel = makeSel('Function', it.functionOptions, 'function');

    grid.appendChild(originSel.wrap);
    grid.appendChild(decSel.wrap);
    grid.appendChild(funcSel.wrap);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn primary';
    checkBtn.textContent = 'Check';
    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn';
    skipBtn.textContent = 'Skip';
    actions.appendChild(checkBtn);
    actions.appendChild(skipBtn);
    panel.appendChild(actions);

    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    panel.appendChild(feedback);

    checkBtn.addEventListener('click', ()=>{
      let add = 0;
      if(originSel.sel.value === it.origin) add += 1/3;
      if(decSel.sel.value === it.decussation) add += 1/3;
      if(funcSel.sel.value === it.function) add += 1/3;
      correct += add;
      const passed = add >= 0.99;
      if(passed){
        feedback.className = 'feedback ok';
        feedback.innerHTML = `<strong>Correct.</strong> ${it.note || ''}`;
        setTimeout(()=> next(), 600);
      }else{
        feedback.className = 'feedback err';
        feedback.innerHTML = `<strong>Not quite.</strong> ${it.note || ''}`;
      }
    });

    skipBtn.addEventListener('click', ()=> next());
  }

  function makeSel(label, options, id){
    const wrap = document.createElement('div');
    const lab = document.createElement('label');
    lab.textContent = label;
    const sel = document.createElement('select');
    sel.className = 'btn';
    sel.innerHTML = '<option value="">Choose…</option>' + options.map(o=>`<option value="${o}">${o}</option>`).join('');
    wrap.appendChild(lab);
    wrap.appendChild(sel);
    return { wrap, sel };
  }

  function next(){
    idx++;
    if(idx >= max){ finish(); }
    else { render(); }
  }

  function finish(){
    const pct = max ? Math.round((correct/max)*100) : 0;
    panel.innerHTML = `<h4>CNS Connect & Function complete</h4>
      <div class="stats">Score: <strong>${correct.toFixed(1)}</strong> / ${max} (${pct}%)</div>`;
    const evt = new CustomEvent('game:complete', { detail:{ type:'cns', correct, total:max, pct }});
    rootEl.dispatchEvent(evt);
  }

  render();
};
