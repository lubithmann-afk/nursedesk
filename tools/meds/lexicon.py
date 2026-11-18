"""Master list of medications used to organize the Medications tab.
This file only decides WHAT to look for and WHICH CATEGORY/CLASS a drug is filed under.
Everything shown about a medication comes from the student's own materials (slides, ATI guide,
practice questions), found by build_meds.py.

Format per line:  generic | Brand, Brand | extra names or abbreviations (matched whole-word, any case)
A line may end the generic with "!" to mean "match the generic name only when written exactly as given"
(used for names that are also ordinary words)."""
L = {}
def C(cat, cls, text):
    for line in text.strip().splitlines():
        line = line.strip()
        if not line: continue
        parts = [p.strip() for p in line.split('|')]
        gen = parts[0]
        brands = [b.strip() for b in parts[1].split(',')] if len(parts) > 1 and parts[1] else []
        alias = [a.strip() for a in parts[2].split(',')] if len(parts) > 2 and parts[2] else []
        L.setdefault(cat, {}).setdefault(cls, []).append({'name': gen, 'brands': brands, 'alias': alias})

# ------------------------------------------------------------------ Cardiovascular
C('Cardiovascular','ACE inhibitors',"""
captopril|Capoten
enalapril|Vasotec
lisinopril|Prinivil, Zestril
ramipril|Altace
benazepril|Lotensin
fosinopril|Monopril
quinapril|Accupril""")
C('Cardiovascular','Angiotensin receptor blockers (ARBs)',"""
losartan|Cozaar
valsartan|Diovan
candesartan|Atacand
irbesartan|Avapro
olmesartan|Benicar""")
C('Cardiovascular','Beta blockers',"""
propranolol|Inderal
metoprolol|Lopressor, Toprol
atenolol|Tenormin
nadolol|Corgard
carvedilol|Coreg
labetalol|Normodyne, Trandate
esmolol|Brevibloc
bisoprolol|Zebeta
timolol|Timoptic""")
C('Cardiovascular','Calcium channel blockers',"""
nifedipine|Procardia, Adalat
amlodipine|Norvasc
diltiazem|Cardizem
verapamil|Calan, Isoptin
nicardipine|Cardene
nimodipine|Nimotop
felodipine|Plendil""")
C('Cardiovascular','Thiazide diuretics',"""
hydrochlorothiazide|Microzide, HydroDiuril|HCTZ
chlorothiazide|Diuril
metolazone|Zaroxolyn
chlorthalidone|Thalitone, Hygroton""")
C('Cardiovascular','Loop diuretics',"""
furosemide|Lasix
bumetanide|Bumex
torsemide|Demadex
ethacrynic acid|Edecrin""")
C('Cardiovascular','Potassium-sparing diuretics',"""
spironolactone|Aldactone
triamterene|Dyrenium""")
C('Cardiovascular','Osmotic and other diuretics',"""
mannitol|Osmitrol
acetazolamide|Diamox""")
C('Cardiovascular','Nitrates and vasodilators',"""
nitroglycerin|Nitrostat, Tridil|NTG, nitro paste
isosorbide dinitrate|Isordil
isosorbide mononitrate|Imdur, Ismo
hydralazine|Apresoline
nitroprusside|Nipride, Nitropress
minoxidil|Loniten""")
C('Cardiovascular','Adrenergic inhibitors (central and alpha)',"""
clonidine|Catapres
methyldopa|Aldomet
prazosin|Minipress
reserpine|Serpasil
doxazosin|Cardura
terazosin|Hytrin""")
C('Cardiovascular','Cardiac glycosides',"""
digoxin|Lanoxin, Digitek""")
C('Cardiovascular','Antiarrhythmics',"""
amiodarone|Cordarone, Pacerone
lidocaine|Xylocaine
adenosine|Adenocard
procainamide|Pronestyl
quinidine|Quinaglute
flecainide|Tambocor""")
C('Cardiovascular','Vasopressors and inotropes',"""
dopamine|Intropin
dobutamine|Dobutrex
epinephrine|Adrenalin, EpiPen
norepinephrine|Levophed
phenylephrine|Neo-Synephrine""")
C('Cardiovascular','Lipid-lowering drugs',"""
simvastatin|Zocor
atorvastatin|Lipitor
lovastatin|Mevacor
pravastatin|Pravachol
rosuvastatin|Crestor
niacin|Niaspan
ezetimibe|Zetia
gemfibrozil|Lopid
cholestyramine|Questran
statins""")
C('Cardiovascular','Other cardiac drugs',"""
ranolazine|Ranexa
sildenafil|Viagra, Revatio
tadalafil|Cialis""")

