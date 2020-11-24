import css from '@styled-system/css';
import styled from 'styled-components';
import Warning from '~/assets/warning.svg';
import { Box } from './base';
import { Tile } from './layout';

interface MessageTileProps {
  message: React.ReactNode;
}

export function MessageTile({ message }: MessageTileProps) {
  return (
    <Tile
      mb={4}
      ml={{ _: -4, sm: 0 }}
      mr={{ _: -4, sm: 0 }}
      css={css({
        borderLeft: '9px solid #FFd600',
        backgroundColor: '#FFF4B9',
      })}
    >
      <Box display="flex" alignItems="flex-start">
        <Box mr={3} width={38} flexShrink={0}>
          <Warning width={38} height={38} fill="black" />
        </Box>
        {typeof message === 'string' ? (
          <Children dangerouslySetInnerHTML={{ __html: message }} />
        ) : (
          <Children>{message}</Children>
        )}
      </Box>
    </Tile>
  );
}

const Children = styled.div(
  css({
    maxWidth: 450,
    '> *': {
      mt: 0,
      mb: 3,
      ':last-child': {
        mb: 0,
      },
    },
  })
);
