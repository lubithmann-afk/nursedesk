"""Looks up each medication in the FDA drug labels (openFDA: https://open.fda.gov/apis/drug/label/) and writes data/fda.js.
FDA labeling is a US government work (public domain). Only SHORT excerpts are kept, never doses, each with a link to the full label on DailyMed.
Needs internet. Raw answers are cached in tools/meds/.fda_cache (git-ignored) so a re-run only fetches what is missing.
Run from the repo root:  python3 tools/meds/fetch_fda.py            (all medications)
                         python3 tools/meds/fetch_fda.py digoxin    (just one, for checking)"""
import json,os,re,sys,time,urllib.request,urllib.parse
ROOT=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
CACHE=os.path.join(ROOT,'tools','meds','.fda_cache');os.makedirs(CACHE,exist_ok=True)
M=json.loads(open(os.path.join(ROOT,'data','meds.js'),encoding='utf8').read().split('window.MEDS=',1)[1].rstrip(';\n'))['meds']
# names the FDA labels use differently from the app's names; None = no FDA drug label exists (supplements, vaccines, groups, fluids)
ALIAS={'regular insulin':'insulin human','NPH insulin':'insulin isophane','insulin':'insulin human',"Lugol's solution":'potassium iodide','vitamin K':'phytonadione','vitamin D':'cholecalciferol',
 'vitamin C':'ascorbic acid','vitamin B6':'pyridoxine hydrochloride','vitamin E':'tocopherol','calcium supplements':'calcium carbonate','zinc':'zinc sulfate','epoetin alfa':'epoetin alfa',
 'salt-poor albumin':'albumin human',"lactated Ringer's":"lactated ringer's",'dextrose':'dextrose monohydrate','docusate sodium':'docusate sodium','docusate calcium':'docusate calcium','docusate potassium':'docusate potassium',
 'polyethylene glycol electrolyte solution':'polyethylene glycol 3350','diphenoxylate with atropine':'diphenoxylate hydrochloride','levodopa-carbidopa':'carbidopa','digoxin immune fab':'digoxin immune fab (ovine)',
 'silver sulfadiazine':'silver sulfadiazine','methyl salicylate':'methyl salicylate','Rho(D) immune globulin':'rho(d) immune globulin','sodium bicarbonate':'sodium bicarbonate','nicotine replacement':'nicotine',
 'erythromycin ointment':'erythromycin','estrogen therapy':'estradiol','oral contraceptives':'norethindrone','artificial tears':'carboxymethylcellulose sodium','garlic supplements':None,'activated charcoal':'activated charcoal',
 'sulfamethoxazole-trimethoprim':'sulfamethoxazole and trimethoprim','piperacillin-tazobactam':'piperacillin and tazobactam','imipenem-cilastatin':'imipenem and cilastatin','interferon beta-1a':'interferon beta-1a',
 'interferon beta-1b':'interferon beta-1b','insulin lispro':'insulin lispro','insulin aspart':'insulin aspart','insulin glargine':'insulin glargine','insulin detemir':'insulin detemir','insulin glulisine':'insulin glulisine',
 'statins':None,'corticosteroids':None,'salicylates':None,'HIV antiretrovirals':None,'chemotherapeutic agents':None,'multivitamin':None,'parenteral nutrition':None,'St. John\'s wort':None,'saw palmetto':None,
 'ginkgo biloba':None,'ginseng':None,'echinacea':None,'valerian':None,'kava':None,'black cohosh':None,'glucosamine':None,'feverfew':None,'melatonin':None,'psyllium':'psyllium','casanthranol':None}
VACC=re.compile(r'vaccine',re.I)
def api(search,limit=6):
    key=re.sub(r'[^a-z0-9]+','_',search.lower())[:120]+f'_{limit}.json';f=os.path.join(CACHE,key)
    if os.path.exists(f):return json.load(open(f))
    url='https://api.fda.gov/drug/label.json?search='+urllib.parse.quote(search,safe=':+"()[]')+f'&limit={limit}'
    for t in range(4):
        try:
            with urllib.request.urlopen(url,timeout=40) as r:j=json.load(r)
            json.dump(j,open(f,'w'));time.sleep(0.45);return j
        except urllib.error.HTTPError as e:
            if e.code==404:json.dump({'results':[]},open(f,'w'));time.sleep(0.3);return {'results':[]}
            time.sleep(3+4*t)
        except Exception:time.sleep(3+4*t)
    return {'results':[]}
