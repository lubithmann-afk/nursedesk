// What this app has used on the student's API key (tokens are exact; dollars are an estimate from prices the student enters).
// Anthropic does not expose a key's expiry date or remaining credit to the key itself, so those can only be estimated or checked in the Console.
const fs = require('fs');
class Usage {
  constructor(file) { this.file = file; }
  _r() { try { return JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch (e) { return {}; } }
  _w(j) { fs.mkdirSync(require('path').dirname(this.file), { recursive: true }); fs.writeFileSync(this.file, JSON.stringify(j)); }
  add(u, now = new Date()) {
    if (!u) return;
    const j = this._r(), m = now.toISOString().slice(0, 7);
    const i = +u.input_tokens || 0, o = +u.output_tokens || 0, cr = +u.cache_read_input_tokens || 0, cw = +u.cache_creation_input_tokens || 0;
    for (const k of ['all', m]) { const b = (j[k] = j[k] || { in: 0, out: 0, calls: 0 }); b.in += i + cr + cw; b.out += o; b.calls++; }
    j.since = j.since || { in: 0, out: 0, calls: 0 };   // spending since the student last set "credit I added"
    j.since.in += i + cr + cw; j.since.out += o; j.since.calls++;
    this._w(j);
  }
  prices() { const j = this._r(); return j.prices || null; }
  setPrices(inP, outP) { const j = this._r(); const a = +inP, b = +outP; j.prices = (a >= 0 && b >= 0 && (a || b)) ? { in: a, out: b } : null; this._w(j); }
  setCredit(amount, now = new Date()) { const j = this._r(); const a = +amount; if (a > 0) { j.credit = { amount: a, date: now.toISOString().slice(0, 10) }; j.since = { in: 0, out: 0, calls: 0 }; } else { delete j.credit; } this._w(j); }
  cost(b, p) { return p && b ? (b.in * p.in + b.out * p.out) / 1e6 : null; }
  summary(now = new Date()) {
    const j = this._r(), m = now.toISOString().slice(0, 7), p = j.prices || null, z = { in: 0, out: 0, calls: 0 };
    const month = j[m] || z, all = j.all || z, since = j.since || z;
    return { month, all, prices: p, monthCost: this.cost(month, p), allCost: this.cost(all, p), credit: j.credit || null,
      remaining: j.credit && p ? Math.max(0, j.credit.amount - this.cost(since, p)) : null, monthLabel: m };
  }
}
module.exports = { Usage };
