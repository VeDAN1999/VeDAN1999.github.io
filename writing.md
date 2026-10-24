---
layout: default
title: Writing
permalink: /writing/
---

# Writing

<p class="lede">Puzzle solutions, short notes, and experiments in complex analysis and probability.</p>

{% if site.posts.size == 0 %}
<p style="color:var(--muted)">Nothing published yet. First up: Jane Street monthly puzzles.</p>
{% endif %}

{% assign series_list = site.posts | map: "series" | uniq | compact %}

{% for s in series_list %}
## {{ s }}
{% for post in site.posts %}{% if post.series == s %}
<div class="entry">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <div class="meta">{{ post.date | date: "%B %Y" }}</div>
  {% if post.summary %}<p>{{ post.summary }}</p>{% endif %}
</div>
{% endif %}{% endfor %}
{% endfor %}

{% assign loose = site.posts | where_exp: "p", "p.series == nil" %}
{% if loose.size > 0 %}
## Notes
{% for post in loose %}
<div class="entry">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <div class="meta">{{ post.date | date: "%B %Y" }}</div>
  {% if post.summary %}<p>{{ post.summary }}</p>{% endif %}
</div>
{% endfor %}
{% endif %}
