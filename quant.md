---
layout: default
title: Quant prep
permalink: /quant/
math: true
---

<p class="eyebrow">Interview preparation</p>

# Quant prep

<p class="lede">A growing bank of quant interview questions, each with a full written solution and a short Python script that checks the answer by brute force or exact computation. {{ site.quant.size }} so far.</p>

The format is deliberate. Every question gets three things: the answer, a derivation you could reproduce on a whiteboard, and code that would catch me if the derivation were wrong. The scripts are self-contained (NumPy, occasionally SciPy), print the exact and simulated answers side by side, and can be run with `python script.py`. Difficulty is out of 5 and is my honest view of how hard the question is under interview conditions, not how long the solution is.

Sources are the usual ones: *Heard on the Street*, *A Practical Guide to Quantitative Finance Interviews*, *Fifty Challenging Problems in Probability*, past Jane Street and Optiver questions as reported on the forums, and problems I have been set. Where a question is a known classic I say so; the solutions are mine.

{% assign cats = site.quant | map: "category" | uniq | sort %}
{% for c in cats %}
## {{ c }}
{% assign qs = site.quant | where: "category", c | sort: "difficulty" %}
{% for q in qs %}
<div class="entry">
  <h3><a href="{{ q.url | relative_url }}">{{ q.title }}</a><span class="tag">difficulty {{ q.difficulty }} / 5</span>{% if q.classic %}<span class="tag">classic</span>{% endif %}</h3>
  <div class="meta">{{ q.tags | join: " · " }}</div>
  {% if q.summary %}<p>{{ q.summary }}</p>{% endif %}
</div>
{% endfor %}
{% endfor %}

<p style="margin-top:2rem;color:var(--muted)">Adding questions continuously. Every script here lives in <a href="https://github.com/{{ site.github }}/{{ site.github }}.github.io/tree/main/assets/quant">assets/quant</a> and is run by <code>tools/quant_check.py</code> before anything is published.</p>
