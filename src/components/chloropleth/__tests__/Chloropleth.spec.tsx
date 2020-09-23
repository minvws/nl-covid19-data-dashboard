import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Chloropleth, TProps } from '~/components/chloropleth/Chloropleth';
import { MunicipalityProperties } from '../shared';
import { Feature, MultiPolygon } from 'geojson';
import { countryGeo, municipalGeo } from '../topology';
import { mockMatchMedia } from '~/utils/testhelpers/mockMatchMedia';

describe('Component: Choropleth', () => {
  const featureCollection = municipalGeo;
  const overlays = countryGeo;
  const hovers = municipalGeo;
  const boundingbox = municipalGeo;
  const dimensions = {
    boundedWidth: 500,
    boundedHeight: 500,
  };
  const defaultOnPathClick = (id: string) => {};

  const defaultGetTooltipContent = (_id: string) => {
    return <div />;
  };

  const defaultOverlayCallback = (
    _feature: Feature<MultiPolygon>,
    _path: string,
    index: number
  ) => {
    return <path key={`overlay-${index}`} />;
  };

  const defaultHoverCallback = (
    feature: Feature<MultiPolygon, MunicipalityProperties>,
    _path: string,
    _index: number
  ) => {
    return <path key={`hover-${feature.properties.gemcode}`} />;
  };

  it('Should call the correct callbacks for the given feature collections', () => {
    // Arrange
    let featureCallbackWasCalled = false;
    let overlayCallbackWasCalled = false;
    let hoverCallbackWasCalled = false;

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      featureCallbackWasCalled = true;
      expect(featureCollection.features.indexOf(feature)).toBeGreaterThan(-1);
      return <path key={`feature-${feature.properties.gemcode}`} />;
    };

    const overlayCallback = (
      feature: Feature<MultiPolygon>,
      _path: string,
      index: number
    ) => {
      overlayCallbackWasCalled = true;
      expect(overlays.features.indexOf(feature)).toBeGreaterThan(-1);
      return <path key={`overlay-${index}`} />;
    };

    const hoverCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      hoverCallbackWasCalled = true;
      expect(featureCollection.features.indexOf(feature)).toBeGreaterThan(-1);
      return <path key={`hover-${feature.properties.gemcode}`} />;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingbox,
      dimensions,
      featureCallback,
      overlayCallback,
      hoverCallback,
      onPathClick: defaultOnPathClick,
      getTooltipContent: defaultGetTooltipContent,
    };

    // Act
    const renderResult = render(<Chloropleth {...props} />);

    let groups = null;
    try {
      groups = renderResult.getAllByText(
        (_content: string, element: HTMLElement) => {
          return element.nodeName === 'g';
        }
      );
    } catch (e) {}

    // Assert
    expect(featureCallbackWasCalled).toBeTruthy();
    expect(overlayCallbackWasCalled).toBeTruthy();
    expect(hoverCallbackWasCalled).toBeTruthy();
    // Check if there are exactly 4 <g> elements. One container, and one for each feature collection
    expect(groups?.length).toEqual(4);
  });

  it('Should call the click handler when paths are clicked on on a large screen', () => {
    // Arrange
    const testMunicipalCode = 'GM0003';

    mockMatchMedia(true);

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`feature-${feature.properties.gemcode}`}
          key={`feature-${feature.properties.gemcode}`}
        />
      );
    };

    let pathReceiveClick = false;
    const onPathClick = (id: string) => {
      pathReceiveClick = true;
      expect(id).toEqual(testMunicipalCode);
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingbox,
      dimensions,
      featureCallback,
      overlayCallback: defaultOverlayCallback,
      hoverCallback: defaultHoverCallback,
      onPathClick,
      getTooltipContent: defaultGetTooltipContent,
    };

    // Act
    const renderResult = render(<Chloropleth {...props} />);
    const gemeente = renderResult.getAllByTestId(
      `feature-${testMunicipalCode}`
    )[0];

    fireEvent.click(gemeente);

    // Assert
    expect(pathReceiveClick).toBeTruthy();
  });

  it('Should call the tooltip content handler when paths are clicked on on a small screen', () => {
    // Arrange
    const testMunicipalCode = 'GM0003';

    mockMatchMedia(false);

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`feature-${feature.properties.gemcode}`}
          key={`feature-${feature.properties.gemcode}`}
        />
      );
    };

    let pathReceiveClick = false;
    const onPathClick = (id: string) => {
      pathReceiveClick = true;
      expect(id).toEqual(testMunicipalCode);
    };

    let tooltipRequested = false;
    const getTooltipContent = (id: string) => {
      tooltipRequested = true;
      expect(id).toEqual(testMunicipalCode);
      return <div />;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingbox,
      dimensions,
      featureCallback,
      overlayCallback: defaultOverlayCallback,
      hoverCallback: defaultHoverCallback,
      onPathClick,
      getTooltipContent,
    };

    // Act
    const renderResult = render(<Chloropleth {...props} />);
    const gemeente = renderResult.getAllByTestId(
      `feature-${testMunicipalCode}`
    )[0];

    fireEvent.click(gemeente);

    // Assert
    expect(pathReceiveClick).toBeFalsy();
    expect(tooltipRequested).toBeTruthy();
  });

  it('Should call the tooltip content handler when paths are mouse-overed', () => {
    // Arrange
    const testMunicipalCode = 'GM0003';

    mockMatchMedia(true);

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>,
      _path: string,
      _index: number
    ) => {
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`feature-${feature.properties.gemcode}`}
          key={`feature-${feature.properties.gemcode}`}
        />
      );
    };

    let tooltipRequested = false;
    const getTooltipContent = (id: string) => {
      tooltipRequested = true;
      expect(id).toEqual(testMunicipalCode);
      return <div />;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingbox,
      dimensions,
      featureCallback,
      overlayCallback: defaultOverlayCallback,
      hoverCallback: defaultHoverCallback,
      onPathClick: defaultOnPathClick,
      getTooltipContent,
    };

    // Act
    const renderResult = render(<Chloropleth {...props} />);
    const gemeente = renderResult.getAllByTestId(
      `feature-${testMunicipalCode}`
    )[0];

    fireEvent.mouseOver(gemeente);

    // Assert
    expect(tooltipRequested).toBeTruthy();
  });
});
