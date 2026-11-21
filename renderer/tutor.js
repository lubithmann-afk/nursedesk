// Tutor tab: teach me a topic, or find my weak spots from my practice results and guide me.
// Everything except the lesson text comes from the app's own data (library search, practice questions, medications, trusted links).
(function(){
const T=window.TutorLogic,root=()=>document.getElementById('tutor');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const progress=()=>{try{return JSON.parse(localStorage.getItem('nur283_progress')||'null')||{a:{}}}catch(e){return{a:{}}}};
let S=null,decks=[],hasKey=true;
const loadDecks=async()=>{try{decks=await api.library()}catch(e){decks=[]}};
function fmt(text){
  let t=esc(text);
  t=t.replace(/\[([^\[\]]{3,140}?),\s*(slide|page)\s*(\d+)\]/gi,(m,label,kind,n)=>{
    const r=T.resolveCitation(label.replace(/&amp;/g,'&').replace(/&quot;/g,'"'),kind,n,decks);
    return r?`<a class="cite" data-d="${esc(r.deckId)}" data-n="${r.n}" title="Open this ${kind} in the Library">[${label}, ${kind} ${n}]</a>`:m;
  });
  t=t.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
  const out=[];let list=false;
  for(const line of t.split('\n')){
    const b=/^\s*(?:[-•*]|\d+\.)\s+(.*)$/.exec(line);
    if(b){if(!list){out.push('<ul>');list=true}out.push('<li>'+b[1]+'</li>')}
    else{if(list){out.push('</ul>');list=false}out.push(line.trim()?'<p>'+line+'</p>':'')}
  }
  if(list)out.push('</ul>');return out.join('');
}
// ---------------- home
async function home(){
  await loadDecks();try{hasKey=(await api.getSettings()).hasKey}catch(e){}
  const QD=window.QD;if(!QD){root().innerHTML='<h1>Tutor</h1><p class="sub">The tutor needs the question data, which did not load.</p>';return}
  const W=T.weakSpots(QD,progress());
  const row=t=>`<div class="tr"><div class="h"><b>${esc(t.name)}</b><span class="pill ${t.pct>=75?'g':''}">${Math.round(t.pct)}%</span></div>
    <div class="cnt">${t.c} of ${t.n} answers right · ${t.wrong} still wrong${t.mr?` · ${t.mr} you marked “I knew it, I just didn’t read everything”`:''}</div>
    <button class="p tstudy" data-i="${t.i}" style="margin-top:6px">Study this with the tutor</button></div>`;
  const weakHtml=W.answered===0?'<div class="cnt">Answer some questions in Practice first. Then I can see where you are weak and guide you.</div>'
    :W.weak.length?W.weak.slice(0,5).map(row).join('')
    :`<div class="cnt" style="margin-bottom:8px">Nothing is below 75% yet. Here are your lowest topics anyway:</div>${W.rest.slice(0,3).map(row).join('')}`;
  root().innerHTML=`<h1>Tutor</h1><p class="sub">Ask me to teach you a topic, or let me look at your practice results and guide you through what you are weakest at. Lessons come from your class materials first, with links to the exact slides.</p>
   ${hasKey?'':`<div class="card" style="border-color:var(--bad)"><b>The tutor’s written lessons need your API key.</b><div class="cnt" style="margin-top:6px">Everything else below still works without it: your weak spots, links to the right slides and medications, practice questions and trusted sources. You can also use the ChatGPT or Claude buttons inside a lesson.</div></div>`}
   <div class="card"><h2>Teach me a topic</h2><div class="row2" style="margin:0"><input type="text" id="tt" placeholder="e.g. heart failure, delegation, lithium, acid-base balance"><button class="p" id="tgo">Teach me</button></div>
    <div class="chips" style="margin-top:8px">${['Prioritization and delegation','Heart failure','Acid-base balance','Medication safety','Infection control'].map(x=>`<button class="tchip" data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
   <div class="card"><h2>My weak spots</h2>${weakHtml}
    ${W.weak.length?`<button class="p" id="tguide" style="width:100%;margin-top:10px">Guide me: start with my weakest topic</button>`:''}</div>`;
  const go=q=>{q=String(q||'').trim();if(q)start({topic:q})};
  document.getElementById('tgo').onclick=()=>go(document.getElementById('tt').value);
  document.getElementById('tt').onkeydown=e=>{if(e.key==='Enter')go(e.target.value)};
  root().querySelectorAll('.tchip').forEach(b=>b.onclick=()=>go(b.dataset.q));
  root().querySelectorAll('.tstudy').forEach(b=>b.onclick=()=>{const t=W.all.find(x=>x.i===+b.dataset.i);start({topic:t.name,spot:t})});
  const g=document.getElementById('tguide');if(g)g.onclick=()=>{const t=W.weak[0];start({topic:t.name,spot:t})};
}
// ---------------- a tutoring session
async function start(o){
  const QD=window.QD;await loadDecks();try{hasKey=(await api.getSettings()).hasKey}catch(e){}
  const spot=o.spot||null,missedQs=spot?spot.missed.map(id=>QD.bank.find(q=>q.id===id)).filter(Boolean):[];
  S={topic:o.topic,spot,hist:[],busy:false,err:'',hits:[],meds:[],qs:T.questionsFor(QD,{topic:spot?spot.i:undefined,missed:spot?spot.missed:undefined,query:spot?undefined:o.topic,limit:10}),missedQs};
  draw();                                                       // show the page at once, fill the materials as they arrive
  // library: the topic itself plus the questions the student missed
  const qs=[o.topic,...missedQs.slice(0,3).map(q=>q.q.replace(/\s+/g,' ').split(' ').slice(0,14).join(' '))];const seen=new Set();
  for(const q of qs){let r=[];try{r=await api.search(q)}catch(e){}
    r.forEach(h=>{const k=h.deckId+':'+h.n;if(!seen.has(k)&&S.hits.length<8&&h.unit!=='note'){seen.add(k);S.hits.push(h)}})}
  const blob=(o.topic+' '+S.hits.map(h=>h.title+' '+(h.body||'').slice(0,400)).join(' ')).toLowerCase();
  try{S.meds=window.MEDS.meds.filter(m=>m.name.length>=5&&blob.includes(m.name.toLowerCase())).slice(0,6)}catch(e){}
  draw();
  if(hasKey)ask(T.lessonPrompt({topic:o.topic,pct:spot&&spot.pct,missed:missedQs.slice(0,5)}),true);
}
async function ask(text,first){
  if(!S||S.busy)return;S.hist.push({role:'user',content:text,hidden:!!first});S.busy=true;S.err='';draw();
  let r;try{r=await api.ask(S.hist.map(m=>({role:m.role,content:m.content})),T.TUTOR_RULES,{web:false})}catch(e){r={ok:false,error:String(e)}}
  if(r&&r.ok&&r.text)S.hist.push({role:'assistant',content:r.text.replace(/\[\[ASK_WEB\]\]/g,'').trim()});else S.err=(r&&r.error)||'No answer.';
  S.busy=false;draw();
}
function draw(){
  if(!S)return;
  const links=T.trustedLinks(S.topic);
  const mats=S.hits.length?S.hits.map(h=>`<li class="mf"><span><b>${esc(h.title||'(untitled)')}</b></span><span class="src">${esc(h.deck)} · ${esc(h.unit||'slide')} ${h.n} <a class="tgo" data-d="${esc(h.deckId)}" data-n="${h.n}">Open</a></span></li>`).join(''):'<li class="cnt">Looking through your library…</li>';
  const chat=S.hist.filter(m=>!m.hidden).map(m=>`<div class="cm ${m.role==='user'?'user':'assistant'}">${m.role==='user'?esc(m.content):fmt(m.content)}</div>`).join('');
  root().innerHTML=`<div class="row2"><button id="tbk">← Tutor</button></div>
   <h1 style="margin-top:0">${esc(S.topic)}</h1>${S.spot?`<p class="sub">You are at about ${Math.round(S.spot.pct)}% on this topic with ${S.spot.wrong} question${S.spot.wrong===1?'':'s'} still wrong.</p>`:''}
   <div class="card"><h2>Your study path</h2>
    <div class="tstep"><b>1. Read</b><div class="cnt">The slides and pages in your library that cover this:</div><ul class="mfl">${mats}</ul>
      ${S.meds.length?`<div class="cnt" style="margin-top:6px">Medications that come up: ${S.meds.map(m=>`<a class="tmed" data-n="${esc(m.name)}">${esc(m.name)}</a>`).join(', ')}</div>`:''}</div>
    <div class="tstep"><b>2. Practice</b><div class="cnt">${S.qs.length?`${S.qs.length} question${S.qs.length===1?'':'s'} on this${S.spot?', your missed ones first':''}.`:'No practice question matches this topic yet.'}</div>
      ${S.qs.length?`<button class="p" id="tprac" style="margin-top:6px">Practice these ${S.qs.length} questions</button>`:''}</div>
    <div class="tstep"><b>3. Learn it with your tutor</b><div class="cnt">Below. Ask anything; it cites your slides and says when your class materials do not cover something.</div></div>
    <div class="tstep"><b>4. Read more from trusted sources</b><ul class="mfl">${links.map(l=>`<li class="mf"><span><a class="tlk" data-u="${esc(l.url)}"><b>${esc(l.name)}</b></a></span><span class="src">${esc(l.why)}</span></li>`).join('')}</ul>
      <div class="cnt">These open in your browser. The app cannot check what is on them, so confirm the details there and compare with your class slides.</div></div></div>
   <div class="card"><h2>Your tutor</h2>
    ${hasKey?`<div class="cnote">The tutor teaches from your class materials and labels anything else. It can still make mistakes: check important facts against your slides.</div>`:`<div class="cnt">Add your API key in the Ask AI tab to get written lessons here, or take your class excerpts to ChatGPT or Claude:</div><div class="row2"><button id="tgpt">Ask in ChatGPT</button><button id="tcl">Ask in Claude</button></div><div class="cnt" id="thm"></div>`}
    <div class="log" id="tlog">${chat}${S.busy?'<div class="cnt">Your tutor is working…</div>':''}${S.err?`<div class="cnt">${esc(S.err)}${/No API key/i.test(S.err)?' Add one in the Ask AI tab.':''}</div>`:''}</div>
    ${hasKey?`<div class="row2" style="margin:8px 0 0"><input type="text" id="tin" placeholder="Answer the tutor, or ask a question…" ${S.busy?'disabled':''}><button class="p" id="tsend" ${S.busy?'disabled':''}>Send</button></div>
    <div class="chips" style="margin-top:8px">${['Explain it more simply','Give me an example','Quiz me','What would the exam ask?'].map(x=>`<button class="tchip2" data-q="${esc(x)}" ${S.busy?'disabled':''}>${esc(x)}</button>`).join('')}</div>`:''}</div>`;
  const R=root();
  document.getElementById('tbk').onclick=()=>{S=null;home()};
  const pr=document.getElementById('tprac');if(pr)pr.onclick=()=>{document.querySelector('[data-t=practice]').click();window.practiceIds&&window.practiceIds(S.qs.map(q=>q.id))};
  R.querySelectorAll('.tgo,.cite').forEach(a=>a.onclick=()=>window.gotoSlide(a.dataset.d,+a.dataset.n));
  R.querySelectorAll('.tmed').forEach(a=>a.onclick=()=>window.medsOpen&&window.medsOpen(a.dataset.n));
  R.querySelectorAll('.tlk').forEach(a=>a.onclick=()=>api.openExternal(a.dataset.u));
  const tin=document.getElementById('tin');const send=()=>{const v=tin.value.trim();if(v){tin.value='';ask(v)}};
  if(tin){tin.onkeydown=e=>{if(e.key==='Enter')send()};document.getElementById('tsend').onclick=send;R.querySelectorAll('.tchip2').forEach(b=>b.onclick=()=>ask(b.dataset.q))}
  for(const [id,site] of [['tgpt','chatgpt'],['tcl','claude']]){const b=document.getElementById(id);if(b)b.onclick=async()=>{
    const p=await window.handoff.fromSearch(S.topic);document.getElementById('thm').textContent=await window.handoff.send(site,p.replace(/QUESTION:.*\n/,'QUESTION: Teach me '+S.topic+' step by step the way my class teaches it (NCLEX-RN style, safety and priorities first), then ask me one short check question.\n'))}}
  const log=document.getElementById('tlog');if(log)log.scrollTop=log.scrollHeight;
}
window.tutorInit=()=>{};window.tutorShow=()=>{if(!S)home()};
})();
