import css from '@styled-system/css';
import styled from 'styled-components';

import Gelijk from '~/assets/gelijk.svg';
import PijlOmhoog from '~/assets/pijl_omhoog.svg';
import PijlOmlaag from '~/assets/pijl_omlaag.svg';
import { GedragText } from '../behavior-types';

interface BehaviorTrendProps {
  trend: BehaviorTrendType;
  text: GedragText;
}

const Trend = styled.span(
  css({
    svg: {
      color: '#0090DB',
      mr: 1,
      width: '12px',
      verticalAlign: 'middle',
    },
  })
);

export function BehaviorTrend({ text, trend }: BehaviorTrendProps) {
  if (trend === null) {
    return <>-</>;
  }
  if (trend === 'up') {
    return (
      <Trend>
        <PijlOmhoog />
        {text.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend>
        <PijlOmlaag />
        {text.basisregels.trend_lager}
      </Trend>
    );
  }
  return (
    <Trend>
      <Gelijk />
      {text.basisregels.trend_gelijk}
    </Trend>
  );
}