# ------------------------------------------------------------------ Blood and clotting
C('Blood and Clotting','Anticoagulants',"""
heparin
enoxaparin|Lovenox
warfarin|Coumadin, Jantoven
dalteparin|Fragmin
fondaparinux|Arixtra
argatroban
rivaroxaban|Xarelto
apixaban|Eliquis
dabigatran|Pradaxa""")
C('Blood and Clotting','Antiplatelets',"""
aspirin||ASA, acetylsalicylic acid
clopidogrel|Plavix
ticlopidine|Ticlid
dipyridamole|Persantine
abciximab|ReoPro
eptifibatide|Integrilin
cilostazol|Pletal""")
C('Blood and Clotting','Thrombolytics',"""
alteplase|Activase|t-PA, tPA
tenecteplase|TNKase
streptokinase|Streptase
reteplase|Retavase""")
C('Blood and Clotting','Iron, vitamins and blood-building drugs',"""
ferrous sulfate|Feosol|iron supplement, iron supplements, oral iron, liquid iron
iron dextran|INFeD, Imferon
cyanocobalamin|Vitamin B12 injection|vitamin B12, B12
folic acid|Folate|folate
epoetin alfa|Epogen, Procrit|epoetin
filgrastim|Neupogen
hydroxyurea|Hydrea""")
C('Blood and Clotting','Hemostatics',"""
aminocaproic acid|Amicar
tranexamic acid|Cyklokapron""")

# ------------------------------------------------------------------ Respiratory
C('Respiratory','Beta2 agonists (bronchodilators)',"""
albuterol|Ventolin, Proventil
salmeterol|Serevent
terbutaline|Brethine
metaproterenol|Alupent
isoetharine|Bronkosol
formoterol|Foradil""")
C('Respiratory','Anticholinergic bronchodilators',"""
ipratropium|Atrovent
tiotropium|Spiriva""")
C('Respiratory','Xanthines',"""
theophylline|Theo-Dur, Theodur, Theolair
aminophylline|Aminodur""")
C('Respiratory','Leukotriene modifiers and mast cell stabilizers',"""
montelukast|Singulair
zafirlukast|Accolate
cromolyn sodium|Intal, Arana|cromolyn""")
C('Respiratory','Mucolytics, expectorants and cough drugs',"""
guaifenesin|Mucinex
dextromethorphan|Robitussin DM
benzonatate|Tessalon
pseudoephedrine|Sudafed""")
C('Respiratory','Antihistamines',"""
diphenhydramine|Benadryl
cetirizine|Zyrtec
loratadine|Claritin
fexofenadine|Allegra
hydroxyzine|Vistaril, Atarax""")

# ------------------------------------------------------------------ Endocrine
C('Endocrine','Insulins',"""
regular insulin|Humulin R, Novolin R
NPH insulin|Humulin N, Novolin N|NPH
insulin lispro|Humalog|lispro
insulin aspart|Novolog|aspart
insulin glargine|Lantus|glargine
insulin detemir|Levemir|detemir
insulin glulisine|Apidra
insulin|||""")
C('Endocrine','Oral and non-insulin diabetes drugs',"""
metformin|Glucophage
glipizide|Glucotrol
glyburide|Diabeta, Micronase
glimepiride|Amaryl
pioglitazone|Actos
sitagliptin|Januvia
acarbose|Precose
repaglinide|Prandin
exenatide|Byetta
liraglutide|Victoza
pramlintide|Symlin""")
C('Endocrine','Thyroid drugs',"""
levothyroxine|Synthroid, Levoxyl
liothyronine|Cytomel
methimazole|Tapazole
propylthiouracil||PTU
Lugol's solution||potassium iodide""")
C('Endocrine','Pituitary and hormone drugs',"""
vasopressin|Pitressin
desmopressin|DDAVP
octreotide|Sandostatin
glucagon|GlucaGen""")
C('Endocrine','Corticosteroids',"""
cortisone
prednisone|Deltasone, Meticorten
prednisolone
methylprednisolone|Solu-Medrol, SoluMedrol, Medrol, Solumedrol
hydrocortisone|Solu-Cortef, Cortef
dexamethasone|Decadron
betamethasone|Celestone
fluticasone|Flovent, Flonase
beclomethasone|Qvar
budesonide|Pulmicort
triamcinolone|Kenalog
fludrocortisone|Florinef
corticosteroids""")
C('Endocrine','Bone and calcium drugs',"""
alendronate|Fosamax
calcitonin|Miacalcin
calcitriol|Rocaltrol
raloxifene|Evista""")

