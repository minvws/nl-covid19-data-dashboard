import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';

interface MeasurementTileProps {
  icon: TopicalIcon;
  title: string;
}

export function MeasurementTile({ icon, title }: MeasurementTileProps) {
  return (
    <Box
      spacing={3}
      borderColor={colors.gray}
      borderWidth="1px"
      borderStyle="solid"
      position="relative"
      display="flex"
      flexDirection={{ _: 'column', xs: 'row' }}
      justifyContent={'space-between'}
    >
      <Box
        display="flex"
        justifyContent={'flex-start'}
        alignItems="center"
        textAlign={'left'}
        p={'1.5rem'}
      >
        <KpiIcon>
          <DynamicIcon name={icon} />
        </KpiIcon>

        <Box
          display="flex"
          justifyContent={'flex-start'}
          textAlign={'left'}
          pr={{ _: 0, xs: 4 }}
        >
          <Markdown content={title} />
        </Box>
      </Box>
    </Box>
  );
}

const KpiIcon = styled.div(
  css({
    color: colors.blue,
    display: 'flex',
    width: 40,
    height: 40,
    marginRight: 3,
  })
);
