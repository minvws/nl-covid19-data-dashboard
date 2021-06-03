import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { situations } from '~/domain/situations/logic/situations';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { SituationIcon } from './components/situation-icon';

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

  const hasData = true;

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>
          {description}{' '}
          <InlineText fontWeight="bold">
            {replaceComponentsInText(descriptionDate, {
              date_start_unix: formatDateFromSeconds(1622727076),
              date_end_unix: formatDateFromSeconds(1622727076),
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
              borderTopColor: 'lightGrey',
            })}
          >
            {situations.map((situation, index) => (
              <tr key={index}>
                <Cell>
                  <Box display="flex" alignItems="center">
                    <SituationIcon id={situation} />
                    <InlineText>
                      {siteText.vr_brononderzoek.table[situation]}
                    </InlineText>
                    <InformationIcon />
                  </Box>
                </Cell>

                <Cell>
                  {hasData ? (
                    <PercentageBar
                      amount={Math.floor(Math.random() * 50) + 1}
                      color={colors.data.primary}
                    />
                  ) : (
                    <Box display="flex" alignSelf="center">
                      <InlineText>{text.table.no_data}</InlineText>
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
    borderBottomColor: 'lightGrey',
    p: 0,
    py: 2,
  })
);

const InformationIcon = styled.div(
  css({
    position: 'relative',
    ml: 1,
    height: 17,
    width: 17,
    backgroundColor: 'data.primary',
    borderRadius: '50%',

    '&:before': {
      position: 'absolute',
      fontSize: '1rem',
      content: '"i"',
      color: '#fff',
      textAlign: 'center',
      width: '100%',
      mt: '-3px',
    },
  })
);

interface PercentageBarProps {
  amount: number;
  color: string;
}

function PercentageBar({ amount, color }: PercentageBarProps) {
  return (
    <Box display="flex" alignItems="center">
      <InlineText css={css({ minWidth: 40 })}>{`${amount}%`}</InlineText>
      <Box width="100%" pr={4}>
        <Box width={`${amount * 2}%`} height={12} backgroundColor={color} />
      </Box>
    </Box>
  );
}
