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
_XT='Other study sets (not Galen)'
tl.append(_XT);_tl=tl;_CODE={k:v for k,v in tmap.TOP.items()};_CODE['X']=_XT
# bank5: slides questions with answer keys; bank6: question slides from the Unit 6-12 decks (see tools/slides/mk6.py);
# bank7: end-of-week quiz questions, checked against the PowerPoints (see tools/quiz/build_bank7.py).
# New banks are only ever appended so existing question ids (and saved progress) never change.
# bank8: outside (NOT Galen) study sets, flagged x:1 so they stay out of the mixed pools, weak-area lists and Tutor (see tools/extra/build_bank8.py).
for _f in ('bank5.json','bank6.json','bank7.json','bank8.json'):
  for q in _j.load(open(_f)):
    if q['src'] not in srcs:srcs.append(q['src'])
    ids+=1
    bank.append({"id":ids,"t":_tl.index(_CODE[q['t']]),"s":srcs.index(q['src']),"q":q['q'],"o":q['o'],"a":q['a'],"r":q['r']})
    if _f=='bank8.json':bank[-1]["x"]=1
data=json.dumps({"src":srcs,"top":tl,"bank":bank},ensure_ascii=False)
html=open('tpl.html').read().replace('/*DATA*/',data)
open('quiz.html','w').write(html)
print(len(bank),len(html))
