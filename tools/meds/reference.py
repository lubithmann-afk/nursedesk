"""General reference content (NOT from the student's class materials) for the Medications tab.
Standard NCLEX-level pharmacology, written by the app author. No doses. Items separated by '|'.
R[class] = {cl, moa, admin, se, labs, nsg};  D[drug name] = same keys, shown after the class items."""
R={}
def C(name,cl,moa,admin,se,labs,nsg):
    R[name]=dict(cl=cl,moa=moa,admin=admin,se=se,labs=labs,nsg=nsg)
D={}
def X(name,**kw):D[name]=kw

C('ACE inhibitors','Antihypertensive; also used in heart failure and after MI (name ends in -pril).',
 'Block the enzyme that makes angiotensin II, so less vasoconstriction and less aldosterone (less sodium and water retention).',
 'Give at the same time each day; first dose may cause sudden low BP, so have the client sit or lie down.|Hold and report if pregnant, or if BP is low.',
 'Dry cough (most common)|First-dose hypotension|Hyperkalemia|Angioedema (emergency: airway)|Fetal harm',
 'Potassium|Creatinine and BUN|Blood pressure and heart rate|Urine protein',
 'Monitor BP before each dose.|Teach to rise slowly, avoid potassium supplements and salt substitutes.|Report swelling of lips, tongue or face and a persistent cough.|Not for use in pregnancy.')
C('Beta blockers','Antihypertensive, antianginal and antiarrhythmic (name ends in -olol).',
 'Block beta receptors, so slower heart rate, less contractility and less renin release; lowers BP and oxygen demand.',
 'Check apical pulse and BP before every dose; hold and report for bradycardia or low BP per order or policy.|Do not stop suddenly.',
 'Bradycardia|Hypotension|Fatigue and dizziness|Bronchospasm (nonselective ones)|Masks signs of hypoglycemia|Heart failure may worsen',
 'Heart rate and blood pressure|Blood glucose in diabetics|ECG if ordered',
 'Take apical pulse for one full minute.|Teach never to stop abruptly (rebound tachycardia, hypertension, angina).|Use caution in asthma, COPD and diabetes.|Teach to rise slowly.')
C('Calcium channel blockers','Antihypertensive, antianginal and antiarrhythmic (-dipine, diltiazem, verapamil).',
 'Block calcium entry into heart and vascular smooth muscle: vasodilation, and (diltiazem, verapamil) slower heart rate and conduction.',
 'Check BP and pulse before giving.|Extended-release tablets must not be crushed.|Avoid grapefruit juice.',
 'Hypotension and dizziness|Peripheral edema|Reflex tachycardia (dihydropyridines)|Bradycardia and AV block (verapamil, diltiazem)|Constipation (verapamil)|Gingival hyperplasia',
 'Blood pressure and heart rate|ECG (PR interval) with verapamil or diltiazem|Liver function with long-term use',
 'Hold and report for low BP or bradycardia per order.|Teach to rise slowly and avoid grapefruit juice.|Encourage fiber and fluids for constipation.|Weigh and check for ankle swelling.')
C('Thiazide diuretics','Diuretic for hypertension and mild edema (hydrochlorothiazide, chlorthalidone).',
 'Block sodium and chloride reabsorption in the distal tubule, so more water, sodium and potassium are excreted.',
 'Give in the morning to avoid nighttime urination.|May be taken with food.',
 'Hypokalemia|Hyponatremia|Hyperglycemia|Hyperuricemia (gout)|Hypercalcemia|Sun sensitivity|Dehydration and hypotension',
 'Potassium, sodium|Blood glucose|Uric acid and calcium|BUN and creatinine',
 'Monitor intake and output, daily weight and BP.|Teach potassium-rich foods unless told otherwise.|Teach sun protection and slow position changes.|Use caution with sulfa allergy.')
C('Loop diuretics','Strong diuretic for edema, heart failure and kidney disease (furosemide, bumetanide).',
 'Block sodium and chloride reabsorption in the loop of Henle, causing a large loss of water and electrolytes.',
 'Give IV push slowly; fast push can cause hearing loss.|Give oral doses in the morning.',
 'Hypokalemia|Hyponatremia, hypomagnesemia, hypocalcemia|Dehydration and hypotension|Ototoxicity (tinnitus, hearing loss)|Hyperglycemia and hyperuricemia',
 'Potassium, sodium, magnesium|BUN and creatinine|Daily weight, intake and output',
 'Weigh daily; expect weight loss as fluid leaves.|Monitor BP and signs of dehydration.|Report ringing in the ears.|Teach potassium-rich foods and slow position changes.|Watch digoxin clients closely (low potassium raises toxicity risk).')
C('Potassium-sparing diuretics','Mild diuretic that keeps potassium (spironolactone); used in heart failure and hyperaldosteronism.',
 'Block aldosterone in the distal tubule, so sodium and water are lost but potassium is kept.',
 'Give with food.|Do not give with potassium supplements or ACE inhibitors unless ordered.',
 'Hyperkalemia|Hyponatremia|Gynecomastia and menstrual changes (spironolactone)|Dehydration',
 'Potassium (high risk)|Sodium|BUN and creatinine',
 'Teach to avoid salt substitutes and potassium-rich food overload.|Monitor ECG changes for hyperkalemia (peaked T waves).|Monitor BP and intake and output.')
C('Osmotic and other diuretics','Diuretics used for brain pressure, eye pressure or altitude illness (mannitol, acetazolamide).',
 'Mannitol pulls water into the vessels and urine; acetazolamide blocks carbonic anhydrase, so bicarbonate and water are excreted.',
 'Mannitol: give IV with a filter if crystals are present; do not give with signs of heart failure or pulmonary edema.|Acetazolamide: give with food; avoid in sulfa allergy.',
 'Fluid and electrolyte imbalance|Headache, nausea|Metabolic acidosis (acetazolamide)|Pulmonary edema (mannitol)|Tingling in fingers (acetazolamide)',
 'Electrolytes|BUN and creatinine|Intake and output',
 'Monitor urine output hourly and neurologic status.|Monitor for fluid overload and electrolyte imbalance.|Watch intraocular or intracranial pressure changes.')
C('Nitrates and vasodilators','Antianginal or antihypertensive vasodilators (nitroglycerin, hydralazine, nitroprusside).',
 'Relax vascular smooth muscle: nitrates dilate veins (less preload) and coronary arteries; hydralazine and nitroprusside dilate arterioles.',
 'Sublingual nitroglycerin: sit down, dissolve under the tongue, up to 3 doses 5 minutes apart; call 911 if pain is not relieved after the first dose.|Store in the original dark glass bottle.|Remove the patch for a nitrate-free period per order.|Nitroprusside: protect from light, give by pump, never push.',
 'Headache|Hypotension and dizziness|Reflex tachycardia|Flushing|Cyanide toxicity (nitroprusside)|Lupus-like syndrome (hydralazine)',
 'Blood pressure (continuous with nitroprusside)|Cyanide and thiocyanate levels with prolonged nitroprusside|ANA with long-term hydralazine',
 'Check BP before each dose.|Never give with phosphodiesterase inhibitors (sildenafil).|Teach to rise slowly and keep tablets in the original container.|Monitor arterial BP continuously with nitroprusside.')
