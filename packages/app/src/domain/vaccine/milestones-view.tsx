import { css } from '@styled-system/css';
import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import VaccineIcon from '~/assets/vaccine.svg';
import { Box } from '~/components-styled/base';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Tile } from '~/components-styled/tile';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { RichContentBlock } from '~/types/cms';
import { useIntl } from '~/intl';

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
export interface MilestoneViewProps {
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

  const handleExpand = () => setIsExpanded(true);

  return (
    <Tile css={css({ overflow: 'hidden' })}>
      <Heading level={2} m={0}>
        {title}
      </Heading>
      <Box maxWidth="maxWidthText" mb={2}>
        <RichContent blocks={description} />
      </Box>

      <Box
        as="ol"
        p={0}
        m={0}
        mb={3}
        position="relative"
        css={css({ listStyleType: 'none' })}
      >
        <ListItemFirst isExpanded={isExpanded}>
          <CircleSmall />
          <Text fontWeight="bold" m={0} pl={`calc(1rem)`}>
            2021
          </Text>
        </ListItemFirst>

        {milestones.length > MAX_ITEMS_VISIBLE && !isExpanded && (
          <ListItem>
            <Box pl={`calc(1rem + ${CIRCLE_SIZE}px)`}>
              <ExpandButton color="link" onClick={handleExpand}>
                {siteText.milestones.toon_meer}
              </ExpandButton>
            </Box>
          </ListItem>
        )}

        {milestones.map((milestone, index) => (
          <Fragment key={index}>
            {(isExpanded ||
              index > milestones.length - 1 - MAX_ITEMS_VISIBLE) && (
              <>
                {index !== milestones.length - 1 ? (
                  <ListItem>
                    <CircleIcon>
                      <VaccineIcon />
                    </CircleIcon>
                    <Box pl="3" maxWidth="maxWidthText">
                      <InlineText
                        color="gray"
                        css={css({ position: 'absolute', top: '-1.3rem' })}
                      >
                        {formatDate(new Date(milestone.date))}
                      </InlineText>
                      <Text m={0}>{milestone.title}</Text>
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
                    >
                      <InlineText
                        color="white"
                        fontWeight="bold"
                        css={css({ position: 'absolute', top: '-1.3rem' })}
                      >
                        {formatDate(new Date(milestone.date))}
                      </InlineText>
                      <Text m={0} color="white" fontSize={3} fontWeight="bold">
                        {milestone.title}
                      </Text>
                    </Box>
                  </ListItemLast>
                )}
              </>
            )}
          </Fragment>
        ))}
      </Box>

      {expectedMilestones && (
        <Box pl={`calc(1rem + ${CIRCLE_SIZE}px)`}>
          <Text color="gray" m={0} pl={3} mb={2}>
            {siteText.milestones.verwacht}
          </Text>
          <Box as="ul" p={0} m={0} css={css({ listStyleType: 'none' })}>
            {expectedMilestones.map((expectedMilestone, index) => (
              <ExpectedListItem key={index}>
                {expectedMilestone.item}
              </ExpectedListItem>
            ))}
          </Box>
        </Box>
      )}
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

const ListItemFirst = styled.li<{ isExpanded: boolean }>((x) =>
  css({
    ...commonListItemStyles,
    paddingBottom: x.isExpanded ? 4 : 3,
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
      left: -4,
      right: -4,
      width: 'calc(4rem + 100%);',
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

const ExpandButton = styled.button(
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
      backgroundImage: `linear-gradient(${colors.header} 50%, rgba(255,255,255,0) 0%)`,
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
