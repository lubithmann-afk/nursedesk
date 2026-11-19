// Study AI: searches the local study library (slides, syllabus, ATI guide, saved web notes) first, then trusted NCLEX web sources
// (only after the student approves). Approved web answers are returned with a note to save and the pages they cite.
const API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5-5';

const DEFAULT_DOMAINS = ['ncsbn.org','nlm.nih.gov','ncbi.nlm.nih.gov','medlineplus.gov','cdc.gov','nih.gov','merckmanuals.com','mayoclinic.org','ahrq.gov','who.int','heart.org','diabetes.org','lung.org','kidney.org','acog.org','aap.org','healthychildren.org','ana.org','jointcommission.org','osha.gov','fda.gov'];

const ASK_WEB = '[[ASK_WEB]]';
const SAVE_RX = /\[\[SAVE\]\]([\s\S]*?)(?:\[\[\/SAVE\]\]|$)/;

function systemPrompt(allowWeb, categories = []) {
  const web = allowWeb
    ? `3. The student has just APPROVED a web search for this question. Use web_search (limited to trusted medical and nursing sites). Start that part with "From the web (you approved this search):". After EVERY fact you take from the web, name exactly where it came from in this form: [Site name, page title](full URL). Never state web information without its source and URL, and never merge it into the library part: keep "From your library" and "From the web" separate. If the web has nothing useful, say so. Finally, if you used the web and found something worth keeping, end your reply with ONE block that the app saves for next time, exactly in this form and nothing after it: [[SAVE]]{"title":"short topic title","category":"one of: ${categories.join(' | ')}","summary":"2 to 5 plain sentences containing ONLY facts that came from the web pages you cited, no opinions and nothing from memory"}[[/SAVE]]. Skip the block if the web had nothing useful.`
    : `3. You do NOT have web access in this turn. If the library does not contain the answer, say so in one short line, then still give your best answer from your own knowledge, starting that part with "My own thoughts (not from your materials or any source):" and keeping it short and cautious (no doses unless you are sure, and say when you are unsure). Then offer to check the trusted medical sources and end that reply with the exact token ${ASK_WEB} on its own line. Never search the web or imply you did unless the student has approved it.`;
  return `You are the study assistant inside a nursing student's app (Galen College of Nursing, NUR 283 comprehensive exam prep, NCLEX-RN style).
Rules:
1. ALWAYS call search_library first. The student's library holds their class PowerPoints (primary source of truth for tests), notes saved earlier from the web (labelled "Saved web notes"; cite them as [Saved web note: title] and also name the original page and URL listed inside the note, and say they came from the web), the NUR 283 course syllabus (grading, assignments, exam and ATI requirements, schedule, policies: use it for any question about the course itself), and the ATI Comprehensive Predictor study guide (a trusted review source, quick facts and lab values).
2. If the library answers the question, answer from it and cite exactly where each point came from as [Document name, slide N] or [Document name, page N]. Say plainly if it only partly covers the question. Prefer class slides over the ATI guide for content, and the syllabus over everything for course rules. If you add your own explanation that is not in a source, label it "(my own explanation, not from a source)".
${web}
4. Think NCLEX: priorities (ABCs, safety, least restrictive), delegation, teaching, and what the exam would expect.
5. Be accurate before agreeable. If the slides conflict with current evidence-based practice or with the keyed answer of a practice question, point it out plainly and let the student decide.
6. Keep answers short and scannable. Plain text, **bold** for key terms.`;
}

let usageHook = null; const setUsageHook = f => { usageHook = f; };
async function call(body, key) {
  const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status));
  try { usageHook && usageHook(j.usage); } catch (e) {}
  return j;
}

