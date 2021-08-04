import { VrSituationsValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, InlineText } from '~/components/typography';
import { useSituations } from '~/domain/situations/logic/situations';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SituationIcon } from './components/situation-icon';
interface SituationsTableTileProps {
  data: VrSituationsValue;
  metadata: MetadataProps;
}

export function SituationsTableTile({
  metadata,
  data,
}: SituationsTableTileProps) {
  const { siteText, formatDateSpan } = useIntl();
  const text = siteText.brononderzoek.veiligheidsregio_tabel;

  const situations = useSituations();

  const [date_from, date_to] = formatDateSpan(
    { seconds: data.date_start_unix },
    { seconds: data.date_end_unix }
  );

  return (
    <Tile>
      <Heading level={3}>{text.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown
          content={replaceVariablesInText(text.beschrijving, {
            date_from,
            date_to,
          })}
        />
      </Box>

      <Box overflow="auto" mb={3}>
        <StyledTable>
          <thead>
            <tr>
              <HeaderCell> {text.soort_situatie}</HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({
                    xs: 150,
                    sm: 200,
                    lg: 350,
                  }),
                })}
              >
                {text.laatste_onderzoek}
              </HeaderCell>
            </tr>
          </thead>
          <tbody
            css={css({
              borderTop: '1px solid',
              borderTopColor: 'lightGray',
            })}
          >
            {situations.map((situation, index) => (
              <tr key={index}>
                <Cell>
                  <Box display="flex" alignItems="center">
                    <SituationIcon id={situation.id} />
                    <InlineTooltip content={situation.description}>
                      <InlineText>{situation.title}</InlineText>
                    </InlineTooltip>
                  </Box>
                </Cell>

                <Cell>
                  {isPresent(data[situation.id]) ? (
                    <PercentageBar
                      amount={data[situation.id] as number}
                      color={colors.data.primary}
                    />
                  ) : (
                    <Box display="flex" alignSelf="center">
                      <InlineText color="data.axisLabels">
                        {text.niet_genoeg_gegevens}
                      </InlineText>
                    </Box>
                  )}
                </Cell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
    pb: 3,
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    pb: '12px',
  })
);

const Cell = styled.td((x) =>
  css({
    color: x.color,
    borderBottom: '1px solid',
    borderBottomColor: 'lightGray',
    p: 0,
    py: 2,
  })
);
interface PercentageBarProps {
  amount: number;
  color: string;
}

function PercentageBar({ amount, color }: PercentageBarProps) {
  const { formatPercentage } = useIntl();

  return (
    <Box display="flex" alignItems="center" spacingHorizontal={2}>
      <InlineText
        textAlign="right"
        css={css({ minWidth: 40 })}
      >{`${formatPercentage(amount, {
        minimumFractionDigits: 1,
      })}%`}</InlineText>
      <Box width="100%" pr={4}>
        <Box width={`${amount}%`} height={12} backgroundColor={color} />
      </Box>
    </Box>
  );
}
