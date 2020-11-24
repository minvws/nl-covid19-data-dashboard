import css from '@styled-system/css';
import { Box } from './base';
import { Tile } from './layout';

interface MessageTileProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

export function MessageTile({ icon, children }: MessageTileProps) {
  return (
    <Tile
      mb={4}
      ml={{ _: -4, sm: 0 }}
      mr={{ _: -4, sm: 0 }}
      css={css({
        borderLeft: '9px solid #FFd600',
        backgroundColor: '#FFFCED',
      })}
    >
      <Box display="flex" alignItems="flex-start">
        <Box mr={3} width={25} flexShrink={0}>
          {icon}
        </Box>
        <Box maxWidth={450} css={css({ p: { m: 0 } })}>
          {children}
        </Box>
      </Box>
    </Tile>
  );
}
