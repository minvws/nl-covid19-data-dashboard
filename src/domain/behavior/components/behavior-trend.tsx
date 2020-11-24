import css from '@styled-system/css';
import styled from 'styled-components';

import Gelijk from '~/assets/gelijk.svg';
import PijlOmhoog from '~/assets/pijl-omhoog.svg';
import PijlOmlaag from '~/assets/pijl-omlaag.svg';
import { BehaviorTrendType } from '../behavior-types';
import siteText from '~/locale/index';

const commonText = siteText.gedrag_common;

interface BehaviorTrendProps {
  trend: BehaviorTrendType | undefined;
}

const Trend = styled.span(
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',

    svg: {
      color: '#0090DB',
      mr: 1,
      width: '12px',
      height: '12px',
      verticalAlign: 'middle',
    },
  })
);

export function BehaviorTrend({ trend }: BehaviorTrendProps) {
  if (trend === undefined) {
    return <>-</>;
  }
  if (trend === 'up') {
    return (
      <Trend>
        <PijlOmhoog />
        {commonText.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend>
        <PijlOmlaag />
        {commonText.basisregels.trend_lager}
      </Trend>
    );
  }
  return (
    <Trend>
      <Gelijk />
      {commonText.basisregels.trend_gelijk}
    </Trend>
  );
}
