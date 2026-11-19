"""General medical terminology (standard definitions, written for this app). These are NOT from the student's class materials;
the glossary marks them as general reference. Where the class PowerPoints or ATI guide define the same term, build_glossary.py
uses that definition instead and cites the slide/page.
Format per line:  term | definition"""
G = {}
G['Signs & Symptoms'] = """
Anorexia | Loss of appetite.
Bradycardia | A heart rate below 60 beats per minute in an adult.
Tachycardia | A heart rate above 100 beats per minute in an adult.
Bradypnea | Abnormally slow breathing.
Tachypnea | Abnormally fast breathing.
Apnea | Absence of breathing.
Dyspnea | Difficult or labored breathing; shortness of breath.
Orthopnea | Difficulty breathing when lying flat that is relieved by sitting upright.
Cyanosis | Bluish discoloration of the skin or mucous membranes caused by low oxygen in the blood.
Pallor | Abnormal paleness of the skin.
Jaundice | Yellow discoloration of the skin and the whites of the eyes from too much bilirubin.
Diaphoresis | Profuse sweating.
Edema | Swelling caused by excess fluid in body tissues.
Anasarca | Severe, widespread swelling throughout the body.
Erythema | Redness of the skin from increased blood flow.
Ecchymosis | A bruise; blood that has leaked into the skin.
Petechiae | Tiny pinpoint red or purple spots caused by bleeding under the skin.
Purpura | Purple discoloration of the skin from bleeding under it; larger than petechiae.
Pruritus | Itching.
Urticaria | Hives; raised, itchy welts, often from an allergic reaction.
Hematemesis | Vomiting blood.
Hemoptysis | Coughing up blood from the respiratory tract.
Melena | Black, tarry stool caused by digested blood from the upper GI tract.
Hematochezia | Bright red blood in the stool.
Epistaxis | A nosebleed.
Syncope | Fainting; a brief loss of consciousness from reduced blood flow to the brain.
Vertigo | A spinning sensation of oneself or the surroundings.
Tinnitus | Ringing or buzzing in the ears.
Paresthesia | Abnormal sensation such as tingling, numbness or "pins and needles".
Photophobia | Abnormal sensitivity to light.
Malaise | A general feeling of being unwell.
Lethargy | Drowsiness and lack of energy or responsiveness.
Cachexia | Severe weight loss and muscle wasting from chronic illness.
Pyrexia | Fever.
Febrile | Having a fever.
Afebrile | Having no fever.
Nausea | The feeling of needing to vomit.
Emesis | Vomiting.
Flatus | Gas passed through the rectum.
Mottling | Blotchy, patchy skin discoloration from poor circulation.
Hypothermia | Abnormally low body temperature.
Hyperthermia | Abnormally high body temperature.
"""
G['Cardiovascular'] = """
Angina | Chest pain or pressure caused by reduced blood flow to the heart muscle.
Arrhythmia | An abnormal heart rhythm.
Dysrhythmia | Another word for arrhythmia: an abnormal heart rhythm.
Atherosclerosis | Hardening and narrowing of the arteries from fatty plaque buildup.
Ischemia | Inadequate blood supply to a tissue or organ.
Infarction | Death of tissue caused by a lack of blood supply.
Myocardial infarction | Death of heart muscle from blocked blood flow; a heart attack.
Murmur | An abnormal whooshing sound over the heart caused by turbulent blood flow.
Bruit | An abnormal whooshing sound heard over an artery with a stethoscope.
Thrill | A vibration felt over a vessel or the heart; felt over a dialysis fistula when it is working.
Hypertension | Persistently high blood pressure.
Hypotension | Abnormally low blood pressure.
Orthostatic hypotension | A drop in blood pressure on standing up, causing dizziness.
Palpitations | An awareness of one's own heartbeat, often fast, pounding or irregular.
Preload | The stretch of the heart muscle at the end of filling; the volume of blood returning to the heart.
Afterload | The resistance the heart must overcome to eject blood.
Cardiac output | The amount of blood the heart pumps per minute (heart rate times stroke volume).
Ejection fraction | The percentage of blood the left ventricle pumps out with each beat.
Thrombus | A blood clot that stays where it formed.
Embolus | A clot, air bubble or other material that travels in the blood and blocks a vessel.
Aneurysm | A weakened, bulging area in the wall of an artery.
Phlebitis | Inflammation of a vein.
Thrombophlebitis | Inflammation of a vein with a blood clot.
Deep vein thrombosis | A blood clot in a deep vein, usually in the leg.
Pulmonary embolism | A blockage of a lung artery, usually by a clot that traveled from a leg vein.
Claudication | Leg pain with walking that is relieved by rest, caused by poor arterial blood flow.
Cardiomegaly | Enlargement of the heart.
Pericarditis | Inflammation of the sac around the heart.
Endocarditis | Infection or inflammation of the inner lining of the heart and its valves.
Stenosis | Narrowing of a vessel or valve opening.
Regurgitation | Backward flow, such as blood through a leaky heart valve or stomach contents into the esophagus.
Cardiac tamponade | Compression of the heart by fluid or blood collecting in the sac around it.
Heart failure | The heart cannot pump enough blood to meet the body's needs.
"""
G['Respiratory'] = """
Hypoxia | Too little oxygen reaching the body's tissues.
Hypoxemia | A low oxygen level in the blood.
Hypercapnia | Too much carbon dioxide in the blood.
Hypoventilation | Breathing too slowly or shallowly to remove enough carbon dioxide.
Hyperventilation | Breathing faster or deeper than the body needs, blowing off too much carbon dioxide.
Atelectasis | Collapse of part or all of a lung.
Pneumothorax | Air in the space around the lung (pleural space), causing the lung to collapse.
Hemothorax | Blood in the pleural space.
Pleural effusion | Fluid in the pleural space around the lung.
Empyema | Pus in the pleural space.
Bronchospasm | Sudden tightening of the airway muscles that causes wheezing.
Crackles | Fine bubbling or popping lung sounds, also called rales, often from fluid in the air sacs.
Rhonchi | Low-pitched, rumbling lung sounds from secretions in the larger airways.
Wheeze | A high-pitched whistling sound from narrowed airways.
Stridor | A harsh, high-pitched sound on breathing in; a sign of upper-airway obstruction.
Pleural friction rub | A grating sound from inflamed pleural surfaces rubbing together.
Sputum | Material coughed up from the lungs and airways.
Tidal volume | The amount of air moved in or out with one normal breath.
Pulse oximetry | A noninvasive test that estimates the percent of hemoglobin carrying oxygen (SpO2).
Barrel chest | An increased front-to-back chest diameter, seen in emphysema.
Clubbing | Widening and rounding of the fingertips, seen with long-term low oxygen.
"""
G['GI & Nutrition'] = """
Ascites | Abnormal buildup of fluid in the abdominal cavity.
Dyspepsia | Indigestion; upper abdominal discomfort after eating.
Dysphagia | Difficulty swallowing.
Pyrosis | Heartburn; a burning feeling in the chest from stomach acid backing up.
Gastroesophageal reflux | Backflow of stomach contents into the esophagus.
Constipation | Infrequent, hard or difficult-to-pass stools.
Diarrhea | Frequent loose or watery stools.
Hepatomegaly | Enlargement of the liver.
Splenomegaly | Enlargement of the spleen.
Cholelithiasis | Gallstones.
Cholecystitis | Inflammation of the gallbladder.
Pancreatitis | Inflammation of the pancreas.
Peritonitis | Inflammation of the lining of the abdominal cavity.
Ileus | Temporary stoppage of bowel movement (peristalsis).
Intussusception | One segment of intestine slides into the next, causing an obstruction.
Volvulus | Twisting of the intestine on itself, causing an obstruction.
Hernia | Protrusion of an organ or tissue through a weak spot in the muscle wall that holds it.
Peristalsis | Wave-like muscle contractions that move food through the digestive tract.
Malabsorption | Poor absorption of nutrients from the intestine.
Dumping syndrome | Rapid emptying of stomach contents into the small intestine after stomach surgery, causing dizziness, a fast heart rate and diarrhea.
Enteral nutrition | Feeding through the digestive tract, such as by a feeding tube.
Parenteral nutrition | Nutrition given into a vein, bypassing the digestive tract.
"""
G['Renal & Urinary'] = """
Anuria | Little or no urine output.
Polyuria | Excessive urine output.
Nocturia | Waking at night to urinate.
Dysuria | Painful or difficult urination.
Hematuria | Blood in the urine.
Proteinuria | Protein in the urine.
Glycosuria | Glucose (sugar) in the urine.
Ketonuria | Ketones in the urine.
Azotemia | Buildup of nitrogen waste products (BUN and creatinine) in the blood.
Uremia | The symptoms caused by waste products building up in the blood in kidney failure.
Enuresis | Involuntary urination, such as bed-wetting, past the age when control is expected.
Urinary incontinence | Involuntary loss of urine.
Micturition | The act of urinating.
Urinary retention | Inability to empty the bladder completely.
Residual urine | Urine left in the bladder after voiding.
Glomerular filtration rate | How much blood the kidneys filter per minute; the best estimate of kidney function.
Hydronephrosis | Swelling of the kidney because urine backs up.
Pyelonephritis | Infection of the kidney.
Nephrolithiasis | Kidney stones.
Cystitis | Inflammation of the bladder, usually from infection.
Hemodialysis | Cleaning the blood with a machine through a vascular access such as a fistula or graft.
Peritoneal dialysis | Cleaning the blood by running fluid into the abdominal cavity through a catheter.
"""
G['Neuro, Eyes & Ears'] = """
Aphasia | Loss of the ability to produce or understand language.
Ataxia | Lack of coordination of voluntary movement, often an unsteady, staggering walk.
Paralysis | Loss of the ability to move a body part.
Seizure | A sudden burst of abnormal electrical activity in the brain.
Aura | A warning sensation, such as a smell, sight or feeling, before a seizure or migraine.
Postictal state | The period of confusion and drowsiness after a seizure.
Coma | A state of deep unconsciousness from which the person cannot be awakened.
Delirium | A sudden, usually temporary state of confusion and disturbed attention.
Dementia | A progressive decline in memory and thinking that interferes with daily life.
Meningitis | Inflammation of the membranes covering the brain and spinal cord.
Encephalitis | Inflammation of the brain.
Intracranial pressure | The pressure of fluid, blood and tissue inside the skull.
Cushing's triad | A late sign of rising intracranial pressure: increasing systolic blood pressure with a wide pulse pressure, a slow heart rate and irregular breathing.
Neuropathy | Damage or disease of the peripheral nerves.
Nuchal rigidity | A stiff neck that is painful to bend forward, a sign of meningeal irritation.
Decorticate posturing | Arms bent toward the chest and legs straight, from damage above the brainstem.
Decerebrate posturing | Arms and legs held straight and rigid, from brainstem damage; more serious than decorticate.
Papilledema | Swelling of the optic disc, a sign of raised intracranial pressure.
Glaucoma | An eye disease in which raised pressure damages the optic nerve and loses vision.
Retinal detachment | Separation of the retina from the back of the eye; an emergency.
Presbyopia | Age-related loss of near vision.
Otitis media | Infection or inflammation of the middle ear.
Nystagmus | Involuntary, rhythmic movement of the eyes.
Diplopia | Double vision.
Ptosis | Drooping of the upper eyelid.
Strabismus | Misalignment of the eyes; "crossed eyes".
Hypoglossal nerve | Cranial nerve XII; moves the tongue.
"""
G['Endocrine, Metabolic & Acid-Base'] = """
Hyperglycemia | High blood glucose.
Hypoglycemia | Low blood glucose.
Polydipsia | Excessive thirst.
Polyphagia | Excessive hunger.
Diabetic ketoacidosis | A life-threatening state of high blood glucose, ketones and acidosis from a lack of insulin.
Ketones | Acids made when the body burns fat for energy because it cannot use glucose.
Goiter | Enlargement of the thyroid gland.
Exophthalmos | Abnormal protrusion of the eyeballs, seen with Graves disease.
Myxedema | Severe hypothyroidism with swelling and thickened skin.
Thyroid storm | A life-threatening surge of thyroid hormone causing high fever, a fast heart rate and agitation.
Tetany | Muscle spasms, cramping and twitching, usually from low calcium.
Cushing syndrome | A condition of too much cortisol: truncal obesity, a round face, high blood pressure and thin skin.
Addison disease | Adrenal insufficiency; too little cortisol.
Diabetes insipidus | Too little antidiuretic hormone, causing large amounts of dilute urine and thirst.
SIADH | Syndrome of inappropriate antidiuretic hormone: too much ADH causes water retention and low blood sodium.
Homeostasis | The body's maintenance of a stable internal balance.
Metabolism | All the chemical processes in the body that make and use energy.
Hormone | A chemical messenger released into the blood by a gland.
Metabolic acidosis | Blood pH below 7.35 with a low bicarbonate level.
Metabolic alkalosis | Blood pH above 7.45 with a high bicarbonate level.
Respiratory acidosis | Blood pH below 7.35 with a high carbon dioxide level, from retaining CO2.
Respiratory alkalosis | Blood pH above 7.45 with a low carbon dioxide level, from blowing off CO2.
Hyperkalemia | An abnormally high potassium level in the blood.
Hypokalemia | An abnormally low potassium level in the blood.
Hypernatremia | An abnormally high sodium level in the blood.
Hyponatremia | An abnormally low sodium level in the blood.
Hypercalcemia | An abnormally high calcium level in the blood.
Hypocalcemia | An abnormally low calcium level in the blood.
Hypermagnesemia | An abnormally high magnesium level in the blood.
Hypomagnesemia | An abnormally low magnesium level in the blood.
Isotonic | A fluid with the same concentration of particles as blood, so it does not shift water in or out of cells.
Hypotonic | A fluid with a lower concentration than blood; water moves into cells.
Hypertonic | A fluid with a higher concentration than blood; water moves out of cells.
Dehydration | Too little water in the body.
"""
G['Blood & Immune'] = """
Hemolysis | Breakdown of red blood cells.
Hematocrit | The percent of blood volume made up of red blood cells.
Hemoglobin | The protein in red blood cells that carries oxygen.
Ferritin | The protein that stores iron in the body.
Leukocytosis | An abnormally high white blood cell count.
Leukopenia | An abnormally low white blood cell count.
Neutropenia | A low neutrophil count; a high risk of infection.
Thrombocytopenia | A low platelet count; a risk of bleeding.
Polycythemia | Too many red blood cells.
Coagulation | The process of blood clotting.
Hemostasis | The stopping of bleeding.
Hemophilia | An inherited bleeding disorder caused by missing clotting factors.
Disseminated intravascular coagulation | Widespread, abnormal clotting that uses up clotting factors and leads to bleeding (DIC).
Anaphylaxis | A severe, life-threatening allergic reaction.
Hypersensitivity | An exaggerated immune response to a substance.
Autoimmune disease | A disease in which the immune system attacks the body's own tissues.
Immunocompromised | Having a weakened immune system.
Antigen | A substance that triggers an immune response.
Antibody | A protein made by the immune system to fight an antigen.
Sepsis | A life-threatening response to infection that causes organ dysfunction.
Bacteremia | Bacteria in the blood.
Transfusion reaction | A harmful reaction to donated blood, such as fever, chills, hives or breathing trouble.
Sickle cell crisis | A painful episode when sickled red blood cells block blood flow.
"""
G['Infection Control'] = """
Asepsis | Freedom from disease-causing microorganisms.
Nosocomial infection | An infection acquired in a health care setting.
Fomite | An object that can carry infection, such as a stethoscope or bed rail.
Vector | An organism, such as a mosquito or tick, that carries disease to people.
Carrier | A person who harbors an infectious agent and can spread it without having symptoms.
Pathogen | A microorganism that causes disease.
Standard precautions | Infection-control practices used with every client, such as hand hygiene and gloves for body fluids.
Airborne precautions | For diseases spread by tiny particles that stay in the air (TB, measles, varicella): a private negative-pressure room and an N95 respirator.
Droplet precautions | For diseases spread by larger respiratory droplets (influenza, rubella, mumps): a surgical mask within about 3 feet.
Contact precautions | For diseases spread by touch (C. diff, MRSA, scabies): gloves and a gown.
Protective isolation | Precautions that protect a client with a weak immune system from infection.
Bactericidal | Kills bacteria.
Bacteriostatic | Stops bacteria from multiplying without killing them.
"""
G['Musculoskeletal & Skin'] = """
Arthralgia | Joint pain.
Myalgia | Muscle pain.
Osteoporosis | Loss of bone density that makes bones fragile.
Osteomyelitis | A bone infection.
Contracture | Permanent shortening of a muscle or joint that limits movement.
Atrophy | Wasting or decrease in size of a tissue or muscle.
Hypertrophy | An increase in the size of a tissue or organ.
Dislocation | A bone displaced completely out of its joint.
Subluxation | A partial dislocation of a joint.
Compartment syndrome | Dangerous pressure inside a muscle compartment that cuts off blood flow; signs are pain, pressure, paralysis, pulselessness, pallor and paresthesia.
Crepitus | A crackling or grating sensation or sound from bone ends, a joint, or air under the skin.
Reduction | Putting broken bone fragments back into alignment, either manually (closed) or by surgery (open).
Kyphosis | An excessive forward curve of the upper spine.
Scoliosis | A sideways curve of the spine.
Lordosis | An excessive inward curve of the lower spine.
Gout | Arthritis caused by uric acid crystals in a joint.
Bursitis | Inflammation of a bursa, the fluid-filled cushion near a joint.
Tendonitis | Inflammation of a tendon.
Debridement | Removal of dead or infected tissue from a wound.
Eschar | Dry, black, leathery dead tissue on a wound or burn.
Granulation tissue | New, moist, red tissue that fills in a healing wound.
Dehiscence | Separation of the edges of a closed surgical wound.
Evisceration | Protrusion of internal organs through an open wound.
Pressure injury | Damage to skin and tissue from prolonged pressure.
Cellulitis | A bacterial infection of the skin and the tissue beneath it.
Abscess | A pocket of pus.
Pustule | A small pus-filled bump on the skin.
Vesicle | A small fluid-filled blister.
Macule | A flat, discolored spot on the skin.
Papule | A small, raised, solid bump on the skin.
Alopecia | Hair loss.
Turgor | The skin's elasticity; skin that stays tented when pinched suggests dehydration.
Striae | Stretch marks.
Purulent drainage | Drainage that contains pus.
"""
G['Maternal-Newborn'] = """
Gravida | The number of times a woman has been pregnant, including the current pregnancy.
Primigravida | A woman in her first pregnancy.
GTPAL | Shorthand for pregnancy history: Gravida, Term births, Preterm births, Abortions, Living children.
Trimester | One of the three roughly 3-month periods of pregnancy.
Gestation | The length of a pregnancy, counted in weeks.
Fundus | The top, rounded part of the uterus; checked after birth for firmness.
Lochia | Vaginal discharge after birth: rubra (red), serosa (pink-brown), then alba (white or yellow).
Involution | The return of the uterus to its non-pregnant size after birth.
Colostrum | The first, thick, antibody-rich breast milk.
Effacement | Thinning of the cervix during labor, measured in percent.
Dilation | Opening of the cervix during labor, measured in centimeters from 0 to 10.
Station | How far the fetus's presenting part has moved down in relation to the ischial spines.
Presentation | The part of the fetus that enters the pelvis first, for example cephalic (head first) or breech.
Braxton Hicks contractions | Irregular, painless "practice" contractions of the uterus during pregnancy.
Quickening | The first time the mother feels the baby move, usually around 16 to 20 weeks.
Amniotic fluid | The fluid that surrounds and cushions the fetus.
Placenta previa | The placenta covers or lies near the cervical opening; classic sign is painless bright red bleeding.
Abruptio placentae | Early separation of the placenta from the uterine wall; classic signs are painful bleeding and a rigid abdomen.
Preeclampsia | Pregnancy-induced high blood pressure with protein in the urine and swelling.
Eclampsia | Preeclampsia with seizures.
Hyperemesis gravidarum | Severe, persistent nausea and vomiting in pregnancy.
Ectopic pregnancy | A pregnancy that implants outside the uterus, usually in a fallopian tube.
Postpartum hemorrhage | Excess bleeding after birth: more than 500 mL after a vaginal birth or 1,000 mL after a cesarean.
Vernix caseosa | The white, cheesy coating on a newborn's skin.
Lanugo | Fine, soft hair on a newborn's body.
Molding | Temporary shaping of the newborn's head as it passes through the birth canal.
Rh sensitization | When an Rh-negative mother makes antibodies against Rh-positive fetal blood; prevented with Rho(D) immune globulin.
Dystocia | Difficult or abnormal labor.
Leopold maneuvers | A series of abdominal palpations used to find the fetal position.
"""
G['Pediatrics'] = """
Congenital | Present at birth.
Anomaly | A structural abnormality.
Atresia | Absence or closure of a normal body opening or tube, such as esophageal atresia.
Pyloric stenosis | Narrowing of the opening between the stomach and small intestine, causing forceful projectile vomiting.
Hirschsprung disease | Missing nerve cells in part of the colon, causing a bowel obstruction.
Cleft lip and palate | A gap in the lip or roof of the mouth present at birth.
Hydrocephalus | Excess cerebrospinal fluid in the brain.
Failure to thrive | Poor weight gain and growth in a child.
Croup | A viral infection with a barking cough and noisy breathing in.
Epiglottitis | Life-threatening swelling of the epiglottis, with drooling, a muffled voice and trouble swallowing.
Fontanel | A soft spot between the skull bones of an infant.
Cystic fibrosis | An inherited disease that causes thick mucus in the lungs and digestive tract.
Tetralogy of Fallot | A congenital heart defect with four features: pulmonary stenosis, ventricular septal defect, overriding aorta and right ventricular hypertrophy.
"""
G['Mental Health'] = """
Affect | The outward expression of emotion that others can observe.
Mood | A person's sustained inner emotional state.
Flat affect | Little or no visible emotional expression.
Labile affect | Rapid, exaggerated swings in emotional expression.
Delusion | A fixed false belief that does not change with evidence.
Hallucination | Sensing something that is not there, such as hearing voices.
Illusion | Misinterpreting a real stimulus, such as seeing a coat as a person.
Paranoia | Intense, unreasonable suspicion or fear that others intend harm.
Suicidal ideation | Thoughts about ending one's own life.
Obsession | A recurring, intrusive thought that causes anxiety.
Compulsion | A repetitive behavior done to relieve the anxiety caused by obsessions.
Phobia | An intense, irrational fear of a specific object or situation.
Anhedonia | Inability to feel pleasure.
Apathy | Lack of interest or emotion.
Euphoria | An exaggerated feeling of well-being.
Mania | A period of abnormally elevated, expansive or irritable mood with high energy and a lowered need for sleep.
Psychosis | Loss of contact with reality, with delusions or hallucinations.
Catatonia | A state of immobility or stupor, or purposeless excess movement, in severe mental illness.
Echolalia | Repeating words that others say.
Neologism | A made-up word that has meaning only to the speaker.
Clang association | Choosing words because they rhyme or sound alike rather than for their meaning.
Flight of ideas | Rapid jumping from one topic to another with only a loose connection.
Loose associations | Speech that moves between unrelated topics.
Word salad | Jumbled words and phrases that make no sense together.
Blocking | A sudden stop in the flow of speech or thought.
Tangentiality | Wandering away from the topic and never returning to it.
Tolerance | Needing more of a substance over time to get the same effect.
Dependence | A physical or psychological need for a substance, with withdrawal if it is stopped.
Withdrawal | Symptoms that occur when a person who is dependent on a substance suddenly stops it.
Detoxification | Supervised clearing of a substance from the body while managing withdrawal.
Defense mechanism | An unconscious mental strategy used to reduce anxiety.
Denial | Refusing to accept reality.
Regression | Returning to the behavior of an earlier stage of development.
Displacement | Shifting feelings from the real target to a safer one.
Repression | Pushing painful thoughts out of awareness.
Rationalization | Making logical-sounding excuses for behavior.
Splitting | Seeing people as all good or all bad.
Therapeutic communication | Purposeful communication that builds trust and helps the client, using open-ended questions, active listening and reflection.
Milieu therapy | Using the whole environment of a unit as a tool for treatment.
Tardive dyskinesia | Involuntary, repetitive movements of the face and mouth, such as lip smacking, tongue twisting and chewing, from long-term use of some antipsychotics.
Extrapyramidal symptoms | Movement side effects of some antipsychotics: dystonia, akathisia, parkinsonism and tardive dyskinesia.
"""
G['Procedures & Tests'] = """
Biopsy | Removal of a small piece of tissue to examine under a microscope.
Endoscopy | Looking inside the body with a lighted, flexible scope.
Colonoscopy | An endoscopic examination of the entire colon.
EGD | Esophagogastroduodenoscopy: a scope exam of the esophagus, stomach and first part of the small intestine.
Bronchoscopy | Looking into the airways with a scope.
Cystoscopy | Looking inside the bladder with a scope.
Angiography | X-ray imaging of blood vessels using contrast dye.
Cardiac catheterization | A catheter is threaded to the heart to look at blood flow in the coronary arteries and chambers.
Thoracentesis | Removing fluid from the pleural space with a needle.
Paracentesis | Removing fluid from the abdominal cavity with a needle.
Lumbar puncture | A needle placed in the lower spine to collect cerebrospinal fluid.
Bone marrow aspiration | Removing liquid bone marrow, usually from the sternum or iliac crest.
Computed tomography | Cross-sectional X-ray imaging (CT scan).
Magnetic resonance imaging | Imaging with magnets and radio waves; metal objects, pacemakers and some implants are not allowed (MRI).
Ultrasound | Imaging with sound waves.
Echocardiogram | An ultrasound of the heart.
Electrocardiogram | A recording of the heart's electrical activity (ECG or EKG).
Electroencephalogram | A recording of the brain's electrical activity (EEG).
Electromyography | A recording of the electrical activity of muscles (EMG).
Mammography | An X-ray of breast tissue.
Pap test | A cell sample from the cervix to screen for cervical cancer.
Venipuncture | Puncturing a vein to draw blood or start an IV.
Intubation | Placing a tube into the airway.
Gastrostomy tube | A feeding tube placed through the abdominal wall into the stomach.
Nasogastric tube | A tube passed through the nose into the stomach for feeding or suction.
Enema | Fluid placed in the rectum to stimulate bowel emptying.
Lavage | Washing out a body cavity or organ.
Transfusion | Giving blood or blood products through a vein.
Dialysis | A treatment that removes waste and extra fluid when the kidneys fail.
Arterial blood gas | A blood test from an artery that measures pH, carbon dioxide, oxygen and bicarbonate (ABG).
Complete blood count | A blood test counting red cells, white cells and platelets, with hemoglobin and hematocrit (CBC).
Hemoglobin A1C | A blood test showing average blood glucose control over about the past 3 months.
Blood urea nitrogen | A lab measure of nitrogen waste in the blood; it rises with kidney problems and dehydration (BUN).
Creatinine | A waste product from muscle; the blood level rises in kidney disease.
INR | International normalized ratio: a standardized clotting-time test used to monitor warfarin.
aPTT | Activated partial thromboplastin time: a clotting test used to monitor heparin.
Troponin | A protein released when heart muscle is injured; the most specific blood marker for a heart attack.
BNP | Brain natriuretic peptide: a blood test that rises in heart failure.
Culture and sensitivity | A test that grows the organism from a specimen and shows which antibiotics will work.
Tonometry | Measuring the pressure inside the eye.
Snellen chart | An eye chart used to test visual acuity.
"""
G['Pharmacology'] = """
Agonist | A drug that activates a receptor to produce an effect.
Antagonist | A drug that blocks a receptor.
Indication | The reason a drug is used.
Contraindication | A condition in which a drug should not be used.
Side effect | A secondary, usually predictable effect of a drug at a normal dose.
Adverse effect | A harmful or unwanted effect of a drug.
Toxicity | Harmful effects from too much of a drug in the body.
Therapeutic range | The blood level at which a drug works without being toxic.
Half-life | The time it takes for the amount of a drug in the body to fall by half.
Loading dose | A larger first dose given to reach a therapeutic level quickly.
Titrate | Adjust a dose gradually to get the desired effect.
Bolus | A dose given all at once.
Prophylaxis | Treatment given to prevent a disease.
Antidote | A substance that reverses or counteracts a drug or poison.
First-pass effect | The liver breaking down part of an oral drug before it reaches the rest of the body.
Parenteral | Given by a route other than the digestive tract, usually by injection.
Enteral | Given through the digestive tract, by mouth or feeding tube.
Sublingual | Under the tongue.
Buccal | Between the cheek and gum.
Transdermal | Through the skin, such as by a patch.
Intradermal | Into the skin layers, as with a TB skin test.
Subcutaneous | Into the fatty tissue under the skin.
Intramuscular | Into a muscle.
Intravenous | Into a vein.
Idiosyncratic reaction | An unexpected, unusual reaction to a drug.
Controlled substance | A drug regulated by law because of its potential for abuse, such as opioids.
Generic name | The official, non-brand name of a drug.
Brand name | The manufacturer's trade name for a drug.
Rights of medication administration | Checks to prevent errors: right client, drug, dose, route and time, plus right documentation, reason and response.
Polypharmacy | Use of many medications at once, raising the risk of interactions.
Rebound hypertension | A sudden rise in blood pressure after an antihypertensive is stopped abruptly.
"""
G['Safety, Legal & Management'] = """
Standard of care | What a reasonably prudent nurse would do in the same situation.
Negligence | Failing to act as a reasonably prudent nurse would, causing harm.
Malpractice | Negligence by a professional who is licensed, causing harm.
Assault | A threat or attempt to touch someone without consent.
Battery | Actual unwanted touching of a person without consent.
Defamation | A false statement that harms a person's reputation; libel is written and slander is spoken.
False imprisonment | Unjustified confinement of a person against their will.
Informed consent | A client's voluntary agreement to treatment after understanding the risks, benefits and alternatives.
Living will | An advance directive stating which treatments a person does or does not want at the end of life.
Durable power of attorney for health care | A person named to make health decisions for someone who cannot.
HIPAA | The U.S. law that protects the privacy of health information.
Confidentiality | Keeping client information private.
Delegation | Handing a task to another person while the nurse stays accountable for the outcome.
Scope of practice | The actions a licensed professional is legally allowed to perform.
Incident report | A factual, non-judgmental record of an unusual event; it is not mentioned in the client's chart.
Chain of command | The line of authority to follow when reporting a concern.
Triage | Sorting clients by urgency of need: red is immediate, yellow delayed, green minor, black expectant or deceased.
SBAR | A communication format: Situation, Background, Assessment, Recommendation.
Autonomy | The client's right to make their own decisions.
Beneficence | Acting to do good for the client.
Nonmaleficence | Doing no harm.
Justice | Fairness in the distribution of care.
Fidelity | Keeping promises and commitments.
Veracity | Telling the truth.
Restraint | Any device or action that limits a person's movement; use the least restrictive option and only when needed for safety.
Sentinel event | An unexpected event that causes death or serious harm.
Maslow's hierarchy | Ranking of needs from physiological and safety needs up to love and belonging, esteem and self-actualization; meet the lower needs first.
Nursing process | The five steps nurses use: assessment, diagnosis, planning, implementation and evaluation.
ABCs | Airway, breathing, circulation: the first priorities when a client is unstable.
"""
G['Body Position, Movement & Direction'] = """
Supine | Lying on the back, face up.
Prone | Lying face down.
Lateral position | Lying on one side.
Fowler's position | Sitting up with the head of the bed raised to about 45 to 60 degrees.
Semi-Fowler's position | The head of the bed raised to about 30 to 45 degrees.
Trendelenburg position | The head lower than the feet.
Reverse Trendelenburg position | The head higher than the feet.
Sims' position | Lying on the side with the lower arm behind the body and the upper knee bent.
Lithotomy position | Lying on the back with the legs raised and supported in stirrups.
Knee-chest position | Kneeling with the chest resting on the bed.
Flexion | Bending a joint to decrease the angle.
Extension | Straightening a joint to increase the angle.
Abduction | Moving a limb away from the midline of the body.
Adduction | Moving a limb toward the midline of the body.
Rotation | Turning a part around its axis.
Circumduction | Moving a limb in a circle.
Dorsiflexion | Pulling the foot or toes up toward the shin.
Plantar flexion | Pointing the foot or toes down.
Pronation | Turning the palm down.
Supination | Turning the palm up.
Range of motion | How far a joint can move.
Ambulation | Walking.
Anterior | Toward the front of the body.
Posterior | Toward the back of the body.
Superior | Above, toward the head.
Inferior | Below, toward the feet.
Medial | Toward the midline of the body.
Lateral | Away from the midline, toward the side.
Proximal | Closer to the trunk or point of attachment.
Distal | Farther from the trunk or point of attachment.
Unilateral | On one side.
Bilateral | On both sides.
"""
G['Word Parts: Prefixes'] = """
a-, an- | Without or not (anemia, apnea).
ab- | Away from.
ad- | Toward.
anti- | Against.
bi- | Two.
brady- | Slow.
circum- | Around.
contra- | Against or opposite.
dys- | Difficult, painful or abnormal.
endo- | Within or inside.
epi- | Upon or above.
erythro- | Red.
ex-, exo- | Outside or out of.
extra- | Outside of.
hemi- | Half.
hemo-, hema- | Blood.
hyper- | Above or excessive.
hypo- | Below or deficient.
inter- | Between.
intra- | Within.
leuko- | White.
macro- | Large.
micro- | Small.
mal- | Bad or poor.
melano- | Black.
neo- | New.
oligo- | Few or scanty.
pan- | All.
para- | Beside, near or abnormal.
peri- | Around.
poly- | Many or much.
post- | After.
pre- | Before.
pseudo- | False.
retro- | Backward or behind.
sub- | Under or below.
supra- | Above.
tachy- | Fast.
trans- | Across or through.
tri- | Three.
uni- | One.
"""
G['Word Parts: Suffixes'] = """
-algia, -dynia | Pain.
-cele | Hernia or swelling.
-centesis | Puncture to remove fluid.
-cyte | Cell.
-ectomy | Surgical removal.
-emia | Condition of the blood.
-gram | The record or picture produced.
-graphy | The process of recording.
-itis | Inflammation.
-lysis | Breakdown or destruction.
-malacia | Softening.
-megaly | Enlargement.
-oma | Tumor or mass.
-osis | An abnormal condition.
-ostomy | Creating a surgical opening.
-otomy | Cutting into; an incision.
-pathy | Disease.
-penia | Deficiency or too few.
-phagia | Eating or swallowing.
-phasia | Speech.
-plasty | Surgical repair.
-plegia | Paralysis.
-pnea | Breathing.
-rrhage, -rrhagia | Bursting forth; heavy bleeding.
-rrhea | Flow or discharge.
-scopy | Looking inside with a scope.
-spasm | Involuntary contraction.
-stasis | Stopping or controlling.
-uria | A condition of the urine.
"""
G['Word Parts: Roots'] = """
adren/o | Adrenal gland.
aden/o | Gland.
angi/o | Vessel.
arteri/o | Artery.
arthr/o | Joint.
bronch/o | Bronchus (airway).
cardi/o | Heart.
carcin/o | Cancer.
cephal/o | Head.
cholecyst/o | Gallbladder.
col/o, colon/o | Colon.
cyan/o | Blue.
cyst/o | Bladder or sac.
derm/o, dermat/o | Skin.
encephal/o | Brain.
enter/o | Intestine.
erythr/o | Red.
gastr/o | Stomach.
glyc/o | Sugar (glucose).
hemat/o | Blood.
hepat/o | Liver.
hyster/o | Uterus.
laryng/o | Larynx (voice box).
leuk/o | White.
lip/o | Fat.
lith/o | Stone.
mast/o | Breast.
my/o | Muscle.
nephr/o, ren/o | Kidney.
neur/o | Nerve.
ocul/o, ophthalm/o | Eye.
oste/o | Bone.
ot/o | Ear.
pancreat/o | Pancreas.
path/o | Disease.
pharyng/o | Throat.
phleb/o, ven/o | Vein.
pneum/o, pneumon/o | Lung or air.
psych/o | Mind.
pulmon/o | Lung.
rhin/o | Nose.
splen/o | Spleen.
thromb/o | Blood clot.
ur/o | Urine or the urinary tract.
"""
G['Abbreviations'] = """
NPO | Nothing by mouth.
PRN | As needed.
STAT | Immediately.
BID | Twice a day.
TID | Three times a day.
QID | Four times a day.
HS | At bedtime.
AC | Before meals.
PC | After meals.
PO | By mouth.
IV | Intravenous.
IM | Intramuscular.
SubQ | Subcutaneous.
SL | Sublingual.
PR | By rectum.
OTC | Over the counter.
BP | Blood pressure.
HR | Heart rate.
RR | Respiratory rate.
SpO2 | Oxygen saturation measured by pulse oximetry.
I&O | Intake and output.
ADL | Activities of daily living.
ROM | Range of motion.
CVA | Cerebrovascular accident; a stroke.
MI | Myocardial infarction; a heart attack.
HF | Heart failure.
COPD | Chronic obstructive pulmonary disease.
DVT | Deep vein thrombosis.
PE | Pulmonary embolism.
UTI | Urinary tract infection.
GERD | Gastroesophageal reflux disease.
DM | Diabetes mellitus.
HTN | Hypertension.
CKD | Chronic kidney disease.
AKI | Acute kidney injury.
ICP | Intracranial pressure.
TPN | Total parenteral nutrition.
PICC | Peripherally inserted central catheter.
Joint Commission "Do Not Use" list | Abbreviations that are easily misread and should be written out: U or u (unit), IU, Q.D./QD/q.d., Q.O.D., trailing zero (5.0 mg), missing leading zero (.5 mg), MS, MSO4 and MgSO4.
"""
