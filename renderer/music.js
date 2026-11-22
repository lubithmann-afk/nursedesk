// Soft background music. Three choices, all off until you turn them on:
//  1. Calm pad: a quiet pad generated live (Web Audio), no files.
//  2. Moonlight Sonata (synthesized): Beethoven is public domain, so the app plays its own synthesized piano from the score.
//     It is an approximation of the opening figure written from memory, NOT a recording. See the note in the menu.
//  3. My own music: you pick audio files from your computer; they are kept in the app's own storage and loop quietly.
// Nothing copyrighted ships with the app.
(function(root){
const ns=m=>440*Math.pow(2,(m-69)/12);                            // MIDI note -> Hz
const CHORDS=[[48,55,59,64,67],[45,55,60,64,67],[41,55,57,60,64],[43,55,59,64,69]];
const BELLS=[72,74,76,79,81,84];
const CHORD_SECS=14;
// Moonlight Sonata opening figure (C# minor): triplet arpeggios over octave basses, four bars, looped.
// bass: MIDI notes held for the bar; rh: the three-note triplet group, played four times per bar (12 notes).
const MOON={step:0.24,bars:[
  {bass:[37,49],rh:[56,61,64]},   // C# minor
  {bass:[35,47],rh:[56,61,64]},   // over B
  {bass:[33,45],rh:[57,61,66]},   // F# minor over A
  {bass:[32,44],rh:[56,60,63]}    // G# (dominant)
],melody:[[0,2,68],[2,1,69],[3,1,68]]};     // [start bar, bars long, MIDI] sung on every second pass
const MODES=['pad','moon','files'];
function clampVol(v){v=+v;return isFinite(v)?Math.min(1,Math.max(0,v)):0.3}
function load(){try{const s=JSON.parse(localStorage.getItem('nd_music')||'null');return{on:!!(s&&s.on),vol:clampVol(s&&s.vol!=null?s.vol:0.3),mode:s&&MODES.includes(s.mode)?s.mode:'pad'}}catch(e){return{on:false,vol:0.3,mode:'pad'}}}
function save(s){try{localStorage.setItem('nd_music',JSON.stringify(s))}catch(e){}}
const api={CHORDS,BELLS,CHORD_SECS,MOON,MODES,ns,clampVol,load,save};
if(typeof module!=='undefined'&&module.exports){module.exports=api;return}

let ctx=null,master=null,timer=null,idx=0,pass=0,live=[],st=load(),audio=null,playlist=[],track=0,urls=[];
// ---------- shared Web Audio graph
function reverb(c){const len=c.sampleRate*4,buf=c.createBuffer(2,len,c.sampleRate);
  for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5)}
  const r=c.createConvolver();r.buffer=buf;return r}
function build(){
  const AC=root.AudioContext||root.webkitAudioContext;if(!AC)return false;
  ctx=new AC();master=ctx.createGain();master.gain.value=0;
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;lp.Q.value=0.3;
  const dry=ctx.createGain(),wet=ctx.createGain(),rv=reverb(ctx);dry.gain.value=0.6;wet.gain.value=0.5;
  lp.connect(dry);lp.connect(rv);rv.connect(wet);dry.connect(master);wet.connect(master);master.connect(ctx.destination);ctx._in=lp;return true}
function keep(o){live.push(o);o.onended=()=>{live=live.filter(x=>x!==o)}}
// ---------- 1. calm pad
function voice(freq,t0,dur,peak,type,det){
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;o.detune.value=det||0;
  const a=Math.min(5,dur*0.4),r=Math.min(6,dur*0.45);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(peak,t0+a);g.gain.setValueAtTime(peak,t0+dur-r);g.gain.linearRampToValueAtTime(0,t0+dur);
  o.connect(g);g.connect(ctx._in);o.start(t0);o.stop(t0+dur+0.1);keep(o)}
function padChord(){
  const t=ctx.currentTime+0.05,dur=CHORD_SECS+6;
  CHORDS[idx%CHORDS.length].forEach((m,i)=>{voice(ns(m),t,dur,0.05,'sine',(i%2?4:-4));voice(ns(m)*2,t,dur,0.012,'triangle',i*2-4)});
  for(let k=0;k<2;k++){const m=BELLS[Math.floor(Math.random()*BELLS.length)];voice(ns(m),t+3+Math.random()*(CHORD_SECS-6),7,0.018,'sine',0)}
  idx++}
