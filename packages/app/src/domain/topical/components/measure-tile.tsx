import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import { space } from '~/style/theme';

interface MeasureTileProps {
  icon: TopicalIcon;
  title: string;
}

export const MeasureTile = ({ icon, title }: MeasureTileProps) => {
  return (
    <Box
      spacing={3}
      borderColor={colors.gray}
      borderWidth="1px"
      borderStyle="solid"
      p="1.5rem"
    >
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <KpiIcon>
          <DynamicIcon name={icon} />
        </KpiIcon>

        <Box display="flex" justifyContent="flex-start">
          <Markdown content={title} />
        </Box>
      </Box>
    </Box>
  );
};

const KpiIcon = styled.div`
  color: ${colors.blue};
  display: flex;
  width: 40px;
  height: 40px;
  margin-right: ${space[3]};
`;
