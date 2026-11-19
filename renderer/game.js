// Game mode: a 15-question money-ladder game over the app's own questions.
// Lifelines (50:50, phone a friend, ask the audience) are simulated for fun; the "Why" panel after each question shows the real answer.
(function(){
const G=window.GameLogic,$=s=>document.querySelector(s);
const root=()=>document.getElementById('game');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L='ABCD',rng=Math.random;
let S=null,cats=[],menuKey=null,armed=null,timers=[];
const ls={get:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
// ---- sound (simple synthesized tones; no recordings)
let ac=null,muted=ls.get('nd_game_mute',false);
function tone(f,d,type,v,t0){if(muted)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+(t0||0);o.type=type||'sine';o.frequency.value=f;o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(v||.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d)}catch(e){}}
const sfx={lock:()=>[0,.55,1.1,1.65].forEach(t=>tone(65,.4,'sine',.35,t)),ok:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.3,'triangle',.2,i*.13)),bad:()=>{tone(190,.6,'sawtooth',.16);tone(125,.8,'sawtooth',.16,.25)},life:()=>{tone(740,.12,'square',.08);tone(988,.18,'square',.08,.1)},win:()=>[523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,.28,'triangle',.2,i*.14))};
const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t)};const clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};
const best=()=>ls.get('nd_game_best',{});
const hist=()=>{const p=ls.get('nur283_progress',null);return p&&p.a?p.a:{}};
// ---- menu
function menu(){
  clearTimers();S=null;if(!window.QD){root().innerHTML='<div class="gm"><h1>Game</h1><p class="sub">The game needs questions. Import a course pack in Settings to play.</p></div>';return}
  cats=G.categories(window.QD,window.MEDS);if(!menuKey||!cats.find(c=>c.key===menuKey))menuKey='all';
  const groups=[...new Set(cats.map(c=>c.group))],b=best();
  root().innerHTML=`<div class="gm"><h1>The NCLEX Ladder</h1><div class="g-tag">15 questions. Each one is worth more. Don’t lose it all.</div>
   <div class="g-menu"><div class="g-box"><b>Pick a category</b><br><br><select id="gc">${groups.map(g=>`<optgroup label="${esc(g)}">${cats.filter(c=>c.group===g).map(c=>`<option value="${esc(c.key)}" ${c.key===menuKey?'selected':''}>${esc(c.label)} (${c.own.length})</option>`).join('')}</optgroup>`).join('')}</select>
    <div class="g-note" id="gi"></div></div>
    <button class="g-go" id="gp">Play</button>
    <div class="g-box" style="margin-top:14px"><b>How it works</b><ul>
     <li>Pick an answer, then lock it in with <b>Final answer</b>. Keys <b>A–D</b> and <b>Enter</b> work too.</li>
     <li>Wrong answer: you fall back to your last safe amount. <b>$1,000</b> and <b>$32,000</b> are guaranteed.</li>
     <li>You can <b>walk away</b> with what you’ve won before you answer.</li>
     <li>Lifelines, once each: <b>50:50</b>, <b>Phone a friend</b>, <b>Ask the audience</b>. They’re simulated and not always right.</li>
     <li>Only single-answer questions are used. Your answers count toward your Practice progress.</li></ul></div>
    <p style="text-align:center"><button class="g-ghost" id="gm">${muted?'🔇 Sound off':'🔊 Sound on'}</button></p></div></div>`;
  const info=()=>{const c=cats.find(x=>x.key===menuKey),bb=b[menuKey];
    $('#gi').innerHTML=c.own.length>=15?`${c.own.length} questions in this category.`:`Only ${c.own.length} question${c.own.length===1?'':'s'} in this category, so ${15-c.own.length} related ones are mixed in to fill the ladder.`;
    if(bb)$('#gi').innerHTML+=`<br>Your best here: <b>${G.money(bb)}</b>`};
  $('#gc').onchange=e=>{menuKey=e.target.value;info()};info();
  $('#gp').onclick=()=>start(menuKey);
  $('#gm').onclick=()=>{muted=!muted;ls.set('nd_game_mute',muted);$('#gm').textContent=muted?'🔇 Sound off':'🔊 Sound on'};
}
function start(key){
  armed=null;
  const c=cats.find(x=>x.key===key);const qs=G.buildGame(c.own,c.fill,hist(),rng,15);
  S={key,label:c.label,qs,i:0,stage:'choose',sel:null,hidden:new Set(),life:{fifty:true,phone:true,aud:true},log:[],ovl:null,msg:''};
  sfx.life();draw();
}
// ---- play screen
function draw(){
  if(!S)return;const q=S.qs[S.i];
  const rungs=[...G.LADDER].map((m,i)=>i).reverse().map(i=>`<div class="g-rung ${G.SAFE.includes(i)?'g-safe':''} ${i<S.i?'g-done':''} ${i===S.i?'g-cur':''}"><span class="g-n">${i+1}</span><span class="g-d">◆</span><span>${G.money(G.LADDER[i])}</span></div>`).join('');
  const rev=S.stage==='reveal';
  const opts=q.opts.map((t,i)=>{let cls='';if(S.hidden.has(i))cls='g-off';else if(rev){if(i===q.correct)cls='g-good';else if(i===S.sel)cls='g-bad'}else if(i===S.sel)cls='g-sel'+(S.stage==='suspense'?' g-pulse':'');
    return `<button class="g-a ${cls}" data-i="${i}" ${S.stage==='choose'?'':'disabled'}><div class="g-hex"><div><span class="g-l">${L[i]}:</span><span>${esc(t)}</span></div></div></button>`}).join('');
  const acts=S.stage==='choose'?`${S.sel!=null?'<button class="g-go" id="gf" style="margin:0">Final answer</button>':''}<button class="g-ghost" id="gw">${armed==='walk'?`Tap again: walk away with ${G.money(G.payoutWalk(S.i))}`:'Walk away'}</button>`
    :S.stage==='confirm'?`<button class="g-go" id="gy" style="margin:0">Yes, final answer</button><button class="g-ghost" id="gn">Not yet</button>`
    :rev?`<button class="g-go" id="gx" style="margin:0">${S.correct?(S.i===14?'Claim your prize':'Next question'):'See results'}</button>`:'';
  root().innerHTML=`<div class="gm"><div class="g-bar"><b>${esc(S.label)}</b><span>Question ${S.i+1} of 15 · for <b style="color:#ffd966">${G.money(G.LADDER[S.i])}</b></span><button class="g-ghost" id="gq">Quit</button></div>
   <div class="g-stage"><div class="g-main"><div class="g-life"><button id="l1" ${S.life.fifty&&S.stage==='choose'?'':'disabled'} class="${S.life.fifty?'':'g-used'}" title="50:50">50:50</button><button id="l2" ${S.life.phone&&S.stage==='choose'?'':'disabled'} class="${S.life.phone?'':'g-used'}" title="Phone a friend">📞</button><button id="l3" ${S.life.aud&&S.stage==='choose'?'':'disabled'} class="${S.life.aud?'':'g-used'}" title="Ask the audience">📊</button></div>
   <div class="g-q g-hex"><div>${esc(q.q)}</div></div><div class="g-opts">${opts}</div>
   <div class="g-msg">${esc(S.msg)}</div><div class="g-acts">${acts}</div>
   ${rev?`<div class="g-why"><b>${S.correct?'Correct!':'Not quite.'} The answer: ${L[q.correct]}. ${esc(q.opts[q.correct])}</b>\n\n${esc(q.why||'')}</div>`:''}</div>
   <div class="g-side"><div class="g-ladder">${rungs}</div></div></div>${S.ovl?overlay():''}</div>`;
  root().querySelectorAll('.g-a').forEach(b=>b.onclick=()=>{S.sel=+b.dataset.i;S.msg='';draw()});
  const on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
  on('#gf',()=>{S.stage='confirm';S.msg='Is that your final answer?';draw()});on('#gn',()=>{S.stage='choose';S.msg='';draw()});on('#gy',lock);on('#gx',next);
  on('#gw',()=>{if(armed==='walk'){armed=null;end('walk')}else{armed='walk';draw()}});
  on('#gq',()=>{if(armed==='quit'){armed=null;menu()}else{armed='quit';$('#gq').textContent='Tap again to quit';}});
  on('#l1',lFifty);on('#l2',lPhone);on('#l3',lAud);on('#ovx',()=>{S.ovl=null;draw()});
}
function overlay(){
  const o=S.ovl;
  if(o.type==='aud')return `<div class="g-ovl"><div class="g-modal"><b>Ask the audience</b><div class="g-bars">${o.p.map((v,i)=>`<div><b>${v}%</b><i style="height:${v*1.4}px"></i><b>${L[i]}</b></div>`).join('')}</div><div class="cnt" style="color:#9fb0ff">A simulated crowd, for fun. It is not always right.</div><button class="g-go" id="ovx" style="margin-top:12px">Back to the question</button></div></div>`;
  return `<div class="g-ovl"><div class="g-modal"><b>Phone a friend</b><p style="font-size:18px;margin:14px 0">📞 ${esc(o.name)}: “${esc(o.text)}”</p><div style="color:#9fb0ff;font-size:13px">A simulated friend, for fun. Your friend isn’t always right.</div><button class="g-go" id="ovx" style="margin-top:12px">Thanks, got it</button></div></div>`;
}
function lFifty(){S.life.fifty=false;G.fifty(S.qs[S.i].correct,S.hidden,rng).forEach(i=>S.hidden.add(i));if(S.sel!=null&&S.hidden.has(S.sel))S.sel=null;sfx.life();draw()}
function lAud(){S.life.aud=false;S.ovl={type:'aud',p:G.audience(S.qs[S.i].correct,S.i,S.hidden,rng)};sfx.life();draw()}
function lPhone(){S.life.phone=false;const q=S.qs[S.i],f=G.friend(q.correct,S.i,S.hidden,rng);
  const name=['Dr. Patel','Nurse Kim','Marcus from clinicals','Professor Lee','Aunt Rosa, retired RN'][Math.floor(rng()*5)];
  const text=f.conf==='sure'?`I’m pretty sure it’s ${L[f.pick]}.`:`Hmm… I think it’s ${L[f.pick]}, but don’t hold me to it.`;S.ovl={type:'phone',name,text};sfx.life();draw()}
