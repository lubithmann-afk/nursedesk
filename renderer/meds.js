// Medications tab. Tabs: Main (a list you choose with check boxes), PowerPoints, Galen quizzes, ATI guide, and Misc (only if something is left over).
// Data comes from data/meds.js (built by tools/meds/build_meds.py).
(function(){
const root=()=>document.getElementById('meds');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const short=n=>n.replace(/\bGalen\s+(Live Review-RN|System Focused Review)\s*-\s*/i,'').replace(/\s+Student$/,'');
let q='',openCats=new Set(),cur=null,scroll=0,view='main',choosing=false,sel=null;
const D=()=>window.MEDS;
const isAti=x=>/^ati-/.test(x.u);
const SRC={ppt:m=>m.s,quiz:m=>m.q.length>0,ati:m=>m.a,misc:m=>!(m.s||m.q.length||m.a)};
const TABS=[['main','Main'],['ppt','PowerPoints'],['quiz','Galen quizzes'],['ati','ATI guide'],['misc','Misc']];
// ---- which medications are on the Main tab (saved on this PC). First time: everything found in a class slide or a Galen quiz.
const SEL_KEY='nd_meds_main';
function loadSel(){
  if(sel)return sel;
  try{const a=JSON.parse(localStorage.getItem(SEL_KEY));if(Array.isArray(a)){sel=new Set(a);return sel}}catch(e){}
  sel=new Set(D().meds.filter(m=>m.s||m.q.length).map(m=>m.name));saveSel();return sel;
}
function saveSel(){try{localStorage.setItem(SEL_KEY,JSON.stringify([...sel]))}catch(e){}}
const hasMisc=()=>D().meds.some(SRC.misc);
const pool=()=>{const d=D();return view==='main'?d.meds.filter(m=>loadSel().has(m.name)):d.meds.filter(SRC[view])};
const atiDeck=()=>Object.keys(D().decks).find(k=>/^ati-/.test(k));
const viewTabs=()=>`<div class="row2" style="margin:0 0 12px;flex-wrap:wrap">${TABS.filter(([k])=>k!=='misc'||hasMisc()).map(([k,t])=>`<button class="vt ${view===k?'p':''}" data-v="${k}">${t}</button>`).join('')}</div>`;
function hl(text,names){
  let s=esc(text);if(!names||!names.length)return s;
  const rx=new RegExp('(?<![A-Za-z0-9])('+names.slice().sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+').replace(/'/g,"['’]")).join('|')+')(?![A-Za-z0-9])','gi');
  return s.replace(rx,'<mark>$1</mark>');
}
function qIds(ms){return[...new Set(ms.flatMap(m=>m.q))]}
const isExtra=m=>!(m.s||m.q.length||m.a);
const badges=m=>[m.s?'PPT':'',m.q.length?'Quiz':'',m.a?'ATI':'',isExtra(m)?'Misc':''].filter(Boolean).map(b=>`<span class="chip" style="margin:0 4px 0 0;font-size:11px">${b}</span>`).join('');
function medRow(m){return `<div class="mrow" data-m="${m.i}"><div><b>${esc(cap(m.name))}</b>${m.brands.length?` <span class="b">(${esc(m.brands.join(', '))})</span>`:''}</div><div class="cnt">${esc(view==='quiz'?m.q.length+' question'+(m.q.length>1?'s':''):m.cls)}</div></div>`}
function match(m,t){const h=(m.name+' '+m.brands.join(' ')+' '+m.cls+' '+m.cat).toLowerCase();return t.split(/\s+/).every(w=>h.includes(w))}
const INTRO={
  main:'Your own list. Tap <b>Choose medications</b> to decide which ones show up here. Each one shows its classification, mechanism of action, safe administration, side effects, lab monitoring and nursing interventions, from your class slides and the ATI guide where they say something, plus a labelled general reference.',
  ppt:'Medications that appear in your Galen PowerPoints. Lines are copied word for word from the slides, followed by a labelled general reference.',
  quiz:'Every medication that comes up in the Galen practice tests, weekly quizzes and the questions inside the class slides. Open one to read each question, its answer and the rationale, or practice just those questions.',
  ati:'Every medication the ATI study guide mentions, with only what that guide says, copied word for word and sorted into the six headings.',
  misc:'Common medications that are NOT in your PowerPoints, the Galen quizzes or the ATI guide. Each has a general reference I wrote from standard drug references (FDA labeling, MedlinePlus, nursing pharmacology texts). It is not copied from those sources and has not been checked drug by drug, so double check it. No doses.'};
