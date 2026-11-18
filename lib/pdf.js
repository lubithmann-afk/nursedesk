// Minimal PDF reader: one library "page" per PDF page (text only), via pdfjs-dist.
// Returns the same shape as parsePptx slides: [{n, title, text[], notes[], images[]}].
let pdfjs = null;
const load = () => pdfjs || (pdfjs = require('pdfjs-dist/legacy/build/pdf.js'));

async function pageLines(page) {
  const tc = await page.getTextContent();
  const lines = []; let cur = '', lastY = null, lastEnd = null;
  for (const it of tc.items) {
    if (!it.str && !it.hasEOL) continue;
    const y = it.transform[5], x = it.transform[4], h = it.height || 10;
    if (lastY !== null && Math.abs(y - lastY) > Math.max(3, h * 0.5)) { lines.push(cur); cur = ''; lastEnd = null; }
    else if (lastEnd !== null && x - lastEnd > h * 0.15 && !/\s$/.test(cur) && !/^\s/.test(it.str)) cur += ' ';
    cur += it.str; lastY = y; lastEnd = x + (it.width || 0);
    if (it.hasEOL) { lines.push(cur); cur = ''; lastEnd = null; }
  }
  lines.push(cur);
  return lines.map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

async function parsePdf(buf) {
  const doc = await load().getDocument({ data: new Uint8Array(buf), verbosity: 0, isEvalSupported: false }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const pg = await doc.getPage(i);
    pages.push(await pageLines(pg)); pg.cleanup();
  }
  await doc.destroy();
  // Drop running headers/footers: lines near the top or bottom of a page that repeat on many
  // pages once page numbers are masked, plus bare page numbers.
  const norm = l => l.replace(/\d+/g, '#');
  const edge = p => [...new Set([...p.slice(0, 2), ...p.slice(-2)].map(norm))];
  const freq = new Map(); pages.forEach(p => edge(p).forEach(k => freq.set(k, (freq.get(k) || 0) + 1)));
  const min = Math.max(3, pages.length * 0.3);
  const rep = pages.length > 4 ? new Set([...freq].filter(([, c]) => c >= min).map(([k]) => k)) : new Set();
  return pages.map((lines, i) => {
    const edgeIdx = new Set([0, 1, lines.length - 2, lines.length - 1]);
    let t = lines.filter((l, j) => !(edgeIdx.has(j) && rep.has(norm(l))) && !/^(page\s*)?\d{1,3}(\s*(of|\/)\s*\d{1,3})?$/i.test(l));
    if (!t.length) t = lines;
    return { n: i + 1, title: (t[0] || '').slice(0, 120), text: t, notes: [], images: [] };
  });
}
module.exports = { parsePdf };
