// Soft background music: generated live with the Web Audio API (no audio files, nothing to license or download).
// A slow, quiet pad that drifts through four gentle chords, with an occasional soft bell note. Off until you turn it on.
(function(root){
const ns=(m,o)=>440*Math.pow(2,(m-69)/12);                       // MIDI note -> Hz
// Each chord: MIDI notes (low, warm voicing). Cmaj9 -> Am9 -> Fmaj7 -> G6, an unhurried loop in C major.
const CHORDS=[[48,55,59,64,67],[45,55,60,64,67],[41,55,57,60,64],[43,55,59,64,69]];
const BELLS=[72,74,76,79,81,84];                                  // C major pentatonic, high and quiet
const CHORD_SECS=14;
function clampVol(v){v=+v;return isFinite(v)?Math.min(1,Math.max(0,v)):0.3}
function load(){try{const s=JSON.parse(localStorage.getItem('nd_music')||'null');return{on:!!(s&&s.on),vol:clampVol(s&&s.vol!=null?s.vol:0.3)}}catch(e){return{on:false,vol:0.3}}}
function save(s){try{localStorage.setItem('nd_music',JSON.stringify(s))}catch(e){}}
const api={CHORDS,BELLS,CHORD_SECS,ns,clampVol,load,save};
if(typeof module!=='undefined'&&module.exports){module.exports=api;return}
let ctx=null,master=null,timer=null,idx=0,live=[],st=load();
function reverb(c){                                              // a soft, long room made from decaying noise
  const len=c.sampleRate*4,buf=c.createBuffer(2,len,c.sampleRate);
  for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5)}
  const r=c.createConvolver();r.buffer=buf;return r;
}
function build(){
  const AC=root.AudioContext||root.webkitAudioContext;if(!AC)return false;
  ctx=new AC();master=ctx.createGain();master.gain.value=0;
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;lp.Q.value=0.3;
  const dry=ctx.createGain(),wet=ctx.createGain(),rv=reverb(ctx);dry.gain.value=0.55;wet.gain.value=0.6;
  lp.connect(dry);lp.connect(rv);rv.connect(wet);dry.connect(master);wet.connect(master);master.connect(ctx.destination);
  ctx._in=lp;return true;
}
function voice(freq,t0,dur,peak,type,det){
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;o.detune.value=det||0;
  const a=Math.min(5,dur*0.4),r=Math.min(6,dur*0.45);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(peak,t0+a);g.gain.setValueAtTime(peak,t0+dur-r);g.gain.linearRampToValueAtTime(0,t0+dur);
  o.connect(g);g.connect(ctx._in);o.start(t0);o.stop(t0+dur+0.1);live.push(o);o.onended=()=>{live=live.filter(x=>x!==o)};
}
function chord(){
  const t=ctx.currentTime+0.05,dur=CHORD_SECS+6;           // chords overlap so there is never a gap
  CHORDS[idx%CHORDS.length].forEach((m,i)=>{voice(ns(m),t,dur,0.05,'sine',(i%2?4:-4));voice(ns(m)*2,t,dur,0.012,'triangle',i*2-4)});
  for(let k=0;k<2;k++){const m=BELLS[Math.floor(Math.random()*BELLS.length)];voice(ns(m),t+3+Math.random()*(CHORD_SECS-6),7,0.018,'sine',0)}
  idx++;
}
function start(){
  if(!ctx&&!build())return;
  ctx.resume&&ctx.resume();
  master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(st.vol*0.9,ctx.currentTime,1.5);
  if(!timer){chord();timer=setInterval(chord,CHORD_SECS*1000)}
}
function stop(){
  if(timer){clearInterval(timer);timer=null}
  if(ctx){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(0,ctx.currentTime,0.6);const c=ctx;setTimeout(()=>{if(!timer&&ctx===c){live.forEach(o=>{try{o.stop()}catch(e){}});live=[];c.suspend&&c.suspend()}},2500)}
}
function setOn(on){st.on=!!on;save(st);on?start():stop();paint()}
function setVol(v){st.vol=clampVol(v);save(st);if(ctx&&timer)master.gain.setTargetAtTime(st.vol*0.9,ctx.currentTime,0.2);paint()}
let btn,pop;
function paint(){if(!btn)return;btn.textContent=st.on?'🎵':'🎵';btn.classList.toggle('on',st.on);btn.title=st.on?'Background music is on':'Background music is off';
  if(pop){pop.querySelector('#mu_on').checked=st.on;pop.querySelector('#mu_vol').value=Math.round(st.vol*100);pop.querySelector('#mu_v').textContent=Math.round(st.vol*100)+'%'}}
function ui(){
    btn=document.createElement('button');btn.id='music';btn.className='';btn.setAttribute('aria-label','Background music');
  pop=document.createElement('div');pop.id='musicpop';pop.hidden=true;
  pop.innerHTML='<label class="mrow"><input type="checkbox" id="mu_on"> Soft background music</label><div class="mrow"><input type="range" id="mu_vol" min="0" max="100" aria-label="Music volume"><span id="mu_v"></span></div><div class="mnote">Calm, generated sound for focus. It plays quietly and is off until you turn it on.</div>';
  document.body.appendChild(btn);document.body.appendChild(pop);   // floats bottom-right so it is also on the title screen
  btn.onclick=e=>{e.stopPropagation();pop.hidden=!pop.hidden};
  document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&e.target!==btn)pop.hidden=true});
  pop.querySelector('#mu_on').onchange=e=>setOn(e.target.checked);
  pop.querySelector('#mu_vol').oninput=e=>setVol(e.target.value/100);
  paint();
  if(st.on){start();const go=()=>{if(st.on&&ctx&&ctx.state!=='running')ctx.resume();document.removeEventListener('pointerdown',go);document.removeEventListener('keydown',go)};
    document.addEventListener('pointerdown',go);document.addEventListener('keydown',go)}   // browsers may wait for a first click before sound
}
root.NurseMusic={setOn,setVol,state:()=>({...st,playing:!!timer,ctxState:ctx&&ctx.state})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
})(typeof window!=='undefined'?window:globalThis);