const FOOT={main:n=>`${n} medication${n===1?'':'s'} on your Main tab.`,ppt:n=>`${n} medication${n===1?'':'s'} found in your Galen PowerPoints.`,quiz:n=>`${n} medication${n===1?'':'s'} found in the Galen practice questions.`,ati:n=>`${n} medication${n===1?'':'s'} mentioned in the ATI study guide.`,misc:n=>`${n} medication${n===1?'':'s'} not found in the other tabs.`};
function home(){
  const d=D();if(!d){root().innerHTML='<h1>Medications</h1><p class="sub">Medication data is missing from this build.</p>';return}
  if(view==='main'&&choosing)return chooser();
  const t=q.trim().toLowerCase();
  let body='';
  if(t){
    const hits=pool().filter(m=>match(m,t));
    body=hits.length?d.cats.map(c=>{const ms=c.c.flatMap(x=>x.m).map(i=>d.meds[i]).filter(m=>hits.includes(m));return ms.length?`<div class="mcls">${esc(c.n)}</div>${ms.map(medRow).join('')}`:''}).join(''):'<div class="cnt">No medication here matches that.</div>';
  }else{
    const ok=new Set(pool().map(m=>m.i));
    body=d.cats.map(c=>{
      const ms=c.c.flatMap(x=>x.m).filter(i=>ok.has(i)).map(i=>d.meds[i]);if(!ms.length)return '';
      const qs=view==='ati'||view==='misc'?[]:qIds(ms);
      return `<details class="mcat" data-c="${esc(c.n)}" ${openCats.has(c.n)?'open':''}><summary>${esc(c.n)}<span class="cnt">${ms.length} medication${ms.length>1?'s':''}</span></summary><div class="mbody">
        ${qs.length?`<button class="pc" data-c="${esc(c.n)}">Practice ${qs.length} question${qs.length>1?'s':''} on this category</button>`:''}
        ${c.c.map(x=>{const mm=x.m.filter(i=>ok.has(i));return mm.length?`<div class="mcls">${esc(x.n)}</div>${mm.map(i=>medRow(d.meds[i])).join('')}`:''}).join('')}</div></details>`}).join('');
    if(!body)body=view==='main'?'<div class="card"><div class="cnt">Nothing is on your Main tab yet. Tap <b>Choose medications</b> to pick some.</div></div>':'<div class="cnt">Nothing here.</div>';
  }
  const n=pool().length;
  root().innerHTML=`<h1>Medications</h1>${viewTabs()}<p class="sub">${INTRO[view]}</p>
   <div class="mtop"><input type="text" id="mq" placeholder="Search by name, brand, class or category (e.g. Lasix, beta blocker, antidote)" value="${esc(q)}">
   ${view==='main'?'<button class="p" id="chs">Choose medications</button>':''}${view==='ati'&&d.suffix?'<button id="suf">Drug class endings (ATI guide)</button>':''}</div>${body}
   <p class="cnt" style="margin-top:14px">${FOOT[view](n)}</p>`;
  root().querySelectorAll('.vt').forEach(b=>b.onclick=()=>{view=b.dataset.v;choosing=false;home()});
  const ch=document.getElementById('chs');if(ch)ch.onclick=()=>{choosing=true;q='';home()};
  const mq=document.getElementById('mq');mq.oninput=()=>{q=mq.value;const p=mq.selectionStart;home();const n=document.getElementById('mq');n.focus();n.setSelectionRange(p,p)};
  const suf=document.getElementById('suf');if(suf)suf.onclick=()=>window.gotoSlide(d.suffix.d,d.suffix.n);
  root().querySelectorAll('.mrow').forEach(e=>e.onclick=()=>{scroll=document.getElementById('pane-meds').scrollTop;detail(+e.dataset.m)});
  root().querySelectorAll('details.mcat').forEach(e=>e.addEventListener('toggle',()=>{e.open?openCats.add(e.dataset.c):openCats.delete(e.dataset.c)}));
  root().querySelectorAll('button.pc').forEach(b=>b.onclick=ev=>{ev.preventDefault();const c=d.cats.find(x=>x.n===b.dataset.c);const ok=new Set(pool().map(m=>m.i));practice(qIds(c.c.flatMap(x=>x.m).filter(i=>ok.has(i)).map(i=>d.meds[i])))});
}
// ---- choose which medications are on the Main tab
function chooser(){
  const d=D(),S=loadSel(),t=q.trim().toLowerCase();
  const list=m=>`<label class="row" style="margin:0 0 5px"><input type="checkbox" class="cb" data-n="${esc(m.name)}" ${S.has(m.name)?'checked':''}><div style="flex:1"><b>${esc(cap(m.name))}</b>${m.brands.length?` <span class="b">(${esc(m.brands.join(', '))})</span>`:''} <span class="cnt">${esc(m.cls)}</span></div><span>${badges(m)}</span></label>`;
  const cats=d.cats.map(c=>{const ms=c.c.flatMap(x=>x.m).map(i=>d.meds[i]).filter(m=>!t||match(m,t));if(!ms.length)return '';
    const on=ms.filter(m=>S.has(m.name)).length;
    return `<details class="mcat" data-cc="${esc(c.n)}" ${t||openCats.has('c:'+c.n)?'open':''}><summary>${esc(c.n)}<span class="cnt">${on} of ${ms.length} chosen</span></summary><div class="mbody">
      <div class="row2" style="margin:0 0 8px"><button class="ca" data-c="${esc(c.n)}" data-on="1">Choose all</button><button class="ca" data-c="${esc(c.n)}" data-on="0">Clear all</button></div>${ms.map(list).join('')}</div></details>`}).join('');
  root().innerHTML=`<div class="row2"><button class="p" id="chdone">Done</button></div><h1 style="margin-top:0">Choose medications for the Main tab</h1>
   <p class="sub">Tick the medications you want on your Main tab. PPT = in your PowerPoints, Quiz = in the Galen quizzes, ATI = in the ATI guide. Your choices are saved on this PC.</p>
   <div class="row2" style="margin:0 0 8px;flex-wrap:wrap"><button class="qa" data-k="ppt">Add all PowerPoint meds</button><button class="qa" data-k="quiz">Add all Galen quiz meds</button><button class="qa" data-k="ati">Add all ATI meds</button><button class="qa" data-k="all">Choose everything</button><button class="qa" data-k="none">Clear everything</button></div>
   <div class="mtop"><input type="text" id="mq" placeholder="Search medications" value="${esc(q)}"></div>
   <div class="cnt" id="chn" style="margin-bottom:8px">${S.size} chosen</div>${cats||'<div class="cnt">No medication matches that.</div>'}`;
  const upd=()=>{const e=document.getElementById('chn');if(e)e.textContent=S.size+' chosen'};
  root().querySelectorAll('.cb').forEach(c=>c.onchange=()=>{c.checked?S.add(c.dataset.n):S.delete(c.dataset.n);saveSel();upd()});
  root().querySelectorAll('.ca').forEach(b=>b.onclick=()=>{const c=d.cats.find(x=>x.n===b.dataset.c);c.c.flatMap(x=>x.m).map(i=>d.meds[i]).filter(m=>!t||match(m,t)).forEach(m=>b.dataset.on==='1'?S.add(m.name):S.delete(m.name));saveSel();chooser()});
  root().querySelectorAll('.qa').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k==='none')S.clear();else d.meds.filter(m=>k==='all'||SRC[k](m)).forEach(m=>S.add(m.name));saveSel();chooser()});
  root().querySelectorAll('details.mcat').forEach(e=>e.addEventListener('toggle',()=>{const k='c:'+e.dataset.cc;e.open?openCats.add(k):openCats.delete(k)}));
  document.getElementById('chdone').onclick=()=>{choosing=false;q='';home()};
  const mq=document.getElementById('mq');mq.oninput=()=>{q=mq.value;const p=mq.selectionStart;chooser();const n=document.getElementById('mq');n.focus();n.setSelectionRange(p,p)};
}
function practice(ids){document.querySelector('[data-t=practice]').click();window.practiceIds&&window.practiceIds(ids)}
const FIELDS=[['cls','Drug classification'],['moa','Mechanism of action'],['adm','Safe administration'],['se','Side effects'],['labs','Lab monitoring'],['nsg','Nursing interventions']];
const NAMES=m=>[m.name,...m.brands];
function srcLine(m,x){
  const d=D(),[did,n]=x.u.split(':'),dk=d.decks[did],page=dk.k==='page';
  return `<li class="mf"><span>${hl(x.x,NAMES(m))}</span><span class="src">${esc(page?'ATI guide p. '+n:short(dk.n)+' · slide '+n)} <a data-d="${esc(did)}" data-n="${n}">Open</a></span></li>`;
}
const PT=['Comp 1','Comp 2','Comp 3','Comp Bible'];
const srcName=i=>{const S=(window.QD&&window.QD.src||[])[i]||'';return /^Weekly quiz/.test(S)?S:/^Class slides/.test(S)?S.replace(/^Class slides\s*[–-]\s*/,'Class slide questions – '):(PT[i]||S)};
function qCard(m,id){
  const b=(window.QD&&window.QD.bank||[]).find(z=>z.id===id);if(!b)return '';
  const ans=(Array.isArray(b.a)?b.a:[b.a]).map(i=>b.o[i]).join(' / ');
  return `<div class="mq"><div class="cnt" style="margin-bottom:4px">${esc(srcName(b.s))}</div><div style="white-space:pre-line">${hl(b.q,NAMES(m))}</div><div class="ans">Answer: ${hl(ans,NAMES(m))}</div><details><summary>Why</summary><div style="margin-top:6px">${hl(b.r||'',NAMES(m)).replace(/\n/g,'<br>')}</div></details></div>`;
}
const head=(m,i)=>`<div class="row2"><button id="bk">← Medications</button></div>${viewTabs()}
   <h1 style="margin-top:0">${esc(cap(m.name))}</h1>
   <p class="sub">${m.brands.length?`Also called: ${esc(m.brands.join(', '))}<br>`:''}<span class="chip">${esc(m.cat)}</span><span class="chip">${esc(m.cls)}</span> ${badges(m)}</p>`;
