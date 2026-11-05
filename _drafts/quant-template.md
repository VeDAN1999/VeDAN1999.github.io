---
layout: quant
title: "Question title"
category: Probability
difficulty: 3
tags: [expectation, Markov chains]
classic: false
summary: "One sentence on the question and the idea that cracks it."
source:
---

<!--
HOW TO ADD A QUANT QUESTION
1. Copy this file to _quant/short-slug.md (the slug becomes the URL and the script name).
2. category groups it on /quant/. Use one of: Probability, Brainteasers, Expected value,
   Martingales and stopping, Betting and sizing, Statistics, Options and pricing,
   Combinatorics, Linear algebra, Coding. Or add a new one; the index picks it up.
3. tags are free text. classic: true marks a well-known interview question.
4. Exactly ONE ```python block. It must print a line containing "OK" when the check passes.
5. Run  python tools/quant_check.py short-slug  before committing: it writes
   assets/quant/short-slug.py and runs it.
-->

## Question

State it.

<details class="solution">
<summary>Solution</summary>

**Answer.** The number first.

**Why.** The derivation.

**Follow-ups an interviewer might ask.** One or two variations and how the answer changes.

</details>

## Code

```python
import numpy as np

rng = np.random.default_rng(0)
exact = 1.0
sim = 1.0
print(f"exact {exact:.6f}   simulated {sim:.6f}")
print("OK" if abs(exact - sim) < 1e-2 else "MISMATCH")
```
