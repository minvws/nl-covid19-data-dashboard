import { Clock } from '@corona-dashboard/icons';
import React from 'react';
import { Box } from '~/components/base';

export function InlineLoader() {
  return (
    <Box width="100%">
      <Clock width="3em" height="3em" />
    </Box>
  );
}
