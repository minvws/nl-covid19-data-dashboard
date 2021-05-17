import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
}

export function Tile({ children, height }: TileProps) {
  return <StyledTile height={height}>{children}</StyledTile>;
}

export function BlueTile({ children, height }: TileProps) {
  return (
    <StyledTile backgroundColor="lightBlue" height={height}>
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  backgroundColor?: string;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    bg: x.backgroundColor ? x.backgroundColor : 'white',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    boxShadow: 'tile',
    height: x.height,
  })
);
