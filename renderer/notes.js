// Web Notes tab: what the study AI looked up on trusted sites (after the student approved it), saved with the
// pages it came from and grouped by category. The AI searches these first next time.
(function(){
const root=()=>document.getElementById('notes');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}};
const when=iso=>{try{return new Date(iso).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}catch(e){return ''}};
let items=[],cats=[],q='',openCats=new Set(),openId=null,armed=null;
async function load(){try{[items,cats]=await Promise.all([api.notesList(),api.notesCategories()])}catch(e){items=[];cats=[]}}
function match(n,t){const h=(n.title+' '+n.summary+' '+n.question+' '+n.category+' '+n.sources.map(s=>s.title+' '+host(s.url)).join(' ')).toLowerCase();return t.split(/\s+/).every(w=>h.includes(w))}
function card(n){
  const quotes=n.sources.filter(s=>s.quote);
  return `<div class="mq" id="n-${esc(n.id)}"${openId===n.id?' style="border-color:var(--acc);box-shadow:0 0 0 2px var(--acc)"':''}>
    <div style="display:flex;justify-content:space-between;gap:10px"><b>${esc(n.title)}</b><span class="cnt" style="white-space:nowrap">${esc(when(n.savedAt))}</span></div>
    ${n.question?`<div class="cnt" style="margin:2px 0 6px">You asked: “${esc(n.question)}”</div>`:''}
    <div>${esc(n.summary).replace(/\n/g,'<br>')}</div>
    <div class="src" style="margin-top:8px"><span class="cnt">Where it came from:</span><br>${n.sources.map(s=>`<a data-u="${esc(s.url)}" style="display:inline-block;margin:2px 10px 2px 0">${esc(s.title||s.url)} (${esc(host(s.url))})</a>`).join('')}</div>
    ${quotes.length?`<details><summary>Passages the answer relied on</summary>${quotes.map(s=>`<div class="cnt" style="margin-top:6px">“${esc(s.quote)}”<br>— ${esc(host(s.url))}</div>`).join('')}</details>`:''}
    <div class="row2" style="margin:10px 0 0;align-items:center"><select class="dd" data-cat="${esc(n.id)}" style="width:auto;margin:0;flex:1">${cats.map(c=>`<option ${c===n.category?'selected':''}>${esc(c)}</option>`).join('')}</select>
    <button data-del="${esc(n.id)}">${armed===n.id?'Tap again to delete':'Delete'}</button></div></div>`;
}
function draw(){
  const t=q.trim().toLowerCase(),list=items.filter(n=>!t||match(n,t));
  let body='';
  if(!items.length)body=`<div class="card"><b>Nothing saved yet.</b><div class="cnt" style="margin-top:6px">When you ask the AI something your library doesn’t cover and approve a web search, the answer is saved here with the pages it came from, so you (and the AI) can use it again without searching.</div></div>`;
  else if(!list.length)body='<div class="cnt">No saved note matches that.</div>';
  else body=cats.map(c=>{const ns=list.filter(n=>n.category===c);if(!ns.length)return '';
    const open=t||openCats.has(c)||ns.some(n=>n.id===openId);
    return `<details class="mcat" data-c="${esc(c)}" ${open?'open':''}><summary>${esc(c)}<span class="cnt">${ns.length} note${ns.length>1?'s':''}</span></summary><div class="mbody">${ns.map(card).join('')}</div></details>`}).join('');
  root().innerHTML=`<h1>Web Notes</h1><p class="sub">Things the AI looked up on trusted websites after you approved a search. Each one is saved with the pages it came from, grouped by category. The AI checks these first next time, so it won’t need to search again.</p>
   ${items.length?`<div class="mtop"><input type="text" id="nq" placeholder="Search your saved notes" value="${esc(q)}"></div>`:''}${body}
   ${items.length?`<p style="margin-top:14px"><button id="clr">${armed==='all'?'Tap again to delete all':'Delete all saved notes'}</button></p>`:''}
   <p class="cnt">${items.length} saved note${items.length===1?'':'s'}. Stored only on this PC.</p>`;
  const nq=document.getElementById('nq');if(nq)nq.oninput=()=>{q=nq.value;const p=nq.selectionStart;draw();const x=document.getElementById('nq');x.focus();x.setSelectionRange(p,p)};
  root().querySelectorAll('[data-u]').forEach(a=>a.onclick=()=>api.openExternal(a.dataset.u));
  root().querySelectorAll('details.mcat').forEach(e=>e.addEventListener('toggle',()=>{e.open?openCats.add(e.dataset.c):openCats.delete(e.dataset.c)}));
  root().querySelectorAll('select[data-cat]').forEach(s=>s.onchange=async()=>{await api.notesSetCategory(s.dataset.cat,s.value);await load();draw()});
  root().querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(armed===b.dataset.del){armed=null;await api.notesDelete(b.dataset.del);await load();draw()}else{armed=b.dataset.del;draw()}});
  const clr=document.getElementById('clr');if(clr)clr.onclick=async()=>{if(armed==='all'){armed=null;await api.notesClear();await load();draw()}else{armed='all';draw()}};
}
async function show(){await load();draw()}
window.notesShow=show;
window.notesRefresh=()=>{if(document.getElementById('pane-notes').classList.contains('on'))show();else load()};
window.notesOpen=async id=>{document.querySelector('[data-t=notes]').click();await load();openId=id;q='';const n=items.find(x=>x.id===id);if(n)openCats.add(n.category);draw();const e=document.getElementById('n-'+id);if(e)e.scrollIntoView({block:'center'});setTimeout(()=>{openId=null},4000)};
})();
