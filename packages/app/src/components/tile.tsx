import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  noBorder?: boolean;
}

export function Tile({ children, height, noBorder = false }: TileProps) {
  return (
    <StyledTile height={height} noBorder={noBorder}>
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  noBorder: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    pt: asResponsiveArray({ _: 2, sm: 3 }),
    pb: asResponsiveArray({ _: 3, sm: 4 }),
    height: x.height,
    backgroundColor: 'white',
    borderTop: x.noBorder ? undefined : 'solid 2px lightGray',
  })
);
