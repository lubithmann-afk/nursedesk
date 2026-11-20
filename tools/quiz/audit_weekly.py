"""Checks every 'Weekly quiz' question in data/questions.js against the student's NUR_283_Complete_Master_Units_1-10.txt:
the stem and each option must be the file's own words. Prints differences. Usage: python3 tools/quiz/audit_weekly.py /path/to/Master.txt"""
import re,sys,json,glob,os
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
txt=open(sys.argv[1] if len(sys.argv)>1 else glob.glob('/root/.claude/uploads/*/*Master_Units*.txt')[0],encoding='utf8').read()
QD=json.loads(open(os.path.join(ROOT,'data','questions.js'),encoding='utf8').read().split('window.QD=',1)[1].rstrip(';\n'))
ws=lambda s:re.sub(r'\s+',' ',s.replace(' ',' ')).strip()
OPT=re.compile(r'^([A-Z])\.\s+(.*?)\s+\[(YES|NO|UNCERTAIN)\](?:\s+[—-]\s+(.*))?$')
blocks=re.split(r'\n(?=QUESTION \d+\b)',txt);src=[]
unit=None
for b in re.split(r'\n(?=UNIT \d+)',txt):
    m=re.match(r'UNIT (\d+)',b)
    if not m:continue
    unit=m.group(1)
    for qb in re.split(r'\n(?=QUESTION \d+\b)',b)[1:]:
        L=[l.rstrip() for l in qb.split('\n')]
        stem=[];opts=[];ans=None
        for l in L[1:]:
            om=OPT.match(l.strip())
            if om:opts.append((om.group(1),om.group(2),om.group(3)));continue
            if l.startswith('ANSWER'):ans=l;break
            if not opts and l.strip():stem.append(l.strip())
        src.append({'unit':unit,'stem':ws(' '.join(stem)),'opts':[(k,ws(t),f) for k,t,f in opts],'ans':ans})
print('questions parsed from the file:',len(src))
bystem={}
for s in src:bystem.setdefault(s['stem'],[]).append(s)
bad=[];ok=0;miss=[]
for q in QD['bank']:
    if not QD['src'][q['s']].startswith('Weekly quiz'):continue
    c=bystem.get(ws(q['q']))
    if not c:miss.append(q['id']);continue
    bo=[ws(o) for o in q['o']]
    if any([t for _,t,_ in s['opts']]==bo for s in c):ok+=1
    else:bad.append((q['id'],ws(q['q'])[:60],bo,[[t for _,t,_ in s['opts']] for s in c]))
print('weekly-quiz questions in the app:',ok+len(bad)+len(miss),'| stem+options identical to the file:',ok,'| options differ:',len(bad),'| stem not found in the file:',len(miss),miss[:20])
for b in bad[:15]:print(b[0],b[1],'\n   app :',b[2],'\n   file:',b[3][0])
