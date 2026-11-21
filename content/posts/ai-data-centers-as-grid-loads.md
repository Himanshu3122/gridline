---
title: "Modeling AI data centers as dynamic grid loads"
dek: "GPU clusters don't drift with the time of day. They jump. Here is how jump-diffusion processes and component-level models capture that, and why load frequency control cares."
date: 2026-06-20
category: Smart Grid
tags: [ai-data-centers, grid-stability, jump-diffusion, load-frequency-control]
---

Classic power system studies treat large loads as slow and smooth: industrial plants ramp, cities follow the sun. AI data centers break that picture. A training job that lands on thousands of GPUs moves facility power in a **step**, and an inference burst can do the same within seconds. Capturing this needs a dynamic load model that can feed into **load frequency control (LFC)** studies, for example in MATLAB/Simulink.

## Why smooth models fail

A diffusion-only model, in which power wanders around a mean with Gaussian noise, misses the defining feature of AI workloads: **discontinuities**. Jobs start, finish, checkpoint and fail. Each event shifts the operating point.

That is the textbook case for a **jump-diffusion** process:

$$
dP(t) = \mu\big(P, t\big)\,dt + \sigma\big(P, t\big)\,dW(t) + J\,dN(t)
$$

- $\mu$ captures slow trends such as the daily inference cycle,
- $\sigma\, dW$ captures fine-grained fluctuation,
- $J\, dN$ is a Poisson-driven jump with random size $J$: a job arriving or leaving.

## Component by component

Facility power isn't just GPUs. A useful model breaks the load into components, each with its own dynamics:

- **Compute** follows the workload, fast and jumpy.
- **Cooling** lags compute through thermal inertia, so it is slow.
- **Networking and storage** depend partly on load, with a large fixed share.
- **UPS and auxiliaries** respond to faults and reconnection events.

Each component gets an energy-proportional characteristic: a fixed share and a share that scales with load. That matters because, as the [6 kW floor](../the-6kw-floor/) analysis showed, the fixed share often dominates.

## The grid side: load frequency control

In an interconnected area, a sudden load change $\Delta P_L$ pulls system frequency away from nominal until governors and automatic generation control respond. In the standard single-area linearised model:

$$
\Delta f(s) = \frac{1}{2Hs + D}\Big[\Delta P_m(s) - \Delta P_L(s)\Big]
$$

where $H$ is inertia and $D$ is load damping. Feed a jump-diffusion $\Delta P_L(t)$ into this loop instead of a step or a ramp, and the question changes from "how big is the deviation?" to "**how often** and **how correlated** are the deviations?"

## The questions that matter

1. How large can an AI campus be, relative to an area's inertia, before its jumps threaten frequency limits?
2. Do slower cooling dynamics help, by smoothing net load, or hurt, by adding a delayed second disturbance?
3. What happens on **UPS reconnection** after a fault, when a large block of load returns to the grid at once? That is a transient stability problem as much as a frequency one.

Grid codes were written for loads that change slowly. As AI campuses grow toward the size of power plants, these questions move from academic to operational.
