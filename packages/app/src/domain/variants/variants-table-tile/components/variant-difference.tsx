import { DifferenceDecimal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import Gelijk from '~/assets/gelijk.svg';
import PijlOmhoog from '~/assets/pijl-omhoog.svg';
import PijlOmlaag from '~/assets/pijl-omlaag.svg';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

export function VariantDifference({ value }: { value: DifferenceDecimal }) {
  const { siteText, formatPercentage } = useIntl();
  const diffText = siteText.covid_varianten.varianten_tabel.verschil;

  if (value === undefined) {
    return <>-</>;
  }
  if (value.difference > 0) {
    return (
      <Diff color={colors.body}>
        <PijlOmhoog />
        {formatPercentage(value.difference)}% {diffText.meer}
      </Diff>
    );
  }
  if (value.difference < 0) {
    return (
      <Diff color={colors.body}>
        <PijlOmlaag />
        {formatPercentage(-value.difference)}% {diffText.minder}
      </Diff>
    );
  }
  return (
    <Diff color={colors.data.neutral}>
      <Gelijk color={colors.gray} />
      {diffText.gelijk}
    </Diff>
  );
}

const Diff = styled.span<{ color: string }>((x) =>
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',

    svg: {
      color: x.color,
      mr: 1,
      width: '12px',
      height: '12px',
      verticalAlign: 'middle',
    },
  })
);