C('Adrenergic inhibitors (central and alpha)','Antihypertensives that lower sympathetic tone (clonidine, methyldopa, -zosin drugs).',
 'Clonidine and methyldopa act in the brain to reduce sympathetic outflow; prazosin and doxazosin block alpha-1 receptors, relaxing vessels.',
 'First dose of alpha blockers: give at bedtime and have the client lie down.|Do not stop clonidine suddenly.',
 'Orthostatic hypotension and first-dose syncope|Drowsiness and dry mouth|Rebound hypertension if stopped suddenly (clonidine)|Sodium and water retention|Positive Coombs test (methyldopa)',
 'Blood pressure lying and standing|Weight and edema|CBC and liver tests (methyldopa)',
 'Teach to change positions slowly.|Never stop clonidine abruptly.|Teach sugarless gum or sips for dry mouth.|Check BP in lying and standing positions.')
C('Cardiac glycosides','Inotrope for heart failure and some atrial dysrhythmias (digoxin).',
 'Strengthens the heartbeat (positive inotrope), slows the heart rate and conduction through the AV node.',
 'Take the apical pulse for one full minute before each dose; hold and report if the pulse is below 60 (adult) or below the limit for children.|Check potassium level first.',
 'Toxicity: anorexia, nausea, vomiting|Visual changes (blurred, yellow-green halos)|Bradycardia and dysrhythmias|Confusion and fatigue',
 'Digoxin level (therapeutic 0.5-2 ng/mL)|Potassium (low potassium raises toxicity risk)|Magnesium and calcium|Creatinine (excreted by kidneys)',
 'Check apical pulse and hold if below 60.|Know the antidote: digoxin immune fab.|Report nausea, vomiting and visual changes.|Teach to take at the same time daily and not to double doses.')
C('Antiarrhythmics','Drugs that restore or maintain a normal heart rhythm (amiodarone, lidocaine, adenosine, quinidine).',
 'Alter the electrical activity of the heart: slow conduction, lengthen the refractory period or block channels.',
 'Adenosine: rapid IV push followed by a saline flush, with continuous ECG.|Amiodarone: use a filter and a central line when possible; continuous ECG.|Lidocaine: continuous ECG monitoring.',
 'New or worsened dysrhythmias|Hypotension and bradycardia|Amiodarone: pulmonary toxicity, thyroid and liver problems, photosensitivity, corneal deposits|Lidocaine: confusion, seizures|Quinidine: diarrhea, cinchonism',
 'Continuous ECG|Liver, thyroid and chest x-ray for amiodarone|Potassium and magnesium|Drug levels where ordered',
 'Monitor ECG and BP continuously during IV therapy.|Have emergency equipment ready.|Teach sun protection and report cough or shortness of breath (amiodarone).|Correct potassium and magnesium before use.')
C('Vasopressors and inotropes','Emergency IV drugs to raise BP and cardiac output (dopamine, epinephrine, norepinephrine).',
 'Stimulate adrenergic receptors: increase heart rate and contractility and constrict vessels.',
 'Give by infusion pump through a large vein; titrate to the ordered BP.|Never stop abruptly.',
 'Tachycardia and dysrhythmias|Hypertension|Chest pain|Tissue necrosis if the drug leaks out of the vein (extravasation)',
 'Continuous ECG and BP|Urine output|Peripheral perfusion',
 'Watch the IV site closely; extravasation antidote is phentolamine.|Monitor intake and output and limb color.|Taper off per order, not abruptly.')
C('Lipid-lowering drugs','Lower cholesterol (statins end in -statin).',
 'Statins block the liver enzyme that makes cholesterol (HMG-CoA reductase), lowering LDL.',
 'Most statins are taken in the evening because the liver makes most cholesterol at night.|Avoid grapefruit juice.',
 'Muscle pain and rhabdomyolysis|Liver damage|Headache and GI upset|Fetal harm',
 'Lipid panel|Liver enzymes (AST/ALT)|CK if muscle pain|Pregnancy status',
 'Teach to report unexplained muscle pain, weakness or dark urine.|Teach diet and exercise.|Not for use in pregnancy.')
C('Other cardiac drugs','Cardiovascular or vascular drug not in another group (sildenafil).',
 'Sildenafil blocks phosphodiesterase-5, increasing nitric oxide effect and vasodilation.',
 'Never give with nitrates.',
 'Headache|Flushing|Hypotension|Vision changes|Priapism',
 'Blood pressure',
 'Ask about nitrate use before giving.|Teach to seek care for an erection lasting over four hours.')
C('Anticoagulants','Prevent clot formation and extension (heparin, enoxaparin, warfarin).',
 'Heparin and enoxaparin activate antithrombin, blocking clotting factors; warfarin blocks vitamin K-dependent clotting factors.',
 'Heparin: IV or subcutaneous; do not aspirate or massage the site.|Enoxaparin: subcutaneous in the abdomen, do not expel the air bubble.|Warfarin: oral, same time daily.',
 'Bleeding (the major risk)|Heparin-induced thrombocytopenia|Bruising|Warfarin: skin necrosis, fetal harm|Osteoporosis with long-term heparin',
 'Heparin: aPTT (goal usually 1.5-2.5 times normal), platelets|Warfarin: PT/INR (usual goal 2-3)|CBC, hemoglobin, hematocrit',
 'Assess for bleeding (gums, urine, stool, bruising).|Know the antidotes: protamine sulfate for heparin, vitamin K for warfarin.|Teach a consistent intake of vitamin K foods and no new drugs or herbs without asking.|Use a soft toothbrush and an electric razor; avoid IM injections.')
C('Antiplatelets','Prevent platelet clumping (aspirin, clopidogrel, dipyridamole, cilostazol).',
 'Aspirin blocks thromboxane A2; clopidogrel and ticlopidine block the ADP receptor; dipyridamole and cilostazol reduce platelet aggregation and dilate vessels.',
 'Give aspirin with food; use enteric-coated forms for GI protection.|Do not crush extended-release forms.',
 'Bleeding and bruising|GI upset and ulcers|Aspirin: tinnitus, Reye syndrome in children|Ticlopidine: low white cells and platelets|Cilostazol: headache; avoid in heart failure',
 'CBC and platelets|Bleeding times as ordered|Liver enzymes',
 'Assess for bleeding and black stools.|Hold before surgery per provider.|Teach to avoid NSAIDs and alcohol.|Do not give aspirin to children with viral illness.')
C('Thrombolytics','Clot-busting drug for MI, stroke and pulmonary embolism (alteplase).',
 'Converts plasminogen to plasmin, which dissolves the clot.',
 'Give within the time window after symptoms start.|Check contraindications first (recent bleeding, surgery, stroke, uncontrolled BP).',
 'Bleeding, including intracranial|Reperfusion dysrhythmias|Allergic reaction',
 'Coagulation tests, CBC and fibrinogen|Neurologic status|ECG',
 'Monitor vital signs and neuro checks often.|Avoid needle sticks and invasive procedures where possible.|Have aminocaproic acid available for severe bleeding.|Apply pressure to puncture sites.')
C('Iron, vitamins and blood-building drugs','Drugs that treat anemia or low blood counts (iron, B12, folic acid, epoetin, filgrastim).',
 'Iron supplies hemoglobin; B12 and folic acid are needed for red cell making; epoetin stimulates red cell production; filgrastim stimulates white cell production.',
 'Oral iron: give with vitamin C, on an empty stomach if tolerated; use a straw for liquid iron.|IM iron: use the Z-track method.|B12: injection or nasal for pernicious anemia.',
 'Iron: constipation, dark stools, GI upset|Epoetin: hypertension, clots|Filgrastim: bone pain|Injection-site reactions',
 'Hemoglobin and hematocrit|Reticulocyte count|Iron, ferritin|Blood pressure with epoetin|White cell count with filgrastim',
 'Teach dark stools are expected with iron.|Increase fluids and fiber.|Keep iron away from children (overdose risk).|Monitor BP with epoetin.')
