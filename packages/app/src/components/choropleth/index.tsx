import css from '@styled-system/css';
import type { GeoProjection } from 'd3-geo';
import withLoadingProps from 'next-dynamic-loading-props';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useTabInteractiveButton } from '~/utils/use-tab-interactive-button';
import { ChoroplethMap } from './components/choropleth-map';
import { ChoroplethDataItem, InferedDataCollection, InferedMapType, MapType } from './logic';
import { ChoroplethTooltipPlacement, Tooltip } from './tooltips';
import { TooltipFormatter, TooltipSettings } from './tooltips/types';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

export type DataOptions = {
  /**
   * True if the data shown in the map are percentages. (Can be used by the tooltips to format numbers correctly)
   */
  isPercentage?: boolean;
  /**
   * Callback that, when set, will provide a link that will be activated when the user clicks on a feature.
   * The corresponding code of the feature is passed to this callback, so for example in the case of
   * safety regions, a code in the form of 'VR<Safety-region-number>' is passed in (for example: VR25).
   */
  getLink?: (code: string) => string;
  /**
   * Returns the name of the feature that corresponds to the given code. This mean in the case of VR25
   * it will need to return the name of this safety region. GM0014 will have to provide the name of the municipality, etc
   */
  getFeatureName?: (code: string) => string;
  /**
   * If true and a valid code is set for the selectedCode as well, the map will rendered with a highlight for the
   * given feature. The configuration for this can be set using DataConfig.highlightStroke and highlightStroke.highlightStrokeWidth
   */
  highlightSelection?: boolean;
  /**
   * Indicates a specific feature is selected. In the case of safety region this will also mean the map will be zoomed into
   * this safety region. And in the case of municipality it means the map will be zoomed in to the safety region the municipality
   * belongs to.
   */
  selectedCode?: string;
  /**
   * Extra name/value pairs that will be passed to the tooltip formatter. In the tooltip replaceVariablesInText is used to format
   * the tooltip text. By default the dataitem is passed to this function, but when set the tooltipVariables value will be merged
   * with the dataitem and then passed into replaceVariablesInText.
   */
  tooltipVariables?: Record<string, Record<string, string> | string>;
  /**
   * The type of geo projection that is used to render the map data with.
   * Read this https://macwright.com/2015/03/23/geojson-second-bite.html to learn about projections.
   */
  projection?: () => GeoProjection;
};

export type OptionalDataConfig<T extends ChoroplethDataItem> = {
  /**
   * A top-level property name of either VR_COLLECTION.json or GM_COLLECTION.json
   */
  metricName: keyof InferedDataCollection<T>;
  /**
   * A property name of the object determined by the metric name. This value is used to determine the color
   * of the feature.
   */
  metricProperty: keyof T;
  /**
   * The color that is used for the feature when no data is available (a null value for example).
   */
  noDataFillColor?: string;
  /**
   * The color that is used to for the feature when the feature is hovered.
   */
  hoverFill?: string;
  /**
   * The color that is used to for the feature outline when the feature is hovered.
   */
  hoverStroke?: string;
  /**
   * The width that is used to for the feature outline when the feature is hovered.
   */
  hoverStrokeWidth?: number;
  /**
   * The color that is used to for the feature outline when the feature is highlighted.
   */
  highlightStroke?: string;
  /**
   * The width that is used to for the feature outline when the feature is highlighted.
   */
  highlightStrokeWidth?: number;
  /**
   * The color that is used to for the feature outline when the feature is rendered normally.
   */
  areaStroke?: string;
  /**
   * The width that is used to for the feature outline when the feature is rendered normally.
   */
  areaStrokeWidth?: number;
  /**
   * A record containing the keys of T that needs formatting. The values are the formatting functions itself.
   */
  dataFormatters?: Partial<Record<keyof T, (input: string | number) => string>>;
};

export type DataConfig<T extends ChoroplethDataItem> = Required<OptionalDataConfig<T>>;

export type OptionalBoundingBoxPadding = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export type ResponsiveSizeSettings = {
  /**
   * If the container width is equal or larger than this value, use
   * the associated height and padding.
   */
  containerWidth: number;
  heightAndPadding: HeightAndPadding;
};

export type HeightAndPadding = {
  mapHeight: number;
  padding: OptionalBoundingBoxPadding;
};

/**
 * An arbitrary number of dynamic size configs, the last item is used as the default.
 * (So for the smallest container size)
 */
