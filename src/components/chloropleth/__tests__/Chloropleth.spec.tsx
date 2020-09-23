import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Chloropleth, TProps } from '~/components/chloropleth/Chloropleth';
import { MunicipalityProperties } from '../shared';
import { Feature, MultiPolygon } from 'geojson';
import { countryGeo, municipalGeo } from '../topology';

describe('Component: Choropleth', () => {
  it('Should call onPathClick handler when paths are clicked on on a large screen', () => {
    const testMunicipalCode = 'GM0003';

    const featureCollection = municipalGeo;
    const overlays = countryGeo;
    const hovers = municipalGeo;
    const boundingbox = municipalGeo;
    const dimensions = {
      boundedWidth: 500,
      boundedHeight: 500,
    };

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      expect(featureCollection.features.indexOf(feature)).toBeGreaterThan(-1);
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`feature-${feature.properties.gemcode}`}
          key={`feature-${feature.properties.gemcode}`}
        />
      );
    };

    const overlayCallback = (
      feature: Feature<MultiPolygon>,
      _path: string,
      index: number
    ) => {
      expect(overlays.features.indexOf(feature)).toBeGreaterThan(-1);
      return <path data-testid={`overlay-${index}`} key={`overlay-${index}`} />;
    };

    const hoverCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      expect(featureCollection.features.indexOf(feature)).toBeGreaterThan(-1);
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`hover-${feature.properties.gemcode}`}
          key={`hover-${feature.properties.gemcode}`}
        />
      );
    };

    const onPathClick = (id: string) => {
      expect(id).toEqual(testMunicipalCode);
    };

    const getTooltipContent = (_id: string) => {
      return <div />;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingbox,
      dimensions,
      featureCallback,
      overlayCallback,
      hoverCallback,
      onPathClick,
      getTooltipContent,
    };

    const renderResult = render(<Chloropleth {...props} />);
    const gemeente = renderResult.getAllByTestId(
      `feature-${testMunicipalCode}`
    )[0];

    fireEvent.click(gemeente);
  });
});
