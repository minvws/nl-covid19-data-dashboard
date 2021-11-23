import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  noBorder?: boolean;
  noPadding?: boolean;
  isFirstElement?: boolean;
};

export function Tile({
  children,
  height,
  noBorder = false,
  noPadding = false,
  isFirstElement = true,
}: TileProps) {

  return (
    <StyledTile height={height} noBorder={noBorder} noPadding={noPadding} isFirstElement={isFirstElement}>
      {children}
    </StyledTile>
  );
}

const StyledTile = styled.article<{
  height?: number | string;
  noBorder: boolean;
  noPadding: boolean;
  isFirstElement: boolean;
}>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    pt: x.noPadding ? undefined : x.isFirstElement ? 4 : '.5rem',
    pb: x.noPadding ? undefined : x.isFirstElement ? asResponsiveArray({ _: 3, sm: 4 }) : '2rem',
    height: x.height,
    backgroundColor: 'white',
    borderTop: x.noBorder ? undefined : 'solid 2px lightGray',
    mb: x.isFirstElement ? undefined : '1rem',
  }),
);
