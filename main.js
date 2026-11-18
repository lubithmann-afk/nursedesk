const { app, BrowserWindow, ipcMain, dialog, shell, safeStorage } = require('electron');
const fs = require('fs'); const path = require('path');
const { parsePptx } = require('./lib/pptx');
const { Index } = require('./lib/search');
const { ask, DEFAULT_DOMAINS } = require('./lib/ai');

let win; const idx = new Index();
const U = () => app.getPath('userData');
const LIB = () => path.join(U(), 'library');
const rj = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const wj = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v)); };

function decks() { const d = LIB(); if (!fs.existsSync(d)) return []; return fs.readdirSync(d).filter(x => fs.existsSync(path.join(d, x, 'deck.json'))).map(x => rj(path.join(d, x, 'deck.json'))); }
function reindex() {
  const docs = [];
  decks().forEach(dk => dk.slides.forEach(s => docs.push({ id: dk.id + ':' + s.n, deck: dk.name, deckId: dk.id, n: s.n, title: s.title, body: [...s.text, ...(s.notes.length ? ['Notes: ' + s.notes.join(' ')] : [])].join('\n') })));
  idx.build(docs);
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'deck';

function settings() { const s = rj(path.join(U(), 'settings.json'), {}); return { domains: DEFAULT_DOMAINS, ...s }; }
function getKey() { try { const f = path.join(U(), 'key.bin'); if (!fs.existsSync(f)) return ''; const b = fs.readFileSync(f); return safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(b) : b.toString('utf8'); } catch (e) { return ''; } }
function setKey(k) { const f = path.join(U(), 'key.bin'); if (!k) { try { fs.unlinkSync(f); } catch (e) {} return; } fs.writeFileSync(f, safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(k) : Buffer.from(k)); }

ipcMain.handle('lib:list', () => decks().map(d => ({ id: d.id, name: d.name, slides: d.slides.length })));
ipcMain.handle('lib:deck', (_, id) => { const d = rj(path.join(LIB(), id, 'deck.json')); if (!d) return null; d.dir = path.join(LIB(), id, 'media'); return d; });
ipcMain.handle('lib:remove', (_, id) => { fs.rmSync(path.join(LIB(), path.basename(id)), { recursive: true, force: true }); reindex(); return true; });
ipcMain.handle('lib:search', (_, q) => idx.search(q, 25));
ipcMain.handle('lib:import', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Import PowerPoints', filters: [{ name: 'PowerPoint', extensions: ['pptx'] }], properties: ['openFile', 'multiSelections'] });
  const done = [], failed = [];
  for (const f of r.filePaths || []) {
    try {
      const name = path.basename(f, path.extname(f)); const id = slug(name); const dir = path.join(LIB(), id);
      fs.mkdirSync(path.join(dir, 'media'), { recursive: true });
      const slides = await parsePptx(fs.readFileSync(f), path.join(dir, 'media'), fs);
      wj(path.join(dir, 'deck.json'), { id, name, slides }); done.push(name);
    } catch (e) { failed.push(path.basename(f) + ': ' + e.message); }
  }
  reindex(); return { done, failed };
});
ipcMain.handle('q:extra', () => rj(path.join(U(), 'extra_questions.json'), []));
ipcMain.handle('q:import', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Import question file', filters: [{ name: 'JSON', extensions: ['json'] }], properties: ['openFile'] });
  if (!r.filePaths || !r.filePaths[0]) return { added: 0 };
  const inc = rj(r.filePaths[0], null); if (!Array.isArray(inc)) return { added: 0, error: 'File must be a JSON list of questions.' };
  const cur = rj(path.join(U(), 'extra_questions.json'), []);
  const keys = new Set(cur.map(q => q.q)); const add = inc.filter(q => q && q.q && Array.isArray(q.o) && Number.isInteger(q.a) && !keys.has(q.q));
  wj(path.join(U(), 'extra_questions.json'), cur.concat(add)); return { added: add.length };
});
ipcMain.handle('set:get', () => { const s = settings(); return { domains: s.domains, hasKey: !!getKey() }; });
ipcMain.handle('set:save', (_, s) => {
  if (typeof s.key === 'string') setKey(s.key.trim());
  if (Array.isArray(s.domains)) wj(path.join(U(), 'settings.json'), { domains: s.domains.map(x => x.trim()).filter(Boolean) });
  return { hasKey: !!getKey() };
});
ipcMain.handle('ai:ask', async (e, messages, extra) => {
  try {
    const r = await ask(messages, { key: getKey(), domains: settings().domains, extraSystem: extra || '', searchSlides: q => idx.search(q, 6), onStatus: s => e.sender.send('ai:status', s) });
    return { ok: true, ...r };
  } catch (err) { return { ok: false, error: String(err.message || err) }; }
});
ipcMain.handle('open:ext', (_, u) => { if (/^https:\/\//.test(u)) shell.openExternal(u); });

function create() {
  win = new BrowserWindow({ width: 1200, height: 820, title: 'NurseDesk', webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false } });
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  if (process.env.ND_TEST) {
    win.webContents.on('console-message', (e, l, msg) => { if (l >= 2) console.log('CONSOLE-ERR', msg); });
    win.webContents.on('did-finish-load', async () => {
      await new Promise(r => setTimeout(r, 1500));
      const r = await win.webContents.executeJavaScript(`(async()=>{const o={};o.quiz=document.querySelector('#practice h1')?.textContent;o.slides=document.querySelector('#slides h1')?.textContent;o.ai=!!document.querySelector('#in');
        document.querySelector('[data-t=settings]').click();await new Promise(r=>setTimeout(r,300));o.settings=!!document.querySelector('#key');
        document.querySelector('#go').click;return o})()`);
      console.log('RESULT', JSON.stringify(r)); app.quit();
    });
  }
}
app.whenReady().then(() => {
  reindex(); create();
  if (app.isPackaged) { try { require('electron-updater').autoUpdater.checkForUpdatesAndNotify(); } catch (e) {} }
});
app.on('window-all-closed', () => app.quit());
