"""Regenerate the app's question data and practice UI from the sources in this folder.
Run from anywhere:  python3 tools/bank/export_app.py
Writes: data/questions.js, renderer/practice.js, renderer/quiz.css (and tools/bank/quiz.html for the web version)."""
import os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
os.chdir(HERE);sys.path.insert(0,HERE)
t=open('tpl.html').read()
css=re.search(r'<style>([\s\S]*?)</style>',t).group(1)
js=re.search(r'<script>([\s\S]*)</script>',t).group(1)
js=js.replace("const D=/*DATA*/;","""const D=window.QD;
try{const ex=await window.api.extraQuestions();
 if(ex&&ex.length){D.src.push('Class slides (imported)');const si=D.src.length-1;
  ex.forEach((q,i)=>{let ti=D.top.indexOf(q.topic);if(ti<0){D.top.push(q.topic||'From class slides');ti=D.top.indexOf(q.topic||'From class slides')}
   D.bank.push({id:100000+i,t:ti,s:q.srcLabel?(D.src.indexOf(q.srcLabel)<0?(D.src.push(q.srcLabel),D.src.length-1):D.src.indexOf(q.srcLabel)):si,q:q.q,o:q.o,a:q.a,r:q.r||'No rationale provided.'})})}}catch(e){}""")
js=js.replace("const app=$('#app');","const app=$('#practice');")
assert "$('#practice')" in js
open(os.path.join(ROOT,'renderer','practice.js'),'w').write("window.startPractice=async function(){\n"+js+"\n};")
open(os.path.join(ROOT,'renderer','quiz.css'),'w').write(css)
src=open('build.py').read()
exec(src.split("html=")[0])
open(os.path.join(ROOT,'data','questions.js'),'w').write("window.QD="+data+";")
open('quiz.html','w').write(open('tpl.html').read().replace('/*DATA*/',data))
print(len(bank),'questions written')
# Class-slide questions must be word for word from the decks: re-apply the verified corrections (and drop questions that are not on any slide)
import subprocess;subprocess.run([sys.executable,os.path.join(ROOT,'tools','slides','fix_class_questions.py')],check=True)
