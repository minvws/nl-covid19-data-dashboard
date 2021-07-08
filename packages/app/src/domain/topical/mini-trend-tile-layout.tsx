import { Children, cloneElement, ReactElement } from 'react';
import { Box } from '~/components/base';
import theme from '~/style/theme';

type MiniTrendTileLayoutProps = {
  children: ReactElement<{ areas: { header: string; chart: string } }>[];
  id?: string;
};

export function MiniTrendTileLayout({
  children,
  id,
}: MiniTrendTileLayoutProps) {
  return (
    <Box
      id={id}
      display="grid"
      gridColumnGap={theme.space[5]}
      gridTemplateAreas={{
        _: gridTemplateAreasNarrow,
        md: gridTemplateAreasWide,
      }}
    >
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          areas: {
            header: `col${index + 1}-header`,
            chart: `col${index + 1}-chart`,
          },
        })
      )}
    </Box>
  );
}

const gridTemplateAreasNarrow = `
"col1-header"
"col1-chart"
"col2-header"
"col2-chart"
"col3-header"
"col3-chart"
`.trim();

const gridTemplateAreasWide = `
"col1-header col2-header col3-header"
"col1-chart  col2-chart  col3-chart"
`.trim();
