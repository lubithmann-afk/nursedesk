import json,re
d=json.load(open('all.json'))
V=re.compile(r'\s*[\.\s]\s*(Yes|YES|No|NO)\b[!,\.\s:–-]|\s+(Yes|YES|No|NO)\s*$|\s(Yes|YES|No|NO)!')
def norm(s):return re.sub(r'[^a-z0-9]','',s.lower())
def split_verdict(p):
    m=re.search(r'(?:^|[\s\.\?”"])(Yes|YES|No|NO)(?=[,\.!:\s]|$)',p)
    if not m or m.start()<3:return None
    return p[:m.start()].strip(' .'),m.group(1).lower()=='yes',p[m.end():].strip(' ,.!:-')
res=[];unm=[]
for f,s in d.items():
    deck=re.sub(r'^[0-9a-f]{8}-','',f).replace('NUR_283_285_-_','').replace('.pptx','').replace('_',' ')
    for j,x in enumerate(s):
        items=[split_verdict(p) for p in x['text']]
        good=[i for i in items if i]
        if len(good)<3 or len(good)<len(x['text'])-2:continue
        # find the question slide
        q=None
        for k in range(j-1,max(j-3,-1),-1):
            t=s[k]['text']
            hit=sum(1 for g in good if any(norm(p).startswith(norm(g[0])[:12]) for p in t))
            if hit>=len(good)-1 and hit>=2:q=k;break
        if q is None:unm.append((deck,x['n']));continue
        qt=s[q]['text']
        optset=[p for p in qt if any(norm(p).startswith(norm(g[0])[:12]) for g in good)]
        stem=' '.join(p for p in qt if p not in optset).strip()
        opts=[];corr=[];ex=[]
        for g in good:
            # use the original option text from q slide when available
            o=next((p for p in qt if norm(p).startswith(norm(g[0])[:12])),g[0])
            opts.append(o.strip());ex.append(g[2]);
            if g[1]:corr.append(len(opts)-1)
        res.append({'deck':deck,'slide':s[q]['n'],'stem':stem,'opts':opts,'corr':corr,'ex':ex,'imgs':len(s[q]['images'])})
json.dump(res,open('auto.json','w'),ensure_ascii=False)
print(len(res),'auto questions; unmatched answer slides:',unm)
from collections import Counter
print(Counter(len(r['corr']) for r in res))
bad=[r for r in res if not r['stem'] or len(r['corr'])==0]
print('no stem/no correct:',[(r['deck'][7:30],r['slide'],r['stem'][:40],len(r['corr'])) for r in bad])
