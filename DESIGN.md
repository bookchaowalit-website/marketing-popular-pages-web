---
name: Route Board
description: A sample traffic board that reads routes like a wayfinding system.
---

# Design System: Route Board

## Overview

Route Board is a local sample-analytics surface. It treats page performance like a quiet wayfinding board: choose a reading window, scan the route bars, and notice where attention lands. Static sample data is labeled as such, so the visual confidence never exceeds the product truth.

## Colors

- **Night** `#101a24`: ambient route-board ground.
- **Panel** `#172737`: data board surface.
- **Paper** `#f1eee4`: primary route text.
- **Yellow** `#f0c84b`: window selection and route-board instruction.
- **Cyan** `#8dd0ce`: relative route share and rising movement.
- **Red** `#e06f52`: boundary and no-live-connection signal.
- **Line** `#405666`: board structure.

Yellow marks the selected window; cyan is the measured route signal; red only marks the honesty boundary.

## Typography

Geist Sans carries the main statement and route descriptions. Geist Mono handles paths, sample values, percentages, statuses, and window controls so the board reads as measurement rather than decoration.

## Layout

The page moves from a large question and rotated sample stamp into one full-width board: time-window strip, three reading notes, then route rows. Each row keeps path, label, bar, value, status, and movement aligned; on mobile the bar becomes a second line beneath its route.

## Elevation & Depth

The dark panel against the night ground and thin blue-gray rules create a flat instrument surface. Route bars are the only visual magnitude; no shadow, sparkline, or floating KPI card is needed.

## Shapes

Rows and summary cells are rectangular like signage and a station board. The small rotated stamp is the only angled shape. Status is text-first, not a pill system.

## Components

- **Window strip:** 24H, 7D, and 30D controls with an explicit active state.
- **Route summary:** authored sample total, top route, and route count.
- **Route rows:** path, descriptive label, relative bar, sample visits, status, and movement.

## Do's and Don'ts

- Do let the route rows carry the information hierarchy.
- Do repeat that values are static sample data and not live analytics.
- Do keep yellow scarce and cyan tied to measured movement.
- Don't imply traffic collection, team authentication, or real-time monitoring.
- Don't replace the route board with a generic KPI card wall or decorative chart grid.
