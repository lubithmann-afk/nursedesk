"""Pairs of questions (same question, same options) whose keyed answers disagree. See the question review report.
build.py adds a "Conflicting answer" note to the rationale of BOTH questions in each pair. Ids never change."""
PAIRS=[(2,566),(22,586),(23,587),(49,612),(73,538),(74,539),(78,543),(87,552),(88,553),(100,564),(126,712),(750,664)]
def note(me,other,src):
    a=lambda q:' / '.join(q['o'][k] for k in (q['a'] if isinstance(q['a'],list) else [q['a']]))
    s=src[other['s']]
    where=s.replace('Not Galen – ','the outside (not Galen) set "')+'"' if s.startswith('Not Galen') else 'your Galen practice test "'+s+'"'
    return ('\n\nConflicting answer: the same question in %s gives a different answer: "%s". Yours here is "%s". '
            'The two keys cannot both be what your instructor wants; check this one against your class materials.')%(where,a(other),a(me))
def apply(bank,src):
    by={q['id']:q for q in bank}
    for x,y in PAIRS:
        A,B=by[x],by[y]
        A['r']+=note(A,B,src);B['r']+=note(B,A,src)
