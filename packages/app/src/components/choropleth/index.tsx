import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { GeoProjection } from 'd3-geo';
import withLoadingProps from 'next-dynamic-loading-props';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { ChoroplethMap } from './components/choropleth-map';
import {
  ChoroplethDataItem,
  InferedDataCollection,
  InferedMapType,
  useTabInteractiveButton,
} from './logic';
import { ChoroplethTooltipPlacement, Tooltip } from './tooltips';
import { TooltipFormatter, TooltipSettings } from './tooltips/types';

export type DataOptions = {
  isPercentage?: boolean;
  getLink?: (code: string) => string;
  getFeatureName?: (code: string) => string;
  highlightSelection?: boolean;
  selectedCode?: string;
  tooltipVariables?: Record<string, Record<string, string> | string>;
  projection?: () => GeoProjection;
};

export type OptionalDataConfig<T extends ChoroplethDataItem> = {
  metricName: KeysOfType<InferedDataCollection<T>, T[]>;
  metricProperty: KeysOfType<T, number | null | boolean | undefined, true>;
  noDataFillColor?: string;
  hoverFill?: string;
  hoverStroke?: string;
  hoverStrokeWidth?: number;
  highlightStroke?: string;
  highlightStrokeWidth?: number;
  areaStroke?: string;
  areaStrokeWidth?: number;
};

export type DataConfig<T extends ChoroplethDataItem> = Required<
  OptionalDataConfig<T>
>;

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
export type ResponsiveSizeConfiguration = [
  ...ResponsiveSizeSettings[],
  HeightAndPadding
];

export type BoundingBoxPadding = Required<OptionalBoundingBoxPadding>;

type RenderTarget = 'svg' | 'canvas';

export type ChoroplethProps<T extends ChoroplethDataItem> = {
  accessibility: AccessibilityDefinition;
  data: T[];
  dataConfig: OptionalDataConfig<T>;
  dataOptions: DataOptions;
  map: InferedMapType<T>;
  formatTooltip?: TooltipFormatter<T>;
  tooltipPlacement?: ChoroplethTooltipPlacement;
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
  renderTarget?: RenderTarget;
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
export function Choropleth<T extends ChoroplethDataItem>({
  formatTooltip,
  tooltipPlacement,
  ...props
}: ChoroplethProps<T>) {
  const [tooltip, setTooltip] = useState<TooltipSettings<T>>();
  const isTouch = useIsTouchDevice();
  const { siteText } = useIntl();
  const hoverRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([tooltipRef, hoverRef], () => setTooltip(undefined));

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth[props.map].plural,
      })
    );

  return (
    <Box position="relative" height="100%">
      {tabInteractiveButton}
      <div
        css={css({ bg: 'transparent', position: 'relative', height: '100%' })}
      >
        <ChoroplethMap
          {...props}
          setTooltip={setTooltip}
          hoverRef={hoverRef}
          isTabInteractive={isTabInteractive}
          anchorEventHandlers={anchorEventHandlers}
        />

        {tooltip && (
          <div
            ref={tooltipRef}
            style={{ pointerEvents: isTouch ? 'all' : 'none' }}
          >
            <Tooltip
              placement={tooltipPlacement}
              left={tooltip.left}
              top={tooltip.top}
              setTooltip={setTooltip}
              formatTooltip={formatTooltip}
              data={tooltip.data}
            />
          </div>
        )}
      </div>
    </Box>
  );
}

export const DynamicChoropleth = withLoadingProps((getLoadingProps) =>
  dynamic(() => import('./').then((mod) => mod.Choropleth), {
    ssr: false,
    loading: () => {
      const {
        map,
        dataConfig,
        minHeight = 500,
        dataOptions,
      } = getLoadingProps();
      return (
        <img
          src={`/api/choropleth/${map}/${dataConfig.metricName}/${
            dataConfig.metricProperty
          }/${minHeight}/${dataOptions.selectedCode ?? ''}`}
        />
      );
    },
  })
) as ChoroplethComponent;
