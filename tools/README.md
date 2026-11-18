# Question-bank tools

The app's questions are generated, not hand-written in the app files.

## Rebuild after changing questions
    python3 tools/bank/export_app.py
This rewrites `data/questions.js`, `renderer/practice.js`, `renderer/quiz.css`, and `tools/bank/quiz.html` (the standalone web quiz).

## Where the questions live
- `tools/bank/b1.py` to `b4.py`: 196 questions from the practice PDFs. Each file has `S` (source label) and `B = [(question, [options], answerIndex, rationale), ...]`.
- `tools/bank/bank5.json`: 54 questions from the class PowerPoints. `a` is an index, or a list of indexes for select-all-that-apply. `t` is a topic code from `tmap.py`.
- `tools/bank/tmap.py`: topic for each of the first 196 questions (`M`) and the topic names (`TOP`).
- `tools/bank/tpl.html`: the quiz UI template (progress tracking, resume, select-all, follow-up chat).
- `tools/bank/build.py`: merges everything into one question list.

## Slide question extraction (for new PowerPoints)
`tools/slides/dump.js` parses decks to JSON, `auto.py` pairs question slides with answer slides ("Yes/No" explanations), and `mk5.py` builds `bank5.json` (it also holds hand-written entries for slides with no answer slide). These scripts were run from a scratch folder, so adjust paths as needed.

## Not covered
The Windows installer is built by GitHub Actions on each push to `main`, not locally.
