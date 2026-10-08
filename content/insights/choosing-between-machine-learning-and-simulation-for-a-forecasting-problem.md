---
title: "Choosing between machine learning and simulation for a forecasting problem"
date: 2026-05-12
summary: "A methodological decision framework for determining whether predictive machine learning or dynamic simulation modeling is best suited for complex operational decision problems."
tags: ["Technical note", "machine learning", "simulation", "forecasting"]
author: "Meditya Wasesa"
affiliation: "Institut Teknologi Bandung · Meditya Wasesa Analytics"
type: "Technical note"
cover: "/images/insights/ml-vs-simulation.svg"
draft: false
dummy: true
---

## Introduction

Data analytics projects frequently face the architectural choice between statistical machine learning (ML) models and dynamic simulation systems.

## Problem setting

ML models excel at pattern recognition in static or equilibrium historical environments, but struggle when forecasting under unprecedented structural policy interventions or scenario changes.

## Data

Historical operational time-series data versus explicit system structure definitions (flow charts, causal feedback loops).

## Method

We evaluate candidate problems along three structural axes:

1. **Data Availability:** High-density historical logs favor ML architectures.
2. **Causal Interventions:** Policy testing under unobserved conditions requires dynamic simulation.
3. **Interpretability:** Stakeholder auditing needs inspectable causal mechanics.

## Validation

Case evaluation showed dynamic simulation outperformed ML in policy intervention scenarios by 24% lower error under structural shift (illustrative).

## Limitations

Hybrid approaches combining ML parameter estimation with simulation models require dual validation workflows.

## Conclusion

Choosing the right modeling paradigm depends directly on whether the primary goal is pattern extrapolating or causal scenario evaluation.

## References

1. Law, A. M. (2015). *Simulation Modeling and Analysis*. McGraw-Hill.
