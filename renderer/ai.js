(function(){
const root=()=>document.getElementById('aiw');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,'<a data-u="$2" style="color:var(--acc);cursor:pointer;text-decoration:underline">$1</a>');
const fmt=s=>inl(s).replace(/\n/g,'<br>');
const fmtA=s=>window.aiBlocks?window.aiBlocks(inl(s)):fmt(s);
let hist=[];try{hist=JSON.parse(localStorage.getItem('nd_ai')||'[]')}catch(e){}
function save(){try{localStorage.setItem('nd_ai',JSON.stringify(hist.slice(-40)))}catch(e){}}
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}};
function draw(){
  const log=document.getElementById('log');if(!log)return;
  log.innerHTML=hist.length?hist.map((m,i)=>`<div class="cm ${m.role}">${m.role==='assistant'?fmtA(m.content):fmt(m.content)}${m.sources&&m.sources.length?`<div class="src" style="margin-top:6px">${m.sources.map(s=>`<a data-u="${esc(s.url)}">${esc(s.title||s.url)} (${esc(host(s.url))})</a>`).join('')}</div>`:''}${m.usedWeb?'<div class="cnt" style="margin-top:4px">Web search approved by you · sources listed above</div>':''}${m.note?`<div class="cnt" style="margin-top:4px">💾 ${m.note.isNew?'Saved to':'Updated in'} Web Notes · ${esc(m.note.category)} · <a data-open-note="${esc(m.note.id)}" style="color:var(--acc);cursor:pointer;text-decoration:underline">Open</a></div>`:''}</div>${m.askWeb&&i===hist.length-1?'<div style="margin:-4px 0 10px"><button class="p" id="webok">Yes, search trusted sites</button> <span class="cnt">or just keep asking and I will stay in your library</span></div>':''}`).join(''):'<div class="cnt">Ask anything. I search your Library first (slides, syllabus, ATI guide). If it isn’t there, I’ll ask before checking trusted medical sites, tell you exactly where anything comes from, and save what it finds (with the pages) in the Web Notes tab so I can use it next time.</div>';
  log.querySelectorAll('[data-open-note]').forEach(a=>a.onclick=()=>window.notesOpen&&window.notesOpen(a.dataset.openNote));
  const wb=document.getElementById('webok');if(wb)wb.onclick=()=>send('Yes, go ahead and check the trusted sites.',true);
  log.querySelectorAll('[data-u]').forEach(a=>a.onclick=()=>api.openExternal(a.dataset.u));log.scrollTop=log.scrollHeight}
