import { colors } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import styled from 'styled-components';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';

interface TileProps {
  children: React.ReactNode;
  height?: number | string;
  id?: string;
  hasNoBorder?: boolean;
  hasNoPaddingBottom?: boolean;
}

export const Tile = ({ children, height, id, hasNoBorder = false, hasNoPaddingBottom = false }: TileProps) => {
  return (
    <StyledTile height={height} hasNoBorder={hasNoBorder} hasNoPaddingBottom={hasNoPaddingBottom} id={id}>
      {children}
    </StyledTile>
  );
};

const StyledTile = styled.article<{
  height?: number | string;
  hasNoBorder: boolean;
  hasNoPaddingBottom: boolean;
}>((styledTileProps) =>
  css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: space[4],
    paddingBottom: styledTileProps.hasNoPaddingBottom ? undefined : asResponsiveArray({ _: space[3], sm: space[4] }),
    height: styledTileProps.height,
    backgroundColor: 'white',
    borderTop: styledTileProps.hasNoBorder ? undefined : `solid 2px ${colors.gray2}`,
  })
);
