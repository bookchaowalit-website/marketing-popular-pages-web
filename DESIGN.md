# Design

Since 2026-11-19 this app uses the shared **Dashboard shell**: rules, pieces and the move recipe are in
[`DASHBOARD.md`](DASHBOARD.md). The earlier one-off look ("Route Board", navy and yellow) was retired so every
data page on `*.bookchaowalit.com` reads the same way; see git history for its old design notes.

App-specific pieces (in `app/globals.css`, prefix `pp-`): the movement figure, which always carries a sign and
an arrow as well as its colour (green up, red down), and the facts grid in the selected-page callout. The data
has no time series, so there is no line chart: the page list is the main panel.
