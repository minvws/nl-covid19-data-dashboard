import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { mockTableData } from '~/domain/situations/logic/mock-data';
import { situations } from '~/domain/situations/logic/situations';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { SituationIcon } from './components/situation-icon';
import { useMemo } from 'react';

interface SituationsTableTileProps {
  title: string;
  description: string;
  descriptionDate: string;
  metadata: MetadataProps;
}

export function SituationsTableTile({
  title,
  description,
  descriptionDate,
  metadata,
}: SituationsTableTileProps) {
  const { siteText, formatDateFromSeconds } = useIntl();
  const text = siteText.vr_brononderzoek;

  const data = useMemo(() => mockTableData(), []);

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>
          {description}{' '}
          <InlineText fontWeight="bold">
            {replaceComponentsInText(descriptionDate, {
              date_start_unix: formatDateFromSeconds(data.date_start_unix),
              date_end_unix: formatDateFromSeconds(data.date_end_unix),
            })}
          </InlineText>
        </Text>
      </Box>

      <Box overflow="auto" mb={3}>
        <StyledTable>
          <thead>
            <tr>
              <HeaderCell> {text.table.situation}</HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({ _: 150, md: 350 }),
                })}
              >
                {text.table.research}
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
                    <SituationIcon id={situation} />
                    <InlineText>
                      {siteText.vr_brononderzoek.table[situation]}
                      {/* Needs to be wrapped in a tooltip element */}
                      <>
                        {
                          siteText.vr_brononderzoek.table[
                            `${situation}_description` as typeof situation
                          ]
                        }
                      </>
                    </InlineText>
                  </Box>
                </Cell>

                <Cell>
                  {data.has_sufficient_data ? (
                    <PercentageBar
                      amount={Math.floor(Math.random() * 50) + 1}
                      color={colors.data.primary}
                    />
                  ) : (
                    <Box display="flex" alignSelf="center">
                      <InlineText color="data.axisLabels">
                        {text.table.no_data}
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
