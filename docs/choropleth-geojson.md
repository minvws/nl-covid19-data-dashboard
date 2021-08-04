# Creating the choropleth GEOJson data

The Dutch municipal and safety region borders get updated quite frequently, so there is
a chance that a new set of GEOJson data will have to be created eventually.
This section describes how generate this data with the correct projection applied.

## Software requirements

- QGIS ([download](https://qgis.org/en/site/forusers/download.html))
- Mapshaper (Online tool available at [mapshaper.org](https://mapshaper.org))

## Creating the GEOJson

### Importing the source data

To create the data files we need we will be using `cbsgebiedsindelingen_2020_v3_pdok.gpkg` as
data source this package can be downloaded from: [www.pdok.nl/downloads/-/article/cbs-gebiedsindelingen](https://www.pdok.nl/downloads/-/article/cbs-gebiedsindelingen)

ATTENTION: At the time of writing, the `cbsgebiedsindelingen_2020_v3_pdok.gpkg` file is the latest version.
It is of course very likely that by the time new data needs to be generated that a newer file is available.
Pay attention to download the very latest version.

After downloading, import the package into QGIS (easiest way of doing this is by simply dragging the package into
the main QGIS window) and select the following layers to be added:

- `cbs_gemeente_2020_gegeneraliseerd`
- `cbs_veiligheidsregio_2020_gegeneraliseerd`
- `cbs_landsdeel_2020_gegeneraliseerd`

NOTE: The year indicator will differ when dealing with newer data. Find the layer with the most recent year.

Import with the CRS: `EPSG:28992 - Amersfoort / RD New - Projected` projection which should the default while importing.

### Cleaning up the imported data

To clean up the data we have to undertake the following steps:

Creating the municipalities data file (**cbs_gemeente_2020_gegeneraliseerd**):

1. Right click on the **layer > Properties > Source fields**
2. Rename (click the pencil to active edit mode):
   - `statnaam` to `gemnaam`
   - `statcode` to `gemcode`
3. **Apply > Ok**
4. Right click on the **layer > Export > Save Features As..**
5. Use the following settings:
   - Format: `GeoJSON`
   - File Name: `cbs_gemeente_2020_gegeneraliseerd.geojson`
   - CRS: `EPSG:28992 - Amersfoort / RD New - Projected`
   - Open **"Select fields to export..."**
     - Select: `gemnaam` and `gemcode`
6. Export by clicking **"Ok"**

Creating the safety regions data file (**cbs_veiligheidsregio_2020_gegeneraliseerd**):

1. Right click on the **layer > Properties > Source fields**
2. Rename (click the pencil to active edit mode):
   - `statnaam` to `vrname`
   - `statcode` to `vrcode`
3. **Apply > Ok**
4. Right click on the **layer > Export > Save Features As..**
5. Use the following settings:
   - Format: `GeoJSON`
   - File Name: `cbs_veiligheidsregio_2020_gegeneraliseerd.geojson`
   - CRS: `EPSG:28992 - Amersfoort / RD New - Projected`
   - Open **"Select fields to export..."**
     - Select: `vrname` and `vrcode`
6. Export by clicking **"Ok"**

Creating the Netherlands data file (**cbs_landsdeel_2020_gegeneraliseerd**):

1. Select the layer and go to **Vector > Geoprocessing Tools > Dissolve > Run**, this will merge the different areas
2. Select the new layer and right click on the **layer > Export > Save Features As..**
3. Use the following settings:
   - Format: `GeoJSON`
   - File Name: `cbs_landsdeel_2020_gegeneraliseerd.geojson`
   - CRS: `EPSG:28992 - Amersfoort / RD New - Projected`
   - Open **"Select fields to export..."**
     - Deselect all
4. Export by clicking **"Ok"**

To make sure the coordinating system is correct we have to convert the exported files to lat and lon coordinates:

1. Create a new project and add the three files:
   - `cbs_landsdeel_2020_gegeneraliseerd.geojson`
   - `cbs_veiligheidsregio_2020_gegeneraliseerd.geojson`
   - `cbs_gemeente_2020_gegeneraliseerd.geojson`
2. For each layer:
   - Select the new layer and right click on the **layer > Export > Save Features As..**
   - Format: `GeoJSON`
   - File Name: `cbs_veiligheidsregio_2020_gegeneraliseerd_WGS84.geojson`
   - CRS: `EPSG:4326 - WGS 84 - Geographic`
   - Export by clicking **"Ok"**
   * Make sure the output files contain longitude and latitude coordinates by opening the file and manually checking this, otherwise the next step will not work.

### Generate TopoJson:

1. Upload the three different (WGS84) files to: [mapshaper.org](https://mapshaper.org)
2. Rename the layers:
   - Change: `cbs_gemeente_2020_gegeneraliseerd` to `gm_features`
   - Change: `cbs_landsdeel_2020_gegeneraliseerd` to `nl_features`
   - Change: `cbs_veiligheidsregio_2020_gegeneraliseerd` to `vr_features`
3. Export to TopoJSON > `geography-high-detail.topo.json`;

Simplifying (this needs to be separate step; when doing this in the step above the output will not be correct):

1. Upload the output `geography-high-detail.topo.json` to a new instance of [mapshaper.org](https://mapshaper.org/)
2. Do for each layer:
   - Select the layer and open the console; simplify using the following command: $ -simplify 27.5%
3. When all the layers are simplified export to TopoJSON > `geography-simplified.topo.json`
4. Add the new data file to the project and update `topology.ts`.

### Example of the topology.ts file

```typescript
import { FeatureCollection, MultiPolygon } from 'geojson';
import * as topojson from 'topojson-client';

// Load all the geographical data including the data entries (regions and municipalities)
import topology from './geography-simplified.topo.json';

import { MunicipalGeoJSON, RegionGeoJSON } from './shared';

export const countryGeo = topojson.feature(
  topology,
  topology.objects.netherlands
) as FeatureCollection<MultiPolygon | Polygon>;

export const regionGeo = topojson.feature(
  topology,
  topology.objects.vr_collection
) as RegionGeoJSON;

export const municipalGeo = topojson.feature(
  topology,
  topology.objects.municipalities
) as MunicipalGeoJSON;
```
