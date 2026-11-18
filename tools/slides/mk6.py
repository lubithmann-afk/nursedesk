"""Builds tools/bank/bank6.json from the question slides that are already inside the Unit 6-12
system-focused review decks (data/seed/*). Question and option wording is copied verbatim from the deck
JSON; this file only supplies which slide, the answer key and a short rationale. The decks do not
include answer keys, so every entry is flagged as "worked out with NCLEX reasoning".
Not included: the two matrix-style NGN slides (Renal slide 16, Burns slide 7); the quiz screen only
supports single-answer and select-all questions.
Run from anywhere:  python3 tools/slides/mk6.py"""
import json,glob,os,re
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
OUT=os.path.join(HERE,'..','bank','bank6.json')
DERIVED="(Answer key not on the slide; worked out with NCLEX reasoning, so check it against your class notes.)"
def deck(key):
    f=[p for p in glob.glob(os.path.join(ROOT,'data','seed','nur-283-285-unit-*','deck.json')) if key in p and 'live-review' not in p]
    assert len(f)==1,(key,f);return json.load(open(f[0]))
def clean(o):return re.sub(r'^\d\.\s*','',o)   # drop "1." numbering on one slide; the app adds A-D letters
out=[]
def Q(key,label,n,t,a,r,note=''):
    s=next(x for x in deck(key)['slides'] if x['n']==n)
    paras=[p for p in s['text'] if not p.startswith('NGN NCLEX-RN')]
    q,opts=paras[0],[clean(o) for o in paras[1:]]
    assert isinstance(a,int) and a<len(opts) or all(i<len(opts) for i in a),(label,n)
    out.append({'src':'Class slides – '+label,'t':t,'q':q,'o':opts,'a':a,
      'r':r.strip()+"\n\n(From your class slides: "+label+", slide "+str(n)+".)\n"+DERIVED+(" "+note if note else '')})

Q('respiratory','Respiratory',27,'PH',[0,2],
 "Correct:\n• “Remind the client to monitor for hearing changes.” – Streptomycin is an aminoglycoside and can damage the 8th cranial nerve (hearing and balance).\n• “Advise the client to take over-the-counter acetaminophen…” – Acetaminophen is the safer choice for fever and headache; NSAIDs add kidney risk to an aminoglycoside.\n\nNot correct:\n• Black stool is not an expected effect of streptomycin.\n• Follow-up visits are still needed after treatment (TB therapy is long and monitored).\n• Streptomycin can increase the effect of anesthesia and muscle relaxants, so the client should tell the provider rather than simply continue it before procedures.",
 "The acetaminophen option is the least certain part of this key.")
Q('gi-student','GI',32,'GI',[0,1,3],
 "Correct:\n• Therapeutic touch and total body relaxation are accepted non-drug adjuncts for post-operative pain.\n• The newly returned post-operative client is seen first (airway, vital signs, bleeding) before the client at 12 hours who wants pain medication.\n\nNot correct: The nursing process is not linear; it is continuous and cyclical, so assessment and evaluation keep repeating.",
 "The therapeutic touch option is the least certain part of this key.")
Q('gi-student','GI',33,'GI',[0,2],
 "Correct: TPN is for clients who cannot use the GI tract (for example paralytic ileus or severe diarrhea) and can supplement protein, electrolytes and glucose.\n\nNot correct:\n• Tube feeding through a gastrostomy or nasogastric tube is enteral nutrition; TPN is given by IV.\n• Long-term TPN is given through a central line in concentrated dextrose solutions; 5% dextrose supplies too few calories.")
Q('cardiac','Cardiac',46,'CV',3,
 "Correct: A lower-calorie heart-healthy eating pattern such as the Mediterranean diet supports weight loss, which lowers blood pressure.\n\nNot correct:\n• Sodium should be limited to about 2 g a day, not 3300 mg (class slide 5).\n• Aerobic exercise should be increased; 1 hour a week is too little.\n• Alcohol should be limited; 3 drinks a day is too many.")
