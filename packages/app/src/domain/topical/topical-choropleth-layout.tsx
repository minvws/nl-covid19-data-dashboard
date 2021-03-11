import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { TopicalTile } from '~/domain/topical/topical-tile';

interface TopicalChoroplethTileProps {
  title: string;
  choropleth: ReactNode;
  children: ReactNode;
}

export function TopicalChoroplethTile(props: TopicalChoroplethTileProps) {
  const { title, choropleth, children } = props;

  return (
    <TopicalTile>
      <TopicalSectionHeader title={title} />
      <Box
        display="flex"
        flexDirection={{ _: 'column-reverse', md: 'row' }}
        pt={{ _: 3, md: 4 }}
      >
        <Box
          flex={{ _: '1 1 0%', md: '0.8 1 0%', lg: '0.65 1 0%' }}
          px={{ _: 0, sm: 5, md: 3, lg: 5 }}
          pb={{ _: 4, md: 0 }}
        >
          {choropleth}
        </Box>
        <Box
          flex="1 1 0%"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          pl={{ _: 0, md: 5 }}
        >
          {children}
        </Box>
      </Box>
    </TopicalTile>
  );
}
