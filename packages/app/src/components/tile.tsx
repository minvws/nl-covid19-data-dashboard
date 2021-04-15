import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  hasBlueBackground?: boolean;
  isContentHeight?: boolean;
}

export function Tile({
  children,
  hasBlueBackground,
  isContentHeight,
}: TileProps) {
  return (
    <StyledTile
      hasBlueBackground={hasBlueBackground}
      isContentHeight={isContentHeight}
    >
      {children}
    </StyledTile>
  );
}
const StyledTile = styled.article<{
  hasBlueBackground?: boolean;
  isContentHeight?: boolean;
}>((x) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: x.hasBlueBackground ? 'lightBlue' : 'white',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    boxShadow: 'tile',
    height: x.isContentHeight ? '100%' : undefined,
  })
);
