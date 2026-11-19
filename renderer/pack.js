// Loads the optional course pack (see Settings > Course pack) and merges it into the built-in data.
// Without a pack: no Galen/ATI material, the Medications tab shows only general reference, and Practice shows an import prompt.
(function(){
window.packReady=(async()=>{
  let d=null;try{d=await window.api.packData()}catch(e){}
  window.PACK_INFO=null;try{window.PACK_INFO=await window.api.packInfo()}catch(e){}
  if(!d||!d.QD){window.QD=null;return}
  window.QD=d.QD;
  const M=window.MEDS,mp=d.meds;
  if(M&&mp){
    M.decks=mp.decks||{};M.units=mp.units||{};M.suffix=mp.suffix||null;
    M.meds.forEach(m=>{const c=mp.cited&&mp.cited[m.name];if(c)for(const k in c)m.f[k].m=c[k];if(mp.q&&mp.q[m.name])m.q=mp.q[m.name]});
  }
  if(window.GLOSSARY&&d.glossary&&d.glossary.terms){window.GLOSSARY.terms=window.GLOSSARY.terms.concat(d.glossary.terms).sort((a,b)=>a.t.localeCompare(b.t,undefined,{sensitivity:'base'}))}
})();
})();
