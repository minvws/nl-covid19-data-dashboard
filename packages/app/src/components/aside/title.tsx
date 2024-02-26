import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { space } from '~/style/theme';
import { Box } from '../base';
import { Text } from '../typography';
import css from '@styled-system/css';

type TitleProps = {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  showArrow?: boolean;
};

export const AsideTitle = ({ title, subtitle, showArrow, icon }: TitleProps) => {
  return (
    <Box width="100%" display="flex" flexDirection="row" flexWrap="nowrap" alignItems="center">
      <Box width="100%">
        <Text>
          <Box as="span" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box display="flex" alignItems="center">
              {icon && <Icon>{icon}</Icon>}
              {title}
            </Box>

            {showArrow && <AsideArrow />}
          </Box>
        </Text>

        {subtitle && <Text>{subtitle}</Text>}
      </Box>
    </Box>
  );
};

const AsideArrow = styled(ChevronRight)`
  color: ${colors.blue8};
  flex-shrink: 0;
  height: 20px;
  width: ${space[3]};
`;

const Icon = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      role="img"
      aria-hidden="true"
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      css={css({
        width: '2.5rem',
        height: '2.5rem',
        svg: {
          height: '2.25rem',
          fill: 'currentColor',
        },
      })}
    >
      {children}
    </Box>
  );
};
