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
 console.assert(/do NOT answer from memory/.test(b.system)&&/\[\[ASK_WEB\]\]/.test(b.system),'prompt tells it to ask first');
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
console.assert(MD.meds.every(m=>m.s.length+m.q.length>0),'every medication has a source');
console.assert(MD.meds.every(m=>m.s.every(x=>MD.units[x.u]&&x.k.every(i=>MD.units[x.u].l[i]!==undefined))),'every excerpt resolves');
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
console.log('all tests ran; calls',calls,'| top hit:',r[0].title);
})();
