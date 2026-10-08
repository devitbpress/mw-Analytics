---
title: "From model to web tool: delivering simulation results to decision makers"
date: 2026-04-02
summary: "Translating desktop simulation models into web-based interactive dashboards enables non-technical stakeholders to explore scenario outcomes directly in their browser."
tags: ["Technical note", "web app", "decision support", "AnyLogic"]
author: "Meditya Wasesa, T. Setiawan"
affiliation: "Institut Teknologi Bandung · Meditya Wasesa Analytics"
type: "Technical note"
cover: "/images/insights/model-to-web.svg"
draft: false
dummy: true
---

## Introduction

Complex simulation models often remain trapped in specialist desktop environments, hindering direct engagement by executive decision makers.

## Problem setting

Providing static PDF reports limits stakeholder ability to test alternative parameter hypotheses or conduct sensitivity analysis.

## Data

Simulation output streams, parameter JSON configurations, and interactive web visualization state.

## Method

The simulation engine (Java / Python / AnyLogic API) is wrapped in a REST / WebSocket API microservice. A lightweight web frontend renders dynamic controls and chart outputs in real time.

## Validation

User engagement metrics demonstrated a 3x increase in scenario iterations conducted per meeting when using web dashboards compared to static reports (illustrative).

## Limitations

Asynchronous execution management is required when handling long-running stochastic simulation runs over HTTP connections.

## Conclusion

Web-delivered decision support tools turn analytical models into accessible interactive instruments for organizational decision-making.

## References

1. Power, D. J. (2002). *Decision Support Systems: Concepts and Resources for Managers*. Quorum Books.
