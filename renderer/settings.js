(function(){
const root=()=>document.getElementById('settings');
async function show(msg){
  const s=await api.getSettings();
  root().innerHTML=`<h1>Settings</h1>
  <div class="card"><h2>Appearance</h2><p class="sub">Choose a theme, or use the moon/sun button at the top right.</p>
   <div class="row2" style="margin:0">${['system','light','dark'].map(t=>`<label class="row" style="margin:0;flex:1"><input type="radio" name="th" value="${t}" ${window.getTheme()===t?'checked':''}><div>${t[0].toUpperCase()+t.slice(1)}</div></label>`).join('')}</div></div>
  <div class="card"><h2>AI access</h2><p class="sub">Your Anthropic API key. It is stored encrypted on this PC and only sent to Anthropic.</p>
   <input type="password" id="key" placeholder="${s.hasKey?'Key saved (enter a new one to replace)':'sk-ant-…'}"><div style="margin-top:10px"><button class="p" id="sk">Save key</button> ${s.hasKey?'<button id="ck">Remove key</button>':''}</div></div>
  <div class="card"><h2>Trusted web sources</h2><p class="sub">The AI checks your Library first (class slides, syllabus, ATI guide) and only searches these sites when it doesn’t have the answer. One domain per line.</p>
   <textarea class="f" id="dom" rows="9">${s.domains.join('\n')}</textarea><div style="margin-top:10px"><button class="p" id="sd">Save sources</button></div></div>
  <div class="card"><h2>Add practice questions</h2><p class="sub">Import a question file (JSON) to add questions to Practice.</p><button id="iq">Import questions</button></div>
  <div class="card"><h2>About</h2><div class="cnt">NurseDesk version ${window.APP_VERSION||''}.</div></div>
  <div class="card"><h2>Updates</h2><div id="upd"></div></div>
  <div class="cnt" id="m">${msg||''}</div>`;
  api.updState().then(paintUpd);
  document.querySelectorAll('input[name=th]').forEach(r=>r.onchange=()=>window.setTheme(r.value));
  document.getElementById('sk').onclick=async()=>{const v=document.getElementById('key').value.trim();if(v){await api.saveSettings({key:v});show('Key saved.')}};
  const ck=document.getElementById('ck');if(ck)ck.onclick=async()=>{await api.saveSettings({key:''});show('Key removed.')};
  document.getElementById('sd').onclick=async()=>{await api.saveSettings({domains:document.getElementById('dom').value.split('\n')});show('Sources saved.')};
  document.getElementById('iq').onclick=async()=>{const r=await api.importQuestions();show(r.error||`Added ${r.added} questions. Restart the app to see them in Practice.`)};
}
function paintUpd(s){
  const e=document.getElementById('upd');if(!e)return;
  const T={dev:'Updates only work in the installed app.',idle:'Check whether a newer version is available.',checking:'Checking for updates…',current:'You have the latest version.',available:`Version ${s.version} is available.`,downloading:`Downloading update… ${s.percent||0}%`,ready:`Version ${s.version} is downloaded and ready.`,error:'Could not check for updates: '+(s.message||'unknown error')};
  const B={idle:['Check for updates','updCheck'],current:['Check again','updCheck'],error:['Try again','updCheck'],available:['Download update','updDownload'],ready:['Close and restart to update','updInstall']}[s.state];
  e.innerHTML=`<p class="sub">${T[s.state]||''}</p>${B?`<button class="p" id="ub">${B[0]}</button>`:''}`;
  const b=document.getElementById('ub');if(b)b.onclick=()=>{b.disabled=true;api[B[1]]()};
}
api.onUpdate(paintUpd);
window.settingsInit=()=>{};window.settingsShow=show;
})();
