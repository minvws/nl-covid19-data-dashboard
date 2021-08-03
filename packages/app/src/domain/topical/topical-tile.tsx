import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { spacingStyle } from '~/style/functions/spacing';
import { asResponsiveArray } from '~/style/utils';

export function TopicalTile({ children }: { children: ReactNode }) {
  return <StyledTopicalTile>{children}</StyledTopicalTile>;
}

const StyledTopicalTile = styled.article(
  css({
    display: 'flex',
    flexDirection: 'column',
    py: 4,
    px: asResponsiveArray({ _: 3, md: 0 }),
    mx: asResponsiveArray({ _: -3, md: 0 }),
    mb: 0,
    borderRadius: 1,
    ...spacingStyle({ _: 3, md: 4 }),
  })
);
