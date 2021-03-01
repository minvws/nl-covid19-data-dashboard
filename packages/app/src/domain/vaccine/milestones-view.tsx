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
import { formatDate } from '~/utils/formatDate';
import siteText from '~/locale/index';

const MAX_ITEMS_VISIBLE = 5;
const CIRCLE_SIZE = 26;
const CIRCLE_HALF = CIRCLE_SIZE / 2;

type MilestonesType = {
  title: string;
  date: string;
};

type ExpectedMilestonesType = {
  item: string;
};
export interface MilestoneViewProps {
  title: string;
  description: RichContentBlock[];
  milestones: MilestonesType[];
  expectedMilestones: ExpectedMilestonesType[];
}

export function MilestonesView(props: MilestoneViewProps) {
  const { title, milestones, description, expectedMilestones } = props;

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => setIsExpanded(false), []);

  const expandedHandler = () => setIsExpanded(true);

  return (
    <Tile css={css({ overflow: 'hidden' })}>
      <Heading level={2} m={0}>
        {title}
      </Heading>
      <Box maxWidth="maxWidthText" mb={2}>
        <RichContent blocks={description} />
      </Box>

      <Box as="ul" p={0} m={0} mb={3}>
        <ListItem isFirst={true} isExpanded={isExpanded}>
          <CircleSmall />
          <Box pl={CIRCLE_HALF} css={css({ transform: 'translateY(-6px)' })}>
            <Text fontWeight="bold" m={0}>
              2021
            </Text>
          </Box>
        </ListItem>

        {milestones.length > MAX_ITEMS_VISIBLE && !isExpanded && (
          <ListItemButton>
            <Box
              pl={`calc(${CIRCLE_SIZE}px + 1rem)`}
              css={css({ transform: 'translateY(-6px)' })}
            >
              <StyledButton color="link" onClick={expandedHandler}>
                {siteText.milestones.toon_meer}
              </StyledButton>
            </Box>
          </ListItemButton>
        )}

        {milestones.map((item, index) => (
          <Fragment key={index}>
            {(isExpanded ||
              index > milestones.length - 1 - MAX_ITEMS_VISIBLE) && (
              <ListItem isLast={index === milestones.length - 1}>
                <CircleIcon isLast={index === milestones.length - 1}>
                  <VaccineIcon />
                </CircleIcon>

                <Box
                  pl={CIRCLE_HALF}
                  position="relative"
                  maxWidth="maxWidthText"
                  width="100%"
                  zIndex={2}
                >
                  {index !== milestones.length - 1 ? (
                    <>
                      <InlineText
                        color={'gray'}
                        css={css({ position: 'absolute', top: '-1.3rem' })}
                      >
                        {formatDate(new Date(item.date))}
                      </InlineText>
                      <Text m={0}>{item.title}</Text>
                    </>
                  ) : (
                    <>
                      <InlineText
                        color={'white'}
                        fontWeight="bold"
                        css={css({ position: 'absolute', top: '-1.3rem' })}
                      >
                        {formatDate(new Date(item.date))}
                      </InlineText>
                      <Text
                        m={0}
                        color="white"
                        fontSize={{ _: 28, sm: 42 }}
                        fontWeight="bold"
                        lineHeight={0}
                      >
                        {item.title}
                      </Text>
                    </>
                  )}
                </Box>
                {index === milestones.length - 1 && <Background />}
              </ListItem>
            )}
          </Fragment>
        ))}
      </Box>
      <Box pl={CIRCLE_SIZE * 1.5}>
        <Text color="gray" m={0} pl={3} mb={2}>
          {siteText.milestones.verwacht}
        </Text>
        <Box as="ul" p={0} m={0} css={css({ listStyleType: 'none' })}>
          {expectedMilestones.map((item, index) => (
            <ExpectedListItem key={index}>{item.item}</ExpectedListItem>
          ))}
        </Box>
      </Box>
    </Tile>
  );
}

const ListItem = styled.li<{
  isLast?: boolean;
  isFirst?: boolean;
  isExpanded?: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    alignItems: x.isLast ? 'center' : 'flex-start',
    paddingBottom: x.isFirst ? (x.isExpanded ? 4 : 3) : 4,
    paddingTop: x.isLast ? `3.3rem` : '',
    backgroundColor: x.isLast ? 'red' : '',
    listStyleType: 'none',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: CIRCLE_HALF - 1,
      width: x.isLast ? '0' : '2px',
      height: '100%',
      backgroundColor: 'header',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '50%',
      left: CIRCLE_HALF - 1,
      width: x.isLast ? '2px' : '0',
      height: x.isLast ? '50%' : '100%',
      backgroundColor: 'white',
    },
  })
);

const ListItemButton = styled.li(
  css({
    display: 'flex',
    position: 'relative',
    paddingBottom: 4,
    listStyleType: 'none',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: CIRCLE_HALF - 1,
      width: '2px',
      height: '100%',
      backgroundColor: 'header',
    },
  })
);

const StyledButton = styled.button(
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
      backgroundSize: '100% 6px',
      backgroundPosition: '0 2 px',
      backgroundRepeat: 'repeat-y',
    },
  })
);

const CircleIcon = styled.div<{ isLast: boolean }>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    minWidth: CIRCLE_SIZE,
    borderRadius: '100%',
    backgroundColor: x.isLast ? 'white' : 'header',
    zIndex: 2,

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
    height: 11,
    width: 11,
    minWidth: 11,
    mx: '8px',
    borderRadius: '100%',
    backgroundColor: 'header',
  })
);

const Background = styled.div(
  css({
    position: 'absolute',
    top: 0,
    left: -4,
    right: -4,
    width: 'calc(4rem + 100%);',
    height: '100%',
    backgroundColor: 'header',
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
