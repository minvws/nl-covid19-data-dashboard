import { colors, VrSituationsValue } from '@corona-dashboard/common';
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
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SituationIcon } from './components/situation-icon';
interface SituationsTableTileProps {
  data: VrSituationsValue;
  metadata: MetadataProps;
  text: SiteText['pages']['situations_page']['shared'];
}

export function SituationsTableTile({ metadata, data, text }: SituationsTableTileProps) {
  const { formatDateSpan } = useIntl();
  const situations = useSituations(text.situaties);

  const [date_from, date_to] = formatDateSpan({ seconds: data.date_start_unix }, { seconds: data.date_end_unix });

  return (
    <Tile>
      <Heading level={3}>{text.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown
          content={replaceVariablesInText(text.veiligheidsregio_tabel.beschrijving, {
            date_from,
            date_to,
          })}
        />
      </Box>

      <Box overflow="auto" marginBottom={space[3]}>
        <StyledTable>
          <thead>
            <tr>
              <HeaderCell> {text.veiligheidsregio_tabel.soort_situatie}</HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({
                    xs: '150px',
                    sm: '200px',
                    lg: '350px',
                  }),
                })}
              >
                {text.veiligheidsregio_tabel.laatste_onderzoek}
              </HeaderCell>
            </tr>
          </thead>
          <tbody
            css={css({
              borderTop: '1px solid',
              borderTopColor: colors.gray2,
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
                    <PercentageBar amount={data[situation.id] as number} color={colors.primary} />
                  ) : (
                    <Box display="flex" alignSelf="center">
                      <InlineText color={colors.gray6}>{text.veiligheidsregio_tabel.niet_genoeg_gegevens}</InlineText>
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
    paddingBottom: space[3],
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    paddingBottom: '12px',
  })
);

const Cell = styled.td((x) =>
  css({
    color: x.color,
    borderBottom: '1px solid',
    borderBottomColor: colors.gray2,
    padding: '0',
    paddingY: space[2],
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
      <InlineText textAlign="right" css={css({ minWidth: '40px' })}>{`${formatPercentage(amount, {
        minimumFractionDigits: 1,
      })}%`}</InlineText>
      <Box width="100%" paddingRight={space[4]}>
        <Box width={`${amount}%`} height="12px" backgroundColor={color} />
      </Box>
    </Box>
  );
}
