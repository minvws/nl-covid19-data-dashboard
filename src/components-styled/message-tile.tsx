import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from './base';
import { Tile } from './layout';

interface MessageTileProps {
  children: React.ReactNode;
}

export function MessageTile({ children }: MessageTileProps) {
  return (
    <Tile
      css={css({
        pb: 4,
        mb: 4,
        mx: [-4, null, 0],
        backgroundColor: '#FFF4B9',
        borderLeft: '9px solid #FFd600',
      })}
    >
      <Box display="flex" alignItems="flex-start">
        <Box mr={3} flexShrink={0}>
          <WarningIcon />
        </Box>
        <Box maxWidth={450} css={css({ p: { m: 0 } })}>
          {children}
        </Box>
      </Box>
    </Tile>
  );
}

function WarningIcon() {
  return (
    <Svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.99 29.776c-1.012 0-1.537.72-1.537 1.641 0 1.04.566 1.6 1.557 1.6 1.011 0 1.537-.7 1.537-1.6 0-1.06-.566-1.64-1.557-1.64zM25.223 29.042l-2.468.063v-9.47l2.701-.232-.233 6.42v3.219z"
        fill="#000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.722 36.015L25.584 8.973A2.003 2.003 0 0023.862 8h-.008a2.005 2.005 0 00-1.722.985L6.27 36.028a1.962 1.962 0 00-.003 1.98A2.004 2.004 0 008 39h32c.718 0 1.38-.38 1.737-.998a1.96 1.96 0 00-.015-1.987zm-30.249-.972l12.404-21.147 12.62 21.147H11.473z"
      />
    </Svg>
  );
}

const Svg = styled.svg(
  css({
    width: 40,
    height: 40,
    fill: 'black',
    display: 'block',
  })
);