# ------------------------------------------------------------------ Gastrointestinal
C('Gastrointestinal','Proton pump inhibitors',"""
omeprazole|Prilosec
lansoprazole|Prevacid
esomeprazole|Nexium
pantoprazole|Protonix
rabeprazole|Aciphex""")
C('Gastrointestinal','H2 receptor antagonists',"""
cimetidine|Tagamet
ranitidine|Zantac
famotidine|Pepcid
nizatidine|Axid""")
C('Gastrointestinal','Antacids and ulcer protectants',"""
sucralfate|Carafate
misoprostol|Cytotec
aluminum hydroxide|Amphojel
magnesium hydroxide|Milk of Magnesia, Maalox, Mylanta
calcium carbonate|Tums
bismuth subsalicylate|Pepto-Bismol
simethicone|Mylicon, Gas-X""")
C('Gastrointestinal','Antiemetics and gastric motility drugs',"""
ondansetron|Zofran
prochlorperazine|Compazine
promethazine|Phenergan
metoclopramide|Reglan
trimethobenzamide|Tigan
meclizine|Antivert
scopolamine|Transderm Scop
dronabinol|Marinol""")
C('Gastrointestinal','Laxatives and bowel preparations',"""
docusate sodium|Colace|docusate
docusate calcium|Surfak
docusate potassium|Dialose
casanthranol|Peri-Colace
bisacodyl|Dulcolax
senna|Senokot
psyllium|Metamucil
polyethylene glycol electrolyte solution|GoLYTELY, Golytely, Colyte, NuLytely, MiraLax|GoLytely
lactulose|Cephulac
mineral oil""")
C('Gastrointestinal','Antidiarrheals',"""
loperamide|Imodium
diphenoxylate with atropine|Lomotil|diphenoxylate""")
C('Gastrointestinal','Inflammatory bowel and biliary drugs',"""
sulfasalazine|Azulfidine
mesalamine|Asacol
infliximab|Remicade
ursodiol|Actigall|ursodeoxycholic acid, UDCA
chenodeoxycholic acid||CDCA
pancrelipase|Creon|pancreatic enzyme""")
C('Gastrointestinal','Potassium and electrolyte binders',"""
sodium polystyrene sulfonate|Kayexalate""")

