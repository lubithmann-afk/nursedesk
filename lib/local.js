// Optional built-in AI: runs a small open model on this PC through llama.cpp's llama-server. OFF by default.
// Nothing is bundled in the installer: on opt-in the app downloads (a) the llama.cpp program and (b) one model file,
// into the user-data folder, and removes them again on request. Answers never leave the PC.
const fs = require('fs'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const JSZip = require('jszip');
const MODEL = { name: 'Qwen2.5 1.5B Instruct (Q4)', file: 'qwen2.5-1.5b-instruct-q4_k_m.gguf', mb: 1100,
  url: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf' };
const RELEASES = 'https://api.github.com/repos/ggml-org/llama.cpp/releases/latest';
const LABEL = 'My own thoughts (built-in AI on this PC, not from your class materials, not verified):';
const SYSTEM = `You are a small study helper inside a nursing student's app (NCLEX-RN style, safety first). Be brief and plain.
If class excerpts are given, answer from them and name the excerpt, like [Unit 8, slide 36]. If they do not cover the question, say so, then give your best general answer and make clear it is your own understanding. Never invent doses, lab values or policies; if unsure, say you are unsure and tell the student to check their course materials or instructor.`;

function offlineText(question, hits) {
  if (!hits.length) return 'No AI is switched on and nothing in your library matched that question. You can add an API key or switch on the built-in AI in Settings, or use the Ask in ChatGPT / Ask in Claude buttons below.';
  return 'No AI is switched on, so here is what your own materials say. These are word-for-word excerpts, not an answer I wrote:\n\n' +
    hits.map(h => `**[${h.deck}, ${h.unit || 'slide'} ${h.n}] ${h.title || ''}**\n${String(h.body || '').split('\n').slice(0, 8).join('\n').slice(0, 700)}`).join('\n\n');
}
function buildMessages(messages, hits) {
  const ex = hits.length ? hits.map(h => `[${h.deck}, ${h.unit || 'slide'} ${h.n}] ${h.title || ''}\n${String(h.body || '').slice(0, 900)}`).join('\n---\n') : '(no matching excerpts found)';
  const msgs = messages.slice(-6).map(m => ({ role: m.role, content: String(m.content) }));
  const last = msgs.length - 1;
  msgs[last] = { role: 'user', content: `CLASS EXCERPTS:\n${ex}\n\nQUESTION: ${msgs[last].content}` };
  return [{ role: 'system', content: SYSTEM }, ...msgs];
}
const getJson = (url, f) => f(url, { headers: { 'user-agent': 'NurseDesk' } }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status + ' from ' + new URL(url).hostname); return r.json(); });
async function download(f, url, dest, onProgress) {
  const r = await f(url, { headers: { 'user-agent': 'NurseDesk' }, redirect: 'follow' });
  if (!r.ok) throw new Error('Download failed (HTTP ' + r.status + ') from ' + new URL(url).hostname);
  const total = +r.headers.get('content-length') || 0, tmp = dest + '.part', out = fs.createWriteStream(tmp); let got = 0;
  for await (const chunk of r.body) { got += chunk.length; if (!out.write(chunk)) await new Promise(ok => out.once('drain', ok)); onProgress && onProgress(got, total); }
  await new Promise((ok, no) => out.end(e => e ? no(e) : ok()));
  fs.renameSync(tmp, dest);
}
function create({ dir, fetchFn = global.fetch, platform = process.platform, spawnFn = spawn }) {
  const bin = path.join(dir, 'bin'), modelPath = path.join(dir, MODEL.file), cfgPath = path.join(dir, 'config.json');
  const exeName = platform === 'win32' ? 'llama-server.exe' : 'llama-server';
  const findExe = d => { if (!fs.existsSync(d)) return null; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isFile() && e.name === exeName) return p; if (e.isDirectory()) { const r = findExe(p); if (r) return r; } } return null; };
  const cfg = () => { try { return JSON.parse(fs.readFileSync(cfgPath, 'utf8')); } catch (e) { return {}; } };
  const saveCfg = c => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(cfgPath, JSON.stringify(c)); };
  let proc = null, port = 0, starting = null;
  const installed = () => fs.existsSync(modelPath) && !!findExe(bin);
  const state = () => ({ enabled: !!cfg().enabled && !!cfg().accepted, accepted: !!cfg().accepted, installed: installed(), model: MODEL.name, mb: MODEL.mb, supported: platform === 'win32' });
  function setEnabled(on, accepted) { const c = cfg(); if (on && !(accepted || c.accepted)) throw new Error('Please read and accept the disclaimer first.'); saveCfg({ ...c, enabled: !!on, accepted: !!(accepted || c.accepted) }); if (!on) stop(); return state(); }
  async function install(onProgress = () => {}) {
    if (platform !== 'win32') throw new Error('The built-in AI is only available in the Windows app.');
    fs.mkdirSync(bin, { recursive: true });
    if (!findExe(bin)) {
      onProgress('Finding the AI engine…');
      const rel = await getJson(RELEASES, fetchFn);
      const a = (rel.assets || []).find(x => /bin-win-cpu-x64\.zip$/i.test(x.name));
      if (!a) throw new Error('Could not find the Windows AI engine download.');
      const zipPath = path.join(dir, 'engine.zip');
      await download(fetchFn, a.browser_download_url, zipPath, (g, t) => onProgress(`Downloading the AI engine… ${t ? Math.round(g / t * 100) + '%' : Math.round(g / 1048576) + ' MB'}`));
      const zip = await JSZip.loadAsync(fs.readFileSync(zipPath));
      for (const [name, entry] of Object.entries(zip.files)) { if (entry.dir) continue; const p = path.join(bin, name); if (!path.resolve(p).startsWith(path.resolve(bin) + path.sep)) continue; fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, await entry.async('nodebuffer')); }
      fs.rmSync(zipPath, { force: true });
      if (!findExe(bin)) throw new Error('The AI engine download did not contain llama-server.');
    }
    if (!fs.existsSync(modelPath)) await download(fetchFn, MODEL.url, modelPath, (g, t) => onProgress(`Downloading the AI model (about ${MODEL.mb / 1000} GB)… ${t ? Math.round(g / t * 100) + '%' : Math.round(g / 1048576) + ' MB'}`));
    onProgress('Done.'); return state();
  }
  function stop() { if (proc) { try { proc.kill(); } catch (e) {} proc = null; port = 0; starting = null; } }
  function start() {
    if (proc && port) return Promise.resolve();
    if (starting) return starting;
    starting = (async () => {
      const exe = findExe(bin); if (!exe || !fs.existsSync(modelPath)) throw new Error('The built-in AI is not installed yet.');
      port = 20000 + Math.floor(Math.random() * 20000);
      proc = spawnFn(exe, ['-m', modelPath, '--host', '127.0.0.1', '--port', String(port), '-c', '4096', '--no-webui'], { cwd: path.dirname(exe), windowsHide: true, stdio: 'ignore' });
      proc.on('exit', () => { proc = null; port = 0; starting = null; });
      for (let i = 0; i < 120; i++) {
        await new Promise(r => setTimeout(r, 1000));
        if (!proc) throw new Error('The built-in AI stopped unexpectedly (your PC may not have enough free memory).');
        try { const r = await fetchFn(`http://127.0.0.1:${port}/health`); if (r.ok) return; } catch (e) {}
      }
      stop(); throw new Error('The built-in AI took too long to start.');
    })().catch(e => { starting = null; throw e; });
    return starting;
  }
  async function chat(messages, hits) {
    await start();
    const r = await fetchFn(`http://127.0.0.1:${port}/v1/chat/completions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: buildMessages(messages, hits), max_tokens: 600, temperature: 0.3 }) });
    const j = await r.json(); if (!r.ok) throw new Error((j.error && j.error.message) || 'HTTP ' + r.status);
    const t = String(j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || '').trim();
    return `${LABEL}\n\n${t || '(no answer)'}`;
  }
  function remove() { stop(); fs.rmSync(bin, { recursive: true, force: true }); fs.rmSync(modelPath, { force: true }); saveCfg({ ...cfg(), enabled: false }); return state(); }
  return { state, setEnabled, install, chat, remove, stop };
}
module.exports = { create, offlineText, buildMessages, MODEL, LABEL, SYSTEM };
