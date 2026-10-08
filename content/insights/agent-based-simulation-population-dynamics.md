---
title: "Understanding Convolutions on Graphs"
date: 2026-09-15
summary: "Understanding the building blocks and design choices of graph neural networks."
tags: ["Methodology", "graph neural networks", "convolutions", "deep learning"]
author: "Meditya Wasesa"
affiliation: "Institut Teknologi Bandung · Meditya Wasesa Analytics"
type: "Methodology"
cover: "/images/insights/agent-based-simulation.svg"
draft: false
dummy: true
---

## Introduction

Many systems and interactions - social networks, molecules, organizations, citations, physical models, transactions - can be represented quite naturally as graphs. How can we reason about and make predictions within these systems?

One idea is to look at tools that have worked well in other domains: neural networks have shown immense predictive power in a variety of learning tasks. However, neural networks have been traditionally used to operate on fixed-size and/or regular-structured inputs (such as sentences, images and video). This makes them unable to elegantly process graph-structured data.

![Neural networks generally operate on fixed-size input vectors. How do we input a graph to a neural network?](https://distill.pub/2021/understanding-gnns/images/standard-neural-networks.svg)

Graph neural networks (GNNs) are a family of neural networks that can operate naturally on graph-structured data. By extracting and utilizing features from the underlying graph, GNNs can make more informed predictions about entities in these interactions, as compared to models that consider individual entities in isolation.

GNNs are not the only tools available to model graph-structured data: graph kernels and random-walk methods were some of the most popular ones. Today, however, GNNs have largely replaced these techniques because of their inherent flexibility to model the underlying systems better.

In this article, we will illustrate the challenges of computing over graphs, describe the origin and design of graph neural networks, and explore the most popular GNN variants in recent times. Particularly, we will see that many of these variants are composed of similar building blocks.

First, let’s discuss some of the complications that graphs come with.

## The Challenges of Computation on Graphs

### Lack of Consistent Structure

Graphs are extremely flexible mathematical models; but this means they lack consistent structure across instances. Consider the task of predicting whether a given chemical molecule is toxic:

![The molecular structure of non-toxic 1,2,6-trigalloyl-glucose.](https://distill.pub/2021/understanding-gnns/images/1,2,6-trigalloyl-glucose-molecule.svg)

![The molecular structure of toxic caramboxin.](https://distill.pub/2021/understanding-gnns/images/caramboxin-molecule.svg)

Looking at a few examples, the following issues quickly become apparent:
- Molecules may have different numbers of atoms.
- The atoms in a molecule may be of different types.
- Each of these atoms may have different number of connections.
- These connections can have different strengths.

Representing graphs in a format that can be computed over is non-trivial, and the final representation chosen often depends significantly on the actual problem.

### Node-Order Equivariance

Extending the point above: graphs often have no inherent ordering present amongst the nodes. Compare this to images, where every pixel is uniquely determined by its absolute position within the image!

![The same graph labelled in two different ways. The alphabets indicate the ordering of the nodes.](https://distill.pub/2021/understanding-gnns/images/node-order-alternatives.svg)

As a result, we would like our algorithms to be node-order equivariant: they should not depend on the ordering of the nodes of the graph. If we permute the nodes in some way, the resulting representations of the nodes as computed by our algorithms should also be permuted in the same way.

### Scalability

Graphs can be really large! Think about social networks like Facebook and Twitter, which have over a billion users. Operating on data this large is not easy.

Luckily, most naturally occuring graphs are ‘sparse’: they tend to have their number of edges linear in their number of vertices. We will see that this allows the use of clever methods to efficiently compute representations of nodes within the graph. Further, the methods that we look at here will have significantly fewer parameters in comparison to the size of the graphs they operate on.

## Problem Setting and Notation

There are many useful problems that can be formulated over graphs:
- **Node Classification:** Classifying individual nodes.
- **Graph Classification:** Classifying entire graphs.
- **Node Clustering:** Grouping together similar nodes based on connectivity.
- **Link Prediction:** Predicting missing links.
- **Influence Maximization:** Identifying influential nodes.

![Examples of problems that can be defined over graphs.](https://distill.pub/2021/understanding-gnns/images/graph-tasks.svg)

A common precursor in solving many of these problems is **node representation learning**: learning to map individual nodes to fixed-size real-valued vectors (called ‘representations’ or ‘embeddings’).

Different GNN variants are distinguished by the way these representations are computed. Generally, however, GNNs compute node representations in an iterative process. We will use the notation $h_v^{(k)}$ to indicate the representation of node $v$ after the $k^{\text{th}}$ iteration. Each iteration can be thought of as the equivalent of a ‘layer’ in standard neural networks.

We will define a graph $G$ as a set of nodes, $V$, with a set of edges $E$ connecting them. Nodes can have individual features as part of the input: we will denote by $x_v$ the individual feature for node $v \in V$.

For ease of exposition, we will assume $G$ is undirected, and all nodes are of the same type. These kinds of graphs are called ‘homogeneous’.

## Extending Convolutions to Graphs

Convolutional Neural Networks have been seen to be quite powerful in extracting features from images. However, images themselves can be seen as graphs with a very regular grid-like structure, where the individual pixels are nodes, and the RGB channel values at each pixel as the node features.

A natural idea, then, is to consider generalizing convolutions to arbitrary graphs. Recall, however, the challenges listed out in the previous section: in particular, ordinary convolutions are not node-order invariant, because they depend on the absolute positions of pixels.

We begin by introducing the idea of constructing polynomial filters over node neighbourhoods, much like how CNNs compute localized filters over neighbouring pixels. Then, we will see how more recent approaches extend on this idea with more powerful mechanisms.

The Chebyshev polynomials have certain interesting properties that make interpolation more numerically stable. We won’t talk about this in more depth here, but will advise interested readers to take a look at as a definitive resource.
