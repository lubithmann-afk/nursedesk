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
  <div class="card" id="pk"><h2>Course pack</h2><div id="pkb"></div></div>
  <div class="card" id="ku"><h2>API key status and usage</h2><div id="kub"></div></div>
  <div class="card" id="loc"><h2>Built-in AI (optional, off by default)</h2><div id="locb"></div></div>
  <div class="card"><h2>Trusted web sources</h2><p class="sub">The AI checks your Library first (class slides, syllabus, ATI guide) and only searches these sites after you say yes, and it tells you exactly which page each fact came from. One domain per line.</p>
   <textarea class="f" id="dom" rows="9">${s.domains.join('\n')}</textarea><div style="margin-top:10px"><button class="p" id="sd">Save sources</button></div></div>
  <div class="card"><h2>Add practice questions</h2><p class="sub">Import a question file (JSON) to add questions to Practice.</p><button id="iq">Import questions</button></div>
  <div class="card"><h2>About</h2><div class="cnt">NurseDesk version ${window.APP_VERSION||''}. An independent study tool, not affiliated with Galen College of Nursing or ATI. It includes no course material of its own. The medication, glossary and AI content is a study aid, not clinical advice: do not use it for patient care or doses.</div></div>
  <div class="card"><h2>Updates</h2><div id="upd"></div></div>
  <div class="cnt" id="m">${msg||''}</div>`;
  api.updState().then(paintUpd);paintLocal();paintPack();paintUsage();
  document.querySelectorAll('input[name=th]').forEach(r=>r.onchange=()=>window.setTheme(r.value));
  const ko=document.getElementById('kopen3');if(ko)ko.onclick=window.keyHelp.open;
  document.getElementById('sk').onclick=async()=>{const v=document.getElementById('key').value.trim();if(v){await api.saveSettings({key:v});show('Key saved.')}};
  const ck=document.getElementById('ck');if(ck)ck.onclick=async()=>{await api.saveSettings({key:''});show('Key removed.')};
  document.getElementById('sd').onclick=async()=>{await api.saveSettings({domains:document.getElementById('dom').value.split('\n')});show('Sources saved.')};
  document.getElementById('iq').onclick=async()=>{const r=await api.importQuestions();show(r.error||`Added ${r.added} questions. Restart the app to see them in Practice.`)};
}
async function paintPack(note){
  const e=document.getElementById('pkb');if(!e)return;const i=await api.packInfo();
  e.innerHTML=(i?`<p class="sub"><b>${esc(i.name||'Course pack')}</b> is loaded: ${i.questions} questions, ${i.decks} library decks, ${i.citedLines} cited medication lines (made ${esc(i.created||'')}).</p><div class="row2" style="margin:0"><button id="pkn">Replace with another pack…</button><button id="pkr">Remove the pack</button></div>`
   :`<p class="sub">NurseDesk ships without any Galen or ATI material. A course pack is one .zip file with your class questions, slides and quiz banks, shared by a classmate. Import it once to unlock Practice, the Game, Challenge mode and the cited lines in Medications.</p><button class="p" id="pkn">Import a course pack…</button>`)
   +`<div class="cnt" id="pkm" style="margin-top:8px">${esc(note||'')}</div><div class="cnt" style="margin-top:6px">Only share a pack with classmates who are entitled to the same course materials, and check your school's policy first.</div>`;
  const n=document.getElementById('pkn');if(n)n.onclick=async()=>{const r=await api.packImport();if(r.cancelled)return;if(!r.ok){paintPack(r.error);return}location.reload()};
  const rm=document.getElementById('pkr');if(rm)rm.onclick=async()=>{await api.packRemove();location.reload()};
}
const fmt=n=>(+n||0).toLocaleString();const usd=n=>n==null?'':'$'+(+n).toFixed(n<1?3:2);
async function paintUsage(note){
  const e=document.getElementById('kub');if(!e)return;const [u,s]=await Promise.all([api.usageGet(),api.getSettings()]);
  e.innerHTML=`<p class="sub">Anthropic does not tell an app when a key will expire or how much credit is left. Keys have no expiry date; they work until you delete or disable them or the account runs out of credit. This button tests the key right now (it costs a fraction of a cent).</p>
   <div class="row2" style="margin:0"><button id="kchk" ${s.hasKey?'':'disabled'}>Check my key</button><span class="cnt" id="kres">${s.hasKey?'':'No key saved yet.'}</span></div>
   <h3 style="margin:16px 0 4px;font-size:14px">Used by this app</h3>
   <div class="cnt">This month (${esc(u.monthLabel)}): <b>${fmt(u.month.in)}</b> tokens in, <b>${fmt(u.month.out)}</b> out, ${fmt(u.month.calls)} requests${u.monthCost!=null?` · about <b>${usd(u.monthCost)}</b>`:''}<br>All time: ${fmt(u.all.in)} in, ${fmt(u.all.out)} out, ${fmt(u.all.calls)} requests${u.allCost!=null?` · about ${usd(u.allCost)}`:''}</div>
   <h3 style="margin:16px 0 4px;font-size:14px">Cost and credit estimate (optional)</h3>
   <div class="cnt" style="margin-bottom:6px">Enter the prices from Anthropic's pricing page (dollars per million tokens) to turn tokens into dollars. Then enter the credit you added to see a rough balance. This counts only what this app used; the Console shows your exact balance.</div>
   <div class="row2" style="margin:0"><input type="text" id="pin" placeholder="Input $ per million" value="${u.prices?u.prices.in:''}" style="max-width:190px"><input type="text" id="pout" placeholder="Output $ per million" value="${u.prices?u.prices.out:''}" style="max-width:190px"><button id="psv">Save prices</button></div>
   <div class="row2" style="margin:8px 0 0"><input type="text" id="cin" placeholder="Credit I added, in dollars" value="${u.credit?u.credit.amount:''}" style="max-width:190px"><button id="csv">Save credit (starts counting now)</button>${u.credit?'<button id="ccl">Clear</button>':''}</div>
   <div class="cnt" style="margin-top:8px">${u.credit?(u.remaining!=null?`Estimated credit left: <b>${usd(u.remaining)}</b> of ${usd(u.credit.amount)} added on ${esc(u.credit.date)}.`:'Enter the prices above to see an estimate of the credit left.'):''} <a id="kbill" style="color:var(--acc);cursor:pointer">Open Console billing</a></div>
   <div class="cnt" id="kum">${esc(note||'')}</div>`;
  const R=document.getElementById('kres');
  document.getElementById('kchk').onclick=async()=>{R.textContent='Checking…';const r=await api.checkKey();
    const L=r.limits&&r.limits.requestsLimit?` Limits right now: ${r.limits.requestsRemaining} of ${r.limits.requestsLimit} requests left${r.limits.tokensLimit?`, ${fmt(r.limits.tokensRemaining)} of ${fmt(r.limits.tokensLimit)} tokens`:''} this minute.`:'';
    R.textContent={valid:'✔ The key works.'+L,rejected:'✖ Anthropic rejected this key. It may be mistyped, deleted or disabled. Make a new one (see the steps in Ask AI).',no_credit:'⚠ The key is fine but the account is out of credit. Add credit in the Console billing page.',rate_limited:'⚠ The key works but you are being rate-limited right now. Try again in a minute.'+L,offline:'Could not reach Anthropic. Check your internet connection.',none:'No key saved yet.',error:'Anthropic returned an error: '+(r.error||'unknown')}[r.status]||'Unknown result.'};
  document.getElementById('psv').onclick=async()=>{await api.usageSet({inP:document.getElementById('pin').value,outP:document.getElementById('pout').value});paintUsage('Prices saved.')};
  document.getElementById('csv').onclick=async()=>{await api.usageSet({credit:document.getElementById('cin').value});paintUsage('Credit saved. Spending is counted from now.')};
  const cc=document.getElementById('ccl');if(cc)cc.onclick=async()=>{await api.usageSet({credit:0});paintUsage('Cleared.')};
  document.getElementById('kbill').onclick=()=>api.openExternal('https://platform.claude.com/settings/billing');
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
