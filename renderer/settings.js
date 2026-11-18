(function(){
const root=()=>document.getElementById('settings');
async function show(msg){
  const s=await api.getSettings();
  root().innerHTML=`<h1>Settings</h1>
  <div class="card"><h2>Appearance</h2><p class="sub">Choose a theme, or use the moon/sun button at the top right.</p>
   <div class="row2" style="margin:0">${['system','light','dark'].map(t=>`<label class="row" style="margin:0;flex:1"><input type="radio" name="th" value="${t}" ${window.getTheme()===t?'checked':''}><div>${t[0].toUpperCase()+t.slice(1)}</div></label>`).join('')}</div></div>
  <div class="card"><h2>AI access</h2><p class="sub">Your Anthropic API key. It is stored encrypted on this PC and only sent to Anthropic.</p>
   <input type="password" id="key" placeholder="${s.hasKey?'Key saved (enter a new one to replace)':'sk-ant-…'}"><div style="margin-top:10px"><button class="p" id="sk">Save key</button> ${s.hasKey?'<button id="ck">Remove key</button>':''}</div></div>
  <div class="card"><h2>Trusted web sources</h2><p class="sub">The AI only searches these sites when your slides don’t have the answer. One domain per line.</p>
   <textarea class="f" id="dom" rows="9">${s.domains.join('\n')}</textarea><div style="margin-top:10px"><button class="p" id="sd">Save sources</button></div></div>
  <div class="card"><h2>Add practice questions</h2><p class="sub">Import a question file (JSON) to add questions to Practice.</p><button id="iq">Import questions</button></div>
  <div class="card"><h2>About</h2><div class="cnt">NurseDesk version ${window.APP_VERSION||''}. Updates install automatically when you open the app.</div></div>
  <div class="cnt" id="m">${msg||''}</div>`;
  document.querySelectorAll('input[name=th]').forEach(r=>r.onchange=()=>window.setTheme(r.value));
  document.getElementById('sk').onclick=async()=>{const v=document.getElementById('key').value.trim();if(v){await api.saveSettings({key:v});show('Key saved.')}};
  const ck=document.getElementById('ck');if(ck)ck.onclick=async()=>{await api.saveSettings({key:''});show('Key removed.')};
  document.getElementById('sd').onclick=async()=>{await api.saveSettings({domains:document.getElementById('dom').value.split('\n')});show('Sources saved.')};
  document.getElementById('iq').onclick=async()=>{const r=await api.importQuestions();show(r.error||`Added ${r.added} questions. Restart the app to see them in Practice.`)};
}
window.settingsInit=()=>{};window.settingsShow=show;
})();
