import Projection from '@visx/geo/lib/projections/Projection';
import { FocusEvent } from 'react';
import { featureHasPath } from '../logic/utils';
import { MercatorGroupProps } from './mercator-group';
import { HoverPathLink } from './path';

type MercatorHoverGroupProps = {
  getHref?: (code: string) => string;
  getTitle: (code: string) => string;
  onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
  onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
  isTabInteractive: boolean;
} & MercatorGroupProps;

export function MercatorHoverGroup(props: MercatorHoverGroupProps) {
  const {
    projection = 'mercator',
    data,
    fitExtent,
    fillMethod,
    strokeMethod,
    strokeWidthMethod,
    onFocus,
    onBlur,
    isTabInteractive,
    getHref,
    getTitle,
  } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features
            .filter(featureHasPath)
            .map((x) => ({
              ...x,
              path: x.path.replace(
                /\d+\.\d+/g,
                (x) => Math.round(parseFloat(x)) + ''
              ),
            }))
            .map(({ feature, path, index }) => {
              const { code } = feature.properties;
              return (
                <HoverPathLink
                  id={code}
                  key={`${code}_${index}`}
                  pathData={path}
                  fill={fillMethod(code)}
                  stroke={strokeMethod(code)}
                  strokeWidth={strokeWidthMethod(code)}
                  isTabInteractive={isTabInteractive}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  title={getTitle(code)}
                  href={getHref ? getHref(code) : undefined}
                />
              );
            })}
        </g>
      )}
    </Projection>
  );
}
