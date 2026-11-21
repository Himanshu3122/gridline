---
title: "Teaching an RL agent to schedule vehicle-to-grid on the IEEE 33-bus system"
dek: "Parked EVs are batteries on wheels. A reinforcement learning scheduler with three actions and 48 decisions a day shows what coordinated V2G can do for a distribution feeder."
date: 2025-08-25
category: Smart Grid
tags: [v2g, reinforcement-learning, distribution-systems, pso]
---

Electric vehicles spend most of their lives parked. With bidirectional chargers, that idle storage can push power back into the grid during peaks, which is **vehicle-to-grid (V2G)**. The hard part is coordination: a fleet that charges and discharges at the wrong times makes a distribution feeder worse, not better.

This post walks through a reinforcement learning (RL) scheduler for V2G on the **IEEE 33-bus** radial distribution test system, with dynamic energy pricing.

## The environment

The day is divided into **48 half-hour intervals**. At each step the agent observes **11 state features**, including price, load and battery state, and chooses one of **three actions**:

| Action | Effect |
|---|---|
| Charge | Draw from the grid |
| Discharge | Inject into the grid |
| Hold | Do nothing |

The reward balances cost against grid health, so that the agent earns from price arbitrage without pushing bus voltages or line losses in the wrong direction.

## Power flow in the loop

Every action changes the injections at the EV buses, so each step runs a **backward/forward sweep (BFS)** load flow, the standard method for radial feeders:

1. **Backward sweep:** sum branch currents from the leaves to the substation.
2. **Forward sweep:** update bus voltages from the substation outward.

$$
V_{j} = V_{i} - I_{ij}\,(R_{ij} + jX_{ij})
$$

Particle swarm optimisation (PSO) works alongside the RL agent on the placement and sizing side of the problem.

## Results

- **25% improvement in stability under peak load** compared with uncoordinated operation.
- **Sub-200 ms inference latency** per control decision, fast enough for real-time use.
- The combined BFS-PSO framework **reduced system power losses** under coordinated V2G scheduling.

## What's missing

A single-agent scheduler assumes one controller sees everything. Real fleets are mixed (two-, three- and four-wheelers), sit on weak low-voltage networks, and must **never** violate hard limits during learning. The natural next step is **constrained multi-agent RL with a safety projection**, where every action is projected onto a feasible set before it reaches the network, so that learning can't push the grid past its limits.