C('Hemostatics','Stops excess bleeding (aminocaproic acid).',
 'Blocks the breakdown of fibrin clots (antifibrinolytic).',
 'Give by slow IV or orally; monitor for clotting.',
 'Clots|Hypotension|Dizziness, GI upset|Muscle weakness',
 'Coagulation tests|CK if muscle pain|Renal function',
 'Monitor for thrombosis (leg swelling, chest pain).|Monitor urine output.')
C('Beta2 agonists (bronchodilators)','Relieve or prevent bronchospasm (albuterol, salmeterol, terbutaline).',
 'Stimulate beta-2 receptors in the lungs, relaxing bronchial smooth muscle.',
 'Rescue (short-acting) inhaler for quick relief; long-acting salmeterol is not for acute attacks.|Wait about a minute between puffs; use a spacer.|Give the bronchodilator before an inhaled corticosteroid.',
 'Tachycardia and palpitations|Tremor|Nervousness|Hypokalemia|Paradoxical bronchospasm',
 'Heart rate and rhythm|Lung sounds, respiratory rate and oxygen saturation|Potassium with high use',
 'Assess breath sounds before and after.|Teach correct inhaler technique and mouth rinsing.|Report chest pain or worsening breathing.|Monitor heart rate.')
C('Anticholinergic bronchodilators','Bronchodilator for COPD (ipratropium).',
 'Blocks acetylcholine at muscarinic receptors, which relaxes the airways and dries secretions.',
 'Inhaled; teach technique and to avoid getting spray in the eyes.|Not for acute rescue by itself.',
 'Dry mouth|Cough|Urinary retention|Blurred vision|Tachycardia',
 'Respiratory status and oxygen saturation',
 'Use caution with glaucoma and prostate enlargement.|Teach sips of water for dry mouth.')
C('Xanthines','Bronchodilators with a narrow safety range (theophylline, aminophylline).',
 'Relax bronchial smooth muscle by inhibiting phosphodiesterase.',
 'Give with a full glass of water; do not crush extended release.|Avoid large amounts of caffeine.',
 'Tachycardia and dysrhythmias|Nausea and vomiting|Nervousness, insomnia, seizures with toxicity',
 'Serum theophylline level (therapeutic about 10-20 mcg/mL)|Heart rate',
 'Smoking speeds clearance and many drugs change levels.|Report nausea, vomiting, palpitations and tremor.|Monitor levels closely.')
C('Leukotriene modifiers and mast cell stabilizers','Long-term asthma controllers (montelukast, cromolyn).',
 'Montelukast blocks leukotriene receptors; cromolyn stops mast cells from releasing histamine.',
 'Daily maintenance, not for acute attacks.|Montelukast is taken in the evening.',
 'Headache|GI upset|Montelukast: mood changes and suicidal thoughts|Cromolyn: throat irritation and cough',
 'Respiratory status|Mood and behavior',
 'Teach that these do not treat an acute attack.|Report mood changes or agitation with montelukast.')
C('Mucolytics, expectorants and cough drugs','Loosen mucus and ease cough (guaifenesin).',
 'Thins and loosens secretions so they can be coughed up.',
 'Give with a full glass of water.',
 'Nausea and GI upset|Drowsiness|Dizziness',
 'Respiratory status and sputum',
 'Encourage fluids.|Report cough lasting more than a week.')
C('Antihistamines','Treat allergy symptoms, itching, nausea or anxiety (diphenhydramine, hydroxyzine).',
 'Block H1 histamine receptors.',
 'Give at bedtime if sedation is a problem; can be given IV or IM in emergencies.',
 'Sedation|Dry mouth|Urinary retention|Blurred vision|Confusion in older adults',
 'Mental status and urinary output',
 'Teach to avoid driving and alcohol.|Use caution in older adults, glaucoma and prostate enlargement.|Give sips or sugarless candy for dry mouth.')
C('Insulins','Lower blood glucose in diabetes (rapid, short, intermediate, long-acting).',
 'Moves glucose into cells and decreases glucose made by the liver.',
 'Know onset, peak and duration of each type.|Only regular insulin may be given IV.|Draw clear (regular) before cloudy (NPH).|Rotate subcutaneous sites; never mix glargine or detemir with others.|Give rapid-acting with meals.',
 'Hypoglycemia (the main danger)|Weight gain|Lipodystrophy at injection sites|Hypokalemia',
 'Blood glucose before meals and bedtime|A1C (goal usually under 7%)|Potassium',
 'Hypoglycemia signs: shakiness, sweating, confusion; treat with 15 g fast sugar and recheck in 15 minutes.|Do not skip meals after rapid-acting insulin.|Teach sick-day rules and site rotation.|Check the order and the label carefully; insulin is a high-alert drug.')
C('Oral and non-insulin diabetes drugs','Lower blood glucose in type 2 diabetes (metformin).',
 'Metformin decreases glucose made by the liver and improves insulin sensitivity.',
 'Give with meals.|Hold before contrast dye, surgery or for acute illness per order.',
 'GI upset and diarrhea|Lactic acidosis (rare, serious)|B12 deficiency',
 'Blood glucose and A1C|Creatinine and eGFR|B12',
 'Teach to report muscle pain, trouble breathing or severe weakness.|Avoid heavy alcohol use.|Hold per order for contrast dye.')
C('Thyroid drugs','Replace thyroid hormone or reduce its production (levothyroxine, methimazole, PTU, Lugol).',
 'Levothyroxine replaces thyroid hormone; methimazole and PTU block hormone synthesis; Lugol iodine reduces release before surgery.',
 'Levothyroxine: give in the morning on an empty stomach, 30 to 60 minutes before breakfast.|Antithyroid drugs: give evenly spaced; PTU is used in pregnancy first trimester.',
 'Levothyroxine: tachycardia, anxiety, weight loss, insomnia (too much)|Antithyroids: agranulocytosis, rash, liver injury|Iodine: metallic taste, swelling of salivary glands',
 'TSH, T3 and T4|WBC and liver tests with antithyroids|Heart rate',
 'Teach lifelong therapy for levothyroxine.|Report sore throat and fever with antithyroids.|Take apical pulse before levothyroxine in cardiac clients.|Dilute Lugol solution and give through a straw.')
C('Pituitary and hormone drugs','Hormones used for diabetes insipidus or low glucose (vasopressin, desmopressin, glucagon).',
 'Vasopressin and desmopressin replace antidiuretic hormone so the kidneys keep water; glucagon raises blood sugar by releasing liver glucose.',
 'Glucagon: IM or subcutaneous for severe hypoglycemia; give food after the client wakes.|Desmopressin: intranasal or by mouth.',
 'Vasopressin: hypertension, water intoxication, abdominal cramps|Desmopressin: headache, hyponatremia|Glucagon: nausea and vomiting',
 'Sodium and serum osmolality|Urine output and specific gravity|Blood glucose after glucagon',
 'Monitor intake and output and daily weight.|Watch for water intoxication and low sodium.|Place an unconscious client on the side after glucagon.')
