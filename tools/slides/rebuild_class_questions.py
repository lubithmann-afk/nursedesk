"""Re-reads every 'Class slides' question straight from the deck slides so the stem and the options are WORD FOR WORD what the slide says.
The question id, the answer key (re-mapped to the slide's own option order) and the rationale are kept.  Usage:
  python3 tools/slides/rebuild_class_questions.py            report only
  python3 tools/slides/rebuild_class_questions.py --write    also rewrite data/questions.js"""
import json,re,glob,os,sys,difflib
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
QDp=os.path.join(ROOT,'data','questions.js')
raw=open(QDp,encoding='utf8').read();QD=json.loads(raw.split('window.QD=',1)[1].rstrip(';\n'))
ws=lambda s:re.sub(r'\s+',' ',s.replace(' ',' ')).strip()
nk=lambda s:re.sub(r'[^a-z0-9]','',s.lower().replace('’',"'"))
decks={}
for f in glob.glob(os.path.join(ROOT,'data','seed','*','deck.json')):
    d=json.load(open(f,encoding='utf8'))
    if d.get('kind')=='questions':continue
    decks[d['id']]=d
slides=[(did,s) for did,d in decks.items() for s in d['slides']]
def lines_of(s):
    out=[ws(x) for x in s['text'] if ws(x)]
    return [x for x in out if not re.match(r'^NGN NCLEX-RN (Practice )?Question$',x)]
CAND=[]   # (norm text of slide lines k..j, deck, slide, k, j, lines) computed once
for did,s in slides:
    L=lines_of(s)
    for k in range(min(len(L),4)):
        for j in range(k,min(len(L),k+3)):
            CAND.append((nk(' '.join(L[k:j+1])),did,s['n'],k,j,L))
def locate(q):
    key=nk(q['q'])[:90];best=(0,None)
    pre=[c for c in CAND if key[:25] in c[0]]            # cheap filter first
    for c in (pre or CAND):
        r=difflib.SequenceMatcher(None,key,c[0][:90]).ratio() if pre else 0
        if r>best[0]:best=(r,c[1:])
    return best
def clean_opt(o):return re.sub(r'^\s*\d+\.\s*','',o)
changes=[];manual=[];same=0
for q in QD['bank']:
    if not QD['src'][q['s']].startswith('Class slides'):continue
    r,loc=locate(q)
    if r<0.8:manual.append((q['id'],'no slide found',round(r,2)));continue
    did,n,k,j,L=loc;stem=' '.join(L[k:j+1]);opts=[clean_opt(x) for x in L[j+1:]]
    if not (2<=len(opts)<=8):manual.append((q['id'],f'slide {n} has {len(opts)} option lines',stem[:50]));continue
    # map the bank's options onto the slide's options (same order unless the bank shuffled them)
    used=set();mp=[]
    for o in q['o']:
        sc=[(difflib.SequenceMatcher(None,nk(o)[:60],nk(x)[:60]).ratio(),i) for i,x in enumerate(opts) if i not in used]
        if not sc:mp.append(None);continue
        r2,i=max(sc);mp.append(i if r2>0.55 else None);used.add(i) if r2>0.55 else None
    a=q['a'] if isinstance(q['a'],list) else [q['a']]
    clean_map=len(q['o'])==len(opts) and None not in mp and len(set(mp))==len(mp)
    new_a=sorted(mp[i] for i in a) if clean_map and all(0<=i<len(mp) for i in a) else None
    diffs=[]
    if ws(q['q'])!=stem:diffs.append('stem')
    if [ws(o) for o in q['o']]!=opts:diffs.append('options')
    if not diffs:same+=1;continue
    if new_a is None:manual.append((q['id'],'could not map answers safely',stem[:50]));continue
    changes.append({'id':q['id'],'what':diffs,'stem':stem,'opts':opts,'a':new_a if isinstance(q['a'],list) else new_a[0],'old':(q['q'],q['o'],q['a'])})
print(f'{same} identical | {len(changes)} to correct | {len(manual)} need a human look')
for c in changes:
    print('\n#',c['id'],c['what']);
    if 'stem' in c['what']:print('  stem OLD:',ws(c['old'][0])[-160:]);print('  stem NEW:',c['stem'][-160:])
    if 'options' in c['what']:
        for i,(o,n_) in enumerate(zip(c['old'][1]+['']*9,c['opts'])):
            if ws(o)!=n_:print(f'  opt {i} OLD: {o[:80]!r}\n        NEW: {n_[:80]!r}')
        print('  answer',c['old'][2],'->',c['a'])
print('\nMANUAL:',manual)
if '--write' in sys.argv:
    by={c['id']:c for c in changes}
    for q in QD['bank']:
        c=by.get(q['id'])
        if c:q['q']=c['stem'];q['o']=c['opts'];q['a']=c['a']
    open(QDp,'w',encoding='utf8').write('window.QD='+json.dumps(QD,ensure_ascii=False,separators=(',',':'))+';')
    print('written')
