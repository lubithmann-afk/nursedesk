// Game mode rules (money ladder, picking 15 questions that get harder, lifelines). No DOM here so it can be tested.
(function(root){
const LADDER=[100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
const SAFE=[4,9];                                   // $1,000 and $32,000 are guaranteed
const money=n=>'$'+Number(n).toLocaleString('en-US');
const playable=b=>!Array.isArray(b.a)&&typeof b.a==='number'&&Array.isArray(b.o)&&b.o.length===4;
function shuffle(a,rng){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
// Higher = harder: longer questions, and ones the student has missed before; a little noise so games differ.
function difficulty(b,hist,rng){
  const len=b.q.length+b.o.reduce((s,o)=>s+o.length,0);
  let d=Math.min(len,900)/900;
  const h=hist&&hist[b.id];if(h&&h.n>0)d+=(1-h.c/h.n)-0.5;
  return d+rng()*0.12;
}
// own = questions from the chosen category, filler = related questions used only to reach `size`.
function buildGame(own,filler,hist,rng,size){
  size=size||15;const used=new Set();let pool=[];
  own.forEach(q=>{if(!used.has(q.id)){used.add(q.id);pool.push({q,filler:false})}});
  for(const q of shuffle(filler||[],rng)){if(pool.length>=size)break;if(!used.has(q.id)){used.add(q.id);pool.push({q,filler:true})}}
  pool.forEach(p=>p.d=difficulty(p.q,hist,rng));pool.sort((a,b)=>a.d-b.d);
  let pick=pool;
  if(pool.length>size){                              // one question from each difficulty band, so it climbs steadily
    pick=[];for(let k=0;k<size;k++){const a=Math.floor(k*pool.length/size),b=Math.max(a+1,Math.floor((k+1)*pool.length/size));pick.push(pool[a+Math.floor(rng()*(b-a))])}
  }
  return pick.map(p=>{const order=shuffle([0,1,2,3],rng);return{id:p.q.id,q:p.q.q,opts:order.map(i=>p.q.o[i]),correct:order.indexOf(p.q.a),why:p.q.r||'',filler:p.filler}});
}
const payoutWrong=i=>i>=10?LADDER[9]:i>=5?LADDER[4]:0;          // i = question being answered (0-based)
const payoutWalk=i=>i>0?LADDER[i-1]:0;
function fifty(correct,hidden,rng){const wrong=[0,1,2,3].filter(i=>i!==correct&&!hidden.has(i));return shuffle(wrong,rng).slice(0,2)}
function pct(weights){const t=weights.reduce((a,b)=>a+b,0)||1,raw=weights.map(w=>w*100/t),fl=raw.map(Math.floor);let left=100-fl.reduce((a,b)=>a+b,0);
  raw.map((r,i)=>[r-fl[i],i]).sort((a,b)=>b[0]-a[0]).forEach(([,i])=>{if(left>0){fl[i]++;left--}});return fl}
function audience(correct,level,hidden,rng){                    // a simulated crowd: right more often early, less often late
  const rem=[0,1,2,3].filter(i=>!hidden.has(i));let p=Math.min(.95,Math.max(.35,.85-.025*level+(rng()-.5)*.1));if(rem.length===2)p=Math.min(.97,p+.1);
  const others=rem.filter(i=>i!==correct),w=[0,0,0,0];w[correct]=p;const rs=others.map(()=>.2+rng());const rt=rs.reduce((a,b)=>a+b,0);others.forEach((i,k)=>{w[i]=(1-p)*rs[k]/rt});
  return pct(w);
}
function friend(correct,level,hidden,rng){                      // a simulated friend: usually right, not always
  const rem=[0,1,2,3].filter(i=>!hidden.has(i));let p=.9-.027*level;if(rem.length===2)p=Math.min(.97,p+.08);
  const right=rng()<p;const wrong=rem.filter(i=>i!==correct);const pick=right?correct:wrong[Math.floor(rng()*wrong.length)];
  const conf=right?(p>.75?'sure':'unsure'):(rng()<.5?'unsure':'sure');return{pick,conf};
}
// Categories offered on the menu. Questions are the app's own bank (single answer, four options only).
function categories(QD,MEDS,opts){                                 // opts.all: include select-all and other formats (challenge mode)
  const bank=opts&&opts.all?QD.bank.slice():QD.bank.filter(playable),src=QD.src,top=QD.top,out=[];
  const isWq=s=>/^Weekly quiz/.test(s),isDk=s=>/^Class slides/.test(s);
  out.push({key:'all',group:'Everything',label:'All questions mixed',own:bank,fill:[]});
  top.forEach((t,i)=>{const own=bank.filter(q=>q.t===i);if(own.length)out.push({key:'t:'+i,group:'Test topics',label:t,own,fill:bank})});
  src.forEach((s,i)=>{if(isWq(s)||isDk(s))return;const own=bank.filter(q=>q.s===i);if(own.length)out.push({key:'s:'+i,group:'Practice tests',label:s,own,fill:bank})});
  const wq=bank.filter(q=>isWq(src[q.s]));if(wq.length)out.push({key:'wq',group:'Weekly quizzes',label:'All weekly quizzes',own:wq,fill:bank});
  src.forEach((s,i)=>{if(!isWq(s))return;const own=bank.filter(q=>q.s===i);if(own.length)out.push({key:'s:'+i,group:'Weekly quizzes',label:s.replace(/^Weekly quiz\s*[–-]\s*/,''),own,fill:wq})});
  const dk=bank.filter(q=>isDk(src[q.s]));if(dk.length)out.push({key:'dk',group:'Class PowerPoints',label:'All class PowerPoint questions',own:dk,fill:bank});
  if(MEDS&&MEDS.cats){
    const byId=new Map(bank.map(q=>[q.id,q])),all=new Set();MEDS.meds.forEach(m=>m.q.forEach(id=>all.add(id)));
    const anyMed=[...all].map(id=>byId.get(id)).filter(Boolean);const ph=bank.filter(q=>top[q.t]==='Pharmacology & Labs');
    MEDS.cats.forEach(c=>{const ids=new Set();c.c.forEach(cl=>cl.m.forEach(i=>MEDS.meds[i].q.forEach(id=>ids.add(id))));
      const own=[...ids].map(id=>byId.get(id)).filter(Boolean);if(own.length)out.push({key:'m:'+c.n,group:'Medication categories',label:c.n,own,fill:anyMed.concat(ph)})});
  }
  return out;
}
const api={LADDER,SAFE,money,playable,shuffle,difficulty,buildGame,payoutWrong,payoutWalk,fifty,audience,friend,categories};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GameLogic=api;
})(typeof window!=='undefined'?window:globalThis);