function wireHead(i){
  document.getElementById('bk').onclick=()=>{cur=null;home();document.getElementById('pane-meds').scrollTop=scroll};
  root().querySelectorAll('.vt').forEach(b=>b.onclick=()=>{view=b.dataset.v;choosing=false;detail(i)});
  root().querySelectorAll('.mf a').forEach(a=>a.onclick=()=>window.gotoSlide(a.dataset.d,+a.dataset.n));
  root().querySelectorAll('.atp').forEach(a=>a.onclick=()=>window.gotoSlide(atiDeck(),+a.dataset.n));
  root().querySelectorAll('.lk').forEach(a=>a.onclick=()=>window.api.openExternal(a.dataset.u));
  document.getElementById('pane-meds').scrollTop=0;
}
function detailQuiz(i){
  const d=D(),m=d.meds[i];cur=i;
  root().innerHTML=head(m,i)+`<p class="cnt">${m.q.length?`${m.q.length} practice question${m.q.length>1?'s':''} mention this medication. These are copied word for word from the Galen practice tests, weekly quizzes and class slides.`:'No practice question mentions this medication.'}</p>
   ${m.q.length?`<button class="p" id="pq" style="margin:6px 0 12px">Practice these ${m.q.length} question${m.q.length>1?'s':''}</button>`:''}
   ${m.q.map(id=>qCard(m,id)).join('')}`;
  const pq=document.getElementById('pq');if(pq)pq.onclick=()=>practice(m.q);
  wireHead(i);
}
const TRUST='This medication was not found in your PowerPoints, the Galen quizzes or the ATI guide, so everything below is a general reference I wrote from standard drug references (FDA labeling, MedlinePlus and nursing pharmacology texts). It is not copied from them and I could not check it drug by drug against a live source. It has no doses. Always check your course drug guide, the package labeling or the provider’s order.';
const lookups=m=>`<div class="mfh">Look it up in a trusted source</div><div class="row2" style="margin:0 0 6px"><a class="lk" data-u="https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&query=${encodeURIComponent(m.name)}" style="color:var(--acc);cursor:pointer">MedlinePlus (NIH)</a> · <a class="lk" data-u="https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(m.name)}" style="color:var(--acc);cursor:pointer">DailyMed (FDA labels)</a></div>`;
// ---- medication page: plain words first, then what the FDA label says (looked up), then your own class material
const SECT=[['cls','What it is','Drug classification'],['moa','How it works','Mechanism of action'],['adm','How to give it safely','Safe administration'],['se','Side effects','Side effects'],['labs','Labs to watch','Lab monitoring'],['nsg','What the nurse does','Nursing interventions']];
const FDA=()=>window.FDA||{};
const fdaLink=(f)=>f&&f.meta?'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid='+encodeURIComponent(f.meta.set):'';
const fdaDate=f=>{const d=f&&f.meta&&f.meta.date;return d&&d.length===8?d.slice(0,4)+'-'+d.slice(4,6):''};
function glance(m,f){
  const g=k=>m.f[k].g;const pts=[g('nsg')[0],g('adm')[0],g('se')[0]].filter(Boolean).slice(0,3);
  return `<div class="glance"><h2>At a glance</h2>
   <div class="gl"><b>What it is for</b><span>${esc(g('cls')[0]||'')}</span></div>
   ${pts.length?`<div class="gl"><b>Most important to know</b><ul>${pts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
   ${g('labs').length?`<div class="gl"><b>Labs to watch</b><span>${esc(g('labs').slice(0,3).join(' · '))}</span></div>`:''}
   ${f&&f.box?`<div class="boxw"><b>FDA boxed warning</b> (the strongest safety warning an FDA label can carry)<div>${esc(f.box)}</div></div>`:''}</div>`;
}
function detail(i){
  if(view==='quiz'&&D().meds[i].q.length)return detailQuiz(i);
  if(view==='quiz')view='main';
  const d=D(),m=d.meds[i];cur=i;
  const extra=isExtra(m),f=FDA()[m.name];
  const showSlides=view!=='ati',showAti=view==='main'||view==='ati',showPlain=view!=='ati';
  const linesOf=(k,ati)=>m.f[k].m.filter(x=>isAti(x)===ati);
  const block=(title,L)=>L.length?`<details class="mat" open><summary>${title} (${L.length})</summary><ul class="mfl">${L.map(x=>srcLine(m,x)).join('')}</ul></details>`:'';
  const sec=([k,t,official])=>{
    const S=showSlides?linesOf(k,false):[],A=showAti?linesOf(k,true):[],plain=showPlain?m.f[k].g:[],fl=showPlain&&f&&f[k]?f[k]:[];
    const hasMat=S.length+A.length>0;
    const plainHtml=plain.length?`<ul class="plain">${plain.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
    const fdaHtml=fl.length?`<details class="fda" ${hasMat?'':'open'}><summary>What the FDA drug label says (looked up)</summary><ul class="mfl">${fl.map(x=>`<li class="mf"><span>${esc(x)}</span></li>`).join('')}</ul><div class="cnt">Source: official FDA label${f.meta.t?' for '+esc(f.meta.t):''}${fdaDate(f)?', updated '+fdaDate(f):''}. <a class="lk" data-u="${esc(fdaLink(f))}">Open the full label</a></div></details>`:'';
    const mat=block('From your class slides',S)+block('From the ATI study guide',A);
    const none=!plainHtml&&!fdaHtml&&!mat?`<div class="mfn">${view==='ati'?'The ATI study guide says nothing about this under this heading.':'Nothing found for this heading.'}</div>`:'';
    return `<section class="msc"><h2 class="msec">${t} <small>${official}</small></h2>${plainHtml}${mat}${fdaHtml}${none}</section>`;
  };
  const note={main:'Plain-language summaries are my own wording. Lines from your slides and the ATI guide are copied word for word, and the FDA label text was looked up. Tap Open to see where something came from.',
    ppt:'Plain-language summaries are my own wording. Lines from your PowerPoints are copied word for word. FDA label text was looked up.',
    ati:'Everything below is copied word for word from the ATI study guide. Tap Open to see the page.',
    misc:'This medication is not in your PowerPoints, the Galen quizzes or the ATI guide.'}[view];
  const about=`<details class="about"><summary>About these sources</summary><div class="cnt">${esc(note)} None of it gives doses. Always check your course drug guide or the provider’s order for doses and parameters.${extra?' '+esc(TRUST):''}</div></details>`;
  root().innerHTML=head(m,i)+(showPlain?glance(m,f):'')+about+(extra?lookups(m):'')+`
   ${showAti&&m.ap&&m.ap.length&&atiDeck()?`<div class="mfh">Pages of the ATI study guide that mention it</div><div class="row2" style="margin:0 0 6px">${m.ap.map(n=>`<a class="atp" data-n="${n}" style="color:var(--acc);cursor:pointer">p. ${n}</a>`).join(' · ')}</div>`:''}
   ${SECT.map(sec).join('')}
   ${view==='main'&&m.q.length?`<details class="mqs" style="margin-top:14px"><summary style="cursor:pointer;font-weight:600">Galen practice questions that mention it (${m.q.length})</summary><div style="margin-top:8px">${m.q.map(id=>qCard(m,id)).join('')}</div></details>`:''}
   <div class="row2" style="margin-top:14px"><span class="cnt">Study this drug with your own account:</span><button id="hgpt">Ask ChatGPT</button><button id="hcl">Ask Claude</button></div><div class="cnt" id="hmsg"></div>
   ${m.q.length&&view!=='ati'?`<button class="p" id="pq" style="margin-top:16px">Practice ${m.q.length} question${m.q.length>1?'s':''} on this medication</button>`:''}`;
  for(const [id,site] of [['hgpt','chatgpt'],['hcl','claude']])document.getElementById(id).onclick=async()=>{
    const lab=x=>x.x+' ('+(D().decks[x.u.split(':')[0]].k==='page'?'ATI guide p. '+x.u.split(':')[1]:short(D().decks[x.u.split(':')[0]].n)+' slide '+x.u.split(':')[1])+')';
    const ex=FIELDS.map(([k,t])=>({src:t,text:m.f[k].m.filter(x=>view==='ati'?isAti(x):view==='main'?true:!isAti(x)).map(lab).join('\n')})).filter(e=>e.text);
    document.getElementById('hmsg').textContent=await window.handoff.send(site,window.handoff.prompt(`Teach me ${cap(m.name)} (${m.cls}) in simple words: classification, mechanism of action, safe administration, side effects, lab monitoring and nursing interventions, then quiz me with 3 NCLEX-style questions.`,ex))};
  const pq=document.getElementById('pq');if(pq)pq.onclick=()=>practice(m.q);
  wireHead(i);
}
window.medsInit=()=>home();window.medsShow=()=>{};
})();
