// Hover hints for abbreviations: hover over an abbreviation anywhere in the app to see what it stands for.
// Works on any text that appears in the window (questions, slides, medications, AI answers). Turn it off in Settings.
(function(root){
const A={
 // --- routes, orders, units
 IV:'Intravenous (into a vein)',IM:'Intramuscular (into a muscle)',PO:'By mouth (per os)',SL:'Sublingual (under the tongue)',SQ:'Subcutaneous (under the skin)',SubQ:'Subcutaneous (under the skin)',
 PR:'By rectum (also: the PR interval on an ECG)',PRN:'As needed',STAT:'Immediately',NPO:'Nothing by mouth (nil per os)',BID:'Twice a day',TID:'Three times a day',QID:'Four times a day',AC:'Before meals',PC:'After meals',HS:'At bedtime (hour of sleep)',
 KVO:'Keep vein open (a slow IV rate)',PCA:'Patient-controlled analgesia',NG:'Nasogastric (tube from the nose to the stomach)',TPN:'Total parenteral nutrition (IV feeding of all nutrients)',PPN:'Peripheral parenteral nutrition',PEG:'Percutaneous endoscopic gastrostomy (feeding tube into the stomach; also: polyethylene glycol)',
 'I&O':'Intake and output',OTC:'Over the counter',ETOH:'Ethyl alcohol (alcohol)',ASA:'Acetylsalicylic acid (aspirin)',NS:'Normal saline (0.9% sodium chloride)',NSS:'Normal saline solution (0.9% sodium chloride)',NaCl:'Sodium chloride (salt)',LR:'Lactated Ringer solution',D5W:'5% dextrose in water',D50:'50% dextrose (concentrated sugar solution)',IVF:'IV fluids (also: in vitro fertilization)',IVIG:'Intravenous immune globulin',
 PRBC:'Packed red blood cells',VAC:'Vacuum-assisted closure (negative-pressure wound therapy)',PPE:'Personal protective equipment',
 // --- vital signs, assessment
 BP:'Blood pressure',HR:'Heart rate',RR:'Respiratory rate',VS:'Vital signs',TPR:'Temperature, pulse, respirations',SpO2:'Oxygen saturation measured by pulse oximeter',O2:'Oxygen',CO2:'Carbon dioxide',H2O:'Water',FiO2:'Fraction of inspired oxygen (the percent of oxygen being delivered)',NC:'Nasal cannula (oxygen tubing in the nose)',CPAP:'Continuous positive airway pressure',PEEP:'Positive end-expiratory pressure',
 SBP:'Systolic blood pressure',DBP:'Diastolic blood pressure',CVP:'Central venous pressure',ICP:'Intracranial pressure',IICP:'Increased intracranial pressure',CPP:'Cerebral perfusion pressure',IOP:'Intraocular pressure',LOC:'Level of consciousness',DTR:'Deep tendon reflex',CN:'Cranial nerve',ROM:'Range of motion',HOB:'Head of the bed',SOB:'Shortness of breath',UOP:'Urine output',BMI:'Body mass index',SG:'Specific gravity',JVD:'Jugular vein distention',PMI:'Point of maximal impulse (where the heartbeat is felt strongest)',
 FHR:'Fetal heart rate',EFM:'Electronic fetal monitoring',IUPC:'Intrauterine pressure catheter',LMP:'Last menstrual period',EDD:'Estimated due date',APGAR:'Newborn score: Appearance, Pulse, Grimace, Activity, Respiration',REEDA:'Wound check after birth: Redness, Edema, Ecchymosis, Discharge, Approximation',BSE:'Breast self-exam',TBSA:'Total body surface area',
 // --- labs and tests
 CBC:'Complete blood count',WBC:'White blood cell (count)',RBC:'Red blood cell (count)',HGB:'Hemoglobin',HCT:'Hematocrit',ANC:'Absolute neutrophil count',INR:'International normalized ratio (a clotting test, used for warfarin)',PT:'Prothrombin time (a clotting test; also: physical therapy)',PTT:'Partial thromboplastin time (a clotting test)',aPTT:'Activated partial thromboplastin time (a clotting test, used for heparin)',ACT:'Activated clotting time',
 BUN:'Blood urea nitrogen (a kidney test)',GFR:'Glomerular filtration rate (how well the kidneys filter)',ALT:'Alanine aminotransferase (a liver enzyme)',AST:'Aspartate aminotransferase (a liver enzyme)',ALP:'Alkaline phosphatase (a liver and bone enzyme)',CK:'Creatine kinase (muscle enzyme)',A1C:'Hemoglobin A1C (average blood sugar over about 3 months)',HbA1c:'Hemoglobin A1C (average blood sugar over about 3 months)',
 ABG:'Arterial blood gas',PaCO2:'Partial pressure of carbon dioxide in arterial blood',PaO2:'Partial pressure of oxygen in arterial blood',HCO3:'Bicarbonate',LDL:'Low-density lipoprotein ("bad" cholesterol)',HDL:'High-density lipoprotein ("good" cholesterol)',VLDL:'Very-low-density lipoprotein',ESR:'Erythrocyte sedimentation rate (a marker of inflammation)',ANA:'Antinuclear antibody',TSH:'Thyroid-stimulating hormone',T3:'Triiodothyronine (thyroid hormone)',T4:'Thyroxine (thyroid hormone)',PTH:'Parathyroid hormone',ACTH:'Adrenocorticotropic hormone',ADH:'Antidiuretic hormone',HCG:'Human chorionic gonadotropin (pregnancy hormone)',PSA:'Prostate-specific antigen',
 CD4:'CD4 T-helper cell count (a marker of immune strength in HIV)',PPD:'Purified protein derivative (the TB skin test)',VDRL:'Venereal Disease Research Laboratory test (screens for syphilis)',RPR:'Rapid plasma reagin (screens for syphilis)',EDTA:'Ethylenediaminetetraacetic acid (a chelating agent, also a blood-tube additive)',
 ECG:'Electrocardiogram',EKG:'Electrocardiogram',EEG:'Electroencephalogram',CT:'Computed tomography (CT scan)',MRI:'Magnetic resonance imaging',CXR:'Chest x-ray',EGD:'Esophagogastroduodenoscopy (scope of the upper digestive tract)',UGI:'Upper gastrointestinal (series or tract)',ERCP:'Endoscopic retrograde cholangiopancreatography',CSF:'Cerebrospinal fluid',
 QRS:'QRS complex on the ECG (ventricles contracting)',QT:'QT interval on the ECG (time for the ventricles to contract and recover)',ST:'ST segment on the ECG',AV:'Atrioventricular (between the atria and ventricles)',SA:'Sinoatrial (the heart\'s natural pacemaker, SA node)',
 // --- conditions
 HTN:'Hypertension (high blood pressure)',MI:'Myocardial infarction (heart attack)',AMI:'Acute myocardial infarction (heart attack)',HF:'Heart failure',CAD:'Coronary artery disease',CHD:'Coronary heart disease',CVA:'Cerebrovascular accident (stroke; also: costovertebral angle)',TIA:'Transient ischemic attack (a "mini-stroke")',PCI:'Percutaneous coronary intervention (such as a stent)',PTCA:'Percutaneous transluminal coronary angioplasty',CABG:'Coronary artery bypass graft',
 DVT:'Deep vein thrombosis (a clot in a deep vein)',PE:'Pulmonary embolism (a clot in the lung; also: physical exam)',VTE:'Venous thromboembolism (DVT or PE)',DIC:'Disseminated intravascular coagulation (widespread clotting and bleeding)',HIT:'Heparin-induced thrombocytopenia',
 AF:'Atrial fibrillation',SVT:'Supraventricular tachycardia',PSVT:'Paroxysmal supraventricular tachycardia',VT:'Ventricular tachycardia (also: tidal volume)',VF:'Ventricular fibrillation',PVC:'Premature ventricular contraction',SR:'Sinus rhythm (also: sustained release)',
 COPD:'Chronic obstructive pulmonary disease',TB:'Tuberculosis',RSV:'Respiratory syncytial virus',ARDS:'Acute respiratory distress syndrome',
 GERD:'Gastroesophageal reflux disease',PUD:'Peptic ulcer disease',GI:'Gastrointestinal',UTI:'Urinary tract infection',BPH:'Benign prostatic hyperplasia (enlarged prostate)',TURP:'Transurethral resection of the prostate',AKI:'Acute kidney injury',CKD:'Chronic kidney disease',ESRD:'End-stage renal disease',PD:'Peritoneal dialysis (also: Parkinson disease)',
 DM:'Diabetes mellitus',DKA:'Diabetic ketoacidosis',HHS:'Hyperosmolar hyperglycemic state',DI:'Diabetes insipidus',SIADH:'Syndrome of inappropriate antidiuretic hormone',PKU:'Phenylketonuria',
 HIV:'Human immunodeficiency virus',AIDS:'Acquired immunodeficiency syndrome',CMV:'Cytomegalovirus',HSV:'Herpes simplex virus',HPV:'Human papillomavirus',STI:'Sexually transmitted infection',PID:'Pelvic inflammatory disease',MRSA:'Methicillin-resistant Staphylococcus aureus',MSSA:'Methicillin-susceptible Staphylococcus aureus',VRE:'Vancomycin-resistant enterococcus',MDR:'Multidrug-resistant',MDRO:'Multidrug-resistant organism',
 SCI:'Spinal cord injury',ALS:'Amyotrophic lateral sclerosis (also: advanced life support)',MS:'Multiple sclerosis (also: morphine sulfate or mitral stenosis; "MS" is on the Joint Commission do-not-use list)',SLE:'Systemic lupus erythematosus',RA:'Rheumatoid arthritis (also: room air)',OA:'Osteoarthritis',PTSD:'Post-traumatic stress disorder',ADHD:'Attention-deficit/hyperactivity disorder',OCD:'Obsessive-compulsive disorder',ECT:'Electroconvulsive therapy',SIDS:'Sudden infant death syndrome',CF:'Cystic fibrosis',TORCH:'Infections that can harm a fetus: Toxoplasmosis, Other, Rubella, Cytomegalovirus, Herpes',HA:'Headache',
 // --- drugs and drug classes
 NSAID:'Nonsteroidal anti-inflammatory drug',SSRI:'Selective serotonin reuptake inhibitor',MAOI:'Monoamine oxidase inhibitor',MAO:'Monoamine oxidase',ARB:'Angiotensin II receptor blocker',ACE:'Angiotensin-converting enzyme',COX:'Cyclooxygenase (the enzyme NSAIDs block)',GABA:'Gamma-aminobutyric acid (a calming brain chemical)',NMDA:'N-methyl-D-aspartate (a glutamate receptor in the brain)',PDE5:'Phosphodiesterase type 5',GLP:'Glucagon-like peptide (as in GLP-1)',DPP:'Dipeptidyl peptidase (as in DPP-4)',SERM:'Selective estrogen receptor modulator',TNF:'Tumor necrosis factor',DOAC:'Direct oral anticoagulant',HMG:'3-hydroxy-3-methylglutaryl (as in HMG-CoA reductase)',CoA:'Coenzyme A',ADP:'Adenosine diphosphate',H1:'Histamine-1 (receptor)',H2:'Histamine-2 (receptor)',EPS:'Extrapyramidal symptoms (abnormal movements from some drugs)',ICS:'Inhaled corticosteroid',NPH:'Neutral protamine Hagedorn (an intermediate-acting insulin)',NTG:'Nitroglycerin',PTU:'Propylthiouracil',INH:'Isoniazid',HCTZ:'Hydrochlorothiazide',G6PD:'Glucose-6-phosphate dehydrogenase (an enzyme; deficiency raises the risk of hemolysis)',MOM:'Milk of magnesia',NANDA:'NANDA International (nursing diagnoses)',
 B12:'Vitamin B12 (cobalamin)',B6:'Vitamin B6 (pyridoxine)',FE:'Iron (chemical symbol Fe)',
 // --- vaccines
 MMR:'Measles, mumps, rubella vaccine',DTaP:'Diphtheria, tetanus and acellular pertussis vaccine (children)',Tdap:'Tetanus, diphtheria and acellular pertussis vaccine (adolescents and adults)',DTP:'Diphtheria, tetanus and pertussis vaccine',IPV:'Inactivated poliovirus vaccine',HiB:'Haemophilus influenzae type b vaccine',HepA:'Hepatitis A (vaccine)',HepB:'Hepatitis B (vaccine)',MCV4:'Meningococcal conjugate vaccine (4 types)',PCV:'Pneumococcal conjugate vaccine',VIS:'Vaccine information statement',RhoGAM:'Rho(D) immune globulin (brand name)',
 // --- nursing and school
 RN:'Registered nurse',LPN:'Licensed practical nurse',LVN:'Licensed vocational nurse',UAP:'Unlicensed assistive personnel (such as a nursing assistant)',PHCP:'Primary health care provider',HCP:'Health care provider',PCP:'Primary care provider (also: Pneumocystis pneumonia)',MD:'Doctor of medicine (physician)',OT:'Occupational therapy (or therapist)',
 NCLEX:'National Council Licensure Examination (the nursing licensing exam)',NGN:'Next Generation NCLEX (the newer question formats)',ATI:'Assessment Technologies Institute (ATI Nursing Education)',PSLO:'Program student learning outcome (a Galen course objective tag)',
 ISBARR:'Communication tool: Identify, Situation, Background, Assessment, Recommendation, Read-back',SBAR:'Communication tool: Situation, Background, Assessment, Recommendation',ABC:'Airway, breathing, circulation (the priority order)',CAB:'Circulation, airway, breathing (CPR order)',RACE:'Fire response: Rescue, Alarm, Confine, Extinguish',DABDA:'Stages of grief: Denial, Anger, Bargaining, Depression, Acceptance',BRAT:'Bland diet: Bananas, Rice, Applesauce, Toast',
 CPR:'Cardiopulmonary resuscitation',AMA:'Against medical advice (also: American Medical Association)',HIPAA:'Health Insurance Portability and Accountability Act (patient privacy law)',CDC:'Centers for Disease Control and Prevention',CMS:'Centers for Medicare and Medicaid Services',EHR:'Electronic health record',CPOE:'Computerized provider order entry',QI:'Quality improvement',ID:'Identification (also: intradermal; infectious disease)',
 // --- places, devices, procedures
 ED:'Emergency department (also: erectile dysfunction)',ICU:'Intensive care unit',CCU:'Coronary care unit',PACU:'Post-anesthesia care unit',OB:'Obstetrics',PEDS:'Pediatrics',
 PICC:'Peripherally inserted central catheter',CVC:'Central venous catheter',CVL:'Central venous line',SVC:'Superior vena cava',JP:'Jackson-Pratt (a surgical drain)',CBI:'Continuous bladder irrigation',ICD:'Implantable cardioverter-defibrillator',TENS:'Transcutaneous electrical nerve stimulation',CPM:'Continuous passive motion (machine)',ECCE:'Extracapsular cataract extraction',RV:'Right ventricle (also: residual volume)',CO:'Cardiac output (also: carbon monoxide)',CV:'Cardiovascular',
 N95:'N95 respirator mask (filters at least 95% of airborne particles)',
 // --- misc
 DNA:'Deoxyribonucleic acid',RNA:'Ribonucleic acid',ABO:'The ABO blood group system',BPM:'Beats per minute',LUQ:'Left upper quadrant',RUQ:'Right upper quadrant',LLQ:'Left lower quadrant',RLQ:'Right lower quadrant',AKA:'Also known as (also: above-knee amputation)',
 ADL:'Activity of daily living',ADLs:'Activities of daily living'
};
let on=true;try{on=localStorage.getItem('nd_abbr')!=='0'}catch(e){}
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
let RX=null;
function build(){const keys=Object.keys(A).sort((a,b)=>b.length-a.length);RX=new RegExp('(?<![A-Za-z0-9_&])('+keys.map(esc).join('|')+')(s)?(?![A-Za-z0-9])','g')}
build();
// Splits text into [{t:'plain'},{t:'abbr',x:'IV',m:'Intravenous'}] pieces; also used by the tests.
function split(text){
  const out=[];let last=0;RX.lastIndex=0;let m;
  while((m=RX.exec(text))){
    const key=m[1],plural=m[2]||'';let meaning=A[key];
    if(!meaning||(plural&&!/^[A-Z0-9]/.test(key)))continue;
    if(m.index>last)out.push({t:'plain',x:text.slice(last,m.index)});
    out.push({t:'abbr',x:m[0],m:meaning+(plural?' (plural)':'')});last=m.index+m[0].length;
  }
  if(last<text.length)out.push({t:'plain',x:text.slice(last)});
  return out;
}
if(typeof module!=='undefined'&&module.exports){module.exports={ABBR:A,split};return}
// ---------- browser part
const doc=document,SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','OPTION','ABBR','CODE','PRE','TITLE']);
const seen=new WeakSet();
function wrapText(node){
  if(seen.has(node))return;seen.add(node);
  const v=node.nodeValue;if(!v||v.length<2||!/[A-Z]/.test(v))return;
  const p=node.parentElement;if(!p||SKIP.has(p.tagName)||p.closest('.noabbr,#abtip,abbr.ab,[contenteditable=true]'))return;
  const parts=split(v);if(parts.length===1&&parts[0].t==='plain')return;
  const f=doc.createDocumentFragment();
  for(const q of parts){if(q.t==='plain'){const t=doc.createTextNode(q.x);seen.add(t);f.appendChild(t)}else{const a=doc.createElement('abbr');a.className='ab';a.dataset.m=q.m;a.textContent=q.x;f.appendChild(a)}}
  node.parentNode.replaceChild(f,node);
}
function scan(root){
  if(!on||!root)return;
  if(root.nodeType===3){wrapText(root);return}
  if(root.nodeType!==1||SKIP.has(root.tagName)||root.classList.contains('ab'))return;
  const w=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;return(!p||SKIP.has(p.tagName)||seen.has(n))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
  const list=[];let n;while((n=w.nextNode()))list.push(n);
  list.forEach(wrapText);
}
function unwrapAll(){doc.querySelectorAll('abbr.ab').forEach(a=>{const t=doc.createTextNode(a.textContent);a.replaceWith(t)})}
let queue=new Set(),timer=null;
function flush(){timer=null;const q=[...queue];queue=new Set();q.forEach(n=>{if(n.isConnected)scan(n)})}
const mo=new MutationObserver(ms=>{
  if(!on)return;
  for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType===1&&(n.classList.contains('ab')||n.id==='abtip'))return;queue.add(n)});
  if(!timer)timer=setTimeout(flush,40);
});
// tooltip
let tip=null;
function showTip(a,x,y){
  if(!tip){tip=doc.createElement('div');tip.id='abtip';doc.body.appendChild(tip)}
  tip.textContent=a.dataset.m;tip.style.display='block';
  const r=a.getBoundingClientRect(),w=tip.offsetWidth;let left=Math.min(Math.max(8,r.left),window.innerWidth-w-8);
  const top=r.top>tip.offsetHeight+16?r.top-tip.offsetHeight-6:r.bottom+6;
  tip.style.left=left+'px';tip.style.top=top+'px';
}
doc.addEventListener('mouseover',e=>{const a=e.target.closest&&e.target.closest('abbr.ab');if(a)showTip(a)});
doc.addEventListener('mouseout',e=>{const a=e.target.closest&&e.target.closest('abbr.ab');if(a&&tip)tip.style.display='none'});
doc.addEventListener('scroll',()=>{if(tip)tip.style.display='none'},true);
// merge extra abbreviations from the glossary (short all-caps terms), without overriding the list above
function mergeGlossary(){
  try{const G=window.GLOSSARY;if(!G)return;let changed=false;
    G.terms.forEach(t=>{if(/Abbreviations/.test(t.c)&&/^[A-Za-z0-9&]{2,6}$/.test(t.t)&&!A[t.t]){A[t.t]=t.d.replace(/\.$/,'');changed=true}});
    if(changed)build();}catch(e){}
}
window.abbrEnabled=()=>on;
window.abbrSet=v=>{on=!!v;try{localStorage.setItem('nd_abbr',on?'1':'0')}catch(e){}if(on){scan(doc.body)}else{unwrapAll()}};
mergeGlossary();
mo.observe(doc.body,{childList:true,subtree:true});
if(on)setTimeout(()=>scan(doc.body),0);
})(typeof window!=='undefined'?window:globalThis);
