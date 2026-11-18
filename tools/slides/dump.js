const fs=require('fs');const {parsePptx}=require('/home/claude/nd-repo/lib/pptx');
(async()=>{const out={};
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.pptx'))){
 const d='media/'+f.replace(/\W+/g,'_').slice(-40);fs.mkdirSync(d,{recursive:true});
 const s=await parsePptx(fs.readFileSync(f),d,fs);out[f]=s;
 console.log(s.length,'slides |',s.reduce((a,x)=>a+x.text.join(' ').length,0),'chars |',f.replace('NUR_283_285_-_','').slice(0,70));}
fs.writeFileSync('all.json',JSON.stringify(out));})();
