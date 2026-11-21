---
title: "The 6 kW floor: why cloud data center power doesn't fall with traffic"
dek: "Cut user traffic by more than 70% and the servers barely notice. A bivariate model of a multi-tenant cluster shows where the watts actually go."
date: 2026-07-15
category: AI Infrastructure
tags: [data-centers, energy-proportionality, stochastic-modeling, nhpp]
featured: true
---

There's a comfortable assumption in most conversations about data center energy: less traffic means less power. Fewer users at 3 a.m., fewer requests, a quieter bill. In a simulated multi-tenant cluster driven by real workload traces, that assumption fails badly. User traffic fell by **more than 70%**, and the facility still drew a **persistent 6 kW floor** against a peak of about **7.5 kW**.

Here's why. The short version is that a modern cloud cluster runs two loosely coupled processes, and only one of them follows the users.

## Two signals, not one

Most simple data center power models tie power directly to request rate. A more faithful model splits the problem into two independent stochastic signals:

1. **External traffic**: requests from users, which follow a daily cycle.
2. **Internal workload**: the compute the tenants' virtual machines do on their own, such as background jobs, replication and housekeeping.

Traffic is modeled as a **non-homogeneous Poisson process (NHPP)** with a time-varying rate $\lambda(t)$:

$$
\Pr\{N(t+\Delta) - N(t) = k\} = \frac{\Lambda^k e^{-\Lambda}}{k!}, \qquad \Lambda = \int_t^{t+\Delta} \lambda(s)\, ds
$$

Backend workloads were fitted to the **Materna GWA Trace-1** dataset. Across candidate distributions, a **Lognormal** fit won on Akaike Information Criterion (AIC) after Maximum Likelihood Estimation:

$$
\hat{\mu} = \frac{1}{n}\sum_i \ln x_i, \qquad \hat{\sigma}^2 = \frac{1}{n}\sum_i (\ln x_i - \hat{\mu})^2, \qquad \text{AIC} = 2k - 2\ln \hat{L}
$$

## The cluster

The simulated environment was a multi-tenant cloud: **520 virtual machines** on **49 physical server blades** with **69 CPU cores**. Power was computed with a linear superposition model, in which each server's draw is its idle power plus a term proportional to its utilization:

$$
P_{\text{cluster}}(t) = \sum_{j=1}^{49} \Big[ P_{\text{idle},j} + \big(P_{\text{max},j} - P_{\text{idle},j}\big)\, u_j(t) \Big]
$$

The idle term doesn't depend on $u_j(t)$ at all, and that's where the floor comes from.

## Where the floor comes from

When traffic collapses overnight, two things keep the meter running:

- **Idle power doesn't scale down.** Every powered-on blade pays its $P_{\text{idle}}$ regardless of load. With 49 blades on and utilization this low, the floor sits close to that idle sum.
- **Internal workload doesn't sleep.** Baseline compute utilization stayed around **7.4%** even at the traffic trough, because tenant VMs keep running their own processes.

So the dynamic range is narrow: the gap between the floor and the peak is only about 1.5 kW. Most of the energy a cluster like this uses isn't serving anyone at that moment.

> A cluster that draws 80% of its peak power to serve 30% of its peak traffic isn't energy-proportional. It's an always-on load with a small variable component.

## Why this matters for the grid

For a grid operator this cuts both ways. The floor makes the load **predictable**, which is good for planning. But it also means data centers give little *natural* flexibility: you can't count on load falling when demand drops, because most of it isn't demand-driven.

Three practical levers follow from the model:

| Lever | What it attacks | Trade-off |
|---|---|---|
| Server consolidation / power-off | $\sum P_{\text{idle}}$ | Wake-up latency, SLA risk |
| Workload shifting of internal jobs | Baseline $u_j(t)$ | Scheduling complexity |
| Better energy-proportional hardware | Slope vs. intercept | Capital cost |

## What's next

This model treats the cluster as a steady-state load. The open question is what happens at **seconds-to-minutes** timescales, when GPU jobs start and stop in steps instead of drifting with a daily cycle. That's a different problem for the grid, covered in [Modeling AI data centers as dynamic grid loads](../ai-data-centers-as-grid-loads/).