function offlineExtras(q){
  const low=q.toLowerCase(),out=[];
  try{const M=window.MEDS;if(M)M.meds.filter(m=>[m.name,...m.brands].some(n=>new RegExp('(^|[^a-z])'+n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z]|$)').test(low))).slice(0,2).forEach(m=>out.push(`**${m.name} (Medications tab, ${m.cls})**\nMechanism: ${(m.f.moa.m.find(x=>!/^ati-/.test(x.u)))?m.f.moa.m.find(x=>!/^ati-/.test(x.u)).x+' (from your class slides)':m.f.moa.g[0]+' (general reference, not from your class materials)'}\nNursing: ${(m.f.nsg.m.find(x=>!/^ati-/.test(x.u)))?m.f.nsg.m.find(x=>!/^ati-/.test(x.u)).x+' (from your class slides)':m.f.nsg.g[0]+' (general reference, not from your class materials)'}\nOpen the Medications tab for all six sections.`))}catch(e){}
  try{const G=window.GLOSSARY;if(G)G.terms.filter(t=>t.t.length>3&&new RegExp('(^|[^a-z])'+t.t.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z]|$)').test(low)).slice(0,3).forEach(t=>out.push(`**${t.t}** (glossary${t.m?', from your class materials':', general definition'}): ${t.d}`))}catch(e){}
  return out.length?'\n\n---\nAlso in this app:\n\n'+out.join('\n\n'):'';
}
async function send(text,web){
  text=text.trim();if(!text)return;hist.push({role:'user',content:text});save();draw();
  const inp=document.getElementById('in'),btn=document.getElementById('go2'),st=document.getElementById('st');inp.value='';btn.disabled=true;st.textContent='Thinking…';
  const r=await api.ask(hist.slice(-12).map(m=>({role:m.role,content:m.content})),undefined,{web:web===true});
  if(r.ok&&r.offline)r.text+=offlineExtras(text);
  if(r.ok){hist.push({role:'assistant',content:r.text||'(no answer)',sources:r.sources,askWeb:r.askWeb,usedWeb:r.usedWeb,note:r.note});if(r.note&&window.notesRefresh)window.notesRefresh()}else{hist.push({role:'assistant',content:'Error: '+r.error+keyHint(String(r.error))});keyCard()}
  save();st.textContent='';btn.disabled=false;draw();
}
async function keyCard(msg){
  const el=document.getElementById('keycard');if(!el)return;
  let has=false;try{has=(await api.getSettings()).hasKey}catch(e){}
  if(has){el.innerHTML=`<details class="card" style="margin-bottom:10px"><summary style="cursor:pointer">How to get or replace your API key</summary>${window.keyHelp.steps().replace('Paste it here and click <b>Save key</b>.','Paste it in <b>Settings</b> and click <b>Save key</b>.')}<button id="kopen2">Open Anthropic Console</button></details>`;
    const b=document.getElementById('kopen2');if(b)b.onclick=window.keyHelp.open;return}
  el.innerHTML=`<div class="card" style="margin-bottom:10px;border-color:var(--acc)"><h2 style="margin-top:0">Set up the AI (about 2 minutes)</h2>
   <p class="sub">The AI needs your own Anthropic API key. Think of it as a password that lets this app ask Claude questions for you.</p>${window.keyHelp.steps()}
   <div class="row2" style="margin:8px 0 0"><button id="kopen">Open Anthropic Console</button></div>
   <div class="row2" style="margin:10px 0 0"><input type="password" id="kin" placeholder="Paste your key here (sk-ant-…)"><button class="p" id="ksave">Save key</button></div>
   <div class="cnt" id="kmsg" style="margin-top:8px">${msg||'Your key is stored encrypted on this PC and only sent to Anthropic. Never share it with anyone.'}</div></div>`;
  document.getElementById('kopen').onclick=window.keyHelp.open;
  document.getElementById('ksave').onclick=async()=>{const v=document.getElementById('kin').value.trim();if(!v)return;await api.saveSettings({key:v});
    window.settingsShow&&document.getElementById('pane-settings').classList.contains('on')&&window.settingsShow();
    await keyCard();const m=document.getElementById('keycard');if(m&&!/Set up the AI/.test(m.innerHTML))m.insertAdjacentHTML('afterbegin',`<div class="cnt" style="margin-bottom:8px">✔ Key saved.${/^sk-ant-/.test(v)?'':' (Keys usually start with sk-ant-; if the AI says the key is invalid, create a new one.)'} You can ask a question now.</div>`)};
}
const keyHint=e=>/No API key/i.test(e)?'\n\nNo key is saved yet. Follow the setup steps at the top of this tab.':/invalid|authentic|x-api-key|permission|unauthor|401|403/i.test(e)?'\n\nThe key was rejected. Check it was copied completely, or create a new key (see “How to get or replace your API key” above).':/credit|balance|billing|payment|quota|rate/i.test(e)?'\n\nYour Anthropic account may be out of credit. Open the Console, go to Billing, and add credits.':'';
function init(){
  root().innerHTML=`<div class="cl"><h1 style="margin-top:0">Ask AI</h1><div id="keycard"></div><div class="log" id="log"></div><div class="st" id="st"></div>
  <div class="row2"><input type="text" id="in" placeholder="Ask about your class material…"><button class="p" id="go2">Ask</button><button id="clr">Clear</button></div>
  <div class="row2" style="margin-top:6px"><span class="cnt">No API key? Use your own account:</span><button id="hgpt">Ask in ChatGPT</button><button id="hcl">Ask in Claude</button></div><div class="cnt" id="hmsg"></div></div>`;
  for(const [id,site] of [['hgpt','chatgpt'],['hcl','claude']])document.getElementById(id).onclick=async()=>{const q=document.getElementById('in').value.trim(),m=document.getElementById('hmsg');if(!q){m.textContent='Type your question first.';return}m.textContent=await window.handoff.send(site,await window.handoff.fromSearch(q))};
  api.onStatus(s=>{const e=document.getElementById('st');if(e)e.textContent=s});
  document.getElementById('go2').onclick=()=>send(document.getElementById('in').value);
  document.getElementById('in').onkeydown=e=>{if(e.key==='Enter')send(e.target.value)};
  document.getElementById('clr').onclick=()=>{hist=[];save();draw()};draw();keyCard();
}
window.aiInit=init;
})();