function lock(){armed=null;S.stage='suspense';S.msg='…';draw();sfx.lock();later(reveal,2300)}
function reveal(){const q=S.qs[S.i];S.correct=S.sel===q.correct;S.stage='reveal';S.msg=S.correct?'That’s correct!':'Oh no… that’s not right.';
  S.log.push({id:q.id,q:q.q,pick:q.opts[S.sel],right:q.opts[q.correct],ok:S.correct});
  try{window.recordAnswer&&window.recordAnswer(q.id,S.correct)}catch(e){}
  S.correct?sfx.ok():sfx.bad();draw()}
function next(){armed=null;if(!S.correct)return end('wrong');if(S.i===14)return end('win');S.i++;S.stage='choose';S.sel=null;S.hidden=new Set();S.msg='';draw()}
function end(kind){
  clearTimers();const won=kind==='win'?G.LADDER[14]:kind==='walk'?G.payoutWalk(S.i):G.payoutWrong(S.i);
  const b=best();if(won>(b[S.key]||0)){b[S.key]=won;ls.set('nd_game_best',b)}
  if(kind==='win')sfx.win();
  const missed=S.log.filter(x=>!x.ok).map(x=>x.id);
  root().innerHTML=`<div class="gm"><div class="g-end"><h1>${kind==='win'?'You reached the top!':kind==='walk'?'You walked away':'Game over'}</h1>
   <div class="g-big">${G.money(won)}</div><div class="g-tag">${kind==='win'?'All 15 correct. Perfect run.':kind==='walk'?`You stopped at question ${S.i+1} of 15.`:`You went out on question ${S.i+1}. ${won?`You keep your safe ${G.money(won)}.`:'No safe amount reached yet.'}`}</div>
   <div class="g-rev">${S.log.map((x,i)=>`<div class="${x.ok?'g-ok':'g-no'}">${x.ok?'✔':'✘'} Q${i+1}: ${esc(x.q.length>110?x.q.slice(0,107)+'…':x.q)}<br><span style="color:#b8c4ff">${x.ok?'Your answer: ':'Correct answer: '}${esc(x.right)}</span></div>`).join('')}</div>
   <div class="g-acts"><button class="g-go" id="ea" style="margin:0">Play again</button><button class="g-ghost" id="ec">Change category</button>${missed.length&&window.practiceIds?`<button class="g-ghost" id="ep">Practice the ${missed.length} I missed</button>`:''}</div></div></div>`;
  const key=S.key,on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
  on('#ea',()=>start(key));on('#ec',menu);on('#ep',()=>{document.querySelector('[data-t=practice]').click();window.practiceIds(missed)});
}
document.addEventListener('keydown',e=>{
  if(!S||!document.getElementById('pane-game').classList.contains('on')||S.ovl)return;
  const k=e.key.toUpperCase();
  if(S.stage==='choose'&&L.includes(k)&&!S.hidden.has(L.indexOf(k))){S.sel=L.indexOf(k);S.msg='';draw()}
  else if(e.key==='Enter'){if(S.stage==='choose'&&S.sel!=null){S.stage='confirm';S.msg='Is that your final answer?';draw()}else if(S.stage==='confirm')lock();else if(S.stage==='reveal')next()}
});
window.gameInit=()=>{};window.gameShow=()=>{if(!S)menu()};
})();
