import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';
import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { BehaviorFormatted } from '~/domain/behavior/hooks/useFormatAndSortBehavior';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { BehaviorIcon } from '../components/behavior-icon';
import { BehaviorTrend } from '../components/behavior-trend';
import scrollIntoView from 'scroll-into-view-if-needed';
import { BehaviorIdentifier } from '../behavior-types';

interface BehaviorTableTileProps {
  title: string;
  description: string;
  complianceExplanation: string;
  supportExplanation: string;
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
  annotation: string;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: { current: HTMLDivElement | null };
}

export function BehaviorTableTile({
  title,
  description,
  complianceExplanation,
  supportExplanation,
  sortedCompliance,
  sortedSupport,
  annotation,
  setCurrentId,
  scrollRef,
}: BehaviorTableTileProps) {
  const { siteText } = useIntl();
  const commonText = siteText.gedrag_common;

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text mb={4}>{description}</Text>
      </Box>
      <Box display="flex" flexWrap="wrap" mb={{ _: 2, xs: 4 }}>
        <Box mr={3} mb={1}>
          <ExplanationBox background={colors.data.cyan} />
          {complianceExplanation}
        </Box>
        <Box>
          <ExplanationBox background={colors.data.yellow} />
          {supportExplanation}
        </Box>
      </Box>
      <Box overflow="auto" mb={3}>
        <StyledTable>
          <thead>
            <tr>
              <HeaderCell>
                {commonText.basisregels.header_basisregel}
              </HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({
                    _: 120,
                    sm: 150,
                    xl: 200,
                  }),
                })}
              >
                {commonText.basisregels.header_percentage}
              </HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({
                    _: 120,
                    sm: 150,
                    xl: 200,
                  }),
                })}
              >
                {commonText.basisregels.header_trend}
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {sortedCompliance.map((behavior, index) => (
              <tr key={behavior.id}>
                <Cell>
                  <Box display="flex" mr={2}>
                    <Box minWidth={32} color="black" pr={2} display="flex">
                      <BehaviorIcon name={behavior.id} size={20} />
                    </Box>
                    <DescriptionWithIcon
                      description={behavior.description}
                      id={behavior.id}
                      setCurrentId={setCurrentId}
                      scrollRef={scrollRef}
                    />
                  </Box>
                </Cell>
                <Cell>
                  <PercentageBarWithNumber
                    percentage={behavior.percentage}
                    color={colors.data.cyan}
                  />
                  <PercentageBarWithNumber
                    percentage={sortedSupport[index].percentage}
                    color={colors.data.yellow}
                  />
                </Cell>
                <Cell>
                  <Box display="flex" flexDirection="column">
                    <BehaviorTrend
                      trend={behavior.trend}
                      color={colors.data.neutral}
                    />
                    <BehaviorTrend
                      trend={sortedSupport[index].trend}
                      color={colors.data.neutral}
                    />
                  </Box>
                </Cell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Box>
      <Box maxWidth="maxWidthText">
        <Text color="annotation">{annotation}</Text>
      </Box>
    </Tile>
  );
}

/**
 * Render every word in a span and add the chevron to the last word.
 * this is for the word wrapping when the screen gets smaller.
 */
function DescriptionWithIcon({
  description,
  id,
  setCurrentId,
  scrollRef,
}: {
  description: string;
  id: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: { current: HTMLDivElement | null };
}) {
  const splittedWords = description.split(' ');

  const buttonClickHandler = () => {
    scrollIntoView(scrollRef.current as Element);
    setCurrentId(id);
  };

  return (
    <Button onClick={buttonClickHandler}>
      {splittedWords.map((word, index) => (
        <InlineText
          key={index}
          css={css({
            whiteSpace: 'pre-wrap',
            fontFamily: 'body',
            fontSize: '1rem',
          })}
        >
          {splittedWords.length - 1 === index ? (
            <InlineText css={css({ display: 'flex', position: 'relative' })}>
              {word}
              <Box position="absolute" right={-14} top={0}>
                <ChevronIcon width="7px" />
              </Box>
            </InlineText>
          ) : (
            `${word} `
          )}
        </InlineText>
      ))}
    </Button>
  );
}

function PercentageBarWithNumber({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const { formatPercentage } = useIntl();
  return (
    <Box
      color={color}
      display="flex"
      alignItems="center"
      pr={{ _: 2, sm: 2, lg: 4, xl: 5 }}
    >
      <InlineText fontWeight="bold" color="black" pr={2}>
        {`${formatPercentage(percentage)}%`}
      </InlineText>
      <PercentageBar percentage={percentage} height="8px" />
    </Box>
  );
}

const ExplanationBox = styled.div<{ background: string }>((x) =>
  css({
    height: '17px',
    width: '17px',
    background: x.background,
    float: 'left',
    mt: '3px',
    mr: 1,
    borderRadius: '3px',
  })
);

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
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

const Button = styled.button(
  css({
    appearance: 'none',
    background: 'unset',
    border: 0,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    cursor: 'pointer',
    p: 0,
    m: 0,
    pr: 3,

    '&:focus': {
      borderColor: 'lightGray',
      outline: '2px dotted',
      outlineColor: 'blue',
    },

    '&:hover': {
      span: {
        color: 'data.primary',
        textDecoration: 'underline',
      },

      svg: {
        color: 'data.primary',
      },
    },
  })
);
