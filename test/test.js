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
console.log('all tests ran; calls',calls,'| top hit:',r[0].title);
})();
