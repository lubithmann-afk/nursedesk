"""Parses the extra (NOT Galen) practice sets the student added: Comp C Highlights (PDF), Comprehensive B (DOCX), Comp203 (DOCX).
Each file has numbered questions with options a-d (sometimes more) and, at the end, an answer table (number, letter, rationale).
Text is kept exactly as written in the files (only whitespace is joined). Usage: python3 tools/extra/parse_extra.py <textfile> <label>"""
import re,sys,json
def clean(s):return re.sub(r'\s+',' ',s.replace(' ',' ').replace('ﬂ','fl').replace('ﬁ','fi').replace('ﬀ','ff').replace('ﬃ','ffi')).strip()
QSTART=re.compile(r'^\s*(\d{1,3})\.\s+(\S.*)$')
OPT=re.compile(r'^\s*([a-f])[\.\)]\s+(\S.*)$',re.I)
KEYHDR=re.compile(r'(Question\s+Correct\s+Rationale|#\s+Correct\s+Answer\s+Rationale|Answer Key with Rationales|^\s*#\s+Answer\s+Rationale)',re.I)
KEYROW=re.compile(r'^\s*(\d{1,3})\s+([A-F](?:\s*[,&]\s*[A-F])*)\b\s*(\([^)]*\))?\s*(.*)$')
def parse(text):
    lines=text.split('\n');qs={};cur=None;mode='q';key={};last_key=None;expect=1
    for raw in lines:
        l=raw.rstrip()
        if mode=='q' and KEYHDR.search(l):mode='k';cur=None;continue
        if mode=='k':
            if KEYHDR.search(l) or not l.strip() or re.match(r'^\s*-{5,}',l) or re.match(r'^\s*(Correct|Answer|#)\s*$',l.strip()) or l.strip()=='Question Correct Rationale':
                if not l.strip():last_key=None if last_key and False else last_key
                continue
            m=KEYROW.match(l)
            if m and int(m.group(1)) not in key and 1<=int(m.group(1))<=len(qs)+1 or (m and last_key is None):
                n=int(m.group(1));key[n]={'letters':re.findall(r'[A-F]',m.group(2)),'extra':m.group(3) or '','why':clean(m.group(4))};last_key=n
            elif last_key is not None and l.strip():
                key[last_key]['why']=clean(key[last_key]['why']+' '+l)
            continue
        m=QSTART.match(l)
        if m and int(m.group(1))==expect:
            cur={'n':int(m.group(1)),'stem':clean(m.group(2)),'opts':[],'in_opts':False};qs[cur['n']]=cur;expect+=1;continue
        if cur is None or not l.strip():continue
        om=OPT.match(l)
        if om and (len(cur['opts'])==0 and om.group(1).lower()=='a' or cur['opts'] and om.group(1).lower()==chr(ord(cur['opts'][-1][0])+1)):
            cur['opts'].append((om.group(1).lower(),clean(om.group(2))));cur['in_opts']=True;continue
        if cur['opts']:cur['opts'][-1]=(cur['opts'][-1][0],clean(cur['opts'][-1][1]+' '+l))
        else:cur['stem']=clean(cur['stem']+' '+l)
    return qs,key
if __name__=='__main__':
    qs,key=parse(open(sys.argv[1],encoding='utf8').read())
    out=[]
    for n,q in sorted(qs.items()):
        k=key.get(n)
        out.append({'n':n,'q':q['stem'],'o':[t for _,t in q['opts']],'letters':[x for x,_ in q['opts']],'key':k})
    json.dump(out,open(sys.argv[2],'w',encoding='utf8'),ensure_ascii=False,indent=1)
    bad=[o['n'] for o in out if len(o['o'])<3 or not o['key']]
    print(sys.argv[1].split('/')[-1],'| questions',len(out),'| keys',len(key),'| fewer than 3 options or no key:',bad)
    mism=[o['n'] for o in out if o['key'] and any(ord(c.lower())-97>=len(o['o']) for c in o['key']['letters'])]
    print('  answer letter beyond the options:',mism)
