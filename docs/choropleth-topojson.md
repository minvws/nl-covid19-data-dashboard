# Creating the choropleth TopoJson data

The Dutch municipal and safety region borders get updated quite frequently, so there is
a chance that a new set of GEOJson data will have to be created eventually.
This section describes how to generate this data with the correct projection applied.

## Software requirements

- QGIS ([download](https://qgis.org/en/site/forusers/download.html))

  > At this moment, QGIS is not yet notarized as required by macOS Catalina (10.15) security rules. On first launch, please right-click on the QGIS app icon, hold down the Option key, then choose Open.

- Mapshaper (Online tool available at [mapshaper.org](https://mapshaper.org))

## Creating the GEOJson

### Importing the source data

To create the data files we need, we will be using `cbsgebiedsindelingen_2022_v1.gpkg` as the
data source. This package can be downloaded from: [www.pdok.nl/downloads/-/article/cbs-gebiedsindelingen](https://www.pdok.nl/downloads/-/article/cbs-gebiedsindelingen). Download the XML file and find the link to the latest `*.gpkg` file in it. The URL looks like this: https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/extract/cbsgebiedsindelingen_2022_v1.gpkg.

ATTENTION: At the time of writing, the `cbsgebiedsindelingen_2022_v1.gpkg` file is the latest version.
It is of course very likely that by the time new data needs to be generated that a newer file is available.
Pay attention to download the very latest version.

After downloading, import the package into QGIS (the easiest way of doing this is by simply dragging the package into
the main QGIS window) and select the following layers to be added:

- `cbs_gemeente_2022_gegeneraliseerd`
- `cbs_veiligheidsregio_2021_gegeneraliseerd` (2022 not available at the moment of this writing)
- `cbs_landsdeel_2022_gegeneraliseerd`

NOTE: The year indicator will differ when dealing with newer data. Find the layer with the most recent year.

Import with the CRS:`EPSG:28992 - Amersfoort / RD New - Projected` projection which should the default while importing.

> Note: it is also possible to use and import `*.cbf` or `*.shp` files instead of the GeoPackage (`*.gpkg`) file. Those files are often inside the GeoPackage file. The steps below also applies to those other file extensions. Importing non-gpkg files could be helpfull when maps are generated manually instead of coming from CBS.

### Cleaning up the imported data

To clean up the data we have to perform the following steps:

Create the municipalities data file (**cbs_gemeente_2022_gegeneraliseerd**):

1. Right-click on the **layer > Properties > Fields**
2. Rename (click the pencil to active edit mode):
   - `statcode` to `code`
3. **Apply > Ok**
4. Right-click on the **layer > Export > Save Features As..**
5. Use the following settings:
   - Format: `GeoJSON`
   - File Name: `cbs_gemeente_2022_gegeneraliseerd.geojson`
   - CRS: `EPSG:28992 - Amersfoort / RD New - Projected`
   - Open **"Select fields to export..."**
     - Select: `code`
6. Export by clicking **"Ok"**

Create the safety regions data file (**cbs_veiligheidsregio_2021_gegeneraliseerd**):

1. Right-click on the **layer > Properties > Source fields**
2. Rename (click the pencil to active edit mode):
   - `statcode` to `code`
3. **Apply > Ok**
4. Right-click on the **layer > Export > Save Features As..**
5. Use the following settings:
   - Format: `GeoJSON`
   - File Name: `cbs_veiligheidsregio_2021_gegeneraliseerd.geojson`
   - CRS: `EPSG:28992 - Amersfoort / RD New - Projected`
   - Open **"Select fields to export..."**
     - Select: `code`
6. Export by clicking **"Ok"**

Create the Netherlands data file (**cbs_landsdeel_2022_gegeneraliseerd**):

1. Select the layer and go to **Vector > Geoprocessing Tools > Dissolve > Run**, this will merge the different areas
2. Select the new layer and right-click on the **layer > Export > Save Features As..**
3. Use the following settings:
   - Format: `GeoJSON`
   - File Name: `cbs_landsdeel_2022_gegeneraliseerd.geojson`
   - CRS: `EPSG:28992 - Amersfoort / RD New - Projected`
   - Open **"Select fields to export..."**
     - Deselect all
4. Export by clicking **"Ok"**

To make sure the coordinate system is correct we have to convert the exported files to lat and lon coordinates:

1. Create a new project and add the three files:
   - `cbs_landsdeel_2022_gegeneraliseerd.geojson`
   - `cbs_veiligheidsregio_2021_gegeneraliseerd.geojson`
   - `cbs_gemeente_2022_gegeneraliseerd.geojson`
2. For each layer:
   - Select the new layer and right-click on the **layer > Export > Save Features As..**
   - Format: `GeoJSON`
   - File Name: `cbs_veiligheidsregio_2021_gegeneraliseerd_WGS84.geojson`
   - CRS: `EPSG:4326 - WGS 84 - Geographic`
   - Export by clicking **"Ok"**
   * Make sure the output files contain longitude and latitude coordinates by opening the file and manually checking this, otherwise the next step will not work.

### Generate TopoJson:

1. Upload the three different (WGS84) files to: [mapshaper.org](https://mapshaper.org)
2. Rename the layers:
   - Change: `cbs_gemeente_2022_gegeneraliseerd` to `gm_features`
   - Change: `cbs_landsdeel_2022_gegeneraliseerd` to `nl_features`
   - Change: `cbs_veiligheidsregio_2021_gegeneraliseerd` to `vr_features`
3. Export to TopoJSON > `nl-vr-gm-high-detail.topo.json`;

> Note: It's possible that the map looks a little streched on MapShaper. This is most likely not an issue and it will display correctly once it's integrated in the Dashboard again.

Simplifying:
(NB: this needs to be separate step; when doing this in the step above the output will not be correct**!!**):

1. Upload the output `nl-vr-gm-high-detail.topo.json` to a new instance of [mapshaper.org](https://mapshaper.org/)
2. Do for each layer:
   - Select the layer and open the console; simplify using the following command: $ -simplify 27.5%
3. When all the layers are simplified export to TopoJSON > `nl-vr-gm.topo.json`
4. Add the new data file to the project at `packages/app/pages/api/topo-json`.
5. Update the file `topology.ts`, if necessary. (located at `packages/app/src/pages/api/choropleth`)

### Example of the topology.ts file

```typescript
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import * as topojson from 'topojson-client';
import nlTopology from './nl-vr-gm.topo.json';

export type CodedGeoProperties = {
  code: string;
};

export type CodedGeoJSON = FeatureCollection<
  MultiPolygon | Polygon,
  CodedGeoProperties
>;

export const nlGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.nl_features
) as CodedGeoJSON;

export const vrGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.vr_features
) as CodedGeoJSON;

export const gmGeo = topojson.feature(
  nlTopology,
  nlTopology.objects.gm_features
) as CodedGeoJSON;
```

Note that the map data is stored as TopoJson. This is because of the size optimizations that TopoJson provides,
at run time, after being downloaded by the choropleth component this TopoJson is converted to GeoJson.

### Adjust municipal file

Please update the [municipal configuration](/packages/common/src/data/gm.ts) file accordingly. Make sure to remove the former municipalities so that the value of a `gemcode` only exists once in this file.

[Back to index](index.md)
