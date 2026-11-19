"""Builds data/glossary.js (the Library's medical terms fold).
Two sources: (1) terms the student's own class PowerPoints / ATI guide define, copied word for word with the slide or page cited;
(2) general medical terminology from general.py. If a term is in both, the class material wins.
Run from anywhere:  python3 tools/glossary/build_glossary.py   (add --show to print the class-material entries)"""
import json,glob,os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'));sys.path.insert(0,HERE)
from general import G
# (term shown, category, deck-name prefix ('ATI' = ATI guide), slide/page number, text that identifies the line, mode)
# mode: 'auto' = definition follows the term on the same line; 'next' = definition is the next line on the slide
M=[
('Hemiplegia','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Hemiplegia','auto'),
('Hemiparesis','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Hemiparesis','auto'),
('Dysarthria','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Dysarthria','auto'),
('Apraxia','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Apraxia','auto'),
('Expressive aphasia','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Expressive aphasia','auto'),
('Receptive aphasia','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Receptive aphasia','auto'),
('Global aphasia','Neuro, Eyes & Ears','Unit 10 - Neurological',15,'Global','auto'),
('Hemianopsia','Neuro, Eyes & Ears','Unit 10 - Neurological',16,'Hemianopsia','next'),
('Tetraplegia','Neuro, Eyes & Ears','Unit 10 - Neurological',61,'Tetraplegia','auto'),
('Paraplegia','Neuro, Eyes & Ears','Unit 10 - Neurological',61,'Paraplegia','auto'),
('Presbycusis','Neuro, Eyes & Ears','Unit 10 - Neurological',77,'Presbycusis','auto'),
('Conductive hearing loss','Neuro, Eyes & Ears','Unit 10 - Neurological',77,'Conductive loss','auto'),
('Sensorineural hearing loss','Neuro, Eyes & Ears','Unit 10 - Neurological',77,'Sensorineural','auto'),
('Cataract','Neuro, Eyes & Ears','Unit 10 - Neurological',72,'Cataracts','next'),
('Agnosia','Neuro, Eyes & Ears','ATI',46,'Agnosia','auto'),
('Myasthenic crisis','Neuro, Eyes & Ears','ATI',51,'Myasthenic crisis','auto'),
('Cholinergic crisis','Neuro, Eyes & Ears','ATI',51,'Cholinergic crisis','auto'),
('Acromegaly','Endocrine, Metabolic & Acid-Base','Unit 9 - Endocrine',3,'Acromegaly','next'),
('Systole','Cardiovascular','Unit 8 - Cardiac',2,'Systole','auto'),
('Diastole','Cardiovascular','Unit 8 - Cardiac',2,'Diastole','auto'),
('Diverticulum','GI & Nutrition','Unit 7 - GI',13,'Diverticulum','auto'),
('Diverticulosis','GI & Nutrition','Unit 7 - GI',13,'Diverticulosis','auto'),
('Diverticulitis','GI & Nutrition','Unit 7 - GI',13,'Diverticulitis –','auto'),
('Steatorrhea','GI & Nutrition','Unit 7 - GI',24,'Steatorrhea','auto'),
('Cirrhosis','GI & Nutrition','Unit 7 - GI',31,'Cirrhosis','next'),
('Hepatitis','GI & Nutrition','Unit 7 - GI',30,'Hepatitis','next'),
('Oliguria','Renal & Urinary','Unit 7 - Renal',7,'Urine output less than 400mL/day','whole'),
('Anemia','Blood & Immune','Unit 8 - Hematology',4,'Anemia','next'),
('Erythropoiesis','Blood & Immune','Unit 8 - Hematology',2,'Erythropoiesis','auto'),
('Erythropoietin','Blood & Immune','Unit 8 - Hematology',2,'Erythropoietin','auto'),
('Medical asepsis','Infection Control','Unit 1 - Safety',5,'(medical asepsis)','next'),
('Surgical asepsis','Infection Control','Unit 1 - Safety',5,'(surgical asepsis)','next'),
('Contusion','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',3,'CONTUSION','auto'),
('Sprain','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',3,'SPRAIN','auto'),
('Strain','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',3,'STRAIN','auto'),
('Fracture','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',6,'FRACTURES','next'),
('Traction','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',13,'Traction','next'),
('Osteoarthritis','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',20,'Osteoarthritis','next'),
('Rheumatoid arthritis','Musculoskeletal & Skin','Unit 11/12 - Musculoskeletal',18,'Inflammation of connective tissue','whole'),
('Serous drainage','Musculoskeletal & Skin','ATI',17,'Serous drainage','auto'),
('Sanguineous drainage','Musculoskeletal & Skin','ATI',17,'Sanguineous drainage','auto'),
('Serosanguineous drainage','Musculoskeletal & Skin','ATI',17,'Serosanguineous drainage','auto'),
('Purosanguineous drainage','Musculoskeletal & Skin','ATI',17,'Purosanguineous','auto'),
('Para','Maternal-Newborn','Unit 5 - OB',8,'Para:','auto'),
('Primipara','Maternal-Newborn','Unit 5 - OB',8,'Primipara','auto'),
('Abortion','Maternal-Newborn','Unit 5 - OB',8,'Abortions','auto'),
('Hegar sign','Maternal-Newborn','ATI',64,"Hegar's sign",'auto'),
('Goodell sign','Maternal-Newborn','ATI',64,"Goodell's sign:",'auto'),
('Chadwick sign','Maternal-Newborn','ATI',64,"Chadwick's sign",'auto'),
('Lochia alba','Maternal-Newborn','ATI',70,'Alba','auto'),
('Contraction frequency','Maternal-Newborn','ATI',67,'Frequency','auto'),
('Apgar score','Maternal-Newborn','ATI',71,'APGAR:','auto'),
('Macula','Neuro, Eyes & Ears','ATI',71,'Macula','auto'),
('Spina bifida occulta','Pediatrics','ATI',84,'Spina bifida occulta','auto'),
('Closed neural tube defect','Pediatrics','ATI',84,'Closed neural tube defect','auto'),
('Meningocele','Pediatrics','ATI',84,'Meningocele','auto'),
('Meningomyelocele','Pediatrics','ATI',84,'Meningomyelocele','auto'),
('Kernig sign','Procedures & Tests','ATI',84,"Kernig's:",'auto'),
('Brudzinski sign','Procedures & Tests','ATI',84,"Brudzinski's:",'auto'),
('Rovsing sign','Procedures & Tests','ATI',34,"Rovsing's sign",'auto'),
('Tinel sign','Procedures & Tests','Unit 11/12 - Musculoskeletal',5,"Tinel's Sign",'next'),
('ELISA','Procedures & Tests','ATI',36,'ELISA','auto'),
('Western blot','Procedures & Tests','ATI',36,'Western blot','auto'),
('Schilling test','Procedures & Tests','ATI',37,'Schilling test','auto'),
('Compensation','Mental Health','ATI',92,'Compensation','auto'),
('Projection','Mental Health','ATI',92,'Projection','auto'),
('Reaction formation','Mental Health','ATI',92,'Reaction formation','auto'),
('Sublimation','Mental Health','ATI',92,'Sublimation','auto'),
('Intellectualization','Mental Health','ATI',92,'Intellectualization','auto'),
('Confabulation','Mental Health','ATI',93,'Confabulation','auto'),
('Akathisia','Mental Health','ATI',99,'Akathisia','auto'),
('Dystonia','Mental Health','ATI',99,'Dystonia','auto'),
('Active listening','Mental Health','ATI',91,'Active listening','auto'),
('Closed-ended questions','Mental Health','ATI',91,'Closed-ended questions','auto'),
('Clarifying techniques','Mental Health','ATI',91,'Clarifying techniques','auto'),
('Advance directive','Safety, Legal & Management','Unit 2 - Management',5,'Advance Directives','next'),
('Capacity','Safety, Legal & Management','ATI',11,'Capacity','auto'),
('Structure audits','Safety, Legal & Management','ATI',21,'Structure Audits','auto'),
('Process audits','Safety, Legal & Management','ATI',21,'Process Audits','auto'),
('Outcome audits','Safety, Legal & Management','ATI',21,'Outcome Audits','auto'),
('Dorsal recumbent position','Body Position, Movement & Direction','ATI',60,'Dorsal recumbent:','auto'),
]
BUL=re.compile(r'^[●○•▪\-–]\s*')
def norm(s):return re.sub(r'\s+',' ',s.replace('’',"'").replace(' ',' ')).strip()
decks={};P=[]
for f in sorted(glob.glob(os.path.join(ROOT,'data','seed','*','deck.json'))):
    d=json.load(open(f))
    if 'syllabus' in d['id']:continue
    nm=re.sub(r'Galen\s+(Live Review-RN|System Focused Review)\s*-\s*','',d['name']);nm=re.sub(r'\s+Student$','',nm)
    pdf=d.get('kind')=='pdf'
    for s in d['slides']:P.append({'deck':d['id'],'nm':'ATI' if pdf else nm,'pdf':pdf,'n':s['n'],'lines':s['text']})
