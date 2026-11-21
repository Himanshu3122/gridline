---
title: "Why multi-agent LLM pipelines fail more often than their parts"
dek: "Chain five agents that each succeed 95% of the time and you're down to 77% end to end. The arithmetic of agent workflows, and why structure predicts cost and latency."
date: 2026-10-30
category: Multi-Agent AI
tags: [llm-agents, reliability, queueing-theory, latency]
---

Agent frameworks make it easy to wire language models together: a planner hands off to a researcher, which calls a coder, which calls a reviewer. Each step looks reliable in isolation. The pipeline as a whole often isn't. The reason is basic probability, and it is worth working through before you ship.

## Chains multiply failure

If a workflow is a **chain** of $n$ independent steps and step $i$ succeeds with probability $p_i$, the pipeline succeeds only if all of them do:

$$
\Pr[\text{success}] = \prod_{i=1}^{n} p_i.
$$

With $p_i = 0.95$:

| Steps $n$ | End-to-end success |
|---|---|
| 1 | 95.0% |
| 3 | 85.7% |
| 5 | 77.4% |
| 10 | 59.9% |

Reliability that looks fine per step falls fast as you add steps.

## Retries help, at a price

Allow each step up to $r$ attempts, and its success probability becomes $1 - (1-p_i)^{r}$. With $p = 0.95$ and $r = 2$, a step succeeds 99.75% of the time, and a 10-step chain recovers to about 97.5%. But the **expected number of calls** per step rises to $1 + (1-p) + \dots$, and every retry adds latency and tokens. Reliability, cost and latency trade off against each other through the same parameters.

## Fan-out: you wait for the slowest

When a planner fans out to $k$ parallel agents and waits for all of them, latency is the **maximum** of their latencies, not the average:

$$
T_{\text{fan-out}} = \max\big(T_1, \dots, T_k\big).
$$

For heavy-tailed LLM latencies, $\mathbb{E}[\max]$ grows noticeably with $k$. Adding parallel workers can make the median faster while making the tail worse.

## Branching: when agents spawn agents

Some workflows let agents spawn sub-agents. If each agent spawns on average $m$ children, the expected size of generation $g$ is $m^g$. That is a **branching process**, and the critical point is $m = 1$:

- $m < 1$: the tree dies out, and total work is finite with expected size $1/(1-m)$.
- $m \ge 1$: expected total work is unbounded, and for $m > 1$ the tree never dies out with positive probability, so cost can run away unless you cap depth.

## Structure predicts behaviour

The takeaway is that much of an agent system's **latency, failure rate and cost can be estimated from its structure** (chains, fan-outs, retry policies, branching factors) before you run it. Queueing theory adds the effect of contention when many workflows share the same model endpoints.

Before adding another agent to a workflow, write down its structure and do the arithmetic. It is cheaper than finding out in production.