// ---------- 2. synthesized piano (Moonlight Sonata)
function piano(m,t0,dur,peak){
  const f=ns(m);[[1,1],[2,0.42],[3,0.18],[4,0.07]].forEach(([k,a])=>{
    const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*k;
    g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(peak*a,t0+0.008);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur/k**0.4);
    o.connect(g);g.connect(ctx._in);o.start(t0);o.stop(t0+dur+0.1);keep(o)})}
function moonPass(){
  const t=ctx.currentTime+0.1,S=MOON.step,bar=12*S;
  MOON.bars.forEach((b,i)=>{const t0=t+i*bar;
    b.bass.forEach(m=>piano(m,t0,bar*1.6,0.10));
    for(let n=0;n<12;n++)piano(b.rh[n%3],t0+n*S,2.2,0.055)});
  if(pass%2===1)MOON.melody.forEach(([b,len,m])=>piano(m,t+b*bar,len*bar*1.3,0.09));
  pass++}
// ---------- 3. your own files (kept in IndexedDB so they are remembered)
function db(){return new Promise((res,rej)=>{try{const r=indexedDB.open('nd_music',1);r.onupgradeneeded=()=>r.result.createObjectStore('files',{keyPath:'name'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})}
async function listFiles(){try{const d=await db();return await new Promise(res=>{const q=d.transaction('files').objectStore('files').getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>res([])})}catch(e){return[]}}
async function addFiles(files){try{const d=await db();const tx=d.transaction('files','readwrite');[...files].forEach(f=>tx.objectStore('files').put({name:f.name,blob:f}));await new Promise(r=>{tx.oncomplete=r;tx.onerror=r})}catch(e){}}
async function clearFiles(){try{const d=await db();const tx=d.transaction('files','readwrite');tx.objectStore('files').clear();await new Promise(r=>{tx.oncomplete=r;tx.onerror=r})}catch(e){}}
async function startFiles(){
  playlist=(await listFiles()).sort((a,b)=>a.name.localeCompare(b.name));urls.forEach(u=>URL.revokeObjectURL(u));urls=[];
  if(!playlist.length){paint();return}
  urls=playlist.map(p=>URL.createObjectURL(p.blob));track=0;
  if(!audio){audio=new Audio();audio.addEventListener('ended',()=>{track=(track+1)%urls.length;audio.src=urls[track];audio.play().catch(()=>{})});
    audio.addEventListener('error',()=>{if(urls.length>1){track=(track+1)%urls.length;audio.src=urls[track];audio.play().catch(()=>{})}})}
  audio.src=urls[0];audio.volume=st.vol;audio.play().catch(()=>{})}
function stopFiles(){if(audio){audio.pause()}}
// ---------- control
function start(){
  if(st.mode==='files'){startFiles();return}
  if(!ctx&&!build())return;
  ctx.resume&&ctx.resume();
  master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(st.vol*0.9,ctx.currentTime,1.5);
  if(timer)return;
  if(st.mode==='moon'){pass=0;moonPass();timer=setInterval(moonPass,MOON.bars.length*12*MOON.step*1000)}
  else{padChord();timer=setInterval(padChord,CHORD_SECS*1000)}}
function stop(){
  stopFiles();
  if(timer){clearInterval(timer);timer=null}
  if(ctx){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(0,ctx.currentTime,0.6);const c=ctx;
    setTimeout(()=>{if(!timer&&ctx===c){live.forEach(o=>{try{o.stop()}catch(e){}});live=[];c.suspend&&c.suspend()}},2500)}}
function setOn(on){st.on=!!on;save(st);on?start():stop();paint()}
function setMode(m){if(!MODES.includes(m))return;const was=st.on;if(was)stop();st.mode=m;save(st);
  if(was)setTimeout(start,m==='files'?0:400);paint()}   // short pause so the old sound can fade
function setVol(v){st.vol=clampVol(v);save(st);if(ctx&&timer)master.gain.setTargetAtTime(st.vol*0.9,ctx.currentTime,0.2);if(audio)audio.volume=st.vol;paint()}
// ---------- UI
let btn,pop;
async function paint(){if(!btn)return;btn.classList.toggle('on',st.on);btn.title=st.on?'Background music is on':'Background music is off';
  if(!pop)return;pop.querySelector('#mu_on').checked=st.on;pop.querySelector('#mu_vol').value=Math.round(st.vol*100);pop.querySelector('#mu_v').textContent=Math.round(st.vol*100)+'%';
  pop.querySelectorAll('input[name=mu_mode]').forEach(r=>r.checked=r.value===st.mode);
  pop.querySelector('#mu_files').style.display=st.mode==='files'?'':'none';pop.querySelector('#mu_moonnote').style.display=st.mode==='moon'?'':'none';
  const n=(await listFiles()).length;pop.querySelector('#mu_count').textContent=n?n+' file'+(n===1?'':'s')+' chosen':'No files chosen yet'}
function ui(){
  btn=document.createElement('button');btn.id='music';btn.setAttribute('aria-label','Background music');btn.textContent='🎵';
  pop=document.createElement('div');pop.id='musicpop';pop.hidden=true;
  pop.innerHTML=`<label class="murow"><input type="checkbox" id="mu_on"> <b>Background music</b></label>
   <label class="murow"><input type="radio" name="mu_mode" value="pad"> Calm pad (generated)</label>
   <label class="murow"><input type="radio" name="mu_mode" value="moon"> Moonlight Sonata (synthesized piano)</label>
   <label class="murow"><input type="radio" name="mu_mode" value="files"> My own music files</label>
   <div class="murow"><input type="range" id="mu_vol" min="0" max="100" aria-label="Music volume"><span id="mu_v"></span></div>
   <div id="mu_files" class="mnote"><div class="murow"><button id="mu_pick" type="button">Choose music…</button><button id="mu_clear" type="button">Clear</button></div><div id="mu_count"></div>
     <input type="file" id="mu_in" accept="audio/*" multiple hidden>Pick MP3, WAV, M4A or OGG files on your computer (for example a recording of Moonlight Sonata). They stay on this computer and loop quietly.</div>
   <div id="mu_moonnote" class="mnote">Beethoven’s Moonlight Sonata is public domain, but this is the app’s own synthesized piano playing the opening figure from the score, not a recording, and may differ from the real piece in places. For a real recording, use “My own music files”.</div>
   <div class="mnote">Off until you turn it on. Nothing copyrighted comes with the app.</div>`;
  document.body.appendChild(btn);document.body.appendChild(pop);
  btn.onclick=e=>{e.stopPropagation();pop.hidden=!pop.hidden;paint()};
  document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&e.target!==btn)pop.hidden=true});
  pop.querySelector('#mu_on').onchange=e=>setOn(e.target.checked);
  pop.querySelectorAll('input[name=mu_mode]').forEach(r=>r.onchange=()=>setMode(r.value));
  pop.querySelector('#mu_vol').oninput=e=>setVol(e.target.value/100);
  const fin=pop.querySelector('#mu_in');pop.querySelector('#mu_pick').onclick=()=>fin.click();
  fin.onchange=async()=>{if(fin.files.length){await addFiles(fin.files);fin.value='';if(st.on&&st.mode==='files'){stop();await startFiles()}paint()}};
  pop.querySelector('#mu_clear').onclick=async()=>{await clearFiles();stopFiles();paint()};
  paint();
  if(st.on){start();const go=()=>{if(st.on){if(ctx&&ctx.state!=='running')ctx.resume();if(audio&&audio.paused&&urls.length)audio.play().catch(()=>{})}document.removeEventListener('pointerdown',go);document.removeEventListener('keydown',go)};
    document.addEventListener('pointerdown',go);document.addEventListener('keydown',go)}}
root.NurseMusic={setOn,setVol,setMode,state:()=>({...st,playing:!!timer,ctxState:ctx&&ctx.state,tracks:urls.length,audioPaused:audio?audio.paused:null})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
})(typeof window!=='undefined'?window:globalThis);
