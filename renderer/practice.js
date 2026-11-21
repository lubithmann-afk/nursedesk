window.startPractice=async function(){

const D=window.QD;
try{const ex=await window.api.extraQuestions();
 if(ex&&ex.length){D.src.push('Class slides (imported)');const si=D.src.length-1;
  ex.forEach((q,i)=>{let ti=D.top.indexOf(q.topic);if(ti<0){D.top.push(q.topic||'From class slides');ti=D.top.indexOf(q.topic||'From class slides')}
   D.bank.push({id:100000+i,t:ti,s:q.srcLabel?(D.src.indexOf(q.srcLabel)<0?(D.src.push(q.srcLabel),D.src.length-1):D.src.indexOf(q.srcLabel)):si,q:q.q,o:q.o,a:q.a,r:q.r||'No rationale provided.'})})}}catch(e){}
const $=s=>document.querySelector(s);const app=$('#practice');
const L='ABCDEFGH';
let st={};
let P={a:{}};let saveState='';let dbDoc=null;let saving=false,dirty=false;
function lsGet(){try{const v=localStorage.getItem('nur283_progress');return v?JSON.parse(v):null}catch(e){return null}}
function lsSet(){try{localStorage.setItem('nur283_progress',JSON.stringify(P))}catch(e){}}
function merge(a,b){const r={a:{}};[a,b].forEach(x=>{if(x&&x.a)for(const k in x.a){const v=x.a[k],o=r.a[k];if(!o||(v.t||0)>(o.t||0))r.a[k]=v}});const un=(k,key)=>{const m=new Map();[a,b].forEach(x=>(x&&x[k]||[]).forEach(e=>m.set(key(e),e)));const v=[...m.values()].sort((x,y)=>x.t-y.t);if(v.length)r[k]=v.slice(-2000)};un('mr',e=>e.id+':'+e.t);un('lg',e=>e.i+':'+e.t);
  if(a&&a.run)r.run=a.run;if(b&&b.run&&(!r.run||(b.run.t||0)>(r.run.t||0)))r.run=b.run;return r}
function setSv(){const e=$('#sv');if(e)e.textContent=saveState}
async function flush(){
  lsSet();
  if(!dbDoc){saveState='Saved on this device';setSv();return}
  if(saving){dirty=true;return}
  saving=true;
  try{await dbDoc.set(P);saveState='Saved to your account'}catch(e){saveState='Saved on this device (account sync failed)'}
  saving=false;setSv();
  if(dirty){dirty=false;flush()}
}
async function initStore(){
  const l=lsGet();if(l){P=merge(P,l)}
  saveState='Saved on this device';
  try{
    const to=new Promise(r=>setTimeout(()=>r(null),10000));
    const go=(async()=>{
      const db=await claude.use('db');const user=await claude.use('user');
      if(!db||!user)return null;
      const id=await user.id();if(!id)return null;
      return db.collection('data/users/'+id).doc('progress');
    })();
    const d=await Promise.race([go,to]);
    if(d){
      dbDoc=d;
      let snap=await d.get();
      const ex=typeof snap.exists==='function'?snap.exists():snap.exists;
      const data=ex?(typeof snap.data==='function'?snap.data():snap.data):null;
      P=merge(data,P);
      lsSet();
      saveState='Saved to your account';
      if(JSON.stringify(P)!==JSON.stringify(data))flush();
      if(!st.run)home();else setSv();
    }
  }catch(e){}
}
function saveRun(){P.run={t:Date.now(),i:st.i,l:st.run.map(x=>({id:x.q.id,idx:x.idx,pick:x.pick,sel:x.sel}))};flush()}
function savedRun(){
  const r=P.run;if(!r||!r.l||!r.l.length)return null;
  const run=r.l.map(x=>{const q=D.bank.find(b=>b.id===x.id);return q?{q,idx:x.idx,pick:x.pick,sel:x.sel}:null});
  if(run.some(x=>!x))return null;return{run,i:Math.min(r.i||0,run.length-1)}
}
function resume(){const s=savedRun();if(!s){home();return}st.run=s.run;const f=s.run.findIndex(x=>x.pick===null);st.i=f<0?s.i:f;show()}
function discardRun(){delete P.run;flush();home()}
function record(q,ok){
  const o=P.a[q.id]||{n:0,c:0,l:1,t:0};
  o.n++;if(ok)o.c++;o.l=ok?1:0;o.t=Date.now();P.a[q.id]=o;(P.lg=P.lg||[]).push({i:q.id,t:o.t,o:ok?1:0});if(P.lg.length>2000)P.lg=P.lg.slice(-2000);flush();
}
// "I knew it, I just didn't read everything": flagged per ATTEMPT (the answer time), only for missed questions.
const mrOn=id=>!!(P.a[id]&&(P.mr||[]).some(e=>e.id===id&&e.t===P.a[id].t));
function mrToggle(id){
  const o=P.a[id];if(!o||o.l!==0)return false;
  P.mr=P.mr||[];const i=P.mr.findIndex(e=>e.id===id&&e.t===o.t);
  if(i>=0)P.mr.splice(i,1);else P.mr.push({id,t:o.t});
  if(P.mr.length>2000)P.mr=P.mr.slice(-2000);flush();return mrOn(id);
}
window.misreadState=mrOn;window.misreadToggle=mrToggle;
function mrStats(){
  const flags=(P.mr||[]).filter(e=>D.bank.some(q=>q.id===e.id));
  let wrong=0;for(const k in P.a)wrong+=P.a[k].n-P.a[k].c;
  const wk=Date.now()-7*864e5,lg=P.lg||[];
  const wWrong=lg.filter(e=>!e.o&&e.t>=wk).length,wFlag=flags.filter(e=>e.t>=wk).length;
  const byTopic={};flags.forEach(e=>{const q=D.bank.find(z=>z.id===e.id);if(q)byTopic[q.t]=(byTopic[q.t]||0)+1});
  const topics=Object.entries(byTopic).map(([t,n])=>({name:D.top[+t],n})).sort((a,b)=>b.n-a.n).slice(0,3);
  return{flags:flags.length,wrong,pct:wrong?Math.min(100,Math.round(flags.length/wrong*100)):0,wWrong,wFlag,topics,ids:[...new Set(flags.map(e=>e.id))]};
}
const core=()=>D.bank.filter(q=>!q.x);   // outside (non-Galen) sets stay out of mixed pools, stats and weak areas
function missedIds(){return core().filter(q=>P.a[q.id]&&P.a[q.id].l===0).map(q=>q.id)}
function topicStats(){
  return D.top.map((name,i)=>{
    const qs=core().filter(q=>q.t===i);let n=0,c=0,seen=0;
    qs.forEach(q=>{const o=P.a[q.id];if(o){seen++;n+=o.n;c+=o.c}});
    return{i,name,total:qs.length,seen,n,c,pct:n?c/n*100:null}
  });
}
function weakTopics(){return topicStats().filter(s=>s.n>=2&&s.pct<75).sort((a,b)=>a.pct-b.pct)}

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let SM=null;
async function initSample(){try{const s=await claude.use('sample');if(s){SM=s;if(st.run&&$('.rat')&&!$('#ci'))show()}}catch(e){}}
function fmt(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')}
function chatHTML(t){
  if(!SM)return'';
  return`<div class="chat"><h3>Ask a follow-up</h3>${(t.chat||[]).map(m=>`<div class="cm ${m.role}">${fmt(m.content)}</div>`).join('')}<div id="cb"></div>
  <div class="chips">${['Why are the other options wrong?','Explain the concept simply','Give me a similar practice question'].map(c=>`<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  <textarea id="ci" rows="2" placeholder="Ask anything about this question…"></textarea><button class="p" id="ca" style="width:100%">Ask</button></div>`}
function ctxFor(t){const q=t.q;return`You are an NCLEX-RN tutor helping a nursing student (NUR 283 comprehensive exam prep). Answer follow-up questions about the practice question below. Be accurate, NCLEX-focused and concise (under about 150 words unless asked for more). Use plain text; **bold** is OK. If you think the keyed answer is clinically wrong or questionable, say so plainly, since some keys came from imperfect source material.\n\nQuestion: ${q.q}\nOptions:\n${t.idx.map((oi,k)=>L[k]+'. '+q.o[oi]).join('\n')}\nKeyed correct answer: ${corLetters(t)}\nStudent chose: ${t.pick===null?'(not answered)':(Array.isArray(t.pick)?t.pick.map(k=>L[k]).join(', '):L[t.pick])}\nRationale on file: ${q.r}`}
async function ask(t,text){
  text=(text||'').trim();if(!text||!SM)return;
  const btn=$('#ca');btn.disabled=true;$('#ci').disabled=true;
  t.chat=t.chat||[];t.chat.push({role:'user',content:text});
  const box=$('#cb');box.insertAdjacentHTML('beforebegin',`<div class="cm user">${fmt(text)}</div>`);
  box.innerHTML='<div class="cm assistant">Thinking…</div>';
  const msgs=t.chat.map((m,i)=>i===0?{role:m.role,content:ctxFor(t)+'\n\nStudent: '+m.content}:m);
  try{
    const r=await SM(msgs,{cache:false,onText:({text})=>{box.innerHTML='<div class="cm assistant">'+fmt(text)+'</div>'}});
    t.chat.push({role:'assistant',content:r.text});
    box.innerHTML='';box.insertAdjacentHTML('beforebegin',`<div class="cm assistant">${fmt(r.text)}</div>`);
  }catch(e){
    t.chat.pop();
    box.innerHTML=`<div class="cm assistant">${e&&e.code==='rate_limited'?'Too many requests right now. Wait a moment and try again.':e&&e.code==='not_granted'?'Follow-up questions are not available here.':'Could not get an answer. Try again.'}</div>`;
    $('#cb').previousElementSibling&&0;
  }
  btn.disabled=false;const ci=$('#ci');ci.disabled=false;ci.value='';
}
function wireChat(t){
  if(!SM||!$('#ci'))return;
  $('#ca').onclick=()=>ask(t,$('#ci').value);
  document.querySelectorAll('.chips button').forEach(b=>b.onclick=()=>ask(t,b.dataset.c));
}
function isOk(x){const a=x.q.a;if(Array.isArray(a)){const p=(x.pick||[]).map(k=>x.idx[k]).sort().join();return p===a.slice().sort().join()}return x.idx[x.pick]===a}
function corLetters(t){const a=t.q.a;return Array.isArray(a)?t.idx.map((oi,k)=>a.includes(oi)?L[k]:null).filter(Boolean).join(', '):L[t.idx.indexOf(a)]}
function corText(q){return Array.isArray(q.a)?q.a.map(i=>q.o[i]).join('; '):q.o[q.a]}
function pickText(x){return Array.isArray(x.q.a)?(x.pick||[]).map(k=>x.q.o[x.idx[k]]).join('; '):x.q.o[x.idx[x.pick]]}
function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
const PT_NAMES=['Comp 1','Comp 2','Comp 3','Comp Bible'];
const isDeck=s=>/^Class slides/.test(s);
const isWq=s=>/^Weekly quiz/.test(s);
const isXs=s=>/^Not Galen/.test(s);
const sn=i=>{const s=D.src[i];if(isWq(s))return s.replace(/^Weekly quiz\s*[–-]\s*/,'');if(isDeck(s))return s.replace(/^Class slides\s*[–-]\s*/,'').replace(/^Class slides/,'Imported');if(isXs(s))return s.replace(/^Not Galen\s*[–-]\s*/,'');return PT_NAMES[i]||s};
const cnt=i=>D.bank.filter(q=>q.s===i).length;
// Status per category. A check (or X) only when EVERY question in it has been answered; "-" (yellow) when started but not finished.
// Finished sets age: green check < 2 days since you last practiced it, yellow check 2-6 days, red X after 7+ days.
const DAY=864e5,DONE_COL={g:'#2e9e5b',y:'#c99700',r:'#d64545',p:'#c99700'};
const lastDone=qs=>{let t=0;qs.forEach(q=>{const a=P.a[q.id];if(a&&a.t>t)t=a.t});return t};
const freshOf=t=>{const d=(Date.now()-t)/DAY;return d<2?'g':d<7?'y':'r'};
const agoOf=t=>{const d=Math.floor((Date.now()-t)/DAY);return d<1?'today':d===1?'yesterday':d+' days ago'};
const srcQs=v=>v==='wq'?D.bank.filter(q=>isWq(D.src[q.s])):D.bank.filter(q=>q.s===+v);
function statusOf(v){const qs=srcQs(v),n=qs.length,done=qs.filter(q=>P.a[q.id]).length;if(!done)return null;
  const t=lastDone(qs);if(done<n)return{k:'p',mark:'–',text:done+' of '+n+' done · '+agoOf(t),t};
  const k=freshOf(t);return{k,mark:k==='r'?'✗':'✓',text:agoOf(t),t}}
function doneOpt(v,label,n){const st=statusOf(v);
  return `<option value="${v}"${st?` style="color:${DONE_COL[st.k]}"`:''}>${st?st.mark+' ':''}${esc(label)} (${n})${st?' · '+st.text:''}</option>`}
function paintDone(id){const S=$('#'+id),B=$('#dn_'+id);if(!S||!B)return;const st=statusOf(S.value);
  B.textContent=st?st.mark+' '+st.text:'';B.style.color=st?DONE_COL[st.k]:'';B.title=st?(st.k==='p'?'Started but not finished':'Finished; last practiced '+st.text):'Not started'}
function poolRows(){
  const pt=[],dk=[],wq=[],xs=[];D.src.forEach((s,i)=>(isXs(s)?xs:isWq(s)?wq:isDeck(s)?dk:pt).push(i));
  const sel=(id,idx)=>`<select id="${id}" class="dd">${idx.map(i=>doneOpt(i,sn(i),cnt(i))).join('')}</select>`;
  return `<label class="row"><input type="radio" name="p" value="all" checked><div><b>All questions mixed</b><div class="cnt">${core().length} questions</div></div></label>
   <label class="row"><input type="radio" name="p" value="missed" id="rm"><div><b>Only questions I missed</b><div class="cnt" id="mc"></div></div></label>
   <label class="row"><input type="radio" name="p" value="weak" id="rw"><div><b>Practice my weak areas</b><div class="cnt" id="wc"></div></div></label>
   <label class="row"><input type="radio" name="p" id="rpt" value="${pt[0]}"><div style="flex:1"><b>Practice tests</b> <span class="dn" id="dn_spt"></span>${sel('spt',pt)}</div></label>
   ${dk.length?`<label class="row"><input type="radio" name="p" id="rdk" value="${dk[0]}"><div style="flex:1"><b>Class PowerPoints</b> <span class="dn" id="dn_sdk"></span>${sel('sdk',dk)}</div></label>`:''}
    ${xs.length?`<label class="row"><input type="radio" name="p" id="rxs" value="${xs[0]}"><div style="flex:1"><b>Other study sets (not Galen)</b> <span class="dn" id="dn_sxs"></span>${sel('sxs',xs)}<div class="cnt">Outside questions, not from Galen. Use them for extra practice only; they are left out of "All questions mixed" and your weak-area lists.</div></div></label>`:''}
   ${wq.length?`<label class="row"><input type="radio" name="p" id="rwq" value="wq"><div style="flex:1"><b>Weekly quizzes</b> <span class="dn" id="dn_swq"></span><select id="swq" class="dd">${doneOpt('wq','All weekly quizzes',D.bank.filter(q=>isWq(D.src[q.s])).length)}${wq.map(i=>doneOpt(i,sn(i),cnt(i))).join('')}</select></div></label>`:''}`;
}
function home(){
  const sr=savedRun();const ans=sr?sr.run.filter(x=>x.pick!==null).length:0;
  app.innerHTML=`<h1>NUR 283 Comp Practice Tests</h1>
  <p class="sub">${core().length} questions from your six PDFs, with an NCLEX-style rationale after every answer.</p>
  ${sr?`<div class="card" style="border-color:var(--acc)"><h2>Unfinished test</h2><div class="cnt" style="margin-bottom:10px">${ans} of ${sr.run.length} answered. Pick up where you left off.</div><button class="p" style="width:100%" id="rsm">Resume test</button><button style="width:100%;margin-top:8px" id="dsc">Discard this test</button></div>`:''}
  <div class="card"><h2>1. Choose a question pool</h2><div class="cnt" style="margin-bottom:8px">Check marks need every question in the set answered: <span style="color:#2e9e5b">✓ green</span> within 2 days, <span style="color:#c99700">✓ yellow</span> after 2 days, <span style="color:#d64545">✗ red</span> after a week. <span style="color:#c99700">–</span> means started but not finished.</div>${poolRows()}</div>
  <div class="card"><h2>2. How many questions?</h2><div class="big" id="n">50</div>
   <input type="range" id="r" min="1" max="50" value="50">
   <label class="row" style="margin-top:12px"><input type="checkbox" id="sh" checked><div>Shuffle questions and answer order</div></label>
   <div class="cnt" id="note"></div></div>
  <button class="p" style="width:100%" id="go">Start test</button>
  <button style="width:100%;margin-top:10px" id="imp">My progress &amp; areas to improve</button>
  <button style="width:100%;margin-top:10px" id="chl">Challenge mode: explain your reasoning to an AI coach</button>
  <p class="sv" id="sv" style="margin-top:10px;text-align:center"></p>`;
  setSv();$('#imp').onclick=improve;$('#chl').onclick=()=>window.challengeStart&&window.challengeStart();
  if(sr){$('#rsm').onclick=resume;const d=$('#dsc');d.onclick=()=>{d.textContent='Tap again to discard';d.onclick=discardRun}}
  const upd=()=>{const p=document.querySelector('input[name=p]:checked').value;const pool=getPool(p);const r=$('#r');r.max=Math.min(50,Math.max(1,pool.length));if(+r.value>+r.max)r.value=r.max;$('#n').textContent=r.value;$('#note').textContent=pool.length+' in pool';$('#go').disabled=pool.length===0};
  {$('#mc').textContent=missedIds().length+' still marked wrong (saved)';const wt=weakTopics();$('#wc').textContent=wt.length?wt.slice(0,3).map(s=>s.name).join(', ')+(wt.length>3?'…':''):'Answer more questions to find them'}
  ['spt','sdk','swq','sxs'].forEach(paintDone);
  [['spt','rpt'],['sdk','rdk'],['swq','rwq'],['sxs','rxs']].forEach(([s,r])=>{const S=$('#'+s);if(!S)return;S.onclick=e=>e.stopPropagation();S.onchange=()=>{paintDone(s);const R=$('#'+r);R.value=S.value;R.checked=true;R.dispatchEvent(new Event('change'))}});
  document.querySelectorAll('input[name=p]').forEach(e=>e.onchange=()=>{upd();$('#r').value=$('#r').max;$('#n').textContent=$('#r').value});
  $('#r').oninput=()=>$('#n').textContent=$('#r').value;
  upd();$('#r').value=$('#r').max;$('#n').textContent=$('#r').value;
  $('#go').onclick=()=>start(document.querySelector('input[name=p]:checked').value,+$('#r').value,$('#sh').checked);
}
function getPool(p){if(p==='all')return core();if(p==='wq')return D.bank.filter(q=>isWq(D.src[q.s]));if(p==='missed'){const m=missedIds();return D.bank.filter(q=>m.includes(q.id))}
  if(p==='weak'){const w=weakTopics().map(s=>s.i);const m=missedIds();return core().filter(q=>w.includes(q.t)||m.includes(q.id))}
  if(p[0]==='t')return D.bank.filter(q=>q.t===+p.slice(1));return D.bank.filter(q=>q.s===+p)}
function start(p,n,sh){
  let pool=getPool(p);pool=sh?shuffle(pool):pool.slice();pool=pool.slice(0,n);
  st.run=pool.map(q=>{let idx=q.o.map((_,i)=>i);if(sh)idx=shuffle(idx);return{q,idx,pick:null}});
  st.i=0;saveRun();show();
}
// used by the Medications tab: practice just the questions that mention a medication
window.practiceHome=()=>{home()};   // used by Challenge mode to return to this screen
window.practiceIds=ids=>{const set=new Set(ids);const pool=shuffle(D.bank.filter(q=>set.has(q.id)));if(!pool.length)return;st.run=pool.map(q=>({q,idx:shuffle(q.o.map((_,i)=>i)),pick:null}));st.i=0;saveRun();show();};
// used by Game mode so its answers count toward progress and the missed-questions pool
window.recordAnswer=(id,ok)=>{const q=D.bank.find(b=>b.id===id);if(q)record(q,ok)};
function show(){
  const t=st.run[st.i],q=t.q,n=st.run.length;
  const ans=t.pick!==null;const multi=Array.isArray(q.a);
  app.innerHTML=`<div class="top"><span>Question ${st.i+1} of ${n}</span><span>${st.run.filter(x=>x.pick!==null&&isOk(x)).length} correct</span></div>
  <div class="bar"><i style="width:${(st.i+(ans?1:0))/n*100}%"></i></div>
  ${!ans&&window.assist?`<div style="margin:0 0 8px">${window.assist.button()}</div>`:''}
  <div class="card"><div class="q">${window.assist&&window.assist.on?window.assist.html(q.q):esc(q.q)}</div>${window.assist&&window.assist.on?window.assist.legend():''}
  ${multi?'<div class="cnt" style="margin:-6px 0 10px">Select all that apply</div>':''}${t.idx.map((oi,k)=>{let c='',mk='';
    if(multi){const chosen=ans?t.pick.includes(k):(t.sel||[]).includes(k);const corr=q.a.includes(oi);
      if(ans){if(corr)c='ok';else if(chosen)c='bad';else c='dim';mk=chosen?'☑':'☐'}else{c=chosen?'sel':'';mk=chosen?'☑':'☐'}
      return`<button class="opt ${c}" data-k="${k}" ${ans?'disabled':''}><b>${mk}</b><span>${L[k]}. ${esc(q.o[oi])}</span></button>`}
    if(ans){if(oi===q.a)c='ok';else if(k===t.pick)c='bad';else c='dim'}return`<button class="opt ${c}" data-k="${k}" ${ans?'disabled':''}><b>${L[k]}.</b><span>${esc(q.o[oi])}</span></button>`}).join('')}
  ${ans?rat(t)+(isOk(t)?'':mrButton(q.id))+chatHTML(t):''}
  <div class="src">${esc(sn(q.s))} · ${esc(D.top[q.t])}</div></div>
  <div class="nav"><button id="ex">Save &amp; exit</button>${st.i>0?'<button id="pv">← Previous</button>':''}<button class="p" id="nx" ${ans||(multi&&t.sel&&t.sel.length)?'':'disabled'}>${ans?(st.i===n-1?'See results':'Next'):(multi?'Submit answer':'Next')}</button></div>`;
  document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;
    if(multi){t.sel=t.sel||[];const i=t.sel.indexOf(k);if(i<0)t.sel.push(k);else t.sel.splice(i,1);show();return}
    t.pick=k;const ok=isOk(t);record(q,ok);saveRun();show();window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})});
  wireChat(t);
  const asb=$('#asb');if(asb)asb.onclick=()=>{window.assist.set(!window.assist.on);show()};
  const mrd=$('#mrd');if(mrd)mrd.onclick=()=>{mrToggle(q.id);show()};
  $('#nx').onclick=()=>{if(multi&&!ans){t.pick=(t.sel||[]).slice().sort((a,b)=>a-b);const ok=isOk(t);record(q,ok);saveRun();show();window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});return}
    if(st.i===n-1)results();else{st.i++;saveRun();show();window.scrollTo(0,0)}};
  $('#ex').onclick=()=>{saveRun();home()};
  const pv=$('#pv');if(pv)pv.onclick=()=>{st.i--;saveRun();show();window.scrollTo(0,0)};   // review only: answered questions stay locked
}
function mrButton(id){const on=mrOn(id);return`<div style="margin:10px 0"><button id="mrd" class="mrb ${on?'on':''}" style="width:100%">${on?'✓ Marked: I knew the answer, I just didn’t read everything (tap to undo)':'I knew the answer, I just didn’t read everything'}</button></div>`}
function rat(t){const ok=isOk(t);
  return`<div class="rat ${ok?'ok':'bad'}"><strong>${ok?'Correct':'Incorrect'} — answer: ${corLetters(t)}</strong>${esc(t.q.r).replace(/\n/g,'<br>')}</div>`}
function results(){
  delete P.run;flush();
  const done=st.run.filter(x=>x.pick!==null);const ok=done.filter(isOk).length;const pct=done.length?Math.round(ok/done.length*100):0;
  const wrong=done.filter(x=>!isOk(x));
  app.innerHTML=`<h1>Results</h1><div class="card"><div class="big">${ok} / ${done.length} (${pct}%)</div>
  <div class="cnt">${st.run.length-done.length?`${st.run.length-done.length} unanswered`:'All answered'}</div></div>
  <div class="card"><h2>Missed questions (${wrong.length})</h2>${wrong.filter(x=>mrOn(x.q.id)).length?`<div class="cnt" style="margin-bottom:8px">You marked ${wrong.filter(x=>mrOn(x.q.id)).length} of these as “I knew it, I just didn’t read everything”.</div>`:''}${wrong.length?wrong.map(x=>`<div class="mi"><div><b>${esc(x.q.q)}</b></div><div style="margin-top:6px"><span class="tag b">Your answer</span>${esc(pickText(x))}</div><div style="margin-top:4px"><span class="tag">Correct</span>${esc(corText(x.q))}</div><div class="rat" style="margin-top:8px">${esc(x.q.r)}</div></div>`).join(''):'<div class="cnt">None — nice work.</div>'}</div>
  <div class="nav"><button id="h">Home</button><button id="ip">Progress</button><button class="p" id="rt" ${missedIds().length?'':'disabled'}>Retake missed (${missedIds().length})</button></div>`;
  $('#h').onclick=home;$('#ip').onclick=improve;$('#rt').onclick=()=>start('missed',50,true);
}
function improve(){
  const ts=topicStats(),seenQ=Object.keys(P.a).filter(k=>core().some(q=>String(q.id)===k)).length,tot=core().length;
  let n=0,c=0;for(const k in P.a){n+=P.a[k].n;c+=P.a[k].c}
  const pct=n?Math.round(c/n*100):0,mi=missedIds();
  const col=p=>p>=80?'var(--ok)':p>=65?'#d9a300':'var(--bad)';
  const ranked=ts.filter(s=>s.n>0).sort((a,b)=>a.pct-b.pct);
  const unseen=ts.filter(s=>s.n===0);
  const worst=core().filter(q=>P.a[q.id]&&P.a[q.id].n-P.a[q.id].c>0).sort((a,b)=>{const x=P.a[a.id],y=P.a[b.id];return (y.n-y.c)-(x.n-x.c)||(x.l-y.l)||y.t-x.t}).slice(0,10);
  const wt=weakTopics(),ms=mrStats();
  app.innerHTML=`<h1>My progress</h1><p class="sv" id="sv"></p>
  ${n?`<div class="stat"><div><b>${pct}%</b><span>overall</span></div><div><b>${n}</b><span>answers</span></div><div><b>${seenQ}/${tot}</b><span>seen</span></div><div><b>${mi.length}</b><span>still wrong</span></div></div>`:'<div class="card"><div class="cnt">No answers yet. Take a test and your results will show up here.</div></div>'}
  <div class="card"><h2>Reading carefully</h2>${ms.flags?`<div class="stat"><div><b>${ms.pct}%</b><span>of my misses</span></div><div><b>${ms.flags}</b><span>“knew it”</span></div><div><b>${ms.wrong}</b><span>misses in all</span></div></div>
   <div class="cnt" style="margin-top:8px">You marked ${ms.flags} of your ${ms.wrong} misses as “I knew the answer, I just didn’t read everything”.${ms.wWrong?` In the last 7 days: ${ms.wFlag} of ${ms.wWrong} misses.`:''}</div>
   ${ms.topics.length?`<div class="cnt" style="margin-top:6px">Most often in: ${ms.topics.map(t=>esc(t.name)+' ('+t.n+')').join(', ')}.</div>`:''}
   <div class="cnt" style="margin-top:8px"><b>Slow down:</b> read the last line first, circle words like NOT, EXCEPT, FIRST and BEST, then read every option before you choose.</div>
   <button class="p" id="rushed" style="margin-top:10px;width:100%">Practice the ${ms.ids.length} question${ms.ids.length>1?'s':''} I rushed</button>`:`<div class="cnt">After you miss a question, tap “I knew the answer, I just didn’t read everything” to see here how often it happens.</div>`}</div>
  ${wt.length?`<div class="card"><h2>Focus on these first</h2>${wt.slice(0,3).map(s=>`<div class="tr"><div class="h"><b>${esc(s.name)}</b><span class="pill">${Math.round(s.pct)}%</span></div><div class="cnt">${s.c} of ${s.n} correct</div></div>`).join('')}<button class="p" style="width:100%;margin-top:10px" id="pw">Practice weak areas (${getPool('weak').length} questions)</button></div>`:(n?'<div class="card"><h2>Focus areas</h2><div class="cnt">No topic is below 75% yet (a topic needs at least 2 answers to be flagged). Keep going.</div></div>':'')}
  ${ranked.length?`<div class="card"><h2>All topics, weakest first</h2>${ranked.map(s=>{const p=Math.round(s.pct);return`<div class="tr"><div class="h"><span>${esc(s.name)}</span><span class="pill ${p>=75?'g':''}">${p}%</span></div><div class="mb"><i style="width:${p}%;background:${col(p)}"></i></div><div class="cnt">${s.c}/${s.n} correct · ${s.seen} of ${s.total} questions seen</div><button style="margin-top:6px;padding:6px 10px;font-size:13px" data-t="${s.i}">Drill this topic</button></div>`}).join('')}${unseen.length?`<div class="cnt" style="margin-top:8px">Not started: ${unseen.map(s=>esc(s.name)).join(', ')}</div>`:''}</div>`:''}
  ${worst.length?`<div class="card"><h2>Most-missed questions</h2>${worst.map(q=>{const o=P.a[q.id];return`<div class="mi"><div><b>${esc(q.q)}</b></div><div class="cnt" style="margin:4px 0">${esc(D.top[q.t])} · missed ${o.n-o.c} of ${o.n}${o.l?' · got it right last time':''}</div><div><span class="tag">Correct</span>${esc(corText(q))}</div><div class="rat" style="margin-top:8px">${esc(q.r).replace(/\n/g,'<br>')}</div></div>`}).join('')}</div>`:''}
  <div class="nav"><button id="h">Home</button>${mi.length?`<button class="p" id="rm2">Retake missed (${mi.length})</button>`:''}</div>
  ${(n||P.run)?'<div style="text-align:center;margin-top:14px"><button id="rs" style="font-size:13px;padding:8px 12px">Clear all my progress</button></div>':''}`;
  setSv();$('#h').onclick=home;
  const pw=$('#pw');if(pw)pw.onclick=()=>start('weak',50,true);
  const rushed=$('#rushed');if(rushed)rushed.onclick=()=>window.practiceIds(ms.ids);
  const rm=$('#rm2');if(rm)rm.onclick=()=>start('missed',50,true);
  document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>start('t'+b.dataset.t,50,true));
  const rs=$('#rs');if(rs)rs.onclick=()=>{rs.textContent='Tap again to erase everything (answers, history, unfinished test)';rs.onclick=()=>{P={a:{}};flush();improve()}};
  window.scrollTo(0,0);
}
initStore();
initSample();
home();

};