---
title: "Non-homogeneous Poisson processes, explained for engineers"
dek: "Requests don't arrive at a constant rate. Here is the one model that handles daily cycles properly, with the math you need and 20 lines of Python to simulate it."
date: 2026-11-20
category: Explainers
tags: [stochastic-processes, poisson, simulation, python]
---

If you model traffic to a server, calls to an API or arrivals of jobs at a GPU cluster, you will meet the Poisson process. The textbook version assumes a **constant** arrival rate $\lambda$. Real systems don't work that way: traffic at 3 p.m. differs from traffic at 3 a.m. The fix is the **non-homogeneous Poisson process (NHPP)**.

## From constant to time-varying

A homogeneous Poisson process has independent increments and

$$
N(t) \sim \text{Poisson}(\lambda t).
$$

An NHPP keeps independent increments but lets the rate vary over time, $\lambda(t)$. Everything follows from the **cumulative intensity**:

$$
\Lambda(a, b) = \int_a^b \lambda(s)\, ds, \qquad N(b) - N(a) \sim \text{Poisson}\big(\Lambda(a,b)\big).
$$

The expected number of arrivals in any window is the area under $\lambda(t)$ over that window.

## A useful rate function

A daily cycle is well captured by a sinusoid around a mean:

$$
\lambda(t) = \bar{\lambda}\,\Big[1 + \alpha \sin\!\Big(\frac{2\pi t}{24} - \phi\Big)\Big], \qquad 0 \le \alpha < 1
$$

$\alpha$ sets the peak-to-trough swing and $\phi$ shifts the peak hour.

## Simulating it: thinning

The standard algorithm is **Lewis–Shedler thinning**. Generate candidate arrivals from a homogeneous process at the maximum rate $\lambda_{\max}$, then keep each candidate at time $t$ with probability $\lambda(t)/\lambda_{\max}$.

```python
import numpy as np

def simulate_nhpp(rate, t_end, rate_max, seed=0):
    """Arrival times on [0, t_end] for an NHPP with intensity rate(t) <= rate_max."""
    rng = np.random.default_rng(seed)
    t, arrivals = 0.0, []
    while True:
        t += rng.exponential(1.0 / rate_max)   # candidate from HPP(rate_max)
        if t > t_end:
            return np.array(arrivals)
        if rng.uniform() < rate(t) / rate_max:  # accept with prob rate(t)/rate_max
            arrivals.append(t)

lam_bar, alpha, phi = 100.0, 0.6, np.pi / 2
rate = lambda t: lam_bar * (1 + alpha * np.sin(2 * np.pi * t / 24 - phi))
arrivals = simulate_nhpp(rate, t_end=24.0, rate_max=lam_bar * (1 + alpha))
print(len(arrivals), "arrivals; expected", lam_bar * 24)
```

Thinning is exact, not an approximation. Its only cost is wasted candidates when $\lambda(t)$ is far below $\lambda_{\max}$ for long stretches.

## Fitting one to data

Given observed arrival times $t_1, \dots, t_n$ on $[0, T]$, the log-likelihood is

$$
\ell(\theta) = \sum_{i=1}^{n} \ln \lambda(t_i; \theta) - \int_0^T \lambda(s; \theta)\, ds,
$$

which you maximise numerically. Compare candidate rate shapes with AIC, $2k - 2\ell(\hat\theta)$, rather than by eye.

## When an NHPP is not enough

- **Bursty, self-exciting traffic**, where one event triggers more (retries, cascades): use a Hawkes process.
- **Rate that is itself random**, such as unpredictable demand shocks: use a Cox (doubly stochastic) process.
- **Discontinuous load levels**, where jobs switch power in steps: model the *load* with jump-diffusion and keep the NHPP for *arrivals*.

A good pattern for data center and LLM inference models is to let the NHPP drive the **arrivals** of requests, and put what those arrivals do to power in a separate model on top. Keeping the two layers apart makes each one easy to validate.
