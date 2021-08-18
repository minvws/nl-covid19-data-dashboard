import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Projection } from '@visx/geo/lib/types';
import { GeoProjection } from 'd3-geo';
import { useRef, useState } from 'react';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { SvgChoroplethMap } from './components';
import {
  MappedDataItem,
  MapType,
  Unpack,
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
  projection?: Projection | (() => GeoProjection);
};

type OptionalDataConfig<T> = {
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

export type DataConfig<T> = Required<OptionalDataConfig<T>>;

export type OptionalBoundingBoxPadding = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export type DynamicSizeConfiguration = {
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
export type DynamicSizeConfigurations = [
  ...DynamicSizeConfiguration[],
  HeightAndPadding
];

export type BoundingBoxPadding = Required<OptionalBoundingBoxPadding>;

export type UnpackedDataItem<T extends MapType> = Unpack<MappedDataItem<T>>;

type RenderTarget = 'svg' | 'canvas';

export type ChoroplethProps<
  T extends MapType,
  K extends UnpackedDataItem<T>
> = {
  accessibility: AccessibilityDefinition;
  data: K[];
  dataConfig: OptionalDataConfig<K>;
  dataOptions: DataOptions;
  map: T;
  formatTooltip?: TooltipFormatter<K>;
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
  dynamicSizeConfiguration?: DynamicSizeConfigurations;
  renderTarget?: RenderTarget;
};

/**
 * This is a (semi) generic choropleth component that supports a Dutch map of municipalities or safetyregions
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
export function Choropleth<T extends MapType, K extends UnpackedDataItem<T>>({
  formatTooltip,
  tooltipPlacement,
  renderTarget = 'svg',
  ...props
}: ChoroplethProps<T, K>) {
  const [tooltip, setTooltip] = useState<TooltipSettings<K>>();
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
        {renderTarget === 'svg' && (
          <SvgChoroplethMap
            {...props}
            setTooltip={setTooltip}
            hoverRef={hoverRef}
            isTabInteractive={isTabInteractive}
            anchorEventHandlers={anchorEventHandlers}
          />
        )}

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
