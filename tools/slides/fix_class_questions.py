"""One-time corrections for 'Class slides' questions found by tools/slides/audit_class_questions.py / rebuild_class_questions.py.
Stem and options are copied word for word from the deck slide; the answer key is read from the answer slide that follows (Yes/No per option).
Questions that are not on any slide (written earlier by the app author) are removed. Run: python3 tools/slides/fix_class_questions.py"""
import json,re,glob,os,sys
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
QDp=os.path.join(ROOT,'data','questions.js')
QD=json.loads(open(QDp,encoding='utf8').read().split('window.QD=',1)[1].rstrip(';\n'))
ws=lambda s:re.sub(r'\s+',' ',s.replace(' ',' ')).strip()
nk=lambda s:re.sub(r'[^a-z0-9]','',s.lower().replace('’',"'"))
decks={}
for f in glob.glob(os.path.join(ROOT,'data','seed','*','deck.json')):
    d=json.load(open(f,encoding='utf8'));decks[d['id']]=d
def slide_for(key):
    for did,d in decks.items():
        for i,s in enumerate(d['slides']):
            if key in nk(' '.join(s['text'])):return did,i
    raise SystemExit('slide not found for '+key)
def lines(s):
    return [x for x in (ws(t) for t in s['text']) if x and not re.match(r'^(NGN NCLEX-RN (Practice )?Question|NGN: [A-Za-z ]+|Multiple Choice Example:?)$',x)]
YN=re.compile(r'(?:^|[\s\.!?"”\)])(Yes|YES|No|NO)\b(?=[,\.!:\s\-–]|$)')
def build(key,n_stem=1,label=r'^Multiple Choice Example:\s*'):
    did,i=slide_for(key);sl=decks[did]['slides'];L=lines(sl[i])
    stem=re.sub(label,'',' '.join(L[:n_stem]));opts=[re.sub(r'^\s*\d+\.\s*','',x) for x in L[n_stem:]]
    ans=lines(sl[i+1]) if i+1<len(sl) else []
    return did,sl[i]['n'],stem,opts,ans
def segments(opts,ans):
    """Cut the answer page into one piece per option (works when two options share a wrapped line); each piece starts with that option's words."""
    text=' '.join(ans);low=text.lower();pos=[];at=0
    for o in opts:
        k=re.sub(r'[^a-z0-9 ]','',o.lower()).strip()[:14]
        m=re.search(r'\s*'.join(map(re.escape,k.split(' '))).replace('\\ ','\\s*'),re.sub(r'[“”"\.,]','',low[at:])) if False else None
        i=low.find(o.lower()[:14],at)
        if i<0:i=low.find(o.lower()[:8],at)
        if i<0:return None
        pos.append(i);at=i+1
    pos.append(len(text));return [text[pos[j]:pos[j+1]].strip() for j in range(len(opts))]
def verdicts(opts,ans):
    seg=segments(opts,ans)
    if seg is None and len(ans)==len(opts):seg=ans
    if seg is None:return None,None
    out=[]
    for o,t in zip(opts,seg):
        rest=t[len(o):] if t.lower().startswith(o.lower()[:20]) and len(t)>=len(o) else t
        m=YN.search(rest) or YN.search(t)
        if m:out.append(m.group(1).lower()=='yes')
        else:out.append(True if re.search(r'\bCorrect\b[.!]',rest) else None)   # some answer pages just say "Correct."
    if any(x for x in out):out=[bool(x) for x in out]                       # pages that only mark the right ones: the unmarked are wrong
    return out,seg
def rationale(did,n,opts,seg,a):
    cor=[];wrong=[]
    for i,(o,t) in enumerate(zip(opts,seg)):
        item=f"• “{o.strip(' “”')}” – {t[len(o):].strip()}" if t.lower().startswith(o.lower()[:20]) and len(t)>len(o) else f"• {t}"
        (cor if i in a else wrong).append(item)
    deck=re.sub(r'^nur-283-285-unit-\d+-(?:\d+-)?(?:galen-)?','',did);deck=re.sub(r'-student?.*$','',deck).replace('-',' ')
    return "Correct:\n"+"\n".join(cor)+"\n\nNot correct:\n"+"\n".join(wrong)+f"\n\n(Copied from the class slide answer page: {deck}, slide {n+1}.)"
FIX={ # id: (search key from the slide text, number of stem lines, expected answer key)
 205:('assigningclientstoalpn/lvnanduap'.replace('/',''),1,[0,1,3]),
 214:('multiplegunshotvictim',1,[0,2,3,5]),
 217:('hospitalbasedadmissionhasbecome',1,[1,4]),
 220:('lithiumlevelof1.8'.replace('.',''),1,1),
 221:('prescribesrisperidoneforaclientwithalzheimer',1,2),
 229:('osteoporosisscreeningclinic',1,[0,2,3,5]),
 232:('witnessanadvancedirective',1,3),
 234:('discussinglivingwillswithaclient',1,3),
}
by={q['id']:q for q in QD['bank']}
log=[]
for qid,(key,ns,exp) in FIX.items():
    did,n,stem,opts,ans=build(key,ns);q=by[qid]
    v,seg=verdicts(opts,ans);assert v is not None and None not in v,(qid,'answer slide not aligned',len(opts),len(ans))
    a=[i for i,b in enumerate(v) if b]
    want=sorted(exp if isinstance(exp,list) else [exp]);assert a==want,(qid,'answer slide says',a,'expected',want)
    q['q']=stem;q['o']=opts;q['a']=a if isinstance(q['a'],list) else a[0];q['r']=rationale(did,n,opts,seg,a);log.append(qid)
# exact-wording-only corrections (stem text; answers and rationale unchanged)
def say(qid,key,ns,label=r'^Multiple Choice Example:\s*',suffix=''):
    did,n,stem,opts,ans=build(key,ns,label);q=by[qid];q['q']=stem+suffix
    if [ws(o) for o in q['o']]!=opts:q['o']=opts
    log.append(qid)
say(235,'computerizeddocumentation',1)
say(239,'uapreportsthataclientiscomplaining',1)        # slide stem has the first sentence the old copy had dropped
say(250,'notexhibitingmanifestation',1)
# 242 is a matrix question on the slide ("click indicated / not indicated"); keep the slide's words, add one bracketed note about this app's format
did,n,stem,opts,ans=build('takinganaceinhibitor',2);q=by[242]
q['q']=stem+' [In this app, select every action that is indicated.]';q['o']=[o for o in opts if not re.match(r'^(Actions Nurse Should Take|Indicated|Not Indicated)$',o)];log.append(242)
# questions that are not on any slide (written earlier by the app author): remove
gone=[241,243,244,245]
QD['bank']=[q for q in QD['bank'] if q['id'] not in gone]
open(QDp,'w',encoding='utf8').write('window.QD='+json.dumps(QD,ensure_ascii=False,separators=(',',':'))+';')
print('corrected',sorted(log),'| removed',gone,'| questions now',len(QD['bank']))
