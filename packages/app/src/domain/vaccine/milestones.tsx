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

interface MileProps {
  title: string;
  date: string;
}

interface ExpectProps {
  item: string;
}
export interface MileStoneProps {
  title: string;
  description: RichContentBlock[];
  miles: MileProps[];
  expected: ExpectProps[];
}

export function MileStones(props: MileStoneProps) {
  const { title, miles, description, expected } = props;

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => setIsExpanded(false), []);

  function expandedHandler() {
    setIsExpanded(true);
  }

  return (
    <Tile>
      <Heading level={2} m={0}>
        {title}
      </Heading>
      <Box maxWidth="maxWidthText" mb={2}>
        <RichContent blocks={description} />
      </Box>

      <UnorderedList>
        <ListItem isFirst={true}>
          <CircleSmall />
          <Box
            pl={CIRCLE_SIZE / 2}
            css={css({ transform: 'translateY(-6px)' })}
          >
            <Text fontWeight="bold" m={0}>
              2021
            </Text>
          </Box>
        </ListItem>

        {miles.length > MAX_ITEMS_VISIBLE && !isExpanded && (
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

        {miles.map((mile, index) => (
          <Fragment key={index}>
            {(isExpanded || index > miles.length - 1 - MAX_ITEMS_VISIBLE) && (
              <ListItem isLast={index === miles.length - 1}>
                <CircleIcon isLast={index === miles.length - 1}>
                  <VaccineIcon />
                </CircleIcon>

                <Box
                  pl={CIRCLE_SIZE / 2}
                  position="relative"
                  maxWidth="maxWidthText"
                  width="100%"
                  zIndex={2}
                >
                  {index !== miles.length - 1 ? (
                    <>
                      <InlineText
                        color={'gray'}
                        css={css({ position: 'absolute', top: '-1.3rem' })}
                      >
                        {formatDate(new Date(mile.date))}
                      </InlineText>
                      <Text m={0}>{mile.title}</Text>
                    </>
                  ) : (
                    <>
                      <InlineText
                        color={'white'}
                        fontWeight="bold"
                        css={css({ position: 'absolute', top: '-1.3rem' })}
                      >
                        {formatDate(new Date(mile.date))}
                      </InlineText>
                      <Text
                        m={0}
                        color="white"
                        fontSize={{ _: 28, sm: 42 }}
                        fontWeight="bold"
                        lineHeight={0}
                      >
                        {mile.title}
                      </Text>
                    </>
                  )}
                </Box>
                {index === miles.length - 1 && <Background />}
              </ListItem>
            )}
          </Fragment>
        ))}
      </UnorderedList>

      <Text color="gray" m={0} mb={2} pl={3}>
        {siteText.milestones.verwacht}
      </Text>
      <UnorderedList>
        {expected.map((item, index) => (
          <ExpectedListItem key={index}>{item.item}</ExpectedListItem>
        ))}
      </UnorderedList>
    </Tile>
  );
}

const UnorderedList = styled.ul(
  css({
    listStyleType: 'none',
    p: 0,
    m: 0,
    mb: 3,
  })
);

const ListItem = styled.li<{ isLast?: boolean; isFirst?: boolean }>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    alignItems: x.isLast ? 'center' : 'flex-start',
    paddingBottom: x.isFirst ? '2.5rem' : 4,
    paddingTop: x.isLast ? `${1.3 + 2}rem` : '',
    backgroundColor: x.isLast ? 'red' : '',
    listStyleType: 'none',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: CIRCLE_SIZE / 2 - 1,
      width: x.isLast ? '0' : '2px',
      height: '100%',
      backgroundColor: 'header',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '50%',
      left: CIRCLE_SIZE / 2 - 1,
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
      left: CIRCLE_SIZE / 2 - 1,
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
      left: `calc(-1rem - ${CIRCLE_SIZE / 2 + 1}px)`,
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
    left: '-2rem',
    right: '-2rem',
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
