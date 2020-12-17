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
      <Box display="flex" alignItems={['flex-start', 'center']}>
        <Box mr={3} width={38} flexShrink={0}>
          <StyledWarning />
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

const StyledWarning = styled(Warning)(
  css({
    width: 38,
    height: 38,
    fill: 'black',
    display: 'block',
  })
);

const Children = styled.div(
  css({
    maxWidth: 450,
    fontSize: 3,
    fontWeight: 'bold',
    '> *': {
      mt: 0,
      mb: 3,
      ':last-child': {
        mb: 0,
      },
    },
  })
);
