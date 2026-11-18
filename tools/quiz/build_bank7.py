"""Builds tools/bank/bank7.json (the "Weekly quizzes" question group) from:
  quiz_unique.json  - the end-of-week quiz questions exactly as supplied (252 unique multiple-choice questions
                      from 13 quiz versions; repeated copies merged; matching / fill-in / image items are not included)
  checks.json       - for each question, whether the answer was checked against the class PowerPoints, and where
Question and option wording is copied verbatim. The ATI guide and syllabus are NOT used for checking.
Run from anywhere:  python3 tools/quiz/build_bank7.py"""
import json,glob,os,re
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
U=json.load(open(os.path.join(HERE,'quiz_unique.json')));CK=json.load(open(os.path.join(HERE,'checks.json')))
LABEL={'1':'Unit 1','2':'Unit 2','3':'Unit 3','4A':'Unit 4 (A)','4B':'Unit 4 (B)','5A':'Unit 5 (A)','5B':'Unit 5 (B)','5C':'Unit 5 (C)','6':'Unit 6','7':'Unit 7','8':'Unit 8','9':'Unit 9','10':'Unit 10'}
ORDER=list(LABEL)
# ---- class PowerPoints only (library decks, not the ATI guide or syllabus)
P=[]
for f in sorted(glob.glob(os.path.join(ROOT,'data','seed','*','deck.json'))):
    d=json.load(open(f))
    if d['id'].startswith('ati-') or 'syllabus' in d['id']:continue
    nm=re.sub(r'Galen\s+(Live Review-RN|System Focused Review)\s*-\s*','',d['name']);nm=re.sub(r'\s+Student$','',nm)
    for s in d['slides']:P.append((nm,s['n'],s['text']))
def find(prefix,n,sub):
    prefix=re.sub(r'\s+Student$','',prefix)
    for nm,sn,ls in P:
        if nm.startswith(prefix) and (n is None or sn==n):
            for l in ls:
                if sub.lower() in l.lower():return nm,sn,l.strip()
    raise SystemExit(f'citation not found: {prefix} {n} {sub}')
# ---- topic fallback (only used where a question was not given one)
T=[('IC',r'isolation|precaution|hand hygiene|infection control|sterile|PPE\b|contaminat'),
   ('MN',r'pregnan|labor\b|prenatal|postpartum|fetal|fetus|GTPAL|gravida|abortion|breast.?feed|lochia|prenatal'),
   ('PE',r'\bchild\b|children|infant|toddler|pediatric|adolescent|school-age|preschool|newborn|baby'),
   ('MH',r'psych|anxiety|depress|schizo|suicid|grief|defense mechanism|bipolar|substance|therapeutic communication|abus|mania|delusion|hallucinat|seclusion|restraint'),
   ('EN',r'diabet|insulin|thyroid|adrenal|cushing|addison|glucose|parathyroid|pituitary|hormone'),
   ('CV',r'heart|cardiac|angina|myocardial|hypertension|blood pressure|ECG|EKG|aort|digoxin|arrhythm|tachycardia|vascular'),
   ('RS',r'oxygen|respirat|lung|asthma|pneumonia|ABG|breath|sputum|chest|thoracentesis|ventilat'),
   ('RF',r'renal|kidney|urine|urinary|potassium|sodium|calcium|electrolyte|dialysis|acid-base|acidosis|alkalosis'),
   ('GI',r'bowel|gastric|\bGI\b|liver|cirrhosis|pancrea|abdominal|diarrhea|constipation|nutrition|diet|enema|ulcer|esophag|colon|ostomy'),
   ('NE',r'neuro|stroke|seizure|spinal|intracranial|Parkinson|brain|fracture|traction|cane|crutch|walker|bone|joint|muscle|vision|eye|hearing'),
   ('BT',r'burn|trauma|shock|emergency|disaster|triage'),
   ('LE',r'delegat|consent|legal|ethic|document|advance directive|UAP|LPN|assign|supervis|scope of practice|HIPAA|record'),
   ('HP',r'Maslow|health promotion|screening|immuniz|older adult|growth|developmental|wellness|nutrition'),
   ('PH',r'medication|drug|dose|prescrib|side effect|adverse|mg\b|antibiotic|therapy')]
