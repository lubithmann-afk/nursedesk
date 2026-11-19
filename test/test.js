const fs=require('fs'),path=require('path'),os=require('os');
const {parsePptx}=require('../lib/pptx');const {parsePdf}=require('../lib/pdf');const {Index}=require('../lib/search');const ai=require('../lib/ai');
(async()=>{
const out=fs.mkdtempSync(path.join(os.tmpdir(),'nd-'));
const slides=await parsePptx(fs.readFileSync(path.join(__dirname,'sample.pptx')),out,fs);
console.assert(slides.length===2,'2 slides');console.assert(slides[0].title==='Warfarin (Coumadin)','title');
console.assert(slides[0].text.length===4,'paras '+slides[0].text.length);console.assert(/INR/.test(slides[0].notes.join()),'notes');
const ix=new Index();ix.build(slides.map(s=>({id:s.n,deck:'Sample',n:s.n,title:s.title,body:s.text.join('\n')+'\n'+s.notes.join(' ')})));
const r=ix.search('what is the antidote for warfarin');console.assert(r[0].n===1,'search top');
console.assert(ix.search('chest tube bubbling')[0].n===2,'search 2');
// PDF import: one library page per PDF page, searchable alongside slides
const pg=await parsePdf(fs.readFileSync(path.join(__dirname,'sample.pdf')));
console.assert(pg.length===2,'2 pdf pages '+pg.length);console.assert(pg[0].title==='Heparin monitoring','pdf title '+pg[0].title);
console.assert(/protamine sulfate/.test(pg[0].text.join(' ')),'pdf text spacing');
const ix2=new Index();ix2.build(pg.map(s=>({id:s.n,deck:'Guide',n:s.n,unit:'page',title:s.title,body:s.text.join('\n')})));
console.assert(ix2.search('digoxin therapeutic level')[0].n===2&&ix2.search('digoxin')[0].unit==='page','pdf search');
// mocked API: first turn asks for search_library, second answers
let calls=0;global.fetch=async(u,o)=>{calls++;const b=JSON.parse(o.body);
 const tools=b.tools.map(t=>t.name);console.assert(tools.includes('search_library')&&tools.includes('web_search'),'tools');
 console.assert(b.tools.find(t=>t.name==='web_search').allowed_domains.includes('ncsbn.org'),'domains');
 const body=calls===1?{stop_reason:'tool_use',content:[{type:'tool_use',id:'t1',name:'search_library',input:{query:'warfarin antidote'}}]}:{stop_reason:'end_turn',content:[{type:'text',text:'Vitamin K [Sample, slide 1]'}]};
 if(calls===2){const tr=b.messages[b.messages.length-1].content[0];console.assert(/slide 1/.test(tr.content),'tool result has slide')}
 return{ok:true,json:async()=>body}};
const res=await ai.ask([{role:'user',content:'antidote for warfarin?'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:q=>ix.search(q,5),allowWeb:true});
console.assert(/Vitamin K/.test(res.text),'ai text');// No approval: the web tool is not even offered, the AI is told to ask first, and the ask-token is turned into a flag.
let c2=0;global.fetch=async(u,o)=>{c2++;const b=JSON.parse(o.body);
 console.assert(!b.tools.some(t=>t.name==='web_search'),'web_search must NOT be offered without approval');
 console.assert(/My own thoughts \(not from your materials/.test(b.system)&&/never search the web or imply you did/i.test(b.system)&&/\[\[ASK_WEB\]\]/.test(b.system),'prompt tells it to ask first');
 return{ok:true,json:async()=>({stop_reason:'end_turn',content:[{type:'text',text:'Your library does not cover this. Want me to check trusted sites?\n[[ASK_WEB]]'}]})}};
const r2=await ai.ask([{role:'user',content:'something not in the library'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:()=>[]});
console.assert(r2.askWeb===true&&!/ASK_WEB/.test(r2.text)&&r2.usedWeb===false,'ask flag set, token stripped');
// Approved: web tool offered, and the prompt demands a source and URL for every web fact.
global.fetch=async(u,o)=>{const b=JSON.parse(o.body);
 console.assert(b.tools.some(t=>t.name==='web_search'),'web_search offered once approved');
 console.assert(/full URL/.test(b.system)&&/APPROVED/.test(b.system),'approved prompt requires sources');
 return{ok:true,json:async()=>({stop_reason:'end_turn',content:[{type:'text',text:'ok'}]})}};
const r3=await ai.ask([{role:'user',content:'yes'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:()=>[],allowWeb:true});
console.assert(r3.askWeb===false,'no ask flag when approved');
console.log('approval tests ran');
// Medications data: every medication points at real library text or real questions, and every excerpt resolves.
const MD=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','meds.js'),'utf8').replace(/^window\.MEDS=/,'').replace(/;$/,''));
const QD=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','questions.js'),'utf8').replace(/^window\.QD=/,'').replace(/;$/,''));
const qids=new Set(QD.bank.map(q=>q.id));
console.assert(MD.meds.length>200,'many medications '+MD.meds.length);
const FK=['cls','moa','adm','se','labs','nsg'];
console.assert(MD.meds.every(m=>FK.every(k=>m.f[k]&&m.f[k].g.length>0)),'every medication has all six sections filled');
console.assert(MD.meds.every(m=>FK.every(k=>m.f[k].m.every(x=>MD.units[x.u]&&MD.units[x.u].l[x.i]!==undefined&&MD.units[x.u].l[x.i].trim().startsWith(x.x.slice(0,20))||MD.units[x.u].l[x.i].includes(x.x.slice(0,20))))),'every cited line is a real line of its slide or page');
const dg=MD.meds.find(m=>m.name==='digoxin');
console.assert(dg.f.labs.m.some(x=>/0\.5-2 ng/.test(x.x))||dg.f.labs.g.some(x=>/0\.5-2/.test(x)),'digoxin level present');
console.assert(MD.meds.every(m=>m.q.every(id=>qids.has(id))),'every question link resolves');
console.assert(MD.cats.flatMap(c=>c.c.flatMap(x=>x.m)).length===MD.meds.length,'every medication is in a category');
console.log('medication data checks ran:',MD.meds.length,'medications');
// Saved web notes: store rules, the SAVE block (honoured only after web approval), cited pages with quotes, and reuse by search.
const {Notes,CATEGORIES}=require('../lib/notes');
const nf=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'nd-notes-')),'n.json');const store=new Notes(nf);
console.assert(store.add({title:'x',summary:'y',sources:[]})===null,'no source -> not saved');
console.assert(store.add({title:'x',summary:'y',sources:[{url:'http://insecure.example'}]})===null,'http source not accepted');
const sv=store.add({title:'Heparin aPTT goal',category:'pharmacology & labs',summary:'Goal is 1.5 to 2.5 times control.',question:'aPTT goal for heparin?',sources:[{title:'Mayo Clinic',url:'https://www.mayoclinic.org/heparin',quote:'aPTT 60-80 seconds'}]});
console.assert(sv&&sv.isNew&&sv.note.category==='Pharmacology & Labs','saved with normalised category');
console.assert(store.add({title:'heparin  APTT goal!',summary:'newer text',sources:[{title:'NIH',url:'https://www.nih.gov/h'}]}).isNew===false&&store.list().length===1&&store.list()[0].sources.length===2,'same topic merges sources');
console.assert(new Notes(nf).list().length===1,'persists to disk');
const ix3=new Index();ix3.build(store.toDocs());const nh=ix3.search('heparin aPTT goal')[0];
console.assert(nh&&nh.unit==='note'&&/mayoclinic\.org/.test(nh.body),'saved note is searchable and carries its source');
const blk='\n[[SAVE]]{"title":"Heparin aPTT goal","category":"Pharmacology & Labs","summary":"Goal is 1.5 to 2.5 times control."}[[/SAVE]]';
global.fetch=async(u,o)=>({ok:true,json:async()=>({stop_reason:'end_turn',content:[{type:'text',text:'From the web (you approved this search): goal is 1.5-2.5x control.'+blk,citations:[{type:'web_search_result_location',url:'https://www.mayoclinic.org/heparin',title:'Heparin - Mayo Clinic',cited_text:'aPTT 60-80 seconds'}]},{type:'web_search_tool_result',content:[{url:'https://www.mayoclinic.org/heparin',title:'Heparin - Mayo Clinic'},{url:'https://example.org/unused',title:'Unused result'}]}]})});
const w1=await ai.ask([{role:'user',content:'q'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:()=>[],allowWeb:true,categories:CATEGORIES});
console.assert(w1.save&&w1.save.title==='Heparin aPTT goal'&&!/SAVE/.test(w1.text),'save block parsed and hidden');
console.assert(w1.sources.length===1&&w1.sources[0].quote==='aPTT 60-80 seconds','cited page and its quote are kept (not every search result)');
const w2=await ai.ask([{role:'user',content:'q'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:()=>[],allowWeb:false,categories:CATEGORIES});
console.assert(w2.save===null&&!/SAVE/.test(w2.text),'without approval a save block is ignored and hidden');
let pr='';global.fetch=async(u,o)=>{pr=JSON.parse(o.body).system;return{ok:true,json:async()=>({stop_reason:'end_turn',content:[{type:'text',text:'ok'}]})}};
await ai.ask([{role:'user',content:'q'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:()=>[],allowWeb:true,categories:CATEGORIES});
console.assert(/\[\[SAVE\]\]/.test(pr)&&/Cardiovascular/.test(pr)&&/ONLY facts that came from the web pages you cited/.test(pr),'approved prompt asks for a sourced save block with the category list');
let tr='';let n3=0;global.fetch=async(u,o)=>{n3++;const b=JSON.parse(o.body);if(n3===2)tr=b.messages[b.messages.length-1].content[0].content;return{ok:true,json:async()=>n3===1?{stop_reason:'tool_use',content:[{type:'tool_use',id:'t',name:'search_library',input:{query:'heparin aptt'}}]}:{stop_reason:'end_turn',content:[{type:'text',text:'ok'}]}}};
await ai.ask([{role:'user',content:'q'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:q=>ix3.search(q,3),allowWeb:false,categories:CATEGORIES});
console.assert(/Saved web note: Heparin aPTT goal/.test(tr)&&/Source: Mayo Clinic/.test(tr),'AI sees saved notes first, labelled, with the original source');
// Citations alone (no raw search-result block) still count as a web answer and still carry their pages.
global.fetch=async()=>({ok:true,json:async()=>({stop_reason:'end_turn',content:[{type:'text',text:'x'+blk,citations:[{type:'web_search_result_location',url:'https://www.cdc.gov/p',title:'CDC page',cited_text:'quote'}]}]})});
const w3=await ai.ask([{role:'user',content:'q'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:()=>[],allowWeb:true,categories:CATEGORIES});
console.assert(w3.usedWeb===true&&w3.sources.length===1&&w3.save,'cited pages alone count as web use');
console.log('saved web notes tests ran');
// Game mode rules: 15 climbing questions, safe havens, walk-away, lifelines, categories.
const GL=require('../renderer/gamelogic.js');
const QDg=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','questions.js'),'utf8').replace(/^window\.QD=/,'').replace(/;$/,''));
const MDg=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','meds.js'),'utf8').replace(/^window\.MEDS=/,'').replace(/;$/,''));
let seed=11;const grng=()=>(seed=(seed*1664525+1013904223)%4294967296)/4294967296;
const gcats=GL.categories(QDg,MDg);
console.assert(gcats.length>30&&['Test topics','Practice tests','Weekly quizzes','Medication categories'].every(g=>gcats.some(c=>c.group===g)),'menu has test and medication categories');
console.assert(gcats.every(c=>c.own.length>0&&c.own.every(GL.playable)),'every category only offers single-answer four-option questions');
const g1=GL.buildGame(gcats[0].own,[],{},grng,15);
console.assert(g1.length===15&&new Set(g1.map(x=>x.id)).size===15,'15 different questions');
console.assert(g1.every(x=>x.opts.length===4&&x.correct>=0&&x.correct<4),'four shuffled options with a valid correct index');
const orig=new Map(QDg.bank.map(b=>[b.id,b]));
console.assert(g1.every(x=>{const b=orig.get(x.id);return x.opts[x.correct]===b.o[b.a]}),'shuffling keeps the right answer right');
const avg=a=>a.reduce((s,x)=>s+x.q.length+x.opts.join('').length,0)/a.length;
console.assert(avg(g1.slice(-5))>avg(g1.slice(0,5)),'later questions are harder');
const smallCat=gcats.find(c=>c.group==='Medication categories'&&c.own.length<15);
const g2=GL.buildGame(smallCat.own,smallCat.fill,{},grng,15);
console.assert(g2.length===15&&g2.filter(x=>!x.filler).length===smallCat.own.length,'a small category is topped up to 15 and own questions are all used');
console.assert(GL.payoutWrong(3)===0&&GL.payoutWrong(4)===0&&GL.payoutWrong(5)===1000&&GL.payoutWrong(9)===1000&&GL.payoutWrong(10)===32000&&GL.payoutWrong(14)===32000,'safe havens at $1,000 and $32,000');
console.assert(GL.payoutWalk(0)===0&&GL.payoutWalk(6)===2000&&GL.LADDER[14]===1000000,'walk-away pays the last answered rung');
const hid=new Set(GL.fifty(2,new Set(),grng));console.assert(hid.size===2&&!hid.has(2),'50:50 removes two wrong answers');
const au=GL.audience(2,3,hid,grng);console.assert(au.reduce((a,b)=>a+b)===100&&[...hid].every(i=>au[i]===0),'audience adds to 100 and ignores removed answers');
const fr=GL.friend(1,0,new Set(),grng);console.assert(fr.pick>=0&&fr.pick<4,'friend picks an answer');
console.log('game mode tests ran');
// Challenge-mode coach: the first call must not reveal the answer; the second gets the key, rationale and the student's reasoning.
const {coach,buildPrompt}=require('../lib/coach');
const cq={question:'A client reports chest pain. What should the nurse do first?',options:['Obtain an ECG','Give aspirin','Call the family','Document'],chosen:[0],correct:[1],rationale:'SECRET-RATIONALE'};
const p1=buildPrompt({...cq,stage:'prompt'});
console.assert(!/SECRET-RATIONALE|Correct answer|CORRECT|INCORRECT/.test(p1.messages[0].content),'coach prompt stage never contains the answer key or rationale');
console.assert(/Do NOT say or hint/.test(p1.messages[0].content)&&/Safety first/.test(p1.system),'prompt stage forbids hints and the coach is safety-first');
const p2=buildPrompt({...cq,stage:'feedback',explanation:'ECG first to look for ST changes'});
console.assert(/SECRET-RATIONALE/.test(p2.messages[0].content)&&/INCORRECT/.test(p2.messages[0].content)&&/ECG first/.test(p2.messages[0].content),'feedback stage has the key, result, rationale and the student explanation');
console.assert(/CORRECT/.test(buildPrompt({...cq,stage:'feedback',chosen:[1]}).messages[0].content.match(/student was \w+/)[0]),'a correct pick is reported as correct');
console.assert(buildPrompt({stage:'feedback',question:'q',options:['a','b'],chosen:[9],correct:[-1,5]}).messages[0].content.includes('(nothing)'),'out-of-range choices are ignored');
let cb=null;global.fetch=async(u,o)=>{cb={h:o.headers,b:JSON.parse(o.body)};return{ok:true,json:async()=>({content:[{type:'text',text:'  Why that choice?  '}]})}};
const ct=await coach({...cq,stage:'prompt'},{key:'k-test'});
console.assert(ct==='Why that choice?'&&cb.h['x-api-key']==='k-test'&&!cb.b.tools&&cb.b.max_tokens<=500,'coach makes one plain call with no tools');
let nk='';try{await coach({...cq,stage:'prompt'},{key:''})}catch(e){nk=String(e.message)}console.assert(/No API key/.test(nk),'coach needs a key');
const allc=GL.categories(QDg,MDg,{all:true});
console.assert(allc[0].own.length===QDg.bank.length&&allc[0].own.some(q=>Array.isArray(q.a)),'challenge categories include select-all questions');
console.log('challenge coach tests ran');
// Glossary: unique terms, valid categories, and every class-material entry cites a real line in a bundled deck.
const GLD=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','glossary.js'),'utf8').replace(/^window\.GLOSSARY=/,'').replace(/;$/,''));
console.assert(GLD.terms.length>600&&new Set(GLD.terms.map(x=>x.t.toLowerCase())).size===GLD.terms.length,'many glossary terms, none duplicated');
console.assert(GLD.terms.every(x=>x.d&&x.d.length>=3&&GLD.cats.includes(x.c)),'every term has a definition and a valid category');
const gnorm=s=>String(s).replace(/’/g,"'").replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
const gdecks=new Map();for(const f of fs.readdirSync(path.join(__dirname,'..','data','seed'))){const d=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','seed',f,'deck.json'),'utf8'));gdecks.set(d.id,d)}
const gmat=GLD.terms.filter(x=>x.m);
console.assert(gmat.length>50&&gmat.every(x=>{const d=gdecks.get(x.m.d);const sl=d&&d.slides.find(s=>s.n===x.m.n);return sl&&sl.text.some(l=>gnorm(l).includes(gnorm(x.m.l).slice(0,60)))}),'every class-material glossary entry cites a real slide or page line');
console.assert(gmat.every(x=>{const d=gdecks.get(x.m.d);const sl=d.slides.find(s=>s.n===x.m.n);const blob=gnorm(sl.text.join(' ')).toLowerCase();return gnorm(x.d).toLowerCase().replace(/[.)]+$/,'').split(' ').slice(0,4).every(w=>blob.includes(w.replace(/[.,;]/g,'')))}),'class-material definitions come from the cited slide text');
console.assert(['Aphasia','-itis','Hemiplegia','Goodell sign'].every(k=>GLD.terms.some(x=>x.t.toLowerCase()===k.toLowerCase())),'key terms and word parts are present');
console.log('glossary tests ran:',GLD.terms.length,'terms,',gmat.length,'from class materials');
// Built-in AI (optional): off until the disclaimer is accepted; installs from downloads; labels every answer; offline fallback quotes materials.
{const LC=require('../lib/local'),JZ=require('jszip'),os=require('os');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'nd-local-'));
const zip=new JZ();zip.file('llama-server.exe','x');zip.file('ggml.dll','y');const zbuf=await zip.generateAsync({type:'nodebuffer'});
const calls2=[];const stream=b=>({ok:true,status:200,headers:{get:()=>String(b.length)},body:(async function*(){yield b})()});
const fake=async(u,o)=>{calls2.push(String(u));
 if(/releases\?per_page/.test(u))return{ok:true,json:async()=>([{tag_name:'b2',assets:[]},{tag_name:'b1',assets:[{name:'llama-b1-bin-win-cpu-x64.zip',browser_download_url:'https://x/engine.zip'},{name:'other.zip',browser_download_url:'https://x/o.zip'}]}])};
 if(/engine\.zip/.test(u))return stream(zbuf);if(/\.gguf/.test(u))return stream(Buffer.from('model'));
 if(/\/health/.test(u))return{ok:true,json:async()=>({})};
 if(/chat\/completions/.test(u)){const b=JSON.parse(o.body);fake.last=b;return{ok:true,json:async()=>({choices:[{message:{content:' Probably X. '}}]})}}
 return{ok:false,status:404,json:async()=>({})}};
const sp=()=>({on(){},kill(){}});
const L=LC.create({dir,fetchFn:fake,platform:'win32',spawnFn:sp});
console.assert(L.state().enabled===false&&L.state().installed===false,'built-in AI is off by default');
let e1='';try{L.setEnabled(true,false)}catch(e){e1=e.message}console.assert(/disclaimer/.test(e1),'cannot switch on without accepting the disclaimer');
const prog=[];await L.install(s=>prog.push(s));
console.assert(L.state().installed&&fs.existsSync(path.join(dir,'bin','llama-server.exe'))&&calls2.some(u=>/\.gguf/.test(u)),'engine and model download and unpack');
L.setEnabled(true,true);console.assert(L.state().enabled,'switched on after accepting');
const ans=await L.chat([{role:'user',content:'What is digoxin toxicity?'}],[{deck:'Unit 8',unit:'slide',n:36,title:'Lanoxin',body:'x\nVisual halos'}]);
console.assert(ans.startsWith(LC.LABEL)&&/Probably X\./.test(ans),'every built-in answer is labelled as its own thoughts');
const um=fake.last.messages;console.assert(um[0].role==='system'&&/Unit 8, slide 36/.test(um[um.length-1].content)&&/digoxin toxicity/.test(um[um.length-1].content),'question and excerpts reach the model');
const off=LC.offlineText('q',[{deck:'Unit 8',unit:'slide',n:36,title:'Lanoxin',body:'x\nVisual halos'}]);console.assert(/word-for-word/.test(off)&&/Unit 8, slide 36/.test(off),'offline fallback quotes the library with citations');
console.assert(/nothing in your library/.test(LC.offlineText('q',[])),'offline fallback says when nothing matched');
console.assert(LC.create({dir:fs.mkdtempSync(path.join(os.tmpdir(),'nd-l2-')),fetchFn:fake,platform:'linux'}).state().supported===false,'only supported on Windows');
const bad=async()=>{throw Object.assign(new TypeError('fetch failed'),{cause:{code:'ENOTFOUND'}})};
let ne='';try{await LC.create({dir:fs.mkdtempSync(path.join(os.tmpdir(),'nd-l3-')),fetchFn:bad,netFetch:bad,platform:'win32'}).install()}catch(e){ne=e.message}
console.assert(/api\.github\.com/.test(ne)&&/ENOTFOUND/.test(ne),'network failures name the site and the cause, not just "fetch failed"');
const gp=path.join(os.tmpdir(),'m.gguf'),fb=Buffer.alloc(60*1048576);fb.write('GGUF');fs.writeFileSync(gp,fb);
const L4=LC.create({dir:fs.mkdtempSync(path.join(os.tmpdir(),'nd-l4-')),fetchFn:fake,platform:'win32'});L4.importModel(gp);
const before=calls2.length;await L4.install();console.assert(L4.state().installed&&!calls2.slice(before).some(u=>/\.gguf/.test(u)),'an imported model is used and not downloaded again');
fs.writeFileSync(gp,Buffer.alloc(60*1048576));let ie='';try{L4.importModel(gp)}catch(e){ie=e.message}console.assert(/not a .gguf/.test(ie),'a non-gguf file is rejected');
fs.writeFileSync(gp,Buffer.from('GGUFxx'));ie='';try{L4.importModel(gp)}catch(e){ie=e.message}console.assert(/too small/.test(ie),'a tiny file is rejected');fs.rmSync(gp);
L.remove();console.assert(!L.state().installed&&!L.state().enabled,'delete removes the download and switches off');
console.log('built-in AI tests ran');}
// Key check + usage tracking
{const {Usage}=require('../lib/usage'),os2=require('os');const U2=new Usage(path.join(fs.mkdtempSync(path.join(os2.tmpdir(),'nd-u-')),'u.json'));
const nowd=new Date('2026-11-19T12:00:00Z');
U2.add({input_tokens:1000,output_tokens:200},nowd);U2.add({input_tokens:500,output_tokens:100,cache_read_input_tokens:50},nowd);
let sm=U2.summary(nowd);console.assert(sm.month.in===1550&&sm.month.out===300&&sm.month.calls===2&&sm.all.calls===2,'usage adds tokens exactly');
console.assert(sm.monthCost===null&&sm.remaining===null,'no dollar figures until the student enters prices');
U2.setPrices(3,15);U2.setCredit(10,nowd);sm=U2.summary(nowd);const exp=(1550*3+300*15)/1e6;
console.assert(Math.abs(sm.monthCost-exp)<1e-9&&Math.abs(sm.remaining-(10-0))<1e-9,'cost is tokens x entered price; remaining counts spending after the credit was set');
U2.add({input_tokens:1000000,output_tokens:0},new Date('2026-12-02T00:00:00Z'));sm=U2.summary(new Date('2026-12-02T00:00:00Z'));
console.assert(sm.month.in===1000000&&sm.all.in===1001550&&Math.abs(sm.remaining-7)<1e-9,'months roll over and credit left drops by later spending');
const AIK=require('../lib/ai');const mk=(st,body,h)=>async()=>({ok:st<300,status:st,json:async()=>body,headers:{get:n=>(h||{})[n]||null}});
console.assert((await AIK.checkKey('k',mk(200,{usage:{input_tokens:8,output_tokens:1}},{'anthropic-ratelimit-requests-remaining':'49','anthropic-ratelimit-requests-limit':'50'}))).limits.requestsRemaining==='49','valid key reports its rate limits');
console.assert((await AIK.checkKey('k',mk(401,{error:{message:'invalid x-api-key'}}))).status==='rejected','401 means rejected');
console.assert((await AIK.checkKey('k',mk(400,{error:{message:'Your credit balance is too low to access the Anthropic API.'}}))).status==='no_credit','low credit is detected');
console.assert((await AIK.checkKey('k',mk(429,{error:{message:'rate'}}))).status==='rate_limited','429 is rate limited');
console.assert((await AIK.checkKey('k',async()=>{throw new Error('net')})).status==='offline'&&(await AIK.checkKey('')).status==='none','offline and no-key cases');
let got=null;AIK.setUsageHook(u=>{got=u});const sf=global.fetch;global.fetch=async()=>({ok:true,status:200,json:async()=>({content:[{type:'text',text:'x'}],usage:{input_tokens:7,output_tokens:3}})});
await AIK.complete({key:'k',system:'s',messages:[{role:'user',content:'q'}]});global.fetch=sf;AIK.setUsageHook(null);
console.assert(got&&got.input_tokens===7&&got.output_tokens===3,'real requests report their token usage to the tracker');
console.log('key status tests ran');}
console.log('all tests ran; calls',calls,'| top hit:',r[0].title);
})();
