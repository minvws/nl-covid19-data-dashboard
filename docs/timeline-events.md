# Timelines && Timeline Events

All time-series charts can optionally render events on a timeline to illustrate
and describe certain parts of the data.

These events are managed via the CMS.

To enable and configure events for a chart, two things need to
happen. First we need to add the chart instance as an `element` to the CMS
dataset, and secondly we need to query the element data in the page where the
chart is used, and pass the results to the component.

## CMS Data Elements

The `elements` section in the CMS provides a flexible way to connect any sort of
configuration to a data element on one of the pages. Unlike the various pages
defined in the CMS, the elements works as a flat collection of objects that each
point to a unique data element in the app via a combination of `scope`, `element type`, `metric name` and optionally a `metric property`.

The type of element then defines what can be configured for that element. At the
time of writing we only use this to configure timeline events.

As an example, the chart that is shown on the safety region page about hospital
admissions exists in the CMS as an element with id
`vr__hospital_nice__time_series`, and for the national page on confirmed cases
we have an element with id `nl__tested_overall__time_series`.

## Adding An Element

Adding a new element is **only** possible via a command-line interface.

This script can be run using `packages/cms/yarn elements:add`.

The script is self-explanatory as it allows the user to select the data item
using a series of selection lists that are generated from the schema's.

NOTE: When you use this script, the element will be created in both development
and production datasets.

## Query Elements Data

Data for all elements on the pages is fetched together as part of the getStaticProps
function. The argument to `createGetContent` is a function which returns a
fragment of a Sanity GROQ query, and tell is to place the resulting data under a
property called `elements`. This property can be named anything.

```ts
export const getStaticProps = createGetStaticProps(
  selectNlPageMetricData('hospital_nice'),
  createGetContent<{
    elements: ElementsQueryResult;
  }>(() => `{
      "elements": ${createElementsQuery('nl', ['hospital_nice'], locale)}
    }`;
  )
);
```

Then later on the timeline events configuration get be grabbed from the elements
data and passed on to the time series chart:

```ts
timelineEvents: getTimelineEvents(
  content.elements.timeSeries,
  'hospital_nice'
),
```

[Back to index](index.md)
