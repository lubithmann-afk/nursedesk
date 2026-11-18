(function(){
const root=()=>document.getElementById('slides');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let q='';
function hl(text,qq){const ws=[...new Set((qq.toLowerCase().match(/[a-z0-9]{3,}/g)||[]))];let s=esc(text);ws.forEach(w=>{s=s.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')});return s}
async function home(msg){
  const decks=await api.library();
  root().innerHTML=`<h1>Class slides</h1><p class="sub">Import your PowerPoints, then search every slide instantly.</p>
  <div class="row2"><input type="text" id="sq" placeholder="Search all slides (e.g. warfarin INR, chest tube, Rho(D))" value="${esc(q)}"><button class="p" id="imp">Import PowerPoints</button></div>
  <div id="msg" class="cnt">${msg||''}</div><div id="out"></div>`;
  document.getElementById('imp').onclick=async()=>{const r=await api.importDecks();home((r.done.length?`Imported: ${r.done.join(', ')}. `:'')+(r.failed.length?`Failed: ${r.failed.join('; ')}`:''))};
  const sq=document.getElementById('sq');let t;sq.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{q=sq.value;draw(decks)},150)};
  draw(decks);
}
async function draw(decks){
  const out=document.getElementById('out');if(!out)return;
  if(q.trim()){const rs=await api.search(q);
    out.innerHTML=rs.length?rs.map(r=>`<div class="res" data-d="${esc(r.deckId)}" data-n="${r.n}"><div class="m">${esc(r.deck)} · slide ${r.n}</div><b>${hl(r.title||'(untitled)',q)}</b><div>${hl(r.body.split('\n').slice(1,4).join(' · ').slice(0,240),q)}</div></div>`).join(''):'<div class="cnt">No slides matched. Try the Ask AI tab, which can also check trusted web sources.</div>';
    out.querySelectorAll('.res').forEach(e=>e.onclick=()=>open(e.dataset.d,+e.dataset.n));return}
  out.innerHTML=decks.length?decks.map(d=>`<div class="res" data-d="${esc(d.id)}"><div style="display:flex;justify-content:space-between"><b>${esc(d.name)}</b><span class="cnt">${d.slides} slides</span></div></div>`).join(''):'<div class="card"><div class="cnt">No presentations yet. Click “Import PowerPoints” and pick your .pptx files.</div></div>';
  out.querySelectorAll('.res').forEach(e=>e.onclick=()=>open(e.dataset.d));
}
async function open(id,n){
  const d=await api.deck(id);if(!d){home();return}
  const base='file:///'+d.dir.replace(/\\/g,'/').replace(/^\//,'');
  root().innerHTML=`<div class="row2"><button id="bk">← All decks</button><button id="rm" style="margin-left:auto">Remove deck</button></div><h1>${esc(d.name)}</h1>
  ${d.slides.map(s=>`<div class="sl" id="s${s.n}"><div class="n">Slide ${s.n}</div><h3>${esc(s.title||'(untitled)')}</h3>${s.text.length>1?'<ul>'+s.text.slice(1).map(x=>`<li>${esc(x).replace(/\n/g,'<br>')}</li>`).join('')+'</ul>':''}${s.images.map(i=>`<img src="${encodeURI(base+'/'+i)}" loading="lazy">`).join('')}${s.notes.length?`<div class="nt"><b>Notes:</b> ${esc(s.notes.join(' '))}</div>`:''}</div>`).join('')}`;
  document.getElementById('bk').onclick=()=>home();
  const rm=document.getElementById('rm');rm.onclick=()=>{rm.textContent='Tap again to remove';rm.onclick=async()=>{await api.removeDeck(id);home()}};
  if(n){const e=document.getElementById('s'+n);if(e){e.classList.add('hit');e.scrollIntoView({block:'start'})}}
}
window.slidesInit=()=>home();window.slidesShow=()=>{if(!root().querySelector('.sl'))home()};window.slidesOpen=open;
})();
