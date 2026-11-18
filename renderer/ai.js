(function(){
const root=()=>document.getElementById('aiw');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
let hist=[];try{hist=JSON.parse(localStorage.getItem('nd_ai')||'[]')}catch(e){}
function save(){try{localStorage.setItem('nd_ai',JSON.stringify(hist.slice(-40)))}catch(e){}}
function draw(){
  const log=document.getElementById('log');if(!log)return;
  log.innerHTML=hist.length?hist.map(m=>`<div class="cm ${m.role}">${fmt(m.content)}${m.sources&&m.sources.length?`<div class="src" style="margin-top:6px">${m.sources.map(s=>`<a data-u="${esc(s.url)}">${esc(s.title||s.url)}</a>`).join('')}</div>`:''}</div>`).join(''):'<div class="cnt">Ask anything. I search your slides first and only go to trusted NCLEX/medical sources if your slides don’t cover it.</div>';
  log.querySelectorAll('[data-u]').forEach(a=>a.onclick=()=>api.openExternal(a.dataset.u));log.scrollTop=log.scrollHeight}
async function send(text){
  text=text.trim();if(!text)return;hist.push({role:'user',content:text});save();draw();
  const inp=document.getElementById('in'),btn=document.getElementById('go2'),st=document.getElementById('st');inp.value='';btn.disabled=true;st.textContent='Thinking…';
  const r=await api.ask(hist.slice(-12).map(m=>({role:m.role,content:m.content})));
  if(r.ok)hist.push({role:'assistant',content:r.text||'(no answer)',sources:r.sources});else hist.push({role:'assistant',content:'Error: '+r.error});
  save();st.textContent='';btn.disabled=false;draw();
}
function init(){
  root().innerHTML=`<div class="cl"><h1 style="margin-top:0">Ask AI</h1><div class="log" id="log"></div><div class="st" id="st"></div>
  <div class="row2"><input type="text" id="in" placeholder="Ask about your class material…"><button class="p" id="go2">Ask</button><button id="clr">Clear</button></div></div>`;
  api.onStatus(s=>{const e=document.getElementById('st');if(e)e.textContent=s});
  document.getElementById('go2').onclick=()=>send(document.getElementById('in').value);
  document.getElementById('in').onkeydown=e=>{if(e.key==='Enter')send(e.target.value)};
  document.getElementById('clr').onclick=()=>{hist=[];save();draw()};draw();
}
window.aiInit=init;
})();
