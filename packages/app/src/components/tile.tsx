import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  atTop?: boolean;
}

export function Tile({ children, height, atTop = false }: TileProps) {
  return (
    <StyledTile height={height} atTop={atTop}>
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  atTop: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    py: asResponsiveArray({ _: 3, sm: 4 }),
    height: x.height,
    borderTop: x.atTop ? undefined : 'solid 2px lightGray',
  })
);
