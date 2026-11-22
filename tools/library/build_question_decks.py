"""Library decks for the app's own questions, so you can read them in the Library and the onboard AI can search them.
One deck per question set (practice tests, class-slide questions, weekly quizzes). Reads data/questions.js, writes data/seed/questions-*/deck.json.
Run by tools/bank/export_app.py. The outside (Not Galen) sets are left out on purpose."""
import json,os,re
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
qd=json.loads(open(os.path.join(ROOT,'data','questions.js')).read().split('window.QD=',1)[1].rstrip(';'))
seed=os.path.join(ROOT,'data','seed')
for d in os.listdir(seed):
    if d.startswith('questions-'):
        import shutil;shutil.rmtree(os.path.join(seed,d))
def nice(s):
    if s.startswith('Weekly quiz'):return s
    if s.startswith('Class slides'):return s.replace('Class slides','Class slide questions',1)
    return 'Practice test – '+s
def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')[:60]
n_dk=0;n_q=0
for si,s in enumerate(qd['src']):
    if s.startswith('Not Galen'):continue
    qs=[q for q in qd['bank'] if q['s']==si and not q.get('x')]
    if not qs:continue
    slides=[]
    for i,q in enumerate(qs,1):
        ans=q['a'] if isinstance(q['a'],list) else [q['a']]
        L=['Question: '+q['q'].strip()]+['%s. %s'%('ABCDEFGH'[k],o) for k,o in enumerate(q['o'])]
        L.append('Correct answer'+('s' if len(ans)>1 else '')+': '+'; '.join('%s. %s'%('ABCDEFGH'[k],q['o'][k]) for k in ans))
        L.append('Topic: '+qd['top'][q['t']])
        notes=[l.strip() for l in q['r'].split('\n') if l.strip()]
        slides.append({'n':i,'title':re.sub(r'\s+',' ',q['q'])[:80],'text':L,'notes':['Rationale: ']+notes if notes else [],'images':[]})
    did='questions-'+slug(nice(s))
    os.makedirs(os.path.join(seed,did),exist_ok=True)
    json.dump({'id':did,'name':nice(s),'kind':'questions','slides':slides},open(os.path.join(seed,did,'deck.json'),'w'),ensure_ascii=False)
    n_dk+=1;n_q+=len(qs)
print('question decks:',n_dk,'questions:',n_q)
