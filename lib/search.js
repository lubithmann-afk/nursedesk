// Small BM25 index over slide chunks. No dependencies.
const STOP = new Set('a an and are as at be by for from has have in is it of on or that the this to was were will with which what when who how why do does'.split(' '));
const tok = s => (s.toLowerCase().match(/[a-z0-9][a-z0-9\-\.\/]*/g) || []).map(w => w.replace(/[\.\-\/]+$/,'')).filter(w => w && !STOP.has(w));

class Index {
  constructor() { this.docs = []; this.df = new Map(); this.avg = 0; }
  build(docs) { // docs: [{id, deck, n, title, body}]
    this.docs = docs.map(d => { const t = tok(d.title + ' ' + d.title + ' ' + d.body); const tf = new Map(); t.forEach(w => tf.set(w, (tf.get(w) || 0) + 1)); return { ...d, tf, len: t.length }; });
    this.df = new Map();
    this.docs.forEach(d => d.tf.forEach((_, w) => this.df.set(w, (this.df.get(w) || 0) + 1)));
    this.avg = this.docs.reduce((a, d) => a + d.len, 0) / (this.docs.length || 1);
  }
  search(q, k = 8) {
    const qs = [...new Set(tok(q))]; const N = this.docs.length; if (!qs.length || !N) return [];
    const out = [];
    for (const d of this.docs) {
      let s = 0;
      for (const w of qs) {
        let f = d.tf.get(w);
        if (!f) { // light prefix match (plural/stem)
          for (const [k2, v] of d.tf) if (w.length > 3 && (k2.startsWith(w) || w.startsWith(k2) && k2.length > 3)) { f = (f || 0) + v * 0.6; }
        }
        if (!f) continue;
        const n = this.df.get(w) || 1, idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        s += idf * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * d.len / this.avg));
      }
      if (s > 0) out.push({ score: s, ...d });
    }
    out.sort((a, b) => b.score - a.score);
    return out.slice(0, k).map(({ tf, ...r }) => r);
  }
}
module.exports = { Index, tok };