// messages: [{role, content:string}]; deps: {key, domains, searchSlides(q)->[hits], onStatus(str)}
async function ask(messages, deps) {
  const { key, domains, searchSlides, onStatus = () => {}, extraSystem = '', allowWeb = false, categories = [] } = deps;
  if (!key) throw new Error('No API key set. Add one in Settings.');
  const tools = [
    { name: 'search_library', description: "Search the student's imported study library: class PowerPoint slides, the course syllabus, the ATI study guide, and notes saved earlier from the web. Returns the best-matching slides or pages with document name, number, and text.", input_schema: { type: 'object', properties: { query: { type: 'string', description: 'Keywords to search for' } }, required: ['query'] } }
  ];
  if (allowWeb && domains && domains.length) tools.push({ type: 'web_search_20250305', name: 'web_search', max_uses: 4, allowed_domains: domains });
  const msgs = messages.map(m => ({ role: m.role, content: m.content }));
  const sources = [], cited = new Map(); let text = '';
  for (let turn = 0; turn < 6; turn++) {
    const res = await call({ model: MODEL, max_tokens: 1500, system: systemPrompt(allowWeb, categories) + (extraSystem ? '\n\n' + extraSystem : ''), tools, messages: msgs }, key);
    msgs.push({ role: 'assistant', content: res.content });
    const uses = res.content.filter(b => b.type === 'tool_use');
    text = res.content.filter(b => b.type === 'text').map(b => b.text).join('');
    res.content.forEach(b => {
      // pages the answer actually cites, with the passage it relied on (verbatim from the page)
      if (b.type === 'text' && Array.isArray(b.citations)) b.citations.forEach(c => { if (c && c.url && !cited.has(c.url)) cited.set(c.url, { title: c.title, url: c.url, quote: c.cited_text }); });
      if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) b.content.forEach(x => x.url && sources.push({ title: x.title, url: x.url }));
      if (b.type === 'server_tool_use') onStatus('Searching trusted sources…');
    });
    if (res.stop_reason === 'pause_turn') continue;
    if (!uses.length) break;
    const results = uses.map(u => {
      onStatus('Searching your library…');
      let hits = []; try { hits = searchSlides(u.input.query || ''); } catch (e) {}
      const body = hits.length ? hits.map(h => (h.unit === 'note' ? `[Saved web note: ${h.title}]` : `[${h.deck}, ${h.unit || 'slide'} ${h.n}] ${h.title}`) + `\n${h.body}`).join('\n---\n') : 'No matching material found in the library.';
      return { type: 'tool_result', tool_use_id: u.id, content: body.slice(0, 12000) };
    });
    msgs.push({ role: 'user', content: results });
  }
  const seen = new Set();
  const askWeb = !allowWeb && text.includes(ASK_WEB);
  text = text.split(ASK_WEB).join('');
  // the SAVE block is for the app, never for the student; it is only honoured when the web was approved
  let save = null; const m = text.match(SAVE_RX);
  if (m) {
    text = text.replace(SAVE_RX, '');
    if (allowWeb) { try { const j = JSON.parse(m[1].trim()); if (j && j.title && j.summary) save = { title: String(j.title), category: String(j.category || ''), summary: String(j.summary) }; } catch (e) {} }
  }
  text = text.trim();
  const found = sources.filter(x => !seen.has(x.url) && seen.add(x.url));
  const used = cited.size ? [...cited.values()] : found;          // prefer the pages actually cited
  return { text, askWeb, usedWeb: sources.length > 0 || cited.size > 0, sources: used, save };
}
// One plain completion with no tools (used by the challenge-mode coach).
async function complete({ key, system, messages, maxTokens = 400 }) {
  if (!key) throw new Error('No API key set. Add one in Settings.');
  const res = await call({ model: MODEL, max_tokens: maxTokens, system, messages }, key);
  return res.content.filter(b => b.type === 'text').map(b => b.text).join('');
}
// A one-token request to find out whether the key works, and what limits it reports. Costs a fraction of a cent.
async function checkKey(key, f = fetch) {
  if (!key) return { status: 'none' };
  let r, j = {};
  try { r = await f(API, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL, max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] }) }); j = await r.json().catch(() => ({})); }
  catch (e) { return { status: 'offline', error: String(e.message || e) }; }
  const h = n => r.headers && r.headers.get ? r.headers.get(n) : null;
  const msg = (j.error && j.error.message) || '';
  const limits = { requestsRemaining: h('anthropic-ratelimit-requests-remaining'), requestsLimit: h('anthropic-ratelimit-requests-limit'), tokensRemaining: h('anthropic-ratelimit-tokens-remaining'), tokensLimit: h('anthropic-ratelimit-tokens-limit'), resets: h('anthropic-ratelimit-requests-reset') };
  if (r.ok) { try { usageHook && usageHook(j.usage); } catch (e) {} return { status: 'valid', limits }; }
  if (r.status === 401 || r.status === 403) return { status: 'rejected', error: msg };
  if (/credit balance/i.test(msg)) return { status: 'no_credit', error: msg };
  if (r.status === 429) return { status: 'rate_limited', error: msg, limits };
  return { status: 'error', error: msg || 'HTTP ' + r.status };
}
module.exports = { ask, complete, checkKey, setUsageHook, DEFAULT_DOMAINS, ASK_WEB };
