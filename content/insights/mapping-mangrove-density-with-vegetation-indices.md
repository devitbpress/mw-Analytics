---
title: "Mapping mangrove density with vegetation indices"
date: 2026-07-10
summary: "A technical evaluation of Normalized Difference Vegetation Index (NDVI) and Soil-Adjusted Vegetation Index (SAVI) performance in mapping mangrove canopy density across tidal zones."
tags: ["Methodology", "NDVI", "remote sensing", "geospatial"]
author: "Meditya Wasesa, N. Wijaya"
affiliation: "Institut Teknologi Bandung · Meditya Wasesa Analytics"
type: "Methodology"
related_project: "mangrove-analytics"
cover: "/images/insights/mangrove-density.svg"
draft: false
dummy: true
---

## Introduction

Canopy density mapping is essential for monitoring coastal ecosystem degradation and health trajectories across tidal zones.

## Problem setting

Optical remote sensing of intertidal mangroves suffers from background soil and water reflectance interference during high tide cycles.

## Data

Surface reflectance imagery from Sentinel-2 MSI at 10-meter spatial resolution, atmospheric correction applied via Sen2Cor algorithms.

## Method

NDVI and SAVI indices are computed across multi-temporal imagery passes:

$$ \text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}} $$

$$ \text{SAVI} = \frac{(\text{NIR} - \text{Red}) \cdot (1 + L)}{\text{NIR} + \text{Red} + L} $$

Where $L = 0.5$ accounts for background soil brightness in sparse intertidal vegetation.

## Validation

Accuracy assessment against high-resolution drone orthomosaics showed SAVI reduced background intertidal noise by 18% (illustrative).

## Limitations

Sun glint over open water channels during low tide can skew infrared band values if uncorrected.

## Conclusion

Adjusted spectral indices provide robust baseline maps for coastal vegetation monitoring platforms.

## References

1. Huete, A. R. (1988). A soil-adjusted vegetation index (SAVI). *Remote Sensing of Environment*, 25(3), 295-309.
