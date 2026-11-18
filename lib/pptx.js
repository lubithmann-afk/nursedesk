// Minimal .pptx reader: slide text, speaker notes, and images, via JSZip.
const JSZip = require('jszip');
const path = require('path');

const dec = s => s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
const num = n => parseInt(n.match(/(\d+)\.xml$/)[1], 10);

// Paragraph-aware text extraction from DrawingML.
function textOf(xml) {
  const paras = [];
  const pRe = /<a:p[ >][\s\S]*?<\/a:p>/g;
  let m;
  while ((m = pRe.exec(xml))) {
    const p = m[0];
    let line = '';
    const tRe = /<a:t>([\s\S]*?)<\/a:t>|<a:br\s*\/>/g;
    let t;
    while ((t = tRe.exec(p))) line += t[1] !== undefined ? dec(t[1]) : '\n';
    line = line.trim();
    if (line) paras.push(line);
  }
  return paras;
}

async function parsePptx(buf, outMediaDir, fs) {
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files);
  const slideFiles = names.filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => num(a) - num(b));
  const slides = [];
  for (const f of slideFiles) {
    const xml = await zip.file(f).async('string');
    const paras = textOf(xml);
    const title = paras[0] || '';
    // notes via rels
    let notes = [];
    const relName = `ppt/slides/_rels/${path.posix.basename(f)}.rels`;
    const images = [];
    if (zip.file(relName)) {
      const rels = await zip.file(relName).async('string');
      const rRe = /<Relationship [^>]*>/g; let r;
      while ((r = rRe.exec(rels))) {
        const tag = r[0];
        const target = (tag.match(/Target="([^"]+)"/) || [])[1];
        const type = (tag.match(/Type="([^"]+)"/) || [])[1] || '';
        if (!target) continue;
        const abs = path.posix.normalize(path.posix.join('ppt/slides', target));
        if (type.endsWith('/notesSlide') && zip.file(abs)) {
          notes = textOf(await zip.file(abs).async('string')).filter(x => !/^\d+$/.test(x));
        } else if (type.endsWith('/image') && zip.file(abs) && /\.(png|jpe?g|gif|bmp|webp)$/i.test(abs) && outMediaDir && fs) {
          const out = path.join(outMediaDir, path.basename(abs));
          if (!fs.existsSync(out)) fs.writeFileSync(out, await zip.file(abs).async('nodebuffer'));
          images.push(path.basename(abs));
        }
      }
    }
    slides.push({ n: slides.length + 1, title, text: paras, notes, images });
  }
  return slides;
}
module.exports = { parsePptx, textOf };
