// Tutor tab: the parts that need no AI (weak-spot analysis, picking practice questions, trusted links, clickable citations).
(function(root){
const nk=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'");
// ---- what the student is weak at, from saved progress. P = {a:{id:{n,c,l,t}}, mr:[{id,t}]}
function weakSpots(QD,P){
  P=P||{};const a=P.a||{},mr=P.mr||[];
  const all=QD.top.map((name,i)=>{
    const qs=QD.bank.filter(q=>q.t===i);let n=0,c=0,seen=0;const missed=[];
    qs.forEach(q=>{const o=a[q.id];if(o){seen++;n+=o.n;c+=o.c;if(o.l===0)missed.push(q.id)}});
    const ids=new Set(qs.map(q=>q.id));
    return{i,name,total:qs.length,seen,n,c,pct:n?c/n*100:null,wrong:missed.length,missed,mr:mr.filter(e=>ids.has(e.id)).length};
  }).filter(t=>t.total>0);
  const weak=all.filter(t=>t.n>=2&&(t.pct<75||t.wrong>=3)).sort((x,y)=>x.pct-y.pct||y.wrong-x.wrong);
  const rest=all.filter(t=>t.n>0&&!weak.includes(t)).sort((x,y)=>x.pct-y.pct);
  const untried=all.filter(t=>t.n===0);
  return{weak,rest,untried,all,answered:all.reduce((s,t)=>s+t.n,0)};
}
// ---- practice questions for a topic: missed ones first (when a topic index is given), or the best keyword matches
const STOP=new Set('about after again also because been before being between could does from have into more most nurse should that their them then there these they this those what when which while with would your client clients patient'.split(' '));
const words=s=>[...new Set(nk(s).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!STOP.has(w)))];
function questionsFor(QD,opts){
  opts=opts||{};const lim=opts.limit||10;let out=[];const seen=new Set();
  const add=q=>{if(q&&!seen.has(q.id)){seen.add(q.id);out.push(q)}};
  if(opts.missed)opts.missed.forEach(id=>add(QD.bank.find(q=>q.id===id)));
  if(opts.topic!=null)QD.bank.filter(q=>q.t===opts.topic).forEach(add);
  if(opts.query){
    const w=words(opts.query);
    if(w.length){const sc=QD.bank.map(q=>{const st=nk(q.q),o=nk(q.o.join(' ')),r=nk(q.r||'');let s=0;w.forEach(x=>{if(st.includes(x))s+=3;if(o.includes(x))s+=1;if(r.includes(x))s+=1});return[s,q]}).filter(x=>x[0]>=3).sort((a,b)=>b[0]-a[0]);sc.forEach(x=>add(x[1]))}
  }
  return out.slice(0,lim);
}
// ---- trusted places to read more. These are search/landing pages the app builds; it cannot check what is on them.
function trustedLinks(topic){
  const t=encodeURIComponent(String(topic||'').trim());
  return[
    {name:'MedlinePlus (US National Library of Medicine)',why:'Plain-language health and medicine information',url:`https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&query=${t}`},
    {name:'StatPearls on NCBI Bookshelf (NIH)',why:'Clinical reviews written for health professionals',url:`https://www.ncbi.nlm.nih.gov/books/?term=${t}`},
    {name:'CDC',why:'Infection control, vaccines, public health',url:`https://search.cdc.gov/search/?query=${t}`},
    {name:'NCSBN NCLEX-RN test plan',why:'What the licensing exam covers and how it is built',url:'https://www.ncsbn.org/exams/exam-content/nclex-rn.page'},
    {name:'OpenStax Nursing (free textbooks)',why:'Peer-reviewed nursing textbooks you can read online',url:'https://openstax.org/subjects/nursing'},
    {name:'DailyMed (FDA drug labels)',why:'Official labeling for any medication in the topic',url:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${t}`}
  ];
}
// ---- the message that starts a lesson
function lessonPrompt(o){
  const t=o.topic;
  let s=`Teach me: ${t}.\n\nPlease teach it the way my class does (NCLEX-RN style, safety and priorities first), using my class materials first and citing each class-based point like [Deck name, slide N]. Keep it short and clear, in this order:\n1. What my class materials say (cited).\n2. The same ideas in simple words.\n3. How to think about it like an RN on the exam (priorities, safety, delegation) as my class slides teach it.\n4. Two or three common mistakes.\n5. Then ask me ONE short check question and wait for my answer.\nIf my class materials do not cover part of this, say so plainly.`;
  if(o.missed&&o.missed.length)s+=`\n\nI keep missing questions on this topic${o.pct!=null?` (about ${Math.round(o.pct)}% right)`:''}. Here are some I missed, with the correct answers, so you can aim the lesson at the ideas I am missing (do not just repeat them):\n`+o.missed.map((q,i)=>`${i+1}. ${String(q.q).replace(/\s+/g,' ').slice(0,260)}\n   Correct: ${(Array.isArray(q.a)?q.a:[q.a]).map(k=>q.o[k]).join(' / ').slice(0,200)}`).join('\n');
  return s;
}
// the rules the tutor always follows (sent as extra instructions on top of the study assistant's own rules)
const TUTOR_RULES=`You are now the TUTOR inside a Galen College of Nursing student's app (NUR 283, NCLEX-RN prep). Teach the way the class materials teach.
Rules that never bend:
- Do not state a fact as "what my class says" unless a library excerpt supports it. Cite every class-based point as [Document name, slide N] or [Document name, page N] exactly as the search results show.
- Search the library for the topic, and also for how the class teaches test-taking (priorities, ABCs, safety, delegation) when that helps. Prefer class slides, then the syllabus for course rules, then the ATI guide.
- If the class materials do not cover something, say "My class materials don't cover this" in one line. You may then add a short explanation ONLY if you are confident it is standard nursing knowledge, and start it with "Outside your class materials:". If you are not sure, say you are not sure. Never guess.
- Never invent doses, lab values, policies, page numbers or what Galen "requires". Give a dose or lab range only if an excerpt shows it.
- If class slides conflict with each other, the ATI guide or a quiz key, point it out plainly and let the student decide.
- Do not write web addresses. The app shows trusted links itself.
- Be concise: short paragraphs and bullets. Ask one question at a time and wait for the answer. Be encouraging but never say an answer is right when it is not.`;
// ---- turn "[Unit 8 - Cardiac, slide 36]" in a reply into a link target. decks = [{id,name}]
function resolveCitation(label,kind,n,decks){
  const k=s=>nk(s).replace(/[^a-z0-9]/g,'');const L=k(label);if(!L)return null;
  let best=null;
  for(const d of decks){const D=k(d.name);if(!D)continue;if(D===L||D.includes(L)||L.includes(D)||(L.length>8&&D.includes(L.slice(0,Math.min(L.length,24)))))if(!best||D.length<best.n)best={id:d.id,n:D.length}}
  return best?{deckId:best.id,n:+n}:null;
}
const CITE=/\[([^\[\]]{3,140}?),\s*(slide|page)\s*(\d+)\]/gi;
if(typeof module!=='undefined'&&module.exports){module.exports={weakSpots,questionsFor,trustedLinks,lessonPrompt,TUTOR_RULES,resolveCitation,CITE,words};return}
root.TutorLogic={weakSpots,questionsFor,trustedLinks,lessonPrompt,TUTOR_RULES,resolveCitation,CITE,words};
})(typeof window!=='undefined'?window:globalThis);