# ------------------------------------------------------------------ Anti-infectives
C('Anti-infectives','Penicillins',"""
penicillin G|Pfizerpen|penicillin
amoxicillin|Amoxil
ampicillin
piperacillin-tazobactam|Zosyn|piperacillin
nafcillin
oxacillin""")
C('Anti-infectives','Cephalosporins',"""
cefazolin|Ancef, Kefzol
cephalexin|Keflex
ceftriaxone|Rocephin
cefuroxime|Zinacef
cefepime|Maxipime
cefotaxime|Claforan""")
C('Anti-infectives','Aminoglycosides',"""
gentamicin|Garamycin
tobramycin|Nebcin
amikacin|Amikin
streptomycin
neomycin""")
C('Anti-infectives','Macrolides',"""
erythromycin|E-Mycin, Ery-Tab
azithromycin|Zithromax
clarithromycin|Biaxin""")
C('Anti-infectives','Fluoroquinolones',"""
ciprofloxacin|Cipro
levofloxacin|Levaquin
moxifloxacin|Avelox""")
C('Anti-infectives','Tetracyclines',"""
tetracycline|Sumycin
doxycycline|Vibramycin""")
C('Anti-infectives','Sulfonamides',"""
sulfamethoxazole-trimethoprim|Bactrim, Septra|SMX-TMP, trimethoprim
sulfadiazine
silver sulfadiazine|Silvadene
mafenide|Sulfamylon""")
C('Anti-infectives','Other antibiotics',"""
vancomycin|Vancocin
clindamycin|Cleocin
metronidazole|Flagyl
linezolid|Zyvox
imipenem-cilastatin|Primaxin|imipenem
nitrofurantoin|Macrobid, Macrodantin
mupirocin|Bactroban""")
C('Anti-infectives','Antitubercular drugs',"""
isoniazid|Nydrazid|INH
rifampin|Rifadin, Rimactane
ethambutol|Myambutol
pyrazinamide""")
C('Anti-infectives','Antivirals',"""
acyclovir|Zovirax
valacyclovir|Valtrex
oseltamivir|Tamiflu
zidovudine|Retrovir|AZT
ganciclovir|Cytovene
ribavirin|Virazole
saquinavir|Invirase
HIV antiretrovirals||NRTIs, NNRTIs, protease inhibitors, antiretroviral, antiretrovirals
palivizumab|Synagis|RSV-mAb""")
C('Anti-infectives','Antifungals',"""
fluconazole|Diflucan
nystatin|Mycostatin
amphotericin B|Fungizone
ketoconazole|Nizoral
terbinafine|Lamisil""")
C('Anti-infectives','Antiparasitic and antimalarial drugs',"""
permethrin|Elimite, Nix
lindane|Kwell
ivermectin|Stromectol
hydroxychloroquine|Plaquenil
chloroquine|Aralen""")
C('Anti-infectives','Urinary tract analgesic',"""
phenazopyridine|Pyridium|Azo""")

# ------------------------------------------------------------------ Neurological
C('Neurological','Anticonvulsants',"""
phenytoin|Dilantin
fosphenytoin|Cerebyx
carbamazepine|Tegretol
valproic acid|Depakote, Depakene|valproate
phenobarbital|Luminal
levetiracetam|Keppra
lamotrigine|Lamictal
gabapentin|Neurontin
topiramate|Topamax""")
C('Neurological','Parkinson disease drugs',"""
levodopa-carbidopa|Sinemet|carbidopa-levodopa, levodopa, L-Dopa, carbidopa
benztropine|Cogentin
amantadine|Symmetrel
pramipexole|Mirapex
ropinirole|Requip
selegiline|Eldepryl""")
C('Neurological','Multiple sclerosis and ALS drugs',"""
interferon beta-1a|Avonex, Rebif|interferon beta, interferon
interferon beta-1b|Betaseron
glatiramer acetate|Copaxone|glatiramer
riluzole|Rilutek""")
C('Neurological','Myasthenia gravis and cholinesterase inhibitors',"""
pyridostigmine|Mestinon
neostigmine|Prostigmin
edrophonium|Tensilon, Enlon
donepezil|Aricept
rivastigmine|Exelon
memantine|Namenda""")
C('Neurological','Muscle relaxants',"""
baclofen|Lioresal
cyclobenzaprine|Flexeril
dantrolene|Dantrium
tizanidine|Zanaflex
methocarbamol|Robaxin""")
C('Neurological','Anticholinergics and cholinergics',"""
atropine|AtroPen
bethanechol|Urecholine
oxybutynin|Ditropan
dicyclomine|Bentyl
glycopyrrolate|Robinul
pilocarpine|Isopto Carpine""")
C('Neurological','Migraine drugs',"""
sumatriptan|Imitrex""")
C('Neurological','Anesthetics and sedation',"""
procaine|Novocain
prilocaine|Citanest
propofol|Diprivan
ketamine|Ketalar
succinylcholine|Anectine
etomidate|Amidate""")