def locate(prefix,n,key):
    for p in P:
        if p['nm'].startswith(prefix) and p['n']==n:
            for i,l in enumerate(p['lines']):
                if key.lower() in norm(l).lower():return p,i
    raise SystemExit(f'NOT FOUND: {prefix} {n} {key!r}')
def definition(p,i,term_key,mode):
    L=p['lines'];line=norm(BUL.sub('',norm(L[i])))
    if mode=='next':
        d=norm(BUL.sub('',L[i+1])) if i+1<len(L) else ''
    elif mode=='whole':
        d=line
    else:
        m=re.search(re.escape(norm(term_key)),line,re.I);rest=line[m.end():] if m else line
        rest=re.sub(r'^\s*(?:\([^)]*\)\s*)?',lambda x:x.group(0) if x.group(0).strip().startswith('(') and False else '',rest) if False else rest
        rest=re.sub(r'^[\s:–—\-]+','',rest).strip()
        if rest.startswith('(') :                                       # Term (definition)
            rest=rest[1:];rest=rest[:-1] if rest.endswith(')') else rest;rest=rest.rstrip(').')
        d=rest
        if p['pdf'] and d and not re.search(r'[.)!?]$',d):                # PDF text wraps: join continuation lines
            for k in range(i+1,min(i+3,len(L))):
                nxt=norm(L[k])
                if not nxt or BUL.match(L[k].strip()) or re.match(r'^[A-Z][\w\' \-/]{1,30}:',nxt) :break
                d=d+' '+nxt
                if re.search(r'[.)!?]$',nxt):break
    d=norm(d)
    if d:d=d[0].upper()+d[1:]
    if d and d[-1] not in '.!?)':d+='.'
    return d
