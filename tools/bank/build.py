import json,sys
sys.path.insert(0,'.')
import b1,b2,b3,b4,tmap
mods=[b1,b2,b3,b4]
bank=[];ids=0;tl=list(tmap.TOP.values())
srcs=[]
for m in mods:
    srcs.append(m.S)
    for q,o,a,r in m.B:
        ids+=1
        bank.append({"id":ids,"t":tl.index(tmap.TOP[tmap.M[ids]]),"s":len(srcs)-1,"q":q,"o":o,"a":a,"r":r})
import json as _j
_b5=_j.load(open('bank5.json'))
_tl=list(tmap.TOP.values());_CODE={k:v for k,v in tmap.TOP.items()}
for q in _b5:
    if q['src'] not in srcs:srcs.append(q['src'])
    ids+=1
    bank.append({"id":ids,"t":_tl.index(_CODE[q['t']]),"s":srcs.index(q['src']),"q":q['q'],"o":q['o'],"a":q['a'],"r":q['r']})
data=json.dumps({"src":srcs,"top":tl,"bank":bank},ensure_ascii=False)
html=open('tpl.html').read().replace('/*DATA*/',data)
open('quiz.html','w').write(html)
print(len(bank),len(html))
