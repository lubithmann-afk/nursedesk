// Title screen: animated logo + every tab as a button. Picking one hides it and the normal top tab bar takes over.
(function(){
const INFO={practice:['Practice','Tests, quizzes and Challenge mode'],slides:['Library','Class slides, ATI guide, glossary'],meds:['Medications','Every drug in six sections'],tutor:['Tutor','Learn a topic or fix your weak spots'],notes:['Web Notes','Answers saved from trusted sites'],game:['Game','A 15-question money-ladder quiz game'],ai:['Ask AI','Ask about your class material'],settings:['Settings','Theme, AI, updates']};
const wave=(y,amp)=>{let d=`M0 ${y}`;for(let x=0;x<1600;x+=200)d+=` L${x+60} ${y} L${x+80} ${y-amp*.35} L${x+95} ${y+amp*.25} L${x+115} ${y-amp} L${x+135} ${y+amp*.7} L${x+155} ${y} L${x+200} ${y}`;return d};
const logo=`<svg class="hlogo" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="hring"/><path class="hcross" d="M50 26h20v24h24v20H70v24H50V70H26V50h24z"/><path class="hbeat" d="M10 64h26l8-18 12 38 10-28 6 8h38" pathLength="100"/></svg>`;
const el=document.createElement('div');el.id='home';
el.innerHTML=`<svg class="hbg" viewBox="0 0 1600 800" preserveAspectRatio="none" aria-hidden="true"><g class="w w1"><path d="${wave(200,90)}"/><path d="${wave(200,90)}" transform="translate(1600 0)"/></g><g class="w w2"><path d="${wave(470,120)}"/><path d="${wave(470,120)}" transform="translate(1600 0)"/></g><g class="w w3"><path d="${wave(690,70)}"/><path d="${wave(690,70)}" transform="translate(1600 0)"/></g></svg>
 <div class="hin">${logo}<h1>NurseDesk</h1><p>NUR 283 comprehensive exam prep</p>
 <nav>${[...document.querySelectorAll('#tabs button[data-t]')].map(b=>{const i=INFO[b.dataset.t]||[b.textContent,''];return `<button data-go="${b.dataset.t}"><b>${i[0]}</b><span>${i[1]}</span></button>`}).join('')}</nav>
 <small id="hver"></small></div>`;
document.body.appendChild(el);
const hide=()=>{el.classList.add('out');setTimeout(()=>{el.style.display='none'},350)};
const show=()=>{el.style.display='';requestAnimationFrame(()=>el.classList.remove('out'));const v=document.getElementById('ver');document.getElementById('hver').textContent=v?v.textContent:'';const f=el.querySelector('nav button');f&&f.focus()};
el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const t=document.querySelector(`#tabs [data-t="${b.dataset.go}"]`);if(t)t.click();hide()});
const lg=document.querySelector('#tabs .logo');if(lg){lg.style.cursor='pointer';lg.title='Back to the title screen';lg.onclick=show}
window.homeShow=show;
setTimeout(()=>{const v=document.getElementById('ver');document.getElementById('hver').textContent=v?v.textContent:''},600);
})();
