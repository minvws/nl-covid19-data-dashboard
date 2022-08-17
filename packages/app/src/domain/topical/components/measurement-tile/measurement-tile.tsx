import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import { Doorstroomevenementen } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';

export function MeasurementTile() {
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
        textAlign={'left'}
        p={'1.5rem'}
      >
        <KpiIcon>
          <Doorstroomevenementen />
        </KpiIcon>

        <Box
          display="flex"
          justifyContent={'flex-start'}
          textAlign={'left'}
          pr={{ _: 0, xs: 4 }}
        >
          <Markdown content={'Het aantal positief geteste mensen.'} />
        </Box>
      </Box>
    </Box>
  );
}

const KpiIcon = styled.div(
  css({
    color: colors.blue,
    display: 'flex',
    minWidth: asResponsiveArray(40),
    marginRight: 3,
  })
);
