import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  hasNoBorder?: boolean;
  hasNoPaddingBottom?: boolean;
}

export function Tile({
  children,
  height,
  hasNoBorder = false,
  hasNoPaddingBottom = false,
}: TileProps) {
  return (
    <StyledTile
      height={height}
      hasNoBorder={hasNoBorder}
      hasNoPaddingBottom={hasNoPaddingBottom}
    >
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  hasNoBorder: boolean;
  hasNoPaddingBottom: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    pt: 4,
    pb: x.hasNoPaddingBottom ? undefined : asResponsiveArray({ _: 3, sm: 4 }),
    height: x.height,
    backgroundColor: 'white',
    borderTop: x.hasNoBorder ? undefined : 'solid 2px lightGray',
  })
);