C('Corticosteroids','Anti-inflammatory and immunosuppressive hormones (prednisone, dexamethasone, hydrocortisone, fluticasone).',
 'Mimic cortisol: reduce inflammation and immune activity, and affect glucose and salt balance.',
 'Give oral doses with food, in the morning.|Do not stop suddenly after long use.|Inhaled steroids: rinse the mouth afterward.',
 'Hyperglycemia|Infection and slowed wound healing|Fluid retention and hypertension|Hypokalemia|Mood changes, insomnia|Osteoporosis|Cushing signs with long-term use|Adrenal suppression',
 'Blood glucose|Potassium|Blood pressure and weight|WBC (infection)|Bone density with long-term use',
 'Teach never to stop abruptly (adrenal crisis).|Teach infection signs and a high-protein, high-potassium, low-sodium diet.|Weigh regularly.|Avoid live vaccines in immunosuppressed clients.|Taper per order.')
C('Bone and calcium drugs','Treat or prevent osteoporosis (alendronate, calcitonin).',
 'Alendronate slows bone breakdown by osteoclasts; calcitonin lowers blood calcium and slows bone loss.',
 'Alendronate: take first thing in the morning with a full glass of plain water, stay upright for 30 minutes, nothing else to eat or drink for 30 minutes.',
 'Esophagitis and ulcers|Jaw osteonecrosis (rare)|Bone or muscle pain|Calcitonin: nasal irritation, flushing',
 'Calcium and vitamin D|Bone density',
 'Teach to remain upright after the dose.|Ensure adequate calcium and vitamin D intake.|Report trouble or pain with swallowing.')
C('Proton pump inhibitors','Reduce stomach acid for GERD and ulcers (-prazole).',
 'Block the acid pump (H+/K+ ATPase) in stomach cells.',
 'Give 30 to 60 minutes before the first meal.|Do not crush delayed-release capsules.',
 'Headache and diarrhea|Long-term: low magnesium, B12 deficiency, fractures, C. difficile risk',
 'Magnesium and B12 with long-term use|Signs of GI bleeding',
 'Teach to report black stools or severe stomach pain.|Use the lowest effective dose for the shortest time.')
C('H2 receptor antagonists','Reduce stomach acid (-tidine).',
 'Block H2 receptors on stomach cells, decreasing acid.',
 'Give with meals and at bedtime; separate from antacids by one hour.',
 'Confusion in older adults|Headache and dizziness|Cimetidine: many drug interactions and gynecomastia',
 'Creatinine (dose adjusted in kidney disease)|Signs of GI bleeding',
 'Teach to avoid smoking and irritating foods.|Watch confusion in older adults.')
C('Antacids and ulcer protectants','Protect or neutralize stomach acid (sucralfate, misoprostol, magnesium hydroxide).',
 'Sucralfate coats ulcers; misoprostol replaces protective prostaglandins; magnesium hydroxide neutralizes acid.',
 'Sucralfate: give on an empty stomach, separate from other drugs by two hours.|Misoprostol: never give in pregnancy.',
 'Sucralfate: constipation|Misoprostol: diarrhea, cramps, miscarriage|Magnesium antacids: diarrhea, high magnesium in kidney disease',
 'Magnesium in kidney disease|Pregnancy status for misoprostol',
 'Teach to report black stools.|Antacids may reduce absorption of other drugs.')
C('Antiemetics and gastric motility drugs','Prevent or treat nausea and vomiting (ondansetron, metoclopramide).',
 'Ondansetron blocks serotonin 5-HT3 receptors; metoclopramide blocks dopamine and speeds stomach emptying.',
 'Give before chemotherapy or meals as ordered.|Metoclopramide: give 30 minutes before meals.',
 'Headache and constipation (ondansetron)|QT prolongation|Metoclopramide: drowsiness, restlessness, extrapyramidal effects and tardive dyskinesia',
 'ECG (QT interval)|Electrolytes|Neurologic signs with metoclopramide',
 'Monitor for abnormal movements with metoclopramide.|Avoid metoclopramide with bowel obstruction.|Monitor hydration.')
C('Laxatives and bowel preparations','Treat constipation or clean the bowel (docusate, bisacodyl, psyllium, lactulose, PEG, mineral oil).',
 'Stool softeners add water to stool; stimulants speed bowel movement; bulk formers add volume; osmotics draw water into the bowel; lactulose also traps ammonia.',
 'Bulk formers: mix with a full glass of water and drink right away.|Give lactulose with juice if desired.|Do not use if there is a bowel obstruction or undiagnosed abdominal pain.',
 'Cramping, diarrhea|Dehydration and electrolyte loss|Dependence with stimulant overuse|Mineral oil: aspiration risk and lowered vitamin absorption',
 'Electrolytes with bowel preparations|Ammonia level with lactulose',
 'Increase fluids, fiber and activity.|Monitor stool pattern.|Lactulose in hepatic encephalopathy: expect 2 to 3 soft stools daily.')
C('Antidiarrheals','Reduce diarrhea (loperamide, diphenoxylate with atropine).',
 'Slow intestinal movement.',
 'Hold with suspected infection or fever, and with bloody stools.',
 'Constipation|Drowsiness|Atropine effects: dry mouth, tachycardia',
 'Fluid and electrolyte status|Stool character',
 'Monitor hydration and stool.|Avoid in infectious colitis.|Controlled substance: safe storage.')
C('Inflammatory bowel and biliary drugs','Treat gallstones, digestive deficiency or bowel inflammation (ursodiol, pancrelipase).',
 'Ursodiol dissolves cholesterol gallstones; pancrelipase replaces pancreatic enzymes.',
 'Pancrelipase: give with meals and snacks; do not crush or chew capsules.',
 'Ursodiol: diarrhea|Pancrelipase: abdominal discomfort, mouth irritation',
 'Liver tests (ursodiol)|Stool fat and weight (pancrelipase)',
 'Teach to take with food.|Monitor stool and weight.')
C('Potassium and electrolyte binders','Lowers high potassium (sodium polystyrene sulfonate).',
 'Exchanges sodium for potassium in the bowel so potassium is excreted in stool.',
 'Give by mouth or enema; give with a laxative as ordered.',
 'Hypokalemia|Constipation|Sodium retention|Hypocalcemia, hypomagnesemia',
 'Potassium|Sodium, calcium, magnesium|ECG',
 'Monitor the ECG and stool.|Monitor for fluid overload.')
C('Penicillins','Beta-lactam antibiotics (-cillin).',
 'Stop bacteria from building cell walls, killing them.',
 'Ask about allergy before the first dose; observe for 30 minutes after.|Give oral doses on an empty stomach; space IV doses evenly.',
 'Allergic reaction and anaphylaxis|Diarrhea|C. difficile infection|Rash',
 'Culture and sensitivity before starting|Renal function|CBC with long-term use',
 'Have epinephrine ready.|Teach to finish the whole course.|Report rash, hives or trouble breathing and severe diarrhea.')
C('Cephalosporins','Beta-lactam antibiotics (cef-); some cross-reactivity with penicillin allergy.',
 'Block bacterial cell wall synthesis.',
 'Check allergy history, including penicillin.|Avoid alcohol with some agents (disulfiram-like reaction).',
 'Allergic reaction|Diarrhea and C. difficile|Bleeding risk|Phlebitis',
 'Culture and sensitivity|Renal function|PT/INR with some agents',
 'Observe for allergic reaction.|Teach to finish the course.|Monitor for severe diarrhea.')
