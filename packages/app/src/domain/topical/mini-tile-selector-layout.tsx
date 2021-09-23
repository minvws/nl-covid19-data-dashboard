import { KeysOfType, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { SparkBars } from '~/components/spark-bars';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

type MiniTileSelectorItem<T extends TimestampedValue> = {
  label: string;
  data: T[];
  dataProperty: KeysOfType<T, number | null, true>;
  value: number;
  valueIsPercentage?: boolean;
};

type MiniTileSelectorLayoutProps<T extends TimestampedValue> = {
  menuItems: MiniTileSelectorItem<T>[];
  children: ReactNode[];
};

export function MiniTileSelectorLayout<T extends TimestampedValue>(
  props: MiniTileSelectorLayoutProps<T>
) {
  const { menuItems, children } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { formatNumber, formatPercentage } = useIntl();

  return (
    <Box
      display="grid"
      gridTemplateColumns="33% 1fr"
      width="100%"
      minHeight={'265px'}
    >
      <MenuList>
        {menuItems.map((x, index) => (
          <MenuListItem
            key={x.label}
            onClick={() => setSelectedIndex(index)}
            selected={selectedIndex === index}
          >
            <SparkBars data={x.data} averageProperty={x.dataProperty} />
            {x.label}
            {x.valueIsPercentage
              ? `${formatPercentage(x.value)}`
              : formatNumber(x.value)}
          </MenuListItem>
        ))}
      </MenuList>
      <Box pl={3}>{children[selectedIndex]}</Box>
    </Box>
  );
}

const MenuList = styled.ul(
  css({
    borderRight: '1px',
    borderRightStyle: 'solid',
    borderRightColor: 'border',
  })
);

const MenuListItem = styled.li<{ selected: boolean }>((x) =>
  css({
    backgroundColor: x.selected ? colors.lightBlue : colors.white,
    borderRightColor: x.selected ? colors.button : colors.white,
    borderRightWidth: x.selected ? '2px' : 0,
    borderRightStyle: x.selected ? 'solid' : 'none',
    lineHeight: '3em',
    listStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
  })
);
