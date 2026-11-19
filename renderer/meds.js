// Medications tab: every medication found in the PowerPoints, ATI guide and practice questions,
// grouped by category and class. Data comes from data/meds.js (built by tools/meds/build_meds.py).
(function(){
const root=()=>document.getElementById('meds');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const short=n=>n.replace(/\bGalen\s+(Live Review-RN|System Focused Review)\s*-\s*/i,'').replace(/\s+Student$/,'');
let q='',openCats=new Set(),cur=null,scroll=0,view='slides';   // 'slides' = class slides + general reference, 'ati' = the ATI study guide only
const isAti=x=>/^ati-/.test(x.u);
const lines=(m,k)=>m.f[k].m.filter(x=>view==='ati'?isAti(x):!isAti(x));
const pool=()=>{const d=D();return view==='ati'?d.meds.filter(m=>m.a):d.meds.filter(m=>m.g)};   // main tab: found in Galen material (class slides or Galen questions). ATI tab: mentioned in the ATI guide.
const atiDeck=()=>Object.keys(D().decks).find(k=>/^ati-/.test(k));
const viewTabs=()=>`<div class="row2" style="margin:0 0 12px"><button class="vt ${view==='slides'?'p':''}" data-v="slides">Class slides &amp; reference</button><button class="vt ${view==='ati'?'p':''}" data-v="ati">ATI study guide</button></div>`;
const D=()=>window.MEDS;
function hl(text,names){
  let s=esc(text);if(!names||!names.length)return s;
  const rx=new RegExp('(?<![A-Za-z0-9])('+names.slice().sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+').replace(/'/g,"['’]")).join('|')+')(?![A-Za-z0-9])','gi');
  return s.replace(rx,'<mark>$1</mark>');
}
function qIds(ms){return[...new Set(ms.flatMap(m=>m.q))]}
function medRow(m){return `<div class="mrow" data-m="${m.i}"><div><b>${esc(cap(m.name))}</b>${m.brands.length?` <span class="b">(${esc(m.brands.join(', '))})</span>`:''}</div><div class="cnt">${esc(m.cls)}</div></div>`}
function match(m,t){const h=(m.name+' '+m.brands.join(' ')+' '+m.cls+' '+m.cat).toLowerCase();return t.split(/\s+/).every(w=>h.includes(w))}
function home(){
  const d=D();if(!d){root().innerHTML='<h1>Medications</h1><p class="sub">Medication data is missing from this build.</p>';return}
  const t=q.trim().toLowerCase();
  let body='';
  if(t){
    const hits=pool().filter(m=>match(m,t));
    body=hits.length?d.cats.map(c=>{const ms=c.c.flatMap(x=>x.m).map(i=>d.meds[i]).filter(m=>hits.includes(m));return ms.length?`<div class="mcls">${esc(c.n)}</div>${ms.map(medRow).join('')}`:''}).join(''):'<div class="cnt">No medication in your materials matches that.</div>';
  }else{
    body=d.cats.map(c=>{
      const ok=new Set(pool().map(m=>m.i));const ms=c.c.flatMap(x=>x.m).filter(i=>ok.has(i)).map(i=>d.meds[i]);if(!ms.length)return '';const qs=view==='ati'?[]:qIds(ms);
      return `<details class="mcat" data-c="${esc(c.n)}" ${openCats.has(c.n)?'open':''}><summary>${esc(c.n)}<span class="cnt">${ms.length} medication${ms.length>1?'s':''}</span></summary><div class="mbody">
        ${qs.length?`<button class="pc" data-c="${esc(c.n)}">Practice ${qs.length} question${qs.length>1?'s':''} on this category</button>`:''}
        ${c.c.map(x=>{const mm=x.m.filter(i=>ok.has(i));return mm.length?`<div class="mcls">${esc(x.n)}</div>${mm.map(i=>medRow(d.meds[i])).join('')}`:''}).join('')}</div></details>`}).join('');
  }
  const n=pool().length;
  root().innerHTML=`<h1>Medications</h1>${viewTabs()}<p class="sub">${view==='ati'?'Every medication the ATI study guide mentions, with only what that guide says, copied word for word and sorted into the six headings. Medications that appear only in the ATI guide are here and not in the other tab.':'Medications grouped by category. Each one shows its classification, mechanism of action, safe administration, side effects, lab monitoring and nursing interventions: lines from your class slides first, then a labelled general reference.'}</p>
   <div class="mtop"><input type="text" id="mq" placeholder="Search by name, brand, class or category (e.g. Lasix, beta blocker, antidote)" value="${esc(q)}">
   ${view==='ati'&&d.suffix?'<button id="suf">Drug class endings (ATI guide)</button>':''}</div>${body}
   <p class="cnt" style="margin-top:14px">${n} medication${n===1?'':'s'}${view==='ati'?' mentioned in the ATI study guide.':' that appear in your Galen class slides or practice questions. Medications that only the ATI guide mentions are in the ATI tab.'}</p>`;
  root().querySelectorAll('.vt').forEach(b=>b.onclick=()=>{view=b.dataset.v;home()});
  const mq=document.getElementById('mq');mq.oninput=()=>{q=mq.value;const p=mq.selectionStart;home();const n=document.getElementById('mq');n.focus();n.setSelectionRange(p,p)};
  const suf=document.getElementById('suf');if(suf)suf.onclick=()=>window.gotoSlide(d.suffix.d,d.suffix.n);
  root().querySelectorAll('.mrow').forEach(e=>e.onclick=()=>{scroll=document.getElementById('pane-meds').scrollTop;detail(+e.dataset.m)});
  root().querySelectorAll('details.mcat').forEach(e=>e.addEventListener('toggle',()=>{e.open?openCats.add(e.dataset.c):openCats.delete(e.dataset.c)}));
  root().querySelectorAll('button.pc').forEach(b=>b.onclick=ev=>{ev.preventDefault();const c=d.cats.find(x=>x.n===b.dataset.c);practice(qIds(c.c.flatMap(x=>x.m).map(i=>d.meds[i])))});
}
function practice(ids){document.querySelector('[data-t=practice]').click();window.practiceIds&&window.practiceIds(ids)}
const FIELDS=[['cls','Drug classification'],['moa','Mechanism of action'],['adm','Safe administration'],['se','Side effects'],['labs','Lab monitoring'],['nsg','Nursing interventions']];
const NAMES=m=>[m.name,...m.brands];
function srcLine(m,x){
  const d=D(),[did,n]=x.u.split(':'),dk=d.decks[did],page=dk.k==='page';
  return `<li class="mf"><span>${hl(x.x,NAMES(m))}</span><span class="src">${esc(page?'ATI guide p. '+n:short(dk.n)+' · slide '+n)} <a data-d="${esc(did)}" data-n="${n}">Open</a></span></li>`;
}
function detail(i){
  const d=D(),m=d.meds[i];cur=i;
  const sec=([k,t])=>{
    const f=m.f[k],L=lines(m,k),ati=view==='ati';
    const mine=L.length?`<div class="mfh">${ati?'From the ATI study guide':'From your class slides'}</div><ul class="mfl">${L.map(x=>srcLine(m,x)).join('')}</ul>`:`<div class="mfn">${ati?'Nothing about this under this heading in the ATI study guide.':'Nothing specific about this drug in your class slides.'}</div>`;
    const gen=!ati&&f.g.length?`<div class="mfh gen">General reference <span>(my own summary, not from your class materials)</span></div><ul class="mfl gen">${f.g.map(x=>`<li class="mf">${esc(x)}</li>`).join('')}</ul>`:'';
    return `<h2 class="msec">${t}</h2>${mine}${gen}`;
  };
  root().innerHTML=`<div class="row2"><button id="bk">← Medications</button></div>${viewTabs()}
   <h1 style="margin-top:0">${esc(cap(m.name))}</h1>
   <p class="sub">${m.brands.length?`Also called: ${esc(m.brands.join(', '))}<br>`:''}<span class="chip">${esc(m.cat)}</span><span class="chip">${esc(m.cls)}</span></p>
   <p class="cnt">${view==='ati'?'Everything below is copied word for word from the ATI study guide; tap Open to see the page. Nothing here is my own summary. Always check your course drug guide or the provider’s order for doses and parameters.':'Lines under “From your class slides” are copied word for word from your slides; tap Open to see them in place. The general reference fills gaps with standard teaching and has no doses. The ATI guide has its own tab above. Always check your course drug guide or the provider’s order for doses and parameters.'}</p>
   ${view==='ati'&&m.ap&&m.ap.length&&atiDeck()?`<div class="mfh">Pages of the ATI study guide that mention it</div><div class="row2" style="margin:0 0 6px">${m.ap.map(n=>`<a class="atp" data-n="${n}" style="color:var(--acc);cursor:pointer">p. ${n}</a>`).join(' · ')}</div>`:''}
   ${FIELDS.map(sec).join('')}
   <div class="row2" style="margin-top:14px"><span class="cnt">Study this drug with your own account:</span><button id="hgpt">Ask ChatGPT</button><button id="hcl">Ask Claude</button></div><div class="cnt" id="hmsg"></div>
   ${m.q.length&&view!=='ati'?`<button class="p" id="pq" style="margin-top:16px">Practice ${m.q.length} question${m.q.length>1?'s':''} on this medication</button>`:''}`;
  document.getElementById('bk').onclick=()=>{cur=null;home();document.getElementById('pane-meds').scrollTop=scroll};
  root().querySelectorAll('.vt').forEach(b=>b.onclick=()=>{view=b.dataset.v;detail(i)});
  for(const [id,site] of [['hgpt','chatgpt'],['hcl','claude']])document.getElementById(id).onclick=async()=>{
    const ex=FIELDS.map(([k,t])=>({src:t,text:lines(m,k).map(x=>x.x+' ('+(D().decks[x.u.split(':')[0]].k==='page'?'ATI guide p. '+x.u.split(':')[1]:short(D().decks[x.u.split(':')[0]].n)+' slide '+x.u.split(':')[1])+')').join('\n')})).filter(e=>e.text);
    document.getElementById('hmsg').textContent=await window.handoff.send(site,window.handoff.prompt(`Teach me ${cap(m.name)} (${m.cls}): classification, mechanism of action, safe administration, side effects, lab monitoring and nursing interventions, then quiz me with 3 NCLEX-style questions.`,ex))};
  const pq=document.getElementById('pq');if(pq)pq.onclick=()=>practice(m.q);
  root().querySelectorAll('.mf a').forEach(a=>a.onclick=()=>window.gotoSlide(a.dataset.d,+a.dataset.n));
  root().querySelectorAll('.atp').forEach(a=>a.onclick=()=>window.gotoSlide(atiDeck(),+a.dataset.n));
  document.getElementById('pane-meds').scrollTop=0;
}
window.medsInit=()=>home();window.medsShow=()=>{};
})();
