import React from 'react';
import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';
import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';

interface TwoKpiSectionProps {
  children: React.ReactNode;
  spacing?: number;
  hasBorder?: boolean;
  hasPadding?: boolean;
}

export function TwoKpiSection({ children, spacing, hasBorder = false, hasPadding = false }: TwoKpiSectionProps) {
  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      css={css({
        borderTop: hasBorder ? `solid 2px ${colors.gray2}` : undefined,
        paddingTop: hasPadding ? space[4] : undefined,
        paddingBottom: hasPadding ? asResponsiveArray({ _: space[3], sm: space[4] }) : undefined,
        '& > *': {
          flex: 1,
        },
        '& > *:not(:last-child)': {
          marginRight: asResponsiveArray({ _: '0', lg: spacing ?? space[5] }),
          marginBottom: asResponsiveArray({ _: spacing ?? space[4], lg: '0' }),
        },
      })}
    >
      {children}
    </Box>
  );
}
