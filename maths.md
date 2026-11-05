---
layout: default
title: How to succeed at mathematics
permalink: /maths/
math: true
---

<p class="eyebrow">For students</p>

# How to succeed at mathematics

<p class="lede">The resources that got me from A-level to a PhD, in the order I would use them again, plus a growing set of my own problems with honest difficulty ratings.</p>

Most of what follows is free. None of it is a shortcut. The thing that actually works is doing a very large number of problems slightly above your level and writing out full solutions, so almost everything here is a source of problems.

## A-level and beyond

- **[MadasMaths](https://madasmaths.com)**: the single resource I would save from a fire. Thousands of A-level and further-maths questions, each with a full worked solution, sorted by topic and graded. I went through a large part of it. If you only use one thing on this page, use this.
- **[Underground Mathematics](https://undergroundmathematics.org)**: Cambridge-built, A-level level, but every problem is designed to make you think rather than apply a method. Good for the gap between "I can do the exercises" and "I understand this".
- **[NRICH](https://nrich.maths.org)**: rich problems from primary to sixth form. Pick the ones labelled challenging.
- **[UKMT](https://www.ukmt.org.uk)**: the Senior Maths Challenge and the BMO past papers. Even if you never sit them, they teach you to think in a competition register: fast, with no scaffolding.

## Admissions tests: STEP, MAT and TMUA

These are the papers that separate "good at A-level" from "ready for a maths degree", and they are also the best preparation for the degree itself, whether or not you need them for an offer.

- **STEP**: the [STEP Support Programme](https://maths.org/step/) from Cambridge is a free, structured course through the material, and the [STEP database](https://stepdatabase.maths.org) has every past question since 1987, searchable by topic, with solutions. Do STEP I questions until they feel routine, then STEP II. STEP III is a different animal and worth it only if you are aiming at the courses that require it.
- **MAT and TMUA**: Oxford's [MAT page](https://www.maths.ox.ac.uk/study-here/undergraduate-study/maths-admissions-test) and [TMUA page](https://www.maths.ox.ac.uk/r/tmua) have past papers and the official syllabus; Warwick keeps a good [TMUA support page](https://warwick.ac.uk/fac/sci/maths/studywithus/ug/entrance-exams/tmua-support/). These are multiple choice or short answer under time pressure, so practise them timed from the start.

My honest advice on all three: the first paper you try will go badly. That is the point. Mark it ruthlessly, read the solution to every question you got wrong *and* every question you got right by a different route, and do the next one a week later.

## University and beyond

- **[MIT OpenCourseWare](https://ocw.mit.edu)**: full lecture courses with problem sets. 18.01, 18.02 and 18.03 cover the first year of any maths degree; 18.06 (Strang's linear algebra) is the one course I would make everybody take.
- **[3Blue1Brown](https://www.3blue1brown.com)**: for intuition, not for problem-solving. Watch the linear algebra and calculus series before the corresponding courses, not instead of them.
- **[Project Euler](https://projecteuler.net)**: mathematics that you have to program your way through. The best way I know to learn to code as a mathematician.
- **[Art of Problem Solving](https://artofproblemsolving.com)**: the books and the forums. Deeper than UKMT if you catch the competition bug.
- **[Jane Street puzzles](https://www.janestreet.com/puzzles/)**: monthly, hard, and the write-ups on this site show the kind of thinking they reward.

## Problems

My own problems, written from scratch, each with a difficulty rating and a solution you can reveal. Ratings are relative to the paper named, so a STEP II problem rated 4 is a hard STEP II question, not a hard problem in general.

{% assign probs = site.problems | sort: "difficulty" %}
{% for p in probs %}
<div class="entry">
  <h3><a href="{{ p.url | relative_url }}">{{ p.title }}</a><span class="tag">{{ p.level }}</span><span class="tag">difficulty {{ p.difficulty }} / 5</span></h3>
  <div class="meta">{{ p.topics }}</div>
  {% if p.summary %}<p>{{ p.summary }}</p>{% endif %}
</div>
{% endfor %}

<p style="margin-top:2rem;color:var(--muted)">More problems and full mock papers to come.</p>
