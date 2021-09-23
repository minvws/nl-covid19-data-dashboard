import { ReactNode, useState } from 'react';
import { Box } from '~/components/base';

type MiniTileSelectorLayoutProps = {
  menuItems: any[];
  children: ReactNode[];
};

export function MiniTileSelectorLayout(props: MiniTileSelectorLayoutProps) {
  const { menuItems, children } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box display="grid" gridTemplateColumns="33% 1fr" width="100%">
      <Box border="1px solid black">
        {menuItems.map((x, index) => (
          <p onClick={() => setSelectedIndex(index)}>{x}</p>
        ))}
      </Box>
      <Box border="1px solid black">{children[selectedIndex]}</Box>
    </Box>
  );
}