# ------------------------------------------------------------------ Pain and inflammation
C('Pain and Inflammation','Opioid analgesics',"""
morphine|MS Contin, Duramorph
hydromorphone|Dilaudid
fentanyl|Duragesic, Sublimaze
oxycodone|OxyContin, Percocet
hydrocodone|Vicodin, Lortab
codeine
meperidine|Demerol
methadone|Dolophine
tramadol|Ultram
butorphanol|Stadol
nalbuphine|Nubain""")
C('Pain and Inflammation','NSAIDs and salicylates',"""
ibuprofen|Motrin, Advil
naproxen|Naprosyn, Aleve
ketorolac|Toradol
indomethacin|Indocin
celecoxib|Celebrex
diclofenac|Voltaren
meloxicam|Mobic
salicylates""")
C('Pain and Inflammation','Acetaminophen',"""
acetaminophen|Tylenol|APAP""")
C('Pain and Inflammation','Gout drugs',"""
allopurinol|Zyloprim
colchicine
probenecid|Benemid
febuxostat|Uloric""")
C('Pain and Inflammation','Rheumatoid arthritis and immune drugs (DMARDs)',"""
methotrexate|Rheumatrex, Trexall
leflunomide|Arava
etanercept|Enbrel
adalimumab|Humira""")
C('Pain and Inflammation','Topical pain relievers',"""
capsaicin|Zostrix
methyl salicylate|BenGay|Ben-Gay
trolamine salicylate|Aspercreme""")

# ------------------------------------------------------------------ Mental health
C('Mental Health','SSRIs and other antidepressants',"""
fluoxetine|Prozac
sertraline|Zoloft
paroxetine|Paxil
citalopram|Celexa
escitalopram|Lexapro
venlafaxine|Effexor
duloxetine|Cymbalta
bupropion|Wellbutrin, Zyban
mirtazapine|Remeron
trazodone|Desyrel""")
C('Mental Health','Tricyclic antidepressants',"""
amitriptyline|Elavil
nortriptyline|Pamelor
imipramine|Tofranil
doxepin|Sinequan""")
C('Mental Health','MAO inhibitors',"""
phenelzine|Nardil
tranylcypromine|Parnate
isocarboxazid|Marplan""")
C('Mental Health','Antipsychotics',"""
haloperidol|Haldol
chlorpromazine|Thorazine
risperidone|Risperdal
olanzapine|Zyprexa
quetiapine|Seroquel
clozapine|Clozaril
aripiprazole|Abilify
ziprasidone|Geodon
fluphenazine|Prolixin
loxapine|Loxitane""")
C('Mental Health','Mood stabilizers',"""
lithium|Lithobid, Eskalith""")
C('Mental Health','Anxiolytics, benzodiazepines and sedative-hypnotics',"""
alprazolam|Xanax
lorazepam|Ativan
diazepam|Valium
clonazepam|Klonopin
chlordiazepoxide|Librium
midazolam|Versed
buspirone|BuSpar
zolpidem|Ambien
temazepam|Restoril
triazolam|Halcion
oxazepam|Serax
zaleplon|Sonata
eszopiclone|Lunesta""")
C('Mental Health','Stimulants',"""
methylphenidate|Ritalin, Concerta
amphetamine|Adderall
dextroamphetamine|Dexedrine
atomoxetine|Strattera""")
C('Mental Health','Substance use treatment',"""
disulfiram|Antabuse
naltrexone|ReVia, Vivitrol
buprenorphine|Suboxone
acamprosate|Campral
varenicline|Chantix
nicotine replacement|Nicotrol|nicotine patch""")

# ------------------------------------------------------------------ Fluids and electrolytes
C('Fluids and Electrolytes','Electrolyte replacements',"""
potassium chloride|K-Dur, Klor-Con|KCl
calcium gluconate
calcium chloride
sodium bicarbonate|NaHCO3
magnesium sulfate|Epsom salt
sodium chloride|Normal saline|0.9% sodium chloride, normal saline
calcium acetate|PhosLo
sevelamer|Renvela""")
C('Fluids and Electrolytes','IV fluids and volume expanders',"""
lactated Ringer's|LR|Ringer's lactate, lactated Ringers
dextrose|D5W|D5NS
salt-poor albumin|Albuminar|albumin infusion, IV albumin
parenteral nutrition|TPN|total parenteral nutrition""")

