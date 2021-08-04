import { css } from '@styled-system/css';
import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import VaccineIcon from '~/assets/vaccine.svg';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { RichContentBlock } from '~/types/cms';

const MAX_ITEMS_VISIBLE = 5;
const CIRCLE_SIZE = 26;
const CIRCLE_HALF = CIRCLE_SIZE / 2;

type Milestones = {
  title: string;
  date: string;
};

type ExpectedMilestones = {
  item: string;
};
interface MilestoneViewProps {
  title: string;
  description: RichContentBlock[];
  milestones: Milestones[];
  expectedMilestones: ExpectedMilestones[];
}

export function MilestonesView(props: MilestoneViewProps) {
  const { title, milestones, description, expectedMilestones } = props;

  const { siteText, formatDate } = useIntl();

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => setIsExpanded(false), []);

  const visibleMilestones = isExpanded
    ? milestones
    : milestones.slice(-MAX_ITEMS_VISIBLE);

  return (
    <Tile>
      <Box spacing={3}>
        <Heading level={3}>{title}</Heading>

        <Box maxWidth="maxWidthText">
          <RichContent blocks={description} />
        </Box>

        <Box as="ol" position="relative">
          <ListItemFirst>
            <CircleSmall />
            <Box pl={3}>
              <Text fontWeight="bold">2021</Text>
            </Box>
          </ListItemFirst>

          {milestones.length > MAX_ITEMS_VISIBLE && (
            <ListItem>
              <Box pl={`calc(1rem + ${CIRCLE_SIZE}px)`}>
                <ExpandButton
                  color="link"
                  onClick={() => setIsExpanded((x) => !x)}
                  hasDashedLine={!isExpanded}
                >
                  {isExpanded
                    ? siteText.milestones.toon_minder
                    : siteText.milestones.toon_meer}
                </ExpandButton>
              </Box>
            </ListItem>
          )}

          {visibleMilestones.map((milestone, index, list) => (
            <Fragment key={index}>
              {list[index + 1] ? (
                <ListItem>
                  <CircleIcon>
                    <VaccineIcon />
                  </CircleIcon>
                  <Box pl="3" maxWidth="maxWidthText" width="100%">
                    <InlineText
                      color="gray"
                      css={css({ position: 'absolute', top: '-1.3rem' })}
                    >
                      {formatDate(new Date(milestone.date))}
                    </InlineText>
                    <Text>{milestone.title}</Text>
                    {isExpanded &&
                      index === milestones.length - 1 - MAX_ITEMS_VISIBLE && (
                        <Box
                          pt={3}
                          mb={2}
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor="border"
                        />
                      )}
                  </Box>
                </ListItem>
              ) : (
                <ListItemLast>
                  <CircleIcon isLast={true}>
                    <VaccineIcon />
                  </CircleIcon>
                  <Box
                    pl="3"
                    maxWidth="maxWidthText"
                    position="relative"
                    zIndex={2}
                    color="white"
                    spacing={3}
                  >
                    <Text
                      fontWeight="bold"
                      css={css({ position: 'absolute', top: '-1.3rem' })}
                    >
                      {formatDate(new Date(milestone.date))}
                    </Text>
                    <Text variant="h3">{milestone.title}</Text>
                  </Box>
                </ListItemLast>
              )}
            </Fragment>
          ))}
        </Box>

        {expectedMilestones.length > 0 && (
          <Box pl={`calc(1rem + ${CIRCLE_SIZE}px)`} spacing={2}>
            <Box pl={3}>
              <Text color="gray">{siteText.milestones.verwacht}</Text>
            </Box>
            <Box as="ul" css={css({ listStyleType: 'none' })}>
              {expectedMilestones.map((expectedMilestone, index) => (
                <ExpectedListItem key={index}>
                  {expectedMilestone.item}
                </ExpectedListItem>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Tile>
  );
}

const commonListItemStyles = {
  position: 'relative',
  display: 'flex',
  pb: 4,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '6px',
    left: CIRCLE_HALF - 1,
    width: '2px',
    height: '100%',
    backgroundColor: 'header',
  },
} as React.CSSProperties;

const ListItem = styled.li(css(commonListItemStyles));

const ListItemFirst = styled.li(
  css({
    ...commonListItemStyles,
    paddingBottom: 3,
  })
);

const ListItemLast = styled.li(
  css({
    ...commonListItemStyles,
    paddingTop: '3.3rem',
    color: 'white',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: CIRCLE_HALF - 1,
      width: '2px',
      height: '4rem',
      backgroundColor: 'white',
      zIndex: 2,
    },

    // Background
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: asResponsiveArray({ _: -3, sm: -4 }),
      right: asResponsiveArray({ sm: -4 }),
      width: asResponsiveArray({
        _: 'calc(2rem + 100%);',
        sm: 'calc(4rem + 100%);',
      }),
      height: '100%',
      backgroundColor: 'header',
      zIndex: 1,
    },
  })
);

const CircleIcon = styled.div<{ isLast?: boolean }>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    minWidth: `${CIRCLE_SIZE}px`,
    borderRadius: '100%',
    backgroundColor: x.isLast ? 'white' : 'header',
    zIndex: 3,
    marginTop: x.isLast ? '0.2rem' : 0,

    svg: {
      width: 14,
      height: 14,
      color: x.isLast ? 'header' : 'white',
      transform: 'scaleX(-1)',
    },
  })
);

const CircleSmall = styled.div(
  css({
    display: 'inline-block',
    position: 'relative',
    height: 12,
    width: 12,
    minWidth: 12,
    mx: '7px',
    borderRadius: '100%',
    backgroundColor: 'header',
    transform: 'translateY(6px)',
  })
);

const ExpandButton = styled.button<{ hasDashedLine: boolean }>((x) =>
  css({
    position: 'relative',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'none',
    font: 'inherit',
    color: 'blue',
    outline: 'inherit',
    cursor: 'pointer',

    '&:hover, &:focus': {
      textDecoration: 'underline',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: `calc(-1rem - ${CIRCLE_HALF + 1}px)`,
      height: '100%',
      width: '2px',
      backgroundColor: 'white',
      backgroundImage: `linear-gradient(${colors.header} ${
        x.hasDashedLine ? '50' : '100'
      }%, rgba(255,255,255,0) 0%)`,
      backgroundSize: '100% 7px',
      backgroundPosition: '0 3px',
      backgroundRepeat: 'repeat-y',
    },
  })
);

const ExpectedListItem = styled.li(
  css({
    position: 'relative',
    mb: 10,
    pl: 3,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 'calc(50% - 3px)',
      left: 0,
      height: 6,
      width: 6,
      borderRadius: '100%',
      border: '1px solid black',
    },
  })
);
