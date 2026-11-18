"""Builds data/meds.js (the Medications tab) from the student's own materials.
Scans: every library deck in data/seed (PowerPoints + ATI guide; not the syllabus) and the question bank.
Run from anywhere:  python3 tools/meds/build_meds.py   (add --report to list names the list may be missing)"""
import json,glob,os,re,sys,collections
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
sys.path.insert(0,HERE)
from lexicon import L
SKIP_DECKS={'nur-283-syllabus-winter-2026'}
norm=lambda t:t.replace('’',"'").replace('‘',"'").replace('–','-').replace(' ',' ')

# ---- matchers
meds=[]            # flat list of dicts
for cat,classes in L.items():
    for cls,entries in classes.items():
        for e in entries:
            names=[e['name']]+e['brands']+e['alias']
            names=[n for n in dict.fromkeys(names) if n]
            pat='|'.join(re.escape(n).replace(r'\ ',r'\s+') for n in sorted(names,key=len,reverse=True))
            meds.append({'name':e['name'],'brands':e['brands'],'names':names,'cat':cat,'cls':cls,
                         'rx':re.compile(r'(?<![A-Za-z0-9])(?:'+pat+r')(?![A-Za-z0-9])',re.I),'slides':[],'q':[]})

# ---- gather sources
decks={}
units=[]  # (deckid, kind, n, title, lines)
for f in sorted(glob.glob(os.path.join(ROOT,'data','seed','*','deck.json'))):
    d=json.load(open(f))
    if d['id'] in SKIP_DECKS: continue
    kind='page' if d.get('kind')=='pdf' else 'slide'
    decks[d['id']]={'n':d['name'],'k':kind}
    for s in d['slides']:
        units.append((d['id'],kind,s['n'],s['title'],[norm(x) for x in s['text']]))
qd=json.loads(open(os.path.join(ROOT,'data','questions.js')).read().split('window.QD=',1)[1].rstrip(';'))

# ---- deck/page mentions with context
# Slides are short, so the whole slide is shown. ATI pages are long, so only the heading + its bullets
# (or the sentence plus the nearest heading) are kept. Text is stored once per slide/page in "units".
BUL=('-','●','○','•','▪','–')
def is_bullet(l):return l.lstrip().startswith(BUL)
def is_heading(l):return len(l)<=45 and not is_bullet(l) and not l.rstrip().endswith(('.',','))
units_out={}
def window(lines,idxs):
    keep=set()
    for i in idxs:
        keep.add(i)
        if is_heading(lines[i]):
            k=i+1
            while k<len(lines) and k<i+11 and (is_bullet(lines[k]) or not is_heading(lines[k])): keep.add(k);k+=1
        else:
            k=i+1
            while k<len(lines) and k<i+3 and not is_bullet(lines[k]) and not is_heading(lines[k]): keep.add(k);k+=1
            j=i-1
            while j>=0 and j>i-9:
                if is_heading(lines[j]): keep.add(j);break
                j-=1
    return sorted(keep)
for did,kind,n,title,lines in units:
    hit=[set() for _ in lines]
    for mi,m in enumerate(meds):
        for li,l in enumerate(lines):
            if m['rx'].search(l): hit[li].add(mi)
    present=set().union(*hit) if hit else set()
    for mi in present:
        idxs=[i for i,h in enumerate(hit) if mi in h]
        ks=list(range(min(len(lines),22))) if kind=='slide' else window(lines,idxs)[:16]
        key=f"{did}:{n}"
        units_out.setdefault(key,{'t':title[:90],'l':[x.strip()[:700] for x in lines]})
        meds[mi]['slides'].append({'u':key,'k':ks})

for m in meds:
    m['slides'].sort(key=lambda x:(bool(re.search(r'NGN|question|case study',units_out[x['u']]['t'],re.I)),x['u'].startswith('ati-')))

# ---- question mentions
for q in qd['bank']:
    txt=norm(q['q']+'\n'+'\n'.join(q['o'])+'\n'+q['r'])
    for m in meds:
        if m['rx'].search(txt): m['q'].append(q['id'])

# ---- output only medications that appear somewhere in the materials
cats=[];idx={}
keep=[m for m in meds if m['slides'] or m['q']]
out=[]
for m in keep:
    m['i']=len(out)
    out.append({'i':m['i'],'name':m['name'],'brands':m['brands'],'cat':m['cat'],'cls':m['cls'],'h':m['names'],'s':m['slides'],'q':m['q']})
for cat in L:
    cl=[]
    for cls in L[cat]:
        ids=[m['i'] for m in keep if m['cat']==cat and m['cls']==cls]
        if ids: cl.append({'n':cls,'m':ids})
    if cl: cats.append({'n':cat,'c':cl})
used={x['u'] for m in out for x in m['s']}
suffix=next(({'d':d,'n':n} for d,k,n,t,l in units if d.startswith('ati-') and any('-asone' in x for x in l)),None)
data={'decks':decks,'units':{k:v for k,v in units_out.items() if k in used},'suffix':suffix,'cats':cats,'meds':out}
open(os.path.join(ROOT,'data','meds.js'),'w').write('window.MEDS='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';')
tot=lambda f:sum(len(f(m)) for m in out)
print(f"{len(out)} medications in {len(cats)} categories | {tot(lambda m:m['s'])} slide/page excerpts | {tot(lambda m:m['q'])} question links | {os.path.getsize(os.path.join(ROOT,'data','meds.js'))//1024} KB")
for c in cats:print(f"  {c['n']}: {sum(len(x['m']) for x in c['c'])} meds in {len(c['c'])} classes")
miss=[m['name'] for m in meds if not (m['slides'] or m['q'])]
print(len(miss),'list entries not found anywhere in your materials (left out)')

if '--report' in sys.argv:
    known=set()
    for m in meds:
        for n in [m['name']]+m['brands']: known.add(n.lower())
    suf=r'(?:pril|sartan|olol|dipine|statin|prazole|tidine|mycin|cillin|floxacin|cycline|parin|azepam|zolam|vir|mab|terol|sone|solone|barbital|caine|azole|azine|triptan|oxetine|triptyline|pramine|idone|apine|lamide|thiazide|setron|dopa|fenac|profen|codone|morphone|zosin|tinib|platin|cillin|penem|bactam|xaban|gliptin|glitazone|glinide|oxacin)'
    cand=collections.Counter()
    texts=[norm(l) for *_,lines in units for l in lines]+[norm(q['q']+' '+q['r']) for q in qd['bank']]
    for t in texts:
        for w in re.findall(r'\b[A-Za-z]{5,}\b',t):
            if re.search(suf+r's?$',w.lower()) and w.lower() not in known: cand[w.lower()]+=1
        for g,b in re.findall(r'\b([A-Za-z]{5,})\s*\(([A-Z][A-Za-z\-]{3,})\)',t):
            if g.lower() not in known and b.lower() not in known: cand[g.lower()+' ('+b+')']+=1
    print('\nPOSSIBLY MISSING:',sorted(cand.items(),key=lambda x:-x[1])[:150])
