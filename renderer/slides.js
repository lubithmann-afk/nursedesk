(function(){
const root=()=>document.getElementById('slides');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let q='';
function hl(text,qq){const ws=[...new Set((qq.toLowerCase().match(/[a-z0-9]{3,}/g)||[]))];let s=esc(text);ws.forEach(w=>{s=s.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')});return s}
// ---- medical terms glossary (a fold in the Library)
let gOpen=false,gq='',gcat='all',gmine=false;
const gl=()=>window.GLOSSARY;
const gkey=t=>t.t.toLowerCase().replace(/^-+/,'');
function gFind(q,cat,mine){
  const G=gl();if(!G)return[];const toks=q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let list=G.terms.filter(t=>(cat==='all'||t.c===cat)&&(!mine||t.m));
  if(!toks.length)return list;
  const out=[];
  for(const t of list){const term=t.t.toLowerCase(),hay=term+' '+t.d.toLowerCase();if(!toks.every(w=>hay.includes(w)))continue;
    const w=toks.join(' ');out.push([term===w?4:term.startsWith(w)?3:term.includes(w)?2:1,t])}
  return out.sort((a,b)=>b[0]-a[0]||gkey(a[1]).localeCompare(gkey(b[1]))).map(x=>x[1]);
}
const gEntry=t=>`<div style="padding:8px 0;border-bottom:1px solid var(--line)"><b>${esc(t.t)}</b> <span>${esc(t.d)}</span>${t.m?`<div class="cnt" style="margin-top:2px">From your materials: ${esc(t.m.s)} · ${t.m.k==='page'?'page':'slide'} ${t.m.n} · <a data-gd="${esc(t.m.d)}" data-gn="${t.m.n}" style="color:var(--acc);cursor:pointer">Open</a></div>`:''}</div>`;
function glossBody(){
  const G=gl();if(!G)return'<div class="cnt">The glossary is missing from this build.</div>';
  const list=gFind(gq,gcat,gmine),browsing=!gq.trim()&&gcat==='all';
  const counts=Object.fromEntries(G.cats.map(c=>[c,G.terms.filter(t=>t.c===c).length]));
  let body;
  if(!list.length)body='<div class="cnt" style="margin-top:8px">No term matches that.</div>';
  else if(browsing)body=G.cats.map(c=>{const ts=list.filter(t=>t.c===c).sort((a,b)=>gkey(a).localeCompare(gkey(b)));return ts.length?`<h3 style="margin:16px 0 4px;font-size:14px;color:var(--mut)">${esc(c)}</h3>${ts.map(gEntry).join('')}`:''}).join('');
  else body=(gq.trim()?list:list.slice().sort((a,b)=>gkey(a).localeCompare(gkey(b)))).map(gEntry).join('');
  return `<p class="sub" style="margin:8px 0">Standard definitions. Entries marked “From your materials” use the definition in your class slides or the ATI guide; the rest are general reference.</p>
   <div class="row2"><input type="text" id="gs" placeholder="Search terms or meanings (for example aphasia, -itis, hypo-)" value="${esc(gq)}"><select id="gc" class="dd" style="width:auto;margin:0;max-width:240px"><option value="all">All categories (${G.terms.length})</option>${G.cats.map(c=>`<option value="${esc(c)}" ${c===gcat?'selected':''}>${esc(c)} (${counts[c]})</option>`).join('')}</select></div>
   <label class="cnt" style="display:block;margin:2px 0 6px"><input type="checkbox" id="gm" ${gmine?'checked':''}> Only terms defined in my class materials</label>
   <div class="cnt">${list.length} term${list.length===1?'':'s'}</div>${body}`;
}
function drawGloss(){
  const el=document.getElementById('gbody');if(!el)return;el.innerHTML=glossBody();
  const s=document.getElementById('gs');s.oninput=()=>{gq=s.value;const p=s.selectionStart;drawGloss();const n=document.getElementById('gs');n.focus();n.setSelectionRange(p,p)};
  document.getElementById('gc').onchange=e=>{gcat=e.target.value;drawGloss()};
  document.getElementById('gm').onchange=e=>{gmine=e.target.checked;drawGloss()};
  el.querySelectorAll('[data-gd]').forEach(a=>a.onclick=()=>open(a.dataset.gd,+a.dataset.gn));
}
async function home(msg){
  const decks=await api.library();
  root().innerHTML=`<h1>Study library</h1><p class="sub">Class PowerPoints, the syllabus, study guides and more. Import PowerPoints or PDFs, then search everything instantly. The Ask AI tab uses this library first.</p>
  <div class="row2"><input type="text" id="sq" placeholder="Search the whole library (e.g. warfarin INR, chest tube, ATI retake policy)" value="${esc(q)}"><button class="p" id="imp">Import files</button></div>
  <div id="msg" class="cnt">${msg||''}</div>
  <details id="gloss" class="card" style="margin:10px 0" ${gOpen?'open':''}><summary style="cursor:pointer;font-weight:600">Medical terms (glossary)<span class="cnt" style="font-weight:400"> · ${gl()?gl().terms.length:0} terms</span></summary><div id="gbody"></div></details><div id="out"></div>`;
  const gd=document.getElementById('gloss');gd.addEventListener('toggle',()=>{gOpen=gd.open;if(gOpen)drawGloss()});if(gOpen)drawGloss();
  document.getElementById('imp').onclick=async()=>{const r=await api.importDecks();home((r.done.length?`Imported: ${r.done.join(', ')}. `:'')+(r.failed.length?`Failed: ${r.failed.join('; ')}`:''))};
  const sq=document.getElementById('sq');let t;sq.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{q=sq.value;draw(decks)},150)};
  draw(decks);
}
async function draw(decks){
  const out=document.getElementById('out');if(!out)return;
  if(q.trim()){const rs=await api.search(q);const gt=gFind(q,'all',false).slice(0,4);
    const gHtml=gt.length?`<div class="card" style="margin-bottom:10px"><b>Medical terms</b>${gt.map(gEntry).join('')}</div>`:'';
    out.innerHTML=gHtml+(rs.length?rs.map(r=>`<div class="res" data-d="${esc(r.deckId)}" data-n="${r.n}"><div class="m">${esc(r.deck)} · ${r.unit||'slide'} ${r.n}</div><b>${hl(r.title||'(untitled)',q)}</b><div>${hl(r.body.split('\n').slice(1,4).join(' · ').slice(0,240),q)}</div></div>`).join(''):(gHtml?'':'<div class="cnt">Nothing in the library matched. Try the Ask AI tab, which can also check trusted web sources.</div>'));
    out.querySelectorAll('.res').forEach(e=>e.onclick=()=>open(e.dataset.d,+e.dataset.n));out.querySelectorAll('[data-gd]').forEach(a=>a.onclick=()=>open(a.dataset.gd,+a.dataset.gn));return}
  out.innerHTML=decks.length?decks.map(d=>`<div class="res" data-d="${esc(d.id)}"><div style="display:flex;justify-content:space-between"><b>${esc(d.name)}</b><span class="cnt">${d.slides} ${d.kind==='pdf'?'pages':'slides'}</span></div></div>`).join(''):'<div class="card"><div class="cnt">Nothing in your library yet. Click “Import files” and pick your .pptx or .pdf files.</div></div>';
  out.querySelectorAll('.res').forEach(e=>e.onclick=()=>open(e.dataset.d));
}
async function open(id,n){
  const d=await api.deck(id);if(!d){home();return}
  const base='file:///'+d.dir.replace(/\\/g,'/').replace(/^\//,'');
  root().innerHTML=`<div class="row2"><button id="bk">← Library</button><button id="rm" style="margin-left:auto">Remove</button></div><h1>${esc(d.name)}</h1>
  ${d.slides.map(s=>`<div class="sl" id="s${s.n}"><div class="n">${d.kind==='pdf'?'Page':'Slide'} ${s.n}</div><h3>${esc(s.title||'(untitled)')}</h3>${s.text.length>1?'<ul>'+s.text.slice(1).map(x=>`<li>${esc(x).replace(/\n/g,'<br>')}</li>`).join('')+'</ul>':''}${s.images.map(i=>`<img src="${encodeURI(base+'/'+i)}" loading="lazy">`).join('')}${s.notes.length?`<div class="nt"><b>Notes:</b> ${esc(s.notes.join(' '))}</div>`:''}</div>`).join('')}`;
  document.getElementById('bk').onclick=()=>home();
  const rm=document.getElementById('rm');rm.onclick=()=>{rm.textContent='Tap again to remove';rm.onclick=async()=>{await api.removeDeck(id);home()}};
  if(n){const e=document.getElementById('s'+n);if(e){e.classList.add('hit');e.scrollIntoView({block:'start'})}}
}
window.slidesInit=()=>home();window.slidesShow=()=>{if(!root().querySelector('.sl'))home()};window.slidesOpen=open;
})();