export type ResponsiveSizeConfiguration = [...ResponsiveSizeSettings[], HeightAndPadding];

export type BoundingBoxPadding = Required<OptionalBoundingBoxPadding>;

export type ChoroplethProps<T extends ChoroplethDataItem> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * choropleth with an accessible label and description.
   */
  accessibility: AccessibilityDefinition;
  /**
   * The actual data that will be used to determine the colors of the choropleth
   */
  data: T[];
  /**
   * Configuration options for which data and how this data is displayed within the map
   */
  dataConfig: OptionalDataConfig<T>;
  /**
   * Several options that indicate how the map and its different parts are shown
   */
  dataOptions: DataOptions;
  /**
   * Indicates which map is rendered.
   */
  map: InferedMapType<T>;
  /**
   * Indicates which threshold is rendered for the map.
   */
  thresholdMap?: MapType;
  /**
   * An optional formatting callback that allows for customizing the contents
   * of the tooltip
   */
  formatTooltip?: TooltipFormatter<T>;
  /**
   * Placement of the tooltip relative to the mouse pointer
   */
  tooltipPlacement?: ChoroplethTooltipPlacement;
  /**
   * Minimum heifght in pixels
   */
  minHeight?: number;
  /**
   * A default set of paddings to be used on the bounding box, if
   * more control is needed for different screen sizes, use the
   * dynamicSizeConfiguration instead.
   */
  boundingBoxPadding?: OptionalBoundingBoxPadding;
  /**
   * This defines an optional set of map heights and paddings based
   * on a set of given width break points
   */
  responsiveSizeConfiguration?: ResponsiveSizeConfiguration;
};

export type ChoroplethComponent = typeof Choropleth;

/**
 * This is a (semi) generic choropleth component that supports a Dutch map of municipalities or safety regions
 * and a European map.
 *
 * The type of map that will be rendered can be set using the `map` property, setting this prop will automatically
 * narrow the allowed types for the data prop to just those that are applicable to the specified map type.
 *
 * Using the `dataConfig` prop the metric that is shown can be specified, along with optional settings for the
 * stroke, fills and strokeWidths of the rendered features.
 *
 * The `dataOptions` prop allows for some extra functional tweaks.
 *
 * Most of the choropleths will work using the generic tooltip, but if something custom is required the `formatTooltip`
 * prop is there to help out.
 */
export function Choropleth<T extends ChoroplethDataItem>({ formatTooltip, tooltipPlacement, ...props }: ChoroplethProps<T>) {
  const [tooltip, setTooltip] = useState<TooltipSettings<T>>();
  const { commonTexts } = useIntl();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();

  /** Close the tooltip when a click outside of the component occurs only on mobile */
  useOnClickOutside([tooltipRef], () => {
    if (isTouch) setTooltip(undefined);
  });

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } = useTabInteractiveButton(
    replaceVariablesInText(commonTexts.choropleth.a11y.tab_navigatie_button, {
      subject: commonTexts.choropleth[props.map].plural,
    })
  );

  return (
    <Box position="relative" height="100%">
      {tabInteractiveButton}
      <div css={css({ position: 'relative', height: '100%' })}>
        <ChoroplethMap {...props} setTooltip={setTooltip} isTabInteractive={isTabInteractive} anchorEventHandlers={anchorEventHandlers} />

        {tooltip && (
          <div ref={tooltipRef} style={{ pointerEvents: 'none' }}>
            <Tooltip
              placement={tooltipPlacement}
              left={tooltip.left}
              top={tooltip.top}
              formatTooltip={formatTooltip}
              data={tooltip.data}
              dataFormatters={props.dataConfig.dataFormatters}
            />
          </div>
        )}
      </div>
    </Box>
  );
}

/**
 * A dynamically loaded version of the choropleth component. It displays an image tag
 * with a server-side rendered version of the choropleth as its source while loading
 * the component.
 */
export const DynamicChoropleth = withLoadingProps((getLoadingProps) =>
  dynamic(() => import('./').then((mod) => mod.Choropleth), {
    ssr: false,
    loading: () => {
      const { map, dataConfig, minHeight = 500, dataOptions } = getLoadingProps();
      return <img src={`/api/choropleth/${map}/${dataConfig.metricName.toString()}/${dataConfig.metricProperty.toString()}/${minHeight}/${dataOptions.selectedCode ?? ''}`} />;
    },
  })
) as ChoroplethComponent;