def topic(u):
    t=CK[str(u['id'])].get('topic')
    if t:return t
    txt=u['stem']+' '+' '.join(o['t'] for o in u['opts'])
    for code,rx in T:
        if re.search(rx,txt,re.I):return code
    return {'1':'IC','2':'PD','3':'MH','4A':'SK','4B':'SK','5A':'MN','5B':'PE','5C':'PE','6':'RS','7':'GI','8':'CV','9':'EN','10':'NE'}.get(u['unit'],'PD')
def letters(ix):return ', '.join(chr(65+i) for i in ix)
out=[]
for u in sorted(U,key=lambda u:(ORDER.index(u['unit']),u['n'])):
    ck=CK[str(u['id'])];opts=u['opts'];yes=u['yes']
    q=u['stem'].strip();o=[x['t'].strip() for x in opts]
    a=yes[0] if len(yes)==1 else yes
    sh=lambda s:s if len(s)<=90 else s[:87]+'…'
    key='\n'.join(f"• {o[i]}" for i in yes)
    src='(This answer is keyed in the original quiz source.)' if u['atype']=='SOURCE' else '(This answer was inferred when the master guide was put together; it is not keyed in the original quiz source.)'
    parts=[f"Weekly quiz key ({'select all' if len(yes)>1 else 'one answer'}):\n{key}\n{src}"]
    notes=[f"• “{sh(o[i])}” – {opts[i]['why']}" for i in yes if opts[i]['why']]
    if notes:parts.append("Study notes from your master guide (not official Galen rationales):\n"+'\n'.join(notes))
    wrong=[f"• “{sh(o[i])}” – {opts[i]['why']}" for i in range(len(opts)) if i not in yes and opts[i]['why']]
    if wrong:parts.append("Not correct:\n"+'\n'.join(wrong))
    ev=[]
    for pre,n,sub in ck['cites']:
        nm,sn,line=find(pre,n,sub);ev.append(f"• {nm}, slide {sn}: “{line}”")
    st=ck['status']
    if st=='ok':
        parts.append("✔ Checked against your PowerPoints:\n"+'\n'.join(ev)+(("\n"+ck['note']) if ck['note'] else ''))
    elif st=='conflict':
        alt='; '.join(f"“{sh(o[i])}”" for i in ck['alt'])
        parts.append("⚠ Your PowerPoints disagree with this quiz key.\n• The quiz key is shown above ("+('source-backed' if u['atype']=='SOURCE' else 'inferred')+f").\n• Your PowerPoints also support: {alt}\n"+'\n'.join(ev)+"\n"+ck['note'])
    elif st=='differs':
        parts.append("⚠ One detail differs from your PowerPoints.\n"+'\n'.join(ev)+"\n"+ck['note'])
    else:
        parts.append("Not covered in your class PowerPoints, so this answer comes from the quiz file only.")
    also=[LABEL[x.split('#')[0]] for x in u['also']]
    if also:parts.append("Also appears in the weekly quiz for: "+', '.join(dict.fromkeys(also))+'.')
    out.append({'src':'Weekly quiz – '+LABEL[u['unit']],'t':topic(u),'q':q,'o':o,'a':a,'r':'\n\n'.join(parts)})
json.dump(out,open(os.path.join(ROOT,'tools','bank','bank7.json'),'w'),ensure_ascii=False,indent=1)
import collections
print(len(out),'weekly quiz questions;',dict(collections.Counter(c['status'] for c in CK.values())))
print('topics:',dict(collections.Counter(x['t'] for x in out)))
