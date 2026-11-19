"""Builds data/meds.js (the Medications tab) from the student's own materials.
Scans: every library deck in data/seed (PowerPoints + ATI guide; not the syllabus) and the question bank.
Run from anywhere:  python3 tools/meds/build_meds.py   (add --report to list names the list may be missing)"""
import json,glob,os,re,sys,collections
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
sys.path.insert(0,HERE)
from lexicon import L
from reference import R,D
from extras import EX
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


# ---- six-field split: classification, mechanism of action, safe administration, side effects, lab monitoring, nursing interventions
# Every line below is copied word for word from the student's slides / ATI guide; lines that fit none of the six are dropped.
from reference import R,D
QSLIDE=re.compile(r'NGN|question|case study|clinical judgment',re.I)
F_LABS=re.compile(r'\b(levels?|INR|PT\b|aPTT|PTT|labs?|WBC|ANC|platelet|CBC|hemoglobin|hematocrit|creatinine|BUN|ALT|AST|liver (?:function|enzymes)|renal function|glucose|A1C|potassium|sodium|magnesium|calcium|therapeutic|trough|peak|toxic(?:ity)? level|serum|ng/mL|mEq|mcg/mL|mg/dL|\d\s*-\s*\d+(?:\.\d+)?\s*(?:ng|mcg|mEq|mg|seconds|units))',re.I)
F_MOA=re.compile(r'^\W*(?:action|mechanism)\b|\b(inhibit|block|decreas|increas|improv|stimulat|relax|bind|dilat|constrict|reduc|prevent|promot|lower|raise|enhanc|suppress|activate|convert|replac|neutraliz|destroy|kill|slows?|speeds?)(?:s|es|ing|ed)?\b',re.I)
F_SE=re.compile(r'side effect|adverse|toxic|overdose|can cause|causes\b|may cause|rash|nausea|vomit|diarrhea|constipation|bleed|hypotension|bradycardia|tachycardia|drowsiness|sedation|dizz|cough|headache|ototox|nephrotox|hepatotox|anaphyl|allerg|reaction|hallucinat|seizure|respiratory depression|photosens|tremor|weakness|visual|halos',re.I)
F_ADM=re.compile(r'\b(give|given|administer|administration|take|taken|hold|push|infus|inject|route|dose|dosing|oral|IV|IM|subcutaneous|sublingual|topical|inhal|with food|empty stomach|before meals|after meals|bedtime|morning|crush|chew|Z-track|contraindicated|filter|pump|never)\b',re.I)
F_NSG=re.compile(r'\b(monitor|assess|teach|instruct|educat|report|avoid|encourage|check|observe|notify|antidote|precaution|ensure|counsel|expect|should|must|do not|don.t)\b',re.I)
F_CLS=re.compile(r'\b(class|classification|category|used (?:to|for)|indicated|treats?|antihypertensive|antibiotic|anticoagulant|diuretic|analgesic|antidepressant|antipsychotic|anticonvulsant|inhibitors?|blockers?|agonists?|antagonists?)\b',re.I)
def classify(line,first,m_has=lambda t:True):
    """first = this is the line that names the drug (usually a heading)."""
    t=line.strip(' -●○•▪–\t')
    if len(t)<12: return None
    if first and len(t)<45 and not re.search(r'[.:]',t) and not F_NSG.search(t) and not F_ADM.search(t): return None
    if re.match(r'^(?:NGN|question|case study)',t,re.I): return None
    if re.search(r'\bantidote\b',t,re.I): return 'nsg'
    if F_LABS.search(t) and re.search(r'\b(levels?|INR|aPTT|PTT|labs?|therapeutic|trough|peak|WBC|\d\s*-\s*\d)',t,re.I) and not re.match(r'^(?:give|take|administer)',t,re.I): return 'labs'
    if re.match(r'^\W*(?:action|mechanism)',t,re.I): return 'moa'
    if F_SE.search(t) and not re.match(r'^(?:monitor|assess|teach|report|notify|instruct|check|observe)',t,re.I): return 'se'
    if re.match(r'^(?:monitor|assess|teach|instruct|educat|report|avoid|encourage|check|observe|notify|ensure|counsel)',t,re.I): return 'nsg'
    if F_ADM.search(t): return 'adm'
    if F_MOA.search(t): return 'moa'
    if F_NSG.search(t): return 'nsg'
    if F_CLS.search(t) and m_has(t): return 'cls'
    return None
