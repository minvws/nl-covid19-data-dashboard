import css from '@styled-system/css';
import styled from 'styled-components';
import Gelijk from '~/assets/gelijk.svg';
import PijlOmhoog from '~/assets/pijl-omhoog.svg';
import PijlOmlaag from '~/assets/pijl-omlaag.svg';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { BehaviorTrendType } from '../logic/behavior-types';
interface BehaviorTrendProps {
  trend: BehaviorTrendType | null;
  color?: string;
}

const Trend = styled.span((a) =>
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',

    svg: {
      color: a.color ?? '#0090DB',
      mr: 1,
      width: '12px',
      height: '12px',
      verticalAlign: 'middle',
    },
  })
);

export function BehaviorTrend({ trend, color }: BehaviorTrendProps) {
  const { siteText } = useIntl();
  const commonText = siteText.gedrag_common;

  if (trend === 'up') {
    return (
      <Trend color={color}>
        <PijlOmhoog />
        {commonText.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend color={color}>
        <PijlOmlaag />
        {commonText.basisregels.trend_lager}
      </Trend>
    );
  }

  if (trend === 'equal') {
    return (
      <Trend color={colors.data.neutral}>
        <Gelijk />
        {commonText.basisregels.trend_gelijk}
      </Trend>
    );
  }
  return <Box paddingLeft={`calc(12px + 0.25rem)`}>–</Box>;
}
