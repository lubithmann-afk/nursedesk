"""Build tools/bank/bank8.json: the five extra, NON-Galen question sets (appended after bank7 so existing ids never change).
Inputs are the parsed JSON files from parse_extra.py (+ topicsA.py for the scanned PDF). Usage:
  python3 tools/extra/build_bank8.py tools/extra/parsed
import json,os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,HERE)
import topicsA
D=sys.argv[1]
NOTE="Not from Galen materials: this question comes from an outside study set. Check it against your Galen slides and ATI."
FIX=[('Massage the fungus','Massage the fundus'),('Tredelenburg','Trendelenburg'),("infant.s armpits","infant’s armpits"),('The nurse nurses teaching','The nurse is teaching')]
SKIP={'compC':{19,45},'compB5':{45}}   # questions that depend on a picture (heart-sound location, rhythm strips)
SETS=[('compC','Not Galen – Comp C Highlights'),('compB5','Not Galen – Comprehensive B'),('c203a','Not Galen – Comp 203 (set 1)'),('c203b','Not Galen – Comp 203 (set 2)')]
def clean(s):
    s=re.sub(r'\s+',' ',s).strip()
    for a,b in FIX:s=s.replace(a,b)
    return s
out=[]
for f,name in SETS:
    for x in json.load(open(os.path.join(D,f+'.json'))):
        if x['n'] in SKIP.get(f,()):continue
        L=x['key']['letters'];assert len(L)==1 and len(x['o'])==4,(f,x['n'])
        why=clean(x['key'].get('why',''))
        out.append({'src':name,'t':'X','q':clean(x['q']),'o':[clean(o) for o in x['o']],'a':ord(L[0].lower())-97,'r':(why+'\n\n' if why else '')+NOTE})
for n,q,o,a,why in topicsA.T:
    out.append({'src':'Not Galen – Comprehensive Topics A','t':'X','q':clean(q),'o':[clean(z) for z in o],'a':ord(a.lower())-97,'r':clean(why)+'\n\n'+NOTE})
json.dump(out,open(os.path.join(HERE,'..','bank','bank8.json'),'w'),ensure_ascii=False,indent=1)
print(len(out),'questions')
