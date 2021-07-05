import { NlBehaviorValue, VrBehaviorValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import React, { useMemo } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import styled from 'styled-components';
import { isDefined, isPresent } from 'ts-is-present';
import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { BehaviorIcon } from './components/behavior-icon';
import { BehaviorTrend } from './components/behavior-trend';
import { BehaviorIdentifier } from './logic/behavior-types';
import { useBehaviorLookupKeys } from './logic/use-behavior-lookup-keys';

interface BehaviorTableTileProps {
  title: string;
  description: string;
  complianceExplanation: string;
  supportExplanation: string;
  value: NlBehaviorValue | VrBehaviorValue;
  annotation: string;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: { current: HTMLDivElement | null };
}

export function BehaviorTableTile({
  title,
  description,
  complianceExplanation,
  supportExplanation,
  value,
  annotation,
  setCurrentId,
  scrollRef,
}: BehaviorTableTileProps) {
  const { siteText } = useIntl();
  const commonText = siteText.gedrag_common;
  const behaviorsTableData = useBehaviorTableData(value);

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
              <HeaderCell
                css={css({
                  width: asResponsiveArray({
                    _: 200,
                    sm: 300,
                    xl: 400,
                  }),
                })}
              >
                {commonText.basisregels.header_basisregel}
              </HeaderCell>
              <HeaderCell
                css={css({
                  width: asResponsiveArray({
                    _: 100,
                    sm: 100,
                    xl: 150,
                  }),
                })}
              >
                {commonText.basisregels.header_percentage}
              </HeaderCell>
              <HeaderCell
                css={css({
                  width: 125,
                })}
              >
                {commonText.basisregels.header_trend}
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {behaviorsTableData.map((behavior) => (
              <tr key={behavior.id}>
                <Cell
                  css={css({
                    minWidth: asResponsiveArray({ _: '60vw', sm: 300 }),
                  })}
                >
                  <Box display="flex" mr={2}>
                    <Box minWidth={32} color="black" pr={2} display="flex">
                      <BehaviorIcon name={behavior.id} size={25} />
                    </Box>
                    <DescriptionWithIcon
                      description={behavior.description}
                      id={behavior.id}
                      setCurrentId={setCurrentId}
                      scrollRef={scrollRef}
                    />
                  </Box>
                </Cell>
                <Cell css={css({ minWidth: 200 })}>
                  <PercentageBarWithNumber
                    percentage={behavior.compliancePercentage}
                    color={colors.data.cyan}
                  />
                  <PercentageBarWithNumber
                    percentage={behavior.supportPercentage}
                    color={colors.data.yellow}
                  />
                </Cell>
                <Cell css={css({ minWidth: 125 })}>
                  <Box display="flex" flexDirection="column">
                    <BehaviorTrend
                      trend={behavior.complianceTrend}
                      color={colors.body}
                    />
                    <BehaviorTrend
                      trend={behavior.supportTrend}
                      color={colors.body}
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

const Cell = styled.td(
  css({
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
    flexWrap: 'wrap',

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

function useBehaviorTableData(value: NlBehaviorValue) {
  const behaviorLookupKeys = useBehaviorLookupKeys();

  return useMemo(() => {
    return behaviorLookupKeys
      .map((x) => {
        const compliancePercentage = value[x.complianceKey];
        const complianceTrend = value[`${x.complianceKey}_trend` as const];

        const supportPercentage = value[x.supportKey];
        const supportTrend = value[`${x.supportKey}_trend` as const];

        if (
          isPresent(supportPercentage) &&
          isPresent(supportTrend) &&
          isPresent(compliancePercentage) &&
          isPresent(complianceTrend)
        ) {
          return {
            id: x.key,
            description: x.description,
            compliancePercentage,
            complianceTrend,
            supportPercentage,
            supportTrend,
          };
        }
      })
      .filter(isDefined)
      .sort(
        (a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0)
      );
  }, [value, behaviorLookupKeys]);
}
