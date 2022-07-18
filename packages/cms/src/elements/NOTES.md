# Rethinking CMS Structures and Configuration

## Goals

Elements on the dashboard like charts and KPIs require data from different
locations. With the addition of timeline configurations which we'd like to store
in the CMS, we will add another source:

1. lokalize short-copy
2. code based metric configurations (thresholds, isPercentage, color mappings,
   etc.)
3. options directly set via props (time series config)
4. cms data content (timeline events)

Because all of these things are structured differently, we currently have to tie
everything together manually for every component on every page.

This document is an attempt at improving this in such a way that:

- Doesn't require a massive amount of refactoring
- Makes components and pages more declarative / less imperative
- Moves us into a more structured approach especially for lokalize texts
  definition. This not only cleans things up but is also a stepping stone for
  storing things in the CMS later.

## Globally Unique Identifier

In order to connect page components to data and configurations we could identify
each unique instance via the following properties:

1. scope (nl,vr,gm,in)
2. metric name (sewer)
3. component type (time-series)
4. (optional) metric property (\*)

The scopes would be:

- nl: national
- vr: safety-region
- gm: municipality

This combination of properties should be sufficient to generate a globally
unique id for each instance of data visualization on the dashboard. It makes a
direct coupling to the subject and metric properties in our data structures, and
should make it possible to tie it to other configurations later, like
thresholds.

Basing CMS objects on these properties would allow us to start building a
collection of sortable / searchable documents in the CMS without having to
define page structures.

Later on, if we do want to have pages as our main navigation structure in the
CMS we could nest these objects under each page.

Adding new objects should probably not be done by CMS editors, but be controlled
by developers as we also need to query for them in code. Also, the properties
that make up the "identifier" should not be editable.

The properties are combined into one string which is then used to store the
document in Sanity. This way we enforce that no duplicate configurations can
exist for the same element in the app.

Property 3 of the identifier can be implied by the Sanity document type (e.g.
`_type: timeSeries`), so we do not have to store that in an additional field.

(\*) Property 4 should be optional. If we show a line chart, the chart is
usually about the subject. The specific rendered property is not so important
and sometimes we use more than one (using total as an invisible trend for
example). For KPIs or choropleths the metric property can be essential for the
identifier, as we do sometimes show different KPIs or maps that use properties
from the same metric subject.

For the Sanity documents ids the properties are joined with `.` and the element
type is snake-cased.

`vr.sewer.time_series`

or

`nl.tested_overall.kpi.infected_per_100k`

In the future we might want to define configurations for specific VR and GM
codes. It should be possible to work out a system where we append them in the
scope string like `vr09` and the id would become:

`vr09.sewer.time_series`

In the app we would then first query for data on the scope including the vr code
`vr09` and if nothing is returned re-fetch the data based on scope `vr` as a
fallback.

## Gradual Adoption

For property 3 we can define a fixed set of types loosely based off the names of
our components:

- kpi
- timeSeries
- miniTrend
- choropleth
- table

Each element type will have its own CMS schema which defines the properties that
can be set specific for that type. For example the schema for timeSeries would
define its timelineEvents as a configuration.

We can start with just allowing timeSeries and have only their timeline data
configured, but then we can move on to add things like title, description,
metadata etc.

These properties are pretty stable nowadays, and any configuration that we don't
like to have configurable by cms (yet) we should be able to programmatically
look up via the id elements.

## Lokalize Texts Structure

The nice thing about these ids is that we could start using the same path logic
for lokalize texts. Lokalize text documents are stored with opaque ids so they
do not clash with the element ids.

If we manage to clean up the lokalize structure it becomes possible to join the
element configurations with their text properties. Either in app logic, or by
migrating the text strings to actually live with the element objects in the CMS.

For example in confirmed cases the chart is a `timeSeries` type based
on `data.tested_overall` in scope `nl` so the following keys would be moved:

- positief_geteste_personen.linechart_titel =>
  nl.tested_overall.time_series.title
- positief_geteste_personen.linechart_toelichting =>
  nl.tested_overall.time_series.description

## The Bad

Making the data leading could be a very good way to structure things, but it
also makes it essential to be strict about the naming of data structures.
Renaming a data subject or property will result in us needing to migrate
documents in the CMS to match the new data structure.