C('Aminoglycosides','Strong antibiotics for serious gram-negative infections (gentamicin, tobramycin, streptomycin).',
 'Bind bacterial ribosomes and block protein making.',
 'Give IV over the ordered time; draw peak and trough levels at the correct times.|Keep the client well hydrated.',
 'Nephrotoxicity|Ototoxicity (hearing loss, tinnitus, vertigo)|Neuromuscular blockade',
 'Peak and trough levels|BUN and creatinine|Hearing assessment',
 'Monitor intake and output and creatinine.|Report ringing in the ears, dizziness or hearing change.|Encourage fluids.')
C('Macrolides','Antibiotics for respiratory and other infections (erythromycin, azithromycin).',
 'Bind bacterial ribosomes and stop protein making.',
 'Erythromycin: give with food if GI upset.|Azithromycin: may be taken with or without food.',
 'Nausea, vomiting and diarrhea|QT prolongation|Liver injury|Hearing loss with high IV doses',
 'Liver function|ECG in heart disease',
 'Report severe diarrhea, yellow skin or palpitations.|Many drug interactions.')
C('Fluoroquinolones','Broad antibiotics (-floxacin).',
 'Block bacterial DNA enzymes (gyrase).',
 'Give with fluids; separate from antacids, iron and dairy by two hours.',
 'Tendon rupture|Photosensitivity|QT prolongation|Confusion|Blood sugar changes|C. difficile infection',
 'Renal function|Blood glucose in diabetes',
 'Teach to stop and report tendon pain.|Teach sun protection.|Avoid in pregnancy and children unless essential.')
C('Tetracyclines','Antibiotics (tetracycline, doxycycline).',
 'Block bacterial protein making.',
 'Do not give with dairy, antacids or iron.|Take with a full glass of water and stay upright.',
 'Photosensitivity|Tooth discoloration in children and fetal harm|Esophagitis|Candidal overgrowth',
 'Liver and renal function',
 'Not for pregnancy or children under 8.|Teach sun protection.')
C('Sulfonamides','Antibacterial (sulfadiazine) and burn treatments (silver sulfadiazine, mafenide).',
 'Block folic acid making in bacteria.',
 'Give oral sulfonamides with plenty of fluids.|Silver sulfadiazine and mafenide are applied to burn wounds with sterile technique.',
 'Rash and Stevens-Johnson syndrome|Crystals in the urine|Bone marrow suppression|Mafenide: pain on application and acidosis',
 'CBC|Renal function|Acid-base status with mafenide',
 'Ask about sulfa allergy.|Encourage fluids.|Report rash and sore throat.')
C('Other antibiotics','Antibiotics from other groups (vancomycin, clindamycin, imipenem-cilastatin).',
 'Vancomycin blocks cell wall building; clindamycin blocks protein making; imipenem blocks cell wall building.',
 'Vancomycin: infuse slowly over at least an hour.|Clindamycin: take with a full glass of water.',
 'Vancomycin: red man syndrome, nephrotoxicity, ototoxicity|Clindamycin: severe diarrhea and C. difficile colitis|Imipenem: seizures',
 'Vancomycin trough, creatinine and BUN|Hearing|Stool character',
 'Slow the infusion for flushing or low BP.|Report watery diarrhea.')
C('Antitubercular drugs','Drugs for TB, always given in combination (isoniazid, rifampin, ethambutol, pyrazinamide).',
 'Kill or stop growth of Mycobacterium tuberculosis; multiple drugs prevent resistance.',
 'Take for the full long course; give isoniazid and rifampin on an empty stomach.|Directly observed therapy may be used.',
 'Isoniazid: hepatotoxicity, peripheral neuropathy|Rifampin: orange body fluids, liver injury|Ethambutol: optic neuritis|Pyrazinamide: hyperuricemia and liver injury',
 'Liver enzymes|Visual acuity and color vision with ethambutol|Uric acid with pyrazinamide|Sputum cultures',
 'Give pyridoxine (B6) with isoniazid.|Teach orange fluids and contact lens staining with rifampin.|Report jaundice and vision changes.|Teach adherence and no alcohol.')
C('Antivirals','Treat or prevent viral infections (acyclovir, zidovudine, HIV drugs, palivizumab).',
 'Block viral DNA or RNA making or other steps in viral replication.',
 'Acyclovir: give IV slowly with plenty of fluids.|HIV drugs: take exactly on schedule for life.',
 'Acyclovir: kidney injury, nausea|Zidovudine: bone marrow suppression|HIV drugs: GI upset, rash, fat changes',
 'CD4 count and viral load|CBC|Renal and liver function',
 'Stress adherence.|Encourage fluids.|Monitor blood counts.')
C('Antifungals','Treat fungal infections (nystatin).',
 'Binds fungal cell membranes.',
 'Nystatin: swish and swallow oral suspension; apply to skin as directed.',
 'Mild GI upset|Local irritation',
 'Culture as ordered',
 'Teach to continue until the full course is done.|Good oral hygiene.')
C('Antiparasitic and antimalarial drugs','Kill lice, scabies, malaria or treat lupus (permethrin, hydroxychloroquine).',
 'Permethrin paralyzes lice and mites; hydroxychloroquine interferes with parasite and immune activity.',
 'Permethrin: apply and rinse as directed.|Hydroxychloroquine: take with food.',
 'Permethrin: itching, redness|Hydroxychloroquine: retinal damage, GI upset',
 'Eye exams with hydroxychloroquine',
 'Wash linens and clothing in hot water for lice or scabies.|Teach to report vision changes.')
C('Urinary tract analgesic','Relieves urinary pain (phenazopyridine).',
 'Acts as a local pain reliever in the urinary tract.',
 'Give after meals.',
 'Orange-red urine|Headache|GI upset',
 'Renal function',
 'Teach that urine color change is expected and stains clothing.|It does not treat infection.')
C('Anticonvulsants','Prevent seizures (phenytoin, carbamazepine, valproic acid, phenobarbital).',
 'Reduce abnormal electrical firing in the brain.',
 'Do not stop suddenly.|Phenytoin IV: give slowly with saline, not dextrose.',
 'Drowsiness and dizziness|Phenytoin: gingival hyperplasia, nystagmus, ataxia|Carbamazepine: bone marrow suppression, rash|Valproic acid: liver injury, pancreatitis|Fetal harm',
 'Drug levels (phenytoin about 10-20 mcg/mL)|CBC and liver enzymes|Sodium with carbamazepine',
 'Seizure precautions.|Teach never to stop abruptly.|Good oral hygiene with phenytoin.|Report rash, easy bruising, jaundice.|Avoid alcohol.')
C('Parkinson disease drugs','Treat tremor and rigidity (levodopa-carbidopa, benztropine).',
 'Levodopa is changed to dopamine in the brain, carbidopa keeps it from breaking down early; benztropine blocks acetylcholine.',
 'Give levodopa-carbidopa consistently with respect to meals; high-protein meals can reduce effect.|Do not stop suddenly.',
 'Nausea|Orthostatic hypotension|Involuntary movements (dyskinesia)|Hallucinations|Benztropine: dry mouth, urinary retention, confusion',
 'Blood pressure|Mental status|Movement symptoms',
 'Teach slow position changes.|Report involuntary movements or hallucinations.|Urine and sweat may darken.')
