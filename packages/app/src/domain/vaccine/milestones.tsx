// import { RichContentBlock } from '~/types/cms';
// import { RichContent } from '~/components-styled/cms/rich-content';
import { Tile } from '~/components-styled/tile';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import styled from 'styled-components';
import { css } from '@styled-system/css';
import { Box } from '~/components-styled/base';
import { formatDate } from '~/utils/formatDate';
import { useState, Fragment } from 'react';

const MAX_ITEMS_VISIBLE = 3;

interface MileProp {
  title: string;
  date: string;
}

interface ExpectProp {
  item: string;
}
interface MileStoneProps {
  title: string;
  // description: RichContentBlock[] | null;
  miles: MileProp[];
  expected: ExpectProp;
}

export function MileStones(props: MileStoneProps) {
  const { title, miles } = props;

  const [expand, setExpand] = useState(true);

  function toggleExpandHandler() {
    setExpand(!expand);
  }

  return (
    <Tile css={css({ padding: 0 })}>
      <Heading level={2}>{title}</Heading>
      {/* <RichContent blocks={description} /> */}
      <Box onClick={toggleExpandHandler}>Toggle expand</Box>
      <UnorderedList>
        {miles.map((mile, index) => (
          <Fragment key={index}>
            {(expand || index > miles.length - 1 - MAX_ITEMS_VISIBLE) && (
              <ListItem>
                <Box>
                  <InlineText color={'gray'}>
                    {formatDate(new Date(mile.date))}
                  </InlineText>
                </Box>
                <Box>
                  <Text>{mile.title}</Text>
                </Box>
                <Box width={60}>
                  <StyledDot>icon</StyledDot>
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

const ListItem = styled.li(
  css({
    listStyleType: 'none',
    display: 'flex',
  })
);

const UnorderedList = styled.ul(
  css({
    listStyleType: 'none',
  })
);

const StyledDot = styled.div(
  css({
    backgroundColor: 'red',
    height: 30,
    width: 30,
    borderRadius: '100%',
    '&::after': {},
  })
);
