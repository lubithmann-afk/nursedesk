(function(){
const root=()=>document.getElementById('slides');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let q='';
function hl(text,qq){const ws=[...new Set((qq.toLowerCase().match(/[a-z0-9]{3,}/g)||[]))];let s=esc(text);ws.forEach(w=>{s=s.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')});return s}
async function home(msg){
  const decks=await api.library();
  root().innerHTML=`<h1>Study library</h1><p class="sub">Class PowerPoints, the syllabus, study guides and more. Import PowerPoints or PDFs, then search everything instantly. The Ask AI tab uses this library first.</p>
  <div class="row2"><input type="text" id="sq" placeholder="Search the whole library (e.g. warfarin INR, chest tube, ATI retake policy)" value="${esc(q)}"><button class="p" id="imp">Import files</button><button id="lnk" title="Pick the folder where your original PowerPoints and PDFs are, and every deck gets an Open original button that works">Link originals</button></div>
  <div id="msg" class="cnt">${msg||''}</div><div id="out"></div>`;
  document.getElementById('imp').onclick=async()=>{const r=await api.importDecks();home((r.done.length?`Imported: ${r.done.join(', ')}. `:'')+(r.failed.length?`Failed: ${r.failed.join('; ')}`:''))};
  document.getElementById('lnk').onclick=async()=>{const r=await api.linkOriginals();if(r.cancelled)return;
    home(r.linked?`Linked ${r.linked} of ${r.total} decks to your original files.${r.missing.length?` Not found in that folder: ${r.missing.slice(0,6).join('; ')}${r.missing.length>6?` and ${r.missing.length-6} more`:''}. Click Open original on those to find them one by one.`:' You can now open any original from this list.'}`:`No original files in that folder matched your decks (${r.total} decks). Try the folder that holds the .pptx files, or click Open original on a deck to find its file.`)};
  const sq=document.getElementById('sq');let t;sq.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{q=sq.value;draw(decks)},150)};
  draw(decks);
}
async function draw(decks){
  const out=document.getElementById('out');if(!out)return;
  if(q.trim()){const rs=await api.search(q);
    out.innerHTML=rs.length?rs.map(r=>`<div class="res" data-d="${esc(r.deckId)}" data-n="${r.n}"><div class="m">${esc(r.deck)} · ${r.unit||'slide'} ${r.n}</div><b>${hl(r.title||'(untitled)',q)}</b><div>${hl(r.body.split('\n').slice(1,4).join(' · ').slice(0,240),q)}</div></div>`).join(''):'<div class="cnt">Nothing in the library matched. Try the Ask AI tab, which can also check trusted web sources.</div>';
    out.querySelectorAll('.res').forEach(e=>e.onclick=()=>open(e.dataset.d,+e.dataset.n));return}
  out.innerHTML=decks.length?decks.map(d=>`<div class="res" data-d="${esc(d.id)}"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b>${esc(d.name)}</b><span style="display:flex;align-items:center;gap:12px;flex:none"><button data-o="${esc(d.id)}" title="${d.linked?'Open the original file in your default program':'Find the original file (you only need to do this once)'}" style="padding:4px 10px;font-size:13px">${d.kind==='pdf'?'Open PDF':'Open original'}</button><span class="cnt">${d.slides} ${d.kind==='pdf'?'pages':'slides'}</span></span></div></div>`).join(''):'<div class="card"><div class="cnt">Nothing in your library yet. Click “Import files” and pick your .pptx or .pdf files.</div></div>';
  out.querySelectorAll('.res').forEach(e=>e.onclick=()=>open(e.dataset.d));
  out.querySelectorAll('[data-o]').forEach(b=>b.onclick=async ev=>{ev.stopPropagation();const say=t=>{const m=document.getElementById('msg');if(m)m.textContent=t};
    const r=await api.openOriginal(b.dataset.o);if(r.ok)say(`Opened ${r.name} in your default program.`);else if(!r.cancelled)say(`Couldn’t open it: ${r.error}`)});
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
