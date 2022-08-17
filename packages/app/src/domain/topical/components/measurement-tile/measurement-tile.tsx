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
      justifyContent={{ _: 'space-between' }}
    >
      <Box
        display="flex"
        justifyContent={{ _: 'flex-start' }}
        textAlign={{ _: 'left' }}
        p={{ _: 3, xs: 4 }}
      >
        <KpiIcon>
          <Doorstroomevenementen />
        </KpiIcon>
        <Markdown
          content={
            'Het aantal positief geteste mensen is de **afgelopen week 10% gestegen**. Hiermee zet de stijgende trend zich voort.'
          }
        />
      </Box>
    </Box>
  );
}

const KpiIcon = styled.div(
  css({
    color: colors.blue,
    display: 'flex',
    minWidth: asResponsiveArray({ _: 40, sm: 50 }),
  })
);
