(function(){
  const contrast = document.getElementById('toggle-contrast');
  const motion = document.getElementById('toggle-motion');

  const savedContrast = localStorage.getItem('a11y:contrast');
  if(savedContrast === 'on'){ document.body.classList.add('theme-high-contrast'); contrast.checked = true; }

  const savedMotion = localStorage.getItem('a11y:motion');
  if(savedMotion === 'reduce'){ document.documentElement.style.scrollBehavior = 'auto'; motion.checked = true; }

  contrast?.addEventListener('change', (e)=>{
    if(e.target.checked){
      document.body.classList.add('theme-high-contrast');
      localStorage.setItem('a11y:contrast', 'on');
    }else{
      document.body.classList.remove('theme-high-contrast');
      localStorage.setItem('a11y:contrast', 'off');
    }
  });

  motion?.addEventListener('change', (e)=>{
    if(e.target.checked){
      document.documentElement.style.scrollBehavior = 'auto';
      localStorage.setItem('a11y:motion', 'reduce');
    }else{
      document.documentElement.style.scrollBehavior = 'smooth';
      localStorage.setItem('a11y:motion', 'normal');
    }
  });

  // Global polite announcer
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  window.a11yAnnounce = (msg)=>{ announcer.textContent = msg; };
})();