---
layout: quant
title: "Make me a market on the sum of two dice"
category: Betting and sizing
difficulty: 3
tags: [market making, expected value, adverse selection]
classic: true
summary: "Fair value is 7, the standard deviation is about 2.4, and the interesting part is how wide to quote when the person on the other side has seen one of the dice."
---

## Question

I am going to roll two fair dice. Make me a two-sided market on their sum: a price at which you will buy and a price at which you will sell. Then: I tell you I have already seen one of the dice. How does your market change?

<details class="solution">
<summary>Solution</summary>

**Answer.** Fair value is $7$ with standard deviation $\sqrt{35/6} \approx 2.42$. Against an uninformed counterparty a market like $6.5$ at $7.5$ is reasonable. If the counterparty has seen one die, the sum they are trading against is $d + 3.5$ with $d$ known to them and not to you, so their information is worth up to $2.5$ either way: you must either widen to roughly $4.5$ at $9.5$, quote a size small enough that the loss is bearable, or decline to trade.

**Why.** *Fair value and risk.* Each die has mean $3.5$ and variance $\tfrac{35}{12}$, so the sum has mean $7$ and variance $\tfrac{35}{6}$. A market maker's spread covers two things: the risk of holding the position (proportional to the standard deviation times how much you dislike variance) and the expected loss to informed traders. With no information asymmetry, only the first matters and a spread of about one unit around $7$ is a sensible quote: wide enough to earn something, tight enough that someone will trade.

*Adverse selection.* Once the counterparty knows one die, their fair value is $d + 3.5 \in \{4.5, \dots, 9.5\}$ and they will only lift your offer when $d + 3.5 >$ your ask, or hit your bid when $d + 3.5 <$ your bid. Suppose you quote $b$ at $a$ symmetric around $7$, $a = 7 + s$, $b = 7 - s$. They buy when $d + 3.5 > 7 + s$, sell when $d + 3.5 < 7 - s$, and otherwise do nothing. Your expected profit per quote is

$$
\sum_{d:\,d+3.5 > 7+s} \tfrac16\,\big(a - (d + 3.5)\big) + \sum_{d:\,d+3.5 < 7-s} \tfrac16\,\big((d+3.5) - b\big),
$$

both sums being negative. With $s = 0.5$ (market $6.5$ at $7.5$): they buy for $d \in \{4,5,6\}$ losing you $0$, $1$, $2$, and sell for $d \in \{1,2,3\}$ losing you $2$, $1$, $0$. Expected loss $= \tfrac16(0+1+2+2+1+0) = 1$ per quote. With $s = 1.5$: they trade only for $d \in \{1, 6\}$, each losing you $1$, expected loss $\tfrac13$. With $s = 2.5$ they never trade profitably and your loss is zero, but you also never trade. So against a fully informed counterparty there is no spread at which you make money; the only reasons to quote are that you expect a mix of informed and uninformed flow, or that you are paid to provide liquidity.

The sentence the interviewer is listening for: "the spread is not about my uncertainty, it is about the difference between my information and theirs."

**Follow-ups an interviewer might ask.** What if the counterparty saw one die but you do not know which trades are informed, with half the flow uninformed? Then the quote that maximises expected profit balances the edge earned from uninformed flow against the loss to informed flow; set it up as above with mixing weights and solve. If they have seen *both* dice, the game is over: never quote. What is the fair value of the *product* of the two dice? $3.5^2 = 12.25$ by independence, with a much bigger standard deviation (about $8.9$), so you should quote wider.

</details>

## Code

```python
import numpy as np

faces = np.arange(1, 7)
sums = faces[:, None] + faces[None, :]
fv, sd = sums.mean(), sums.std()
print(f"sum of two dice: mean {fv:.2f}, sd {sd:.3f}")

def expected_pnl(s):
    """You quote 7-s at 7+s; counterparty knows one die d, trades only when profitable for them."""
    pnl = 0.0
    for d in faces:
        v = d + 3.5
        if v > 7 + s: pnl += (7 + s - v) / 6
        if v < 7 - s: pnl += (v - (7 - s)) / 6
    return pnl

for s in (0.5, 1.0, 1.5, 2.0, 2.5):
    print(f"half-spread {s}: expected P&L vs informed counterparty {expected_pnl(s):+.3f}")

# Monte Carlo check of the s = 0.5 case
rng = np.random.default_rng(7)
d = rng.integers(1, 7, size=2_000_000); e = rng.integers(1, 7, size=2_000_000)
v = d + 3.5
pnl = np.where(v > 7.5, 7.5 - (d + e), np.where(v < 6.5, (d + e) - 6.5, 0.0))
print(f"simulated P&L at half-spread 0.5: {pnl.mean():+.4f}")
ok = abs(expected_pnl(0.5) + 1.0) < 1e-12 and abs(pnl.mean() + 1.0) < 0.01 and abs(sd - np.sqrt(35/6)) < 1e-12
print("OK" if ok else "MISMATCH")
```
