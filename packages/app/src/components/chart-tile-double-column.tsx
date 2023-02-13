import { ReactNode } from 'react';
import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';
import { ErrorBoundary } from './error-boundary';
import { FullscreenChartTile } from './fullscreen-chart-tile';
import { Heading } from './typography';
import { Markdown } from './markdown';
import { MetadataProps } from './metadata';
import { space } from '~/style/theme';

interface ChartTileDoubleColumnProps {
  title: string;
  metadata?: MetadataProps;
  description?: string;
  disableFullscreen?: boolean;
  children: ReactNode;
}

export const ChartTileDoubleColumn = ({ title, description, children, metadata, disableFullscreen }: ChartTileDoubleColumnProps) => {
  return (
    <FullscreenChartTile metadata={metadata} disabled={disableFullscreen}>
      {/* padding-right to make sure the title doesn't touch/overlap the full screen button */}
      <Heading level={3} css={css({ paddingRight: asResponsiveArray({ md: space[5] }), marginBottom: space[3] })}>
        {title}
      </Heading>

      <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }} justifyContent={{ _: 'flex-start', lg: 'space-between' }} alignItems={{ _: 'flex-start', lg: 'normal' }}>
        {description && (
          <Box width={{ _: '100%', lg: '50%' }}>
            <Box maxWidth="maxWidthText">
              <Markdown content={description} />
            </Box>
          </Box>
        )}

        <Box width={{ _: '100%', lg: '50%' }}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Box>
      </Box>
    </FullscreenChartTile>
  );
};