# ------------------------------------------------------------------ Maternal, newborn, reproductive
C('Maternal-Newborn and Reproductive','Labor and postpartum drugs',"""
oxytocin|Pitocin
methylergonovine|Methergine
carboprost|Hemabate
dinoprostone|Cervidil, Prepidil""")
C('Maternal-Newborn and Reproductive','Immune globulins and newborn prophylaxis',"""
Rho(D) immune globulin|RhoGAM|RhoGAM, Rhogam, RhIG
erythromycin ointment|||""")
C('Maternal-Newborn and Reproductive','Hormones, contraception and fertility',"""
estrogen therapy|Premarin|estrogen replacement, hormone replacement therapy
medroxyprogesterone|Depo-Provera
clomiphene|Clomid
oral contraceptives||birth control pill""")
C('Maternal-Newborn and Reproductive','Prostate and urinary drugs',"""
finasteride|Proscar
tamsulosin|Flomax""")

# ------------------------------------------------------------------ Immune, cancer and transplant
C('Immune, Cancer and Transplant','Immunosuppressants',"""
cyclosporine|Sandimmune, Neoral
tacrolimus|Prograf
mycophenolate|CellCept
azathioprine|Imuran""")
C('Immune, Cancer and Transplant','Chemotherapy and cancer drugs',"""
cisplatin|Platinol
cyclophosphamide|Cytoxan
doxorubicin|Adriamycin
vincristine|Oncovin
fluorouracil|5-FU|5-fluorouracil
tamoxifen|Nolvadex
chemotherapeutic agents||chemotherapy""")

# ------------------------------------------------------------------ Antidotes and reversal agents
C('Antidotes and Reversal Agents','Antidotes',"""
naloxone|Narcan
flumazenil|Romazicon
protamine sulfate||protamine
acetylcysteine|Mucomyst, Acetadote
digoxin immune fab|Digibind, DigiFab
deferoxamine|Desferal
pralidoxime|Protopam|2-PAM
physostigmine|Antilirium
fomepizole|Antizol
activated charcoal||charcoal
dimercaprol||BAL in oil
edetate calcium disodium|Calcium EDTA|EDTA
methylene blue""")

# ------------------------------------------------------------------ Eye and skin
C('Eye, Ear and Skin','Eye drugs',"""
latanoprost|Xalatan
tropicamide|Mydriacyl
artificial tears""")
C('Eye, Ear and Skin','Skin drugs',"""
isotretinoin|Accutane
silver nitrate""")

# ------------------------------------------------------------------ Vitamins and minerals
C('Vitamins and Minerals','Vitamins',"""
vitamin K|AquaMephyton|phytonadione
vitamin D|Cholecalciferol|vitamin D supplements
vitamin C|Ascorbic acid
vitamin B6|Pyridoxine|pyridoxine
vitamin E
multivitamin|Prenatal vitamins|prenatal vitamin""")
C('Vitamins and Minerals','Minerals',"""
calcium supplements||calcium supplement
zinc""")

# ------------------------------------------------------------------ Vaccines
C('Vaccines','Vaccines',"""
DTaP vaccine||DTaP
Tdap vaccine||Tdap
MMR vaccine||MMR
varicella vaccine|Varivax|varicella vaccine, chickenpox vaccine
hepatitis B vaccine|Engerix-B|hep B vaccine, Hep B vaccine, HBV vaccine
influenza vaccine||flu vaccine, flu shot
pneumococcal vaccine|Pneumovax, Prevnar|pneumonia vaccine, pneumococcal
HPV vaccine|Gardasil
rotavirus vaccine|RotaTeq
polio vaccine||IPV
Hib vaccine||
zoster vaccine|Shingrix|Zostavax
meningococcal vaccine|Menactra""")

# ------------------------------------------------------------------ Herbal and complementary
C('Herbal and Complementary','Herbal supplements',"""
St. John's wort||St John's wort, St. Johns wort
saw palmetto
ginkgo biloba|Ginkgo|ginkgo
ginseng
garlic supplements||garlic
echinacea
valerian
kava
black cohosh
glucosamine
feverfew
melatonin""")

if __name__ == '__main__':
    n = sum(len(v) for c in L.values() for v in c.values())
    print(len(L), 'categories,', sum(len(c) for c in L.values()), 'classes,', n, 'entries')
