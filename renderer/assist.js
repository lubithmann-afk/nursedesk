// "Assist": highlights key words in a question's stem so the student knows what to think about.
// It is rule-based (no AI, works offline) and only reads the QUESTION TEXT: it never looks at the options or the answer.
(function(root){
const CAT={a:'What the question is asking',b:'Client details to think about',c:'Red flags and changes',d:'Medications'};
const ALT=l=>l.join('|');
const ASK=[ 'not','except','first','best','most important','most likely','most','least','priority','prioritize','initial','initially','next','immediately','safest','incorrect','unsafe','contraindicated','avoid','never','always','only','further teaching','further instruction','follow-up','needs? to be reported','should report','indicates?','understands?','highest priority','lowest priority','at this time','at once','before','after','clarify','delegate','notify','intervene','anticipate' ];
// "before"/"after" matter in questions about timing and order, so they are kept; plain "should" and "which" are too common to help.
const RED=[ 'sudden(?:ly)?','acute(?:ly)?','new','worsening','increasing','decreasing','rapid(?:ly)?','severe(?:ly)?','unresponsive','unconscious','confused','confusion','restless(?:ness)?','lethargic','lethargy','unable','cannot','refus\\w+','critical(?:ly)?','unstable','deteriorat\\w+','persistent','progressive','sustained','continuous','suicidal','suicide','violent','bleeding','hemorrhag\\w+','seizures?','arrest','shock','anaphyla\\w+','choking','aspirat\\w+','falls?','fell','fallen','not breathing','absent','abnormal','elevated','decreased','increased','positive' ];
const FIND=[ 'chest pain','pain','dyspnea','shortness of breath','wheez\\w+','cough(?:ing)?','crackles','rhonchi','stridor','cyanosis','cyanotic','pallor','pale','diaphoresis','diaphoretic','nausea','vomit\\w*','diarrhea','constipation','fever','febrile','chills','rash','itch\\w*','hives','swelling','edema','bruis\\w+','hematuria','melena','hypotension','hypertension','tachycardia','bradycardia','tachypnea','bradypnea','hypox\\w+','hyperglycemia','hypoglycemia','hyperkalemia','hypokalemia','hyponatremia','hypernatremia','hypocalcemia','hypercalcemia','dizz\\w+','syncope','headache','blurred vision','weakness','numbness','tingling','tremors?','agitat\\w+','drowsy','irritab\\w+','anxious','anxiety','depress\\w+','hallucinat\\w+','delusion\\w*','fatigue','incontinence','oliguria','anuria','urinary retention','distended','distention','rigid','guarding','rebound','jaundice','ascites','decreased breath sounds','bowel sounds','lung sounds','heart sounds','murmur','crackles','pulse','respirations?','temperature','oxygen saturation','blood pressure','heart rate','urine output','lab(?:oratory)? results?','allerg\\w+',
  'newborn','neonate','infant','toddler','preschool\\w*','school-age','child(?:ren)?','adolescent','teen(?:ager)?','older adult','elderly','geriatric','pregnan\\w+','gravida','para','postpartum','prenatal','labor','trimester','gestation','post-?op\\w*','postoperative(?:ly)?','preoperative(?:ly)?','post-?partum','dialysis','transplant','chemotherapy','radiation','ventilator','catheter','drain','cast','traction','restraints?','isolation','precautions' ];
const UNITS='mm ?Hg|mEq/L|mg/dL|g/dL|ng/mL|mcg|mg|mL|units?|bpm|breaths?(?: per|/)? ?min(?:ute)?|beats? per minute|%|°F|°C|kg|lb|pounds?|seconds?|minutes?|mins?|hours?|hrs?|days?|weeks?|months?|years?|yr|cm|mm|inch(?:es)?|ft|L/min|L'.replace(/\//g,'\\/');
const NUM=[ '\\d{2,3}\\/\\d{2,3}(?:\\s?mm ?Hg)?','\\d+(?:\\.\\d+)?\\s?(?:-|to)?\\s?(?:\\d+(?:\\.\\d+)?\\s?)?(?:'+UNITS+')(?![A-Za-z])','\\d+-(?:year|month|week|day)-old','\\d+(?:st|nd|rd|th)\\s+(?:day|week|trimester)','(?:day|week)\\s+\\d+','age[sd]?\\s+\\d+' ];
const mk=(parts,flags)=>new RegExp('(?<![A-Za-z0-9])(?:'+ALT(parts)+')(?![A-Za-z0-9])',flags||'gi');
const RX={a:mk(ASK),c:mk(RED),b:null,d:null};
RX.b=new RegExp('(?<![A-Za-z0-9])(?:'+ALT(NUM)+')|(?<![A-Za-z0-9])(?:'+ALT(FIND)+')(?![A-Za-z0-9])','gi');
let medRx=null,medsReady=false;
function setMeds(names){
  const list=[...new Set(names.filter(n=>n&&n.length>=4))].sort((x,y)=>y.length-x.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+'));
  medRx=list.length?new RegExp('(?<![A-Za-z0-9])(?:'+list.join('|')+')(?![A-Za-z0-9])','gi'):null;
  medsReady=true;
}
// medical terms (conditions, findings, procedures) from the glossary count as "client details" too
let termRx=null,termsReady=false;
function setTerms(terms){
  const list=[...new Set(terms.filter(t=>t&&t.length>=5&&!/[()\/]/.test(t)))].sort((x,y)=>y.length-x.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+').replace(/'s?$/,"(?:'s)?"));
  termRx=list.length?new RegExp('(?<![A-Za-z0-9])(?:'+list.join('|')+')(?![A-Za-z0-9])','gi'):null;termsReady=true;
}
function glossTerms(){try{return root.GLOSSARY?root.GLOSSARY.terms.filter(t=>!/^(Word Parts|Abbreviations)/.test(t.c)).map(t=>t.t):[]}catch(e){return[]}}
const CLASSWORDS=mk(['antibiotics?','anticoagulants?','antihypertensives?','antipsychotics?','antidepressants?','diuretics?','insulin','opioids?','narcotics?','steroids?','corticosteroids?','sedatives?','analgesics?','vaccines?','beta blockers?','digoxin','heparin','warfarin']);
function medNames(){try{return root.MEDS?root.MEDS.meds.flatMap(m=>[m.name,...m.brands]):[]}catch(e){return[]}}
// Returns [{x:text, k:'a'|'b'|'c'|'d'|null}] covering the whole string. Earlier categories win when two overlap.
function split(text,opts){
  if(!medsReady){setMeds(medNames())}
  if(!termsReady){setTerms(glossTerms())}
  if(opts&&opts.meds)setMeds(opts.meds);
  if(opts&&opts.terms)setTerms(opts.terms);
  const found=[];const taken=(s,e)=>found.some(r=>s<r.e&&e>r.s);
  const run=(rx,k)=>{if(!rx)return;rx.lastIndex=0;let m;while((m=rx.exec(text))){if(m[0].length&&!taken(m.index,m.index+m[0].length))found.push({s:m.index,e:m.index+m[0].length,k});if(m.index===rx.lastIndex)rx.lastIndex++}};
  run(RX.a,'a');run(RX.c,'c');run(medRx,'d');run(CLASSWORDS,'d');run(RX.b,'b');run(termRx,'b');
  found.sort((x,y)=>x.s-y.s);
  const out=[];let last=0;for(const r of found){if(r.s>last)out.push({x:text.slice(last,r.s),k:null});out.push({x:text.slice(r.s,r.e),k:r.k});last=r.e}
  if(last<text.length)out.push({x:text.slice(last),k:null});
  return out;
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function html(text,opts){return split(String(text),opts).map(p=>p.k?`<mark class="as as-${p.k}" title="${esc(CAT[p.k])}">${esc(p.x)}</mark>`:esc(p.x)).join('')}
const legend=()=>`<div class="aslg">${Object.keys(CAT).map(k=>`<span><i class="as as-${k}"></i>${esc(CAT[k])}</span>`).join('')}</div>`;
if(typeof module!=='undefined'&&module.exports){module.exports={split,html,CAT,legend,setMeds,setTerms};return}
let on=false;try{on=localStorage.getItem('nd_assist')==='1'}catch(e){}
root.assist={get on(){return on},set(v){on=!!v;try{localStorage.setItem('nd_assist',on?'1':'0')}catch(e){}},html,legend,
  button:()=>`<button id="asb" class="asb ${on?'on':''}" type="button">${on?'✓ Assist is on: key words are highlighted (tap to turn off)':'Assist: highlight the key words in the question'}</button>`};
})(typeof window!=='undefined'?window:globalThis);
