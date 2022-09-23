All information in this guide is gathered through online research.
Links are provided for reference and to do your own deep dives.
The data for the choropleth maps is in [nl-vr-gm.topo.json](/packages/app/src/pages/api/topo-json/nl-vr-gm.topo.json) and instructions on how to generate that are in [Choropleth Topojson](choropleth-topojson.md).

# About the data structure for a choropleth map

The data structure of that file is that of a TopoJson ([Wikipedia](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON)).
As can be read on the wiki page, TopoJson is a notable offspring of GeoJson.

## GeoJson

The GeoJson structure is a JSON that describes simple geographic features.
These features can be:
 - Points,
   basically just an x and y coordinate:
   `[0, 1]`
 - Lines,
   basically a series of points:
   `[[0, 0], [0, 1], [1, 1]]`
 - Polygons,
   basically a line that closes in on itself:
   `[[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]`

The schema also allows multipart collections of these features, and each feature can have extra properties to store meta-data in.

### Holes in a polygon
The polygon is not structured as just a single closed line but as an array of closed lines.
This is an important aspect of the polygon.
Where the first closed line in a polygon describes just the polygon, all subsequent closed lines describe polygon-shaped holes inside that polygon.
This can be used to leave out enclaves ([Wikipedia](https://en.wikipedia.org/wiki/Enclave_and_exclave)).

## TopoJson

If a GeoJson is used for cartography, there is often a lot of duplicated information.
When a plot of land borders another plot, then the points to describe the border will be used twice, once for each plot.
And because borders are often based on natural formations such as rivers or mountain ranges, an accurately described border can contain a lot of points.

### Arcs
A TopoJson describes the same things as a GeoJson, but in a way to shrink the file size.
Each sequence in points, be it in a line or a polygon, is defined separately as an arc.
The lines and polygons in a TopoJson are defined by referring to the arcs instead of giving the actual points.

So if plot A borders on plot B, there is an arc defined that is that border and arcs that describe the rest of the edges of the plots.
The polygon for a plot is then composed of references to those arcs.
So instead of defining the complex border for each plot of land, it is instead only described once and referenced for each plot of land.

### Subsequent points
There are some more choices made for smaller file sizes, for example instead of stating the coordinates of each subsequent point, it only notes the difference with the previous point.
So a line that would be described in a GeoJson as `[[154, 38], [159, 39], [163, 42]]`, would in a TopoJson be `[[154, 38], [5, 1], [4, 3]]` which can shave of a decent amount of bytes for high accuracy data or large maps.

### Example
The [Wikipedia page](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON_Schema) on the TopoJson schema has a color-coded example.
When following this example, it's good to know that an arc can also be referred to with a negative index, to indicate that the points in the arc need to be followed in a reverse order to create the GeoJson line or polygon.
And while the arcs are indexed zero-based, the negative indexes are not (because `-0` will lead to a lot of other problems), so `-1` refers to the same arc as `0` and `-2` to the same arc as `1`, etc.

## Our choropleth map
In creating the choropleth map in this application, in August 2021 a switch was made from visx/geo to konva.
Nobody knows why this was done as there is no contact anymore with the people who made that decision.
While visx/geo is a library that is specifically created to work with geological data and can easily display polygons from a TopoJson file, Konva does not.
Because of this, a custom mapper was made to map each TopoJson feature in a set of coordinates that can be used to create Konva shapes.

This mapping is done in [use-projected-coordinates.ts](/packages/app/src/components/choropleth/logic/use-projected-coordinates.ts).
Unfortunately, the author did not know about the holes in a polygon.
Just before the code that extracts polygon holes and adds them as new separate polygons, it is commented:
  > turf.flatten() doesn't properly flatten deeply nested Multipolygons,
  so here we check if the coordinates consist of number tuples, if not,
  we can assume it's a deeper nested polygon and extract the tuples.

It's a shame that every multipolygon (a feature consisting of multiple polygons) was split up into separate polygons.
It's even worse that every hole was extracted as its own polygon as well.
The comment that `turf.flatten()` doesn't do its job properly is remarkable, considering that [Turf is an external library with over 200.000 weekly downloads](https://www.npmjs.com/package/@turf/turf), designed specifically to work with GeoJson data structures.

### Problem

Because of this ill preparation of GeoJson data for the Konva version of the choropleth map component, half the safety regions that were defined as a Multipolygon were now chopped up in multiple separate regions, each with its own tab order.
The same goes for the holes, which means that Zeeland as a safety region had nine different regions, of which three are water.
In total, the 25 safety regions became 52 separate regions.

### Quick fix
A quick and dirty fix was done recently in [canvas-choropleth-map.tsx](/packages/app/src/components/choropleth/components/canvas-choropleth-map.tsx).
The fix was to combine all polygons with the same code into `geoInfoGroups`, for each `geoInfoGroup`, only the first polygon would get a tab-index, and the others would get `-1` as a tab-index.
This would make sure that 25 safety regions can be reached with 25 tab keystrokes.
Next, each polygon with the same code as the focussed polygon gets a border similar to the focus border, so it seems that all polygons on a safety region got focus on that Tab keystroke.

### Proper fix
A proper fix would be to never dismiss the grouped information of the polygons in the mapper, but can be difficult if Konva still needs to be used.
[A proposal to define holes in Konva shapes was declined](https://github.com/konvajs/konva/pull/622), but the owner of the Konva library did provide [an example of how to create holes](https://jsbin.com/rizocoluzu/1/edit?html,js,output).

However, that doesn't fix the tab sequence yet, because that is now done with HTML `<map>` and `<area>`, for which it is not possible to define multi-polygons or holes and it's not possible to have multiple areas focused at the same time.

It might be interesting to look into using visx/geo again for the choropleth instead.
Unfortunately, we don't know why the previous team moved away from visx/geo.
However, it is hard to think of a problem with visx/geo that is solved with the Konva solution **and** is worse than the accessibility problem that arose from the Konva version of the choropleth map.


[Back to index](index.md)
