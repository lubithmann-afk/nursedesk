// Study AI: searches the local slide library first, then trusted NCLEX web sources.
const API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5-5';

const DEFAULT_DOMAINS = ['ncsbn.org','nlm.nih.gov','ncbi.nlm.nih.gov','medlineplus.gov','cdc.gov','nih.gov','merckmanuals.com','mayoclinic.org','ahrq.gov','who.int','heart.org','diabetes.org','lung.org','kidney.org','acog.org','aap.org','healthychildren.org','ana.org','jointcommission.org','osha.gov','fda.gov'];

function systemPrompt() {
  return `You are the study assistant inside a nursing student's app (Galen College of Nursing, NUR 283 comprehensive exam prep, NCLEX-RN style).
Rules:
1. ALWAYS call search_slides first. The student's class PowerPoints are the primary source of truth for their tests.
2. If the slides answer the question, answer from them and cite as [Deck name, slide N]. Say plainly if the slides only partly cover it.
3. If the slides do not contain the information, say so in one short line, then use web_search (limited to trusted medical and nursing sources) and cite the URL. Clearly separate "From your slides" from "From the web".
4. Think NCLEX: priorities (ABCs, safety, least restrictive), delegation, teaching, and what the exam would expect.
5. Be accurate before agreeable. If the slides conflict with current evidence-based practice or with the keyed answer of a practice question, point it out plainly and let the student decide.
6. Keep answers short and scannable. Plain text, **bold** for key terms.`;
}

async function call(body, key) {
  const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status));
  return j;
}

// messages: [{role, content:string}]; deps: {key, domains, searchSlides(q)->[hits], onStatus(str)}
async function ask(messages, deps) {
  const { key, domains, searchSlides, onStatus = () => {}, extraSystem = '' } = deps;
  if (!key) throw new Error('No API key set. Add one in Settings.');
  const tools = [
    { name: 'search_slides', description: "Search the student's imported class PowerPoint slides. Returns the best-matching slides with deck name, slide number, and text.", input_schema: { type: 'object', properties: { query: { type: 'string', description: 'Keywords to search for' } }, required: ['query'] } }
  ];
  if (domains && domains.length) tools.push({ type: 'web_search_20250305', name: 'web_search', max_uses: 4, allowed_domains: domains });
  const msgs = messages.map(m => ({ role: m.role, content: m.content }));
  const sources = []; let text = '';
  for (let turn = 0; turn < 6; turn++) {
    const res = await call({ model: MODEL, max_tokens: 1500, system: systemPrompt() + (extraSystem ? '\n\n' + extraSystem : ''), tools, messages: msgs }, key);
    msgs.push({ role: 'assistant', content: res.content });
    const uses = res.content.filter(b => b.type === 'tool_use');
    text = res.content.filter(b => b.type === 'text').map(b => b.text).join('');
    res.content.forEach(b => {
      if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) b.content.forEach(x => x.url && sources.push({ title: x.title, url: x.url }));
      if (b.type === 'server_tool_use') onStatus('Searching trusted sources…');
    });
    if (res.stop_reason === 'pause_turn') continue;
    if (!uses.length) break;
    const results = uses.map(u => {
      onStatus('Searching your slides…');
      let hits = []; try { hits = searchSlides(u.input.query || ''); } catch (e) {}
      const body = hits.length ? hits.map(h => `[${h.deck}, slide ${h.n}] ${h.title}\n${h.body}`).join('\n---\n') : 'No matching slides found.';
      return { type: 'tool_result', tool_use_id: u.id, content: body.slice(0, 12000) };
    });
    msgs.push({ role: 'user', content: results });
  }
  const seen = new Set();
  return { text, sources: sources.filter(s => !seen.has(s.url) && seen.add(s.url)) };
}
module.exports = { ask, DEFAULT_DOMAINS };