FIELDS=['indications_and_usage','mechanism_of_action','clinical_pharmacology','boxed_warning','contraindications','adverse_reactions','warnings_and_cautions','warnings','precautions','information_for_patients','dosage_and_administration','drug_interactions']
def score(r):return sum(1 for k in FIELDS if r.get(k))*10+(r.get('effective_time','0')[:4]>'2018')*3+('boxed_warning' in r)
def best(name):
    n=ALIAS.get(name,name)
    if n is None or VACC.search(name):return None
    for q in (f'openfda.generic_name:"{n}"',f'openfda.substance_name:"{n}"',f'openfda.brand_name:"{n}"'):
        res=[r for r in api(q).get('results',[]) if r.get('set_id')]
        # prefer single-ingredient labels whose generic name is the drug itself
        ok=[r for r in res if any(n.lower() in g.lower() and len(g)<len(n)+25 for g in r.get('openfda',{}).get('generic_name',[]))] or res
        if ok:return max(ok,key=score)
    return None
DOSE=re.compile(r'\b\d+(?:[.,]\d+)?\s?(?:mg|mcg|µg|g|mL|ml|units?|IU|mEq|mmol|mg/kg|mcg/kg|g/kg|L|kg)\b|\b\d+\s?(?:to|-)\s?\d+\s?(?:mg|mcg|mL|units?)\b',re.I)
def tidy(t):
    t=re.sub(r'\[\s*see[^\]]*\]','',t,flags=re.I)                       # [see Warnings and Precautions (5.1)]
    t=re.sub(r'\(\s*\d+(?:\.\d+)*(?:\s*[,;]\s*\d+(?:\.\d+)*)*\s*\)','',t)  # (5.1) section references
    t=re.sub(r'\(\s*see[^)]*\)','',t,flags=re.I)
    t=re.sub(r'\s*[\u2022\u25cf\u25aa]+\s*','; ',t)                      # bullets
    t=re.sub(r'\s+([.,;:])',r'\1',t);t=re.sub(r'(?:;\s*){2,}','; ',t);t=re.sub(r':\s*;',':',t);t=re.sub(r'^[;:\s]+','',t)
    return ' '.join(t.split())
def squash(t):
    t=' '.join(str(t).split());t=tidy(t)
    t=re.sub(r'^(?:\d+(?:\.\d+)*\s+)?(?:BOXED WARNING SECTION|INDICATIONS(?: AND| &) USAGE|INDICATIONS|CONTRAINDICATIONS|ADVERSE REACTIONS|WARNINGS AND PRECAUTIONS|WARNINGS|PRECAUTIONS|MECHANISM OF ACTION|PATIENT COUNSELING INFORMATION|INFORMATION FOR PATIENTS|CLINICAL PHARMACOLOGY|DESCRIPTION)\s*[:\-]?\s*','',t,flags=re.I)
    t=re.sub(r'\b\d+\.\d+\s+(?=[A-Z][a-z])','',t)          # sub-section numbers like "12.1 Mechanism"
    return t.strip()
def sents(t):return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-Z(])',t) if s.strip()]
def cut(t,n):
    t=t.strip()
    if len(t)<=n:return t
    c=t[:n];i=max(c.rfind('. '),c.rfind('; '));return (c[:i+1] if i>80 else c.rsplit(' ',1)[0]+'…')
def pick(txt,n=360,max_s=2,need=None,skip_dose=True,skip=None):
    out=[]
    for s in sents(squash(txt)):
        s=tidy(s)
        if skip_dose and DOSE.search(s):continue
        if need and not need.search(s):continue
        if skip and skip.search(s):continue
        if len(s)<25 or len(re.findall(r'\d',s))>len(s)*0.12:continue
        out.append(s)
        if len(out)>=max_s:break
    return cut(' '.join(out),n) if out else ''
