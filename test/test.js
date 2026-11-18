const fs=require('fs'),path=require('path'),os=require('os');
const {parsePptx}=require('../lib/pptx');const {Index}=require('../lib/search');const ai=require('../lib/ai');
(async()=>{
const out=fs.mkdtempSync(path.join(os.tmpdir(),'nd-'));
const slides=await parsePptx(fs.readFileSync(path.join(__dirname,'sample.pptx')),out,fs);
console.assert(slides.length===2,'2 slides');console.assert(slides[0].title==='Warfarin (Coumadin)','title');
console.assert(slides[0].text.length===4,'paras '+slides[0].text.length);console.assert(/INR/.test(slides[0].notes.join()),'notes');
const ix=new Index();ix.build(slides.map(s=>({id:s.n,deck:'Sample',n:s.n,title:s.title,body:s.text.join('\n')+'\n'+s.notes.join(' ')})));
const r=ix.search('what is the antidote for warfarin');console.assert(r[0].n===1,'search top');
console.assert(ix.search('chest tube bubbling')[0].n===2,'search 2');
// mocked API: first turn asks for search_slides, second answers
let calls=0;global.fetch=async(u,o)=>{calls++;const b=JSON.parse(o.body);
 const tools=b.tools.map(t=>t.name);console.assert(tools.includes('search_slides')&&tools.includes('web_search'),'tools');
 console.assert(b.tools.find(t=>t.name==='web_search').allowed_domains.includes('ncsbn.org'),'domains');
 const body=calls===1?{stop_reason:'tool_use',content:[{type:'tool_use',id:'t1',name:'search_slides',input:{query:'warfarin antidote'}}]}:{stop_reason:'end_turn',content:[{type:'text',text:'Vitamin K [Sample, slide 1]'}]};
 if(calls===2){const tr=b.messages[b.messages.length-1].content[0];console.assert(/slide 1/.test(tr.content),'tool result has slide')}
 return{ok:true,json:async()=>body}};
const res=await ai.ask([{role:'user',content:'antidote for warfarin?'}],{key:'k',domains:ai.DEFAULT_DOMAINS,searchSlides:q=>ix.search(q,5)});
console.assert(/Vitamin K/.test(res.text),'ai text');console.log('all tests ran; calls',calls,'| top hit:',r[0].title);
})();
