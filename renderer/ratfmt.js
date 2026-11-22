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
root.fmtRat=fmt;
if(typeof module!=='undefined'&&module.exports)module.exports={fmt,kind};
})(typeof window!=='undefined'?window:globalThis);
