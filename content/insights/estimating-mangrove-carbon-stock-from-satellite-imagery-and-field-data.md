---
title: "Estimating mangrove carbon stock from satellite imagery and field data"
date: 2026-08-20
summary: "Combining ground-truth field quadrat sampling with Sentinel-2 multispectral telemetry provides a scalable, verifiable methodology for blue carbon inventory accounting in tropical coastal reserves."
tags: ["Case study", "geospatial", "carbon stock", "remote sensing"]
author: "Meditya Wasesa, B. Prasetyo"
affiliation: "Institut Teknologi Bandung · Meditya Wasesa Analytics"
type: "Case study"
related_project: "mangrove-analytics"
cover: "/images/insights/mangrove-carbon-stock.svg"
draft: false
dummy: true
---

## Introduction

Estimating above-ground biomass and blue carbon stock in coastal mangrove forests requires balancing ground sampling precision with wide-area spatial coverage.

## Problem setting

Field biomass measurements are resource-intensive and restricted to accessible plots. Satellite remote sensing covers large regions but requires calibration against empirical field telemetry.

## Data

The dataset integrates 45 ground-truth quadrat measurements (tree diameter, height, species) with Sentinel-2 multispectral bands (B4, B8, B11) captured during dry-season passes.

## Method

Allometric equations convert field stem measurements to biomass density (Mg C/ha). Spectral vegetation indices—including NDVI and EVI—are extracted and regressed against field biomass using Random Forest regression.

## Validation

Cross-validation against 15 held-out field plots yielded a coefficient of determination $R^2 = 0.84$ and RMSE of 14.2 Mg C/ha (illustrative).

## Limitations

Cloud cover artifacts in equatorial regions limit temporal update frequencies. Dense canopy saturation can lead to biomass underestimation in old-growth zones.

## Conclusion

Fusing satellite imagery with ground quadrat surveys delivers transparent, repeatable carbon stock inventories for coastal conservation projects.

## References

1. Howard, J. et al. (2014). *Clarifying the role of coastal ecosystems in climate mitigation*. Conservation Letters.
