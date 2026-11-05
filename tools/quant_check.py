#!/usr/bin/env python3
"""Extract and run the Python script from every quant question.

Each file in _quant/*.md holds the question, the written solution and a single
```python fenced block. This tool copies that block to assets/quant/<slug>.py
(so the site can link to it) and runs it, printing the output. A script that
raises, or whose output does not contain the line "OK", fails the check.

Usage:
    python tools/quant_check.py            # all questions
    python tools/quant_check.py some-slug  # one question
"""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "_quant"
OUT = ROOT / "assets" / "quant"
FENCE = re.compile(r"```python\s*\n(.*?)\n```", re.S)
FRONT = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)


def extract(md_path: pathlib.Path) -> pathlib.Path:
    text = md_path.read_text()
    fm = FRONT.match(text)
    title = ""
    if fm:
        m = re.search(r'^title:\s*"?(.*?)"?\s*$', fm.group(1), re.M)
        title = m.group(1) if m else ""
    blocks = FENCE.findall(text)
    if len(blocks) != 1:
        raise SystemExit(f"{md_path.name}: expected exactly one ```python block, found {len(blocks)}")
    OUT.mkdir(parents=True, exist_ok=True)
    py = OUT / (md_path.stem + ".py")
    header = f'"""{title}\n\nFrom https://vedan1999.github.io/quant/{md_path.stem}/\n"""\n'
    py.write_text(header + blocks[0].rstrip() + "\n")
    return py


def main(argv):
    wanted = set(argv)
    files = sorted(SRC.glob("*.md"))
    if wanted:
        files = [f for f in files if f.stem in wanted]
    failed = []
    for md in files:
        py = extract(md)
        print(f"\n=== {md.stem} ===")
        run = subprocess.run([sys.executable, "-I", str(py)], capture_output=True, text=True, cwd=ROOT)
        print(run.stdout.rstrip())
        if run.returncode != 0:
            print(run.stderr.rstrip())
            failed.append(md.stem)
        elif "OK" not in run.stdout:
            print("(no OK line in output)")
            failed.append(md.stem)
    print("\n" + ("all passed" if not failed else "FAILED: " + ", ".join(failed)))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
