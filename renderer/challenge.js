// Challenge mode (inside the Practice tab): random questions from a chosen category. After each answer an AI coach asks the
// student to explain their reasoning, then coaches it toward how an RN thinks on the NCLEX, with safety first.
(function(){
const G=window.GameLogic,app=()=>document.getElementById('practice'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
const L='ABCDEFGH',FALLBACK='In a sentence or two, explain why you chose that answer. What did you notice first in the question, and what could harm this client?';
let C=null,armed=false;
const progress=()=>{try{const p=JSON.parse(localStorage.getItem('nur283_progress')||'null');return p&&p.a?p.a:{}}catch(e){return{}}};
function categories(){
  const cats=G.categories(window.QD,window.MEDS,{all:true});
  const h=progress(),missed=window.QD.bank.filter(q=>h[q.id]&&h[q.id].l===0);
  if(missed.length)cats.splice(1,0,{key:'missed',group:'My progress',label:'Questions I missed',own:missed});
  return cats;
}
const isRight=(t,k)=>Array.isArray(t.q.a)?t.q.a.includes(t.idx[k]):t.idx[k]===t.q.a;     // is displayed option k a correct one?
const correctIx=t=>t.idx.map((_,k)=>k).filter(k=>isRight(t,k));
// Topics ranked by how you have been doing (same rule as Practice: at least 2 answers and under 75% = weak). You choose which to work on.
function weakPanel(){
  const h=progress(),D=window.QD,rows=D.top.map((name,i)=>{const qs=D.bank.filter(q=>q.t===i);let n=0,c=0;qs.forEach(q=>{const o=h[q.id];if(o){n+=o.n;c+=o.c}});return{i,name,total:qs.length,n,pct:n?Math.round(c/n*100):null}}).filter(r=>r.total>0);
  rows.sort((a,b)=>(a.pct==null)-(b.pct==null)||(a.pct??0)-(b.pct??0));
  const missed=D.bank.filter(q=>h[q.id]&&h[q.id].l===0).length,any=rows.some(r=>r.n>0);
  return `<div class="cnt" style="margin-bottom:8px">${any?'Lowest scores first. Areas under 75% are ticked for you; change them however you like.':'You have not answered enough questions for me to find weak spots yet. Tick any areas you want to work on.'}</div>
   ${rows.map(r=>{const weak=r.n>=2&&r.pct<75;return `<label class="row" style="margin:0 0 6px"><input type="checkbox" class="wk" data-t="${r.i}" ${weak?'checked':''}><div style="flex:1"><b>${esc(r.name)}</b> <span class="cnt">${r.total} questions</span></div><span style="font-weight:600;color:var(--${r.pct==null?'mut':r.pct<75?'bad':'ok'})">${r.pct==null?'not tried':r.pct+'%'}</span></label>`}).join('')}
   ${missed?`<label class="row" style="margin:6px 0 0"><input type="checkbox" id="wkm"><div>Also include the ${missed} question${missed===1?'':'s'} I missed</div></label>`:''}
   <div class="cnt" id="wkc" style="margin-top:8px"></div>`;
}
// ---- setup
async function setup(){
  C=null;armed=false;if(!window.QD)return;
  const cats=categories();let hasKey=true;try{hasKey=(await api.getSettings()).hasKey}catch(e){}
  const groups=[...new Set(cats.map(c=>c.group))];
  app().innerHTML=`<h1>Challenge mode</h1><p class="sub">Random questions from the category you pick. After you answer, your AI coach asks why you chose it and helps you think like an RN on the NCLEX: safety first.</p>
   ${hasKey?'':`<div class="card" style="border-color:var(--bad)"><b>No API key saved yet.</b><div class="cnt" style="margin-top:6px">The AI coach needs your key. You can still play, but you will only see the answer and rationale, with no coaching.</div><button id="chkey" style="margin-top:8px">Set up my key</button></div>`}
   <div class="card"><h2>1. What do you want to practice?</h2>
   <label class="row" style="margin:0 0 6px"><input type="radio" name="chm" value="cat" checked><div>A category</div></label>
   <label class="row" style="margin:0 0 10px"><input type="radio" name="chm" value="weak"><div>My weak areas (I choose which)</div></label>
   <div id="chcat"><select id="chc" class="dd">${groups.map(g=>`<optgroup label="${esc(g)}">${cats.filter(c=>c.group===g).map(c=>`<option value="${esc(c.key)}">${esc(c.label)} (${c.own.length})</option>`).join('')}</optgroup>`).join('')}</select><div class="cnt" id="chi" style="margin-top:6px"></div></div>
   <div id="chweak" style="display:none">${weakPanel()}</div></div>
   <div class="card"><h2>2. How many questions?</h2><div class="big" id="chn">10</div><input type="range" id="chr" min="1" max="20" value="10"><div class="cnt" style="margin-top:6px">Each question makes two short AI calls: a prompt for your reasoning, then feedback.</div></div>
   <button class="p" style="width:100%" id="chgo">Start challenge</button><button style="width:100%;margin-top:10px" id="chbk">Back to Practice</button>`;
  const mode=()=>document.querySelector('input[name=chm]:checked').value;
  const weakSet=()=>{const ids=[...document.querySelectorAll('.wk:checked')].map(e=>+e.dataset.t);const seen=new Set(),own=[];
    window.QD.bank.forEach(q=>{if(ids.includes(q.t)&&!seen.has(q.id)){seen.add(q.id);own.push(q)}});
    if($('#wkm')&&$('#wkm').checked)(cats.find(c=>c.key==='missed')||{own:[]}).own.forEach(q=>{if(!seen.has(q.id)){seen.add(q.id);own.push(q)}});
    return{key:'weak',group:'My weak areas',label:'My weak areas: '+(ids.map(t=>window.QD.top[t]).join(', ')||'none chosen'),own}};
  const cur=()=>mode()==='weak'?weakSet():cats.find(c=>c.key===$('#chc').value);
  const upd=()=>{const w=mode()==='weak';$('#chcat').style.display=w?'none':'';$('#chweak').style.display=w?'':'none';const n=cur().own.length,r=$('#chr');r.max=Math.max(1,Math.min(20,n));if(+r.value>+r.max)r.value=r.max;$('#chn').textContent=r.value;$('#chi').textContent=`${n} question${n===1?'':'s'} in this category (random order; select-all questions included).`;$('#chgo').disabled=n===0;const wc=$('#wkc');if(wc)wc.textContent=n?`${n} question${n===1?'':'s'} in your chosen areas.`:'Tick at least one area.'};
  document.querySelectorAll('input[name=chm],.wk,#wkm').forEach(e=>e.onchange=upd);
  $('#chc').onchange=upd;$('#chr').oninput=()=>$('#chn').textContent=$('#chr').value;upd();
  $('#chgo').onclick=()=>start(cur(),+$('#chr').value);
  $('#chbk').onclick=()=>window.practiceHome&&window.practiceHome();
  const k=$('#chkey');if(k)k.onclick=()=>document.querySelector('[data-t=ai]').click();
}
function start(cat,n){
  const qs=G.shuffle(cat.own,Math.random).slice(0,n).map(q=>({q,idx:G.shuffle(q.o.map((_,i)=>i),Math.random),sel:[],stage:'choose',text:'',prompt:'',feedback:'',err:'',guessed:false,ok:null,done:false}));
  C={cat,qs,i:0};draw();
}
// ---- question screen
function draw(){
  if(!C)return;const t=C.qs[C.i],q=t.q,n=C.qs.length,multi=Array.isArray(q.a),rev=t.stage==='reveal',locked=t.stage!=='choose';
  const opts=t.idx.map((oi,k)=>{let c='',mk=multi?(t.sel.includes(k)?'☑':'☐'):L[k]+'.';
    if(rev){c=isRight(t,k)?'ok':t.sel.includes(k)?'bad':'dim'}else if(t.sel.includes(k))c='sel';
    return `<button class="opt ${c}" data-k="${k}" ${locked?'disabled':''}><b>${mk}</b><span>${multi?L[k]+'. ':''}${esc(q.o[oi])}</span></button>`}).join('');
  let body='';
  if(t.stage==='choose')body=`<div class="nav"><button id="chq">${armed?'Tap again to quit':'Quit challenge'}</button>${C.i>0?'<button id="chpv">← Previous</button>':''}<button class="p" id="chlk" ${t.sel.length?'':'disabled'}>Lock in my answer</button></div>`;
  else if(t.stage==='coachwait')body=`<div class="rat"><strong>Your coach</strong>Reading your answer…</div>`;
  else if(t.stage==='explain')body=`<div class="rat"><strong>Your coach</strong>${fmt(t.prompt)}${t.err?`<div class="cnt" style="margin-top:6px">(Coach unavailable: ${esc(t.err)} Using a standard prompt.)</div>`:''}</div>
    <textarea class="f" id="chtx" rows="4" style="width:100%;margin-top:10px" placeholder="Explain your thinking in a few sentences…">${esc(t.text)}</textarea>
    <div class="nav"><button id="chg">I guessed / I’m not sure</button>${C.i>0?'<button id="chpv">← Previous</button>':''}<button class="p" id="chsub" ${t.text.trim().length>=3?'':'disabled'}>Submit my reasoning</button></div>`;
  else if(t.stage==='feedbackwait')body=`<div class="rat"><strong>Your reasoning</strong>${esc(t.guessed&&!t.text.trim()?'(You said you were not sure.)':t.text)}</div><div class="rat"><strong>Your coach</strong>Thinking about your reasoning…</div>`;
  else{const ans=correctIx(t).map(k=>`${L[k]}. ${esc(q.o[t.idx[k]])}`).join('<br>');
    body=`<div class="rat ${t.ok?'ok':'bad'}"><strong>${t.ok?'Correct!':'Not quite.'}</strong>${t.ok?'':'The answer: <br>'+ans}</div>
    <div class="rat"><strong>Your reasoning</strong>${esc(t.guessed&&!t.text.trim()?'(You said you were not sure.)':t.text)}</div>
    ${t.feedback?`<div class="rat"><strong>Your coach</strong>${fmt(t.feedback)}</div>`:`<div class="rat"><strong>Coach unavailable</strong>${esc(t.err||'No feedback this time.')}</div>`}
    <details style="margin-top:10px" ${t.feedback?'':'open'}><summary style="cursor:pointer">Rationale from the question bank</summary><div class="rat" style="white-space:pre-line">${esc(q.r||'')}</div></details>
    <h3 style="margin:16px 0 6px;font-size:14px">Ask a follow-up question</h3>
    ${(t.chat||[]).map(m=>`<div class="cm ${m.role==='user'?'user':'assistant'}">${m.role==='user'?esc(m.content):fmt(m.content)}</div>`).join('')}${t.fbusy?'<div class="cnt">Your coach is thinking…</div>':''}${t.ferr?`<div class="cnt">${esc(t.ferr)}</div>`:''}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">${['Why are the other options wrong?','What should I look for next time?','Explain it more simply'].map(x=>`<button class="fuq" data-q="${esc(x)}" ${t.fbusy?'disabled':''}>${esc(x)}</button>`).join('')}</div>
    <div class="row2" style="margin:0"><input type="text" id="chfu" placeholder="Ask your coach about this question…" value="${esc(t.fu||'')}" ${t.fbusy?'disabled':''}><button id="chfs" ${t.fbusy?'disabled':''}>Ask</button></div>
    <div class="nav">${C.i>0?'<button id="chpv">← Previous</button>':'<span></span>'}<button class="p" id="chnx">${C.i===n-1?'See results':'Next question'}</button></div>`}
  app().innerHTML=`<div class="top"><span>Challenge · Question ${C.i+1} of ${n}</span><span>${C.qs.filter(x=>x.done&&x.ok).length} correct</span></div>
   <div class="bar"><i style="width:${(C.i+(rev?1:0))/n*100}%"></i></div>
   <div class="card"><div class="q" style="white-space:pre-line">${esc(q.q)}</div>${multi?'<div class="cnt" style="margin:-6px 0 10px">Select all that apply</div>':''}${opts}${body}<div class="src">${esc(window.QD.top[q.t])}</div></div>`;
  app().querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;if(multi){const i=t.sel.indexOf(k);i<0?t.sel.push(k):t.sel.splice(i,1)}else t.sel=[k];draw()});
  const on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
  on('#chlk',()=>lockIn(t));on('#chsub',()=>reason(t,false));on('#chg',()=>reason(t,true));on('#chnx',next);on('#chpv',()=>{armed=false;C.i--;draw();window.scrollTo(0,0)});
  on('#chq',()=>{if(armed){armed=false;setup()}else{armed=true;draw()}});
  const fu=$('#chfu');if(fu){fu.oninput=()=>{t.fu=fu.value};fu.onkeydown=e=>{if(e.key==='Enter')followup(t,fu.value)};on('#chfs',()=>followup(t,fu.value));app().querySelectorAll('.fuq').forEach(b=>b.onclick=()=>followup(t,b.dataset.q))}
  const tx=$('#chtx');if(tx){tx.oninput=()=>{t.text=tx.value;const b=$('#chsub');if(b)b.disabled=t.text.trim().length<3};if(!tx.value)tx.focus()}
}
const payload=(t,stage)=>({stage,question:t.q.q,options:t.idx.map(oi=>t.q.o[oi]),chosen:t.sel,
  ...(stage==='feedback'?{correct:correctIx(t),rationale:t.q.r||'',explanation:t.text,guessed:t.guessed}:{})});
async function lockIn(t){
  t.sel.sort((a,b)=>a-b);t.stage='coachwait';draw();
  let r;try{r=await api.coachAsk(payload(t,'prompt'))}catch(e){r={ok:false,error:String(e)}}
  if(r&&r.ok&&r.text){t.prompt=r.text}else{t.prompt=FALLBACK;t.err=(r&&r.error)||'No response.'}
  t.stage='explain';draw();
}
async function reason(t,guessed){
  t.guessed=guessed;t.stage='feedbackwait';draw();
  let r;try{r=await api.coachAsk(payload(t,'feedback'))}catch(e){r={ok:false,error:String(e)}}
  if(r&&r.ok&&r.text){t.feedback=r.text}else{t.feedback='';t.err=(r&&r.error)||'No response.'}
  const want=correctIx(t);t.ok=want.length===t.sel.length&&want.every(k=>t.sel.includes(k));t.done=true;t.stage='reveal';
  try{window.recordAnswer&&window.recordAnswer(t.q.id,t.ok)}catch(e){}
  draw();
}
async function followup(t,text){
  text=String(text||'').trim();if(!text||t.fbusy)return;
  t.chat=t.chat||[];const history=t.chat.slice();t.chat.push({role:'user',content:text});t.fu='';t.fbusy=true;t.ferr='';draw();
  let r;try{r=await api.coachAsk({...payload(t,'feedback'),stage:'followup',coachFeedback:t.feedback,history,ask:text})}catch(e){r={ok:false,error:String(e)}}
  if(r&&r.ok&&r.text)t.chat.push({role:'assistant',content:r.text});else t.ferr='Your coach could not answer: '+((r&&r.error)||'no response')+(/No API key/i.test((r&&r.error)||'')?' Add an API key in Settings.':'');
  t.fbusy=false;draw();const e=$('#chfu');if(e)e.focus();
}
function next(){if(C.i===C.qs.length-1)return results();C.i++;draw();window.scrollTo(0,0)}
// ---- talk to the coach about the whole challenge (results screen)
let RV=null;
function reviewItems(qs){return qs.map(t=>({question:t.q.q,options:t.idx.map(oi=>t.q.o[oi]),chosen:t.sel,correct:correctIx(t),ok:!!t.ok,reasoning:t.text,guessed:t.guessed,coach:t.feedback||'',topic:window.QD.top[t.q.t]}))}
function paintDebrief(){
  const box=$('#chdbg');if(!box||!RV)return;
  const chat=RV.chat.map(m=>`<div class="cm ${m.role==='user'?'user':'assistant'}">${m.role==='user'?esc(m.content):fmt(m.content)}</div>`).join('');
  const started=RV.chat.length>0;
  box.innerHTML=`<h2 style="margin-top:0">Talk to your coach about this challenge</h2>
   ${started?'':`<div class="cnt" style="margin-bottom:10px">Your coach will look at all ${RV.qs.length} questions together, point out where your thinking keeps going wrong, and help you fix it. Then you can keep asking questions.</div><button class="p" id="chdb" ${RV.busy?'disabled':''}>Show me where I’m going wrong</button>`}
   ${chat}${RV.busy?'<div class="cnt">Your coach is reading your answers…</div>':''}${RV.err?`<div class="cnt">${esc(RV.err)}</div>`:''}
   ${started?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">${['Give me a 5-minute plan to fix this','Which question should I redo first?','Quiz me on my weakest area'].map(x=>`<button class="dbq" data-q="${esc(x)}" ${RV.busy?'disabled':''}>${esc(x)}</button>`).join('')}</div>
   <div class="row2" style="margin:0"><input type="text" id="chdi" placeholder="Ask your coach anything about how you did…" value="${esc(RV.text)}" ${RV.busy?'disabled':''}><button id="chds" ${RV.busy?'disabled':''}>Send</button></div>`:''}`;
  const b=$('#chdb');if(b)b.onclick=()=>debrief('');
  const i=$('#chdi');if(i){i.oninput=()=>{RV.text=i.value};i.onkeydown=e=>{if(e.key==='Enter')debrief(i.value)};const s=$('#chds');if(s)s.onclick=()=>debrief(i.value)}
  box.querySelectorAll('.dbq').forEach(x=>x.onclick=()=>debrief(x.dataset.q));
}
async function debrief(text){
  if(!RV||RV.busy)return;text=String(text||'').trim();const first=RV.chat.length===0;if(!first&&!text)return;
  const history=RV.chat.slice();if(!first)RV.chat.push({role:'user',content:text});RV.text='';RV.busy=true;RV.err='';paintDebrief();
  let r;try{r=await api.coachAsk({stage:'debrief',items:reviewItems(RV.qs),history,ask:first?'':text})}catch(e){r={ok:false,error:String(e)}}
  if(r&&r.ok&&r.text)RV.chat.push({role:'assistant',content:r.text});else RV.err='Your coach could not answer: '+((r&&r.error)||'no response')+(/No API key/i.test((r&&r.error)||'')?' Add an API key in Settings.':'');
  RV.busy=false;paintDebrief();const e=$('#chdi');if(e)e.focus();
}
function results(){
  const qs=C.qs,ok=qs.filter(x=>x.ok).length,missed=qs.filter(x=>!x.ok).map(x=>x.q.id),label=C.cat.label;
  app().innerHTML=`<h1>Challenge complete</h1><p class="sub">${esc(label)}</p>
   <div class="card"><div class="big">${ok} / ${qs.length}</div><div class="cnt">${ok===qs.length?'Perfect. Keep asking “what is the safest thing to do first?”':ok>=qs.length*0.7?'Solid. Look at the ones you missed and find the safety issue you skipped.':'Good practice. For each miss, ask what could harm this client next, then what the nurse must do first.'}</div></div>
   <div class="card" id="chdbg"></div>
   ${qs.map((t,i)=>`<div class="card" style="border-left:4px solid var(--${t.ok?'ok':'bad'})"><b>${t.ok?'✔':'✘'} Question ${i+1}</b><div style="white-space:pre-line;margin:4px 0">${esc(t.q.q.length>220?t.q.q.slice(0,217)+'…':t.q.q)}</div>
     <div class="cnt">Your reasoning: ${esc(t.guessed&&!t.text.trim()?'(not sure)':t.text||'(none)')}</div>${t.feedback?`<details><summary style="cursor:pointer">Coach feedback</summary><div class="rat">${fmt(t.feedback)}</div></details>`:''}</div>`).join('')}
   <button class="p" style="width:100%" id="chag">New challenge</button>${missed.length&&window.practiceIds?`<button style="width:100%;margin-top:10px" id="chms">Practice the ${missed.length} I missed (normal mode)</button>`:''}<button style="width:100%;margin-top:10px" id="chhm">Back to Practice</button>`;
  RV={qs,chat:[],busy:false,err:'',text:''};C=null;paintDebrief();const on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
  on('#chag',setup);on('#chms',()=>window.practiceIds(missed));on('#chhm',()=>window.practiceHome&&window.practiceHome());
}
window.challengeStart=setup;
})();
