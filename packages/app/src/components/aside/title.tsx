import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { space } from '~/style/theme';
import { Box } from '../base';
import { Text } from '../typography';
import { Icon } from '~/components/aside/menu';

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
        <Box as="span" display="flex" justifyContent="space-between" alignItems="center" width="100%">
          {icon ? (
            <Box display={'flex'} alignItems={'center'} gridColumnGap={space[2]}>
              {icon && <Icon>{icon}</Icon>}
              <Text fontWeight={'bold'}>{title}</Text>
            </Box>
          ) : (
            <Text>{title}</Text>
          )}
          {showArrow && <AsideArrow />}
        </Box>
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