def first(r,*ks):
    for k in ks:
        v=r.get(k)
        if v:return ' '.join(v) if isinstance(v,list) else str(v)
    return ''
def extract(r):
    o=r.get('openfda',{});d={}
    epc=[re.sub(r'\s*\[.*?\]','',x) for x in o.get('pharm_class_epc',[])][:2];moa=[re.sub(r'\s*\[.*?\]','',x) for x in o.get('pharm_class_moa',[])][:3];pe=[re.sub(r'\s*\[.*?\]','',x) for x in o.get('pharm_class_pe',[])][:3]
    d['cls']=[x for x in [('FDA drug class: '+', '.join(epc)) if epc else '',pick(first(r,'indications_and_usage'),330,2)] if x]
    mtxt=first(r,'mechanism_of_action')
    if not mtxt:
        cp=first(r,'clinical_pharmacology');m=re.search(r'Mechanism of Action[:\s]*(.*)',cp,re.I);mtxt=m.group(1) if m else ''
    d['moa']=[x for x in [pick(mtxt,380,2),('FDA mechanism class: '+'; '.join(moa)) if moa else '',('Effect on the body: '+'; '.join(pe)) if pe else ''] if x]
    routes=[x.title() for x in o.get('route',[])][:4]
    d['adm']=[x for x in [('Route'+('s' if len(routes)>1 else '')+' on the label: '+', '.join(routes)) if routes else '',('Do not use when: '+pick(first(r,'contraindications'),320,2)) if first(r,'contraindications') and not re.match(r'\s*(?:\d+\s+)?(?:CONTRAINDICATIONS\s*)?None',first(r,'contraindications'),re.I) else ''] if x]
    ae=first(r,'adverse_reactions');d['se']=[x for x in [pick(ae,380,2,need=re.compile(r'most common|commonly|frequent|incidence|reported|include',re.I),skip=re.compile(r'clinical trials? (?:are|is) conducted|can ?not be directly compared|following adverse reactions|discussed in (?:greater )?detail|included in more detail|labeling',re.I)) or pick(ae,330,2)] if x]
    pool=' '.join(first(r,k) for k in ('warnings_and_cautions','warnings','precautions','dosage_and_administration','clinical_pharmacology'))
    mon=pick(pool,340,2,need=re.compile(r'\b(monitor\w*|check\w*|measur\w+|obtain|assess\w*|periodic\w*)\b.*\b(level|serum|blood|INR|creatinine|function|count|ECG|pressure|glucose|potassium|liver|kidney|renal|hepatic|electrolyte)',re.I),skip=re.compile(r'\b(patients? should|instruct)',re.I))
    d['labs']=[mon] if mon else []
    pat=pick(first(r,'information_for_patients'),360,2,skip=re.compile(r'^see\b|FDA-approved patient labeling|patient information leaflet|medication guide',re.I));boxed=pick(first(r,'boxed_warning'),340,2,skip_dose=False)
    d['nsg']=[pat] if pat else []
    meta={'set':r['set_id'],'t':(o.get('brand_name') or o.get('generic_name') or [''])[0].title()[:60],'date':(r.get('effective_time') or '')[:8]}
    out={k:v for k,v in d.items() if v};out['meta']=meta
    if boxed:out['box']=boxed
    return out
if __name__=='__main__':
    from concurrent.futures import ThreadPoolExecutor
    only=sys.argv[1:];res={};miss=[]
    todo=[m['name'] for m in M if not only or m['name'] in only]
    def work(n):
        try:return n,best(n)
        except Exception as e:return n,None
    with ThreadPoolExecutor(max_workers=3) as ex:
        found=dict(ex.map(work,todo))
    for n in todo:
        r=found.get(n)
        if not r:miss.append(n);continue
        res[n]=extract(r);print(f"{len(res):3} {n:32} {','.join(k for k in res[n] if k!='meta')}",flush=True)
    if only:print(json.dumps(res,indent=1)[:4000]);sys.exit()
    open(os.path.join(ROOT,'data','fda.js'),'w',encoding='utf8').write('window.FDA='+json.dumps(res,ensure_ascii=False,separators=(',',':'))+';')
    print(len(res),'looked up;',len(miss),'with no FDA drug label:',miss)
