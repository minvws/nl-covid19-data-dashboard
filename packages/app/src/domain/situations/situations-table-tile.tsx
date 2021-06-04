import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { useSituations } from '~/domain/situations/logic/situations';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { SituationIcon } from './components/situation-icon';

interface SituationsTableTileProps {
  data: any;
  metadata: MetadataProps;
}

export function SituationsTableTile({
  metadata,
  data,
}: SituationsTableTileProps) {
  const { siteText, formatDateSpan } = useIntl();
  const text = siteText.vr_brononderzoek.table;

  const situations = useSituations();

  const [date_from, date_to] = formatDateSpan(
    { seconds: data.date_start_unix },
    { seconds: data.date_end_unix }
  );

  return (
    <Tile>
      <Heading level={3}>{text.title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>
          <Markdown
            content={replaceVariablesInText(text.description, {
              date_from: date_from,
              date_to: date_to,
            })}
          />
        </Text>
      </Box>

      <Box overflow="auto" mb={3}>
        <StyledTable>
          <thead>
            <tr>
              <HeaderCell> {text.situation}</HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({ _: 150, md: 350 }),
                })}
              >
                {text.research}
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
                    <InlineText>
                      {situation.title}
                      <>{situation.description}</>
                    </InlineText>
                  </Box>
                </Cell>

                <Cell>
                  {data[situation.id] ? (
                    <PercentageBar
                      amount={data[situation.id]}
                      color={colors.data.primary}
                    />
                  ) : (
                    <Box display="flex" alignSelf="center">
                      <InlineText color="data.axisLabels">
                        {text.no_data}
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
    <Box display="flex" alignItems="center">
      <InlineText css={css({ minWidth: 40 })}>{`${formatPercentage(
        amount
      )}%`}</InlineText>
      <Box width="100%" pr={4}>
        <Box width={`${amount * 2}%`} height={12} backgroundColor={color} />
      </Box>
    </Box>
  );
}
