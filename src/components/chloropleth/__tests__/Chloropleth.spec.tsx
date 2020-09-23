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
  const boundingBox = municipalGeo;
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
    feature: Feature<MultiPolygon, MunicipalityProperties>
  ) => {
    return <path key={`hover-${feature.properties.gemcode}`} />;
  };

  it('Should call the correct callbacks for the given feature collections', () => {
    // Arrange

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>
    ) => {
      return <path key={`feature-${feature.properties.gemcode}`} />;
    };

    const overlayCallback = (
      _feature: Feature<MultiPolygon>,
      _path: string,
      index: number
    ) => {
      return <path key={`overlay-${index}`} />;
    };

    const hoverCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>
    ) => {
      return <path key={`hover-${feature.properties.gemcode}`} />;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox,
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
    expect(groups?.[0].children.length).toEqual(3); // main group holding 3 groups
    expect(groups?.[1].children.length).toEqual(355); // municipal features
    expect(groups?.[2].children.length).toEqual(1); // country outline
    expect(groups?.[3].children.length).toEqual(355); // hover outlines
    expect(groups?.length).toEqual(4);
  });

  it('Should call the click handler when paths are clicked on on a large screen', () => {
    // Arrange
    const testMunicipalCode = 'GM0003';

    mockMatchMedia(true);

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>
    ) => {
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`feature-${feature.properties.gemcode}`}
          key={`feature-${feature.properties.gemcode}`}
        />
      );
    };

    let hasPathReceivedClick = false;
    const onPathClick = (id: string) => {
      hasPathReceivedClick = true;
      expect(id).toEqual(testMunicipalCode);
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingBox,
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
    expect(hasPathReceivedClick).toBeTruthy();
  });

  it('Should show the tooltip content handler when paths are clicked on on a small screen', () => {
    // Arrange
    const testMunicipalCode = 'GM0003';

    mockMatchMedia(false);

    const featureCallback = (
      feature: Feature<MultiPolygon, MunicipalityProperties>
    ) => {
      return (
        <path
          data-id={feature.properties.gemcode}
          data-testid={`feature-${feature.properties.gemcode}`}
          key={`feature-${feature.properties.gemcode}`}
        />
      );
    };

    let hasPathReceivedClick = false;
    const onPathClick = (id: string) => {
      hasPathReceivedClick = true;
      expect(id).toEqual(testMunicipalCode);
    };

    const getTooltipContent = (id: string) => {
      return <div>Tooltip:{id}</div>;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingBox,
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
    expect(hasPathReceivedClick).toBeFalsy();
    const tooltips = renderResult.getAllByText(`Tooltip:${testMunicipalCode}`);
    expect(tooltips.length).toEqual(1);
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

    const getTooltipContent = (id: string) => {
      return <div>Tooltip:{id}</div>;
    };

    const props: TProps<MunicipalityProperties> = {
      featureCollection,
      overlays,
      hovers,
      boundingBox: boundingBox,
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
    const tooltips = renderResult.getAllByText(`Tooltip:${testMunicipalCode}`);
    expect(tooltips.length).toEqual(1);
  });
});
