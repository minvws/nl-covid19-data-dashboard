import { Box } from '~/components/base';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { space } from '~/style/theme';
import { RichContent } from '~/components/cms/rich-content';
import { PortableTextEntry } from '@sanity/block-content-to-react';

interface TopicalMeasureTileProps {
  icon: TopicalIcon;
  title: PortableTextEntry[];
}

export const TopicalMeasureTile = ({ icon, title }: TopicalMeasureTileProps) => {
  return (
    <Box spacing={3} borderColor={colors.gray3} borderWidth="1px" borderStyle="solid" padding="1.5rem">
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <StyledKpiIcon>
          <DynamicIcon name={icon} aria-hidden="true" />
        </StyledKpiIcon>

        <Box display="flex" justifyContent="flex-start">
          <RichContent blocks={title} elementAlignment="start" />
        </Box>
      </Box>
    </Box>
  );
};

const StyledKpiIcon = styled.div`
  color: ${colors.blue8};
  display: flex;
  width: 40px;
  height: 40px;
  margin-right: ${space[3]};
`;
