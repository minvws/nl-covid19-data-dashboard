import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  hasBlueBackground?: boolean;
  hasContentHeight?: boolean;
}

export function Tile({
  children,
  hasBlueBackground,
  hasContentHeight,
}: TileProps) {
  return (
    <StyledTile
      hasBlueBackground={hasBlueBackground}
      hasContentHeight={hasContentHeight}
    >
      {children}
    </StyledTile>
  );
}
const StyledTile = styled.article<{
  hasBlueBackground?: boolean;
  hasContentHeight?: boolean;
}>((x) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: x.hasBlueBackground ? 'lightBlue' : 'white',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    boxShadow: 'tile',
    height: x.hasContentHeight ? '100%' : undefined,
  })
);