C('Multiple sclerosis and ALS drugs','Disease-modifying drugs for MS (interferons, glatiramer) and ALS (riluzole).',
 'Reduce immune attack on nerve covering (MS drugs); riluzole reduces glutamate release.',
 'Interferon: rotate injection sites.|Riluzole: take on an empty stomach.',
 'Flu-like symptoms (interferon)|Injection-site reactions|Liver injury|Depression',
 'Liver enzymes|CBC',
 'Teach to give at bedtime with acetaminophen for flu-like symptoms (if ordered).|Monitor for depression.')
C('Myasthenia gravis and cholinesterase inhibitors','Improve muscle strength or memory (pyridostigmine, neostigmine, donepezil, rivastigmine, memantine).',
 'Block the enzyme that breaks down acetylcholine so more stays available; memantine blocks NMDA receptors.',
 'Give pyridostigmine on time, with food.|Edrophonium is a short-acting diagnostic test drug.',
 'Cholinergic crisis: salivation, diarrhea, bradycardia, bronchoconstriction|Nausea and vomiting|Slowed heart rate|Muscle weakness with overdose',
 'Heart rate|Respiratory status and muscle strength',
 'Have atropine available for cholinergic crisis.|Teach to take on schedule and report muscle weakness.|Monitor weight in dementia clients.')
C('Muscle relaxants','Relieve spasticity or muscle spasm (baclofen, dantrolene, tizanidine).',
 'Baclofen acts at the spinal cord; dantrolene acts on muscle; tizanidine acts centrally.',
 'Do not stop baclofen suddenly.|Dantrolene: also used for malignant hyperthermia.',
 'Drowsiness|Weakness|Dantrolene: liver injury|Tizanidine: low BP',
 'Liver tests with dantrolene|Blood pressure',
 'Teach to avoid alcohol and driving.|Withdrawal after abrupt baclofen stop can cause seizures.')
C('Anticholinergics and cholinergics','Drugs that block (atropine) or mimic (bethanechol, pilocarpine) acetylcholine.',
 'Atropine blocks muscarinic receptors; bethanechol and pilocarpine stimulate them.',
 'Atropine: used for bradycardia and to dry secretions.|Bethanechol: give on an empty stomach.',
 'Anticholinergic: dry mouth, urinary retention, tachycardia, constipation, blurred vision|Cholinergic: salivation, sweating, bradycardia, cramps',
 'Heart rate|Urine output',
 'Monitor urinary output and heart rate.|Use caution in glaucoma.')
C('Anesthetics and sedation','Local anesthetics (procaine, prilocaine) and a paralytic (succinylcholine).',
 'Local anesthetics block nerve conduction; succinylcholine blocks nerve signals at muscle.',
 'Local anesthetic with epinephrine must not be used on fingers, toes or nose.|Succinylcholine: only with airway control and ventilation.',
 'Local anesthetic: allergic reaction, toxicity (tingling, tinnitus, seizures)|Succinylcholine: malignant hyperthermia, hyperkalemia',
 'Respiratory status|Potassium with succinylcholine',
 'Have resuscitation equipment ready.|A client who is paralyzed is still awake and feels pain.')
C('Opioid analgesics','Treat moderate to severe pain (morphine, hydromorphone, fentanyl, oxycodone, hydrocodone, codeine, meperidine, methadone).',
 'Bind opioid receptors in the brain and spinal cord to reduce pain.',
 'Check respiratory rate and level of sedation before giving; hold and report for respiratory rate under 12 per order.|Controlled substance with witness for waste.|Give on a schedule for continuous pain.',
 'Respiratory depression (most serious)|Sedation|Constipation|Nausea and vomiting|Hypotension|Urinary retention|Dependence',
 'Respiratory rate and oxygen saturation|Sedation scale|Pain score|Bowel function|Renal function with meperidine and morphine',
 'Have naloxone available.|Start a bowel regimen.|Assess pain 30 to 60 minutes after dosing.|Teach no alcohol or other sedatives.|Meperidine is avoided in kidney disease and older adults.')
C('NSAIDs and salicylates','Pain, fever and inflammation (ibuprofen, naproxen, ketorolac, indomethacin, celecoxib, aspirin).',
 'Block cyclooxygenase (COX), so fewer prostaglandins.',
 'Give with food or milk.|Ketorolac: short-term use only.',
 'GI irritation and bleeding|Kidney injury|Fluid retention and hypertension|Increased cardiovascular risk|Bleeding tendency|Aspirin overdose: tinnitus',
 'BUN and creatinine|CBC|Blood pressure|Signs of GI bleeding',
 'Teach to report black stools.|Avoid with kidney disease, bleeding risk or aspirin allergy.|Do not combine NSAIDs.')
C('Acetaminophen','Pain and fever reliever without anti-inflammatory effect.',
 'Acts in the brain to reduce pain and fever.',
 'Know the daily maximum; check other products for hidden acetaminophen.',
 'Liver injury in overdose|Rare rash',
 'Liver enzymes (AST/ALT)|Acetaminophen level in overdose',
 'Antidote is acetylcysteine.|Teach to avoid alcohol and to count all sources.')
C('Gout drugs','Prevent or treat gout (allopurinol, colchicine).',
 'Allopurinol lowers uric acid production; colchicine reduces inflammation from urate crystals.',
 'Give allopurinol with food and plenty of fluids.|Colchicine for an acute attack: take at the first sign.',
 'Allopurinol: rash, Stevens-Johnson syndrome|Colchicine: diarrhea, nausea, bone marrow suppression',
 'Uric acid|CBC|Renal and liver function',
 'Encourage fluids.|Teach to avoid alcohol and high-purine foods.|Report rash immediately.')
C('Rheumatoid arthritis and immune drugs (DMARDs)','Slow disease in rheumatoid arthritis (methotrexate, etanercept, adalimumab).',
 'Suppress the immune system; etanercept and adalimumab block tumor necrosis factor.',
 'Methotrexate is given weekly, not daily.|Biologics: injected subcutaneously and kept refrigerated.',
 'Infection risk|Methotrexate: liver injury, mouth sores, bone marrow suppression, fetal harm|Biologics: injection-site reactions, reactivation of TB',
 'CBC, liver and renal tests|TB screening before biologics',
 'Teach infection signs and to avoid live vaccines.|Folic acid may be given with methotrexate.|Not for use in pregnancy.')
C('Topical pain relievers','Topical salicylate rubs (methyl salicylate, trolamine salicylate).',
 'Counterirritant and local anti-inflammatory effect.',
 'Apply to intact skin only; do not use with heat or tight wraps.',
 'Skin irritation|Salicylate toxicity if overused',
 'Skin condition',
 'Wash hands after use and avoid the eyes.')
C('SSRIs and other antidepressants','Treat depression and anxiety (fluoxetine, sertraline, paroxetine, citalopram, venlafaxine, bupropion, trazodone).',
 'Increase serotonin (and norepinephrine or dopamine for some) in the brain.',
 'Takes 2 to 4 weeks to work; do not stop suddenly.|Bupropion: do not use with seizure disorders.',
 'Nausea, insomnia, sexual dysfunction|Serotonin syndrome|Increased suicidal thoughts at the start in young people|Bleeding risk|Hyponatremia in older adults',
 'Sodium|Mood and suicide risk|Blood pressure with venlafaxine',
 'Monitor for suicidal thoughts, especially early on.|Teach not to stop abruptly.|Do not combine with MAO inhibitors.|Teach signs of serotonin syndrome: agitation, fever, tremor, diarrhea.')
