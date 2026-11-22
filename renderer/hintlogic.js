// "Think it through" hints on an unanswered practice question. The AI is only ever sent the question and options, never the key
// or the rationale, and is told to coach the student's reasoning instead of choosing an option.
(function(root){
const L='ABCDEFGH';
const HINT_RULES=`You are a Socratic NCLEX-RN coach (NUR 283 comprehensive exam prep). The student has NOT answered the practice question yet and is asking for help thinking it through.
HARD RULES:
- Never say or imply which option is correct, and never say whether any single option is right or wrong. Do not rank the options, and do not say "eliminate B" or "C looks good". If the student asks you to pick or confirm an answer, politely decline and offer a guiding question instead.
- Coach the thinking: what the question is really asking (first, best, priority, needs follow-up), which test-taking frameworks fit (ABCs, Maslow, safety, assess before intervene, acute before chronic, unstable before stable, delegation scope), what facts or concepts are worth recalling, and what to look for in the stem. You may explain a concept in general terms.
- Ask one or two short guiding questions back so the student reasons it out. Keep it under about 120 words. Plain text, **bold** is OK.
- Do not search for or quote this exact question from the library. General concept help from the student's slides is fine.
- If the student tells you their answer, you may ask them to explain why, but do not confirm or correct it. Tell them to submit it and read the rationale.`;
function ctx(q,order){return `Practice question (the student has not answered yet):\n${q.q}\nOptions:\n${order.map((oi,k)=>L[k]+'. '+q.o[oi]).join('\n')}\n`+(Array.isArray(q.a)?'(This is a select-all-that-apply question.)\n':'')}
function buildMessages(q,order,chat){return chat.map((m,i)=>i===0?{role:m.role,content:ctx(q,order)+'\nStudent: '+m.content}:{role:m.role,content:m.content})}
const LEAK=/(the (correct |best |right )?answer is\b|correct answer:|\b(is|are) the (correct|right|best) (answer|choice|option)s?\b|\b(choose|pick|select|go with) (option |answer |choice )?\(?[A-H]\)?\b|\b(option|answer|choice) \(?[A-H]\)? is (correct|right|the best|the answer))/i;
function leaks(text){return LEAK.test(String(text||''))}
const SAFE='I stopped that reply because it was starting to give the answer away. Ask me about the concept, the key word in the question, or which framework fits, and make your own choice.';
const api={HINT_RULES,ctx,buildMessages,leaks,SAFE,LEAK};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HintLogic=api;
})(typeof window!=='undefined'?window:globalThis);