Q('hematology','Hematology',14,'SK',[0,1,2,4],
 "Correct: Take baseline vital signs, use a large-bore (18-gauge) IV, prime the tubing with 0.9% sodium chloride only, and verify the blood product and expiration with a second licensed nurse.\n\nNot correct: A unit of PRBCs should be completed within 4 hours of leaving the blood bank; 6 hours is too long.")
Q('endocrine','Endocrine',8,'EN',1,
 "Correct: Diabetes insipidus causes very large volumes of dilute urine (2–20 L a day), so measuring intake and output is essential, along with daily weights.\n\nNot correct: A Foley is not routinely needed, and blood glucose is not the problem; diabetes insipidus is unrelated to diabetes mellitus.")
Q('endocrine','Endocrine',9,'EN',1,
 "Correct: In SIADH the body retains water, so neck vein distention is a sign of fluid overload.\n\nNot correct: Weight loss, lower blood pressure and increased urine output are not expected with water retention (SIADH gives low urine output, weight gain and low serum sodium).")
Q('endocrine','Endocrine',17,'EN',2,
 "Correct: Cushing's syndrome causes truncal obesity (with thin arms and legs), a rounded face, hypertension, muscle wasting and carbohydrate intolerance.\n\nNot correct: Hypotension is seen in Addison's disease; thick, coarse skin in hypothyroidism; and the extremities are thin, not heavy, in Cushing's.")
Q('endocrine','Endocrine',22,'EN',0,
 "Correct: Prolonged hyperglycemia damages the small vessels of the retina (diabetic retinopathy) and can change the lens, impairing vision. Good glucose control protects the eyes.\n\nNot correct: Insulin injections do not cause vision problems; lens opacity (cataract) and corneal dryness are not the effect of high blood glucose being taught here.")
Q('endocrine','Endocrine',23,'EN',3,
 "Correct: The hemoglobin A1C reflects average glucose control over about 90–120 days (roughly 3 months), the life span of red blood cells.\n\nNot correct: The shorter time frames are too short.")
Q('endocrine','Endocrine',25,'EN',3,
 "Correct: A pheochromocytoma releases excess catecholamines, causing hypertension (176/88 mm Hg), tachycardia, headache, sweating and anxiety.\n\nNot correct: Constricted pupils and bradycardia are the opposite effects, and a glucose of 130 mg/dL is not a key finding.")
Q('endocrine','Endocrine',26,'PH',[1,3],
 "Correct:\n• “You will need to discontinue the medication for any procedure that requires a contrast agent.” – Metformin is held around contrast because of kidney injury and lactic acidosis risk.\n• “You need to carry emergency identification and a glucagon kit…” – the likely intended second answer for this select-two item.\n\nNot correct:\n• Extended-release tablets must be swallowed whole, never chewed.\n• The empty tablet shell can appear in the stool and is harmless; there is no need to call.",
 "The glucagon-kit option is the least certain part of this key (metformin alone rarely causes low blood sugar).")
Q('neurological','Neurological',80,'NE',0,
 "Correct: A new hearing-aid user needs the nurse to check that the client can handle and adjust the devices (dexterity) and has realistic expectations.\n\nNot correct:\n• Speak at eye level, face to face, not above it.\n• Use a normal, lower-pitched tone; loud, high-pitched speech is harder to understand and can be distorted.\n• Glasses can be worn with hearing aids, and the client does not need to remove them.")
Q('musculosk','Musculoskeletal',22,'NE',[0,3,4],
 "Correct:\n• Pin sites are cleaned with an antiseptic such as chlorhexidine, using aseptic technique.\n• The metal frame holds the fracture steady while it heals.\n• Increasing pressure and pain, for example around the heel, may signal compartment syndrome and must be reported.\n\nNot correct:\n• Vitamin D (and calcium) helps bone healing, so it should not be limited.\n• Redness at the pin sites should be reported as a possible infection rather than accepted as normal.",
 "The pin-site redness item is the least certain part of this key.")
if __name__=='__main__':
    json.dump(out,open(OUT,'w'),ensure_ascii=False,indent=1);print(len(out),'questions ->',os.path.relpath(OUT,ROOT))