C('Tricyclic antidepressants','Older antidepressants (amitriptyline, imipramine, doxepin).',
 'Block reuptake of norepinephrine and serotonin.',
 'Give at bedtime because of sedation.|Takes weeks to work.',
 'Anticholinergic effects: dry mouth, constipation, urinary retention|Orthostatic hypotension|Dysrhythmias|Overdose is dangerous|Suicide risk',
 'ECG|Blood pressure',
 'Limit supply for at-risk clients.|Teach to rise slowly and increase fluids and fiber.')
C('MAO inhibitors','Antidepressants with strict dietary rules (phenelzine, isocarboxazid).',
 'Block the enzyme monoamine oxidase, so more norepinephrine and serotonin.',
 'Avoid foods high in tyramine and many drugs.',
 'Hypertensive crisis with tyramine or interacting drugs|Orthostatic hypotension|Insomnia|Serotonin syndrome',
 'Blood pressure',
 'Teach to avoid aged cheese, cured meats, red wine and fermented foods.|Do not combine with SSRIs or decongestants.|Report severe headache, stiff neck and palpitations.')
C('Antipsychotics','Treat psychosis and schizophrenia (haloperidol, chlorpromazine, risperidone, olanzapine, clozapine, aripiprazole).',
 'Block dopamine (and serotonin for atypical agents) receptors.',
 'Do not stop suddenly.|Clozapine requires blood count monitoring.',
 'Extrapyramidal symptoms, tardive dyskinesia|Neuroleptic malignant syndrome|Orthostatic hypotension|Weight gain and high glucose (atypicals)|QT prolongation|Clozapine: agranulocytosis and seizures',
 'ANC with clozapine|Fasting glucose and lipids|Weight|ECG',
 'Assess for abnormal movements.|Teach sun protection and slow position changes.|Report fever and muscle rigidity.|Monitor weight and glucose.')
C('Mood stabilizers','Treat bipolar disorder (lithium).',
 'Stabilizes mood by affecting sodium transport and neurotransmitters.',
 'Keep sodium and fluid intake steady.|Narrow safety margin.',
 'Toxicity: coarse tremor, vomiting, diarrhea, confusion, ataxia|Polyuria and thirst|Hypothyroidism',
 'Lithium level (therapeutic about 0.6-1.2 mEq/L)|Sodium|Creatinine|Thyroid',
 'Teach 2 to 3 liters of fluid daily and normal salt intake.|Dehydration or low sodium raises toxicity risk.|Report early toxic signs.')
C('Anxiolytics, benzodiazepines and sedative-hypnotics','Treat anxiety, insomnia and seizures (-azepam, -zolam, zolpidem, buspirone).',
 'Benzodiazepines enhance GABA, the calming brain chemical; buspirone acts on serotonin.',
 'Do not stop suddenly after long use.|Give IV slowly with respiratory monitoring.',
 'Drowsiness and falls|Respiratory depression with opioids or alcohol|Dependence and withdrawal|Confusion in older adults',
 'Respiratory rate and sedation level|Mental status',
 'Have flumazenil available for benzodiazepine overdose.|Teach no alcohol or driving.|Fall precautions.|Buspirone takes weeks to work.')
C('Stimulants','Treat ADHD and narcolepsy (methylphenidate).',
 'Increases dopamine and norepinephrine in the brain.',
 'Give in the morning to prevent insomnia.|Controlled substance.',
 'Insomnia|Appetite loss and weight loss|Hypertension and tachycardia|Slowed growth in children|Dependence',
 'Blood pressure and heart rate|Height and weight in children',
 'Monitor growth and weight.|Teach safe storage.')
C('Substance use treatment','Treat alcohol use disorder (disulfiram).',
 'Blocks alcohol breakdown so alcohol causes unpleasant effects.',
 'Client must avoid alcohol in all forms for days after.',
 'Flushing, vomiting and low BP with alcohol|Drowsiness|Liver injury',
 'Liver tests',
 'Teach to avoid hidden alcohol (mouthwash, cough syrup).|Never give without the client’s knowledge.')
C('Electrolyte replacements','Replace low electrolytes (potassium chloride, calcium, magnesium sulfate, sodium chloride).',
 'Restore normal electrolyte levels.',
 'Potassium: never give IV push; dilute and infuse by pump at the ordered rate; check urine output first.|Calcium: give IV slowly with ECG monitoring.|Magnesium sulfate: monitor reflexes, respirations and urine output.',
 'Potassium: hyperkalemia, vein irritation|Calcium: hypercalcemia, tissue damage if leaked|Magnesium: respiratory depression, loss of reflexes|Sodium: fluid overload',
 'Serum level of the electrolyte|Renal function|ECG',
 'Check the lab value before giving and recheck after.|Monitor the IV site.|Have calcium gluconate available as the magnesium antidote.')
C('IV fluids and volume expanders','Replace fluid or provide nutrition (lactated Ringer, dextrose, albumin, parenteral nutrition).',
 'Restore volume (or calories and protein).',
 'Use the right fluid for the order; check rate, label and site.|Parenteral nutrition: use a filter and strict sterile technique.',
 'Fluid overload|Electrolyte imbalance|Infection and hyperglycemia with parenteral nutrition',
 'Intake and output and weight|Electrolytes|Blood glucose with TPN',
 'Monitor lung sounds and edema.|Check the IV site.|Do not stop TPN abruptly.')
C('Labor and postpartum drugs','Induce labor or control postpartum bleeding (oxytocin, methylergonovine).',
 'Cause uterine contractions.',
 'Oxytocin: give by pump with continuous fetal monitoring; stop if too many contractions.|Methylergonovine: check BP before giving.',
 'Oxytocin: tachysystole, fetal distress, water intoxication|Methylergonovine: hypertension, cramping',
 'Fetal heart rate and contractions|Blood pressure|Fundus and lochia',
 'Stop infusion for hyperstimulation and notify provider.|Avoid methylergonovine in hypertension or preeclampsia.')
C('Immune globulins and newborn prophylaxis','Prevent Rh sensitization (Rho(D) immune globulin).',
 'Binds Rh-positive cells so the mother does not make antibodies.',
 'Given IM to an Rh-negative mother after delivery of an Rh-positive baby and at about 28 weeks.',
 'Injection-site pain|Fever',
 'Mother and baby blood type, Coombs test',
 'Verify blood types before giving.|Not for Rh-positive mothers.')
C('Hormones, contraception and fertility','Hormone therapy and contraception (estrogen, oral contraceptives).',
 'Supply hormones that prevent ovulation or replace hormones.',
 'Take at the same time every day.|Teach what to do for a missed pill.',
 'Clots, stroke and heart attack|Hypertension|Nausea|Breast tenderness',
 'Blood pressure',
 'Smoking raises clot risk.|Teach clot warning signs.|Does not protect against infection.')
C('Prostate and urinary drugs','Treat BPH (finasteride).',
 'Blocks conversion of testosterone to a stronger form (DHT), shrinking the prostate.',
 'Women who are or may be pregnant should not handle crushed tablets.',
 'Decreased libido|Erectile dysfunction',
 'PSA (finasteride lowers it)',
 'Teach that benefit takes months.')