others={}
QLINE=re.compile(r'\?\s*$|^(?:what|which|why|how|when|the nurse|a nurse|the client|a client|yes|no)\b|^(?:hold|administer|notify|obtain|document|call|give)\s+the\b',re.I)
def segment(m,mi,u,k):
    """Lines that really belong to this drug, from the slide/page.  Precision over recall:
    a slide/page about the drug (title or short heading names it) keeps its bullets; elsewhere only the lines that name the drug itself."""
    lines=units_out[u]['l'];idx=sorted(k)
    hitme=[i for i in idx if m['rx'].search(lines[i])]
    if not hitme: return []
    ati=u.split(':')[0]==ATI_ID
    def other_hits(l):return [o for o in meds if o is not m and o['rx'].search(l)]
    out=[]
    cand=[]
    for h in hitme:
        if is_heading(lines[h]) and len(lines[h])<45:        # a heading naming the drug: take its bullets, stop at the next drug / heading
            cand.append((h,lines[h],True))
            for j in idx:
                if j>h and j<=h+14:
                    lj=lines[j]
                    if not m['rx'].search(lj) and any(o is not m and o['rx'].search(lj) and len(lj)<60 for o in meds): break
                    if is_heading(lj) and not is_bullet(lj) and len(lj)<45 and not m['rx'].search(lj): break
                    cand.append((j,lj,True))
        else: cand.append((h,lines[h],False))
    seen=set()
    for i,l,ded in cand:
        t=l.strip(' -●○•▪–\t')
        if i in seen or QLINE.search(t) or len(t)<25 or t[0].islower(): continue
        seen.add(i)
        if other_hits(l): continue                           # names another drug as well (interactions, lists)
        mm=m['rx'].search(l)
        if not ded and (not mm or mm.start()>24): continue   # outside the drug's own section: only lines that lead with the drug name
        out.append((i,l))
    return out
ATI_ID=next(d for d in decks if d.startswith('ati-'))
for mi,m in enumerate(meds):
    m['f']={k:[] for k in ('cls','moa','adm','se','labs','nsg')}
    for sl in m['slides']:
        u=sl['u']
        if QSLIDE.search(units_out[u]['t']): continue
        seg=segment(m,mi,u,sl['k'])
        for n,(i,l) in enumerate(seg):
            c=classify(l,n==0,lambda t,m=m:bool(m['rx'].search(t)))
            if c and len(m['f'][c])<8: m['f'][c].append({'x':l.strip(' -●○•▪–\t')[:400],'u':u,'i':i})

# ---- question mentions
for q in qd['bank']:
    txt=norm(q['q']+'\n'+'\n'.join(q['o'])+'\n'+q['r'])
    for m in meds:
        if m['rx'].search(txt): m['q'].append(q['id'])

# ---- output only medications that appear somewhere in the materials
cats=[];idx={}
keep=[m for m in meds if m['slides'] or m['q'] or m['name'] in EX]   # EX: extra drugs found in none of the materials (Misc tab)
out=[]
for m in keep:
    m['i']=len(out)
    extra=m['name'] in EX and not (m['slides'] or m['q'])
    r=EX[m['name']] if extra else R[m['cls']];d={} if extra else D.get(m['name'],{})
    f={}
    for k in ('cls','moa','adm','se','labs','nsg'):
        gk='admin' if k=='adm' else k
        g=([r['cl']] if k=='cls' else [x for x in r[gk].split('|') if x])+[x for x in d.get(gk,'').split('|') if x]
        f[k]={'m':m['f'][k],'g':g}
    ap=sorted({int(x['u'].split(':')[1]) for x in m['slides'] if x['u'].split(':')[0]==ATI_ID})
    g=bool(m['q']) or any(x['u'].split(':')[0]!=ATI_ID for x in m['slides'])       # found in Galen material: a class slide or a Galen practice/quiz question
    out.append({'i':m['i'],'name':m['name'],'brands':m['brands'],'cat':m['cat'],'cls':m['cls'],'f':f,'q':m['q'],'g':g,'s':any(x['u'].split(':')[0]!=ATI_ID for x in m['slides']),'a':bool(ap),'ap':ap})
for cat in L:
    cl=[]
    for cls in L[cat]:
        ids=[m['i'] for m in keep if m['cat']==cat and m['cls']==cls]
        if ids: cl.append({'n':cls,'m':ids})
    if cl: cats.append({'n':cat,'c':cl})
used={x['u'] for m in out for v in m['f'].values() for x in v['m']}
suffix=next(({'d':d,'n':n} for d,k,n,t,l in units if d.startswith('ati-') and any('-asone' in x for x in l)),None)
data={'decks':decks,'units':{k:v for k,v in units_out.items() if k in used},'suffix':suffix,'cats':cats,'meds':out}
open(os.path.join(ROOT,'data','meds.js'),'w').write('window.MEDS='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';')
tot=lambda f:sum(len(f(m)) for m in out)
print(f"{len(out)} medications in {len(cats)} categories | {sum(len(v['m']) for m in out for v in m['f'].values())} cited lines | {tot(lambda m:m['q'])} question links | {os.path.getsize(os.path.join(ROOT,'data','meds.js'))//1024} KB")
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
