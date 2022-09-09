import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  hasNoBorder?: boolean;
  hasNoSpace?: boolean;
}

export function Tile({
  children,
  height,
  hasNoBorder = false,
  hasNoSpace = false,
}: TileProps) {
  return (
    <StyledTile
      height={height}
      hasNoBorder={hasNoBorder}
      hasNoSpace={hasNoSpace}
    >
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  hasNoBorder: boolean;
  hasNoSpace: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    pt: 4,
    pb: x.hasNoSpace ? undefined : asResponsiveArray({ _: 3, sm: 4 }),
    height: x.height,
    backgroundColor: 'white',
    borderTop: x.hasNoBorder ? undefined : 'solid 2px lightGray',
  })
);
