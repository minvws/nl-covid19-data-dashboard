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
import { SiteText } from '~/locale';
import { fontSizes, space } from '~/style/theme';

interface SituationsDataCoverageTileProps {
  data: VrSituationsValue;
  text: SiteText['pages']['situations_page']['shared']['veiligheidsregio_dekking'];
}

export function SituationsDataCoverageTile({ data, text }: SituationsDataCoverageTileProps) {
  const { formatDateSpan } = useIntl();

  const [date_from, date_to] = formatDateSpan({ seconds: data.date_start_unix }, { seconds: data.date_end_unix });

  return (
    <Tile>
      <Box spacing={2}>
        <Heading level={3}>{text.titel}</Heading>
        <CoverageIndicator hasSufficientData={data.has_sufficient_data}>
          <IndicatorCircle>{data.has_sufficient_data ? <Check aria-hidden="true" /> : <Cross aria-hidden="true" />}</IndicatorCircle>
          {data.has_sufficient_data ? text.titel_genoeg_dekking : text.titel_niet_genoeg_dekking}
        </CoverageIndicator>
        <Box maxWidth="maxWidthText">
          <Markdown
            content={replaceVariablesInText(data.has_sufficient_data ? text.beschrijving_genoeg_dekking : text.beschrijving_niet_genoeg_dekking, {
              date_from,
              date_to,
            })}
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
    fontSize: fontSizes[3],
    fontWeight: 600,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: x.hasSufficientData ? 'primary' : 'gray5',
  })
);

const IndicatorCircle = styled.div(
  css({
    width: '24px',
    height: '24px',
    marginRight: space[2],
    marginBottom: '3px',
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
