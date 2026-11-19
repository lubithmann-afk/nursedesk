"""Splits the app's data into (1) the PUBLIC part that ships in the installer and the git repo, and (2) the PRIVATE course pack.

The course pack holds everything copied from Galen / ATI materials: the slide decks, the question banks, the slide lines cited on the
Medications tab and the glossary entries quoted from the slides. It is NOT committed and NOT in the installer; students import it from
Settings > Course pack. Run (from the repo root) after the other generators have written the full data into data/:

    python3 tools/pack/build_pack.py            # writes content/NurseDesk-CoursePack.zip only
    python3 tools/pack/build_pack.py --strip    # ...and also removes the course content from data/ (what gets committed)
"""
import json,os,sys,zipfile,shutil,datetime
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
D=lambda *p:os.path.join(ROOT,'data',*p)
def rd(path,var):return json.loads(open(path,encoding='utf8').read().split(var+'=',1)[1].rstrip(';\n'))
def wr(path,var,obj):open(path,'w',encoding='utf8').write(var+'='+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+';')
if not os.path.exists(D('questions.js')) or not os.path.isdir(D('seed')):
    sys.exit('Full course data not found in data/. Restore the private sources first (see tools/README.md).')
QD=rd(D('questions.js'),'window.QD');M=rd(D('meds.js'),'window.MEDS');G=rd(D('glossary.js'),'window.GLOSSARY')
FK=('cls','moa','adm','se','labs','nsg')
cited={};qlinks={}
for m in M['meds']:
    c={k:m['f'][k]['m'] for k in FK if m['f'][k]['m']}
    if c:cited[m['name']]=c
    if m['q']:qlinks[m['name']]=m['q']
meds_pack={'decks':M['decks'],'units':M['units'],'suffix':M['suffix'],'cited':cited,'q':qlinks}
gl_pack={'terms':[t for t in G['terms'] if t.get('m')]}
decks=[d for d in sorted(os.listdir(D('seed'))) if os.path.exists(D('seed',d,'deck.json'))]
manifest={'format':1,'name':'NUR 283 course pack','created':datetime.date.today().isoformat(),
          'questions':len(QD['bank']),'decks':len(decks),'citedLines':sum(len(v) for c in cited.values() for v in c.values()),'classTerms':len(gl_pack['terms'])}
out=os.path.join(ROOT,'content');os.makedirs(out,exist_ok=True)
zp=os.path.join(out,'NurseDesk-CoursePack.zip')
with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
    z.writestr('manifest.json',json.dumps(manifest))
    z.writestr('questions.json',json.dumps(QD,ensure_ascii=False,separators=(',',':')))
    z.writestr('meds_cited.json',json.dumps(meds_pack,ensure_ascii=False,separators=(',',':')))
    z.writestr('glossary_class.json',json.dumps(gl_pack,ensure_ascii=False,separators=(',',':')))
    for d in decks:z.write(D('seed',d,'deck.json'),f'seed/{d}/deck.json')
print('pack:',zp,os.path.getsize(zp)//1024,'KB',manifest)
if '--strip' in sys.argv:
    for m in M['meds']:
        for k in FK:m['f'][k]['m']=[]
        m['q']=[]
    M['decks']={};M['units']={};M['suffix']=None
    wr(D('meds.js'),'window.MEDS',M)
    G['terms']=[t for t in G['terms'] if not t.get('m')];wr(D('glossary.js'),'window.GLOSSARY',G)
    shutil.rmtree(D('seed'));os.remove(D('questions.js'))
    print('stripped data/: kept',len(M['meds']),'medications (general reference only) and',len(G['terms']),'general glossary terms')