C('Immunosuppressants','Prevent organ rejection (cyclosporine, azathioprine).',
 'Reduce the activity of the immune system.',
 'Take at the same time every day, lifelong.|Avoid grapefruit juice with cyclosporine.',
 'Infection|Nephrotoxicity|Cancer risk|Bone marrow suppression|Cyclosporine: hypertension, gingival overgrowth, tremor',
 'Drug level|Renal and liver function|CBC',
 'Teach infection signs and avoid crowds and live vaccines.|Never stop on your own.')
C('Chemotherapy and cancer drugs','Kill or stop growth of cancer cells.',
 'Damage dividing cells (including some normal cells).',
 'Handle with chemotherapy-rated gloves and gown; check for blood return and extravasation risk.|Premedicate for nausea as ordered.',
 'Bone marrow suppression|Nausea and vomiting|Mucositis|Hair loss|Infection risk|Doxorubicin: cardiotoxicity',
 'CBC and ANC|Platelets|Renal and liver function|Echocardiogram with doxorubicin',
 'Protect from infection and bleeding.|Monitor IV site closely.|Teach oral care.|Neutropenic precautions.')
C('Antidotes','Reverse the effect or toxicity of another drug.',
 'Naloxone blocks opioids; flumazenil blocks benzodiazepines; protamine neutralizes heparin; acetylcysteine protects the liver from acetaminophen; digoxin immune fab binds digoxin; deferoxamine binds iron; charcoal absorbs poisons in the gut; edetate calcium disodium binds lead.',
 'Know which antidote matches which drug.|Activated charcoal only if airway is protected and soon after ingestion.',
 'Naloxone: acute withdrawal and return of pain|Flumazenil: seizures|Protamine: hypotension, allergy|Deferoxamine: reddish urine',
 'Drug levels|Respiratory status|aPTT after protamine',
 'Monitor closely; antidote can wear off before the drug does.|Naloxone may need repeating.|Seizure precautions with flumazenil.')
C('Eye drugs','Lubricate the eye (artificial tears).',
 'Replaces tears.',
 'Do not touch the dropper tip to the eye.',
 'Brief blurred vision',
 'None specific',
 'Wash hands and do not share bottles.')
C('Skin drugs','Local skin treatment (silver nitrate).',
 'Chemically cauterizes tissue.',
 'Use only as directed; stains skin and clothes.',
 'Skin staining|Tissue burn',
 'None specific',
 'Protect surrounding skin.')
C('Vitamins','Replace or supplement vitamins.',
 'Provide needed vitamins for normal body processes.',
 'Fat-soluble vitamins (A, D, E, K) can build up; water-soluble are excreted.',
 'Toxicity with fat-soluble vitamins|Vitamin K: allergic reaction with IV|Vitamin C: kidney stones, diarrhea',
 'Level of the vitamin where relevant|INR with vitamin K',
 'Teach not to exceed recommended amounts.|Vitamin K reverses warfarin.')
C('Minerals','Replace or supplement minerals (calcium, zinc).',
 'Provide needed minerals for bones and body functions.',
 'Give calcium with food and divided doses.|Separate calcium from some antibiotics and iron.',
 'Calcium: constipation, kidney stones|Zinc: nausea, copper deficiency',
 'Serum level',
 'Encourage fluids and activity.')
C('Vaccines','Build immunity to specific infections.',
 'Cause the body to make antibodies before infection happens.',
 'Check allergies, illness and age schedule.|Live vaccines (MMR, varicella) are avoided in pregnancy and in immunocompromised clients.|Document lot number and give VIS.',
 'Soreness, redness, low-grade fever|Anaphylaxis (rare)',
 'None routine',
 'Observe for 15 minutes after.|Have epinephrine available.|Teach what to expect and when to call.')
C('Herbal supplements','Complementary products not regulated like drugs.',
 'Vary by product.',
 'Ask about herbal use at every admission.|Stop several weeks before surgery per provider.',
 'St. John wort: serotonin syndrome and drug interactions|Ginkgo, garlic, ginger, ginseng: bleeding|Kava: liver injury|Valerian: drowsiness|Echinacea: allergic reaction',
 'INR with warfarin',
 'Ask about all herbals; they interact with many drugs.')
D_ = None
# ---- per-drug additions (shown after the class items)
X('heparin',admin='Give subcutaneous in the abdomen without aspirating or rubbing.|Check the pump and rate and use two nurses to verify.',labs='aPTT (goal 1.5-2.5 times normal)|Platelets for HIT',nsg='Antidote protamine sulfate.')
X('warfarin',admin='Take at the same time daily.',labs='PT/INR (goal usually 2-3; mechanical valves higher)',nsg='Antidote vitamin K; reversal can take hours.|Keep vitamin K intake steady.')
X('enoxaparin',admin='Do not expel the air bubble from the prefilled syringe; do not rub site.',labs='Platelets; anti-Xa in kidney disease or obesity',nsg='Protamine partially reverses.')
X('digoxin',labs='Digoxin level 0.5-2 ng/mL; potassium 3.5-5',nsg='Antidote digoxin immune fab (Digibind).')
X('lithium',labs='Level 0.6-1.2 mEq/L (toxic above 1.5)')
X('potassium chloride',admin='Never IV push; max rate per policy by pump; dilute.',labs='Potassium 3.5-5.0 mEq/L')
X('magnesium sulfate',labs='Magnesium 1.3-2.1 mg/dL',nsg='Hold for absent deep tendon reflexes, respirations under 12, or urine output under 30 mL/hr; antidote calcium gluconate.')
X('regular insulin',admin='Only insulin that may be given IV; clear.')
X('insulin glargine',admin='Do not mix with other insulin; no peak.')
X('levothyroxine',admin='Empty stomach, same time every day.')
X('phenytoin',labs='Phenytoin level 10-20 mcg/mL',admin='IV: give slowly with normal saline only; do not mix with dextrose.')
X('furosemide',nsg='Report ringing in the ears; monitor potassium.')
X('spironolactone',labs='Potassium (hyperkalemia risk)')
X('nitroglycerin',admin='Sublingual: 1 tablet every 5 minutes up to 3; call 911 if pain persists after the first dose.')
X('albuterol',nsg='Monitor heart rate and potassium.')
X('theophylline',labs='Level 10-20 mcg/mL')
X('acetaminophen',nsg='Antidote acetylcysteine.')
X('morphine',nsg='Antidote naloxone; assess respiratory rate before each dose.')
X('naloxone',nsg='Repeat doses may be needed because it wears off sooner than the opioid.')
X('flumazenil',nsg='May cause seizures; use caution in chronic benzodiazepine users.')
X('protamine sulfate',nsg='Give slowly; watch for hypotension and allergic reaction.')
X('vitamin K',nsg='Reverses warfarin; recheck INR.')
X('amiodarone',nsg='Teach sun protection; report cough or shortness of breath.')
X('vancomycin',admin='Infuse over at least 60 minutes to avoid red man syndrome.',labs='Trough level; creatinine')
X('gentamicin',labs='Peak and trough levels; creatinine')
X('isoniazid',nsg='Give vitamin B6 to prevent neuropathy.')
X('rifampin',nsg='Orange urine, sweat and tears are expected.')
X('metformin',admin='Hold for contrast dye.')
X('clozapine',labs='ANC')
X('ethambutol',labs='Visual acuity and color vision')
X('methotrexate',admin='Dosed weekly, not daily.')
