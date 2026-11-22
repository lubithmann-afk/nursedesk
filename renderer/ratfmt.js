// Turns a rationale (plain text with section labels) into colour-coded, easier-to-scan HTML.
// Each kind of section gets its own colour and size: answer key (green), study notes (blue), not correct (red),
// conflicts and outside-set warnings (orange), where-it-came-from notes (small grey).
(function(root){
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function kind(l){
  if(/^(Weekly quiz key|Correct:|✔ Checked)/.test(l))return'key';
  if(/^Study notes/.test(l))return'notes';
  if(/^Not correct:/.test(l))return'bad';
  if(/^Conflicting answer/.test(l))return'conf';
  if(/^Not from Galen materials/.test(l))return'out';
  if(/^(Not covered in your class|Also appears in|Worked out with|Answer key not|\(.*\)$)/.test(l))return'src';
  return null;
}
function fmt(text){
  const lines=String(text||'').split('\n');let out='',mode=null;
  for(const raw of lines){
    const l=raw.trim();if(!l)continue;
    const k=kind(l);
    if(k==='key'||k==='notes'||k==='bad'){mode=k;out+=`<div class="rh rh-${k}">${esc(l)}</div>`;continue}
    if(k==='conf'||k==='out'){mode=null;const m=l.match(/^([^:]+:)\s*(.*)$/);out+=`<div class="rw rw-${k}"><b>${esc(m?m[1]:'')}</b> ${esc(m?m[2]:l)}</div>`;continue}
    if(k==='src'){out+=`<div class="rs">${esc(l)}</div>`;continue}
    if(/^[•·]/.test(l)){
      const b=l.replace(/^[•·]\s*/,'');const m=b.match(/^([“"].*?[”"])\s*[–-]\s*(.*)$/);
      out+=`<div class="rb rb-${mode||'plain'}">${m?`<b>${esc(m[1])}</b><span class="re"> – ${esc(m[2])}</span>`:esc(b)}</div>`;continue}
    mode=null;out+=`<div class="rp">${esc(l)}</div>`;
  }
  return out;
}
// ---- AI answers: headline, label + detail bullets, citations and "not from a source" warnings get their own colours.
// Input is HTML that already had escaping, **bold** and links applied (one line per \n); output is the block structure.
function aiBlocks(h){
  const out=[];let first=true;
  const label=t=>t.replace(/^<b>([^<]{1,70}?):?<\/b>:?\s*/,(m,x)=>`<span class="aial">${x}:</span> `);
  const deco=t=>t.replace(/\[([^\[\]<>]{3,140}?,\s*(?:slide|page)s?\s*\d+[^\]<>]*)\]/gi,'<span class="aiac">[$1]</span>')
    .replace(/(my own explanation[^.<]*|not from a source|general knowledge[^.<]*)/gi,'<span class="aiaw">$1</span>');
  for(const raw of String(h).split('\n')){
    const l=raw.trim();if(!l){continue}
    if(/^-{3,}$/.test(l)){out.push('<hr class="aiahr">');first=false;continue}
    const b=/^(?:[-•*]|\d+\.)\s+(.*)$/.exec(l);
    if(b){out.push(`<div class="aiab">${deco(label(b[1]))}</div>`);first=false;continue}
    const plain=l.replace(/<[^>]+>/g,'');
    if(/^<b>[^<]+<\/b>:?$/.test(l)||(first&&plain.length<=80&&!/[.?!:]$/.test(plain))){out.push(`<div class="aiah">${plain}</div>`);first=false;continue}
    out.push(`<div class="aiap">${deco(label(l))}</div>`);first=false;
  }
  return out.join('');
}
root.aiBlocks=aiBlocks;
root.fmtRat=fmt;
if(typeof module!=='undefined'&&module.exports)module.exports={fmt,kind,aiBlocks};
})(typeof window!=='undefined'?window:globalThis);
