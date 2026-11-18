document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
  document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('on',p.id==='pane-'+b.dataset.t));
  if(b.dataset.t==='slides')window.slidesShow&&window.slidesShow();
  if(b.dataset.t==='settings')window.settingsShow&&window.settingsShow();
});
const tb=document.getElementById('theme');
const paintTheme=()=>{tb.textContent=window.themeIcon()};paintTheme();
tb.onclick=()=>window.toggleTheme();window.themeChanged=()=>{paintTheme();window.settingsShow&&document.getElementById('pane-settings').classList.contains('on')&&window.settingsShow()};
api.version().then(v=>{window.APP_VERSION=v;document.getElementById('ver').textContent='v'+v});
window.startPractice();window.slidesInit();window.aiInit();window.settingsInit();
// open a slide from anywhere
window.gotoSlide=(deckId,n)=>{document.querySelector('[data-t=slides]').click();window.slidesOpen(deckId,n)};
