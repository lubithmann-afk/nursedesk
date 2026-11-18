// Lets the practice quiz's follow-up chat use the desktop app's AI (your Library only; web search needs your approval in the Ask AI tab).
window.claude={use:async n=>{
  if(n!=='sample')return null;
  const f=async(msgs,o)=>{const r=await window.api.ask(msgs);
    if(!r.ok){const e=new Error(r.error);e.code='error';throw e}
    let t=r.text;if(r.askWeb)t+='\n\n(Not found in your Library. Open the Ask AI tab if you want me to check trusted web sources.)';if(r.sources&&r.sources.length)t+='\n\nSources: '+r.sources.slice(0,4).map(s=>s.url).join(' , ');
    if(o&&o.onText)o.onText({text:t});return{text:t}};
  return f}};