def build(show=False):
    terms={};
    for term,cat,pre,n,key,mode in M:
        p,i=locate(pre,n,key);d=definition(p,i,key,mode)
        if len(d)<12:
            if show:print(f"!! {term:26} [{pre[:12]} {n}] got {d!r}  from line: {norm(p['lines'][i])[:100]!r}");continue
            raise SystemExit(f'bad definition for {term}: {d!r}')
        terms[term.lower()]={'t':term,'d':d,'c':cat,'m':{'d':p['deck'],'n':n,'k':'page' if p['pdf'] else 'slide','s':'ATI study guide' if p['pdf'] else p['nm'],'l':norm(p['lines'][i])[:300]}}
        if show:print(f"{term:28} [{pre[:14]} {n}] {d}")
    cats=list(G.keys());gen=0
    for cat,body in G.items():
        for line in body.strip().splitlines():
            t,d=[x.strip() for x in line.split(' | ',1)]
            if t.lower() in terms:continue
            terms[t.lower()]={'t':t,'d':d,'c':cat};gen+=1
    for t in terms.values():assert t['c'] in cats,(t['t'],t['c'])
    out=sorted(terms.values(),key=lambda x:x['t'].lower().lstrip('-'))
    data={'cats':cats,'terms':out}
    open(os.path.join(ROOT,'data','glossary.js'),'w').write('window.GLOSSARY='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';')
    print(len(out),'terms:',sum(1 for t in out if 'm' in t),'from class materials,',gen,'general reference |',os.path.getsize(os.path.join(ROOT,'data','glossary.js'))//1024,'KB')
if __name__=='__main__':build('--show' in sys.argv)
