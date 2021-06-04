import { VrSituationsValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import CheckIcon from '~/assets/check.svg';
import CrossIcon from '~/assets/cross.svg';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface SituationsDataCoverageTileProps {
  data: VrSituationsValue;
}

export function SituationsDataCoverageTile({
  data,
}: SituationsDataCoverageTileProps) {
  const { siteText, formatDateSpan } = useIntl();
  const text = siteText.vr_brononderzoek.tile_coverage;

  const [date_from, date_to] = formatDateSpan(
    { seconds: data.date_start_unix },
    { seconds: data.date_end_unix }
  );

  return (
    <Tile>
      <Box spacing={2}>
        <Heading level={3}>{text.title}</Heading>
        <CoverageIndicator hasSufficientData={data.has_sufficient_data}>
          <IndicatorCircle>
            {data.has_sufficient_data ? <CheckIcon /> : <CrossIcon />}
          </IndicatorCircle>
          {data.has_sufficient_data
            ? text.title_enough_coverage
            : text.title_not_enough_coverage}
        </CoverageIndicator>
        <Box maxWidth="maxWidthText">
          <Markdown
            content={replaceVariablesInText(
              data.has_sufficient_data
                ? text.description_enough_coverage
                : text.description_not_enough_coverage,
              {
                date_to,
                date_from,
              }
            )}
          />
        </Box>
      </Box>
    </Tile>
  );
}

const CoverageIndicator = styled.div<{ hasSufficientData: boolean }>((x) =>
  css({
    display: 'flex',
    alignItems: 'center',
    fontSize: 3,
    fontWeight: 600,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: x.hasSufficientData ? 'data.primary' : 'gray',
  })
);

const IndicatorCircle = styled.div(
  css({
    width: 23,
    height: 23,
    mr: 2,
    mb: '3px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',

    svg: {
      color: 'white',
    },
  })
);
