import { RichContentBlock } from '~/types/cms';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Tile } from '~/components-styled/tile';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import styled from 'styled-components';
import { css } from '@styled-system/css';
import { Box } from '~/components-styled/base';
import { formatDate } from '~/utils/formatDate';
import { useState, Fragment } from 'react';

const MAX_ITEMS_VISIBLE = 3;
const DOT_SIZE = 26;

interface MileProp {
  title: string;
  date: string;
}

interface ExpectProp {
  item: string;
}
interface MileStoneProps {
  title: string;
  description: RichContentBlock[];
  miles: MileProp[];
  expected: ExpectProp;
}

export function MileStones(props: MileStoneProps) {
  const { title, miles, description } = props;

  const [expand, setExpand] = useState(false);

  function toggleExpandHandler() {
    setExpand(true);
  }

  return (
    <Tile css={css({ px: 0 })}>
      <Heading level={2}>{title}</Heading>
      <RichContent blocks={description} />

      <UnorderedList>
        <ListItem isFirst={true}>
          <DotSmall />
          <Box pl={DOT_SIZE / 2} css={css({ transform: 'translateY(-6px)' })}>
            <Text fontWeight="bold" m={0}>
              2021
            </Text>
          </Box>
        </ListItem>

        {miles.length > MAX_ITEMS_VISIBLE && !expand && (
          <ListItemButton>
            <Box
              pl={`${DOT_SIZE + 13}px`}
              css={css({ transform: 'translateY(-6px)' })}
            >
              <Box onClick={toggleExpandHandler}>Toggle expand</Box>
            </Box>
          </ListItemButton>
        )}

        {miles.map((mile, index) => (
          <Fragment key={index}>
            {(expand || index > miles.length - 1 - MAX_ITEMS_VISIBLE) && (
              <ListItem isLast={index === miles.length - 1}>
                <DotIcon isLast={index === miles.length - 1} />
                <Box
                  pl={DOT_SIZE / 2}
                  position="relative"
                  maxWidth={400}
                  width="100%"
                >
                  <InlineText
                    color={'gray'}
                    css={css({ position: 'absolute', top: -20 })}
                  >
                    {formatDate(new Date(mile.date))}
                  </InlineText>
                  <Text m={0}>{mile.title}</Text>
                </Box>
              </ListItem>
            )}
          </Fragment>
        ))}
      </UnorderedList>

      <Text>Verwacht</Text>
      {/* <ul>
      {expected.map((item: string, index: number)=> (
        <li key={index}>{item.item}</li>
      ))}
      </ul> */}
    </Tile>
  );
}

// {index !== miles.length -1 ? (
//   <p>Niet laatste</p>
// ) : (
//   <p>Laatste</p>
// )}

const UnorderedList = styled.ul(
  css({
    listStyleType: 'none',
    padding: 0,
  })
);

const ListItem = styled.li<{ isLast?: boolean; isFirst?: boolean }>((x) =>
  css({
    listStyleType: 'none',
    display: 'flex',
    position: 'relative',
    paddingBottom: x.isFirst ? '30px' : '53px',
    paddingTop: x.isLast ? '30px' : '',
    backgroundColor: x.isLast ? 'red' : '',
    overflow: x.isLast ? 'hidden' : 'visible',

    '&::before': {
      top: 0,
      left: DOT_SIZE / 2 - 1,
      content: '""',
      position: 'absolute',
      width: x.isLast ? '0' : '2px',
      height: '100%',
      backgroundColor: 'blue',
    },

    '&::after': {
      bottom: '50%',
      left: DOT_SIZE / 2 - 1,
      content: '""',
      position: 'absolute',
      width: x.isLast ? '2px' : '0',
      height: '100%',
      backgroundColor: '#fff',
    },

    'p, span': {
      color: x.isLast ? '#fff' : '',
    },
  })
);

const ListItemButton = styled.li(
  css({
    listStyleType: 'none',
    display: 'flex',
    position: 'relative',
    paddingBottom: '30px',

    '&::before': {
      top: 0,
      left: DOT_SIZE / 2 - 1,
      content: '""',
      position: 'absolute',
      width: '2px',
      height: '100%',
      backgroundColor: 'blue',
    },
  })
);

const DotIcon = styled.div<{ isLast: boolean }>((x) =>
  css({
    display: 'inline-block',
    position: 'relative',
    backgroundColor: x.isLast ? '#fff' : 'red',
    height: DOT_SIZE,
    width: DOT_SIZE,
    borderRadius: '100%',
    zIndex: 2,
  })
);

const DotSmall = styled.div(
  css({
    display: 'inline-block',
    position: 'relative',
    backgroundColor: 'red',
    height: 11,
    width: 11,
    borderRadius: '100%',
    mx: '8px',
  })
);
