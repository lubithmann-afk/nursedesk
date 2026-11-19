// "Ask in ChatGPT / Claude": builds a prompt from the student's own materials, copies it, and opens the chat site
// (pre-filled when it fits in the link). Uses the student's normal browser login; nothing is linked or stored.
(function(){
const SITES={chatgpt:{name:'ChatGPT',url:'https://chatgpt.com/?q='},claude:{name:'Claude',url:'https://claude.ai/new?q='}};
const INTRO='You are helping a nursing student (NCLEX-style, safety first) study. Answer using the class excerpts below first and cite them by deck and slide/page. If you add anything that is not in the excerpts, label it clearly as "outside my class materials". Do not give doses unless an excerpt does.';
function prompt(question,excerpts){
  const ex=excerpts.map((e,i)=>`[${i+1}] ${e.src}\n${e.text}`).join('\n\n');
  return `${INTRO}\n\nQUESTION: ${question}\n\nCLASS EXCERPTS:\n${ex||'(none found, so say that the answer is from general knowledge)'}`;
}
async function copy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){return false}}
async function send(site,text){
  const s=SITES[site],ok=await copy(text),link=s.url+encodeURIComponent(text);
  if(link.length<=6000){window.api.openExternal(link);return `Opened ${s.name} with your question filled in. It is also copied to your clipboard. If the box is empty, click in it and press Ctrl+V.`}
  window.api.openExternal(s.url.split('?')[0]);
  return ok?`Copied. ${s.name} is opening; click in the message box and press Ctrl+V.`:`Could not copy automatically. Select the text and copy it yourself.`;
}
async function fromSearch(question){
  let rs=[];try{rs=(await window.api.search(question)).slice(0,6)}catch(e){}
  return prompt(question,rs.map(r=>({src:`${r.deck} · ${r.unit||'slide'} ${r.n}${r.title?' — '+r.title:''}`,text:String(r.body||'').slice(0,900)})));
}
window.handoff={SITES,prompt,send,fromSearch};
})();
