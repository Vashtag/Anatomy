(function(){
  const app = document.getElementById('app');

  const LABS = [
    { id:'lab01', title:'Lab 1 — Back & Pectoral Girdle', file:'lab01-back-pectoral.json' },
    { id:'lab02', title:'Lab 2 — Axio-Appendicular & Scapulohumeral Muscles', file:'lab02-scapulohumeral.json' },
    { id:'lab03', title:'Lab 3 — Axilla, Brachial Plexus, & Heart', file:'lab03-axilla-plexus-heart.json' },
    { id:'lab04', title:'Lab 4 — Arm, Cubital Fossa, & Elbow Joint', file:'lab04-arm-elbow.json' },
    { id:'lab05', title:'Lab 5 — Anterior & Posterior Forearm', file:'lab05-forearm.json' },
    { id:'lab06', title:'Lab 6 — Wrist & Hand', file:'lab06-wrist-hand.json' },
    { id:'lab07', title:'Lab 7 — Abdominal Walls, Pelvis, & Hip Joint', file:'lab07-abdomen-hip.json' },
    { id:'lab08', title:'Lab 8 — Gluteal Region & Thigh', file:'lab08-gluteal-thigh.json' },
    { id:'lab09', title:'Lab 9 — Knee Joint, Ankle Joint, & Foot Bones', file:'lab09-knee-ankle-foot.json' },
    { id:'lab10', title:'Lab 10 — Muscles of the Leg & Foot', file:'lab10-leg-foot-muscles.json' },
    { id:'lab11', title:'Lab 11 — Central Nervous System', file:'lab11-cns.json' }
  ];

  function renderHome(){
    app.innerHTML = `
      <section class="section">
        <h2>Choose a Lab</h2>
        <p class="instructions">Each lab has <strong>Landmark Laser</strong> and <strong>Attach & Act</strong>. Study or Challenge mode. Progress saves locally.</p>
        <div class="cards" id="labCards"></div>
      </section>`;
    const cards = document.getElementById('labCards');
    const progress = Progress.get();

    LABS.forEach(lab=>{
      const card = document.createElement('div');
      card.className = 'card';
      const p = progress[lab.id];
      const meta = p ? `<div class="meta">Best: ${Math.round((p.pct||0))}%</div>` : `<div class="meta">No attempts yet</div>`;
      card.innerHTML = `<h3>${lab.title}</h3><p>Practice key structures and muscle actions.</p>${meta}`;
      const actions = document.createElement('div'); actions.className = 'actions';
      const btnStudy = document.createElement('button'); btnStudy.className = 'btn'; btnStudy.textContent = 'Study mode';
      const btnChallenge = document.createElement('button'); btnChallenge.className = 'btn primary'; btnChallenge.textContent = 'Challenge mode';
      actions.appendChild(btnStudy); actions.appendChild(btnChallenge);
      card.appendChild(actions);
      cards.appendChild(card);

      btnStudy.addEventListener('click', ()=> startLab(lab, 'study'));
      btnChallenge.addEventListener('click', ()=> startLab(lab, 'challenge'));
    });

    app.focus();
  }

  async function startLab(lab, mode){
    // fetch lab data
    let labData = null;
    try{
      labData = await fetch('./labs/' + lab.file).then(r=>r.json());
    }catch(e){
      labData = { landmarks:[], muscles:[], views:[{ id:'upper_limb_proximal', src:'./assets/svg/upper_limb_proximal.svg', title:'Upper limb (proximal)'}] };
    }

    // Landing panel
    app.innerHTML = '';
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `<h3>${lab.title}</h3>
      <p class="instructions">Mode: <strong>${mode === 'study' ? 'Study' : 'Challenge'}</strong>. Use <span class="kbd">Tab</span> to navigate hotspots, <span class="kbd">Enter</span> to select.</p>
      <div class="actions">
        <button class="btn" id="startLandmarks">Start Landmark Laser</button>
        <button class="btn" id="backHome">Back</button>
      </div>`;
    app.appendChild(card);
    document.getElementById('backHome').addEventListener('click', renderHome);

    document.getElementById('startLandmarks').addEventListener('click', ()=>{
      runLandmarks(lab, labData, mode);
    });
  }

  function runLandmarks(lab, labData, mode){
    const section = document.createElement('section'); section.className = 'section';
    app.innerHTML = ''; app.appendChild(section);
    playLandmarkLaser(section, labData, mode);
    section.addEventListener('game:complete', (e)=>{
      runAttach(lab, labData, mode, e.detail);
    }, { once:true });
  }

  function runAttach(lab, labData, mode, lmResult){
    const section = document.createElement('section'); section.className = 'section';
    app.innerHTML = ''; app.appendChild(section);

    if(lab.id === 'lab11'){
      playCNSConnect(section, labData, mode);
      section.addEventListener('game:complete', (e)=>{
        finishLab(lab, lmResult, e.detail);
      }, { once:true });
    }else{
      playAttachAndAct(section, labData, mode);
      section.addEventListener('game:complete', (e)=>{
        finishLab(lab, lmResult, e.detail);
      }, { once:true });
    }
  }

  function finishLab(lab, lm, att){
    const total = (lm?.total||0) + (att?.total||0);
    const score = (lm?.correct||0) + (att?.correct||0);
    const pct = total ? Math.round((score/total)*100) : 0;
    Progress.update(lab.id, { pct, ts: Date.now() });

    app.innerHTML = `<section class="section">
      <div class="card">
        <h3>${lab.title} — Summary</h3>
        <p class="instructions">Great work. Review items below or return home.</p>
        <ul class="clean">
          <li>Landmark Laser: <strong>${lm?.correct?.toFixed(1)||'0.0'}</strong> / ${lm?.total||0} (${lm?.pct||0}%)</li>
          <li>${lab.id==='lab11' ? 'CNS Connect' : 'Attach & Act'}: <strong>${att?.correct?.toFixed(1)||'0.0'}</strong> / ${att?.total||0} (${att?.pct||0}%)</li>
          <li>Total: <strong>${score.toFixed(1)}</strong> / ${total} (${pct}%)</li>
        </ul>
        <div class="actions">
          <button class="btn primary" id="home">Return Home</button>
          <button class="btn" id="retry">Retry lab</button>
        </div>
      </div>
    </section>`;

    document.getElementById('home').addEventListener('click', renderHome);
    document.getElementById('retry').addEventListener('click', ()=> startLab(lab, 'study'));
  }

  renderHome();
})();