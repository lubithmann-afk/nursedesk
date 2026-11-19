// Saved web notes: what the study AI looked up on trusted sites (after the student approved it), kept with
// the exact pages it came from so it can be reused next time. Stored as one JSON file on the student's PC.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');

// Same topic names as the Practice screen, plus Other.
const CATEGORIES = ['Prioritization & Delegation', 'Infection Control & Safety', 'Legal, Ethics & Management', 'Cardiovascular', 'Respiratory', 'Renal, Fluids & Acid-Base', 'Endocrine & Metabolic', 'GI & Nutrition', 'Neuro, Eyes & Ortho', 'Burns, Trauma & Emergencies', 'Pharmacology & Labs', 'Maternal-Newborn', 'Pediatrics', 'Mental Health', 'Health Promotion & Prevention', 'Oncology & Radiation', 'Skills & Procedures', 'Other'];
const cut = (s, n) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n);
const keepText = (s, n) => String(s == null ? '' : s).replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
const normTitle = t => String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const cleanCat = c => CATEGORIES.find(x => x.toLowerCase() === String(c || '').trim().toLowerCase()) || 'Other';
function cleanSources(list) {
  const seen = new Set(), out = [];
  for (const s of Array.isArray(list) ? list : []) {
    const url = String((s && s.url) || '').trim();
    if (!/^https:\/\//i.test(url) || url.length > 600 || seen.has(url)) continue;
    seen.add(url);
    out.push({ title: cut(s.title || url, 200), url, quote: cut(s.quote || '', 400) });
    if (out.length >= 8) break;
  }
  return out;
}

class Notes {
  constructor(file) { this.file = file; this.items = null; }
  _load() {
    if (this.items) return;
    try { const j = JSON.parse(fs.readFileSync(this.file, 'utf8')); this.items = Array.isArray(j) ? j : []; } catch (e) { this.items = []; }
  }
  _save() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = this.file + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(this.items)); fs.renameSync(tmp, this.file);
  }
  list() { this._load(); return this.items.slice().sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt))); }
  // entry: {title, category, summary, question, sources:[{title,url,quote}]}. Returns {note, isNew} or null if there is nothing worth saving.
  add(entry) {
    this._load();
    const sources = cleanSources(entry.sources);
    const title = cut(entry.title, 120), summary = keepText(entry.summary, 2500);
    if (!title || !summary || !sources.length) return null;      // never save anything without a source
    const now = new Date().toISOString();
    const dup = this.items.find(n => normTitle(n.title) === normTitle(title));
    if (dup) {                                                   // same topic again: refresh it and merge sources
      dup.summary = summary; dup.updatedAt = now; dup.category = cleanCat(entry.category || dup.category);
      dup.question = cut(entry.question || dup.question, 400);
      const have = new Set(dup.sources.map(s => s.url));
      dup.sources = dup.sources.concat(sources.filter(s => !have.has(s.url))).slice(0, 10);
      this._save(); return { note: dup, isNew: false };
    }
    const note = { id: crypto.randomBytes(5).toString('hex'), title, category: cleanCat(entry.category), summary, question: cut(entry.question, 400), sources, savedAt: now, updatedAt: now };
    this.items.push(note); this._save(); return { note, isNew: true };
  }
  remove(id) { this._load(); const n = this.items.length; this.items = this.items.filter(x => x.id !== id); if (this.items.length !== n) this._save(); return this.items.length !== n; }
  setCategory(id, cat) { this._load(); const x = this.items.find(n => n.id === id); if (!x) return false; x.category = cleanCat(cat); this._save(); return true; }
  clear() { this._load(); this.items = []; this._save(); }
  // search-index documents so the AI finds saved notes before going to the web again
  toDocs() {
    this._load();
    return this.items.map(n => ({ id: 'note:' + n.id, deck: 'Saved web notes', deckId: 'notes', n: n.id, unit: 'note', title: n.title,
      body: n.summary + '\n' + n.sources.map(s => `Source: ${s.title} (${s.url})` + (s.quote ? ` — "${s.quote}"` : '')).join('\n') + `\nCategory: ${n.category}. Saved ${String(n.savedAt).slice(0, 10)} from the web after the student approved the search.` }));
  }
}
module.exports = { Notes, CATEGORIES, cleanCat };
