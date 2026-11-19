(function(){
const root=()=>document.getElementById('aiw');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,'<a data-u="$2" style="color:var(--acc);cursor:pointer;text-decoration:underline">$1</a>').replace(/\n/g,'<br>');
let hist=[];try{hist=JSON.parse(localStorage.getItem('nd_ai')||'[]')}catch(e){}
function save(){try{localStorage.setItem('nd_ai',JSON.stringify(hist.slice(-40)))}catch(e){}}
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}};
function draw(){
  const log=document.getElementById('log');if(!log)return;
  log.innerHTML=hist.length?hist.map((m,i)=>`<div class="cm ${m.role}">${fmt(m.content)}${m.sources&&m.sources.length?`<div class="src" style="margin-top:6px">${m.sources.map(s=>`<a data-u="${esc(s.url)}">${esc(s.title||s.url)} (${esc(host(s.url))})</a>`).join('')}</div>`:''}${m.usedWeb?'<div class="cnt" style="margin-top:4px">Web search approved by you · sources listed above</div>':''}${m.note?`<div class="cnt" style="margin-top:4px">💾 ${m.note.isNew?'Saved to':'Updated in'} Web Notes · ${esc(m.note.category)} · <a data-open-note="${esc(m.note.id)}" style="color:var(--acc);cursor:pointer;text-decoration:underline">Open</a></div>`:''}</div>${m.askWeb&&i===hist.length-1?'<div style="margin:-4px 0 10px"><button class="p" id="webok">Yes, search trusted sites</button> <span class="cnt">or just keep asking and I will stay in your library</span></div>':''}`).join(''):'<div class="cnt">Ask anything. I search your Library first (slides, syllabus, ATI guide). If it isn’t there, I’ll ask before checking trusted medical sites, tell you exactly where anything comes from, and save what it finds (with the pages) in the Web Notes tab so I can use it next time.</div>';
  log.querySelectorAll('[data-open-note]').forEach(a=>a.onclick=()=>window.notesOpen&&window.notesOpen(a.dataset.openNote));
  const wb=document.getElementById('webok');if(wb)wb.onclick=()=>send('Yes, go ahead and check the trusted sites.',true);
  log.querySelectorAll('[data-u]').forEach(a=>a.onclick=()=>api.openExternal(a.dataset.u));log.scrollTop=log.scrollHeight}
async function send(text,web){
  text=text.trim();if(!text)return;hist.push({role:'user',content:text});save();draw();
  const inp=document.getElementById('in'),btn=document.getElementById('go2'),st=document.getElementById('st');inp.value='';btn.disabled=true;st.textContent='Thinking…';
  const r=await api.ask(hist.slice(-12).map(m=>({role:m.role,content:m.content})),undefined,{web:web===true});
  if(r.ok){hist.push({role:'assistant',content:r.text||'(no answer)',sources:r.sources,askWeb:r.askWeb,usedWeb:r.usedWeb,note:r.note});if(r.note&&window.notesRefresh)window.notesRefresh()}else hist.push({role:'assistant',content:'Error: '+r.error});
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
