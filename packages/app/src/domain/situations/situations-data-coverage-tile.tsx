import { VrSituationsValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Check } from '@corona-dashboard/icons';
import { Cross } from '@corona-dashboard/icons';
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
  const text = siteText.brononderzoek.veiligheidsregio_dekking;

  const [date_from, date_to] = formatDateSpan(
    { seconds: data.date_start_unix },
    { seconds: data.date_end_unix }
  );

  return (
    <Tile>
      <Box spacing={2}>
        <Heading level={3}>{text.titel}</Heading>
        <CoverageIndicator hasSufficientData={data.has_sufficient_data}>
          <IndicatorCircle>
            {data.has_sufficient_data ? <Check /> : <Cross />}
          </IndicatorCircle>
          {data.has_sufficient_data
            ? text.titel_genoeg_dekking
            : text.titel_niet_genoeg_dekking}
        </CoverageIndicator>
        <Box maxWidth="maxWidthText">
          <Markdown
            content={replaceVariablesInText(
              data.has_sufficient_data
                ? text.beschrijving_genoeg_dekking
                : text.beschrijving_niet_genoeg_dekking,
              {
                date_from,
                date_to,
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
    width: 24,
    height: 24,
    mr: 2,
    mb: '3px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    svg: {
      color: 'white',
    },
  })
);
