import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  noBorder?: boolean;
  noPadding?: boolean;
}

export function Tile({
  children,
  height,
  noBorder = false,
  noPadding = false,
}: TileProps) {
  return (
    <StyledTile height={height} noBorder={noBorder} noPadding={noPadding}>
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  noBorder: boolean;
  noPadding: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    pt: x.noPadding ? undefined : 4,
    pb: x.noPadding ? undefined : asResponsiveArray({ _: 3, sm: 4 }),
    height: x.height,
    backgroundColor: 'white',
    borderTop: x.noBorder ? undefined : 'solid 2px lightGray',
  })
);
