(function(){
const root=()=>document.getElementById('settings');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function show(msg){
  const s=await api.getSettings();
  root().innerHTML=`<h1>Settings</h1>
  <div class="card"><h2>Appearance</h2><p class="sub">Choose a theme, or use the moon/sun button at the top right.</p>
   <div class="row2" style="margin:0">${['system','light','dark'].map(t=>`<label class="row" style="margin:0;flex:1"><input type="radio" name="th" value="${t}" ${window.getTheme()===t?'checked':''}><div>${t[0].toUpperCase()+t.slice(1)}</div></label>`).join('')}</div></div>
  <div class="card"><h2>AI access</h2><p class="sub">Your Anthropic API key. It is stored encrypted on this PC and only sent to Anthropic.</p>
   <input type="password" id="key" placeholder="${s.hasKey?'Key saved (enter a new one to replace)':'sk-ant-…'}"><details style="margin-top:10px"><summary style="cursor:pointer">How do I get an API key?</summary>${window.keyHelp.steps()}<button id="kopen3">Open Anthropic Console</button></details><div style="margin-top:10px"><button class="p" id="sk">Save key</button> ${s.hasKey?'<button id="ck">Remove key</button>':''}</div></div>
  <div class="card" id="loc"><h2>Built-in AI (optional, off by default)</h2><div id="locb"></div></div>
  <div class="card"><h2>Trusted web sources</h2><p class="sub">The AI checks your Library first (class slides, syllabus, ATI guide) and only searches these sites after you say yes, and it tells you exactly which page each fact came from. One domain per line.</p>
   <textarea class="f" id="dom" rows="9">${s.domains.join('\n')}</textarea><div style="margin-top:10px"><button class="p" id="sd">Save sources</button></div></div>
  <div class="card"><h2>Add practice questions</h2><p class="sub">Import a question file (JSON) to add questions to Practice.</p><button id="iq">Import questions</button></div>
  <div class="card"><h2>About</h2><div class="cnt">NurseDesk version ${window.APP_VERSION||''}.</div></div>
  <div class="card"><h2>Updates</h2><div id="upd"></div></div>
  <div class="cnt" id="m">${msg||''}</div>`;
  api.updState().then(paintUpd);paintLocal();
  document.querySelectorAll('input[name=th]').forEach(r=>r.onchange=()=>window.setTheme(r.value));
  const ko=document.getElementById('kopen3');if(ko)ko.onclick=window.keyHelp.open;
  document.getElementById('sk').onclick=async()=>{const v=document.getElementById('key').value.trim();if(v){await api.saveSettings({key:v});show('Key saved.')}};
  const ck=document.getElementById('ck');if(ck)ck.onclick=async()=>{await api.saveSettings({key:''});show('Key removed.')};
  document.getElementById('sd').onclick=async()=>{await api.saveSettings({domains:document.getElementById('dom').value.split('\n')});show('Sources saved.')};
  document.getElementById('iq').onclick=async()=>{const r=await api.importQuestions();show(r.error||`Added ${r.added} questions. Restart the app to see them in Practice.`)};
}
async function paintLocal(note){
  const e=document.getElementById('locb');if(!e)return;const s=await api.localState();
  if(!s.supported){e.innerHTML='<p class="sub">The built-in AI is only available in the Windows app.</p>';return}
  const dis=`<div class="card" style="border-color:var(--bad,#c0392b);margin:8px 0"><b>Please read before turning this on</b><ul style="margin:6px 0 0 18px"><li>This is a small AI model that runs on your own PC. It is <b>much less accurate</b> than Claude and can be confidently wrong, including about medications.</li><li>Its answers are <b>its own thoughts</b>, are labelled that way, and are <b>not</b> from your class materials. Never use them for a dose, a lab value, or anything on patient care.</li><li>Check anything important against your slides, the ATI guide, your instructor and your facility's policy.</li><li>It needs a one-time download of about ${(s.mb/1000).toFixed(1)} GB plus the AI engine (about 30 MB), and it uses a lot of memory and processor while thinking. It works best with 8 GB of RAM or more.</li><li>Nothing you ask is sent anywhere. It is only used when no Claude API key is saved.</li></ul></div>`;
  if(!s.accepted||!s.installed){
    e.innerHTML=`<p class="sub">Lets the Ask AI tab answer when you have no API key, by running a small model on this PC. Without it (and without a key), Ask AI just shows the matching lines from your own materials.</p>${dis}
     <label class="row" style="margin:8px 0"><input type="checkbox" id="lacc" ${s.accepted?'checked':''}><div>I understand the built-in AI can be wrong and is not a substitute for my course materials.</div></label>
     <button class="p" id="linst" ${s.accepted?'':'disabled'}>Download and switch on</button> <span class="cnt" id="lmsg">${esc(note||'')}</span>
     <details style="margin-top:12px" ${note?'open':''}><summary style="cursor:pointer">Download is blocked on my network? Get the model in my web browser instead</summary>
      <ol style="margin:8px 0 0 18px"><li><button id="lbr">Open the model download in my browser</button> (about ${(s.mb/1000).toFixed(1)} GB; save it anywhere, for example Downloads)</li><li><button id="lfile">I downloaded it, choose the file…</button></li></ol></details>`;
    const acc=document.getElementById('lacc'),bt=document.getElementById('linst');
    acc.onchange=()=>{bt.disabled=!acc.checked};
    document.getElementById('lbr').onclick=()=>api.openExternal(s.modelUrl);
    document.getElementById('lfile').onclick=async()=>{if(!acc.checked){document.getElementById('lmsg').textContent='Tick the box above first.';return}
      const m=document.getElementById('lmsg');const r=await api.localImportModel();if(r.cancelled)return;if(!r.ok){paintLocal(r.error);return}
      m.textContent='Model added. Setting up the AI engine…';api.onLocalProgress(t=>{m.textContent=t});await api.localEnable(true,true);
      const i=await api.localInstall();if(!i.ok){paintLocal('Could not finish: '+i.error);return}await api.localEnable(true,true);paintLocal('Installed and switched on.')};
    bt.onclick=async()=>{bt.disabled=true;acc.disabled=true;const m=document.getElementById('lmsg');api.onLocalProgress(t=>{m.textContent=t});
      const r=await api.localEnable(true,true);if(!r.ok){paintLocal(r.error);return}
      const i=await api.localInstall();if(!i.ok){paintLocal('Could not finish: '+i.error);return}
      await api.localEnable(true,true);paintLocal('Installed and switched on.')};
    return}
  e.innerHTML=`<p class="sub">The built-in AI is <b>${s.enabled?'ON':'OFF'}</b> (${esc(s.model)} is installed). It answers only when no API key is saved, and labels every answer as its own thoughts.</p>
   <div class="row2" style="margin:0"><button class="p" id="ltog">${s.enabled?'Switch off':'Switch on'}</button><button id="lrm">Delete the downloaded AI (frees about ${(s.mb/1000).toFixed(1)} GB)</button></div><div class="cnt" id="lmsg">${note||''}</div>`;
  document.getElementById('ltog').onclick=async()=>{await api.localEnable(!s.enabled,true);paintLocal()};
  document.getElementById('lrm').onclick=async()=>{await api.localRemove();paintLocal('Deleted.')};
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
